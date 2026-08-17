import { useState } from "react";
import { C, INP, BTN } from "../styles/colors";
import { uid } from "../utils/storage";
import { ModalConfirmarEliminar } from "./ConfirmarEliminar";

// ─── GESTIÓN DE USUARIOS (alta/edición de vendedor/supervisor, admin-only) ─
const ROL_OPCIONES = [
  { value: "admin",      label: "Administrador" },
  { value: "supervisor", label: "Gerencia" },
  { value: "operario",   label: "Vendedor" },
];

function FilaUsuario({ u, soloLectura, esUltimoAdmin, onChange, onEliminar }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, flexWrap:"wrap" }}>
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
  const add = () => setUsuarios(prev => [...prev, { id: uid(), nombre:"", rol:"operario", emoji:"👤", clave:"" }]);
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
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
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
