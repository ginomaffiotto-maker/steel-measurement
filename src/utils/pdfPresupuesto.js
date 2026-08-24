// Plantilla compartida del PDF de presupuesto.
// Esta misma función vive, copiada igual, en steelCRM y en Steel Measurement
// — es lo que garantiza que los dos PDFs se vean exactamente iguales aunque
// el presupuesto de origen tenga un solo precio (steelCRM) o un cálculo de
// 9 rubros por detrás (Steel Measurement). El PDF nunca expone ese desglose
// interno de costos al cliente — solo kg, USD/kg y el monto total.
// Si se toca el HTML/CSS acá, replicar el cambio en la copia del otro repo.

const _sepM = n => Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const fmtN = v => (v ? _sepM(v) : "—");
const fmtU = v => (v ? "U$S " + _sepM(v) : "—");
const fmtD = s => (s ? new Date(s + "T00:00:00").toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—");

function filaDetalle(label, val) {
  return val
    ? `<tr><td style="color:#666;width:140px">${label}</td><td style="font-weight:600">${val}</td></tr>`
    : "";
}

// Bloques configurables de la página — orden y on/off editable por instalación
// (Config), guardado como localStorage `..._pdf_bloques`. Este es el orden y
// el set por defecto: todo activo, mismo layout que la versión original.
export const BLOQUES_DEFAULT = [
  { tipo: "header", activo: true },
  { tipo: "cliente_proyecto", activo: true },
  { tipo: "detalle", activo: true },
  { tipo: "condiciones", activo: true },
  { tipo: "notas", activo: true },
  { tipo: "footer", activo: true },
];
export const BLOQUES_LABELS = {
  header: "Encabezado (empresa, N°, fecha)",
  cliente_proyecto: "Cliente y proyecto",
  detalle: "Detalle del presupuesto (kg, USD/kg, monto)",
  condiciones: "Condiciones comerciales",
  notas: "Notas y cláusulas",
  footer: "Pie de página",
};

// Cada función de bloque recibe el `data` completo y devuelve el HTML de esa
// sección, o "" si no corresponde mostrarla (ej. sin notas cargadas).
const RENDER_BLOQUE = {
  header: (data) => `
  <div class="header">
    <div>
      <div class="co-name">${data.empresa || ""}</div>
      <div class="co-sub">Estructuras Metálicas</div>
    </div>
    <div>
      <div class="pres-label">Presupuesto</div>
      <div class="pres-num">${data.nro || "—"}</div>
      <div class="pres-fecha">Fecha: ${fmtD(data.fecha)}</div>
      ${data.validoHasta ? `<div class="pres-fecha">Válido hasta: ${fmtD(data.validoHasta)}</div>` : ""}
    </div>
  </div>`,

  cliente_proyecto: (data) => {
    const cli = data.cliente || {};
    const proy = data.proyecto || {};
    return `
  <div class="info-grid">
    <div class="info-box">
      <div class="section-title">Cliente</div>
      <table class="info-table">
        ${filaDetalle("Empresa", cli.empresa)}
        ${filaDetalle("Contacto", cli.contacto)}
        ${filaDetalle("Email", cli.email)}
        ${filaDetalle("Teléfono", cli.telefono)}
      </table>
    </div>
    <div class="info-box">
      <div class="section-title">Proyecto</div>
      <table class="info-table">
        ${filaDetalle("Descripción", proy.descripcion)}
        ${filaDetalle("Obra", proy.obra)}
        ${filaDetalle("Tipo de trabajo", proy.tipo)}
        ${filaDetalle("Categoría", proy.categoria)}
      </table>
    </div>
  </div>`;
  },

  detalle: (data) => {
    const items = data.items || [];
    const filasItems = items.map(it => `
      <tr>
        <td>${it.label || "—"}${it.sub ? `<br><span style="font-size:10px;color:#888">${it.sub}</span>` : ""}</td>
        <td style="text-align:right">${it.kg != null ? fmtN(it.kg) : "—"}</td>
        <td style="text-align:right">${it.usdKg != null ? Number(it.usdKg).toFixed(2) : "—"}</td>
        <td>${fmtU(it.totalUSD)}</td>
      </tr>`).join("");
    return `
  <div class="section-title">Detalle del presupuesto</div>
  <table class="main">
    <thead>
      <tr>
        <th style="width:45%">Descripción</th>
        <th style="width:18%;text-align:right">KG Cotizados</th>
        <th style="width:18%;text-align:right">USD / KG</th>
        <th style="width:19%">Total USD</th>
      </tr>
    </thead>
    <tbody>
      ${filasItems}
      <tr class="total-row">
        <td colspan="3">TOTAL PRESUPUESTO</td>
        <td>${fmtU(data.totalUSD)}</td>
      </tr>
    </tbody>
  </table>`;
  },

  condiciones: (data) => {
    const cond = data.condiciones || {};
    const info = data.infoProyecto || {};
    const hayAlgo = cond.acabadoSuperficial || (cond.plazoPago !== undefined && cond.plazoPago !== "") || cond.formaPago || cond.moneda || info.estadoObra || info.idCalculo;
    if (!hayAlgo) return "";
    return `
  <div class="detail-grid">
    <div class="detail-box">
      <div class="section-title">Condiciones comerciales</div>
      <table class="info-table">
        ${filaDetalle("Moneda", cond.moneda)}
        ${filaDetalle("Forma de pago", cond.plazoPago === 0 ? "Contado" : cond.plazoPago ? cond.plazoPago + " días" : (cond.formaPago || null))}
        ${filaDetalle("Acabado superficial", cond.acabadoSuperficial)}
        ${cond.descuentoPct ? filaDetalle("Descuento aplicado", cond.descuentoPct + "%") : ""}
      </table>
    </div>
    <div class="detail-box">
      <div class="section-title">Información del proyecto</div>
      <table class="info-table">
        ${filaDetalle("Estado de obra", info.estadoObra)}
        ${filaDetalle("ID de cálculo", info.idCalculo)}
      </table>
    </div>
  </div>`;
  },

  notas: (data) => data.notas
    ? `<div class="notas"><strong style="color:#92400e">📝 Notas / Cláusulas:</strong> ${data.notas.replace(/\n/g, "<br>")}</div>`
    : "",

  footer: (data) => {
    const hoy = new Date().toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit", year: "numeric" });
    return `
  <div class="footer">
    <span>${data.empresa || ""} — Generado el ${hoy}</span>
    <span>Generado con Steel Platform</span>
  </div>`;
  },
};

// data = {
//   empresa, nro, fecha, validoHasta,
//   cliente: { empresa, contacto, email, telefono },
//   proyecto: { descripcion, obra, tipo, categoria },
//   items: [{ label, sub, kg, usdKg, totalUSD }],   // resumen — 1 sola fila, nunca el desglose interno de rubros/costos
//   totalUSD,
//   condiciones: { moneda, acabadoSuperficial, plazoPago, formaPago, descuentoPct },
//   infoProyecto: { estadoObra, idCalculo },
//   notas,   // notas / cláusulas
//   bloques  // opcional — [{ tipo, activo }], orden y on/off de las secciones. Default: BLOQUES_DEFAULT
// }
export function buildPresupuestoHTML(data) {
  const bloques = data.bloques && data.bloques.length ? data.bloques : BLOQUES_DEFAULT;
  const cuerpo = bloques
    .filter(b => b.activo && RENDER_BLOQUE[b.tipo])
    .map(b => RENDER_BLOQUE[b.tipo](data))
    .join("\n");

  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
  <title>Presupuesto ${data.nro || ""}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#111;padding:32px;background:#fff}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:20px;border-bottom:3px solid #1a2a4a}
    .co-name{font-size:22px;font-weight:900;color:#1a2a4a;letter-spacing:-0.5px}
    .co-sub{font-size:11px;color:#666;margin-top:3px}
    .pres-label{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;text-align:right}
    .pres-num{font-size:28px;font-weight:900;color:#1a2a4a;text-align:right;line-height:1}
    .pres-fecha{font-size:11px;color:#666;text-align:right;margin-top:4px}
    .section-title{font-size:9px;text-transform:uppercase;letter-spacing:1.2px;color:#888;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #e0e0e0}
    .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px}
    .info-box{background:#f8f9fc;border-radius:6px;padding:14px}
    .info-table{width:100%;border-collapse:collapse;font-size:11.5px}
    .info-table td{padding:3px 0;vertical-align:top}
    table.main{width:100%;border-collapse:collapse;margin:20px 0}
    table.main thead tr{background:#1a2a4a}
    table.main thead th{color:#fff;padding:9px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.5px}
    table.main thead th:last-child{text-align:right}
    table.main tbody td{padding:10px 12px;border-bottom:1px solid #eee;font-size:12px}
    table.main tbody td:last-child{text-align:right;font-weight:600}
    table.main tbody td:nth-child(2),table.main tbody td:nth-child(3){text-align:right;color:#444}
    .total-row td{background:#eef2ff;font-weight:900;font-size:13px;border-top:2px solid #1a2a4a;border-bottom:none}
    .total-row td:last-child{color:#1a2a4a;font-size:15px}
    .detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}
    .detail-box{background:#f8f9fc;border-radius:6px;padding:14px}
    .notas{background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:14px;margin-bottom:20px;font-size:11.5px;line-height:1.6;color:#555}
    .footer{margin-top:32px;padding-top:12px;border-top:1px solid #e0e0e0;display:flex;justify-content:space-between;font-size:10px;color:#aaa}
    @media print{body{padding:16px}@page{margin:1.2cm}}
  </style></head><body>
  ${cuerpo}
  <script>window.onload = () => window.print();</script>
  </body></html>`;
}

export function abrirPDFPresupuesto(data) {
  const html = buildPresupuestoHTML(data);
  const win = window.open("", "_blank", "width=900,height=700");
  if (win) { win.document.write(html); win.document.close(); }
}
