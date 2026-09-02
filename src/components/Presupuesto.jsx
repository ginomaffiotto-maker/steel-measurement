import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { C, TH, TD, INP, LBL, BDG, BTN } from "../styles/colors";
import { saveLS, loadLS, uid, stamp, touch, loadTarifario, saveTarifario, saveDBTarifario, newNroPresupuesto, newCodigoCalculo, buscarVinculoCRM, enviarPresupuestoASteelCRM, loadBloquesPDF, resolverClienteId, saveDBPresupuestoSM, saveDBItem, useMergePresupuestosNube, saveDBComentario, deleteDBComentario, useListaClientes, useListaObras, useListaEmpresas, marcarSyncPendiente, limpiarSyncPendiente, obtenerSyncPendientes } from "../utils/storage";
import { mergeSeed, migrar, PERFILES_DATA, PLANCHUELAS_DATA, PLANCHAS_DATA, IDS_UNIFICADOS_GM } from "./BibliotecaMateriales";
import ComentariosPanel from "./ComentariosPanel";
import { supabase } from "../utils/supabaseClient";
import AutocompleteCliente from "./AutocompleteCliente";
import AutocompleteEmpresa from "./AutocompleteEmpresa";
import AutocompleteObra from "./AutocompleteObra";
import ClienteRapidoModal from "./ClienteRapidoModal";
import ObraRapidaModal from "./ObraRapidaModal";
import EmpresaRapidaModal from "./EmpresaRapidaModal";
import { ModalConfirmarEliminar, ModalConfirmarBorrado } from "./ConfirmarEliminar";
import { PRESUPUESTOS_HISTORICOS_SEED } from "../utils/presupuestosHistoricosSeed";
import { abrirPDFPresupuesto } from "../utils/pdfPresupuesto";
import { useSortable } from "../utils/useSortable";
import { familiaDe, SelectCategoria, FAMILIAS } from "../utils/taxonomia";
import { useUndoToast } from "./Toast";
import FiltrosBar from "./FiltrosBar";

// ─── HELPERS ─────────────────────────────────────────────────────
const n2  = v => (Math.round((+v || 0) * 100) / 100).toFixed(2);
const n3  = v => (Math.round((+v || 0) * 1000) / 1000).toFixed(3);
const hoy = () => new Date().toISOString().split("T")[0];
// Saca tildes para que buscar "ang"/"heb" encuentre "Ángulo"/"HEB 160"
// (mismo criterio que normStr/norm en Computo.jsx y Anidado.jsx).
const norm = s => String(s||"").toLowerCase()
  .normalize("NFD").replace(new RegExp("[\\u0300-\\u036f]","g"),"");

// Biblioteca combinada (perfiles+planchuelas+planchas) para el autocompletar
// de la fila de Hierros — mismo catálogo con seed por defecto que ya usa
// Cómputo/Anidado, para que funcione aunque nunca se haya abierto "Insumos
// y Precios" en este browser.
function useBibliotecaHierros() {
  return useMemo(() => {
    const perfiles    = migrar(mergeSeed(loadLS("smeas_perfiles",    null), PERFILES_DATA,    IDS_UNIFICADOS_GM));
    const planchuelas = migrar(mergeSeed(loadLS("smeas_planchuelas", null), PLANCHUELAS_DATA));
    const planchas    = migrar(mergeSeed(loadLS("smeas_planchas",    null), PLANCHAS_DATA));
    return [...perfiles, ...planchuelas, ...planchas].map(p => ({
      id: p.id, nombre: p.nombre, cat: p.cat,
      precio_usd_kg: parseFloat(p.precio_usd_kg || 0) || 0,
    }));
  }, []);
}

