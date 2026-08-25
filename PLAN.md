# STEEL MEASUREMENT — PLAN MAESTRO Y CONTEXTO

> Historial de sesiones anterior al 2026-08-23 (§9.5–§9.30) archivado en [`PLAN-HISTORIAL.md`](./PLAN-HISTORIAL.md) — 2026-08-24, para bajar el tamaño de este archivo.
*Documento de referencia para continuar el desarrollo en nuevas sesiones*
*Última actualización: 2026-08-23*

---

## 1. QUÉ ES ESTE PROYECTO

**Steel Measurement** es el módulo de ingeniería de presupuestación de **Montajes Núñez (MMN)**, una metalúrgica en Uruguay. Reemplaza planillas Excel de cómputo de materiales, anidado/optimización de corte y presupuestación industrial.

Es parte de **Steel Platform** — cuando madure, se vende como módulo de SteelCRM a otras metalúrgicas de LATAM. Por eso debe ser configurable: no todo lo que usa MMN lo usan otras metalúrgicas.

**Repositorio:** `C:\Users\Gino\Documents\steel-measurement\`
**Stack:** React 19 (CRA) + JavaScript puro, sin TypeScript
**Persistencia:** localStorage (fase 1) → Supabase (fase 2)
**UI:** Dark theme custom, sin librería de componentes

---

## 2. SISTEMA DE COLORES Y HELPERS

**Archivo:** `src/styles/colors.js`

```js
C.bg      = "#0d0f12"   // fondo general
C.card    = "#13161c"   // fondo tarjetas
C.iron    = "#1e2330"   // fondo inputs y filas hover
C.border  = "#252a36"   // bordes
C.steel   = "#8fa3b8"   // texto secundario gris azulado
C.steelDk = "#4a5568"   // steel más oscuro
C.accent  = "#e85d04"   // naranja — color primario
C.text    = "#d4dde8"   // texto principal
C.muted   = "#6b7a90"   // texto apagado
C.mutedL  = "#8fa3b8"   // muted claro
C.ok      = "#2ea043"   // verde — éxito / kg útiles
C.err     = "#d73a49"   // rojo — error / eliminar
C.warn    = "#f0a500"   // amarillo — advertencia / arenado
C.info    = "#1f6feb"   // azul — perfiles lineales
C.pur     = "#8b5cf6"   // violeta — anidado / incidencia
C.gold    = "#c9a84c"   // dorado — tipo de cambio / UYU
C.teal    = "#0d9488"   // verde azulado — superficies m²
C.pink    = "#ec4899"   // rosa (uso futuro)
```

**Helpers de estilo disponibles:**
- `BDG(color, sm)` — badge coloreado (sm=true para pequeño)
- `BTN(variant)` — botón (variants: "primary", "ghost", "ok", "danger")
- `INP` — estilo input
- `LBL` — estilo label
- `TH` / `TD` — celdas de tabla
- `CARD(accentColor)` — card container

**Helpers de número:**
- `n2(v)` — dos decimales
- `n3(v)` — tres decimales
- `uid()` — ID único (Date.now base36 + random)

---

## 3. ARQUITECTURA DE ARCHIVOS

```
src/
├── App.js                          ← Router principal, sidebar, setTab
├── styles/
│   └── colors.js                   ← Paleta + helpers de estilo
├── utils/
│   ├── storage.js                  ← loadLS / saveLS (localStorage wrappers)
│   └── seedTestData.js             ← 🧪 Botón "Seed datos prueba" (dev only)
└── components/
    ├── BibliotecaMateriales.jsx    ← M1 ✅ COMPLETO
    ├── Computo.jsx                 ← M2 ✅ COMPLETO (actualizado 2026-07-24)
    ├── Anidado.jsx                 ← M3 ✅ COMPLETO (actualizado 2026-07-24)
    ├── Presupuesto.jsx             ← M4 ✅ COMPLETO (construido, ver notas abajo)
    ├── Historial.jsx               ← M5 ✅ COMPLETO (construido, ver notas abajo)
    └── ConfirmarEliminar.jsx       ← modal de confirmación compartido
```

> ⚠️ Esta sección estuvo desactualizada entre el 2026-06-19 y el 2026-07-31: M4 y M5
> se construyeron sin que el plan se actualizara. Antes de asumir que algo está
> "pendiente" según este documento, verificar contra el código real.

**Navegación:** `App.js` maneja `setTab(tabName)`. Para ir de Cómputo a Anidado: `saveLS("smeas_anidar_pending", computoId)` + `setTab("anidado")`.

---

## 4. MÓDULOS CONSTRUIDOS

### M1 — BIBLIOTECA ✅
**localStorage keys:** `smeas_perfiles`, `smeas_planchuelas`, `smeas_planchas`

**Estructura perfil:**
```js
{ id, nombre, cat, kg_m, sup, largo }
// sup = m²/m de superficie (para arenado)
// largo = largo comercial en metros (ej: 12)
```

**Estructura plancha:**
```js
{ id, nombre, espesor, kg_m2, largo_mm, ancho_mm, kg_ud }
// largo_mm/ancho_mm = dimensiones de la plancha comercial (ej: 6000×1500)
```

Tiene 50+ perfiles precargados. Precio USD/kg configurable por perfil.

---

### M2 — CÓMPUTO ✅ (reescrito 2026-06-19)
**localStorage key:** `smeas_computos`

**Estructura computo:**
```js
{
  id, nro,        // "C-001"
  nombre,         // "Nave Industrial CCFC"
  fecha,          // "2026-06-19"
  tc: 40,         // tipo de cambio USD/UYU (NUEVO)
  items: [...]
}
```

**Estructura ítem:**
```js
{ id, titulo, cantidad, n_plano, piezas: [...] }
// cantidad = unidades a fabricar (multiplica todos los pesos)
```

**Estructura pieza:**
```js
{
  id, tipo,                // "perfil" o "plancha"
  material_id, material_nombre,
  kg_m, sup_m2m,           // para perfiles
  largo_mm_input,          // largo de corte en mm (perfiles)
  largo_mm, ancho_mm, kg_m2, // para planchas
  cantidad,
  ficha: {                 // metadatos por pieza
    granallado: false, pct_granallado: 100,   // % superficie a granallar
    pintura: false, pct_pintura: 100,         // % superficie a pintar
    corte_maquina: false, maquina: "",        // máquina: "Plasma / Pantógrafo" | "Láser" | "Oxicorte" | etc.
    precio_raw: "",        // precio en la moneda seleccionada
    precio_por: "kg",      // "kg" | "m" | "m2"
    moneda: "USD",         // "USD" o "UYU"
    proveedor: "",         // nombre del proveedor cotizante
    fecha_precio: "",      // fecha de la cotización (ISO date)
    obs: ""
  }
  // Nota backward compat: FichaDrawer migra arenado→granallado y pct_arena→pct_granallado automáticamente
}
```

**UX implementada:**
- Sin obra seleccionada → grid full-width de tarjetas de obra con kg, m², ítems
- Con obra seleccionada → breadcrumb + encabezado con TC editable + ítems en acordeón colapsable
- Botón ⚙ por pieza → FichaDrawer lateral con: granallado (% sup), pintura (% sup), corte de máquina (selector de máquina), precio (por kg/m/m², USD/UYU, proveedor, fecha cotización). Muestra precio precargado de biblioteca como referencia.
- TC (tipo de cambio) en el encabezado del cómputo, usado en las fichas para conversión

---

### M3 — ANIDADO ✅ (actualizado 2026-06-19)
**localStorage key:** `smeas_anidados`

**Estructura anidado:**
```js
{
  id, nombre, fecha,
  grupos: [
    {
      id, tipo,           // "perfil" o "plancha"
      material_id, material_nombre,
      kg_m,               // perfiles: kg/metro
      largo_barra_mm,     // perfiles: largo barra comercial
      kerf_mm,            // perfiles: espesor de corte
      kg_m2,              // planchas: kg/m²
      sheet_w, sheet_h,   // planchas: dimensiones plancha (mm)
      piezas: [...],
      resultado: null | { barras/hojas, resumen }
    }
  ]
}
```

**Algoritmos:**
- **1D FFD** (`runFFD`): First Fit Decreasing para perfiles lineales. Kerf incluido. Retorna barras con posiciones y resumen (b_util, b_desp, b_total, m_util, m_desp, kg_util, kg_desp, kg_total, pct_desp).
- **2D Shelf-FFD** (`run2DFFD`): Shelf-based para planchas. Prueba ambas orientaciones. Retorna hojas con estantes y resumen (n_hojas, area_util_m2, area_total_m2, area_desp_m2, pct_util, pct_desp).

**UX implementada:**
- Vista colapsada por grupo: fila resumen con métricas clave + botón Calcular
- Después de calcular: botón verde ✓, grupo se colapsa automáticamente
- Si se edita una pieza: resultado se limpia, botón vuelve a naranja
- Incidencia % de cada material respecto al total de la obra
- SVG visualización de barras (1D) y planchas (2D) en vista expandida
- Export lista de corte (.txt)
- Auto-import desde Cómputo via `smeas_anidar_pending` localStorage key

---

## 5. LO QUE APRENDIMOS DE LAS PLANILLAS Y EL SISTEMA ACTUAL

### STILER — Vigas Conformadas y Platinas (Excel)
Planilla para cliente específico. Usa pesos en **UYU con conversión a USD via TC**. Estructura por ítem:

1. HIERROS (pieza a pieza, con toggle ARENA? SI/NO por pieza)
2. MATERIALES EN GENERAL (bulones, electrodos, consumibles)
3. TRATAMIENTO DE SUPERFICIES (pinturas por litros/manos + arenado en m²)
4. MO FABRICACIÓN (horas × categoría × tarifa $)
5. MO MONTAJES (ídem, tarifas distintas)
6. HORAS ESPECIALES (nocturnas +25%, extras +100%, lluvia +20%)
7. TERCERIZACIONES FAB
8. TERCERIZACIONES MON
9. TRASLADOS

Hoja DATOS: tarifario completo (materiales, MO, tratamientos, tercerizadas).

### GestSoft — "Registro Digital de Documentos V1.0"
Sistema desktop actual (parece Delphi). **El core de presupuestación de MMN.** Hallazgos clave:

**Arquitectura:** Solicitudes → Presupuestos → Ítems (multi-pestaña, multi-rubro)

**Rubros por ítem (9 pestañas):**
1. **Item Hierro** — chapas/perfiles con área, kg, USD/kg, desperdicio %, m² arenado/pintura
2. **Materiales Generales** — bulones, consumibles (precio USD, cantidad, kg)
3. **M.O. Fabricación** — USD/hora directo, categorías: dibujante/peón/½ oficial/oficial/supervisor, tipo: hora común/hora extra (extra = naranja). Muestra HRS totales, KG/HORA
4. **M.O. Montajes** — ídem con tarifas distintas. Campo "Cantidad de Funcionarios"
5. **Terc. Fabricación** — roscados, galvanizado, etc. (costo USD, cantidad, unidad, subtotal)
6. **Terc. Montajes** — grúas ($/hora), hidrogrúa, brazo boom ($/mes), prevencionista, transporte
7. **Trat. Superficie** — pinturas: USD/litro, cant. litros, cant. manos, total. Arenado en m² separado. Checkbox Galv. Caliente.
8. **Traslados** — chatas, traslados, transporte MN (USD, cantidad, subtotal)
9. **Corte Pantógrafo** — USD/kg × total kg (rubro propio, no dentro de tercerizaciones)

**+ campos del presupuesto general:**
- Negociación (% o USD fijo)
- Interés Financiero (% para N días de plazo, ej: 120 días USD → 2.20%)
- "No Agrega KG al Presupuesto" checkbox por ítem
- Clonar presupuesto (función fundamental)
- Categoría por ítem con benchmark **Min/Prom/Max USD/kg** histórico en tiempo real

**Reporte por presupuesto:**
- Desglose % por rubro con barras horizontales: Hierros 20.59%, MO Fab 36.31%, MO Mon 18.07%, Terc.Mon 7.19%, Trat.Sup 6.50%, Corte Pant 8.06%, etc.
- USD/kg por rubro
- Total horas FAB (oficial/med.of/ayud) y MON, con KG/HORA fab y mon

**Decisiones confirmadas:**
- **MO en USD/hora directamente** (no en pesos como STILER — GestSoft usa USD)
- **TC USD/UYU** editable por cómputo/presupuesto, por defecto 40
- **Moneda por elemento** (USD default, opción UYU en cada ficha)

---

## 6. MÓDULO 4 — PRESUPUESTO ✅ CONSTRUIDO (verificado 2026-07-31)

**Estado real:** lista de presupuestos, formulario, ítem con las 9 pestañas
(Hierros, Mat.General, MO Fab, MO Mon, H.Especiales, Terc.Fab, Terc.Mon,
Trat.Sup, Corte Panto), negociación (%/USD) e interés financiero, campo
`clonado_de` presente en el modelo de datos.

**Pendiente de confirmar/verificar** (no se encontró evidencia en el código):
- Botón "Clonar presupuesto" conectado en la UI (el campo `clonado_de` existe
  en el modelo, pero no se confirmó una acción de clonado en `Presupuesto.jsx`)
- Exportación a PDF del presupuesto (no se encontró `jsPDF` ni lógica de export)
- Validar que los cálculos numéricos (6.2/6.3 abajo) coincidan exactamente con
  lo implementado — la spec de abajo es la de diseño original, no una
  transcripción del código actual

La estructura de datos y fórmulas de las secciones 6.1–6.4 siguientes son la
spec de diseño original (2026-06-19). Usar como referencia, pero contrastar
contra `Presupuesto.jsx` si hay dudas de comportamiento exacto.

### 6.0 (spec de diseño original — histórico)

### 6.1 Estructura de datos

```js
// Presupuesto
{
  id, nro,                    // "P-001"
  nombre,                     // "Pérgola SACEEM"
  fecha,
  cliente,
  contacto,
  obra,
  detalle,
  tipo_trabajo,               // "Fabricación" | "Montaje" | "Fab+Mont"
  tc: 40,                     // USD/UYU
  estado,                     // "borrador" | "enviado" | "aprobado" | "rechazado"
  categoria_id,               // ref a categoria del historial
  clonado_de: null,           // id del presupuesto origen si es clon
  negociacion_pct: 0,
  negociacion_usd: 0,
  interes_pct: 0,
  interes_dias: 30,
  items: [...],
  notas: ""
}

