# Esquema común de frontend — Steel Platform (Steel CRM · Steel Costos · futuros módulos)

**Para:** cualquier sesión de Claude Code que construya o toque UI en
`steelcrm` o `steel-measurement`, y la referencia obligada para un futuro
módulo nuevo (Producción, Compras, Administración) antes de escribir su
primer componente.
**De:** sesión "Planeación de mejoras futuras" (Fase 1 del plan de
unificación acordado con Gino, 2026-09).
**Fecha:** 2026-09-05.
**Fuente:** comparación real de código entre los dos repos (no de memoria)
— `styles/colors.js`, `components/shared.jsx` (steelcrm) vs. los
componentes sueltos equivalentes de steel-measurement, y `storage.js` de
los dos. Complementa a `ARQUITECTURA-COMPARTIDA.md` (stack/deploy) y
`ENTIDADES-COMPARTIDAS.md` (datos) — este documento cubre **cómo se ve y
se comporta la UI**, para que un módulo nuevo no reinvente cada patrón
desde cero como pasó acá.

---

## Por qué existe este documento

Steel CRM y Steel Costos nacieron del mismo lugar y comparten backend,
pero sus interfaces divergieron con el tiempo: el mismo problema (paginar
una lista larga, confirmar un borrado con contraseña, un hilo de
comentarios, una barra de filtros, un selector con búsqueda) se resolvió
dos veces, con código distinto, en momentos distintos. No es un error —
cada app lo resolvió cuando le hizo falta — pero significa que hoy no hay
una única fuente de verdad para "cómo se ve un botón" o "cómo se pagina
una tabla" en Steel Platform.