// Input de texto libre (siempre se puede tipear cualquier nombre) con
// sugerencias filtradas de la biblioteca debajo — al elegir una, completa
// nombre + USD/kg de una. No obliga a elegir de la lista, a diferencia del
// Combobox de Cómputo/Anidado (acá "Plancha e=10, sin catálogo" sigue
// siendo un nombre válido).
function AutocompleteMaterial({ value, onChange, onSeleccionar, opciones, placeholder, style }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const q = norm((value||"").trim());
  const tokens = q ? q.split(" ").filter(Boolean) : [];
  const lista = tokens.length === 0 ? [] : opciones.filter(o => {
    const hay = norm(o.nombre + " " + (o.cat||""));
    return tokens.every(t => hay.includes(t));
  }).slice(0, 30);
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <input value={value} placeholder={placeholder}
        onChange={e=>{ onChange(e.target.value); setOpen(true); }}
        onFocus={()=>setOpen(true)}
        style={style}/>
      {open && lista.length > 0 && (
        <div style={{ position:"absolute", top:"calc(100% + 2px)", left:0, width:260, zIndex:9999,
          background:C.card, border:`1px solid ${C.accent}55`, borderRadius:8,
          boxShadow:"0 8px 24px #00000077", overflow:"hidden" }}>
          <div style={{ maxHeight:220, overflowY:"auto" }}>
            {lista.map(o => (
              <div key={o.id} onMouseDown={()=>{ onSeleccionar(o); setOpen(false); }}
                style={{ padding:"7px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:8, fontSize:13 }}
                onMouseEnter={e=>e.currentTarget.style.background=C.iron}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{ flex:1 }}>{o.nombre}</span>
                {o.precio_usd_kg > 0
                  ? <span style={{ fontSize:13, color:C.muted }}>${n2(o.precio_usd_kg)}/kg</span>
                  : <span title="Sin precio cargado" style={{ fontSize:13, color:C.warn }}>⚠ sin precio</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
  // 2026-08-30: esta función no traía precio en absoluto (a diferencia de la
  // misma función en Anidado.jsx, que sí lo resuelve) — "Importar materiales
  // del anidado" en Presupuesto compensaba buscando el precio por NOMBRE
  // contra la biblioteca, y si el nombre no matcheaba exacto quedaba en $0
  // sin avisar (encontrado en vivo por Gino). Se resuelve acá por
  // `material_id` (más robusto que por nombre) para que ambos casos usen
  // el mismo dato.
  const bibPrecioPorId = {};
  [...loadLS("smeas_perfiles",[]), ...loadLS("smeas_planchuelas",[]), ...loadLS("smeas_planchas",[])]
    .forEach(m => { bibPrecioPorId[m.id] = parseFloat(m.precio_usd_kg || m.precio || 0) || 0; });
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
    const precio_usd_kg = bibPrecioPorId[g.material_id] || 0;
    return { id: g.id, tipo: g.tipo, nombre: g.material_nombre || "Sin material", kg, sup, unidades, pct_desperdicio, precio_usd_kg, ficha: g.ficha || {} };
  });
}

// Íconos (2026-08-24, sistema "Acero", mismo criterio que steelCRM): ya
// eran solo 3 colores reales acá (gris/info/ok/err, sin redundancia), pero
// se suma el ícono para que las dos apps se sientan del mismo sistema.
const ESTADO_CFG = {
  borrador:  { label: "Borrador",  color: C.muted, icon: "📝" },
  enviado:   { label: "Enviado",   color: C.info,  icon: "📤" },
  aprobado:  { label: "Aprobado",  color: C.ok,    icon: "✅" },
  rechazado: { label: "Rechazado", color: C.err,   icon: "❌" },
};
const TIPOS = ["Fabricación", "Montaje", "Fab+Mont"];

const PRES_FILT_DEFAULTS = { nombre: "", cliente: "", obra: "", tipo: "", familia: "", vendedor: "", desde: "", hasta: "" };
function presCampos(usuarios) {
  const campos = [
    { key: "nombre", label: "Nombre / N°", type: "text", placeholder: "Buscar…", minWidth: 190 },
    { key: "cliente", label: "Cliente", type: "clienteAuto", placeholder: "Buscar…", minWidth: 170 },
    { key: "obra", label: "Obra", type: "text", placeholder: "Buscar…", minWidth: 170 },
    { key: "tipo", label: "Tipo", type: "select", options: TIPOS, minWidth: 150 },
    { key: "familia", label: "Familia", type: "select", options: Object.keys(FAMILIAS), minWidth: 170 },
  ];
  if (usuarios.length > 0) campos.push({ key: "vendedor", label: "Vendedor", type: "select", options: usuarios.map(u => ({ value: u.id, label: u.nombre })), minWidth: 190 });
  campos.push({ key: "desde", label: "Desde", type: "date", minWidth: 140 });
  campos.push({ key: "hasta", label: "Hasta", type: "date", minWidth: 140 });
  return campos;
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
  vendedor: "",
  eliminado: false, eliminadoPor: null, eliminadoFecha: null,
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

  // Detalle para el desplegable de "Ver detalle completo" del resumen —
  // horas por tipo (Común/Nocturna/Extra/Lluvia) y litros/superficie de
  // tratamiento, valores que ya se calculaban dentro de TabMO/TabTrat
  // pero nunca llegaban hasta acá.
  const horasPorTipo = (rows) => {
    const out = { Común:0, Nocturna:0, Extra:0, Lluvia:0 };
    (rows || []).forEach(r => { const t = normalizarTipoHora(r.tipo_hora); out[t] = (out[t]||0) + (+r.cant_horas||0); });
    return out;
  };
  // Por categoría de operario (Oficial/Medio Oficial/Ayudante, etc.) — a
  // diferencia de tipo de hora, las categorías son dinámicas (catálogo de
  // Config), así que el objeto no tiene claves fijas.
  const horasPorCategoria = (rows) => {
    const out = {};
    (rows || []).forEach(r => { const cat = r.categoria || "Sin categoría"; out[cat] = (out[cat]||0) + (+r.cant_horas||0); });
    return out;
  };
  const moFab_horasPorTipo = horasPorTipo(it.mo_fabricacion);
  const moMon_horasPorTipo = horasPorTipo(it.mo_montajes);
  const moFab_horasPorCategoria = horasPorCategoria(it.mo_fabricacion);
  const moMon_horasPorCategoria = horasPorCategoria(it.mo_montajes);
  const hesp_h     = (it.horas_especiales || []).reduce((s, h) => s + (+h.cant_horas || 0), 0);
  const trat_lt    = (ts.pinturas || []).reduce((s, p) => s + (+p.cant_lt||0) * (+p.cant_manos||0), 0);
  const arenado_m2 = +ts.arenado_m2 || 0;
  const galvanizado_kg = ts.galvanizado ? (+ts.galvanizado_kg || 0) : 0;

  const total_unit = hier_usd + mat_usd + moFab_usd + moMon_usd + hesp_usd
                   + tFab_usd + tMon_usd + trat_usd + trasl_usd + panto_usd;
  const total_usd  = total_unit * cant;
  const total_kg   = it.no_agrega_kg ? 0 : hier_kg * cant;
  const usd_kg     = total_kg > 0 ? total_usd / total_kg : 0;
  // Valor en USD del desperdicio, usando el USD/kg promedio de los hierros
  // de este ítem como tasa (mismo criterio que Gestsoft).
  const desperdicio_usd = hier_kg > 0 ? kg_desp_pond * (hier_usd / hier_kg) : 0;

  return {
    hier_usd, hier_kg, mat_usd, moFab_usd, moFab_h, moMon_usd, moMon_h,
    hesp_usd, tFab_usd, tMon_usd, trat_usd, trasl_usd, panto_usd,
    total_unit, total_usd, total_kg, usd_kg, kg_con_desp, kg_desp_pond, desperdicio_usd,
    pct_desperdicio: kg_con_desp>0 ? kg_desp_pond/kg_con_desp*100 : 0,
    pct_desperdicio_total: total_kg>0 ? kg_desp_pond/total_kg*100 : 0,
    kg_hora_fab: (hier_kg > 0 && moFab_h > 0) ? hier_kg / moFab_h : 0,
    kg_hora_mon: (hier_kg > 0 && moMon_h > 0) ? hier_kg / moMon_h : 0,
    moFab_horasPorTipo, moMon_horasPorTipo, moFab_horasPorCategoria, moMon_horasPorCategoria,
    hesp_h, trat_lt, arenado_m2, galvanizado_kg,
  };
}

export function calcPresupuesto(p) {
  const rubros = { hier:0, mat:0, moFab:0, moMon:0, hesp:0, tFab:0, tMon:0, trat:0, trasl:0, panto:0 };
  let total_usd = 0, total_kg = 0, kg_con_desp = 0, kg_desp_pond = 0, desperdicio_usd = 0;
  let moFab_h = 0, moMon_h = 0, hesp_h = 0, trat_lt = 0, arenado_m2 = 0, galvanizado_kg = 0;
  const horasPorTipoFab = { Común:0, Nocturna:0, Extra:0, Lluvia:0 };
  const horasPorTipoMon = { Común:0, Nocturna:0, Extra:0, Lluvia:0 };
  const horasPorCategoriaFab = {};
  const horasPorCategoriaMon = {};
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
    desperdicio_usd += c.desperdicio_usd * q;
    moFab_h += c.moFab_h * q; moMon_h += c.moMon_h * q; hesp_h += c.hesp_h * q;
    trat_lt += c.trat_lt * q; arenado_m2 += c.arenado_m2 * q; galvanizado_kg += c.galvanizado_kg * q;
    for (const k of Object.keys(horasPorTipoFab)) horasPorTipoFab[k] += (c.moFab_horasPorTipo[k]||0) * q;
    for (const k of Object.keys(horasPorTipoMon)) horasPorTipoMon[k] += (c.moMon_horasPorTipo[k]||0) * q;
    for (const k of Object.keys(c.moFab_horasPorCategoria)) horasPorCategoriaFab[k] = (horasPorCategoriaFab[k]||0) + c.moFab_horasPorCategoria[k]*q;
    for (const k of Object.keys(c.moMon_horasPorCategoria)) horasPorCategoriaMon[k] = (horasPorCategoriaMon[k]||0) + c.moMon_horasPorCategoria[k]*q;
  }
  // Negociación: monto que se SUMA al subtotal (margen de negociación, no descuento).
  const neg_usd  = p.neg_modo === "usd" ? (+p.negociacion_usd || 0) : total_usd * (+p.negociacion_pct || 0) / 100;
  const int_usd  = (total_usd + neg_usd) * (+p.interes_pct || 0) / 100;
  const gran_total = total_usd + neg_usd + int_usd;
  return {
    rubros, total_usd, total_kg, neg_usd, int_usd, gran_total, usd_kg: total_kg > 0 ? gran_total / total_kg : 0,
    pct_desperdicio: kg_con_desp>0 ? kg_desp_pond/kg_con_desp*100 : 0,
    detalle: {
      moFab_h, moMon_h, hesp_h, trat_lt, arenado_m2, galvanizado_kg, horasPorTipoFab, horasPorTipoMon,
      horasPorCategoriaFab, horasPorCategoriaMon,
      kg_hora_fab: moFab_h > 0 ? total_kg / moFab_h : 0,
      kg_hora_mon: moMon_h > 0 ? total_kg / moMon_h : 0,
      desperdicio_kg: kg_desp_pond, desperdicio_usd,
      pct_desperdicio_hierros: kg_con_desp>0 ? kg_desp_pond/kg_con_desp*100 : 0,
      pct_desperdicio_total: total_kg>0 ? kg_desp_pond/total_kg*100 : 0,
    },
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
    empresaDatos: JSON.parse(localStorage.getItem("smeas_empresa_datos") || "{}"),
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
  const [showClienteRapido, setShowClienteRapido] = useState(false);
  const [showObraRapida, setShowObraRapida] = useState(false);
  const [showEmpresaRapida, setShowEmpresaRapida] = useState(false);
  const listaClientes = useListaClientes();
  const listaObras = useListaObras();
  const listaEmpresas = useListaEmpresas();
  // Obligatorio resolver contacto (label "Cliente"), obra y empresa antes
  // de crear el presupuesto (2026-08-29) — mismo criterio que
  // Computo/Anidado. El campo local que guarda la razón social sigue
  // llamándose `cliente` (no se renombró la variable, solo el label de la
  // UI) — Empresa pasa a ser entidad real también, "igual que cliente y obra".
  const contactoTexto = (form.contacto || "").trim();
  const contactoSinResolver = contactoTexto && !listaClientes.some(n => n.toLowerCase() === contactoTexto.toLowerCase());
  const obraTexto = (form.obra || "").trim();
  const obraSinResolver = obraTexto && !listaObras.some(o => (o.nombre || "").trim().toLowerCase() === obraTexto.toLowerCase());
  const empresaTexto = (form.cliente || "").trim();
  const empresaSinResolver = empresaTexto && !listaEmpresas.some(e => (e.nombre || "").trim().toLowerCase() === empresaTexto.toLowerCase());
  const crear = () => {
    if (!form.nombre.trim()) return;
    if (contactoSinResolver) { alert(`El cliente "${contactoTexto}" no existe todavía — creálo con "+ Crear cliente nuevo" antes de guardar.`); return; }
    if (obraSinResolver) { alert(`La obra "${obraTexto}" no existe todavía — creála con "+ Crear obra nueva" antes de guardar.`); return; }
    if (empresaSinResolver) { alert(`La empresa "${empresaTexto}" no existe todavía — creála con "+ Crear empresa nueva" antes de guardar.`); return; }
    onSave(form);
  };
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
          <div>
            <label style={LBL}>Empresa</label>
            <AutocompleteEmpresa style={INP} value={form.cliente} placeholder="Razón social" onChange={v=>set("cliente",v)}/>
            {empresaSinResolver && (
              <div style={{ fontSize:13, color:C.warn, marginTop:4, display:"flex", alignItems:"center", gap:8 }}>
                ⚠️ No existe todavía
                <button type="button" onClick={()=>setShowEmpresaRapida(true)} style={{ background:"none", border:`1px solid ${C.warn}55`, color:C.warn, borderRadius:5, padding:"1px 8px", cursor:"pointer", fontSize:13, fontWeight:700 }}>+ Crear empresa nueva</button>
              </div>
            )}
          </div>
          <div>
            <label style={LBL}>Cliente</label>
            <AutocompleteCliente style={INP} value={form.contacto} placeholder="Nombre" onChange={v=>set("contacto",v)}/>
            {contactoSinResolver && (
              <div style={{ fontSize:13, color:C.warn, marginTop:4, display:"flex", alignItems:"center", gap:8 }}>
                ⚠️ No existe todavía
                <button type="button" onClick={()=>setShowClienteRapido(true)} style={{ background:"none", border:`1px solid ${C.warn}55`, color:C.warn, borderRadius:5, padding:"1px 8px", cursor:"pointer", fontSize:13, fontWeight:700 }}>+ Crear cliente nuevo</button>
              </div>
            )}
          </div>
          <div>
            <label style={LBL}>Obra / Ubicación</label>
            <AutocompleteObra style={INP} value={form.obra} placeholder="ej: Planta Canelones" onChange={v=>set("obra",v)}/>
            {obraSinResolver && (
              <div style={{ fontSize:13, color:C.warn, marginTop:4, display:"flex", alignItems:"center", gap:8 }}>
                ⚠️ No existe todavía
                <button type="button" onClick={()=>setShowObraRapida(true)} style={{ background:"none", border:`1px solid ${C.warn}55`, color:C.warn, borderRadius:5, padding:"1px 8px", cursor:"pointer", fontSize:13, fontWeight:700 }}>+ Crear obra nueva</button>
              </div>
            )}
          </div>
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
            onClick={crear}>Crear →</button>
        </div>
      </div>
      {showClienteRapido && (
        <ClienteRapidoModal
          nombreInicial={contactoTexto}
          empresaInicial={form.cliente}
          onClose={() => setShowClienteRapido(false)}
          onCreated={c => { set("contacto", c.nombre); if (c.empresa && !form.cliente) set("cliente", c.empresa); }}
        />
      )}
      {showObraRapida && (
        <ObraRapidaModal
          nombreInicial={obraTexto}
          empresaInicial={form.cliente}
          onClose={() => setShowObraRapida(false)}
          onCreated={o => set("obra", o.nombre)}
        />
      )}
      {showEmpresaRapida && (
        <EmpresaRapidaModal
          nombreInicial={empresaTexto}
          onClose={() => setShowEmpresaRapida(false)}
          onCreated={e => set("cliente", e.nombre)}
        />
      )}
    </div>
  );
}

// ─── COMPONENTE BASE: TABLA EDITABLE DE RUBROS ───────────────────
const INP_SM = { ...INP, padding:"4px 7px", fontSize:13 };
const TD_R   = { ...TD, textAlign:"right", fontVariantNumeric:"tabular-nums", fontSize:13 };
const BtnDel = ({ onClick }) => (
  <button onClick={onClick} style={{ background:"none",border:"none",color:C.err,cursor:"pointer",fontSize:15,padding:"2px 6px" }}>🗑</button>
);
// 2026-08-31, a pedido de Gino: un click de más en 🗑 no debe poder borrar
// datos ya cargados por error — una fila todavía vacía se borra directo
// (no hay nada que perder), una fila con algo cargado pide confirmación.
// `vacia` la decide cada tabla según sus propios campos "importantes".
function BtnDelFila({ vacia, onDelete, tipo = "esta fila" }) {
  const [confirmar, setConfirmar] = useState(false);
  return (
    <>
      <BtnDel onClick={()=> vacia ? onDelete() : setConfirmar(true)} />
      {confirmar && (
        <ModalConfirmarBorrado
          titulo={tipo}
          verbo="Eliminar"
          subtitulo="Esta fila ya tiene datos cargados — se van a perder."
          checkboxLabel="Sí, quiero eliminarla"
          onConfirm={()=>{ onDelete(); setConfirmar(false); }}
          onClose={()=>setConfirmar(false)}
        />
      )}
    </>
  );
}
const Subtotal = ({ usd }) => (
  <td style={{ ...TD_R, color:C.ok, fontWeight:600 }}>${n2(usd)}</td>
);
// `extra` (opcional): celdas de más al final de la fila — usado cuando la
// tabla tiene columnas extra después de "Subtotal USD" (ej. la de Ficha).
const TotRow = ({ cols, label, usd, extra }) => (
  <tr style={{ background:C.iron+"55", borderTop:`1px solid ${C.border}` }}>
    <td colSpan={cols} style={{ ...TD, fontSize:13, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:.5 }}>{label}</td>
    <td style={{ ...TD_R, fontWeight:800, color:C.ok, fontSize:15 }}>${n2(usd)}</td>
    {extra}
    <td style={TD}></td>
  </tr>
);
// Selector rápido desde el catálogo del tarifario (Config) — agrega una fila precargada.
// 2026-08-31, a pedido de Gino: era un <select> nativo — con catálogos
// largos (Config puede tener decenas de ítems) había que scrollear a mano
// sin poder filtrar escribiendo. Mismo patrón de portal que Combobox.jsx
// (evita que el desplegable quede recortado dentro de un contenedor con
// scroll propio, como la pestaña que lo contiene).
const QuickPick = ({ catalogo, onPick }) => {
  const [open, setOpen] = useState(false);
  const [busq, setBusq] = useState("");
  const [rect, setRect] = useState(null);
  const ref = useRef(null);
  const panelRef = useRef(null);

  const calcularRect = () => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setRect({ left: r.left, width: Math.max(r.width, 280), top: r.bottom + 4 });
  };

  useEffect(() => {
    if (!open) return;
    const cerrarSiEsAfuera = e => {
      if (ref.current?.contains(e.target)) return;
      if (panelRef.current?.contains(e.target)) return;
      setOpen(false); setBusq("");
    };
    document.addEventListener("mousedown", cerrarSiEsAfuera);
    window.addEventListener("scroll", calcularRect, true);
    window.addEventListener("resize", calcularRect);
    calcularRect();
    return () => {
      document.removeEventListener("mousedown", cerrarSiEsAfuera);
      window.removeEventListener("scroll", calcularRect, true);
      window.removeEventListener("resize", calcularRect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!catalogo || catalogo.length === 0) return null;
  const q = norm(busq.trim());
  const lista = q ? catalogo.filter(c => norm(c.nombre).includes(q)) : catalogo;

  const panel = open && rect && createPortal(
    <div ref={panelRef} style={{ position:"fixed", left:rect.left, top:rect.top, width:rect.width, zIndex:9999,
      background:C.card, border:`1px solid ${C.accent}55`, borderRadius:8, boxShadow:"0 8px 24px #00000077", overflow:"hidden" }}>
      <div style={{ padding:"8px 8px 4px" }}>
        <input autoFocus type="text" placeholder="Escribí para filtrar…" value={busq}
          onChange={e=>setBusq(e.target.value)} style={{ ...INP, width:"100%", padding:"6px 8px", fontSize:12 }} />
      </div>
      <div style={{ maxHeight:280, overflowY:"auto" }}>
        {lista.length===0 && <div style={{ padding:"10px 12px", color:C.muted, fontSize:12 }}>Sin resultados para "{busq}"</div>}
        {lista.map(c => (
          <div key={c.id} onMouseDown={()=>{ onPick(c); setBusq(""); setOpen(false); }}
            style={{ padding:"7px 12px", cursor:"pointer", display:"flex", justifyContent:"space-between", gap:8, fontSize:13 }}
            onMouseEnter={e=>e.currentTarget.style.background=C.iron}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span>{c.nombre}</span>
            <span style={{ color:C.muted }}>${n2(c.usd)}</span>
          </div>
        ))}
      </div>
    </div>,
    document.body
  );

  return (
    <div ref={ref} style={{ position:"relative", width:240, marginBottom:10 }}>
      <div onClick={()=>setOpen(v=>!v)}
        style={{ ...INP_SM, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", border:`1px solid ${open?C.accent:C.border}` }}>
        <span style={{ color:C.muted }}>+ Desde catálogo (Config)...</span>
        <span style={{ fontSize:10, color:C.muted }}>{open?"▲":"▼"}</span>
      </div>
      {panel}
    </div>
  );
};

// ─── FICHA DE MATERIAL (fila de Hierros) ──────────────────────────
// A pedido de Gino (2026-08-30): acceso desde la fila al catálogo real de
// Insumos y Precios (ver/editar precio, o crear el material si no existe
// todavía) + el detalle de corte/máquina y % parcial de superficie a tratar
// que ya tenía Cómputo (FichaDrawer) pero acá no — Proveedor/Fecha/
// Observaciones/Arena/Pintura/Galvanizado ya eran columnas editables
// directas en la fila, así que no hacía falta duplicarlas acá.
const MAQUINAS_OPTS_HIERRO = ["Plasma / Pantógrafo","Láser","Oxicorte","Cizalla","Sierra","Torno","Fresadora","Otro"];
const CATALOGOS_HIERRO = [["smeas_perfiles","Perfil"],["smeas_planchuelas","Planchuela"],["smeas_planchas","Plancha"]];

function FichaHierroModal({ row, onChange, onClose }) {
  const [, setTick] = useState(0); // fuerza re-leer el catálogo después de crear/guardar
  const nombre = (row.nombre || "").trim();
  let catKey = null, catItem = null;
  for (const [key] of CATALOGOS_HIERRO) {
    const found = loadLS(key, []).find(m => (m.nombre || "").trim().toLowerCase() === nombre.toLowerCase());
    if (found) { catKey = key; catItem = found; break; }
  }
  const [tipoCrear, setTipoCrear] = useState("smeas_perfiles");
  const [precioEdit, setPrecioEdit] = useState(catItem?.precio_usd_kg ?? row.usd_kg ?? 0);

  const guardarPrecioCatalogo = () => {
    if (!catKey || !catItem) return;
    saveLS(catKey, loadLS(catKey, []).map(it => it.id === catItem.id ? { ...it, precio_usd_kg: +precioEdit || 0 } : it));
    setTick(t => t + 1);
  };
  const crearEnCatalogo = () => {
    saveLS(tipoCrear, [...loadLS(tipoCrear, []), { id: uid(), nombre, precio_usd_kg: +precioEdit || row.usd_kg || 0 }]);
    setTick(t => t + 1);
  };

  const ficha = row.ficha || {};
  const setFicha = (k, v) => onChange({ ...row, ficha: { ...ficha, [k]: v } });

  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000, background:"#000a", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
      onClick={onClose}>
      <div style={{ background:C.card, border:`1.5px solid ${C.accent}55`, borderRadius:14, padding:24, width:"100%", maxWidth:420, maxHeight:"85vh", overflowY:"auto" }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontWeight:800, color:C.accent, fontSize:15 }}>Ficha — {nombre || "Sin material"}</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, fontSize:18, cursor:"pointer" }}>✕</button>
        </div>

        <div style={{ fontSize:11, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>Catálogo (Insumos y Precios)</div>
        {!nombre ? (
          <div style={{ fontSize:12, color:C.muted, marginBottom:18 }}>Cargá un nombre de material en la fila primero.</div>
        ) : catItem ? (
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:12, color:C.ok, marginBottom:8 }}>✓ Ya existe en el catálogo ({CATALOGOS_HIERRO.find(([k])=>k===catKey)[1]})</div>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              <label style={LBL}>USD/kg</label>
              <input type="number" value={precioEdit} step="0.01" onChange={e=>setPrecioEdit(e.target.value)} style={{...INP,width:90}} />
              <button onClick={guardarPrecioCatalogo} style={{...BTN("primary"),padding:"4px 10px",fontSize:12}}>Guardar precio</button>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:12, color:C.warn, marginBottom:8 }}>⚠ No existe todavía en el catálogo</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, alignItems:"center" }}>
              <select value={tipoCrear} onChange={e=>setTipoCrear(e.target.value)} style={{...INP,width:120}}>
                {CATALOGOS_HIERRO.map(([k,l])=><option key={k} value={k}>{l}</option>)}
              </select>
              <input type="number" value={precioEdit} step="0.01" placeholder="USD/kg" onChange={e=>setPrecioEdit(e.target.value)} style={{...INP,width:90}} />
              <button onClick={crearEnCatalogo} style={{...BTN("primary"),padding:"4px 10px",fontSize:12}}>+ Crear en catálogo</button>
            </div>
          </div>
        )}

        <div style={{ fontSize:11, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:.5, marginBottom:8, borderTop:`1px solid ${C.border}44`, paddingTop:14 }}>% parcial de tratamiento</div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {row.arena && (
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:12, color:C.teal, width:120 }}>% sup. a arenar</span>
              <input type="number" min="1" max="100" value={ficha.pct_arena ?? 100}
                onChange={e=>setFicha("pct_arena", Math.min(100,Math.max(1,parseInt(e.target.value)||100)))} style={{...INP,width:60}} />
              <span style={{ fontSize:11,color:C.muted }}>%</span>
            </div>
          )}
          {row.pintura && (
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:12, color:C.pur, width:120 }}>% sup. a pintar</span>
              <input type="number" min="1" max="100" value={ficha.pct_pintura ?? 100}
                onChange={e=>setFicha("pct_pintura", Math.min(100,Math.max(1,parseInt(e.target.value)||100)))} style={{...INP,width:60}} />
              <span style={{ fontSize:11,color:C.muted }}>%</span>
            </div>
          )}
          {row.galvanizado && (
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:12, color:C.gold, width:120 }}>% kg a galvanizar</span>
              <input type="number" min="1" max="100" value={ficha.pct_galvanizado ?? 100}
                onChange={e=>setFicha("pct_galvanizado", Math.min(100,Math.max(1,parseInt(e.target.value)||100)))} style={{...INP,width:60}} />
              <span style={{ fontSize:11,color:C.muted }}>%</span>
            </div>
          )}
          {!row.arena && !row.pintura && !row.galvanizado && (
            <div style={{ fontSize:12, color:C.muted }}>Marcá Arena/Pintura/Galvanizado en la fila para poder ajustar acá el % parcial de superficie/kg. El maquinado se elige directo en la columna "Maquinado" de la tabla.</div>
          )}
        </div>

        <div style={{ display:"flex", justifyContent:"flex-end", marginTop:20 }}>
          <button onClick={onClose} style={{...BTN("primary")}}>Listo</button>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: HIERROS ────────────────────────────────────────────────
