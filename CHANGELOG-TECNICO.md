# Changelog técnico — Steel Platform

**Para:** referencia rápida de "qué cambió y cuándo" a nivel técnico, sin
la textura de sesión de los changelogs narrativos.
**De:** sesión de documentación (`steelCRM - BUILDIING`)
**Fecha:** 2026-08-25
**Fuente:** condensado de `steelCRM - BUILDIING/CLAUDE.md`,
`steel-measurement/PLAN.md` + `PLAN-HISTORIAL.md`, y `steel-backend/CLAUDE.md`.

**Qué es esto y qué NO es.** Es un índice de hitos técnicos reales,
agrupados por fecha, en formato de una línea — pensado para responder
"¿cuándo se agregó X?" o "¿qué pasó en agosto?" sin leer las ~30 entradas
narrativas de cada changelog fuente. **No reemplaza** a esos tres
archivos — para el contexto completo de una decisión (por qué, quién lo
pidió, qué se descartó en el camino), esos siguen siendo la fuente de
verdad. Este documento resume, no sustituye.

---

## 2026-06 — Steel Measurement, módulos base

- **M1 — Biblioteca** de materiales (perfiles, planchuelas, planchas, rejillas).
- **M2 — Cómputo** (reescrito 2026-06-19): carga de piezas, cálculo de peso/superficie.
- **M3 — Anidado** (actualizado 2026-06-19): optimización de corte.

## 2026-07-31 — Steel Measurement, Presupuesto e Historial

- **M4 — Presupuesto**: 9 rubros de costo por ítem, importación de material desde Cómputo/Anidado.
- **M5 — Historial**: registro de trabajos cerrados, benchmark para Predictor Eq.

## 2026-08-02 — Steel CRM: control de versiones

- `git init` en Steel CRM (no existía hasta esta fecha). Eliminado código muerto (`Cerebro.jsx`).

## 2026-08-05 — Steel CRM: Prioridad A del roadmap completa

- Agendar seguimiento desde Kanban/Presupuesto, último contacto en cards, color de urgencia por inactividad, mini-alarmas en Kanban, vista móvil (lista en vez de drag & drop).

## 2026-08-06 — Taxonomía compartida

- Campo "Categoría" en Presupuestos (Steel CRM), reemplaza el `tipo` genérico de 10 valores. Fuente canónica: las 32 Categorías de Predictor Eq v25 (`TAXONOMIA-COMPARTIDA.md`).

## 2026-08-14 — Steel CRM: preparación de carga histórica

- Fix de `Importar.jsx` para datos reales de `presupuestos_v28.xlsm` (614 presupuestos + 186 contactos). Campo `recotizacionDe` nuevo — las recotizaciones venían como filas nuevas, no cambios de estado.

## 2026-08-16 — `idsCalc`, fix de IA rota, B3/B5

- **`idCalc` (string) → `idsCalc` (array)** — un presupuesto puede tener varios códigos de cálculo.
- Fix: `Calculadora.jsx`/`Competencia.jsx` llamaban directo a `api.anthropic.com` desde el browser (CORS roto) — corregidas al patrón de proxy.
- **B3**: reasignación de vendedor entre presupuestos. **B5**: aprobación de descuentos (`descuentoPendiente`).

## 2026-08-18 — Numeración configurable + validación de `nro`

- `nroDuplicado` conectado en los 3 puntos donde se guarda un presupuesto. Config > Empresa > Numeración (prefijo, dígitos, año, reinicio anual).

## 2026-08-19/20 — Punto E: importador Steel Measurement → Steel CRM

- Botón "⬇️ Steel CRM" en Steel Measurement (exporta `.json`). Importador en Steel CRM (`Importar.jsx`): `codigo_calculo` → append a `idsCalc`, `estado_sm` guardado aparte (no pisa el `estado` comercial real).

## 2026-08-22 — Backend Fase 0-1, launchers, PDF por bloques

- **Fase 0** (diseño de esquema): `BACKEND-COMPARTIDO.md`, ~48 tablas relevadas del código real.
- **Fase 1** (infraestructura): proyecto Supabase creado (`lnblgecgskjyulbqocet`, São Paulo), migraciones aplicadas, RLS por `tenant_id`.
- Launchers reemplazados (`.vbs` → `.ps1` + `.bat` oculto) — Windows bloqueaba VBScript.
- `pdfPresupuesto.js`: PDF con bloques configurables (`RENDER_BLOQUE`), compartido 1:1 entre Steel CRM y Steel Measurement.
- Sistema de temas (`colors.js`, `THEMES`): `industrial_dark` + `metalsales_light`.
- Config > Sistema nueva (Numeración + PDF, sacados de Empresa).
- Auditoría de UI: `Importar.jsx` reorganizado en pestañas ("Cargar datos" / "Mantenimiento").

