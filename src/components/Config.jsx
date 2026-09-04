import { useState, useRef, useCallback, useEffect } from "react";
import { C, INP, LBL, BTN, TEMA_ACTUAL, TEMAS_DISPONIBLES, cambiarTema } from "../styles/colors";
import { loadLS, saveLS, loadNumeracion, saveNumeracion, exportBackup, parseBackup, restoreBackup, migrarTodoALaNube, saveDBComputo, saveDBAnidado, saveDBPresupuestoSM, saveDBItem, saveDBTrabajoHistorico, resolverClienteId, deleteDBFila, deleteFilaPorMatchDB, esUUID, getMoneda, setMoneda, loadTenantSettingDB, saveTenantSettingDB } from "../utils/storage";
import { supabase } from "../utils/supabaseClient";
import { ModalConfirmarEliminar, puedeEliminar } from "./ConfirmarEliminar";
import { seedTestData } from "../utils/seedTestData";
import { authorize, backupToDrive, restoreFromDrive, formatBackupDate } from "../utils/googleDrive";

// ─── GESTIÓN DE USUARIOS ─────────────────────────────────────────────────
// Mismo mecanismo que steelCRM (mismo backend Supabase compartido): no hay
// alta local (creaba cuentas fantasma que nunca podían loguearse de
// verdad, y el rol local "operario" no coincidía con el vocabulario real
// admin/supervisor/vendedor de profiles.rol) — se invita por email y la
// persona elige su propia contraseña. Cambiar el rol de alguien con cuenta
// real (profileId) sincroniza profiles.rol en Supabase, permitido solo a
// admin por la política profiles_update_admin.
const ROL_LABEL = { admin: "Administrador", supervisor: "Supervisor", vendedor: "Vendedor" };

function MiCuenta({ usuario }) {
  const [p1, setP1] = useState(""); const [p2, setP2] = useState("");
  const [err, setErr] = useState(""); const [msg, setMsg] = useState("");
  const [cargando, setCargando] = useState(false);
  const guardar = async () => {
    if (p1.length < 6) { setErr("La contraseña tiene que tener al menos 6 caracteres"); return; }
    if (p1 !== p2) { setErr("Las contraseñas no coinciden"); return; }
    if (!supabase) { setErr("Backend no configurado"); return; }
    setCargando(true); setErr(""); setMsg("");
    const { error } = await supabase.auth.updateUser({ password: p1 });
    setCargando(false);
    if (error) { setErr("No se pudo guardar: " + error.message); return; }
    setMsg("✅ Contraseña actualizada."); setP1(""); setP2("");
  };
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, marginBottom:16 }}>
      <div style={{ fontWeight:700, color:C.accent, fontSize:13, marginBottom:4 }}>🔑 Mi cuenta</div>
      <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>{usuario?.email}</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:12 }}>
        <div><label style={LBL}>Nueva contraseña</label><input type="password" style={INP} value={p1} onChange={e=>{setP1(e.target.value); setErr("");}} autoComplete="new-password" placeholder="Al menos 6 caracteres" /></div>
        <div><label style={LBL}>Repetir contraseña</label><input type="password" style={INP} value={p2} onChange={e=>{setP2(e.target.value); setErr("");}} autoComplete="new-password" /></div>
      </div>
      {err && <div style={{ color:C.err, fontSize:12, marginTop:8, fontWeight:700 }}>⚠ {err}</div>}
      {msg && <div style={{ color:C.accent, fontSize:12, marginTop:8, fontWeight:700 }}>{msg}</div>}
      <button onClick={guardar} style={{ ...BTN("ghost"), marginTop:10, fontSize:12, padding:"6px 14px" }}>{cargando ? "Guardando…" : "Cambiar contraseña"}</button>
    </div>
  );
}

function EquipoUsuarios({ usuarios, setUsuarios, usuario, esAdmin }) {
  const [confirmarDelId, setConfirmarDelId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [rolEdit, setRolEdit] = useState("vendedor");
  const [nombreEdit, setNombreEdit] = useState("");
  const [accesoCrmEdit, setAccesoCrmEdit] = useState(true);
  const [accesoCostosEdit, setAccesoCostosEdit] = useState(true);
  const objDel = usuarios.find(u => u.id === confirmarDelId);
  const admins = usuarios.filter(u => u.rol === "admin");

  const abrirEdit = (u) => {
    setEditId(u.id); setRolEdit(u.rol); setNombreEdit(u.nombre);
    setAccesoCrmEdit(u.accesoCrm !== false); setAccesoCostosEdit(u.accesoCostos !== false);
  };
  const guardarEdit = () => {
    const original = usuarios.find(u => u.id === editId);
    setUsuarios(prev => prev.map(u => u.id === editId ? { ...u, nombre: nombreEdit, rol: rolEdit, accesoCrm: accesoCrmEdit, accesoCostos: accesoCostosEdit } : u));
    if (original?.profileId && supabase) {
      supabase.from("profiles").update({ rol: rolEdit, nombre: nombreEdit, acceso_crm: accesoCrmEdit, acceso_costos: accesoCostosEdit }).eq("id", original.profileId)
        .then(({ error }) => { if (error) console.warn("update profile rol", error); });
    }
    setEditId(null);
  };
  // Revoca la cuenta real vía api/eliminar-usuario.js (2026-09-03, mismo
  // patrón que la invitación) antes de sacarla de la lista local — si la
  // revocación falla, devuelve el error (el modal lo muestra y se queda
  // abierto) en vez de mostrar como "borrado" algo que no se borró de
  // verdad. Reemplaza el flujo viejo de "generar comando para la
  // terminal" (scripts/eliminar-usuario.mjs). Si nunca tuvo cuenta real
  // (sin profileId), alcanza con sacarla de la lista, no hay nada que
  // revocar en Supabase Auth.
  const del = async (id) => {
    const u = usuarios.find(x => x.id === id);
    if (!u?.profileId) {
      setUsuarios(prev => prev.filter(x => x.id !== id));
      setConfirmarDelId(null);
      return;
    }
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess?.session?.access_token;
      if (!token) return "Tu sesión no tiene token real — volvé a iniciar sesión.";
      const r = await fetch("https://steelcostos.vercel.app/api/eliminar-usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ userId: u.profileId }),
      });
      const d = await r.json();
      if (!r.ok) return d.error || "No se pudo eliminar.";
      setUsuarios(prev => prev.filter(x => x.id !== id));
      setConfirmarDelId(null);
    } catch (e) {
      return "No se pudo eliminar: " + e.message;
    }
  };

  return (
    <div>
      {usuarios.length === 0 && <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>Sin usuarios todavía.</div>}
      {usuarios.map(u => {
        const esUltimoAdmin = u.rol === "admin" && admins.length <= 1;
        return (
          <div key={u.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:`1px solid ${C.border}33` }}>
            <div style={{ width:32, height:32, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", background: u.foto ? "transparent" : C.accent+"22", border:"1px solid "+C.border }}>
              {u.foto ? <img src={u.foto} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <span style={{ fontSize:16 }}>{u.emoji || "👤"}</span>}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700 }}>{u.nombre || "(sin nombre)"} {usuario?.id === u.id && <span style={{ fontSize:10, color:C.accent }}>· vos</span>}
                {u.pendienteInvitacion && <span style={{ fontSize:10, color:C.warn, background:C.warn+"22", padding:"1px 6px", borderRadius:10, marginLeft:6 }}>⏳ Invitado — pendiente</span>}</div>
              {!u.profileId && <div style={{ fontSize:10, color:C.muted }}>Sin cuenta real todavía</div>}
            </div>
            {u.profileId && (
              <div style={{ display:"flex", gap:4 }} title="Módulos con acceso">
                <span style={{ fontSize:10, padding:"1px 6px", borderRadius:10, background: u.accesoCostos!==false ? C.ok+"22" : C.border+"44", color: u.accesoCostos!==false ? C.ok : C.muted }}>Costos</span>
                <span style={{ fontSize:10, padding:"1px 6px", borderRadius:10, background: u.accesoCrm!==false ? C.ok+"22" : C.border+"44", color: u.accesoCrm!==false ? C.ok : C.muted }}>CRM</span>
              </div>
            )}
            <div style={{ fontSize:12, color:C.muted, minWidth:100 }}>{ROL_LABEL[u.rol] || u.rol}</div>
            {esAdmin && <button onClick={() => abrirEdit(u)} style={{ background:"none", border:"none", color:C.accent, cursor:"pointer", fontSize:12 }}>✏️</button>}
            {esAdmin && !esUltimoAdmin && usuario?.id !== u.id && (
              <button onClick={() => setConfirmarDelId(u.id)} style={{ background:"none", border:"none", color:C.err, cursor:"pointer", fontSize:14 }}>🗑</button>
            )}
          </div>
        );
      })}

      {editId && (
        <div style={{ marginTop:12, padding:12, background:C.bg, borderRadius:8, border:`1px solid ${C.border}44` }}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <input value={nombreEdit} onChange={e=>setNombreEdit(e.target.value)} style={{ ...INP, flex:"1 1 140px" }} placeholder="Nombre" />
            <select value={rolEdit} onChange={e=>setRolEdit(e.target.value)} style={{ ...INP, width:150 }}>
              <option value="admin">Administrador</option>
              <option value="supervisor">Supervisor</option>
              <option value="vendedor">Vendedor</option>
            </select>
          </div>
          <div style={{ marginTop:8 }}>
            <label style={{ ...LBL, marginBottom:2 }}>Módulos con acceso</label>
            <div style={{ display:"flex", gap:16 }}>
              <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, cursor:"pointer" }}>
                <input type="checkbox" checked={accesoCostosEdit} onChange={e=>setAccesoCostosEdit(e.target.checked)} /> Steel Costos
              </label>
              <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, cursor:"pointer" }}>
                <input type="checkbox" checked={accesoCrmEdit} onChange={e=>setAccesoCrmEdit(e.target.checked)} /> Steel CRM
              </label>
            </div>
          </div>
          <div style={{ marginTop:8, display:"flex", gap:8 }}>
            <button onClick={guardarEdit} style={{ ...BTN("ghost"), fontSize:12, padding:"6px 14px" }}>💾 Guardar</button>
            <button onClick={() => setEditId(null)} style={{ ...BTN("ghost"), fontSize:12, padding:"6px 14px" }}>Cancelar</button>
          </div>
        </div>
      )}

      {confirmarDelId && objDel && (
        <ModalConfirmarEliminar titulo={`a ${objDel.nombre || "este usuario"}`}
          subtitulo={objDel.profileId
            ? "Se revoca su cuenta real — no va a poder loguearse nunca más, ni acá ni en Steel CRM (mismo backend)."
            : "Se borra de esta lista local."}
          onConfirm={() => del(confirmarDelId)} onClose={() => setConfirmarDelId(null)} />
      )}
    </div>
  );
}