// Ítem del presupuesto
{
  id, titulo,
  cantidad: 1,                // multiplicador (ej: 3 portones iguales)
  n_plano: "",
  categoria_id: "",           // para benchmark Min/Prom/Max
  no_agrega_kg: false,        // ítems de montaje puro
  computo_id: "",             // vínculo opcional al M2 (null = ingreso manual)

  hierros: [                  // origen: importado de M2 o manual
    {
      id, nombre, cantidad, usd_kg, kg_pieza, area_pieza_m2,
      largo_mm, ancho_mm,
      subtotal_m2, subtotal_kg, subtotal_usd,
      arena: false            // toggle arenado por pieza (del M2 si existe)
    }
  ],
  mat_generales: [
    { id, nombre, cantidad, m2_unit, kg_unit, usd_unit, subtotal_usd }
  ],
  mo_fabricacion: [
    {
      id, categoria,          // "OFICIAL FAB" | "1/2 OFICIAL FAB" | "PEON FAB" | "SUPERVISOR" | "DIBUJANTE"
      tipo_hora,              // "comun" | "extra"
      usd_hora, cant_horas,
      tarea, detalle,
      subtotal_usd
    }
  ],
  mo_montajes: [
    {
      id, categoria,          // "OFICIAL MON" | "1/2 OFICIAL MON" | "PEON MON" | "SUPERVISOR MON"
      tipo_hora,
      usd_hora, cant_horas,
      tarea, detalle,
      subtotal_usd
    }
  ],
  horas_especiales: [
    { id, tipo, cant_horas, cant_func, pct_adicional, subtotal_usd }
  ],
  terc_fabricacion: [
    { id, nombre, empresa, cantidad, unidad, usd_unit, subtotal_usd, detalle }
  ],
  terc_montajes: [
    { id, nombre, empresa, cantidad, unidad, usd_unit, subtotal_usd, detalle }
  ],
  trat_superficie: {
    pinturas: [
      { id, nombre, usd_lt, cant_lt, cant_manos, subtotal_usd }
    ],
    arenado_m2: 0,            // viene del sum de hierros con arena=true
    arenado_usd_m2: 10,       // tarifa configurable
    galvanizado: false
  },
  traslados: [
    { id, nombre, cantidad, unidad, usd_unit, subtotal_usd, detalle }
  ],
  corte_pantografo: [
    { id, nombre, usd_kg, kg, subtotal_usd, detalle }
  ]
}
```

### 6.2 Cálculos por ítem

```
total_hierros_usd   = Σ hierros.subtotal_usd
total_mat_gen_usd   = Σ mat_generales.subtotal_usd
total_mo_fab_usd    = Σ mo_fabricacion.subtotal_usd + horas_especiales_fab
total_mo_mon_usd    = Σ mo_montajes.subtotal_usd + horas_especiales_mon
total_terc_fab_usd  = Σ terc_fabricacion.subtotal_usd
total_terc_mon_usd  = Σ terc_montajes.subtotal_usd
total_trat_usd      = Σ pinturas.subtotal_usd + arenado_m2 * arenado_usd_m2
total_traslados_usd = Σ traslados.subtotal_usd
total_panto_usd     = Σ corte_pantografo.subtotal_usd

total_item_usd      = suma de todos los rubros * cantidad_item
total_kg_item       = Σ hierros.subtotal_kg * cantidad_item   (si no_agrega_kg=false)
usd_kg_item         = total_item_usd / total_kg_item

