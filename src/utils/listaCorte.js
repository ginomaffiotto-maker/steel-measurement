// Lista de corte de un Anidado — reporte imprimible (mismo patrón que
// resumenInterno.js: HTML autocontenido, abierto con window.open del mismo
// origen) + reemplazo del .txt plano que se descargaba antes.
//
// 2026-09-19, a pedido de Gino ("revisar la lista de corte para mejorarla
// y agregar un reporte a esta pantalla"): la versión vieja (exportarListaCorte,
// Anidado.jsx) era un .txt con una línea por PIEZA suelta (sin agrupar
// iguales, sin diagrama, sin resumen de compra) — difícil de usar en el
// taller. Este reporte agrupa piezas idénticas dentro de cada hoja/barra
// ("3× Alma 5800×900mm" en vez de 3 líneas iguales), dibuja un diagrama de
// corte simple por hoja/barra (mismo cálculo de posiciones que ya usa la
// pantalla, VizBarra/VizPlancha, adaptado a HTML/SVG plano) y suma un
// resumen general + tabla por material arriba, reusando
// materialesUnificados (Anidado.jsx) para no duplicar la lógica real de
// precio/desperdicio.
//
// Seguridad: nombre del anidado, cliente/obra/empresa, nombre de material y
// etiqueta de pieza son texto libre cargado por el usuario, interpolado acá
// dentro de HTML crudo que termina en un window.open del mismo origen —
// mismo riesgo de XSS ya identificado y corregido en resumenInterno.js
// (2026-09-04). Todo pasa por escapeHtml antes de entrar al HTML.
//
// `mats` (resultado de materialesUnificados(anidado, tc), Anidado.jsx) se
// recibe ya calculado en vez de importar esa función acá — Anidado.jsx es
// quien la llama, evita un import circular (Anidado.jsx → este archivo →
// Anidado.jsx) sin necesidad, ya que este módulo solo necesita los datos.
import { escapeHtml } from "./sanitizeHtml";

