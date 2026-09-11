# Integraciones externas — Steel Platform

**Para:** cualquier sesión que toque IA, cotización, backup o cualquier
llamada a un servicio externo en Steel CRM o Steel Costos.
**De:** sesión de documentación (`steelCRM - BUILDIING` → `SteelPlatform`)
**Fecha:** 2026-08-25, actualizado 2026-09-11
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

Steel Costos no tiene ninguna integración de IA — no hay `/api/claude`
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
| Steel Costos | `GET http://localhost:3003/api/cotizacion` | `GET /api/cotizacion` (`api/cotizacion.js`, repo propio) |

**Mismo scraping, mismo parser copiado en 4 archivos** (`server.js` ×2,
`api/cotizacion.js` ×2) — si el BROU cambia el HTML, hay que actualizar
los 4, no solo uno.

**Uso distinto según el sistema** — esto es a propósito, no un
descuido:
- **Steel CRM**: solo informativo, se muestra en un topbar fijo, no
  alimenta ningún cálculo guardado.
- **Steel Costos**: autocompleta el campo `tc` (tipo de cambio
  histórico) de cada presupuesto al abrirlo — desde ahí sí alimenta el
  cálculo real. Sigue siendo editable a mano después.

---

## 3. Backup — real y simétrico desde 2026-09-04 (antes asimétrico y roto)

**⚠️ Hallazgo real que motivó el rediseño**: el mecanismo viejo de Steel
CRM (`server.js` → `POST /api/backup` a disco, descrito debajo de esta
sección hasta el 2026-09-04) **nunca corrió en producción** —
`steelcrm.vercel.app` no tiene disco persistente, y el `fetch` a
`http://localhost:3001/api/backup` fallaba siempre en silencio
(`.catch(() => {})`, por diseño, para no bloquear nada). El cartel de
"backup atrasado" en Inicio quedaba atrasado para siempre sin que nadie
lo notara, para cualquiera que usara la URL real en vez del launcher
local. Steel Costos, mientras tanto, nunca tuvo ningún mecanismo
automático — solo descarga/carga manual de un `.json`.

**Mecanismo nuevo, compartido por los dos sistemas** (`api/backup-cron.js`,
solo en el repo `steelcrm` — cubre los dos tenants de una sola pasada
porque comparten backend, no hace falta uno por repo):

- **Bucket privado `backups`** en Supabase Storage — solo la
  `service_role key` puede leerlo/escribirlo, ninguna policy de Storage
  para usuarios normales.
- **`tablas_con_tenant_id()`** (función SQL, `security definer`) —
  descubre en vivo qué tablas respaldar (cualquiera con columna
  `tenant_id`), en vez de una lista fija a mano que se desincroniza cada
  vez que se agrega una tabla nueva (mismo tipo de desfasaje que ya causó
  varios bugs reales en este proyecto).
- **Dos formas de invocarse**: (1) el cron real de Vercel
  (`vercel.json`, diario a las 06:00 UTC / 03:00 Montevideo), autenticado
  con `CRON_SECRET` (Vercel lo manda solo en esas invocaciones); (2) un
  admin pidiendo "Backup ahora" a mano desde Config, autenticado con su
  propio token de sesión — mismo patrón de validación que invitar/
  eliminar usuario (§4).
- Poda automática de snapshots de más de 30 días.
- **`api/backup-status.js`** (copia idéntica en los dos repos, mismo
  bucket) — lectura de solo estado, no dispara nada; alimenta el banner
  de Config/Inicio en los dos sistemas.
- CORS explícito (`ORIGENES_PERMITIDOS`: `steelcrm.vercel.app`,
  `steelcostos.vercel.app`, `steel-measurement.vercel.app`, más
  `localhost` en cualquier puerto) — solo importa para la invocación
  manual desde el browser; el cron real de Vercel llama server-to-server,
  sin origin de por medio.

