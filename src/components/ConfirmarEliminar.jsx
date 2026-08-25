import { useState } from "react";
import { C, INP, LBL, BTN } from "../styles/colors";
import { supabase } from "../utils/supabaseClient";
import { verificarPassword } from "../utils/verificarPassword";

// ─── PERMISOS ────────────────────────────────────────────────────
// Quién puede eliminar cómputos / anidados / presupuestos / trabajos de historial.
// Vendedor (operario) puede crear y editar, pero no eliminar.
export function puedeEliminar(usuario) {
  return usuario?.rol === "admin" || usuario?.rol === "supervisor";
}

// ─── MODAL DE CONFIRMACIÓN CON CONTRASEÑA REAL ───────────────────
// Pide email + contraseña de un Administrador real (verificado contra
// Supabase Auth, no un campo local) para autorizar el borrado — funciona
// como una autorización de supervisor. Reemplaza el mecanismo viejo
// (comparaba contra `usuario.clave` en localStorage, que queda vacío para
// cualquier cuenta creada vía Auth real — nunca funcionaba en la práctica,
// encontrado el 2026-08-24 al armar esta versión). Mismo patrón que
// ConfirmModalPassword de steelCRM, adaptado a los componentes de acá.
export function ModalConfirmarEliminar({ titulo, subtitulo, labelBoton, verbo, onConfirm, onClose }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err,  setErr]  = useState("");
  const [cargando, setCargando] = useState(false);

  const confirmar = async (e) => {
    e.preventDefault();
    if (cargando || !email.trim() || !pass) return;
    setCargando(true); setErr("");
    const r = await verificarPassword(email.trim(), pass);
    if (!r.ok) { setCargando(false); setErr(r.error); setPass(""); return; }
    const { data: profile, error: pErr } = await supabase.from("profiles").select("rol").eq("id", r.userId).single();
    setCargando(false);
    if (pErr || profile?.rol !== "admin") { setErr("Esa cuenta no es Administrador."); setPass(""); return; }
    onConfirm();
  };

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:"fixed", inset:0, zIndex:2000, background:"#000a", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <form onSubmit={confirmar} style={{ background:C.card, border:`1.5px solid ${C.err}55`, borderRadius:14, padding:26, width:"100%", maxWidth:380 }}>
        <div style={{ color:C.err, fontWeight:800, fontSize:15, marginBottom:6 }}>⚠ {verbo || "Eliminar"} {titulo}</div>
        <div style={{ color:C.muted, fontSize:12, marginBottom:18 }}>
          {subtitulo || "Esta acción no se puede deshacer."} Requiere aprobación de un Administrador.
        </div>
        <label style={LBL}>Email del Administrador</label>
        <input type="email" autoFocus value={email}
          onChange={e => { setEmail(e.target.value); setErr(""); }}
          required
          style={{ ...INP, marginBottom:10 }} />
        <label style={LBL}>Contraseña</label>
        <input type="password" value={pass}
          onChange={e => { setPass(e.target.value); setErr(""); }}
          placeholder="••••••" required autoComplete="current-password"
          style={{ ...INP, marginBottom: err ? 6 : 16, border: `1.5px solid ${err ? C.err : C.border}` }} />
        {err && <div style={{ color:C.err, fontSize:11, marginBottom:14, fontWeight:600 }}>⚠ {err}</div>}
        <div style={{ display:"flex", gap:8 }}>
          <button type="submit" disabled={cargando}
            style={{ ...BTN("danger"), flex:1, opacity: cargando ? 0.6 : 1, background:C.err+"22", borderColor:C.err+"66" }}>
            {cargando ? "Verificando…" : (labelBoton || "🗑 Eliminar definitivamente")}
          </button>
          <button type="button" onClick={onClose} style={{ ...BTN("ghost"), flex:1 }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

// ─── MODAL DE CONFIRMACIÓN LIVIANO (con casilla) ─────────────────
// Para borrados frecuentes de bajo riesgo dentro de una edición en curso
// (una pieza, un grupo, un material) — no pide contraseña de Admin (sería
// demasiada fricción para algo que se hace todo el tiempo), pero exige
// tildar una casilla antes de habilitar el botón, para frenar el click
// accidental en el ✕.
export function ModalConfirmarBorrado({ titulo, subtitulo, verbo, checkboxLabel, labelBoton, color, onConfirm, onClose }) {
  const [ok, setOk] = useState(false);
  const col = color || C.err;

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:"fixed", inset:0, zIndex:2000, background:"#000a", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:C.card, border:`1.5px solid ${col}55`, borderRadius:14, padding:24, width:"100%", maxWidth:420 }}>
        <div style={{ color:col, fontWeight:800, fontSize:14, marginBottom:6 }}>⚠ {verbo || "Eliminar"} {titulo}</div>
        <div style={{ color:C.muted, fontSize:12, marginBottom:16, whiteSpace:"pre-line", maxHeight:220, overflowY:"auto" }}>
          {subtitulo || "Esta acción no se puede deshacer."}
        </div>
        <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", marginBottom:16, fontSize:12, color:C.text }}>
          <input type="checkbox" checked={ok} onChange={e=>setOk(e.target.checked)} style={{ width:16, height:16, accentColor:col, cursor:"pointer" }} />
          {checkboxLabel || "Sí, quiero eliminar esto"}
        </label>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>ok&&onConfirm()} disabled={!ok}
            style={{ ...BTN("danger"), flex:1, opacity: ok ? 1 : 0.5, background:col+"22", borderColor:col+"66", color:col }}>
            {labelBoton || "🗑 Eliminar"}
          </button>
          <button onClick={onClose} style={{ ...BTN("ghost"), flex:1 }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
