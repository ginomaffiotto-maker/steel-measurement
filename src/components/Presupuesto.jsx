import { useState, useEffect } from "react";
import { C, TH, TD, INP, LBL, BDG, BTN } from "../styles/colors";
import { saveLS, loadLS, uid, stamp, touch, loadTarifario, newNroPresupuesto, newCodigoCalculo, exportPresupuestoParaSteelCRM, loadBloquesPDF, resolverClienteId, saveDBPresupuestoSM, saveDBItem, useMergePresupuestosNube, saveDBComentario } from "../utils/storage";
import ComentariosPanel from "./ComentariosPanel";
import { supabase } from "../utils/supabaseClient";
import AutocompleteCliente from "./AutocompleteCliente";
import AutocompleteEmpresa from "./AutocompleteEmpresa";
import { puedeEliminar, ModalConfirmarEliminar, ModalConfirmarBorrado } from "./ConfirmarEliminar";
import { PRESUPUESTOS_HISTORICOS_SEED } from "../utils/presupuestosHistoricosSeed";
import { abrirPDFPresupuesto } from "../utils/pdfPresupuesto";
import { FAMILIAS, familiaDe } from "../utils/taxonomia";

// ─── HELPERS ─────────────────────────────────────────────────────
const n2  = v => (Math.round((+v || 0) * 100) / 100).toFixed(2);
const n3  = v => (Math.round((+v || 0) * 1000) / 1000).toFixed(3);
const hoy = () => new Date().toISOString().split("T")[0];

// Tooltips para términos técnicos en cabeceras de tabla (title nativo del navegador)
const TH_TOOLTIPS = {
  "USD/kg": "Precio en dólares por kilogramo de material",
  "% Desp.": "% de desperdicio = kg perdidos en el corte ÷ kg totales comprados. Se completa automáticamente al importar de un Anidado.",
};

// Al aprobar un presupuesto, ofrece actualizar Insumos y Precios con los
// USD/kg realmente usados en los ítems de Hierros — SIEMPRE con confirmación
// previa, nunca en silencio (pedido explícito del usuario). Separado en
// cálculo (puro) + aplicación para poder mostrar la confirmación con el
// modal propio del proyecto en vez de window.confirm.
function calcularCambiosPrecios(pres) {
  const hierros = (pres.items || []).flatMap(it => it.hierros || []);
  if (hierros.length === 0) return [];
  const catalogos = ["smeas_perfiles", "smeas_planchuelas", "smeas_planchas"];
  const porNombre = {};
  catalogos.forEach(key => loadLS(key, []).forEach(it => { porNombre[it.nombre] = { ...it, __key: key }; }));

  const cambios = [];
  hierros.forEach(r => {
    if (!r.nombre || !r.usd_kg) return;
    const bib = porNombre[r.nombre];
    if (!bib) return;
    const actual = +bib.precio_usd_kg || 0;
    if (Math.abs(actual - (+r.usd_kg)) > 0.001) {
      cambios.push({ nombre: r.nombre, key: bib.__key, id: bib.id, desde: actual, hasta: +r.usd_kg });
    }
  });
  return cambios;
}

function aplicarCambiosPrecios(pres, cambios) {
  const porKey = {};
  cambios.forEach(c => { (porKey[c.key] = porKey[c.key] || []).push(c); });
  Object.entries(porKey).forEach(([key, lista]) => {
    const map = {}; lista.forEach(c => { map[c.id] = c; });
    const items = loadLS(key, []).map(it => {
      const c = map[it.id];
      if (!c) return it;
      const entrada = { id: uid(), fecha: hoy(), proveedor: `Presupuesto ${pres.nro || ""}`.trim(), precio: c.hasta };
      return { ...it, precio_usd_kg: c.hasta, historial_precios: [entrada, ...(it.historial_precios || [])] };
    });
    saveLS(key, items);
  });
}

// kg 3D (perfiles) y kg 2D (planchas) de un anidado ya calculado.
function anidadoKg(anidado) {
  let kg3D = 0, kg2D = 0;
  (anidado?.grupos || []).forEach(g => {
    if (!g.resultado) return;
    if (g.tipo === "plancha") kg2D += (g.resultado.resumen?.area_total_m2 || 0) * (g.kg_m2 || 0);
    else kg3D += g.resultado.resumen?.kg_total || 0;
  });
  return { kg3D, kg2D };
}
// Lista de materiales agregados por material desde el RESULTADO ya calculado
// de un anidado (kg reales post-anidado, no los crudos del cómputo), con las
// selecciones de tratamiento (ficha) de cada grupo/material.
// Fallback de sup_m2m (m²/m de pintura) por si el grupo es de un anidado viejo,
// creado antes de que se empezara a guardar ese dato al elegir el material.
function bibSupM2mFallback(material_id, material_nombre) {
  const bib = [...loadLS("smeas_perfiles",[]), ...loadLS("smeas_planchuelas",[])];
  const mat = bib.find(m=>m.id===material_id) || bib.find(m=>m.nombre===material_nombre);
  return parseFloat(mat?.sup) || 0;
}

function materialesUnificadosAnidado(anidado) {
  return (anidado?.grupos || []).filter(g => g.resultado).map(g => {
    const r = g.resultado.resumen || {};
    const sup_m2m = g.sup_m2m || (g.tipo!=="plancha" ? bibSupM2mFallback(g.material_id, g.material_nombre) : 0);
    const kg = g.tipo === "plancha"
      ? (r.area_total_m2 || 0) * (g.kg_m2 || 0)
      : (r.kg_total || 0);
    const sup = g.tipo === "plancha"
      ? (r.area_total_m2 || 0)
      : (r.m_total || 0) * sup_m2m;
    const unidades = g.tipo === "plancha"
      ? { util: r.area_total_m2>0 ? Math.round((r.area_util_m2/r.area_total_m2)*r.n_hojas*100)/100 : 0, total: r.n_hojas || 0, label: "hojas" }
      : { util: r.b_util || 0, total: r.b_total || 0, label: "barras" };
    unidades.desp = +((unidades.total||0) - (unidades.util||0)).toFixed(2);
    // % desperdicio de este material (kg_total incluye el desperdicio de corte, kg_util no)
    const pct_desperdicio = g.tipo === "plancha" ? (r.pct_desp || 0) : (r.kg_total>0 ? Math.round((1 - (r.kg_util||0)/r.kg_total)*1000)/10 : 0);
    return { id: g.id, tipo: g.tipo, nombre: g.material_nombre || "Sin material", kg, sup, unidades, pct_desperdicio, ficha: g.ficha || {} };
  });
}

const ESTADO_CFG = {
  borrador:  { label: "Borrador",  color: C.muted },
  enviado:   { label: "Enviado",   color: C.info  },
  aprobado:  { label: "Aprobado",  color: C.ok    },
  rechazado: { label: "Rechazado", color: C.err   },
};
const TIPOS = ["Fabricación", "Montaje", "Fab+Mont"];

// Categoría: mismo mapeo Familia→Categoría que ya usa Historial (taxonomia.js),
// dropdown en vez de texto libre para que no diverja de la lista canónica —
// necesario para que el export a steelCRM (§4 de esta sesión) y los reportes
// cruzados por Familia/Categoría funcionen también con datos de Presupuesto.
export function SelectCategoria({ value, onChange }) {
  return (
    <select style={INP} value={value || ""} onChange={e => onChange(e.target.value)}>
      <option value="">— Sin categoría —</option>
      {Object.entries(FAMILIAS).map(([familia, cats]) => (
        <optgroup key={familia} label={familia}>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </optgroup>
      ))}
    </select>
  );
}

const TIPO_HORA_OPCIONES = [
  { label: "Común",    pct: 0   },
  { label: "Nocturna", pct: 25  },
  { label: "Extra",    pct: 100 },
  { label: "Lluvia",   pct: 20  },
];
// Normaliza valores viejos de tipo_hora ("comun"/"extra", sin % aplicado) al nuevo esquema.
const normalizarTipoHora = (v) => v === "comun" ? "Común" : v === "extra" ? "Extra" : (v || "Común");
const UNIDADES = ["kg", "m²", "m", "u", "hora", "día", "mes"];

export const iPresupuesto = () => ({
  id: uid(), nro: "", codigo_calculo: "", nombre: "", cliente: "", contacto: "", comentarios: [],
  obra: "", detalle: "", tipo_trabajo: "Fabricación", categoria: "",
  estado: "borrador", clonado_de: null,
  negociacion_pct: 0, negociacion_usd: 0, neg_modo: "pct",
  interes_pct: 0, interes_dias: 30,
  items: [], notas: "",
  fecha: new Date().toISOString().slice(0, 10),
  ...stamp(),
});

// Preset de rubros activos según el tipo de trabajo del ítem — sólo
// controla qué pestañas se muestran en el editor (no borra datos ni
// afecta calcItem: un rubro oculto con filas cargadas sigue sumando).
const PRESET_TIPO_RUBROS = {
  fabricacion: { hierros:true,  mat_generales:true, mo_fabricacion:true,  mo_montajes:false, terc_fabricacion:true,  terc_montajes:false, trat_superficie:true, traslados:false, corte_pantografo:true  },
  montaje:     { hierros:false, mat_generales:true, mo_fabricacion:false, mo_montajes:true,  terc_fabricacion:false, terc_montajes:true,  trat_superficie:true, traslados:true,  corte_pantografo:false },
  fab_mont:    { hierros:true,  mat_generales:true, mo_fabricacion:true,  mo_montajes:true,  terc_fabricacion:true,  terc_montajes:true,  trat_superficie:true, traslados:true,  corte_pantografo:true  },
};

export const iItem = () => ({
  id: uid(), titulo: "Ítem nuevo", cantidad: 1, n_plano: "",
  no_agrega_kg: false, computo_id: "",
  tipo: "fab_mont", rubrosActivos: { ...PRESET_TIPO_RUBROS.fab_mont },
  hierros: [], mat_generales: [],
  mo_fabricacion: [], mo_montajes: [], horas_especiales: [],
  terc_fabricacion: [], terc_montajes: [],
  trat_superficie: { pinturas: [], arenado_m2: 0, arenado_usd_m2: loadTarifario().arenado_usd_m2, galvanizado: false },
  traslados: [], corte_pantografo: [],
});

// ─── CÁLCULOS ────────────────────────────────────────────────────
// export sólo para poder testearlas directamente (src/components/__tests__) —
// siguen siendo funciones internas del módulo, no una API pública nueva.
export function calcItem(it) {
  const cant      = +it.cantidad || 1;
  const hier_usd  = (it.hierros || []).reduce((s, h) => s + (+h.subtotal_usd || 0), 0);
  const hier_kg   = (it.hierros || []).reduce((s, h) => s + (+h.subtotal_kg  || 0), 0);
  // % desperdicio ponderado por kg, solo entre las filas que vinieron de un anidado calculado
  const kg_con_desp  = (it.hierros || []).reduce((s, h) => s + (h.pct_desperdicio>0 ? (+h.subtotal_kg||0) : 0), 0);
  const kg_desp_pond = (it.hierros || []).reduce((s, h) => s + (h.pct_desperdicio>0 ? (+h.subtotal_kg||0)*(+h.pct_desperdicio||0)/100 : 0), 0);
  const mat_usd   = (it.mat_generales || []).reduce((s, m) => s + (+m.subtotal_usd || 0), 0);
  const moFab_usd = (it.mo_fabricacion || []).reduce((s, m) => s + (+m.subtotal_usd || 0), 0);
  const moFab_h   = (it.mo_fabricacion || []).reduce((s, m) => s + (+m.cant_horas   || 0), 0);
  const moMon_usd = (it.mo_montajes || []).reduce((s, m) => s + (+m.subtotal_usd || 0), 0);
  const moMon_h   = (it.mo_montajes || []).reduce((s, m) => s + (+m.cant_horas   || 0), 0);
  const hesp_usd  = (it.horas_especiales || []).reduce((s, h) => s + (+h.subtotal_usd || 0), 0);
  const tFab_usd  = (it.terc_fabricacion || []).reduce((s, t) => s + (+t.subtotal_usd || 0), 0);
  const tMon_usd  = (it.terc_montajes || []).reduce((s, t) => s + (+t.subtotal_usd || 0), 0);
  const ts          = it.trat_superficie || {};
  const tarifarioCI = loadTarifario();
  const trat_usd  = (ts.pinturas || []).reduce((s, p) => s + (+p.subtotal_usd || 0), 0)
                  + (+ts.arenado_m2 || 0) * (+ts.arenado_usd_m2 || tarifarioCI.arenado_usd_m2 || 0)
                  + (ts.galvanizado ? (+ts.galvanizado_kg || 0) * (+ts.galvanizado_usd_kg || tarifarioCI.galvanizado_usd_kg || 0) : 0)
                  + (ts.otros || []).reduce((s, o) => s + (+o.usd_kg || 0), 0) * hier_kg;
  const trasl_usd = (it.traslados || []).reduce((s, t) => s + (+t.subtotal_usd || 0), 0);
  const panto_usd = (it.corte_pantografo || []).reduce((s, c) => s + (+c.subtotal_usd || 0), 0);

  const total_unit = hier_usd + mat_usd + moFab_usd + moMon_usd + hesp_usd
                   + tFab_usd + tMon_usd + trat_usd + trasl_usd + panto_usd;
  const total_usd  = total_unit * cant;
  const total_kg   = it.no_agrega_kg ? 0 : hier_kg * cant;
  const usd_kg     = total_kg > 0 ? total_usd / total_kg : 0;

  return {
    hier_usd, hier_kg, mat_usd, moFab_usd, moFab_h, moMon_usd, moMon_h,
    hesp_usd, tFab_usd, tMon_usd, trat_usd, trasl_usd, panto_usd,
    total_unit, total_usd, total_kg, usd_kg, kg_con_desp, kg_desp_pond,
    pct_desperdicio: kg_con_desp>0 ? kg_desp_pond/kg_con_desp*100 : 0,
    kg_hora_fab: (hier_kg > 0 && moFab_h > 0) ? hier_kg / moFab_h : 0,
  };
}

