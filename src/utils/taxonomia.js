import { useState } from "react";
import { C, INP, LBL, BTN } from "../styles/colors";
import { loadLS, saveLS, loadDBCategoriasTrabajo, saveDBCategoriaTrabajo } from "./storage";
import { supabase } from "./supabaseClient";

// Taxonomía de Familia (nivel 1) → Categoría (nivel 2).
//
// Hasta el 2026-09-06 esto era una constante fija acá, tomada de
// Predictor Eq v25 (ver TAXONOMIA-COMPARTIDA.md). A pedido de Gino, pasó
// a vivir en Supabase (tabla `categorias_trabajo`, migración
// 20260906100000, que backfilleó estas mismas 32 categorías como filas
// reales) — se puede crear una Familia o Categoría nueva desde Steel
// Costos (Insumos y Precios > Familias y Categorías) y queda compartida
// con Steel CRM. Lo de acá abajo queda solo como valor de arranque —
// antes de que la primera consulta a Supabase resuelva (o si falla/no
// hay conexión), para no dejar los selectores vacíos.
export let FAMILIAS = loadLS("smeas_familias_categorias", null) || {
  "Calderería": ["Camisas", "Cubas", "Tuberías"],
  "Moldes Encofrados": ["Moldes", "Moldes Circulares", "New Jersey"],
  "Estructura Pesada": ["Industriales-Maritimas-Porticos", "Vigas Conformadas - Cerchas", "Columnas", "Perfiles a Medida", "Pasos Peatonales", "Cubiertas - Techos - Plataforma"],
  "Chapa Cortada-Plegada": ["Plegados", "Platinas", "Cajones UPN"],
  "Herrería liviana": ["Barandas - Defensas", "Cerramientos - Cercos - Fachada", "Portones", "Marcos", "Escaleras", "Escalera Marinera", "Rejas", "Herreria", "Aberturas"],
  "Soportería y Equipos": ["Soportes - Perfiles con Platina", "Mesas Industriales", "Skids", "Regueras"],
  "Anclajes, Pernos e Insertos": ["Anclajes - Pernos", "Pernos - Insertos"],
  "Varios": ["Trabajos Variados", "Montajes"],
};

// Filas crudas (con id real de Supabase) de la última hidratación — el
// tab de edición en Insumos y Precios las necesita para poder actualizar
// una fila puntual en vez de recrear todo; FAMILIAS (arriba) es solo la
// forma agrupada que usan los selectores/filtros, sin id.
export let CATEGORIAS_FILAS = [];

let categoriaAFamilia = {};
const reindexar = () => {
  categoriaAFamilia = {};
  Object.entries(FAMILIAS).forEach(([familia, categorias]) => {
    categorias.forEach(cat => { categoriaAFamilia[cat] = familia; });
  });
};
reindexar();

// Dada una Categoría (el campo `categoria` que ya existe en Historial),
// devuelve su Familia. No requiere ningún cambio de datos existentes.
export const familiaDe = (categoria) => categoriaAFamilia[categoria] || "Sin familia";

// Trae las categorías reales de Supabase y reemplaza FAMILIAS in-place
// (reasignación del binding exportado — los módulos que hacen
// `import { FAMILIAS }` ven el valor nuevo la próxima vez que algo los
// vuelve a renderizar, mismo criterio liviano que el resto de esta app:
// no hace falta un context ni un store para algo que cambia rara vez).
// Se llama una vez al montar App.js, cuando ya hay sesión.
export async function hidratarFamiliasDesdeNube() {
  if (!supabase) return false;
  try {
    const filas = await loadDBCategoriasTrabajo();
    if (!filas?.length) return false;
    const agrupado = {};
    filas.forEach(f => { (agrupado[f.familia] = agrupado[f.familia] || []).push(f.categoria); });
    FAMILIAS = agrupado;
    CATEGORIAS_FILAS = filas;
    reindexar();
    saveLS("smeas_familias_categorias", agrupado);
    return true;
  } catch (e) {
    console.warn("[Familias/Categorías] No se pudo leer de la nube, usando lo cacheado:", e.message || e);
    return false;
  }
}

export const TIPOS_TRABAJO = ["Fabricación", "Montaje", "Fab+Mont"];

// Agrega una Categoría (a una Familia existente o nueva) y la refleja en
// FAMILIAS al instante — usado por el "+ Crear categoría nueva" de acá
// abajo. Mutación in-place del objeto exportado (no reasignación del
// binding), válido desde cualquier módulo que lo importe.
// Devuelve `true` si se creó bien, o el mensaje de error real (string) si
// falló — antes tragaba cualquier error y devolvía `false` a secas
// (mismo fix del lado de Steel CRM, 2026-09-07).
async function crearCategoriaTrabajo(familia, categoria) {
  const orden = (FAMILIAS[familia] || []).length;
  let saved;
  try {
    saved = await saveDBCategoriaTrabajo({ familia, categoria, orden });
  } catch (e) {
    return e?.message || "Error desconocido";
  }
  if (!saved) return "No se pudo crear la categoría.";
  if (!FAMILIAS[familia]) FAMILIAS[familia] = [];
  if (!FAMILIAS[familia].includes(categoria)) FAMILIAS[familia] = [...FAMILIAS[familia], categoria];
  categoriaAFamilia[categoria] = familia;
  saveLS("smeas_familias_categorias", FAMILIAS);
  return true;
}