## 2026-08-23 — Backend Fase 2-5, login real, incidentes, deploy

- **Fase 2** (`loadDB`/`saveDB`): capa de mapeo camelCase↔snake_case en los dos repos.
- **Fase 3** (dual-write): las 9 entidades principales de cada sistema sincronizan a Supabase en paralelo al guardado local.
- **Login real** (Supabase Auth) reemplaza la selección de usuario local, en los dos sistemas.
- **Fase 4** (migración de datos históricos): 619 presupuestos + 188 clientes (Steel CRM) subidos a Supabase.
- **Fase 5** (piloto, lectura desde la nube): completa las 9 entidades en Steel CRM.
- **Bug crítico, corregido el mismo día**: Fase 4 no guardaba `dbId` de vuelta en local → Fase 5 duplicaba todo en el siguiente reload (619→1237 presupuestos). Fix: `migrarTodoALaNube` devuelve `dbIds`, aplicados al estado local.
- Cotización real del BROU (scraping) reemplaza el intento fallido con `frankfurter.app` (no cubre UYU).
- PWA instalable en los dos sistemas (manifest + service worker + íconos).
- Sidebar responsiva (colapsa bajo 768px).
- Incidentes de seguridad: `service_role key` pegada por error en chat (rotada), contraseña visible en captura (reseteada) — repetido varias veces, nunca una filtración real.

## 2026-08-24 — Sub-tablas, tema "Acero", deploy, 6 rondas de bugs de esquema

- Sub-tablas de arrays cerradas (comentarios, `obra_presupuestos`, `solicitud_versiones`, documentos de fichas).
- Comentarios internos extendidos a Obras y Fichas de Aceptados; fix de sync de borrado de comentarios (no se propagaba a Supabase).
- `ids_calc` (`text[]`) sincronizado a Supabase — sin usar `presupuesto_calculo_link` a propósito (reservada para un vínculo real futuro).
- Herramientas nuevas en Importar: "Completar ID de Cálculo", borrado de comentarios.
- **Sistema visual "Acero"**: IBM Plex Sans/Mono en el tema oscuro (antes sin fuente propia), `warn` separado de `accent`, estados de presupuesto de 7 a 4 colores + ícono.
- **Deploy a Vercel** (steelcrm.vercel.app, steel-measurement.vercel.app), repos conectados a GitHub, auto-deploy en push.
- Rediseño de Obras↔Presupuesto: vínculo se hace desde el Presupuesto, no desde una lista de 1000+ botones en Obras.
- `descuentos_pendientes` deja de borrarse al resolver — queda como historial (`estado: aprobado/rechazado`).
- **6 rondas de bugs de esquema en Steel Measurement** encontradas migrando datos reales: `tc` faltante, `codigo_calculo` NOT NULL sin necesidad, biblioteca con `id` legible en vez de uuid, ids legacy no-uuid, columnas sueltas sin whitelist, `""` no convertido a `null`, `tenant_id` ambiguo con 2 cuentas.
- Borrado con contraseña + Papelera: Cómputo y Anidado (Steel Measurement) — primera vez que aparece este patrón, luego extendido.

## 2026-08-25 — Soft-delete generalizado, coordinación multi-sesión, documentación

- Soft-delete (`eliminado`/`eliminado_por`/`eliminado_fecha`) extendido a: Presupuestos, Clientes, Obras, Solicitudes, Fichas de Aceptados, Seguimientos, Historial de Interacciones, Comentarios (Steel CRM) y Presupuestos/Historial de Trabajos (Steel Measurement) — cubre prácticamente todo el sistema.
- **Reglas 7-9** formalizadas en los tres `CLAUDE.md`/`PLAN.md`: identificación de sesión, coordinación antes de tocar archivos compartidos, sync de documentación técnica con cada cambio de esquema.
- Documentación completa: `ENTIDADES-COMPARTIDAS.md`, `ARQUITECTURA-COMPARTIDA.md`, `DICCIONARIO-DATOS.md`, `INTEGRACIONES-COMPARTIDAS.md` (técnicos, en los repos); manuales de uso (Steel CRM, Steel Measurement), instalación, administrador, runbook de incidentes (entregables); ficha de producto comercial.
- Fix real: IA de Steel CRM rota en producción — 8 call-sites con `localhost:3001` hardcodeado, sin función serverless equivalente a `api/cotizacion.js`. Corregido (`api/claude.js` nuevo + hostname switch). Segundo bug encontrado de paso en `Inicio.jsx` (formato de request incorrecto), también corregido.
- Arranque de la estrategia comercial (Praxware): FODA de Praxware/Steel CRM/Steel Measurement, identidad mínima, 4 segmentos de outreach en LinkedIn.

