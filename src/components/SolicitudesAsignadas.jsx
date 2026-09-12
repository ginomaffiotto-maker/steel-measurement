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
// Solo la prioridad fijada a mano (2026-09-05, Steel CRM) — el score
// automático depende de historial de cliente/presupuestos, datos que este
// componente no trae (lee únicamente `solicitudes`) y que mostrar a medias
// podría divergir del valor real que ve el vendedor en Steel CRM.
const PRIORIDAD_ICONO = { alta: "🔴", media: "🟡", baja: "🟢" };

export default function SolicitudesAsignadas({ usuario, irATab }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  // solicitud_id → cantidad de cómputos vinculados (2026-09-05, extendido
  // 2026-09-12) — para avisar antes de crear otro por error, sin bloquear
  // (puede haber un caso real para un segundo cómputo). Guarda la
  // CANTIDAD, no un id puntual: "ver cómputo(s)" navega a la lista de
  // Cómputo filtrada por esta solicitud, nunca abre uno directo, porque
  // puede haber varios vinculados a la misma (reportado por Gino,
  // 2026-09-12 — antes se guardaba solo el primero y los demás quedaban
  // invisibles desde acá).
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
              (cs || []).forEach(c => m.set(c.solicitud_id, (m.get(c.solicitud_id) || 0) + 1));
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
        // Fase 3 (2026-09-06, enlace a carpeta de archivos): mismo criterio
        // que categoria/obra — se copia una sola vez al crear, no es un
        // vínculo en vivo con la Solicitud.
        linkArchivos: s.link_archivos || "",
      }));
    } catch {}
    irATab("Computo");
  }

  // Lleva a la pantalla de Cómputo filtrada por esta solicitud (evita
  // crear un cómputo de más por error) — nunca abre uno puntual, porque
  // puede haber varios vinculados a la misma solicitud (bug real
  // reportado por Gino, 2026-09-12: antes se guardaba y abría solo el
  // primero encontrado, los demás quedaban invisibles desde acá). Mismo
  // criterio liviano de sessionStorage que el resto de esta pantalla,
  // consumido una sola vez al montar Computo.jsx.
  function verComputosDeSolicitud(s) {
    try {
      sessionStorage.setItem("smeas_filtrar_computos_solicitud", JSON.stringify({
        id: s.id,
        label: s.obra || s.cliente_nombre || s.producto || "esta solicitud",
      }));
    } catch {}
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
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
              <tr>
                {[
                  { h: "Prioridad", campo: "prioridad_manual", w: 100 }, { h: "Cliente", campo: "cliente_nombre", w: 160 }, { h: "Obra", campo: "obra", w: 180 },
                  { h: "Tipo", campo: "tipo_trabajo", w: 100 }, { h: "Categoría", campo: "categoria", w: 140 },
                  { h: "Recepción", campo: "fecha_recepcion", w: 100 }, { h: "Estado", campo: "estado", w: 110 },
                  { h: "Fecha límite", campo: "fecha_limite", w: 100 }, { h: "", campo: null, w: 260 },
                ].map(({ h, campo, w }) => (
                  <th key={h} title={campo ? "Ordenar por " + h : ""} style={{ ...TH, width: w, cursor: campo ? "pointer" : "default", userSelect: "none" }}
                    onClick={() => campo && ordenarPor(campo)}>
                    {h}{sortCampo === campo && campo ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lista.map(s => (
                <tr key={s.id}>
                  <td style={TD}>{PRIORIDAD_ICONO[s.prioridad_manual] ? `${PRIORIDAD_ICONO[s.prioridad_manual]} ${s.prioridad_manual[0].toUpperCase()}${s.prioridad_manual.slice(1)}` : "—"}</td>
                  <td style={TD}>{s.cliente_nombre || "—"}</td>
                  <td style={TD}>{s.obra || "—"}</td>
                  <td style={TD}>{s.tipo_trabajo || "—"}</td>
                  <td style={TD}>{s.categoria || "—"}</td>
                  <td style={TD}>{s.fecha_recepcion || "—"}</td>
                  <td style={TD}><span style={{ ...BDG(ESTADO_COLOR[s.estado] || C.muted, true) }}>{s.estado}</span></td>
                  <td style={TD}>{s.fecha_limite || "—"}</td>
                  <td style={{ ...TD, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, flexWrap: "nowrap" }}>
                    {conComputo.has(s.id) && (
                      <button onClick={() => verComputosDeSolicitud(s)} style={{ ...BDG(C.ok, true), fontSize: 11, cursor: "pointer", border: "none", whiteSpace: "nowrap" }} title="Ver el/los cómputo(s) ya vinculados a esta solicitud">
                        ✅ Ver cómputo{conComputo.get(s.id) > 1 ? `s (${conComputo.get(s.id)})` : ""}
                      </button>
                    )}
                    <button onClick={() => crearComputoDesde(s)} style={{ ...BTN("primary"), whiteSpace: "nowrap" }}>📐 {conComputo.has(s.id) ? "Crear otro cómputo" : "Crear cómputo"}</button>
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
