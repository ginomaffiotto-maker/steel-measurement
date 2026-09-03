// Resumen interno de presupuesto — exclusivo de Steel Measurement, no se
// comparte con Steel CRM (a diferencia de pdfPresupuesto.js, que sí vive
// copiado igual en los dos repos porque genera el documento COMERCIAL que
// se le manda al cliente). Este documento es de uso interno: expone el
// desglose real de costos por rubro que pdfPresupuesto.js deja afuera a
// propósito (ver su comentario de cabecera) — Steel Measurement no le
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

const _sepM = n => Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const fmtN = v => (v || v === 0 ? _sepM(v) : "—");
const fmtU = v => (v || v === 0 ? "U$S " + _sepM(v) : "—");
const fmtPct = v => (v || v === 0 ? Number(v).toFixed(1) + "%" : "—");
const fmtD = s => (s ? new Date(s + "T00:00:00").toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—");

// Mismo orden en que se acumulan en calcPresupuesto — los que dan 0 no se
// muestran en la barra ni en la tabla, para no ensuciar con filas vacías.
const RUBRO_LABELS = {
  hier: "Hierros", mat: "Materiales generales", moFab: "MO Fabricación", moMon: "MO Montaje",
  hesp: "Horas especiales", tFab: "Terceros Fabricación", tMon: "Terceros Montaje",
  trat: "Tratamiento superficie", trasl: "Traslados", panto: "Pantógrafo", maquinado: "Maquinado",
};
// Un color por rubro alcanza para que la barra se lea de un vistazo — sin
// librería de gráficos, son simples <div> con ancho proporcional al %.
const RUBRO_COLOR = {
  hier: "#e85d04", mat: "#f0a500", moFab: "#2563eb", moMon: "#1d4ed8",
  hesp: "#7c3aed", tFab: "#0891b2", tMon: "#0e7490", trat: "#16a34a",
  trasl: "#65a30d", panto: "#dc2626", maquinado: "#db2777",
};

function filaRubro(label, monto, pct, color) {
  return `
    <tr>
      <td><span class="dot" style="background:${color}"></span>${label}</td>
      <td style="text-align:right">${fmtU(monto)}</td>
      <td style="text-align:right">${fmtPct(pct)}</td>
    </tr>`;
}

function barraReparto(rubros, totalUsd) {
  if (!totalUsd) return "";
  const segmentos = Object.entries(rubros)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `<div style="width:${(v / totalUsd * 100).toFixed(2)}%;background:${RUBRO_COLOR[k]}" title="${RUBRO_LABELS[k]}: ${fmtU(v)}"></div>`)
    .join("");
  return `<div class="barra-reparto">${segmentos}</div>`;
}

function filaComentario(c) {
  return `
    <div class="comentario">
      <div class="comentario-meta"><strong>${c.autor || "?"}</strong> · ${fmtD(c.fecha)}${c.hora ? " " + c.hora : ""}</div>
      <div class="comentario-texto">${(c.texto || "").replace(/\n/g, "<br>")}</div>
    </div>`;
}

export function buildResumenInternoHTML(data) {
  const c = data.calc || {};
  const rubros = c.rubros || {};
  const detalle = c.detalle || {};
  const totalUsd = c.total_usd || 0;

  const filasRubros = Object.entries(RUBRO_LABELS)
    .filter(([k]) => rubros[k] > 0)
    .map(([k, label]) => filaRubro(label, rubros[k], totalUsd > 0 ? rubros[k] / totalUsd * 100 : 0, RUBRO_COLOR[k]))
    .join("");

  const horasFabMon = (detalle.moFab_h || 0) + (detalle.moMon_h || 0);
  const kgHoraCombinado = horasFabMon > 0 ? (c.total_kg || 0) / horasFabMon : 0;

  const comentarios = (data.comentarios || []).map(filaComentario).join("") || `<div class="sin-comentarios">Sin comentarios internos cargados.</div>`;

  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
  <title>Resumen interno ${data.nro || ""}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#111;padding:32px;background:#fff}
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
    .barra-reparto{display:flex;height:22px;border-radius:4px;overflow:hidden;margin:10px 0 16px;background:#eee}
    table.rubros{width:100%;border-collapse:collapse;font-size:12px}
    table.rubros thead th{text-align:left;font-size:10px;text-transform:uppercase;color:#888;padding:6px 8px;border-bottom:2px solid #ddd}
    table.rubros thead th:not(:first-child){text-align:right}
    table.rubros tbody td{padding:6px 8px;border-bottom:1px solid #eee}
    table.rubros tbody tr:last-child td{font-weight:900;border-top:2px solid #1a2a4a;border-bottom:none;background:#eef2ff}
    .dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px}
    .comentario{background:#f8f9fc;border-radius:6px;padding:10px 12px;margin-bottom:8px}
    .comentario-meta{font-size:10px;color:#888;margin-bottom:3px}
    .comentario-texto{font-size:12px;color:#333;white-space:pre-line}
    .sin-comentarios{font-size:12px;color:#999;font-style:italic}
    .footer{margin-top:28px;padding-top:10px;border-top:1px solid #e0e0e0;font-size:10px;color:#aaa;text-align:center}
    @media print{body{padding:16px}@page{margin:1.2cm}}
  </style></head><body>
  <div class="aviso">⚠️ Uso interno — no enviar al cliente</div>
  <div class="header">
    <div>
      <div class="co-name">${data.empresa || ""}</div>
    </div>
    <div>
      <div class="pres-label">Resumen interno</div>
      <div class="pres-num">${data.nro || "—"}</div>
      <div class="pres-fecha">Fecha: ${fmtD(data.fecha)}</div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-box"><div class="k">Cliente</div><div class="v">${data.cliente || "—"}</div></div>
    <div class="info-box"><div class="k">Obra</div><div class="v">${data.obra || "—"}</div></div>
    <div class="info-box"><div class="k">Vendedor</div><div class="v">${data.vendedor || "—"}</div></div>
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
  ${barraReparto(rubros, totalUsd)}
  <table class="rubros">
    <thead><tr><th>Rubro</th><th>Monto</th><th>%</th></tr></thead>
    <tbody>
      ${filasRubros}
      <tr><td>Subtotal</td><td style="text-align:right">${fmtU(totalUsd)}</td><td style="text-align:right">100%</td></tr>
    </tbody>
  </table>

  <div class="section-title">Comentarios internos</div>
  ${comentarios}

  <div class="footer">Generado el ${fmtD(new Date().toISOString().slice(0, 10))} · Steel Platform — uso interno</div>
  <script>window.onload = () => window.print();</script>
  </body></html>`;
}

export function abrirResumenInterno(data) {
  const html = buildResumenInternoHTML(data);
  const win = window.open("", "_blank", "width=900,height=700");
  if (win) { win.document.write(html); win.document.close(); }
}