## 2026-08-26 — Anonimización + Solicitudes: Categoría obligatoria, creado_por, y primer cruce directo Steel Measurement → Steel CRM

- Renombre de los 7 documentos técnicos (sufijo `-MMN` sacado) y limpieza de menciones a la empresa real en ~11 documentos, código fuente (`Config.jsx` de los dos sistemas, comentarios) y datos seed reales (`historialSeed.js`/`presupuestosHistoricosSeed.js`) — ver el registro de sesión para el detalle completo, no se repite acá por no ser un cambio de esquema/capacidad.
- **`solicitudes` gana `categoria` (text, lista canónica de 32, obligatoria) y `creado_por` (text, fijado una sola vez)** — Categoría viaja a Presupuestos al crear uno desde la solicitud.
- **"Crear presupuesto desde esta solicitud"**: botón nuevo, crea el presupuesto precargado y lo vincula sin esperar a "ganar".
- **Primer caso de un sistema leyendo una tabla que el otro es dueño**: Steel Measurement lee `solicitudes` (tabla de Steel CRM) directo de Supabase, filtrada por `asignado_a` — pantalla nueva "Mis solicitudes asignadas", sin export/import de archivo. Hasta ahora la única tabla verdaderamente compartida era `clientes`.
- ✅ **Bug de migración duplicada — corregido**: `steel-backend` commit `976dd10` intentaba `alter table solicitudes add column asignado_a` — esa columna ya existía desde el esquema original (2026-08-22), el `ALTER TABLE` nunca pudo haber tenido éxito. Archivo eliminado (`steel-backend` commit `ae6431a`), confirmado con Gino antes de borrar. Las otras 2 migraciones del mismo lote (`categoria`, `creado_por`) eran válidas y no se tocaron.

---

## 2026-08-29 — Vínculo real Steel Measurement → Steel CRM, sin archivo intermedio

- **`presupuesto_calculo_link` pasa de "tabla existe, sin usar" a activa** — el vínculo que se dejó a propósito sin conectar el 22/8 (ver §6 de `ENTIDADES-COMPARTIDAS.md`) se wireó: botón "☁️ Enviar a Steel CRM" en el detalle de Presupuesto de Steel Measurement crea la fila en `presupuestos_crm` y el vínculo directo por Supabase, sin `.json` de por medio.
- **Mecanismo `.json` (Punto E) dado de baja**: se sacaron `exportPresupuestoParaSteelCRM` (Steel Measurement) y el modo "Cargar desde Steel Measurement" de `Importar.jsx` (Steel CRM).
- **Límite conocido, aceptado**: el `nro` de Steel CRM creado así es provisorio (`SM-<código de cálculo>`) — el formato real vive solo en el localStorage de Steel CRM, hay que corregirlo a mano con "Corregir N° de Presupuesto".
- `BudgetModal` (Steel CRM) ahora muestra el vínculo y el estado de Steel Measurement en vivo (leído de `presupuestos_sm` vía el link), reemplaza al `estadoSM` estático para presupuestos nuevos.
- **Sin verificar en vivo todavía** — armado y verificado por build, sin login real disponible en esta sesión.

---

## 2026-08-29 — Cliente/Obra obligatorios (Steel CRM + Steel Measurement) + Obra llega a Steel Measurement

Pedido de Gino, aplicado en los dos sistemas para que tipear un cliente u
obra nuevo en un Presupuesto/Solicitud/Cómputo/Anidado nunca quede como
texto suelto ni se cree solo en silencio — siempre abre una ventana de
alta real antes de dejar guardar (o, en pantallas de autoguardado por
campo como Presupuesto de Steel Measurement, antes de "Enviar a Steel CRM").

- **Steel CRM**: `ClienteRapidoModal`/`ObraRapidaModal` nuevos en
  `shared.jsx`, wireados en `BudgetModal` (Presupuestos/Kanban/
  Seguimientos), el formulario de alta de Presupuestos.jsx y Solicitudes —
  bloquean guardar si el campo cambió y no matchea nada existente (no
  afecta presupuestos viejos sin tocar ese campo). Empresa pasa a ser
  campo propio y editable en "Crear presupuesto nuevo" y Solicitudes
  (antes se heredaba en silencio del cliente elegido).
