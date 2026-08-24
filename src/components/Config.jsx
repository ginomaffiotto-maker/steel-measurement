import { useState, useRef } from "react";
import { C, INP, LBL, BTN, TEMA_ACTUAL, TEMAS_DISPONIBLES, cambiarTema } from "../styles/colors";
import { loadLS, saveLS, loadNumeracion, saveNumeracion, loadBloquesPDF, saveBloquesPDF, exportBackup, parseBackup, restoreBackup, migrarTodoALaNube } from "../utils/storage";
import { supabase } from "../utils/supabaseClient";
import { ModalConfirmarEliminar, puedeEliminar } from "./ConfirmarEliminar";
import { BLOQUES_DEFAULT, BLOQUES_LABELS } from "../utils/pdfPresupuesto";

// ─── GESTIÓN DE USUARIOS ─────────────────────────────────────────────────
// Mismo mecanismo que steelCRM (mismo backend Supabase compartido): no hay
// alta local (creaba cuentas fantasma que nunca podían loguearse de
// verdad, y el rol local "operario" no coincidía con el vocabulario real
// admin/supervisor/vendedor de profiles.rol) — se invita por email y la
// persona elige su propia contraseña. Cambiar el rol de alguien con cuenta
// real (profileId) sincroniza profiles.rol en Supabase, permitido solo a
// admin por la política profiles_update_admin.
const ROL_LABEL = { admin: "Administrador", supervisor: "Gerencia", vendedor: "Vendedor" };

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
  const [comandoEliminar, setComandoEliminar] = useState("");
  const [comandoEliminarCopiado, setComandoEliminarCopiado] = useState(false);
  const objDel = usuarios.find(u => u.id === confirmarDelId);
  const admins = usuarios.filter(u => u.rol === "admin");

  const abrirEdit = (u) => { setEditId(u.id); setRolEdit(u.rol); setNombreEdit(u.nombre); };
  const guardarEdit = () => {
    const original = usuarios.find(u => u.id === editId);
    setUsuarios(prev => prev.map(u => u.id === editId ? { ...u, nombre: nombreEdit, rol: rolEdit } : u));
    if (original?.profileId && supabase) {
      supabase.from("profiles").update({ rol: rolEdit, nombre: nombreEdit }).eq("id", original.profileId)
        .then(({ error }) => { if (error) console.warn("update profile rol", error); });
    }
    setEditId(null);
  };
  // Borrar acá solo saca a la persona de la lista local — no alcanza para
  // impedirle loguearse de nuevo, porque revocar la cuenta real de Supabase
  // Auth necesita la service_role key (nunca puede tocar el navegador). Si
  // tenía cuenta real (profileId), arma el comando para eliminar-usuario.mjs.
  const del = (id) => {
    const u = usuarios.find(x => x.id === id);
    setUsuarios(prev => prev.filter(x => x.id !== id));
    setConfirmarDelId(null);
    if (u?.profileId && u?.email) setComandoEliminar(`$env:EMAIL_ELIMINAR = "${u.email}"\nnode scripts/eliminar-usuario.mjs`);
  };
  const copiarComandoEliminar = () => { navigator.clipboard.writeText(comandoEliminar).then(() => { setComandoEliminarCopiado(true); setTimeout(() => setComandoEliminarCopiado(false), 2000); }); };

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
              <div style={{ fontSize:13, fontWeight:700 }}>{u.nombre || "(sin nombre)"} {usuario?.id === u.id && <span style={{ fontSize:10, color:C.accent }}>· vos</span>}</div>
              {!u.profileId && <div style={{ fontSize:10, color:C.muted }}>Sin cuenta real todavía</div>}
            </div>
            <div style={{ fontSize:12, color:C.muted, minWidth:100 }}>{ROL_LABEL[u.rol] || u.rol}</div>
            {esAdmin && <button onClick={() => abrirEdit(u)} style={{ background:"none", border:"none", color:C.accent, cursor:"pointer", fontSize:12 }}>✏️</button>}
            {esAdmin && !esUltimoAdmin && usuario?.id !== u.id && (
              <button onClick={() => setConfirmarDelId(u.id)} style={{ background:"none", border:"none", color:C.err, cursor:"pointer", fontSize:14 }}>🗑</button>
            )}
          </div>
        );
      })}

      {comandoEliminar && (
        <div style={{ background:C.err+"0e", borderRadius:8, padding:"10px 12px", border:`1px solid ${C.err}44`, marginTop:8 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.err, marginBottom:6 }}>⚠ Falta revocar el acceso real</div>
          <pre style={{ margin:0, fontFamily:"monospace", fontSize:11, color:C.muted, whiteSpace:"pre-wrap" }}>{comandoEliminar}</pre>
          <div style={{ display:"flex", gap:12, marginTop:8, alignItems:"center" }}>
            <button onClick={copiarComandoEliminar} style={{ fontSize:11, color:C.accent, background:"none", border:"none", cursor:"pointer", padding:0 }}>{comandoEliminarCopiado ? "✅ Copiado" : "📋 Copiar"}</button>
            <button onClick={() => setComandoEliminar("")} style={{ fontSize:11, color:C.muted, background:"none", border:"none", cursor:"pointer", padding:0 }}>Ya lo corrí, cerrar</button>
          </div>
          <div style={{ marginTop:8, fontSize:11, color:C.muted }}>Pegalo en tu terminal, en steel-backend — sin esto, la persona sigue pudiendo loguearse.</div>
        </div>
      )}

      {editId && (
        <div style={{ marginTop:12, padding:12, background:C.bg, borderRadius:8, border:`1px solid ${C.border}44` }}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <input value={nombreEdit} onChange={e=>setNombreEdit(e.target.value)} style={{ ...INP, flex:"1 1 140px" }} placeholder="Nombre" />
            <select value={rolEdit} onChange={e=>setRolEdit(e.target.value)} style={{ ...INP, width:150 }}>
              <option value="admin">Administrador</option>
              <option value="supervisor">Gerencia</option>
              <option value="vendedor">Vendedor</option>
            </select>
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
            ? "Se borra de esta lista — su cuenta real va a seguir pudiendo loguearse hasta que corras el comando de revocación que va a aparecer después."
            : "Se borra de esta lista local."}
          onConfirm={() => del(confirmarDelId)} onClose={() => setConfirmarDelId(null)} />
      )}
    </div>
  );
}

