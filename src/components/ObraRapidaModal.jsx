import { useState } from "react";
import { C, INP, LBL, BTN } from "../styles/colors";
import { saveDBObra, agregarAListaObras } from "../utils/storage";

// ─── ALTA RÁPIDA DE OBRA (2026-08-29) ─────────────────────────────
// Antes, "Obra" era texto libre suelto en Anidado/Presupuesto (sin ningún
// vínculo) y ni siquiera existía como campo en Cómputo. Esta es la única
// forma de crear una obra nueva — se guarda en la tabla `obras` compartida
// con Steel CRM (ver ENTIDADES-COMPARTIDAS.md), mismos campos que su alta
// ahí.
export default function ObraRapidaModal({ nombreInicial, empresaInicial, onCreated, onClose }) {
  const [f, setF] = useState({ nombre: nombreInicial || "", empresa: empresaInicial || "", direccion: "", fecha_inicio: new Date().toISOString().split("T")[0], estado: "activa" });
  const [guardando, setGuardando] = useState(false);
  const [err, setErr] = useState("");

  async function guardar() {
    if (!f.nombre.trim()) return alert("Ingresá el nombre de la obra");
    setGuardando(true);
    setErr("");
    try {
      const saved = await saveDBObra(f);
      agregarAListaObras(saved);
      onCreated({ id: saved.id, nombre: f.nombre.trim(), empresa: f.empresa.trim() });
      onClose();
    } catch (e) {
      setErr("No se pudo crear la obra: " + (e.message || e));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 3500, background: "#000a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: C.card, border: `1.5px solid ${C.ok}55`, borderRadius: 14, padding: 24, width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ color: C.ok, fontWeight: 800, fontSize: 15 }}>🏗️ Obra nueva</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ color: C.muted, fontSize: 12, marginBottom: 14 }}>No existe todavía en el sistema — completá los datos para crear su ficha.</div>
        <label style={LBL}>Nombre *</label>
        <input autoFocus style={{ ...INP, marginBottom: 10 }} value={f.nombre} onChange={e => setF(x => ({ ...x, nombre: e.target.value }))} />
        <label style={LBL}>Empresa</label>
        <input style={{ ...INP, marginBottom: 10 }} value={f.empresa} onChange={e => setF(x => ({ ...x, empresa: e.target.value }))} />
        <label style={LBL}>Dirección</label>
        <input style={{ ...INP, marginBottom: 10 }} value={f.direccion} onChange={e => setF(x => ({ ...x, direccion: e.target.value }))} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div><label style={LBL}>Fecha inicio</label><input type="date" style={{ ...INP, marginBottom: 10 }} value={f.fecha_inicio} onChange={e => setF(x => ({ ...x, fecha_inicio: e.target.value }))} /></div>
          <div>
            <label style={LBL}>Estado</label>
            <select style={{ ...INP, marginBottom: 10 }} value={f.estado} onChange={e => setF(x => ({ ...x, estado: e.target.value }))}>
              {["activa", "finalizada", "pausada", "cancelada"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        {err && <div style={{ color: C.err, fontSize: 11, marginBottom: 10, fontWeight: 600 }}>⚠ {err}</div>}
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button onClick={guardar} disabled={guardando} style={{ ...BTN("ok"), flex: 1, opacity: guardando ? 0.6 : 1 }}>
            {guardando ? "Creando…" : "Crear obra"}
          </button>
          <button onClick={onClose} style={{ ...BTN("ghost"), flex: 1 }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
