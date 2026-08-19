import { useState, useRef } from "react";
import { C, INP, LBL, BTN } from "../styles/colors";
import { uid, loadLS, saveLS, loadNumeracion, saveNumeracion } from "../utils/storage";
import { ModalConfirmarEliminar } from "./ConfirmarEliminar";

// ─── GESTIÓN DE USUARIOS (alta/edición de vendedor/supervisor, admin-only) ─
const ROL_OPCIONES = [
  { value: "admin",      label: "Administrador" },
  { value: "supervisor", label: "Gerencia" },
  { value: "operario",   label: "Vendedor" },
];

function FilaUsuario({ u, soloLectura, esUltimoAdmin, onChange, onEliminar }) {
  const [show, setShow] = useState(false);
  const fotoRef = useRef();
  const handleFoto = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => onChange({ ...u, foto: ev.target.result });
    r.readAsDataURL(f);
  };
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, flexWrap:"wrap" }}>
      <input ref={fotoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFoto} />
      <div title={soloLectura ? "" : "Click para cambiar la foto"}
        onClick={() => !soloLectura && fotoRef.current.click()}
        style={{ width:32, height:32, borderRadius:"50%", flexShrink:0, cursor: soloLectura?"default":"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden",
          background: u.foto ? "transparent" : C.accent+"22", border:"1px solid "+C.border }}>
        {u.foto
          ? <img src={u.foto} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          : <span style={{ fontSize:16 }}>{u.emoji || "👤"}</span>}
      </div>
      <input value={u.emoji||""} placeholder="👤" disabled={soloLectura}
        onChange={e=>onChange({...u, emoji:e.target.value})}
        style={{ ...INP, width:44, textAlign:"center", opacity: soloLectura?0.6:1 }} />
      <input value={u.nombre} placeholder="Nombre" disabled={soloLectura}
        onChange={e=>onChange({...u, nombre:e.target.value})}
        style={{ ...INP, flex:"1 1 120px", opacity: soloLectura?0.6:1 }} />
      <select value={u.rol} disabled={soloLectura}
        onChange={e=>onChange({...u, rol:e.target.value})}
        style={{ ...INP, width:130, opacity: soloLectura?0.6:1 }}>
        {ROL_OPCIONES.map(r=><option key={r.value} value={r.value}>{r.label}</option>)}
      </select>
      <div style={{ position:"relative", width:110 }}>
        <input type={show?"text":"password"} value={u.clave||""} placeholder="Sin clave" disabled={soloLectura}
          onChange={e=>onChange({...u, clave:e.target.value})}
          style={{ ...INP, width:"100%", paddingRight:26, opacity: soloLectura?0.6:1, boxSizing:"border-box" }} />
        <span onClick={()=>setShow(v=>!v)} style={{ position:"absolute", right:6, top:7, cursor:"pointer", fontSize:12, color:C.muted }}>
          {show ? "🙈" : "👁️"}
        </span>
      </div>
      {!soloLectura && (
        <button onClick={onEliminar} disabled={esUltimoAdmin}
          title={esUltimoAdmin ? "No podés eliminar el último Administrador" : "Eliminar usuario"}
          style={{ background:"none", border:"none", color: esUltimoAdmin?C.muted:C.err, cursor: esUltimoAdmin?"not-allowed":"pointer", fontSize:14 }}>🗑</button>
      )}
    </div>
  );
}

function GestionUsuarios({ usuarios, setUsuarios, soloLectura }) {
  const [confirmarDelId, setConfirmarDelId] = useState(null);
  const upd = (id, nuevo) => setUsuarios(prev => prev.map(u => u.id===id ? nuevo : u));
  const add = () => setUsuarios(prev => [...prev, { id: uid(), nombre:"", rol:"operario", emoji:"👤", foto:"", clave:"" }]);
  const del = (id) => { setUsuarios(prev => prev.filter(u=>u.id!==id)); setConfirmarDelId(null); };
  const admins = usuarios.filter(u=>u.rol==="admin");
  const objDel = usuarios.find(u=>u.id===confirmarDelId);

  return (
    <div>
      {usuarios.length===0 && <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>Sin usuarios todavía.</div>}
      {usuarios.map(u => (
        <FilaUsuario key={u.id} u={u} soloLectura={soloLectura}
          esUltimoAdmin={u.rol==="admin" && admins.length<=1}
          onChange={nuevo=>upd(u.id,nuevo)}
          onEliminar={()=>setConfirmarDelId(u.id)} />
      ))}
      {!soloLectura && (
        <button onClick={add} style={{ ...BTN("ghost"), marginTop:4, fontSize:11, padding:"5px 12px" }}>+ Agregar usuario</button>
      )}
      {confirmarDelId && objDel && (
        <ModalConfirmarEliminar titulo={`a ${objDel.nombre || "este usuario"}`}
          subtitulo="El usuario ya no va a poder ingresar al sistema."
          onConfirm={()=>del(confirmarDelId)} onClose={()=>setConfirmarDelId(null)} />
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
          ⚠ Solo lectura — solo Administrador puede editar usuarios.
        </div>
      )}

      <div style={{ maxWidth:680 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, marginBottom:16 }}>
          <div style={{ fontWeight:700, color:C.accent, fontSize:13, marginBottom:4 }}>🏢 Empresa</div>
          <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>
            Aparece en el PDF de presupuesto y donde el sistema muestre el nombre de la empresa. Sin esto configurado, el PDF sale sin nombre de empresa.
          </div>
          <label style={LBL}>Nombre de la empresa</label>
          <input style={INP} value={empresa} placeholder="Ej: Montajes Núñez S.A."
            disabled={soloLectura}
            onChange={e => guardarEmpresa(e.target.value)} />
        </div>

        <NumeracionPresupuestos soloLectura={soloLectura} />

        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, marginTop:16 }}>
          <div style={{ fontWeight:700, color:C.accent, fontSize:13, marginBottom:4 }}>👤 Usuarios</div>
          <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>
            Administrador ve todo el sistema · Gerencia ve el equipo y aprueba · Vendedor ve sus propios datos.
            No se puede eliminar el último Administrador.
          </div>
          <GestionUsuarios usuarios={usuarios} setUsuarios={setUsuarios} soloLectura={soloLectura} />
        </div>
      </div>
    </div>
  );
}