// Invitar usuario nuevo (2026-09-03) — manda el mail real desde acá, vía
// api/invitar-usuario.js (función serverless de Vercel de ESTE proyecto,
// la única que tiene la service_role key). Siempre le pega a la URL de
// producción de Steel Costos, corra la sesión local o no — esa key
// nunca vive en la máquina de nadie. Mismo patrón ya en producción en
// Steel CRM (api/invitar-usuario.js de ese repo) — reemplaza el flujo
// viejo de "generar comando y pegarlo en la terminal" (crear-usuario.mjs).
function InvitarUsuario({ setUsuarios }) {
  // accesoCostos arranca tildado (es el módulo desde donde se está
  // invitando), accesoCrm arranca destildado — quien invita decide acá
  // mismo si la cuenta nueva entra a los dos o solo a este (2026-09-04,
  // control de acceso por módulo, pedido de Gino).
  const [form, setForm] = useState({ nombre:"", email:"", rol:"vendedor", accesoCrm:false, accesoCostos:true });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [cargando, setCargando] = useState(false);
  const invitar = async () => {
    if (!form.nombre.trim() || !form.email.trim()) { alert("Ingresá nombre y email"); return; }
    if (!form.accesoCrm && !form.accesoCostos) { alert("Tildá al menos un módulo (CRM y/o Costos)."); return; }
    if (!supabase) { setErr("Backend no configurado"); return; }
    setCargando(true); setErr(""); setMsg("");
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess?.session?.access_token;
      if (!token) { setErr("Tu sesión no tiene token real — volvé a iniciar sesión."); setCargando(false); return; }
      const r = await fetch("https://steelcostos.vercel.app/api/invitar-usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ nombre: form.nombre.trim(), email: form.email.trim(), rol: form.rol, accesoCrm: form.accesoCrm, accesoCostos: form.accesoCostos }),
      });
      const d = await r.json();
      if (!r.ok) { setErr(d.error || "No se pudo invitar."); setCargando(false); return; }
      setMsg(`✅ Invitación enviada a ${form.email.trim()} — le va a llegar un correo para elegir su propia contraseña.`);
      // Reflejo instantáneo en la lista de Equipo (2026-09-03, "Invitado —
      // pendiente", mismo patrón que steelCRM) — sin esto, la persona
      // invitada no aparecía en ningún lado hasta que alguien recargara la
      // página (sincronizarUsuariosDesdeProfiles en App.js solo corre una
      // vez al loguearse, no en cada cambio).
      setUsuarios(prev => [...prev, {
        id: Date.now(), profileId: d.userId, nombre: form.nombre.trim(), rol: form.rol,
        emoji: "👤", foto: "", clave: "", email: form.email.trim(), pendienteInvitacion: true,
        accesoCrm: form.accesoCrm, accesoCostos: form.accesoCostos,
      }]);
      setForm({ nombre:"", email:"", rol:"vendedor", accesoCrm:false, accesoCostos:true });
    } catch (e) {
      setErr("No se pudo invitar: " + e.message);
    }
    setCargando(false);
  };
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, marginTop:16 }}>
      <div style={{ fontWeight:700, color:C.accent, fontSize:13, marginBottom:4 }}>✉️ Invitar usuario nuevo</div>
      <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>La persona recibe un mail para elegir su propia contraseña — vos no la inventás.</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12 }}>
        <div><label style={LBL}>Nombre</label><input style={INP} value={form.nombre} onChange={e=>setForm(f=>({...f, nombre:e.target.value}))} placeholder="Nombre completo" /></div>
        <div><label style={LBL}>Email</label><input type="email" style={INP} value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} placeholder="persona@ejemplo.com" /></div>
        <div><label style={LBL}>Rol</label>
          <select style={INP} value={form.rol} onChange={e=>setForm(f=>({...f, rol:e.target.value}))}>
            <option value="admin">Administrador</option>
            <option value="supervisor">Supervisor</option>
            <option value="vendedor">Vendedor</option>
          </select>
        </div>
      </div>
      <div style={{ marginTop:10 }}>
        <label style={LBL}>Módulos con acceso</label>
        <div style={{ display:"flex", gap:16, marginTop:4 }}>
          <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, cursor:"pointer" }}>
            <input type="checkbox" checked={form.accesoCostos} onChange={e=>setForm(f=>({...f, accesoCostos:e.target.checked}))} /> Steel Costos
          </label>
          <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, cursor:"pointer" }}>
            <input type="checkbox" checked={form.accesoCrm} onChange={e=>setForm(f=>({...f, accesoCrm:e.target.checked}))} /> Steel CRM
          </label>
        </div>
      </div>
      <button onClick={invitar} disabled={cargando} style={{ ...BTN("ghost"), marginTop:10, fontSize:12, padding:"6px 14px", opacity: cargando?0.6:1 }}>{cargando ? "Enviando..." : "✉️ Enviar invitación"}</button>
      {msg && <div style={{ marginTop:10, fontSize:12, color:C.ok || C.accent }}>{msg}</div>}
      {err && <div style={{ marginTop:10, fontSize:12, color:C.err || "#e33" }}>❌ {err}</div>}
    </div>
  );
}