- **Steel Measurement**: mismo mecanismo (`ClienteRapidoModal`/
  `ObraRapidaModal`/`AutocompleteObra` nuevos) en Cómputo, Anidado y
  Presupuesto — reemplaza la auto-creación silenciosa de `resolverClienteId`
  (que solo guardaba nombre+empresa, sin cargo/tel/email/zona).
- **Obra llega por primera vez a la tabla compartida `obras` desde Steel
  Measurement**: `obra_id uuid → obras` agregado a `computos`, `anidados`
  y `presupuestos_sm` (migración `20260829090000`), FK directa sin tabla
  de vínculo intermedia (a diferencia de `obra_presupuestos` en Steel CRM).
  `computos` gana además la columna `obra` (texto) — antes no distinguía
  "obra" de su propio `nombre`, ahora es un campo aparte.
- No hay auto-creación silenciosa para Obra en ningún lado — a diferencia
  de `cliente_id`, la única forma de crear una obra nueva es
  `ObraRapidaModal`.
- **Sin verificar en vivo todavía** — build limpio en los dos repos, sin
  login real disponible en esta sesión.

## 2026-08-29 — 2 bugs reales de sync entre dispositivos (Steel CRM + Steel Measurement)

Encontrados investigando un reporte real de Gino: el mismo presupuesto se
veía distinto en su PC de trabajo y su PC personal (dos presupuestos
directamente ausentes en una, un tercero con estado desactualizado).

- **Bug A — guardado que falla en silencio nunca avisa.** El dual-write a
  Supabase nunca bloquea el guardado local si falla (por diseño), pero eso
  significaba que un presupuesto podía quedar guardado solo en un
  dispositivo sin ningún aviso — invisible para cualquier otro. Fix: se
  registra el fallo en localStorage (`scrm_sync_pendientes` en Steel CRM,
  `smeas_sync_pendientes` en Steel Measurement) y se muestra un aviso con
  botón "Reintentar ahora" (Inicio en Steel CRM; arriba de la lista de
  Presupuesto en Steel Measurement, que no tiene pantalla de Inicio). Por
  ahora solo conectado a Presupuestos en los dos sistemas.
- **Bug B — Fase 5 nunca actualizaba lo ya existente.** La lectura desde
  la nube solo agregaba presupuestos nuevos — un presupuesto ya conocido
  en un dispositivo nunca se actualizaba aunque otro dispositivo lo
  hubiera editado. Fix: se agregó un trigger de `updated_at` (antes
  quedaba congelado en la fecha de creación) en `presupuestos_crm` y
  `presupuestos_sm` (migración
  `20260829140000_updated_at_trigger_presupuestos.sql`), y Fase 5 ahora
  compara esa fecha para decidir si pisar el local con la versión de la
  nube. Límite conocido y aceptado: sin resolución de conflictos real —
  si dos dispositivos editan lo mismo antes de sincronizar, gana el
  último guardado según el reloj del servidor.
- Ver detalle completo en `ENTIDADES-COMPARTIDAS.md` §7.

---

## 2026-08-29/30 — Empresa como entidad real ("igual que Cliente y Obra")

- **Tabla `empresas` nueva** (compartida Steel CRM/Steel Measurement,
  migración `20260829150000_empresas.sql`), reemplaza el texto libre que
  tenía Empresa hasta ahora en toda la plataforma. `empresa_id` agregada a
  `clientes`, `computos`, `anidados`, `presupuestos_sm` (FK directa, sin
  tabla de vínculo intermedia). `computos` gana además columna `empresa`
  (texto) — nunca la había tenido.