export function calcPresupuesto(p) {
  const rubros = { hier:0, mat:0, moFab:0, moMon:0, hesp:0, tFab:0, tMon:0, trat:0, trasl:0, panto:0 };
  let total_usd = 0, total_kg = 0, kg_con_desp = 0, kg_desp_pond = 0;
  for (const it of p.items || []) {
    const c = calcItem(it);
    const q = +it.cantidad || 1;
    rubros.hier  += c.hier_usd  * q; rubros.mat   += c.mat_usd   * q;
    rubros.moFab += c.moFab_usd * q; rubros.moMon += c.moMon_usd * q;
    rubros.hesp  += c.hesp_usd  * q; rubros.tFab  += c.tFab_usd  * q;
    rubros.tMon  += c.tMon_usd  * q; rubros.trat  += c.trat_usd  * q;
    rubros.trasl += c.trasl_usd * q; rubros.panto += c.panto_usd * q;
    total_usd += c.total_usd;
    total_kg  += c.total_kg;
    kg_con_desp  += c.kg_con_desp  * q;
    kg_desp_pond += c.kg_desp_pond * q;
  }
  // Negociación: monto que se SUMA al subtotal (margen de negociación, no descuento).
  const neg_usd  = p.neg_modo === "usd" ? (+p.negociacion_usd || 0) : total_usd * (+p.negociacion_pct || 0) / 100;
  const int_usd  = (total_usd + neg_usd) * (+p.interes_pct || 0) / 100;
  const gran_total = total_usd + neg_usd + int_usd;
  return {
    rubros, total_usd, total_kg, neg_usd, int_usd, gran_total, usd_kg: total_kg > 0 ? gran_total / total_kg : 0,
    pct_desperdicio: kg_con_desp>0 ? kg_desp_pond/kg_con_desp*100 : 0,
  };
}

// El PDF nunca muestra el desglose de rubros (expondría la estructura de
// costos interna al cliente) — solo el resumen: kg totales, USD/kg promedio
// y el monto final. Los rubros siguen calculándose y quedan asociados al
// presupuesto (calcPresupuesto), simplemente no se imprimen fila por fila.
function generarPDFPresupuesto(pres) {
  const c = calcPresupuesto(pres);

  abrirPDFPresupuesto({
    empresa: loadLS("smeas_empresa", ""),
    nro: pres.nro,
    fecha: pres.fecha,
    cliente: { empresa: pres.cliente, contacto: pres.contacto },
    proyecto: { descripcion: pres.detalle || pres.nombre, obra: pres.obra, tipo: pres.tipo_trabajo },
    items: [{
      label: pres.detalle || pres.nombre || "—",
      sub: pres.obra,
      kg: c.total_kg,
      usdKg: c.usd_kg,
      totalUSD: c.gran_total,
    }],
    totalUSD: c.gran_total,
    condiciones: { moneda: pres.moneda || "USD", formaPago: pres.forma_pago },
    notas: pres.notas,
    bloques: loadBloquesPDF(),
  });
}

