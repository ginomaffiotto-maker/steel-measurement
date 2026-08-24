// server.js — Proxy local para la cotización real del BROU
// No requiere dependencias externas (usa modulos built-in de Node.js)
// Inicia con: node server.js
// Mismo patrón que steelCRM/server.js — puerto distinto (3003, steelCRM ya
// usa 3001) para poder correr los dos sistemas al mismo tiempo sin chocar.

const http = require('http');
const https = require('https');

const PORT = 3003;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3002');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (req.method === 'GET' && req.url === '/api/cotizacion') {
    // El BROU no tiene API pública — esta es la misma llamada que hace su
    // propia página de cotizaciones (verificado con navegador real: un POST
    // a un portlet de Liferay, sin necesitar sesión ni login). Devuelve un
    // fragmento de HTML, no JSON — se parsea la fila "Dólar" (no "Dólar
    // eBROU", que es una tarifa preferencial aparte). Riesgo conocido: si
    // el BROU rediseña esa página, esto puede dejar de funcionar — falla
    // en silencio, no rompe nada del resto de la app. Mismo código que
    // steelCRM/server.js (2026-08-23), replicado acá para paridad.
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
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No se pudo leer la cotización del BROU (¿cambió la página?)' }));
          return;
        }
        const toNum = s => Number(s.replace(/\./g, '').replace(',', '.'));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ compra: toNum(valores[0]), venta: toNum(valores[1]) }));
      });
    });
    brouReq.on('error', err => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    });
    brouReq.end();
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Proxy de cotización corriendo en http://localhost:${PORT}`);
});
