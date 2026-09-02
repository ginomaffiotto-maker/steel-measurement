import { useState, useMemo, useRef, useEffect } from "react";
import { C, TH, TD, INP, LBL, BDG, BTN } from "../styles/colors";
import { saveLS, loadLS, uid, stamp, touch, resolverClienteId, saveDBAnidado, useMergeAnidadosNube, saveDBComentario, deleteDBComentario, useListaClientes, useListaObras, useListaEmpresas } from "../utils/storage";
import ComentariosPanel from "./ComentariosPanel";
import { supabase } from "../utils/supabaseClient";
import AutocompleteCliente from "./AutocompleteCliente";
import AutocompleteEmpresa from "./AutocompleteEmpresa";
import AutocompleteObra from "./AutocompleteObra";
import ClienteRapidoModal from "./ClienteRapidoModal";
import ObraRapidaModal from "./ObraRapidaModal";
import EmpresaRapidaModal from "./EmpresaRapidaModal";
import { ModalConfirmarEliminar, ModalConfirmarBorrado } from "./ConfirmarEliminar";
import { useSortable, OrdenarControl } from "../utils/useSortable";
import { useUndoToast } from "./Toast";
import { SelectCategoria, TIPOS_TRABAJO, familiaDe, FAMILIAS } from "../utils/taxonomia";
import { MAQUINAS_OPTS } from "./Computo";
import FiltrosBar from "./FiltrosBar";
import { mergeSeed, migrar, PERFILES_DATA, PLANCHUELAS_DATA, PLANCHAS_DATA, IDS_UNIFICADOS_GM } from "./BibliotecaMateriales";
import { Combobox, normalizarTexto } from "./Combobox";

const ANIDADO_FILT_DEFAULTS = { nombre: "", cliente: "", obra: "", desde: "", hasta: "", vendedor: "", tipo: "", familia: "" };
function anidadoCampos(usuarios) {
  const campos = [
    { key: "nombre", label: "Nombre", type: "text", placeholder: "Buscar…", minWidth: 170 },
    { key: "cliente", label: "Cliente", type: "clienteAuto", placeholder: "Buscar…", minWidth: 150 },
    { key: "obra", label: "Obra", type: "text", placeholder: "Buscar…", minWidth: 150 },
    { key: "desde", label: "Desde", type: "date", minWidth: 140 },
    { key: "hasta", label: "Hasta", type: "date", minWidth: 140 },
    { key: "tipo", label: "Tipo", type: "select", options: TIPOS_TRABAJO, minWidth: 140 },
    { key: "familia", label: "Familia", type: "select", options: Object.keys(FAMILIAS), minWidth: 170 },
  ];
  if (usuarios.length > 0) campos.push({ key: "vendedor", label: "Vendedor", type: "select", options: usuarios.map(u => ({ value: u.id, label: u.nombre })), minWidth: 150 });
  return campos;
}

const n2   = v => (Math.round(v * 100)  / 100).toFixed(2);
const n3   = v => (Math.round(v * 1000) / 1000).toFixed(3);
const TH_R = { ...TH, textAlign: "right" };
const TD_R = { ...TD, textAlign: "right", fontVariantNumeric: "tabular-nums" };

const PALETTE = ["#e85d04","#3b82f6","#10b981","#f59e0b","#8b5cf6",
  "#ec4899","#06b6d4","#84cc16","#f97316","#6366f1","#14b8a6","#a855f7"];

// Terminaciones/tratamiento por material del grupo (no invalida el resultado calculado).
const fichaVacia = () => ({ granallado:false, pintura:false, galvanizado:false, corte_maquina:false, maquina:"", plegado:false, cilindrado:false });
function FichaToggles({ g, onChange }) {
  const ficha = g.ficha || fichaVacia();
  const toggle = (k) => onChange({ ...g, ficha: { ...ficha, [k]: !ficha[k] } });
  return (
    <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
      <button onClick={()=>toggle("granallado")} style={{...BTN(ficha.granallado?"ok":"ghost"),padding:"3px 8px",fontSize:10}}>◈ Granallado</button>
      <button onClick={()=>toggle("pintura")} style={{...BTN(ficha.pintura?"ok":"ghost"),padding:"3px 8px",fontSize:10}}>🎨 Pintura</button>
      <button onClick={()=>toggle("galvanizado")} style={{...BTN(ficha.galvanizado?"ok":"ghost"),padding:"3px 8px",fontSize:10}}>🔩 Galvanizado</button>
      <button onClick={()=>toggle("corte_maquina")} style={{...BTN(ficha.corte_maquina?"ok":"ghost"),padding:"3px 8px",fontSize:10}}>⚙ Corte máquina</button>
      {ficha.corte_maquina && (
        <select value={ficha.maquina||""} onChange={e=>onChange({ ...g, ficha:{ ...ficha, maquina:e.target.value } })}
          style={{ ...INP, padding:"3px 6px", fontSize:10, width:150 }}>
          <option value="">— Máquina —</option>
          {MAQUINAS_OPTS.map(m=><option key={m} value={m}>{m}</option>)}
        </select>
      )}
      <button onClick={()=>toggle("plegado")} style={{...BTN(ficha.plegado?"ok":"ghost"),padding:"3px 8px",fontSize:10}}>🗜️ Plegado</button>
      <button onClick={()=>toggle("cilindrado")} style={{...BTN(ficha.cilindrado?"ok":"ghost"),padding:"3px 8px",fontSize:10}}>🌀 Cilindrado</button>
    </div>
  );
}
function FichaBadges({ g }) {
  const ficha = g.ficha || {};
  const activos = [ficha.granallado&&"◈",ficha.pintura&&"🎨",ficha.galvanizado&&"🔩",ficha.corte_maquina&&"⚙",ficha.plegado&&"🗜️",ficha.cilindrado&&"🌀"].filter(Boolean);
  if (!activos.length) return null;
  return <span style={{ fontSize:11, color:C.gold }}>{activos.join(" ")}</span>;
}

// ─── Bibliotecas ──────────────────────────────────────────────────
function useBibliotecaLineales() {
  return useMemo(() => {
    const perf  = migrar(mergeSeed(loadLS("smeas_perfiles",    null), PERFILES_DATA,    IDS_UNIFICADOS_GM));
    const planch = migrar(mergeSeed(loadLS("smeas_planchuelas", null), PLANCHUELAS_DATA));
    return [...perf, ...planch].map(p => ({ id:p.id, nombre:p.nombre, cat:p.cat, kg_m:p.kg_m, sup_m2m:p.sup||0, largo_mm:(p.largo||6)*1000, precio_usd_kg:parseFloat(p.precio_usd_kg)||0 }));
  }, []);
}
function useBibliotecaPlanchas() {
  return useMemo(() => migrar(mergeSeed(loadLS("smeas_planchas", null), PLANCHAS_DATA)).map(p => ({
    id:p.id, nombre:p.nombre, espesor:p.espesor, kg_m2:p.kg_m2,
    sheet_w:p.largo_mm, sheet_h:p.ancho_mm, kg_ud:p.kg_ud,
    precio_usd_kg:parseFloat(p.precio_usd_kg)||0,
  })), []);
}

// ═══════════════════════════════════════════════════════════════
// ALGORITMO 1D — FFD para perfiles
// ═══════════════════════════════════════════════════════════════
// export sólo para testearla directamente (src/components/__tests__) — acá
// vivió el bug crítico de empalme de la sesión 2026-08-03 (una pieza más
// larga que la barra se descartaba en silencio); el regression test fija
// el comportamiento correcto con un caso sintético mínimo.
export function runFFD(piezas, largo_barra_mm, kerf_mm, kg_m) {
  // mm_util se calcula sobre las piezas ORIGINALES (antes de empalmar), así
  // siempre refleja el largo real pedido — independiente de cómo se resuelva
  // el corte. Antes, una pieza más larga que la barra se descartaba en
  // silencio y jamás sumaba a este total.
  const mm_util_total = piezas.reduce((s,p) =>
    s + Math.max(0,parseFloat(p.largo_mm)||0) * (parseInt(p.cantidad)||1), 0);

  const barras = [];
  const all = []; // piezas (o restos de empalme) que compiten por lugar en una barra

  piezas.forEach((p,pi) => {
    const cant  = parseInt(p.cantidad)||1;
    const largo = parseFloat(p.largo_mm)||0;
    if (largo<=0) return;
    const etiqueta = p.etiqueta || `${largo}`;
    for (let i=0;i<cant;i++) {
      if (largo <= largo_barra_mm) {
        all.push({ largo_mm:largo, etiqueta, colorIdx:pi%PALETTE.length });
      } else {
        // Pieza más larga que la barra → se empalma: consume barras enteras
        // (sin desperdicio en esos tramos) y el resto compite normalmente
        // por espacio junto con las demás piezas.
        const nEnteras = Math.floor(largo / largo_barra_mm);
        const resto = largo - nEnteras*largo_barra_mm;
        for (let s=0; s<nEnteras; s++) {
          barras.push({ piezas:[{ largo_mm:largo_barra_mm, etiqueta:`${etiqueta} (empalme)`, colorIdx:pi%PALETTE.length, pos_mm:0 }], libre_mm:0, forzada:true });
        }
        if (resto > 0.01) all.push({ largo_mm:resto, etiqueta:`${etiqueta} (resto)`, colorIdx:pi%PALETTE.length });
      }
    }
  });

  all.sort((a,b)=>b.largo_mm-a.largo_mm);
  all.forEach(pieza=>{
    let placed=false;
    for (const b of barras) {
      if (b.forzada) continue;
      const needed=pieza.largo_mm+(b.piezas.length>0?kerf_mm:0);
      if (b.libre_mm>=needed) { b.piezas.push({...pieza,pos_mm:largo_barra_mm-b.libre_mm+(b.piezas.length>0?kerf_mm:0)}); b.libre_mm-=needed; placed=true; break; }
    }
    if (!placed) barras.push({ piezas:[{...pieza,pos_mm:0}], libre_mm:largo_barra_mm-pieza.largo_mm });
  });
  barras.forEach((b,i)=>{ b.nro=i+1; });

  const n=barras.length;
  const mm_kerf=barras.reduce((s,b)=>s+Math.max(0,b.piezas.length-1)*kerf_mm,0);
  const mm_total=n*largo_barra_mm, mm_desp=Math.max(0,mm_total-mm_util_total-mm_kerf), kgm=parseFloat(kg_m)||0;
  return { barras, resumen: {
    b_util:+(mm_util_total/largo_barra_mm).toFixed(2), b_desp:+(mm_desp/largo_barra_mm).toFixed(2), b_total:n,
    m_util:+(mm_util_total/1000).toFixed(2), m_desp:+(mm_desp/1000).toFixed(2), m_total:+(mm_total/1000).toFixed(2),
    kg_util:+(mm_util_total/1000*kgm).toFixed(1), kg_desp:+(mm_desp/1000*kgm).toFixed(1), kg_total:+(mm_total/1000*kgm).toFixed(1),
    pct_desp:mm_total>0?+(mm_desp/mm_total*100).toFixed(1):0,
  }};
}