// ─── NUMERACIÓN DE PRESUPUESTOS ─────────────────────────────────────────
// Preview local con los valores en edición (sin guardar todavía) — la
// generación real vive en utils/storage.js (newNroPresupuesto/peekNroPresupuesto).
function previewNroPres(cfg) {
  const anioTxt = cfg.incluirAnio ? String(new Date().getFullYear()) : "";
  return `${cfg.prefijo || ""}${anioTxt}${String(1).padStart(cfg.digitos || 3, "0")}`;
}
function NumeracionPresupuestos({ soloLectura }) {
  const [cfg, setCfg] = useState(() => loadNumeracion());
  // Sync entre dispositivos (2026-09-04) — mismo criterio que
  // SimboloMoneda: el FORMATO (prefijo/dígitos/año/reinicio) viaja entre
  // dispositivos, el contador en sí (`smeas_last_nro*`) queda local a
  // propósito — sincronizarlo abriría la puerta a que dos dispositivos
  // pisen el contador del otro y generen el mismo número dos veces.
  const cloudReady = useRef(false);
  useEffect(() => {
    loadTenantSettingDB("numeracion").then(remoto => {
      if (remoto) setCfg(c => { const n = { ...c, ...remoto }; saveNumeracion(n); return n; });
      cloudReady.current = true;
    }).catch(err => { console.warn("[Fase 5] No se pudo leer numeración de la nube:", err); cloudReady.current = true; });
  }, []);
  const set = (patch) => {
    const n = { ...cfg, ...patch }; setCfg(n); saveNumeracion(n);
    if (cloudReady.current) saveTenantSettingDB("numeracion", n).catch(err => console.warn("saveTenantSettingDB numeracion", err));
  };
  const contadorKey = cfg.reiniciaPorAnio ? `smeas_last_nro_${new Date().getFullYear()}` : "smeas_last_nro";
  const [contador, setContador] = useState(() => localStorage.getItem(contadorKey) || "");

  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, marginBottom:16 }}>
      <div style={{ fontWeight:700, color:C.accent, fontSize:13, marginBottom:4 }}>🔢 Numeración de presupuestos</div>
      <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>
        Formato del número que se asigna a un presupuesto nuevo. Solo afecta a los que se creen de acá en adelante — nunca renombra los ya existentes.
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12 }}>
        <div><label style={LBL}>Prefijo</label>
          <input style={INP} value={cfg.prefijo ?? "P-"} placeholder="Ej: P- (vacío = sin prefijo)" disabled={soloLectura}
            onChange={e => set({ prefijo: e.target.value })} /></div>
        <div><label style={LBL}>Dígitos del secuencial</label>
          <input type="number" min="1" max="8" style={INP} value={cfg.digitos ?? 3} disabled={soloLectura}
            onChange={e => set({ digitos: Number(e.target.value) || 3 })} /></div>
        <div><label style={LBL}>Incluir año</label>
          <select style={INP} value={cfg.incluirAnio ? "si" : "no"} disabled={soloLectura}
            onChange={e => set({ incluirAnio: e.target.value === "si" })}>
            <option value="no">No</option>
            <option value="si">Sí — ej: 2026...</option>
          </select></div>
        <div><label style={LBL}>Reinicia cada año</label>
          <select style={INP} value={cfg.reiniciaPorAnio ? "si" : "no"} disabled={soloLectura}
            onChange={e => set({ reiniciaPorAnio: e.target.value === "si" })}>
            <option value="no">No — contador continuo</option>
            <option value="si">Sí — vuelve a 1 cada 1° de enero</option>
          </select></div>
      </div>
      <div style={{ fontSize:12, color:C.gold, marginTop:10 }}>
        Ejemplo con estos valores: <strong>{previewNroPres(cfg)}</strong>
      </div>
      {!soloLectura && (
        <div style={{ marginTop:14, paddingTop:12, borderTop:`1px solid ${C.border}44` }}>
          <label style={LBL}>Corregir contador actual {cfg.reiniciaPorAnio ? `(año ${new Date().getFullYear()})` : ""}</label>
          <div style={{ fontSize:11, color:C.muted, marginBottom:6 }}>
            Usalo si el número real de tu sistema externo ya va más adelante que este contador.
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <input type="number" min="0" style={{ ...INP, maxWidth:160 }} value={contador}
              onChange={e => setContador(e.target.value)} placeholder="0" />
            <button onClick={() => { localStorage.setItem(contadorKey, String(Number(contador) || 0)); alert("✅ Contador actualizado"); }}
              style={{ ...BTN("ghost"), fontSize:12, padding:"6px 14px" }}>
              Guardar contador
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SÍMBOLO DE MONEDA ───────────────────────────────────────────────────
// 2026-09-03, a pedido de Gino — mismo patrón que Steel CRM (Config >
// Visualización > "Símbolo de moneda"), acá dentro de Sistema porque
// Measurement no tiene un tab de Visualización separado. Puramente de
// presentación: el cálculo interno de todo el sistema sigue siendo en USD.
function SimboloMoneda({ soloLectura }) {
  const [moneda, setMonedaState] = useState(() => getMoneda());
  // Sync entre dispositivos (2026-09-04) — se trae una vez de la nube al
  // montar (gana sobre lo local si hay algo guardado) y recién ahí se
  // habilita guardar hacia la nube, mismo criterio anti-carrera que ya usa
  // Steel CRM para Config desde el 2/9.
  const cloudReady = useRef(false);
  useEffect(() => {
    loadTenantSettingDB("moneda").then(remoto => {
      if (remoto) { setMonedaState(remoto); setMoneda(remoto); }
      cloudReady.current = true;
    }).catch(err => { console.warn("[Fase 5] No se pudo leer la moneda de la nube:", err); cloudReady.current = true; });
  }, []);
  const cambiar = (v) => {
    setMonedaState(v); setMoneda(v);
    if (cloudReady.current) saveTenantSettingDB("moneda", v).catch(err => console.warn("saveTenantSettingDB moneda", err));
  };
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, marginBottom:16 }}>
      <div style={{ fontWeight:700, color:C.accent, fontSize:13, marginBottom:4 }}>💱 Símbolo de moneda</div>
      <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>
        Cómo se muestran los montos en toda la app — el cálculo siempre es en dólares, esto es solo el prefijo que se ve.
      </div>
      <select style={{ ...INP, maxWidth:260 }} value={moneda} disabled={soloLectura} onChange={e => cambiar(e.target.value)}>
        <option value="U$S">U$S - Dólares</option>
        <option value="$UY">$UY - Pesos uruguayos</option>
      </select>
    </div>
  );
}