function InvitarUsuario() {
  const [form, setForm] = useState({ nombre:"", email:"", rol:"vendedor" });
  const [comando, setComando] = useState("");
  const [copiado, setCopiado] = useState(false);
  const generar = () => {
    if (!form.nombre.trim() || !form.email.trim()) { alert("Ingresá nombre y email"); return; }
    const cmd = [
      `$env:NUEVO_EMAIL = "${form.email.trim()}"`,
      `$env:NUEVO_NOMBRE = "${form.nombre.trim()}"`,
      `$env:NUEVO_ROL = "${form.rol}"`,
      `node scripts/crear-usuario.mjs`,
    ].join("\n");
    setComando(cmd); setCopiado(false);
  };
  const copiar = () => { navigator.clipboard.writeText(comando).then(() => { setCopiado(true); setTimeout(()=>setCopiado(false), 2000); }); };
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, marginTop:16 }}>
      <div style={{ fontWeight:700, color:C.accent, fontSize:13, marginBottom:4 }}>✉️ Invitar usuario nuevo</div>
      <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>La persona recibe un mail para elegir su propia contraseña — sirve para entrar acá y a steelCRM (mismo backend), si el tenant también lo usa.</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12 }}>
        <div><label style={LBL}>Nombre</label><input style={INP} value={form.nombre} onChange={e=>setForm(f=>({...f, nombre:e.target.value}))} placeholder="Nombre completo" /></div>
        <div><label style={LBL}>Email</label><input type="email" style={INP} value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} placeholder="persona@ejemplo.com" /></div>
        <div><label style={LBL}>Rol</label>
          <select style={INP} value={form.rol} onChange={e=>setForm(f=>({...f, rol:e.target.value}))}>
            <option value="admin">Administrador</option>
            <option value="supervisor">Gerencia</option>
            <option value="vendedor">Vendedor</option>
          </select>
        </div>
      </div>
      <button onClick={generar} style={{ ...BTN("ghost"), marginTop:10, fontSize:12, padding:"6px 14px" }}>Generar comando de invitación</button>
      {comando && (
        <div style={{ marginTop:12, background:C.bg, borderRadius:8, padding:"10px 12px", border:`1px solid ${C.border}44` }}>
          <pre style={{ margin:0, fontFamily:"monospace", fontSize:11, color:C.muted, whiteSpace:"pre-wrap" }}>{comando}</pre>
          <button onClick={copiar} style={{ marginTop:8, fontSize:11, color:C.accent, background:"none", border:"none", cursor:"pointer", padding:0 }}>{copiado ? "✅ Copiado" : "📋 Copiar"}</button>
          <div style={{ marginTop:8, fontSize:11, color:C.muted }}>Pegalo en tu terminal, en la carpeta steel-backend (con SUPABASE_SERVICE_ROLE_KEY ya configurada ahí).</div>
        </div>
      )}
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
  const set = (patch) => { const n = { ...cfg, ...patch }; setCfg(n); saveNumeracion(n); };
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
            Usalo si el número real de tu sistema externo (ej: GestSoft) ya va más adelante que este contador.
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

