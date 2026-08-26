import { INP } from "../styles/colors";

// Taxonomía compartida — Familia (nivel 1) → Categoría (nivel 2).
//
// Fuente canónica: Predictor Eq v25 (`DEFAULT_FAMILIES`). Ver
// TAXONOMIA-COMPARTIDA.md en la raíz del proyecto para el acuerdo
// completo entre steel-measurement / Predictor Eq / steelCRM.
//
// No editar este mapeo acá sin actualizar primero Predictor Eq (dueño
// canónico) y el documento — si no, los tres sistemas vuelven a divergir.
export const FAMILIAS = {
  "Calderería": ["Camisas", "Cubas", "Tuberías"],
  "Moldes Encofrados": ["Moldes", "Moldes Circulares", "New Jersey"],
  "Estructura Pesada": ["Industriales-Maritimas-Porticos", "Vigas Conformadas - Cerchas", "Columnas", "Perfiles a Medida", "Pasos Peatonales", "Cubiertas - Techos - Plataforma"],
  "Chapa Cortada-Plegada": ["Plegados", "Platinas", "Cajones UPN"],
  "Herrería liviana": ["Barandas - Defensas", "Cerramientos - Cercos - Fachada", "Portones", "Marcos", "Escaleras", "Escalera Marinera", "Rejas", "Herreria", "Aberturas"],
  "Soportería y Equipos": ["Soportes - Perfiles con Platina", "Mesas Industriales", "Skids", "Regueras"],
  "Anclajes, Pernos e Insertos": ["Anclajes - Pernos", "Pernos - Insertos"],
  "Varios": ["Trabajos Variados", "Montajes"],
};

const CATEGORIA_A_FAMILIA = {};
Object.entries(FAMILIAS).forEach(([familia, categorias]) => {
  categorias.forEach(cat => { CATEGORIA_A_FAMILIA[cat] = familia; });
});

// Dada una Categoría (el campo `categoria` que ya existe en Historial),
// devuelve su Familia. No requiere ningún cambio de datos existentes.
export const familiaDe = (categoria) => CATEGORIA_A_FAMILIA[categoria] || "Sin familia";

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
