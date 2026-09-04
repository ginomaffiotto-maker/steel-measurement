import { useState, useEffect, useMemo, useRef } from "react";
import { C, TH, TD, INP, LBL, BDG, BTN } from "../styles/colors";
import { saveLS, loadLS, uid, stamp, touch, loadTarifario, saveTarifario, saveDBMaterial, addDBHistorialPrecio, loadDBHistorialPrecios, saveDBTarifario, useTarifarioConNube, useMergeBibliotecaNube, obtenerTenantId } from "../utils/storage";
import { supabase } from "../utils/supabaseClient";
import { ModalConfirmarBorrado } from "./ConfirmarEliminar";

// ─── HELPERS ─────────────────────────────────────────────────────
const hoy = () => new Date().toISOString().split("T")[0];
// Saca tildes para que buscar "ang" encuentre "Ángulo" (mismo criterio que
// normStr/norm en Computo.jsx y Anidado.jsx).
const norm = s => String(s||"").toLowerCase()
  .normalize("NFD").replace(new RegExp("[\\u0300-\\u036f]","g"),"");

// Fase 3 (piloto, 2026-08-22): dual-write en paralelo, nunca bloquea ni
// puede romper el guardado local. Compartido por las 4 secciones de
// biblioteca (perfiles/planchuelas/planchas/rejillas) más abajo.
const dualWriteMaterial = async (tipo, mat) => {
  if (!supabase) return;
  try {
    const { historial_precios, ...row } = mat;
    await saveDBMaterial(tipo, row);
  } catch (e) {
    console.warn(`[Fase 3] No se pudo sincronizar material "${mat.nombre}" (${tipo}) con el backend:`, e.message || e);
  }
};
const dualWriteHistorialPrecio = async (tipo, materialId, entry) => {
  if (!supabase) return;
  try {
    await addDBHistorialPrecio(tipo, materialId, entry);
  } catch (e) {
    console.warn(`[Fase 3] No se pudo sincronizar historial de precio (${tipo}) con el backend:`, e.message || e);
  }
};
// El tarifario se guarda entero cada vez (mismo criterio que saveTarifario
// local) — saveDBTarifario reemplaza todas las filas de cada catálogo, así
// que un cambio parcial en cualquier sección igual manda el objeto completo.
const dualWriteTarifario = async (t) => {
  if (!supabase) return;
  try {
    await saveDBTarifario(t);
  } catch (e) {
    console.warn(`[Fase 3] No se pudo sincronizar el tarifario con el backend:`, e.message || e);
  }
};
const n2 = (v) => (+v || 0).toLocaleString("es-UY", { minimumFractionDigits:2, maximumFractionDigits:2 });
const TH_R = { ...TH, textAlign: "right" };
const TD_R = { ...TD, textAlign: "right", fontVariantNumeric: "tabular-nums" };

// ─── MERGE ADITIVO: agrega ítems nuevos del seed sin tocar los ya guardados ───
// Así, cuando se amplía una biblioteca (ej: Planilla GM V26), a los usuarios que
// ya tienen datos en localStorage les aparecen los materiales nuevos automáticamente,
// sin perder precios ni ediciones de los que ya tenían.
export function mergeSeed(existing, seed, deprecatedIds) {
  if (!existing) return seed.map(p => ({ ...p, precio_usd_kg: p.precio_usd_kg || 0, historial_precios: [] }));
  let base = existing;
  if (deprecatedIds && deprecatedIds.length) {
    const dep = new Set(deprecatedIds);
    base = base.filter(p => !dep.has(p.id));
  }
  const existingIds = new Set(base.map(p => p.id));
  const nuevos = seed.filter(p => !existingIds.has(p.id)).map(p => ({ ...p, precio_usd_kg: p.precio_usd_kg || 0, historial_precios: [] }));
  return nuevos.length || base.length !== existing.length ? [...base, ...nuevos] : base;
}

// ─── SYNC DE PRECIOS POR DEFECTO ──────────────────────────────────
// Para ítems que el usuario NUNCA les puso precio (precio_usd_kg=0), trae el
// valor por defecto del seed si ese sí tiene uno cargado. Nunca toca un ítem
// que ya tiene precio real (aunque sea distinto al del seed) — eso protege
// las ediciones del usuario. Sirve para cuando se agregan precios nuevos al
// seed después de que alguien ya migró su Biblioteca a localStorage sin ellos.
function sincronizarPreciosDefault(items, seed) {
  const seedMap = {};
  seed.forEach(s => { if (s.precio_usd_kg > 0) seedMap[s.id] = s.precio_usd_kg; });
  const hoyStr = hoy();
  let n = 0;
  const actualizados = items.map(it => {
    if (it.precio_usd_kg > 0) return it;
    const def = seedMap[it.id];
    if (!def) return it;
    n++;
    const entrada = { id: uid(), fecha: hoyStr, proveedor: "Precio por defecto (Biblioteca)", precio: def };
    return { ...it, precio_usd_kg: def, historial_precios: [entrada, ...(it.historial_precios||[])] };
  });
  return { actualizados, n };
}

function BtnSyncPrecios({ items, seed, onSync }) {
  const pendientes = items.filter(it => !it.precio_usd_kg && seed.find(s=>s.id===it.id)?.precio_usd_kg > 0).length;
  if (pendientes === 0) return null;
  return (
    <button onClick={()=>{
      const { actualizados } = sincronizarPreciosDefault(items, seed);
      onSync(actualizados);
    }} style={{ ...BTN("ok"), borderColor:C.ok+"66" }}>
      🔄 Actualizar {pendientes} precio{pendientes!==1?"s":""} nuevo{pendientes!==1?"s":""}
    </button>
  );
}

// Ids viejos unificados/reemplazados por el set completo de Planilla GM V26
// (Ángulo, T, Tubo cuadrado, Tubo rectangular, Caño) — se filtran del localStorage
// existente para no dejar materiales duplicados (ej: Ángulo aparecía 2 veces).
export const IDS_UNIFICADOS_GM = [
  "ANG1x18","ANG114x18","ANG112x316","ANG112x14","ANG2x14","ANG212x316","ANG212x14",
  "ANG212x516","ANG3x14","ANG3x516","ANG312x14","ANG312x38","ANG4x516","ANG4x38","ANG5x38","ANG6x12",
  "T2x14","T3x14","T4x516",
  "TC20x2","TC25x2","TC30x2","TC40x2","TC40x3","TC50x2","TC50x3","TC60x3","TC60x4","TC70x3",
  "TC80x3","TC80x4","TC80x32","TC100x3","TC100x4","TC100x63","TC120x4","TC120x5","TC120x8",
  "TC140x5","TC150x5","TC150x63","TC160x5","TC180x6","TC200x6","TC200x8","TC250x8",
  "TR40x20x2","TR50x25x2","TR50x30x2","TR60x30x2","TR60x40x3","TR80x40x3","TR80x40x4",
  "TR100x50x3","TR100x50x4","TR100x60x2","TR100x60x4","TR120x60x4","TR120x80x5","TR150x100x5","TR200x100x6",
  "CANO12S40","CANO34S40","CANO1S40","CANO114S40","CANO112S40","CANO2S40","CANO212S40",
  "CANO3S40","CANO4S40","CANO6S20","CANO6S40","CANO8S20","CANO10S20",
];

// ─── MIGRACIÓN: agrega historial_precios a datos viejos ──────────
export const migrar = items => items.map(p => ({
  ...p,
  historial_precios: p.historial_precios ?? (
    p.precio_usd_kg > 0
      ? [{ id: uid(), fecha: hoy(), proveedor: "", precio: p.precio_usd_kg }]
      : []
  ),
}));

