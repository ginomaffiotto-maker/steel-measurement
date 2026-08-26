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

## 2026-08-02 — steelCRM: control de versiones

- `git init` en steelCRM (no existía hasta esta fecha). Eliminado código muerto (`Cerebro.jsx`).

## 2026-08-05 — steelCRM: Prioridad A del roadmap completa

- Agendar seguimiento desde Kanban/Presupuesto, último contacto en cards, color de urgencia por inactividad, mini-alarmas en Kanban, vista móvil (lista en vez de drag & drop).

## 2026-08-06 — Taxonomía compartida

- Campo "Categoría" en Presupuestos (steelCRM), reemplaza el `tipo` genérico de 10 valores. Fuente canónica: las 32 Categorías de Predictor Eq v25 (`TAXONOMIA-COMPARTIDA.md`).

## 2026-08-14 — steelCRM: preparación de carga histórica

- Fix de `Importar.jsx` para datos reales de `presupuestos_v28.xlsm` (614 presupuestos + 186 contactos). Campo `recotizacionDe` nuevo — las recotizaciones venían como filas nuevas, no cambios de estado.

## 2026-08-16 — `idsCalc`, fix de IA rota, B3/B5

- **`idCalc` (string) → `idsCalc` (array)** — un presupuesto puede tener varios códigos de cálculo.
- Fix: `Calculadora.jsx`/`Competencia.jsx` llamaban directo a `api.anthropic.com` desde el browser (CORS roto) — corregidas al patrón de proxy.
- **B3**: reasignación de vendedor entre presupuestos. **B5**: aprobación de descuentos (`descuentoPendiente`).

## 2026-08-18 — Numeración configurable + validación de `nro`

- `nroDuplicado` conectado en los 3 puntos donde se guarda un presupuesto. Config > Empresa > Numeración (prefijo, dígitos, año, reinicio anual).

## 2026-08-19/20 — Punto E: importador Steel Measurement → steelCRM

- Botón "⬇️ steelCRM" en Steel Measurement (exporta `.json`). Importador en steelCRM (`Importar.jsx`): `codigo_calculo` → append a `idsCalc`, `estado_sm` guardado aparte (no pisa el `estado` comercial real).

## 2026-08-22 — Backend Fase 0-1, launchers, PDF por bloques

- **Fase 0** (diseño de esquema): `BACKEND-COMPARTIDO.md`, ~48 tablas relevadas del código real.
- **Fase 1** (infraestructura): proyecto Supabase creado (`lnblgecgskjyulbqocet`, São Paulo), migraciones aplicadas, RLS por `tenant_id`.
- Launchers reemplazados (`.vbs` → `.ps1` + `.bat` oculto) — Windows bloqueaba VBScript.
- `pdfPresupuesto.js`: PDF con bloques configurables (`RENDER_BLOQUE`), compartido 1:1 entre steelCRM y Steel Measurement.
- Sistema de temas (`colors.js`, `THEMES`): `industrial_dark` + `metalsales_light`.
- Config > Sistema nueva (Numeración + PDF, sacados de Empresa).
- Auditoría de UI: `Importar.jsx` reorganizado en pestañas ("Cargar datos" / "Mantenimiento").

## 2026-08-23 — Backend Fase 2-5, login real, incidentes, deploy

- **Fase 2** (`loadDB`/`saveDB`): capa de mapeo camelCase↔snake_case en los dos repos.
- **Fase 3** (dual-write): las 9 entidades principales de cada sistema sincronizan a Supabase en paralelo al guardado local.
- **Login real** (Supabase Auth) reemplaza la selección de usuario local, en los dos sistemas.
- **Fase 4** (migración de datos históricos): 619 presupuestos + 188 clientes (steelCRM) subidos a Supabase.
- **Fase 5** (piloto, lectura desde la nube): completa las 9 entidades en steelCRM.
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

- Soft-delete (`eliminado`/`eliminado_por`/`eliminado_fecha`) extendido a: Presupuestos, Clientes, Obras, Solicitudes, Fichas de Aceptados, Seguimientos, Historial de Interacciones, Comentarios (steelCRM) y Presupuestos/Historial de Trabajos (Steel Measurement) — cubre prácticamente todo el sistema.
- **Reglas 7-9** formalizadas en los tres `CLAUDE.md`/`PLAN.md`: identificación de sesión, coordinación antes de tocar archivos compartidos, sync de documentación técnica con cada cambio de esquema.
- Documentación completa: `ENTIDADES-COMPARTIDAS.md`, `ARQUITECTURA-COMPARTIDA.md`, `DICCIONARIO-DATOS.md`, `INTEGRACIONES-COMPARTIDAS.md` (técnicos, en los repos); manuales de uso (steelCRM, Steel Measurement), instalación, administrador, runbook de incidentes (entregables); ficha de producto comercial.
- Fix real: IA de steelCRM rota en producción — 8 call-sites con `localhost:3001` hardcodeado, sin función serverless equivalente a `api/cotizacion.js`. Corregido (`api/claude.js` nuevo + hostname switch). Segundo bug encontrado de paso en `Inicio.jsx` (formato de request incorrecto), también corregido.
- Arranque de la estrategia comercial (Praxware): FODA de Praxware/steelCRM/Steel Measurement, identidad mínima, 4 segmentos de outreach en LinkedIn.

---

## Mantenimiento de este documento

Misma Regla 9 que los otros documentos compartidos, con una diferencia de
alcance: no todo commit necesita una línea acá — solo los que un cambio
formal de versión/release incluiría (nueva capacidad, cambio de esquema
significativo, fix de un bug que afectó datos reales, decisión de
arquitectura). Fixes menores de UI o redacción se quedan en el changelog
narrativo de cada repo, no acá.