// ═══════════════════════════════════════════════════════════════
// ALGORITMO 2D — Shelf FFD para planchas
// ═══════════════════════════════════════════════════════════════
function run2DFFD(piezas, sheet_w, sheet_h) {
  const all = [];
  piezas.forEach((p,pi) => {
    const w = parseFloat(p.largo_mm)||0, h = parseFloat(p.ancho_mm)||0;
    const cant = parseInt(p.cantidad)||1;
    if (w<=0||h<=0) return;
    for (let i=0;i<cant;i++) all.push({ w, h, etiqueta:p.etiqueta||`${w}×${h}`, colorIdx:pi%PALETTE.length });
  });
  all.sort((a,b)=>(b.w*b.h)-(a.w*a.h));

  const hojas = [];
  function tryPlace(hoja, pieza) {
    const orients = [[pieza.w,pieza.h]];
    if (pieza.w!==pieza.h) orients.push([pieza.h,pieza.w]);
    for (const [pw,ph] of orients) {
      if (pw>sheet_w||ph>sheet_h) continue;
      // intentar en estante existente
      for (const shelf of hoja.shelves) {
        if (shelf.x_used+pw<=sheet_w && ph<=shelf.h) {
          shelf.piezas.push({ x:shelf.x_used, y:shelf.y, w:pw, h:ph, etiqueta:pieza.etiqueta, colorIdx:pieza.colorIdx });
          shelf.x_used+=pw; return true;
        }
      }
      // nuevo estante
      if (hoja.y_used+ph<=sheet_h && pw<=sheet_w) {
        const newShelf = { y:hoja.y_used, h:ph, x_used:pw, piezas:[{ x:0, y:hoja.y_used, w:pw, h:ph, etiqueta:pieza.etiqueta, colorIdx:pieza.colorIdx }] };
        hoja.shelves.push(newShelf); hoja.y_used+=ph; return true;
      }
    }
    return false;
  }
  for (const pieza of all) {
    let placed=false;
    for (const hoja of hojas) { if (tryPlace(hoja,pieza)) { placed=true; break; } }
    if (!placed) { const h={ nro:hojas.length+1, shelves:[], y_used:0 }; hojas.push(h); tryPlace(h,pieza); }
  }
  const total_area = all.reduce((s,p)=>s+p.w*p.h,0);
  const sheet_area = sheet_w*sheet_h, n=hojas.length;
  const pct_util = n>0?Math.round(total_area/(n*sheet_area)*1000)/10:0;
  return { hojas, resumen: {
    n_hojas:n,
    area_util_m2: Math.round(total_area/1e6*100)/100,
    area_total_m2: Math.round(n*sheet_area/1e6*100)/100,
    area_desp_m2: Math.round((n*sheet_area-total_area)/1e6*100)/100,
    pct_util, pct_desp: Math.round((100-pct_util)*10)/10,
  }};
}

// ─── Visualización 1D ────────────────────────────────────────────
function VizBarra({ barra, largo_mm }) {
  const W=560, H=28, esc=W/largo_mm;
  return (
    <svg width={W} height={H} style={{ display:"block",borderRadius:3 }}>
      <rect width={W} height={H} fill={C.iron} rx={3}/>
      {barra.piezas.map((p,i)=>{ const x=p.pos_mm*esc, w=Math.max(1,p.largo_mm*esc), col=PALETTE[p.colorIdx%PALETTE.length]; return (
        <g key={i}><rect x={x+.5} y={2} width={w-1} height={H-4} fill={col+"cc"} rx={2}/>
        {w>28&&<text x={x+w/2} y={H/2+3.5} textAnchor="middle" fontSize={8} fill="#fff" fontWeight={700}>{p.etiqueta}</text>}
        </g>);
      })}
    </svg>
  );
}

// ─── Visualización 2D ────────────────────────────────────────────
function VizPlancha({ hoja, sheet_w, sheet_h }) {
  const MAX_W=520, MAX_H=180;
  const esc = Math.min(MAX_W/sheet_w, MAX_H/sheet_h);
  const W=Math.round(sheet_w*esc), H=Math.round(sheet_h*esc);
  const piezas = hoja.shelves.flatMap(s=>s.piezas);
  return (
    <svg width={W} height={H} style={{ display:"block", borderRadius:3, border:`1px solid ${C.border}44` }}>
      <rect width={W} height={H} fill={C.iron} rx={2}/>
      {piezas.map((p,i)=>{
        const x=Math.round(p.x*esc), y=Math.round(p.y*esc);
        const w=Math.max(1,Math.round(p.w*esc)), h=Math.max(1,Math.round(p.h*esc));
        const col=PALETTE[p.colorIdx%PALETTE.length];
        return (<g key={i}>
          <rect x={x+.5} y={y+.5} width={w-1} height={h-1} fill={col+"cc"} rx={1} stroke={col} strokeWidth={.5}/>
          {w>28&&h>16&&<text x={x+w/2} y={y+h/2+4} textAnchor="middle" fontSize={Math.min(9,w/5,h/2)} fill="#fff" fontWeight={700}>{p.etiqueta}</text>}
        </g>);
      })}
    </svg>
  );
}

