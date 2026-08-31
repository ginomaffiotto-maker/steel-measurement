# Integraciones externas — Steel Platform

**Para:** cualquier sesión que toque IA, cotización, backup o cualquier
llamada a un servicio externo en Steel CRM o Steel Measurement.
**De:** sesión de documentación (`steelCRM - BUILDIING`)
**Fecha:** 2026-08-25
**Fuente:** `server.js` y `api/*.js` de los dos repos, `src/utils/googleDrive.js`,
`src/utils/verificarPassword.js`, `src/utils/supabaseClient.js`, y los
componentes `Config.jsx` de cada sistema — leído directo, no de memoria.

**Relación con los otros documentos**: `ARQUITECTURA-COMPARTIDA.md` §5
ya resume esto en una tabla — este documento es el nivel de detalle
técnico debajo de esa tabla (endpoints exactos, forma del request,
asimetrías reales entre los dos sistemas). Para el esquema de datos,
`ENTIDADES-COMPARTIDAS.md` y `DICCIONARIO-DATOS.md`.

---

## 1. IA (Claude / Anthropic) — solo Steel CRM

Steel Measurement no tiene ninguna integración de IA — no hay `/api/claude`
ni equivalente en ese repo.

**Modelo:** `claude-haiku-4-5-20251001`.

**Por qué pasa por un proxy propio**: la API de Anthropic no admite CORS
desde el browser — cualquier llamada directa desde React falla. El proxy
agrega el header `x-api-key` server-side; la key nunca vive en el
navegador ni viaja a Supabase (se guarda en `localStorage`, clave
`scrm_ai_key`, cargada desde Config > Integraciones — **por diseño, es
por instalación/equipo, no por usuario ni por tenant**).

| | Local | Producción |
|---|---|---|
| Endpoint | `POST http://localhost:3001/api/claude` (`server.js`) | `POST /api/claude` (función serverless, `api/claude.js`) |
| Selección de URL | — | `window.location.hostname === "localhost" ? url_local : "/api/claude"`, en cada uno de los 8 call-sites |

**Forma del request** (igual en los 8 call-sites, `Inicio.jsx`,
`Calculadora.jsx`, `shared.jsx` ×2, `Historial.jsx` ×2, `CerebroNegocio.jsx`,
`Competencia.jsx`):

```json
{ "_apiKey": "sk-ant-...", "model": "claude-haiku-4-5-20251001", "max_tokens": 600-1400, "messages": [{ "role": "user", "content": "..." }] }
```

El proxy extrae `_apiKey` del body, lo saca antes de reenviar, y hace
`POST https://api.anthropic.com/v1/messages` con `anthropic-version:
2023-06-01`. La respuesta se reenvía tal cual (`proxyRes.pipe(res)`) — el
frontend lee `content?.[0]?.text` directo de la forma real de la API de
Anthropic, no un campo propio.

**Si se agrega una función de IA nueva**: replicar el patrón completo
(hostname switch + función serverless) desde el arranque — un fetch
hardcodeado a `localhost:3001` que se suba a producción sin su
`api/claude.js` correspondiente queda roto en Vercel en silencio (pasó
una vez, ver `ARQUITECTURA-COMPARTIDA.md` §7).

---

## 2. Cotización del dólar (BROU) — los dos sistemas

No existe una API pública del BROU. El sistema reproduce la misma llamada
que hace la página real de cotizaciones — scraping, no integración
oficial. **Riesgo conocido y documentado en el propio código**: si el
BROU rediseña esa página, esto deja de funcionar sin aviso previo.

**Endpoint scrapeado:**
```
POST https://www.brou.com.uy/c/portal/render_portlet
  ?p_l_id=20593&p_p_id=cotizacionfull_WAR_broutmfportlet_INSTANCE_otHfewh1klyS
  &p_p_lifecycle=0&p_t_lifecycle=0&p_p_state=normal&p_p_mode=view
  &p_p_col_id=column-1&p_p_col_pos=0&p_p_col_count=2&p_p_isolated=1
  &currentURL=%2Fcotizaciones
```
Sin sesión — responde igual sin estar logueado en el sitio del BROU. La
respuesta es HTML del portlet, parseado en el propio `server.js`/`api/cotizacion.js`
para extraer compra/venta.

| | Local | Producción |
|---|---|---|
| Steel CRM | `GET http://localhost:3001/api/cotizacion` | `GET /api/cotizacion` (`api/cotizacion.js`) |
| Steel Measurement | `GET http://localhost:3003/api/cotizacion` | `GET /api/cotizacion` (`api/cotizacion.js`, repo propio) |

