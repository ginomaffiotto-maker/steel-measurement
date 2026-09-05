// Resumen interno de presupuesto — exclusivo de Steel Costos, no se
// comparte con Steel CRM (a diferencia de pdfPresupuesto.js, que sí vive
// copiado igual en los dos repos porque genera el documento COMERCIAL que
// se le manda al cliente). Este documento es de uso interno: expone el
// desglose real de costos por rubro que pdfPresupuesto.js deja afuera a
// propósito (ver su comentario de cabecera) — Steel Costos no le
// manda nada al cliente directamente (esa función vive en Steel CRM, ver
// botón "☁️ Enviar a Steel CRM"), así que mantener acá un PDF comercial
// duplicado era redundante.
//
// data = {
//   empresa, nro, fecha,
//   cliente, obra, vendedor,
//   calc,          // el objeto devuelto por calcPresupuesto(pres) — rubros/detalle/totales
//   comentarios,   // pres.comentarios tal cual
// }
//
// Seguridad (2026-09-04): empresa/cliente/obra/vendedor/nro y los
// comentarios internos son texto cargado por el usuario, interpolado acá
// dentro de HTML crudo que termina en un window.open del mismo origen —
// sin escapar, era un XSS almacenado real. Ninguno de estos campos debe
// llevar HTML propio, así que se escapan todos (a diferencia del "notas"
// de steelCRM, que sí sanitiza en vez de escapar porque ese sí es HTML
// legítimo de un editor de redacción — acá no existe ese caso).
import { escapeHtml } from "./sanitizeHtml";

