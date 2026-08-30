import { useState } from "react";
import { C, INP, LBL, BTN } from "../styles/colors";
import { saveDBCliente, registrarCliente } from "../utils/storage";

// ─── ALTA RÁPIDA DE CLIENTE (2026-08-29) ──────────────────────────
// Antes, tipear un nombre nuevo en AutocompleteCliente lo creaba solo y en
// silencio en la tabla `clientes` compartida con Steel CRM (resolverClienteId,
// vía registrarCliente) — con solo nombre+empresa, perdiendo para siempre
// cargo/celular/email/zona porque ningún formulario los pedía. Este modal
// reemplaza esa creación silenciosa: pide los mismos datos que el alta de
// Cliente en Steel CRM y crea la ficha real antes de dejar continuar.
export default function ClienteRapidoModal({ nombreInicial, empresaInicial, onCreated, onClose }) {
  const [f, setF] = useState({ nombre: nombreInicial || "", empresa: empresaInicial || "", cargo: "", celular: "", email: "", zona: "" });
  const [guardando, setGuardando] = useState(false);
  const [err, setErr] = useState("");

  async function guardar() {
    if (!f.nombre.trim()) return alert("Ingresá el nombre");
    setGuardando(true);
    setErr("");
    try {
      const saved = await saveDBCliente(f);
      registrarCliente(f.nombre); // mantiene al día la lista local de autocompletar
      onCreated({ nombre: f.nombre.trim(), empresa: f.empresa.trim(), dbId: saved?.id });
      onClose();
    } catch (e) {
      setErr("No se pudo crear el cliente: " + (e.message || e));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 3500, background: "#000a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: C.card, border: `1.5px solid ${C.ok}55`, borderRadius: 14, padding: 24, width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ color: C.ok, fontWeight: 800, fontSize: 15 }}>👤 Cliente nuevo</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ color: C.muted, fontSize: 12, marginBottom: 14 }}>No existe todavía en el sistema — completá los datos para crear su ficha.</div>
        <label style={LBL}>Nombre *</label>
        <input autoFocus style={{ ...INP, marginBottom: 10 }} value={f.nombre} onChange={e => setF(x => ({ ...x, nombre: e.target.value }))} />
        <label style={LBL}>Empresa</label>
        <input style={{ ...INP, marginBottom: 10 }} value={f.empresa} onChange={e => setF(x => ({ ...x, empresa: e.target.value }))} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div><label style={LBL}>Cargo</label><input style={{ ...INP, marginBottom: 10 }} value={f.cargo} onChange={e => setF(x => ({ ...x, cargo: e.target.value }))} /></div>
          <div><label style={LBL}>Zona</label><input style={{ ...INP, marginBottom: 10 }} value={f.zona} onChange={e => setF(x => ({ ...x, zona: e.target.value }))} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div><label style={LBL}>Celular</label><input style={{ ...INP, marginBottom: 10 }} value={f.celular} onChange={e => setF(x => ({ ...x, celular: e.target.value }))} /></div>
          <div><label style={LBL}>Email</label><input style={{ ...INP, marginBottom: 10 }} value={f.email} onChange={e => setF(x => ({ ...x, email: e.target.value }))} /></div>
        </div>
        {err && <div style={{ color: C.err, fontSize: 11, marginBottom: 10, fontWeight: 600 }}>⚠ {err}</div>}
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button onClick={guardar} disabled={guardando} style={{ ...BTN("ok"), flex: 1, opacity: guardando ? 0.6 : 1 }}>
            {guardando ? "Creando…" : "Crear cliente"}
          </button>
          <button onClick={onClose} style={{ ...BTN("ghost"), flex: 1 }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
