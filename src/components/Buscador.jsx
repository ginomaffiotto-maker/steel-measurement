import { useState } from "react";
import { C, INP, LBL, BDG, BTN } from "../styles/colors";
import { loadLS, saveLS } from "../utils/storage";

const n2 = v => (Math.round((+v || 0) * 100) / 100).toFixed(2);

// Normaliza cada tipo de registro a una forma común para buscar/mostrar.
function normalizar() {
  const computos    = loadLS("smeas_computos", []);
  const anidados    = loadLS("smeas_anidados", []);
  const presupuestos = loadLS("smeas_presupuestos", []);
  const historial   = loadLS("smeas_historial", []);

  const filas = [];
  computos.forEach(c => filas.push({
    tipo: "computo", id: c.id, icon: "📐", label: "Cómputo",
    titulo: c.nombre || "Sin nombre", sub: c.nro || "", fecha: c.fecha || "",
    texto: [c.nombre, c.nro].join(" "),
  }));
  anidados.forEach(a => filas.push({
    tipo: "anidado", id: a.id, icon: "✂️", label: "Anidado",
    titulo: a.nombre || "Sin nombre", sub: `${(a.grupos||[]).length} grupos`, fecha: a.fecha || "",
    texto: [a.nombre].join(" "),
  }));
  presupuestos.forEach(p => filas.push({
    tipo: "presupuesto", id: p.id, icon: "💰", label: "Presupuesto",
    titulo: p.nombre || "Sin nombre", sub: `${p.nro || ""} · ${p.cliente || "sin cliente"}`, fecha: p.fecha || "",
    texto: [p.nombre, p.nro, p.cliente, p.obra, p.detalle].join(" "),
  }));
  historial.forEach(h => filas.push({
    tipo: "historial", id: h.id, icon: "📊", label: "Historial",
    titulo: h.cliente || h.nro_ot || "Sin cliente", sub: `${h.nro_ot || ""} · ${h.categoria || "sin categoría"} · $${n2(h.usd_total)}`, fecha: h.fecha || "",
    texto: [h.nro_ot, h.cliente, h.obra, h.categoria].join(" "),
  }));
  return filas;
}

const TAB_DESTINO = { computo: "Computo", anidado: "Anidado", presupuesto: "Presupuesto", historial: "Historial" };
const PEND_KEY = { computo: "smeas_ir_a_computo", anidado: "smeas_ir_a_anidado", presupuesto: "smeas_ir_a_presupuesto", historial: "smeas_ir_a_historial" };

