import { useState } from "react";
import { C, INP, BTN } from "../styles/colors";
import { uid } from "../utils/storage";
import { puedeEliminar, ModalConfirmarBorrado } from "./ConfirmarEliminar";

// Comentarios internos con guardado directo (2026-08-24) — a diferencia del
// patrón de dos pasos que tiene steelCRM (comentar solo agrega en memoria,
// se persiste recién al Guardar general), acá "Comentar" persiste de una.
// Borrado (2026-08-24): mismo criterio que steelCRM — autor propio, o
// admin/supervisor sobre cualquier comentario.
export default function ComentariosPanel({ comentarios, usuario, onAgregar, onEliminar }) {
  const [texto, setTexto] = useState("");
  const [aBorrar, setABorrar] = useState(null);

  const enviar = () => {
    const t = texto.trim();
    if (!t) return;
    const ahora = new Date();
    const nuevo = {
      id: uid(),
      autor: usuario?.nombre || "?",
      texto: t,
      fecha: ahora.toISOString().slice(0, 10),
      hora: ahora.toTimeString().slice(0, 5),
    };
    onAgregar(nuevo);
    setTexto("");
  };

  const puedeBorrar = (c) => c.autor === usuario?.nombre || puedeEliminar(usuario);

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginTop: 14 }}>
      <div style={{ fontWeight: 700, color: C.accent, fontSize: 12, marginBottom: 10 }}>💬 Comentarios internos</div>
      {(comentarios || []).length === 0 && (
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>Sin comentarios todavía.</div>
      )}
      {(comentarios || []).map((c) => (
        <div key={c.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}44`, display: "flex", gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>
              <b style={{ color: C.text }}>{c.autor || "?"}</b> — {c.fecha} {c.hora}
            </div>
            <div style={{ fontSize: 13, color: C.text, whiteSpace: "pre-wrap" }}>{c.texto}</div>
          </div>
          {onEliminar && puedeBorrar(c) && (
            <span onClick={() => setABorrar(c)} title="Eliminar comentario"
              style={{ cursor: "pointer", fontSize: 12, color: C.muted, opacity: .7, flexShrink: 0 }}>
              🗑️
            </span>
          )}
        </div>
      ))}
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) enviar(); }}
        placeholder="Escribí un comentario…"
        rows={2}
        style={{ ...INP, width: "100%", resize: "vertical", marginTop: 4, boxSizing: "border-box" }}
      />
      <button onClick={enviar} style={{ ...BTN("ghost"), marginTop: 6, fontSize: 11 }}>💬 Comentar</button>
      {aBorrar && (
        <ModalConfirmarBorrado
          titulo="comentario"
          subtitulo={`"${aBorrar.texto}"`}
          checkboxLabel="Sí, quiero eliminar este comentario"
          onConfirm={() => { onEliminar(aBorrar); setABorrar(null); }}
          onClose={() => setABorrar(null)}
        />
      )}
    </div>
  );
}