horas_fab_total     = Σ mo_fabricacion.cant_horas
horas_mon_total     = Σ mo_montajes.cant_horas
kg_hora_fab         = total_kg_item / horas_fab_total
kg_hora_mon         = total_kg_item / horas_mon_total
```

### 6.3 Cálculo del presupuesto general

```
total_items_usd       = Σ items.total_item_usd
total_kg              = Σ items.total_kg_item
negociacion_usd       = negociacion_pct * total_items_usd / 100 (o manual)
interes_usd           = interes_pct * (total_items_usd - negociacion_usd) / 100
TOTAL_PRESUPUESTO_USD = total_items_usd - negociacion_usd + interes_usd
USD_KG                = TOTAL_PRESUPUESTO_USD / total_kg
```

### 6.4 UX del módulo

**Vista lista presupuestos:**
- Grid/tabla con: N°, cliente, obra, tipo, fecha, USD/kg, total kg, total USD, estado (badge color), asignado
- Filtros: por estado, por período, por tipo
- Contador de estados en la cabecera (similar a GestSoft)
- Botón "Clonar" por presupuesto

**Vista presupuesto individual:**
- Encabezado: cliente, contacto, obra, detalle, tipo trabajo, TC, estado, N°, fecha, negociación, interés
- Lista de ítems con totales (kg, USD, USD/kg por ítem)
- Botón "Agregar ítem" con opción: "Desde cómputo" o "Manual"
- Al final: resumen global USD, kg, USD/kg + si hay negociación/interés → total con y sin

**Vista ítem individual (expansión / modal / página propia):**
- 9 pestañas: Hierros | Mat.General | MO Fab | MO Mon | H.Especiales | Terc.Fab | Terc.Mon | Trat.Sup | Corte Panto
- Cada pestaña: tabla editable + totales de esa sección
- Panel inferior siempre visible: totales por rubro con barras % horizontales + USD/kg global del ítem
- Benchmark: si la categoría tiene historial, muestra Min/Prom/Max en verde/amarillo/rojo

**Tarifario configurable (en Sistema o Biblioteca):**
- Tarifas MO: USD/hora por categoría (OFICIAL FAB, ½ OFICIAL FAB, PEON FAB, etc.)
- Tarifas arenado: USD/m² por grado
- Tarifas tercerizadas comunes: galvanizado $/kg, corte pantógrafo $/kg, grúas $/hora
- Traslados: gasoil $/lt, peajes $/u, viáticos $/persona

### 6.5 Importar hierros desde M2

Cuando el ítem tiene `computo_id` y el usuario elige "Desde cómputo":
1. Se cargan los ítems del cómputo referenciado
2. El usuario selecciona qué ítems incluir
3. Las piezas se mapean a filas de hierros: `nombre = material_nombre`, `kg_pieza`, `cantidad`, `largo_mm/ancho_mm`
4. Si la pieza tiene `ficha.arenado = true` → se marca `arena = true` en la fila de hierros
5. Si la pieza tiene `ficha.precio_raw` → se usa como `usd_kg`
6. Los hierros importados son editables (el usuario puede ajustar precio, etc.)
7. Posibilidad de re-importar (actualiza, no duplica)

---

## 7. MÓDULO 5 — HISTORIAL ✅ CONSTRUIDO (verificado 2026-07-31)

**Estado real:** vista lista/detalle/benchmark, filtros por categoría y rango
de kg, `calcBenchmark()` (Min/Prom/Max por categoría) ya conectado y consumido
desde el flujo de Presupuesto (comentario en el código: "Mismos 9 rubros que
calcPresupuesto() en Presupuesto.jsx — así el benchmark...").

**Pendiente de confirmar:** si los 33+ trabajos reales de MMN mencionados
abajo ya están cargados como seed, o si la tabla arranca vacía.

**Propósito:** Base de datos de trabajos ejecutados. Alimenta el benchmark Min/Prom/Max del M4.

**Estructura trabajo histórico:**
```js
{
  id, nro_ot, fecha,
  cliente, obra, categoria,
  tipo_trabajo,            // "Fabricación" | "Montaje" | "Fab+Mont"
  kg_total, metros_total,
  usd_total,
  usd_kg_real,
  desglose_pct: {          // % real por rubro (post-obra)
    hierros, mat_gen, mo_fab, mo_mon,
    terc_fab, terc_mon, trat_sup, traslados, corte_panto
  },
  horas_fab_est, horas_fab_real,
  horas_mon_est, horas_mon_real,
  kg_hora_fab_est, kg_hora_fab_real,
  kg_hora_mon_est, kg_hora_mon_real,
  negociacion_pct,
  dias_obra,
  notas
}
```

33+ trabajos reales de MMN para cargar como datos seed.

**UX:**
- Tabla filtrable por: categoría, cliente, período, rango de kg
- Gráficos de tendencia USD/kg por categoría
- Benchmark exportable / consultable desde M4 en tiempo real

---

## 8. PRINCIPIOS DE DISEÑO PARA OTRAS METALÚRGICAS

Steel Measurement no puede ser un fork de MMN. Para que sea vendible:

1. **Rubros activables por empresa** — una metalúrgica sin obra desactiva MO Mon, Terc.Mon, Traslados
2. **Tarifario propio** — cada empresa carga sus USD/hora, precios de superficie, tercerizadas
3. **Categorías abiertas** — no hardcodeadas. Cada empresa crea las suyas
4. **Benchmark propio** — se construye con el historial de cada empresa
5. **Nombre de rubros editable** — "Corte Pantógrafo" puede llamarse "Corte Láser" en otra empresa
6. **Moneda base configurable** — aunque el default es USD, puede ser EUR u otra

---

## 9. PRÓXIMOS PASOS — ORDEN DE CONSTRUCCIÓN (revisado 2026-07-31)

M1–M5 están construidos (ver notas de verificación en secciones 4, 6 y 7).
Lo que queda pendiente, por orden sugerido:

### Deuda técnica / preparación para backend (antes de seguir sumando módulos)
- [x] **2026-07-31** Centralizado `uid()` en `src/utils/storage.js`, ahora usa
      `crypto.randomUUID()` (con fallback) en vez del `Date.now()+random`
      duplicado en 6 archivos. Reduce riesgo de colisión entre sesiones/
      dispositivos concurrentes de cara a multi-usuario real con Supabase.
- [x] **2026-07-31** Agregados `created_at`/`updated_at` a las 5 entidades de
      nivel superior (Presupuesto, Trabajo histórico, Cómputo, Anidado, Ítem
      de Biblioteca) vía helpers `stamp()` (al crear) y `touch()` (al
      actualizar), ambos en `src/utils/storage.js`. Aplicado en el único
      punto de creación y el único punto de actualización de cada entidad
      (`iPresupuesto`/`updPres`, `iTrabajo`/upd, `computoVacio`/
      `updateComputo`, creación de anidado/`upd`, los 4 `item = {...}` de
      Biblioteca/`actualizar`). No cubre timestamps en sub-filas dentro de
      un ítem (hierros, MO, piezas, etc.) — se consideró alcance excesivo
      para el valor que aporta hoy.

### Regresión en navegador — 2026-07-31 (creado/editado un registro de prueba
### en cada módulo, verificado localStorage, borrado al terminar):
- **Biblioteca**: creación OK (`id` UUID, `created_at`/`updated_at` correctos).
  El guardado de "🔧 Datos técnicos" (editar ancho/espesor/nombre de un
  material existente) usa `window.confirm()`, que este navegador de pruebas
  suprime automáticamente (devuelve `false`) — **no se pudo verificar ese
  flujo por UI**. Sí se verificó `touch()` vía "Registrar precio" (no usa
  confirm): `updated_at` avanza correctamente.
  → **Corrección a una afirmación anterior**: dije que el bug de `largo` en
  planchuela causaba pérdida de datos al editar. Releyendo el código con más
  cuidado, `actualizado` arranca como `{...mat}` (copia completa), así que
  `largo` ya se preservaba aunque no estuviera en el merge final — el warning
  de eslint era sobre una variable local sin usar, no una pérdida de datos
  real. El fix que apliqué es inofensivo pero no corregía un bug funcional
  como afirmé.
  → **Hallazgo nuevo**: `window.confirm()` en `BibliotecaMateriales.jsx`
  (guardar datos técnicos línea ~717, eliminar material línea ~753) y en
  `Computo.jsx` (eliminar ítem línea ~901) contradice la convención de
  steelCRM ("sin window.confirm, usar ConfirmModal unificado") y además
  **bloquea las pruebas automatizadas** en este navegador. No se tocó — es
  una decisión de si migrar a `ModalConfirmarEliminar` (ya existe en el
  proyecto y se usa en otros lados).
- **Cómputo**: creación y edición (cantidad_total) OK, `id` UUID,
  `created_at` fijo / `updated_at` avanza correctamente.
- **Anidado**: creación y edición (agregar grupo) OK, mismos checks OK.
- **Historial**: creación OK con timestamps correctos. **Hallazgo nuevo**:
  no existe ninguna forma de editar un trabajo histórico ya creado — la
  vista detalle (`DetalleTrabajo`) es 100% de solo lectura, sin un solo
  campo editable. Solo se puede crear y eliminar. La función `upd`/`touch()`
  está en el código pero es inalcanzable desde la UI actual.

### Verificado 2026-07-31:
- [x] **Clonar presupuesto** — implementado 2026-07-31. Botón 📋 en cada fila
      de la lista (`clonarPres` en `Presupuesto.jsx`): deep-copy del
      presupuesto, `id` nuevo, `nro` autogenerado, `estado` reseteado a
      "borrador", `clonado_de` = id del original, `created_at/updated_at`
      nuevos. La vista detalle muestra "📋 clonado de {nro origen}" resuelto
      contra la lista. Probado en navegador: crear → cambiar estado a
      Aprobado → clonar → confirma nro correlativo, estado vuelve a
      Borrador, referencia al original se resuelve bien.
- [x] **Exportación a PDF** — implementada 2026-08-16 (23:40, fuera de esta
      sesión de trabajo — ver §9.22 para el detalle y la corrección de
      estado). `src/utils/pdfPresupuesto.js`, botón "🖨️ PDF" en
      `Presupuesto.jsx`. Corresponde a D1 de steelCRM (mismo template
      compartido entre los dos repos).
- [x] **Backup manual (exportar/importar)** — implementado 2026-07-31.
      Botón "⬇️ Backup" (visible a todos) descarga un .json con todas las
      claves `smeas_*` de localStorage. Botón "⬆️ Restaurar" (solo
      admin/supervisor, vía `puedeEliminar`) sube un .json y pide contraseña
      de Administrador antes de sobreescribir todo (reusa
      `ModalConfirmarEliminar` con nuevo prop `verbo`, evita `window.confirm`
      a propósito por el problema ya documentado arriba). Helpers en
      `src/utils/storage.js`: `exportBackup()`, `parseBackup()`,
      `restoreBackup()`. Probado en navegador de punta a punta: marcador de
      datos → export → restore con archivo simulado → contraseña admin →
      confirmar → reload → dato restaurado correctamente. Sigue siendo
      backup **manual** (opción A del roadmap) — falta backup automático a
      Google Drive (opción B) o backend real (opción C, fase 2).
- [x] **Seed de trabajos históricos reales** — 2026-07-31. La cifra "33+" del
      plan original estaba desactualizada: la planilla real
      (`Datos de fabricación.xlsx`, compartida por Gino) tiene **32
      categorías y ~314 filas de trabajos reales (2017-2024)**, de las
      cuales 239 tenían fecha+kg+USD completos y se parsearon a un archivo
      de backup (`steel-measurement-historial-real-MMN.json`, entregado a
      Gino) listo para cargar vía el botón "⬆️ Restaurar". Mapeo: `HC`
      (horas cotizadas)→`horas_*_est`, `HF`/`HM` (reales)→`horas_*_real`
      — la hoja "Montajes" mapea a campos `*_mon`, el resto a `*_fab`. Los
      7 rubros de costo (MAT/MG/MO/TERC/TRASL/TRAT/MAQ) son USD/kg, no %,
      así que se convirtieron a % dividiendo por USD/kg total.
      **Caveat importante**: esos % no siempre suman ~100% (la planilla no
      itemiza margen/ajustes) — no es un bug, es así en el dato fuente.
      `origen: "importado_excel"` en cada registro para distinguirlos de
      los cargados manualmente. No se restauró aún en el localStorage real
      de Gino — queda pendiente que él lo haga desde la app.

### Configuración global (Sistema) — módulo "Config" existe en el sidebar
### marcado `pronto: true`, o sea todavía no implementado
- Tarifario editable (MO, arenado, tercerizadas, traslados)
- Rubros habilitados/deshabilitados por empresa
- Categorías de trabajo

---

## 10. CONVENCIONES DE CÓDIGO

```js
// Siempre usar los helpers de estilo:
import { C, TH, TD, INP, LBL, BDG, BTN, CARD } from "../styles/colors";