// ─── BLOQUES DEL PDF ─────────────────────────────────────────────────────
function DisenoPDF({ soloLectura }) {
  const [bloques, setBloques] = useState(() => loadBloquesPDF() || BLOQUES_DEFAULT.map(b => ({ ...b })));
  const guardar = (nuevos) => { setBloques(nuevos); saveBloquesPDF(nuevos); };
  const toggle = (i) => { if (soloLectura) return; const n = bloques.map((b, idx) => idx === i ? { ...b, activo: !b.activo } : b); guardar(n); };
  const mover = (i, dir) => {
    if (soloLectura) return;
    const j = i + dir;
    if (j < 0 || j >= bloques.length) return;
    const n = bloques.slice();
    [n[i], n[j]] = [n[j], n[i]];
    guardar(n);
  };
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, marginBottom:16 }}>
      <div style={{ fontWeight:700, color:C.accent, fontSize:13, marginBottom:4 }}>📄 Diseño del PDF</div>
      <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>
        Qué secciones aparecen en el PDF de presupuesto y en qué orden. Afecta a los presupuestos generados de acá en adelante.
      </div>
      {bloques.map((b, i) => (
        <div key={b.tipo} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom: i < bloques.length-1 ? "1px solid "+C.border+"44" : "none" }}>
          <input type="checkbox" checked={b.activo} disabled={soloLectura} onChange={()=>toggle(i)} style={{ cursor: soloLectura?"default":"pointer" }} />
          <span style={{ flex:1, fontSize:13, color: b.activo ? C.text : C.muted }}>{BLOQUES_LABELS[b.tipo] || b.tipo}</span>
          <button onClick={()=>mover(i,-1)} disabled={soloLectura || i===0} style={{ background:"none", border:"none", cursor: (soloLectura||i===0)?"default":"pointer", color: (soloLectura||i===0)?C.border:C.muted, fontSize:14 }}>▲</button>
          <button onClick={()=>mover(i,1)} disabled={soloLectura || i===bloques.length-1} style={{ background:"none", border:"none", cursor: (soloLectura||i===bloques.length-1)?"default":"pointer", color: (soloLectura||i===bloques.length-1)?C.border:C.muted, fontSize:14 }}>▼</button>
        </div>
      ))}
    </div>
  );
}