const _sepM = n => Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const fmtN = v => (v || v === 0 ? _sepM(v) : "—");
const fmtU = v => (v || v === 0 ? "U$S " + _sepM(v) : "—");
const fmtPct = v => (v || v === 0 ? Number(v).toFixed(1) + "%" : "—");
const fmtD = s => (s ? new Date(s + "T00:00:00").toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—");

// Mismo orden en que se acumulan en calcPresupuesto — los que dan 0 no se
// muestran en la torta ni en la tabla, para no ensuciar con filas vacías.
const RUBRO_LABELS = {
  hier: "Hierros", mat: "Materiales generales", moFab: "MO Fabricación", moMon: "MO Montaje",
  hesp: "Horas especiales", tFab: "Terceros Fabricación", tMon: "Terceros Montaje",
  trat: "Tratamiento superficie", trasl: "Traslados", panto: "Pantógrafo", maquinado: "Maquinado",
};

// En pantalla el desglose se ve a color — un color fijo por posición
// (clases seg0..seg10, mismo índice reutilizado en la torta, la leyenda y
// la tabla para que las tres queden coherentes entre sí). Al imprimir, la
// regla @media print pisa esos mismos colores por un patrón en escala de
// grises (líneas/puntos, nunca solo tono de gris solo) — a pedido de Gino
// (2026-09-03): en la PC el gráfico va a color, el blanco y negro es sólo
// para lo que sale por impresora, donde el color no siempre se distingue.
const COLORES = ["#e85d04", "#f0a500", "#2563eb", "#1d4ed8", "#7c3aed", "#0891b2", "#0e7490", "#16a34a", "#65a30d", "#dc2626", "#db2777"];
const GRISES = ["#1a1a1a", "#4d4d4d", "#808080", "#333333", "#999999", "#595959", "#b3b3b3", "#666666", "#404040", "#727272", "#8c8c8c"];
const TEXTURAS = [
  (id, gris) => `<pattern id="${id}" patternUnits="userSpaceOnUse" width="10" height="10"><rect width="10" height="10" fill="${gris}"/></pattern>`,
  (id, gris) => `<pattern id="${id}" patternUnits="userSpaceOnUse" width="10" height="10"><rect width="10" height="10" fill="${gris}"/><path d="M0,10 L10,0" stroke="#fff" stroke-width="2"/></pattern>`,
  (id, gris) => `<pattern id="${id}" patternUnits="userSpaceOnUse" width="10" height="10"><rect width="10" height="10" fill="${gris}"/><path d="M0,0 L10,10" stroke="#fff" stroke-width="2"/></pattern>`,
  (id, gris) => `<pattern id="${id}" patternUnits="userSpaceOnUse" width="10" height="10"><rect width="10" height="10" fill="${gris}"/><line x1="0" y1="5" x2="10" y2="5" stroke="#fff" stroke-width="2"/></pattern>`,
  (id, gris) => `<pattern id="${id}" patternUnits="userSpaceOnUse" width="10" height="10"><rect width="10" height="10" fill="${gris}"/><line x1="5" y1="0" x2="5" y2="10" stroke="#fff" stroke-width="2"/></pattern>`,
  (id, gris) => `<pattern id="${id}" patternUnits="userSpaceOnUse" width="10" height="10"><rect width="10" height="10" fill="${gris}"/><line x1="0" y1="5" x2="10" y2="5" stroke="#fff" stroke-width="1.4"/><line x1="5" y1="0" x2="5" y2="10" stroke="#fff" stroke-width="1.4"/></pattern>`,
  (id, gris) => `<pattern id="${id}" patternUnits="userSpaceOnUse" width="8" height="8"><rect width="8" height="8" fill="${gris}"/><circle cx="4" cy="4" r="1.6" fill="#fff"/></pattern>`,
];

// CSS compartido: color en pantalla (.segN), patrón en escala de grises
// sólo dentro de @media print — un único juego de clases para los 11
// rubros posibles, cada documento usa las que le tocan según cuántos
// rubros tengan monto > 0.
function cssSegmentos() {
  const pantalla = COLORES.map((c, i) => `.seg${i}{fill:${c}}`).join("");
  const impresion = COLORES.map((_, i) => `.seg${i}{fill:url(#pat${i})}`).join("");
  return `${pantalla}@media print{${impresion}.wedge{stroke:#000}}`;
}

function defsPatrones(cant) {
  return Array.from({ length: cant }, (_, i) => TEXTURAS[i % TEXTURAS.length](`pat${i}`, GRISES[i % GRISES.length])).join("");
}

function filaRubro(label, monto, pct, i) {
  return `
    <tr>
      <td><svg width="11" height="11" class="rubro-swatch"><rect width="11" height="11" class="seg${i}"/></svg>${label}</td>
      <td style="text-align:right">${fmtU(monto)}</td>
      <td style="text-align:right">${fmtPct(pct)}</td>
    </tr>`;
}

// Torta SVG — sin librería de gráficos, arcos calculados a mano. Si un
// solo rubro es el 100% del total, el arco M-L-A-Z degenera (mismo punto
// inicio y fin) y no dibuja nada — se resuelve con un círculo completo.
function tortaSVG(entries, rubros, totalUsd) {
  if (!totalUsd || !entries.length) return "";
  const cx = 100, cy = 100, r = 92;
  let anguloActual = -90;
  const paths = entries.map(([k], i) => {
    const pct = rubros[k] / totalUsd;
    if (pct >= 0.9999) {
      return `<circle class="seg${i} wedge" cx="${cx}" cy="${cy}" r="${r}" stroke-width="1.5"/>`;
    }
    const anguloSegmento = pct * 360;
    const anguloFin = anguloActual + anguloSegmento;
    const rad1 = anguloActual * Math.PI / 180, rad2 = anguloFin * Math.PI / 180;
    const x1 = (cx + r * Math.cos(rad1)).toFixed(2), y1 = (cy + r * Math.sin(rad1)).toFixed(2);
    const x2 = (cx + r * Math.cos(rad2)).toFixed(2), y2 = (cy + r * Math.sin(rad2)).toFixed(2);
    const largeArc = anguloSegmento > 180 ? 1 : 0;
    anguloActual = anguloFin;
    return `<path class="seg${i} wedge" d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" stroke-width="1.5"/>`;
  }).join("");
  return `<svg width="220" height="220" viewBox="0 0 200 200"><defs>${defsPatrones(entries.length)}</defs>${paths}</svg>`;
}

function leyendaHTML(entries, rubros, totalUsd) {
  return entries.map(([k, label], i) => {
    const pct = totalUsd ? rubros[k] / totalUsd * 100 : 0;
    return `<div class="leyenda-item"><svg width="13" height="13"><rect width="13" height="13" class="seg${i}" stroke="#000" stroke-width="1"/></svg>${label} — ${fmtPct(pct)}</div>`;
  }).join("");
}

function filaComentario(c) {
  return `
    <div class="comentario">
      <div class="comentario-meta"><strong>${escapeHtml(c.autor) || "?"}</strong> · ${fmtD(c.fecha)}${c.hora ? " " + escapeHtml(c.hora) : ""}</div>
      <div class="comentario-texto">${escapeHtml(c.texto).replace(/\n/g, "<br>")}</div>
    </div>`;
}

export function buildResumenInternoHTML(data) {
  const c = data.calc || {};
  const rubros = c.rubros || {};
  const detalle = c.detalle || {};
  const totalUsd = c.total_usd || 0;

  const entries = Object.entries(RUBRO_LABELS).filter(([k]) => rubros[k] > 0);
  const tortaSvg = tortaSVG(entries, rubros, totalUsd);
  const leyenda = leyendaHTML(entries, rubros, totalUsd);
  const filasRubros = entries.map(([k, label], i) => filaRubro(label, rubros[k], totalUsd > 0 ? rubros[k] / totalUsd * 100 : 0, i)).join("");

  const horasFabMon = (detalle.moFab_h || 0) + (detalle.moMon_h || 0);
  const kgHoraCombinado = horasFabMon > 0 ? (c.total_kg || 0) / horasFabMon : 0;

  const comentarios = (data.comentarios || []).map(filaComentario).join("") || `<div class="sin-comentarios">Sin comentarios internos cargados.</div>`;

  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
  <title>Resumen interno ${escapeHtml(data.nro)}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#111;padding:32px;background:#fff}
    .toolbar{display:flex;justify-content:flex-end;margin-bottom:14px}
    .btn-imprimir{background:#1a2a4a;color:#fff;border:none;border-radius:6px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer}
    .btn-imprimir:hover{background:#2a3a5a}
    .aviso{background:#fef3c7;border:2px solid #d97706;border-radius:6px;padding:10px 16px;margin-bottom:20px;font-weight:800;font-size:13px;color:#92400e;text-align:center;text-transform:uppercase;letter-spacing:.5px}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #1a2a4a}
    .co-name{font-size:20px;font-weight:900;color:#1a2a4a}
    .pres-label{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;text-align:right}
    .pres-num{font-size:24px;font-weight:900;color:#1a2a4a;text-align:right;line-height:1}
    .pres-fecha{font-size:11px;color:#666;text-align:right;margin-top:4px}
    .section-title{font-size:9px;text-transform:uppercase;letter-spacing:1.2px;color:#888;margin:20px 0 8px;padding-bottom:4px;border-bottom:1px solid #e0e0e0}
    .info-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:8px}
    .info-box{background:#f8f9fc;border-radius:6px;padding:12px}
    .info-box .k{font-size:9px;color:#888;text-transform:uppercase}
    .info-box .v{font-size:14px;font-weight:700;color:#1a2a4a;margin-top:2px}
    .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:8px}
    .kpi{background:#eef2ff;border-radius:6px;padding:12px;text-align:center}
    .kpi .k{font-size:9px;color:#666;text-transform:uppercase}
    .kpi .v{font-size:17px;font-weight:900;color:#1a2a4a;margin-top:3px}
    .torta-wrap{display:flex;gap:28px;align-items:center;margin:12px 0 18px;flex-wrap:wrap}
    .leyenda{display:flex;flex-direction:column;gap:6px}
    .leyenda-item{display:flex;align-items:center;gap:8px;font-size:12px}
    .leyenda-item svg{flex-shrink:0}
    table.rubros{width:100%;border-collapse:collapse;font-size:12px}
    table.rubros thead th{text-align:left;font-size:10px;text-transform:uppercase;color:#888;padding:6px 8px;border-bottom:2px solid #ddd}
    table.rubros thead th:not(:first-child){text-align:right}
    table.rubros tbody td{padding:6px 8px;border-bottom:1px solid #eee;display:table-cell;vertical-align:middle}
    table.rubros tbody td:first-child{display:flex;align-items:center;gap:7px}
    table.rubros tbody tr:last-child td{font-weight:900;border-top:2px solid #1a2a4a;border-bottom:none;background:#f2f2f2}
    .rubro-swatch{flex-shrink:0}
    .comentario{background:#f8f9fc;border-radius:6px;padding:10px 12px;margin-bottom:8px}
    .comentario-meta{font-size:10px;color:#888;margin-bottom:3px}
    .comentario-texto{font-size:12px;color:#333;white-space:pre-line}
    .sin-comentarios{font-size:12px;color:#999;font-style:italic}
    .footer{margin-top:28px;padding-top:10px;border-top:1px solid #e0e0e0;font-size:10px;color:#aaa;text-align:center}
    ${cssSegmentos()}
    @media print{.toolbar{display:none}body{padding:16px}@page{margin:1.2cm}}
  </style></head><body>
  <div class="toolbar"><button class="btn-imprimir" onclick="window.print()">🖨️ Imprimir</button></div>
  <div class="aviso">⚠️ Uso interno — no enviar al cliente</div>
  <div class="header">
    <div>
      <div class="co-name">${escapeHtml(data.empresa)}</div>
    </div>
    <div>
      <div class="pres-label">Resumen interno</div>
      <div class="pres-num">${escapeHtml(data.nro) || "—"}</div>
      <div class="pres-fecha">Fecha: ${fmtD(data.fecha)}</div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-box"><div class="k">Cliente</div><div class="v">${escapeHtml(data.cliente) || "—"}</div></div>
    <div class="info-box"><div class="k">Obra</div><div class="v">${escapeHtml(data.obra) || "—"}</div></div>
    <div class="info-box"><div class="k">Vendedor</div><div class="v">${escapeHtml(data.vendedor) || "—"}</div></div>
  </div>

  <div class="section-title">Resumen</div>
  <div class="kpi-grid">
    <div class="kpi"><div class="k">Kg totales</div><div class="v">${fmtN(c.total_kg)}</div></div>
    <div class="kpi"><div class="k">USD / Kg</div><div class="v">${c.usd_kg ? c.usd_kg.toFixed(2) : "—"}</div></div>
    <div class="kpi"><div class="k">Monto final</div><div class="v">${fmtU(c.gran_total)}</div></div>
    <div class="kpi"><div class="k">% Desperdicio</div><div class="v">${fmtPct(detalle.pct_desperdicio_total)}</div></div>
  </div>
  <div class="kpi-grid">
    <div class="kpi"><div class="k">Kg/hora Fabricación</div><div class="v">${detalle.kg_hora_fab ? detalle.kg_hora_fab.toFixed(1) : "—"}</div></div>
    <div class="kpi"><div class="k">Kg/hora Montaje</div><div class="v">${detalle.kg_hora_mon ? detalle.kg_hora_mon.toFixed(1) : "—"}</div></div>
    <div class="kpi"><div class="k">Kg/hora Fab.+Mont.</div><div class="v">${kgHoraCombinado ? kgHoraCombinado.toFixed(1) : "—"}</div></div>
    <div class="kpi"><div class="k">Subtotal</div><div class="v">${fmtU(totalUsd)}</div></div>
  </div>

  <div class="section-title">Desglose por rubro</div>
  <div class="torta-wrap">
    ${tortaSvg}
    <div class="leyenda">${leyenda}</div>
  </div>
  <table class="rubros">
    <thead><tr><th>Rubro</th><th>Monto</th><th>%</th></tr></thead>
    <tbody>
      ${filasRubros}
      <tr><td style="display:table-cell">Subtotal</td><td style="text-align:right">${fmtU(totalUsd)}</td><td style="text-align:right">100%</td></tr>
    </tbody>
  </table>

  <div class="section-title">Comentarios internos</div>
  ${comentarios}

  <div class="footer">Generado el ${fmtD(new Date().toISOString().slice(0, 10))} · Steel Platform — uso interno</div>
  </body></html>`;
}

export function abrirResumenInterno(data) {
  const html = buildResumenInternoHTML(data);
  // Tamaño fijo y explícitamente no maximizada (a pedido de Gino,
  // 2026-09-03) — sin toolbar/menubar/location del navegador, para que se
  // sienta como una ventana de documento y no como una pestaña más. Ya no
  // auto-imprime al cargar (window.onload = print, como sí hace el PDF
  // comercial compartido) — el botón "🖨️ Imprimir" de la propia página
  // dispara window.print() cuando el usuario lo pide.
  const w = 860, h = 900;
  const left = Math.max(0, Math.round((window.screen.width - w) / 2));
  const top = Math.max(0, Math.round((window.screen.height - h) / 2));
  const win = window.open("", "_blank", `width=${w},height=${h},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`);
  if (win) { win.document.write(html); win.document.close(); }
}