function TabHierros({ item, set, onAnidadoVinculado }) {
  const rows = item.hierros || [];
  const bibMateriales = useBibliotecaHierros();
  const [fichaAbierta, setFichaAbierta] = useState(null);
  const [anidadoExpandido, setAnidadoExpandido] = useState(true);
  const [confirmarReimportar, setConfirmarReimportar] = useState(false);
  const updPatch = (id, patch) => set("hierros", rows.map(r => {
    if (r.id !== id) return r;
    const nr = { ...r, ...patch };
    nr.subtotal_kg  = (+nr.kg_pieza || 0) * (+nr.cantidad || 0);
    nr.subtotal_m2  = (+nr.area_pieza_m2 || 0) * (+nr.cantidad || 0);
    nr.subtotal_usd = nr.subtotal_kg * (+nr.usd_kg || 0);
    return nr;
  }));
  const upd = (id, field, val) => updPatch(id, { [field]: val });
  const elegirMaterial = (id, mat) => updPatch(id, { nombre: mat.nombre, usd_kg: mat.precio_usd_kg || 0 });
  const add = () => set("hierros", [...rows, { id:uid(), nombre:"", proveedor:"", fecha_precio:"", obs:"", cantidad:1, kg_pieza:0, area_pieza_m2:0, usd_kg:0, arena:false, pintura:false, galvanizado:false, subtotal_kg:0, subtotal_m2:0, subtotal_usd:0 }]);
  const del = (id) => set("hierros", rows.filter(r => r.id !== id));

  const tot_kg  = rows.reduce((s,r) => s + (+r.subtotal_kg  || 0), 0);
  const tot_m2  = rows.reduce((s,r) => s + (+r.subtotal_m2  || 0), 0);
  const tot_usd = rows.reduce((s,r) => s + (+r.subtotal_usd || 0), 0);
  // % desperdicio ponderado por kg (solo cuenta filas que vinieron de un anidado)
  const kg_con_desp = rows.reduce((s,r) => s + (r.pct_desperdicio>0 ? (+r.subtotal_kg||0) : 0), 0);
  const kg_desp_pond = rows.reduce((s,r) => s + (r.pct_desperdicio>0 ? (+r.subtotal_kg||0)*(+r.pct_desperdicio||0)/100 : 0), 0);
  const tot_pct_desp = kg_con_desp>0 ? (kg_desp_pond/kg_con_desp*100) : 0;
  // Ficha (2026-08-30, mismo criterio que Cómputo): si la fila tiene un %
  // parcial cargado en su ficha, solo esa parte de la sup./kg se traslada a
  // Trat. Superficie — sin ficha, 100% (mismo comportamiento de siempre).
  const arena_m2   = rows.filter(r => r.arena).reduce((s,r) => s + (+r.subtotal_m2 || 0) * ((r.ficha?.pct_arena ?? 100) / 100), 0);
  const pintura_m2 = rows.filter(r => r.pintura).reduce((s,r) => s + (+r.subtotal_m2 || 0) * ((r.ficha?.pct_pintura ?? 100) / 100), 0);
  const galv_kg    = rows.filter(r => r.galvanizado).reduce((s,r) => s + (+r.subtotal_kg || 0) * ((r.ficha?.pct_galvanizado ?? 100) / 100), 0);

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
          <div onClick={()=>setAnidadoExpandido(v=>!v)}
            style={{ fontWeight:700, color:C.pur, fontSize:13, marginBottom: anidadoExpandido?8:0, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
            <span>{anidadoExpandido?"▾":"▸"}</span>🔗 Anidado vinculado
            {!anidadoExpandido && anidadoSel && <span style={{ color:C.muted, fontWeight:400 }}>— {anidadoSel.nombre}</span>}
          </div>
          {anidadoExpandido && <>
          <select value={anidadoSelId} onChange={e=>{
              set("anidado_id", e.target.value);
              const a = anidados.find(x => x.id === e.target.value);
              if (a && (a.categoria || a.tipo_trabajo)) onAnidadoVinculado?.(a.categoria, a.tipo_trabajo);
            }} style={{...INP, marginBottom: anidadoSel ? 10 : 0}}>
            <option value="">— Ninguno —</option>
            {anidados.map(a => <option key={a.id} value={a.id}>{a.nombre} ({a.fecha})</option>)}
          </select>
          {anidadoSel && (
            <div style={{ display:"flex", gap:16, fontSize:13, color:C.muted, alignItems:"center", flexWrap:"wrap", marginBottom:10 }}>
              <span>Kg 3D (perfiles): <b style={{color:C.info}}>{n2(anidKg3D)}</b></span>
              <span>Kg 2D (planchas): <b style={{color:C.pur}}>{n2(anidKg2D)}</b></span>
              {anidBarras>0 && <span>Barras a comprar: <b style={{color:C.steel}}>{n2(anidBarras)}</b></span>}
              {anidHojas>0 && <span>Hojas a comprar: <b style={{color:C.steel}}>{n2(anidHojas)}</b></span>}
              {anidM2Arenar>0 && <span>m² a arenar: <b style={{color:C.teal}}>{n2(anidM2Arenar)}</b></span>}
              {anidM2Pintar>0 && <span>m² a pintar: <b style={{color:C.pur}}>{n2(anidM2Pintar)}</b></span>}
              {anidKgGalvanizar>0 && <span>kg a galvanizar: <b style={{color:C.gold}}>{n2(anidKgGalvanizar)}</b></span>}
            </div>
          )}
          {anidadoSel && (() => {
            // 2026-08-30: antes recalculaba el precio buscando por NOMBRE en
            // la biblioteca de perfiles/planchas — si el nombre no matcheaba
            // exacto quedaba en $0 sin avisar. `materialesUnificadosAnidado`
            // ya resuelve el mismo precio (con el mismo criterio que usa la
            // propia pantalla de Anidado), así que se usa directo.
            const importarMateriales = () => {
              const filas = materialesUnificadosAnidado(anidadoSel);
              const nuevasFilas = filas.map(m => {
                const usd_kg = m.precio_usd_kg || 0;
                const f = m.ficha || {};
                return {
                  id: uid(), nombre: m.nombre, proveedor: "", fecha_precio: "", obs: "", cantidad: 1,
                  kg_pieza: +m.kg.toFixed(3), area_pieza_m2: +m.sup.toFixed(3), usd_kg,
                  arena: !!f.granallado, pintura: !!f.pintura, galvanizado: !!f.galvanizado,
                  ficha: f.maquina ? { maquina: f.maquina } : undefined,
                  pct_desperdicio: m.pct_desperdicio || 0,
                  subtotal_kg: +m.kg.toFixed(3), subtotal_m2: +m.sup.toFixed(3), subtotal_usd: +(m.kg*usd_kg).toFixed(2),
                  _anidado_id: anidadoSel.id,
                };
              });
              set("hierros", [...rows, ...nuevasFilas]);
            };
            const yaImportado = rows.some(r => r._anidado_id === anidadoSel.id);
            return (
              <div style={{ display:"flex", gap:16, fontSize:13, color:C.muted, alignItems:"center", flexWrap:"wrap" }}>
                <button onClick={()=> yaImportado ? setConfirmarReimportar(true) : importarMateriales()}
                  style={{...BTN("primary"), padding:"4px 12px", fontSize:13}}>
                  ⬇ Importar materiales del anidado
                </button>
                {confirmarReimportar && (
                  <ModalConfirmarBorrado
                    titulo="materiales del anidado"
                    verbo="Reimportar"
                    color={C.warn}
                    subtitulo={`Este anidado ya se importó antes a este ítem — volver a traerlo agrega los materiales DE NUEVO, duplicados, sin sacar los que ya están.\n\nSi te equivocaste al importar, es más fácil borrar las filas de más a mano que reimportar.`}
                    checkboxLabel="Sí, quiero traer los materiales de nuevo (va a duplicar)"
                    labelBoton="⬇ Reimportar de todos modos"
                    onConfirm={()=>{ importarMateriales(); setConfirmarReimportar(false); }}
                    onClose={()=>setConfirmarReimportar(false)}
                  />
                )}
              </div>
            );
          })()}
          </>}
        </div>
      )}
      {arena_m2 > 0 && (
        <div style={{ marginBottom:10, padding:"6px 12px", background:C.teal+"11", border:`1px solid ${C.teal}33`, borderRadius:6, fontSize:13, color:C.teal }}>
          🎨 {n2(arena_m2)} m² marcados para arenado → se trasladan a Trat. Superficie
        </div>
      )}
      {pintura_m2 > 0 && (
        <div style={{ marginBottom:10, padding:"6px 12px", background:C.pur+"11", border:`1px solid ${C.pur}33`, borderRadius:6, fontSize:13, color:C.pur }}>
          🖌 {n2(pintura_m2)} m² marcados para pintura → se trasladan a Trat. Superficie
        </div>
      )}
      {galv_kg > 0 && (
        <div style={{ marginBottom:10, padding:"6px 12px", background:C.gold+"11", border:`1px solid ${C.gold}33`, borderRadius:6, fontSize:13, color:C.gold }}>
          🔩 {n2(galv_kg)} kg marcados para galvanizado → se trasladan a Trat. Superficie
        </div>
      )}
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:1080 }}>
          <thead><tr>
            {["Nombre / Descripción","Proveedor","Fecha precio","Observaciones","Cant.","Kg/pieza","m²/pieza","USD/kg","% Desp.","Arena?","Pint.?","Galv.?","Maquinado","Subtotal kg","Subtotal m²","Subtotal USD","Ficha",""].map(h=>(
              <th key={h} title={TH_TOOLTIPS[h]} style={{ ...TH, fontSize:12 }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} style={{ background: r.arena ? C.teal+"0a" : r.pintura ? C.pur+"0a" : r.galvanizado ? C.gold+"0a" : "transparent" }}>
                <td style={TD}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <AutocompleteMaterial value={r.nombre} opciones={bibMateriales}
                      onChange={v=>upd(r.id,"nombre",v)}
                      onSeleccionar={mat=>elegirMaterial(r.id,mat)}
                      placeholder="HEB 160, Plancha e=10..." style={{...INP_SM,width:190}}/>
                    {r.nombre?.trim() && !r.usd_kg && <span title="Sin USD/kg cargado en esta fila" style={{fontSize:13,color:C.warn,flexShrink:0}}>⚠</span>}
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
                  <button onClick={()=>upd(r.id,"arena",!r.arena)} style={{...BTN(r.arena?"ok":"ghost"),padding:"3px 8px",fontSize:13}}>
                    {r.arena ? "✓ Sí" : "○ No"}
                  </button>
                </td>
                <td style={{...TD,textAlign:"center"}}>
                  <button onClick={()=>upd(r.id,"pintura",!r.pintura)} style={{...BTN(r.pintura?"ok":"ghost"),padding:"3px 8px",fontSize:13}}>
                    {r.pintura ? "✓ Sí" : "○ No"}
                  </button>
                </td>
                <td style={{...TD,textAlign:"center"}}>
                  <button onClick={()=>upd(r.id,"galvanizado",!r.galvanizado)} style={{...BTN(r.galvanizado?"ok":"ghost"),padding:"3px 8px",fontSize:13}}>
                    {r.galvanizado ? "✓ Sí" : "○ No"}
                  </button>
                </td>
                <td style={TD}>
                  <select value={r.ficha?.maquina||""} onChange={e=>upd(r.id,"ficha",{...(r.ficha||{}),maquina:e.target.value})} style={{...INP_SM,width:140}}>
                    <option value="">—</option>
                    {MAQUINAS_OPTS_HIERRO.map(m=><option key={m}>{m}</option>)}
                  </select>
                </td>
                <td style={{...TD_R,color:C.info}}>{n3(r.subtotal_kg||0)} kg</td>
                <td style={{...TD_R,color:C.teal}}>{n2(r.subtotal_m2||0)} m²</td>
                <Subtotal usd={r.subtotal_usd||0}/>
                <td style={{...TD,textAlign:"center"}}>
                  <button onClick={()=>setFichaAbierta(r.id)} title="Ver ficha del material / corte y tratamientos"
                    style={{ background: r.ficha?(C.accent+"22"):"transparent", border:`1px solid ${C.border}`, borderRadius:5, color:C.muted, cursor:"pointer", fontSize:13, padding:"2px 8px" }}>
                    📋
                  </button>
                </td>
                <td style={TD}><BtnDelFila vacia={!r.nombre?.trim() && !r.usd_kg && !r.subtotal_usd} onDelete={()=>del(r.id)} tipo="este material" /></td>
              </tr>
            ))}
          </tbody>
          {rows.length > 0 && (
            <tfoot><tr style={{ background:C.iron+"55", borderTop:`1px solid ${C.border}` }}>
              <td colSpan={8} style={{...TD,fontSize:13,fontWeight:700,color:C.muted}}>TOTALES</td>
              <td style={{...TD_R,fontWeight:700,color:tot_pct_desp>0?C.warn:C.muted}}>{tot_pct_desp>0?`${n2(tot_pct_desp)}%`:"—"}</td>
              <td colSpan={4} style={TD}></td>
              <td style={{...TD_R,fontWeight:700,color:C.info}}>{n3(tot_kg)} kg</td>
              <td style={{...TD_R,fontWeight:700,color:C.teal}}>{n2(tot_m2)} m²</td>
              <td style={{...TD_R,fontWeight:800,color:C.ok,fontSize:15}}>${n2(tot_usd)}</td>
              <td style={TD}></td>
              <td style={TD}></td>
            </tr></tfoot>
          )}
        </table>
      </div>
      <button style={{...BTN("ghost"),marginTop:10}} onClick={add}>+ Agregar hierro</button>
      {fichaAbierta && (() => {
        const row = rows.find(r => r.id === fichaAbierta);
        if (!row) return null;
        return (
          <FichaHierroModal row={row} onClose={()=>setFichaAbierta(null)}
            onChange={nuevaFila => set("hierros", rows.map(r => r.id === nuevaFila.id ? nuevaFila : r))} />
        );
      })()}
    </div>
  );
}

