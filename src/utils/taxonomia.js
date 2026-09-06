import { useEffect } from "react";
import { INP } from "../styles/colors";
import { loadLS, saveLS, loadDBCategoriasTrabajo } from "./storage";
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

// Hook chico para que un componente se re-renderice cuando FAMILIAS
// termine de hidratarse desde la nube (útil para pantallas montadas
// antes de que App.js llame a hidratarFamiliasDesdeNube — ej. si el
// usuario ya está en Insumos y Precios apenas loguea).
export function useFamiliasActualizadas(onChange) {
  useEffect(() => {
    let vivo = true;
    hidratarFamiliasDesdeNube().then(cambio => { if (vivo && cambio) onChange?.(); });
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export const TIPOS_TRABAJO = ["Fabricación", "Montaje", "Fab+Mont"];

// Dropdown de Categoría reusado en Cómputo, Anidado y Presupuesto (2026-08-24,
// pedido de Gino: clasificar desde el arranque del flujo — Cómputo → Anidado
// → Presupuesto — en vez de recién al final) — centralizado acá en vez de
// vivir solo en Presupuesto.jsx para que las 3 pantallas lo importen igual.
export function SelectCategoria({ value, onChange, style }) {
  return (
    <select style={{ ...INP, ...style }} value={value || ""} onChange={e => onChange(e.target.value)}>
      <option value="">— Sin categoría —</option>
      {Object.entries(FAMILIAS).map(([familia, cats]) => (
        <optgroup key={familia} label={familia}>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </optgroup>
      ))}
    </select>
  );
}
