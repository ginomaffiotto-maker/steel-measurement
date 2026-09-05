// Seguridad: escapar HTML armado a partir de datos cargados por el usuario
// (cliente, obra, vendedor, comentarios) antes de interpolarlo en HTML crudo
// (Resumen interno) — evita XSS almacenado. Mismo hallazgo/fix que en
// steelCRM (pdfPresupuesto.js), 2026-09-04 — acá no hace falta DOMPurify
// porque Steel Costos no tiene ningún campo que legítimamente lleve HTML
// (no existe un editor de redacción como el de steelCRM).
const ENT = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const escapeHtml = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ENT[c]);