// Ficha rápida (2026-09-06, mismo criterio que Cliente/Obra/Empresa): si la
// Categoría tipeada no existe, permite crearla al vuelo — pide también la
// Familia (existente, o una nueva) porque una Categoría no puede existir
// sin una.
function CategoriaRapidaModal({ categoriaInicial, onCreated, onClose }) {
  const [categoria, setCategoria] = useState(categoriaInicial || "");
  const [familiaSel, setFamiliaSel] = useState("");
  const [familiaNueva, setFamiliaNueva] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errCat, setErrCat] = useState(false);
  const [errFam, setErrFam] = useState(false);
  const [errGuardar, setErrGuardar] = useState("");
  const crear = async () => {
    const cat = categoria.trim();
    const fam = (familiaSel === "__nueva__" ? familiaNueva : familiaSel).trim();
    setErrCat(!cat); setErrFam(!fam); setErrGuardar("");
    if (!cat || !fam) return;
    setGuardando(true);
    const resultado = await crearCategoriaTrabajo(fam, cat);
    setGuardando(false);
    if (resultado !== true) return setErrGuardar(typeof resultado === "string" ? resultado : "No se pudo crear la categoría.");
    onCreated(cat);
    onClose();
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000c", zIndex: 3500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: C.ok }}>🗂️ Categoría nueva</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>No existe todavía — completá los datos para crearla.</div>
        {errGuardar && <div style={{ fontSize: 12, color: C.err, fontWeight: 500, marginBottom: 10 }}>⚠ {errGuardar}</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <label style={LBL}>Categoría *</label>
            <input autoFocus style={{ ...INP, ...(errCat ? { border: "1px solid " + C.err } : {}) }} value={categoria} onChange={e => { setCategoria(e.target.value); if (e.target.value.trim()) setErrCat(false); }} />
            {errCat && <div style={{ fontSize: 12, color: C.err, fontWeight: 500, marginTop: 4 }}>⚠ Ingresá el nombre de la categoría</div>}
          </div>
          <div>
            <label style={LBL}>Familia *</label>
            <select style={{ ...INP, ...(errFam ? { border: "1px solid " + C.err } : {}) }} value={familiaSel} onChange={e => { setFamiliaSel(e.target.value); if (e.target.value) setErrFam(false); }}>
              <option value="">-- Elegir --</option>
              {Object.keys(FAMILIAS).map(f => <option key={f} value={f}>{f}</option>)}
              <option value="__nueva__">+ Familia nueva…</option>
            </select>
            {errFam && <div style={{ fontSize: 12, color: C.err, fontWeight: 500, marginTop: 4 }}>⚠ Elegí una Familia o escribí una nueva</div>}
          </div>
          {familiaSel === "__nueva__" && (
            <div><label style={LBL}>Nombre de la familia nueva</label><input autoFocus style={INP} value={familiaNueva} onChange={e => setFamiliaNueva(e.target.value)} /></div>
          )}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={BTN("ghost")}>Cancelar</button>
          <button onClick={crear} disabled={guardando} style={BTN("ok")}>Crear</button>
        </div>
      </div>
    </div>
  );
}

// Buscador de Categoría con autocompletar (2026-09-06, a pedido de Gino —
// antes era un <select> con optgroup por Familia; ahora es texto libre con
// sugerencias, mismo criterio que Cliente/Obra/Empresa) — reusado en
// Cómputo, Anidado y Presupuesto. Si lo tipeado no matchea ninguna
// Categoría existente, ofrece crearla al vuelo (con su Familia) sin salir
// de la pantalla. Autocontenido: los 3 llamadores no necesitan saber nada
// de esto, siguen pasando solo value/onChange/style.
export function SelectCategoria({ value, onChange, style }) {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const q = (value || "").trim().toLowerCase();
  const todas = Object.entries(FAMILIAS).flatMap(([familia, cats]) => cats.map(c => ({ categoria: c, familia })));
  // Bug real (2026-09-07, mismo fix del lado de Steel CRM): el tope de 10
  // se aplicaba también con el campo vacío (navegando las ~32 categorías
  // reales), escondiendo el resto. Ahora solo topea una búsqueda real.
  const sugeridas = q ? todas.filter(t => t.categoria.toLowerCase().includes(q)).slice(0, 10) : todas;
  const sinResolver = !!q && !todas.some(t => t.categoria.toLowerCase() === q);
  return (
    <div style={{ position: "relative" }}>
      <input
        style={{ ...INP, ...style }}
        placeholder="Buscar categoría…"
        value={value || ""}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        autoComplete="off"
      />
      {open && sugeridas.length > 0 && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, zIndex: 20, maxHeight: 220, overflowY: "auto", boxShadow: "0 4px 12px #0006" }}>
          {sugeridas.map(t => (
            <div key={t.familia + "|" + t.categoria} onMouseDown={() => { onChange(t.categoria); setOpen(false); }}
              style={{ padding: "7px 10px", cursor: "pointer", fontSize: 13, color: C.text, display: "flex", justifyContent: "space-between", gap: 8 }}
              onMouseEnter={e => e.currentTarget.style.background = C.accent + "18"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <span>{t.categoria}</span>
              <span style={{ color: C.muted, fontSize: 11 }}>{t.familia}</span>
            </div>
          ))}
        </div>
      )}
      {sinResolver && (
        <div style={{ fontSize: 11, color: C.warn, marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
          ⚠️ Esta categoría no existe todavía
          <button type="button" onClick={() => setShowModal(true)} style={{ background: "none", border: `1px solid ${C.warn}55`, color: C.warn, borderRadius: 5, padding: "1px 8px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>+ Crear categoría nueva</button>
        </div>
      )}
      {showModal && (
        <CategoriaRapidaModal categoriaInicial={value} onCreated={(cat) => onChange(cat)} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
