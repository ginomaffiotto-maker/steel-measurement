import { useState } from "react";
import { C, BDG, BTN } from "../styles/colors";
import {
  loadLS, saveLS,
  useMergeComputosNube, useMergeAnidadosNube, useMergePresupuestosNube, useMergeHistorialNube,
} from "../utils/storage";
import { FAMILIAS, TIPOS_TRABAJO, familiaDe } from "../utils/taxonomia";
import FiltrosBar from "./FiltrosBar";

const n2 = v => (Math.round((+v || 0) * 100) / 100).toFixed(2);

// Normaliza cada tipo de registro a una forma común para buscar/mostrar.
// Recibe las 4 listas por parámetro (no las lee de localStorage directo) —
// mismo bug real que tenía Dashboard (2026-09-03): sin esto, Buscador
// mostraba 0 en Cómputos/Anidados/Presupuestos si era la primera pantalla
// visitada, porque el merge de Fase 5 sólo corría en las pantallas dueñas
// (Cómputo/Anidado/Presupuesto/Historial).
function normalizar(computos, anidados, presupuestos, historial) {
  const filas = [];
  computos.filter(c => !c.eliminado).forEach(c => filas.push({
    tipo: "computo", id: c.id, icon: "📐", label: "Cómputo",
    titulo: c.nombre || "Sin nombre", sub: c.nro || "", fecha: c.fecha || "",
    texto: [c.nombre, c.nro].join(" "),
    vendedor: c.vendedor || "", categoria: c.categoria || "", tipo_trabajo: c.tipo_trabajo || "",
  }));
  anidados.filter(a => !a.eliminado).forEach(a => filas.push({
    tipo: "anidado", id: a.id, icon: "✂️", label: "Anidado",
    titulo: a.nombre || "Sin nombre", sub: `${(a.grupos||[]).length} grupos`, fecha: a.fecha || "",
    texto: [a.nombre].join(" "),
    vendedor: a.vendedor || "", categoria: a.categoria || "", tipo_trabajo: a.tipo_trabajo || "",
  }));
  presupuestos.filter(p => !p.eliminado).forEach(p => filas.push({
    tipo: "presupuesto", id: p.id, icon: "💰", label: "Presupuesto",
    titulo: p.nombre || "Sin nombre", sub: `${p.nro || ""} · ${p.cliente || "sin cliente"}`, fecha: p.fecha || "",
    texto: [p.nombre, p.nro, p.cliente, p.obra, p.detalle].join(" "),
    vendedor: p.vendedor || "", categoria: p.categoria || "", tipo_trabajo: p.tipo_trabajo || "",
  }));
  historial.filter(h => !h.eliminado).forEach(h => filas.push({
    tipo: "historial", id: h.id, icon: "📊", label: "Historial",
    titulo: h.cliente || h.nro_ot || "Sin cliente", sub: `${h.nro_ot || ""} · ${h.categoria || "sin categoría"} · $${n2(h.usd_total)}`, fecha: h.fecha || "",
    texto: [h.nro_ot, h.cliente, h.obra, h.categoria].join(" "),
    vendedor: h.vendedor || "", categoria: h.categoria || "", tipo_trabajo: h.tipo_trabajo || "",
  }));
  return filas;
}

const TAB_DESTINO = { computo: "Computo", anidado: "Anidado", presupuesto: "Presupuesto", historial: "Historial" };
const PEND_KEY = { computo: "smeas_ir_a_computo", anidado: "smeas_ir_a_anidado", presupuesto: "smeas_ir_a_presupuesto", historial: "smeas_ir_a_historial" };

const FILT_DEFAULTS = { texto: "", cliente: "", desde: "", hasta: "", familia: "", tipo: "", vendedor: "" };
function buscadorCampos(usuarios) {
  const campos = [
    { key: "texto", label: "Texto (nombre, N°, obra...)", type: "text", placeholder: "Buscar...", flex: "2 1 280px", minWidth: 280 },
    { key: "cliente", label: "Cliente", type: "text", placeholder: "Nombre del cliente", flex: "1 1 220px", minWidth: 220 },
    { key: "desde", label: "Desde", type: "date", flex: "1 1 180px", minWidth: 180 },
    { key: "hasta", label: "Hasta", type: "date", flex: "1 1 180px", minWidth: 180 },
    { key: "familia", label: "Familia", type: "select", options: Object.keys(FAMILIAS), flex: "1 1 170px", minWidth: 170 },
    { key: "tipo", label: "Tipo", type: "select", options: TIPOS_TRABAJO, flex: "1 1 140px", minWidth: 140 },
  ];
  if (usuarios.length > 0) campos.push({ key: "vendedor", label: "Vendedor", type: "select", options: usuarios.map(u => ({ value: u.id, label: u.nombre })), flex: "1 1 170px", minWidth: 170 });
  return campos;
}

export default function Buscador({ onIrA, usuarios = [] }) {
  const [filt, setFilt] = useState(FILT_DEFAULTS);
  const [abierto, setAbierto] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState("");

  const [computos, setComputos] = useState(() => loadLS("smeas_computos", []));
  useMergeComputosNube(setComputos, usuarios);
  const [anidados, setAnidados] = useState(() => loadLS("smeas_anidados", []));
  useMergeAnidadosNube(setAnidados, usuarios);
  const [presupuestos, setPresupuestos] = useState(() => loadLS("smeas_presupuestos", []));
  useMergePresupuestosNube(setPresupuestos, usuarios);
  const [historial, setHistorial] = useState(() => loadLS("smeas_historial", []));
  useMergeHistorialNube(setHistorial);

  const todas = normalizar(computos, anidados, presupuestos, historial);
  const activo = filt.texto.trim() || filt.cliente.trim() || filt.desde || filt.hasta || filt.familia || filt.tipo || filt.vendedor || tipoFiltro;

  // Sin el filtro de tipo — así los badges muestran cuántos hay de cada uno
  // para los filtros de texto/cliente/fecha actuales, no solo del tipo ya
  // elegido (que siempre daría 0 en los demás).
  const porTexto = todas
    .filter(f => !filt.texto.trim() || f.texto.toLowerCase().includes(filt.texto.trim().toLowerCase()))
    .filter(f => !filt.cliente.trim() || f.texto.toLowerCase().includes(filt.cliente.trim().toLowerCase()))
    .filter(f => !filt.desde || (f.fecha && f.fecha >= filt.desde))
    .filter(f => !filt.hasta || (f.fecha && f.fecha <= filt.hasta))
    .filter(f => !filt.vendedor || String(f.vendedor) === filt.vendedor)
    .filter(f => !filt.tipo || f.tipo_trabajo === filt.tipo)
    .filter(f => !filt.familia || familiaDe(f.categoria) === filt.familia);

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

      <FiltrosBar campos={buscadorCampos(usuarios)} valores={filt} setValores={setFilt} defaults={FILT_DEFAULTS}
        abierto={abierto} setAbierto={setAbierto} />

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