// ─── TAB: MATERIALES GENERALES ────────────────────────────────────
// A pedido de Gino (2026-08-30), mismo criterio que la ficha de Hierros:
// acceso al catálogo real (Config > Insumos y Precios > Materiales
// Generales) para ver/editar el precio o crear el material si no existe.
// 2026-08-31, rehecha a pedido de Gino — la v1 (i) solo mostraba/editaba el
// precio (nada de proveedor/fecha/observaciones, que el catálogo real sí
// tiene, ver CatalogoEditable en BibliotecaMateriales.jsx), y (ii) guardaba
// solo en localStorage con `saveTarifario` — nunca en Supabase con
// `saveDBTarifario`, que es lo que realmente lee "Insumos y Precios"
// (useTarifarioConNube ahí pisa el estado local con lo que baja de la nube
// al montar) — por eso el cambio "no se guardaba": quedaba en este
// dispositivo nomás y el próximo refresh de esa pantalla lo tapaba.
function FichaMatGeneralModal({ row, onClose }) {
  const [tarifario, setTarifarioLocal] = useState(() => loadTarifario());
  const nombre = (row.nombre || "").trim();
  const catItem = tarifario.mat_generales.find(m => (m.nombre||"").trim().toLowerCase() === nombre.toLowerCase()) || null;
  const [f, setF] = useState({
    usd: catItem?.usd ?? row.usd_unit ?? 0,
    unidad: catItem?.unidad || "",
    proveedor: catItem?.proveedor || row.proveedor || "",
    fecha_precio: catItem?.fecha_precio || row.fecha_precio || "",
    obs: catItem?.obs || row.obs || "",
  });
  const setCampo = (k, v) => setF(prev => ({ ...prev, [k]: v }));
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const guardar = async () => {
    setGuardando(true);
    setGuardado(false);
    const datos = { usd: +f.usd || 0, unidad: f.unidad, proveedor: f.proveedor, fecha_precio: f.fecha_precio, obs: f.obs };
    const mat_generales = catItem
      ? tarifario.mat_generales.map(m => m.id === catItem.id ? { ...m, ...datos } : m)
      : [...tarifario.mat_generales, { id: uid(), nombre, ...datos }];
    const nuevoTarifario = { ...tarifario, mat_generales };
    saveTarifario(nuevoTarifario);
    setTarifarioLocal(nuevoTarifario);
    await saveDBTarifario(nuevoTarifario).catch(e => console.warn("[Fase 3] No se pudo sincronizar el tarifario con el backend:", e.message || e));
    setGuardando(false);
    setGuardado(true);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000, background:"#000a", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
      onClick={onClose}>
      <div style={{ background:C.card, border:`1.5px solid ${C.accent}55`, borderRadius:14, padding:24, width:"100%", maxWidth:420, maxHeight:"85vh", overflowY:"auto" }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontWeight:800, color:C.accent, fontSize:15 }}>Ficha — {nombre || "Sin material"}</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, fontSize:18, cursor:"pointer" }}>✕</button>
        </div>
        {!nombre ? (
          <div style={{ fontSize:12, color:C.muted }}>Cargá una descripción en la fila primero.</div>
        ) : (
          <>
            <div style={{ fontSize:12, color: catItem?C.ok:C.warn, marginBottom:14 }}>
              {catItem ? "✓ Ya existe en Insumos y Precios (Materiales Generales)" : "⚠ No existe todavía en Insumos y Precios — se crea al guardar"}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div><label style={LBL}>USD</label>
                <input type="number" step="0.01" value={f.usd} onChange={e=>setCampo("usd",e.target.value)} style={{...INP,width:"100%"}} /></div>
              <div><label style={LBL}>Unidad</label>
                <input value={f.unidad} placeholder="u, kg, m..." onChange={e=>setCampo("unidad",e.target.value)} style={{...INP,width:"100%"}} /></div>
              <div><label style={LBL}>Proveedor</label>
                <input value={f.proveedor} placeholder="Proveedor..." onChange={e=>setCampo("proveedor",e.target.value)} style={{...INP,width:"100%"}} /></div>
              <div><label style={LBL}>Fecha del precio</label>
                <input type="date" value={f.fecha_precio} onChange={e=>setCampo("fecha_precio",e.target.value)} style={{...INP,width:"100%"}} /></div>
              <div style={{ gridColumn:"1 / -1" }}><label style={LBL}>Observaciones</label>
                <input value={f.obs} placeholder="Notas..." onChange={e=>setCampo("obs",e.target.value)} style={{...INP,width:"100%"}} /></div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:14 }}>
              <button onClick={guardar} disabled={guardando} style={{...BTN("primary"),padding:"6px 14px",fontSize:13,opacity:guardando?0.6:1}}>
                {guardando ? "Guardando…" : catItem ? "Guardar cambios" : "+ Crear en catálogo"}
              </button>
              {guardado && <span style={{ color:C.ok, fontSize:12 }}>✓ Guardado</span>}
            </div>
          </>
        )}
        <div style={{ display:"flex", justifyContent:"flex-end", marginTop:18 }}>
          <button onClick={onClose} style={{...BTN("ghost")}}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function TabMatGenerales({ item, set }) {
  const rows = item.mat_generales || [];
  const tarifario = loadTarifario();
  const [fichaAbierta, setFichaAbierta] = useState(null);
  const upd = (id, field, val) => set("mat_generales", rows.map(r => {
    if (r.id !== id) return r;
    const nr = { ...r, [field]: val };
    nr.subtotal_usd = (+nr.cantidad || 0) * (+nr.usd_unit || 0);
    return nr;
  }));
  const add = () => set("mat_generales", [...rows, { id:uid(), nombre:"", proveedor:"", fecha_precio:"", cantidad:1, kg_unit:0, m2_unit:0, usd_unit:0, obs:"", subtotal_usd:0, orden:rows.length }]);
  const addDesdeCatalogo = (it) => set("mat_generales", [...rows, { id:uid(), nombre:it.nombre, proveedor:it.proveedor||"", fecha_precio:it.fecha_precio||"", cantidad:1, kg_unit:0, m2_unit:0, usd_unit:it.usd||0, obs:it.obs||"", subtotal_usd:it.usd||0, orden:rows.length }]);
  const del = (id) => set("mat_generales", rows.filter(r => r.id !== id));
  const tot = rows.reduce((s,r) => s + (+r.subtotal_usd || 0), 0);

  return (
    <div>
      <QuickPick catalogo={tarifario.mat_generales} onPick={addDesdeCatalogo} />
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>
            {["Descripción","Proveedor","Fecha precio","Cantidad","Kg/u","m²/u","USD/u","Observaciones","Subtotal USD","Ficha",""].map(h=>
              <th key={h} style={{...TH,fontSize:12}}>{h}</th>)}
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
                <td style={{...TD,textAlign:"center"}}>
                  <button onClick={()=>setFichaAbierta(r.id)} title="Ver/crear en Insumos y Precios"
                    style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:5, color:C.muted, cursor:"pointer", fontSize:13, padding:"2px 8px" }}>
                    📋
                  </button>
                </td>
                <td style={TD}><BtnDelFila vacia={!r.nombre?.trim() && !r.usd_unit} onDelete={()=>del(r.id)} tipo="este material" /></td>
              </tr>
            ))}
          </tbody>
          {rows.length > 0 && <tfoot><TotRow cols={8} extra={<td style={TD}></td>} label="TOTAL" usd={tot}/></tfoot>}
        </table>
      </div>
      <button style={{...BTN("ghost"),marginTop:10}} onClick={add}>+ Agregar material</button>
      {fichaAbierta && (() => {
        const row = rows.find(r => r.id === fichaAbierta);
        return row ? <FichaMatGeneralModal row={row} onClose={()=>setFichaAbierta(null)} /> : null;
      })()}
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

  const upd = (id, field, val) => set(key, rows.map(r => {
    if (r.id !== id) return r;
    const nr = { ...r, [field]: val };
    nr.subtotal_usd = (+nr.cant_horas || 0) * (+nr.usd_hora || 0) * (1 + (+nr.pct_adicional || 0) / 100);
    return nr;
  }));
  const add = () => {
    const primera = catalogo[0];
    set(key, [...rows, { id:uid(), categoria:primera?.nombre||"", tipo_hora:"Común", pct_adicional:0, tarea:"", detalle:"", cant_horas:0, usd_hora:primera?.usd_hora||0, subtotal_usd:0, orden:rows.length }]);
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

  // Calculador de días: un solo recuadro de operarios por rubro (no por
  // categoría/tipo de hora) — persistido en el ítem para que no se resetee
  // al cerrar y reabrir el editor.
  const operariosKey = key + "_operarios";
  const operariosRaw = item[operariosKey];
  const operarios = operariosRaw === "" || operariosRaw == null ? 1 : Math.max(1, +operariosRaw || 1);
  // 2026-08-31, a pedido de Gino: antes 8h/día era fijo en el código. Ahora
  // el default sale de Insumos y Precios (tarifario.horas_por_dia), pero
  // cada ítem lo puede pisar solo para este rubro de este presupuesto.
  const horasDiaGlobal = tarifario.horas_por_dia || HORAS_POR_DIA;
  const horasDiaKey = key + "_horas_dia";
  const horasDiaRaw = item[horasDiaKey];
  const horasPorDia = horasDiaRaw === "" || horasDiaRaw == null ? horasDiaGlobal : Math.max(1, +horasDiaRaw || horasDiaGlobal);
  const dias = operarios > 0 ? tot_h / (operarios * horasPorDia) : 0;

  return (
    <div>
      {rows.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:16, marginBottom:12, fontSize:13 }}>
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

      {rows.length > 0 && (
        <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:18,
          background:C.iron, border:`1px solid ${C.border}`, borderRadius:8, padding:"12px 16px", marginBottom:14 }}>
          <div>
            <div style={{ fontSize:11, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>Horas totales</div>
            <div style={{ fontSize:18, fontWeight:800, color:C.pur }}>{n2(tot_h)} h</div>
          </div>
          <div>
            <label style={{ fontSize:11, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:.5, display:"block", marginBottom:3 }}>Operarios</label>
            <input type="number" min="1" step="1" value={operariosRaw ?? 1}
              onChange={e=>set(operariosKey, e.target.value)}
              onBlur={e=>set(operariosKey, Math.max(1, parseInt(e.target.value,10) || 1))}
              style={{ ...INP, width:70, textAlign:"center", padding:"6px 8px", fontSize:15, fontWeight:700 }}/>
          </div>
          <div>
            <label title="Sale de Insumos y Precios por defecto — se puede pisar acá solo para este ítem"
              style={{ fontSize:11, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:.5, display:"block", marginBottom:3 }}>Horas x día</label>
            <input type="number" min="1" step="1" value={horasDiaRaw ?? horasDiaGlobal}
              onChange={e=>set(horasDiaKey, e.target.value)}
              onBlur={e=>set(horasDiaKey, Math.max(1, parseInt(e.target.value,10) || horasDiaGlobal))}
              style={{ ...INP, width:70, textAlign:"center", padding:"6px 8px", fontSize:15, fontWeight:700 }}/>
          </div>
          <div>
            <div style={{ fontSize:11, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>Días estimados</div>
            <div style={{ fontSize:18, fontWeight:800, color:C.teal }}>{n2(dias)} d</div>
          </div>
        </div>
      )}

      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
          <thead><tr>
            {["Categoría","Tipo de hora","Tarea","Horas","USD/h","Subtotal USD",""].map(h=>
              <th key={h} style={{...TH,fontSize:12}}>{h}</th>)}
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
                <td style={TD}><BtnDelFila vacia={!r.cant_horas && !r.tarea?.trim() && !r.detalle?.trim()} onDelete={()=>del(r.id)} tipo="esta fila de mano de obra" /></td>
              </tr>
              );
            })}
          </tbody>
          {rows.length > 0 && (
            <tfoot><tr style={{ background:C.iron+"55", borderTop:`1px solid ${C.border}` }}>
              <td colSpan={3} style={{...TD,fontSize:13,fontWeight:700,color:C.muted}}>TOTALES</td>
              <td style={{...TD_R,fontWeight:700,color:C.pur}}>{n2(tot_h)} h</td>
              <td style={TD}></td>
              <td style={{...TD_R,fontWeight:800,color:C.ok,fontSize:15}}>${n2(tot_usd)}</td>
              <td style={TD}></td>
            </tr></tfoot>
          )}
        </table>
      </div>
      <button style={{...BTN("ghost"),marginTop:10}} onClick={add}>+ Agregar fila MO</button>
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
  const add = () => set(key, [...rows, { id:uid(), nombre:"", empresa:"", fecha_precio:"", cantidad:1, unidad:"u", usd_unit:0, subtotal_usd:0, detalle:"", orden:rows.length }]);
  const addDesdeCatalogo = (it) => set(key, [...rows, { id:uid(), nombre:it.nombre, empresa:"", fecha_precio:"", cantidad:1, unidad:it.unidad||"u", usd_unit:it.usd||0, subtotal_usd:it.usd||0, detalle:"", orden:rows.length }]);
  const del = (id) => set(key, rows.filter(r => r.id !== id));
  const tot = rows.reduce((s,r) => s + (+r.subtotal_usd||0), 0);

  return (
    <div>
      <QuickPick catalogo={catalogo} onPick={addDesdeCatalogo} />
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:850 }}>
          <thead><tr>
            {["Descripción","Empresa","Fecha precio","Cantidad","Unidad","USD/u","Detalle","Subtotal USD",""].map(h=>
              <th key={h} style={{...TH,fontSize:12}}>{h}</th>)}
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
                <td style={TD}><BtnDelFila vacia={!r.nombre?.trim() && !r.usd_unit} onDelete={()=>del(r.id)} tipo="esta tercerización" /></td>
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
        <div style={{ fontWeight:700, color:C.teal, fontSize:14, marginBottom:12 }}>🎨 Arenado / Granallado</div>
        {arena_auto > 0 && (
          <div style={{ fontSize:13, color:C.teal, background:C.teal+"11", border:`1px solid ${C.teal}33`, borderRadius:6, padding:"5px 10px", marginBottom:10 }}>
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
              <button style={{...BTN("ghost"),fontSize:12,padding:"3px 8px",marginLeft:6}}
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
            <span style={{ fontSize:13, color:C.muted }}>Subtotal arenado: </span>
            <span style={{ fontSize:15, fontWeight:700, color:C.ok }}>${n2(tot_arenado)}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, paddingBottom:4 }}>
            <button onClick={()=>{
                const activar = !ts.galvanizado;
                // 2026-08-30: antes había que activar Y ADEMÁS apretar "Usar
                // auto" para que aparezcan los kg de los materiales marcados
                // como galvanizado — si no, quedaba en 0 y parecía que no
                // traía nada. Se precarga solo, igual que ya hacía "arena_m2".
                const patch = { galvanizado: activar };
                if (activar && !ts.galvanizado_kg && galv_auto > 0) patch.galvanizado_kg = +galv_auto.toFixed(2);
                set("trat_superficie", { ...ts, ...patch });
              }}
              style={{...BTN(ts.galvanizado?"ok":"ghost"),padding:"4px 12px",fontSize:13}}>
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
                <button style={{...BTN("ghost"),fontSize:12,padding:"3px 8px",marginLeft:6}}
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
              <span style={{ fontSize:13, color:C.muted }}>Subtotal galvanizado: </span>
              <span style={{ fontSize:15, fontWeight:700, color:C.ok }}>${n2(tot_galv)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Otros tratamientos */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:16, marginBottom:16 }}>
        <div style={{ fontWeight:700, color:C.steel, fontSize:14, marginBottom:12 }}>🧪 Otros tratamientos</div>
        <div style={{ fontSize:13, color:C.muted, marginBottom:10 }}>Subtotal = USD/kg × {n2(hier_kg_item)} kg (peso total del ítem)</div>
        <QuickPick catalogo={tarifario.trat_superficie_extra} onPick={addOtroDesdeCatalogo} />
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>
            {["Descripción","USD/kg","Subtotal USD",""].map(h=>
              <th key={h} style={{...TH,fontSize:12}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {otros.map(r=>(
              <tr key={r.id}>
                <td style={TD}><input value={r.nombre} placeholder="Metalizado, fosfatizado..." onChange={e=>updOtro(r.id,"nombre",e.target.value)} style={{...INP_SM,width:220}}/></td>
                <td style={TD}><input type="number" value={r.usd_kg} min="0" step="0.01" onChange={e=>updOtro(r.id,"usd_kg",+e.target.value)} style={{...INP_SM,width:80,textAlign:"right"}}/></td>
                <Subtotal usd={(+r.usd_kg||0)*hier_kg_item}/>
                <td style={TD}><BtnDelFila vacia={!r.nombre?.trim() && !r.usd_kg} onDelete={()=>delOtro(r.id)} tipo="este tratamiento" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button style={{...BTN("ghost"),marginTop:10}} onClick={addOtro}>+ Agregar tratamiento</button>
        {tot_otros > 0 && (
          <div style={{ marginTop:10, textAlign:"right", fontSize:14, color:C.muted }}>
            Otros tratamientos: <strong style={{color:C.ok}}>${n2(tot_otros)}</strong>
          </div>
        )}
      </div>

      {/* Pinturas */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
        <div style={{ fontWeight:700, color:C.pur, fontSize:14, marginBottom:12 }}>🖌 Pinturas</div>
        <div style={{ fontSize:13, color:C.muted, marginBottom:10 }}>Subtotal = Litros × Manos × USD/lt</div>
        <QuickPick catalogo={tarifario.pinturas} onPick={addPinturaDesdeCatalogo} />
        <div style={{ marginBottom:12 }}>
          <label style={LBL}>m² a pintar</label>
          <input type="number" value={ts.pintura_m2||0} min="0" step="0.01"
            onChange={e=>setTs("pintura_m2",+e.target.value)}
            style={{...INP_SM,width:90}} />
          {pintura_auto > 0 && (
            <button style={{...BTN("ghost"),fontSize:12,padding:"3px 8px",marginLeft:6}}
              onClick={()=>setTs("pintura_m2", +pintura_auto.toFixed(2))}>
              Usar auto ({n2(pintura_auto)})
            </button>
          )}
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>
            {["Descripción","USD/lt","Litros","Manos","Subtotal USD",""].map(h=>
              <th key={h} style={{...TH,fontSize:12}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {(ts.pinturas||[]).map(r=>(
              <tr key={r.id}>
                <td style={TD}><input value={r.nombre} placeholder="Pintura epoxi, antióxido..." onChange={e=>updPintura(r.id,"nombre",e.target.value)} style={{...INP_SM,width:200}}/></td>
                <td style={TD}><input type="number" value={r.usd_lt} min="0" step="0.01" onChange={e=>updPintura(r.id,"usd_lt",+e.target.value)} style={{...INP_SM,width:75,textAlign:"right"}}/></td>
                <td style={TD}><input type="number" value={r.cant_lt} min="0" step="0.01" onChange={e=>updPintura(r.id,"cant_lt",+e.target.value)} style={{...INP_SM,width:75,textAlign:"right"}}/></td>
                <td style={TD}><input type="number" value={r.cant_manos} min="1" onChange={e=>updPintura(r.id,"cant_manos",+e.target.value)} style={{...INP_SM,width:60,textAlign:"right"}}/></td>
                <Subtotal usd={r.subtotal_usd||0}/>
                <td style={TD}><BtnDelFila vacia={!r.nombre?.trim() && !r.cant_lt && !r.usd_lt} onDelete={()=>delPintura(r.id)} tipo="esta pintura" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button style={{...BTN("ghost"),marginTop:10}} onClick={addPintura}>+ Agregar pintura</button>
        {tot_pintura > 0 && (
          <div style={{ marginTop:10, textAlign:"right", fontSize:14, color:C.muted }}>
            Pinturas: <strong style={{color:C.ok}}>${n2(tot_pintura)}</strong>
          </div>
        )}
      </div>

      {/* Resumen Trat. Superficie */}
      {(tot > 0 || tot_lt > 0) && (
        <div style={{ marginTop:12, padding:"12px 16px", background:C.teal+"11", border:`1px solid ${C.teal}33`, borderRadius:8 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.teal, marginBottom:8, textTransform:"uppercase", letterSpacing:.5 }}>Resumen Trat. Superficie</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(120px, 1fr))", gap:10, marginBottom:10 }}>
            <div><div style={{ fontSize:12, color:C.muted }}>m² a pintar</div><div style={{ fontSize:15, fontWeight:700, color:C.text }}>{n2(ts.pintura_m2||0)}</div></div>
            <div><div style={{ fontSize:12, color:C.muted }}>Litros totales</div><div style={{ fontSize:15, fontWeight:700, color:C.text }}>{n2(tot_lt)}</div></div>
            <div><div style={{ fontSize:12, color:C.muted }}>Manos totales</div><div style={{ fontSize:15, fontWeight:700, color:C.text }}>{n2(tot_manos)}</div></div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:C.muted, marginBottom:2 }}>
            <span>$ Pintura</span><span>${n2(tot_pintura)}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:C.muted, marginBottom:2 }}>
            <span>$ Granallado</span><span>${n2(tot_arenado)}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:C.muted, marginBottom:2 }}>
            <span>$ Galvanizado</span><span>${n2(tot_galv)}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:C.muted, marginBottom:8 }}>
            <span>$ Otros tratamientos</span><span>${n2(tot_otros)}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", borderTop:`1px solid ${C.teal}33`, paddingTop:8 }}>
            <span style={{ fontSize:14, color:C.steel }}>Total Trat. Superficie</span>
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
  const add = () => set("traslados", [...rows, { id:uid(), nombre:"", proveedor:"", fecha_precio:"", cantidad:1, unidad:"u", usd_unit:0, detalle:"", subtotal_usd:0, orden:rows.length }]);
  const addDesdeCatalogo = (it) => set("traslados", [...rows, { id:uid(), nombre:it.nombre, proveedor:"", fecha_precio:"", cantidad:1, unidad:it.unidad||"u", usd_unit:it.usd||0, detalle:"", subtotal_usd:it.usd||0, orden:rows.length }]);
  const del = (id) => set("traslados", rows.filter(r => r.id !== id));
  const tot = rows.reduce((s,r) => s+(+r.subtotal_usd||0), 0);

  return (
    <div>
      <QuickPick catalogo={tarifario.traslados} onPick={addDesdeCatalogo} />
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>
            {["Descripción","Proveedor","Fecha precio","Cantidad","Unidad","USD/u","Detalle","Subtotal USD",""].map(h=>
              <th key={h} style={{...TH,fontSize:12}}>{h}</th>)}
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
                <td style={TD}><BtnDelFila vacia={!r.nombre?.trim() && !r.usd_unit} onDelete={()=>del(r.id)} tipo="este traslado" /></td>
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
  const add = (tipo, nombre, kg, usd_kg) => set("corte_pantografo", [...rows, { id:uid(), nombre:nombre||"", tipo:tipo||"", usd_kg:usd_kg||0, kg:kg||0, subtotal_usd:(kg||0)*(usd_kg||0), detalle:"", orden:rows.length }]);
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
          <span style={{ fontSize:13, color:C.pur }}>🔗 Desde anidados vinculados:</span>
          {anidKg3D > 0 && (
            <button style={{...BTN("ghost"),fontSize:13,padding:"4px 10px"}} onClick={()=>add("3D","Corte 3D (perfiles)",+anidKg3D.toFixed(2),tarifario.panto_usd_kg_3d)}>
              + Corte 3D ({n2(anidKg3D)} kg)
            </button>
          )}
          {anidKg2D > 0 && (
            <button style={{...BTN("ghost"),fontSize:13,padding:"4px 10px"}} onClick={()=>add("2D","Corte 2D (planchas)",+anidKg2D.toFixed(2),tarifario.panto_usd_kg_2d)}>
              + Corte 2D ({n2(anidKg2D)} kg)
            </button>
          )}
        </div>
      )}
      {tarifario.pantografo_extra?.length > 0 && (
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:13, color:C.muted, marginBottom:6 }}>Otros cortes — kg pre-cargado con el peso del ítem ({n2(hier_kg_item)} kg), editable en la fila:</div>
          <QuickPick catalogo={tarifario.pantografo_extra} onPick={addOtroDesdeCatalogo} />
        </div>
      )}
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>
            {["Descripción","Tipo","kg","USD/kg","Detalle","Subtotal USD",""].map(h=>
              <th key={h} style={{...TH,fontSize:12}}>{h}</th>)}
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
                <td style={TD}><BtnDelFila vacia={!r.nombre?.trim() && !r.kg && !r.usd_kg} onDelete={()=>del(r.id)} tipo="este corte" /></td>
              </tr>
            ))}
          </tbody>
          {rows.length > 0 && (
            <tfoot><tr style={{ background:C.iron+"55", borderTop:`1px solid ${C.border}` }}>
              <td colSpan={2} style={{...TD,fontSize:13,fontWeight:700,color:C.muted}}>TOTALES</td>
              <td style={{...TD_R,fontWeight:700,color:C.info}}>{n2(tot_kg)} kg</td>
              <td style={TD}></td><td style={TD}></td>
              <td style={{...TD_R,fontWeight:800,color:C.ok,fontSize:15}}>${n2(tot_usd)}</td>
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
function EditorRubros({ item, onChange, onClose, onClonar, onAnidadoVinculado, pres }) {
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
  // 2026-08-31: presupuesto ya no en "borrador" = congelado (ver
  // DetallePresupuesto). Se recalcula acá con el mismo criterio en vez de
  // recibirlo como prop porque `pres` ya llega completo de todos modos.
  const bloqueadoPres = !!(pres?.estado && pres.estado !== "borrador");
  const set = (k, v) => { if (bloqueadoPres) return; onChange({ ...item, [k]: v }); };
  const c   = calcItem(item);

  // rubrosActivos ausente (ítems viejos/históricos) = todo activo, sin romper nada.
  const activo = (id) => (item.rubrosActivos ? item.rubrosActivos[id] !== false : true);
  const setTipo = (t) => {
    if (bloqueadoPres || item.tipoBloqueado) return;
    const nuevosActivos = { ...PRESET_TIPO_RUBROS[t] };
    onChange({ ...item, tipo: t, rubrosActivos: nuevosActivos });
    if (tab !== "resumen" && nuevosActivos[tab] === false) setTab("resumen");
  };
  const toggleRubro = (id) => {
    if (bloqueadoPres || item.tipoBloqueado) return;
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
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:C.bg, border:`1.5px solid ${C.accent}44`, borderRadius:0,
        width:"100%", height:"100%", maxWidth:"none", maxHeight:"none", display:"flex", flexDirection:"column",
        boxShadow:"0 24px 60px #0008" }}>

        {/* Header */}
        <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.border}`,
          display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:C.accent, fontWeight:800, fontSize:15,
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.titulo}</div>
            <div style={{ color:C.muted, fontSize:13 }}>Cant. ×{item.cantidad} · Editor de rubros</div>
          </div>
          <div style={{ display:"flex", gap:10, flexShrink:0 }}>
            <span style={{...BDG(C.info, true),fontSize:15,padding:"4px 12px"}}>{n3(c.total_kg)} kg</span>
            <span style={{...BDG(C.ok,   true),fontSize:15,padding:"4px 12px",fontWeight:800}}>${n2(c.total_usd)}</span>
            {c.usd_kg > 0 && <span style={{...BDG(C.gold, true),fontSize:15,padding:"4px 12px"}}>{n2(c.usd_kg)} USD/kg</span>}
          </div>
          {/* 2026-08-30: cada cambio ya se guarda solo (mismo autosave de
              siempre — onChange actualiza el presupuesto en vivo), pero
              faltaba un cierre explícito que lo confirme, y un clonar a
              nivel ítem (ya existía a nivel presupuesto completo). */}
          {onClonar && (
            <button onClick={onClonar} title="Clonar este ítem dentro del mismo presupuesto"
              style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:6,
              color:C.muted, cursor:"pointer", fontSize:13, padding:"5px 10px", flexShrink:0 }}>⧉ Clonar ítem</button>
          )}
          <button onClick={onClose} title="Los cambios ya están guardados — esto solo cierra la pantalla"
            style={{ ...BTN("primary"), padding:"5px 12px", fontSize:13, flexShrink:0 }}>💾 Guardar y cerrar</button>
          <button onClick={onClose} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:6,
            color:C.muted, cursor:"pointer", fontSize:18, padding:"2px 10px", flexShrink:0 }}>✕</button>
        </div>

        {/* Tipo de trabajo + rubros activos */}
        <div style={{ padding:"10px 18px", borderBottom:`1px solid ${C.border}`,
          display:"flex", flexWrap:"wrap", alignItems:"center", gap:14, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, opacity: (item.tipoBloqueado||bloqueadoPres)?0.5:1 }}>
            <span style={{ fontSize:13, color:C.muted, fontWeight:700 }}>TIPO:</span>
            {[["fabricacion","🔨 Fabricación"],["montaje","🏗️ Montaje"],["fab_mont","🔨🏗️ Fab + Mont"]].map(([val,lbl]) => (
              <button key={val} disabled={item.tipoBloqueado||bloqueadoPres} onClick={() => setTipo(val)} style={{
                ...BTN((item.tipo||"fab_mont")===val ? "primary" : "ghost"), padding:"4px 10px", fontSize:13,
                cursor: (item.tipoBloqueado||bloqueadoPres) ? "not-allowed" : "pointer",
              }}>{lbl}</button>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", opacity: (item.tipoBloqueado||bloqueadoPres)?0.5:1 }}>
            <span style={{ fontSize:13, color:C.muted, fontWeight:700 }}>RUBROS:</span>
            {TABS.filter(t => t.id !== "resumen").map(t => {
              const on = activo(t.id);
              const cnt = counts[t.id];
              return (
                <button key={t.id} disabled={item.tipoBloqueado||bloqueadoPres} onClick={() => toggleRubro(t.id)}
                  title={(on ? `Ocultar ${t.label}` : `Mostrar ${t.label}`) + (cnt > 0 ? ` — tiene ${cnt} fila(s) cargada(s), ocultar no las borra` : "")}
                  style={{
                    background: on ? C.accent+"18" : "transparent",
                    border: `1px solid ${on ? C.accent+"55" : C.border}`,
                    color: on ? C.text : C.muted, opacity: on ? 1 : 0.55,
                    borderRadius:5, padding:"3px 8px", fontSize:12, cursor: (item.tipoBloqueado||bloqueadoPres) ? "not-allowed" : "pointer",
                    display:"flex", alignItems:"center", gap:3,
                  }}>
                  <span>{on ? "☑" : "☐"}</span><span>{t.icon}</span><span>{t.label}</span>
                  {cnt > 0 && <span style={{ background: on ? C.accent : C.muted, color:"#fff", borderRadius:8, padding:"0 4px", fontSize:11, fontWeight:700 }}>{cnt}</span>}
                </button>
              );
            })}
          </div>
          {/* 2026-08-30, a pedido de Gino: un click de más en TIPO pisa
              `rubrosActivos` entero (aunque no borra los datos de las
              pestañas que oculta) — esto bloquea ambos controles para
              evitar tocarlos por error una vez que ya están bien armados. */}
          <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", marginLeft:"auto", fontSize:12, color:C.muted }}
            title="Bloquea Tipo y Rubros para no tocarlos por error">
            <input type="checkbox" checked={!!item.tipoBloqueado} onChange={e=>set("tipoBloqueado", e.target.checked)}
              style={{ width:15, height:15, cursor:"pointer" }} />
            {item.tipoBloqueado ? "🔒 Bloqueado" : "🔓 Bloquear"}
          </label>
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
                padding:"6px 10px", cursor:"pointer", fontSize:13, fontWeight: active ? 700 : 400,
                display:"flex", alignItems:"center", gap:4, whiteSpace:"nowrap", borderRadius:"4px 4px 0 0",
              }}>
                <span>{t.icon}</span>
                <span>{t.label}</span>
                {cnt > 0 && <span style={{ background:C.accent, color:"#fff", borderRadius:9, padding:"0 5px", fontSize:11, fontWeight:700 }}>{cnt}</span>}
              </button>
            );
          })}
        </div>

        {/* Contenido de la pestaña — fieldset nativo: bloquea TODOS los
            inputs/selects/botones de las 7 pestañas de rubros de una sola
            vez si el presupuesto ya no está en "borrador" (2026-08-31). */}
        <fieldset disabled={bloqueadoPres} style={{ flex:1, overflowY:"auto", overflowX:"hidden", padding:16, border:"none", margin:0, minWidth:0, minHeight:0, opacity: bloqueadoPres?0.7:1 }}>
          {tab === "resumen" && (() => {
            const q = +item.cantidad || 1;
            const rubros = { hier:c.hier_usd*q, mat:c.mat_usd*q, moFab:c.moFab_usd*q, moMon:c.moMon_usd*q, hesp:c.hesp_usd*q, tFab:c.tFab_usd*q, tMon:c.tMon_usd*q, trat:c.trat_usd*q, trasl:c.trasl_usd*q, panto:c.panto_usd*q };
            return (
              <div style={{ maxWidth:480 }}>
                <ResumenConDetalle rubros={rubros} total_usd={c.total_usd} total_kg={c.total_kg} pres={pres} />
                {c.pct_desperdicio > 0 && (
                  <div title="% de desperdicio ponderado por kg: kg perdidos en el corte ÷ kg totales comprados" style={{ marginBottom:8, padding:"6px 10px", background:C.warn+"11", border:`1px solid ${C.warn}33`, borderRadius:6, fontSize:13, color:C.warn, fontWeight:700 }}>
                    ⚠ {n2(c.pct_desperdicio)}% desperdicio (materiales del anidado vinculado)
                  </div>
                )}
                {c.total_usd === 0 && <div style={{ color:C.muted, fontSize:13 }}>Sin datos todavía — cargá materiales o mano de obra en las otras pestañas.</div>}
              </div>
            );
          })()}
          {tab === "hierros"          && <TabHierros      item={item} set={set} onAnidadoVinculado={onAnidadoVinculado} />}
          {tab === "mat_generales"    && <TabMatGenerales item={item} set={set} />}
          {tab === "mo_fabricacion"   && <TabMO           item={item} set={set} tipo="fabricacion" />}
          {tab === "mo_montajes"      && <TabMO           item={item} set={set} tipo="montaje" />}
          {tab === "terc_fabricacion" && <TabTerc         item={item} set={set} tipo="fabricacion" />}
          {tab === "terc_montajes"    && <TabTerc         item={item} set={set} tipo="montaje" />}
          {tab === "trat_superficie"  && <TabTrat         item={item} set={set} />}
          {tab === "traslados"        && <TabTraslados    item={item} set={set} />}
          {tab === "corte_pantografo" && <TabPanto        item={item} set={set} />}
        </fieldset>

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
function FilaItem({ item, onChange, onDelete, onClonar, onAnidadoVinculado, pres, bloqueado }) {
  const [editando, setEditando] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const c = calcItem(item);
  const set = (k, v) => { if (bloqueado) return; onChange({ ...item, [k]: v }); };

  return (
    <>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10,
        padding:"12px 16px", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>

          {editando && !bloqueado ? (
            <input autoFocus value={item.titulo}
              style={{ ...INP, flex:1, minWidth:160, fontSize:15, fontWeight:700 }}
              onChange={e => set("titulo", e.target.value)}
              onBlur={() => setEditando(false)}
              onKeyDown={e => e.key === "Enter" && setEditando(false)} />
          ) : (
            <div onClick={() => !bloqueado && setEditando(true)}
              style={{ flex:1, minWidth:160, cursor: bloqueado?"default":"text", fontWeight:700, fontSize:15, color:C.text }}>
              {item.titulo}
            </div>
          )}

          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ fontSize:13, color:C.muted }}>×</span>
            <input type="number" value={item.cantidad} min="1" disabled={bloqueado}
              onChange={e => set("cantidad", +e.target.value)}
              style={{ ...INP, width:55, textAlign:"center", padding:"4px 6px", fontSize:14 }} />
          </div>

          <input value={item.n_plano} placeholder="N° plano" disabled={bloqueado}
            onChange={e => set("n_plano", e.target.value)}
            style={{ ...INP, width:100, padding:"4px 7px", fontSize:13, color:C.muted }} />

          <button disabled={bloqueado} onClick={() => set("no_agrega_kg", !item.no_agrega_kg)}
            style={{ ...BTN(item.no_agrega_kg ? "danger" : "ghost"), padding:"3px 8px", fontSize:12 }}>
            {item.no_agrega_kg ? "⚠ No KG" : "KG ✓"}
          </button>

          {item.tipo === "fabricacion" && <span style={BDG(C.pur, true)}>🔨 Fab</span>}
          {item.tipo === "montaje" && <span style={BDG(C.teal, true)}>🏗️ Mont</span>}

          {c.total_kg > 0  && <span style={{...BDG(C.info, true),fontSize:15,padding:"4px 12px"}}>{n3(c.total_kg)} kg</span>}
          {c.total_usd > 0 && <span style={{...BDG(C.ok,   true),fontSize:15,padding:"4px 12px",fontWeight:800}}>${n2(c.total_usd)}</span>}
          {c.usd_kg > 0    && <span style={{...BDG(C.gold, true),fontSize:15,padding:"4px 12px"}}>{n2(c.usd_kg)} $/kg</span>}

          <button style={{ ...BTN("ghost"), padding:"4px 10px", fontSize:13 }}
            onClick={() => setEditorOpen(true)}>🔧 {bloqueado ? "Ver rubros" : "Rubros"}</button>
          {!bloqueado && (
            <button style={{ background:"none", border:"none", color:C.err, cursor:"pointer", fontSize:15 }}
              onClick={onDelete}>🗑</button>
          )}
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
        <EditorRubros item={item} onChange={onChange} onClose={() => setEditorOpen(false)} onClonar={onClonar} onAnidadoVinculado={onAnidadoVinculado} pres={pres} />
      )}
    </>
  );
}

// ─── BARRA DE RUBRO ───────────────────────────────────────────────
// kg (opcional): si se pasa, además de $ y % muestra cuántos USD/kg del
// total representa este rubro (usd del rubro / kg total del ítem o presupuesto).
// Fila de grid (4 columnas: Rubro | Monto | % | U$S/kg) — debe vivir dentro
// del mismo contenedor grid que el encabezado en ResumenRubros para que las
// columnas queden alineadas entre filas.
function BarraRubro({ label, usd, total, kg, color }) {
  const pct = total > 0 ? Math.round(usd / total * 1000) / 10 : 0;
  const usd_kg = kg > 0 ? usd / kg : 0;
  if (usd === 0) return null;
  return (
    <>
      <span style={{ color:C.muted, alignSelf:"end" }}>{label}</span>
      <span style={{ color, fontWeight:700, textAlign:"right", alignSelf:"end" }}>${n2(usd)}</span>
      <span style={{ color:C.muted, textAlign:"right", alignSelf:"end" }}>{pct}%</span>
      <span style={{ color:C.gold, textAlign:"right", alignSelf:"end" }}>{usd_kg > 0 ? n2(usd_kg) : "—"}</span>
      <div style={{ gridColumn:"1 / -1", background:C.iron, borderRadius:4, height:6 }}>
        <div style={{ width:`${pct}%`, height:6, background:color, borderRadius:4 }} />
      </div>
    </>
  );
}

// Fila de horas por tipo (Común/Nocturna/Extra/Lluvia) dentro del bloque de detalle agregado.
function DetalleHoras({ label, total, porTipo, porCategoria }) {
  const conTipo = Object.entries(porTipo || {}).filter(([,h]) => h > 0);
  const conCategoria = Object.entries(porCategoria || {}).filter(([,h]) => h > 0);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ color:C.muted }}>{label}</span>
        <span style={{ fontWeight:700 }}>{n2(total)} h</span>
      </div>
      {conCategoria.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, paddingLeft:14, marginBottom:conTipo.length>0?4:0 }}>
          {conCategoria.map(([cat,h]) => (
            <span key={cat} style={{ ...BDG(C.steel, true), fontSize:12 }}>{cat}: {n2(h)}h</span>
          ))}
        </div>
      )}
      {conTipo.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, paddingLeft:14 }}>
          {conTipo.map(([tipo,h]) => (
            <span key={tipo} style={{ ...BDG(tipo === "Común" ? C.ok : C.warn, true), fontSize:12 }}>{tipo}: {n2(h)}h</span>
          ))}
        </div>
      )}
    </div>
  );
}

// Bloque de detalle agregado (horas por categoría/tipo, productividad
// kg/hora, litros de pintura, arenado, galvanizado, desperdicio) — usado
// dentro de ModalResumenCompleto. null si no hay nada para mostrar.
function DetalleAgregado({ detalle }) {
  const hayDetalle = !!detalle && (
    detalle.moFab_h > 0 || detalle.moMon_h > 0 || detalle.hesp_h > 0 ||
    detalle.trat_lt > 0 || detalle.arenado_m2 > 0 || detalle.galvanizado_kg > 0 ||
    detalle.desperdicio_kg > 0
  );
  if (!hayDetalle) return null;
  return (
    <div style={{ background:C.iron, borderRadius:8, padding:"10px 12px", fontSize:13, display:"flex", flexDirection:"column", gap:9 }}>
      {detalle.moFab_h > 0 && <DetalleHoras label="🔨 Horas Fabricación" total={detalle.moFab_h} porTipo={detalle.horasPorTipoFab} porCategoria={detalle.horasPorCategoriaFab} />}
      {detalle.moMon_h > 0 && <DetalleHoras label="🏗️ Horas Montaje" total={detalle.moMon_h} porTipo={detalle.horasPorTipoMon} porCategoria={detalle.horasPorCategoriaMon} />}
      {detalle.kg_hora_fab > 0 && (
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ color:C.muted }}>📈 Productividad Fab.</span><span style={{ fontWeight:700 }}>{n2(detalle.kg_hora_fab)} kg/h</span>
        </div>
      )}
      {detalle.kg_hora_mon > 0 && (
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ color:C.muted }}>📈 Productividad Mon.</span><span style={{ fontWeight:700 }}>{n2(detalle.kg_hora_mon)} kg/h</span>
        </div>
      )}
      {detalle.hesp_h > 0 && (
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ color:C.muted }}>⏰ Horas especiales</span><span style={{ fontWeight:700 }}>{n2(detalle.hesp_h)} h</span>
        </div>
      )}
      {detalle.trat_lt > 0 && (
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ color:C.muted }}>🎨 Litros de pintura</span><span style={{ fontWeight:700 }}>{n2(detalle.trat_lt)} lt</span>
        </div>
      )}
      {detalle.arenado_m2 > 0 && (
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ color:C.muted }}>🎨 Superficie arenada</span><span style={{ fontWeight:700 }}>{n2(detalle.arenado_m2)} m²</span>
        </div>
      )}
      {detalle.galvanizado_kg > 0 && (
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ color:C.muted }}>🔩 Galvanizado</span><span style={{ fontWeight:700 }}>{n2(detalle.galvanizado_kg)} kg</span>
        </div>
      )}
      {detalle.desperdicio_kg > 0 && (
        <div style={{ borderTop:`1px solid ${C.border}`, marginTop:2, paddingTop:9 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
            <span style={{ color:C.muted }}>⚠️ Desperdicio</span>
            <span style={{ fontWeight:700, color:C.warn }}>{n2(detalle.desperdicio_kg)} kg — ${n2(detalle.desperdicio_usd)}</span>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, paddingLeft:14 }}>
            <span style={{ ...BDG(C.warn, true), fontSize:12 }}>{n2(detalle.pct_desperdicio_hierros)}% de los hierros</span>
            <span style={{ ...BDG(C.muted, true), fontSize:12 }}>{n2(detalle.pct_desperdicio_total)}% del total</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── RESUMEN DE RUBROS (reutilizado a nivel ítem y a nivel presupuesto) ──
// Grilla pura, sin botón ni modal — usada standalone dentro de
// ModalResumenCompleto (totales y desglose por ítem) y como base de
// ResumenConDetalle.
// extra (opcional): filas adicionales fuera de los 9 rubros fijos — hoy
// usado solo para Negociación/Interés Financiero a nivel presupuesto (los
// ítems no tienen esos campos, así que ahí queda undefined).
function ResumenRubros({ rubros, total_usd, total_kg, extra }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr auto auto auto", columnGap:12, rowGap:6, fontSize:14 }}>
      <span style={{ fontSize:11, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>Rubro</span>
      <span style={{ fontSize:11, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:.5, textAlign:"right" }}>Monto</span>
      <span style={{ fontSize:11, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:.5, textAlign:"right" }}>%</span>
      <span title="Precio en dólares por kilogramo de material de este rubro"
        style={{ fontSize:11, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:.5, textAlign:"right" }}>U$S/kg</span>

      {/* 2026-08-30: antes "Hierros" y "Mat. General" se sumaban en una sola
          línea — con Hierros en $0 (ítem sin USD/kg cargado todavía) parecía
          que Mat. General "no se veía" en el resumen aunque sí se estaba
          sumando. Separadas para que cada pestaña se refleje sola. */}
      <BarraRubro label="⚙️ Hierros"        usd={rubros.hier} total={total_usd} kg={total_kg} color={C.info} />
      <BarraRubro label="📦 Mat. General"   usd={rubros.mat}  total={total_usd} kg={total_kg} color={C.info} />
      <BarraRubro label="🔨 MO Fabricación"        usd={rubros.moFab}  total={total_usd} kg={total_kg} color={C.pur} />
      <BarraRubro label="🏗️ MO Montaje"            usd={rubros.moMon}  total={total_usd} kg={total_kg} color={C.teal} />
      <BarraRubro label="⏰ H. Especiales"         usd={rubros.hesp}   total={total_usd} kg={total_kg} color={C.warn} />
      <BarraRubro label="🏭 Terc. Fabricación"     usd={rubros.tFab}   total={total_usd} kg={total_kg} color={C.steel} />
      <BarraRubro label="🚛 Terc. Montaje"         usd={rubros.tMon}   total={total_usd} kg={total_kg} color={C.steel} />
      <BarraRubro label="🎨 Tratamiento Sup."      usd={rubros.trat}   total={total_usd} kg={total_kg} color={C.ok} />
      <BarraRubro label="🚚 Traslados"             usd={rubros.trasl}  total={total_usd} kg={total_kg} color={C.muted} />
      <BarraRubro label="✂️ Pantógrafo"            usd={rubros.panto}  total={total_usd} kg={total_kg} color={C.gold} />
      {(extra || []).map(e => (
        <BarraRubro key={e.label} label={e.label} usd={e.usd} total={total_usd} kg={total_kg} color={e.color} />
      ))}
    </div>
  );
}

// Wrapper con el botón "Ver detalle completo" — usado en los dos lugares
// reales (resumen del ítem y resumen del presupuesto). Abre
// ModalResumenCompleto con TODOS los ítems del presupuesto (pres), no solo
// los rubros de acá — a pedido de Gino (2026-08-30): quería una ventana
// aparte con el desglose de todo lo cargado, no solo el agregado de este
// ítem.
function ResumenConDetalle({ rubros, total_usd, total_kg, pres }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  return (
    <div>
      <ResumenRubros rubros={rubros} total_usd={total_usd} total_kg={total_kg} />
      <button onClick={() => setModalAbierto(true)} style={{
        background:"none", border:"none", color:C.accent, cursor:"pointer",
        fontSize:13, fontWeight:700, padding:"6px 0",
      }}>▸ Ver detalle completo</button>
      {modalAbierto && <ModalResumenCompleto pres={pres} onClose={() => setModalAbierto(false)} />}
    </div>
  );
}

// ─── MODAL: RESUMEN AMPLIADO DE TODO EL PRESUPUESTO ──────────────────
// Totales generales + detalle agregado (horas/litros/arenado/galvanizado)
// + desglose de rubros ítem por ítem — todo el presupuesto, no solo el
// ítem que se estaba editando cuando se abrió.
function ModalResumenCompleto({ pres, onClose }) {
  const c = calcPresupuesto(pres);
  const items = pres.items || [];
  // Portal a document.body: este modal se abre desde adentro de otros
  // contenedores posicionados (el panel "Resumen" con position:sticky del
  // sidebar, o adentro del propio modal de EditorRubros) — sin el portal,
  // el position:fixed puede quedar atado a ese ancestro en vez de cubrir
  // la pantalla entera (bug real reportado por Gino, 2026-08-30).
  return createPortal(
    <div style={{ position:"fixed", inset:0, zIndex:1100, background:"#000d",
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:C.bg, border:`1.5px solid ${C.accent}44`,
        width:"100%", height:"100%", display:"flex", flexDirection:"column", boxShadow:"0 24px 60px #0008" }}>

        <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.border}`,
          display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:C.accent, fontWeight:800, fontSize:16,
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Resumen ampliado — {pres.nombre || pres.nro}</div>
            <div style={{ color:C.muted, fontSize:12 }}>{items.length} ítem(s) cargado(s)</div>
          </div>
          <span style={{...BDG(C.ok, true), fontSize:14, padding:"4px 12px", fontWeight:800}}>${n2(c.total_usd)}</span>
          <button onClick={onClose} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:6,
            color:C.muted, cursor:"pointer", fontSize:18, padding:"2px 10px", flexShrink:0 }}>✕</button>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"18px 24px" }}>
          <div style={{ maxWidth:600, margin:"0 auto 28px" }}>
            <div style={{ fontWeight:700, fontSize:13, color:C.steel, textTransform:"uppercase", letterSpacing:.5, marginBottom:10 }}>
              Totales del presupuesto
            </div>
            <ResumenRubros rubros={c.rubros} total_usd={c.total_usd} total_kg={c.total_kg} extra={[
              c.neg_usd !== 0 && { label:"💰 Negociación", usd:c.neg_usd, color:C.gold },
              c.int_usd !== 0 && { label:"🏦 Interés Financiero", usd:c.int_usd, color:C.warn },
            ].filter(Boolean)} />
            <div style={{ marginTop:10 }}><DetalleAgregado detalle={c.detalle} /></div>
          </div>

          <div style={{ maxWidth:600, margin:"0 auto" }}>
            <div style={{ fontWeight:700, fontSize:13, color:C.steel, textTransform:"uppercase", letterSpacing:.5, marginBottom:10 }}>
              Detalle por ítem ({items.length})
            </div>
            {items.length === 0 && <div style={{ color:C.muted, fontSize:13 }}>Este presupuesto todavía no tiene ítems cargados.</div>}
            {items.map(it => {
              const ic = calcItem(it);
              const q  = +it.cantidad || 1;
              const rubrosIt = {
                hier:ic.hier_usd*q, mat:ic.mat_usd*q, moFab:ic.moFab_usd*q, moMon:ic.moMon_usd*q,
                hesp:ic.hesp_usd*q, tFab:ic.tFab_usd*q, tMon:ic.tMon_usd*q, trat:ic.trat_usd*q,
                trasl:ic.trasl_usd*q, panto:ic.panto_usd*q,
              };
              return (
                <div key={it.id} style={{ marginBottom:16, padding:14, background:C.card, border:`1px solid ${C.border}`, borderRadius:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:10 }}>
                    <span style={{ fontWeight:700 }}>{it.titulo} <span style={{ color:C.muted, fontWeight:400 }}>×{it.cantidad}</span></span>
                    <span style={{ fontWeight:800, color:C.ok }}>${n2(ic.total_usd)}</span>
                  </div>
                  <ResumenRubros rubros={rubrosIt} total_usd={ic.total_usd} total_kg={ic.total_kg} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── VISTA DETALLE ────────────────────────────────────────────────
function DetallePresupuesto({ pres, onChange, onBack, origenNro, tcGlobal, usuario, usuarios, onAgregarComentario, onEliminarComentario }) {
  const set = (k, v) => onChange({ ...pres, [k]: v });
  const c   = calcPresupuesto(pres);
  // 2026-08-31, a pedido de Gino: una vez que sale de "borrador" (enviado,
  // aprobado, rechazado...) el contenido comercial queda congelado — nada
  // se destraba después, si hay que cambiar algo se usa "Clonar" (ya
  // existe). Comentarios y el estado mismo son la única excepción (no
  // pasan por `set`, así que no hace falta filtrarlos acá).
  const bloqueado = !!(pres.estado && pres.estado !== "borrador");
  const updItem = (it) => { if (bloqueado) return; set("items", pres.items.map(x => x.id === it.id ? it : x)); };
  const delItem = (id) => { if (bloqueado) return; set("items", pres.items.filter(x => x.id !== id)); };
  const addItem = ()   => { if (bloqueado) return; set("items", [...(pres.items||[]), iItem()]); };
  // A pedido de Gino (2026-08-30): clonar un ítem dentro del mismo presupuesto.
  const clonarItem = (it) => { if (bloqueado) return; set("items", [...pres.items, { ...it, id: uid(), titulo: `${it.titulo} (copia)` }]); };
  const [confirmarSyncPrecios, setConfirmarSyncPrecios] = useState(null); // {cambios} | null
  // Colapsado por defecto (2026-08-24, pedido de Gino) — deja más lugar en
  // pantalla para los ítems, que es lo que se edita más seguido.
  const [datosAbiertos, setDatosAbiertos] = useState(false);
  const [showClienteRapido, setShowClienteRapido] = useState(false);
  const [showObraRapida, setShowObraRapida] = useState(false);
  const [showEmpresaRapida, setShowEmpresaRapida] = useState(false);
  const listaClientes = useListaClientes();
  const listaObras = useListaObras();
  const listaEmpresas = useListaEmpresas();
  // Este campo se auto-guarda en cada tecla (no hay botón "Guardar" general
  // acá) — "obligatorio" se aplica en el punto donde de verdad importa:
  // no dejar "Enviar a Steel CRM" con contacto/obra/empresa sin resolver
  // (ver enviarSteelCRM más abajo). El aviso igual se muestra siempre que
  // hay texto sin resolver, para que se note antes de llegar a ese paso.
  const contactoTexto = (pres.contacto || "").trim();
  const contactoSinResolver = contactoTexto && !listaClientes.some(n => n.toLowerCase() === contactoTexto.toLowerCase());
  const obraTexto = (pres.obra || "").trim();
  const obraSinResolver = obraTexto && !listaObras.some(o => (o.nombre || "").trim().toLowerCase() === obraTexto.toLowerCase());
  const empresaTexto = (pres.cliente || "").trim();
  const empresaSinResolver = empresaTexto && !listaEmpresas.some(e => (e.nombre || "").trim().toLowerCase() === empresaTexto.toLowerCase());
  const [vinculoCRM, setVinculoCRM] = useState(null); // {crmId, nro} | null
  const [enviandoCRM, setEnviandoCRM] = useState(false);

  // Chequea si este presupuesto ya tiene un presupuesto real vinculado en
  // Steel CRM (tabla presupuesto_calculo_link) — evita reenviarlo dos veces.
  useEffect(() => {
    let vivo = true;
    if (pres?.id) buscarVinculoCRM(pres.id).then(v => { if (vivo) setVinculoCRM(v); });
    return () => { vivo = false; };
  }, [pres?.id]);

  const cambiarEstado = (k) => {
    if (k === "aprobado" && pres.estado !== "aprobado") {
      const cambios = calcularCambiosPrecios(pres);
      if (cambios.length > 0) setConfirmarSyncPrecios({ cambios });
    }
    set("estado", k);
  };

  // Backfill: presupuestos creados antes de este campo (o los históricos
  // importados) todavía no tienen codigo_calculo — se les asigna recién acá,
  // en el momento en que hace falta enviarlos a Steel CRM.
  const enviarSteelCRM = async () => {
    if (vinculoCRM || enviandoCRM) return;
    if (contactoSinResolver) return alert(`El cliente "${contactoTexto}" no existe todavía — creálo con "+ Crear cliente nuevo" antes de enviar a Steel CRM.`);
    if (obraSinResolver) return alert(`La obra "${obraTexto}" no existe todavía — creála con "+ Crear obra nueva" antes de enviar a Steel CRM.`);
    if (empresaSinResolver) return alert(`La empresa "${empresaTexto}" no existe todavía — creála con "+ Crear empresa nueva" antes de enviar a Steel CRM.`);
    const codigo = pres.codigo_calculo || newCodigoCalculo();
    if (!pres.codigo_calculo) set("codigo_calculo", codigo);
    setEnviandoCRM(true);
    try {
      const v = await enviarPresupuestoASteelCRM({ ...pres, codigo_calculo: codigo }, c, usuario);
      setVinculoCRM(v);
    } catch (e) {
      alert("No se pudo enviar a Steel CRM: " + (e.message || e));
    } finally {
      setEnviandoCRM(false);
    }
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
      {showClienteRapido && (
        <ClienteRapidoModal
          nombreInicial={contactoTexto}
          empresaInicial={pres.cliente}
          onClose={() => setShowClienteRapido(false)}
          onCreated={c => { set("contacto", c.nombre); if (c.empresa && !pres.cliente) set("cliente", c.empresa); }}
        />
      )}
      {showObraRapida && (
        <ObraRapidaModal
          nombreInicial={obraTexto}
          empresaInicial={pres.cliente}
          onClose={() => setShowObraRapida(false)}
          onCreated={o => set("obra", o.nombre)}
        />
      )}
      {showEmpresaRapida && (
        <EmpresaRapidaModal
          nombreInicial={empresaTexto}
          onClose={() => setShowEmpresaRapida(false)}
          onCreated={e => set("cliente", e.nombre)}
        />
      )}
      {/* Topbar */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, flexWrap:"wrap" }}>
        <button style={BTN("ghost")} onClick={onBack}>← Volver</button>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:17, color:C.accent }}>{pres.nombre||"Presupuesto sin nombre"}</div>
          <div style={{ fontSize:13, color:C.muted }}>
            {pres.nro} · {pres.fecha}
            {pres.codigo_calculo && <span title="Código de cálculo — vincula este presupuesto con steelCRM (idsCalc)"> · 🔗 {pres.codigo_calculo}</span>}
            {pres.clonado_de && <span> · 📋 clonado de {origenNro || pres.clonado_de}</span>}
          </div>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
          <button style={BTN("ghost")} onClick={() => generarPDFPresupuesto(pres)} title="Generar PDF del presupuesto">🖨️ PDF</button>
          {vinculoCRM ? (
            <span style={{ ...BDG(C.ok, true), fontSize:13 }} title={`Vinculado a Steel CRM ${vinculoCRM.nro}`}>✅ Vinculado a Steel CRM {vinculoCRM.nro}</span>
          ) : (
            <button style={BTN("ghost")} onClick={enviarSteelCRM} disabled={enviandoCRM}
              title="Crea el presupuesto en Steel CRM y lo vincula con este cálculo — directo, sin archivos de por medio">
              {enviandoCRM ? "Enviando…" : "☁️ Enviar a Steel CRM"}
            </button>
          )}
          {Object.entries(ESTADO_CFG).map(([k,v]) => (
            <button key={k} onClick={() => cambiarEstado(k)}
              style={{ ...BTN("ghost"), padding:"4px 12px", fontSize:13,
                ...(pres.estado===k ? { background:v.color+"22", color:v.color, border:`1px solid ${v.color}44` } : {}) }}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:16, alignItems:"start" }}>

        {/* IZQUIERDA */}
        <div>
          {/* Datos generales */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, marginBottom:16 }}>
            <div onClick={() => setDatosAbiertos(a => !a)}
              style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", userSelect:"none",
                fontWeight:700, color:C.steel, fontSize:13, marginBottom:datosAbiertos?14:0, textTransform:"uppercase", letterSpacing:.5 }}>
              <span>{datosAbiertos ? "▾" : "▸"}</span> Datos generales
              {!datosAbiertos && (pres.cliente || pres.obra) && (
                <span style={{ textTransform:"none", fontWeight:400, color:C.muted, letterSpacing:0 }}>
                  — {pres.cliente || "sin cliente"}{pres.obra ? ` · ${pres.obra}` : ""}
                </span>
              )}
            </div>
            {datosAbiertos && (
            <fieldset disabled={bloqueado} style={{ border:"none", margin:0, padding:0, display:"contents" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={LBL}>Empresa</label>
                <AutocompleteEmpresa style={INP} value={pres.cliente||""} placeholder="Razón social" onChange={v=>set("cliente",v)}/>
                {empresaSinResolver && (
                  <div style={{ fontSize:13, color:C.warn, marginTop:4, display:"flex", alignItems:"center", gap:8 }}>
                    ⚠️ No existe todavía
                    <button type="button" onClick={()=>setShowEmpresaRapida(true)} style={{ background:"none", border:`1px solid ${C.warn}55`, color:C.warn, borderRadius:5, padding:"1px 8px", cursor:"pointer", fontSize:13, fontWeight:700 }}>+ Crear empresa nueva</button>
                  </div>
                )}
              </div>
              <div>
                <label style={LBL}>Cliente</label>
                <AutocompleteCliente style={INP} value={pres.contacto||""} placeholder="Nombre" onChange={v=>set("contacto",v)}/>
                {contactoSinResolver && (
                  <div style={{ fontSize:13, color:C.warn, marginTop:4, display:"flex", alignItems:"center", gap:8 }}>
                    ⚠️ No existe todavía
                    <button type="button" onClick={()=>setShowClienteRapido(true)} style={{ background:"none", border:`1px solid ${C.warn}55`, color:C.warn, borderRadius:5, padding:"1px 8px", cursor:"pointer", fontSize:13, fontWeight:700 }}>+ Crear cliente nuevo</button>
                  </div>
                )}
              </div>
              <div>
                <label style={LBL}>Obra / Ubicación</label>
                <AutocompleteObra style={INP} value={pres.obra||""} placeholder="Planta, dirección..." onChange={v=>set("obra",v)}/>
                {obraSinResolver && (
                  <div style={{ fontSize:13, color:C.warn, marginTop:4, display:"flex", alignItems:"center", gap:8 }}>
                    ⚠️ No existe todavía
                    <button type="button" onClick={()=>setShowObraRapida(true)} style={{ background:"none", border:`1px solid ${C.warn}55`, color:C.warn, borderRadius:5, padding:"1px 8px", cursor:"pointer", fontSize:13, fontWeight:700 }}>+ Crear obra nueva</button>
                  </div>
                )}
              </div>
              <div><label style={LBL}>Tipo de trabajo</label>
                <select style={INP} value={pres.tipo_trabajo||"Fabricación"} onChange={e=>set("tipo_trabajo",e.target.value)}>
                  {TIPOS.map(t=><option key={t}>{t}</option>)}
                </select></div>
              <div><label style={LBL}>Categoría</label>
                <SelectCategoria value={pres.categoria} onChange={v=>set("categoria",v)} />
                {pres.categoria && <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>Familia: {familiaDe(pres.categoria)}</div>}
              </div>
              <div><label style={LBL}>Vendedor</label>
                <select style={INP} value={pres.vendedor||""} onChange={e=>set("vendedor",e.target.value)}>
                  <option value="">— Sin asignar —</option>
                  {(usuarios||[]).map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
                </select></div>
              <div><label style={LBL}>TC (USD/UYU)</label>
                <div style={{ ...INP, display:"flex", alignItems:"center", color:C.muted, background:C.bg }}>
                  {pres.tc != null
                    ? <>{n2(pres.tc)} <span style={{ marginLeft:6, fontSize:12 }}>(valor histórico de este presupuesto)</span></>
                    : <>{n2(tcGlobal)} <span style={{ marginLeft:6, fontSize:12 }}>(TC global — se edita en la barra lateral)</span></>}
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
            </fieldset>
            )}
          </div>

          {bloqueado && (
            <div style={{ background:C.warn+"15", border:`1px solid ${C.warn}44`, borderRadius:8, padding:"8px 14px", marginBottom:16, fontSize:13, color:C.warn, display:"flex", alignItems:"center", gap:8 }}>
              🔒 Presupuesto {ESTADO_CFG[pres.estado]?.label?.toLowerCase() || pres.estado} — el contenido queda congelado. Para cambiar algo, usá "Clonar" y editá la copia.
            </div>
          )}

          <ComentariosPanel comentarios={pres.comentarios} usuario={usuario} onAgregar={onAgregarComentario} onEliminar={onEliminarComentario} />

          {/* Ítems */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ fontWeight:700, color:C.steel, fontSize:13, textTransform:"uppercase", letterSpacing:.5 }}>
                Ítems ({(pres.items||[]).length})
              </div>
              {!bloqueado && <button style={BTN("ok")} onClick={addItem}>+ Agregar ítem</button>}
            </div>
            {(pres.items||[]).length === 0 && (
              <div style={{ textAlign:"center", padding:40, color:C.muted, fontSize:14,
                border:`1px dashed ${C.border}`, borderRadius:10 }}>
                Sin ítems — hacé clic en "Agregar ítem" para empezar
              </div>
            )}
            {(pres.items||[]).map(it => (
              <FilaItem key={it.id} item={it} onChange={updItem} onDelete={() => delItem(it.id)} onClonar={() => clonarItem(it)} bloqueado={bloqueado} pres={pres}
                onAnidadoVinculado={(categoria, tipo) => {
                  // Traspaso automático desde el Anidado — solo si el
                  // presupuesto todavía no tiene su propia clasificación
                  // (nunca pisa lo que el usuario ya haya elegido a mano).
                  if (categoria && !pres.categoria) set("categoria", categoria);
                  if (tipo && !pres.tipo_trabajo) set("tipo_trabajo", tipo);
                }} />
            ))}
          </div>
        </div>

        {/* DERECHA: Resumen */}
        <div style={{ position:"sticky", top:70 }}>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18 }}>
            <div style={{ fontWeight:700, color:C.steel, fontSize:13, marginBottom:14, textTransform:"uppercase", letterSpacing:.5 }}>
              Resumen
            </div>

            <ResumenConDetalle rubros={c.rubros} total_usd={c.total_usd} total_kg={c.total_kg} pres={pres} />
            {c.pct_desperdicio > 0 && (
              <div title="% de desperdicio ponderado por kg de todos los materiales que vinieron de un Anidado: kg perdidos en el corte ÷ kg totales comprados" style={{ marginBottom:8, padding:"6px 10px", background:C.warn+"11", border:`1px solid ${C.warn}33`, borderRadius:6, fontSize:13, color:C.warn, fontWeight:700 }}>
                ⚠ {n2(c.pct_desperdicio)}% desperdicio general (materiales de anidados vinculados)
              </div>
            )}

            <div style={{ borderTop:`1px solid ${C.border}`, marginTop:10, paddingTop:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, marginBottom:8 }}>
                <span style={{ color:C.muted }}>Subtotal</span>
                <span style={{ fontWeight:700 }}>${n2(c.total_usd)}</span>
              </div>

              {/* Negociación */}
              <div style={{ background:C.iron, borderRadius:8, padding:10, marginBottom:8 }}>
                <div style={{ fontSize:13, color:C.muted, marginBottom:6, fontWeight:700 }}>Negociación (aumenta el total)</div>
                <div style={{ display:"flex", gap:6, marginBottom:6 }}>
                  <button style={{ ...BTN(pres.neg_modo==="pct"?"ok":"ghost"), padding:"3px 8px", fontSize:12 }}
                    onClick={() => set("neg_modo","pct")}>%</button>
                  <button style={{ ...BTN(pres.neg_modo==="usd"?"ok":"ghost"), padding:"3px 8px", fontSize:12 }}
                    onClick={() => set("neg_modo","usd")}>USD</button>
                </div>
                {pres.neg_modo === "pct" ? (
                  <input type="number" value={pres.negociacion_pct||0} min="0" max="100" step="0.1"
                    style={{ ...INP, padding:"4px 7px", fontSize:13 }}
                    onChange={e => set("negociacion_pct",+e.target.value)} />
                ) : (
                  <input type="number" value={pres.negociacion_usd||0} min="0" step="10"
                    style={{ ...INP, padding:"4px 7px", fontSize:13 }}
                    onChange={e => set("negociacion_usd",+e.target.value)} />
                )}
                {c.neg_usd > 0 && <div style={{ fontSize:13, color:C.ok, marginTop:4 }}>+ ${n2(c.neg_usd)}</div>}
              </div>

              {/* Interés */}
              <div style={{ background:C.iron, borderRadius:8, padding:10, marginBottom:10 }}>
                <div style={{ fontSize:13, color:C.muted, marginBottom:6, fontWeight:700 }}>Interés financiero</div>
                {(loadTarifario().interes_financiero||[]).length > 0 && (
                  <select value="" style={{ ...INP, padding:"4px 7px", fontSize:13, marginBottom:8, width:"100%" }}
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
                    <label style={{ fontSize:12, color:C.muted }}>% anual</label>
                    <input type="number" value={pres.interes_pct||0} min="0" step="0.5"
                      style={{ ...INP, padding:"4px 7px", fontSize:13 }}
                      onChange={e => set("interes_pct",+e.target.value)} />
                  </div>
                  <div style={{ flex:1 }}>
                    <label style={{ fontSize:12, color:C.muted }}>Días plazo</label>
                    <input type="number" value={pres.interes_dias||30} min="0"
                      style={{ ...INP, padding:"4px 7px", fontSize:13 }}
                      onChange={e => set("interes_dias",+e.target.value)} />
                  </div>
                </div>
                {c.int_usd > 0 && <div style={{ fontSize:13, color:C.warn, marginTop:4 }}>+ ${n2(c.int_usd)}</div>}
              </div>

              {/* Gran total */}
              <div style={{ background:C.accent+"18", border:`1px solid ${C.accent}33`, borderRadius:8, padding:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                  <span style={{ fontSize:14, color:C.accent, fontWeight:700 }}>TOTAL USD</span>
                  <span style={{ fontSize:28, fontWeight:900, color:C.accent }}>${n2(c.gran_total)}</span>
                </div>
                {c.total_kg > 0 && (
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginTop:8, paddingTop:8, borderTop:`1px solid ${C.accent}22` }}>
                    <div>
                      <div style={{ fontSize:12, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>Kg totales</div>
                      <div style={{ fontSize:22, fontWeight:800, color:C.text }}>{n3(c.total_kg)}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:12, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>USD/kg</div>
                      <div style={{ fontSize:22, fontWeight:800, color:C.gold }}>{n2(c.usd_kg)}</div>
                    </div>
                  </div>
                )}
                {(pres.tc ?? tcGlobal) > 0 && (
                  <div style={{ fontSize:13, color:C.muted, marginTop:3 }}>
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
// `precarga` (opcional, 2026-08-30): nombre/cliente/contacto/obra/tipo/
// categoría que vienen de un Anidado/Cómputo al pasar "→ Pasar a
// Presupuesto" — habilita la opción "+ Crear presupuesto nuevo" para no
// tener que volver a tipear esos datos a mano en un presupuesto existente.
function ImportarMaterialesModal({ materiales, presupuestos, precarga, onImportar, onImportarNuevoPres, onClose }) {
  const [presId, setPresId] = useState(precarga ? "__nuevo__" : "");
  const [itemSel, setItemSel] = useState(precarga ? "__nuevo__" : ""); // "" | "__nuevo__" | item.id
  const pres = presId !== "__nuevo__" ? presupuestos.find(p => p.id === presId) : null;
  const totalKg = (materiales||[]).reduce((s,m)=>s+m.kg,0);

  const confirmar = () => {
    if (!presId || !itemSel) return;
    if (presId === "__nuevo__") { onImportarNuevoPres(); return; }
    if (itemSel === "__nuevo__") onImportar(presId, uid(), true);
    else onImportar(presId, itemSel, false);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1500, background:"#000a", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:C.card, border:`1.5px solid ${C.accent}55`, borderRadius:14, padding:26, width:"100%", maxWidth:480 }}>
        <div style={{ color:C.accent, fontWeight:800, fontSize:15, marginBottom:6 }}>⬇ Importar materiales a Presupuesto</div>
        <div style={{ color:C.muted, fontSize:13, marginBottom:18 }}>
          {(materiales||[]).length} materiales · {n2(totalKg)} kg totales — se cargan como filas de Hierros, con precio/proveedor y las selecciones de granallado/pintura/galvanizado precargadas cuando estén disponibles. Podés editar cada fila después.
        </div>

        <label style={LBL}>Presupuesto destino</label>
        <select style={{...INP,marginBottom:14}} value={presId} onChange={e=>{setPresId(e.target.value);setItemSel(e.target.value==="__nuevo__"?"__nuevo__":"");}}>
          <option value="">— Elegí un presupuesto —</option>
          {precarga && <option value="__nuevo__">+ Crear presupuesto nuevo ({precarga.nombre || "sin nombre"})</option>}
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
export default function Presupuesto({ usuario, tcGlobal, usuarios = [], logear }) {
  const [presupuestos, setPres] = useState(() => loadLS("smeas_presupuestos", []));
  useMergePresupuestosNube(setPres);
  // Debounce del dual-write al editar campos del detalle (2026-09-01, bug
  // real reportado por Gino): updPres corre en cada tecla — sin esto,
  // escribir en Cliente disparaba resolverClienteId() en cada tecla y
  // creaba una fila de `clientes` por cada valor intermedio sin terminar
  // de tipear (ej. "S", "Sa", "Sac"...). El guardado local (setPres) sigue
  // siendo instantáneo como siempre; solo el envío a Supabase espera a que
  // el usuario deje de tocar el campo.
  const dualWriteTimer = useRef(null);
  const listaObras = useListaObras();
  const listaEmpresas = useListaEmpresas();
  const { show: showUndo, Toast } = useUndoToast();
  const [vista,  setVista]  = useState("lista");
  const [selId,  setSelId]  = useState(null);
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const [filt, setFilt] = useState(PRES_FILT_DEFAULTS);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(true);
  const [filtEst, setFiltEst] = useState("");
  const [confirmarDelId, setConfirmarDelId] = useState(null);
  const [materialesPend, setMaterialesPend] = useState(() => loadLS("smeas_material_export_pending", null));
  const [precargaPend, setPrecargaPend] = useState(() => loadLS("smeas_presupuesto_precarga_pending", null));
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
    saveLS("smeas_presupuesto_precarga_pending", null);
    setMaterialesPend(null);
    setPrecargaPend(null);
  };
  // "+ Crear presupuesto nuevo" desde Anidado/Cómputo (2026-08-30) — mismo
  // mecanismo que crearPres, pero con los datos que trajo la precarga y
  // el ítem con los materiales ya cargados en un solo paso.
  const importarMaterialesComoPresNuevo = () => {
    const nuevo = { ...iPresupuesto(), ...(precargaPend||{}) };
    nuevo.nro = newNroPresupuesto();
    nuevo.codigo_calculo = newCodigoCalculo();
    if (!nuevo.vendedor) nuevo.vendedor = usuario?.id || "";
    const materiales = materialesPend || [];
    const bibMap = {};
    [...loadLS("smeas_perfiles",[]), ...loadLS("smeas_planchuelas",[]), ...loadLS("smeas_planchas",[])]
      .forEach(m => { bibMap[m.nombre] = parseFloat(m.precio_usd_kg || m.precio || 0) || 0; });
    const hierros = materiales.map(m => {
      const usd_kg = m.usd_kg || bibMap[m.nombre] || 0;
      return {
        id: uid(), nombre: m.nombre, proveedor: m.proveedor || "", fecha_precio: "", obs: "", cantidad: 1,
        kg_pieza: +m.kg.toFixed(3), area_pieza_m2: +m.sup.toFixed(3), usd_kg,
        arena: !!m.granallado, pintura: !!m.pintura, galvanizado: !!m.galvanizado,
        subtotal_kg: +m.kg.toFixed(3), subtotal_m2: +m.sup.toFixed(3), subtotal_usd: +(m.kg*usd_kg).toFixed(2),
      };
    });
    nuevo.items = [{ ...iItem(), hierros }];
    setPres(prev => [nuevo, ...prev]);
    dualWritePresupuesto(nuevo);
    logear?.("Presupuesto creado", (nuevo.nro||"") + " — " + (nuevo.nombre||""));
    cerrarImportMateriales();
    setSelId(nuevo.id);
    setVista("detalle");
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
  const cnt = Object.fromEntries(Object.keys(ESTADO_CFG).map(k => [k, presupuestos.filter(p => !p.eliminado && p.estado===k).length]));

  // listaFiltrada recorría presupuestos + recalculaba calcPresupuesto() (que
  // internamente llama calcItem() por cada ítem, y antes del fix de
  // loadTarifario() en storage.js eso era un localStorage.getItem+JSON.parse
  // por cada ítem) en CADA render de esta pantalla, no solo cuando cambiaban
  // los filtros — bug de performance real, mismo patrón que el cuelgue de
  // unos segundos ya corregido del lado de Steel CRM (ver CLAUDE.md
  // 2026-08-30). Como además el array resultante era una referencia nueva en
  // cada render, el useMemo interno de useSortable nunca podía cachear nada.
  const listaFiltrada = useMemo(() => presupuestos
    .filter(p => !p.eliminado)
    .filter(p => !filtEst || p.estado === filtEst)
    .filter(p => !filt.nombre  || [p.nombre,p.nro].join(" ").toLowerCase().includes(filt.nombre.toLowerCase()))
    .filter(p => !filt.cliente || (p.cliente||"").toLowerCase().includes(filt.cliente.toLowerCase()))
    .filter(p => !filt.obra    || (p.obra||"").toLowerCase().includes(filt.obra.toLowerCase()))
    .filter(p => !filt.tipo    || p.tipo_trabajo === filt.tipo)
    .filter(p => !filt.familia || familiaDe(p.categoria) === filt.familia)
    .filter(p => !filt.vendedor || String(p.vendedor) === filt.vendedor)
    .filter(p => !filt.desde || (p.fecha||"") >= filt.desde)
    .filter(p => !filt.hasta || (p.fecha||"") <= filt.hasta)
    .map(p => ({ ...p, _total_usd: calcPresupuesto(p).gran_total, _n_items: (p.items||[]).length,
      _vendedor_nombre: usuarios.find(u => u.id === p.vendedor)?.nombre || "" })),
    [presupuestos, filtEst, filt, usuarios]);
  const { ordenados: lista, campo: sortCampo, dir: sortDir, ordenarPor } = useSortable(listaFiltrada, "fecha", "desc");

  // Reintento de sincronización (2026-08-29) — mismo mecanismo agregado del
  // lado de Steel CRM. Se recalcula desde localStorage después de cada
  // intento (éxito o fallo) para que el banner refleje el estado real.
  const [syncPendientes, setSyncPendientes] = useState(() => obtenerSyncPendientes().filter(p => p.tipo === "presupuesto"));
  const [syncError, setSyncError] = useState(null);
  const refrescarSyncPendientes = () => setSyncPendientes(obtenerSyncPendientes().filter(p => p.tipo === "presupuesto"));
  const reintentarSync = () => {
    setSyncError(null);
    syncPendientes.forEach(sp => {
      const p = presupuestos.find(x => x.id === sp.id);
      if (p) dualWritePresupuesto(p);
      else { limpiarSyncPendiente("presupuesto", sp.id); refrescarSyncPendientes(); }
    });
  };

  // Fase 3 (piloto, 2026-08-22): dual-write en paralelo, nunca bloquea ni
  // puede romper el guardado local (localStorage sigue siendo la fuente de
  // verdad). Resuelve `cliente` (texto libre local) a `cliente_id` real
  // contra la tabla `clientes` — mismo helper que usa registrarCliente.
  const dualWritePresupuesto = async (p, intentoRegen = false) => {
    if (!supabase) return;
    try {
      // A diferencia de Cómputo/Anidado/Historial, acá "cliente" siempre fue
      // la razón social (empresa) y "contacto" el nombre de la persona —
      // mapeo corregido 2026-08-23 (antes se invertía sin querer).
      // 2026-08-31, a pedido de Gino: se sacó el respaldo que antes usaba el
      // nombre de la Empresa como "nombre" del cliente cuando no había
      // contacto cargado — eso escribía razones sociales (ej. "Saceem") en
      // la tabla de personas, compartida con Steel CRM, y contaminaba el
      // autocompletado de Cliente con nombres de empresa. Un presupuesto sin
      // contacto ahora simplemente no crea/actualiza ningún cliente.
      const nombreParaClientes = (p.contacto || "").trim();
      const empresaParaClientes = p.cliente || null;
      const cliente_id = nombreParaClientes ? await resolverClienteId(nombreParaClientes, empresaParaClientes) : null;
      const obra_id = p.obra ? (listaObras.find(o => (o.nombre || "").trim().toLowerCase() === p.obra.trim().toLowerCase())?.id || null) : null;
      const empresa_id = p.cliente ? (listaEmpresas.find(e => (e.nombre || "").trim().toLowerCase() === p.cliente.trim().toLowerCase())?.id || null) : null;
      const vendedor = usuarios.find(u => u.id === p.vendedor)?.profileId || null;
      const { cliente, clonado_de, items, comentarios, ...resto } = p;
      await saveDBPresupuestoSM({ ...resto, cliente_id, obra_id, empresa: cliente, empresa_id, clonado_de_id: clonado_de || null, vendedor,
        eliminado_por: p.eliminadoPor ?? null, eliminado_fecha: p.eliminadoFecha ?? null });
      for (const item of items || []) {
        await saveDBItem(p.id, item);
      }
      limpiarSyncPendiente("presupuesto", p.id);
      refrescarSyncPendientes();
    } catch (e) {
      // El código de cálculo se genera con un contador que vive solo en
      // este navegador (ver newCodigoCalculo, storage.js) — si quedó
      // desalineado con lo ya usado en Supabase (otro dispositivo, datos
      // de prueba, etc.) el guardado choca contra la unicidad real de la
      // columna (uq_presupuestos_sm_codigo). Se autocura: se regenera un
      // código nuevo y se reintenta una sola vez, en vez de quedar
      // trabado esperando que alguien note el cartel de sync pendiente.
      if (!intentoRegen && (e.message || "").includes("uq_presupuestos_sm_codigo")) {
        const nuevoCodigo = newCodigoCalculo();
        console.warn(`[Fase 3] Código de cálculo duplicado en presupuesto "${p.nro || p.id}" — regenerado a ${nuevoCodigo}, reintentando.`);
        const corregido = { ...p, codigo_calculo: nuevoCodigo };
        setPres(prev => prev.map(x => x.id === p.id ? corregido : x));
        return dualWritePresupuesto(corregido, true);
      }
      console.warn(`[Fase 3] No se pudo sincronizar presupuesto "${p.nro || p.id}" con el backend:`, e.message || e);
      // Bug real detectado 2026-08-29 (mismo del lado de Steel CRM): sin
      // esto, el presupuesto queda guardado solo en este dispositivo sin
      // ningún aviso para el usuario.
      marcarSyncPendiente("presupuesto", p.id);
      refrescarSyncPendientes();
      // 2026-08-30: el error real solo quedaba en la consola — "Reintentar
      // ahora" parecía no hacer nada porque, si vuelve a fallar por la misma
      // causa, el cartel se ve idéntico al de antes. Se muestra el motivo.
      setSyncError(`"${p.nro || p.id}": ${e.message || e}`);
    }
  };

  const crearPres = (form) => {
    const nuevo = { ...iPresupuesto(), ...form };
    nuevo.nro = newNroPresupuesto();
    nuevo.codigo_calculo = newCodigoCalculo();
    if (!nuevo.vendedor) nuevo.vendedor = usuario?.id || "";
    setPres([nuevo, ...presupuestos]);
    setSelId(nuevo.id);
    setVista("detalle");
    setNuevoOpen(false);
    dualWritePresupuesto(nuevo);
    logear?.("Presupuesto creado", (nuevo.nro||"") + " — " + (nuevo.nombre||""));
  };

  const updPres = (p) => {
    const actualizado = touch(p);
    setPres(prev => prev.map(x => x.id===p.id ? actualizado : x));
    clearTimeout(dualWriteTimer.current);
    dualWriteTimer.current = setTimeout(() => dualWritePresupuesto(actualizado), 800);
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
  const eliminarComentario = async (p, comentario) => {
    const actualizado = touch({ ...p, comentarios: (p.comentarios || []).filter(c => c.id !== comentario.id) });
    setPres(prev => prev.map(x => x.id===p.id ? actualizado : x));
    if (!supabase) return;
    try { await deleteDBComentario("comentarios_presupuesto_sm", comentario.id); }
    catch (e) { console.warn(`[Fase 3] No se pudo borrar el comentario del backend:`, e.message || e); }
  };
  const delPres = (id) => {
    const p = presupuestos.find(x=>x.id===id);
    if (!p) return;
    const marcado = { ...p, eliminado:true, eliminadoPor:usuario?.nombre||"", eliminadoFecha:new Date().toISOString() };
    setPres(prev => prev.map(x => x.id===id ? marcado : x));
    if (selId===id) { setSelId(null); setVista("lista"); }
    dualWritePresupuesto(marcado);
    logear?.("Presupuesto eliminado", (p.nro||"") + " — " + (p.nombre||""));
    showUndo(`Presupuesto "${p.nro||p.nombre||""}" eliminado.`, () => {
      const restaurado = { ...marcado, eliminado:false, eliminadoPor:null, eliminadoFecha:null };
      setPres(prev => prev.map(x => x.id===id ? restaurado : x));
      dualWritePresupuesto(restaurado);
      logear?.("Presupuesto restaurado", (p.nro||"") + " — " + (p.nombre||""));
    });
  };

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
        <DetallePresupuesto pres={selPres} onChange={updPres} onBack={() => { setVista("lista"); setSelId(null); }} origenNro={origenNro} tcGlobal={tcGlobal} usuario={usuario} usuarios={usuarios} onAgregarComentario={(c) => agregarComentario(selPres, c)} onEliminarComentario={(c) => eliminarComentario(selPres, c)} />
        {materialesPend && (
          <ImportarMaterialesModal materiales={materialesPend} presupuestos={presupuestos} precarga={precargaPend} onImportar={importarMateriales} onImportarNuevoPres={importarMaterialesComoPresNuevo} onClose={cerrarImportMateriales} />
        )}
      </>
    );
  }

  return (
    <div>
      {Toast}
      {presAEliminar && (
        <ModalConfirmarEliminar
          titulo={`presupuesto "${presAEliminar.nombre||"Sin nombre"}" (${presAEliminar.nro})`}
          usuarioPropio={usuario}
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
          <div style={{ fontSize:13, color:C.muted, marginTop:2 }}>{presupuestos.length} presupuesto{presupuestos.length!==1?"s":""}</div>
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

      {/* Aviso de presupuestos sin sincronizar a la nube — mismo mecanismo
          agregado del lado de Steel CRM (2026-08-29) */}
      {syncPendientes.length > 0 && (
        <div style={{ background: C.err + "22", border: "1px solid " + C.err + "33", borderRadius: 8, padding: "8px 14px", marginBottom: 14, fontSize:14, color: C.err }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <span>☁️ <strong>{syncPendientes.length}</strong> presupuesto(s) no se sincronizaron a la nube — solo existen en este dispositivo por ahora.</span>
            <button onClick={reintentarSync} style={{ background: C.err, color: "#fff", border: "none", borderRadius: 6, padding: "5px 12px", fontSize:13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              Reintentar ahora
            </button>
          </div>
          {syncError && (
            <div style={{ marginTop: 6, fontSize: 12, opacity: .85 }}>Volvió a fallar — {syncError}</div>
          )}
        </div>
      )}

      {/* Filtros por estado */}
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
        <button onClick={() => setFiltEst("")}
          style={{ ...BTN(filtEst===""?"ok":"ghost"), padding:"4px 12px", fontSize:13 }}>
          Todos ({presupuestos.length})
        </button>
        {Object.entries(ESTADO_CFG).map(([k,v]) => (
          <button key={k} onClick={() => setFiltEst(filtEst===k?"":k)}
            style={{ ...BTN("ghost"), padding:"4px 12px", fontSize:13,
              ...(filtEst===k ? { background:v.color+"22", color:v.color, border:`1px solid ${v.color}44` } : {}) }}>
            {v.icon} {v.label} ({cnt[k]||0})
          </button>
        ))}
      </div>

      <FiltrosBar campos={presCampos(usuarios)} valores={filt} setValores={setFilt} defaults={PRES_FILT_DEFAULTS}
        abierto={filtrosAbiertos} setAbierto={setFiltrosAbiertos} />

      {lista.length === 0 && (
        <div style={{ textAlign:"center", padding:60, color:C.muted }}>
          {presupuestos.length === 0 ? (
            <>
              <div style={{ fontSize:40, marginBottom:12 }}>💰</div>
              <div style={{ fontSize:15, fontWeight:700, marginBottom:6, color:C.steel }}>Sin presupuestos todavía</div>
              <div style={{ fontSize:13, marginBottom:20 }}>Creá el primer presupuesto para empezar</div>
              <button style={BTN("primary")} onClick={() => setNuevoOpen(true)}>+ Nuevo presupuesto</button>
            </>
          ) : (
            <div style={{ fontSize:14 }}>No hay resultados para ese filtro</div>
          )}
        </div>
      )}

      {lista.length > 0 && (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              {[
                { h:"N°", campo:"nro" }, { h:"Nombre", campo:"nombre" }, { h:"Cliente", campo:"cliente" },
                { h:"Obra", campo:"obra" }, { h:"Tipo", campo:"tipo_trabajo" }, { h:"Vendedor", campo:"_vendedor_nombre" },
                { h:"Fecha", campo:"fecha" }, { h:"Ítems", campo:"_n_items" }, { h:"Total USD", campo:"_total_usd" },
                { h:"Estado", campo:"estado" }, { h:"", campo:null },
              ].map(({h,campo}) => (
                <th key={h} style={{ ...TH, cursor:campo?"pointer":"default", userSelect:"none" }}
                  onClick={() => campo && ordenarPor(campo)} title={campo?"Ordenar por "+h:undefined}>
                  {h}{sortCampo===campo && campo ? (sortDir==="asc"?" ▲":" ▼") : ""}
                </th>
              ))}
            </tr></thead>
            <tbody>
              {lista.map(p => {
                const est = ESTADO_CFG[p.estado] || ESTADO_CFG.borrador;
                return (
                  <tr key={p.id} onClick={() => { setSelId(p.id); setVista("detalle"); }}
                    style={{ cursor:"pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background=C.iron+"55"}
                    onMouseLeave={e => e.currentTarget.style.background=""}>
                    <td style={TD}><span style={{ color:C.muted, fontSize:13 }}>{p.nro}</span></td>
                    <td style={TD}><span style={{ fontWeight:700 }}>{p.nombre}</span></td>
                    <td style={TD}><span style={{ fontSize:13, color:C.steel }}>{p.cliente||"—"}</span></td>
                    <td style={TD}><span style={{ fontSize:13, color:C.muted }}>{p.obra||"—"}</span></td>
                    <td style={TD}><span style={BDG(C.steel,true)}>{p.tipo_trabajo||"Fab"}</span></td>
                    <td style={TD}><span style={{ fontSize:13, color:C.steel }}>{p._vendedor_nombre||"—"}</span></td>
                    <td style={TD}><span style={{ fontSize:13, color:C.muted }}>{p.fecha}</span></td>
                    <td style={{ ...TD, textAlign:"center" }}>{(p.items||[]).length}</td>
                    <td style={{ ...TD, textAlign:"right", fontWeight:700, color:C.ok }}>
                      {p._total_usd>0 ? `$${n2(p._total_usd)}` : "—"}
                    </td>
                    <td style={TD}><span style={BDG(est.color,true)}>{est.icon} {est.label}</span></td>
                    <td style={TD} onClick={e=>e.stopPropagation()}>
                      <button onClick={() => clonarPres(p)} title="Clonar presupuesto"
                        style={{ background:"none", border:"none", color:C.steel, cursor:"pointer", fontSize:14, marginRight:8 }}>📋</button>
                      <button onClick={() => setConfirmarDelId(p.id)}
                        style={{ background:"none", border:"none", color:C.err, cursor:"pointer", fontSize:14 }}>🗑</button>
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
        <ImportarMaterialesModal materiales={materialesPend} presupuestos={presupuestos} precarga={precargaPend} onImportar={importarMateriales} onImportarNuevoPres={importarMaterialesComoPresNuevo} onClose={cerrarImportMateriales} />
      )}
    </div>
  );
}