const _sepM = n => Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const fmtN = v => (v || v === 0 ? _sepM(v) : "—");
const fmtU = v => (v || v === 0 ? "U$S " + _sepM(v) : "—");
const fmtD = s => (s ? new Date(s + "T00:00:00").toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—");

const PALETTE = ["#e85d04", "#2563eb", "#7c3aed", "#0891b2", "#16a34a", "#dc2626", "#db2777", "#65a30d", "#0e7490", "#f0a500"];

// Agrupa piezas idénticas (misma etiqueta + mismas medidas) de una
// hoja/barra ya anidada — el resultado del algoritmo las guarda una por
// una, pero para el operario es mucho más legible "3× Alma 5800×900mm"
// que la misma línea repetida 3 veces.
function agruparPiezas(piezas, keyFn, labelFn) {
  const mapa = {};
  piezas.forEach(p => {
    const key = keyFn(p);
    if (!mapa[key]) mapa[key] = { ...p, cant: 0 };
    mapa[key].cant++;
  });
  return Object.values(mapa).map(p => labelFn(p));
}

function svgBarra(barra, largo_mm) {
  const W = 460, H = 24, esc = largo_mm > 0 ? W / largo_mm : 0;
  const rects = barra.piezas.map((p) => {
    const x = p.pos_mm * esc, w = Math.max(1, p.largo_mm * esc);
    const col = PALETTE[(p.colorIdx || 0) % PALETTE.length];
    const label = w > 24 ? `<text x="${x + w / 2}" y="${H / 2 + 3.5}" text-anchor="middle" font-size="7" fill="#fff" font-weight="700">${escapeHtml(p.etiqueta)}</text>` : "";
    return `<rect x="${x + 0.5}" y="2" width="${w - 1}" height="${H - 4}" fill="${col}" rx="2"/>${label}`;
  }).join("");
  return `<svg width="${W}" height="${H}" style="display:block">` +
    `<rect width="${W}" height="${H}" fill="#eee" stroke="#ccc"/>${rects}</svg>`;
}

function svgPlancha(hoja, sheet_w, sheet_h) {
  const MAX_W = 420, MAX_H = 150;
  const esc = Math.min(MAX_W / (sheet_w || 1), MAX_H / (sheet_h || 1));
  const W = Math.round((sheet_w || 0) * esc), H = Math.round((sheet_h || 0) * esc);
  const piezas = hoja.shelves.flatMap(s => s.piezas);
  const rects = piezas.map((p) => {
    const x = Math.round(p.x * esc), y = Math.round(p.y * esc);
    const w = Math.max(1, Math.round(p.w * esc)), h = Math.max(1, Math.round(p.h * esc));
    const col = PALETTE[(p.colorIdx || 0) % PALETTE.length];
    const fs = Math.min(8, w / 6, h / 2);
    const label = (w > 24 && h > 12) ? `<text x="${x + w / 2}" y="${y + h / 2 + 3}" text-anchor="middle" font-size="${fs}" fill="#fff" font-weight="700">${escapeHtml(p.etiqueta)}</text>` : "";
    return `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" fill="${col}" stroke="#fff" stroke-width="0.5"/>${label}`;
  }).join("");
  return `<svg width="${W}" height="${H}" style="display:block">` +
    `<rect width="${W}" height="${H}" fill="#eee" stroke="#ccc"/>${rects}</svg>`;
}

function seccionGrupo(g) {
  const r = g.resultado?.resumen;
  if (!g.resultado || !r) return "";
  if (g.tipo === "plancha") {
    const hojas = g.resultado.hojas.map(h => {
      const piezasAgrupadas = agruparPiezas(
        h.shelves.flatMap(s => s.piezas),
        p => `${p.etiqueta}|${p.w}x${p.h}`,
        p => `<span class="pieza-chip">${p.cant > 1 ? p.cant + "× " : ""}${escapeHtml(p.etiqueta || "—")} (${Math.round(p.w)}×${Math.round(p.h)}mm)</span>`
      ).join("");
      return `<div class="hoja">
        <div class="hoja-nro">Hoja ${h.nro}</div>
        ${svgPlancha(h, g.sheet_w, g.sheet_h)}
        <div class="hoja-piezas">${piezasAgrupadas}</div>
      </div>`;
    }).join("");
    return `<div class="grupo">
      <div class="grupo-header">
        <span class="grupo-material">${escapeHtml(g.material_nombre || "Sin material")}</span>
        <span class="grupo-dim">Plancha ${fmtN(g.sheet_w)}×${fmtN(g.sheet_h)}mm</span>
        <span class="grupo-total">${r.n_hojas} hoja${r.n_hojas !== 1 ? "s" : ""} · ${r.pct_desp}% desperdicio</span>
      </div>
      <div class="hojas-grid">${hojas}</div>
    </div>`;
  } else {
    const barras = g.resultado.barras.map(b => {
      const piezasAgrupadas = agruparPiezas(
        b.piezas,
        p => `${p.etiqueta}|${p.largo_mm}`,
        p => `<span class="pieza-chip">${p.cant > 1 ? p.cant + "× " : ""}${escapeHtml(p.etiqueta || "—")} (${Math.round(p.largo_mm)}mm)</span>`
      ).join("");
      return `<div class="hoja hoja-barra${b.forzada ? " forzada" : ""}">
        <div class="hoja-nro">Barra ${b.nro}${b.forzada ? " (empalme)" : ""}</div>
        ${svgBarra(b, g.largo_barra_mm)}
        <div class="hoja-piezas">${piezasAgrupadas}</div>
        <div class="hoja-libre">Libre: ${fmtN(b.libre_mm)}mm</div>
      </div>`;
    }).join("");
    return `<div class="grupo">
      <div class="grupo-header">
        <span class="grupo-material">${escapeHtml(g.material_nombre || "Sin material")}</span>
        <span class="grupo-dim">Barra ${fmtN(g.largo_barra_mm)}mm</span>
        <span class="grupo-total">${r.b_total} barra${r.b_total !== 1 ? "s" : ""} · ${r.pct_desp}% desperdicio</span>
      </div>
      <div class="hojas-grid">${barras}</div>
    </div>`;
  }
}

export function buildListaCorteHTML(anidado, mats) {
  // Mismo orden que se ve en pantalla (Anidado.jsx): planchas de menor a
  // mayor espesor entre sí, perfiles en su orden original — acá no hace
  // falta acceso a la biblioteca de espesores porque alcanza con ordenar
  // por kg_m2 (proporcional al espesor para un mismo material), suficiente
  // para que el reporte coincida con lo que el vendedor ya vio en pantalla.
  const grupos = [...(anidado.grupos || [])].sort((a, b) => {
    if (a.tipo !== "plancha" || b.tipo !== "plancha") return 0;
    return (a.kg_m2 || 0) - (b.kg_m2 || 0);
  });

  const totalKg = mats.reduce((s, m) => s + (m.kg || 0), 0);
  const totalKgUtil = mats.reduce((s, m) => s + (m.kg_util || 0), 0);
  const totalCosto = mats.reduce((s, m) => s + (m.precio_total || 0), 0);
  const pctDespGeneral = totalKg > 0 ? Math.round((1 - totalKgUtil / totalKg) * 1000) / 10 : 0;
  const filasMateriales = mats.map(m => `<tr>
    <td>${escapeHtml(m.nombre)}</td>
    <td style="text-align:right">${m.unidades.total} ${escapeHtml(m.unidades.label)}</td>
    <td style="text-align:right">${fmtN(m.kg)} kg</td>
    <td style="text-align:right">${m.kg > 0 ? Math.round((1 - m.kg_util / m.kg) * 1000) / 10 : 0}%</td>
    <td style="text-align:right">${m.precio_total > 0 ? fmtU(m.precio_total) : "—"}</td>
  </tr>`).join("");

  const gruposHTML = grupos.map(seccionGrupo).join("") ||
    `<div class="sin-datos">Ningún grupo tiene un corte calculado todavía.</div>`;

  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
  <title>Lista de corte — ${escapeHtml(anidado.nombre)}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#111;padding:28px;background:#fff}
    .toolbar{display:flex;justify-content:flex-end;margin-bottom:14px}
    .btn-imprimir{background:#1a2a4a;color:#fff;border:none;border-radius:6px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;padding-bottom:14px;border-bottom:3px solid #1a2a4a}
    .titulo{font-size:19px;font-weight:900;color:#1a2a4a}
    .subt{font-size:11px;color:#666;margin-top:3px}
    .fecha{font-size:11px;color:#666;text-align:right}
    .section-title{font-size:9px;text-transform:uppercase;letter-spacing:1.2px;color:#888;margin:18px 0 8px;padding-bottom:4px;border-bottom:1px solid #e0e0e0}
    .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:6px}
    .kpi{background:#eef2ff;border-radius:6px;padding:10px;text-align:center}
    .kpi .k{font-size:9px;color:#666;text-transform:uppercase}
    .kpi .v{font-size:16px;font-weight:900;color:#1a2a4a;margin-top:2px}
    table.mats{width:100%;border-collapse:collapse;font-size:11px;margin-top:6px}
    table.mats thead th{text-align:left;font-size:9px;text-transform:uppercase;color:#888;padding:5px 6px;border-bottom:2px solid #ddd}
    table.mats thead th:not(:first-child){text-align:right}
    table.mats tbody td{padding:5px 6px;border-bottom:1px solid #eee}
    .grupo{margin-bottom:18px;page-break-inside:avoid}
    .grupo-header{display:flex;gap:14px;align-items:baseline;background:#f8f9fc;border-radius:6px;padding:8px 12px;margin-bottom:8px}
    .grupo-material{font-weight:800;font-size:13px;color:#1a2a4a}
    .grupo-dim{font-size:11px;color:#666}
    .grupo-total{margin-left:auto;font-size:11px;font-weight:700;color:#c2410c}
    .hojas-grid{display:flex;flex-direction:column;gap:8px}
    .hoja{border:1px solid #e0e0e0;border-radius:5px;padding:7px 10px;page-break-inside:avoid}
    .hoja-nro{font-size:10px;font-weight:800;color:#444;margin-bottom:4px}
    .hoja-piezas{display:flex;flex-wrap:wrap;gap:5px;margin-top:5px}
    .pieza-chip{background:#f1f1f1;border-radius:4px;padding:2px 7px;font-size:10px;color:#333}
    .hoja-libre{font-size:10px;color:#888;margin-top:4px}
    .hoja-barra.forzada{background:#fff8ec}
    .sin-datos{color:#999;font-style:italic;font-size:12px;padding:12px 0}
    .footer{margin-top:24px;padding-top:10px;border-top:1px solid #e0e0e0;font-size:10px;color:#aaa;text-align:center}
    @media print{.toolbar{display:none}body{padding:14px}@page{margin:1.2cm}}
  </style></head><body>
  <div class="toolbar"><button class="btn-imprimir" onclick="window.print()">🖨️ Imprimir</button></div>
  <div class="header">
    <div>
      <div class="titulo">📋 Lista de corte — ${escapeHtml(anidado.nombre)}</div>
      <div class="subt">${[anidado.cliente, anidado.empresa, anidado.obra].filter(Boolean).map(escapeHtml).join(" · ") || "—"}</div>
    </div>
    <div class="fecha">Fecha: ${fmtD(anidado.fecha)}</div>
  </div>

  <div class="section-title">Resumen general</div>
  <div class="kpi-grid">
    <div class="kpi"><div class="k">Kg totales</div><div class="v">${fmtN(totalKg)}</div></div>
    <div class="kpi"><div class="k">Kg útiles</div><div class="v">${fmtN(totalKgUtil)}</div></div>
    <div class="kpi"><div class="k">% Desperdicio</div><div class="v">${pctDespGeneral}%</div></div>
    <div class="kpi"><div class="k">Costo estimado</div><div class="v">${totalCosto > 0 ? fmtU(totalCosto) : "—"}</div></div>
  </div>
  <table class="mats">
    <thead><tr><th>Material</th><th>A comprar</th><th>Kg</th><th>% desp.</th><th>Costo</th></tr></thead>
    <tbody>${filasMateriales || `<tr><td colspan="5" style="color:#999;font-style:italic">Sin materiales calculados todavía.</td></tr>`}</tbody>
  </table>

  <div class="section-title">Diagrama de corte por hoja/barra</div>
  ${gruposHTML}

  <div class="footer">Generado el ${fmtD(new Date().toISOString().slice(0, 10))} · Steel Platform — lista de corte interna</div>
  </body></html>`;
}

export function abrirListaCorte(anidado, mats) {
  const html = buildListaCorteHTML(anidado, mats);
  const w = 900, h = 900;
  const left = Math.max(0, Math.round((window.screen.width - w) / 2));
  const top = Math.max(0, Math.round((window.screen.height - h) / 2));
  const win = window.open("", "_blank", `width=${w},height=${h},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`);
  if (win) { win.document.write(html); win.document.close(); }
}
