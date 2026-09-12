import { C, BTN, BDG } from "../styles/colors";

// Colores/íconos de Solicitud, compartidos entre SolicitudesAsignadas.jsx y
// Buscador.jsx (2026-09-12) — antes vivían duplicados solo en el primero.
export const ESTADO_SOLICITUD_COLOR = { recibida: C.info, "en elaboración": C.warn, enviada: C.pur, ganada: C.ok, perdida: C.err };
export const PRIORIDAD_ICONO = { alta: "🔴", media: "🟡", baja: "🟢" };

// Ficha de solo lectura (2026-09-12, a pedido de Gino: "ver los datos de
// la solicitud, las notas cargadas, el enlace a los archivos"). Recibe la
// fila cruda de Supabase (`select("*")` sobre `solicitudes`) tal cual —
// nunca pide nada más al backend. Solo lectura porque el dueño real de
// este dato es Steel CRM — editar acá duplicaría lógica de validación que
// ya vive allá.
//
// `children` opcional: usado por el Buscador Global para insertar la
// cadena de trazabilidad (Cómputos/Anidados/Presupuestos relacionados)
// debajo de los datos propios de la solicitud, sin que este componente
// necesite saber nada de esas otras entidades.
export default function FichaSolicitudModal({ s, onClose, children }) {
  const campo = (label, valor) => valor ? (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.3 }}>{label}</div>
      <div style={{ fontSize: 13.5, color: C.text }}>{valor}</div>
    </div>
  ) : null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3500, background: "#000a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={onClose}>
      <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 24, width: "100%", maxWidth: 560, maxHeight: "85vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ color: C.accent, fontWeight: 800, fontSize: 16 }}>📥 {s.producto || s.obra || "Solicitud"}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.cliente_nombre || "Sin cliente"}{s.empresa ? ` — ${s.empresa}` : ""}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={BDG(ESTADO_SOLICITUD_COLOR[s.estado] || C.muted, true)}>{s.estado}</span>
          {s.prioridad_manual && <span style={BDG(C.muted, true)}>{PRIORIDAD_ICONO[s.prioridad_manual]} Prioridad {s.prioridad_manual}</span>}
          {s.categoria && <span style={BDG(C.muted, true)}>{s.categoria}</span>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          {campo("Obra", s.obra)}
          {campo("Dirección de obra", s.direccion_obra)}
          {campo("Contacto", s.contacto)}
          {campo("Teléfono", s.tel)}
          {campo("Email", s.email)}
          {campo("Tipo de trabajo", s.tipo_trabajo)}
          {campo("Estado de obra", s.estado_obra)}
          {campo("Fecha de recepción", s.fecha_recepcion)}
          {campo("Fecha límite", s.fecha_limite)}
          {campo("Fecha de envío", s.fecha_envio)}
          {campo("Fecha de resolución", s.fecha_resolucion)}
        </div>

        {s.mensaje_cliente && (
          <div style={{ marginTop: 6, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 4 }}>Mensaje del cliente</div>
            <div style={{ fontSize: 13, color: C.text, background: C.iron, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", whiteSpace: "pre-wrap" }}>{s.mensaje_cliente}</div>
          </div>
        )}

        {s.notas && (
          <div style={{ marginTop: 6, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 4 }}>Notas</div>
            <div style={{ fontSize: 13, color: C.text, whiteSpace: "pre-wrap" }}>{s.notas}</div>
          </div>
        )}

        {s.link_archivos && (
          <a href={s.link_archivos} target="_blank" rel="noreferrer"
            style={{ ...BTN("ghost"), display: "inline-block", marginTop: 10, textDecoration: "none" }}>📎 Abrir carpeta de archivos</a>
        )}

        {children}
      </div>
    </div>
  );
}