- Sin auto-creación silenciosa en ningún lado: la única forma de crear una
  empresa nueva es `EmpresaRapidaModal`, obligatorio (mismo cartel "no
  existe todavía" que ya tenían Cliente y Obra) en BudgetModal/
  Presupuestos/Solicitudes (Steel CRM) y Cómputo/Anidado/Presupuesto
  (Steel Measurement). Sin pantalla de administración propia — decisión
  explícita de Gino, alta solo desde el cartel por ahora.
- Migración backfillea automáticamente toda razón social ya en uso
  (`clientes`/`obras`/`presupuestos_crm`/`presupuestos_sm`/
  `historial_trabajos`) para no bloquear presupuestos/clientes existentes
  apenas alguien toque el campo.
- **Bug real encontrado y corregido de paso**: `presupuestos_sm.empresa`
  tenía columna real en la base pero nunca se sincronizaba — el campo
  local (`cliente`, no `empresa`) se descartaba explícitamente antes del
  insert. `anidados.empresa` tenía el mismo problema por faltar en el
  allowlist de columnas de `storage.js`.
- **Fix real de paso en Steel CRM**: el buscador de Cliente en "Crear
  presupuesto nuevo" (Presupuestos.jsx) tenía su propio código separado
  de `ClienteContactoField` con el mismo bug ya corregido ahí (matcheaba
  por nombre O empresa) — encontrado al revisar el reporte de Gino con
  captura real.
- Sin verificar en vivo todavía — build limpio en los dos repos.

---

## 2026-08-31 — Metas con escalones de premio (Steel CRM)

- `metas` (Steel CRM) suma `escalones` y `sobregiro` (jsonb, nullable) —
  Config > Metas gana una subsección opcional "Escalones de premio" (3
  filas Mínimo/Medio/Máximo + sobregiro solo en tipo "monto"). Bonificaciones.jsx
  deja de tener sus propios 3 escalones + sobregiro hardcodeados en
  `calcBonus()` (`utils/calculos.js`) y los lee de la meta real
  correspondiente vía nueva `calcularPremioEscalones()` — `calcBonus()`
  queda como fallback para metas sin escalones cargados, sin borrarse.
- **Fix real de paso**: el borrado de una meta (Config.jsx) nunca
  llamaba a `deleteFilaDB` — quedaba viva en Supabase y Fase 5 la volvía
  a traer en el próximo login, por eso las metas duplicadas reaparecían
  después de borrarlas. Además, Fase 5 ahora deduplica por contenido
  (`claveMeta`: tipo+período+asignación), no solo por `dbId` — dos
  dispositivos que sembraron cada uno su propio set de metas por
  defecto antes de sincronizar terminaban con dbId distinto para "la
  misma" meta, y se traían la copia del otro para siempre.
- Sin verificar en vivo — build limpio. Falta que Gino corra la
  migración, cargue escalones reales en las 3 metas desde Config, y
  confirme que Bonificaciones muestra los números correctos.

## 2026-08-31 — 2 bugs reales de datos, sin cambio de esquema

- **Steel Measurement** (`ff7d9bc`): sincronizar un presupuesto sin
  Contacto cargado escribía el nombre de la Empresa en la tabla
  `clientes` (compartida con Steel CRM) como si fuera una persona —
  contaminaba el autocompletado de Cliente en los dos sistemas. Fix
  previene que vuelva a pasar; **los registros ya contaminados en
  Supabase no se limpiaron, pendiente de decisión de Gino**. De paso,
  fix de propagación real: los tratamientos por pieza marcados en
  Cómputo no llegaban al Anidado (se perdían en el primer salto de la
  cadena Cómputo→Anidado→Presupuesto).
- **Steel CRM** (`a5bec97`): el contador local de `nro` nunca chequeaba
  contra Supabase — un choque con la restricción única de la base
  dejaba el reintento de sync repitiendo el mismo insert fallido para
  siempre. Ahora detecta el código de error `23505` y reintenta una
  vez con un `nro` nuevo.

## 2026-09-01 — Fix real: guardado sin debounce creaba clientes basura en cada tecla

- **Steel Measurement** (`7cdbe6a`): `updPres` (detalle de Presupuesto)
  disparaba `dualWritePresupuesto()` en cada `onChange` de cualquier
  campo, sin debounce — escribir en Cliente llamaba `resolverClienteId()`
  en cada tecla y creaba una fila real en `clientes` (compartida con
  Steel CRM) por cada valor intermedio sin terminar de tipear. Distinto
  del bug ya corregido en `ff7d9bc` (que solo cubría el caso sin
  Contacto) — este pasaba con cualquier valor, Contacto cargado o no.
  Gino ya había limpiado a mano las filas contaminadas encontradas por
  el bug anterior en Supabase antes de que apareciera este segundo caso.
  Fix: debounce de 800ms antes del dual-write (mismo patrón que
  `fichas_aceptados` en Steel CRM) — el guardado local sigue siendo
  instantáneo, solo el envío a Supabase espera a que el usuario deje de
  tocar el campo.

---

## Mantenimiento de este documento

Misma Regla 9 que los otros documentos compartidos, con una diferencia de
alcance: no todo commit necesita una línea acá — solo los que un cambio
formal de versión/release incluiría (nueva capacidad, cambio de esquema
significativo, fix de un bug que afectó datos reales, decisión de
arquitectura). Fixes menores de UI o redacción se quedan en el changelog
narrativo de cada repo, no acá.