export default function Buscador({ onIrA }) {
  const [texto, setTexto] = useState("");
  const [cliente, setCliente] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");

  const todas = normalizar();
  const activo = texto.trim() || cliente.trim() || fechaDesde || fechaHasta || tipoFiltro;

  // Sin el filtro de tipo — así los badges muestran cuántos hay de cada uno
  // para los filtros de texto/cliente/fecha actuales, no solo del tipo ya
  // elegido (que siempre daría 0 en los demás).
  const porTexto = todas
    .filter(f => !texto.trim() || f.texto.toLowerCase().includes(texto.trim().toLowerCase()))
    .filter(f => !cliente.trim() || f.texto.toLowerCase().includes(cliente.trim().toLowerCase()))
    .filter(f => !fechaDesde || (f.fecha && f.fecha >= fechaDesde))
    .filter(f => !fechaHasta || (f.fecha && f.fecha <= fechaHasta));

  const resultados = porTexto
    .filter(f => !tipoFiltro || f.tipo === tipoFiltro)
    .sort((a,b) => (b.fecha||"").localeCompare(a.fecha||""));

  const ir = (fila) => {
    saveLS(PEND_KEY[fila.tipo], fila.id);
    onIrA && onIrA(TAB_DESTINO[fila.tipo]);
  };

  const conteos = { computo:0, anidado:0, presupuesto:0, historial:0 };
  porTexto.forEach(f => conteos[f.tipo]++);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
        <span style={{ fontSize:20 }}>🔍</span>
        <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:C.text }}>Buscador Global</h2>
      </div>

      <div style={{ fontSize:12, color:C.muted, marginBottom:16, maxWidth:640 }}>
        Busca en Cómputos, Anidados, Presupuestos e Historial a la vez, por texto, cliente
        (solo aplica a Presupuesto/Historial, que son los que tienen ese dato) y rango de
        fecha. Hacé clic en un resultado para ir directo a él.
      </div>

      <div style={{ display:"flex", gap:16, marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ flex:"2 1 280px" }}>
          <label style={LBL}>Texto (nombre, N°, obra...)</label>
          <input style={{...INP, width:"100%"}} value={texto} placeholder="Buscar..." onChange={e=>setTexto(e.target.value)} />
        </div>
        <div style={{ flex:"1 1 220px" }}>
          <label style={LBL}>Cliente</label>
          <input style={{...INP, width:"100%"}} value={cliente} placeholder="Nombre del cliente" onChange={e=>setCliente(e.target.value)} />
        </div>
        <div style={{ flex:"1 1 180px" }}>
          <label style={LBL}>Desde</label>
          <input type="date" style={{...INP, width:"100%"}} value={fechaDesde} onChange={e=>setFechaDesde(e.target.value)} />
        </div>
        <div style={{ flex:"1 1 180px" }}>
          <label style={LBL}>Hasta</label>
          <input type="date" style={{...INP, width:"100%"}} value={fechaHasta} onChange={e=>setFechaHasta(e.target.value)} />
        </div>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <button onClick={()=>setTipoFiltro("")} style={{...BTN(tipoFiltro===""?"ok":"ghost"), padding:"7px 18px", fontSize:12}}>Todos ({todas.length})</button>
        <button onClick={()=>setTipoFiltro("computo")} style={{...BTN(tipoFiltro==="computo"?"ok":"ghost"), padding:"7px 18px", fontSize:12}}>📐 Cómputos ({conteos.computo})</button>
        <button onClick={()=>setTipoFiltro("anidado")} style={{...BTN(tipoFiltro==="anidado"?"ok":"ghost"), padding:"7px 18px", fontSize:12}}>✂️ Anidados ({conteos.anidado})</button>
        <button onClick={()=>setTipoFiltro("presupuesto")} style={{...BTN(tipoFiltro==="presupuesto"?"ok":"ghost"), padding:"7px 18px", fontSize:12}}>💰 Presupuestos ({conteos.presupuesto})</button>
        <button onClick={()=>setTipoFiltro("historial")} style={{...BTN(tipoFiltro==="historial"?"ok":"ghost"), padding:"7px 18px", fontSize:12}}>📊 Historial ({conteos.historial})</button>
      </div>

      {!activo && (
        <div style={{ textAlign:"center", color:C.muted, padding:"40px 0", fontSize:13 }}>
          Escribí algo o elegí un tipo para buscar. Hay {todas.length} registros en total
          ({conteos.computo && `${todas.filter(f=>f.tipo==="computo").length} cómputos`}).
        </div>
      )}

      {activo && resultados.length === 0 && (
        <div style={{ textAlign:"center", color:C.muted, padding:"40px 0", fontSize:13 }}>Sin resultados.</div>
      )}

      {activo && resultados.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {resultados.map(f => (
            <div key={`${f.tipo}_${f.id}`} onClick={()=>ir(f)}
              style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px",
                display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent+"88"}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <span style={{ fontSize:16 }}>{f.icon}</span>
              <span style={BDG(C.muted,true)}>{f.label}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13, color:C.text }}>{f.titulo}</div>
                <div style={{ fontSize:11, color:C.muted }}>{f.sub}</div>
              </div>
              <span style={{ fontSize:11, color:C.muted }}>{f.fecha}</span>
              <span style={{ color:C.accent, fontSize:14 }}>→</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