// ─── PERFILES LINEALES ───────────────────────────────────────────
export const PERFILES_DATA = [
  // HEB (sup = m²/m pintura, fuente: Planilla GM V26)
  { id:"HEB100", nombre:"HEB 100", cat:"HEB", kg_m:20.4,  largo:12, sup:0.40, precio_usd_kg:2.45 },
  { id:"HEB120", nombre:"HEB 120", cat:"HEB", kg_m:26.7,  largo:12, sup:0.48, precio_usd_kg:2.45 },
  { id:"HEB140", nombre:"HEB 140", cat:"HEB", kg_m:33.7,  largo:12, sup:0.56, precio_usd_kg:2.45 },
  { id:"HEB160", nombre:"HEB 160", cat:"HEB", kg_m:42.6,  largo:12, sup:0.64, precio_usd_kg:2.45 },
  { id:"HEB180", nombre:"HEB 180", cat:"HEB", kg_m:51.2,  largo:12, sup:0.72, precio_usd_kg:2.45 },
  { id:"HEB200", nombre:"HEB 200", cat:"HEB", kg_m:61.3,  largo:12, sup:0.80, precio_usd_kg:2.00 },
  { id:"HEB220", nombre:"HEB 220", cat:"HEB", kg_m:71.5,  largo:12, sup:0.88, precio_usd_kg:2.45 },
  { id:"HEB240", nombre:"HEB 240", cat:"HEB", kg_m:83.2,  largo:12, sup:0.96, precio_usd_kg:2.75 },
  { id:"HEB260", nombre:"HEB 260", cat:"HEB", kg_m:93.0,  largo:12, sup:1.04, precio_usd_kg:2.00 },
  { id:"HEB280", nombre:"HEB 280", cat:"HEB", kg_m:103.0, largo:12, sup:1.12, precio_usd_kg:3.00 },
  { id:"HEB300", nombre:"HEB 300", cat:"HEB", kg_m:117.0, largo:12, sup:1.20, precio_usd_kg:3.00 },
  { id:"HEB320", nombre:"HEB 320", cat:"HEB", kg_m:127.0, largo:12, sup:1.77, precio_usd_kg:2.55 },
  { id:"HEB340", nombre:"HEB 340", cat:"HEB", kg_m:134.0, largo:12, sup:1.81 },
  { id:"HEB360", nombre:"HEB 360", cat:"HEB", kg_m:142.0, largo:12, sup:1.85 },
  { id:"HEB400", nombre:"HEB 400", cat:"HEB", kg_m:155.0, largo:12, sup:1.93, precio_usd_kg:2.50 },
  { id:"HEB450", nombre:"HEB 450", cat:"HEB", kg_m:171.0, largo:12, sup:2.03 },
  { id:"HEB500", nombre:"HEB 500", cat:"HEB", kg_m:187.0, largo:12, sup:2.12 },
  { id:"HEB550", nombre:"HEB 550", cat:"HEB", kg_m:199.0, largo:12, sup:2.22 },
  { id:"HEB600", nombre:"HEB 600", cat:"HEB", kg_m:212.0, largo:12, sup:2.32 },
  // HEA (sup = m²/m pintura, fuente: Planilla GM V26)
  { id:"HEA100", nombre:"HEA 100", cat:"HEA", kg_m:16.7,  largo:12, sup:0.392 },
  { id:"HEA120", nombre:"HEA 120", cat:"HEA", kg_m:19.9,  largo:12, sup:0.468 },
  { id:"HEA140", nombre:"HEA 140", cat:"HEA", kg_m:24.7,  largo:12, sup:0.546 },
  { id:"HEA160", nombre:"HEA 160", cat:"HEA", kg_m:30.4,  largo:12, sup:0.624 },
  { id:"HEA180", nombre:"HEA 180", cat:"HEA", kg_m:35.5,  largo:12, sup:0.702 },
  { id:"HEA200", nombre:"HEA 200", cat:"HEA", kg_m:42.3,  largo:12, sup:0.780 },
  { id:"HEA220", nombre:"HEA 220", cat:"HEA", kg_m:50.5,  largo:12, sup:0.860 },
  { id:"HEA240", nombre:"HEA 240", cat:"HEA", kg_m:60.3,  largo:12, sup:0.940 },
  { id:"HEA260", nombre:"HEA 260", cat:"HEA", kg_m:68.2,  largo:12, sup:1.020 },
  { id:"HEA280", nombre:"HEA 280", cat:"HEA", kg_m:76.4,  largo:12, sup:1.100 },
  { id:"HEA300", nombre:"HEA 300", cat:"HEA", kg_m:88.3,  largo:12, sup:1.180 },
  { id:"HEA320", nombre:"HEA 320", cat:"HEA", kg_m:97.4,  largo:12, sup:1.220 },
  { id:"HEA340", nombre:"HEA 340", cat:"HEA", kg_m:105.0, largo:12, sup:1.260 },
  { id:"HEA360", nombre:"HEA 360", cat:"HEA", kg_m:112.5, largo:12, sup:1.300, precio_usd_kg:3.00 },
  { id:"HEA400", nombre:"HEA 400", cat:"HEA", kg_m:124.5, largo:12, sup:1.380 },
  { id:"HEA450", nombre:"HEA 450", cat:"HEA", kg_m:140.0, largo:12, sup:1.480 },
  { id:"HEA500", nombre:"HEA 500", cat:"HEA", kg_m:155.0, largo:12, sup:1.580 },
  { id:"HEA550", nombre:"HEA 550", cat:"HEA", kg_m:168.0, largo:12, sup:1.680 },
  { id:"HEA600", nombre:"HEA 600", cat:"HEA", kg_m:183.0, largo:12, sup:1.780 },
  // IPE (sup = m²/m pintura, fuente: Planilla GM V26)
  { id:"IPE80",  nombre:"IPE 80",  cat:"IPE", kg_m:6.0,   largo:12, sup:0.252 },
  { id:"IPE100", nombre:"IPE 100", cat:"IPE", kg_m:8.1,   largo:12, sup:0.310 },
  { id:"IPE120", nombre:"IPE 120", cat:"IPE", kg_m:10.4,  largo:12, sup:0.368 },
  { id:"IPE140", nombre:"IPE 140", cat:"IPE", kg_m:12.9,  largo:12, sup:0.426 },
  { id:"IPE160", nombre:"IPE 160", cat:"IPE", kg_m:15.8,  largo:12, sup:0.484 },
  { id:"IPE180", nombre:"IPE 180", cat:"IPE", kg_m:18.8,  largo:12, sup:0.542 },
  { id:"IPE200", nombre:"IPE 200", cat:"IPE", kg_m:22.4,  largo:12, sup:0.600 },
  { id:"IPE220", nombre:"IPE 220", cat:"IPE", kg_m:26.2,  largo:12, sup:0.660 },
  { id:"IPE240", nombre:"IPE 240", cat:"IPE", kg_m:30.7,  largo:12, sup:0.720 },
  { id:"IPE270", nombre:"IPE 270", cat:"IPE", kg_m:36.1,  largo:12, sup:0.810 },
  { id:"IPE300", nombre:"IPE 300", cat:"IPE", kg_m:42.2,  largo:12, sup:0.900 },
  { id:"IPE330", nombre:"IPE 330", cat:"IPE", kg_m:49.1,  largo:12, sup:0.980 },
  { id:"IPE360", nombre:"IPE 360", cat:"IPE", kg_m:57.1,  largo:12, sup:1.060 },
  { id:"IPE400", nombre:"IPE 400", cat:"IPE", kg_m:66.3,  largo:12, sup:1.160 },
  { id:"IPE450", nombre:"IPE 450", cat:"IPE", kg_m:77.6,  largo:12, sup:1.280 },
  { id:"IPE500", nombre:"IPE 500", cat:"IPE", kg_m:90.7,  largo:12, sup:1.400 },
  { id:"IPE550", nombre:"IPE 550", cat:"IPE", kg_m:105.7, largo:12, sup:1.520 },
  { id:"IPE600", nombre:"IPE 600", cat:"IPE", kg_m:122.4, largo:12, sup:1.640 },
  // IPN (sup = m²/m pintura, fuente: Planilla GM V26)
  { id:"IPN80",  nombre:"IPN 80",  cat:"IPN", kg_m:5.75,  largo:12, sup:0.244, precio_usd_kg:1.02 },
  { id:"IPN100", nombre:"IPN 100", cat:"IPN", kg_m:8.17,  largo:12, sup:0.300, precio_usd_kg:1.02 },
  { id:"IPN120", nombre:"IPN 120", cat:"IPN", kg_m:11.0,  largo:12, sup:0.470, precio_usd_kg:1.02 },
  { id:"IPN140", nombre:"IPN 140", cat:"IPN", kg_m:14.0,  largo:12, sup:0.544, precio_usd_kg:1.02 },
  { id:"IPN160", nombre:"IPN 160", cat:"IPN", kg_m:17.9,  largo:12, sup:0.620, precio_usd_kg:1.02 },
  { id:"IPN180", nombre:"IPN 180", cat:"IPN", kg_m:21.25, largo:12, sup:0.695, precio_usd_kg:1.10 },
  { id:"IPN200", nombre:"IPN 200", cat:"IPN", kg_m:26.0,  largo:12, sup:0.771, precio_usd_kg:1.10 },
  { id:"IPN220", nombre:"IPN 220", cat:"IPN", kg_m:30.34, largo:12, sup:0.848, precio_usd_kg:1.17 },
  { id:"IPN240", nombre:"IPN 240", cat:"IPN", kg_m:36.2,  largo:12, sup:0.925, precio_usd_kg:1.17 },
  { id:"IPN260", nombre:"IPN 260", cat:"IPN", kg_m:41.9,  largo:12, sup:1.000, precio_usd_kg:1.17 },
  { id:"IPN280", nombre:"IPN 280", cat:"IPN", kg_m:47.9,  largo:12, sup:1.076, precio_usd_kg:1.86 },
  { id:"IPN300", nombre:"IPN 300", cat:"IPN", kg_m:54.2,  largo:12, sup:1.152, precio_usd_kg:1.17 },
  { id:"IPN320", nombre:"IPN 320", cat:"IPN", kg_m:61.5,  largo:12, sup:0.910, precio_usd_kg:1.86 },
  { id:"IPN340", nombre:"IPN 340", cat:"IPN", kg_m:66.58, largo:12, sup:0.960, precio_usd_kg:1.86 },
  { id:"IPN360", nombre:"IPN 360", cat:"IPN", kg_m:75.83, largo:12, sup:1.010, precio_usd_kg:1.86 },
  { id:"IPN400", nombre:"IPN 400", cat:"IPN", kg_m:90.42, largo:12, sup:1.110, precio_usd_kg:1.86 },
  { id:"IPN450", nombre:"IPN 450", cat:"IPN", kg_m:116.7, largo:12, sup:1.240, precio_usd_kg:1.86 },
  { id:"IPN500", nombre:"IPN 500", cat:"IPN", kg_m:138.6, largo:12, sup:1.370, precio_usd_kg:1.86 },
  { id:"IPN550", nombre:"IPN 550", cat:"IPN", kg_m:166.4, largo:12, sup:1.500, precio_usd_kg:1.86 },
  { id:"IPN600", nombre:"IPN 600", cat:"IPN", kg_m:196.1, largo:12, sup:1.630 },
  // UPN (sup = m²/m pintura, fuente: Planilla GM V26)
  { id:"UPN60",  nombre:"UPN 60",  cat:"UPN", kg_m:5.07,  largo:12, sup:0.232 },
  { id:"UPN80",  nombre:"UPN 80",  cat:"UPN", kg_m:8.83,  largo:12, sup:0.250, precio_usd_kg:1.02 },
  { id:"UPN100", nombre:"UPN 100", cat:"UPN", kg_m:10.5,  largo:12, sup:0.300, precio_usd_kg:1.02 },
  { id:"UPN120", nombre:"UPN 120", cat:"UPN", kg_m:13.5,  largo:12, sup:0.350, precio_usd_kg:1.02 },
  { id:"UPN140", nombre:"UPN 140", cat:"UPN", kg_m:15.33, largo:12, sup:0.400, precio_usd_kg:1.02 },
  { id:"UPN160", nombre:"UPN 160", cat:"UPN", kg_m:18.33, largo:12, sup:0.450, precio_usd_kg:1.10 },
  { id:"UPN180", nombre:"UPN 180", cat:"UPN", kg_m:21.67, largo:12, sup:0.500, precio_usd_kg:1.10 },
  { id:"UPN200", nombre:"UPN 200", cat:"UPN", kg_m:24.83, largo:12, sup:0.550, precio_usd_kg:1.10 },
  { id:"UPN220", nombre:"UPN 220", cat:"UPN", kg_m:28.58, largo:12, sup:0.600, precio_usd_kg:1.17 },
  { id:"UPN240", nombre:"UPN 240", cat:"UPN", kg_m:32.5,  largo:12, sup:0.650, precio_usd_kg:1.17 },
  { id:"UPN260", nombre:"UPN 260", cat:"UPN", kg_m:37.5,  largo:12, sup:0.700, precio_usd_kg:1.17 },
  { id:"UPN280", nombre:"UPN 280", cat:"UPN", kg_m:41.67, largo:12, sup:0.750, precio_usd_kg:1.86 },
  { id:"UPN300", nombre:"UPN 300", cat:"UPN", kg_m:45.58, largo:12, sup:0.800, precio_usd_kg:1.17 },
  { id:"UPN320", nombre:"UPN 320", cat:"UPN", kg_m:59.5,  largo:12, sup:1.070 },
  { id:"UPN350", nombre:"UPN 350", cat:"UPN", kg_m:60.6,  largo:12, sup:1.180 },
  { id:"UPN380", nombre:"UPN 380", cat:"UPN", kg_m:63.1,  largo:12, sup:1.280 },
  { id:"UPN400", nombre:"UPN 400", cat:"UPN", kg_m:71.8,  largo:12, sup:1.360 },
  // W americanas (fuente: Planilla GM V26)
  { id:"W150x135",  nombre:"W 150×13,5",  cat:"W americanas", kg_m:13.5, largo:12, sup:0.591, precio_usd_kg:1.63 },
  { id:"W150x180",  nombre:"W 150×18,0",  cat:"W americanas", kg_m:18.0, largo:12, sup:0.640, precio_usd_kg:1.63 },
  { id:"W150x225",  nombre:"W 150×22,5",  cat:"W americanas", kg_m:22.5, largo:12, sup:0.704, precio_usd_kg:1.57 },
  { id:"W200x150",  nombre:"W 200×15,0",  cat:"W americanas", kg_m:15.0, largo:12, sup:0.795, precio_usd_kg:1.63 },
  { id:"W200x193",  nombre:"W 200×19,3",  cat:"W americanas", kg_m:19.3, largo:12, sup:0.829, precio_usd_kg:1.63 },
  { id:"W200x225",  nombre:"W 200×22,5",  cat:"W americanas", kg_m:22.5, largo:12, sup:0.840, precio_usd_kg:1.63 },
  { id:"W200x266",  nombre:"W 200×26,6",  cat:"W americanas", kg_m:26.6, largo:12, sup:0.857, precio_usd_kg:1.63 },
  { id:"W200x313",  nombre:"W 200×31,3",  cat:"W americanas", kg_m:31.3, largo:12, sup:0.871, precio_usd_kg:1.63 },
  { id:"W250x179",  nombre:"W 250×17,9",  cat:"W americanas", kg_m:17.9, largo:12, sup:0.985 },
  { id:"W250x223",  nombre:"W 250×22,3",  cat:"W americanas", kg_m:22.3, largo:12, sup:1.012 },
  { id:"W250x284",  nombre:"W 250×28,4",  cat:"W americanas", kg_m:28.4, largo:12, sup:1.027 },
  { id:"W250x327",  nombre:"W 250×32,7",  cat:"W americanas", kg_m:32.7, largo:12, sup:1.040, precio_usd_kg:1.63 },
  { id:"W310x327",  nombre:"W 310×32,7",  cat:"W americanas", kg_m:32.7, largo:12, sup:1.260 },
  { id:"W310x445",  nombre:"W 310×44,5",  cat:"W americanas", kg_m:44.5, largo:12, sup:1.280, precio_usd_kg:1.63 },
  { id:"W310x520",  nombre:"W 310×52,0",  cat:"W americanas", kg_m:52.0, largo:12, sup:1.296 },
  { id:"W310x600",  nombre:"W 310×60,0",  cat:"W americanas", kg_m:60.0, largo:12, sup:1.310 },
  { id:"W360x329",  nombre:"W 360×32,9",  cat:"W americanas", kg_m:32.9, largo:12, sup:1.535 },
  { id:"W360x440",  nombre:"W 360×44,0",  cat:"W americanas", kg_m:44.0, largo:12, sup:1.547 },
  { id:"W360x510",  nombre:"W 360×51,0",  cat:"W americanas", kg_m:51.0, largo:12, sup:1.555, precio_usd_kg:1.63 },
  { id:"W360x570",  nombre:"W 360×57,0",  cat:"W americanas", kg_m:57.0, largo:12, sup:1.561 },
  { id:"W360x720",  nombre:"W 360×72,0",  cat:"W americanas", kg_m:72.0, largo:12, sup:1.575 },
  // Cajón UPN (2×UPN soldados)
  { id:"CUPN100", nombre:"Cajón UPN 100", cat:"Cajón UPN", kg_m:21.0, largo:12, sup:0.758 },
  { id:"CUPN120", nombre:"Cajón UPN 120", cat:"Cajón UPN", kg_m:27.0, largo:12, sup:0.894 },
  { id:"CUPN140", nombre:"Cajón UPN 140", cat:"Cajón UPN", kg_m:30.7, largo:12, sup:1.028 },
  { id:"CUPN160", nombre:"Cajón UPN 160", cat:"Cajón UPN", kg_m:37.6, largo:12, sup:1.162 },
  { id:"CUPN180", nombre:"Cajón UPN 180", cat:"Cajón UPN", kg_m:43.3, largo:12, sup:1.296 },
  { id:"CUPN200", nombre:"Cajón UPN 200", cat:"Cajón UPN", kg_m:49.7, largo:12, sup:1.430 },
  { id:"CUPN240", nombre:"Cajón UPN 240", cat:"Cajón UPN", kg_m:66.4, largo:12, sup:1.694 },
  { id:"CUPN300", nombre:"Cajón UPN 300", cat:"Cajón UPN", kg_m:92.4, largo:12, sup:2.090 },
  // Redondos macizos
  { id:"RD38",  nombre:'Redondo 3/8" (9,5mm)',   cat:"Redondo", kg_m:0.56,  largo:6, sup:0.030, precio_usd_kg:1.52 },
  { id:"RD12",  nombre:'Redondo ½" (12,7mm)',    cat:"Redondo", kg_m:0.99,  largo:6, sup:0.040, precio_usd_kg:1.52 },
  { id:"RD58",  nombre:'Redondo 5/8" (15,9mm)',  cat:"Redondo", kg_m:1.56,  largo:6, sup:0.050, precio_usd_kg:1.52 },
  { id:"RD34",  nombre:'Redondo ¾" (19,05mm)',   cat:"Redondo", kg_m:2.24,  largo:6, sup:0.060, precio_usd_kg:1.52 },
  { id:"RD1",   nombre:'Redondo 1" (25,4mm)',    cat:"Redondo", kg_m:3.97,  largo:6, sup:0.080, precio_usd_kg:1.52 },
  { id:"RD114", nombre:'Redondo 1¼" (31,75mm)',  cat:"Redondo", kg_m:6.21,  largo:6, sup:0.100, precio_usd_kg:1.52 },
  { id:"RD112", nombre:'Redondo 1½" (38,1mm)',   cat:"Redondo", kg_m:8.95,  largo:6, sup:0.120, precio_usd_kg:2.80 },
  { id:"RD2",   nombre:'Redondo 2" (50,8mm)',    cat:"Redondo", kg_m:15.9,  largo:6, sup:0.160, precio_usd_kg:2.35 },
  { id:"RD212", nombre:'Redondo 2½" (63,5mm)',   cat:"Redondo", kg_m:24.9,  largo:6, sup:0.199 },
  { id:"RD3",   nombre:'Redondo 3" (76,2mm)',    cat:"Redondo", kg_m:35.8,  largo:6, sup:0.239, precio_usd_kg:3.00 },
  // Perfil C
  { id:"C120", nombre:"C 120×53×20", cat:"Perfil C", kg_m:3.8, largo:6, sup:0.193 },
  { id:"C140", nombre:"C 140×58×20", cat:"Perfil C", kg_m:4.6, largo:6, sup:0.228 },
  { id:"C160", nombre:"C 160×63×20", cat:"Perfil C", kg_m:5.3, largo:6, sup:0.263 },
  { id:"C200", nombre:"C 200×68×20", cat:"Perfil C", kg_m:6.8, largo:6, sup:0.318 },

  // ═══ PLANILLA GM V26 — categorías adicionales (agregado 2026-07-19) ═══
  // Ángulo — 55 ítems (Planilla GM V26)
  { id:"GM_ANGULO_1_2_X_1_8_12_7X3_2MM", nombre:"Angulo 1/2\" x 1/8\" (12,7x3,2mm)", cat:"Ángulo", kg_m:0.55, largo:6, sup:0.0444 },
  { id:"GM_ANGULO_3_4_X_1_8_19_0X3_2MM", nombre:"Angulo 3/4\" x 1/8\" (19,0x3,2mm)", cat:"Ángulo", kg_m:0.88, largo:6, sup:0.0696, precio_usd_kg:1.17 },
  { id:"GM_ANGULO_3_4_X_3_16_19_0X4_8MM", nombre:"Angulo 3/4\" x 3/16\" (19,0x4,8mm)", cat:"Ángulo", kg_m:1.27, largo:6, sup:0.0664 },
  { id:"GM_ANGULO_1_X_1_8_25_4X3_2MM", nombre:"Angulo 1\" x 1/8\" (25,4x3,2mm)", cat:"Ángulo", kg_m:1.19, largo:6, sup:0.0952, precio_usd_kg:1.17 },
  { id:"GM_ANGULO_1_X_3_16_25_4X4_8MM", nombre:"Angulo 1\" x 3/16\" (25,4x4,8mm)", cat:"Ángulo", kg_m:1.73, largo:6, sup:0.092, precio_usd_kg:1.17 },
  { id:"GM_ANGULO_1_X_1_4_25_4X6_4MM", nombre:"Angulo 1\" x 1/4\" (25,4x6,4mm)", cat:"Ángulo", kg_m:2.22, largo:6, sup:0.0888 },
  { id:"GM_ANGULO_1_1_4_X_1_8_31_7X3_2MM", nombre:"Angulo 1 1/4\" x 1/8\" (31,7x3,2mm)", cat:"Ángulo", kg_m:1.5, largo:6, sup:0.1204, precio_usd_kg:1.17 },
  { id:"GM_ANGULO_1_1_4_X_3_16_31_7X4_8MM", nombre:"Angulo 1 1/4\" x 3/16\" (31,7x4,8mm)", cat:"Ángulo", kg_m:2.2, largo:6, sup:0.1172, precio_usd_kg:1.17 },
  { id:"GM_ANGULO_1_1_4_X_1_4_31_7X6_4MM", nombre:"Angulo 1 1/4\" x 1/4\" (31,7x6,4mm)", cat:"Ángulo", kg_m:2.86, largo:6, sup:0.114, precio_usd_kg:1.17 },
  { id:"GM_ANGULO_1_1_2_X_1_8_38_1X3_2MM", nombre:"Angulo 1 1/2\" x 1/8\" (38,1x3,2mm)", cat:"Ángulo", kg_m:1.83, largo:6, sup:0.146, precio_usd_kg:1.17 },
  { id:"GM_ANGULO_1_1_2_X_3_16_38_1X4_8MM", nombre:"Angulo 1 1/2\" x 3/16\" (38,1x4,8mm)", cat:"Ángulo", kg_m:2.68, largo:6, sup:0.1428, precio_usd_kg:1.17 },
  { id:"GM_ANGULO_1_1_2_X_1_4_38_1X6_4MM", nombre:"Angulo 1 1/2\" x 1/4\" (38,1x6,4mm)", cat:"Ángulo", kg_m:3.48, largo:6, sup:0.1396, precio_usd_kg:1.17 },
  { id:"GM_ANGULO_2_X_1_8_50_8X3_2MM", nombre:"Angulo 2\" x 1/8\" (50,8x3,2mm)", cat:"Ángulo", kg_m:2.46, largo:6, sup:0.1968, precio_usd_kg:1.17 },
  { id:"GM_ANGULO_2_X_3_16_50_8X4_8MM", nombre:"Angulo 2\" x 3/16\" (50,8x4,8mm)", cat:"Ángulo", kg_m:3.63, largo:6, sup:0.1936, precio_usd_kg:1.17 },
  { id:"GM_ANGULO_2_X_1_4_50_8X6_4MM", nombre:"Angulo 2\" x 1/4\" (50,8x6,4mm)", cat:"Ángulo", kg_m:4.75, largo:6, sup:0.1904, precio_usd_kg:1.17 },
  { id:"GM_ANGULO_2_X_3_8_50_8X9_5MM", nombre:"Angulo 2\" x 3/8\" (50,8x9,5mm)", cat:"Ángulo", kg_m:6.99, largo:6, sup:0.1842, precio_usd_kg:1.17 },
  { id:"GM_ANGULO_2_1_2_X_3_16_63_5X4_8MM", nombre:"Angulo 2 1/2\" x 3/16\" (63,5x4,8mm)", cat:"Ángulo", kg_m:4.57, largo:6, sup:0.2444, precio_usd_kg:1.17 },
  { id:"GM_ANGULO_2_1_2_X_1_4_63_5X6_4MM", nombre:"Angulo 2 1/2\" x 1/4\" (63,5x6,4mm)", cat:"Ángulo", kg_m:6.1, largo:6, sup:0.2412, precio_usd_kg:1.17 },
  { id:"GM_ANGULO_2_1_2_X_3_8_63_5X9_5MM", nombre:"Angulo 2 1/2\" x 3/8\" (63,5x9,5mm)", cat:"Ángulo", kg_m:8.78, largo:6, sup:0.235, precio_usd_kg:1.17 },
  { id:"GM_ANGULO_2_1_2_X_1_2_63_5X12_7MM", nombre:"Angulo 2 1/2\" x 1/2\" (63,5x12,7mm)", cat:"Ángulo", kg_m:11.46, largo:6, sup:0.2286 },
  { id:"GM_ANGULO_3_X_1_4_76_2X6_4MM", nombre:"Angulo 3\" x 1/4\" (76,2x6,4mm)", cat:"Ángulo", kg_m:7.29, largo:6, sup:0.292, precio_usd_kg:1.21 },
  { id:"GM_ANGULO_3_X_3_8_76_2X9_5MM", nombre:"Angulo 3\" x 3/8\" (76,2x9,5mm)", cat:"Ángulo", kg_m:10.72, largo:6, sup:0.2858, precio_usd_kg:1.21 },
  { id:"GM_ANGULO_3_X_1_2_76_2X12_7MM", nombre:"Angulo 3\" x 1/2\" (76,2x12,7mm)", cat:"Ángulo", kg_m:13.99, largo:6, sup:0.2794, precio_usd_kg:1.21 },
  { id:"GM_ANGULO_4_X_1_4_101_6X6_4MM", nombre:"Angulo 4\" x 1/4\" (101,6x6,4mm)", cat:"Ángulo", kg_m:9.82, largo:6, sup:0.3936, precio_usd_kg:1.21 },
  { id:"GM_ANGULO_4_X_3_8_101_6X9_5MM", nombre:"Angulo 4\" x 3/8\" (101,6x9,5mm)", cat:"Ángulo", kg_m:14.58, largo:6, sup:0.3874, precio_usd_kg:1.21 },
  { id:"GM_ANGULO_4_X_1_2_101_6X12_7MM", nombre:"Angulo 4\" x 1/2\" (101,6x12,7mm)", cat:"Ángulo", kg_m:19.05, largo:6, sup:0.381, precio_usd_kg:1.21 },
  { id:"GM_ANGULO_4_X_5_8_101_6X15_9MM", nombre:"Angulo 4\" x 5/8\" (101,6x15,9mm)", cat:"Ángulo", kg_m:23.36, largo:6, sup:0.3746 },
  { id:"GM_ANGULO_5_X_5_16_127X7_9MM", nombre:"Angulo 5\" x 5/16\" (127x7,9mm)", cat:"Ángulo", kg_m:15, largo:6, sup:0.4922, precio_usd_kg:1.38 },
  { id:"GM_ANGULO_5_X_3_8_127X9_5MM", nombre:"Angulo 5\" x 3/8\" (127x9,5mm)", cat:"Ángulo", kg_m:18, largo:6, sup:0.489, precio_usd_kg:1.38 },
  { id:"GM_ANGULO_5_X_1_2_127X12_7MM", nombre:"Angulo 5\" x 1/2\" (127x12,7mm)", cat:"Ángulo", kg_m:23, largo:6, sup:0.4826, precio_usd_kg:1.38 },
  { id:"GM_ANGULO_6_X_3_8_152_4X9_5MM", nombre:"Angulo 6\" x 3/8\" (152,4x9,5mm)", cat:"Ángulo", kg_m:22.17, largo:6, sup:0.5906 },
  { id:"GM_ANGULO_6_X_1_2_152_4X12_7MM", nombre:"Angulo 6\" x 1/2\" (152,4x12,7mm)", cat:"Ángulo", kg_m:29.17, largo:6, sup:0.5842 },
  { id:"GM_ANGULO_6_X_5_8_152_4X15_9MM", nombre:"Angulo 6\" x 5/8\" (152,4x15,9mm)", cat:"Ángulo", kg_m:36.01, largo:6, sup:0.5778 },
  { id:"GM_ANGULO_6_X_3_4_152_4X19_0MM", nombre:"Angulo 6\" x 3/4\" (152,4x19,0mm)", cat:"Ángulo", kg_m:42.71, largo:6, sup:0.5716 },
  { id:"GM_ANGULO_8_X_1_2_203_2X12_7MM", nombre:"Angulo 8\" x 1/2\" (203,2x12,7mm)", cat:"Ángulo", kg_m:39.29, largo:6, sup:0.7874 },
  { id:"GM_ANGULO_8_X_3_4_203_2X19_0MM", nombre:"Angulo 8\" x 3/4\" (203,2x19,0mm)", cat:"Ángulo", kg_m:57.89, largo:6, sup:0.7748 },
  { id:"GM_ANGULO_8_X_1_203_2X25_4MM", nombre:"Angulo 8\" x 1\" (203,2x25,4mm)", cat:"Ángulo", kg_m:75.9, largo:6, sup:0.762 },
  { id:"GM_ANGULO_30X30X3", nombre:"Angulo 30x30x3", cat:"Ángulo", kg_m:1.36, largo:6, sup:0.114 },
  { id:"GM_ANGULO_30X30X4", nombre:"Angulo 30x30x4", cat:"Ángulo", kg_m:1.78, largo:6, sup:0.112 },
  { id:"GM_ANGULO_40X40X3", nombre:"Angulo 40x40x3", cat:"Ángulo", kg_m:1.84, largo:6, sup:0.154 },
  { id:"GM_ANGULO_40X40X4", nombre:"Angulo 40x40x4", cat:"Ángulo", kg_m:2.42, largo:6, sup:0.152 },
  { id:"GM_ANGULO_40X40X5", nombre:"Angulo 40x40x5", cat:"Ángulo", kg_m:2.97, largo:6, sup:0.15 },
  { id:"GM_ANGULO_50X50X5", nombre:"Angulo 50x50x5", cat:"Ángulo", kg_m:3.77, largo:6, sup:0.19 },
  { id:"GM_ANGULO_50X50X6", nombre:"Angulo 50x50x6", cat:"Ángulo", kg_m:4.47, largo:6, sup:0.188 },
  { id:"GM_ANGULO_60X60X6", nombre:"Angulo 60x60x6", cat:"Ángulo", kg_m:5.42, largo:6, sup:0.228 },
  { id:"GM_ANGULO_60X60X7", nombre:"Angulo 60x60x7", cat:"Ángulo", kg_m:6.25, largo:6, sup:0.226 },
  { id:"GM_ANGULO_70X70X7", nombre:"Angulo 70x70x7", cat:"Ángulo", kg_m:7.38, largo:6, sup:0.266 },
  { id:"GM_ANGULO_75X75X8", nombre:"Angulo 75x75x8", cat:"Ángulo", kg_m:9.03, largo:6, sup:0.284 },
  { id:"GM_ANGULO_80X80X8", nombre:"Angulo 80x80x8", cat:"Ángulo", kg_m:9.66, largo:6, sup:0.304 },
  { id:"GM_ANGULO_80X80X10", nombre:"Angulo 80x80x10", cat:"Ángulo", kg_m:11.9, largo:6, sup:0.3 },
  { id:"GM_ANGULO_100X100X10", nombre:"Angulo 100x100x10", cat:"Ángulo", kg_m:15, largo:6, sup:0.38 },
  { id:"GM_ANGULO_100X100X12", nombre:"Angulo 100x100x12", cat:"Ángulo", kg_m:17.8, largo:6, sup:0.376 },
  { id:"GM_ANGULO_120X120X12", nombre:"Angulo 120x120x12", cat:"Ángulo", kg_m:21.6, largo:6, sup:0.456 },
  { id:"GM_ANGULO_150X150X15", nombre:"Angulo 150x150x15", cat:"Ángulo", kg_m:33.8, largo:6, sup:0.57 },
  { id:"GM_ANGULO_200X200X20", nombre:"Angulo 200x200x20", cat:"Ángulo", kg_m:60, largo:6, sup:0.76 },
  // Tubo cuadrado — 36 ítems (Planilla GM V26)
  { id:"GM_TUBO_CUAD_20X20X1_2", nombre:"Tubo Cuad 20x20x1,2", cat:"Tubo cuadrado", kg_m:0.71, largo:6, sup:0.08, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_20X20X2_0", nombre:"Tubo Cuad 20x20x2,0", cat:"Tubo cuadrado", kg_m:1.12, largo:6, sup:0.08, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_25X25X1_2", nombre:"Tubo Cuad 25x25x1,2", cat:"Tubo cuadrado", kg_m:0.9, largo:6, sup:0.1, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_25X25X1_6", nombre:"Tubo Cuad 25x25x1,6", cat:"Tubo cuadrado", kg_m:1.18, largo:6, sup:0.1, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_25X25X2_0", nombre:"Tubo Cuad 25x25x2,0", cat:"Tubo cuadrado", kg_m:1.43, largo:6, sup:0.1, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_30X30X1_2", nombre:"Tubo Cuad 30x30x1,2", cat:"Tubo cuadrado", kg_m:1.09, largo:6, sup:0.12, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_30X30X1_6", nombre:"Tubo Cuad 30x30x1,6", cat:"Tubo cuadrado", kg_m:1.43, largo:6, sup:0.12, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_30X30X2_0", nombre:"Tubo Cuad 30x30x2,0", cat:"Tubo cuadrado", kg_m:1.76, largo:6, sup:0.12, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_30X30X3_0", nombre:"Tubo Cuad 30x30x3,0", cat:"Tubo cuadrado", kg_m:2.52, largo:6, sup:0.12, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_40X40X1_6", nombre:"Tubo Cuad 40x40x1,6", cat:"Tubo cuadrado", kg_m:1.91, largo:6, sup:0.16, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_40X40X2_0", nombre:"Tubo Cuad 40x40x2,0", cat:"Tubo cuadrado", kg_m:2.36, largo:6, sup:0.16, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_40X40X3_0", nombre:"Tubo Cuad 40x40x3,0", cat:"Tubo cuadrado", kg_m:3.39, largo:6, sup:0.16, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_50X50X1_6", nombre:"Tubo Cuad 50x50x1,6", cat:"Tubo cuadrado", kg_m:2.41, largo:6, sup:0.2, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_50X50X2_0", nombre:"Tubo Cuad 50x50x2,0", cat:"Tubo cuadrado", kg_m:3, largo:6, sup:0.2, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_50X50X3_0", nombre:"Tubo Cuad 50x50x3,0", cat:"Tubo cuadrado", kg_m:4.35, largo:6, sup:0.2, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_50X50X4_0", nombre:"Tubo Cuad 50x50x4,0", cat:"Tubo cuadrado", kg_m:5.72, largo:6, sup:0.2, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_60X60X2_0", nombre:"Tubo Cuad 60x60x2,0", cat:"Tubo cuadrado", kg_m:3.62, largo:6, sup:0.24, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_60X60X3_0", nombre:"Tubo Cuad 60x60x3,0", cat:"Tubo cuadrado", kg_m:5.29, largo:6, sup:0.24, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_60X60X4_0", nombre:"Tubo Cuad 60x60x4,0", cat:"Tubo cuadrado", kg_m:6.97, largo:6, sup:0.24, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_80X80X2_0", nombre:"Tubo Cuad 80x80x2,0", cat:"Tubo cuadrado", kg_m:4.87, largo:6, sup:0.32, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_80X80X3_0", nombre:"Tubo Cuad 80x80x3,0", cat:"Tubo cuadrado", kg_m:7.22, largo:6, sup:0.32, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_80X80X4_0", nombre:"Tubo Cuad 80x80x4,0", cat:"Tubo cuadrado", kg_m:9.55, largo:6, sup:0.32, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_80X80X5_0", nombre:"Tubo Cuad 80x80x5,0", cat:"Tubo cuadrado", kg_m:11.8, largo:6, sup:0.32, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_100X100X3_0", nombre:"Tubo Cuad 100x100x3,0", cat:"Tubo cuadrado", kg_m:9.1, largo:6, sup:0.4, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_100X100X4_0", nombre:"Tubo Cuad 100x100x4,0", cat:"Tubo cuadrado", kg_m:12.1, largo:6, sup:0.4, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_100X100X5_0", nombre:"Tubo Cuad 100x100x5,0", cat:"Tubo cuadrado", kg_m:15, largo:6, sup:0.4, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_100X100X6_0", nombre:"Tubo Cuad 100x100x6,0", cat:"Tubo cuadrado", kg_m:17.5, largo:6, sup:0.4, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_120X120X4_0", nombre:"Tubo Cuad 120x120x4,0", cat:"Tubo cuadrado", kg_m:14.6, largo:6, sup:0.48, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_120X120X5_0", nombre:"Tubo Cuad 120x120x5,0", cat:"Tubo cuadrado", kg_m:18.2, largo:6, sup:0.48, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_120X120X6_0", nombre:"Tubo Cuad 120x120x6,0", cat:"Tubo cuadrado", kg_m:20.5, largo:6, sup:0.48, precio_usd_kg:1.27 },
  { id:"GM_TUBO_CUAD_150X150X5_0", nombre:"Tubo Cuad 150x150x5,0", cat:"Tubo cuadrado", kg_m:22.9, largo:6, sup:0.6, precio_usd_kg:1.33 },
  { id:"GM_TUBO_CUAD_150X150X6_0", nombre:"Tubo Cuad 150x150x6,0", cat:"Tubo cuadrado", kg_m:27.5, largo:6, sup:0.6, precio_usd_kg:1.33 },
  { id:"GM_TUBO_CUAD_150X150X8_0", nombre:"Tubo Cuad 150x150x8,0", cat:"Tubo cuadrado", kg_m:34.8, largo:6, sup:0.6, precio_usd_kg:1.33 },
  { id:"GM_TUBO_CUAD_200X200X6_0", nombre:"Tubo Cuad 200x200x6,0", cat:"Tubo cuadrado", kg_m:36.8, largo:6, sup:0.8, precio_usd_kg:1.33 },
  { id:"GM_TUBO_CUAD_200X200X8_0", nombre:"Tubo Cuad 200x200x8,0", cat:"Tubo cuadrado", kg_m:48.5, largo:6, sup:0.8, precio_usd_kg:1.33 },
  { id:"GM_TUBO_CUAD_200X200X10_0", nombre:"Tubo Cuad 200x200x10,0", cat:"Tubo cuadrado", kg_m:60, largo:6, sup:0.8, precio_usd_kg:1.33 },
  // Tubo rectangular — 43 ítems (Planilla GM V26)
  { id:"GM_TUBO_RECT_30X20X1_2", nombre:"Tubo Rect 30x20x1,2", cat:"Tubo rectangular", kg_m:0.86, largo:6, sup:0.1, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_30X20X1_6", nombre:"Tubo Rect 30x20x1,6", cat:"Tubo rectangular", kg_m:1.12, largo:6, sup:0.1, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_40X20X1_2", nombre:"Tubo Rect 40x20x1,2", cat:"Tubo rectangular", kg_m:1.05, largo:6, sup:0.12, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_40X20X1_6", nombre:"Tubo Rect 40x20x1,6", cat:"Tubo rectangular", kg_m:1.37, largo:6, sup:0.12, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_40X20X2_0", nombre:"Tubo Rect 40x20x2,0", cat:"Tubo rectangular", kg_m:1.68, largo:6, sup:0.12, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_40X25X1_6", nombre:"Tubo Rect 40x25x1,6", cat:"Tubo rectangular", kg_m:1.45, largo:6, sup:0.13, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_40X25X2_0", nombre:"Tubo Rect 40x25x2,0", cat:"Tubo rectangular", kg_m:1.78, largo:6, sup:0.13, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_50X25X1_6", nombre:"Tubo Rect 50x25x1,6", cat:"Tubo rectangular", kg_m:1.69, largo:6, sup:0.15, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_50X25X2_0", nombre:"Tubo Rect 50x25x2,0", cat:"Tubo rectangular", kg_m:2.09, largo:6, sup:0.15, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_50X30X1_6", nombre:"Tubo Rect 50x30x1,6", cat:"Tubo rectangular", kg_m:1.85, largo:6, sup:0.16, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_50X30X2_0", nombre:"Tubo Rect 50x30x2,0", cat:"Tubo rectangular", kg_m:2.3, largo:6, sup:0.16, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_60X40X1_6", nombre:"Tubo Rect 60x40x1,6", cat:"Tubo rectangular", kg_m:2.36, largo:6, sup:0.2, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_60X40X2_0", nombre:"Tubo Rect 60x40x2,0", cat:"Tubo rectangular", kg_m:2.93, largo:6, sup:0.2, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_60X40X3_0", nombre:"Tubo Rect 60x40x3,0", cat:"Tubo rectangular", kg_m:4.3, largo:6, sup:0.2, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_80X40X2_0", nombre:"Tubo Rect 80x40x2,0", cat:"Tubo rectangular", kg_m:3.55, largo:6, sup:0.24, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_80X40X3_0", nombre:"Tubo Rect 80x40x3,0", cat:"Tubo rectangular", kg_m:5.18, largo:6, sup:0.24, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_80X60X2_5", nombre:"Tubo Rect 80x60x2,5", cat:"Tubo rectangular", kg_m:5.17, largo:6, sup:0.28, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_80X60X3_0", nombre:"Tubo Rect 80x60x3,0", cat:"Tubo rectangular", kg_m:6.13, largo:6, sup:0.28, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_100X50X2_0", nombre:"Tubo Rect 100x50x2,0", cat:"Tubo rectangular", kg_m:4.5, largo:6, sup:0.3, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_100X50X3_0", nombre:"Tubo Rect 100x50x3,0", cat:"Tubo rectangular", kg_m:6.6, largo:6, sup:0.3, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_100X50X4_0", nombre:"Tubo Rect 100x50x4,0", cat:"Tubo rectangular", kg_m:8.76, largo:6, sup:0.3, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_100X60X3_0", nombre:"Tubo Rect 100x60x3,0", cat:"Tubo rectangular", kg_m:6.9, largo:6, sup:0.32, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_100X60X4_0", nombre:"Tubo Rect 100x60x4,0", cat:"Tubo rectangular", kg_m:9.2, largo:6, sup:0.32, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_120X60X3_0", nombre:"Tubo Rect 120x60x3,0", cat:"Tubo rectangular", kg_m:8, largo:6, sup:0.36, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_120X60X4_0", nombre:"Tubo Rect 120x60x4,0", cat:"Tubo rectangular", kg_m:10.6, largo:6, sup:0.36, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_120X60X5_0", nombre:"Tubo Rect 120x60x5,0", cat:"Tubo rectangular", kg_m:13.2, largo:6, sup:0.36, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_120X80X4_0", nombre:"Tubo Rect 120x80x4,0", cat:"Tubo rectangular", kg_m:11.7, largo:6, sup:0.4, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_120X80X5_0", nombre:"Tubo Rect 120x80x5,0", cat:"Tubo rectangular", kg_m:14.5, largo:6, sup:0.4, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_140X80X5_0", nombre:"Tubo Rect 140x80x5,0", cat:"Tubo rectangular", kg_m:16, largo:6, sup:0.44, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_150X50X4_0", nombre:"Tubo Rect 150x50x4,0", cat:"Tubo rectangular", kg_m:11.6, largo:6, sup:0.4, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_150X100X5_0", nombre:"Tubo Rect 150x100x5,0", cat:"Tubo rectangular", kg_m:18.33, largo:6, sup:0.5, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_160X80X4_0", nombre:"Tubo Rect 160x80x4,0", cat:"Tubo rectangular", kg_m:14.3, largo:6, sup:0.48, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_160X80X5_0", nombre:"Tubo Rect 160x80x5,0", cat:"Tubo rectangular", kg_m:17.7, largo:6, sup:0.48, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_200X100X4_0", nombre:"Tubo Rect 200x100x4,0", cat:"Tubo rectangular", kg_m:17.8, largo:6, sup:0.6, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_200X100X5_0", nombre:"Tubo Rect 200x100x5,0", cat:"Tubo rectangular", kg_m:22.1, largo:6, sup:0.6, precio_usd_kg:1.33 },
  { id:"GM_TUBO_RECT_200X100X6_0", nombre:"Tubo Rect 200x100x6,0", cat:"Tubo rectangular", kg_m:26.4, largo:6, sup:0.6, precio_usd_kg:1.33 },
  { id:"GM_TUBO_RECT_200X100X8_0", nombre:"Tubo Rect 200x100x8,0", cat:"Tubo rectangular", kg_m:34.4, largo:6, sup:0.6, precio_usd_kg:1.33 },
  { id:"GM_TUBO_RECT_200X100X10_0", nombre:"Tubo Rect 200x100x10,0", cat:"Tubo rectangular", kg_m:42.2, largo:6, sup:0.6, precio_usd_kg:1.33 },
  { id:"GM_TUBO_RECT_250X150X6_0", nombre:"Tubo Rect 250x150x6,0", cat:"Tubo rectangular", kg_m:35.82, largo:6, sup:0.8, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_250X150X8_0", nombre:"Tubo Rect 250x150x8,0", cat:"Tubo rectangular", kg_m:46.94, largo:6, sup:0.8, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_300X200X6_0", nombre:"Tubo Rect 300x200x6,0", cat:"Tubo rectangular", kg_m:43.5, largo:6, sup:1, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_300X200X8_0", nombre:"Tubo Rect 300x200x8,0", cat:"Tubo rectangular", kg_m:57.5, largo:6, sup:1, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RECT_300X200X10_0", nombre:"Tubo Rect 300x200x10,0", cat:"Tubo rectangular", kg_m:71.4, largo:6, sup:1, precio_usd_kg:1.27 },
  // Tubo redondo — 37 ítems (Planilla GM V26)
  { id:"GM_TUBO_RED_19_0X1_2", nombre:"Tubo Red 19,0x1,2", cat:"Tubo redondo", kg_m:0.53, largo:6, sup:0.0597, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_19_0X2_0", nombre:"Tubo Red 19,0x2,0", cat:"Tubo redondo", kg_m:0.84, largo:6, sup:0.0597, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_25_0X1_2", nombre:"Tubo Red 25,0x1,2", cat:"Tubo redondo", kg_m:0.71, largo:6, sup:0.0785, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_25_0X2_0", nombre:"Tubo Red 25,0x2,0", cat:"Tubo redondo", kg_m:1.15, largo:6, sup:0.0785, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_25_4X2_0", nombre:"Tubo Red 25,4x2,0", cat:"Tubo redondo", kg_m:1.15, largo:6, sup:0.0798, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_31_8X1_6", nombre:"Tubo Red 31,8x1,6", cat:"Tubo redondo", kg_m:1.2, largo:6, sup:0.0999, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_31_8X2_0", nombre:"Tubo Red 31,8x2,0", cat:"Tubo redondo", kg_m:1.48, largo:6, sup:0.0999, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_38_1X1_6", nombre:"Tubo Red 38,1x1,6", cat:"Tubo redondo", kg_m:1.45, largo:6, sup:0.1197, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_38_1X2_0", nombre:"Tubo Red 38,1x2,0", cat:"Tubo redondo", kg_m:1.79, largo:6, sup:0.1197, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_38_1X2_3", nombre:"Tubo Red 38,1x2,3", cat:"Tubo redondo", kg_m:2.03, largo:6, sup:0.1197, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_38_1X3_0", nombre:"Tubo Red 38,1x3,0", cat:"Tubo redondo", kg_m:2.59, largo:6, sup:0.1197, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_42_4X1_6", nombre:"Tubo Red 42,4x1,6", cat:"Tubo redondo", kg_m:1.62, largo:6, sup:0.1332, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_42_4X2_0", nombre:"Tubo Red 42,4x2,0", cat:"Tubo redondo", kg_m:2.01, largo:6, sup:0.1332, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_42_4X2_6", nombre:"Tubo Red 42,4x2,6", cat:"Tubo redondo", kg_m:2.55, largo:6, sup:0.1332, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_42_4X3_0", nombre:"Tubo Red 42,4x3,0", cat:"Tubo redondo", kg_m:2.93, largo:6, sup:0.1332, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_50_8X1_6", nombre:"Tubo Red 50,8x1,6", cat:"Tubo redondo", kg_m:1.96, largo:6, sup:0.1596, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_50_8X2_0", nombre:"Tubo Red 50,8x2,0", cat:"Tubo redondo", kg_m:2.44, largo:6, sup:0.1596, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_50_8X3_0", nombre:"Tubo Red 50,8x3,0", cat:"Tubo redondo", kg_m:3.54, largo:6, sup:0.1596, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_50_8X4_0", nombre:"Tubo Red 50,8x4,0", cat:"Tubo redondo", kg_m:4.61, largo:6, sup:0.1596, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_60_3X2_0", nombre:"Tubo Red 60,3x2,0", cat:"Tubo redondo", kg_m:2.92, largo:6, sup:0.1894, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_60_3X3_0", nombre:"Tubo Red 60,3x3,0", cat:"Tubo redondo", kg_m:4.26, largo:6, sup:0.1894, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_60_3X4_0", nombre:"Tubo Red 60,3x4,0", cat:"Tubo redondo", kg_m:5.55, largo:6, sup:0.1894, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_76_2X2_0", nombre:"Tubo Red 76,2x2,0", cat:"Tubo redondo", kg_m:3.7, largo:6, sup:0.2394, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_76_2X3_0", nombre:"Tubo Red 76,2x3,0", cat:"Tubo redondo", kg_m:5.42, largo:6, sup:0.2394, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_76_2X4_0", nombre:"Tubo Red 76,2x4,0", cat:"Tubo redondo", kg_m:7.1, largo:6, sup:0.2394, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_88_9X3_0", nombre:"Tubo Red 88,9x3,0", cat:"Tubo redondo", kg_m:6.36, largo:6, sup:0.2793, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_88_9X4_0", nombre:"Tubo Red 88,9x4,0", cat:"Tubo redondo", kg_m:8.38, largo:6, sup:0.2793, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_101_6X2_0", nombre:"Tubo Red 101,6x2,0", cat:"Tubo redondo", kg_m:4.93, largo:6, sup:0.3192, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_101_6X3_0", nombre:"Tubo Red 101,6x3,0", cat:"Tubo redondo", kg_m:7.32, largo:6, sup:0.3192, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_101_6X4_7", nombre:"Tubo Red 101,6x4,7", cat:"Tubo redondo", kg_m:11.2, largo:6, sup:0.3192, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_114_3X3_0", nombre:"Tubo Red 114,3x3,0", cat:"Tubo redondo", kg_m:8.23, largo:6, sup:0.3591, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_114_3X4_5", nombre:"Tubo Red 114,3x4,5", cat:"Tubo redondo", kg_m:12.15, largo:6, sup:0.3591, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_168_3X4_8", nombre:"Tubo Red 168,3x4,8", cat:"Tubo redondo", kg_m:19.3, largo:6, sup:0.5287, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_219_1X6_0", nombre:"Tubo Red 219,1x6,0", cat:"Tubo redondo", kg_m:31.5, largo:6, sup:0.6883, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_219_1X8_0", nombre:"Tubo Red 219,1x8,0", cat:"Tubo redondo", kg_m:41.6, largo:6, sup:0.6883, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_273_0X6_3", nombre:"Tubo Red 273,0x6,3", cat:"Tubo redondo", kg_m:41.4, largo:6, sup:0.8577, precio_usd_kg:1.27 },
  { id:"GM_TUBO_RED_323_9X7_1", nombre:"Tubo Red 323,9x7,1", cat:"Tubo redondo", kg_m:55.4, largo:6, sup:1.0176, precio_usd_kg:1.27 },
  // Caño SCH40 — 14 ítems (Planilla GM V26)
  { id:"GM_CANO_SCH_40_1_2_21_3X2_77", nombre:"Caño SCH 40 1/2\" (21,3x2,77)", cat:"Caño SCH40", kg_m:1.27, largo:6, sup:0.0669, precio_usd_kg:5.25 },
  { id:"GM_CANO_SCH_40_3_4_26_7X2_87", nombre:"Caño SCH 40 3/4\" (26,7x2,87)", cat:"Caño SCH40", kg_m:1.69, largo:6, sup:0.0839 },
  { id:"GM_CANO_SCH_40_1_33_4X3_38", nombre:"Caño SCH 40 1\" (33,4x3,38)", cat:"Caño SCH40", kg_m:2.5, largo:6, sup:0.1049, precio_usd_kg:3.29 },
  { id:"GM_CANO_SCH_40_1_1_4_42_2X3_56", nombre:"Caño SCH 40 1 1/4\" (42,2x3,56)", cat:"Caño SCH40", kg_m:3.39, largo:6, sup:0.1326, precio_usd_kg:3.28 },
  { id:"GM_CANO_SCH_40_1_1_2_48_3X3_68", nombre:"Caño SCH 40 1 1/2\" (48,3x3,68)", cat:"Caño SCH40", kg_m:4.05, largo:6, sup:0.1517, precio_usd_kg:1.93 },
  { id:"GM_CANO_SCH_40_2_60_3X3_91", nombre:"Caño SCH 40 2\" (60,3x3,91)", cat:"Caño SCH40", kg_m:5.44, largo:6, sup:0.1894, precio_usd_kg:3.19 },
  { id:"GM_CANO_SCH_40_2_1_2_73_0X5_16", nombre:"Caño SCH 40 2 1/2\" (73,0x5,16)", cat:"Caño SCH40", kg_m:8.63, largo:6, sup:0.2293, precio_usd_kg:2.75 },
  { id:"GM_CANO_SCH_40_3_88_9X5_49", nombre:"Caño SCH 40 3\" (88,9x5,49)", cat:"Caño SCH40", kg_m:11.29, largo:6, sup:0.2793, precio_usd_kg:2.74 },
  { id:"GM_CANO_SCH_40_4_114_3X6_02", nombre:"Caño SCH 40 4\" (114,3x6,02)", cat:"Caño SCH40", kg_m:16.07, largo:6, sup:0.3591, precio_usd_kg:2.95 },
  { id:"GM_CANO_SCH_40_5_141_3X6_55", nombre:"Caño SCH 40 5\" (141,3x6,55)", cat:"Caño SCH40", kg_m:21.77, largo:6, sup:0.4439, precio_usd_kg:2.06 },
  { id:"GM_CANO_SCH_40_6_168_3X7_11", nombre:"Caño SCH 40 6\" (168,3x7,11)", cat:"Caño SCH40", kg_m:28.26, largo:6, sup:0.5287, precio_usd_kg:2.85 },
  { id:"GM_CANO_SCH_40_8_219_1X8_18", nombre:"Caño SCH 40 8\" (219,1x8,18)", cat:"Caño SCH40", kg_m:42.55, largo:6, sup:0.6883, precio_usd_kg:2.85 },
  { id:"GM_CANO_SCH_40_10_273_0X9_27", nombre:"Caño SCH 40 10\" (273,0x9,27)", cat:"Caño SCH40", kg_m:60.32, largo:6, sup:0.8577, precio_usd_kg:1.83 },
  { id:"GM_CANO_SCH_40_12_323_8X10_31", nombre:"Caño SCH 40 12\" (323,8x10,31)", cat:"Caño SCH40", kg_m:79.73, largo:6, sup:1.0172, precio_usd_kg:4.22 },
  // Caño SCH80 — 13 ítems (Planilla GM V26)
  { id:"GM_CANO_SCH_80_1_2_21_3X3_73", nombre:"Caño SCH 80 1/2\" (21,3x3,73)", cat:"Caño SCH80", kg_m:1.62, largo:6, sup:0.0669 },
  { id:"GM_CANO_SCH_80_3_4_26_7X3_91", nombre:"Caño SCH 80 3/4\" (26,7x3,91)", cat:"Caño SCH80", kg_m:2.2, largo:6, sup:0.0839 },
  { id:"GM_CANO_SCH_80_1_33_4X4_55", nombre:"Caño SCH 80 1\" (33,4x4,55)", cat:"Caño SCH80", kg_m:3.24, largo:6, sup:0.1049 },
  { id:"GM_CANO_SCH_80_1_1_4_42_2X4_85", nombre:"Caño SCH 80 1 1/4\" (42,2x4,85)", cat:"Caño SCH80", kg_m:4.32, largo:6, sup:0.1326, precio_usd_kg:3.55 },
  { id:"GM_CANO_SCH_80_1_1_2_48_3X5_08", nombre:"Caño SCH 80 1 1/2\" (48,3x5,08)", cat:"Caño SCH80", kg_m:5.41, largo:6, sup:0.1517, precio_usd_kg:3.33 },
  { id:"GM_CANO_SCH_80_2_60_3X5_54", nombre:"Caño SCH 80 2\" (60,3x5,54)", cat:"Caño SCH80", kg_m:7.48, largo:6, sup:0.1894, precio_usd_kg:3.50 },
  { id:"GM_CANO_SCH_80_2_1_2_73_0X7_01", nombre:"Caño SCH 80 2 1/2\" (73,0x7,01)", cat:"Caño SCH80", kg_m:11.4, largo:6, sup:0.2293, precio_usd_kg:2.03 },
  { id:"GM_CANO_SCH_80_3_88_9X7_62", nombre:"Caño SCH 80 3\" (88,9x7,62)", cat:"Caño SCH80", kg_m:15.27, largo:6, sup:0.2793, precio_usd_kg:3.22 },
  { id:"GM_CANO_SCH_80_4_114_3X8_56", nombre:"Caño SCH 80 4\" (114,3x8,56)", cat:"Caño SCH80", kg_m:22.32, largo:6, sup:0.3591, precio_usd_kg:2.60 },
  { id:"GM_CANO_SCH_80_6_168_3X10_97", nombre:"Caño SCH 80 6\" (168,3x10,97)", cat:"Caño SCH80", kg_m:42.56, largo:6, sup:0.5287, precio_usd_kg:3.22 },
  { id:"GM_CANO_SCH_80_8_219_1X12_70", nombre:"Caño SCH 80 8\" (219,1x12,70)", cat:"Caño SCH80", kg_m:64.66, largo:6, sup:0.6883, precio_usd_kg:3.22 },
  { id:"GM_CANO_SCH_80_10_273_0X15_09", nombre:"Caño SCH 80 10\" (273,0x15,09)", cat:"Caño SCH80", kg_m:96.01, largo:6, sup:0.8577 },
  { id:"GM_CANO_SCH_80_12_323_8X17_48", nombre:"Caño SCH 80 12\" (323,8x17,48)", cat:"Caño SCH80", kg_m:132.08, largo:6, sup:1.0172 },
  // Caño Galvanizado — 9 ítems (Planilla GM V26)
  { id:"GM_CANO_GALV_1_2_SCH_40", nombre:"Caño Galv. 1/2\" SCH 40", cat:"Caño Galvanizado", kg_m:1.27, largo:6, sup:0.0669 },
  { id:"GM_CANO_GALV_3_4_SCH_40", nombre:"Caño Galv. 3/4\" SCH 40", cat:"Caño Galvanizado", kg_m:1.69, largo:6, sup:0.0839 },
  { id:"GM_CANO_GALV_1_SCH_40", nombre:"Caño Galv. 1\" SCH 40", cat:"Caño Galvanizado", kg_m:2.5, largo:6, sup:0.1049 },
  { id:"GM_CANO_GALV_1_1_4_SCH_40", nombre:"Caño Galv. 1 1/4\" SCH 40", cat:"Caño Galvanizado", kg_m:3.39, largo:6, sup:0.1326 },
  { id:"GM_CANO_GALV_1_1_2_SCH_40", nombre:"Caño Galv. 1 1/2\" SCH 40", cat:"Caño Galvanizado", kg_m:4.05, largo:6, sup:0.1517 },
  { id:"GM_CANO_GALV_2_SCH_40", nombre:"Caño Galv. 2\" SCH 40", cat:"Caño Galvanizado", kg_m:5.44, largo:6, sup:0.1894 },
  { id:"GM_CANO_GALV_3_SCH_40", nombre:"Caño Galv. 3\" SCH 40", cat:"Caño Galvanizado", kg_m:11.29, largo:6, sup:0.2793 },
  { id:"GM_CANO_GALV_4_SCH_40", nombre:"Caño Galv. 4\" SCH 40", cat:"Caño Galvanizado", kg_m:16.07, largo:6, sup:0.3591 },
  { id:"GM_CANO_GALV_6_SCH_40", nombre:"Caño Galv. 6\" SCH 40", cat:"Caño Galvanizado", kg_m:28.26, largo:6, sup:0.5287 },
  // Redondo liso — 31 ítems (Planilla GM V26)
  { id:"GM_REDONDO_LISO_6_MM", nombre:"Redondo Liso Ø 6 mm", cat:"Redondo liso", kg_m:0.222, largo:6, sup:0.0188, precio_usd_kg:1.52 },
  { id:"GM_REDONDO_LISO_8_MM", nombre:"Redondo Liso Ø 8 mm", cat:"Redondo liso", kg_m:0.395, largo:6, sup:0.0251, precio_usd_kg:1.52 },
  { id:"GM_REDONDO_LISO_10_MM", nombre:"Redondo Liso Ø 10 mm", cat:"Redondo liso", kg_m:0.617, largo:6, sup:0.0314, precio_usd_kg:1.52 },
  { id:"GM_REDONDO_LISO_12_MM", nombre:"Redondo Liso Ø 12 mm", cat:"Redondo liso", kg_m:0.888, largo:6, sup:0.0377, precio_usd_kg:1.52 },
  { id:"GM_REDONDO_LISO_14_MM", nombre:"Redondo Liso Ø 14 mm", cat:"Redondo liso", kg_m:1.208, largo:6, sup:0.044, precio_usd_kg:1.52 },
  { id:"GM_REDONDO_LISO_16_MM", nombre:"Redondo Liso Ø 16 mm", cat:"Redondo liso", kg_m:1.578, largo:6, sup:0.0503, precio_usd_kg:1.52 },
  { id:"GM_REDONDO_LISO_18_MM", nombre:"Redondo Liso Ø 18 mm", cat:"Redondo liso", kg_m:1.998, largo:6, sup:0.0565 },
  { id:"GM_REDONDO_LISO_20_MM", nombre:"Redondo Liso Ø 20 mm", cat:"Redondo liso", kg_m:2.466, largo:6, sup:0.0628, precio_usd_kg:1.52 },
  { id:"GM_REDONDO_LISO_22_MM", nombre:"Redondo Liso Ø 22 mm", cat:"Redondo liso", kg_m:2.984, largo:6, sup:0.0691, precio_usd_kg:1.52 },
  { id:"GM_REDONDO_LISO_25_MM", nombre:"Redondo Liso Ø 25 mm", cat:"Redondo liso", kg_m:3.853, largo:6, sup:0.0785, precio_usd_kg:1.52 },
  { id:"GM_REDONDO_LISO_28_MM", nombre:"Redondo Liso Ø 28 mm", cat:"Redondo liso", kg_m:4.834, largo:6, sup:0.088 },
  { id:"GM_REDONDO_LISO_32_MM", nombre:"Redondo Liso Ø 32 mm", cat:"Redondo liso", kg_m:6.313, largo:6, sup:0.1005, precio_usd_kg:1.52 },
  { id:"GM_REDONDO_LISO_36_MM", nombre:"Redondo Liso Ø 36 mm", cat:"Redondo liso", kg_m:7.99, largo:6, sup:0.1131 },
  { id:"GM_REDONDO_LISO_40_MM", nombre:"Redondo Liso Ø 40 mm", cat:"Redondo liso", kg_m:9.86, largo:6, sup:0.1257 },
  { id:"GM_REDONDO_LISO_45_MM", nombre:"Redondo Liso Ø 45 mm", cat:"Redondo liso", kg_m:12.49, largo:6, sup:0.1414 },
  { id:"GM_REDONDO_LISO_50_MM", nombre:"Redondo Liso Ø 50 mm", cat:"Redondo liso", kg_m:15.413, largo:6, sup:0.1571 },
  { id:"GM_REDONDO_LISO_55_MM", nombre:"Redondo Liso Ø 55 mm", cat:"Redondo liso", kg_m:18.7, largo:6, sup:0.1728 },
  { id:"GM_REDONDO_LISO_60_MM", nombre:"Redondo Liso Ø 60 mm", cat:"Redondo liso", kg_m:22.2, largo:6, sup:0.1885 },
  { id:"GM_REDONDO_LISO_65_MM", nombre:"Redondo Liso Ø 65 mm", cat:"Redondo liso", kg_m:26, largo:6, sup:0.2042 },
  { id:"GM_REDONDO_LISO_70_MM", nombre:"Redondo Liso Ø 70 mm", cat:"Redondo liso", kg_m:30.2, largo:6, sup:0.2199 },
  { id:"GM_REDONDO_LISO_75_MM", nombre:"Redondo Liso Ø 75 mm", cat:"Redondo liso", kg_m:34.7, largo:6, sup:0.2356 },
  { id:"GM_REDONDO_LISO_80_MM", nombre:"Redondo Liso Ø 80 mm", cat:"Redondo liso", kg_m:39.5, largo:6, sup:0.2513 },
  { id:"GM_REDONDO_LISO_85_MM", nombre:"Redondo Liso Ø 85 mm", cat:"Redondo liso", kg_m:44.5, largo:6, sup:0.267 },
  { id:"GM_REDONDO_LISO_90_MM", nombre:"Redondo Liso Ø 90 mm", cat:"Redondo liso", kg_m:49.9, largo:6, sup:0.2827 },
  { id:"GM_REDONDO_LISO_100_MM", nombre:"Redondo Liso Ø 100 mm", cat:"Redondo liso", kg_m:61.65, largo:6, sup:0.3142 },
  { id:"GM_REDONDO_LISO_110_MM", nombre:"Redondo Liso Ø 110 mm", cat:"Redondo liso", kg_m:74.6, largo:6, sup:0.3456 },
  { id:"GM_REDONDO_LISO_120_MM", nombre:"Redondo Liso Ø 120 mm", cat:"Redondo liso", kg_m:88.8, largo:6, sup:0.377 },
  { id:"GM_REDONDO_LISO_130_MM", nombre:"Redondo Liso Ø 130 mm", cat:"Redondo liso", kg_m:104, largo:6, sup:0.4084 },
  { id:"GM_REDONDO_LISO_150_MM", nombre:"Redondo Liso Ø 150 mm", cat:"Redondo liso", kg_m:138.7, largo:6, sup:0.4712 },
  { id:"GM_REDONDO_LISO_180_MM", nombre:"Redondo Liso Ø 180 mm", cat:"Redondo liso", kg_m:199.8, largo:6, sup:0.5655 },
  { id:"GM_REDONDO_LISO_200_MM", nombre:"Redondo Liso Ø 200 mm", cat:"Redondo liso", kg_m:246.6, largo:6, sup:0.6283 },
  // Barra conformada — 13 ítems (Planilla GM V26)
  { id:"GM_BARRA_CONF_6_MM", nombre:"Barra Conf. Ø 6 mm", cat:"Barra conformada", kg_m:0.222, largo:6, sup:0.0188 },
  { id:"GM_BARRA_CONF_8_MM", nombre:"Barra Conf. Ø 8 mm", cat:"Barra conformada", kg_m:0.395, largo:6, sup:0.0251 },
  { id:"GM_BARRA_CONF_10_MM", nombre:"Barra Conf. Ø 10 mm", cat:"Barra conformada", kg_m:0.617, largo:6, sup:0.0314 },
  { id:"GM_BARRA_CONF_12_MM", nombre:"Barra Conf. Ø 12 mm", cat:"Barra conformada", kg_m:0.888, largo:6, sup:0.0377 },
  { id:"GM_BARRA_CONF_16_MM", nombre:"Barra Conf. Ø 16 mm", cat:"Barra conformada", kg_m:1.58, largo:6, sup:0.0503 },
  { id:"GM_BARRA_CONF_20_MM", nombre:"Barra Conf. Ø 20 mm", cat:"Barra conformada", kg_m:2.47, largo:6, sup:0.0628 },
  { id:"GM_BARRA_CONF_25_MM", nombre:"Barra Conf. Ø 25 mm", cat:"Barra conformada", kg_m:3.85, largo:6, sup:0.0785 },
  { id:"GM_BARRA_CONF_28_MM", nombre:"Barra Conf. Ø 28 mm", cat:"Barra conformada", kg_m:4.83, largo:6, sup:0.088 },
  { id:"GM_BARRA_CONF_32_MM", nombre:"Barra Conf. Ø 32 mm", cat:"Barra conformada", kg_m:6.31, largo:6, sup:0.1005 },
  { id:"GM_BARRA_CONF_36_MM", nombre:"Barra Conf. Ø 36 mm", cat:"Barra conformada", kg_m:7.99, largo:6, sup:0.1131 },
  { id:"GM_BARRA_CONF_40_MM", nombre:"Barra Conf. Ø 40 mm", cat:"Barra conformada", kg_m:9.86, largo:6, sup:0.1257 },
  { id:"GM_BARRA_CONF_45_MM", nombre:"Barra Conf. Ø 45 mm", cat:"Barra conformada", kg_m:12.5, largo:6, sup:0.1414 },
  { id:"GM_BARRA_CONF_50_MM", nombre:"Barra Conf. Ø 50 mm", cat:"Barra conformada", kg_m:15.413, largo:6, sup:0.1571 },
  // Cuadrado macizo — 12 ítems (Planilla GM V26)
  { id:"GM_CUADRADO_LISO_8_MM", nombre:"Cuadrado Liso 8 mm", cat:"Cuadrado macizo", kg_m:0.5, largo:6, sup:0.032, precio_usd_kg:1.22 },
  { id:"GM_CUADRADO_LISO_10_MM", nombre:"Cuadrado Liso 10 mm", cat:"Cuadrado macizo", kg_m:0.79, largo:6, sup:0.04, precio_usd_kg:1.17 },
  { id:"GM_CUADRADO_LISO_12_MM", nombre:"Cuadrado Liso 12 mm", cat:"Cuadrado macizo", kg_m:1.13, largo:6, sup:0.048 },
  { id:"GM_CUADRADO_LISO_14_MM", nombre:"Cuadrado Liso 14 mm", cat:"Cuadrado macizo", kg_m:1.54, largo:6, sup:0.056 },
  { id:"GM_CUADRADO_LISO_16_MM", nombre:"Cuadrado Liso 16 mm", cat:"Cuadrado macizo", kg_m:2.01, largo:6, sup:0.064, precio_usd_kg:1.17 },
  { id:"GM_CUADRADO_LISO_18_MM", nombre:"Cuadrado Liso 18 mm", cat:"Cuadrado macizo", kg_m:2.54, largo:6, sup:0.072 },
  { id:"GM_CUADRADO_LISO_20_MM", nombre:"Cuadrado Liso 20 mm", cat:"Cuadrado macizo", kg_m:3.14, largo:6, sup:0.08, precio_usd_kg:1.17 },
  { id:"GM_CUADRADO_LISO_25_MM", nombre:"Cuadrado Liso 25 mm", cat:"Cuadrado macizo", kg_m:4.91, largo:6, sup:0.1 },
  { id:"GM_CUADRADO_LISO_30_MM", nombre:"Cuadrado Liso 30 mm", cat:"Cuadrado macizo", kg_m:7.07, largo:6, sup:0.12 },
  { id:"GM_CUADRADO_LISO_40_MM", nombre:"Cuadrado Liso 40 mm", cat:"Cuadrado macizo", kg_m:12.6, largo:6, sup:0.16, precio_usd_kg:1.17 },
  { id:"GM_CUADRADO_LISO_50_MM", nombre:"Cuadrado Liso 50 mm", cat:"Cuadrado macizo", kg_m:19.6, largo:6, sup:0.2 },
  { id:"GM_CUADRADO_LISO_60_MM", nombre:"Cuadrado Liso 60 mm", cat:"Cuadrado macizo", kg_m:28.3, largo:6, sup:0.24 },
  // Hexagonal — 18 ítems (Planilla GM V26)
  { id:"GM_HEXAGONAL_14_MM", nombre:"Hexagonal 14 mm", cat:"Hexagonal", kg_m:1.34, largo:6, sup:0.042 },
  { id:"GM_HEXAGONAL_17_MM", nombre:"Hexagonal 17 mm", cat:"Hexagonal", kg_m:1.98, largo:6, sup:0.051 },
  { id:"GM_HEXAGONAL_19_MM", nombre:"Hexagonal 19 mm", cat:"Hexagonal", kg_m:2.48, largo:6, sup:0.057 },
  { id:"GM_HEXAGONAL_22_MM", nombre:"Hexagonal 22 mm", cat:"Hexagonal", kg_m:3.32, largo:6, sup:0.066 },
  { id:"GM_HEXAGONAL_24_MM", nombre:"Hexagonal 24 mm", cat:"Hexagonal", kg_m:3.96, largo:6, sup:0.072 },
  { id:"GM_HEXAGONAL_27_MM", nombre:"Hexagonal 27 mm", cat:"Hexagonal", kg_m:5.02, largo:6, sup:0.081 },
  { id:"GM_HEXAGONAL_30_MM", nombre:"Hexagonal 30 mm", cat:"Hexagonal", kg_m:6.2, largo:6, sup:0.09 },
  { id:"GM_HEXAGONAL_32_MM", nombre:"Hexagonal 32 mm", cat:"Hexagonal", kg_m:7.04, largo:6, sup:0.096 },
  { id:"GM_HEXAGONAL_36_MM", nombre:"Hexagonal 36 mm", cat:"Hexagonal", kg_m:8.91, largo:6, sup:0.108 },
  { id:"GM_HEXAGONAL_41_MM", nombre:"Hexagonal 41 mm", cat:"Hexagonal", kg_m:11.6, largo:6, sup:0.123 },
  { id:"GM_HEXAGONAL_46_MM", nombre:"Hexagonal 46 mm", cat:"Hexagonal", kg_m:14.6, largo:6, sup:0.138 },
  { id:"GM_HEXAGONAL_50_MM", nombre:"Hexagonal 50 mm", cat:"Hexagonal", kg_m:17.3, largo:6, sup:0.15 },
  { id:"GM_HEXAGONAL_55_MM", nombre:"Hexagonal 55 mm", cat:"Hexagonal", kg_m:20.9, largo:6, sup:0.165 },
  { id:"GM_HEXAGONAL_60_MM", nombre:"Hexagonal 60 mm", cat:"Hexagonal", kg_m:24.9, largo:6, sup:0.18 },
  { id:"GM_HEXAGONAL_65_MM", nombre:"Hexagonal 65 mm", cat:"Hexagonal", kg_m:29.2, largo:6, sup:0.195 },
  { id:"GM_HEXAGONAL_70_MM", nombre:"Hexagonal 70 mm", cat:"Hexagonal", kg_m:33.9, largo:6, sup:0.21 },
  { id:"GM_HEXAGONAL_75_MM", nombre:"Hexagonal 75 mm", cat:"Hexagonal", kg_m:38.9, largo:6, sup:0.225 },
  { id:"GM_HEXAGONAL_80_MM", nombre:"Hexagonal 80 mm", cat:"Hexagonal", kg_m:44.3, largo:6, sup:0.24 },
  // T — 11 ítems (Planilla GM V26)
  { id:"GM_TEE_3_4_X_1_8_19_0X3_2MM", nombre:"Tee 3/4\" x 1/8\" (19,0x3,2mm)", cat:"T", kg_m:0.88, largo:6, sup:0.076 },
  { id:"GM_TEE_1_X_1_8_25_4X3_2MM", nombre:"Tee 1\" x 1/8\" (25,4x3,2mm)", cat:"T", kg_m:1.19, largo:6, sup:0.1016 },
  { id:"GM_TEE_1_X_3_16_25_4X4_8MM", nombre:"Tee 1\" x 3/16\" (25,4x4,8mm)", cat:"T", kg_m:1.73, largo:6, sup:0.1016 },
  { id:"GM_TEE_1_1_4_X_3_16_31_7X4_8MM", nombre:"Tee 1 1/4\" x 3/16\" (31,7x4,8mm)", cat:"T", kg_m:2.2, largo:6, sup:0.1268 },
  { id:"GM_TEE_1_1_2_X_3_16_38_1X4_8MM", nombre:"Tee 1 1/2\" x 3/16\" (38,1x4,8mm)", cat:"T", kg_m:2.68, largo:6, sup:0.1524 },
  { id:"GM_TEE_1_1_2_X_1_4_38_1X6_4MM", nombre:"Tee 1 1/2\" x 1/4\" (38,1x6,4mm)", cat:"T", kg_m:3.48, largo:6, sup:0.1524 },
  { id:"GM_TEE_2_X_1_4_50_8X6_4MM", nombre:"Tee 2\" x 1/4\" (50,8x6,4mm)", cat:"T", kg_m:4.75, largo:6, sup:0.2032 },
  { id:"GM_TEE_2_X_3_8_50_8X9_5MM", nombre:"Tee 2\" x 3/8\" (50,8x9,5mm)", cat:"T", kg_m:6.99, largo:6, sup:0.2032 },
  { id:"GM_TEE_2_1_2_X_1_4_63_5X6_4MM", nombre:"Tee 2 1/2\" x 1/4\" (63,5x6,4mm)", cat:"T", kg_m:6.1, largo:6, sup:0.254 },
  { id:"GM_TEE_3_X_5_16_76_2X7_9MM", nombre:"Tee 3\" x 5/16\" (76,2x7,9mm)", cat:"T", kg_m:9.2, largo:6, sup:0.3048 },
  { id:"GM_TEE_4_X_3_8_101_6X9_5MM", nombre:"Tee 4\" x 3/8\" (101,6x9,5mm)", cat:"T", kg_m:14.58, largo:6, sup:0.4064 },
  // Perfil U conformado — 21 ítems (Planilla GM V26)
  { id:"GM_PERFIL_U_50X25X1_55", nombre:"Perfil U 50x25x1,55", cat:"Perfil U conformado", kg_m:1.14, largo:6, sup:0.2 },
  { id:"GM_PERFIL_U_50X25X2", nombre:"Perfil U 50x25x2", cat:"Perfil U conformado", kg_m:1.46, largo:6, sup:0.2 },
  { id:"GM_PERFIL_U_50X25X3", nombre:"Perfil U 50x25x3", cat:"Perfil U conformado", kg_m:2.14, largo:6, sup:0.2 },
  { id:"GM_PERFIL_U_68X40X2", nombre:"Perfil U 68x40x2", cat:"Perfil U conformado", kg_m:2.21, largo:6, sup:0.296 },
  { id:"GM_PERFIL_U_68X40X3", nombre:"Perfil U 68x40x3", cat:"Perfil U conformado", kg_m:3.25, largo:6, sup:0.296 },
  { id:"GM_PERFIL_U_75X40X2", nombre:"Perfil U 75x40x2", cat:"Perfil U conformado", kg_m:2.3, largo:6, sup:0.31 },
  { id:"GM_PERFIL_U_75X40X3", nombre:"Perfil U 75x40x3", cat:"Perfil U conformado", kg_m:3.4, largo:6, sup:0.31 },
  { id:"GM_PERFIL_U_93X40X2", nombre:"Perfil U 93x40x2", cat:"Perfil U conformado", kg_m:2.61, largo:6, sup:0.346 },
  { id:"GM_PERFIL_U_93X40X3", nombre:"Perfil U 93x40x3", cat:"Perfil U conformado", kg_m:3.84, largo:6, sup:0.346 },
  { id:"GM_PERFIL_U_100X40X2", nombre:"Perfil U 100x40x2", cat:"Perfil U conformado", kg_m:2.72, largo:6, sup:0.36 },
  { id:"GM_PERFIL_U_100X40X3", nombre:"Perfil U 100x40x3", cat:"Perfil U conformado", kg_m:4.03, largo:6, sup:0.36 },
  { id:"GM_PERFIL_U_100X50X2", nombre:"Perfil U 100x50x2", cat:"Perfil U conformado", kg_m:3.04, largo:6, sup:0.4 },
  { id:"GM_PERFIL_U_100X50X3", nombre:"Perfil U 100x50x3", cat:"Perfil U conformado", kg_m:4.5, largo:6, sup:0.4 },
  { id:"GM_PERFIL_U_120X50X2", nombre:"Perfil U 120x50x2", cat:"Perfil U conformado", kg_m:3.34, largo:6, sup:0.44 },
  { id:"GM_PERFIL_U_120X50X3", nombre:"Perfil U 120x50x3", cat:"Perfil U conformado", kg_m:4.95, largo:6, sup:0.44 },
  { id:"GM_PERFIL_U_127X50X2", nombre:"Perfil U 127x50x2", cat:"Perfil U conformado", kg_m:3.45, largo:6, sup:0.454 },
  { id:"GM_PERFIL_U_127X50X3", nombre:"Perfil U 127x50x3", cat:"Perfil U conformado", kg_m:5.13, largo:6, sup:0.454 },
  { id:"GM_PERFIL_U_150X50X2", nombre:"Perfil U 150x50x2", cat:"Perfil U conformado", kg_m:3.82, largo:6, sup:0.5 },
  { id:"GM_PERFIL_U_150X50X3", nombre:"Perfil U 150x50x3", cat:"Perfil U conformado", kg_m:5.68, largo:6, sup:0.5 },
  { id:"GM_PERFIL_U_200X65X2", nombre:"Perfil U 200x65x2", cat:"Perfil U conformado", kg_m:5.23, largo:6, sup:0.66 },
  { id:"GM_PERFIL_U_200X65X3", nombre:"Perfil U 200x65x3", cat:"Perfil U conformado", kg_m:7.78, largo:6, sup:0.66 },
  // Perfil C conformado — 13 ítems (Planilla GM V26)
  { id:"GM_PERFIL_C_50X25X10X2", nombre:"Perfil C 50x25x10x2", cat:"Perfil C conformado", kg_m:1.68, largo:6, sup:0.24 },
  { id:"GM_PERFIL_C_75X40X15X1_55", nombre:"Perfil C 75x40x15x1,55", cat:"Perfil C conformado", kg_m:2.11, largo:6, sup:0.37 },
  { id:"GM_PERFIL_C_75X40X15X2", nombre:"Perfil C 75x40x15x2", cat:"Perfil C conformado", kg_m:2.7, largo:6, sup:0.37 },
  { id:"GM_PERFIL_C_75X40X15X3", nombre:"Perfil C 75x40x15x3", cat:"Perfil C conformado", kg_m:3.93, largo:6, sup:0.37 },
  { id:"GM_PERFIL_C_100X40X17X1_55", nombre:"Perfil C 100x40x17x1,55", cat:"Perfil C conformado", kg_m:2.46, largo:6, sup:0.428 },
  { id:"GM_PERFIL_C_100X40X17X2", nombre:"Perfil C 100x40x17x2", cat:"Perfil C conformado", kg_m:3.13, largo:6, sup:0.428 },
  { id:"GM_PERFIL_C_100X40X17X3", nombre:"Perfil C 100x40x17x3", cat:"Perfil C conformado", kg_m:4.57, largo:6, sup:0.428 },
  { id:"GM_PERFIL_C_120X50X17X2", nombre:"Perfil C 120x50x17x2", cat:"Perfil C conformado", kg_m:3.76, largo:6, sup:0.508 },
  { id:"GM_PERFIL_C_120X50X17X3", nombre:"Perfil C 120x50x17x3", cat:"Perfil C conformado", kg_m:5.51, largo:6, sup:0.508 },
  { id:"GM_PERFIL_C_127X50X17X2", nombre:"Perfil C 127x50x17x2", cat:"Perfil C conformado", kg_m:3.89, largo:6, sup:0.522 },
  { id:"GM_PERFIL_C_127X50X17X3", nombre:"Perfil C 127x50x17x3", cat:"Perfil C conformado", kg_m:5.72, largo:6, sup:0.522 },
  { id:"GM_PERFIL_C_150X60X20X2", nombre:"Perfil C 150x60x20x2", cat:"Perfil C conformado", kg_m:4.66, largo:6, sup:0.62 },
  { id:"GM_PERFIL_C_150X60X20X3", nombre:"Perfil C 150x60x20x3", cat:"Perfil C conformado", kg_m:6.88, largo:6, sup:0.62 },
  // Perfil C decapado/zincgrip por espesor — 42 ítems (Gestsoft, agregado 2026-08-01)
  { id:"GN_PERFILC_100_44_14_DEC_20", nombre:"Perfil C 100-44-14 Decapado 2,0mm", cat:"Perfil C conformado", kg_m:3.17, largo:6, sup:0.432, precio_usd_kg:2.71 },
  { id:"GN_PERFILC_100_44_14_DEC_25", nombre:"Perfil C 100-44-14 Decapado 2,5mm", cat:"Perfil C conformado", kg_m:4.27, largo:6, sup:0.432, precio_usd_kg:2.71 },
  { id:"GN_PERFILC_100_44_14_ZIN_124", nombre:"Perfil C 100-44-14 Zincgrip 1,24mm", cat:"Perfil C conformado", kg_m:1.96, largo:6, sup:0.432, precio_usd_kg:3.36 },
  { id:"GN_PERFILC_100_44_14_ZIN_15", nombre:"Perfil C 100-44-14 Zincgrip 1,5mm", cat:"Perfil C conformado", kg_m:2.38, largo:6, sup:0.432, precio_usd_kg:3.41 },
  { id:"GN_PERFILC_100_44_14_ZIN_20", nombre:"Perfil C 100-44-14 Zincgrip 2,0mm", cat:"Perfil C conformado", kg_m:3.17, largo:6, sup:0.432, precio_usd_kg:3.39 },
  { id:"GN_PERFILC_100_60_20_DEC_20", nombre:"Perfil C 100-60-20 Decapado 2,0mm", cat:"Perfil C conformado", kg_m:3.80, largo:6, sup:0.52, precio_usd_kg:2.71 },
  { id:"GN_PERFILC_100_60_20_DEC_25", nombre:"Perfil C 100-60-20 Decapado 2,5mm", cat:"Perfil C conformado", kg_m:4.74, largo:6, sup:0.52, precio_usd_kg:2.71 },
  { id:"GN_PERFILC_100_60_20_ZIN_124", nombre:"Perfil C 100-60-20 Zincgrip 1,24mm", cat:"Perfil C conformado", kg_m:2.46, largo:6, sup:0.52, precio_usd_kg:3.09 },
  { id:"GN_PERFILC_100_60_20_ZIN_15", nombre:"Perfil C 100-60-20 Zincgrip 1,5mm", cat:"Perfil C conformado", kg_m:2.85, largo:6, sup:0.52, precio_usd_kg:3.52 },
  { id:"GN_PERFILC_100_60_20_ZIN_20", nombre:"Perfil C 100-60-20 Zincgrip 2,0mm", cat:"Perfil C conformado", kg_m:3.80, largo:6, sup:0.52, precio_usd_kg:3.25 },
  { id:"GN_PERFILC_120_53_17_DEC_20", nombre:"Perfil C 120-53-17 Decapado 2,0mm", cat:"Perfil C conformado", kg_m:3.80, largo:6, sup:0.52, precio_usd_kg:2.00 },
  { id:"GN_PERFILC_120_53_17_DEC_25", nombre:"Perfil C 120-53-17 Decapado 2,5mm", cat:"Perfil C conformado", kg_m:4.74, largo:6, sup:0.52, precio_usd_kg:2.79 },
  { id:"GN_PERFILC_120_53_17_ZIN_124", nombre:"Perfil C 120-53-17 Zincgrip 1,24mm", cat:"Perfil C conformado", kg_m:2.46, largo:6, sup:0.52, precio_usd_kg:3.45 },
  { id:"GN_PERFILC_120_53_17_ZIN_15", nombre:"Perfil C 120-53-17 Zincgrip 1,5mm", cat:"Perfil C conformado", kg_m:2.85, largo:6, sup:0.52, precio_usd_kg:3.45 },
  { id:"GN_PERFILC_120_53_17_ZIN_20", nombre:"Perfil C 120-53-17 Zincgrip 2,0mm", cat:"Perfil C conformado", kg_m:3.80, largo:6, sup:0.52, precio_usd_kg:3.32 },
  { id:"GN_PERFILC_120_65_18_DEC_20", nombre:"Perfil C 120-65-18 Decapado 2,0mm", cat:"Perfil C conformado", kg_m:4.22, largo:6, sup:0.572, precio_usd_kg:1.98 },
  { id:"GN_PERFILC_120_65_18_DEC_25", nombre:"Perfil C 120-65-18 Decapado 2,5mm", cat:"Perfil C conformado", kg_m:5.35, largo:6, sup:0.572, precio_usd_kg:2.71 },
  { id:"GN_PERFILC_120_65_18_ZIN_124", nombre:"Perfil C 120-65-18 Zincgrip 1,24mm", cat:"Perfil C conformado", kg_m:2.81, largo:6, sup:0.572, precio_usd_kg:3.02 },
  { id:"GN_PERFILC_120_65_18_ZIN_15", nombre:"Perfil C 120-65-18 Zincgrip 1,5mm", cat:"Perfil C conformado", kg_m:3.17, largo:6, sup:0.572, precio_usd_kg:3.45 },
  { id:"GN_PERFILC_120_65_18_ZIN_20", nombre:"Perfil C 120-65-18 Zincgrip 2,0mm", cat:"Perfil C conformado", kg_m:4.22, largo:6, sup:0.572, precio_usd_kg:3.47 },
  { id:"GN_PERFILC_140_55_18_DEC_20", nombre:"Perfil C 140-55-18 Decapado 2,0mm", cat:"Perfil C conformado", kg_m:4.22, largo:6, sup:0.572, precio_usd_kg:2.73 },
  { id:"GN_PERFILC_140_55_18_DEC_25", nombre:"Perfil C 140-55-18 Decapado 2,5mm", cat:"Perfil C conformado", kg_m:4.22, largo:6, sup:0.572, precio_usd_kg:3.60 },
  { id:"GN_PERFILC_140_55_18_ZIN_124", nombre:"Perfil C 140-55-18 Zincgrip 1,24mm", cat:"Perfil C conformado", kg_m:2.81, largo:6, sup:0.572, precio_usd_kg:3.34 },
  { id:"GN_PERFILC_140_55_18_ZIN_15", nombre:"Perfil C 140-55-18 Zincgrip 1,5mm", cat:"Perfil C conformado", kg_m:3.17, largo:6, sup:0.572, precio_usd_kg:3.52 },
  { id:"GN_PERFILC_140_55_18_ZIN_20", nombre:"Perfil C 140-55-18 Zincgrip 2,0mm", cat:"Perfil C conformado", kg_m:4.22, largo:6, sup:0.572, precio_usd_kg:3.54 },
  { id:"GN_PERFILC_140_70_20_DEC_20", nombre:"Perfil C 140-70-20 Decapado 2,0mm", cat:"Perfil C conformado", kg_m:4.75, largo:6, sup:0.64, precio_usd_kg:2.71 },
  { id:"GN_PERFILC_140_70_20_DEC_25", nombre:"Perfil C 140-70-20 Decapado 2,5mm", cat:"Perfil C conformado", kg_m:5.27, largo:6, sup:0.64, precio_usd_kg:2.88 },
  { id:"GN_PERFILC_140_70_20_ZIN_124", nombre:"Perfil C 140-70-20 Zincgrip 1,24mm", cat:"Perfil C conformado", kg_m:3.03, largo:6, sup:0.64, precio_usd_kg:3.12 },
  { id:"GN_PERFILC_140_70_20_ZIN_15", nombre:"Perfil C 140-70-20 Zincgrip 1,5mm", cat:"Perfil C conformado", kg_m:3.56, largo:6, sup:0.64, precio_usd_kg:3.52 },
  { id:"GN_PERFILC_140_70_20_ZIN_20", nombre:"Perfil C 140-70-20 Zincgrip 2,0mm", cat:"Perfil C conformado", kg_m:3.56, largo:6, sup:0.64, precio_usd_kg:3.41 },
  { id:"GN_PERFILC_160_60_20_DEC_20", nombre:"Perfil C 160-60-20 Decapado 2,0mm", cat:"Perfil C conformado", kg_m:4.75, largo:6, sup:0.64, precio_usd_kg:2.71 },
  { id:"GN_PERFILC_160_60_20_DEC_25", nombre:"Perfil C 160-60-20 Decapado 2,5mm", cat:"Perfil C conformado", kg_m:5.27, largo:6, sup:0.64, precio_usd_kg:3.12 },
  { id:"GN_PERFILC_160_60_20_ZIN_15", nombre:"Perfil C 160-60-20 Zincgrip 1,5mm", cat:"Perfil C conformado", kg_m:3.56, largo:6, sup:0.64, precio_usd_kg:3.45 },
  { id:"GN_PERFILC_160_60_20_ZIN_20", nombre:"Perfil C 160-60-20 Zincgrip 2,0mm", cat:"Perfil C conformado", kg_m:3.56, largo:6, sup:0.64, precio_usd_kg:3.53 },
  { id:"GN_PERFILC_160_60_20_ZIN_25", nombre:"Perfil C 160-60-20 Zincgrip 2,5mm", cat:"Perfil C conformado", kg_m:5.27, largo:6, sup:0.64, precio_usd_kg:3.71 },
  { id:"GN_PERFILC_180_50_20_DEC_20", nombre:"Perfil C 180-50-20 Decapado 2,0mm", cat:"Perfil C conformado", kg_m:4.75, largo:6, sup:0.64, precio_usd_kg:2.73 },
  { id:"GN_PERFILC_180_50_20_DEC_25", nombre:"Perfil C 180-50-20 Decapado 2,5mm", cat:"Perfil C conformado", kg_m:5.94, largo:6, sup:0.64, precio_usd_kg:2.88 },
  { id:"GN_PERFILC_180_50_20_ZIN_15", nombre:"Perfil C 180-50-20 Zincgrip 1,5mm", cat:"Perfil C conformado", kg_m:4.42, largo:6, sup:0.64, precio_usd_kg:2.84 },
  { id:"GN_PERFILC_180_50_20_ZIN_20", nombre:"Perfil C 180-50-20 Zincgrip 2,0mm", cat:"Perfil C conformado", kg_m:4.75, largo:6, sup:0.64, precio_usd_kg:3.42 },
  { id:"GN_PERFILC_180_50_20_ZIN_25", nombre:"Perfil C 180-50-20 Zincgrip 2,5mm", cat:"Perfil C conformado", kg_m:5.94, largo:6, sup:0.64, precio_usd_kg:3.28 },
  { id:"GN_PERFILC_240_65_24_ZIN_20", nombre:"Perfil C 240-65-24 Zincgrip 2,0mm", cat:"Perfil C conformado", kg_m:6.32, largo:6, sup:0.836, precio_usd_kg:2.10 },
  { id:"GN_PERFILC_80_54_14_DEC_20", nombre:"Perfil C 80-54-14 Decapado 2,0mm", cat:"Perfil C conformado", kg_m:3.17, largo:6, sup:0.432, precio_usd_kg:2.71 },
  { id:"GN_PERFILC_80_54_14_DEC_25", nombre:"Perfil C 80-54-14 Decapado 2,5mm", cat:"Perfil C conformado", kg_m:4.27, largo:6, sup:0.432, precio_usd_kg:2.71 },
  { id:"GN_PERFILC_80_54_14_ZIN_124", nombre:"Perfil C 80-54-14 Zincgrip 1,24mm", cat:"Perfil C conformado", kg_m:1.96, largo:6, sup:0.432, precio_usd_kg:3.22 },
  { id:"GN_PERFILC_80_54_14_ZIN_15", nombre:"Perfil C 80-54-14 Zincgrip 1,5mm", cat:"Perfil C conformado", kg_m:2.38, largo:6, sup:0.432, precio_usd_kg:3.10 },
  { id:"GN_PERFILC_80_54_14_ZIN_20", nombre:"Perfil C 80-54-14 Zincgrip 2,0mm", cat:"Perfil C conformado", kg_m:3.17, largo:6, sup:0.432, precio_usd_kg:3.08 },
  // Caño con costura (Cédula) — categoría nueva, 23 ítems (Gestsoft, agregado 2026-08-01)
  { id:"GN_CANO_CED_1_2_21_3_C20", nombre:"Caño c/costura 1/2\" (21,3mm) Cédula 20", cat:"Caño Cédula", kg_m:1.12, largo:6, sup:0.0669, precio_usd_kg:1.87 },
  { id:"GN_CANO_CED_3_4_26_7_C20", nombre:"Caño c/costura 3/4\" (26,7mm) Cédula 20", cat:"Caño Cédula", kg_m:1.44, largo:6, sup:0.0839, precio_usd_kg:1.87 },
  { id:"GN_CANO_CED_3_8_17_1_C40", nombre:"Caño c/costura 3/8\" (17,1mm) Cédula 40", cat:"Caño Cédula", kg_m:0.84, largo:6, sup:0.0537, precio_usd_kg:6.60 },
  { id:"GN_CANO_CED_1_33_4_C20", nombre:"Caño c/costura 1\" (33,4mm) Cédula 20", cat:"Caño Cédula", kg_m:2.18, largo:6, sup:0.1049, precio_usd_kg:1.77 },
  { id:"GN_CANO_CED_1_1_4_42_2_C20", nombre:"Caño c/costura 1 1/4\" (42,2mm) Cédula 20", cat:"Caño Cédula", kg_m:2.99, largo:6, sup:0.1326, precio_usd_kg:1.38 },
  { id:"GN_CANO_CED_1_1_2_48_3_C20", nombre:"Caño c/costura 1 1/2\" (48,3mm) Cédula 20", cat:"Caño Cédula", kg_m:3.46, largo:6, sup:0.1517, precio_usd_kg:1.31 },
  { id:"GN_CANO_CED_2_60_3_C20", nombre:"Caño c/costura 2\" (60,3mm) Cédula 20", cat:"Caño Cédula", kg_m:4.64, largo:6, sup:0.1894, precio_usd_kg:1.79 },
  { id:"GN_CANO_CED_2_1_2_76_2_C20", nombre:"Caño c/costura 2 1/2\" (76,2mm) Cédula 20", cat:"Caño Cédula", kg_m:6.71, largo:6, sup:0.2394, precio_usd_kg:1.67 },
  { id:"GN_CANO_CED_3_88_9_C20", nombre:"Caño c/costura 3\" (88,9mm) Cédula 20", cat:"Caño Cédula", kg_m:8.39, largo:6, sup:0.2793, precio_usd_kg:1.69 },
  { id:"GN_CANO_CED_3_1_2_101_6_C20", nombre:"Caño c/costura 3 1/2\" (101,6mm) Cédula 20", cat:"Caño Cédula", kg_m:9.64, largo:6, sup:0.3192, precio_usd_kg:2.00 },
  { id:"GN_CANO_CED_4_114_3_C20", nombre:"Caño c/costura 4\" (114,3mm) Cédula 20", cat:"Caño Cédula", kg_m:11.55, largo:6, sup:0.3591, precio_usd_kg:1.78 },
  { id:"GN_CANO_CED_4_114_3_C40", nombre:"Caño c/costura 4\" (114,3mm) Cédula 40", cat:"Caño Cédula", kg_m:16.70, largo:6, sup:0.3591, precio_usd_kg:2.00 },
  { id:"GN_CANO_CED_5_139_7_C40", nombre:"Caño c/costura 5\" (139,7mm) Cédula 40", cat:"Caño Cédula", kg_m:22.00, largo:6, sup:0.4389, precio_usd_kg:2.00 },
  { id:"GN_CANO_CED_6_165_1_C40", nombre:"Caño c/costura 6\" (165,1mm) Cédula 40", cat:"Caño Cédula", kg_m:28.35, largo:6, sup:0.5187, precio_usd_kg:2.00 },
  { id:"GN_CANO_CED_8_219_1X4_8", nombre:"Caño c/costura 8\" (219,1mm x 4,8mm)", cat:"Caño Cédula", kg_m:25.40, largo:6, sup:0.6883, precio_usd_kg:1.75 },
  { id:"GN_CANO_CED_8_219_1X6_4", nombre:"Caño c/costura 8\" (219,1mm x 6,4mm)", cat:"Caño Cédula", kg_m:33.61, largo:6, sup:0.6883, precio_usd_kg:2.45 },
  { id:"GN_CANO_CED_10_273_1X6_4", nombre:"Caño c/costura 10\" (273,1mm x 6,4mm)", cat:"Caño Cédula", kg_m:42.15, largo:6, sup:0.8577, precio_usd_kg:2.50 },
  { id:"GN_CANO_CED_12_323_8X6_4", nombre:"Caño c/costura 12\" (323,8mm x 6,4mm)", cat:"Caño Cédula", kg_m:50.16, largo:6, sup:1.0172, precio_usd_kg:3.17 },
  { id:"GN_CANO_CED_14_355_6X6_4", nombre:"Caño c/costura 14\" (355,6mm x 6,4mm)", cat:"Caño Cédula", kg_m:55.18, largo:6, sup:1.1170, precio_usd_kg:3.77 },
  { id:"GN_CANO_CED_16_406_4X6_4", nombre:"Caño c/costura 16\" (406,4mm x 6,4mm)", cat:"Caño Cédula", kg_m:63.21, largo:6, sup:1.2767, precio_usd_kg:3.73 },
  { id:"GN_CANO_CED_18_457_2X9_5", nombre:"Caño c/costura 18\" (457,2mm x 9,5mm)", cat:"Caño Cédula", kg_m:105.02, largo:6, sup:1.4363, precio_usd_kg:3.42 },
  { id:"GN_CANO_CED_20_508X9_5", nombre:"Caño c/costura 20\" (508,0mm x 9,5mm)", cat:"Caño Cédula", kg_m:116.93, largo:6, sup:1.5959, precio_usd_kg:3.26 },
  { id:"GN_CANO_CED_24_609_6X9_5", nombre:"Caño c/costura 24\" (609,6mm x 9,5mm)", cat:"Caño Cédula", kg_m:140.76, largo:6, sup:1.9152, precio_usd_kg:3.73 },
  // U Chico — categoría nueva, 5 ítems (Gestsoft, agregado 2026-08-01)
  { id:"GN_UCHICO_40X20X5", nombre:"U Chico 40x20x5", cat:"U Chico", kg_m:2.90, largo:6, sup:0.16, precio_usd_kg:1.19 },
  { id:"GN_UCHICO_50X25X5", nombre:"U Chico 50x25x5", cat:"U Chico", kg_m:3.84, largo:6, sup:0.20, precio_usd_kg:1.19 },
  { id:"GN_UCHICO_50X38X5", nombre:"U Chico 50x38x5", cat:"U Chico", kg_m:5.59, largo:6, sup:0.252, precio_usd_kg:1.19 },
  { id:"GN_UCHICO_60X30X6", nombre:"U Chico 60x30x6", cat:"U Chico", kg_m:5.61, largo:6, sup:0.24, precio_usd_kg:1.19 },
  { id:"GN_UCHICO_65X42X5_5", nombre:"U Chico 65x42x5,5", cat:"U Chico", kg_m:7.10, largo:6, sup:0.298, precio_usd_kg:1.19 },
];

// ─── PLANCHUELAS ─────────────────────────────────────────────────
function mkPL(id, ancho, esp, largo = 6) {
  const kg_m = Math.round(ancho * esp * 7.85 / 1000 * 1000) / 1000;
  const sup  = Math.round(2 * (ancho + esp) / 1000 * 1000) / 1000;
  // Precio representativo de Gestsoft (planillas Gino, 2026-08): 1,17 USD/kg para anchos
  // hasta ~3" (80mm), 1,22 USD/kg para 4" (100mm) en adelante — mismo patrón en ~90 filas reales.
  const precio_usd_kg = ancho <= 80 ? 1.17 : 1.22;
  return { id, nombre:`Planchuela ${ancho}×${esp} mm`, cat:"Planchuelas", kg_m, largo, sup, precio_usd_kg, historial_precios:[] };
}
export const PLANCHUELAS_DATA = [
  mkPL("PL20x3",20,3),    mkPL("PL20x4",20,4),
  mkPL("PL25x3",25,3),    mkPL("PL25x4",25,4),    mkPL("PL25x5",25,5),
  mkPL("PL30x3",30,3),    mkPL("PL30x4",30,4),    mkPL("PL30x5",30,5),    mkPL("PL30x6",30,6),
  mkPL("PL32x6",32,6),
  mkPL("PL38x6",38,6),
  mkPL("PL40x4",40,4),    mkPL("PL40x5",40,5),    mkPL("PL40x6",40,6),    mkPL("PL40x8",40,8),    mkPL("PL40x10",40,10),
  mkPL("PL50x5",50,5),    mkPL("PL50x6",50,6),    mkPL("PL50x8",50,8),    mkPL("PL50x10",50,10),  mkPL("PL50x12",50,12),
  mkPL("PL60x6",60,6),    mkPL("PL60x8",60,8),    mkPL("PL60x10",60,10),  mkPL("PL60x12",60,12),
  mkPL("PL70x6",70,6),    mkPL("PL70x8",70,8),    mkPL("PL70x10",70,10),
  mkPL("PL75x6",75,6),    mkPL("PL75x8",75,8),    mkPL("PL75x10",75,10),  mkPL("PL75x12",75,12),
  mkPL("PL80x6",80,6),    mkPL("PL80x8",80,8),    mkPL("PL80x10",80,10),  mkPL("PL80x12",80,12),  mkPL("PL80x15",80,15),
  mkPL("PL100x8",100,8),  mkPL("PL100x10",100,10),mkPL("PL100x12",100,12),mkPL("PL100x15",100,15),mkPL("PL100x20",100,20),
  mkPL("PL120x10",120,10),mkPL("PL120x12",120,12),mkPL("PL120x15",120,15),
  mkPL("PL150x10",150,10),mkPL("PL150x12",150,12),mkPL("PL150x15",150,15),mkPL("PL150x20",150,20),
  mkPL("PL200x10",200,10),mkPL("PL200x12",200,12),mkPL("PL200x15",200,15),mkPL("PL200x20",200,20),
  mkPL("PL250x12",250,12),mkPL("PL250x15",250,15),mkPL("PL250x20",250,20),
  mkPL("PL300x12",300,12),mkPL("PL300x15",300,15),mkPL("PL300x20",300,20),
  // ─── Faltantes de Planilla GM V26 (Pletinas, agregado 2026-07-19) ───
  mkPL("PL12x3",12,3),      mkPL("PL15x3",15,3),
  mkPL("PL20x5",20,5),      mkPL("PL25x6",25,6),
  mkPL("PL35x4",35,4),      mkPL("PL35x5",35,5),
  mkPL("PL40x3",40,3),
  mkPL("PL45x5",45,5),      mkPL("PL45x6",45,6),
  mkPL("PL50x3",50,3),      mkPL("PL50x4",50,4),
  mkPL("PL60x5",60,5),
  mkPL("PL75x15",75,15),
  mkPL("PL100x6",100,6),
  mkPL("PL120x20",120,20),
  mkPL("PL150x25",150,25),
  mkPL("PL200x25",200,25),
  mkPL("PL250x25",250,25),
  mkPL("PL300x25",300,25),
];

// ─── PLANCHAS ─────────────────────────────────────────────────────
function mkPA(nombre, esp_mm, L, A, precio_usd_kg = 0) {
  const kg_m2 = Math.round(esp_mm * 7.85 * 100) / 100;
  const area  = Math.round(L / 1000 * A / 1000 * 1000) / 1000;
  const kg_ud = Math.round(kg_m2 * area * 10) / 10;
  return { id:`PA_${nombre.replace(/[^a-z0-9]/gi,"_")}`, nombre, espesor:esp_mm, kg_m2, largo_mm:L, ancho_mm:A, area_m2:area, kg_ud, precio_usd_kg, historial_precios:[] };
}
export const PLANCHAS_DATA = [
  mkPA("Plancha 2 mm",            2,     2440, 1220),
  mkPA("Plancha 2,5 mm",          2.5,   2440, 1220),
  mkPA("Plancha 3 mm",            3,     2440, 1220),
  mkPA('Plancha 1/8" (3,18 mm)',  3.175, 6000, 1500),
  mkPA('Plancha 3/16" (4,76 mm)', 4.762, 6000, 1500, 0.99),
  mkPA('Plancha 1/4" (6,35 mm)',  6.35,  6000, 1500, 0.99),
  mkPA('Plancha 5/16" (7,94 mm)', 7.938, 6000, 1500, 0.99),
  mkPA('Plancha 3/8" (9,53 mm)',  9.525, 6000, 1500, 0.99),
  mkPA('Plancha 7/16" (11,11 mm)',11.113,6000, 1500),
  mkPA('Plancha 1/2" (12,7 mm)',  12.7,  6000, 1500, 0.99),
  mkPA('Plancha 9/16" (14,29 mm)',14.288,6000, 1500),
  mkPA('Plancha 5/8" (15,88 mm)', 15.875,6000, 1500, 1.05),
  mkPA('Plancha 3/4" (19,05 mm)', 19.05, 6000, 1500, 1.05),
  mkPA('Plancha 7/8" (22,23 mm)', 22.225,6000, 1500, 1.05),
  mkPA('Plancha 1" (25,4 mm)',    25.4,  6000, 1500, 1.05),
  mkPA('Plancha 1¼" (31,75 mm)',  31.75, 6000, 1500, 1.07),
  mkPA('Plancha 1½" (38,1 mm)',   38.1,  6000, 1500, 1.15),
  mkPA('Plancha 2" (50,8 mm)',    50.8,  6000, 1500, 1.21),
];

// ─── Faltantes de Planilla GM V26 (Planchas, agregado 2026-07-19) ───
const PLANCHAS_GM_DATA = [
  { id:"PA_GM_PLANCHA_5_32_3_97_MM", nombre:"Plancha 5/32\" (3,97 mm)", espesor:3.97, kg_m2:31.16, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:280.4, precio_usd_kg:0, historial_precios:[] },
  { id:"PA_GM_PLANCHA_1_1_4_31_80_MM", nombre:"Plancha 1 1/4\" (31,80 mm)", espesor:31.8, kg_m2:249.63, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:2246.7, precio_usd_kg:1.07, historial_precios:[] },
  { id:"PA_GM_PLANCHA_1_3_4_44_45_MM", nombre:"Plancha 1 3/4\" (44,45 mm)", espesor:44.45, kg_m2:348.93, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:3140.4, precio_usd_kg:1.39, historial_precios:[] },
  { id:"GN_PLANCHA_2_1_2_63_5MM", nombre:"Plancha 2 1/2\" (63,5 mm)", espesor:63.5, kg_m2:499.70, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:4497.3, precio_usd_kg:1.26, historial_precios:[] },
  { id:"GN_PLANCHA_3_76_2MM", nombre:"Plancha 3\" (76,2 mm)", espesor:76.2, kg_m2:606.66, largo_mm:3000, ancho_mm:1500, area_m2:4.5, kg_ud:2730.0, precio_usd_kg:1.46, historial_precios:[] },
  { id:"PA_GM_PLANCHA_22_0_8_MM", nombre:"Plancha 22 (0,8 mm)", espesor:0.8, kg_m2:6.28, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:56.5, precio_usd_kg:1.12, historial_precios:[] },
  { id:"PA_GM_PLANCHA_20_0_9_MM", nombre:"Plancha 20 (0,9 mm)", espesor:0.9, kg_m2:7.07, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:63.6, precio_usd_kg:1.12, historial_precios:[] },
  { id:"PA_GM_PLANCHA_18_1_2_MM", nombre:"Plancha 18 (1,2 mm)", espesor:1.2, kg_m2:9.42, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:84.8, precio_usd_kg:1.12, historial_precios:[] },
  { id:"PA_GM_PLANCHA_16_1_6_MM", nombre:"Plancha 16 (1,6 mm)", espesor:1.6, kg_m2:12.56, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:113.0, precio_usd_kg:1.12, historial_precios:[] },
  { id:"PA_GM_PLANCHA_14_2_0_MM", nombre:"Plancha 14 (2,0 mm)", espesor:2, kg_m2:15.7, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:141.3, precio_usd_kg:1.12, historial_precios:[] },
  { id:"PA_GM_PLANCHA_12_2_4_MM", nombre:"Plancha 12 (2,4 mm)", espesor:2.4, kg_m2:18.84, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:169.6, precio_usd_kg:1.12, historial_precios:[] },
  { id:"PA_GM_PLANCHA_11_3_0_MM", nombre:"Plancha 11 (3,0 mm)", espesor:3, kg_m2:23.55, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:212.0, precio_usd_kg:0, historial_precios:[] },
  { id:"PA_GM_PLANCHA_10_3_2_MM", nombre:"Plancha 10 (3,2 mm)", espesor:3.2, kg_m2:25.12, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:226.1, precio_usd_kg:0, historial_precios:[] },
  { id:"PA_GM_PLANCHA_AD_3_0_MM", nombre:"Plancha AD 3,0 mm", espesor:3, kg_m2:25.5, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:229.5, precio_usd_kg:0, historial_precios:[] },
  { id:"PA_GM_PLANCHA_AD_4_5_MM", nombre:"Plancha AD 4,5 mm", espesor:4.5, kg_m2:37.5, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:337.5, precio_usd_kg:0, historial_precios:[] },
  { id:"PA_GM_PLANCHA_AD_6_0_MM", nombre:"Plancha AD 6,0 mm", espesor:6, kg_m2:49.5, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:445.5, precio_usd_kg:0, historial_precios:[] },
  { id:"PA_GM_PLANCHA_GALV_1_8_3_18_MM", nombre:"Plancha Galv. 1/8\" (3,18 mm)", espesor:3.18, kg_m2:25.3, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:227.7, precio_usd_kg:0, historial_precios:[] },
  { id:"PA_GM_PLANCHA_GALV_3_16_4_76_MM", nombre:"Plancha Galv. 3/16\" (4,76 mm)", espesor:4.76, kg_m2:37.7, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:339.3, precio_usd_kg:0, historial_precios:[] },
  { id:"PA_GM_PLANCHA_GALV_1_4_6_35_MM", nombre:"Plancha Galv. 1/4\" (6,35 mm)", espesor:6.35, kg_m2:50.3, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:452.7, precio_usd_kg:0, historial_precios:[] },
  { id:"PA_GM_PLANCHA_GALV_3_8_9_53_MM", nombre:"Plancha Galv. 3/8\" (9,53 mm)", espesor:9.53, kg_m2:75.4, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:678.6, precio_usd_kg:0, historial_precios:[] },
  { id:"PA_GM_PLANCHA_GALV_1_2_12_7_MM", nombre:"Plancha Galv. 1/2\" (12,7 mm)", espesor:12.7, kg_m2:100.5, largo_mm:6000, ancho_mm:1500, area_m2:9.0, kg_ud:904.5, precio_usd_kg:0, historial_precios:[] },
  // Chapa galvanizada de calibre delgado — categoría nueva, 10 ítems (Gestsoft, agregado 2026-08-01)
  // kg_m2 real de Gestsoft (incluye el recubrimiento de zinc, no es esp_mm×7,85 puro como el resto del seed)
  { id:"GN_CHAPA_GALV_N12_2_52MM", nombre:"Chapa Galvanizada N12 (2,52 mm)", espesor:2.52, kg_m2:22.12, largo_mm:2440, ancho_mm:1220, area_m2:2.977, kg_ud:65.85, precio_usd_kg:1.74, historial_precios:[] },
  { id:"GN_CHAPA_GALV_N14_1_99MM", nombre:"Chapa Galvanizada N14 (1,99 mm)", espesor:1.99, kg_m2:16.02, largo_mm:2440, ancho_mm:1220, area_m2:2.977, kg_ud:47.69, precio_usd_kg:1.32, historial_precios:[] },
  { id:"GN_CHAPA_GALV_N16_1_56MM", nombre:"Chapa Galvanizada N16 (1,56 mm)", espesor:1.56, kg_m2:13.00, largo_mm:2440, ancho_mm:1220, area_m2:2.977, kg_ud:38.70, precio_usd_kg:1.33, historial_precios:[] },
  { id:"GN_CHAPA_GALV_N18_1_26MM", nombre:"Chapa Galvanizada N18 (1,26 mm)", espesor:1.26, kg_m2:9.47, largo_mm:2440, ancho_mm:1220, area_m2:2.977, kg_ud:28.19, precio_usd_kg:1.34, historial_precios:[] },
  { id:"GN_CHAPA_GALV_N20_1_00MM", nombre:"Chapa Galvanizada N20 (1,00 mm)", espesor:1.00, kg_m2:7.81, largo_mm:2440, ancho_mm:1220, area_m2:2.977, kg_ud:23.25, precio_usd_kg:1.38, historial_precios:[] },
  { id:"GN_CHAPA_GALV_N22_0_79MM", nombre:"Chapa Galvanizada N22 (0,79 mm)", espesor:0.79, kg_m2:6.40, largo_mm:2440, ancho_mm:1220, area_m2:2.977, kg_ud:19.05, precio_usd_kg:1.43, historial_precios:[] },
  { id:"GN_CHAPA_GALV_N24_0_63MM", nombre:"Chapa Galvanizada N24 (0,63 mm)", espesor:0.63, kg_m2:5.18, largo_mm:2440, ancho_mm:1220, area_m2:2.977, kg_ud:15.42, precio_usd_kg:1.48, historial_precios:[] },
  { id:"GN_CHAPA_GALV_N26_0_50MM", nombre:"Chapa Galvanizada N26 (0,50 mm)", espesor:0.50, kg_m2:3.76, largo_mm:2440, ancho_mm:1220, area_m2:2.977, kg_ud:11.19, precio_usd_kg:1.55, historial_precios:[] },
  { id:"GN_CHAPA_GALV_N28_0_40MM", nombre:"Chapa Galvanizada N28 (0,40 mm)", espesor:0.40, kg_m2:3.27, largo_mm:2440, ancho_mm:1220, area_m2:2.977, kg_ud:9.74, precio_usd_kg:1.55, historial_precios:[] },
  { id:"GN_CHAPA_GALV_N30_0_31MM", nombre:"Chapa Galvanizada N30 (0,31 mm)", espesor:0.31, kg_m2:3.08, largo_mm:2440, ancho_mm:1220, area_m2:2.977, kg_ud:9.17, precio_usd_kg:1.55, historial_precios:[] },
];
PLANCHAS_DATA.push(...PLANCHAS_GM_DATA);

// ─── REJILLAS ELECTROSOLDADAS Y METAL DESPLEGADO (Planilla GM V26) ───
const REJILLAS_DATA = [
  { id:"REJ_MALLA_15X15_4_2MM", nombre:"Malla 15x15 Ø4,2mm", kg_m2:1.45, largo_mm:6000, ancho_mm:2400, area_m2:14.4, kg_ud:20.9, precio_usd_kg:0, historial_precios:[], notas:"Malla electrosoldada estándar plaza (Gerdau), Ø4,2 c/150mm ambas dir., panel 2,40x6,00m" },
  { id:"REJ_MALLA_15X15_5_5MM", nombre:"Malla 15x15 Ø5,5mm", kg_m2:2.49, largo_mm:6000, ancho_mm:2400, area_m2:14.4, kg_ud:35.9, precio_usd_kg:0, historial_precios:[], notas:"Malla electrosoldada estándar plaza (Gerdau), Ø5,5 c/150mm ambas dir." },
  { id:"REJ_MALLA_15X15_6MM", nombre:"Malla 15x15 Ø6mm", kg_m2:2.96, largo_mm:6000, ancho_mm:2400, area_m2:14.4, kg_ud:42.6, precio_usd_kg:0, historial_precios:[], notas:"Malla electrosoldada estándar plaza (Gerdau), Ø6 c/150mm ambas dir." },
  { id:"REJ_MALLA_15X15_8MM", nombre:"Malla 15x15 Ø8mm", kg_m2:5.26, largo_mm:6000, ancho_mm:2400, area_m2:14.4, kg_ud:75.7, precio_usd_kg:0, historial_precios:[], notas:"Malla electrosoldada estándar plaza (Gerdau), Ø8 c/150mm ambas dir." },
  { id:"REJ_MALLA_15X15_10MM", nombre:"Malla 15x15 Ø10mm", kg_m2:8.22, largo_mm:6000, ancho_mm:2400, area_m2:14.4, kg_ud:118.4, precio_usd_kg:0, historial_precios:[], notas:"Malla electrosoldada estándar plaza (Gerdau), Ø10 c/150mm ambas dir." },
  { id:"REJ_MALLA_15X15_12MM", nombre:"Malla 15x15 Ø12mm", kg_m2:11.84, largo_mm:6000, ancho_mm:2400, area_m2:14.4, kg_ud:170.5, precio_usd_kg:0, historial_precios:[], notas:"Malla electrosoldada estándar plaza (Gerdau), Ø12 c/150mm ambas dir." },
  { id:"REJ_REJILLA_RJ01_30X3_30", nombre:"Rejilla RJ01 30x3 @30", kg_m2:26.98, largo_mm:6000, ancho_mm:630, area_m2:3.78, kg_ud:102.0, precio_usd_kg:0, historial_precios:[], notas:"Hierromat RJ01 (=RJ01A 3m): panel 630x6000, DM100, laminación. 102 kg/panel" },
  { id:"REJ_REJILLA_RJ02_30X3_30", nombre:"Rejilla RJ02 30x3 @30", kg_m2:28.19, largo_mm:6000, ancho_mm:810, area_m2:4.86, kg_ud:137.0, precio_usd_kg:0, historial_precios:[], notas:"Hierromat RJ02 (=RJ02A 3m): panel 810x6000, DM100, laminación. 137 kg/panel" },
  { id:"REJ_REJILLA_RJ05_50X4_75_42", nombre:"Rejilla RJ05 50x4,75 @42", kg_m2:47.83, largo_mm:6000, ancho_mm:798, area_m2:4.788, kg_ud:229.0, precio_usd_kg:0, historial_precios:[], notas:"Hierromat RJ05: panel 798x6000, DM100, laminación. 229 kg/panel" },
  { id:"REJ_REJILLA_RJ09_20X2_30", nombre:"Rejilla RJ09 20x2 @30", kg_m2:11.9, largo_mm:3000, ancho_mm:630, area_m2:1.89, kg_ud:22.5, precio_usd_kg:0, historial_precios:[], notas:"Hierromat RJ09: panel 630x3000, DM100, laminación y moldura. 22,5 kg/panel" },
  { id:"REJ_REJILLA_RJ13_20X2_30_GALV", nombre:"Rejilla RJ13 20x2 @30 galv", kg_m2:12.17, largo_mm:3000, ancho_mm:630, area_m2:1.89, kg_ud:23.0, precio_usd_kg:0, historial_precios:[], notas:"Hierromat RJ13: panel 630x3000, DM100, galvanizada y moldura. 23 kg/panel" },
  { id:"REJ_REJILLA_RJ06_30X3_30_GALV", nombre:"Rejilla RJ06 30x3 @30 galv", kg_m2:28.04, largo_mm:6000, ancho_mm:630, area_m2:3.78, kg_ud:106.0, precio_usd_kg:0, historial_precios:[], notas:"Hierromat RJ06 (=RJ06A 3m): panel 630x6000, DM100, galvanizada y moldura. 106 kg/panel" },
  { id:"REJ_REJILLA_RJO06_30X3_30_GALV", nombre:"Rejilla RJO06 30x3 @30 galv", kg_m2:28.32, largo_mm:5800, ancho_mm:630, area_m2:3.654, kg_ud:103.5, precio_usd_kg:0, historial_precios:[], notas:"Hierromat RJO06: panel 630x5800, DM100, galvanizada y moldura. 103,5 kg/panel" },
  { id:"REJ_REJILLA_RJ08_30X3_30_GALV", nombre:"Rejilla RJ08 30x3 @30 galv", kg_m2:27.95, largo_mm:3000, ancho_mm:990, area_m2:2.97, kg_ud:83.0, precio_usd_kg:0, historial_precios:[], notas:"Hierromat RJ08: panel 990x3000, DM100, galvanizada y moldura. 83 kg/panel" },
  { id:"REJ_REJILLA_RJ14A_30X2_35_GALV", nombre:"Rejilla RJ14A 30x2 @35 galv", kg_m2:16.67, largo_mm:3000, ancho_mm:700, area_m2:2.1, kg_ud:35.0, precio_usd_kg:0, historial_precios:[], notas:"Hierromat RJ14A: panel 700x3000, DM100, galvanizada y moldura. 35 kg/panel" },
  { id:"REJ_REJILLA_RJ14_30X2_35_GALV", nombre:"Rejilla RJ14 30x2 @35 galv", kg_m2:16.42, largo_mm:3000, ancho_mm:1015, area_m2:3.045, kg_ud:50.0, precio_usd_kg:0, historial_precios:[], notas:"Hierromat RJ14: panel 1015x3000, DM100, galvanizada y moldura. 50 kg/panel" },
  { id:"REJ_REJILLA_RJ07_30X2_30_GALV", nombre:"Rejilla RJ07 30x2 @30 galv", kg_m2:22.22, largo_mm:2000, ancho_mm:990, area_m2:1.98, kg_ud:44.0, precio_usd_kg:0, historial_precios:[], notas:"Hierromat RJ07: panel 990x2000, DM30, galvanizada y moldura. 44 kg/panel" },
  { id:"REJ_REJILLA_RJA30_DENTADA_30X3_GALV", nombre:"Rejilla RJA30 dentada 30x3 galv", kg_m2:26.98, largo_mm:3000, ancho_mm:630, area_m2:1.89, kg_ud:51.0, precio_usd_kg:0, historial_precios:[], notas:"Hierromat RJA30: panel 630x3000, DM100, dentada antideslizante, galvanizada. 51 kg/panel" },
  { id:"REJ_REJILLA_RJA31_DENTADA_30X3_GALV", nombre:"Rejilla RJA31 dentada 30x3 galv", kg_m2:27.27, largo_mm:3000, ancho_mm:990, area_m2:2.97, kg_ud:81.0, precio_usd_kg:0, historial_precios:[], notas:"Hierromat RJA31: panel 990x3000, DM100, dentada antideslizante, galvanizada. 81 kg/panel" },
  { id:"REJ_REJILLA_ANTIESFERA_RJO61_25X3", nombre:"Rejilla antiesfera RJO61 25x3", kg_m2:21.52, largo_mm:3000, ancho_mm:999, area_m2:2.997, kg_ud:64.5, precio_usd_kg:0, historial_precios:[], notas:"Hierromat RJO61: panel 999x3000, DM76, sep. 22mm, galvanizada. 64,5 kg/panel" },
  { id:"REJ_METAL_DESPL_MD454_E3_0_ESTR", nombre:"Metal despl. MD454 e3,0 (estr)", kg_m2:10.93, largo_mm:3000, ancho_mm:1500, area_m2:4.5, kg_ud:49.2, precio_usd_kg:0, historial_precios:[], notas:"Hierromat MD454A/MD45B: DM62 dm25, alt 10,3, romboidal, estructural. Panel 1500x3000 / 1200x2440" },
  { id:"REJ_METAL_DESPL_MD475_E4_75_ESTR", nombre:"Metal despl. MD475 e4,75 (estr)", kg_m2:8.95, largo_mm:3000, ancho_mm:1500, area_m2:4.5, kg_ud:40.3, precio_usd_kg:0, historial_precios:[], notas:"Hierromat MD475A: DM100 dm40, alt 12,2, romboidal, estructural. Panel 1500x3000" },
  { id:"REJ_METAL_DESPL_MD484_E6_35_ESTR", nombre:"Metal despl. MD484 e6,35 (estr)", kg_m2:19.06, largo_mm:3000, ancho_mm:1500, area_m2:4.5, kg_ud:85.8, precio_usd_kg:0, historial_precios:[], notas:"Hierromat MD484: DM133 dm34, alt 15, hexagonal, estructural. Panel 1500x3000" },
  { id:"REJ_METAL_DESPL_MD411_E1_5", nombre:"Metal despl. MD411 e1,5", kg_m2:3.8, largo_mm:3000, ancho_mm:1000, area_m2:3.0, kg_ud:11.4, precio_usd_kg:0, historial_precios:[], notas:"Hierromat MD411/MD411A: DM25 dm12, romboidal. Panel 1000x3000 / 1200x2440" },
  { id:"REJ_METAL_DESPL_MD415_E3_0", nombre:"Metal despl. MD415 e3,0", kg_m2:9.85, largo_mm:3000, ancho_mm:1500, area_m2:4.5, kg_ud:44.3, precio_usd_kg:0, historial_precios:[], notas:"Hierromat MD415: DM25 dm12, romboidal. Panel 1500x3000" },
  { id:"REJ_METAL_DESPL_MD421_E1_5", nombre:"Metal despl. MD421 e1,5", kg_m2:2.6, largo_mm:5850, ancho_mm:1000, area_m2:5.85, kg_ud:15.2, precio_usd_kg:0, historial_precios:[], notas:"Hierromat MD421: DM50 dm20, romboidal. Panel 1000x5850" },
  { id:"REJ_METAL_DESPL_MD430_E2_7", nombre:"Metal despl. MD430 e2,7", kg_m2:6.2, largo_mm:3000, ancho_mm:1500, area_m2:4.5, kg_ud:27.9, precio_usd_kg:0, historial_precios:[], notas:"Hierromat MD430: DM50 dm20, hexagonal. Panel 1500x3000" },
  { id:"REJ_METAL_DESPL_MD431_E3_0", nombre:"Metal despl. MD431 e3,0", kg_m2:7.06, largo_mm:3000, ancho_mm:1500, area_m2:4.5, kg_ud:31.8, precio_usd_kg:0, historial_precios:[], notas:"Hierromat MD431/MD431A: DM50 dm20, hexagonal. Panel 1500x3000 / 1000x2000" },
  { id:"REJ_METAL_DESPL_MD433_E3_0", nombre:"Metal despl. MD433 e3,0", kg_m2:5.65, largo_mm:3000, ancho_mm:1500, area_m2:4.5, kg_ud:25.4, precio_usd_kg:0, historial_precios:[], notas:"Hierromat MD433: DM50 dm25, romboidal. Panel 1500x3000" },
  { id:"REJ_METAL_DESPL_MD453_E3_0", nombre:"Metal despl. MD453 e3,0", kg_m2:5.65, largo_mm:3000, ancho_mm:1500, area_m2:4.5, kg_ud:25.4, precio_usd_kg:0, historial_precios:[], notas:"Hierromat MD453: DM62 dm25, romboidal. Panel 1500x3000" },
  { id:"REJ_METAL_DESPL_MD458_462_E1_5", nombre:"Metal despl. MD458/462 e1,5", kg_m2:2.83, largo_mm:6000, ancho_mm:2400, area_m2:14.4, kg_ud:40.8, precio_usd_kg:0, historial_precios:[], notas:"Hierromat MD458 (1200x2440) / MD462 (1500x3000): DM62 dm25, romboidal" },
  { id:"REJ_METAL_DESPL_MD471", nombre:"Metal despl. MD471", kg_m2:5.2, largo_mm:3000, ancho_mm:1500, area_m2:4.5, kg_ud:23.4, precio_usd_kg:0, historial_precios:[], notas:"Hierromat MD471: DM100 dm36, alt 14,4, romboidal. Panel 1500x3000" },
  { id:"REJ_METAL_DESPL_MD478_E1_2", nombre:"Metal despl. MD478 e1,2", kg_m2:6.6, largo_mm:3000, ancho_mm:1000, area_m2:3.0, kg_ud:19.8, precio_usd_kg:0, historial_precios:[], notas:"Hierromat MD478: DM100 dm40, alt 17,6, romboidal. Panel 1000x3000" },
];

const CATS = ["Todas","HEB","HEA","IPE","IPN","UPN","W americanas","Cajón UPN","Ángulo","T","Redondo","Redondo liso","Barra conformada","Cuadrado macizo","Hexagonal","Tubo cuadrado","Tubo rectangular","Tubo redondo","Caño SCH40","Caño SCH80","Caño Galvanizado","Caño Cédula","Perfil C","Perfil C conformado","Perfil U conformado","U Chico"];

// ═══════════════════════════════════════════════════════════════════
// FICHA MODAL — precios + datos técnicos + eliminar
// ═══════════════════════════════════════════════════════════════════
// Exportado (2026-09-03, a pedido de Gino): la ficha de material que se
// abre desde un ítem de Presupuesto reusa este mismo componente en vez de
// tener su propia versión resumida — "debe ser la misma información que
// tienen los materiales en el catálogo". Ver FichaHierroModal en
// Presupuesto.jsx.
export function FichaModal({ mat, tipo, onClose, onUpdate, onEliminar }) {
  const [tab,      setTab]      = useState("precios");
  const [form,     setForm]     = useState({ fecha: hoy(), proveedor: "", precio: "" });
  const [guardado, setGuardado] = useState(false);
  // datos técnicos — formulario de edición
  const initDatos = () => tipo === "plancha"
    ? { nombre: mat.nombre, espesor: String(mat.espesor), largo_mm: String(mat.largo_mm), ancho_mm: String(mat.ancho_mm) }
    : tipo === "rejilla"
    ? { nombre: mat.nombre, kg_m2: String(mat.kg_m2), largo_mm: String(mat.largo_mm), ancho_mm: String(mat.ancho_mm) }
    : tipo === "planchuela"
    ? { nombre: mat.nombre, ancho: String(mat.ancho_mm || ""), espesor: String(mat.espesor_mm || "") }
    : { nombre: mat.nombre, cat: mat.cat || "", kg_m: String(mat.kg_m), largo: String(mat.largo), sup: String(mat.sup) };
  const [datos,    setDatos]    = useState(initDatos);
  const [editando, setEditando] = useState(false);
  const [confirmarGuardarDatos, setConfirmarGuardarDatos] = useState(false);
  const [confirmarEliminarMat, setConfirmarEliminarMat] = useState(false);

  const historial = [...(mat.historial_precios || [])].sort((a, b) => {
    if (!a.fecha) return 1; if (!b.fecha) return -1;
    return b.fecha.localeCompare(a.fecha);
  });

  // ── Precios ──
  const guardar = () => {
    const p = parseFloat(form.precio);
    if (!p || p <= 0) return;
    const entrada = { id: uid(), fecha: form.fecha, proveedor: form.proveedor.trim(), precio: p };
    const nuevas  = [entrada, ...(mat.historial_precios || [])];
    onUpdate({ ...mat, historial_precios: nuevas, precio_usd_kg: p });
    setForm({ fecha: hoy(), proveedor: "", precio: "" });
    setGuardado(true);
    setTimeout(() => setGuardado(false), 1800);
  };
  const eliminarPrecio = (id) => {
    const nuevas = mat.historial_precios.filter(e => e.id !== id);
    const sorted = [...nuevas].sort((a, b) => b.fecha?.localeCompare(a.fecha) ?? 0);
    onUpdate({ ...mat, historial_precios: nuevas, precio_usd_kg: sorted.length ? sorted[0].precio : 0 });
  };

  // ── Datos técnicos ──
  const guardarDatos = () => {
    let actualizado = { ...mat };
    if (tipo === "plancha") {
      const esp = parseFloat(datos.espesor) || mat.espesor;
      const L   = parseFloat(datos.largo_mm) || mat.largo_mm;
      const A   = parseFloat(datos.ancho_mm) || mat.ancho_mm;
      const kg_m2 = Math.round(esp * 7.85 * 100) / 100;
      const area  = Math.round(L / 1000 * A / 1000 * 1000) / 1000;
      actualizado = { ...actualizado, nombre: datos.nombre.trim() || mat.nombre, espesor: esp, largo_mm: L, ancho_mm: A, kg_m2, area_m2: area, kg_ud: Math.round(kg_m2 * area * 10) / 10 };
    } else if (tipo === "rejilla") {
      const kg_m2 = parseFloat(datos.kg_m2) || mat.kg_m2;
      const L = parseFloat(datos.largo_mm) || mat.largo_mm;
      const A = parseFloat(datos.ancho_mm) || mat.ancho_mm;
      const area = Math.round(L / 1000 * A / 1000 * 1000) / 1000;
      actualizado = { ...actualizado, nombre: datos.nombre.trim() || mat.nombre, kg_m2, largo_mm: L, ancho_mm: A, area_m2: area, kg_ud: Math.round(kg_m2 * area * 10) / 10 };
    } else if (tipo === "planchuela") {
      const ancho = parseFloat(datos.ancho)   || mat.ancho_mm   || 0;
      const esp   = parseFloat(datos.espesor) || mat.espesor_mm || 0;
      const largo = parseFloat(datos.largo) || mat.largo || 6;
      const kg_m  = ancho > 0 && esp > 0 ? Math.round(ancho * esp * 7.85 / 1000 * 1000) / 1000 : mat.kg_m;
      const sup   = ancho > 0 && esp > 0 ? Math.round(2 * (ancho + esp) / 1000 * 1000) / 1000 : mat.sup;
      actualizado = { ...actualizado, nombre: datos.nombre.trim() || mat.nombre, ancho_mm: ancho, espesor_mm: esp, kg_m, largo, sup };
    } else {
      actualizado = { ...actualizado,
        nombre: datos.nombre.trim() || mat.nombre,
        cat:    datos.cat || mat.cat,
        kg_m:   parseFloat(datos.kg_m) || mat.kg_m,
        largo:  parseFloat(datos.largo) || mat.largo,
        sup:    parseFloat(datos.sup)   || mat.sup,
      };
    }
    onUpdate(actualizado);
    setEditando(false);
  };

  const handleEliminar = () => {
    onEliminar(mat.id);
    onClose();
  };

  const infoLinea = tipo === "plancha"
    ? `${mat.espesor} mm · ${mat.kg_m2} kg/m² · ${mat.area_m2} m² · ${mat.kg_ud} kg/plancha`
    : tipo === "rejilla"
    ? `${mat.kg_m2} kg/m² · ${mat.largo_mm}×${mat.ancho_mm} mm · ${mat.area_m2} m² · ${mat.kg_ud} kg/panel`
    : `${mat.kg_m} kg/m · ${mat.largo} m largo · ${mat.sup} m²/m`;

  const TABS = [{ id:"precios", label:"💲 Precios" }, { id:"datos", label:"🔧 Datos técnicos" }];

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:"fixed", inset:0, background:"#00000099", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, width:560, maxWidth:"96vw", maxHeight:"90vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Header */}
        <div style={{ padding:"16px 20px 0", borderBottom:`1px solid ${C.border}33` }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:12 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:16, color:C.text }}>{mat.nombre}</div>
              <div style={{ fontSize:11, color:C.muted, marginTop:3 }}>{infoLinea}</div>
              {mat.precio_usd_kg > 0 && (
                <div style={{ marginTop:6 }}>
                  <span style={BDG(C.ok, true)}>Precio vigente: ${mat.precio_usd_kg.toFixed(3)} USD/kg</span>
                </div>
              )}
            </div>
            <button onClick={onClose} style={{ background:"transparent", border:"none", color:C.muted, fontSize:20, cursor:"pointer", lineHeight:1, padding:0 }}>✕</button>
          </div>
          {/* Pestañas */}
          <div style={{ display:"flex", gap:4 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setEditando(false); }}
                style={{ background:"transparent", border:"none", borderBottom: tab===t.id ? `2px solid ${C.accent}` : "2px solid transparent",
                  color: tab===t.id ? C.accent : C.muted, padding:"7px 14px", cursor:"pointer", fontSize:12, fontWeight: tab===t.id ? 700 : 400, marginBottom:"-1px" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div style={{ flex:1, overflow:"auto", padding:"16px 20px" }}>

          {/* ── PESTAÑA PRECIOS ── */}
          {tab === "precios" && (<>
            <div style={{ background:C.iron, border:`1px solid ${C.accent}33`, borderRadius:10, padding:14, marginBottom:18 }}>
              <div style={{ fontSize:11, color:C.accent, fontWeight:700, textTransform:"uppercase", letterSpacing:.5, marginBottom:10 }}>
                Registrar nuevo precio
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"flex-end" }}>
                <div>
                  <label style={LBL}>Fecha</label>
                  <input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                    style={{ ...INP, width:130, padding:"6px 8px" }} />
                </div>
                <div style={{ flex:1, minWidth:120 }}>
                  <label style={LBL}>Proveedor</label>
                  <input type="text" placeholder="Ej: Armacero, Dinter…" value={form.proveedor}
                    onChange={e => setForm(f => ({ ...f, proveedor: e.target.value }))}
                    style={{ ...INP, padding:"6px 8px" }} />
                </div>
                <div>
                  <label style={LBL}>USD/kg</label>
                  <input autoFocus type="number" step="0.001" placeholder="0.000" value={form.precio}
                    onChange={e => setForm(f => ({ ...f, precio: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && guardar()}
                    style={{ ...INP, width:90, textAlign:"right", padding:"6px 8px" }} />
                </div>
                <button onClick={guardar} disabled={!form.precio || parseFloat(form.precio) <= 0}
                  style={{ ...BTN(form.precio && parseFloat(form.precio) > 0 ? "ok" : "ghost"), whiteSpace:"nowrap", opacity: form.precio && parseFloat(form.precio) > 0 ? 1 : 0.5 }}>
                  {guardado ? "✓ Guardado" : "Guardar"}
                </button>
              </div>
            </div>
            <div style={{ fontSize:11, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>
              Historial de precios
            </div>
            {historial.length === 0 && (
              <div style={{ color:C.muted, fontSize:12, padding:"14px 0", textAlign:"center" }}>Sin registros — ingresá el primer precio arriba</div>
            )}
            {historial.length > 0 && (
              <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, overflow:"hidden" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead><tr>
                    <th style={TH}>Fecha</th><th style={TH}>Proveedor</th>
                    <th style={TH_R}>USD/kg</th><th style={{ ...TH, width:32 }}></th>
                  </tr></thead>
                  <tbody>
                    {historial.map((e, i) => (
                      <tr key={e.id} style={{ background: i === 0 ? C.ok + "0b" : "transparent" }}>
                        <td style={{ ...TD, fontWeight: i === 0 ? 700 : 400 }}>
                          {e.fecha || "—"}
                          {i === 0 && <span style={{ ...BDG(C.ok, true), marginLeft:8, fontSize:9 }}>VIGENTE</span>}
                        </td>
                        <td style={{ ...TD, color:C.muted }}>{e.proveedor || "—"}</td>
                        <td style={{ ...TD_R, color: i === 0 ? C.ok : C.steel, fontWeight: i === 0 ? 800 : 400 }}>${e.precio.toFixed(3)}</td>
                        <td style={{ ...TD, textAlign:"center" }}>
                          <button onClick={() => eliminarPrecio(e.id)} style={{ background:"transparent", border:"none", color:C.err, cursor:"pointer", fontSize:12, padding:"1px 4px" }}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>)}

          {/* ── PESTAÑA DATOS TÉCNICOS ── */}
          {tab === "datos" && (
            <div>
              {!editando ? (
                <>
                  {/* Vista lectura */}
                  <div style={{ background:C.iron, borderRadius:10, padding:16, marginBottom:16 }}>
                    {tipo === "plancha" && (<>
                      <Row l="Nombre"        v={mat.nombre} />
                      <Row l="Espesor"       v={`${mat.espesor} mm`} />
                      <Row l="Dimensiones"   v={`${mat.largo_mm} × ${mat.ancho_mm} mm`} />
                      <Row l="kg/m²"         v={mat.kg_m2} />
                      <Row l="Área"          v={`${mat.area_m2} m²`} />
                      <Row l="kg/plancha"    v={mat.kg_ud} />
                    </>)}
                    {tipo === "planchuela" && (<>
                      <Row l="Nombre"        v={mat.nombre} />
                      <Row l="Ancho"         v={`${mat.ancho_mm || "—"} mm`} />
                      <Row l="Espesor"       v={`${mat.espesor_mm || "—"} mm`} />
                      <Row l="kg/m"          v={mat.kg_m} />
                      <Row l="Largo comerc." v={`${mat.largo} m`} />
                      <Row l="m²/m"          v={mat.sup} />
                    </>)}
                    {tipo === "rejilla" && (<>
                      <Row l="Nombre"     v={mat.nombre} />
                      <Row l="kg/m²"      v={mat.kg_m2} />
                      <Row l="Panel"      v={`${mat.largo_mm} × ${mat.ancho_mm} mm`} />
                      <Row l="Área"       v={`${mat.area_m2} m²`} />
                      <Row l="kg/panel"   v={mat.kg_ud} />
                      {mat.notas && <Row l="Notas" v={mat.notas} />}
                    </>)}
                    {tipo === "perfil" && (<>
                      <Row l="Nombre"        v={mat.nombre} />
                      <Row l="Categoría"     v={mat.cat} />
                      <Row l="kg/m"          v={mat.kg_m} />
                      <Row l="Largo comerc." v={`${mat.largo} m`} />
                      <Row l="m²/m (sup.)"   v={mat.sup} />
                    </>)}
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => setEditando(true)} style={{ ...BTN("ghost"), borderColor: C.warn+"66", color: C.warn }}>
                      ✏️ Editar datos
                    </button>
                    <button onClick={() => setConfirmarEliminarMat(true)} style={{ ...BTN("danger") }}>
                      🗑️ Eliminar material
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Vista edición */}
                  <div style={{ background:C.iron, border:`1px solid ${C.warn}44`, borderRadius:10, padding:16, marginBottom:16 }}>
                    <div style={{ fontSize:11, color:C.warn, fontWeight:700, marginBottom:12, textTransform:"uppercase", letterSpacing:.5 }}>
                      ⚠️ Editando datos técnicos
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      <Field l="Nombre" v={datos.nombre} onChange={v=>setDatos(d=>({...d,nombre:v}))} />
                      {tipo === "plancha" && (<>
                        <Field l="Espesor (mm)"   v={datos.espesor}  onChange={v=>setDatos(d=>({...d,espesor:v}))}  num />
                        <Field l="Largo (mm)"     v={datos.largo_mm} onChange={v=>setDatos(d=>({...d,largo_mm:v}))} num />
                        <Field l="Ancho (mm)"     v={datos.ancho_mm} onChange={v=>setDatos(d=>({...d,ancho_mm:v}))} num />
                        <div style={{ fontSize:11, color:C.muted }}>
                          kg/m² y kg/plancha se recalculan automáticamente (espesor × 7,85)
                        </div>
                      </>)}
                      {tipo === "planchuela" && (<>
                        <Field l="Ancho (mm)"     v={datos.ancho}    onChange={v=>setDatos(d=>({...d,ancho:v}))}    num />
                        <Field l="Espesor (mm)"   v={datos.espesor}  onChange={v=>setDatos(d=>({...d,espesor:v}))}  num />
                        <div style={{ fontSize:11, color:C.muted }}>
                          kg/m y m²/m se recalculan automáticamente
                        </div>
                      </>)}
                      {tipo === "rejilla" && (<>
                        <Field l="kg/m²"       v={datos.kg_m2}    onChange={v=>setDatos(d=>({...d,kg_m2:v}))}    num step="0.01" />
                        <Field l="Largo panel (mm)" v={datos.largo_mm} onChange={v=>setDatos(d=>({...d,largo_mm:v}))} num />
                        <Field l="Ancho panel (mm)" v={datos.ancho_mm} onChange={v=>setDatos(d=>({...d,ancho_mm:v}))} num />
                        <div style={{ fontSize:11, color:C.muted }}>
                          kg/panel se recalcula automáticamente (kg/m² × área)
                        </div>
                      </>)}
                      {tipo === "perfil" && (<>
                        <div>
                          <label style={LBL}>Categoría</label>
                          <select value={datos.cat} onChange={e=>setDatos(d=>({...d,cat:e.target.value}))} style={{...INP}}>
                            {CATS.filter(c=>c!=="Todas").map(c=><option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <Field l="kg/m"              v={datos.kg_m}  onChange={v=>setDatos(d=>({...d,kg_m:v}))}  num step="0.001" />
                        <Field l="Largo comercial (m)" v={datos.largo} onChange={v=>setDatos(d=>({...d,largo:v}))} num />
                        <Field l="m²/m (superficie)"  v={datos.sup}   onChange={v=>setDatos(d=>({...d,sup:v}))}   num step="0.001" />
                      </>)}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => setConfirmarGuardarDatos(true)} style={{ ...BTN("ok") }}>✓ Guardar cambios</button>
                    <button onClick={() => { setEditando(false); setDatos(initDatos()); }} style={BTN("ghost")}>Cancelar</button>
                  </div>
                </>
              )}
              {confirmarGuardarDatos && (
                <ModalConfirmarBorrado
                  titulo={`cambios en los datos técnicos de "${mat.nombre}"`}
                  subtitulo="Recalcula kg/m, kg/m² o m² según el tipo de material — verificá los valores antes de confirmar."
                  verbo="Guardar"
                  checkboxLabel="Sí, quiero guardar estos cambios"
                  labelBoton="✓ Guardar"
                  color={C.ok}
                  onConfirm={() => { guardarDatos(); setConfirmarGuardarDatos(false); }}
                  onClose={() => setConfirmarGuardarDatos(false)}
                />
              )}
              {confirmarEliminarMat && (
                <ModalConfirmarBorrado
                  titulo={`"${mat.nombre}" de la biblioteca`}
                  subtitulo="Esta acción no se puede deshacer."
                  onConfirm={() => { setConfirmarEliminarMat(false); handleEliminar(); }}
                  onClose={() => setConfirmarEliminarMat(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// helpers de ficha
function Row({ l, v }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${C.border}22` }}>
      <span style={{ fontSize:12, color:C.muted }}>{l}</span>
      <span style={{ fontSize:12, fontWeight:700, color:C.text }}>{v}</span>
    </div>
  );
}
function Field({ l, v, onChange, num, step }) {
  return (
    <div>
      <label style={LBL}>{l}</label>
      <input type={num ? "number" : "text"} step={step} value={v} onChange={e=>onChange(e.target.value)}
        onFocus={e=>e.target.select()}
        style={{ ...INP, padding:"6px 8px" }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MODAL AGREGAR MATERIAL
// ═══════════════════════════════════════════════════════════════════
function AgregarModal({ tipo, onClose, onAgregar }) {
  const init = tipo === "plancha"
    ? { nombre:"", espesor:"", largo_mm:"6000", ancho_mm:"1500" }
    : tipo === "rejilla"
    ? { nombre:"", kg_m2:"", largo_mm:"6000", ancho_mm:"2400" }
    : tipo === "planchuela"
    ? { nombre:"", ancho:"", espesor:"", largo:"6" }
    : { nombre:"", cat:"HEB", kg_m:"", largo:"12", sup:"" };
  const [f, setF] = useState(init);
  const set = (k,v) => setF(prev=>({...prev,[k]:v}));

  const listo = tipo === "plancha"
    ? f.nombre && f.espesor && f.largo_mm && f.ancho_mm
    : tipo === "rejilla"
    ? f.nombre && f.kg_m2 && f.largo_mm && f.ancho_mm
    : tipo === "planchuela"
    ? f.nombre && f.ancho && f.espesor
    : f.nombre && f.kg_m;

  const crear = () => {
    if (!listo) return;
    let item;
    if (tipo === "plancha") {
      const esp  = parseFloat(f.espesor);
      const L    = parseFloat(f.largo_mm);
      const A    = parseFloat(f.ancho_mm);
      const kg_m2 = Math.round(esp * 7.85 * 100) / 100;
      const area  = Math.round(L / 1000 * A / 1000 * 1000) / 1000;
      item = { id: uid(), nombre: f.nombre.trim(), espesor: esp, kg_m2, largo_mm: L, ancho_mm: A, area_m2: area, kg_ud: Math.round(kg_m2 * area * 10) / 10, precio_usd_kg: 0, historial_precios: [], ...stamp() };
    } else if (tipo === "rejilla") {
      const kg_m2 = parseFloat(f.kg_m2);
      const L = parseFloat(f.largo_mm);
      const A = parseFloat(f.ancho_mm);
      const area = Math.round(L / 1000 * A / 1000 * 1000) / 1000;
      item = { id: uid(), nombre: f.nombre.trim(), kg_m2, largo_mm: L, ancho_mm: A, area_m2: area, kg_ud: Math.round(kg_m2 * area * 10) / 10, precio_usd_kg: 0, historial_precios: [], notas: "", ...stamp() };
    } else if (tipo === "planchuela") {
      const ancho = parseFloat(f.ancho);
      const esp   = parseFloat(f.espesor);
      const largo = parseFloat(f.largo) || 6;
      const kg_m  = Math.round(ancho * esp * 7.85 / 1000 * 1000) / 1000;
      const sup   = Math.round(2 * (ancho + esp) / 1000 * 1000) / 1000;
      item = { id: uid(), nombre: f.nombre.trim() || `Planchuela ${ancho}×${esp} mm`, cat:"Planchuelas", ancho_mm: ancho, espesor_mm: esp, kg_m, largo, sup, precio_usd_kg: 0, historial_precios: [], ...stamp() };
    } else {
      item = { id: uid(), nombre: f.nombre.trim(), cat: f.cat, kg_m: parseFloat(f.kg_m)||0, largo: parseFloat(f.largo)||12, sup: parseFloat(f.sup)||0, precio_usd_kg: 0, historial_precios: [], ...stamp() };
    }
    onAgregar(item);
    onClose();
  };

  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}}
      style={{position:"fixed",inset:0,background:"#00000099",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,width:460,maxWidth:"96vw",overflow:"hidden"}}>
        <div style={{padding:"16px 20px 12px",borderBottom:`1px solid ${C.border}33`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{flex:1,fontWeight:800,fontSize:15,color:C.text}}>
            Agregar {tipo === "plancha" ? "plancha" : tipo === "rejilla" ? "rejilla" : tipo === "planchuela" ? "planchuela" : "perfil"}
          </div>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:C.muted,fontSize:20,cursor:"pointer",padding:0}}>✕</button>
        </div>
        <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:10}}>
          <Field l="Nombre" v={f.nombre} onChange={v=>set("nombre",v)} />
          {tipo === "plancha" && (<>
            <Field l="Espesor (mm)" v={f.espesor} onChange={v=>set("espesor",v)} num step="0.001" />
            <Field l="Largo (mm)"   v={f.largo_mm} onChange={v=>set("largo_mm",v)} num />
            <Field l="Ancho (mm)"   v={f.ancho_mm} onChange={v=>set("ancho_mm",v)} num />
            {f.espesor && <div style={{fontSize:11,color:C.muted}}>kg/m² = {(parseFloat(f.espesor)||0)*7.85} · kg/plancha = {Math.round((parseFloat(f.espesor)||0)*7.85*(parseFloat(f.largo_mm)||0)/1000*(parseFloat(f.ancho_mm)||0)/1000*10)/10}</div>}
          </>)}
          {tipo === "rejilla" && (<>
            <Field l="kg/m²"          v={f.kg_m2} onChange={v=>set("kg_m2",v)} num step="0.01" />
            <Field l="Largo panel (mm)" v={f.largo_mm} onChange={v=>set("largo_mm",v)} num />
            <Field l="Ancho panel (mm)" v={f.ancho_mm} onChange={v=>set("ancho_mm",v)} num />
            {f.kg_m2 && f.largo_mm && f.ancho_mm && <div style={{fontSize:11,color:C.muted}}>kg/panel = {Math.round((parseFloat(f.kg_m2)||0)*(parseFloat(f.largo_mm)||0)/1000*(parseFloat(f.ancho_mm)||0)/1000*10)/10}</div>}
          </>)}
          {tipo === "planchuela" && (<>
            <Field l="Ancho (mm)"   v={f.ancho}   onChange={v=>set("ancho",v)}   num />
            <Field l="Espesor (mm)" v={f.espesor} onChange={v=>set("espesor",v)} num />
            <Field l="Largo comerc. (m)" v={f.largo} onChange={v=>set("largo",v)} num />
            {f.ancho && f.espesor && <div style={{fontSize:11,color:C.muted}}>kg/m = {Math.round((parseFloat(f.ancho)||0)*(parseFloat(f.espesor)||0)*7.85/1000*1000)/1000}</div>}
          </>)}
          {tipo === "perfil" && (<>
            <div>
              <label style={LBL}>Categoría</label>
              <select value={f.cat} onChange={e=>set("cat",e.target.value)} style={{...INP}}>
                {CATS.filter(c=>c!=="Todas").map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Field l="kg/m"               v={f.kg_m}  onChange={v=>set("kg_m",v)}  num step="0.001" />
            <Field l="Largo comercial (m)" v={f.largo} onChange={v=>set("largo",v)} num />
            <Field l="m²/m (superficie)"   v={f.sup}   onChange={v=>set("sup",v)}   num step="0.001" />
          </>)}
          <div style={{display:"flex",gap:8,marginTop:6}}>
            <button onClick={crear} disabled={!listo}
              style={{...BTN("ok"),opacity:listo?1:0.5,flex:1}}>
              + Agregar
            </button>
            <button onClick={onClose} style={{...BTN("ghost"),flex:1}}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CELDA PRECIO ────────────────────────────────────────────────
function CeldaPrecio({ item, onAbrir }) {
  const p  = item.precio_usd_kg || 0;
  const nh = item.historial_precios?.length || 0;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, justifyContent:"flex-end" }}>
      <span style={{ fontWeight:700, color: p > 0 ? C.ok : C.err, fontSize:13 }}>
        {p > 0 ? `$${p.toFixed(3)}` : "—"}
      </span>
      <button onClick={onAbrir} title="Ver/editar historial de precios"
        style={{ background:C.accent+"18", border:`1px solid ${C.accent}33`, borderRadius:5, color:C.accent, cursor:"pointer", fontSize:10, padding:"2px 7px", fontWeight:700, whiteSpace:"nowrap" }}>
        📋{nh > 0 ? ` ${nh}` : ""}
      </button>
    </div>
  );
}

// ─── LOTE FORM ───────────────────────────────────────────────────
function LotePanel({ label, onAplicar, onCerrar }) {
  const [f, setF] = useState({ precio:"", proveedor:"", fecha:hoy() });
  const ok = parseFloat(f.precio) > 0;
  return (
    <div style={{ background:C.iron, border:`1px solid ${C.border}`, borderRadius:8, padding:"12px 16px", marginBottom:14 }}>
      <div style={{ fontSize:11, color:C.accent, fontWeight:700, marginBottom:8, textTransform:"uppercase", letterSpacing:.5 }}>
        Precio en lote — {label}
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"flex-end" }}>
        <div>
          <label style={LBL}>Fecha</label>
          <input type="date" value={f.fecha} onChange={e=>setF(v=>({...v,fecha:e.target.value}))} style={{...INP,width:130,padding:"6px 8px"}} />
        </div>
        <div style={{ flex:1, minWidth:120 }}>
          <label style={LBL}>Proveedor</label>
          <input type="text" placeholder="Ej: Armacero" value={f.proveedor} onChange={e=>setF(v=>({...v,proveedor:e.target.value}))} style={{...INP,padding:"6px 8px"}} />
        </div>
        <div>
          <label style={LBL}>USD/kg</label>
          <input autoFocus type="number" step="0.001" placeholder="0.000" value={f.precio}
            onChange={e=>setF(v=>({...v,precio:e.target.value}))}
            onKeyDown={e=>e.key==="Enter"&&ok&&onAplicar(f)}
            style={{...INP,width:90,textAlign:"right",padding:"6px 8px"}} />
        </div>
        <button onClick={()=>ok&&onAplicar(f)} style={{...BTN("ok"),opacity:ok?1:0.5}}>Aplicar</button>
        <button onClick={onCerrar} style={BTN("ghost")}>Cancelar</button>
      </div>
    </div>
  );
}

// ─── HELPERS UI ──────────────────────────────────────────────────
function Alerta({ n, tipo }) {
  if (n === 0) return null;
  return (
    <div style={{ background:C.warn+"11", border:`1px solid ${C.warn}33`, borderRadius:8, padding:"7px 14px", marginBottom:12, fontSize:12, color:C.warn }}>
      ⚠️ <strong>{n} {tipo}</strong> sin precio registrado
    </div>
  );
}
function Stats({ items, filtrados }) {
  return (
    <div style={{ display:"flex", gap:10, marginTop:12, flexWrap:"wrap" }}>
      {[
        { label:"Total",      val:items.length,                               col:C.steel },
        { label:"Con precio", val:items.filter(p=>p.precio_usd_kg>0).length, col:C.ok },
        { label:"Sin precio", val:items.filter(p=>!p.precio_usd_kg).length,  col:items.some(p=>!p.precio_usd_kg)?C.err:C.ok },
        { label:"Mostrando",  val:filtrados.length,                           col:C.info },
      ].map(s => (
        <div key={s.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"7px 14px" }}>
          <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:2 }}>{s.label}</div>
          <div style={{ fontSize:20, fontWeight:800, color:s.col }}>{s.val}</div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SECCIÓN PERFILES
// ═══════════════════════════════════════════════════════════════════
function SeccionPerfiles() {
  const [items,      setItems]      = useState(() => migrar(mergeSeed(loadLS("smeas_perfiles", null), PERFILES_DATA, IDS_UNIFICADOS_GM)));
  useMergeBibliotecaNube("perfil", setItems);
  const [cat,        setCat]        = useState("Todas");
  const [busq,       setBusq]       = useState("");
  const [fichaId,    setFichaId]    = useState(null);
  const [showLote,   setShowLote]   = useState(false);
  const [showAgreg,  setShowAgreg]  = useState(false);

  useEffect(() => { saveLS("smeas_perfiles", items); }, [items]);

  const actualizar  = mat => { const t = touch(mat); setItems(prev => prev.map(p => p.id === mat.id ? t : p)); dualWriteMaterial("perfil", t); };
  const eliminarMat = id  => setItems(prev => prev.filter(p => p.id !== id));
  const agregarMat  = mat => { setItems(prev => [...prev, mat]); dualWriteMaterial("perfil", mat); };

  const enFiltro = p => (cat === "Todas" || p.cat === cat) && norm(p.nombre).includes(norm(busq));
  const lista = items.filter(enFiltro);

  const aplicarLote = (f) => {
    const v = parseFloat(f.precio);
    const entrada = { id: uid(), fecha: f.fecha, proveedor: f.proveedor || "Lote", precio: v };
    setItems(prev => prev.map(p =>
      enFiltro(p)
        ? { ...p, precio_usd_kg: v, historial_precios: [entrada, ...(p.historial_precios || [])] }
        : p
    ));
    items.filter(enFiltro).forEach(p => {
      dualWriteMaterial("perfil", { ...p, precio_usd_kg: v });
      dualWriteHistorialPrecio("perfil", p.id, { fecha: entrada.fecha, proveedor: entrada.proveedor, precio: v });
    });
    setShowLote(false);
  };

  const fichaItem = fichaId ? items.find(p => p.id === fichaId) : null;

  return (
    <div>
      {fichaItem && <FichaModal mat={fichaItem} tipo="perfil" onClose={() => setFichaId(null)} onUpdate={actualizar} onEliminar={eliminarMat} />}
      {showAgreg  && <AgregarModal tipo="perfil" onClose={() => setShowAgreg(false)} onAgregar={agregarMat} />}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:10 }}>
        <p style={{ margin:0, color:C.muted, fontSize:12 }}>{items.length} perfiles · kg/m · sup = m²/m (superficie arenado/pintura)</p>
        <div style={{ display:"flex", gap:6 }}>
          <BtnSyncPrecios items={items} seed={PERFILES_DATA} onSync={setItems} />
          <button onClick={() => setShowAgreg(true)} style={{ ...BTN("ghost"), borderColor: C.ok+"66", color: C.ok }}>+ Agregar perfil</button>
          <button onClick={() => setShowLote(v => !v)} style={BTN("ghost")}>Precio en lote</button>
        </div>
      </div>

      {showLote && (
        <LotePanel label={`${lista.length} ítem${lista.length!==1?"s":""}${cat!=="Todas"?` — ${cat}`:""}${busq?` — "${busq}"`:""}`} onAplicar={aplicarLote} onCerrar={() => setShowLote(false)} />
      )}

      <Alerta n={items.filter(p => !p.precio_usd_kg).length} tipo="perfiles" />

      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
        <input type="text" placeholder="Buscar…" value={busq} onChange={e => setBusq(e.target.value)}
          style={{ ...INP, width:200, padding:"6px 10px" }} />
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ background:cat===c?C.accent+"22":C.iron, border:`1px solid ${cat===c?C.accent:C.border}`, borderRadius:999, color:cat===c?C.accent:C.muted, padding:"3px 11px", fontSize:11, fontWeight:cat===c?700:400, cursor:"pointer" }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background:C.card, borderRadius:10, border:`1px solid ${C.border}`, overflow:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:660 }}>
          <thead>
            <tr>
              <th style={TH}>Perfil</th>
              <th style={TH_R}>kg/m</th>
              <th style={TH_R}>Largo</th>
              <th style={TH_R}>kg/barra</th>
              <th style={{ ...TH_R, color:C.teal }}>m²/m</th>
              <th style={{ ...TH_R, color:C.teal }}>m²/barra</th>
              <th style={TH_R}>USD/kg</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && <tr><td colSpan={7} style={{ ...TD, textAlign:"center", color:C.muted, padding:28 }}>Sin resultados</td></tr>}
            {lista.map(p => (
              <tr key={p.id}
                onMouseEnter={e => e.currentTarget.style.background = C.iron}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={TD}>
                  <span style={{ fontWeight:600 }}>{p.nombre}</span>
                  <span style={{ marginLeft:6, fontSize:10, ...BDG(C.steelDk, true) }}>{p.cat}</span>
                </td>
                <td style={TD_R}>{p.kg_m.toFixed(3)}</td>
                <td style={{ ...TD_R, color:C.muted }}>{p.largo} m</td>
                <td style={{ ...TD_R, color:C.steel }}>{(p.kg_m * p.largo).toFixed(1)}</td>
                <td style={{ ...TD_R, color:C.teal }}>{p.sup.toFixed(3)}</td>
                <td style={{ ...TD_R, color:C.teal }}>{(p.sup * p.largo).toFixed(2)}</td>
                <td style={TD_R}><CeldaPrecio item={p} onAbrir={() => setFichaId(p.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Stats items={items} filtrados={lista} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SECCIÓN PLANCHUELAS
// ═══════════════════════════════════════════════════════════════════
function SeccionPlanchuelas() {
  const [items,     setItems]     = useState(() => migrar(mergeSeed(loadLS("smeas_planchuelas", null), PLANCHUELAS_DATA)));
  useMergeBibliotecaNube("planchuela", setItems);
  const [busq,      setBusq]      = useState("");
  const [fichaId,   setFichaId]   = useState(null);
  const [showLote,  setShowLote]  = useState(false);
  const [showAgreg, setShowAgreg] = useState(false);

  useEffect(() => { saveLS("smeas_planchuelas", items); }, [items]);

  const actualizar  = mat => { const t = touch(mat); setItems(prev => prev.map(p => p.id === mat.id ? t : p)); dualWriteMaterial("planchuela", t); };
  const eliminarMat = id  => setItems(prev => prev.filter(p => p.id !== id));
  const agregarMat  = mat => { setItems(prev => [...prev, mat]); dualWriteMaterial("planchuela", mat); };
  const lista = items.filter(p => norm(p.nombre).includes(norm(busq)));

  const aplicarLote = (f) => {
    const v = parseFloat(f.precio);
    const entrada = { id: uid(), fecha: f.fecha, proveedor: f.proveedor || "Lote", precio: v };
    const idsFiltrados = new Set(lista.map(p => p.id));
    setItems(prev => prev.map(p =>
      idsFiltrados.has(p.id)
        ? { ...p, precio_usd_kg: v, historial_precios: [entrada, ...(p.historial_precios || [])] }
        : p
    ));
    setShowLote(false);
  };

  const fichaItem = fichaId ? items.find(p => p.id === fichaId) : null;

  return (
    <div>
      {fichaItem && <FichaModal mat={fichaItem} tipo="planchuela" onClose={() => setFichaId(null)} onUpdate={actualizar} onEliminar={eliminarMat} />}
      {showAgreg  && <AgregarModal tipo="planchuela" onClose={() => setShowAgreg(false)} onAgregar={agregarMat} />}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:10 }}>
        <p style={{ margin:0, color:C.muted, fontSize:12 }}>{items.length} planchuelas · kg/m = ancho×esp×7,85/1000</p>
        <div style={{ display:"flex", gap:6 }}>
          <BtnSyncPrecios items={items} seed={PLANCHUELAS_DATA} onSync={setItems} />
          <button onClick={() => setShowAgreg(true)} style={{ ...BTN("ghost"), borderColor: C.ok+"66", color: C.ok }}>+ Agregar planchuela</button>
          <button onClick={() => setShowLote(v => !v)} style={BTN("ghost")}>Precio en lote</button>
        </div>
      </div>

      {showLote && (
        <LotePanel label={`${lista.length} ítem${lista.length!==1?"s":""}${busq?` — "${busq}"`:""}`} onAplicar={aplicarLote} onCerrar={() => setShowLote(false)} />
      )}

      <Alerta n={items.filter(p => !p.precio_usd_kg).length} tipo="planchuelas" />
      <input type="text" placeholder="Buscar planchuela…" value={busq} onChange={e => setBusq(e.target.value)}
        style={{ ...INP, width:240, padding:"6px 10px", marginBottom:12 }} />

      <div style={{ background:C.card, borderRadius:10, border:`1px solid ${C.border}`, overflow:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:580 }}>
          <thead>
            <tr>
              <th style={TH}>Planchuela</th>
              <th style={TH_R}>kg/m</th>
              <th style={TH_R}>Largo</th>
              <th style={TH_R}>kg/barra</th>
              <th style={{ ...TH_R, color:C.teal }}>m²/m</th>
              <th style={{ ...TH_R, color:C.teal }}>m²/barra</th>
              <th style={TH_R}>USD/kg</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && <tr><td colSpan={7} style={{ ...TD, textAlign:"center", color:C.muted, padding:28 }}>Sin resultados</td></tr>}
            {lista.map(p => (
              <tr key={p.id}
                onMouseEnter={e => e.currentTarget.style.background = C.iron}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ ...TD, fontWeight:600 }}>{p.nombre}</td>
                <td style={TD_R}>{p.kg_m.toFixed(3)}</td>
                <td style={{ ...TD_R, color:C.muted }}>{p.largo} m</td>
                <td style={{ ...TD_R, color:C.steel }}>{(p.kg_m * p.largo).toFixed(2)}</td>
                <td style={{ ...TD_R, color:C.teal }}>{p.sup.toFixed(3)}</td>
                <td style={{ ...TD_R, color:C.teal }}>{(p.sup * p.largo).toFixed(3)}</td>
                <td style={TD_R}><CeldaPrecio item={p} onAbrir={() => setFichaId(p.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Stats items={items} filtrados={lista} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SECCIÓN PLANCHAS
// ═══════════════════════════════════════════════════════════════════
function SeccionPlanchas() {
  const [items,     setItems]     = useState(() => migrar(mergeSeed(loadLS("smeas_planchas", null), PLANCHAS_DATA)));
  useMergeBibliotecaNube("plancha", setItems);
  const [busq,      setBusq]      = useState("");
  const [fichaId,   setFichaId]   = useState(null);
  const [showLote,  setShowLote]  = useState(false);
  const [showAgreg, setShowAgreg] = useState(false);

  useEffect(() => { saveLS("smeas_planchas", items); }, [items]);

  const actualizar  = mat => { const t = touch(mat); setItems(prev => prev.map(p => p.id === mat.id ? t : p)); dualWriteMaterial("plancha", t); };
  const eliminarMat = id  => setItems(prev => prev.filter(p => p.id !== id));
  const agregarMat  = mat => { setItems(prev => [...prev, mat]); dualWriteMaterial("plancha", mat); };

  const lista = items.filter(p => norm(p.nombre).includes(norm(busq)));

  const aplicarLote = (f) => {
    const v = parseFloat(f.precio);
    const entrada = { id: uid(), fecha: f.fecha, proveedor: f.proveedor || "Lote", precio: v };
    const idsFiltrados = new Set(lista.map(p => p.id));
    setItems(prev => prev.map(p =>
      idsFiltrados.has(p.id)
        ? { ...p, precio_usd_kg: v, historial_precios: [entrada, ...(p.historial_precios || [])] }
        : p
    ));
    setShowLote(false);
  };

  const fichaItem = fichaId ? items.find(p => p.id === fichaId) : null;

  return (
    <div>
      {fichaItem && <FichaModal mat={fichaItem} tipo="plancha" onClose={() => setFichaId(null)} onUpdate={actualizar} onEliminar={eliminarMat} />}
      {showAgreg  && <AgregarModal tipo="plancha" onClose={() => setShowAgreg(false)} onAgregar={agregarMat} />}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:10 }}>
        <p style={{ margin:0, color:C.muted, fontSize:12 }}>Chapas laminadas en caliente · kg/m² = espesor×7,85</p>
        <div style={{ display:"flex", gap:6 }}>
          <BtnSyncPrecios items={items} seed={PLANCHAS_DATA} onSync={setItems} />
          <button onClick={() => setShowAgreg(true)} style={{ ...BTN("ghost"), borderColor: C.ok+"66", color: C.ok }}>+ Agregar plancha</button>
          <button onClick={() => setShowLote(v => !v)} style={BTN("ghost")}>Precio en lote</button>
        </div>
      </div>

      {showLote && (
        <LotePanel label={`${lista.length} ítem${lista.length!==1?"s":""}${busq?` — "${busq}"`:""} (ej: "galvanizada", "liso", "AD")`} onAplicar={aplicarLote} onCerrar={() => setShowLote(false)} />
      )}

      <Alerta n={items.filter(p => !p.precio_usd_kg).length} tipo="planchas" />

      <input type="text" placeholder="Buscar plancha…" value={busq} onChange={e => setBusq(e.target.value)}
        style={{ ...INP, width:200, padding:"6px 10px", marginBottom:12 }} />

      <div style={{ background:C.card, borderRadius:10, border:`1px solid ${C.border}`, overflow:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
          <thead>
            <tr>
              <th style={TH}>Plancha</th>
              <th style={TH_R}>Esp (mm)</th>
              <th style={TH_R}>kg/m²</th>
              <th style={TH_R}>Dim (mm)</th>
              <th style={{ ...TH_R, color:C.teal }}>Área m²</th>
              <th style={TH_R}>kg/plancha</th>
              <th style={TH_R}>USD/kg</th>
              <th style={{ ...TH_R, color:C.gold }}>USD/plancha</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && <tr><td colSpan={8} style={{ ...TD, textAlign:"center", color:C.muted, padding:28 }}>Sin resultados</td></tr>}
            {lista.map(p => (
              <tr key={p.id}
                onMouseEnter={e => e.currentTarget.style.background = C.iron}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ ...TD, fontWeight:600 }}>{p.nombre}</td>
                <td style={TD_R}>{p.espesor}</td>
                <td style={TD_R}>{p.kg_m2}</td>
                <td style={{ ...TD_R, color:C.muted }}>{p.largo_mm}×{p.ancho_mm}</td>
                <td style={{ ...TD_R, color:C.teal }}>{p.area_m2}</td>
                <td style={{ ...TD_R, color:C.steel }}>{p.kg_ud}</td>
                <td style={TD_R}><CeldaPrecio item={p} onAbrir={() => setFichaId(p.id)} /></td>
                <td style={{ ...TD_R, color:p.precio_usd_kg>0?C.gold:C.muted, fontWeight:700 }}>
                  {p.precio_usd_kg > 0 ? `$${(p.precio_usd_kg * p.kg_ud).toFixed(2)}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Stats items={items} filtrados={lista} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SECCIÓN REJILLAS (mallas electrosoldadas y metal desplegado)
// ═══════════════════════════════════════════════════════════════════
function SeccionRejillas() {
  const [items,     setItems]     = useState(() => migrar(mergeSeed(loadLS("smeas_rejillas", null), REJILLAS_DATA)));
  useMergeBibliotecaNube("rejilla", setItems);
  const [busq,      setBusq]      = useState("");
  const [fichaId,   setFichaId]   = useState(null);
  const [showLote,  setShowLote]  = useState(false);
  const [showAgreg, setShowAgreg] = useState(false);

  useEffect(() => { saveLS("smeas_rejillas", items); }, [items]);

  const actualizar  = mat => { const t = touch(mat); setItems(prev => prev.map(p => p.id === mat.id ? t : p)); dualWriteMaterial("rejilla", t); };
  const eliminarMat = id  => setItems(prev => prev.filter(p => p.id !== id));
  const agregarMat  = mat => { setItems(prev => [...prev, mat]); dualWriteMaterial("rejilla", mat); };

  const lista = items.filter(p => norm(p.nombre).includes(norm(busq)));

  const aplicarLote = (f) => {
    const v = parseFloat(f.precio);
    const entrada = { id: uid(), fecha: f.fecha, proveedor: f.proveedor || "Lote", precio: v };
    const idsFiltrados = new Set(lista.map(p => p.id));
    setItems(prev => prev.map(p =>
      idsFiltrados.has(p.id)
        ? { ...p, precio_usd_kg: v, historial_precios: [entrada, ...(p.historial_precios || [])] }
        : p
    ));
    setShowLote(false);
  };

  const fichaItem = fichaId ? items.find(p => p.id === fichaId) : null;

  return (
    <div>
      {fichaItem && <FichaModal mat={fichaItem} tipo="rejilla" onClose={() => setFichaId(null)} onUpdate={actualizar} onEliminar={eliminarMat} />}
      {showAgreg  && <AgregarModal tipo="rejilla" onClose={() => setShowAgreg(false)} onAgregar={agregarMat} />}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:10 }}>
        <p style={{ margin:0, color:C.muted, fontSize:12 }}>Mallas electrosoldadas y metal desplegado · vendidas por panel (kg/m²)</p>
        <div style={{ display:"flex", gap:6 }}>
          <BtnSyncPrecios items={items} seed={REJILLAS_DATA} onSync={setItems} />
          <button onClick={() => setShowAgreg(true)} style={{ ...BTN("ghost"), borderColor: C.ok+"66", color: C.ok }}>+ Agregar rejilla</button>
          <button onClick={() => setShowLote(v => !v)} style={BTN("ghost")}>Precio en lote</button>
        </div>
      </div>

      {showLote && (
        <LotePanel label={`${lista.length} ítem${lista.length!==1?"s":""}${busq?` — "${busq}"`:""}`} onAplicar={aplicarLote} onCerrar={() => setShowLote(false)} />
      )}

      <Alerta n={items.filter(p => !p.precio_usd_kg).length} tipo="rejillas" />

      <input type="text" placeholder="Buscar rejilla…" value={busq} onChange={e => setBusq(e.target.value)}
        style={{ ...INP, width:200, padding:"6px 10px", marginBottom:12 }} />

      <div style={{ background:C.card, borderRadius:10, border:`1px solid ${C.border}`, overflow:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
          <thead>
            <tr>
              <th style={TH}>Rejilla</th>
              <th style={TH_R}>kg/m²</th>
              <th style={TH_R}>Panel (mm)</th>
              <th style={{ ...TH_R, color:C.teal }}>Área m²</th>
              <th style={TH_R}>kg/panel</th>
              <th style={TH_R}>USD/kg</th>
              <th style={{ ...TH_R, color:C.gold }}>USD/panel</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && <tr><td colSpan={7} style={{ ...TD, textAlign:"center", color:C.muted, padding:28 }}>Sin resultados</td></tr>}
            {lista.map(p => (
              <tr key={p.id}
                onMouseEnter={e => e.currentTarget.style.background = C.iron}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ ...TD, fontWeight:600 }}>{p.nombre}</td>
                <td style={TD_R}>{p.kg_m2}</td>
                <td style={{ ...TD_R, color:C.muted }}>{p.largo_mm}×{p.ancho_mm}</td>
                <td style={{ ...TD_R, color:C.teal }}>{p.area_m2}</td>
                <td style={{ ...TD_R, color:C.steel }}>{p.kg_ud}</td>
                <td style={TD_R}><CeldaPrecio item={p} onAbrir={() => setFichaId(p.id)} /></td>
                <td style={{ ...TD_R, color:p.precio_usd_kg>0?C.gold:C.muted, fontWeight:700 }}>
                  {p.precio_usd_kg > 0 ? `$${(p.precio_usd_kg * p.kg_ud).toFixed(2)}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Stats items={items} filtrados={lista} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SECCIÓN TARIFARIO (MO, materiales generales, terceriz., traslados,
// pinturas, interés financiero, trat. superficie, pantógrafo)
// ═══════════════════════════════════════════════════════════════════

// ─── CATÁLOGO EDITABLE (usado para MO Fab/Mon, Mat. Generales, Terc., Traslados) ─
// Historial de precios genérico — botón "📜" por fila, mismo backend que ya
// usaba Biblioteca de perfiles/planchuelas/planchas/rejillas
// (material_historial_precios), ampliado 2026-09-02 a pedido de Gino para
// cubrir también los catálogos de tarifario y ganar "quién" hizo el cambio.
function HistorialPrecioModal({ tipo, materialId, nombre, labelValor, onClose }) {
  const [filas, setFilas] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let vivo = true;
    loadDBHistorialPrecios(tipo, materialId)
      .then(d => { if (vivo) setFilas(d); })
      .catch(e => { if (vivo) setError(e.message || String(e)); });
    return () => { vivo = false; };
  }, [tipo, materialId]);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1200, background:"#000a", display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:20, width:420, maxHeight:"70vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={{ fontWeight:800, fontSize:14, color:C.text }}>📜 Historial de precios — {nombre || "ítem"}</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:16 }}>✕</button>
        </div>
        {error && <div style={{ color:C.err, fontSize:12 }}>No se pudo cargar: {error}</div>}
        {!error && filas === null && <div style={{ color:C.muted, fontSize:12 }}>Cargando…</div>}
        {!error && filas && filas.length === 0 && <div style={{ color:C.muted, fontSize:12 }}>Todavía no hay cambios de precio registrados para este ítem.</div>}
        {!error && filas && filas.length > 0 && (
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead><tr>
              <th style={{...TH,fontSize:10}}>Fecha</th>
              <th style={{...TH,fontSize:10}}>{labelValor||"Precio"}</th>
              <th style={{...TH,fontSize:10}}>Proveedor</th>
              <th style={{...TH,fontSize:10}}>Cambiado por</th>
            </tr></thead>
            <tbody>
              {filas.map(f => (
                <tr key={f.id}>
                  <td style={TD}>{f.fecha||"—"}</td>
                  <td style={{...TD,fontWeight:700}}>{f.precio}</td>
                  <td style={TD}>{f.proveedor||"—"}</td>
                  <td style={TD}>{f.cambiado_por||"—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function CatalogoEditable({ items, campoValor, labelValor, unidad, soloLectura, onChange, usuario, tipoHistorial, camposExtra }) {
  items = items || [];
  const [busq, setBusq] = useState("");
  const [historialDe, setHistorialDe] = useState(null);
  const [confirmarDel, setConfirmarDel] = useState(null);
  const upd = (id, field, val) => {
    onChange(items.map(it => it.id === id ? { ...it, [field]: val } : it));
    // Cada cambio de precio queda registrado — a pedido de Gino (2026-09-02),
    // "debe guardarse un registro de todas las veces que a un material se le
    // cambie el precio". No bloquea el guardado si falla (mismo criterio de
    // dual-write de siempre).
    if (tipoHistorial && field === campoValor) {
      const item = items.find(it => it.id === id);
      const precioViejo = parseFloat(item?.[campoValor]) || 0;
      const precioNuevo = parseFloat(val) || 0;
      if (precioNuevo !== precioViejo) {
        addDBHistorialPrecio(tipoHistorial, id, {
          fecha: hoy(), proveedor: item?.proveedor || "", precio: precioNuevo, cambiado_por: usuario?.nombre || "",
        }).catch(e => console.warn(`[Fase 3] No se pudo registrar el historial de precio (${tipoHistorial}):`, e.message || e));
      }
    }
  };
  const del = (id) => onChange(items.filter(it => it.id !== id));
  const add = () => {
    const base = { id: uid(), nombre: "", [campoValor]: 0, unidad: unidad || "", proveedor:"", fecha_precio:"", obs:"" };
    (camposExtra||[]).forEach(c => { base[c.key] = ""; });
    onChange([...items, base]);
  };
  const lista = items.filter(it => norm(it.nombre).includes(norm(busq)));

  return (
    <div>
      {items.length > 5 && (
        <input type="text" placeholder="Buscar…" value={busq} onChange={e=>setBusq(e.target.value)}
          style={{ ...INP, width:"100%", maxWidth:320, padding:"5px 8px", fontSize:12, marginBottom:10, boxSizing:"border-box" }} />
      )}
      {items.length === 0 && <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>Sin ítems todavía.</div>}
      {items.length > 0 && lista.length === 0 && <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>Sin resultados.</div>}
      {lista.length > 0 && (
        <div style={{ display:"flex", gap:8, padding:"0 2px 6px", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:.5 }}>
          <div style={{ flex:"2 1 220px" }}>Nombre</div>
          {unidad !== undefined && <div style={{ width:70 }}>Unidad</div>}
          <div style={{ width:100 }}>{labelValor}</div>
          <div style={{ flex:"1 1 140px" }}>Proveedor</div>
          <div style={{ width:150 }}>Fecha del precio</div>
          <div style={{ flex:"2 1 200px" }}>Observaciones</div>
          {(camposExtra||[]).map(c => <div key={c.key} style={{ width:c.width||140 }}>{c.label}</div>)}
          <div style={{ width:22 }}></div>
          <div style={{ width:22 }}></div>
        </div>
      )}
      {lista.map(it => (
        <div key={it.id} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, flexWrap:"wrap" }}>
          <input value={it.nombre} placeholder="Nombre del ítem" disabled={soloLectura}
            onChange={e=>upd(it.id,"nombre",e.target.value)}
            style={{ ...INP, flex:"2 1 220px", opacity: soloLectura?0.6:1 }} />
          {unidad !== undefined && (
            <input value={it.unidad||""} placeholder="unidad" disabled={soloLectura}
              onChange={e=>upd(it.id,"unidad",e.target.value)}
              style={{ ...INP, width:70, opacity: soloLectura?0.6:1 }} />
          )}
          <input type="number" min="0" step="0.01" value={it[campoValor]||0} disabled={soloLectura}
            onChange={e=>upd(it.id,campoValor,+e.target.value||0)}
            title={labelValor}
            style={{ ...INP, width:100, opacity: soloLectura?0.6:1 }} />
          <input value={it.proveedor||""} placeholder="Proveedor" disabled={soloLectura}
            onChange={e=>upd(it.id,"proveedor",e.target.value)}
            style={{ ...INP, flex:"1 1 140px", opacity: soloLectura?0.6:1 }} />
          <input type="date" value={it.fecha_precio||""} disabled={soloLectura}
            onChange={e=>upd(it.id,"fecha_precio",e.target.value)}
            style={{ ...INP, width:150, opacity: soloLectura?0.6:1 }} />
          <input value={it.obs||""} placeholder="Observaciones" disabled={soloLectura}
            onChange={e=>upd(it.id,"obs",e.target.value)}
            style={{ ...INP, flex:"2 1 200px", opacity: soloLectura?0.6:1 }} />
          {(camposExtra||[]).map(c => (
            <input key={c.key} type={c.type||"text"} value={it[c.key]||""} placeholder={c.placeholder||c.label} disabled={soloLectura}
              onChange={e=>upd(it.id,c.key,e.target.value)}
              style={{ ...INP, width:c.width||140, opacity: soloLectura?0.6:1 }} />
          ))}
          {tipoHistorial && (
            <button onClick={()=>setHistorialDe(it.id)} title="Ver historial de precios"
              style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:13, flexShrink:0 }}>📜</button>
          )}
          {!soloLectura && (
            <button onClick={()=>setConfirmarDel(it)} style={{ background:"none", border:"none", color:C.err, cursor:"pointer", fontSize:14, flexShrink:0 }}>🗑</button>
          )}
        </div>
      ))}
      {!soloLectura && (
        <button onClick={add} style={{ ...BTN("ghost"), marginTop:4, fontSize:11, padding:"5px 12px" }}>+ Agregar ítem</button>
      )}
      {historialDe && (() => {
        const it = items.find(x => x.id === historialDe);
        return <HistorialPrecioModal tipo={tipoHistorial} materialId={historialDe} nombre={it?.nombre} labelValor={labelValor} onClose={()=>setHistorialDe(null)} />;
      })()}
      {confirmarDel && (
        // 2026-09-02, a pedido de Gino: borró un ítem de Maquinado sin
        // querer, el 🗑 borraba directo sin ningún cartel — mismo patrón
        // liviano (checkbox, sin contraseña) que ya usa esta pantalla para
        // otras confirmaciones, consistente con que esto es un catálogo de
        // precios, no un registro de negocio (presupuesto/cliente/etc).
        <ModalConfirmarBorrado
          titulo={`"${confirmarDel.nombre || "este ítem"}" del catálogo`}
          onConfirm={() => { del(confirmarDel.id); setConfirmarDel(null); }}
          onClose={() => setConfirmarDel(null)}
        />
      )}
    </div>
  );
}

// ─── CATÁLOGO DE INTERÉS FINANCIERO (nombre + moneda + días + %) ──
function CatalogoInteres({ items, soloLectura, onChange }) {
  const [busq, setBusq] = useState("");
  const upd = (id, field, val) => onChange(items.map(it => it.id === id ? { ...it, [field]: val } : it));
  const del = (id) => onChange(items.filter(it => it.id !== id));
  const add = () => onChange([...items, { id: uid(), nombre: "", moneda: "USD", dias: 30, pct: 0 }]);
  const lista = items.filter(it => norm(it.nombre).includes(norm(busq)));

  return (
    <div>
      {items.length > 5 && (
        <input type="text" placeholder="Buscar…" value={busq} onChange={e=>setBusq(e.target.value)}
          style={{ ...INP, width:"100%", padding:"5px 8px", fontSize:12, marginBottom:8, boxSizing:"border-box" }} />
      )}
      {items.length === 0 && <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>Sin ítems todavía.</div>}
      {items.length > 0 && lista.length === 0 && <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>Sin resultados.</div>}
      {lista.map(it => (
        <div key={it.id} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
          <input value={it.nombre} placeholder="Nombre (ej: 30 días)" disabled={soloLectura}
            onChange={e=>upd(it.id,"nombre",e.target.value)}
            style={{ ...INP, flex:1, opacity: soloLectura?0.6:1 }} />
          <select value={it.moneda||"USD"} disabled={soloLectura}
            onChange={e=>upd(it.id,"moneda",e.target.value)}
            style={{ ...INP, width:70, opacity: soloLectura?0.6:1 }}>
            <option value="USD">USD</option>
            <option value="UYU">UYU</option>
          </select>
          <input type="number" min="0" step="1" value={it.dias||0} disabled={soloLectura}
            title="Días" onChange={e=>upd(it.id,"dias",+e.target.value||0)}
            style={{ ...INP, width:60, opacity: soloLectura?0.6:1 }} />
          <input type="number" min="0" step="0.01" value={it.pct||0} disabled={soloLectura}
            title="% interés" onChange={e=>upd(it.id,"pct",+e.target.value||0)}
            style={{ ...INP, width:70, opacity: soloLectura?0.6:1 }} />
          {!soloLectura && (
            <button onClick={()=>del(it.id)} style={{ background:"none", border:"none", color:C.err, cursor:"pointer", fontSize:14 }}>🗑</button>
          )}
        </div>
      ))}
      {!soloLectura && (
        <button onClick={add} style={{ ...BTN("ghost"), marginTop:4, fontSize:11, padding:"5px 12px" }}>+ Agregar plazo</button>
      )}
    </div>
  );
}

function AvisoSoloLectura() {
  return (
    <div style={{ marginBottom:16, padding:"8px 14px", background:C.warn+"11", border:`1px solid ${C.warn}33`, borderRadius:6, fontSize:12, color:C.warn }}>
      ⚠ Solo lectura — solo Administrador puede editar el tarifario.
    </div>
  );
}

// Rubro genérico basado en catálogo de lista (MO, Materiales Generales, Terc., Traslados, Pinturas)
// Nombres de arranque de "Maquinado" — las 8 máquinas que ya existían
// sueltas en Corte de máquina (Cómputo) + Plegado/Cilindrado (pedido de
// Gino, 2026-09-02). Se precargan a $0 la primera vez que se abre esta
// pestaña, para no obligar a tipear los 10 nombres a mano.
const MAQUINADO_SEED = ["Plasma / Pantógrafo","Láser","Oxicorte","Cizalla","Sierra","Torno","Fresadora","Otro","Plegado","Cilindrado"];

function SeccionCatalogoRubro({ usuario, campo, campoValor, labelValor, unidad, titulo, descripcion, camposExtra }) {
  const [tarifario, setTarifario] = useTarifarioConNube();
  const soloLectura = usuario?.rol !== "admin";
  const onChange = (items) => { const t = { ...tarifario, [campo]: items }; setTarifario(t); saveTarifario(t); dualWriteTarifario(t); };
  const yaSembrado = useRef(false);
  useEffect(() => {
    if (campo !== "maquinado" || yaSembrado.current || soloLectura) return;
    if ((tarifario.maquinado || []).length > 0) { yaSembrado.current = true; return; }
    yaSembrado.current = true;
    onChange(MAQUINADO_SEED.map(nombre => ({ id: uid(), nombre, usd: 0, unidad: "", proveedor:"", fecha_precio:"", obs:"" })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campo, tarifario.maquinado]);
  return (
    <div>
      {soloLectura && <AvisoSoloLectura/>}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
        <h3 style={{ margin:0, fontSize:15, fontWeight:800, color:C.text }}>{titulo}</h3>
      </div>
      {descripcion && <div style={{ fontSize:12, color:C.muted, marginBottom:16, maxWidth:900 }}>{descripcion}</div>}
      <CatalogoEditable items={tarifario[campo]} campoValor={campoValor} labelValor={labelValor} unidad={unidad} soloLectura={soloLectura} onChange={onChange} usuario={usuario} tipoHistorial={campo} camposExtra={camposExtra} />
    </div>
  );
}

function SeccionInteresFinanciero({ usuario }) {
  const [tarifario, setTarifario] = useTarifarioConNube();
  const soloLectura = usuario?.rol !== "admin";
  const onChange = (items) => { const t = { ...tarifario, interes_financiero: items }; setTarifario(t); saveTarifario(t); dualWriteTarifario(t); };
  return (
    <div>
      {soloLectura && <AvisoSoloLectura/>}
      <h3 style={{ margin:"0 0 16px", fontSize:15, fontWeight:800, color:C.text }}>📅 Interés financiero (por plazo)</h3>
      <CatalogoInteres items={tarifario.interes_financiero} soloLectura={soloLectura} onChange={onChange} />
    </div>
  );
}

// Fila de un valor "pineado" (Arenado/Galvanizado/Corte 2D/Corte 3D) con la
// misma ficha que cualquier ítem de catálogo (proveedor/fecha del precio/
// observaciones) + historial de precios — a pedido de Gino (2026-09-02):
// "no es consistente con las demás, les falta información". materialId
// usa el tenant_id (un solo valor por tenant, no tiene id propio real) —
// alcanza para identificarlo sin ambigüedad junto con `tipo`.
function FilaValorFijo({ label, unidadLabel, soloLectura, valor, proveedor, fechaPrecio, obs, onValor, onProveedor, onFecha, onObs, tipo, usuario }) {
  const [historial, setHistorial] = useState(false);
  const [tenantId, setTenantId] = useState(null);
  useEffect(() => { obtenerTenantId().then(setTenantId).catch(()=>{}); }, []);
  const cambiarValor = (val) => {
    onValor(val);
    const nuevo = +val || 0;
    if (nuevo !== (+valor || 0) && tenantId) {
      addDBHistorialPrecio(tipo, tenantId, { fecha: hoy(), proveedor: proveedor||"", precio: nuevo, cambiado_por: usuario?.nombre||"" })
        .catch(e => console.warn(`[Fase 3] No se pudo registrar el historial de precio (${tipo}):`, e.message || e));
    }
  };
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6, gap:12 }}>
        <label style={{ fontSize:12, color:C.text }}>{label}</label>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <input type="number" min="0" step="0.01" disabled={soloLectura}
            value={valor||0} onChange={e=>cambiarValor(e.target.value)}
            style={{ ...INP, width:90, opacity: soloLectura?0.6:1 }} />
          {tenantId && (
            <button onClick={()=>setHistorial(true)} title="Ver historial de precios"
              style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:13 }}>📜</button>
          )}
        </div>
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <input value={proveedor||""} placeholder="Proveedor" disabled={soloLectura}
          onChange={e=>onProveedor(e.target.value)}
          style={{ ...INP, flex:"1 1 140px", fontSize:12, padding:"5px 8px", opacity: soloLectura?0.6:1 }} />
        <input type="date" value={fechaPrecio||""} disabled={soloLectura}
          onChange={e=>onFecha(e.target.value)}
          style={{ ...INP, width:150, fontSize:12, padding:"5px 8px", opacity: soloLectura?0.6:1 }} />
        <input value={obs||""} placeholder="Observaciones" disabled={soloLectura}
          onChange={e=>onObs(e.target.value)}
          style={{ ...INP, flex:"2 1 200px", fontSize:12, padding:"5px 8px", opacity: soloLectura?0.6:1 }} />
      </div>
      {historial && <HistorialPrecioModal tipo={tipo} materialId={tenantId} nombre={label} labelValor={unidadLabel} onClose={()=>setHistorial(false)} />}
    </div>
  );
}

function SeccionTratSuperficie({ usuario }) {
  const [tarifario, setTarifario] = useTarifarioConNube();
  const soloLectura = usuario?.rol !== "admin";
  const setCampo = (campo, val) => { const t = { ...tarifario, [campo]: val }; setTarifario(t); saveTarifario(t); dualWriteTarifario(t); };
  const onChangeExtra = (items) => { const t = { ...tarifario, trat_superficie_extra: items }; setTarifario(t); saveTarifario(t); dualWriteTarifario(t); };
  return (
    <div>
      {soloLectura && <AvisoSoloLectura/>}
      <h3 style={{ margin:"0 0 16px", fontSize:15, fontWeight:800, color:C.text }}>🎨 Tratamiento de Superficie</h3>
      <div style={{ maxWidth:520, background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, marginBottom:24 }}>
        <FilaValorFijo label="Arenado / Granallado (USD/m²)" unidadLabel="USD/m²" soloLectura={soloLectura} usuario={usuario} tipo="arenado"
          valor={tarifario.arenado_usd_m2} proveedor={tarifario.arenado_proveedor} fechaPrecio={tarifario.arenado_fecha_precio} obs={tarifario.arenado_obs}
          onValor={v=>setCampo("arenado_usd_m2",+v||0)} onProveedor={v=>setCampo("arenado_proveedor",v)} onFecha={v=>setCampo("arenado_fecha_precio",v)} onObs={v=>setCampo("arenado_obs",v)} />
        <FilaValorFijo label="Galvanizado (USD/kg)" unidadLabel="USD/kg" soloLectura={soloLectura} usuario={usuario} tipo="galvanizado"
          valor={tarifario.galvanizado_usd_kg} proveedor={tarifario.galvanizado_proveedor} fechaPrecio={tarifario.galvanizado_fecha_precio} obs={tarifario.galvanizado_obs}
          onValor={v=>setCampo("galvanizado_usd_kg",+v||0)} onProveedor={v=>setCampo("galvanizado_proveedor",v)} onFecha={v=>setCampo("galvanizado_fecha_precio",v)} onObs={v=>setCampo("galvanizado_obs",v)} />
      </div>
      <h3 style={{ margin:"0 0 4px", fontSize:13, fontWeight:800, color:C.muted }}>Otros tratamientos</h3>
      <div style={{ fontSize:12, color:C.muted, marginBottom:14, maxWidth:900 }}>
        Precio de referencia para tratamientos que no son Arenado ni Galvanizado
        (ej. Metalizado, Fosfatizado). Se pueden elegir desde acá en cualquier
        ítem de Presupuesto (pestaña Trat. Superficie → "Otros tratamientos") y
        se cobran USD/kg sobre el peso total del ítem.
      </div>
      <CatalogoEditable items={tarifario.trat_superficie_extra||[]} campoValor="usd" labelValor="USD/unidad" unidad="" soloLectura={soloLectura} onChange={onChangeExtra} usuario={usuario} tipoHistorial="trat_superficie_extra" />
    </div>
  );
}

function SeccionPantografo({ usuario }) {
  const [tarifario, setTarifario] = useTarifarioConNube();
  const soloLectura = usuario?.rol !== "admin";
  const setCampo = (campo, val) => { const t = { ...tarifario, [campo]: val }; setTarifario(t); saveTarifario(t); dualWriteTarifario(t); };
  const onChangeExtra = (items) => { const t = { ...tarifario, pantografo_extra: items }; setTarifario(t); saveTarifario(t); dualWriteTarifario(t); };
  return (
    <div>
      {soloLectura && <AvisoSoloLectura/>}
      <h3 style={{ margin:"0 0 16px", fontSize:15, fontWeight:800, color:C.text }}>✂️ Corte Pantógrafo</h3>
      <div style={{ maxWidth:520, background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:18, marginBottom:24 }}>
        <FilaValorFijo label="Corte 2D — planchas (USD/kg)" unidadLabel="USD/kg" soloLectura={soloLectura} usuario={usuario} tipo="panto_2d"
          valor={tarifario.panto_usd_kg_2d} proveedor={tarifario.panto_2d_proveedor} fechaPrecio={tarifario.panto_2d_fecha_precio} obs={tarifario.panto_2d_obs}
          onValor={v=>setCampo("panto_usd_kg_2d",+v||0)} onProveedor={v=>setCampo("panto_2d_proveedor",v)} onFecha={v=>setCampo("panto_2d_fecha_precio",v)} onObs={v=>setCampo("panto_2d_obs",v)} />
        <FilaValorFijo label="Corte 3D — perfiles (USD/kg)" unidadLabel="USD/kg" soloLectura={soloLectura} usuario={usuario} tipo="panto_3d"
          valor={tarifario.panto_usd_kg_3d} proveedor={tarifario.panto_3d_proveedor} fechaPrecio={tarifario.panto_3d_fecha_precio} obs={tarifario.panto_3d_obs}
          onValor={v=>setCampo("panto_usd_kg_3d",+v||0)} onProveedor={v=>setCampo("panto_3d_proveedor",v)} onFecha={v=>setCampo("panto_3d_fecha_precio",v)} onObs={v=>setCampo("panto_3d_obs",v)} />
      </div>
      <h3 style={{ margin:"0 0 4px", fontSize:13, fontWeight:800, color:C.muted }}>Otros cortes</h3>
      <div style={{ fontSize:12, color:C.muted, marginBottom:14, maxWidth:900 }}>
        Precio de referencia para otros tipos de corte (láser, plasma CNC, oxicorte
        especial, etc.) además de los 2D/3D de arriba. Se pueden elegir desde acá
        en cualquier ítem de Presupuesto (pestaña Pantógrafo) — el kg queda
        pre-cargado con el peso del ítem y es editable.
      </div>
      <CatalogoEditable items={tarifario.pantografo_extra||[]} campoValor="usd" labelValor="USD/unidad" unidad="" soloLectura={soloLectura} onChange={onChangeExtra} usuario={usuario} tipoHistorial="pantografo_extra" />
    </div>
  );
}

// ─── Materiales físicos agrupados con sub-pestañas (Perfiles/Planchas/Planchuelas/Rejillas) ─
const MATERIALES_SUBSECCIONES = [
  { id:"planchas",    label:"Planchas",    icon:"🟦" },
  { id:"perfiles",    label:"Perfiles",    icon:"🏗️" },
  { id:"planchuelas", label:"Planchuelas", icon:"📏" },
  { id:"rejillas",    label:"Rejillas",    icon:"▦" },
];
function SeccionMateriales({ sub, setSub }) {
  return (
    <div>
      <div style={{ display:"flex", gap:4, marginBottom:18 }}>
        {MATERIALES_SUBSECCIONES.map(s => (
          <button key={s.id} onClick={()=>setSub(s.id)}
            style={{ background:sub===s.id?C.accent+"18":"transparent", border:`1px solid ${sub===s.id?C.accent:C.border}`, borderRadius:8, color:sub===s.id?C.accent:C.muted, padding:"6px 14px", cursor:"pointer", fontSize:12, fontWeight:sub===s.id?700:400, display:"flex", alignItems:"center", gap:6 }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>
      {sub === "planchas"    && <SeccionPlanchas />}
      {sub === "perfiles"    && <SeccionPerfiles />}
      {sub === "planchuelas" && <SeccionPlanchuelas />}
      {sub === "rejillas"    && <SeccionRejillas />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENTE RAÍZ
// ═══════════════════════════════════════════════════════════════════
const SECCIONES = [
  { id:"materiales",     label:"Materiales",       icon:"📦" },
  { id:"mo_fab",         label:"MO Fab.",          icon:"🔨" },
  { id:"mo_mon",         label:"MO Mon.",          icon:"🏗️" },
  { id:"mat_generales",  label:"Mat. Generales",   icon:"🔩" },
  { id:"terceros",       label:"Tercerización",    icon:"🏭" },
  { id:"traslados",      label:"Traslados",        icon:"🚚" },
  { id:"pinturas",       label:"Pinturas",         icon:"🖌" },
  { id:"interes",        label:"Interés Fin.",     icon:"📅" },
  { id:"trat_sup",       label:"Trat. Superficie", icon:"🎨" },
  { id:"pantografo",     label:"Pantógrafo",       icon:"✂️" },
  { id:"maquinado",      label:"Maquinado",        icon:"🔧" },
];

// ─── Buscador propio de Insumos y Precios (busca en TODOS los rubros a la vez) ─
const CATALOGOS_BUSQUEDA = [
  { key:"smeas_perfiles",    rubro:"Perfil",     sec:"materiales", sub:"perfiles",    precioField:"precio_usd_kg", unidad:"USD/kg" },
  { key:"smeas_planchas",    rubro:"Plancha",    sec:"materiales", sub:"planchas",    precioField:"precio_usd_kg", unidad:"USD/kg" },
  { key:"smeas_planchuelas", rubro:"Planchuela", sec:"materiales", sub:"planchuelas", precioField:"precio_usd_kg", unidad:"USD/kg" },
  { key:"smeas_rejillas",    rubro:"Rejilla",    sec:"materiales", sub:"rejillas",    precioField:"precio_usd_kg", unidad:"USD/kg" },
];
const TARIFARIO_BUSQUEDA = [
  { campo:"mo_fab",               rubro:"MO Fab.",                 sec:"mo_fab",        precioField:"usd_hora", unidad:"USD/h" },
  { campo:"mo_mon",               rubro:"MO Mon.",                 sec:"mo_mon",        precioField:"usd_hora", unidad:"USD/h" },
  { campo:"mat_generales",        rubro:"Mat. General",            sec:"mat_generales", precioField:"usd",      unidad:"USD" },
  { campo:"terceros",             rubro:"Tercerización",           sec:"terceros",      precioField:"usd",      unidad:"USD" },
  { campo:"traslados",            rubro:"Traslado",                sec:"traslados",     precioField:"usd",      unidad:"USD" },
  { campo:"pinturas",             rubro:"Pintura",                 sec:"pinturas",      precioField:"usd",      unidad:"USD/L" },
  { campo:"trat_superficie_extra",rubro:"Trat. Superficie (otro)", sec:"trat_sup",      precioField:"usd",      unidad:"USD" },
  { campo:"pantografo_extra",     rubro:"Pantógrafo (otro)",       sec:"pantografo",    precioField:"usd",      unidad:"USD" },
  { campo:"maquinado",            rubro:"Maquinado",               sec:"maquinado",     precioField:"usd",      unidad:"USD/kg" },
];
function useBusquedaGlobalInsumos(query) {
  return useMemo(() => {
    const q = norm(query.trim());
    if (!q) return [];
    const out = [];
    CATALOGOS_BUSQUEDA.forEach(c => {
      loadLS(c.key, []).forEach(it => {
        if (it.nombre && norm(it.nombre).includes(q)) {
          out.push({ id:c.key+"_"+it.id, nombre:it.nombre, rubro:c.rubro, precio:+it[c.precioField]||0, unidad:c.unidad, sec:c.sec, sub:c.sub });
        }
      });
    });
    const tarifario = loadTarifario();
    TARIFARIO_BUSQUEDA.forEach(c => {
      (tarifario[c.campo]||[]).forEach(it => {
        if (it.nombre && norm(it.nombre).includes(q)) {
          out.push({ id:c.campo+"_"+it.id, nombre:it.nombre, rubro:c.rubro, precio:+it[c.precioField]||0, unidad:c.unidad, sec:c.sec, sub:null });
        }
      });
    });
    return out.slice(0, 60);
  }, [query]);
}

export default function BibliotecaMateriales({ usuario }) {
  const [sec, setSec] = useState("materiales");
  const [subMateriales, setSubMateriales] = useState("planchas");
  const [busq, setBusq] = useState("");
  const resultados = useBusquedaGlobalInsumos(busq);
  const irAResultado = (r) => {
    setSec(r.sec);
    if (r.sub) setSubMateriales(r.sub);
    setBusq("");
  };
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <span style={{ fontSize:20 }}>📦</span>
        <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:C.text }}>Insumos y Precios</h2>
        <span style={BDG(C.accent, true)}>MÓDULO 1</span>
        <div style={{ marginLeft:"auto", position:"relative", width:320 }}>
          <input value={busq} onChange={e=>setBusq(e.target.value)} placeholder="🔍 Buscar en todos los insumos…"
            style={{ ...INP, width:"100%" }} />
          {busq.trim() && (
            <div style={{ position:"absolute", top:"calc(100% + 4px)", right:0, width:400, maxHeight:360, overflowY:"auto", background:C.card, border:`1px solid ${C.accent}55`, borderRadius:8, boxShadow:"0 8px 24px #00000077", zIndex:9999 }}>
              {resultados.length===0 && <div style={{ padding:"10px 12px", color:C.muted, fontSize:12 }}>Sin resultados para <strong>"{busq}"</strong></div>}
              {resultados.map(r => (
                <div key={r.id} onClick={()=>irAResultado(r)}
                  style={{ padding:"8px 12px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, fontSize:12, borderBottom:`1px solid ${C.border}` }}
                  onMouseEnter={e=>e.currentTarget.style.background=C.iron}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.nombre} <span style={{ color:C.muted, fontSize:10 }}>· {r.rubro}</span></span>
                  <span style={{ color:r.precio?C.text:C.warn, fontWeight:700, flexShrink:0 }}>{r.precio ? `$${n2(r.precio)} ${r.unidad}` : "⚠ sin precio"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ display:"flex", gap:4, marginBottom:20, borderBottom:`1px solid ${C.border}`, flexWrap:"wrap" }}>
        {SECCIONES.map(s => (
          <button key={s.id} onClick={() => setSec(s.id)}
            style={{ background:"transparent", border:"none", borderBottom:sec===s.id?`2px solid ${C.accent}`:"2px solid transparent", color:sec===s.id?C.accent:C.muted, padding:"8px 14px", cursor:"pointer", fontSize:12, fontWeight:sec===s.id?700:400, display:"flex", alignItems:"center", gap:6, marginBottom:"-1px", whiteSpace:"nowrap" }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>
      {sec === "materiales"    && <SeccionMateriales sub={subMateriales} setSub={setSubMateriales} />}
      {sec === "mo_fab"        && <SeccionCatalogoRubro usuario={usuario} campo="mo_fab" campoValor="usd_hora" labelValor="USD/hora" titulo="🔨 MO — Fabricación (USD/hora)" />}
      {sec === "mo_mon"        && <SeccionCatalogoRubro usuario={usuario} campo="mo_mon" campoValor="usd_hora" labelValor="USD/hora" titulo="🏗️ MO — Montajes (USD/hora)" />}
      {sec === "mat_generales" && <SeccionCatalogoRubro usuario={usuario} campo="mat_generales" campoValor="usd" labelValor="USD/unidad" unidad="" titulo="🔩 Materiales Generales" descripcion="Consumibles, bulonería, insumos varios reutilizables en cualquier presupuesto." />}
      {sec === "terceros"      && <SeccionCatalogoRubro usuario={usuario} campo="terceros" campoValor="usd" labelValor="USD/unidad" unidad="" titulo="🏭 Tercerización" descripcion="Un solo catálogo para Fabricación y Montajes — se elige el mismo ítem desde cualquiera de las dos pestañas del presupuesto." />}
      {sec === "traslados"     && <SeccionCatalogoRubro usuario={usuario} campo="traslados" campoValor="usd" labelValor="USD/unidad" unidad="" titulo="🚚 Traslados" />}
      {sec === "pinturas"      && <SeccionCatalogoRubro usuario={usuario} campo="pinturas" campoValor="usd" labelValor="USD/litro" titulo="🖌 Pinturas (USD/litro)"
        camposExtra={[
          { key:"rendimiento", label:"Rendimiento (m²/L)", type:"number", width:110 },
          { key:"volumen_solidos", label:"Vol. sólidos (%)", type:"number", width:110 },
          { key:"ficha_tecnica_link", label:"Ficha técnica (link)", type:"text", width:200, placeholder:"Link a la carpeta/archivo" },
        ]} />}
      {sec === "maquinado"     && <SeccionCatalogoRubro usuario={usuario} campo="maquinado" campoValor="usd" labelValor="USD/kg" unidad="" titulo="🔧 Maquinado"
        descripcion="Plegado, cilindrado y las máquinas de Corte de máquina (Cómputo) — se eligen desde cualquier ítem de Presupuesto (pestaña Maquinado)." />}
      {sec === "interes"       && <SeccionInteresFinanciero usuario={usuario} />}
      {sec === "trat_sup"      && <SeccionTratSuperficie usuario={usuario} />}
      {sec === "pantografo"    && <SeccionPantografo usuario={usuario} />}
    </div>
  );
}