// ─── Tabla resumen 1D ─────────────────────────────────────────────
function TablaResumen({ r }) {
  const col=r.pct_desp>25?C.err:r.pct_desp>15?C.warn:C.ok;
  return (
    <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden",marginTop:10 }}>
      <table style={{ width:"100%",borderCollapse:"collapse" }}>
        <thead><tr style={{ background:C.bg }}>
          <th style={{ ...TH,width:120 }}></th>
          <th style={{ ...TH_R,color:C.ok }}>Barras</th>
          <th style={{ ...TH_R,color:C.ok }}>Metros</th>
          <th style={{ ...TH_R,color:C.ok }}>kg</th>
        </tr></thead>
        <tbody>
          <tr><td style={{ ...TD,color:C.ok,fontWeight:700 }}>✓ Útiles</td><td style={{ ...TD_R,color:C.ok }}>{r.b_util}</td><td style={{ ...TD_R,color:C.ok }}>{r.m_util}</td><td style={{ ...TD_R,color:C.ok,fontWeight:700 }}>{r.kg_util}</td></tr>
          <tr><td style={{ ...TD,color:col,fontWeight:700 }}>⚠ Desperdicio</td><td style={{ ...TD_R,color:col }}>{r.b_desp}</td><td style={{ ...TD_R,color:col }}>{r.m_desp}</td><td style={{ ...TD_R,color:col }}>{r.kg_desp}</td></tr>
          <tr style={{ background:C.iron,borderTop:`1px solid ${C.border}` }}>
            <td style={{ ...TD,fontWeight:800 }}>TOTAL ({r.pct_desp}% desp.)</td>
            <td style={{ ...TD_R,fontWeight:800 }}>{r.b_total}</td><td style={{ ...TD_R,fontWeight:800 }}>{r.m_total}</td><td style={{ ...TD_R,fontWeight:800 }}>{r.kg_total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Tabla resumen 2D ─────────────────────────────────────────────
function TablaResumen2D({ r }) {
  const col=r.pct_desp>30?C.err:r.pct_desp>20?C.warn:C.ok;
  // Hojas "equivalentes" — fracción de hoja que representa el material útil vs el desperdicio,
  // ya que en 2D el desperdicio no son hojas enteras sino recortes dentro de cada hoja usada.
  const hojas_util = r.area_total_m2>0 ? Math.round((r.area_util_m2/r.area_total_m2)*r.n_hojas*100)/100 : 0;
  const hojas_desp = r.area_total_m2>0 ? Math.round((r.n_hojas - hojas_util)*100)/100 : 0;
  return (
    <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden",marginTop:10 }}>
      <table style={{ width:"100%",borderCollapse:"collapse" }}>
        <thead><tr style={{ background:C.bg }}>
          <th style={{ ...TH,width:140 }}></th>
          <th style={{ ...TH_R,color:C.ok }}>Hojas</th>
          <th style={{ ...TH_R,color:C.ok }}>m²</th>
        </tr></thead>
        <tbody>
          <tr><td style={{ ...TD,color:C.ok,fontWeight:700 }}>✓ Material útil</td><td style={{ ...TD_R,color:C.ok }}>{hojas_util}</td><td style={{ ...TD_R,color:C.ok,fontWeight:700 }}>{r.area_util_m2}</td></tr>
          <tr><td style={{ ...TD,color:col,fontWeight:700 }}>⚠ Desperdicio</td><td style={{ ...TD_R,color:col }}>{hojas_desp}</td><td style={{ ...TD_R,color:col }}>{r.area_desp_m2}</td></tr>
          <tr style={{ background:C.iron,borderTop:`1px solid ${C.border}` }}>
            <td style={{ ...TD,fontWeight:800 }}>TOTAL ({r.pct_desp}% desp.)</td>
            <td style={{ ...TD_R,fontWeight:800 }}>{r.n_hojas}</td>
            <td style={{ ...TD_R,fontWeight:800 }}>{r.area_total_m2} m²</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GRUPO — perfiles lineales (1D)
// ═══════════════════════════════════════════════════════════════
function Grupo({ g, bib, onChange, onEliminar, totalKgAll }) {
  const [verCorte,  setVerCorte]  = useState(false);
  const [expanded,  setExpanded]  = useState(!g.resultado);
  const focoRef = useRef(null);
  useEffect(() => {
    if (!focoRef.current) return;
    const el = document.getElementById(`etq-${focoRef.current}`);
    if (el) { el.focus(); focoRef.current = null; }
  }, [g.piezas]);
  const set = (k,v) => onChange({...g,[k]:v,resultado:null});
  const setPieza=(id,k,v)=>onChange({...g,piezas:g.piezas.map(p=>p.id===id?{...p,[k]:v}:p),resultado:null});
  const addPieza=()=>onChange({...g,piezas:[...g.piezas,{id:uid(),largo_mm:"",cantidad:"",etiqueta:""}],resultado:null});
  const addPiezaConFoco=()=>{
    const newId=uid();
    onChange({...g,piezas:[...g.piezas,{id:newId,largo_mm:"",cantidad:"",etiqueta:""}],resultado:null});
    focoRef.current=newId;
  };
  const clonarPieza=p=>{
    const newId=uid();
    const idx=g.piezas.findIndex(x=>x.id===p.id);
    const piezas=[...g.piezas];
    piezas.splice(idx+1,0,{...p,id:newId});
    onChange({...g,piezas,resultado:null});
    focoRef.current=newId;
  };
  const delPieza=id=>onChange({...g,piezas:g.piezas.filter(p=>p.id!==id),resultado:null});
  const onEnterRow=(e,esUltimo)=>{
    if (e.key!=="Enter") return;
    e.preventDefault();
    if (esUltimo) { addPiezaConFoco(); return; }
    const inputs=Array.from(e.target.closest("tr").querySelectorAll("input"));
    const idx=inputs.indexOf(e.target);
    if (idx>=0 && inputs[idx+1]) inputs[idx+1].focus();
  };
  const elegir=mat=>{
    if (!mat) { onChange({...g,material_id:"",material_nombre:"",kg_m:0,sup_m2m:0,resultado:null}); return; }
    onChange({...g,material_id:mat.id,material_nombre:mat.nombre,kg_m:mat.kg_m,sup_m2m:mat.sup_m2m||0,largo_barra_mm:mat.largo_mm,resultado:null});
  };
  const calcular=()=>{
    const res=runFFD(g.piezas,parseFloat(g.largo_barra_mm)||6000,parseFloat(g.kerf_mm)||0,g.kg_m);
    onChange({...g,resultado:res});
    setVerCorte(false);
    setExpanded(false);  // colapsar después de calcular
  };
  const r=g.resultado;
  const calculado = !!r;

  // Cálculos para fila resumen
  const total_m = g.piezas.reduce((s,p)=>(parseFloat(p.largo_mm)||0)*(parseInt(p.cantidad)||1)+s,0)/1000;
  const kg_util = total_m * (g.kg_m||0);
  const incidencia = totalKgAll>0 && kg_util>0 ? (kg_util/totalKgAll*100).toFixed(1) : null;
  const precio_usd_kg = bib.find(m=>m.id===g.material_id)?.precio_usd_kg || 0;
  const monto = precio_usd_kg>0 && r ? r.resumen.kg_total * precio_usd_kg : 0;

  // ── FILA COLAPSADA ──────────────────────────────────────────
  if (!expanded) {
    const col_desp = calculado && r.resumen.pct_desp>25?C.err:r.resumen?.pct_desp>15?C.warn:C.ok;
    return (
      <div style={{ background:C.iron,border:`1px solid ${C.border}`,borderRadius:10,marginBottom:8,overflow:"hidden" }}>
        <div style={{ display:"flex",alignItems:"center",padding:"10px 14px",flexWrap:"wrap",gap:6 }}>
          {/* Toggle expand */}
          <button onClick={()=>setExpanded(true)}
            style={{ background:"transparent",border:`1px solid ${C.border}44`,borderRadius:5,color:C.muted,cursor:"pointer",fontSize:10,padding:"2px 6px",marginRight:4,flexShrink:0 }}>▶</button>
          {/* Material */}
          <span style={{ ...BDG(C.info,true),fontSize:10,flexShrink:0 }}>PERFIL 3D</span>
          <span style={{ fontSize:13,fontWeight:700,color:C.text,flex:"0 0 auto",minWidth:120 }}>{g.material_nombre||"Sin material"}</span>
          <FichaBadges g={g} />
          {/* Métricas */}
          <div style={{ display:"flex",gap:14,flex:1,flexWrap:"wrap",alignItems:"center" }}>
            <span style={{ fontSize:12,color:C.steel }}><span style={{ color:C.muted,fontSize:10 }}>m útil </span>{n2(total_m)}</span>
            <span style={{ fontSize:12,color:C.ok,fontWeight:700 }}><span style={{ color:C.muted,fontSize:10 }}>kg útil </span>{n2(kg_util)}</span>
            {/* Botón calcular */}
            <button onClick={calcular}
              style={{ ...BTN(calculado?"ok":"primary"),padding:"4px 12px",fontSize:11,flexShrink:0,
                ...(calculado?{background:C.ok+"22",color:C.ok,border:`1px solid ${C.ok}66`}:{}) }}>
              {calculado?"✓ Calculado":"Calcular ▶"}
            </button>
            {calculado && <>
              <span style={{ fontSize:16,color:C.ok,fontWeight:800 }}><span style={{ color:C.muted,fontSize:11 }}>b.útiles </span>{r.resumen.b_util}</span>
              <span style={{ fontSize:16,color:col_desp,fontWeight:800 }}><span style={{ color:C.muted,fontSize:11 }}>b.desp </span>{r.resumen.b_desp}</span>
              <span style={{ fontSize:14,color:col_desp,fontWeight:700 }}><span style={{ color:C.muted,fontSize:11 }}>kg desp </span>{r.resumen.kg_desp}</span>
              {incidencia && <span title="% que este material representa del total de kg del anidado" style={{...BDG(C.pur,true),fontSize:13,padding:"4px 10px"}}>{incidencia}%</span>}
              <span title="Cantidad de barras a comprar (útiles + desperdicio)" style={{...BDG(C.steel,true),fontSize:15,fontWeight:800,padding:"5px 12px"}}>🔩 {r.resumen.b_total} barras</span>
              <span title="Kg totales a comprar de este material (útiles + desperdicio)" style={{...BDG(C.info,true),fontSize:15,fontWeight:800,padding:"5px 12px"}}>⚖ {n2(r.resumen.kg_total)} kg</span>
              {calculado && <span title="% de desperdicio = kg que se pierden en el corte ÷ kg totales comprados (barras/hojas de más por el corte)" style={{...BDG(col_desp,true),fontSize:15,fontWeight:800,padding:"5px 12px"}}>⚠ {r.resumen.pct_desp}% desp.</span>}
              {monto>0 && <span title="Monto de este material (kg total × USD/kg de Biblioteca)" style={{...BDG(C.gold,true),fontSize:15,fontWeight:800,padding:"5px 12px"}}>${n2(monto)}</span>}
            </>}
          </div>
          <button onClick={onEliminar} style={{ background:"transparent",border:"none",color:C.err,cursor:"pointer",fontSize:14,padding:"0 4px",marginLeft:"auto",flexShrink:0 }}>✕</button>
        </div>
      </div>
    );
  }

  // ── EXPANDIDO ────────────────────────────────────────────────
  return (
    <div style={{ background:C.iron,border:`1px solid ${C.border}`,borderRadius:10,padding:16,marginBottom:12 }}>
      <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4 }}>
        <button onClick={()=>setExpanded(false)}
          style={{ background:"transparent",border:`1px solid ${C.border}44`,borderRadius:5,color:C.muted,cursor:"pointer",fontSize:10,padding:"2px 6px" }}>▼</button>
        <span style={{ ...BDG(C.info,true),fontSize:10 }}>PERFIL 3D</span>
        <span style={{ fontSize:11,color:C.muted,flex:1 }}>{g.material_nombre||"Sin material"}</span>
      </div>
      <div style={{ marginBottom:10, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
        <FichaToggles g={g} onChange={onChange} />
        <input value={g.obs||""} placeholder="Observaciones, proveedor, fecha del precio..." onChange={e=>onChange({...g,obs:e.target.value})} style={{ ...INP, flex:"1 1 220px", padding:"4px 8px", fontSize:11 }} />
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12,flexWrap:"wrap" }}>
        <Combobox opciones={bib} value={g.material_id||""} onChange={elegir} placeholder="Elegir perfil…" precioField="precio_usd_kg" />
        <div style={{ display:"flex",alignItems:"center",gap:4 }}>
          <span style={{ fontSize:11,color:C.muted }}>Barra:</span>
          <input type="number" value={g.largo_barra_mm} onChange={e=>set("largo_barra_mm",e.target.value)} onFocus={e=>e.target.select()} style={{ ...INP,width:76,padding:"4px 6px",textAlign:"right" }} /><span style={{ fontSize:10,color:C.muted }}>mm</span>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:4 }}>
          <span style={{ fontSize:11,color:C.muted }}>Kerf:</span>
          <input type="number" value={g.kerf_mm} onChange={e=>set("kerf_mm",e.target.value)} onFocus={e=>e.target.select()} style={{ ...INP,width:52,padding:"4px 6px",textAlign:"right" }} /><span style={{ fontSize:10,color:C.muted }}>mm</span>
        </div>
        <button onClick={calcular}
          style={{ ...BTN("primary"),padding:"5px 14px",fontSize:12,
            ...(calculado?{background:C.ok,border:`1px solid ${C.ok}`,color:"#fff"}:{}) }}>
          {calculado ? "✓ Recalcular" : "Calcular ▶"}
        </button>
        <button onClick={onEliminar} style={{ background:"transparent",border:"none",color:C.err,cursor:"pointer",fontSize:16,padding:"0 4px",marginLeft:"auto" }}>✕</button>
      </div>
      <table style={{ width:"100%",borderCollapse:"collapse",marginBottom:8 }}>
        <thead><tr>
          <th style={TH}>Etiqueta</th>
          <th style={TH_R}>Largo (mm)</th>
          <th style={TH_R}>Cant.</th>
          <th style={{ ...TH_R,color:C.teal }}>Total mm</th>
          <th style={{ ...TH,width:56 }}></th>
        </tr></thead>
        <tbody>
          {g.piezas.map(p=>{ const tot=(parseFloat(p.largo_mm)||0)*(parseInt(p.cantidad)||1); return (
            <tr key={p.id} onMouseEnter={e=>e.currentTarget.style.background=C.card} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={TD}><input id={`etq-${p.id}`} type="text" value={p.etiqueta} placeholder="ej: P1" onChange={e=>setPieza(p.id,"etiqueta",e.target.value)} onKeyDown={e=>onEnterRow(e,false)} style={{ ...INP,width:160,padding:"3px 6px",fontSize:12 }}/></td>
              <td style={TD_R}><input type="number" value={p.largo_mm} placeholder="mm" onChange={e=>setPieza(p.id,"largo_mm",e.target.value)} onFocus={e=>e.target.select()} onKeyDown={e=>onEnterRow(e,false)} style={{ ...INP,width:80,padding:"3px 6px",textAlign:"right" }}/></td>
              <td style={TD_R}><input type="number" min="1" placeholder="1" value={p.cantidad} onChange={e=>setPieza(p.id,"cantidad",e.target.value)} onFocus={e=>e.target.select()} onKeyDown={e=>onEnterRow(e,true)} style={{ ...INP,width:52,padding:"3px 6px",textAlign:"right" }}/></td>
              <td style={{ ...TD_R,color:C.teal }}>{tot>0?tot.toFixed(0):"—"}</td>
              <td style={{ ...TD,textAlign:"center",whiteSpace:"nowrap" }}>
                <button onClick={()=>clonarPieza(p)} title="Clonar esta pieza (misma medida, para editar cantidad/etiqueta)" style={{ background:"transparent",border:"none",color:C.steel,cursor:"pointer",fontSize:13,marginRight:4 }}>⧉</button>
                <button onClick={()=>delPieza(p.id)} style={{ background:"transparent",border:"none",color:C.err,cursor:"pointer",fontSize:13 }}>✕</button>
              </td>
            </tr>);
          })}
        </tbody>
      </table>
      <button onClick={addPieza} style={{ ...BTN("ghost"),padding:"4px 12px",fontSize:11 }}>+ Pieza</button>
      {r && (<>
        <TablaResumen r={r.resumen}/>
        <div style={{ marginTop:10 }}>
          <button onClick={()=>setVerCorte(v=>!v)} style={{ ...BTN("ghost"),padding:"4px 12px",fontSize:11,marginBottom:6 }}>
            {verCorte?"▲ Ocultar":"▼ Ver"} lista de corte ({r.barras.length} barra{r.barras.length!==1?"s":""})
          </button>
          {verCorte&&r.barras.map(b=>(
            <div key={b.nro} style={{ marginBottom:8 }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3 }}>
                <span style={{ ...BDG(C.accent,true),minWidth:56 }}>Barra {b.nro}</span>
                <span style={{ fontSize:11,color:C.muted }}>{b.piezas.length} piezas · libre: {b.libre_mm.toFixed(0)} mm</span>
              </div>
              <VizBarra barra={b} largo_mm={parseFloat(g.largo_barra_mm)||6000}/>
              <div style={{ display:"flex",gap:4,flexWrap:"wrap",marginTop:3 }}>
                {b.piezas.map((p,i)=><span key={i} style={{ ...BDG(PALETTE[p.colorIdx%PALETTE.length],true),fontSize:9 }}>{p.etiqueta} {p.largo_mm}mm</span>)}
                {b.libre_mm>0&&<span style={{ fontSize:9,color:C.muted,alignSelf:"center" }}>+{b.libre_mm.toFixed(0)}mm libre</span>}
              </div>
            </div>
          ))}
        </div>
      </>)}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GRUPO PLANCHA — nesting 2D
// ═══════════════════════════════════════════════════════════════
function GrupoPlancha({ g, bib, onChange, onEliminar, totalKgAll }) {
  const [verHojas, setVerHojas] = useState(false);
  const [expanded, setExpanded] = useState(!g.resultado);
  const focoRef = useRef(null);
  useEffect(() => {
    if (!focoRef.current) return;
    const el = document.getElementById(`etq-${focoRef.current}`);
    if (el) { el.focus(); focoRef.current = null; }
  }, [g.piezas]);
  const set=(k,v)=>onChange({...g,[k]:v,resultado:null});
  const setPieza=(id,k,v)=>onChange({...g,piezas:g.piezas.map(p=>p.id===id?{...p,[k]:v}:p),resultado:null});
  const addPieza=()=>onChange({...g,piezas:[...g.piezas,{id:uid(),largo_mm:"",ancho_mm:"",cantidad:"",etiqueta:""}],resultado:null});
  const addPiezaConFoco=()=>{
    const newId=uid();
    onChange({...g,piezas:[...g.piezas,{id:newId,largo_mm:"",ancho_mm:"",cantidad:"",etiqueta:""}],resultado:null});
    focoRef.current=newId;
  };
  const clonarPieza=p=>{
    const newId=uid();
    const idx=g.piezas.findIndex(x=>x.id===p.id);
    const piezas=[...g.piezas];
    piezas.splice(idx+1,0,{...p,id:newId});
    onChange({...g,piezas,resultado:null});
    focoRef.current=newId;
  };
  const delPieza=id=>onChange({...g,piezas:g.piezas.filter(p=>p.id!==id),resultado:null});
  const onEnterRow=(e,esUltimo)=>{
    if (e.key!=="Enter") return;
    e.preventDefault();
    if (esUltimo) { addPiezaConFoco(); return; }
    const inputs=Array.from(e.target.closest("tr").querySelectorAll("input"));
    const idx=inputs.indexOf(e.target);
    if (idx>=0 && inputs[idx+1]) inputs[idx+1].focus();
  };
  const elegir=mat=>{
    if (!mat) { onChange({...g,material_id:"",material_nombre:"",kg_m2:0,sheet_w:0,sheet_h:0,resultado:null}); return; }
    onChange({...g,material_id:mat.id,material_nombre:mat.nombre,kg_m2:mat.kg_m2,sheet_w:mat.sheet_w,sheet_h:mat.sheet_h,resultado:null});
  };
  const calcular=()=>{
    const sw=parseFloat(g.sheet_w)||0, sh=parseFloat(g.sheet_h)||0;
    if (sw<=0||sh<=0) return;
    const res=run2DFFD(g.piezas,sw,sh);
    onChange({...g,resultado:res});
    setVerHojas(false);
    setExpanded(false);  // colapsar después de calcular
  };
  const r=g.resultado;
  const calculado = !!r;

  // Cálculos para fila resumen
  const area_util_m2 = g.piezas.reduce((s,p)=>{
    const a=(parseFloat(p.largo_mm)||0)*(parseFloat(p.ancho_mm)||0)/1e6*(parseInt(p.cantidad)||1);
    return s+a;
  },0);
  const kg_util = area_util_m2 * (g.kg_m2||0);
  const incidencia = totalKgAll>0 && kg_util>0 ? (kg_util/totalKgAll*100).toFixed(1) : null;
  const precio_usd_kg = bib.find(m=>m.id===g.material_id)?.precio_usd_kg || 0;
  const kg_total = r ? r.resumen.area_total_m2 * (g.kg_m2||0) : 0;
  const kg_desp  = r ? r.resumen.area_desp_m2  * (g.kg_m2||0) : 0;
  const monto = precio_usd_kg>0 && r ? kg_total * precio_usd_kg : 0;

  // ── FILA COLAPSADA ──────────────────────────────────────────
  if (!expanded) {
    const col_desp = calculado && r.resumen.pct_desp>30?C.err:r.resumen?.pct_desp>20?C.warn:C.ok;
    return (
      <div style={{ background:C.iron,border:`1px solid ${C.border}`,borderRadius:10,marginBottom:8,overflow:"hidden" }}>
        <div style={{ display:"flex",alignItems:"center",flexWrap:"wrap",gap:6,padding:"10px 14px" }}>
          <button onClick={()=>setExpanded(true)}
            style={{ background:"transparent",border:`1px solid ${C.border}44`,borderRadius:5,color:C.muted,cursor:"pointer",fontSize:10,padding:"2px 6px",marginRight:4,flexShrink:0 }}>▶</button>
          <span style={{ ...BDG(C.teal,true),fontSize:10,flexShrink:0 }}>PLANCHA 2D</span>
          <span style={{ fontSize:13,fontWeight:700,color:C.text,flex:"0 0 auto",minWidth:120 }}>{g.material_nombre||"Sin plancha"}</span>
          <FichaBadges g={g} />
          <div style={{ display:"flex",gap:14,flex:1,flexWrap:"wrap",alignItems:"center" }}>
            <span style={{ fontSize:12,color:C.teal }}><span style={{ color:C.muted,fontSize:10 }}>m² útil </span>{n2(area_util_m2)}</span>
            <span style={{ fontSize:12,color:C.ok,fontWeight:700 }}><span style={{ color:C.muted,fontSize:10 }}>kg útil </span>{n2(kg_util)}</span>
            <button onClick={calcular}
              style={{ ...BTN(calculado?"ok":"primary"),padding:"4px 12px",fontSize:11,flexShrink:0,
                ...(calculado?{background:C.ok+"22",color:C.ok,border:`1px solid ${C.ok}66`}:{}) }}>
              {calculado?"✓ Calculado":"Calcular ▶"}
            </button>
            {calculado && <>
              <span style={{ fontSize:16,color:col_desp,fontWeight:800 }}><span style={{ color:C.muted,fontSize:11 }}>hojas desp </span>{r.resumen.area_total_m2>0 ? Math.round((r.resumen.n_hojas - (r.resumen.area_util_m2/r.resumen.area_total_m2)*r.resumen.n_hojas)*100)/100 : 0}</span>
              <span style={{ fontSize:14,color:col_desp,fontWeight:700 }}><span style={{ color:C.muted,fontSize:11 }}>m² desp </span>{r.resumen.area_desp_m2}</span>
              <span style={{ fontSize:14,color:col_desp,fontWeight:700 }}><span style={{ color:C.muted,fontSize:11 }}>kg desp </span>{n2(kg_desp)}</span>
              {incidencia && <span title="% que este material representa del total de kg del anidado" style={{...BDG(C.pur,true),fontSize:13,padding:"4px 10px"}}>{incidencia}%</span>}
              <span title="Cantidad de hojas a comprar (útiles + desperdicio)" style={{...BDG(C.steel,true),fontSize:15,fontWeight:800,padding:"5px 12px"}}>🔩 {r.resumen.n_hojas} hojas</span>
              <span title="m² totales a comprar de este material (útiles + desperdicio)" style={{...BDG(C.teal,true),fontSize:15,fontWeight:800,padding:"5px 12px"}}>▦ {r.resumen.area_total_m2} m²</span>
              <span title="Kg totales a comprar de este material (útiles + desperdicio)" style={{...BDG(C.info,true),fontSize:15,fontWeight:800,padding:"5px 12px"}}>⚖ {n2(kg_total)} kg</span>
              <span title="% de desperdicio = kg que se pierden en el corte ÷ kg totales comprados (barras/hojas de más por el corte)" style={{...BDG(col_desp,true),fontSize:15,fontWeight:800,padding:"5px 12px"}}>⚠ {r.resumen.pct_desp}% desp.</span>
              {monto>0 && <span title="Monto de este material (kg total × USD/kg de Biblioteca)" style={{...BDG(C.gold,true),fontSize:15,fontWeight:800,padding:"5px 12px"}}>${n2(monto)}</span>}
            </>}
          </div>
          <button onClick={onEliminar} style={{ background:"transparent",border:"none",color:C.err,cursor:"pointer",fontSize:14,padding:"0 4px",marginLeft:"auto",flexShrink:0 }}>✕</button>
        </div>
      </div>
    );
  }

  // ── EXPANDIDO ────────────────────────────────────────────────
  return (
    <div style={{ background:C.iron,border:`1px solid ${C.border}`,borderRadius:10,padding:16,marginBottom:12 }}>
      <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4 }}>
        <button onClick={()=>setExpanded(false)}
          style={{ background:"transparent",border:`1px solid ${C.border}44`,borderRadius:5,color:C.muted,cursor:"pointer",fontSize:10,padding:"2px 6px" }}>▼</button>
        <span style={{ ...BDG(C.teal,true),fontSize:10 }}>PLANCHA 2D</span>
        <span style={{ fontSize:11,color:C.muted,flex:1 }}>{g.material_nombre||"Sin plancha"}</span>
      </div>
      <div style={{ marginBottom:10, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
        <FichaToggles g={g} onChange={onChange} />
        <input value={g.obs||""} placeholder="Observaciones, proveedor, fecha del precio..." onChange={e=>onChange({...g,obs:e.target.value})} style={{ ...INP, flex:"1 1 220px", padding:"4px 8px", fontSize:11 }} />
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12,flexWrap:"wrap" }}>
        <Combobox opciones={bib} value={g.material_id||""} onChange={elegir} placeholder="Elegir plancha…" precioField="precio_usd_kg" />
        <div style={{ display:"flex",alignItems:"center",gap:4 }}>
          <span style={{ fontSize:11,color:C.muted }}>Plancha:</span>
          <input type="number" value={g.sheet_w} onChange={e=>set("sheet_w",e.target.value)} onFocus={e=>e.target.select()} style={{ ...INP,width:72,padding:"4px 6px",textAlign:"right" }} />
          <span style={{ fontSize:10,color:C.muted }}>×</span>
          <input type="number" value={g.sheet_h} onChange={e=>set("sheet_h",e.target.value)} onFocus={e=>e.target.select()} style={{ ...INP,width:72,padding:"4px 6px",textAlign:"right" }} />
          <span style={{ fontSize:10,color:C.muted }}>mm</span>
        </div>
        <button onClick={calcular}
          style={{ ...BTN("primary"),padding:"5px 14px",fontSize:12,
            ...(calculado?{background:C.ok,border:`1px solid ${C.ok}`,color:"#fff"}:{}) }}>
          {calculado ? "✓ Recalcular" : "Calcular ▶"}
        </button>
        <button onClick={onEliminar} style={{ background:"transparent",border:"none",color:C.err,cursor:"pointer",fontSize:16,padding:"0 4px",marginLeft:"auto" }}>✕</button>
      </div>
      <table style={{ width:"100%",borderCollapse:"collapse",marginBottom:8 }}>
        <thead><tr>
          <th style={TH}>Etiqueta</th>
          <th style={TH_R}>Largo (mm)</th>
          <th style={TH_R}>Ancho (mm)</th>
          <th style={TH_R}>Cant.</th>
          <th style={{ ...TH_R,color:C.teal }}>Área m²</th>
          <th style={{ ...TH,width:56 }}></th>
        </tr></thead>
        <tbody>
          {g.piezas.map(p=>{ const area=(parseFloat(p.largo_mm)||0)*(parseFloat(p.ancho_mm)||0)/1e6*(parseInt(p.cantidad)||1); return (
            <tr key={p.id} onMouseEnter={e=>e.currentTarget.style.background=C.card} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={TD}><input id={`etq-${p.id}`} type="text" value={p.etiqueta} placeholder="ej: T1" onChange={e=>setPieza(p.id,"etiqueta",e.target.value)} onKeyDown={e=>onEnterRow(e,false)} style={{ ...INP,width:160,padding:"3px 6px",fontSize:12 }}/></td>
              <td style={TD_R}><input type="number" value={p.largo_mm} placeholder="mm" onChange={e=>setPieza(p.id,"largo_mm",e.target.value)} onFocus={e=>e.target.select()} onKeyDown={e=>onEnterRow(e,false)} style={{ ...INP,width:80,padding:"3px 6px",textAlign:"right" }}/></td>
              <td style={TD_R}><input type="number" value={p.ancho_mm} placeholder="mm" onChange={e=>setPieza(p.id,"ancho_mm",e.target.value)} onFocus={e=>e.target.select()} onKeyDown={e=>onEnterRow(e,false)} style={{ ...INP,width:80,padding:"3px 6px",textAlign:"right" }}/></td>
              <td style={TD_R}><input type="number" min="1" placeholder="1" value={p.cantidad} onChange={e=>setPieza(p.id,"cantidad",e.target.value)} onFocus={e=>e.target.select()} onKeyDown={e=>onEnterRow(e,true)} style={{ ...INP,width:52,padding:"3px 6px",textAlign:"right" }}/></td>
              <td style={{ ...TD_R,color:C.teal }}>{area>0?n3(area):"—"}</td>
              <td style={{ ...TD,textAlign:"center",whiteSpace:"nowrap" }}>
                <button onClick={()=>clonarPieza(p)} title="Clonar esta pieza (misma medida, para editar cantidad/etiqueta)" style={{ background:"transparent",border:"none",color:C.steel,cursor:"pointer",fontSize:13,marginRight:4 }}>⧉</button>
                <button onClick={()=>delPieza(p.id)} style={{ background:"transparent",border:"none",color:C.err,cursor:"pointer",fontSize:13 }}>✕</button>
              </td>
            </tr>);
          })}
        </tbody>
      </table>
      <button onClick={addPieza} style={{ ...BTN("ghost"),padding:"4px 12px",fontSize:11 }}>+ Pieza</button>
      {r && (<>
        <TablaResumen2D r={r.resumen}/>
        <div style={{ marginTop:10 }}>
          <button onClick={()=>setVerHojas(v=>!v)} style={{ ...BTN("ghost"),padding:"4px 12px",fontSize:11,marginBottom:6 }}>
            {verHojas?"▲ Ocultar":"▼ Ver"} hojas ({r.hojas.length} plancha{r.hojas.length!==1?"s":""})
          </button>
          {verHojas&&r.hojas.map(h=>{
            const pzas=h.shelves.flatMap(s=>s.piezas);
            return (
              <div key={h.nro} style={{ marginBottom:12 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:5 }}>
                  <span style={{ ...BDG(C.teal,true),minWidth:60 }}>Hoja {h.nro}</span>
                  <span style={{ fontSize:11,color:C.muted }}>{pzas.length} piezas · {n2((pzas.reduce((s,p)=>s+p.w*p.h,0))/((parseFloat(g.sheet_w)||1)*(parseFloat(g.sheet_h)||1))*100)}% usado</span>
                </div>
                <VizPlancha hoja={h} sheet_w={parseFloat(g.sheet_w)||6000} sheet_h={parseFloat(g.sheet_h)||1500}/>
                <div style={{ display:"flex",gap:4,flexWrap:"wrap",marginTop:4 }}>
                  {pzas.map((p,i)=><span key={i} style={{ ...BDG(PALETTE[p.colorIdx%PALETTE.length],true),fontSize:9 }}>{p.etiqueta} {p.w}×{p.h}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      </>)}
    </div>
  );
}

// ─── Importar desde cómputo ───────────────────────────────────────
function importar(computo_id, bib_map, bib_planchas_map) {
  const computos = loadLS("smeas_computos",[]);
  const comp = computos.find(c=>c.id===computo_id);
  if (!comp) return [];
  const mapaPerf={}, mapaPlanchas={};
  const mult_total=comp.cantidad_total||1;
  // 2026-08-30: esto armaba cada grupo sin `ficha` en absoluto — lo marcado
  // pieza por pieza en Cómputo (granallado/pintura/galvanizado/máquina) se
  // perdía por completo al pasar a Anidado (encontrado por Gino, que
  // esperaba que sí viajara). Como varias piezas del mismo material pueden
  // venir con marcas distintas, se combinan por "si alguna pieza lo pide,
  // el grupo entero lo lleva" (mismo criterio ya usado para kg a
  // arenar/pintar/galvanizar de un anidado completo) — la máquina de corte
  // no es booleana, así que se toma la primera que aparezca.
  const mergearFicha = (destino, pf) => {
    if (!pf) return destino;
    const f = { ...destino };
    if (pf.granallado) f.granallado = true;
    if (pf.pintura) f.pintura = true;
    if (pf.galvanizado) f.galvanizado = true;
    // Bug real (2026-09-02, reportado por Gino con captura): solo se
    // copiaba el NOMBRE de la máquina, nunca el flag corte_maquina en sí —
    // por eso el resumen de Anidado nunca mostraba "Corte de máquina"
    // aunque la pieza sí lo tuviera marcado en Cómputo.
    if (pf.corte_maquina) {
      f.corte_maquina = true;
      if (pf.maquina && !f.maquina) f.maquina = pf.maquina;
    }
    if (pf.plegado) f.plegado = true;
    if (pf.cilindrado) f.cilindrado = true;
    // Precio manual cargado en la ficha de la pieza (Cómputo) — mismo
    // criterio que `maquina`: ambiguo si dos piezas del grupo tienen precios
    // distintos, se toma el primero que aparece en vez de pisarlo o sumarlo.
    // Reportado por Gino (2026-09-02): el resumen de Materiales unificados
    // mostraba "—" en Total USD/Ficha aunque la pieza sí tenía precio
    // cargado, porque este merge nunca lo traía.
    if (pf.precio_raw && !f.precio_raw) {
      f.precio_raw = pf.precio_raw;
      f.moneda = pf.moneda;
      f.precio_por = pf.precio_por;
    }
    return f;
  };
  comp.items.forEach(item=>{
    const cant_item=(item.cantidad||1)*mult_total;
    item.piezas.forEach(p=>{
      if (p.tipo==="perfil") {
        const largo=parseFloat(p.largo_mm_input)||0; if (!largo) return;
        if (!mapaPerf[p.material_id]) {
          const mat=bib_map[p.material_id];
          mapaPerf[p.material_id]={ id:uid(), tipo:"perfil", material_id:p.material_id, material_nombre:p.material_nombre, kg_m:mat?.kg_m||0, sup_m2m:mat?.sup_m2m||0, largo_barra_mm:mat?.largo_mm||6000, kerf_mm:0, piezas:[], resultado:null, ficha:{} };
        }
        mapaPerf[p.material_id].ficha = mergearFicha(mapaPerf[p.material_id].ficha, p.ficha);
        mapaPerf[p.material_id].piezas.push({ id:uid(), largo_mm:largo, cantidad:(parseInt(p.cantidad)||1)*cant_item, etiqueta:item.n_plano||item.titulo?.substring(0,8)||"" });
      } else {
        // plancha
        const largo=parseFloat(p.largo_mm)||0, ancho=parseFloat(p.ancho_mm)||0; if (!largo||!ancho) return;
        if (!mapaPlanchas[p.material_id]) {
          const mat=bib_planchas_map[p.material_id];
          mapaPlanchas[p.material_id]={ id:uid(), tipo:"plancha", material_id:p.material_id, material_nombre:p.material_nombre, kg_m2:mat?.kg_m2||0, sheet_w:mat?.sheet_w||6000, sheet_h:mat?.sheet_h||1500, piezas:[], resultado:null, ficha:{} };
        }
        mapaPlanchas[p.material_id].ficha = mergearFicha(mapaPlanchas[p.material_id].ficha, p.ficha);
        mapaPlanchas[p.material_id].piezas.push({ id:uid(), largo_mm:largo, ancho_mm:ancho, cantidad:(parseInt(p.cantidad)||1)*cant_item, etiqueta:item.n_plano||item.titulo?.substring(0,8)||"" });
      }
    });
  });
  return [...Object.values(mapaPerf), ...Object.values(mapaPlanchas)];
}

// ─── Export ────────────────────────────────────────────────────────
// Lista de materiales agregada desde el RESULTADO ya calculado de cada grupo
// (kg reales post-anidado, con desperdicio), con las selecciones de ficha,
// las unidades a comprar (útiles + desperdicio, ej. "5 barras: 4.83 útiles,
// 0.17 desperdicio") y el precio (USD/kg de Biblioteca × kg = total USD).
function materialesUnificados(anidado, tc) {
  const bibLineales = [...loadLS("smeas_perfiles",[]), ...loadLS("smeas_planchuelas",[])];
  // 2026-08-31, a pedido de Gino: esto buscaba el precio por NOMBRE contra
  // la biblioteca — si el nombre no matcheaba exacto (mismo bug ya
  // corregido del lado de Presupuesto.jsx) quedaba en "—" sin avisar por
  // qué. Se resuelve por `material_id`, que es lo que el grupo ya guarda.
  const bibPorId = {};
  [...bibLineales, ...loadLS("smeas_planchas",[])]
    .forEach(m => { bibPorId[m.id] = parseFloat(m.precio_usd_kg || m.precio || 0) || 0; });
  // Fallback de sup_m2m por si el grupo es de un anidado viejo, creado antes de
  // que se empezara a guardar ese dato al elegir el material (ver Presupuesto.jsx).
  const supFallback = (material_id, material_nombre) => {
    const mat = bibLineales.find(m=>m.id===material_id) || bibLineales.find(m=>m.nombre===material_nombre);
    return parseFloat(mat?.sup) || 0;
  };

  return (anidado?.grupos || []).filter(g => g.resultado).map(g => {
    const r = g.resultado.resumen || {};
    const sup_m2m = g.sup_m2m || (g.tipo!=="plancha" ? supFallback(g.material_id, g.material_nombre) : 0);
    const kg = g.tipo === "plancha"
      ? (r.area_total_m2 || 0) * (g.kg_m2 || 0)
      : (r.kg_total || 0);
    // Kg útiles (2026-08-31, a pedido de Gino): antes solo se mostraba el
    // total comprado, sin distinguir cuánto de eso es material realmente
    // aprovechado vs. desperdicio de corte.
    const kg_util = g.tipo === "plancha"
      ? (r.area_util_m2 || 0) * (g.kg_m2 || 0)
      : (r.kg_util || 0);
    const sup = g.tipo === "plancha"
      ? (r.area_total_m2 || 0)
      : (r.m_total || 0) * sup_m2m;
    const unidades = g.tipo === "plancha"
      ? { util: r.area_total_m2>0 ? Math.round((r.area_util_m2/r.area_total_m2)*r.n_hojas*100)/100 : 0, desp: 0, total: r.n_hojas || 0, label: "hojas" }
      : { util: r.b_util || 0, desp: r.b_desp || 0, total: r.b_total || 0, label: "barras" };
    if (g.tipo === "plancha") unidades.desp = +(unidades.total - unidades.util).toFixed(2);
    const nombre = g.material_nombre || "Sin material";
    const ficha = g.ficha || {};
    // Precio manual cargado en la ficha de alguna pieza del grupo (Cómputo)
    // tiene prioridad sobre el precio de Biblioteca — mismo criterio que
    // calcPiezaUSD (Computo.jsx), reimplementado acá porque este resumen
    // trabaja con totales ya agregados del grupo, no pieza por pieza.
    // Reportado por Gino (2026-09-02): esta sección mostraba "—" en Total
    // USD/Ficha aunque la pieza sí tenía un precio manual cargado, porque
    // solo miraba el precio de Biblioteca.
    const precioRaw = parseFloat(ficha.precio_raw) || 0;
    let precioManualTotal = 0;
    if (precioRaw > 0) {
      const tcNum = parseFloat(tc) || 40;
      const precioUSD = ficha.moneda === "UYU" ? precioRaw / tcNum : precioRaw;
      const por = ficha.precio_por || "kg";
      const m_total = g.tipo !== "plancha" ? (r.m_total || 0) : 0;
      if (por === "kg") precioManualTotal = precioUSD * kg;
      else if (por === "m") precioManualTotal = precioUSD * m_total;
      else if (por === "m2") precioManualTotal = precioUSD * sup;
    }
    const precioBib = bibPorId[g.material_id] || 0;
    const precio_total = precioManualTotal > 0 ? precioManualTotal : kg * precioBib;
    const precio_usd_kg = precioManualTotal > 0 ? (kg > 0 ? precio_total / kg : 0) : precioBib;
    return { id: g.id, tipo: g.tipo, nombre, kg, kg_util, sup, unidades, precio_usd_kg, precio_total, precio_manual: precioManualTotal > 0, ficha };
  });
}

function VistaMaterialesAnidado({ anidado, onClose, tcGlobal }) {
  const materiales = materialesUnificados(anidado, tcGlobal);
  const totalKg = materiales.reduce((s,m)=>s+m.kg,0);
  const totalUsd = materiales.reduce((s,m)=>s+m.precio_total,0);
  const sinCalcular = (anidado?.grupos||[]).length - materiales.length;
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, marginBottom:16 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <div style={{ fontWeight:800, fontSize:13, color:C.text }}>📋 Materiales unificados (post-anidado)</div>
        <span style={BDG(C.ok,true)}>{n2(totalKg)} kg total</span>
        {totalUsd>0 && <span style={BDG(C.gold,true)}>${n2(totalUsd)}</span>}
        {sinCalcular>0 && <span style={BDG(C.warn,true)}>{sinCalcular} grupo{sinCalcular!==1?"s":""} sin calcular</span>}
        <button onClick={onClose} style={{ ...BTN("ghost"), marginLeft:"auto", padding:"4px 10px", fontSize:11 }}>✕ Cerrar</button>
      </div>
      {materiales.length===0 ? (
        <div style={{ color:C.muted, fontSize:12 }}>Calculá al menos un grupo para ver la lista unificada.</div>
      ) : (
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>{["Material","Tipo","A comprar","Kg útiles","Kg totales","USD/kg","Total USD","Ficha"].map(h=><th key={h} style={{...TH,fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {materiales.map(m=>(
              <tr key={m.id}>
                <td style={{...TD,fontWeight:700}}>{m.nombre}</td>
                <td style={TD}><span style={BDG(m.tipo==="perfil"?C.info:C.teal,true)}>{m.tipo==="perfil"?"3D":"2D"}</span></td>
                <td style={TD}>
                  <span style={{color:C.ok,fontWeight:700}}>{m.unidades.total} {m.unidades.label}</span>
                  <span style={{color:C.muted,fontSize:10}}> ({m.unidades.util} útil + {m.unidades.desp} desp.)</span>
                </td>
                <td style={{...TD,textAlign:"right",color:C.muted}}>{n2(m.kg_util)} kg</td>
                <td style={{...TD,textAlign:"right",color:C.ok,fontWeight:700}}>{n2(m.kg)} kg</td>
                <td style={{...TD,textAlign:"right",color:m.precio_usd_kg>0?C.text:C.muted}}>{m.precio_usd_kg>0?`U$S ${n2(m.precio_usd_kg)}`:"—"}</td>
                <td style={{...TD,textAlign:"right",color:m.precio_total>0?C.gold:C.muted,fontWeight:700}}>{m.precio_total>0?`$${n2(m.precio_total)}`:"—"}</td>
                <td style={TD}>{[m.ficha.granallado&&"◈ Granallado",m.ficha.pintura&&"🎨 Pintura",m.ficha.galvanizado&&"🔩 Galvanizado",m.ficha.corte_maquina&&("⚙ "+(m.ficha.maquina||"Corte máq.")),m.ficha.plegado&&"🗜️ Plegado",m.ficha.cilindrado&&"🌀 Cilindrado",m.precio_manual&&"$ Precio manual"].filter(Boolean).join(" · ")||"—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ marginTop:10, fontSize:11, color:C.muted }}>
        Para llevar esta lista a un presupuesto: en Presupuesto → ítem → pestaña Hierros → vinculá este anidado desde el desplegable → "⬇ Importar materiales del anidado".
      </div>
    </div>
  );
}

function exportarListaCorte(anidado) {
  let txt = `LISTA DE CORTE — ${anidado.nombre}\n`;
  txt += `Fecha: ${anidado.fecha}\n`;
  txt += `${"─".repeat(60)}\n\n`;
  anidado.grupos.forEach((g,gi)=>{
    txt += `GRUPO ${gi+1}: ${g.material_nombre||"Sin material"}\n`;
    if (g.tipo==="plancha") {
      txt += `Plancha: ${g.sheet_w}×${g.sheet_h} mm\n`;
      if (g.resultado) {
        g.resultado.hojas.forEach(h=>{
          const pzas=h.shelves.flatMap(s=>s.piezas);
          txt += `  Hoja ${h.nro}: ${pzas.map(p=>`${p.etiqueta} (${p.w}×${p.h}mm)`).join(" | ")}\n`;
        });
        const r=g.resultado.resumen;
        txt += `  Total: ${r.n_hojas} hoja(s) · ${r.area_total_m2}m² · ${r.pct_util}% aprovechamiento · ${r.pct_desp}% desperdicio\n`;
      } else txt += `  (sin calcular)\n`;
    } else {
      txt += `Barra: ${g.largo_barra_mm}mm\n`;
      if (g.resultado) {
        g.resultado.barras.forEach(b=>{
          txt += `  Barra ${b.nro}: ${b.piezas.map(p=>`${p.etiqueta} ${p.largo_mm}mm`).join(" | ")} | libre: ${b.libre_mm.toFixed(0)}mm\n`;
        });
        const r=g.resultado.resumen;
        txt += `  Total: ${r.b_total} barra(s) · ${r.m_total}m · ${r.pct_desp}% desperdicio · ${r.kg_total}kg\n`;
      } else txt += `  (sin calcular)\n`;
    }
    txt += "\n";
  });
  const blob=new Blob([txt],{type:"text/plain;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download=`lista_corte_${anidado.nombre.replace(/\s+/g,"_")}.txt`; a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════
export default function Anidado({ usuario, usuarios = [], tcGlobal, logear, onExportarPresupuesto }) {
  const { show: showUndo, Toast } = useUndoToast();
  const [anidados,   setAnidados]   = useState(()=>loadLS("smeas_anidados",[]));
  useMergeAnidadosNube(setAnidados);
  const [selId,      setSelId]      = useState(null);
  const [creando,    setCreando]    = useState(false);
  const [nombre,     setNombre]     = useState("");
  const [fecha,      setFecha]      = useState(new Date().toISOString().split("T")[0]);
  const [cliente,    setCliente]    = useState("");
  const [empresa,    setEmpresa]    = useState("");
  const [obra,       setObra]       = useState("");
  const [computoSel, setComputoSel] = useState("");
  const [showClienteRapido, setShowClienteRapido] = useState(false);
  const [showObraRapida, setShowObraRapida] = useState(false);
  const [showEmpresaRapida, setShowEmpresaRapida] = useState(false);
  const listaClientes = useListaClientes();
  const listaObras = useListaObras();
  const listaEmpresas = useListaEmpresas();
  // Obligatorio resolver cliente, obra y empresa antes de crear el anidado
  // (2026-08-29) — mismo criterio que Computo.jsx.
  const clienteTexto = (cliente || "").trim();
  const clienteSinResolver = clienteTexto && !listaClientes.some(n => n.toLowerCase() === clienteTexto.toLowerCase());
  const obraTexto = (obra || "").trim();
  const obraSinResolver = obraTexto && !listaObras.some(o => (o.nombre || "").trim().toLowerCase() === obraTexto.toLowerCase());
  const empresaTexto = (empresa || "").trim();
  const empresaSinResolver = empresaTexto && !listaEmpresas.some(e => (e.nombre || "").trim().toLowerCase() === empresaTexto.toLowerCase());
  const [confirmarDelId, setConfirmarDelId] = useState(null);
  const [confirmarGrupoId, setConfirmarGrupoId] = useState(null);
  const [verMateriales, setVerMateriales] = useState(false);
  const [filt, setFilt] = useState(ANIDADO_FILT_DEFAULTS);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(true);

  const computos    = useMemo(()=>loadLS("smeas_computos",[]),[]);
  const bibLineales = useBibliotecaLineales();
  const bibPlanchas = useBibliotecaPlanchas();
  const bib_map     = useMemo(()=>Object.fromEntries(bibLineales.map(b=>[b.id,b])),[bibLineales]);
  const bib_planchas_map = useMemo(()=>Object.fromEntries(bibPlanchas.map(b=>[b.id,b])),[bibPlanchas]);

  const save = list => { setAnidados(list); saveLS("smeas_anidados",list); };
  const actual = anidados.find(a=>a.id===selId)||null;

  // Fase 3 (piloto, 2026-08-22): dual-write en paralelo, nunca bloquea ni
  // puede romper el guardado local. Mismo criterio que Presupuesto/Cómputo.
  const dualWriteAnidado = async (a) => {
    if (!supabase) return;
    try {
      const cliente_id = a.cliente ? await resolverClienteId(a.cliente, a.empresa) : null;
      const obra_id = a.obra ? (listaObras.find(o => (o.nombre || "").trim().toLowerCase() === a.obra.trim().toLowerCase())?.id || null) : null;
      const empresa_id = a.empresa ? (listaEmpresas.find(e => (e.nombre || "").trim().toLowerCase() === a.empresa.trim().toLowerCase())?.id || null) : null;
      const vendedor = usuarios.find(u => u.id === a.vendedor)?.profileId || null;
      const { cliente, comentarios, ...resto } = a;
      await saveDBAnidado({ ...resto, cliente_id, obra_id, empresa_id, vendedor, eliminado_por: a.eliminadoPor ?? null, eliminado_fecha: a.eliminadoFecha ?? null });
    } catch (e) {
      console.warn(`[Fase 3] No se pudo sincronizar anidado "${a.nombre || a.id}" con el backend:`, e.message || e);
    }
  };

  const upd = a => { const t = touch(a); save(anidados.map(x=>x.id===a.id?t:x)); dualWriteAnidado(t); };

  // Comentarios internos (2026-08-24): guardado directo, independiente del
  // guardado general del anidado.
  const agregarComentarioAnidado = async (a, comentario) => {
    const t = touch({ ...a, comentarios: [...(a.comentarios || []), comentario] });
    save(anidados.map(x => x.id===a.id ? t : x));
    if (!supabase) return;
    try {
      // Asegura que el anidado exista remoto antes de comentar (condición de
      // carrera real si se comenta justo después de crear — ver Cómputo.jsx).
      await dualWriteAnidado(a);
      await saveDBComentario("comentarios_anidado", "anidado_id", a.id, comentario);
    } catch (e) {
      console.warn(`[Fase 3] No se pudo sincronizar el comentario con el backend:`, e.message || e);
    }
  };
  const eliminarComentarioAnidado = async (a, comentario) => {
    const t = touch({ ...a, comentarios: (a.comentarios || []).filter(c => c.id !== comentario.id) });
    save(anidados.map(x => x.id===a.id ? t : x));
    if (!supabase) return;
    try { await deleteDBComentario("comentarios_anidado", comentario.id); }
    catch (e) { console.warn(`[Fase 3] No se pudo borrar el comentario del backend:`, e.message || e); }
  };

  // Auto-importar cuando viene desde Cómputo
  useEffect(()=>{
    const pendingId=loadLS("smeas_anidar_pending",null);
    if (!pendingId) return;
    saveLS("smeas_anidar_pending",null);
    const comp=loadLS("smeas_computos",[]).find(c=>c.id===pendingId);
    if (!comp) return;
    setComputoSel(pendingId);
    setNombre(comp.nombre);
    setFecha(comp.fecha||new Date().toISOString().split("T")[0]);
    // 2026-08-30, a pedido de Gino: antes solo se traía nombre/fecha —
    // Cliente/Empresa/Obra había que volver a tipearlos a mano aunque ya
    // estaban cargados en el Cómputo de origen.
    setCliente(comp.cliente||"");
    setEmpresa(comp.empresa||"");
    setObra(comp.obra||"");
    setCreando(true);
  },[]);

  // Ir directo a un anidado desde el Buscador global
  useEffect(()=>{
    const pendId=loadLS("smeas_ir_a_anidado",null);
    if (!pendId) return;
    saveLS("smeas_ir_a_anidado",null);
    setSelId(pendId);
  },[]);

  const crear=()=>{
    if (!nombre.trim()) return;
    if (clienteSinResolver) { alert(`El cliente "${clienteTexto}" no existe todavía — creálo con "+ Crear cliente nuevo" antes de guardar.`); return; }
    if (obraSinResolver) { alert(`La obra "${obraTexto}" no existe todavía — creála con "+ Crear obra nueva" antes de guardar.`); return; }
    if (empresaSinResolver) { alert(`La empresa "${empresaTexto}" no existe todavía — creála con "+ Crear empresa nueva" antes de guardar.`); return; }
    // 2026-08-30: dos anidados con el mismo nombre y fecha quedan idénticos
    // en el desplegable "Anidado vinculado" de Presupuesto ("nombre (fecha)")
    // — típicamente pasa al apretar "Anidar" más de una vez desde el mismo
    // Cómputo, que precarga siempre el mismo nombre/fecha (encontrado en
    // vivo por Gino). Se bloquea en vez de solo avisar, a pedido explícito.
    const nombreDup = anidados.find(x => !x.eliminado && normalizarTexto(x.nombre) === normalizarTexto(nombre) && x.fecha === fecha);
    if (nombreDup) {
      alert(`Ya existe un anidado "${nombreDup.nombre}" con la misma fecha — no se van a poder distinguir en los desplegables. Cambiá el nombre o la fecha.`);
      return;
    }
    const grupos=computoSel?importar(computoSel,bib_map,bib_planchas_map):[];
    // Tipo de trabajo/Categoría se heredan solos del cómputo de origen (si
    // se importó desde uno) — 2026-08-24, pedido de Gino: clasificar desde
    // el arranque del flujo en vez de recién al presupuestar.
    const computoOrigen = computoSel ? computos.find(c=>c.id===computoSel) : null;
    const a={id:uid(),nombre:nombre.trim(),fecha,cliente:cliente.trim(),empresa:empresa.trim(),obra:obra.trim(),
      categoria:computoOrigen?.categoria||"", tipo_trabajo:computoOrigen?.tipo_trabajo||"Fabricación",
      vendedor:computoOrigen?.vendedor||usuario?.id||"",
      grupos,comentarios:[],...stamp()};
    save([a,...anidados]); setSelId(a.id); setCreando(false); setNombre(""); setCliente(""); setEmpresa(""); setObra(""); setComputoSel("");
    dualWriteAnidado(a);
    logear?.("Anidado creado", a.nombre);
  };

  const anidadosFiltradosBase = anidados.filter(a => !a.eliminado).filter(a => {
    const enNombre   = !filt.nombre  || (a.nombre||"").toLowerCase().includes(filt.nombre.toLowerCase());
    const enCliente  = !filt.cliente || (a.cliente||"").toLowerCase().includes(filt.cliente.toLowerCase());
    const enObra     = !filt.obra    || (a.obra||"").toLowerCase().includes(filt.obra.toLowerCase());
    const enDesde    = !filt.desde || (a.fecha||"") >= filt.desde;
    const enHasta    = !filt.hasta || (a.fecha||"") <= filt.hasta;
    const enVendedor = !filt.vendedor || String(a.vendedor) === filt.vendedor;
    const enTipo     = !filt.tipo || a.tipo_trabajo === filt.tipo;
    const enFamilia  = !filt.familia || familiaDe(a.categoria) === filt.familia;
    return enNombre && enCliente && enObra && enDesde && enHasta && enVendedor && enTipo && enFamilia;
  });
  const { ordenados: anidadosFiltrados, campo: sortCampo, dir: sortDir, ordenarPor } = useSortable(anidadosFiltradosBase, "fecha", "desc");

  const delAnidado=id=>{
    const a = anidados.find(x=>x.id===id);
    if (!a) return;
    const marcado = { ...a, eliminado:true, eliminadoPor:usuario?.nombre||"", eliminadoFecha:new Date().toISOString() };
    setAnidados(prev=>{ const next=prev.map(x=>x.id===id?marcado:x); saveLS("smeas_anidados",next); return next; });
    if (selId===id) setSelId(null);
    dualWriteAnidado(marcado);
    logear?.("Anidado eliminado", a.nombre||"");
    showUndo(`Anidado "${a.nombre||""}" eliminado.`, () => {
      const restaurado = { ...marcado, eliminado:false, eliminadoPor:null, eliminadoFecha:null };
      setAnidados(prev=>{ const next=prev.map(x=>x.id===id?restaurado:x); saveLS("smeas_anidados",next); return next; });
      dualWriteAnidado(restaurado);
      logear?.("Anidado restaurado", a.nombre||"");
    });
  };
  const anidadoAEliminar = confirmarDelId ? anidados.find(a=>a.id===confirmarDelId) : null;

  // Clonar (2026-08-24, pedido de Gino: mismo criterio que Cómputo/Presupuesto)
  const clonarAnidado = (a) => {
    const nuevo = { ...a, id: uid(), nombre: `${a.nombre} (copia)`,
      grupos: a.grupos.map(g => ({ ...g, id: uid(), piezas: (g.piezas||[]).map(p => ({ ...p, id: uid() })) })),
      comentarios: [], ...stamp() };
    save([nuevo, ...anidados]);
    setSelId(nuevo.id);
    dualWriteAnidado(nuevo);
  };

  const addGrupoPerf=()=>{ if(!actual)return; upd({...actual,grupos:[...actual.grupos,{id:uid(),tipo:"perfil",material_id:"",material_nombre:"",kg_m:0,sup_m2m:0,largo_barra_mm:6000,kerf_mm:0,piezas:[],resultado:null}]}); };
  const addGrupoPlancha=()=>{ if(!actual)return; upd({...actual,grupos:[...actual.grupos,{id:uid(),tipo:"plancha",material_id:"",material_nombre:"",kg_m2:0,sheet_w:6000,sheet_h:1500,piezas:[],resultado:null}]}); };

  const reImportar=()=>{
    if(!actual||!computoSel) return;
    const nuevos=importar(computoSel,bib_map,bib_planchas_map);
    upd({...actual,grupos:[...actual.grupos,...nuevos]});
  };

  const hayResultados = actual?.grupos?.some(g=>g.resultado);

  // Calcula el anidado de TODOS los grupos de una sola vez (en vez de uno por uno).
  const calcularTodo = () => {
    if (!actual) return;
    const nuevosGrupos = actual.grupos.map(g => {
      if (g.tipo === "plancha") {
        const sw = parseFloat(g.sheet_w)||0, sh = parseFloat(g.sheet_h)||0;
        if (sw<=0||sh<=0 || !g.piezas.length) return g;
        return { ...g, resultado: run2DFFD(g.piezas, sw, sh) };
      }
      if (!g.piezas.length) return g;
      return { ...g, resultado: runFFD(g.piezas, parseFloat(g.largo_barra_mm)||6000, parseFloat(g.kerf_mm)||0, g.kg_m) };
    });
    upd({ ...actual, grupos: nuevosGrupos });
  };

  // Total kg útil de todos los grupos (para calcular incidencia %)
  const totalKgAll = useMemo(() => {
    if (!actual) return 0;
    return actual.grupos.reduce((s,g) => {
      if (!g.resultado) return s;
      if (g.tipo==="perfil")  return s + (g.resultado.resumen.kg_util||0);
      if (g.tipo==="plancha") return s + (g.resultado.resumen.area_util_m2||0)*(g.kg_m2||0);
      return s;
    },0);
  },[actual]);

  return (
    <div>
      {Toast}
      {anidadoAEliminar && (
        <ModalConfirmarEliminar
          titulo={`anidado "${anidadoAEliminar.nombre||"Sin nombre"}"`}
          usuarioPropio={usuario}
          onConfirm={() => { delAnidado(anidadoAEliminar.id); setConfirmarDelId(null); }}
          onClose={() => setConfirmarDelId(null)}
        />
      )}
      {showClienteRapido && (
        <ClienteRapidoModal
          nombreInicial={clienteTexto}
          empresaInicial={empresa}
          onClose={() => setShowClienteRapido(false)}
          onCreated={c => { setCliente(c.nombre); if (c.empresa) setEmpresa(c.empresa); }}
        />
      )}
      {showObraRapida && (
        <ObraRapidaModal
          nombreInicial={obraTexto}
          empresaInicial={empresa}
          onClose={() => setShowObraRapida(false)}
          onCreated={o => setObra(o.nombre)}
        />
      )}
      {showEmpresaRapida && (
        <EmpresaRapidaModal
          nombreInicial={empresaTexto}
          onClose={() => setShowEmpresaRapida(false)}
          onCreated={e => setEmpresa(e.nombre)}
        />
      )}
      {!actual && (
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:20 }}>
        <span style={{ fontSize:20 }}>✂️</span>
        <h2 style={{ margin:0,fontSize:18,fontWeight:800,color:C.text }}>Optimizador de Corte</h2>
        <div style={{ marginLeft:"auto" }}>
          <button onClick={()=>setCreando(v=>!v)} style={{ ...BTN("primary"),padding:"6px 18px",fontSize:12 }}>+ Nuevo</button>
        </div>
      </div>
      )}

      {!actual && creando&&(
        <div style={{ background:C.iron,border:`1px solid ${C.accent}44`,borderRadius:10,padding:20,marginBottom:20,maxWidth:480 }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.accent, marginBottom:14 }}>Nuevo anidado</div>
          <label style={LBL}>Nombre</label>
          <input type="text" placeholder="Ej: Pilares CCFC" value={nombre} onChange={e=>setNombre(e.target.value)} onKeyDown={e=>e.key==="Enter"&&crear()} autoFocus style={{ ...INP,marginBottom:10 }}/>
          <label style={LBL}>Fecha</label>
          <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} style={{ ...INP,marginBottom:10 }}/>
          <label style={LBL}>Cliente</label>
          <AutocompleteCliente placeholder="Ej: Juan Pérez" value={cliente} onChange={setCliente} style={{ ...INP,marginBottom: clienteSinResolver ? 4 : 10 }}/>
          {clienteSinResolver && (
            <div style={{ fontSize:11, color:C.warn, marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
              ⚠️ Este cliente no existe todavía
              <button type="button" onClick={()=>setShowClienteRapido(true)} style={{ background:"none", border:`1px solid ${C.warn}55`, color:C.warn, borderRadius:5, padding:"1px 8px", cursor:"pointer", fontSize:11, fontWeight:700 }}>+ Crear cliente nuevo</button>
            </div>
          )}
          <label style={LBL}>Empresa</label>
          <AutocompleteEmpresa placeholder="Ej: CCFC" value={empresa} onChange={setEmpresa} style={{ ...INP,marginBottom: empresaSinResolver ? 4 : 10 }}/>
          {empresaSinResolver && (
            <div style={{ fontSize:11, color:C.warn, marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
              ⚠️ Esta empresa no existe todavía
              <button type="button" onClick={()=>setShowEmpresaRapida(true)} style={{ background:"none", border:`1px solid ${C.warn}55`, color:C.warn, borderRadius:5, padding:"1px 8px", cursor:"pointer", fontSize:11, fontWeight:700 }}>+ Crear empresa nueva</button>
            </div>
          )}
          <label style={LBL}>Obra</label>
          <AutocompleteObra placeholder="Ej: Nave Industrial" value={obra} onChange={setObra} style={{ ...INP,marginBottom: obraSinResolver ? 4 : 10 }}/>
          {obraSinResolver && (
            <div style={{ fontSize:11, color:C.warn, marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
              ⚠️ Esta obra no existe todavía
              <button type="button" onClick={()=>setShowObraRapida(true)} style={{ background:"none", border:`1px solid ${C.warn}55`, color:C.warn, borderRadius:5, padding:"1px 8px", cursor:"pointer", fontSize:11, fontWeight:700 }}>+ Crear obra nueva</button>
            </div>
          )}
          <label style={LBL}>Importar desde cómputo (opcional)</label>
          <select value={computoSel} onChange={e=>setComputoSel(e.target.value)} style={{ ...INP,marginBottom:6 }}>
            <option value="">— vacío —</option>
            {computos.map(c=><option key={c.id} value={c.id}>{c.nombre} ({c.fecha})</option>)}
          </select>
          {computoSel && (computos.find(c=>c.id===computoSel)?.cantidad_total||1)>1 && (
            <div style={{ fontSize:11, color:C.pur, marginBottom:10 }}>
              ⚠ Incluye ×{computos.find(c=>c.id===computoSel).cantidad_total} (cantidad total del cómputo)
            </div>
          )}
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={crear} style={{ ...BTN("ok"),flex:1 }}>Crear</button>
            <button onClick={()=>setCreando(false)} style={{ ...BTN("ghost"),flex:1 }}>Cancelar</button>
          </div>
        </div>
      )}

      {!actual && anidados.length>0&&(
        <>
          <FiltrosBar campos={anidadoCampos(usuarios)} valores={filt} setValores={setFilt} defaults={ANIDADO_FILT_DEFAULTS}
            abierto={filtrosAbiertos} setAbierto={setFiltrosAbiertos} />
          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
            <OrdenarControl campo={sortCampo} dir={sortDir} ordenarPor={ordenarPor}
              opciones={[{ value:"fecha", label:"Fecha" }, { value:"nombre", label:"Nombre" }, { value:"cliente", label:"Cliente" }]} />
            <span style={{ fontSize:11, color:C.muted }}>{anidadosFiltrados.length} de {anidados.length}</span>
          </div>
        </>
      )}

      {!actual && (
      <>
        {anidados.length===0&&!creando&&<div style={{ color:C.muted,fontSize:13,padding:"12px 0" }}>No hay anidados aún.</div>}
        {anidados.length>0&&anidadosFiltrados.length===0&&<div style={{ color:C.muted,fontSize:13,padding:"12px 0" }}>Sin resultados.</div>}
        {/* Lista — una fila por anidado, ancho completo (2026-08-24, mismo
            criterio que Cómputo: mas info visible, tipo Excel) */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {anidadosFiltrados.map(a=>{
            const nG=a.grupos?.length||0;
            const materiales = materialesUnificados(a, tcGlobal);
            const kg = materiales.reduce((s,m)=>s+m.kg,0);
            const monto = materiales.reduce((s,m)=>s+m.precio_total,0);
            const vendedorNombre = usuarios.find(u=>u.id===a.vendedor)?.nombre;
            return(
              <div key={a.id} onClick={()=>setSelId(a.id)}
                style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:10,
                  padding:"12px 16px",cursor:"pointer",transition:"border-color .15s",
                  display:"flex",alignItems:"center",gap:18,flexWrap:"wrap" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent+"88"}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                <div style={{ flex:"2 1 220px", minWidth:0 }}>
                  <div style={{ fontWeight:800,fontSize:14,color:C.text }}>{a.nombre||"Sin nombre"}</div>
                  <div style={{ fontSize:11,color:C.muted, marginTop:2 }}>{a.fecha} · {nG} grupo{nG!==1?"s":""}{(a.cliente||a.obra)?` · ${[a.cliente,a.obra].filter(Boolean).join(" · ")}`:""}</div>
                </div>
                <div style={{ flex:"1 1 130px", minWidth:0 }}>
                  <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase" }}>Tipo / Familia</div>
                  <div style={{ fontSize:12, color:C.steel, fontWeight:600 }}>{a.tipo_trabajo||"—"}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{a.categoria?familiaDe(a.categoria):"—"}</div>
                </div>
                <div style={{ flex:"1 1 110px", minWidth:0 }}>
                  <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase" }}>Vendedor</div>
                  <div style={{ fontSize:12, color:C.text, fontWeight:600 }}>{vendedorNombre||"— Sin asignar —"}</div>
                </div>
                <div style={{ textAlign:"right", minWidth:90 }}>
                  <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase" }}>Kg</div>
                  <div style={{ fontSize:16, fontWeight:800, color:C.ok }}>{kg>0?n2(kg):"—"}</div>
                </div>
                <div style={{ textAlign:"right", minWidth:100 }}>
                  <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase" }}>Monto U$S</div>
                  <div style={{ fontSize:16, fontWeight:800, color:C.gold }}>{monto>0?n2(monto):"—"}</div>
                </div>
                <div style={{ display:"flex", gap:6, marginLeft:"auto" }} onClick={e=>e.stopPropagation()}>
                  <button onClick={()=>clonarAnidado(a)} title="Clonar este anidado completo"
                    style={{ ...BTN("ghost"), padding:"4px 10px", fontSize:11 }}>
                    ⧉ Clonar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </>
      )}

      {actual && (
        <div>
          <button style={BTN("ghost")} onClick={()=>setSelId(null)}>← Anidados</button>
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:12,marginTop:16,marginBottom:16,flexWrap:"wrap" }}>
              <div>
                <div style={{ fontSize:18,fontWeight:800,color:C.text }}>{actual.nombre}</div>
                <div style={{ fontSize:12,color:C.muted }}>{actual.fecha}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <select value={actual.tipo_trabajo||"Fabricación"}
                  onChange={e=>upd({...actual,tipo_trabajo:e.target.value})}
                  style={{ ...INP, padding:"3px 6px", fontSize:11, width:140 }}>
                  {TIPOS_TRABAJO.map(t=><option key={t}>{t}</option>)}
                </select>
                <SelectCategoria value={actual.categoria} onChange={v=>upd({...actual,categoria:v})}
                  style={{ padding:"3px 6px", fontSize:11, width:140 }} />
                {actual.categoria && <div style={{ fontSize:9, color:C.muted }}>{familiaDe(actual.categoria)}</div>}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <span style={{ fontSize:10, color:C.muted, textTransform:"uppercase" }}>Vendedor</span>
                <select value={actual.vendedor||""} onChange={e=>upd({...actual,vendedor:e.target.value})}
                  style={{ ...INP, padding:"3px 6px", fontSize:11, width:140 }}>
                  <option value="">— Sin asignar —</option>
                  {usuarios.map(u=><option key={u.id} value={u.id}>{u.nombre}</option>)}
                </select>
              </div>
              <div style={{ marginLeft:"auto",display:"flex",gap:8,flexWrap:"wrap",alignItems:"center" }}>
                <button onClick={()=>setConfirmarDelId(actual.id)} style={{ ...BTN("danger"),fontSize:12 }}>Eliminar</button>
                {actual.grupos.length>0&&(
                  <button onClick={calcularTodo} style={{ ...BTN("primary"),fontSize:12 }}>
                    ⚡ Calcular todo ({actual.grupos.length})
                  </button>
                )}
                {hayResultados&&(
                  <button onClick={()=>setVerMateriales(v=>!v)} style={{ ...BTN(verMateriales?"ok":"ghost"),fontSize:12 }}>
                    📋 Materiales unificados
                  </button>
                )}
                {hayResultados&&(
                  <button onClick={()=>exportarListaCorte(actual)} style={{ ...BTN("ghost"),borderColor:C.gold+"66",color:C.gold,fontSize:12 }}>
                    ⬇ Exportar lista
                  </button>
                )}
                {hayResultados&&(
                  <button onClick={()=>{
                      // 2026-08-30, a pedido de Gino: llevar los materiales
                      // Y los datos (nombre/cliente/empresa/obra/tipo/
                      // categoría) del anidado a Presupuesto en un solo paso
                      // — reusa el mismo mecanismo ya armado en Presupuesto
                      // (smeas_material_export_pending / ImportarMaterialesModal),
                      // que hasta ahora nadie llenaba del lado de acá.
                      const mats = materialesUnificados(actual, tcGlobal).map(m => ({
                        nombre: m.nombre, kg: m.kg, sup: m.sup, usd_kg: m.precio_usd_kg || 0,
                        granallado: !!m.ficha?.granallado, pintura: !!m.ficha?.pintura, galvanizado: !!m.ficha?.galvanizado,
                        corte_maquina: !!m.ficha?.corte_maquina, maquina: m.ficha?.maquina||"",
                        plegado: !!m.ficha?.plegado, cilindrado: !!m.ficha?.cilindrado,
                      }));
                      saveLS("smeas_material_export_pending", mats);
                      // Anidado usa "cliente" para la persona y "empresa" para la
                      // razón social — en Presupuesto es al revés (cliente=empresa,
                      // contacto=persona), mismo mapeo que ya usa el resto del sistema.
                      saveLS("smeas_presupuesto_precarga_pending", {
                        nombre: actual.nombre, cliente: actual.empresa, contacto: actual.cliente, obra: actual.obra,
                        tipo_trabajo: actual.tipo_trabajo, categoria: actual.categoria,
                      });
                      onExportarPresupuesto?.();
                    }} style={{ ...BTN("ghost"),borderColor:C.ok+"66",color:C.ok,fontSize:12 }}>
                    → Pasar a Presupuesto
                  </button>
                )}
                <select value={computoSel} onChange={e=>setComputoSel(e.target.value)} style={{ ...INP,width:200,padding:"5px 8px",fontSize:12 }}>
                  <option value="">Elegir cómputo…</option>
                  {computos.map(c=><option key={c.id} value={c.id}>{c.nombre} ({c.fecha})</option>)}
                </select>
                <button onClick={reImportar} disabled={!computoSel} style={{ ...BTN("ghost"),fontSize:12,opacity:computoSel?1:0.4 }}>📥 Importar</button>
                <button onClick={addGrupoPerf} style={{ ...BTN("ghost"),fontSize:12,borderColor:C.info+"66",color:C.info }}>+ Perfil</button>
                <button onClick={addGrupoPlancha} style={{ ...BTN("ghost"),fontSize:12,borderColor:C.teal+"66",color:C.teal }}>+ Plancha</button>
              </div>
            </div>

            <ComentariosPanel comentarios={actual.comentarios} usuario={usuario}
              onAgregar={(c) => agregarComentarioAnidado(actual, c)}
              onEliminar={(c) => eliminarComentarioAnidado(actual, c)} />

            {verMateriales && <VistaMaterialesAnidado anidado={actual} onClose={()=>setVerMateriales(false)} tcGlobal={tcGlobal} />}

            {actual.grupos.length===0&&(
              <div style={{ color:C.muted,fontSize:13,padding:"20px 0" }}>Importá desde un cómputo o agregá grupos manuales.</div>
            )}
            {actual.grupos.map((g,i)=>{
              const cambiar=updated=>upd({...actual,grupos:actual.grupos.map((x,j)=>j===i?updated:x)});
              return g.tipo==="plancha"
                ? <GrupoPlancha key={g.id} g={g} bib={bibPlanchas} onChange={cambiar} onEliminar={()=>setConfirmarGrupoId(g.id)} totalKgAll={totalKgAll}/>
                : <Grupo        key={g.id} g={g} bib={bibLineales} onChange={cambiar} onEliminar={()=>setConfirmarGrupoId(g.id)} totalKgAll={totalKgAll}/>;
            })}
            {confirmarGrupoId && (
              <ModalConfirmarBorrado
                titulo={`"${actual.grupos.find(g=>g.id===confirmarGrupoId)?.material_nombre || "este grupo"}"`}
                subtitulo="Se pierden todas las piezas y el corte calculado de este grupo."
                onConfirm={()=>{
                  upd({...actual,grupos:actual.grupos.filter(g=>g.id!==confirmarGrupoId)});
                  setConfirmarGrupoId(null);
                }}
                onClose={()=>setConfirmarGrupoId(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