**Google Drive (backup opcional), ahora en los dos sistemas** —
`src/utils/googleDrive.js` (OAuth vía Google Identity Services, scope
`drive.file`, sube/baja el backup como `.json`) se replicó a Steel Costos
el 2026-09-04, cerrando la asimetría de esta misma sección. Requiere un
Client ID de Google Cloud Console propio por instalación; frecuencia
configurable (manual/hora/día/semana) o botón manual en los dos. **Fix
real (2026-08-29, solo hacía falta en Steel CRM)**: el campo Client ID
fallaba con `401 invalid_client` si se pegaba con un espacio de sobra —
corregido con `.trim()` al guardar. Steel Costos nació ya con `.trim()`
en el propio `onChange` del campo (no heredó el bug al construirse
después).

**Mecanismo viejo de Steel CRM, dado de baja el 2026-09-04**: `server.js`
disparaba `POST /api/backup` una vez por día al abrir la app local,
escribía `steelcrm/backups/backup_<fecha>.json` a disco y purgaba lo de
más de 30 días — sigue existiendo el código en `server.js` (uso local,
inofensivo) pero el `useEffect` de `App.js` que lo llamaba en cada carga
se sacó (ensuciaba la consola de producción con el error de conexión de
arriba, sin cumplir ninguna función real ahí).

Los dos sistemas comparten, además, la herramienta de migración a la nube
("☁️ Migrar todo a la nube" / "Migrar datos históricos a la nube") —
pensada como acción de una sola vez, no como mecanismo de backup
recurrente (ver comentario en el propio código de Steel Costos:
"este bloque entero se puede borrar" una vez confirmada la migración).

---

## 4. Invitación / eliminación de usuarios por email (2026-09-02/04)

Reemplaza el flujo viejo (`scripts/crear-usuario.mjs`, steel-backend) de
armar un comando en pantalla para que alguien con la `service_role key`
lo pegara a mano en su propia terminal. Ahora es un envío real desde
Config > Usuarios, en los dos sistemas — `api/invitar-usuario.js` y
`api/eliminar-usuario.js` (copia casi idéntica en `steelcrm` y en Steel
Costos, cada repo con su propia `SUPABASE_SERVICE_ROLE_KEY` en Vercel).

**Por qué vive server-side y no en el cliente**: esta key se filtró por
chat 3 veces en este proyecto (ver `CLAUDE.md`, entradas del 23-24/8) —
a propósito **no** se agrega como variable de entorno local (ni en
`server.js` ni en el launcher), solo existe en Vercel. El cliente
siempre le pega a la URL de **producción** del sistema correspondiente,
corra local o no — invitar/eliminar gente no es tan frecuente como para
justificar tener la key dando vueltas en más de un lugar.

**Validación, nunca confía en lo que manda el navegador**: cada función
resuelve quién llama por su token real de sesión (`Authorization:
Bearer`), lee su fila en `profiles`, y solo sigue si `rol = "admin"`. El
`tenant_id` de la persona nueva sale de esa misma fila — nunca de un
campo del formulario — para que no se pueda invitar a nadie a otro
tenant por error ni a propósito.

**CORS explícito** (necesario porque el cliente le pega a un origen
cruzado en desarrollo, y manda un header `Authorization` custom — el
browser exige preflight `OPTIONS`): `invitar-usuario.js`/
`eliminar-usuario.js` de `steelcrm` permiten `steelcrm.vercel.app` +
`localhost` (cualquier puerto); los de Steel Costos permiten
`steelcostos.vercel.app` + `steel-measurement.vercel.app` + `localhost`
(las dos URLs de producción, ver `ARQUITECTURA-COMPARTIDA.md` §1).

