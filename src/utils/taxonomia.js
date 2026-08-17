// Taxonomía compartida MMN — Familia (nivel 1) → Categoría (nivel 2).
//
// Fuente canónica: Predictor Eq v25 (`DEFAULT_FAMILIES`). Ver
// TAXONOMIA-COMPARTIDA-MMN.md en la raíz del proyecto para el acuerdo
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