// ─── BACKUP Y DATOS ──────────────────────────────────────────────────────
// Movido acá desde el sidebar (vivía como botones sueltos al pie, sin
// relación visual con el resto de la configuración del sistema).
const FREQ_MS = { "1h": 3600000, "1d": 86400000, "1w": 604800000 };
function BackupYDatos({ usuario }) {
  // Backup automático real (2026-09-04, pedido de Gino: "parejar" con
  // Steel CRM). Steel Costos nunca tuvo esto — el único mecanismo hasta
  // ahora era exportar/cargar un .json a mano más abajo. Corre server-side
  // vía un cron de Vercel en el proyecto de Steel CRM (api/backup-cron.js,
  // cubre las dos apps de una sola pasada porque comparten backend) — acá
  // solo se lee el estado real (api/backup-status.js, misma URL de
  // producción de Steel CRM) y se puede forzar uno a mano.
  const [backupStatus, setBackupStatus] = useState({ cargando: true, ultimo: null, total: 0, error: null });
  const [backupForzando, setBackupForzando] = useState(false);
  const cargarBackupStatus = useCallback(async () => {
    if (!supabase) { setBackupStatus({ cargando: false, ultimo: null, total: 0, error: "Backend no configurado" }); return; }
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess?.session?.access_token;
      if (!token) { setBackupStatus({ cargando: false, ultimo: null, total: 0, error: "Sesión no lista" }); return; }
      const r = await fetch("https://steelcostos.vercel.app/api/backup-status", { headers: { Authorization: "Bearer " + token } });
      const d = await r.json();
      if (!r.ok) { setBackupStatus({ cargando: false, ultimo: null, total: 0, error: d.error || "No se pudo consultar" }); return; }
      setBackupStatus({ cargando: false, ultimo: d.ultimo, total: d.total, error: null });
    } catch (e) {
      setBackupStatus({ cargando: false, ultimo: null, total: 0, error: e.message });
    }
  }, []);
  useEffect(() => { cargarBackupStatus(); }, [cargarBackupStatus]);
  async function forzarBackup() {
    if (!supabase) return;
    setBackupForzando(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess?.session?.access_token;
      if (!token) { alert("Tu sesión no tiene token real — volvé a iniciar sesión."); setBackupForzando(false); return; }
      const r = await fetch("https://steelcrm.vercel.app/api/backup-cron", { method: "POST", headers: { Authorization: "Bearer " + token } });
      const d = await r.json();
      if (!r.ok) { alert("❌ " + (d.error || "No se pudo hacer el backup")); setBackupForzando(false); return; }
      await cargarBackupStatus();
      alert("✅ Backup hecho — " + d.fecha);
    } catch (e) {
      alert("❌ No se pudo hacer el backup: " + e.message);
    }
    setBackupForzando(false);
  }

  const [pendingBackup, setPendingBackup] = useState(null);
  const [importErr, setImportErr] = useState("");
  const fileInputRef = useRef(null);
  const [migrando, setMigrando] = useState(false);
  const [logMigracion, setLogMigracion] = useState([]);
  const [resumenMigracion, setResumenMigracion] = useState(null);

  const correrMigracion = async () => {
    setMigrando(true);
    setLogMigracion([]);
    setResumenMigracion(null);
    try {
      const resumen = await migrarTodoALaNube((msg) => setLogMigracion((prev) => [...prev, msg]));
      setResumenMigracion(resumen);
    } catch (e) {
      setLogMigracion((prev) => [...prev, `❌ Error general: ${e.message || e}`]);
    }
    setMigrando(false);
  };

  const elegirArchivo = () => { setImportErr(""); fileInputRef.current?.click(); };
  const onArchivo = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        setPendingBackup(parseBackup(reader.result));
      } catch (err) {
        setImportErr(err.message || "No se pudo leer el archivo.");
      }
    };
    reader.readAsText(file);
  };
  const confirmarRestaurar = () => {
    restoreBackup(pendingBackup);
    setPendingBackup(null);
    window.location.reload();
  };

  // ── Google Drive (2026-09-03, a pedido de Gino — mismo mecanismo que ya
  //    tiene Steel CRM) ──────────────────────────────────────────────────
  const [driveClientId, setDriveClientId] = useState(() => localStorage.getItem("smeas_drive_client_id") || "");
  const [driveFreq, setDriveFreq] = useState(() => localStorage.getItem("smeas_drive_freq") || "manual");
  const [driveConnected, setDriveConnected] = useState(false);
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveStatus, setDriveStatus] = useState("");
  const [lastBackup, setLastBackup] = useState(() => localStorage.getItem("smeas_drive_last_backup") || "");
  const [driveRestorePend, setDriveRestorePend] = useState(null);
  const driveIntervalRef = useRef(null);

  const runBackup = useCallback(async () => {
    if (!driveClientId) return;
    setDriveLoading(true); setDriveStatus("Guardando en Drive...");
    try {
      await backupToDrive(driveClientId);
      const now = new Date().toISOString();
      setLastBackup(now); localStorage.setItem("smeas_drive_last_backup", now);
      setDriveConnected(true); setDriveStatus("✅ Respaldo guardado correctamente");
    } catch (e) { setDriveStatus("❌ " + e.message); }
    setDriveLoading(false);
  }, [driveClientId]);

  useEffect(() => {
    if (driveIntervalRef.current) clearInterval(driveIntervalRef.current);
    if (driveFreq !== "manual" && FREQ_MS[driveFreq] && driveClientId)
      driveIntervalRef.current = setInterval(runBackup, FREQ_MS[driveFreq]);
    return () => { if (driveIntervalRef.current) clearInterval(driveIntervalRef.current); };
  }, [driveFreq, driveClientId, runBackup]);

  function saveDriveSettings() {
    localStorage.setItem("smeas_drive_client_id", driveClientId);
    localStorage.setItem("smeas_drive_freq", driveFreq);
  }
  async function handleConnect() {
    if (!driveClientId.trim()) { setDriveStatus("❌ Ingresá el Client ID"); return; }
    setDriveLoading(true); setDriveStatus("Conectando...");
    try { await authorize(driveClientId, true); setDriveConnected(true); saveDriveSettings(); setDriveStatus("✅ Conectado"); }
    catch (e) { setDriveStatus("❌ " + e.message); }
    setDriveLoading(false);
  }
  async function doRestoreDrive() {
    setDriveLoading(true); setDriveStatus("Restaurando...");
    try {
      const payload = await restoreFromDrive(driveClientId);
      if (!payload || payload.app !== "steel-measurement" || typeof payload.data !== "object") {
        throw new Error("El respaldo encontrado no es válido para Steel Costos.");
      }
      restoreBackup(payload);
      setDriveConnected(true);
      setDriveStatus("✅ Restaurado. Respaldo del " + formatBackupDate(payload.exported_at) + ". Recargá la app.");
    } catch (e) { setDriveStatus("❌ " + e.message); }
    setDriveLoading(false);
  }
  function handleRestoreDrive() {
    if (!driveClientId.trim()) { setDriveStatus("❌ Ingresá el Client ID"); return; }
    setDriveRestorePend(true);
  }

  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
      <div style={{ fontWeight:700, color:C.accent, fontSize:13, marginBottom:4 }}>💾 Backup y Datos</div>
      <div style={{ fontSize:11, color:C.muted, marginBottom:16 }}>
        Backup manual de toda la app (presupuestos, cómputos, anidados, historial, biblioteca de precios) en un solo archivo .json.
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        <button onClick={exportBackup} style={{ ...BTN("ghost"), borderColor:C.ok+"66", color:C.ok }} title="Descarga un .json con todos los datos de la app">
          ⬇️ Descargar backup
        </button>
        {puedeEliminar(usuario) && (
          <button onClick={elegirArchivo} style={{ ...BTN("ghost"), borderColor:C.info+"66", color:C.info }} title="Restaura los datos desde un archivo de backup .json">
            ⬆️ Restaurar desde archivo
          </button>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="application/json" onChange={onArchivo} style={{ display:"none" }} />
      {importErr && <div style={{ color:C.err, fontSize:11, fontWeight:600, marginTop:10 }}>⚠ {importErr}</div>}

      {/* Backup automático (servidor) — nuevo 2026-09-04, mismo estado real
          que muestra Steel CRM (un solo cron cubre las dos apps) */}
      <div style={{ marginTop:20, paddingTop:16, borderTop:`1px dashed ${C.border}` }}>
        <div style={{ fontWeight:700, color:C.teal || C.accent, fontSize:12, marginBottom:4 }}>💾 Backup Automático (servidor)</div>
        <div style={{ fontSize:11, color:C.muted, marginBottom:10, lineHeight:1.6 }}>
          Corre solo, una vez por día, en el servidor — no depende de que nadie tenga la app abierta.
          Guarda un snapshot completo de todos los datos de la empresa (Steel CRM y Steel Costos) en un lugar seguro aparte. Se conservan los últimos 30 días.
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <button onClick={forzarBackup} disabled={backupForzando} style={{ ...BTN("ghost"), opacity: backupForzando?0.6:1 }}>{backupForzando ? "Haciendo backup..." : "💾 Backup ahora"}</button>
          {backupStatus.cargando ? (
            <span style={{ fontSize:11, color:C.muted }}>Consultando estado...</span>
          ) : backupStatus.error ? (
            <span style={{ fontSize:11, color:C.err }}>⚠️ {backupStatus.error}</span>
          ) : (() => {
            const dias = backupStatus.ultimo ? Math.floor((new Date() - new Date(backupStatus.ultimo)) / 864e5) : null;
            const stale = dias === null || dias > 1;
            return (
              <span style={{ fontSize:11, color: stale ? C.err : C.muted }}>
                Último: <strong style={{ color: stale ? C.err : C.text }}>{backupStatus.ultimo || "nunca"}</strong>
                {stale && backupStatus.ultimo && ` (hace ${dias} día${dias===1?"":"s"})`}
                {backupStatus.total > 0 && ` · ${backupStatus.total} respaldo(s) guardados`}
              </span>
            );
          })()}
        </div>
      </div>

      {/* Google Drive (2026-09-03) — mismo mecanismo que ya tiene Steel CRM */}
      <div style={{ marginTop:20, paddingTop:16, borderTop:`1px dashed ${C.border}` }}>
        <div style={{ fontWeight:700, color:"#34a853", fontSize:12, marginBottom:4 }}>
          ☁ Respaldo Google Drive
          {driveConnected && <span style={{ marginLeft:8, fontSize:10, background:"#34a85322", color:"#34a853", padding:"2px 8px", borderRadius:10 }}>Conectado</span>}
        </div>
        <div style={{ fontSize:11, color:C.muted, marginBottom:12, lineHeight:1.6 }}>
          Necesitás un Client ID de Google Cloud Console.{" "}
          <span style={{ color:C.info, cursor:"pointer", textDecoration:"underline" }} onClick={() => window.open("https://console.cloud.google.com/apis/credentials", "_blank")}>Obtener Client ID</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:12 }}>
          <div>
            <label style={LBL}>Client ID de Google</label>
            <input style={{ ...INP, fontFamily:"monospace", fontSize:11 }} value={driveClientId}
              onChange={e => setDriveClientId(e.target.value.trim())} placeholder="xxxxxxxxxxxx.apps.googleusercontent.com"
              disabled={!puedeEliminar(usuario)} />
          </div>
          <div>
            <label style={LBL}>Frecuencia de respaldo automático</label>
            <select style={INP} value={driveFreq} disabled={!puedeEliminar(usuario)}
              onChange={e => { setDriveFreq(e.target.value); saveDriveSettings(); }}>
              <option value="manual">Solo manual</option>
              <option value="1h">Cada hora</option>
              <option value="1d">Cada día</option>
              <option value="1w">Cada semana</option>
            </select>
          </div>
        </div>
        {puedeEliminar(usuario) && (
          <div style={{ marginTop:12, display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
            <button onClick={handleConnect} disabled={driveLoading} style={{ ...BTN("ghost"), borderColor:"#34a85366", color:"#34a853" }}>
              {driveConnected ? "Reconectar" : "Conectar"}
            </button>
            <button onClick={runBackup} disabled={driveLoading || !driveConnected} style={{ ...BTN("ghost"), borderColor:C.info+"66", color:C.info }}>
              Respaldar ahora
            </button>
            <button onClick={handleRestoreDrive} disabled={driveLoading || !driveConnected} style={{ ...BTN("ghost") }}>
              Restaurar desde Drive
            </button>
          </div>
        )}
        {lastBackup && <div style={{ marginTop:8, fontSize:11, color:C.muted }}>Último respaldo: <strong style={{ color:C.text }}>{formatBackupDate(lastBackup)}</strong></div>}
        {driveStatus && <div style={{ marginTop:8, fontSize:12, color: driveStatus.startsWith("✅") ? "#34a853" : driveStatus.startsWith("❌") ? C.err : C.info, fontWeight:600 }}>{driveLoading && "⏳ "}{driveStatus}</div>}
      </div>

      {/* Fase 4 (piloto, 2026-08-23) — MIGRACIÓN DE UNA SOLA VEZ.
          Sube todo lo que ya está en localStorage al backend real. Una vez
          confirmado que funcionó, este bloque entero se puede borrar — no
          es una función permanente de la app. */}
      {puedeEliminar(usuario) && supabase && (
        <div style={{ marginTop:20, paddingTop:16, borderTop:`1px dashed ${C.border}` }}>
          <div style={{ fontWeight:700, color:C.accent, fontSize:12, marginBottom:4 }}>☁️ Migrar datos históricos a la nube</div>
          <div style={{ fontSize:11, color:C.muted, marginBottom:10 }}>
            Sube TODO lo que ya está cargado (clientes, presupuestos, cómputos, anidados, historial, biblioteca, tarifario) al backend real, una sola vez. Puede tardar varios minutos si hay mucho volumen — no cierres esta pantalla mientras corre.
          </div>
          <button onClick={correrMigracion} disabled={migrando}
            style={{ ...BTN("ghost"), borderColor:C.accent+"66", color:C.accent, opacity: migrando?0.6:1, cursor: migrando?"default":"pointer" }}>
            {migrando ? "⏳ Migrando…" : "☁️ Migrar todo a la nube"}
          </button>
          {logMigracion.length > 0 && (
            <div style={{ marginTop:10, background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:10, fontSize:11, fontFamily:"monospace", maxHeight:180, overflowY:"auto" }}>
              {logMigracion.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          )}
          {resumenMigracion && (
            <div style={{ marginTop:10, fontSize:11 }}>
              {resumenMigracion.errores.length === 0
                ? <div style={{ color:C.ok, fontWeight:700 }}>✅ Migración completa, sin errores.</div>
                : (
                  <div>
                    <div style={{ color:C.warn, fontWeight:700, marginBottom:4 }}>⚠ Terminó con {resumenMigracion.errores.length} error(es):</div>
                    <div style={{ maxHeight:120, overflowY:"auto", color:C.err }}>
                      {resumenMigracion.errores.map((e, i) => <div key={i}>· {e}</div>)}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      )}

      {pendingBackup && (
        <ModalConfirmarEliminar
          verbo="Restaurar"
          titulo={`backup del ${new Date(pendingBackup.exported_at).toLocaleString("es-UY")}`}
          subtitulo="Esto reemplaza TODOS los datos actuales de la app (presupuestos, cómputos, historial, biblioteca) por los del archivo. No se puede deshacer."
          labelBoton="♻️ Restaurar y reemplazar todo"
          onConfirm={confirmarRestaurar}
          onClose={() => setPendingBackup(null)}
        />
      )}
      {driveRestorePend && (
        <ModalConfirmarEliminar
          verbo="Restaurar"
          titulo="el último respaldo de Google Drive"
          subtitulo="Esto reemplaza TODOS los datos actuales de la app (presupuestos, cómputos, historial, biblioteca) por los del respaldo en Drive. No se puede deshacer."
          labelBoton="♻️ Restaurar y reemplazar todo"
          onConfirm={() => { doRestoreDrive(); setDriveRestorePend(null); }}
          onClose={() => setDriveRestorePend(null)}
        />
      )}
    </div>
  );
}

// El tarifario (MO, materiales generales, terceriz., traslados, tratamiento de
// superficie, pantógrafo) vive en el módulo "Insumos y Precios" junto a la
// Biblioteca de materiales — acá solo queda lo que es admin-only del sistema.
export default function Config({ usuario, usuarios, setUsuarios, auditLog = [], logear }) {
  // Si por error nadie quedó con rol Administrador, la pantalla se
  // desbloquea igual — si no, quedaría un candado circular: sin admin no
  // se puede editar usuarios, pero sin editar usuarios no se puede volver
  // a tener un admin.
  const hayAdmin = usuarios.some(u => u.rol === "admin");
  const soloLectura = usuario?.rol !== "admin" && hayAdmin;

  const [seedErr, setSeedErr] = useState("");
  const [empresa, setEmpresa] = useState(() => loadLS("smeas_empresa", ""));
  // Sync entre dispositivos (2026-09-04, Tarea 6 — bug real reportado por
  // Gino: "Nombre de la empresa" aparecía vacío en un dispositivo distinto
  // al que lo cargó, porque hasta ahora era 100% local por origen). Mismo
  // patrón que ya tiene Steel CRM desde el 2/9 (tenant_settings, gana la
  // nube sobre lo local si hay algo guardado, recién ahí se habilita
  // guardar hacia la nube para no subir lo local viejo antes de leer).
  // `empresaSyncEstado` es el reemplazo del "botón Guardar" que Gino
  // esperaba acá — el campo ya guardaba solo en cada tecla (auto-save,
  // mismo criterio que el resto de Config), pero no había ninguna señal
  // visible de si esa escritura llegó a la nube o falló en silencio.
  const [empresaSyncEstado, setEmpresaSyncEstado] = useState(null); // null | "ok" | "error"
  const empresaCloudReady = useRef(false);
  useEffect(() => {
    loadTenantSettingDB("empresa").then(remoto => {
      if (remoto) { setEmpresa(remoto); saveLS("smeas_empresa", remoto); }
      else if (empresa) {
        // Backfill (2026-09-04): si la nube todavía no tiene nada pero
        // este dispositivo ya tenía un nombre cargado de antes de que
        // existiera este sync, se sube tal cual en vez de esperar a que
        // alguien lo vuelva a tipear a mano.
        saveTenantSettingDB("empresa", empresa).then(() => setEmpresaSyncEstado("ok")).catch(err => { console.warn("saveTenantSettingDB empresa (backfill)", err); setEmpresaSyncEstado("error"); });
      }
      empresaCloudReady.current = true;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }).catch(err => { console.warn("[Fase 5] No se pudo leer el nombre de empresa de la nube:", err); empresaCloudReady.current = true; });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const guardarEmpresa = (v) => {
    setEmpresa(v); saveLS("smeas_empresa", v);
    if (empresaCloudReady.current) {
      saveTenantSettingDB("empresa", v).then(() => setEmpresaSyncEstado("ok")).catch(err => { console.warn("saveTenantSettingDB empresa", err); setEmpresaSyncEstado("error"); });
    }
  };
  // Mismos campos que se agregaron en Steel CRM (mismo PDF compartido) —
  // direccion/RUT/tel/email/web/logo, guardados en un solo objeto.
  const [empresaDatos, setEmpresaDatos] = useState(() => loadLS("smeas_empresa_datos", { direccion: "", rut: "", tel: "", email: "", web: "", logo: "" }));
  const empresaDatosCloudReady = useRef(false);
  useEffect(() => {
    loadTenantSettingDB("empresa_datos").then(remoto => {
      if (remoto) {
        setEmpresaDatos(prev => { const n = { ...prev, ...remoto }; saveLS("smeas_empresa_datos", n); return n; });
      } else {
        // Backfill, mismo criterio que "empresa" — solo si hay algo
        // real cargado localmente (no manda un objeto vacío de arranque).
        setEmpresaDatos(prev => {
          if (Object.values(prev).some(v => v)) {
            saveTenantSettingDB("empresa_datos", prev).then(() => setEmpresaSyncEstado("ok")).catch(err => { console.warn("saveTenantSettingDB empresa_datos (backfill)", err); setEmpresaSyncEstado("error"); });
          }
          return prev;
        });
      }
      empresaDatosCloudReady.current = true;
    }).catch(err => { console.warn("[Fase 5] No se pudo leer los datos de empresa de la nube:", err); empresaDatosCloudReady.current = true; });
  }, []);
  const setEmpresaDato = (k, v) => setEmpresaDatos(prev => {
    const n = { ...prev, [k]: v }; saveLS("smeas_empresa_datos", n);
    if (empresaDatosCloudReady.current) {
      saveTenantSettingDB("empresa_datos", n).then(() => setEmpresaSyncEstado("ok")).catch(err => { console.warn("saveTenantSettingDB empresa_datos", err); setEmpresaSyncEstado("error"); });
    }
    return n;
  });
  const logoRef = useRef();
  const handleLogo = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => setEmpresaDato("logo", ev.target.result);
    r.readAsDataURL(f);
  };
  const [seccion, setSeccion] = useState("empresa");
  const [auFiltU, setAuFiltU] = useState("");
  const [auFiltA, setAuFiltA] = useState("");
  // Papelera visible a admin y supervisor (2026-08-25) — solo la purga
  // definitiva ("Eliminar definitivamente" dentro de PapeleraPanel) sigue
  // siendo admin-only, gateada aparte.
  const puedeVerPapelera = usuario?.rol === "admin" || usuario?.rol === "supervisor";

  const TAB_BTN = (key, icon, lbl) => (
    <button key={key} onClick={() => setSeccion(key)}
      style={{ padding:"9px 18px", border:"none", borderBottom: seccion===key ? "2px solid "+C.accent : "2px solid transparent",
        background:"transparent", color: seccion===key ? C.accent : C.muted, cursor:"pointer",
        fontWeight: seccion===key ? 700 : 400, fontSize:13, marginBottom:-2, whiteSpace:"nowrap" }}>
      {icon} {lbl}
    </button>
  );

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
        <span style={{ fontSize:20 }}>⚙️</span>
        <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:C.text }}>Configuración</h2>
      </div>

      {!hayAdmin && (
        <div style={{ marginBottom:16, padding:"8px 14px", background:C.err+"11", border:`1px solid ${C.err}33`, borderRadius:6, fontSize:12, color:C.err, fontWeight:700 }}>
          ⚠ No hay ningún usuario con rol Administrador — poné al menos un usuario en "Administrador" abajo. Mientras tanto, la edición está desbloqueada para poder arreglarlo.
        </div>
      )}
      {soloLectura && (
        <div style={{ marginBottom:16, padding:"8px 14px", background:C.warn+"11", border:`1px solid ${C.warn}33`, borderRadius:6, fontSize:12, color:C.warn }}>
          ⚠ Solo lectura — solo Administrador puede editar la configuración.
        </div>
      )}

      {/* TABS — mismo patrón visual que steelCRM */}
      <div style={{ display:"flex", gap:0, marginBottom:20, borderBottom:"2px solid "+C.border+"44", flexWrap:"wrap" }}>
        {TAB_BTN("empresa","🏢","Empresa")}
        {TAB_BTN("sistema","⚙️","Sistema")}
        {TAB_BTN("usuarios","👤","Usuarios")}
        {TAB_BTN("backup","💾","Backup y Datos")}
        {TAB_BTN("actividad","📋","Actividad")}
        {puedeVerPapelera && TAB_BTN("papelera","🗑️","Papelera")}
      </div>

      {/* 2026-09-03, a pedido de Gino: las pestañas quedaban en un recuadro
          angosto (maxWidth:680) que no ocupaba la pantalla, distinto al
          resto de las ventanas (Cómputo/Anidado/Presupuesto usan el ancho
          completo). Las tarjetas internas ya tienen su propio grid de
          columnas — sin el límite, se estiran igual que en el resto de la app. */}
      <div>
        {seccion === "empresa" && (
          <div>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <div style={{ fontWeight:700, color:C.accent, fontSize:13 }}>🏢 Datos de la empresa</div>
                {empresaSyncEstado === "ok" && <span style={{ fontSize:11, color:C.ok }}>☁️ Sincronizado — visible en cualquier dispositivo</span>}
                {empresaSyncEstado === "error" && <span style={{ fontSize:11, color:C.err }}>⚠️ No se pudo sincronizar — quedó solo en este dispositivo</span>}
              </div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>
                Aparece en el PDF de presupuesto y donde el sistema muestre el nombre de la empresa. Sin el nombre configurado, el PDF sale sin nombre de empresa.
                Se guarda solo, sin botón — cada cambio viaja a la nube al instante.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:12 }}>
                <div style={{ gridColumn:"span 2" }}>
                  <label style={LBL}>Nombre de la empresa</label>
                  <input style={INP} value={empresa} placeholder="Ej: Acero del Sur S.A." disabled={soloLectura} onChange={e => guardarEmpresa(e.target.value)} />
                </div>
                <div style={{ gridColumn:"span 2" }}>
                  <label style={LBL}>Dirección</label>
                  <input style={INP} value={empresaDatos.direccion} placeholder="Ej: Ruta 8 km 14, Canelones" disabled={soloLectura} onChange={e => setEmpresaDato("direccion", e.target.value)} />
                </div>
                <div><label style={LBL}>RUT / CI</label><input style={INP} value={empresaDatos.rut} placeholder="Ej: 210000000000" disabled={soloLectura} onChange={e => setEmpresaDato("rut", e.target.value)} /></div>
                <div><label style={LBL}>Teléfono</label><input style={INP} value={empresaDatos.tel} placeholder="Ej: +598 2XXX XXXX" disabled={soloLectura} onChange={e => setEmpresaDato("tel", e.target.value)} /></div>
                <div><label style={LBL}>Email</label><input style={INP} value={empresaDatos.email} placeholder="Ej: ventas@empresa.com" disabled={soloLectura} onChange={e => setEmpresaDato("email", e.target.value)} /></div>
                <div><label style={LBL}>Sitio web</label><input style={INP} value={empresaDatos.web} placeholder="Ej: www.empresa.com" disabled={soloLectura} onChange={e => setEmpresaDato("web", e.target.value)} /></div>
              </div>
            </div>

            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
              <div style={{ fontWeight:700, color:C.accent, fontSize:13, marginBottom:4 }}>🖼️ Logo de la empresa</div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>Ingresá acá el logo de la empresa — JPG, PNG o similar.</div>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ position:"relative", cursor: soloLectura ? "default" : "pointer" }} onClick={() => !soloLectura && logoRef.current.click()}>
                  {empresaDatos.logo
                    ? <img src={empresaDatos.logo} alt="" style={{ width:90, height:64, borderRadius:8, objectFit:"contain", background:"#fff", border:"2px solid "+C.accent, padding:4 }} />
                    : <div style={{ width:90, height:64, borderRadius:8, background:C.accent+"18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, border:"2px dashed "+C.accent+"66" }}>🏢</div>}
                  {!soloLectura && <div style={{ position:"absolute", bottom:-4, right:-4, background:C.accent, borderRadius:"50%", width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11 }}>📷</div>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:6 }}>Click en el recuadro para cambiarlo.</div>
                  {empresaDatos.logo && !soloLectura && <button onClick={() => setEmpresaDato("logo", "")} style={{ fontSize:11, color:C.err, background:"none", border:"none", cursor:"pointer" }}>✕ Quitar logo</button>}
                </div>
                <input ref={logoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleLogo} />
              </div>
            </div>
          </div>
        )}

        {seccion === "sistema" && (
          <div>
            <NumeracionPresupuestos soloLectura={soloLectura} />
            <SimboloMoneda soloLectura={soloLectura} />

            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
              <div style={{ fontWeight:700, color:C.accent, fontSize:13, marginBottom:4 }}>🎨 Apariencia</div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>
                Cambia el tema visual de todo el sistema. Podés volver al original en cualquier momento — no se pierde nada, es solo una preferencia de esta instalación.
              </div>
              <label style={LBL}>Tema</label>
              <select style={INP} value={TEMA_ACTUAL}
                onChange={e => cambiarTema(e.target.value)}>
                {TEMAS_DISPONIBLES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
              <div style={{ fontSize:11, color:C.muted, marginTop:6 }}>Al cambiarlo, la página se recarga para aplicarlo. Cualquier usuario puede cambiarlo — es solo una preferencia visual, no afecta datos.</div>
            </div>

            {process.env.NODE_ENV === "development" && (
              // Provisorio (2026-09-03, a pedido de Gino) — herramienta de
              // desarrollo, movida acá desde el sidebar para no ensuciar la
              // navegación principal. Sólo aparece en NODE_ENV=development,
              // nunca en producción. Sacar cuando ya no haga falta.
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, marginTop:16 }}>
                <div style={{ fontWeight:700, color:C.pur, fontSize:13, marginBottom:4 }}>🧪 Datos de prueba</div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>
                  Sólo visible en desarrollo. Carga un cómputo + anidado de prueba y recarga la app.
                </div>
                <button
                  onClick={() => {
                    try {
                      seedTestData();
                      window.location.reload();
                    } catch (err) {
                      console.error("Error al cargar datos de prueba:", err);
                      setSeedErr(err.message || "Error desconocido, ver consola (F12).");
                    }
                  }}
                  style={{ background:C.pur+"18", border:`1px solid ${C.pur}44`, borderRadius:6, padding:"7px 14px", cursor:"pointer", color:C.pur, fontSize:12, fontWeight:700 }}>
                  🧪 Seed datos prueba
                </button>
                {seedErr && <div style={{ color:C.err, fontSize:11, fontWeight:600, marginTop:8 }}>⚠ {seedErr}</div>}
              </div>
            )}
          </div>
        )}

        {seccion === "usuarios" && (
          <div>
            <MiCuenta usuario={usuario} />
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
              <div style={{ fontWeight:700, color:C.accent, fontSize:13, marginBottom:4 }}>👤 Equipo</div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>
                Administrador ve todo el sistema · Supervisor ve el equipo y aprueba · Vendedor ve sus propios datos.
                No se puede eliminar el último Administrador.
              </div>
              <EquipoUsuarios usuarios={usuarios} setUsuarios={setUsuarios} usuario={usuario} esAdmin={usuario?.rol === "admin"} />
            </div>
            {usuario?.rol === "admin" && <InvitarUsuario setUsuarios={setUsuarios} />}
          </div>
        )}

        {seccion === "backup" && <BackupYDatos usuario={usuario} />}

        {/* ── ACTIVIDAD (2026-08-24, mismo patrón que steelCRM) ── */}
        {seccion === "actividad" && (() => {
          const usuariosLog = [...new Set(auditLog.map(e => e.usuario).filter(Boolean))];
          const accionColor = a => {
            if (!a) return C.muted;
            if (a.includes("eliminado")) return "#ef4444";
            if (a.includes("creado")) return "#22c55e";
            return C.info;
          };
          const CATS = ["Todos", ...new Set(auditLog.map(e => e.accion).filter(Boolean))];
          const logFilt = auditLog.filter(e =>
            (!auFiltU || e.usuario === auFiltU) &&
            (!auFiltA || auFiltA === "Todos" || e.accion === auFiltA)
          );
          return (
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div style={{ fontWeight:700, fontSize:14, color:C.steel }}>📋 Registro de Actividad</div>
              </div>
              {auditLog.length > 0 && (
                <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
                  <select value={auFiltU} onChange={e=>setAuFiltU(e.target.value)}
                    style={{ ...INP, width:"auto", fontSize:11, padding:"4px 8px" }}>
                    <option value="">Todos los usuarios</option>
                    {usuariosLog.map(u => <option key={u}>{u}</option>)}
                  </select>
                  <select value={auFiltA} onChange={e=>setAuFiltA(e.target.value)}
                    style={{ ...INP, width:"auto", fontSize:11, padding:"4px 8px" }}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <span style={{ fontSize:11, color:C.muted, alignSelf:"center" }}>{logFilt.length} registro{logFilt.length!==1?"s":""}</span>
                </div>
              )}
              {logFilt.length === 0
                ? <div style={{ color:C.muted, fontSize:13, textAlign:"center", padding:20 }}>Sin actividad registrada aún</div>
                : logFilt.map(e => {
                  const fecha = new Date(e.fecha).toLocaleString("es-UY", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" });
                  const col = accionColor(e.accion);
                  return (
                    <div key={e.id} style={{ display:"flex", gap:12, padding:"7px 0", borderBottom:`1px solid ${C.border}22`, fontSize:12, alignItems:"flex-start" }}>
                      <span style={{ color:C.muted, whiteSpace:"nowrap", minWidth:105 }}>{fecha}</span>
                      <span style={{ color:C.accent, fontWeight:600, minWidth:80, flexShrink:0 }}>{e.usuario}</span>
                      <div>
                        <span style={{ color:col, fontWeight:700, fontSize:11, padding:"1px 6px", background:col+"18", borderRadius:3, marginRight:6 }}>{e.accion}</span>
                        {e.detalle && <span style={{ color:C.muted }}>{e.detalle}</span>}
                      </div>
                    </div>
                  );
                })}
            </div>
          );
        })()}

        {/* ── PAPELERA (2026-08-24) — solo admin: acá quedan Cómputos y Anidados
             eliminados (soft-delete) después de que el toast de "Deshacer" ya
             expiró. No tiene límite de tiempo — mismo espíritu que le pidió
             Gino ("deshacer temporal pero que un admin pueda recuperarlo"). ── */}
        {seccion === "papelera" && puedeVerPapelera && (
          <PapeleraPanel usuario={usuario} usuarios={usuarios} logear={logear} />
        )}
      </div>
    </div>
  );
}

// Tabla real en Supabase de cada entidad que pasa por la Papelera —
// usada solo por "Eliminar definitivamente" (DELETE real).
const TABLA_DB = { Cómputo: "computos", Anidado: "anidados", Presupuesto: "presupuestos_sm", Historial: "historial_trabajos" };

function PapeleraPanel({ usuario, usuarios, logear }) {
  const [computos, setComputos] = useState(() => loadLS("smeas_computos", []));
  const [anidados, setAnidados] = useState(() => loadLS("smeas_anidados", []));
  const [presupuestos, setPresupuestos] = useState(() => loadLS("smeas_presupuestos", []));
  const [historial, setHistorial] = useState(() => loadLS("smeas_historial", []));
  const [aPurgar, setAPurgar] = useState(null); // { item, tipo, setLista, lista, nombre } | null
  // 2026-09-03, a pedido de Gino: casillas de marcado para actuar sobre
  // varios registros de la papelera al mismo tiempo — clave compuesta
  // "tipo:id" porque las 4 listas pueden tener ids repetidos entre sí.
  const [seleccionados, setSeleccionados] = useState(() => new Set());
  const [loteAPurgar, setLoteAPurgar] = useState(false);
  const claveSel = (tipo, id) => tipo + ":" + id;
  const toggleSel = (tipo, id) => setSeleccionados(prev => {
    const next = new Set(prev);
    const k = claveSel(tipo, id);
    next.has(k) ? next.delete(k) : next.add(k);
    return next;
  });

  const restaurarComputo = async (c) => {
    const restaurado = { ...c, eliminado: false, eliminadoPor: null, eliminadoFecha: null };
    const next = computos.map(x => x.id === c.id ? restaurado : x);
    setComputos(next);
    saveLS("smeas_computos", next);
    const vendedor = usuarios.find(u => String(u.id) === String(restaurado.vendedor))?.profileId || null;
    const { cliente, comentarios, ...resto } = restaurado;
    try { await saveDBComputo({ ...resto, vendedor, eliminado_por: null, eliminado_fecha: null }); } catch (e) { console.warn("No se pudo sincronizar la restauración a la nube:", e.message || e); }
    logear?.("Cómputo restaurado", (c.nro || "") + " — " + (c.nombre || ""));
  };

  const restaurarAnidado = async (a) => {
    const restaurado = { ...a, eliminado: false, eliminadoPor: null, eliminadoFecha: null };
    const next = anidados.map(x => x.id === a.id ? restaurado : x);
    setAnidados(next);
    saveLS("smeas_anidados", next);
    const vendedor = usuarios.find(u => String(u.id) === String(restaurado.vendedor))?.profileId || null;
    const { cliente, comentarios, ...resto } = restaurado;
    try { await saveDBAnidado({ ...resto, vendedor, eliminado_por: null, eliminado_fecha: null }); } catch (e) { console.warn("No se pudo sincronizar la restauración a la nube:", e.message || e); }
    logear?.("Anidado restaurado", a.nombre || "");
  };

  const restaurarPresupuesto = async (p) => {
    const restaurado = { ...p, eliminado: false, eliminadoPor: null, eliminadoFecha: null };
    const next = presupuestos.map(x => x.id === p.id ? restaurado : x);
    setPresupuestos(next);
    saveLS("smeas_presupuestos", next);
    try {
      const nombreParaClientes = (restaurado.contacto || restaurado.cliente || "").trim();
      const empresaParaClientes = restaurado.contacto ? restaurado.cliente : null;
      const cliente_id = nombreParaClientes ? await resolverClienteId(nombreParaClientes, empresaParaClientes) : null;
      const vendedor = usuarios.find(u => String(u.id) === String(restaurado.vendedor))?.profileId || null;
      const { cliente, clonado_de, items, comentarios, ...resto } = restaurado;
      await saveDBPresupuestoSM({ ...resto, cliente_id, clonado_de_id: clonado_de || null, vendedor, eliminado_por: null, eliminado_fecha: null });
      for (const item of items || []) await saveDBItem(restaurado.id, item);
    } catch (e) { console.warn("No se pudo sincronizar la restauración a la nube:", e.message || e); }
    logear?.("Presupuesto restaurado", (p.nro || "") + " — " + (p.nombre || ""));
  };

  const restaurarTrabajo = async (t) => {
    const restaurado = { ...t, eliminado: false, eliminadoPor: null, eliminadoFecha: null };
    const next = historial.map(x => x.id === t.id ? restaurado : x);
    setHistorial(next);
    saveLS("smeas_historial", next);
    try {
      const cliente_id = restaurado.cliente ? await resolverClienteId(restaurado.cliente, restaurado.empresa) : null;
      const vendedor = usuarios.find(u => String(u.id) === String(restaurado.vendedor))?.profileId || null;
      const { cliente, desglose_pct, ...resto } = restaurado;
      const pct = desglose_pct || {};
      await saveDBTrabajoHistorico({
        ...resto, cliente_id, vendedor, eliminado_por: null, eliminado_fecha: null,
        pct_hier: pct.hier, pct_mat: pct.mat, pct_mo_fab: pct.moFab, pct_mo_mon: pct.moMon,
        pct_hesp: pct.hesp, pct_t_fab: pct.tFab, pct_t_mon: pct.tMon, pct_trat: pct.trat,
        pct_trasl: pct.trasl, pct_panto: pct.panto,
      });
    } catch (e) { console.warn("No se pudo sincronizar la restauración a la nube:", e.message || e); }
    logear?.("Trabajo restaurado", (t.nro_ot || "") + " — " + (t.cliente || ""));
  };

  const eliminadosComputo = computos.filter(c => c.eliminado);
  const eliminadosAnidado = anidados.filter(a => a.eliminado);
  const eliminadosPresupuesto = presupuestos.filter(p => p.eliminado);
  const eliminadosTrabajo = historial.filter(t => t.eliminado);

  const LISTAS = {
    Cómputo:     { lista: computos,     setLista: setComputos },
    Anidado:     { lista: anidados,     setLista: setAnidados },
    Presupuesto: { lista: presupuestos, setLista: setPresupuestos },
    Historial:   { lista: historial,    setLista: setHistorial },
  };
  const LS_KEY = { Cómputo: "smeas_computos", Anidado: "smeas_anidados", Presupuesto: "smeas_presupuestos", Historial: "smeas_historial" };

  // Combo "razonablemente único" por entidad, para el respaldo por match
  // cuando el id local no es uuid real (ver deleteFilaPorMatchDB) — solo
  // columnas que existen tal cual en la tabla remota (no alias locales
  // como "cliente", que en la nube es cliente_id).
  const matchDe = (tipo, item) => {
    if (tipo === "Cómputo")     return { nro: item.nro, nombre: item.nombre, fecha: item.fecha };
    if (tipo === "Anidado")     return { nombre: item.nombre, fecha: item.fecha, obra: item.obra };
    if (tipo === "Presupuesto") return { nro: item.nro, nombre: item.nombre, fecha: item.fecha };
    if (tipo === "Historial")   return { nro_ot: item.nro_ot, fecha: item.fecha, obra: item.obra };
    return {};
  };

  // "Eliminar definitivamente" (2026-08-25, admin-only, mismo diseño que
  // steelCRM) — DELETE real contra Supabase + saca del estado local. A
  // diferencia de Restaurar, esto no tiene deshacer. Si el id local no es
  // uuid real (registro legacy de antes de crypto.randomUUID()), no es el
  // mismo id que la fila remota — cae al respaldo por match en vez de
  // arriesgarse a un DELETE que no borra nada.
  const purgarUno = async (item, tipo) => {
    const { lista, setLista } = LISTAS[tipo];
    const next = lista.filter(x => x.id !== item.id);
    setLista(next);
    saveLS(LS_KEY[tipo], next);
    try {
      if (esUUID(item.id)) await deleteDBFila(TABLA_DB[tipo], item.id);
      else await deleteFilaPorMatchDB(TABLA_DB[tipo], matchDe(tipo, item));
    } catch (e) { console.warn("No se pudo borrar la fila real en Supabase:", e.message || e); }
    logear?.(`${tipo} eliminado definitivamente`, item.nro_ot || item.nro || item.nombre || item.cliente || "");
  };
  const purgar = async () => {
    if (!aPurgar) return;
    await purgarUno(aPurgar.item, aPurgar.tipo);
    setAPurgar(null);
  };

  const RESTAURAR = { Cómputo: restaurarComputo, Anidado: restaurarAnidado, Presupuesto: restaurarPresupuesto, Historial: restaurarTrabajo };
  const todosEliminados = [
    ...eliminadosComputo.map(item => ({ item, tipo: "Cómputo" })),
    ...eliminadosAnidado.map(item => ({ item, tipo: "Anidado" })),
    ...eliminadosPresupuesto.map(item => ({ item, tipo: "Presupuesto" })),
    ...eliminadosTrabajo.map(item => ({ item, tipo: "Historial" })),
  ];
  const seleccionadosItems = todosEliminados.filter(({ item, tipo }) => seleccionados.has(claveSel(tipo, item.id)));

  const restaurarLote = async () => {
    for (const { item, tipo } of seleccionadosItems) await RESTAURAR[tipo](item);
    setSeleccionados(new Set());
  };
  const purgarLote = async () => {
    for (const { item, tipo } of seleccionadosItems) await purgarUno(item, tipo);
    setSeleccionados(new Set());
    setLoteAPurgar(false);
  };

  const fila = (item, tipo, onRestaurar, titulo) => (
    <div key={tipo + item.id} style={{ display:"flex", gap:12, padding:"9px 0", borderBottom:`1px solid ${C.border}22`, fontSize:12, alignItems:"center" }}>
      <input type="checkbox" checked={seleccionados.has(claveSel(tipo, item.id))} onChange={() => toggleSel(tipo, item.id)}
        style={{ width:15, height:15, cursor:"pointer", flexShrink:0 }} />
      <span style={{ fontSize:11, fontWeight:700, color:C.muted, minWidth:70 }}>{tipo}</span>
      <div style={{ flex:1 }}>
        <div style={{ color:C.text, fontWeight:600 }}>{titulo ? titulo(item) : (item.nombre || item.nro || "Sin nombre")}</div>
        <div style={{ color:C.muted, fontSize:11 }}>
          Eliminado por {item.eliminadoPor || "?"} · {item.eliminadoFecha ? new Date(item.eliminadoFecha).toLocaleString("es-UY", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" }) : ""}
        </div>
      </div>
      <button onClick={() => onRestaurar(item)} style={{ ...BTN("ghost"), padding:"5px 14px", fontSize:12, borderColor:C.accent+"66", color:C.accent, whiteSpace:"nowrap" }}>
        ↩ Restaurar
      </button>
      {usuario?.rol === "admin" && (
        <button onClick={() => setAPurgar({ item, tipo, titulo: titulo ? titulo(item) : (item.nombre || item.nro || "Sin nombre") })}
          style={{ ...BTN("ghost"), padding:"5px 14px", fontSize:12, borderColor:C.err+"66", color:C.err, whiteSpace:"nowrap" }}>
          🗑️ Eliminar definitivamente
        </button>
      )}
    </div>
  );

  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
      {aPurgar && (
        <ModalConfirmarEliminar
          verbo="Eliminar definitivamente"
          titulo={`"${aPurgar.titulo}"`}
          subtitulo="Esto borra la fila real de la base de datos, no solo la marca eliminada. No queda en la Papelera después de esto — no hay vuelta atrás."
          labelBoton="🗑️ Eliminar definitivamente"
          usuarioPropio={usuario}
          onConfirm={purgar}
          onClose={() => setAPurgar(null)}
        />
      )}
      {loteAPurgar && (
        <ModalConfirmarEliminar
          verbo="Eliminar definitivamente"
          titulo={`${seleccionadosItems.length} registro(s) seleccionado(s)`}
          subtitulo="Esto borra las filas reales de la base de datos, no solo la marca eliminada. No quedan en la Papelera después de esto — no hay vuelta atrás."
          labelBoton="🗑️ Eliminar definitivamente"
          usuarioPropio={usuario}
          onConfirm={purgarLote}
          onClose={() => setLoteAPurgar(false)}
        />
      )}
      <div style={{ fontWeight:700, fontSize:14, color:C.steel, marginBottom:4 }}>🗑️ Papelera</div>
      <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>
        Cómputos, anidados, presupuestos y trabajos de historial eliminados. Restaurar los devuelve a su lista normal, sin límite de tiempo.
        Solo un admin puede eliminarlos definitivamente.
      </div>
      {eliminadosComputo.length === 0 && eliminadosAnidado.length === 0 && eliminadosPresupuesto.length === 0 && eliminadosTrabajo.length === 0
        ? <div style={{ color:C.muted, fontSize:13, textAlign:"center", padding:20 }}>✅ Todo limpio — no hay nada en la papelera</div>
        : <>
            {seleccionados.size > 0 && (
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", marginBottom:8, background:C.accent+"11", border:`1px solid ${C.accent}33`, borderRadius:8 }}>
                <span style={{ fontSize:12, color:C.accent, fontWeight:700 }}>{seleccionados.size} seleccionado{seleccionados.size!==1?"s":""}</span>
                <button onClick={restaurarLote} style={{ ...BTN("ghost"), padding:"4px 12px", fontSize:12, borderColor:C.accent+"66", color:C.accent }}>↩ Restaurar seleccionados</button>
                {usuario?.rol === "admin" && (
                  <button onClick={() => setLoteAPurgar(true)} style={{ ...BTN("ghost"), padding:"4px 12px", fontSize:12, borderColor:C.err+"66", color:C.err }}>🗑️ Eliminar definitivamente seleccionados</button>
                )}
                <button onClick={() => setSeleccionados(new Set())} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:12, marginLeft:"auto" }}>✕ Deseleccionar</button>
              </div>
            )}
            {eliminadosComputo.map(c => fila(c, "Cómputo", restaurarComputo))}
            {eliminadosAnidado.map(a => fila(a, "Anidado", restaurarAnidado))}
            {eliminadosPresupuesto.map(p => fila(p, "Presupuesto", restaurarPresupuesto))}
            {eliminadosTrabajo.map(t => fila(t, "Historial", restaurarTrabajo, x => (x.nro_ot||"") + (x.cliente?` — ${x.cliente}`:"") || "Sin OT"))}
          </>}
    </div>
  );
}
