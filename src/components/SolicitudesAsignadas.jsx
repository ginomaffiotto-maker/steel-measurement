import { useState, useEffect } from "react";
import { C, TH, TD, CARD, BTN, BDG } from "../styles/colors";
import { supabase } from "../utils/supabaseClient";

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

  useEffect(() => {
    if (!supabase || !usuario?.profileId) { setCargando(false); return; }
    setCargando(true);
    supabase.from("solicitudes").select("*")
      .eq("asignado_a", usuario.profileId)
      .eq("eliminado", false)
      .not("estado", "in", '("ganada","perdida")')
      .then(({ data, error: err }) => {
        if (err) { setError(err.message); setCargando(false); return; }
        setSolicitudes(data || []);
        setError("");
        setCargando(false);
      });
  }, [usuario?.profileId]);

  // Deja un payload chico para que Computo.jsx lo levante al montar y abra
  // el formulario de "nuevo" precargado — mismo criterio liviano que el
  // resto de la navegación cruzada de esta app (onNidar/onExportarPresupuesto
  // solo cambian de tab), sin lifetear estado nuevo a App.js.
  function crearComputoDesde(s) {
    try {
      sessionStorage.setItem("smeas_prefill_computo", JSON.stringify({
        nombre: s.obra || s.cliente_nombre || "Solicitud",
        cliente: s.cliente_nombre || "",
        categoria: s.categoria || "",
      }));
    } catch {}
    irATab("Computo");
  }

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
        Cargadas y asignadas desde steelCRM — mismo backend, sin pasos manuales.
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
                <th style={TH}>Cliente</th>
                <th style={TH}>Obra</th>
                <th style={TH}>Categoría</th>
                <th style={TH}>Estado</th>
                <th style={TH}>Fecha límite</th>
                <th style={TH}></th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map(s => (
                <tr key={s.id}>
                  <td style={TD}>{s.cliente_nombre || "—"}</td>
                  <td style={TD}>{s.obra || "—"}</td>
                  <td style={TD}>{s.categoria || "—"}</td>
                  <td style={TD}><span style={{ ...BDG(ESTADO_COLOR[s.estado] || C.muted, true) }}>{s.estado}</span></td>
                  <td style={TD}>{s.fecha_limite || "—"}</td>
                  <td style={TD}>
                    <button onClick={() => crearComputoDesde(s)} style={BTN("primary")}>📐 Crear cómputo</button>
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