Este documento no propone fusionar los dos frontends en un solo repo (ver
`CLAUDE.md` de la carpeta de coordinación, sección "Steel Platform —
esquema común y unificación" para esa discusión). Propone algo más chico
y accionable: **fijar, por escrito, cuál de las dos versiones ya
existentes es la canónica hacia adelante**, para que (a) un módulo nuevo
la copie desde el día uno en vez de inventar una tercera, y (b) cuando
haya tiempo de retocar CRM o Costos, se sepa hacia qué versión converger.

---

## 1. Tokens de diseño (colores, tipografía, radios)

**Ya están alineados** — `steelcrm/src/styles/colors.js` y
`steel-measurement/src/styles/colors.js` comparten los mismos dos temas
(`industrial_dark`, `metalsales_light`), los mismos valores hex para
`bg/card/iron/border/steel/steelDk/accent/text/muted/mutedL/ok/err/warn/
info/pur/gold/teal/pink`, y la misma tipografía (IBM Plex Sans/Mono). Se
mantienen sincronizados a mano entre los dos repos — **es la parte que ya
funciona bien**, no requiere ningún cambio de código.

**Canónico para un módulo nuevo**: copiar `colors.js` tal cual de
cualquiera de los dos repos como punto de partida. La clave de
`localStorage` para el tema debe ser propia de cada app (`scrm_tema`,
`smeas_tema`, y así con el nombre corto del módulo nuevo) — eso sí es
intencional, no se comparte.

**Divergencia menor, sin resolver a propósito**: cada app agregó
primitivas propias sobre la paleta base sin acordar dónde deberían vivir
(`EC` — colores por estado de presupuesto — y el helper `G()` de grid
viven en `colors.js` de steelcrm; `BTN(variant)` vive en `colors.js` de
steel-measurement, mientras que su equivalente en steelcrm es el
componente `Btn` de `shared.jsx`). No se unifica ahora — cada app sigue
agregando lo que le haga falta donde ya lo tiene, esto solo queda anotado
para que un módulo nuevo no copie la inconsistencia sin darse cuenta.

## 2. Componentes de UI — versión canónica por par duplicado

Para cada concepto que ya se resolvió dos veces, esta es la versión que
un módulo nuevo debería copiar (no la única forma correcta en absoluto —
la que ya demostró ser más robusta en producción):

| Concepto | Canónico | Por qué |
|---|---|---|
| Paginación de listas largas | `usePaginado`/`Paginador` — steelcrm (`shared.jsx`) y steel-measurement (`useSortable.js`) ya llegaron al mismo diseño por separado | Los dos convergieron solos al mismo patrón tras el mismo bug real (DOM con cientos de filas, resuelto en Steel CRM el 2026-08-30) — es señal de que el diseño es el correcto, cualquiera de las dos implementaciones sirve de referencia. |
| Barra de filtros | `FiltrosBar` (steel-measurement) | Declarativa (`campos: [{key,label,type}]`, se agrega un filtro nuevo sin tocar el componente) — gana sobre `GFilt` de steelcrm, que tiene los campos hardcodeados por nombre. |
| Selector con búsqueda/autocomplete | `Combobox` (steel-measurement) | Usa portal a `document.body`, no se recorta dentro de contenedores con scroll propio (bug real que `SearchSelect` de steelcrm no resuelve). |
| Confirmar borrado con contraseña propia | Cualquiera de los dos — mismo patrón, nombres distintos (`ConfirmModalPassword` en steelcrm, `ModalConfirmarEliminar` en steel-measurement) | Ya está documentado explícitamente en el código de steel-measurement como copia intencional del de steelcrm — no hay divergencia real de diseño, solo de nombre. |
| Comentarios internos con hilo | Depende del flujo de guardado que se quiera: `ComentariosThread` (steelcrm) persiste en dos pasos (se agrega en memoria, se guarda con el "Guardar" general del formulario); `ComentariosPanel` (steel-measurement) persiste al instante al escribir "Comentar" | No hay un ganador — son dos decisiones de UX válidas, documentadas como intencionales en el propio código de cada repo. Un módulo nuevo elige según si sus formularios ya tienen un botón "Guardar" general (usar el patrón de dos pasos) o no (usar el instantáneo). |
| Toast / aviso flotante | Depende del propósito: `ToastContainer` (steelcrm) para notificaciones genéricas; `useUndoToast` (steel-measurement) específicamente para "deshacer" un soft-delete | Cubren casos distintos, no hay overlap real que resolver. |

## 3. Patrón de persistencia (`storage.js`)

Los dos repos comparten la intención (dual-write local↔Supabase,
`tenant_id`, soft-delete) pero usan **dos mecanismos distintos según qué
tan crítico es que el dato sobreviva sin conexión**:

- **Local-first con `dbId`** (patrón de Steel CRM, y de las entidades más
  viejas de Steel Costos): el array vive primero en `localStorage`, cada
  registro guarda un `dbId` que lo referencia en Supabase, y la UI nunca
  depende de que la escritura remota haya terminado. Es el patrón probado
  bajo bugs reales de producción (duplicación de Fase 4, timing de Fase
  5) — **usar este patrón para cualquier dato que un usuario carga en el
  momento y necesita que sobreviva un corte de conexión o una demora de
  red** (presupuestos, solicitudes, seguimientos — el tipo de dato de un
  vendedor en movimiento).
- **Hooks directos a Supabase, sin `dbId`** (patrón de las funciones más
  nuevas de Steel Costos — biblioteca de materiales, tarifario): la UI
  lee/escribe directo contra Supabase vía un hook suscribible, sin capa
  intermedia en `localStorage`. Es más simple de mantener, pero asume que
  el usuario está siempre online — **usar este patrón solo para
  catálogos internos de uso interno** (listas de precios, biblioteca de
  materiales — datos que un usuario consulta, no que carga bajo presión
  en el momento).

**No es una decisión pendiente de resolver — es una elección consciente
según el tipo de dato.** Un módulo nuevo debería preguntarse, por cada
entidad que agregue: ¿este dato lo carga alguien que puede estar sin
conexión (vendedor, operario en planta) o es un catálogo de consulta
siempre-online? Esa respuesta define qué patrón de los dos usar.

## 4. Control de acceso por módulo

Ver el cambio de esta misma Fase 1: `acceso_crm`/`acceso_costos`
(booleanos hardcodeados) pasan a un modelo extensible
(`modulos_habilitados`) — un módulo nuevo (Producción, Compras,
Administración) se agrega ahí, sin tener que tocar el gate de login ni el
formulario de Config de los módulos ya existentes.

---

## Cómo usar este documento

No es un estándar impuesto retroactivamente — CRM y Costos siguen
funcionando como están, no se migran a la fuerza para converger hacia
esta tabla. Se usa así:
- **Módulo nuevo**: arranca copiando la columna "Canónico" de la tabla de
  arriba, y decide el patrón de persistencia de cada entidad nueva según
  la pregunta de la sección 3.
- **Retoque futuro de CRM o Costos**: si se va a tocar un componente que
  aparece en la tabla de arriba por otro motivo, es la oportunidad de
  converger hacia el canónico — no antes, no como tarea aislada.