// ─── BACKUP Y DATOS ──────────────────────────────────────────────────────
// Movido acá desde el sidebar (vivía como botones sueltos al pie, sin
// relación visual con el resto de la configuración del sistema).
function BackupYDatos({ usuario }) {
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
    </div>
  );
}

// El tarifario (MO, materiales generales, terceriz., traslados, tratamiento de
// superficie, pantógrafo) vive en el módulo "Insumos y Precios" junto a la
// Biblioteca de materiales — acá solo queda lo que es admin-only del sistema.
export default function Config({ usuario, usuarios, setUsuarios }) {
  // Si por error nadie quedó con rol Administrador, la pantalla se
  // desbloquea igual — si no, quedaría un candado circular: sin admin no
  // se puede editar usuarios, pero sin editar usuarios no se puede volver
  // a tener un admin.
  const hayAdmin = usuarios.some(u => u.rol === "admin");
  const soloLectura = usuario?.rol !== "admin" && hayAdmin;

  const [empresa, setEmpresa] = useState(() => loadLS("smeas_empresa", ""));
  const guardarEmpresa = (v) => { setEmpresa(v); saveLS("smeas_empresa", v); };
  // Mismos campos que se agregaron en steelCRM (mismo PDF compartido) —
  // direccion/RUT/tel/email/web/logo, guardados en un solo objeto.
  const [empresaDatos, setEmpresaDatos] = useState(() => loadLS("smeas_empresa_datos", { direccion: "", rut: "", tel: "", email: "", web: "", logo: "" }));
  const setEmpresaDato = (k, v) => setEmpresaDatos(prev => { const n = { ...prev, [k]: v }; saveLS("smeas_empresa_datos", n); return n; });
  const logoRef = useRef();
  const handleLogo = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => setEmpresaDato("logo", ev.target.result);
    r.readAsDataURL(f);
  };
  const [seccion, setSeccion] = useState("empresa");

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
      </div>

      <div style={{ maxWidth:680 }}>
        {seccion === "empresa" && (
          <div>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, marginBottom:16 }}>
              <div style={{ fontWeight:700, color:C.accent, fontSize:13, marginBottom:4 }}>🏢 Datos de la empresa</div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>
                Aparece en el PDF de presupuesto y donde el sistema muestre el nombre de la empresa. Sin el nombre configurado, el PDF sale sin nombre de empresa.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:12 }}>
                <div style={{ gridColumn:"span 2" }}>
                  <label style={LBL}>Nombre de la empresa</label>
                  <input style={INP} value={empresa} placeholder="Ej: Montajes Núñez S.A." disabled={soloLectura} onChange={e => guardarEmpresa(e.target.value)} />
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
              <div style={{ fontWeight:700, color:C.accent, fontSize:13, marginBottom:4 }}>🖼️ Logo para el PDF</div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>Aparece en el encabezado del PDF de presupuesto, junto a los datos de la empresa.</div>
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
            <DisenoPDF soloLectura={soloLectura} />

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
          </div>
        )}

        {seccion === "usuarios" && (
          <div>
            <MiCuenta usuario={usuario} />
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
              <div style={{ fontWeight:700, color:C.accent, fontSize:13, marginBottom:4 }}>👤 Equipo</div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>
                Administrador ve todo el sistema · Gerencia ve el equipo y aprueba · Vendedor ve sus propios datos.
                No se puede eliminar el último Administrador.
              </div>
              <EquipoUsuarios usuarios={usuarios} setUsuarios={setUsuarios} usuario={usuario} esAdmin={usuario?.rol === "admin"} />
            </div>
            {usuario?.rol === "admin" && <InvitarUsuario />}
          </div>
        )}

        {seccion === "backup" && <BackupYDatos usuario={usuario} />}
      </div>
    </div>
  );
}
