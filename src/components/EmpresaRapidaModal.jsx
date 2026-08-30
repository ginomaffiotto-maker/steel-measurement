import { useState } from "react";
import { C, INP, LBL, BTN } from "../styles/colors";
import { saveDBEmpresa } from "../utils/storage";

// ─── ALTA RÁPIDA DE EMPRESA (2026-08-29, "igual que cliente y obra") ──
// Antes "Empresa" era texto libre sin ninguna tabla propia (solo un
// AutocompleteEmpresa sugiriendo valores ya usados en Clientes). Esta es
// la única forma de crear una empresa nueva — tabla `empresas`
// compartida con Steel CRM (ver ENTIDADES-COMPARTIDAS.md).
export default function EmpresaRapidaModal({ nombreInicial, onCreated, onClose }) {
  const [f, setF] = useState({ nombre: nombreInicial || "", rut: "", direccion: "", telefono: "", email: "", notas: "" });
  const [guardando, setGuardando] = useState(false);
  const [err, setErr] = useState("");

  async function guardar() {
    if (!f.nombre.trim()) return alert("Ingresá el nombre de la empresa");
    setGuardando(true);
    setErr("");
    try {
      const saved = await saveDBEmpresa(f);
      onCreated({ id: saved.id, nombre: f.nombre.trim() });
      onClose();
    } catch (e) {
      setErr("No se pudo crear la empresa: " + (e.message || e));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 3500, background: "#000a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: C.card, border: `1.5px solid ${C.ok}55`, borderRadius: 14, padding: 24, width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ color: C.ok, fontWeight: 800, fontSize: 15 }}>🏢 Empresa nueva</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ color: C.muted, fontSize: 12, marginBottom: 14 }}>No existe todavía en el sistema — completá los datos para crear su ficha.</div>
        <label style={LBL}>Nombre *</label>
        <input autoFocus style={{ ...INP, marginBottom: 10 }} value={f.nombre} onChange={e => setF(x => ({ ...x, nombre: e.target.value }))} />
        <label style={LBL}>RUT</label>
        <input style={{ ...INP, marginBottom: 10 }} value={f.rut} onChange={e => setF(x => ({ ...x, rut: e.target.value }))} />
        <label style={LBL}>Dirección</label>
        <input style={{ ...INP, marginBottom: 10 }} value={f.direccion} onChange={e => setF(x => ({ ...x, direccion: e.target.value }))} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div><label style={LBL}>Teléfono</label><input style={{ ...INP, marginBottom: 10 }} value={f.telefono} onChange={e => setF(x => ({ ...x, telefono: e.target.value }))} /></div>
          <div><label style={LBL}>Email</label><input style={{ ...INP, marginBottom: 10 }} value={f.email} onChange={e => setF(x => ({ ...x, email: e.target.value }))} /></div>
        </div>
        <label style={LBL}>Notas</label>
        <input style={{ ...INP, marginBottom: 10 }} value={f.notas} onChange={e => setF(x => ({ ...x, notas: e.target.value }))} />
        {err && <div style={{ color: C.err, fontSize: 11, marginBottom: 10, fontWeight: 600 }}>⚠ {err}</div>}
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button onClick={guardar} disabled={guardando} style={{ ...BTN("ok"), flex: 1, opacity: guardando ? 0.6 : 1 }}>
            {guardando ? "Creando…" : "Crear empresa"}
          </button>
          <button onClick={onClose} style={{ ...BTN("ghost"), flex: 1 }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