// ─── MODAL NUEVO PRESUPUESTO ─────────────────────────────────────
function ModalNuevo({ onSave, onClose }) {
  const [form, setForm] = useState({ nombre:"", cliente:"", contacto:"", obra:"", detalle:"", tipo_trabajo:"Fabricación", categoria:"" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div style={{ position:"fixed",inset:0,zIndex:1000,background:"#000a",display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
      <div style={{ background:C.card,border:`1.5px solid ${C.accent}55`,borderRadius:14,padding:28,width:"100%",maxWidth:560,maxHeight:"90vh",overflowY:"auto" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22 }}>
          <div style={{ color:C.accent,fontWeight:800,fontSize:16 }}>💰 Nuevo Presupuesto</div>
          <button onClick={onClose} style={{ background:"none",border:"none",color:C.muted,fontSize:18,cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14 }}>
          <div style={{ gridColumn:"1 / -1" }}>
            <label style={LBL}>Nombre / Referencia *</label>
            <input style={INP} value={form.nombre} autoFocus placeholder="ej: Pérgola SACEEM" onChange={e=>set("nombre",e.target.value)}/>
          </div>
          <div><label style={LBL}>Cliente (empresa)</label><AutocompleteEmpresa style={INP} value={form.cliente} placeholder="Razón social" onChange={v=>set("cliente",v)}/></div>
          <div><label style={LBL}>Contacto</label><AutocompleteCliente style={INP} value={form.contacto} placeholder="Nombre" onChange={v=>set("contacto",v)}/></div>
          <div><label style={LBL}>Obra / Ubicación</label><input style={INP} value={form.obra} placeholder="ej: Planta Canelones" onChange={e=>set("obra",e.target.value)}/></div>
          <div><label style={LBL}>Tipo de trabajo</label>
            <select style={INP} value={form.tipo_trabajo} onChange={e=>set("tipo_trabajo",e.target.value)}>
              {TIPOS.map(t=><option key={t}>{t}</option>)}
            </select></div>
          <div><label style={LBL}>Categoría</label>
            <SelectCategoria value={form.categoria} onChange={v=>set("categoria",v)} /></div>
          <div style={{ gridColumn:"1 / -1" }}><label style={LBL}>Detalle</label>
            <input style={INP} value={form.detalle} placeholder="Descripción breve" onChange={e=>set("detalle",e.target.value)}/></div>
        </div>
        <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
          <button style={BTN("ghost")} onClick={onClose}>Cancelar</button>
          <button style={{ ...BTN("primary"),opacity:form.nombre.trim()?1:0.5 }}
            onClick={()=>form.nombre.trim()&&onSave(form)}>Crear →</button>
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENTE BASE: TABLA EDITABLE DE RUBROS ───────────────────
const INP_SM = { ...INP, padding:"4px 7px", fontSize:12 };
const TD_R   = { ...TD, textAlign:"right", fontVariantNumeric:"tabular-nums", fontSize:12 };
const BtnDel = ({ onClick }) => (
  <button onClick={onClick} style={{ background:"none",border:"none",color:C.err,cursor:"pointer",fontSize:14,padding:"2px 6px" }}>🗑</button>
);
const Subtotal = ({ usd }) => (
  <td style={{ ...TD_R, color:C.ok, fontWeight:600 }}>${n2(usd)}</td>
);
const TotRow = ({ cols, label, usd, extra }) => (
  <tr style={{ background:C.iron+"55", borderTop:`1px solid ${C.border}` }}>
    <td colSpan={cols} style={{ ...TD, fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.5 }}>{label}</td>
    {extra}
    <td style={{ ...TD_R, fontWeight:800, color:C.ok, fontSize:14 }}>${n2(usd)}</td>
    <td style={TD}></td>
  </tr>
);
// Selector rápido desde el catálogo del tarifario (Config) — agrega una fila precargada.
const QuickPick = ({ catalogo, onPick }) => {
  if (!catalogo || catalogo.length === 0) return null;
  return (
    <select value="" onChange={e=>{ const it = catalogo.find(c=>c.id===e.target.value); if (it) onPick(it); }}
      style={{ ...INP_SM, width:240, marginBottom:10 }}>
      <option value="">+ Desde catálogo (Config)...</option>
      {catalogo.map(c=><option key={c.id} value={c.id}>{c.nombre} — ${n2(c.usd)}</option>)}
    </select>
  );
};

// ─── TAB: HIERROS ────────────────────────────────────────────────
function TabHierros({ item, set }) {
  const rows = item.hierros || [];
  const upd = (id, field, val) => set("hierros", rows.map(r => {
    if (r.id !== id) return r;
    const nr = { ...r, [field]: val };
    nr.subtotal_kg  = (+nr.kg_pieza || 0) * (+nr.cantidad || 0);
    nr.subtotal_m2  = (+nr.area_pieza_m2 || 0) * (+nr.cantidad || 0);
    nr.subtotal_usd = nr.subtotal_kg * (+nr.usd_kg || 0);
    return nr;
  }));
  const add = () => set("hierros", [...rows, { id:uid(), nombre:"", proveedor:"", fecha_precio:"", obs:"", cantidad:1, kg_pieza:0, area_pieza_m2:0, usd_kg:0, arena:false, pintura:false, galvanizado:false, subtotal_kg:0, subtotal_m2:0, subtotal_usd:0 }]);
  const del = (id) => set("hierros", rows.filter(r => r.id !== id));

  const tot_kg  = rows.reduce((s,r) => s + (+r.subtotal_kg  || 0), 0);
  const tot_m2  = rows.reduce((s,r) => s + (+r.subtotal_m2  || 0), 0);
  const tot_usd = rows.reduce((s,r) => s + (+r.subtotal_usd || 0), 0);
  // % desperdicio ponderado por kg (solo cuenta filas que vinieron de un anidado)
  const kg_con_desp = rows.reduce((s,r) => s + (r.pct_desperdicio>0 ? (+r.subtotal_kg||0) : 0), 0);
  const kg_desp_pond = rows.reduce((s,r) => s + (r.pct_desperdicio>0 ? (+r.subtotal_kg||0)*(+r.pct_desperdicio||0)/100 : 0), 0);
  const tot_pct_desp = kg_con_desp>0 ? (kg_desp_pond/kg_con_desp*100) : 0;
  const arena_m2   = rows.filter(r => r.arena).reduce((s,r) => s + (+r.subtotal_m2 || 0), 0);
  const pintura_m2 = rows.filter(r => r.pintura).reduce((s,r) => s + (+r.subtotal_m2 || 0), 0);
  const galv_kg    = rows.filter(r => r.galvanizado).reduce((s,r) => s + (+r.subtotal_kg || 0), 0);

  const anidados = loadLS("smeas_anidados", []);
  const anidadoSelId = item.anidado_id || "";
  const anidadoSel = anidados.find(a => a.id === anidadoSelId) || null;
  const { kg3D: anidKg3D, kg2D: anidKg2D } = anidadoSel ? anidadoKg(anidadoSel) : { kg3D:0, kg2D:0 };
  const materialesAnidado = anidadoSel ? materialesUnificadosAnidado(anidadoSel) : [];
  const anidM2Arenar    = materialesAnidado.filter(m=>m.ficha.granallado).reduce((s,m)=>s+m.sup,0);
  const anidM2Pintar    = materialesAnidado.filter(m=>m.ficha.pintura).reduce((s,m)=>s+m.sup,0);
  const anidKgGalvanizar= materialesAnidado.filter(m=>m.ficha.galvanizado).reduce((s,m)=>s+m.kg,0);
  const anidBarras = materialesAnidado.filter(m=>m.tipo==="perfil").reduce((s,m)=>s+m.unidades.total,0);
  const anidHojas   = materialesAnidado.filter(m=>m.tipo==="plancha").reduce((s,m)=>s+m.unidades.total,0);

  return (
    <div>
      {anidados.length > 0 && (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:14, marginBottom:14 }}>
          <div style={{ fontWeight:700, color:C.pur, fontSize:12, marginBottom:8 }}>🔗 Anidado vinculado</div>
          <select value={anidadoSelId} onChange={e=>set("anidado_id", e.target.value)} style={{...INP, marginBottom: anidadoSel ? 10 : 0}}>
            <option value="">— Ninguno —</option>
            {anidados.map(a => <option key={a.id} value={a.id}>{a.nombre} ({a.fecha})</option>)}
          </select>
          {anidadoSel && (
            <div style={{ display:"flex", gap:16, fontSize:12, color:C.muted, alignItems:"center", flexWrap:"wrap", marginBottom:10 }}>
              <span>Kg 3D (perfiles): <b style={{color:C.info}}>{n2(anidKg3D)}</b></span>
              <span>Kg 2D (planchas): <b style={{color:C.pur}}>{n2(anidKg2D)}</b></span>
              {anidBarras>0 && <span>Barras a comprar: <b style={{color:C.steel}}>{n2(anidBarras)}</b></span>}
              {anidHojas>0 && <span>Hojas a comprar: <b style={{color:C.steel}}>{n2(anidHojas)}</b></span>}
              {anidM2Arenar>0 && <span>m² a arenar: <b style={{color:C.teal}}>{n2(anidM2Arenar)}</b></span>}
              {anidM2Pintar>0 && <span>m² a pintar: <b style={{color:C.pur}}>{n2(anidM2Pintar)}</b></span>}
              {anidKgGalvanizar>0 && <span>kg a galvanizar: <b style={{color:C.gold}}>{n2(anidKgGalvanizar)}</b></span>}
            </div>
          )}
          {anidadoSel && (
            <div style={{ display:"flex", gap:16, fontSize:12, color:C.muted, alignItems:"center", flexWrap:"wrap" }}>
              <button onClick={()=>{
                const filas = materialesUnificadosAnidado(anidadoSel);
                const bibMap = {};
                [...loadLS("smeas_perfiles",[]), ...loadLS("smeas_planchuelas",[]), ...loadLS("smeas_planchas",[])]
                  .forEach(m => { bibMap[m.nombre] = parseFloat(m.precio_usd_kg || m.precio || 0) || 0; });
                const nuevasFilas = filas.map(m => {
                  const usd_kg = bibMap[m.nombre] || 0;
                  const f = m.ficha || {};
                  return {
                    id: uid(), nombre: m.nombre, proveedor: "", fecha_precio: "", obs: "", cantidad: 1,
                    kg_pieza: +m.kg.toFixed(3), area_pieza_m2: +m.sup.toFixed(3), usd_kg,
                    arena: !!f.granallado, pintura: !!f.pintura, galvanizado: !!f.galvanizado,
                    pct_desperdicio: m.pct_desperdicio || 0,
                    subtotal_kg: +m.kg.toFixed(3), subtotal_m2: +m.sup.toFixed(3), subtotal_usd: +(m.kg*usd_kg).toFixed(2),
                  };
                });
                set("hierros", [...rows, ...nuevasFilas]);
              }} style={{...BTN("primary"), padding:"4px 12px", fontSize:11}}>
                ⬇ Importar materiales del anidado
              </button>
            </div>
          )}
        </div>
      )}
      {arena_m2 > 0 && (
        <div style={{ marginBottom:10, padding:"6px 12px", background:C.teal+"11", border:`1px solid ${C.teal}33`, borderRadius:6, fontSize:12, color:C.teal }}>
          🎨 {n2(arena_m2)} m² marcados para arenado → se trasladan a Trat. Superficie
        </div>
      )}
      {pintura_m2 > 0 && (
        <div style={{ marginBottom:10, padding:"6px 12px", background:C.pur+"11", border:`1px solid ${C.pur}33`, borderRadius:6, fontSize:12, color:C.pur }}>
          🖌 {n2(pintura_m2)} m² marcados para pintura → se trasladan a Trat. Superficie
        </div>
      )}
      {galv_kg > 0 && (
        <div style={{ marginBottom:10, padding:"6px 12px", background:C.gold+"11", border:`1px solid ${C.gold}33`, borderRadius:6, fontSize:12, color:C.gold }}>
          🔩 {n2(galv_kg)} kg marcados para galvanizado → se trasladan a Trat. Superficie
        </div>
      )}
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:1080 }}>
          <thead><tr>
            {["Nombre / Descripción","Proveedor","Fecha precio","Observaciones","Cant.","Kg/pieza","m²/pieza","USD/kg","% Desp.","Arena?","Pint.?","Galv.?","Subtotal kg","Subtotal m²","Subtotal USD",""].map(h=>(
              <th key={h} title={TH_TOOLTIPS[h]} style={{ ...TH, fontSize:10 }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} style={{ background: r.arena ? C.teal+"0a" : r.pintura ? C.pur+"0a" : r.galvanizado ? C.gold+"0a" : "transparent" }}>
                <td style={TD}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <input value={r.nombre} placeholder="HEB 160, Plancha e=10..." onChange={e=>upd(r.id,"nombre",e.target.value)} style={{...INP_SM,width:190}}/>
                    {r.nombre?.trim() && !r.usd_kg && <span title="Sin USD/kg cargado en esta fila" style={{fontSize:11,color:C.warn,flexShrink:0}}>⚠</span>}
                  </div>
                </td>
                <td style={TD}><input value={r.proveedor||""} placeholder="Proveedor..." onChange={e=>upd(r.id,"proveedor",e.target.value)} style={{...INP_SM,width:110}}/></td>
                <td style={TD}><input type="date" value={r.fecha_precio||""} onChange={e=>upd(r.id,"fecha_precio",e.target.value)} style={{...INP_SM,width:130}}/></td>
                <td style={TD}><input value={r.obs||""} placeholder="Notas..." onChange={e=>upd(r.id,"obs",e.target.value)} style={{...INP_SM,width:130}}/></td>
                <td style={TD}><input type="number" value={r.cantidad} min="1" onChange={e=>upd(r.id,"cantidad",+e.target.value)} style={{...INP_SM,width:55,textAlign:"right"}}/></td>
                <td style={TD}><input type="number" value={r.kg_pieza} step="0.001" min="0" onChange={e=>upd(r.id,"kg_pieza",+e.target.value)} style={{...INP_SM,width:80,textAlign:"right"}}/></td>
                <td style={TD}><input type="number" value={r.area_pieza_m2} step="0.001" min="0" onChange={e=>upd(r.id,"area_pieza_m2",+e.target.value)} style={{...INP_SM,width:75,textAlign:"right"}}/></td>
                <td style={TD}><input type="number" value={r.usd_kg} step="0.01" min="0" onChange={e=>upd(r.id,"usd_kg",+e.target.value)} style={{...INP_SM,width:75,textAlign:"right"}}/></td>
                <td style={{...TD_R,color:r.pct_desperdicio>0?C.warn:C.muted,fontWeight:r.pct_desperdicio>0?700:400}}>{r.pct_desperdicio>0?`${n2(r.pct_desperdicio)}%`:"—"}</td>
                <td style={{...TD,textAlign:"center"}}>
                  <button onClick={()=>upd(r.id,"arena",!r.arena)} style={{...BTN(r.arena?"ok":"ghost"),padding:"3px 8px",fontSize:11}}>
                    {r.arena ? "✓ Sí" : "○ No"}
                  </button>
                </td>
                <td style={{...TD,textAlign:"center"}}>
                  <button onClick={()=>upd(r.id,"pintura",!r.pintura)} style={{...BTN(r.pintura?"ok":"ghost"),padding:"3px 8px",fontSize:11}}>
                    {r.pintura ? "✓ Sí" : "○ No"}
                  </button>
                </td>
                <td style={{...TD,textAlign:"center"}}>
                  <button onClick={()=>upd(r.id,"galvanizado",!r.galvanizado)} style={{...BTN(r.galvanizado?"ok":"ghost"),padding:"3px 8px",fontSize:11}}>
                    {r.galvanizado ? "✓ Sí" : "○ No"}
                  </button>
                </td>
                <td style={{...TD_R,color:C.info}}>{n3(r.subtotal_kg||0)} kg</td>
                <td style={{...TD_R,color:C.teal}}>{n2(r.subtotal_m2||0)} m²</td>
                <Subtotal usd={r.subtotal_usd||0}/>
                <td style={TD}><BtnDel onClick={()=>del(r.id)}/></td>
              </tr>
            ))}
          </tbody>
          {rows.length > 0 && (
            <tfoot><tr style={{ background:C.iron+"55", borderTop:`1px solid ${C.border}` }}>
              <td colSpan={8} style={{...TD,fontSize:11,fontWeight:700,color:C.muted}}>TOTALES</td>
              <td style={{...TD_R,fontWeight:700,color:tot_pct_desp>0?C.warn:C.muted}}>{tot_pct_desp>0?`${n2(tot_pct_desp)}%`:"—"}</td>
              <td colSpan={3} style={TD}></td>
              <td style={{...TD_R,fontWeight:700,color:C.info}}>{n3(tot_kg)} kg</td>
              <td style={{...TD_R,fontWeight:700,color:C.teal}}>{n2(tot_m2)} m²</td>
              <td style={{...TD_R,fontWeight:800,color:C.ok,fontSize:14}}>${n2(tot_usd)}</td>
              <td style={TD}></td>
            </tr></tfoot>
          )}
        </table>
      </div>
      <button style={{...BTN("ghost"),marginTop:10}} onClick={add}>+ Agregar hierro</button>
    </div>
  );
}

// ─── TAB: MATERIALES GENERALES ────────────────────────────────────
function TabMatGenerales({ item, set }) {
  const rows = item.mat_generales || [];
  const tarifario = loadTarifario();
  const upd = (id, field, val) => set("mat_generales", rows.map(r => {
    if (r.id !== id) return r;
    const nr = { ...r, [field]: val };
    nr.subtotal_usd = (+nr.cantidad || 0) * (+nr.usd_unit || 0);
    return nr;
  }));
  const add = () => set("mat_generales", [...rows, { id:uid(), nombre:"", proveedor:"", fecha_precio:"", cantidad:1, kg_unit:0, m2_unit:0, usd_unit:0, obs:"", subtotal_usd:0 }]);
  const addDesdeCatalogo = (it) => set("mat_generales", [...rows, { id:uid(), nombre:it.nombre, proveedor:it.proveedor||"", fecha_precio:it.fecha_precio||"", cantidad:1, kg_unit:0, m2_unit:0, usd_unit:it.usd||0, obs:it.obs||"", subtotal_usd:it.usd||0 }]);
  const del = (id) => set("mat_generales", rows.filter(r => r.id !== id));
  const tot = rows.reduce((s,r) => s + (+r.subtotal_usd || 0), 0);

  return (
    <div>
      <QuickPick catalogo={tarifario.mat_generales} onPick={addDesdeCatalogo} />
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>
            {["Descripción","Proveedor","Fecha precio","Cantidad","Kg/u","m²/u","USD/u","Observaciones","Subtotal USD",""].map(h=>
              <th key={h} style={{...TH,fontSize:10}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td style={TD}><input value={r.nombre} placeholder="Bulones, electrodos, consumibles..." onChange={e=>upd(r.id,"nombre",e.target.value)} style={{...INP_SM,width:190}}/></td>
                <td style={TD}><input value={r.proveedor||""} placeholder="Proveedor..." onChange={e=>upd(r.id,"proveedor",e.target.value)} style={{...INP_SM,width:110}}/></td>
                <td style={TD}><input type="date" value={r.fecha_precio||""} onChange={e=>upd(r.id,"fecha_precio",e.target.value)} style={{...INP_SM,width:130}}/></td>
                <td style={TD}><input type="number" value={r.cantidad} min="0" step="0.01" onChange={e=>upd(r.id,"cantidad",+e.target.value)} style={{...INP_SM,width:70,textAlign:"right"}}/></td>
                <td style={TD}><input type="number" value={r.kg_unit} min="0" step="0.001" onChange={e=>upd(r.id,"kg_unit",+e.target.value)} style={{...INP_SM,width:70,textAlign:"right"}}/></td>
                <td style={TD}><input type="number" value={r.m2_unit} min="0" step="0.001" onChange={e=>upd(r.id,"m2_unit",+e.target.value)} style={{...INP_SM,width:70,textAlign:"right"}}/></td>
                <td style={TD}><input type="number" value={r.usd_unit} min="0" step="0.01" onChange={e=>upd(r.id,"usd_unit",+e.target.value)} style={{...INP_SM,width:80,textAlign:"right"}}/></td>
                <td style={TD}><input value={r.obs||""} placeholder="Notas..." onChange={e=>upd(r.id,"obs",e.target.value)} style={{...INP_SM,width:130}}/></td>
                <Subtotal usd={r.subtotal_usd||0}/>
                <td style={TD}><BtnDel onClick={()=>del(r.id)}/></td>
              </tr>
            ))}
          </tbody>
          {rows.length > 0 && <tfoot><TotRow cols={8} label="TOTAL" usd={tot}/></tfoot>}
        </table>
      </div>
      <button style={{...BTN("ghost"),marginTop:10}} onClick={add}>+ Agregar material</button>
    </div>
  );
}

// ─── TAB: MO FABRICACIÓN / MONTAJE ───────────────────────────────
const HORAS_POR_DIA = 8;

function TabMO({ item, set, tipo }) {
  const key  = tipo === "fabricacion" ? "mo_fabricacion" : "mo_montajes";
  const tarifario = loadTarifario();
  const catalogo = (tipo === "fabricacion" ? tarifario.mo_fab : tarifario.mo_mon) || [];
  const cats = catalogo.length ? catalogo.map(c=>c.nombre) : ["Sin categorías — cargalas en Config"];
  const rows = item[key] || [];
  const [agrupado, setAgrupado] = useState(false);
  const [operariosPorGrupo, setOperariosPorGrupo] = useState({});

  const upd = (id, field, val) => set(key, rows.map(r => {
    if (r.id !== id) return r;
    const nr = { ...r, [field]: val };
    nr.subtotal_usd = (+nr.cant_horas || 0) * (+nr.usd_hora || 0) * (1 + (+nr.pct_adicional || 0) / 100);
    return nr;
  }));
  const add = () => {
    const primera = catalogo[0];
    set(key, [...rows, { id:uid(), categoria:primera?.nombre||"", tipo_hora:"Común", pct_adicional:0, tarea:"", detalle:"", cant_horas:0, usd_hora:primera?.usd_hora||0, subtotal_usd:0 }]);
  };
  const del = (id) => set(key, rows.filter(r => r.id !== id));

  const tot_usd  = rows.reduce((s,r) => s + (+r.subtotal_usd || 0), 0);
  const tot_h    = rows.reduce((s,r) => s + (+r.cant_horas   || 0), 0);

  // Resumen por categoría (Oficial, Dibujante, Peón, etc.)
  const porCategoria = {};
  rows.forEach(r => { porCategoria[r.categoria||"Sin categoría"] = (porCategoria[r.categoria||"Sin categoría"]||0) + (+r.cant_horas||0); });

  // Resumen por tipo de hora (Común, Nocturna, Extra, Lluvia)
  const porTipo = {};
  rows.forEach(r => { const t = normalizarTipoHora(r.tipo_hora); porTipo[t] = (porTipo[t]||0) + (+r.cant_horas||0); });

  // Vista agrupada: suma horas/USD por categoría + tipo de hora
  const grupos = {};
  rows.forEach(r => {
    const t = normalizarTipoHora(r.tipo_hora);
    const gkey = `${r.categoria||"Sin categoría"}|||${t}`;
    if (!grupos[gkey]) grupos[gkey] = { key:gkey, categoria:r.categoria||"Sin categoría", tipo:t, horas:0, usd:0 };
    grupos[gkey].horas += (+r.cant_horas||0);
    grupos[gkey].usd   += (+r.subtotal_usd||0);
  });
  const listaGrupos = Object.values(grupos);

  return (
    <div>
      {rows.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:16, marginBottom:12, fontSize:11 }}>
          <div>
            <span style={{ color:C.muted, marginRight:6 }}>Horas por categoría:</span>
            {Object.entries(porCategoria).map(([cat,h]) => (
              <span key={cat} style={{ ...BDG(C.steel,true), marginRight:4 }}>{cat}: {n2(h)}h</span>
            ))}
          </div>
          <div>
            <span style={{ color:C.muted, marginRight:6 }}>Horas por tipo:</span>
            {Object.entries(porTipo).map(([t,h]) => (
              <span key={t} style={{ ...BDG(t==="Común"?C.ok:C.warn,true), marginRight:4 }}>{t}: {n2(h)}h</span>
            ))}
          </div>
        </div>
      )}

      <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.text, marginBottom:12, cursor:"pointer" }}>
        <input type="checkbox" checked={agrupado} onChange={e=>setAgrupado(e.target.checked)} />
        Ver horas agrupadas (por categoría + tipo de hora, con cálculo de días)
      </label>

      {agrupado ? (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
            <thead><tr>
              {["Categoría","Tipo de hora","Horas","Operarios","Días","Subtotal USD"].map(h=>
                <th key={h} style={{...TH,fontSize:10}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {listaGrupos.length===0 && <tr><td colSpan={6} style={{...TD,textAlign:"center",color:C.muted,padding:20}}>Sin horas cargadas.</td></tr>}
              {listaGrupos.map(g => {
                const operarios = operariosPorGrupo[g.key] || 1;
                const dias = operarios>0 ? g.horas / (operarios*HORAS_POR_DIA) : 0;
                return (
                  <tr key={g.key}>
                    <td style={{...TD,fontWeight:600}}>{g.categoria}</td>
                    <td style={TD}>{g.tipo}</td>
                    <td style={{...TD_R,fontWeight:700,color:C.pur}}>{n2(g.horas)} h</td>
                    <td style={TD}>
                      <input type="number" min="1" step="1" value={operarios}
                        onChange={e=>setOperariosPorGrupo(prev=>({...prev,[g.key]:Math.max(1,+e.target.value||1)}))}
                        style={{...INP_SM,width:55,textAlign:"right"}}/>
                    </td>
                    <td style={{...TD_R,color:C.teal,fontWeight:700}}>{n2(dias)} d</td>
                    <Subtotal usd={g.usd}/>
                  </tr>
                );
              })}
            </tbody>
            {listaGrupos.length > 0 && (
              <tfoot><tr style={{ background:C.iron+"55", borderTop:`1px solid ${C.border}` }}>
                <td colSpan={2} style={{...TD,fontSize:11,fontWeight:700,color:C.muted}}>TOTALES</td>
                <td style={{...TD_R,fontWeight:700,color:C.pur}}>{n2(tot_h)} h</td>
                <td colSpan={2} style={TD}></td>
                <td style={{...TD_R,fontWeight:800,color:C.ok,fontSize:14}}>${n2(tot_usd)}</td>
              </tr></tfoot>
            )}
          </table>
        </div>
      ) : (
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
          <thead><tr>
            {["Categoría","Tipo de hora","Tarea","Horas","USD/h","Subtotal USD",""].map(h=>
              <th key={h} style={{...TH,fontSize:10}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map(r => {
              const tipoActual = normalizarTipoHora(r.tipo_hora);
              const esEspecial = tipoActual !== "Común";
              return (
              <tr key={r.id} style={{ background: esEspecial ? C.warn+"0a" : "transparent" }}>
                <td style={TD}>
                  <select value={r.categoria} onChange={e=>{
                    const cat = catalogo.find(x=>x.nombre===e.target.value);
                    set(key, rows.map(x => {
                      if (x.id !== r.id) return x;
                      const nr = { ...x, categoria: e.target.value, usd_hora: cat?.usd_hora || 0 };
                      nr.subtotal_usd = (+nr.cant_horas || 0) * (+nr.usd_hora || 0) * (1 + (+nr.pct_adicional || 0) / 100);
                      return nr;
                    }));
                  }} style={{...INP_SM,width:165}}>
                    {cats.map(c=><option key={c}>{c}</option>)}
                  </select>
                </td>
                <td style={TD}>
                  <select value={tipoActual} onChange={e=>{
                    const t = TIPO_HORA_OPCIONES.find(x=>x.label===e.target.value);
                    set(key, rows.map(x => {
                      if (x.id !== r.id) return x;
                      const nr = { ...x, tipo_hora: e.target.value, pct_adicional: t ? t.pct : 0 };
                      nr.subtotal_usd = (+nr.cant_horas || 0) * (+nr.usd_hora || 0) * (1 + (+nr.pct_adicional || 0) / 100);
                      return nr;
                    }));
                  }}
                    style={{...INP_SM,width:100,color:esEspecial?C.warn:C.text}}>
                    {TIPO_HORA_OPCIONES.map(t=><option key={t.label} value={t.label}>{t.label} {t.pct>0?`(+${t.pct}%)`:""}</option>)}
                  </select>
                </td>
                <td style={TD}><input value={r.tarea} placeholder="Descripción..." onChange={e=>upd(r.id,"tarea",e.target.value)} style={{...INP_SM,width:160}}/></td>
                <td style={TD}><input type="number" value={r.cant_horas} min="0" step="0.5" onChange={e=>upd(r.id,"cant_horas",+e.target.value)} style={{...INP_SM,width:65,textAlign:"right"}}/></td>
                <td style={TD}><input type="number" value={r.usd_hora} min="0" step="0.01" onChange={e=>upd(r.id,"usd_hora",+e.target.value)} style={{...INP_SM,width:75,textAlign:"right"}}/></td>
                <Subtotal usd={r.subtotal_usd||0}/>
                <td style={TD}><BtnDel onClick={()=>del(r.id)}/></td>
              </tr>
              );
            })}
          </tbody>
          {rows.length > 0 && (
            <tfoot><tr style={{ background:C.iron+"55", borderTop:`1px solid ${C.border}` }}>
              <td colSpan={3} style={{...TD,fontSize:11,fontWeight:700,color:C.muted}}>TOTALES</td>
              <td style={{...TD_R,fontWeight:700,color:C.pur}}>{n2(tot_h)} h</td>
              <td style={TD}></td>
              <td style={{...TD_R,fontWeight:800,color:C.ok,fontSize:14}}>${n2(tot_usd)}</td>
              <td style={TD}></td>
            </tr></tfoot>
          )}
        </table>
      </div>
      )}
      {!agrupado && <button style={{...BTN("ghost"),marginTop:10}} onClick={add}>+ Agregar fila MO</button>}
    </div>
  );
}

// ─── TAB: TERCERIZADO FAB / MON ───────────────────────────────────
function TabTerc({ item, set, tipo }) {
  const key  = tipo === "fabricacion" ? "terc_fabricacion" : "terc_montajes";
  const rows = item[key] || [];
  const tarifario = loadTarifario();
  // Catálogo unificado — Terc. Fabricación y Terc. Montajes comparten la misma
  // lista de referencia en Insumos y Precios (el rubro del ítem sigue separado).
  const catalogo = tarifario.terceros;
  const upd = (id, field, val) => set(key, rows.map(r => {
    if (r.id !== id) return r;
    const nr = { ...r, [field]: val };
    nr.subtotal_usd = (+nr.cantidad||0) * (+nr.usd_unit||0);
    return nr;
  }));
  const add = () => set(key, [...rows, { id:uid(), nombre:"", empresa:"", fecha_precio:"", cantidad:1, unidad:"u", usd_unit:0, subtotal_usd:0, detalle:"" }]);
  const addDesdeCatalogo = (it) => set(key, [...rows, { id:uid(), nombre:it.nombre, empresa:"", fecha_precio:"", cantidad:1, unidad:it.unidad||"u", usd_unit:it.usd||0, subtotal_usd:it.usd||0, detalle:"" }]);
  const del = (id) => set(key, rows.filter(r => r.id !== id));
  const tot = rows.reduce((s,r) => s + (+r.subtotal_usd||0), 0);

  return (
    <div>
      <QuickPick catalogo={catalogo} onPick={addDesdeCatalogo} />
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:850 }}>
          <thead><tr>
            {["Descripción","Empresa","Fecha precio","Cantidad","Unidad","USD/u","Detalle","Subtotal USD",""].map(h=>
              <th key={h} style={{...TH,fontSize:10}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td style={TD}><input value={r.nombre} placeholder={tipo==="fabricacion"?"Roscado, galvanizado...":"Grúa, hidrogrúa..."} onChange={e=>upd(r.id,"nombre",e.target.value)} style={{...INP_SM,width:160}}/></td>
                <td style={TD}><input value={r.empresa} placeholder="Empresa" onChange={e=>upd(r.id,"empresa",e.target.value)} style={{...INP_SM,width:120}}/></td>
                <td style={TD}><input type="date" value={r.fecha_precio||""} onChange={e=>upd(r.id,"fecha_precio",e.target.value)} style={{...INP_SM,width:130}}/></td>
                <td style={TD}><input type="number" value={r.cantidad} min="0" step="0.01" onChange={e=>upd(r.id,"cantidad",+e.target.value)} style={{...INP_SM,width:65,textAlign:"right"}}/></td>
                <td style={TD}>
                  <select value={r.unidad} onChange={e=>upd(r.id,"unidad",e.target.value)} style={{...INP_SM,width:70}}>
                    {UNIDADES.map(u=><option key={u}>{u}</option>)}
                  </select>
                </td>
                <td style={TD}><input type="number" value={r.usd_unit} min="0" step="0.01" onChange={e=>upd(r.id,"usd_unit",+e.target.value)} style={{...INP_SM,width:80,textAlign:"right"}}/></td>
                <td style={TD}><textarea value={r.detalle} placeholder="Detalle..." rows={2} onChange={e=>upd(r.id,"detalle",e.target.value)} style={{...INP_SM,width:280,resize:"vertical",fontFamily:"inherit"}}/></td>
                <Subtotal usd={r.subtotal_usd||0}/>
                <td style={TD}><BtnDel onClick={()=>del(r.id)}/></td>
              </tr>
            ))}
          </tbody>
          {rows.length > 0 && <tfoot><TotRow cols={7} label="TOTAL" usd={tot}/></tfoot>}
        </table>
      </div>
      <button style={{...BTN("ghost"),marginTop:10}} onClick={add}>+ Agregar tercerización</button>
    </div>
  );
}

// ─── TAB: TRATAMIENTO DE SUPERFICIE ──────────────────────────────
function TabTrat({ item, set }) {
  const tarifario = loadTarifario();
  const ts = item.trat_superficie || { pinturas:[], arenado_m2:0, arenado_usd_m2:tarifario.arenado_usd_m2, galvanizado:false };
  const setTs = (k, v) => set("trat_superficie", { ...ts, [k]: v });

  const arena_auto   = (item.hierros || []).filter(r=>r.arena).reduce((s,r)=>s+(+r.subtotal_m2||0),0);
  const pintura_auto = (item.hierros || []).filter(r=>r.pintura).reduce((s,r)=>s+(+r.subtotal_m2||0),0);
  const galv_auto    = (item.hierros || []).filter(r=>r.galvanizado).reduce((s,r)=>s+(+r.subtotal_kg||0),0);
  const hier_kg_item = (item.hierros || []).reduce((s,r)=>s+(+r.subtotal_kg||0),0);

  // Otros tratamientos (catálogo extensible de Insumos y Precios) — se
  // cobran USD/kg sobre el peso total del ítem, mismo criterio que
  // Arenado/Galvanizado. El subtotal se calcula en vivo (no se guarda
  // "pisado") para que nunca quede desactualizado si cambian los hierros.
  const otros = ts.otros || [];
  const updOtro = (id, field, val) => setTs("otros", otros.map(r => r.id===id ? { ...r, [field]: val } : r));
  const addOtroDesdeCatalogo = (it) => setTs("otros", [...otros, { id:uid(), nombre:it.nombre, usd_kg:it.usd||0 }]);
  const addOtro = () => setTs("otros", [...otros, { id:uid(), nombre:"", usd_kg:0 }]);
  const delOtro = (id) => setTs("otros", otros.filter(r=>r.id!==id));
  const tot_otros = otros.reduce((s,r)=>s+(+r.usd_kg||0),0) * hier_kg_item;

  const updPintura = (id, field, val) => {
    const rows = (ts.pinturas||[]).map(r => {
      if (r.id !== id) return r;
      const nr = { ...r, [field]: val };
      nr.subtotal_usd = (+nr.cant_lt||0) * (+nr.cant_manos||0) * (+nr.usd_lt||0);
      return nr;
    });
    setTs("pinturas", rows);
  };
  const addPintura = () => setTs("pinturas", [...(ts.pinturas||[]), { id:uid(), nombre:"", usd_lt:0, cant_lt:0, cant_manos:1, subtotal_usd:0 }]);
  const addPinturaDesdeCatalogo = (it) => setTs("pinturas", [...(ts.pinturas||[]), { id:uid(), nombre:it.nombre, usd_lt:it.usd||0, cant_lt:0, cant_manos:1, subtotal_usd:0 }]);
  const delPintura = (id) => setTs("pinturas", (ts.pinturas||[]).filter(r=>r.id!==id));

  const tot_pintura   = (ts.pinturas||[]).reduce((s,r)=>s+(+r.subtotal_usd||0),0);
  const tot_arenado   = (+ts.arenado_m2||0) * (+ts.arenado_usd_m2||tarifario.arenado_usd_m2||0);
  const tot_galv      = ts.galvanizado ? (+ts.galvanizado_kg||0) * (+ts.galvanizado_usd_kg||tarifario.galvanizado_usd_kg||0) : 0;
  const tot_lt        = (ts.pinturas||[]).reduce((s,r)=>s+(+r.cant_lt||0)*(+r.cant_manos||0),0);
  const tot_manos     = (ts.pinturas||[]).reduce((s,r)=>s+(+r.cant_manos||0),0);
  const tot = tot_pintura + tot_arenado + tot_galv + tot_otros;

  return (
    <div>
      {/* Arenado / Granallado */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:16, marginBottom:16 }}>
        <div style={{ fontWeight:700, color:C.teal, fontSize:13, marginBottom:12 }}>🎨 Arenado / Granallado</div>
        {arena_auto > 0 && (
          <div style={{ fontSize:12, color:C.teal, background:C.teal+"11", border:`1px solid ${C.teal}33`, borderRadius:6, padding:"5px 10px", marginBottom:10 }}>
            ↗ Desde hierros marcados: {n2(arena_auto)} m²
          </div>
        )}
        <div style={{ display:"flex", gap:16, alignItems:"flex-end", flexWrap:"wrap" }}>
          <div>
            <label style={LBL}>m² a arenar</label>
            <input type="number" value={ts.arenado_m2||0} min="0" step="0.01"
              onChange={e=>setTs("arenado_m2",+e.target.value)}
              style={{...INP_SM,width:90}} />
            {arena_auto > 0 && (
              <button style={{...BTN("ghost"),fontSize:10,padding:"3px 8px",marginLeft:6}}
                onClick={()=>setTs("arenado_m2", +arena_auto.toFixed(2))}>
                Usar auto ({n2(arena_auto)})
              </button>
            )}
          </div>
          <div>
            <label style={LBL}>USD / m²</label>
            <input type="number" value={ts.arenado_usd_m2 ?? tarifario.arenado_usd_m2} min="0" step="0.01"
              onChange={e=>setTs("arenado_usd_m2",+e.target.value)}
              style={{...INP_SM,width:80}}/>
          </div>
          <div style={{ paddingBottom:4 }}>
            <span style={{ fontSize:12, color:C.muted }}>Subtotal arenado: </span>
            <span style={{ fontSize:14, fontWeight:700, color:C.ok }}>${n2(tot_arenado)}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, paddingBottom:4 }}>
            <button onClick={()=>setTs("galvanizado",!ts.galvanizado)}
              style={{...BTN(ts.galvanizado?"ok":"ghost"),padding:"4px 12px",fontSize:12}}>
              {ts.galvanizado ? "✓ Galvanizado" : "○ Galvanizado"}
            </button>
          </div>
        </div>
        {ts.galvanizado && (
          <div style={{ display:"flex", gap:16, alignItems:"flex-end", flexWrap:"wrap", marginTop:12, paddingTop:12, borderTop:`1px solid ${C.border}` }}>
            <div>
              <label style={LBL}>Kg a galvanizar</label>
              <input type="number" value={ts.galvanizado_kg||0} min="0" step="0.01"
                onChange={e=>setTs("galvanizado_kg",+e.target.value)}
                style={{...INP_SM,width:90}} />
              {galv_auto > 0 && (
                <button style={{...BTN("ghost"),fontSize:10,padding:"3px 8px",marginLeft:6}}
                  onClick={()=>setTs("galvanizado_kg", +galv_auto.toFixed(2))}>
                  Usar auto ({n2(galv_auto)})
                </button>
              )}
            </div>
            <div>
              <label style={LBL}>USD / kg</label>
              <input type="number" value={ts.galvanizado_usd_kg ?? tarifario.galvanizado_usd_kg} min="0" step="0.01"
                onChange={e=>setTs("galvanizado_usd_kg",+e.target.value)}
                style={{...INP_SM,width:80}}/>
            </div>
            <div style={{ paddingBottom:4 }}>
              <span style={{ fontSize:12, color:C.muted }}>Subtotal galvanizado: </span>
              <span style={{ fontSize:14, fontWeight:700, color:C.ok }}>${n2(tot_galv)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Otros tratamientos */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:16, marginBottom:16 }}>
        <div style={{ fontWeight:700, color:C.steel, fontSize:13, marginBottom:12 }}>🧪 Otros tratamientos</div>
        <div style={{ fontSize:11, color:C.muted, marginBottom:10 }}>Subtotal = USD/kg × {n2(hier_kg_item)} kg (peso total del ítem)</div>
        <QuickPick catalogo={tarifario.trat_superficie_extra} onPick={addOtroDesdeCatalogo} />
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>
            {["Descripción","USD/kg","Subtotal USD",""].map(h=>
              <th key={h} style={{...TH,fontSize:10}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {otros.map(r=>(
              <tr key={r.id}>
                <td style={TD}><input value={r.nombre} placeholder="Metalizado, fosfatizado..." onChange={e=>updOtro(r.id,"nombre",e.target.value)} style={{...INP_SM,width:220}}/></td>
                <td style={TD}><input type="number" value={r.usd_kg} min="0" step="0.01" onChange={e=>updOtro(r.id,"usd_kg",+e.target.value)} style={{...INP_SM,width:80,textAlign:"right"}}/></td>
                <Subtotal usd={(+r.usd_kg||0)*hier_kg_item}/>
                <td style={TD}><BtnDel onClick={()=>delOtro(r.id)}/></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button style={{...BTN("ghost"),marginTop:10}} onClick={addOtro}>+ Agregar tratamiento</button>
        {tot_otros > 0 && (
          <div style={{ marginTop:10, textAlign:"right", fontSize:13, color:C.muted }}>
            Otros tratamientos: <strong style={{color:C.ok}}>${n2(tot_otros)}</strong>
          </div>
        )}
      </div>

      {/* Pinturas */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
        <div style={{ fontWeight:700, color:C.pur, fontSize:13, marginBottom:12 }}>🖌 Pinturas</div>
        <div style={{ fontSize:11, color:C.muted, marginBottom:10 }}>Subtotal = Litros × Manos × USD/lt</div>
        <QuickPick catalogo={tarifario.pinturas} onPick={addPinturaDesdeCatalogo} />
        <div style={{ marginBottom:12 }}>
          <label style={LBL}>m² a pintar</label>
          <input type="number" value={ts.pintura_m2||0} min="0" step="0.01"
            onChange={e=>setTs("pintura_m2",+e.target.value)}
            style={{...INP_SM,width:90}} />
          {pintura_auto > 0 && (
            <button style={{...BTN("ghost"),fontSize:10,padding:"3px 8px",marginLeft:6}}
              onClick={()=>setTs("pintura_m2", +pintura_auto.toFixed(2))}>
              Usar auto ({n2(pintura_auto)})
            </button>
          )}
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>
            {["Descripción","USD/lt","Litros","Manos","Subtotal USD",""].map(h=>
              <th key={h} style={{...TH,fontSize:10}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {(ts.pinturas||[]).map(r=>(
              <tr key={r.id}>
                <td style={TD}><input value={r.nombre} placeholder="Pintura epoxi, antióxido..." onChange={e=>updPintura(r.id,"nombre",e.target.value)} style={{...INP_SM,width:200}}/></td>
                <td style={TD}><input type="number" value={r.usd_lt} min="0" step="0.01" onChange={e=>updPintura(r.id,"usd_lt",+e.target.value)} style={{...INP_SM,width:75,textAlign:"right"}}/></td>
                <td style={TD}><input type="number" value={r.cant_lt} min="0" step="0.01" onChange={e=>updPintura(r.id,"cant_lt",+e.target.value)} style={{...INP_SM,width:75,textAlign:"right"}}/></td>
                <td style={TD}><input type="number" value={r.cant_manos} min="1" onChange={e=>updPintura(r.id,"cant_manos",+e.target.value)} style={{...INP_SM,width:60,textAlign:"right"}}/></td>
                <Subtotal usd={r.subtotal_usd||0}/>
                <td style={TD}><BtnDel onClick={()=>delPintura(r.id)}/></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button style={{...BTN("ghost"),marginTop:10}} onClick={addPintura}>+ Agregar pintura</button>
        {tot_pintura > 0 && (
          <div style={{ marginTop:10, textAlign:"right", fontSize:13, color:C.muted }}>
            Pinturas: <strong style={{color:C.ok}}>${n2(tot_pintura)}</strong>
          </div>
        )}
      </div>

      {/* Resumen Trat. Superficie */}
      {(tot > 0 || tot_lt > 0) && (
        <div style={{ marginTop:12, padding:"12px 16px", background:C.teal+"11", border:`1px solid ${C.teal}33`, borderRadius:8 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.teal, marginBottom:8, textTransform:"uppercase", letterSpacing:.5 }}>Resumen Trat. Superficie</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(120px, 1fr))", gap:10, marginBottom:10 }}>
            <div><div style={{ fontSize:10, color:C.muted }}>m² a pintar</div><div style={{ fontSize:14, fontWeight:700, color:C.text }}>{n2(ts.pintura_m2||0)}</div></div>
            <div><div style={{ fontSize:10, color:C.muted }}>Litros totales</div><div style={{ fontSize:14, fontWeight:700, color:C.text }}>{n2(tot_lt)}</div></div>
            <div><div style={{ fontSize:10, color:C.muted }}>Manos totales</div><div style={{ fontSize:14, fontWeight:700, color:C.text }}>{n2(tot_manos)}</div></div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.muted, marginBottom:2 }}>
            <span>$ Pintura</span><span>${n2(tot_pintura)}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.muted, marginBottom:2 }}>
            <span>$ Granallado</span><span>${n2(tot_arenado)}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.muted, marginBottom:2 }}>
            <span>$ Galvanizado</span><span>${n2(tot_galv)}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.muted, marginBottom:8 }}>
            <span>$ Otros tratamientos</span><span>${n2(tot_otros)}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", borderTop:`1px solid ${C.teal}33`, paddingTop:8 }}>
            <span style={{ fontSize:13, color:C.steel }}>Total Trat. Superficie</span>
            <span style={{ fontSize:16, fontWeight:800, color:C.ok }}>${n2(tot)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TAB: TRASLADOS ───────────────────────────────────────────────
function TabTraslados({ item, set }) {
  const rows = item.traslados || [];
  const tarifario = loadTarifario();
  const upd = (id, field, val) => set("traslados", rows.map(r => {
    if (r.id !== id) return r;
    const nr = { ...r, [field]: val };
    nr.subtotal_usd = (+nr.cantidad||0) * (+nr.usd_unit||0);
    return nr;
  }));
  const add = () => set("traslados", [...rows, { id:uid(), nombre:"", proveedor:"", fecha_precio:"", cantidad:1, unidad:"u", usd_unit:0, detalle:"", subtotal_usd:0 }]);
  const addDesdeCatalogo = (it) => set("traslados", [...rows, { id:uid(), nombre:it.nombre, proveedor:"", fecha_precio:"", cantidad:1, unidad:it.unidad||"u", usd_unit:it.usd||0, detalle:"", subtotal_usd:it.usd||0 }]);
  const del = (id) => set("traslados", rows.filter(r => r.id !== id));
  const tot = rows.reduce((s,r) => s+(+r.subtotal_usd||0), 0);

  return (
    <div>
      <QuickPick catalogo={tarifario.traslados} onPick={addDesdeCatalogo} />
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>
            {["Descripción","Proveedor","Fecha precio","Cantidad","Unidad","USD/u","Detalle","Subtotal USD",""].map(h=>
              <th key={h} style={{...TH,fontSize:10}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id}>
                <td style={TD}><input value={r.nombre} placeholder="Gasoil, peaje, viáticos..." onChange={e=>upd(r.id,"nombre",e.target.value)} style={{...INP_SM,width:190}}/></td>
                <td style={TD}><input value={r.proveedor||""} placeholder="Proveedor..." onChange={e=>upd(r.id,"proveedor",e.target.value)} style={{...INP_SM,width:110}}/></td>
                <td style={TD}><input type="date" value={r.fecha_precio||""} onChange={e=>upd(r.id,"fecha_precio",e.target.value)} style={{...INP_SM,width:130}}/></td>
                <td style={TD}><input type="number" value={r.cantidad} min="0" step="0.01" onChange={e=>upd(r.id,"cantidad",+e.target.value)} style={{...INP_SM,width:70,textAlign:"right"}}/></td>
                <td style={TD}><select value={r.unidad} onChange={e=>upd(r.id,"unidad",e.target.value)} style={{...INP_SM,width:70}}>
                  {UNIDADES.map(u=><option key={u}>{u}</option>)}
                </select></td>
                <td style={TD}><input type="number" value={r.usd_unit} min="0" step="0.01" onChange={e=>upd(r.id,"usd_unit",+e.target.value)} style={{...INP_SM,width:80,textAlign:"right"}}/></td>
                <td style={TD}><input value={r.detalle} placeholder="Obs..." onChange={e=>upd(r.id,"detalle",e.target.value)} style={{...INP_SM,width:130}}/></td>
                <Subtotal usd={r.subtotal_usd||0}/>
                <td style={TD}><BtnDel onClick={()=>del(r.id)}/></td>
              </tr>
            ))}
          </tbody>
          {rows.length > 0 && <tfoot><TotRow cols={7} label="TOTAL" usd={tot}/></tfoot>}
        </table>
      </div>
      <button style={{...BTN("ghost"),marginTop:10}} onClick={add}>+ Agregar traslado</button>
    </div>
  );
}

// ─── TAB: CORTE PANTÓGRAFO ────────────────────────────────────────
function TabPanto({ item, set }) {
  const rows = item.corte_pantografo || [];
  const upd = (id, field, val) => set("corte_pantografo", rows.map(r => {
    if (r.id !== id) return r;
    const nr = { ...r, [field]: val };
    nr.subtotal_usd = (+nr.kg||0) * (+nr.usd_kg||0);
    return nr;
  }));
  const add = (tipo, nombre, kg, usd_kg) => set("corte_pantografo", [...rows, { id:uid(), nombre:nombre||"", tipo:tipo||"", usd_kg:usd_kg||0, kg:kg||0, subtotal_usd:(kg||0)*(usd_kg||0), detalle:"" }]);
  const del = (id) => set("corte_pantografo", rows.filter(r => r.id !== id));

  const tot_kg  = rows.reduce((s,r)=>s+(+r.kg||0),0);
  const tot_usd = rows.reduce((s,r)=>s+(+r.subtotal_usd||0),0);
  const hier_kg_item = (item.hierros || []).reduce((s,r)=>s+(+r.subtotal_kg||0),0);

  const anidados = loadLS("smeas_anidados", []);
  const anidadoSel = anidados.find(a => a.id === item.anidado_id) || null;
  const { kg3D: anidKg3D, kg2D: anidKg2D } = anidadoSel ? anidadoKg(anidadoSel) : { kg3D:0, kg2D:0 };
  const tarifario = loadTarifario();
  const addOtroDesdeCatalogo = (it) => add("Otro", it.nombre, +hier_kg_item.toFixed(2), it.usd||0);

  return (
    <div>
      {(anidKg3D > 0 || anidKg2D > 0) && (
        <div style={{ marginBottom:12, padding:"8px 12px", background:C.pur+"11", border:`1px solid ${C.pur}33`, borderRadius:6, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ fontSize:12, color:C.pur }}>🔗 Desde anidados vinculados:</span>
          {anidKg3D > 0 && (
            <button style={{...BTN("ghost"),fontSize:11,padding:"4px 10px"}} onClick={()=>add("3D","Corte 3D (perfiles)",+anidKg3D.toFixed(2),tarifario.panto_usd_kg_3d)}>
              + Corte 3D ({n2(anidKg3D)} kg)
            </button>
          )}
          {anidKg2D > 0 && (
            <button style={{...BTN("ghost"),fontSize:11,padding:"4px 10px"}} onClick={()=>add("2D","Corte 2D (planchas)",+anidKg2D.toFixed(2),tarifario.panto_usd_kg_2d)}>
              + Corte 2D ({n2(anidKg2D)} kg)
            </button>
          )}
        </div>
      )}
      {tarifario.pantografo_extra?.length > 0 && (
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:11, color:C.muted, marginBottom:6 }}>Otros cortes — kg pre-cargado con el peso del ítem ({n2(hier_kg_item)} kg), editable en la fila:</div>
          <QuickPick catalogo={tarifario.pantografo_extra} onPick={addOtroDesdeCatalogo} />
        </div>
      )}
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>
            {["Descripción","Tipo","kg","USD/kg","Detalle","Subtotal USD",""].map(h=>
              <th key={h} style={{...TH,fontSize:10}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id}>
                <td style={TD}><input value={r.nombre} placeholder="Corte plasma, pantógrafo..." onChange={e=>upd(r.id,"nombre",e.target.value)} style={{...INP_SM,width:190}}/></td>
                <td style={TD}>
                  <select value={r.tipo||""} onChange={e=>upd(r.id,"tipo",e.target.value)} style={{...INP_SM,width:60}}>
                    <option value="">—</option>
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                  </select>
                </td>
                <td style={TD}><input type="number" value={r.kg} min="0" step="0.1" onChange={e=>upd(r.id,"kg",+e.target.value)} style={{...INP_SM,width:80,textAlign:"right"}}/></td>
                <td style={TD}><input type="number" value={r.usd_kg} min="0" step="0.01" onChange={e=>upd(r.id,"usd_kg",+e.target.value)} style={{...INP_SM,width:80,textAlign:"right"}}/></td>
                <td style={TD}><input value={r.detalle} placeholder="Obs..." onChange={e=>upd(r.id,"detalle",e.target.value)} style={{...INP_SM,width:150}}/></td>
                <Subtotal usd={r.subtotal_usd||0}/>
                <td style={TD}><BtnDel onClick={()=>del(r.id)}/></td>
              </tr>
            ))}
          </tbody>
          {rows.length > 0 && (
            <tfoot><tr style={{ background:C.iron+"55", borderTop:`1px solid ${C.border}` }}>
              <td colSpan={2} style={{...TD,fontSize:11,fontWeight:700,color:C.muted}}>TOTALES</td>
              <td style={{...TD_R,fontWeight:700,color:C.info}}>{n2(tot_kg)} kg</td>
              <td style={TD}></td><td style={TD}></td>
              <td style={{...TD_R,fontWeight:800,color:C.ok,fontSize:14}}>${n2(tot_usd)}</td>
              <td style={TD}></td>
            </tr></tfoot>
          )}
        </table>
      </div>
      <button style={{...BTN("ghost"),marginTop:10}} onClick={()=>add()}>+ Agregar corte</button>
    </div>
  );
}

// ─── EDITOR DE RUBROS (9 PESTAÑAS) ───────────────────────────────
function EditorRubros({ item, onChange, onClose }) {
  const TABS = [
    { id:"resumen",          icon:"📊",  label:"Resumen"      },
    { id:"hierros",          icon:"⚙️",  label:"Hierros"      },
    { id:"mat_generales",    icon:"📦",  label:"Mat. General" },
    { id:"mo_fabricacion",   icon:"🔨",  label:"MO Fab"       },
    { id:"mo_montajes",      icon:"🏗️",  label:"MO Mon"       },
    { id:"terc_fabricacion", icon:"🏭",  label:"Terc. Fab."   },
    { id:"terc_montajes",    icon:"🚛",  label:"Terc. Mon."   },
    { id:"trat_superficie",  icon:"🎨",  label:"Trat. Sup."   },
    { id:"traslados",        icon:"🚚",  label:"Traslados"    },
    { id:"corte_pantografo", icon:"✂️",  label:"Pantógrafo"   },
  ];

  const [tab, setTab] = useState("resumen");
  const set = (k, v) => onChange({ ...item, [k]: v });
  const c   = calcItem(item);

  // rubrosActivos ausente (ítems viejos/históricos) = todo activo, sin romper nada.
  const activo = (id) => (item.rubrosActivos ? item.rubrosActivos[id] !== false : true);
  const setTipo = (t) => {
    const nuevosActivos = { ...PRESET_TIPO_RUBROS[t] };
    onChange({ ...item, tipo: t, rubrosActivos: nuevosActivos });
    if (tab !== "resumen" && nuevosActivos[tab] === false) setTab("resumen");
  };
  const toggleRubro = (id) => {
    const base = item.rubrosActivos || { ...PRESET_TIPO_RUBROS.fab_mont };
    const next = { ...base, [id]: !(base[id] !== false) };
    onChange({ ...item, rubrosActivos: next });
    if (tab === id && next[id] === false) setTab("resumen");
  };
  const visibleTabs = TABS.filter(t => t.id === "resumen" || activo(t.id));

  // conteos por pestaña para mostrar badge
  const counts = {
    hierros:          (item.hierros||[]).length,
    mat_generales:    (item.mat_generales||[]).length,
    mo_fabricacion:   (item.mo_fabricacion||[]).length,
    mo_montajes:      (item.mo_montajes||[]).length,
    terc_fabricacion: (item.terc_fabricacion||[]).length,
    terc_montajes:    (item.terc_montajes||[]).length,
    trat_superficie:  ((item.trat_superficie?.pinturas||[]).length + (item.trat_superficie?.arenado_m2 > 0 ? 1 : 0)),
    traslados:        (item.traslados||[]).length,
    corte_pantografo: (item.corte_pantografo||[]).length,
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, background:"#000d",
      display:"flex", alignItems:"center", justifyContent:"center", padding:12 }}>
      <div style={{ background:C.bg, border:`1.5px solid ${C.accent}44`, borderRadius:14,
        width:"100%", maxWidth:1280, maxHeight:"96vh", display:"flex", flexDirection:"column",
        boxShadow:"0 24px 60px #0008" }}>

        {/* Header */}
        <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.border}`,
          display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:C.accent, fontWeight:800, fontSize:15,
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.titulo}</div>
            <div style={{ color:C.muted, fontSize:11 }}>Cant. ×{item.cantidad} · Editor de rubros</div>
          </div>
          <div style={{ display:"flex", gap:10, flexShrink:0 }}>
            <span style={{...BDG(C.info, true),fontSize:14,padding:"4px 12px"}}>{n3(c.total_kg)} kg</span>
            <span style={{...BDG(C.ok,   true),fontSize:14,padding:"4px 12px",fontWeight:800}}>${n2(c.total_usd)}</span>
            {c.usd_kg > 0 && <span style={{...BDG(C.gold, true),fontSize:14,padding:"4px 12px"}}>{n2(c.usd_kg)} USD/kg</span>}
          </div>
          <button onClick={onClose} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:6,
            color:C.muted, cursor:"pointer", fontSize:18, padding:"2px 10px", flexShrink:0 }}>✕</button>
        </div>

        {/* Tipo de trabajo + rubros activos */}
        <div style={{ padding:"10px 18px", borderBottom:`1px solid ${C.border}`,
          display:"flex", flexWrap:"wrap", alignItems:"center", gap:14, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:11, color:C.muted, fontWeight:700 }}>TIPO:</span>
            {[["fabricacion","🔨 Fabricación"],["montaje","🏗️ Montaje"],["fab_mont","🔨🏗️ Fab + Mont"]].map(([val,lbl]) => (
              <button key={val} onClick={() => setTipo(val)} style={{
                ...BTN((item.tipo||"fab_mont")===val ? "primary" : "ghost"), padding:"4px 10px", fontSize:11,
              }}>{lbl}</button>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            <span style={{ fontSize:11, color:C.muted, fontWeight:700 }}>RUBROS:</span>
            {TABS.filter(t => t.id !== "resumen").map(t => {
              const on = activo(t.id);
              const cnt = counts[t.id];
              return (
                <button key={t.id} onClick={() => toggleRubro(t.id)}
                  title={(on ? `Ocultar ${t.label}` : `Mostrar ${t.label}`) + (cnt > 0 ? ` — tiene ${cnt} fila(s) cargada(s), ocultar no las borra` : "")}
                  style={{
                    background: on ? C.accent+"18" : "transparent",
                    border: `1px solid ${on ? C.accent+"55" : C.border}`,
                    color: on ? C.text : C.muted, opacity: on ? 1 : 0.55,
                    borderRadius:5, padding:"3px 8px", fontSize:10, cursor:"pointer",
                    display:"flex", alignItems:"center", gap:3,
                  }}>
                  <span>{on ? "☑" : "☐"}</span><span>{t.icon}</span><span>{t.label}</span>
                  {cnt > 0 && <span style={{ background: on ? C.accent : C.muted, color:"#fff", borderRadius:8, padding:"0 4px", fontSize:9, fontWeight:700 }}>{cnt}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:2, padding:"8px 14px 0", borderBottom:`1px solid ${C.border}`,
          overflowX:"auto", flexShrink:0 }}>
          {visibleTabs.map(t => {
            const cnt = counts[t.id];
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: active ? C.accent+"22" : "transparent",
                border: "none", borderBottom: active ? `2px solid ${C.accent}` : "2px solid transparent",
                color: active ? C.accent : C.muted,
                padding:"6px 10px", cursor:"pointer", fontSize:11, fontWeight: active ? 700 : 400,
                display:"flex", alignItems:"center", gap:4, whiteSpace:"nowrap", borderRadius:"4px 4px 0 0",
              }}>
                <span>{t.icon}</span>
                <span>{t.label}</span>
                {cnt > 0 && <span style={{ background:C.accent, color:"#fff", borderRadius:9, padding:"0 5px", fontSize:9, fontWeight:700 }}>{cnt}</span>}
              </button>
            );
          })}
        </div>

        {/* Contenido de la pestaña */}
        <div style={{ flex:1, overflowY:"auto", padding:16 }}>
          {tab === "resumen" && (() => {
            const q = +item.cantidad || 1;
            const rubros = { hier:c.hier_usd*q, mat:c.mat_usd*q, moFab:c.moFab_usd*q, moMon:c.moMon_usd*q, hesp:c.hesp_usd*q, tFab:c.tFab_usd*q, tMon:c.tMon_usd*q, trat:c.trat_usd*q, trasl:c.trasl_usd*q, panto:c.panto_usd*q };
            return (
              <div style={{ maxWidth:420 }}>
                <ResumenRubros rubros={rubros} total_usd={c.total_usd} total_kg={c.total_kg} />
                {c.pct_desperdicio > 0 && (
                  <div title="% de desperdicio ponderado por kg: kg perdidos en el corte ÷ kg totales comprados" style={{ marginBottom:8, padding:"6px 10px", background:C.warn+"11", border:`1px solid ${C.warn}33`, borderRadius:6, fontSize:12, color:C.warn, fontWeight:700 }}>
                    ⚠ {n2(c.pct_desperdicio)}% desperdicio (materiales del anidado vinculado)
                  </div>
                )}
                {c.total_usd === 0 && <div style={{ color:C.muted, fontSize:12 }}>Sin datos todavía — cargá materiales o mano de obra en las otras pestañas.</div>}
              </div>
            );
          })()}
          {tab === "hierros"          && <TabHierros      item={item} set={set} />}
          {tab === "mat_generales"    && <TabMatGenerales item={item} set={set} />}
          {tab === "mo_fabricacion"   && <TabMO           item={item} set={set} tipo="fabricacion" />}
          {tab === "mo_montajes"      && <TabMO           item={item} set={set} tipo="montaje" />}
          {tab === "terc_fabricacion" && <TabTerc         item={item} set={set} tipo="fabricacion" />}
          {tab === "terc_montajes"    && <TabTerc         item={item} set={set} tipo="montaje" />}
          {tab === "trat_superficie"  && <TabTrat         item={item} set={set} />}
          {tab === "traslados"        && <TabTraslados    item={item} set={set} />}
          {tab === "corte_pantografo" && <TabPanto        item={item} set={set} />}
        </div>

        {/* Footer */}
        <div style={{ padding:"10px 18px", borderTop:`1px solid ${C.border}`, display:"flex",
          justifyContent:"flex-end", gap:10, flexShrink:0, background:C.card }}>
          <button style={BTN("primary")} onClick={onClose}>✓ Listo</button>
        </div>
      </div>
    </div>
  );
}

// ─── FILA ITEM ────────────────────────────────────────────────────
function FilaItem({ item, onChange, onDelete }) {
  const [editando, setEditando] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const c = calcItem(item);
  const set = (k, v) => onChange({ ...item, [k]: v });

  return (
    <>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10,
        padding:"12px 16px", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>

          {editando ? (
            <input autoFocus value={item.titulo}
              style={{ ...INP, flex:1, minWidth:160, fontSize:14, fontWeight:700 }}
              onChange={e => set("titulo", e.target.value)}
              onBlur={() => setEditando(false)}
              onKeyDown={e => e.key === "Enter" && setEditando(false)} />
          ) : (
            <div onClick={() => setEditando(true)}
              style={{ flex:1, minWidth:160, cursor:"text", fontWeight:700, fontSize:14, color:C.text }}>
              {item.titulo}
            </div>
          )}

          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ fontSize:11, color:C.muted }}>×</span>
            <input type="number" value={item.cantidad} min="1"
              onChange={e => set("cantidad", +e.target.value)}
              style={{ ...INP, width:55, textAlign:"center", padding:"4px 6px", fontSize:13 }} />
          </div>

          <input value={item.n_plano} placeholder="N° plano"
            onChange={e => set("n_plano", e.target.value)}
            style={{ ...INP, width:100, padding:"4px 7px", fontSize:11, color:C.muted }} />

          <button onClick={() => set("no_agrega_kg", !item.no_agrega_kg)}
            style={{ ...BTN(item.no_agrega_kg ? "danger" : "ghost"), padding:"3px 8px", fontSize:10 }}>
            {item.no_agrega_kg ? "⚠ No KG" : "KG ✓"}
          </button>

          {item.tipo === "fabricacion" && <span style={BDG(C.pur, true)}>🔨 Fab</span>}
          {item.tipo === "montaje" && <span style={BDG(C.teal, true)}>🏗️ Mont</span>}

          {c.total_kg > 0  && <span style={{...BDG(C.info, true),fontSize:14,padding:"4px 12px"}}>{n3(c.total_kg)} kg</span>}
          {c.total_usd > 0 && <span style={{...BDG(C.ok,   true),fontSize:14,padding:"4px 12px",fontWeight:800}}>${n2(c.total_usd)}</span>}
          {c.usd_kg > 0    && <span style={{...BDG(C.gold, true),fontSize:14,padding:"4px 12px"}}>{n2(c.usd_kg)} $/kg</span>}

          <button style={{ ...BTN("ghost"), padding:"4px 10px", fontSize:11 }}
            onClick={() => setEditorOpen(true)}>🔧 Rubros</button>
          <button style={{ background:"none", border:"none", color:C.err, cursor:"pointer", fontSize:14 }}
            onClick={onDelete}>🗑</button>
        </div>

        {c.total_usd > 0 && (
          <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
            {[
              ["⚙️ Hier",  c.hier_usd,  C.info],
              ["📦 Mat",   c.mat_usd,   C.steel],
              ["🔨 MOFab", c.moFab_usd, C.pur],
              ["🏗️ MOMon", c.moMon_usd, C.teal],
              ["🎨 Trat",  c.trat_usd,  C.warn],
              ["🚚 Trasl", c.trasl_usd, C.muted],
            ].filter(([,v]) => v > 0).map(([lbl, v, col]) => (
              <span key={lbl} style={BDG(col, true)}>{lbl} ${n2(v)}</span>
            ))}
          </div>
        )}
      </div>

      {editorOpen && (
        <EditorRubros item={item} onChange={onChange} onClose={() => setEditorOpen(false)} />
      )}
    </>
  );
}

// ─── BARRA DE RUBRO ───────────────────────────────────────────────
// kg (opcional): si se pasa, además de $ y % muestra cuántos USD/kg del
// total representa este rubro (usd del rubro / kg total del ítem o presupuesto).
function BarraRubro({ label, usd, total, kg, color }) {
  const pct = total > 0 ? Math.round(usd / total * 1000) / 10 : 0;
  const usd_kg = kg > 0 ? usd / kg : 0;
  if (usd === 0) return null;
  return (
    <div style={{ marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:3 }}>
        <span style={{ color:C.muted }}>{label}</span>
        <span style={{ color, fontWeight:700 }}>
          ${n2(usd)} <span style={{ color:C.muted }}>({pct}%)</span>
          {usd_kg > 0 && <span title="Precio en dólares por kilogramo de material de este rubro" style={{ color:C.gold, marginLeft:6 }}>{n2(usd_kg)} $/kg</span>}
        </span>
      </div>
      <div style={{ background:C.iron, borderRadius:4, height:5 }}>
        <div style={{ width:`${pct}%`, height:5, background:color, borderRadius:4 }} />
      </div>
    </div>
  );
}

// ─── RESUMEN DE RUBROS (reutilizado a nivel ítem y a nivel presupuesto) ──
function ResumenRubros({ rubros, total_usd, total_kg }) {
  return (
    <>
      <BarraRubro label="⚙️ Materiales / Hierros" usd={rubros.hier+rubros.mat} total={total_usd} kg={total_kg} color={C.info} />
      <BarraRubro label="🔨 MO Fabricación"        usd={rubros.moFab}  total={total_usd} kg={total_kg} color={C.pur} />
      <BarraRubro label="🏗️ MO Montaje"            usd={rubros.moMon}  total={total_usd} kg={total_kg} color={C.teal} />
      <BarraRubro label="⏰ H. Especiales"         usd={rubros.hesp}   total={total_usd} kg={total_kg} color={C.warn} />
      <BarraRubro label="🏭 Terc. Fabricación"     usd={rubros.tFab}   total={total_usd} kg={total_kg} color={C.steel} />
      <BarraRubro label="🚛 Terc. Montaje"         usd={rubros.tMon}   total={total_usd} kg={total_kg} color={C.steel} />
      <BarraRubro label="🎨 Tratamiento Sup."      usd={rubros.trat}   total={total_usd} kg={total_kg} color={C.ok} />
      <BarraRubro label="🚚 Traslados"             usd={rubros.trasl}  total={total_usd} kg={total_kg} color={C.muted} />
      <BarraRubro label="✂️ Pantógrafo"            usd={rubros.panto}  total={total_usd} kg={total_kg} color={C.gold} />
    </>
  );
}

// ─── VISTA DETALLE ────────────────────────────────────────────────
function DetallePresupuesto({ pres, onChange, onBack, origenNro, tcGlobal, usuario, onAgregarComentario }) {
  const set = (k, v) => onChange({ ...pres, [k]: v });
  const c   = calcPresupuesto(pres);
  const updItem = (it) => set("items", pres.items.map(x => x.id === it.id ? it : x));
  const delItem = (id) => set("items", pres.items.filter(x => x.id !== id));
  const addItem = ()   => set("items", [...(pres.items||[]), iItem()]);
  const [confirmarSyncPrecios, setConfirmarSyncPrecios] = useState(null); // {cambios} | null

  const cambiarEstado = (k) => {
    if (k === "aprobado" && pres.estado !== "aprobado") {
      const cambios = calcularCambiosPrecios(pres);
      if (cambios.length > 0) setConfirmarSyncPrecios({ cambios });
    }
    set("estado", k);
  };

  // Backfill: presupuestos creados antes de este campo (o los históricos
  // importados) todavía no tienen codigo_calculo — se les asigna recién acá,
  // en el momento en que hace falta exportarlos a steelCRM.
  const exportarSteelCRM = () => {
    const codigo = pres.codigo_calculo || newCodigoCalculo();
    if (!pres.codigo_calculo) set("codigo_calculo", codigo);
    exportPresupuestoParaSteelCRM({ ...pres, codigo_calculo: codigo }, c);
  };

  return (
    <div>
      {confirmarSyncPrecios && (
        <ModalConfirmarBorrado
          titulo={`${confirmarSyncPrecios.cambios.length} precio(s) en Insumos y Precios`}
          subtitulo={
            `Este presupuesto tiene precios distintos a los cargados en Insumos y Precios:\n` +
            confirmarSyncPrecios.cambios.map(c => `• ${c.nombre}: $${n2(c.desde)} → $${n2(c.hasta)} USD/kg`).join("\n")
          }
          verbo="Actualizar"
          checkboxLabel="Sí, quiero actualizar Insumos y Precios con estos valores"
          labelBoton="✓ Actualizar precios"
          color={C.gold}
          onConfirm={() => { aplicarCambiosPrecios(pres, confirmarSyncPrecios.cambios); setConfirmarSyncPrecios(null); }}
          onClose={() => setConfirmarSyncPrecios(null)}
        />
      )}
      {/* Topbar */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, flexWrap:"wrap" }}>
        <button style={BTN("ghost")} onClick={onBack}>← Volver</button>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:17, color:C.accent }}>{pres.nombre||"Presupuesto sin nombre"}</div>
          <div style={{ fontSize:11, color:C.muted }}>
            {pres.nro} · {pres.fecha}
            {pres.codigo_calculo && <span title="Código de cálculo — vincula este presupuesto con steelCRM (idsCalc)"> · 🔗 {pres.codigo_calculo}</span>}
            {pres.clonado_de && <span> · 📋 clonado de {origenNro || pres.clonado_de}</span>}
          </div>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
          <button style={BTN("ghost")} onClick={() => generarPDFPresupuesto(pres)} title="Generar PDF del presupuesto">🖨️ PDF</button>
          <button style={BTN("ghost")} onClick={exportarSteelCRM} title="Descarga un .json con el resumen de este presupuesto (cliente, obra, kg, USD) para importar en steelCRM — no incluye el desglose interno de rubros">⬇️ steelCRM</button>
          {Object.entries(ESTADO_CFG).map(([k,v]) => (
            <button key={k} onClick={() => cambiarEstado(k)}
              style={{ ...BTN("ghost"), padding:"4px 12px", fontSize:11,
                ...(pres.estado===k ? { background:v.color+"22", color:v.color, border:`1px solid ${v.color}44` } : {}) }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:16, alignItems:"start" }}>

        {/* IZQUIERDA */}
        <div>
          {/* Datos generales */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, marginBottom:16 }}>
            <div style={{ fontWeight:700, color:C.steel, fontSize:11, marginBottom:14, textTransform:"uppercase", letterSpacing:.5 }}>
              Datos generales
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div><label style={LBL}>Cliente (empresa)</label>
                <AutocompleteEmpresa style={INP} value={pres.cliente||""} placeholder="Razón social" onChange={v=>set("cliente",v)}/></div>
              <div><label style={LBL}>Contacto</label>
                <AutocompleteCliente style={INP} value={pres.contacto||""} placeholder="Nombre" onChange={v=>set("contacto",v)}/></div>
              <div><label style={LBL}>Obra / Ubicación</label>
                <input style={INP} value={pres.obra||""} placeholder="Planta, dirección..." onChange={e=>set("obra",e.target.value)}/></div>
              <div><label style={LBL}>Tipo de trabajo</label>
                <select style={INP} value={pres.tipo_trabajo||"Fabricación"} onChange={e=>set("tipo_trabajo",e.target.value)}>
                  {TIPOS.map(t=><option key={t}>{t}</option>)}
                </select></div>
              <div><label style={LBL}>Categoría</label>
                <SelectCategoria value={pres.categoria} onChange={v=>set("categoria",v)} />
                {pres.categoria && <div style={{ fontSize:10, color:C.muted, marginTop:3 }}>Familia: {familiaDe(pres.categoria)}</div>}
              </div>
              <div><label style={LBL}>TC (USD/UYU)</label>
                <div style={{ ...INP, display:"flex", alignItems:"center", color:C.muted, background:C.bg }}>
                  {pres.tc != null
                    ? <>{n2(pres.tc)} <span style={{ marginLeft:6, fontSize:10 }}>(valor histórico de este presupuesto)</span></>
                    : <>{n2(tcGlobal)} <span style={{ marginLeft:6, fontSize:10 }}>(TC global — se edita en la barra lateral)</span></>}
                </div></div>
              <div><label style={LBL}>Detalle</label>
                <input style={INP} value={pres.detalle||""} placeholder="Descripción breve..." onChange={e=>set("detalle",e.target.value)}/></div>
              <div><label style={LBL}>Moneda</label>
                <select style={INP} value={pres.moneda||"USD"} onChange={e=>set("moneda",e.target.value)}>
                  <option value="USD">USD</option>
                  <option value="UYU">UYU</option>
                </select></div>
              <div><label style={LBL}>Forma de pago</label>
                <input style={INP} value={pres.forma_pago||""} placeholder="ej: Contado, 30 días..." onChange={e=>set("forma_pago",e.target.value)}/></div>
              <div style={{ gridColumn:"1 / -1" }}><label style={LBL}>Notas / Cláusulas</label>
                <input style={INP} value={pres.notas||""} placeholder="Observaciones, condiciones, cláusulas..." onChange={e=>set("notas",e.target.value)}/></div>
            </div>
          </div>

          <ComentariosPanel comentarios={pres.comentarios} usuario={usuario} onAgregar={onAgregarComentario} />

          {/* Ítems */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ fontWeight:700, color:C.steel, fontSize:11, textTransform:"uppercase", letterSpacing:.5 }}>
                Ítems ({(pres.items||[]).length})
              </div>
              <button style={BTN("ok")} onClick={addItem}>+ Agregar ítem</button>
            </div>
            {(pres.items||[]).length === 0 && (
              <div style={{ textAlign:"center", padding:40, color:C.muted, fontSize:13,
                border:`1px dashed ${C.border}`, borderRadius:10 }}>
                Sin ítems — hacé clic en "Agregar ítem" para empezar
              </div>
            )}
            {(pres.items||[]).map(it => (
              <FilaItem key={it.id} item={it} onChange={updItem} onDelete={() => delItem(it.id)} />
            ))}
          </div>
        </div>

        {/* DERECHA: Resumen */}
        <div style={{ position:"sticky", top:70 }}>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
            <div style={{ fontWeight:700, color:C.steel, fontSize:11, marginBottom:14, textTransform:"uppercase", letterSpacing:.5 }}>
              Resumen
            </div>

            <ResumenRubros rubros={c.rubros} total_usd={c.total_usd} total_kg={c.total_kg} />
            {c.pct_desperdicio > 0 && (
              <div title="% de desperdicio ponderado por kg de todos los materiales que vinieron de un Anidado: kg perdidos en el corte ÷ kg totales comprados" style={{ marginBottom:8, padding:"6px 10px", background:C.warn+"11", border:`1px solid ${C.warn}33`, borderRadius:6, fontSize:12, color:C.warn, fontWeight:700 }}>
                ⚠ {n2(c.pct_desperdicio)}% desperdicio general (materiales de anidados vinculados)
              </div>
            )}

            <div style={{ borderTop:`1px solid ${C.border}`, marginTop:10, paddingTop:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:8 }}>
                <span style={{ color:C.muted }}>Subtotal</span>
                <span style={{ fontWeight:700 }}>${n2(c.total_usd)}</span>
              </div>

              {/* Negociación */}
              <div style={{ background:C.iron, borderRadius:8, padding:10, marginBottom:8 }}>
                <div style={{ fontSize:11, color:C.muted, marginBottom:6, fontWeight:700 }}>Negociación (aumenta el total)</div>
                <div style={{ display:"flex", gap:6, marginBottom:6 }}>
                  <button style={{ ...BTN(pres.neg_modo==="pct"?"ok":"ghost"), padding:"3px 8px", fontSize:10 }}
                    onClick={() => set("neg_modo","pct")}>%</button>
                  <button style={{ ...BTN(pres.neg_modo==="usd"?"ok":"ghost"), padding:"3px 8px", fontSize:10 }}
                    onClick={() => set("neg_modo","usd")}>USD</button>
                </div>
                {pres.neg_modo === "pct" ? (
                  <input type="number" value={pres.negociacion_pct||0} min="0" max="100" step="0.1"
                    style={{ ...INP, padding:"4px 7px", fontSize:12 }}
                    onChange={e => set("negociacion_pct",+e.target.value)} />
                ) : (
                  <input type="number" value={pres.negociacion_usd||0} min="0" step="10"
                    style={{ ...INP, padding:"4px 7px", fontSize:12 }}
                    onChange={e => set("negociacion_usd",+e.target.value)} />
                )}
                {c.neg_usd > 0 && <div style={{ fontSize:11, color:C.ok, marginTop:4 }}>+ ${n2(c.neg_usd)}</div>}
              </div>

              {/* Interés */}
              <div style={{ background:C.iron, borderRadius:8, padding:10, marginBottom:10 }}>
                <div style={{ fontSize:11, color:C.muted, marginBottom:6, fontWeight:700 }}>Interés financiero</div>
                {(loadTarifario().interes_financiero||[]).length > 0 && (
                  <select value="" style={{ ...INP, padding:"4px 7px", fontSize:12, marginBottom:8, width:"100%" }}
                    onChange={e=>{
                      const t = loadTarifario().interes_financiero.find(x=>x.id===e.target.value);
                      if (!t) return;
                      onChange({ ...pres, interes_pct: t.pct, interes_dias: t.dias });
                    }}>
                    <option value="">+ Desde tabla de plazos (Config)...</option>
                    {loadTarifario().interes_financiero.map(t=>
                      <option key={t.id} value={t.id}>{t.nombre} — {t.moneda} ({t.pct}%)</option>)}
                  </select>
                )}
                <div style={{ display:"flex", gap:8 }}>
                  <div style={{ flex:1 }}>
                    <label style={{ fontSize:10, color:C.muted }}>% anual</label>
                    <input type="number" value={pres.interes_pct||0} min="0" step="0.5"
                      style={{ ...INP, padding:"4px 7px", fontSize:12 }}
                      onChange={e => set("interes_pct",+e.target.value)} />
                  </div>
                  <div style={{ flex:1 }}>
                    <label style={{ fontSize:10, color:C.muted }}>Días plazo</label>
                    <input type="number" value={pres.interes_dias||30} min="0"
                      style={{ ...INP, padding:"4px 7px", fontSize:12 }}
                      onChange={e => set("interes_dias",+e.target.value)} />
                  </div>
                </div>
                {c.int_usd > 0 && <div style={{ fontSize:11, color:C.warn, marginTop:4 }}>+ ${n2(c.int_usd)}</div>}
              </div>

              {/* Gran total */}
              <div style={{ background:C.accent+"18", border:`1px solid ${C.accent}33`, borderRadius:8, padding:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                  <span style={{ fontSize:13, color:C.accent, fontWeight:700 }}>TOTAL USD</span>
                  <span style={{ fontSize:28, fontWeight:900, color:C.accent }}>${n2(c.gran_total)}</span>
                </div>
                {c.total_kg > 0 && (
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginTop:8, paddingTop:8, borderTop:`1px solid ${C.accent}22` }}>
                    <div>
                      <div style={{ fontSize:10, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>Kg totales</div>
                      <div style={{ fontSize:22, fontWeight:800, color:C.text }}>{n3(c.total_kg)}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:10, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>USD/kg</div>
                      <div style={{ fontSize:22, fontWeight:800, color:C.gold }}>{n2(c.usd_kg)}</div>
                    </div>
                  </div>
                )}
                {(pres.tc ?? tcGlobal) > 0 && (
                  <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>
                    ≈ UYU {n2(c.gran_total * (pres.tc ?? tcGlobal))} (TC {n2(pres.tc ?? tcGlobal)})
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL: IMPORTAR MATERIALES AGREGADOS (desde Cómputo) ────────
function ImportarMaterialesModal({ materiales, presupuestos, onImportar, onClose }) {
  const [presId, setPresId] = useState("");
  const [itemSel, setItemSel] = useState(""); // "" | "__nuevo__" | item.id
  const pres = presupuestos.find(p => p.id === presId) || null;
  const totalKg = (materiales||[]).reduce((s,m)=>s+m.kg,0);

  const confirmar = () => {
    if (!presId || !itemSel) return;
    if (itemSel === "__nuevo__") onImportar(presId, uid(), true);
    else onImportar(presId, itemSel, false);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1500, background:"#000a", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:C.card, border:`1.5px solid ${C.accent}55`, borderRadius:14, padding:26, width:"100%", maxWidth:480 }}>
        <div style={{ color:C.accent, fontWeight:800, fontSize:15, marginBottom:6 }}>⬇ Importar materiales a Presupuesto</div>
        <div style={{ color:C.muted, fontSize:12, marginBottom:18 }}>
          {(materiales||[]).length} materiales · {n2(totalKg)} kg totales — se cargan como filas de Hierros, con precio/proveedor y las selecciones de granallado/pintura/galvanizado precargadas cuando estén disponibles. Podés editar cada fila después.
        </div>

        <label style={LBL}>Presupuesto destino</label>
        <select style={{...INP,marginBottom:14}} value={presId} onChange={e=>{setPresId(e.target.value);setItemSel("");}}>
          <option value="">— Elegí un presupuesto —</option>
          {presupuestos.map(p=><option key={p.id} value={p.id}>{p.nro} — {p.nombre||"Sin nombre"}</option>)}
        </select>

        {pres && (
          <>
            <label style={LBL}>Ítem destino</label>
            <select style={{...INP,marginBottom:18}} value={itemSel} onChange={e=>setItemSel(e.target.value)}>
              <option value="">— Elegí un ítem —</option>
              <option value="__nuevo__">+ Crear ítem nuevo</option>
              {(pres.items||[]).map(it=><option key={it.id} value={it.id}>{it.titulo||"Ítem sin nombre"}</option>)}
            </select>
          </>
        )}

        <div style={{ display:"flex", gap:8 }}>
          <button onClick={confirmar} disabled={!presId||!itemSel}
            style={{ ...BTN("primary"), flex:1, opacity:(!presId||!itemSel)?0.5:1 }}>
            Importar {(materiales||[]).length} materiales
          </button>
          <button onClick={onClose} style={{ ...BTN("ghost"), flex:1 }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

// ─── PRESUPUESTO (EXPORT DEFAULT) ────────────────────────────────
export default function Presupuesto({ usuario, tcGlobal }) {
  const [presupuestos, setPres] = useState(() => loadLS("smeas_presupuestos", []));
  useMergePresupuestosNube(setPres);
  const [vista,  setVista]  = useState("lista");
  const [selId,  setSelId]  = useState(null);
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroObra, setFiltroObra] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtDesde, setFiltDesde] = useState("");
  const [filtHasta, setFiltHasta] = useState("");
  const [filtEst, setFiltEst] = useState("");
  const [confirmarDelId, setConfirmarDelId] = useState(null);
  const [materialesPend, setMaterialesPend] = useState(() => loadLS("smeas_material_export_pending", null));
  const [historicoCargado, setHistoricoCargado] = useState(() => loadLS("smeas_historico_cargado", false));
  const [confirmarHistorico, setConfirmarHistorico] = useState(false);

  useEffect(() => { saveLS("smeas_presupuestos", presupuestos); }, [presupuestos]);

  // Ir directo a un presupuesto desde el Buscador global
  useEffect(() => {
    const pendId = loadLS("smeas_ir_a_presupuesto", null);
    if (!pendId) return;
    saveLS("smeas_ir_a_presupuesto", null);
    setSelId(pendId);
    setVista("detalle");
  }, []); // eslint-disable-line

  const cerrarImportMateriales = () => {
    saveLS("smeas_material_export_pending", null);
    setMaterialesPend(null);
  };
  const importarMateriales = (presupuestoId, itemId, itemEsNuevo) => {
    const materiales = materialesPend || [];
    const bibMap = {};
    [...loadLS("smeas_perfiles",[]), ...loadLS("smeas_planchuelas",[]), ...loadLS("smeas_planchas",[])]
      .forEach(m => { bibMap[m.nombre] = parseFloat(m.precio_usd_kg || m.precio || 0) || 0; });
    const nuevasFilas = materiales.map(m => {
      const usd_kg = m.usd_kg || bibMap[m.nombre] || 0;
      return {
        id: uid(), nombre: m.nombre, proveedor: m.proveedor || "", cantidad: 1,
        kg_pieza: +m.kg.toFixed(3), area_pieza_m2: +m.sup.toFixed(3), usd_kg,
        arena: !!m.granallado, pintura: !!m.pintura, galvanizado: !!m.galvanizado,
        subtotal_kg: +m.kg.toFixed(3), subtotal_m2: +m.sup.toFixed(3), subtotal_usd: +(m.kg*usd_kg).toFixed(2),
      };
    });
    setPres(prev => prev.map(p => {
      if (p.id !== presupuestoId) return p;
      const items = itemEsNuevo
        ? [...p.items, { ...iItem(), id: itemId, hierros: nuevasFilas }]
        : p.items.map(it => it.id === itemId ? { ...it, hierros: [...(it.hierros||[]), ...nuevasFilas] } : it);
      return touch({ ...p, items });
    }));
    cerrarImportMateriales();
    setSelId(presupuestoId);
    setVista("detalle");
  };

  const selPres = presupuestos.find(p => p.id === selId) || null;
  const cnt = Object.fromEntries(Object.keys(ESTADO_CFG).map(k => [k, presupuestos.filter(p => p.estado===k).length]));

  const lista = presupuestos
    .filter(p => !filtEst || p.estado === filtEst)
    .filter(p => !filtroNombre  || [p.nombre,p.nro].join(" ").toLowerCase().includes(filtroNombre.toLowerCase()))
    .filter(p => !filtroCliente || (p.cliente||"").toLowerCase().includes(filtroCliente.toLowerCase()))
    .filter(p => !filtroObra    || (p.obra||"").toLowerCase().includes(filtroObra.toLowerCase()))
    .filter(p => !filtroTipo    || p.tipo === filtroTipo)
    .filter(p => !filtDesde || (p.fecha||"") >= filtDesde)
    .filter(p => !filtHasta || (p.fecha||"") <= filtHasta);

  // Fase 3 (piloto, 2026-08-22): dual-write en paralelo, nunca bloquea ni
  // puede romper el guardado local (localStorage sigue siendo la fuente de
  // verdad). Resuelve `cliente` (texto libre local) a `cliente_id` real
  // contra la tabla `clientes` — mismo helper que usa registrarCliente.
  const dualWritePresupuesto = async (p) => {
    if (!supabase) return;
    try {
      // A diferencia de Cómputo/Anidado/Historial, acá "cliente" siempre fue
      // la razón social (empresa) y "contacto" el nombre de la persona —
      // mapeo corregido 2026-08-23 (antes se invertía sin querer). Si no
      // hay contacto cargado, se resuelve igual usando el nombre de la
      // empresa como si fuera el "nombre" del cliente (mismo criterio de
      // respaldo que ya usan los otros módulos sin este segundo campo).
      const nombreParaClientes = (p.contacto || p.cliente || "").trim();
      const empresaParaClientes = p.contacto ? p.cliente : null;
      const cliente_id = nombreParaClientes ? await resolverClienteId(nombreParaClientes, empresaParaClientes) : null;
      const { cliente, clonado_de, items, comentarios, ...resto } = p;
      await saveDBPresupuestoSM({ ...resto, cliente_id, clonado_de_id: clonado_de || null });
      for (const item of items || []) {
        await saveDBItem(p.id, item);
      }
    } catch (e) {
      console.warn(`[Fase 3] No se pudo sincronizar presupuesto "${p.nro || p.id}" con el backend:`, e.message || e);
    }
  };

  const crearPres = (form) => {
    const nuevo = { ...iPresupuesto(), ...form };
    nuevo.nro = newNroPresupuesto();
    nuevo.codigo_calculo = newCodigoCalculo();
    setPres([nuevo, ...presupuestos]);
    setSelId(nuevo.id);
    setVista("detalle");
    setNuevoOpen(false);
    dualWritePresupuesto(nuevo);
  };

  const updPres = (p) => {
    const actualizado = touch(p);
    setPres(prev => prev.map(x => x.id===p.id ? actualizado : x));
    dualWritePresupuesto(actualizado);
  };

  // Comentarios internos (2026-08-24): guardado directo, no depende del
  // Guardar general del presupuesto.
  const agregarComentario = async (p, comentario) => {
    const actualizado = touch({ ...p, comentarios: [...(p.comentarios || []), comentario] });
    setPres(prev => prev.map(x => x.id===p.id ? actualizado : x));
    if (!supabase) return;
    try {
      // Asegura que el presupuesto exista remoto antes de comentar (condición
      // de carrera real si se comenta justo después de crear — ver Cómputo.jsx).
      await dualWritePresupuesto(p);
      await saveDBComentario("comentarios_presupuesto_sm", "presupuesto_id", p.id, comentario);
    } catch (e) {
      console.warn(`[Fase 3] No se pudo sincronizar el comentario con el backend:`, e.message || e);
    }
  };
  const delPres = (id) => setPres(prev => prev.filter(x => x.id!==id));

  const clonarPres = (p) => {
    const nuevo = {
      ...JSON.parse(JSON.stringify(p)),
      id: uid(), clonado_de: p.id, estado: "borrador",
      fecha: new Date().toISOString().slice(0, 10),
      ...stamp(),
    };
    nuevo.nro = newNroPresupuesto();
    nuevo.codigo_calculo = newCodigoCalculo();
    setPres([nuevo, ...presupuestos]);
    setSelId(nuevo.id);
    setVista("detalle");
  };
  const presAEliminar = confirmarDelId ? presupuestos.find(p=>p.id===confirmarDelId) : null;

  const cargarHistorico = () => {
    if (historicoCargado) return;
    const nuevos = PRESUPUESTOS_HISTORICOS_SEED.map(p => ({ ...p, id: uid() }));
    setPres(prev => [...nuevos, ...prev]);
    setHistoricoCargado(true);
    saveLS("smeas_historico_cargado", true);
    setConfirmarHistorico(false);
  };

  if (vista === "detalle" && selPres) {
    const origenNro = selPres.clonado_de ? presupuestos.find(x => x.id === selPres.clonado_de)?.nro : null;
    return (
      <>
        <DetallePresupuesto pres={selPres} onChange={updPres} onBack={() => { setVista("lista"); setSelId(null); }} origenNro={origenNro} tcGlobal={tcGlobal} usuario={usuario} onAgregarComentario={(c) => agregarComentario(selPres, c)} />
        {materialesPend && (
          <ImportarMaterialesModal materiales={materialesPend} presupuestos={presupuestos} onImportar={importarMateriales} onClose={cerrarImportMateriales} />
        )}
      </>
    );
  }

  return (
    <div>
      {presAEliminar && (
        <ModalConfirmarEliminar
          titulo={`presupuesto "${presAEliminar.nombre||"Sin nombre"}" (${presAEliminar.nro})`}
          onConfirm={() => { delPres(presAEliminar.id); setConfirmarDelId(null); }}
          onClose={() => setConfirmarDelId(null)}
        />
      )}
      {confirmarHistorico && (
        <ModalConfirmarBorrado
          titulo={`${PRESUPUESTOS_HISTORICOS_SEED.length} presupuestos históricos`}
          subtitulo={`Se reconstruyen desde el histórico de fabricación (2017-2024), marcados "H-<OT>" y en estado Aprobado. Son una aproximación por rubro (sin detalle pieza por pieza) — se suman a los presupuestos existentes, no reemplazan nada.`}
          verbo="Cargar"
          checkboxLabel="Sí, quiero cargar estos presupuestos"
          labelBoton="📥 Cargar histórico"
          color={C.accent}
          onConfirm={cargarHistorico}
          onClose={() => setConfirmarHistorico(false)}
        />
      )}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontWeight:800, fontSize:20, color:C.accent }}>💰 Presupuestos</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{presupuestos.length} presupuesto{presupuestos.length!==1?"s":""}</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {!historicoCargado && (
            <button style={BTN("ghost")} onClick={() => setConfirmarHistorico(true)} title="Reconstruye presupuestos aproximados desde el histórico de fabricación (2017-2024)">
              📥 Cargar histórico ({PRESUPUESTOS_HISTORICOS_SEED.length})
            </button>
          )}
          <button style={BTN("primary")} onClick={() => setNuevoOpen(true)}>+ Nuevo presupuesto</button>
        </div>
      </div>

      {/* Filtros por estado */}
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
        <button onClick={() => setFiltEst("")}
          style={{ ...BTN(filtEst===""?"ok":"ghost"), padding:"4px 12px", fontSize:11 }}>
          Todos ({presupuestos.length})
        </button>
        {Object.entries(ESTADO_CFG).map(([k,v]) => (
          <button key={k} onClick={() => setFiltEst(filtEst===k?"":k)}
            style={{ ...BTN("ghost"), padding:"4px 12px", fontSize:11,
              ...(filtEst===k ? { background:v.color+"22", color:v.color, border:`1px solid ${v.color}44` } : {}) }}>
            {v.label} ({cnt[k]||0})
          </button>
        ))}
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
        <input style={{ ...INP, width:190 }} value={filtroNombre} placeholder="🔍 Nombre / N°…"
          onChange={e => setFiltroNombre(e.target.value)} />
        <AutocompleteCliente style={{ ...INP, width:170 }} value={filtroCliente} placeholder="🔍 Cliente…"
          onChange={setFiltroCliente} />
        <input style={{ ...INP, width:170 }} value={filtroObra} placeholder="🔍 Obra…"
          onChange={e => setFiltroObra(e.target.value)} />
        <select style={{ ...INP, width:150 }} value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input type="date" style={{ ...INP, width:140 }} value={filtDesde} title="Desde"
          onChange={e => setFiltDesde(e.target.value)} />
        <input type="date" style={{ ...INP, width:140 }} value={filtHasta} title="Hasta"
          onChange={e => setFiltHasta(e.target.value)} />
      </div>

      {lista.length === 0 && (
        <div style={{ textAlign:"center", padding:60, color:C.muted }}>
          {presupuestos.length === 0 ? (
            <>
              <div style={{ fontSize:40, marginBottom:12 }}>💰</div>
              <div style={{ fontSize:15, fontWeight:700, marginBottom:6, color:C.steel }}>Sin presupuestos todavía</div>
              <div style={{ fontSize:12, marginBottom:20 }}>Creá el primer presupuesto para empezar</div>
              <button style={BTN("primary")} onClick={() => setNuevoOpen(true)}>+ Nuevo presupuesto</button>
            </>
          ) : (
            <div style={{ fontSize:13 }}>No hay resultados para ese filtro</div>
          )}
        </div>
      )}

      {lista.length > 0 && (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              {["N°","Nombre","Cliente","Obra","Tipo","Fecha","Ítems","Total USD","Estado",""].map(h=>(
                <th key={h} style={TH}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {lista.map(p => {
                const c = calcPresupuesto(p);
                const est = ESTADO_CFG[p.estado] || ESTADO_CFG.borrador;
                return (
                  <tr key={p.id} onClick={() => { setSelId(p.id); setVista("detalle"); }}
                    style={{ cursor:"pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background=C.iron+"55"}
                    onMouseLeave={e => e.currentTarget.style.background=""}>
                    <td style={TD}><span style={{ color:C.muted, fontSize:11 }}>{p.nro}</span></td>
                    <td style={TD}><span style={{ fontWeight:700 }}>{p.nombre}</span></td>
                    <td style={TD}><span style={{ fontSize:12, color:C.steel }}>{p.cliente||"—"}</span></td>
                    <td style={TD}><span style={{ fontSize:12, color:C.muted }}>{p.obra||"—"}</span></td>
                    <td style={TD}><span style={BDG(C.steel,true)}>{p.tipo_trabajo||"Fab"}</span></td>
                    <td style={TD}><span style={{ fontSize:11, color:C.muted }}>{p.fecha}</span></td>
                    <td style={{ ...TD, textAlign:"center" }}>{(p.items||[]).length}</td>
                    <td style={{ ...TD, textAlign:"right", fontWeight:700, color:C.ok }}>
                      {c.gran_total>0 ? `$${n2(c.gran_total)}` : "—"}
                    </td>
                    <td style={TD}><span style={BDG(est.color,true)}>{est.label}</span></td>
                    <td style={TD} onClick={e=>e.stopPropagation()}>
                      <button onClick={() => clonarPres(p)} title="Clonar presupuesto"
                        style={{ background:"none", border:"none", color:C.steel, cursor:"pointer", fontSize:13, marginRight:8 }}>📋</button>
                      {puedeEliminar(usuario) && (
                        <button onClick={() => setConfirmarDelId(p.id)}
                          style={{ background:"none", border:"none", color:C.err, cursor:"pointer", fontSize:13 }}>🗑</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {nuevoOpen && <ModalNuevo onSave={crearPres} onClose={() => setNuevoOpen(false)} />}
      {materialesPend && (
        <ImportarMaterialesModal materiales={materialesPend} presupuestos={presupuestos} onImportar={importarMateriales} onClose={cerrarImportMateriales} />
      )}
    </div>
  );
}