// localStorage siempre via helpers:
import { saveLS, loadLS } from "../utils/storage";

// IDs siempre con uid():
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// Números siempre con n2/n3:
const n2 = v => (Math.round(v * 100) / 100).toFixed(2);
const n3 = v => (Math.round(v * 1000) / 1000).toFixed(3);

// Modelo de datos nuevo → migración suave con defaults:
// En vez de: ficha.precio_raw  → usar: ficha?.precio_raw ?? ""
// En vez de: computo.tc        → usar: computo.tc ?? 40
```

---

## 11. CÓMO CONTINUAR EN UN NUEVO CHAT

1. Compartir este archivo como contexto
2. Indicar qué módulo o feature construir
3. Mencionar si hay cambios en los requisitos
4. El código actual siempre está en `C:\Users\Gino\Documents\steel-measurement\src\`
5. **Identificarse al arrancar la sesión.** Tomar el nombre de sesión que asigna el harness (visible vía `ListAgents`, ej. `f6`) y anteponerlo como identificador del chat con el formato `-{nombre_sesión}_{tema}`, ej. `-f6_Measurement`. Mismo criterio que ya rige en `steelCRM - BUILDIING/CLAUDE.md` (regla 7) — se aplica acá también porque este repo tuvo, repetidas veces en agosto 2026, varias sesiones activas en simultáneo (ver §9.31 en adelante).
6. **Coordinar antes de tocar archivos que otra sesión pueda estar editando.** Antes de escribir sobre un archivo compartido entre repos o entre sesiones paralelas activas al mismo tiempo (`src/utils/storage.js` fue el caso repetido en agosto 2026), correr `ListAgents` y avisar por `SendMessage` a la sesión correspondiente. Ante un cambio sin commitear no reconocido, no asumir que es basura — puede ser trabajo real de otra sesión con contexto resumido; confirmar antes de tocarlo o descartarlo. Mismo criterio que la regla 8 de `steelCRM - BUILDIING/CLAUDE.md`.
7. **Sync de documentación técnica (2026-08-25).** Toda sesión que agregue, borre o modifique una tabla, columna o relación en `steel-backend/supabase/migrations/`, o que cambie qué entidad local de Steel Measurement mapea a qué tabla en `storage.js`, actualiza `ENTIDADES-COMPARTIDO-MMN.md` (raíz de este repo) en el mismo commit. Mismo criterio que la regla 9 de `steelCRM - BUILDIING/CLAUDE.md` y de `steel-backend/CLAUDE.md`.

**Dato clave para el LLM:** Gino valida contra la planilla Excel / GestSoft con datos reales. No avanzar al siguiente módulo hasta que los cálculos numéricos coincidan exactamente.

---

## §9.31 — Fase 3, extendido a Cómputo, Anidado, Historial (2026-08-23)

Mismo patrón seguro que clientes/presupuestos (§9.29, §9.30): dual-write en
paralelo, nunca bloquea ni puede romper el guardado local.

- `Computo.jsx`: `crearComputo`/`updateComputo` → `saveDBComputo`.
- `Anidado.jsx`: `crear`/`upd` → `saveDBAnidado`.
- `Historial.jsx`: `crear`/`upd` → `saveDBTrabajoHistorico` (mapea
  `desglose_pct.{hier,mat,moFab,moMon,hesp,tFab,tMon,trat,trasl,panto}`
  a las columnas `pct_*` planas de la tabla).
- **Cambio de método de verificación**: el login local que se usaba para
  probar sin credenciales reales ya no existe (reemplazado por Supabase
  Auth real, ver §9.29/App.js). De acá en más, la verificación en
  navegador en vivo requiere una sesión real — no se le va a pedir la
  contraseña a Gino para esto. Esta tanda se validó por build limpio
  (`CI=true npx react-scripts build`, exit 0) + revisión manual contra el
  mismo patrón ya verificado en vivo antes, no con una prueba end-to-end
  nueva. Recomendado: la próxima vez que alguien tenga sesión real activa,
  confirmar estos tres módulos en consola (sin warnings `[Fase 3]`).
- **Alcance acotado, igual criterio que antes**: no cubre `clonarComputo`,
  `clonarAnidado`(si existe), `importarDeM4`, ni ningún flujo de carga
  masiva/histórica.
- Pendiente: biblioteca de materiales y tarifario siguen sin dual-write.

## §9.32 — Fase 3 completa en Steel Measurement: biblioteca + tarifario (2026-08-23)

Cierra la lista de entidades de Steel Measurement — con esto, **las 9
entidades tienen dual-write** (clientes, presupuestos+ítems, computos,
anidados, historial_trabajos, y ahora biblioteca de materiales + tarifario).

- `BibliotecaMateriales.jsx`: `actualizar`/`agregarMat` de las 4 secciones
  (perfiles, planchuelas, planchas, rejillas) → `saveDBMaterial(tipo, ...)`.
  `aplicarLote` (ajuste de precio en lote) de Perfiles también agrega
  entradas a `material_historial_precios` vía `addDBHistorialPrecio` — el
  mismo lote en Planchuelas/Planchas/Rejillas quedó sin ese agregado extra
  (alcance acotado, se puede sumar después si hace falta).
- Tarifario: las 5 funciones de guardado (`SeccionCatalogoRubro` genérico
  para MO/Materiales/Terceros/Traslados/Pinturas, `SeccionInteresFinanciero`,
  `SeccionTratSuperficie`, `SeccionPantografo`) ahora también llaman
  `saveDBTarifario(t)` con el objeto completo — mismo criterio que
  `saveTarifario` local, que también reescribe todo cada vez.
- `eliminarMat` (borrar un material) **no tiene dual-write** — mismo
  criterio que el resto de la sesión: ninguna eliminación quedó cubierta
  todavía, solo alta/edición.
- Verificado por build limpio únicamente (mismo motivo que §9.31: ya no
  hay login local para probar sin credenciales reales).

**Con esto se cierra Fase 3 (piloto) completa del lado de Steel
Measurement.** Falta: Fase 4 (migración de datos históricos reales) y
Fase 5 (corte de lectura) — ninguna de las dos arrancada todavía. Ver
`steel-backend/CLAUDE.md` para el estado general del backend compartido.

## §9.33 — Fase 4: migración de datos reales a la nube (2026-08-23)

Herramienta de una sola vez para subir todo lo que ya está en localStorage
al backend real, usando exactamente las mismas funciones `saveDB*` ya
probadas en Fase 3 (nada de código nuevo sin probar en esta parte).

- `migrarTodoALaNube(onProgress)` (`storage.js`): recorre clientes,
  presupuestos+ítems, cómputos, anidados, historial, biblioteca (4 tipos)
  y tarifario, en ese orden, secuencial (no en paralelo, para no saturar
  la base y poder aislar errores por entidad). Devuelve un resumen
  `{ ok, total }` por entidad + lista de errores con detalle.
- Botón nuevo en **Sistema → Backup y Datos** ("☁️ Migrar datos históricos
  a la nube"), admin-only, con log en vivo y resumen final. **Marcado
  explícitamente como parche de una sola vez** — se puede borrar entero
  una vez que Gino confirme que migró bien (mismo criterio que las
  herramientas de limpieza de `Importar.jsx` en steelCRM).
- **No se pudo probar en navegador de mi lado** — desde que se sacó el
  login local, correr esto requiere sesión real y los datos reales de
  Gino, ninguna de las dos cosas la tengo yo. Validado por build limpio +
  revisión manual del código contra el mismo patrón ya probado en Fase 3.
- **Pendiente que Gino corra esto en su propia sesión real** y confirme
  el resumen (cuántos de cada tipo, si hubo errores). Puede tardar varios
  minutos si hay mucho volumen de presupuestos con ítems/piezas anidadas
  (cada guardado hace varias llamadas secuenciales por rubro).

## §9.34 — Fase 4: 2 bugs encontrados en la primera corrida real (2026-08-23)

Gino corrió la migración con sus datos reales (235 trabajos históricos,
0 en el resto de las entidades — su instancia real todavía no tiene
presupuestos/cómputos/clientes cargados, solo el histórico importado).
Encontró y quedó corregido:

- **`historial_trabajos` rechazaba todo** (`created_at`/`updated_at`
  desconocidos, después también `dias_obra`) — el objeto local `iTrabajo`
  acumuló campos sueltos con el tiempo que nunca tuvieron columna en la
  tabla. Fix: `saveDBTrabajoHistorico` pasó de "mandar todo menos lo que
  sé que sobra" a una **lista blanca explícita** de columnas — más robusto
  a que aparezca un campo nuevo el día de mañana.
- **`tarifario_mo_fab` rechazaba con "null value in column id"** — el
  patrón `{ ...f, id: undefined }` que se usaba en 5 lugares del archivo
  para "omitir el id y que la base genere uno nuevo" **no funciona como
  se pensaba**: dejar la clave en `undefined` no es lo mismo que no
  mandarla. Nuevo helper `sinId(obj)` (destructuring real) reemplaza los
  5 usos: los 3 rubros por ítem de presupuesto, piezas de anidado, y
  tarifario.
- Ambos bugs solo aparecieron con datos reales — el patrón de
  verificación de esta fase (build limpio + revisión manual) no los
  detectó, confirma que la migración real es la prueba de fondo que
  faltaba.

**Pendiente**: que Gino corra la migración de nuevo con estos 2 fixes.

## §9.35 — Fase 4 confirmada + arranque de Fase 5 (piloto: clientes) (2026-08-23)

Gino corrió la migración con los 2 fixes — **235/235 historial, tarifario
OK, migración completa sin errores**. Fase 4 queda confirmada funcionando
con datos reales (el resto de las entidades en 0/0 porque su instancia
real todavía no tiene presupuestos/cómputos/clientes cargados, no por
ningún error).

Decisiones tomadas para Fase 5: **localStorage como respaldo** (si
Supabase falla o está dormido por el plan free, la app sigue andando con
lo local, nunca deja a Gino sin poder trabajar) — no "solo nube sin
respaldo". Piloto arranca por **clientes**, la entidad más simple y de
menor riesgo (autocompletado, no es dato de negocio crítico).

- `loadClientesConNube()` (`storage.js`): arranca con la lista local
  (síncrono, sin esperar red), y en cuanto responde Supabase la mejora
  con la **unión** de nube + local (nunca reemplaza — así no se pierde un
  nombre tipeado hace un segundo que todavía no llegó a sincronizarse).
  Si falla la consulta remota, se queda con lo local sin romper nada.
- `App.js`: el datalist global de autocompletado de clientes (único punto
  de lectura de `loadClientes()` en toda la app) pasa de llamada síncrona
  directa a `useState` + `useEffect` con esta función.
- Build limpio. **Pendiente que Gino confirme en vivo** que el
  autocompletado de clientes sigue funcionando normal (y, si tiene forma
  de probarlo, que después de la migración aparecen ahí nombres que
  vinieron de la nube y no solo de lo local) antes de seguir extendiendo
  Fase 5 a más entidades.

## §9.36 — Fix: autocompletado de Cliente propio (reemplaza <datalist>) (2026-08-23)

Gino reportó, probando el piloto de Fase 5: la lista de clientes no se
filtraba al escribir, y después de elegir un nombre el campo "no dejaba
cambiar". El `<input list="clientes-datalist">` nativo de HTML es
conocido por comportarse mal e inconsistente entre navegadores — no era
un bug de Fase 5 (la mecánica del input no se había tocado), pero se
decidió arreglarlo de una vez ya que estaba fresco.

- **`AutocompleteCliente.jsx`** (nuevo, en `components/`): input propio +
  dropdown de sugerencias filtradas de verdad (substring, case-insensitive),
  siempre editable después de elegir (usa `onMouseDown` + `preventDefault`
  en las opciones para evitar la carrera con `onBlur` que suele causar
  este tipo de "campo trabado").
- **`useListaClientes()`** (hook nuevo en `storage.js`): mismo patrón
  nube+local de Fase 5, con caché a nivel de módulo para no repetir el
  fetch en cada campo montado en la misma pantalla.
- Reemplazados los **9 usos** de `list="clientes-datalist"` en Computo,
  Anidado, Historial, Presupuesto (x3) y Dashboard. Se sacó el
  `<datalist>` global de `App.js` (ya no lo usa nadie) y las llamadas
  sueltas a `registrarCliente` en cada campo (ahora vive adentro del
  componente, se llama una sola vez).
- Build limpio. **Pendiente que Gino confirme en vivo** que ahora sí
  filtra al escribir y que el campo queda editable después de elegir un
  nombre.

## §9.37 — Campo Empresa separado del Cliente (contacto) (2026-08-23)

Pedido de Gino: el campo "Cliente" que se tipea hoy en Cómputo/Anidado/
Historial en la práctica representa el **contacto (persona)**, no la
empresa — y la tabla real `clientes` sí distingue `nombre` (contacto) de
`empresa`. Se agregó el campo Empresa donde faltaba.

- **Esquema** (steel-backend, migración `20260823090000`): columna
  `empresa` nueva en `presupuestos_sm`, `computos`, `anidados`,
  `historial_trabajos`.
- **`resolverClienteId(nombre, empresa)`**: ahora acepta empresa opcional
  — si el contacto ya existe pero sin empresa cargada, se la completa
  (nunca pisa una que ya estaba). `useListaEmpresas()` (hook nuevo) y
  **`AutocompleteEmpresa.jsx`** (componente nuevo, mismo patrón que
  `AutocompleteCliente` pero sin el registro automático) para el
  autocompletado.
- **Cómputo, Anidado, Historial**: campo Empresa nuevo al lado de
  Cliente, en los formularios de alta (y en Historial también en el
  detalle editable). Modelo local (`computoVacio`, `iTrabajo`, y el
  objeto que arma `crear()` de Anidado) suma `empresa: ""`.
- **Presupuesto — hallazgo importante, mapeo corregido, no se agregó
  campo nuevo**: acá "Cliente" **ya era** la razón social (placeholder
  "Razón social") y "Contacto" el nombre de la persona — al revés del
  resto. El dual-write venía resolviendo `cliente` (empresa) como si
  fuera el nombre del contacto, invertido sin querer. Corregido:
  `resolverClienteId(contacto, cliente)` con respaldo si no hay contacto
  cargado (usa el nombre de la empresa como nombre del cliente, mismo
  criterio que los demás módulos). Los inputs "Cliente" y "Contacto" de
  Presupuesto (alta y detalle) pasaron de `AutocompleteCliente`/texto
  plano a `AutocompleteEmpresa`/`AutocompleteCliente` respectivamente,
  para que autocompleten contra la lista correcta.
- Build limpio. **Pendiente que Gino confirme en vivo** los 3 flujos
  (Cómputo, Anidado, Historial con Empresa nueva; Presupuesto con el
  mapeo corregido) antes de dar esto por cerrado.

## §9.38 — Fase 5 extendida: tarifario, biblioteca, historial (2026-08-23)

Tres entidades más leyendo de la nube, cada una con la estrategia de
respaldo que le corresponde según su forma:

- **Tarifario** (`useTarifarioConNube`): preferir directo lo remoto si
  responde (sin mezclar) — cada edición ya escribe a los dos lados a la
  vez desde Fase 3, así que deberían estar sincronizados. Si falla, se
  queda con el local. Reemplaza `useState(loadTarifario)` en las 4
  secciones de `BibliotecaMateriales.jsx` que lo editan.
- **Biblioteca de materiales** (`useMergeBibliotecaNube`, un hook por los
  4 tipos): a diferencia del tarifario, acá se **fusiona por id** en vez
  de reemplazar — nunca pierde un material que solo exista local (por si
  todavía no pasó por la migración de Fase 4), y suma lo que haya remoto
  y no esté local.
- **Historial de trabajos** (`useMergeHistorialNube`): mismo criterio de
  fusión por id que biblioteca.
- Build limpio. **Deliberadamente sin tocar todavía** presupuestos,
  cómputos ni anidados — son las entidades con estructura anidada
  (ítems/piezas/rubros) y las que más se usan día a día; conviene ir con
  más cuidado ahí, después de confirmar que este patrón anda bien en las
  entidades más simples.
- Pendiente que Gino confirme en vivo: tarifario/biblioteca/historial
  siguen viéndose y funcionando igual que antes.

## §9.39 — Fase 5 completa: presupuestos, cómputos, anidados (2026-08-23)

Cierra Fase 5 en las 3 entidades que quedaban — a pedido explícito de
Gino, con el riesgo aceptado a sabiendas (hoy con un solo dispositivo,
el beneficio real es bajo hasta que haya un segundo dispositivo o
usuario, pero se construyó igual).

- `useMergePresupuestosNube`, `useMergeComputosNube`, `useMergeAnidadosNube`
  (todas en `storage.js`): mismo criterio de fusión por id que biblioteca/
  historial — **nunca reemplazan ni tocan lo que ya está local**, solo
  agregan registros que existan en la nube y no localmente. Para cada uno,
  resuelven `cliente_id → nombre` (`resolverNombreCliente`, nuevo, camino
  inverso a `resolverClienteId`) y traen la estructura completa (ítems,
  piezas/grupos) con las funciones de Fase 2 ya existentes.
- **Simplificación aceptada a propósito, señalada en el código**: las
  piezas de cómputo que llegan por este camino quedan con los campos de
  `ficha` (granallado/pintura/etc.) planos en vez de anidados bajo
  `.ficha` como espera el resto de la UI — indiferente en la práctica
  porque solo afecta registros que nunca pasaron por este navegador.
- Build limpio en las 3, verificado por separado antes de seguir a la
  siguiente (Presupuesto → Cómputo → Anidado), como pidió Gino.
- **No se pudo probar en vivo** — mismo motivo de siempre (sin login
  local, sin credenciales reales de mi lado) y además, en la práctica,
  hoy no hay ningún registro "solo remoto" real para forzar el camino
  nuevo (un solo dispositivo, todo ya está local). Recomendado: probar
  esto de verdad el día que haya un segundo dispositivo o usuario.

Con esto, **Fase 5 queda completa en las 9 entidades de Steel Measurement**.

## §9.27 — Bugs reales en el launcher de escritorio, encontrados dando de alta a Tiao (2026-08-23)

Gino quiere compartir acceso con un compañero (Tiao) desde su propia PC —
ya tiene su email para crear la cuenta (mismo backend/tenant compartido
con steelCRM, confirmado con `c9` — un solo login sirve para los dos
sistemas, sin nada extra de perfil/rol del lado de Steel Measurement).
Antes de escribirle el instructivo, probé el launcher real de punta a
punta (no solo leí el código) y encontré 2 bugs reales que le iban a
fallar a Tiao en silencio:

- **`IniciarOculto.vbs` tenía la ruta hardcodeada** a
  `C:\Users\Gino\Documents\steel-measurement\...` — no iba a andar en
  ninguna PC que no fuera exactamente la de Gino con ese usuario de
  Windows. Corregido para autodetectar su propia carpeta
  (`Scripting.FileSystemObject.GetParentFolderName(WScript.ScriptFullName)`),
  igual que ya hacían el `.bat` y el `.ps1`.
- **`IniciarSteelMeasurement.ps1` fallaba en silencio siempre** (no solo
  para Tiao — esto ya le pasaba a Gino, aunque nunca lo notó porque
  probablemente lo tenía andando de una sesión vieja): invocaba
  `cmd.exe /c "Iniciar Steel Measurement.bat"` vía
  `[System.Diagnostics.Process]::Start()` — el nombre del `.bat` tiene
  espacios, y esa combinación puntual dispara un bug de parseo clásico
  de `cmd.exe` (toma "Iniciar" como el comando y el resto como
  argumentos) que hace que todo falle sin generar ni su propio log.
  Reproducido y confirmado en la práctica (no en teoría): probé 4
  variantes distintas de invocación antes de encontrar la que
  realmente funciona. Fix: `Start-Process -FilePath "Iniciar Steel
  Measurement.bat" -WorkingDirectory $dir -WindowStyle Hidden` — lanzar
  el `.bat` directo como `FileName`, sin envolverlo a mano en
  `cmd.exe /c`. Mismo patrón de fondo que ya usa `IniciarSteelCRM.ps1`
  (que evita el problema de raíz llamando a `npm start` directo, sin
  ningún archivo con espacios en el medio).
