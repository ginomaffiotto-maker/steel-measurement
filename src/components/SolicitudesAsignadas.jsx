import { useState, useEffect } from "react";
import { C, TH, TD, CARD, BTN, BDG } from "../styles/colors";
import { supabase } from "../utils/supabaseClient";
import { useSortable } from "../utils/useSortable";

// Lee directo de la tabla `solicitudes` de steelCRM — mismo backend
// compartido, sin exportar/importar ningún archivo. Filtra por
// asignado_a = profileId del usuario logueado acá (misma cuenta de
// Supabase Auth en los dos sistemas). Solo alcanza a solicitudes de
// usuarios que ya tienen cuenta real — mismo bloqueo de siempre
// (meta_usuarios, vendedor_id) hasta que el resto del equipo la tenga.
const ESTADO_COLOR = { recibida: C.info, "en elaboración": C.warn, enviada: C.pur, ganada: C.ok, perdida: C.err };

export default function SolicitudesAsignadas({ usuario, irATab }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  // solicitud_id → id del cómputo vinculado (2026-09-05) — para avisar
  // antes de crear otro por error, sin bloquear (puede haber un caso real
  // para un segundo cómputo), y para poder abrir directo ese cómputo en
  // vez de sólo mostrar un badge. Si hay más de uno vinculado, guarda el
  // primero — "ver cómputo" ya está pensado como atajo, no como listado
  // completo.
  const [conComputo, setConComputo] = useState(new Map());

  useEffect(() => {
    if (!supabase || !usuario?.profileId) { setCargando(false); return; }
    setCargando(true);
    supabase.from("solicitudes").select("*")
      .eq("asignado_a", usuario.profileId)
      .eq("eliminado", false)
      .not("estado", "in", '("ganada","perdida","no cotizado")')
      .then(({ data, error: err }) => {
        if (err) { setError(err.message); setCargando(false); return; }
        setSolicitudes(data || []);
        setError("");
        setCargando(false);
        const ids = (data || []).map(s => s.id);
        if (ids.length) {
          supabase.from("computos").select("id, solicitud_id").in("solicitud_id", ids).eq("eliminado", false)
            .then(({ data: cs }) => {
              const m = new Map();
              (cs || []).forEach(c => { if (!m.has(c.solicitud_id)) m.set(c.solicitud_id, c.id); });
              setConComputo(m);
            });
        }
      });
  }, [usuario?.profileId]);

  // El número de "sin cómputo" del menú lateral se calcula aparte, en
  // App.js — antes se calculaba acá y se subía por prop, pero este
  // componente solo existe montado cuando la pestaña está activa, así que
  // el número quedaba en 0 hasta la primera visita (bug real reportado por
  // Gino, 2026-09-06).

  // Deja un payload chico para que Computo.jsx lo levante al montar y abra
  // el formulario de "nuevo" precargado — mismo criterio liviano que el
  // resto de la navegación cruzada de esta app (onNidar/onExportarPresupuesto
  // solo cambian de tab), sin lifetear estado nuevo a App.js.
  //
  // 2026-09-05, bug real reportado por Gino: `solicitudes` (Steel CRM)
  // nunca guardaba `producto` ni `empresa` en Supabase (columnas
  // agregadas recién ahora) — sin esos dos campos acá, no había nombre
  // real para el cómputo ni forma de traer la Obra sin pisarla, así que
  // se usaba la Obra como nombre y la Obra real quedaba vacía. Ahora:
  // Producto → nombre (el campo sigue editable a mano después — una
  // misma Solicitud puede pedir cosas de tipo distinto y Gino puede
  // querer un cómputo/presupuesto separado para cada una).
  function crearComputoDesde(s) {
    try {
      sessionStorage.setItem("smeas_prefill_computo", JSON.stringify({
        nombre: s.producto || s.obra || s.cliente_nombre || "Solicitud",
        cliente: s.cliente_nombre || "",
        empresa: s.empresa || "",
        obra: s.obra || "",
        categoria: s.categoria || "",
        solicitudId: s.id,
      }));
    } catch {}
    irATab("Computo");
  }

  // Abre directo el cómputo ya vinculado (evita crear un segundo cómputo
  // por error) — mismo criterio liviano de sessionStorage, consumido una
  // sola vez al montar Computo.jsx.
  function abrirComputoDesde(computoId) {
    try { sessionStorage.setItem("smeas_abrir_computo_id", computoId); } catch {}
    irATab("Computo");
  }

  // 2026-09-03, a pedido de Gino: mismo patrón de ordenamiento por columna
  // (clic en header, asc/desc) que ya tienen Cómputo/Anidado/Presupuesto/Historial.
  const { ordenados: lista, campo: sortCampo, dir: sortDir, ordenarPor } = useSortable(solicitudes, "fecha_limite", "asc");

  if (!usuario?.profileId) {
    return (
      <div style={CARD()}>
        <div style={{ color: C.muted, fontSize: 13 }}>
          Esta cuenta todavía no tiene un perfil real vinculado — las solicitudes asignadas necesitan eso para poder mostrarse acá.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 20, color: C.text, marginBottom: 4 }}>📥 Mis solicitudes asignadas</div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>
        Cargadas y asignadas desde Steel CRM — mismo backend, sin pasos manuales.
      </div>

      {cargando && <div style={{ color: C.muted, fontSize: 13 }}>Cargando…</div>}
      {error && <div style={{ color: C.err, fontSize: 13 }}>Error al leer solicitudes: {error}</div>}

      {!cargando && !error && solicitudes.length === 0 && (
        <div style={CARD()}>
          <div style={{ color: C.muted, fontSize: 13 }}>No tenés solicitudes asignadas en este momento.</div>
        </div>
      )}

      {!cargando && solicitudes.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[
                  { h: "Cliente", campo: "cliente_nombre" }, { h: "Obra", campo: "obra" },
                  { h: "Categoría", campo: "categoria" }, { h: "Estado", campo: "estado" },
                  { h: "Fecha límite", campo: "fecha_limite" }, { h: "", campo: null },
                ].map(({ h, campo }) => (
                  <th key={h} title={campo ? "Ordenar por " + h : ""} style={{ ...TH, cursor: campo ? "pointer" : "default", userSelect: "none" }}
                    onClick={() => campo && ordenarPor(campo)}>
                    {h}{sortCampo === campo && campo ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lista.map(s => (
                <tr key={s.id}>
                  <td style={TD}>{s.cliente_nombre || "—"}</td>
                  <td style={TD}>{s.obra || "—"}</td>
                  <td style={TD}>{s.categoria || "—"}</td>
                  <td style={TD}><span style={{ ...BDG(ESTADO_COLOR[s.estado] || C.muted, true) }}>{s.estado}</span></td>
                  <td style={TD}>{s.fecha_limite || "—"}</td>
                  <td style={TD}>
                    {conComputo.has(s.id) && (
                      <button onClick={() => abrirComputoDesde(conComputo.get(s.id))} style={{ ...BDG(C.ok, true), marginRight: 8, fontSize: 11, cursor: "pointer", border: "none" }} title="Abrir el cómputo ya vinculado">✅ Ver cómputo</button>
                    )}
                    <button onClick={() => crearComputoDesde(s)} style={BTN("primary")}>📐 {conComputo.has(s.id) ? "Crear otro cómputo" : "Crear cómputo"}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