**Mismo scraping, mismo parser copiado en 4 archivos** (`server.js` ×2,
`api/cotizacion.js` ×2) — si el BROU cambia el HTML, hay que actualizar
los 4, no solo uno.

**Uso distinto según el sistema** — esto es a propósito, no un
descuido:
- **Steel CRM**: solo informativo, se muestra en un topbar fijo, no
  alimenta ningún cálculo guardado.
- **Steel Measurement**: autocompleta el campo `tc` (tipo de cambio
  histórico) de cada presupuesto al abrirlo — desde ahí sí alimenta el
  cálculo real. Sigue siendo editable a mano después.

---

## 3. Backup — asimétrico entre los dos sistemas

**Steel CRM** tiene backup local automático real:
- `server.js` dispara `POST /api/backup` **una vez por día**, al abrir
  la app (no manual, no programado con cron — condicionado a que alguien
  use el sistema ese día).
- Escribe `steelcrm/backups/backup_<fecha>.json` a disco.
- Purga archivos de más de 30 días en cada corrida.
- Sin equivalente en producción (Vercel no tiene disco persistente) —
  Config avisa con un banner si pasaron más de 3 días sin un backup
  exitoso.
- Además: Google Drive opcional (`src/utils/googleDrive.js`) — OAuth vía
  Google Identity Services, scope `drive.file`, sube/baja
  `steelcrm_backup.json`. Requiere un Client ID de Google Cloud Console
  propio por instalación. Frecuencia configurable (manual/hora/día/semana)
  o botón manual. **Fix real (2026-08-29)**: el campo Client ID fallaba
  con `401 invalid_client` si se pegaba con un espacio de sobra al
  principio/final (copiar desde la consola de Google es una fuente común
  de esto) — el valor nunca se sanitizaba antes de usarse. Corregido con
  `.trim()` al guardar.

**Steel Measurement no tiene ninguno de los dos mecanismos de arriba.**
Su "Backup y Datos" (Config) es enteramente del lado del browser:
- "⬇️ Descargar backup": arma un `.json` con todo (presupuestos, cómputos,
  anidados, historial, biblioteca) y lo baja como archivo — sin pasar por
  ningún servidor.
- "⬆️ Restaurar desde archivo": lee un `.json` subido a mano y reemplaza
  los datos locales.
- No hay backup automático, no hay banner de aviso si está atrasado, no
  hay integración con Google Drive.

Los dos sistemas comparten, sí, la herramienta de migración a la nube
("☁️ Migrar todo a la nube" / "Migrar datos históricos a la nube") —
pensada como acción de una sola vez, no como mecanismo de backup
recurrente (ver comentario en el propio código de Steel Measurement:
"este bloque entero se puede borrar" una vez confirmada la migración).

---

## 4. Supabase (Auth + base de datos)

Es la integración central de la plataforma — cubierta en detalle en
`ENTIDADES-COMPARTIDAS.md` (esquema, RLS, multi-tenant) y
`ARQUITECTURA-COMPARTIDA.md` (stack, variables de entorno). Acá solo
el resumen de los dos puntos de entrada al SDK:

- **`src/utils/supabaseClient.js`** — cliente principal, persiste sesión,
  usado por toda la app para leer/escribir datos y para el login real.
- **`src/utils/verificarPassword.js`** — cliente **descartable**
  (`persistSession: false, autoRefreshToken: false`), creado solo para
  verificar una contraseña sin pisar la sesión activa de quien esté
  usando la app — es lo que hace posible pedir "tu contraseña" para
  borrar algo sin desloguear a nadie más.

---

## 5. Enlaces externos sin integración real

Google Calendar y Zoom (Steel CRM, sección Integraciones) **no son
integraciones con API** — son atajos de conveniencia: un botón que abre
`calendar.google.com`, y el link de Zoom que se pega a mano en un
seguimiento queda accesible directo desde ahí. No hay OAuth, no hay
sincronización, no hay nada que pueda romperse del lado del código si
Google o Zoom cambian algo — son enlaces planos.

---

## 6. Mantenimiento de este documento

Misma Regla 9 que los otros documentos compartidos: toda sesión que
agregue, quite o cambie una integración externa (nuevo endpoint, nuevo
proxy, cambio de modelo de IA, cambio en el mecanismo de backup)
actualiza este documento en el mismo commit.