- Verificado de punta a punta 2 veces: primero el `.ps1` solo, después
  la cadena completa real (`IniciarOculto.vbs` → `.ps1` → `.bat` →
  `npm start` → servidor respondiendo en `localhost:3002`, log con
  "webpack compiled successfully") — como lo dispararía el ícono de
  escritorio real con un doble clic.
- **Sigue pendiente**: no existe instalador (.exe) todavía — el camino
  actual para que Tiao tenga la app en su PC es Node.js + copia de la
  carpeta (git clone o .zip) + `npm install` una vez + el launcher ya
  corregido. Se lo planteé a Gino como decisión aparte (instalador
  liviano tipo Inno Setup vs. Electron) — sin definir todavía cuál.

## §9.40 — Desplegado en Vercel (reemplaza el plan de instalador de escritorio) (2026-08-23)

Gino planteó un instalador de escritorio (Tauri/Electron) para que el equipo
pueda tener la app en su PC — se le señaló que eso no acerca el objetivo real
(vender esto como SaaS: un cliente pagando espera un link, no instalar un
.exe). Decidió alojar las dos apps en hosting real en su lugar.

- **URL real**: https://steel-measurement.vercel.app (proyecto Vercel
  `ginomaffiotto/steel-measurement`, cuenta personal de Gino, plan Hobby
  gratuito).