**Invitar**: `auth.admin.inviteUserByEmail` — crea la cuenta real y
manda el correo de invitación de Supabase; marca `profiles.invitado_pendiente
= true` (se limpia sola en el primer login real, badge "⏳ Invitado —
pendiente" en la lista de Equipo). Mensaje de error traducido para el
caso más común ("ese email ya tiene una cuenta creada") en vez del texto
crudo en inglés de Supabase.

**Eliminar**: `auth.admin.deleteUser` — revoca la cuenta real;
`profiles.id` tiene `on delete cascade` contra `auth.users(id)`, así que
la fila de perfil se borra sola, sin un segundo DELETE. Un 404 (perfil
local apuntando a una cuenta que ya no existe, ej. borrada desde otra
pestaña) se trata como "ya está borrada" y se saca de la lista igual, en
vez de bloquear el flujo.

---

## 5. Monitoreo de errores (Sentry, 2026-09-07)

`utils/sentry.jsx` (mismo archivo en los dos repos) + `Sentry.ErrorBoundary`
envolviendo `<App/>` en `index.js`, con una pantalla de resguardo en vez
de dejar la pantalla en blanco si React se cae del todo.

Gatea todo por `REACT_APP_SENTRY_DSN` — sin esa variable, no hace nada
(build limpio y funcional en los dos repos sin ella). El DSN es público
por diseño (viaja en el bundle del browser, mismo criterio que la anon
key de Supabase) — sin riesgo si se comparte, a diferencia de la
`service_role key`.

Dos proyectos reales en sentry.io (`STEEL-CRM-1`, `STEEL-COSTOS-1`),
plataforma React, solo "Error monitoring". **Límite real, no específico
de esta implementación**: un bloqueador de anuncios/privacidad activo en
el navegador del usuario puede tapar el pedido a `ingest.sentry.io` —
confirmado como causa real de un falso negativo durante la verificación
(el evento de prueba no apareció con AdBlock activo, sí en una ventana
de incógnito sin extensiones).

---

## 6. Supabase (Auth + base de datos)

Es la integración central de la plataforma — cubierta en detalle en
`ENTIDADES-COMPARTIDAS.md` (esquema, RLS, multi-tenant) y
`ARQUITECTURA-COMPARTIDA.md` (stack, variables de entorno). Acá solo
el resumen de los puntos de entrada al SDK:

- **`src/utils/supabaseClient.js`** — cliente principal, persiste sesión,
  usado por toda la app para leer/escribir datos y para el login real.
- **`src/utils/verificarPassword.js`** — cliente **descartable**
  (`persistSession: false, autoRefreshToken: false`), creado solo para
  verificar una contraseña sin pisar la sesión activa de quien esté
  usando la app — es lo que hace posible pedir "tu contraseña" para
  borrar algo sin desloguear a nadie más.
- **Cliente admin server-side** (`createClient` con la `service_role
  key`, dentro de `api/invitar-usuario.js`/`eliminar-usuario.js`/
  `backup-cron.js`) — nunca corre en el browser, es el único punto de
  entrada que puede saltarse RLS (usa `auth.admin.*` y lee/escribe el
  bucket de Storage).

---

## 7. Enlaces externos sin integración real — sacados del todo, 2026-09-04/05

Google Calendar y Zoom (Steel CRM, Config > Integraciones) **nunca
fueron integraciones con API** — eran atajos de conveniencia: un botón
que abría `calendar.google.com`, y el link de Zoom que se pegaba a mano
en un seguimiento quedaba accesible directo desde ahí. Sin OAuth, sin
sincronización real. A pedido de Gino ("no eran integraciones reales"),
**se sacaron los dos botones** de Config — el link de Zoom en
Seguimientos (`zoom_link`, campo de texto libre) sigue existiendo, no es
parte de lo que se sacó. Si en el futuro se decide construir una
integración real con alguno de los dos servicios, es trabajo nuevo, no
hay nada de este mecanismo viejo para reactivar.

---

## 8. Mantenimiento de este documento

Misma Regla 9 que los otros documentos compartidos: toda sesión que
agregue, quite o cambie una integración externa (nuevo endpoint, nuevo
proxy, cambio de modelo de IA, cambio en el mecanismo de backup)
actualiza este documento en el mismo commit.
