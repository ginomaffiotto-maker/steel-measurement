// api/cotizacion.js — función serverless de Vercel, misma lógica que el
// endpoint /api/cotizacion de server.js (proxy local, puerto 3003). Se
// agrega acá para que la cotización real del BROU funcione también en
// producción (steel-measurement.vercel.app), no solo corriendo la app
// local con el launcher — server.js sigue existiendo para desarrollo
// local, no se toca.
const https = require('https');

module.exports = (req, res) => {
  // El BROU no tiene API pública — esta es la misma llamada que hace su
  // propia página de cotizaciones (verificado con navegador real: un POST
  // a un portlet de Liferay, sin necesitar sesión ni login). Devuelve un
  // fragmento de HTML, no JSON — se parsea la fila "Dólar" (no "Dólar
  // eBROU", que es una tarifa preferencial aparte). Riesgo conocido: si
  // el BROU rediseña esa página, esto puede dejar de funcionar — falla
  // en silencio, no rompe nada del resto de la app.
  const brouOptions = {
    hostname: 'www.brou.com.uy',
    port: 443,
    path: '/c/portal/render_portlet?p_l_id=20593&p_p_id=cotizacionfull_WAR_broutmfportlet_INSTANCE_otHfewh1klyS&p_p_lifecycle=0&p_t_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_pos=0&p_p_col_count=2&p_p_isolated=1&currentURL=%2Fcotizaciones',
    method: 'POST',
    headers: { 'Content-Length': 0 },
  };
  const brouReq = https.request(brouOptions, apiRes => {
    let data = '';
    apiRes.on('data', chunk => { data += chunk; });
    apiRes.on('end', () => {
      const rowMatch = data.match(/<p class="moneda">Dólar<\/p>[\s\S]*?<\/tr>/);
      const valores = rowMatch
        ? [...rowMatch[0].matchAll(/<p class="valor">\s*([\d.,]+)\s*<\/p>/g)].map(m => m[1])
        : [];
      if (valores.length < 2) {
        res.status(502).json({ error: 'No se pudo leer la cotización del BROU (¿cambió la página?)' });
        return;
      }
      const toNum = s => Number(s.replace(/\./g, '').replace(',', '.'));
      res.status(200).json({ compra: toNum(valores[0]), venta: toNum(valores[1]) });
    });
  });
  brouReq.on('error', err => {
    res.status(500).json({ error: err.message });
  });
  brouReq.end();
};