- Desplegado vía Vercel CLI con un Access Token de la cuenta de Gino (mismo
  criterio que Supabase — token, nunca contraseña). `REACT_APP_SUPABASE_URL`
  y `REACT_APP_SUPABASE_ANON_KEY` cargadas como variables de entorno del
  proyecto en Vercel (`--no-sensitive`, ya que son valores pensados para ser
  públicos — la anon key nunca protegió nada por sí sola, RLS es la
  protección real).
- **Verificado en el sitio público real** (no una vista previa local): login
  con la cuenta de prueba compartida (`test-claude@steelplatform.local`)
  funciona de punta a punta, sin errores de consola. El botón de seed de
  datos de prueba no aparece (correctamente oculto en build de producción).
- **Nota de seguridad para quien retome esto**: la URL es pública (cualquiera
  con el link llega al login), pero sin cuenta real no se puede entrar —
  la protección de datos real es Supabase Auth + RLS por tenant, no algo del
  lado de Vercel. Si en el futuro hace falta una capa extra (contraseña a
  nivel Vercel antes de llegar al login), es una función paga (plan Pro),
  evaluar si vale la pena cuando haya clientes reales.
- steelCRM se despliega en paralelo del mismo modo, por la otra sesión de
  coordinación — mismo hosting (Vercel), mismo criterio.
- **Pendiente**: dominio propio (hoy es el gratuito `.vercel.app`) — a
  definir cuando haga falta. Redeploy no es automático todavía (no hay
  integración con git push, se corre `vercel deploy --prod` a mano) — a
  evaluar si conviene conectar el repo a GitHub para que se despliegue solo
  en cada commit, más adelante.

## §9.41 — Comentarios internos en Cómputo/Anidado/Presupuesto (2026-08-23)

Pedido de Gino, mismo patrón que steelCRM (`{id, autor, texto, fecha, hora}`)
pero con una mejora de UX consultada y decidida en conjunto: **guardado
directo al comentar**, no el flujo de dos pasos de steelCRM (comentar +
esperar al Guardar general) que ya había confundido a Gino una vez.

- 3 tablas nuevas en steel-backend (`comentarios_computo`,
  `comentarios_anidado`, `comentarios_presupuesto_sm`), mismo patrón de RLS
  + trigger de tenant_id que el resto.
- `ComentariosPanel.jsx` (nuevo, reutilizable): lista + textarea + botón,
  Ctrl+Enter también envía.
- `saveDBComentario(tabla, campoFK, entityId, comentario)` en storage.js,
  genérico para las 3 entidades.
- **Bug real encontrado y corregido probando en vivo** (con la cuenta de
  prueba, no solo build): comentar justo después de crear un registro nuevo
  fallaba con violación de FK — el dual-write de la creación es
  fire-and-forget, así que el registro padre podía no existir remoto
  todavía. Fix: cada `agregarComentario*` ahora espera (`await`) a que el
  dual-write del padre termine antes de mandar el comentario (el upsert es
  idempotente, repetirlo no rompe nada). Sin este fix, comentar
  inmediatamente después de crear un cómputo/anidado/presupuesto habría
  fallado en producción real.
- **Nota para la próxima sesión que debuggee algo parecido**: la consola de
  DevTools guarda mensajes viejos entre pruebas — un warning que aparece
  después de un fix puede ser un mensaje *viejo* todavía en el buffer, no
  una falla nueva. Conviene usar un texto de log único (o revisar
  timestamps) antes de concluir que un fix no funcionó.
- `comentarios` se excluye explícitamente del `resto` que viaja a
  `saveDBPresupuestoSM`/`saveDBComputo`/`saveDBAnidado` (esos campos no
  existen en esas tablas — viven en las tablas de comentarios aparte).
- Verificado en vivo de punta a punta con la cuenta de prueba: crear,
  comentar inmediatamente, y comentario aparece guardado sin error.

## §9.42 — PWA instalable + logo real en la pestaña (2026-08-23)

Pedido de Gino: acceso directo al escritorio al primer uso ("hacelo para
los dos" — steelCRM lo replica la otra sesión) + logo faltante en la
pestaña del navegador (steelCRM sí tenía uno, Measurement no).

- Al revisar, Measurement no tenía **nada** de esto: `public/` solo tenía
  `index.html`, sin favicon, sin manifest, sin ningún ícono. Se detectó
  además que el "logo" de steelCRM no es un logo real — son los
  `logo192.png`/`logo512.png` del boilerplate de Create React App sin
  personalizar (el átomo de React), con `manifest.json` todavía diciendo
  `"name": "Create React App Sample"`. Avisado a la otra sesión para que
  no lo replique tal cual — el pedido real es un ícono de marca para cada
  sistema, no copiar el placeholder.
- **`public/icon.svg`** (nuevo): marca geométrica simple — escuadra +
  ticks de regla + agujero, en el color de acento (`#e85d04`) sobre fondo
  oscuro (`#0d0f12`), mismo lenguaje visual que el emoji 📐 que ya usa el
  login. Un solo SVG para favicon + manifest (`sizes: "any"`, con variante
  `purpose: "maskable"`) — sin PNG rasterizado: no hay ImageMagick/sharp/
  Inkscape instalado en esta máquina, y Chrome/Edge de escritorio (el
  target real, no iOS) soportan SVG en `<link rel="icon">` y en
  `manifest.icons` sin problema. Si más adelante hace falta soporte
  serio de iOS/Android (ícono en la home real, no solo la pestaña), ahí
  sí conviene generar PNGs de verdad en 192/512.
- **`public/manifest.json`** (nuevo): `name`/`short_name` reales,
  `display: "standalone"`, `theme_color`/`background_color` en el fondo
  oscuro de la app (no el blanco/negro genérico de CRA).
  `public/index.html`: agregado `<link rel="icon">`,
  `<link rel="manifest">`, `<link rel="apple-touch-icon">` y
  `<meta name="theme-color">` — antes no tenía ninguno de los cuatro.
- Verificado: el dev server ya corriendo sirvió los 3 archivos nuevos sin
  reiniciar (CRA sirve `public/` como estático, no pasa por webpack). Build
  de producción limpio, redeploy a Vercel, y confirmado en el sitio público
  real (`https://steel-measurement.vercel.app/manifest.json` responde bien,
  sin errores de consola relacionados a manifest/ícono).
- **Pendiente de confirmar con Gino**: que Chrome/Edge le ofrezca el ícono
  ⊕ de instalar en la barra de direcciones al entrar al sitio real, y que
  el atajo que crea abra la app en su propia ventana (sin barra de
  navegador) — el manifest y el favicon ya están verificados server-side,
  falta la confirmación visual de Gino en su propio navegador.

## §9.43 — Sidebar responsiva (2026-08-23)

Mismo pedido que steelCRM (relayado por Gino a las dos sesiones). Antes
solo tenía colapso manual (botón ◀/▶). Replicado 1:1 el patrón que ya
comiteó y verificó la otra sesión en steelCRM (`c81b5ac`): arranca
colapsada si el viewport es menor a 768px, y se reajusta sola al
redimensionar la ventana (listener de `resize`) — el usuario sigue
pudiendo expandirla a mano. `SW` (ancho del sidebar) ya dependía de
`collapsed`, así que el contenido principal se reacomoda solo sin tocar
nada más. Build limpio, desplegado a producción.

## §9.44 — Fix real: Fase 5 vacía en origen nuevo (Vercel) + service worker para instalar (2026-08-23)

Gino reportó, probando en `steel-measurement.vercel.app` (origen sin nada
en localStorage): no ve NADA de sus datos. La otra sesión encontró y
corrigió el mismo síntoma en steelCRM (efectos de Fase 5 con
`useEffect(..., [])` disparando al montar App.js, antes de que
`usuarioActivo` saliera de `null` — sin sesión, RLS bloqueaba todo) y
avisó para revisar acá.

- **Revisado, no es el mismo bug de raíz**: en Measurement, `App.js` gatea
  todo el árbol con `if (!usuario) return <Login/>` — los componentes que
  llaman a los hooks de Fase 5 (`useMergePresupuestosNube`,
  `useMergeComputosNube`, etc.) ni siquiera existen en el DOM hasta
  DESPUÉS de que `onLogin(local)` se dispara, y eso solo pasa tras
  `await supabase.auth.signInWithPassword(...)` exitoso (mismo `Login`
  llega a consultar `profiles` con RLS antes de eso). El bug específico de
  steelCRM (montar antes de loguear) no debería reproducirse acá.
- **Igual se blindó** (`esperarSesion()`, nuevo helper en `storage.js`):
  cada uno de los 8 hooks de Fase 5 ahora espera
  `supabase.auth.getSession()` antes de consultar — cierra un caso
  relacionado pero distinto (recargar una pestaña ya logueada: `usuario`
  se restaura sincrónico desde `sessionStorage`, pero supabase-js recién
  termina de rehidratar la sesión persistida de forma asíncrona). Costo
  cero en el caso que ya andaba bien (login fresco, sesión ya lista).
- **Sospecha más fuerte, sin confirmar todavía**: ya había quedado
  anotado sin resolver que la migración de Fase 4 de Measurement pudo
  haber subido datos VACÍOS por el bug de origen `localhost` vs
  `127.0.0.1` de ese mismo día (`loadLS` en `migrarTodoALaNube` lee el
  localStorage de la pestaña donde se corre el botón — si esa pestaña
  era `127.0.0.1` y los datos reales vivían en `localhost`, la migración
  reporta "sin errores" pero sube 0 filas reales). Si Supabase
  genuinamente no tiene los datos, ningún fix de timing en el frontend
  soluciona nada — hay que re-correr "Migrar todo a la nube" desde una
  pestaña con los datos reales y confirmar en el Table Editor. **Avisado
  a Gino directamente, pendiente que lo confirme.**
- **Service worker nuevo** (`public/service-worker.js` + registro en
  `src/index.js`): la otra sesión encontró que el manifest solo no
  alcanza para que Chrome dispare el aviso de instalación automático —
  hace falta un service worker con fetch handler registrado. Mismo
  patrón que aplicaron en steelCRM: sin caché, cada pedido pasa directo a
  la red (`event.respondWith(fetch(event.request))`), cero riesgo de
  servir una versión vieja. Verificado en producción: se registra
  (`serviceWorker.getRegistrations()` confirma el script activo), sin
  errores de consola.
- Build limpio, desplegado a producción.

## §9.45 — Íconos PNG reales para el criterio de instalabilidad (2026-08-23)

La otra sesión encontró, probando en vivo en steelCRM, que el manifest
con un solo ícono SVG no le alcanzaba a Chrome para disparar el aviso
automático de instalar (`beforeinstallprompt`) — hace falta al menos un
PNG real en 192x192 y 512x512, el SVG solo no cumple el criterio aunque
esté bien referenciado.

- `public/logo192.png` / `logo512.png` (nuevos): generados con
  PowerShell + `System.Drawing` (GDI+), sin ImageMagick/sharp — se
  redibujó el mismo diseño del `icon.svg` (triángulo/escuadra + ticks +
  círculo, acento `#e85d04` sobre `#0d0f12`) como formas vectoriales
  (`DrawPolygon`/`DrawLine`/`FillEllipse`) en vez de rasterizar el SVG
  directamente, ya que `System.Drawing` no tiene parser de SVG nativo.
  Revisado visualmente antes de subir — coincide con el diseño original.
- `manifest.json`: los PNG van primero (`purpose: "any"`), el SVG queda
  como `purpose: "maskable"` de respaldo. `index.html` suma
  `<link rel="icon" type="image/png" sizes="192x192">` y
  `apple-touch-icon` ahora apunta al PNG (antes al SVG, que iOS no
  soporta bien para esto).
- Build limpio, desplegado a producción, verificado que
  `manifest.json`/`logo512.png` responden bien en el sitio real y no hay
  errores de consola.

## §9.46 — Fix real: esquema roto para presupuestos/cómputos/anidados/biblioteca en la migración con datos reales (2026-08-24)

Gino corrió "Migrar todo a la nube" con sus datos reales (no de prueba) y
tiró 732 errores. Server-side, no de timing — el frontend nunca podía
haber andado bien acá, más allá de cualquier fix de sesión.

- **`presupuestos_sm` le faltaba la columna `tc`** (tipo de cambio
  histórico del presupuesto — campo real, ya usado en la UI, nunca
  agregado a la tabla al diseñar el esquema) y **`codigo_calculo` era
  NOT NULL** aunque hay presupuestos reales más viejos que esa
  funcionalidad, sin código asignado. Migración nueva en steel-backend
  (`20260824090000_fix_steel_measurement_schema.sql`): agrega `tc`,
  saca el NOT NULL.
- **Biblioteca de materiales (722 ítems) usa códigos de catálogo legibles
  como id** ("HEB100", "GM_ANGULO_1_X_3_16_...") a propósito — permite
  matchear el catálogo semilla en cualquier instalación. El esquema había
  asumido `uuid` para todo `id` sin contemplar este caso — las 4 tablas
  de biblioteca + `material_historial_precios.material_id` pasan a `text`.
- **Cómputos/anidados/presupuestos con `id` viejo** (de antes de que
  `uid()` usara `crypto.randomUUID()`, tipo `"mry49eatlzth"`, o de seeds
  de prueba tipo `"seed_anid_001"`) rompían el `upsert` contra una columna
  `uuid`. Nuevo helper `conIdValido()` en `storage.js`: si el `id` local
  no matchea el formato uuid, genera uno nuevo. Se aplica DENTRO de
  `saveDBComputo`/`saveDBAnidado`/`saveDBPresupuestoSM` (cubre también
  Fase 3 en vivo, no solo la migración) y además, específicamente en
  `migrarTodoALaNube`, se corrige y persiste en localStorage ANTES de
  subir (`normalizarIds()`) — necesario para que `saveDBItem(p.id,...)`
  use el mismo id ya corregido que terminó subiendo el presupuesto dueño,
  y para que Fase 3 encuentre el id bueno la próxima vez.
- **Columnas sueltas rompiendo el insert** (`categoria_id` — campo
  muerto, ya no existe en ningún componente actual, quedó de una versión
  vieja; `cantidad` en vez de `cantidad_total` en cómputos viejos): mismo
  patrón que ya tenía `COLUMNAS_HISTORIAL_TRABAJO` para historial, ahora
  también `COLUMNAS_PRESUPUESTO_SM`/`COLUMNAS_COMPUTO`/`COLUMNAS_ANIDADO`
  — lista blanca explícita en vez de mandar el objeto completo.
- **Riesgo conocido, aceptado por tiempo**: si se edita un
  cómputo/anidado con id viejo en la MISMA pestaña, sin recargar,
  inmediatamente después de migrar, el guardado en vivo generaría OTRO id
  nuevo distinto al que `normalizarIds` ya dejó en localStorage (la
  migración corrige el storage pero no el estado de React ya montado) —
  crearía una fila duplicada en vez de actualizar la ya subida. Se avisó a
  Gino: recargar la página después de migrar, antes de editar cualquier
  cómputo/anidado viejo. Bajo impacto (solo afecta a los ~6-10 registros
  con id legado, una sola vez hasta el próximo reload) — no se abordó el
  patrón completo de reconciliación de `dbId` que sí tiene steelCRM,
  quedaría para una pasada futura si hace falta.
- **Sin resolver todavía**: "Tarifario: error" en el resumen de la
  migración, sin texto de error específico visible en la captura que
  mandó Gino — pendiente que confirme el mensaje exacto tras volver a
  correr con el resto de los fixes ya aplicados.
- Pedido de Gino de paso: el `short_name` del manifest (lo que aparece
  bajo el ícono del escritorio al instalar) pasa de "Steel Measurement" a
  **"SteelMeasurement"**, sin espacio.
- Build limpio, desplegado a producción. **Falta que Gino corra el SQL en
  Supabase y vuelva a migrar** — sin eso, nada de este fix tiene efecto.

## §9.47 — Segunda vuelta del fix de migración: items, cantidad_total, tenant ambiguo (2026-08-24)

Tras el fix de §9.46, Gino corrió el SQL y volvió a migrar: Clientes,
Historial, Biblioteca y Anidados quedaron completos (2/2, 235/235,
722/722, 8/8). Quedaron 3 problemas nuevos, visibles recién con el ruido
anterior ya despejado.

- **`items_presupuesto_sm` sin `anidado_id`**: un ítem se puede vincular a
  un anidado igual que a un cómputo (`computo_id`, columna que sí
  existía) — la app local lo soporta desde antes, la tabla nunca tuvo la
  columna. Migración nueva: `alter table items_presupuesto_sm add column
  anidado_id uuid references anidados(id) on delete set null`.
  `horas_especiales` (rubro sin UI para agregar filas, ya documentado
  como "siempre vacío en la práctica") se colaba igual en el insert
  porque `saveDBItem` no lo excluía de `row` — nuevo
  `COLUMNAS_ITEM_PRESUPUESTO` (mismo patrón de lista blanca).
- **`saveDBComputo`: `cantidad_total: ""`** en un cómputo viejo rompía el
  insert (`invalid input syntax for type numeric: ''`) — Postgres no
  coerciona string vacío a null solo. Nuevo helper `numOrNull()`.
- **El bug real de "Tarifario: error" (recién visible con texto claro
  esta vuelta — "Cannot coerce the result to a single JSON object")**:
  `obtenerTenantId()` hacía `.from("profiles").select("tenant_id")` SIN
  filtrar por el usuario actual — con una sola cuenta en el tenant nunca
  se notó, pero con más de una (la cuenta de prueba compartida que se usó
  días atrás sigue en el mismo tenant) devolvía más de una fila y
  `.single()` explotaba. Fix: filtra por `auth.getUser().id` antes de
  pedir `.single()`.
- Build limpio, desplegado a producción. Falta que Gino corra la línea
  nueva del SQL y vuelva a migrar una vez más.

## §9.48 — Barrido general: "" no es null para Postgres (2026-08-24)

Tercera vuelta del mismo fix de migración. Con `anidado_id`/`horas_especiales`
ya resueltos, aparecieron `invalid input syntax for type uuid: ''` y
`type numeric: ''` — el patrón de fondo: varios puntos donde la app arma
la fila para Supabase hacían spread directo del objeto local
(`{ ...itemRow, ... }`, `{ ...grupoRow, ... }`) sin pasar por ninguna
limpieza, y un campo vacío en la UI local vale `""`, no `null` — Postgres
rechaza `""` en cualquier columna que no sea texto.

- Nuevo `saneado()`: convierte cualquier `""` a `null` en un objeto,
  campo por campo. Seguro aplicarlo siempre (un texto tolera `""` sin
  problema, así que no hay ningún caso donde esto pierda un significado
  real).
- `sinId()` ahora sanea de paso — cubre de un saque todos los rubros de
  ítem (`RUBROS_ITEM`), pinturas/otros de tratamiento superficial, piezas
  de anidado y filas de tarifario, que ya pasaban por acá.
- `soloColumnas()` también sanea — cubre presupuestos/cómputos/anidados/
  ítems de presupuesto (los 4 que ya tenían lista blanca).
- Los 4 puntos que armaban la fila con spread directo sin pasar por
  ninguno de los dos helpers (`computo_items`, `computo_piezas`,
  `anidado_grupos`, `item_trat_superficie`) ahora envuelven el resultado
  en `saneado(...)` explícitamente. `saveDBMaterial` (biblioteca) también,
  por las dudas — no había fallado, pero tiene los mismos campos numéricos.
- Build limpio, desplegado a producción. Sigue sin confirmar si
  `anidado_id` (SQL de §9.47) ya se corrió del lado de Gino — el resumen
  que mandó todavía mostraba "column not found" para eso.

## §9.49 — Referencia huérfana a un id ya renombrado (2026-08-24)

Cuarta y última vuelta del fix de migración: quedaba 1 solo error,
"Presupuesto P-001: invalid input syntax for type uuid: 'seed_anid_001'".

- Causa: `normalizarIds` (§9.47) corrige el `id` de un anidado con id
  viejo, pero un ÍTEM de presupuesto lo referencia por separado
  (`anidado_id`) — esa referencia no se actualiza sola. En una migración
  desde cero (misma corrida) esto se resuelve con un mapa id-viejo→
  id-nuevo aplicado a los ítems antes de subirlos (reordenado además:
  cómputos y anidados se normalizan y suben ANTES que presupuestos, para
  que el mapa exista a tiempo y la FK ya esté satisfecha). Pero acá el
  anidado ya se había renombrado en una corrida ANTERIOR (antes de que
  existiera el mapa) — el id viejo ya no está en ningún lado para
  reconstruir la referencia.
- Red de seguridad agregada en `soloColumnas()`: si un campo de
  referencia (`cliente_id`/`computo_id`/`anidado_id`/`clonado_de_id`) no
  es un uuid válido y no se pudo corregir con el mapa, se suelta a `null`
  en vez de hacer fallar todo el presupuesto por un vínculo que de
  cualquier forma ya no apunta a nada real. `"seed_anid_001"` en particular
  además pinta a resto de un click en "Seed datos prueba" (botón dev-only
  que ya se decidió no tocar el 2026-08-16) mezclado con datos reales —
  perder ese vínculo puntual no es una pérdida real.
- Build limpio, desplegado a producción.

## §9.50 — Borrado de comentarios (2026-08-24)

Pedido de Gino: paridad con steelCRM, que ya permite borrar un
comentario (autor propio, o admin/supervisor sobre cualquiera), con
confirmación. `ComentariosPanel.jsx` solo tenía "agregar".

- **Fix de base necesario primero**: `saveDBComentario` dejaba que
  Postgres generara su propio `id` en el insert, distinto del `id` local
  (`uid()`, que ya es un uuid real vía `crypto.randomUUID()`) — sin
  reconciliar nunca los dos. Borrar por id no iba a funcionar así. Se
  cambió a conservar el `id` local en el insert (mismo id local = remoto
  desde el vamos), y `deleteDBComentario(tabla, id)` nuevo en storage.js.
- `ComentariosPanel.jsx`: ícono 🗑️ junto a cada comentario que el usuario
  puede borrar (autor propio o `puedeEliminar(usuario)`), con
  `ModalConfirmarBorrado` (el modal liviano con checkbox, ya usado para
  piezas/grupos/materiales — mismo nivel de fricción que un comentario
  amerita, no el modal con contraseña de Admin que se usa para borrar un
  cómputo/anidado/presupuesto entero).
- `eliminarComentario*` en Presupuesto/Computo/Anidado.jsx: mismo patrón
  que `agregarComentario*` — actualiza local primero, después borra en
  Supabase (fire-and-forget con catch, no bloquea ni rompe si falla).
- Build limpio, desplegado a producción, sin errores de consola.

---

*Steel Measurement — construido desde las planillas que ya funcionan*
