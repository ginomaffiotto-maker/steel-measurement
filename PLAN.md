# STEEL MEASUREMENT — PLAN MAESTRO Y CONTEXTO
*Documento de referencia para continuar el desarrollo en nuevas sesiones*
*Última actualización: 2026-08-22*

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

## 9.5 TANDA DE PEDIDOS 2026-07-31 (Anidado/Cómputo/Presupuesto)

Pedidos de Gino, ordenados por tamaño y dependencias (no por importancia).

### P0 — rápidas, sin dependencias ✅ COMPLETO 2026-07-31
- [x] Label "PERFIL 1D" → "PERFIL 3D" en Anidado (`Anidado.jsx`)
- [x] Campo "Detalle" en Terceros: input → textarea 2 filas, 280px (`Presupuesto.jsx`, `TabTerc`)
- [x] Modal "🔧 Rubros" de ítem en Presupuesto: 960px → 1280px (`EditorRubros`)
- Probado en navegador, sin regresiones, datos de prueba limpiados.

### P1 — features autocontenidas, un solo módulo
- [x] **TC global único** — 2026-07-31. Control en la topbar de `App.js`
      (`smeas_tc_global` en localStorage, default 40). `Computo.jsx` y
      `Presupuesto.jsx` reciben `tcGlobal` como prop y calculan
      `record.tc ?? tcGlobal`: los cómputos/presupuestos **existentes**
      (que ya tienen `tc` guardado, ej. 40 por defecto de antes) conservan
      su valor congelado para siempre, tal como pidió Gino ("los
      presupuestos viejos deben conservar todos los valores viejos
      precargados"). Los **nuevos** (creados sin `tc`, ya que
      `iPresupuesto()`/`computoVacio()` dejaron de setearlo) siguen el TC
      global en vivo. Se sacó el input editable de TC de `FichaDrawer`
      (Cómputo) y de "Datos generales" (Presupuesto) — ahora son de solo
      lectura con nota "(TC global — se edita en la barra lateral)".
      Probado en navegador: TC global cambia en vivo para registros nuevos,
      un registro con `tc` seteado a mano (simulando uno viejo) no se movió
      al cambiar el global. **Nota pendiente**: el label de solo-lectura
      dice siempre "TC global" aunque el valor mostrado sea el congelado
      del registro — es un texto ligeramente engañoso en el caso viejo,
      cosmético, no se corrigió.
- [x] **Anidar un cómputo completo con un botón** — verificado 2026-07-31, YA EXISTÍA.
      El botón "✂️ Anidar" en el header de detalle de Cómputo (`Computo.jsx`) ya guarda
      el cómputo pendiente (`smeas_anidar_pending`), navega a Anidado, y el `useEffect`
      de auto-import (`Anidado.jsx`) pre-llena nombre/fecha/cómputo del formulario "+ Nuevo".
      Un solo clic en "Crear" agrega **todos** los materiales de **todos** los ítems del
      cómputo agrupados (función `importar()`, ya agregaba por `material_id` cruzando
      ítems). Probado en navegador: cómputo de 3 ítems → 8 grupos de anidado correctos
      en un solo flujo. No hizo falta escribir código — era un malentendido de UX, no un
      gap real. La opción "uno por uno" (+ Perfil / + Plancha manual) ya convive con esto.
- [x] **Sacar "Horas Especiales"** — 2026-07-31. Se borró la pestaña "H. Esp." de
      `EditorRubros` (TABS, counts, render) y el componente `TabHEspeciales` completo
      (código muerto tras sacar la pestaña). `TabMO` (MO Fab / MO Mon) ahora tiene una
      columna "Tipo de hora" con 4 opciones (`TIPO_HORA_OPCIONES`): Común (+0%),
      Nocturna (+25%), Extra (+100%), Lluvia (+20%). Fórmula nueva:
      `subtotal_usd = cant_horas × usd_hora × (1 + pct_adicional/100)`.
      **Compatibilidad con datos viejos**: los ítems que ya tenían filas de MO con
      `tipo_hora: "comun"/"extra"` (esquema binario viejo, sin markup) se normalizan
      con `normalizarTipoHora()` para mostrarse bien en el nuevo selector, y como no
      tenían `pct_adicional` guardado, el fallback `||0` hace que su subtotal_usd no
      cambie (sin markup, igual que antes). Los datos viejos de `item.horas_especiales`
      (de presupuestos ya cargados) NO se borraron — `calcItem` los sigue sumando al
      total (`hesp_usd`), simplemente ya no hay UI para crear/editar filas nuevas ahí.
      Probado en navegador: fila MO Fab con 10h × $20/h × Nocturna (+25%) = $250.00,
      se propaga correctamente a badges, total del ítem y total del presupuesto.
- [x] **Trat. Superficie: totales** — 2026-07-31. Nuevo panel "Resumen Trat. Superficie" en
      `TabTrat` (`Presupuesto.jsx`) con: m² a pintar (campo nuevo, editable, con botón
      "Usar auto" que reutiliza el m² de hierros marcados con `arena`), litros totales
      (Σ litros×manos por pintura), manos totales (Σ manos), y $ por sub-rubro (Pintura,
      Granallado, Galvanizado) + Total.
      **Cambio importante**: el toggle "Galvanizado" antes era solo un booleano sin costo
      — ahora, al activarlo, aparecen campos "Kg a galvanizar" (manual, con nota de que
      el auto-carga desde piezas marcadas queda pendiente — es el ítem P2 de más abajo) y
      "USD/kg", y el subtotal se suma al total del ítem (`calcItem`/`trat_usd`). Antes NO
      sumaba nada al total pese al toggle estar activado.
      **Compatibilidad**: presupuestos viejos con `galvanizado: true` pero sin
      `galvanizado_kg`/`galvanizado_usd_kg` siguen sumando $0 ahí (fallback `||0`) — su
      total no cambió solo por este release, cambia recién cuando alguien cargue los kg/
      USD manualmente.
      Probado en navegador: arenado 20m²×$10 + galvanizado 100kg×$2 + pintura 10lt×2manos×
      $5/lt = $200+$200+$100=$500 total, todo se propaga bien a badges e ítem/presupuesto.

### P2 — dependen de P1
- [x] **Lista de materiales agregada + exportar a Presupuesto** — 2026-07-31, ambas juntas.
      Botón "📋 Materiales (todos los cómputos)" en la grilla de Cómputo (`Computo.jsx`)
      abre `VistaMaterialesGlobal`: suma cada material por `material_id`/nombre cruzando
      **todos** los cómputos (respeta `cantidad_total` del cómputo e `item.cantidad`,
      mismo criterio que usa `importar()` de Anidado). Botón "⬇ Exportar a Presupuesto"
      guarda la lista en `smeas_material_export_pending` y cambia de tab (nuevo prop
      `onExportarPresupuesto` en `App.js`, mismo patrón que `onNidar`/`smeas_anidar_pending`).
      En `Presupuesto.jsx`, `ImportarMaterialesModal` deja elegir presupuesto destino +
      ítem existente o "crear ítem nuevo", y carga cada material como fila de Hierros
      (`kg_pieza`/`area_pieza_m2` = totales agregados, `usd_kg` buscado en Biblioteca por
      nombre si existe, si no 0). Tras importar, navega directo al presupuesto/ítem.
      Probado en navegador de punta a punta: cómputo de 3 ítems → 8 materiales agregados
      (suma exacta 4755.57 kg) → exportado → importado a ítem existente → filas y
      totales (kg, m²) coinciden exactamente con el cómputo original.
- [x] **Galvanizado auto-carga kg** — 2026-07-31. Repensado el diseño original: en vez
      de tocar el modelo de Cómputo (que hubiera sido mucho más grande), se espejó el
      patrón que ya existía para "Arena?" en la pestaña Hierros de Presupuesto. Se agregó
      un flag `galvanizado: boolean` por fila de hierro (`TabHierros`, columna "Galv.?",
      mismo estilo que "Arena?"), un banner "🔩 X kg marcados para galvanizado..." cuando
      hay filas marcadas, y en `TabTrat` un botón "Usar auto (X)" junto a "Kg a
      galvanizar" que carga la suma de `subtotal_kg` de las filas marcadas — igual que ya
      hacía "Usar auto" para m² de arenado.
      Probado en navegador: fila de hierro 150kg marcada Galv.? → banner correcto → Trat.
      Sup. → Galvanizado ON → "Usar auto (150.00)" → USD/kg=3 → subtotal $450.00,
      propagado a total del ítem y del presupuesto (≈ UYU 18000, TC 40).

### P3 — cadena más grande, depende de P2 ✅ COMPLETO 2026-07-31
- [x] **Presupuesto: seleccionar anidados + Hierros corte 2D/3D + Pantógrafo auto-carga**
      — las 3 juntas, son una sola cadena. Implementado en `Presupuesto.jsx`:
      - Helper `anidadoKg(anidado)` calcula kg 3D (perfiles, ya tenían `kg_total` en el
        resultado del algoritmo 1D) y kg 2D (planchas — el algoritmo 2D solo daba
        `area_total_m2`, así que kg2D = `area_total_m2 × kg_m2` del grupo).
      - **Hierros**: nueva sección "🔗 Anidados vinculados" — botones toggle para
        seleccionar uno o más anidados existentes (`item.anidados_ids`), con resumen
        de Kg 3D / Kg 2D combinados debajo.
      - **Pantógrafo**: banner "🔗 Desde anidados vinculados" con botones
        "+ Corte 3D (X kg)" / "+ Corte 2D (Y kg)" que agregan una fila pre-cargada con
        el kg correspondiente y tipo seteado. Se agregó columna "Tipo" (2D/3D/—) a la
        tabla para clasificar filas manuales también.
      **Decisión de diseño no 100% literal al pedido original** — el pedido decía
      "en Hierros la selección de corte 2D/3D", pero como el kg viene de los anidados
      (no de las filas de Hierros), puse la selección de *anidados* en Hierros y dejé
      la clasificación 2D/3D explícita en Pantógrafo, que es donde efectivamente se
      necesita. Si Gino esperaba algo distinto (ej. marcar 2D/3D directamente por fila
      de Hierro), avisar para ajustar.
      Probado en navegador de punta a punta: anidado con 4164 kg perfiles (3D) + 706.5
      kg planchas (2D, verificado contra 9m²×78.5kg/m²) → vinculado en Hierros → 2
      botones de auto-carga en Pantógrafo → filas correctas → total 4870.5 kg,
      $4164 con USD/kg=1 en la fila 3D, propagado a todos los totales.

### P4 — infraestructura más grande, al final ✅ COMPLETO 2026-07-31
- [x] **Tarifario configurable** — módulo "Config" construido desde cero
      (`src/components/Config.jsx`), reemplaza el placeholder "próximamente".
      Gino corrigió el alcance a mitad de implementación: no es una lista fija de
      tarifas, es un **catálogo extensible por rubro** — se puede agregar cualquier
      ítem nuevo, no está limitado a las categorías originales.
      Estructura (`smeas_tarifario` en localStorage, helper `loadTarifario()`/
      `saveTarifario()` en `storage.js`): catálogos de listas editables para
      MO Fab, MO Mon, Materiales Generales, Terc. Fabricación, Terc. Montajes,
      Traslados (agregar/editar/borrar ítems libremente) + 4 tarifas sueltas
      (arenado USD/m², galvanizado USD/kg, pantógrafo 2D/3D USD/kg).
      **Conectado a Presupuesto** (todo con el criterio "el tarifario es el
      default de partida, el monto que el usuario tipeó en una fila siempre
      prevalece" — no se sobreescribe nada al cambiar el tarifario después):
      - MO Fab/Mon: el selector de categoría ahora sale del catálogo (ya no de
        una lista hardcodeada `MO_FAB_CATS`/`MO_MON_CATS`, que se eliminaron),
        y una fila nueva precarga el USD/hora del catálogo.
      - Mat. Generales, Terc. Fab, Terc. Mon, Traslados: nuevo selector
        "+ Desde catálogo (Config)..." (componente `QuickPick`) que agrega una
        fila precargada; sigue existiendo el botón para cargar una fila en blanco.
      - Trat. Superficie: "USD/m²" de arenado y "USD/kg" de galvanizado ahora
        muestran y calculan con el default del tarifario en vez del `10`/`0`
        hardcodeado de antes — encontré y corregí una inconsistencia real acá:
        el cálculo (`calcItem`) y el input visual usaban fuentes de default
        distintas (una hardcodeada, otra el tarifario) antes de que lo
        detectara probando en el navegador.
      - Pantógrafo: los botones "+ Corte 2D/3D" (de P3) ahora precargan el
        USD/kg configurado en vez de 0.
      Acceso: solo `admin` puede editar (`usuario.rol !== "admin"` → solo
      lectura); supervisor/vendedor ven el tarifario pero no lo modifican.
      Probado en navegador de punta a punta: configuré OFICIAL FAB=$5/h,
      Bulones M12=$0.5/u, galvanizado=$2/kg, pantógrafo 2D=$1/3D=$1.5 →
      verifiqué que las 4 conexiones (MO Fab, Mat. Generales vía QuickPick,
      Trat. Superficie, y la corrección del bug de display) funcionan.

### P5 — pedidos agregados 2026-07-31 (tarde), sin priorizar todavía
- [x] **Historial: filtro USD/kg en vez de Kg** — 2026-08-01. Confirmado con Gino: el Benchmark
      ya mostraba USD/kg Min/Prom/Max (no tocado). Lo que cambió fue el filtro de rango de la
      vista Tabla (`Historial.jsx`) — antes filtraba por `kg_total` mín/máx, ahora filtra por
      USD/kg calculado (`usd_total/kg_total`) mín/máx, más útil para encontrar outliers de
      precio. Probado en navegador: 2 trabajos (3 USD/kg y 20 USD/kg) → filtro 10-25 →
      solo queda el de 20, correcto.
- [x] **Filtro general cross-módulo** — 2026-08-01. Nuevo componente `Buscador.jsx` + tab
      propio "🔍 Buscar" al tope del sidebar (siempre visible, no anidado en Sistema).
      Busca en las 4 fuentes (Cómputos, Anidados, Presupuestos, Historial) a la vez por
      texto libre, cliente (solo matchea en Presupuesto/Historial, que son los únicos con
      ese campo — Cómputo/Anidado no tienen cliente, se documenta en la UI) y rango de
      fecha, con filtro rápido por tipo. Cada resultado es clickeable y navega directo al
      registro (nuevo mecanismo `smeas_ir_a_<tipo>` + efecto de montaje en cada módulo,
      mismo patrón que `smeas_anidar_pending`; nuevo helper `irATab()` en `App.js` que
      además sincroniza el grupo resaltado del sidebar — de paso corrigió una
      inconsistencia menor que yo mismo había introducido antes en `onNidar`/
      `onExportarPresupuesto`, que cambiaban de tab sin actualizar el grupo).
      Probado de punta a punta (con javascript_tool ante una falla del navegador de
      pruebas — ver nota abajo): buscar "CCFC" devuelve el cómputo y el anidado
      correctos, clic en el resultado del cómputo navega y abre su detalle directo.
      **Nota de sesión**: el `computer` tool (clicks reales) dejó de llegar a la página
      en un momento de esta sesión porque el navegador de pruebas no estaba
      renderizando visualmente; usé `javascript_tool` (dispatch de eventos DOM reales)
      como alternativa para poder seguir verificando sin bloquear el trabajo.
- [ ] **Integración Steel Measurement ↔ steelCRM**: exportar un presupuesto de Steel Measurement
      a steelCRM para redacción y seguimiento comercial desde ahí; sync de estado bidireccional
      (si en steelCRM se marca Aprobado/Rechazado/etc., debe reflejarse en Steel Measurement).
      **Actualizado 2026-08-15 — ya no es "recién a estudiar":** steelCRM
      (`C:\Users\Gino\Documents\steelcrm`) tiene código React funcionando, con 614 presupuestos +
      183 contactos reales de MMN importados desde Gestsoft, y el esquema mínimo de IDs
      compartido ya está acordado (ver `TAXONOMIA-COMPARTIDA-MMN.md` §7 — steelCRM genera `nro`,
      steel-measurement genera el código de cálculo, `idsCalc` como array en steelCRM soporta la
      relación muchos-a-muchos). Sigue pendiente la pregunta de transporte: ambos son client-only
      (localStorage, sin backend) — hace falta backend real o al menos un formato de export/import
      de archivo, similar al de backup, hasta que exista el backend compartido que menciona el
      CLAUDE.md de steelCRM.

---

## 9.6 TANDA GRANDE 2026-08-01 (Anidado ↔ Presupuesto, materiales unificados)

Pedido textual de Gino (resumen del pedido completo en el historial de chat):
"En anidado todavía no hay un botón para anidar todos los materiales de una sola
vez. No está la lista unificada de materiales ni la exportación a un presupuesto.
En cada material de un anidado falta seleccionar si la pieza va galvanizada. En
presupuesto se debe poder seleccionar un anidado pero en una lista desplegable,
no como se ve ahora. Y se debe cargar en el ítem del presupuesto todos los
materiales unificados que trae el anidado y sus selecciones (pintura, arenado,
corte, etc). Los materiales de los cómputos deben venir con el precio, proveedor,
etc, precargado. Se puede modificar cada ítem que se carga."

Todo lo pedido acá quedó **completo**:

- [x] **Anidado: flags de tratamiento por pieza (grupo)** — `Anidado.jsx`. Se agregó
      `fichaVacia()` (`{granallado, pintura, galvanizado}`) y componentes
      `FichaToggles`/`FichaBadges` a nivel de **grupo** (no por pieza individual —
      dentro de un grupo de anidado todas las piezas comparten el mismo material,
      así que el tratamiento es del grupo). Insertado en la vista colapsada y
      expandida tanto de `Grupo` (perfil/3D) como de `GrupoPlancha` (2D). Cambiar
      la ficha **no** resetea `resultado` (a diferencia de otros cambios de campo
      del grupo, que sí invalidan el resultado calculado).
- [x] **Anidado: botón "Calcular todo"** — nueva función `calcularTodo()` que corre
      `runFFD`/`run2DFFD` sobre todos los grupos del anidado activo de una sola vez
      (saltea grupos vacíos/inválidos), botón "⚡ Calcular todo (N)" en el header.
      Antes había que entrar grupo por grupo y calcular uno a la vez.
- [x] **Anidado: lista unificada de materiales + exportar a Presupuesto** — función
      `materialesUnificados(anidado)` suma kg por grupo ya calculado (perfiles:
      `resultado.resumen.kg_total`; planchas: `resultado.resumen.area_total_m2 ×
      kg_m2`, porque el algoritmo 2D no devuelve kg directo) e incluye la `ficha`
      de cada grupo. Vista de solo lectura `VistaMaterialesAnidado` (botón "📋
      Materiales unificados"), con nota que apunta al flujo real de importación
      (que vive del lado de Presupuesto, ver siguiente ítem — la exportación
      "real" es el dropdown + botón de import en Hierros, no un botón acá).
- [x] **Presupuesto: anidado vinculado como dropdown (no multi-select)** — en
      `TabHierros` (`Presupuesto.jsx`), la sección "🔗 Anidado vinculado" pasó de
      una lista de botones toggle (`item.anidados_ids`, array) a un `<select>`
      simple (`item.anidado_id`, string) — un ítem de presupuesto se vincula a
      **un** anidado a la vez, tal como pidió Gino. Función `anidadoKg()` se
      mantuvo igual (calcula kg 3D/2D del anidado seleccionado).
- [x] **Presupuesto: importar materiales + selecciones del anidado al ítem** —
      nueva función `materialesUnificadosAnidado(anidado)` (equivalente a la de
      Anidado.jsx pero vive en `Presupuesto.jsx` — quedaron duplicadas, ver nota
      de deuda técnica abajo) y botón "⬇ Importar materiales del anidado" (solo
      visible con un anidado seleccionado): agrega una fila de Hierros por cada
      grupo del anidado, con `kg_pieza`/`area_pieza_m2` desde el cálculo,
      `usd_kg` buscado en Biblioteca por nombre, y las 3 selecciones de
      tratamiento (`arena: !!ficha.granallado, pintura: !!ficha.pintura,
      galvanizado: !!ficha.galvanizado`) copiadas directo de la ficha del grupo
      de Anidado — así el usuario no tiene que re-marcar a mano en Presupuesto
      lo que ya marcó en Anidado.
- [x] **Cómputo: precio/proveedor precargado en export de materiales** —
      `agregarMaterialesGlobal()` (`Computo.jsx`) ahora también agrega, por
      material, un `usd_kg`/`proveedor` representativo: recorre las piezas de
      todos los cómputos y, cuando encuentra una `ficha.precio_raw` cargada con
      `precio_por === "kg"` (los precios por metro o m² no se pueden convertir a
      USD/kg automáticamente, quedan en 0 para completar a mano), se queda con
      el precio más reciente por `fecha_precio`, convirtiendo UYU→USD con el TC
      propio de cada cómputo (`comp.tc ?? tcGlobal`) si `ficha.moneda === "UYU"`.
      La vista `VistaMaterialesGlobal` (Cómputo) ahora muestra columnas "USD/kg"
      y "Proveedor" antes de exportar. Del lado de Presupuesto, `importarMateriales()`
      prioriza `m.usd_kg` (del cómputo) sobre el fallback de Biblioteca, y copia
      `m.proveedor`. Se agregó un campo `proveedor` nuevo al modelo de fila de
      Hierro (no existía antes) con su columna editable en la tabla de
      `TabHierros` — como pidió Gino, cada valor precargado (precio, proveedor,
      selecciones) se puede modificar libremente después de importar.
      Probado en navegador de punta a punta: cómputo de prueba con pieza HEB 160
      (ficha: precio 3.5 USD/kg, proveedor "Ferrer S.A.") → vista de materiales
      del cómputo muestra "U$S 3.50" / "Ferrer S.A." → exportado → importado a
      un ítem nuevo de un presupuesto de prueba → fila de Hierros con
      Nombre="HEB 160", Proveedor="Ferrer S.A.", USD/kg=3.5, subtotal
      507.6kg×3.5=$1776.60, todo en inputs editables. Datos de prueba limpiados
      de localStorage al terminar.

**Deuda técnica encontrada, no resuelta (falta de tiempo, no bloquea nada)**:
`materialesUnificadosAnidado()` en `Presupuesto.jsx` es casi un duplicado exacto
de `materialesUnificados()` en `Anidado.jsx` — se podrían unificar en un helper
compartido (ej. `src/utils/anidadoCalc.js`) el día que se toque este código de
nuevo.

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

**Dato clave para el LLM:** Gino valida contra la planilla Excel / GestSoft con datos reales. No avanzar al siguiente módulo hasta que los cálculos numéricos coincidan exactamente.

---

## 12. ANÁLISIS DE USUARIO FINAL — 2026-08-01

Recorrido completo de la app (Biblioteca → Cómputo → Anidado → Presupuesto →
Historial → Config → Buscador) usando datos de prueba realistas (el cómputo
"CCFC — Nave Industrial Sector A" del seed, 4755.57 kg / 3 ítems), como lo
haría un usuario nuevo de MMN el primer día. Objetivo: encontrar faltas,
incongruencias y mejoras de experiencia — no bugs de cálculo (esos ya se
verificaron caso por caso en cada tanda anterior).

### 🔴 Hallazgo más importante: la Biblioteca no trae precios y no hay forma de cargar un segundo usuario

Dos gaps estructurales, no bugs puntuales:

1. **Toda la Biblioteca de Materiales está sin precio.** 462 perfiles, 37
   planchas (y probablemente las planchuelas/rejillas también) muestran
   "⚠️ sin precio registrado". Como el USD/kg de Cómputo, la exportación de
   materiales, y la importación de anidados a Presupuesto dependen todos de
   buscar el precio en esta Biblioteca por nombre, **hoy cualquier flujo
   automático de precio va a devolver $0.00 silenciosamente** hasta que
   alguien cargue precios a mano. Ya existe un botón "Precio en lote" en
   Biblioteca — es el punto de partida obligado antes de que estos flujos
   automáticos aporten valor real. Sugerencia: guiar a Gino a cargar como
   mínimo los ~30-40 perfiles/planchas que realmente usa MMN (no los 462),
   y considerar una alerta visible (no solo el badge "—") cuando un ítem
   importado a un presupuesto quedó en $0/kg por falta de precio en origen.
2. **No hay pantalla para crear usuarios nuevos.** El login solo ofrece
   "Administrador" — `smeas_usuarios` en localStorage tiene un único
   registro hardcodeado. La lógica de roles (`admin`/`supervisor`/`vendedor`)
   sí existe y se usa en 2 lugares (`Config.jsx`: solo `admin` edita el
   tarifario; `ConfirmarEliminar.jsx`: solo `admin`/`supervisor` pueden
   confirmar borrados destructivos), pero es código muerto en la práctica
   porque no hay forma de generar una segunda cuenta desde la UI. Si
   "multi-usuario con roles" es una prioridad real a corto plazo, falta
   construir una pantalla de gestión de usuarios (alta/baja/cambio de rol y
   clave) — probablemente en Config, con acceso solo-admin.

### 🟡 Incongruencias menores encontradas

3. **La pintura marcada en un hierro importado desde Anidado no aporta m².**
   Cuando se importa un grupo de tipo "perfil" (3D) desde un anidado a
   Hierros, `materialesUnificadosAnidado()` (`Presupuesto.jsx`) siempre
   pone `sup: 0` para perfiles — el algoritmo de anidado 1D (`runFFD`) nunca
   calculó superficie, solo kg. Resultado: si marcás "Pint.? Sí" en una fila
   de perfil importada, el banner de "kg marcados para galvanizado" aparece
   bien (es por kg), pero el m² de esa fila para "Trat. Superficie → Usar
   auto" queda en 0 — la pintura de perfiles siempre hay que cargarla a mano
   en el campo "m² a pintar", el flag "Pint.?" en Hierros no la alimenta
   para ese caso. Esto es consistente con que Cómputo tampoco expone
   superficie de perfil hacia Anidado (`resumen.kg_total` sí, `sup` no) —
   el gap viene de una etapa antes. Si se quiere resolver bien, habría que
   propagar `sup_m2m`/superficie por metro lineal a través de todo el
   pipeline Cómputo → Anidado → Presupuesto, no es un fix de una línea.
   **✅ Corregido 2026-08-01** — ver §9.7.
4. **El formulario "Nuevo Trabajo" de Historial todavía pregunta "%
   H. Especiales"** en el desglose por rubro, un nombre que ya no existe en
   ningún otro lugar de la app desde que se sacó la pestaña "Horas
   Especiales" de Presupuesto (P1.3) a favor de "Tipo de hora" por fila de
   MO. El dato viejo (`item.horas_especiales`) se sigue sumando en
   presupuestos históricos por compatibilidad, así que el campo no está
   totalmente muerto, pero para un usuario nuevo que carga un trabajo manual
   sin pasar por un presupuesto viejo, "H. Especiales" es un término
   huérfano sin contexto.
   **✅ Corregido 2026-08-01** — ver §9.7.
5. **Recargar la página (F5) cierra la sesión siempre.** No hay ningún dato
   de sesión persistido (ni `localStorage` ni `sessionStorage`) — el usuario
   activo vive solo en estado de React. Esto es consistente con el diseño de
   "selección de usuario en una PC compartida", pero vale confirmarlo con
   Gino: si en la práctica un solo vendedor usa su notebook todo el día, un
   refresh accidental del navegador (o el botón "🧪 Seed datos prueba", que
   recarga la app) lo obliga a loguearse de nuevo cada vez.
   **✅ Corregido 2026-08-01** — ver §9.7.

### 🟢 Lo que funciona bien (validado en este recorrido, no solo por código)

- Cómputo → Anidado → Presupuesto es un flujo real y coherente: un cómputo
  de 3 ítems (4755 kg) se anida en un clic (5 grupos), cada grupo se calcula
  con "⚡ Calcular todo", los flags de tratamiento (Granallado/Pintura/
  Galvanizado) sobreviven a re-cálculos, y desde Presupuesto un solo botón
  "⬇ Importar materiales del anidado" trae las 5 filas de Hierros con kg,
  USD/kg (si hay precio en Biblioteca) y las 3 selecciones de tratamiento ya
  marcadas — cero recarga manual de lo que ya se decidió en Anidado.
  Pantógrafo también recibe los kg 2D/3D del mismo anidado con un clic.
- El precio/proveedor cargado en la "ficha" de una pieza de Cómputo viaja
  correctamente hasta la fila de Hierros de un Presupuesto (probado de
  punta a punta: USD/kg y proveedor llegan editables, no solo de lectura).
- La conversión "Presupuesto Aprobado → Historial" respeta el estado
  correctamente — no deja convertir un presupuesto en Borrador, con mensaje
  claro.
- El tarifario de Config es realmente el default (no pisa lo ya cargado) en
  los 4 flujos que lo consumen (MO, catálogos vía QuickPick, Trat.
  Superficie, Pantógrafo).

---

## 9.7 FIXES 2026-08-01 — las 3 incongruencias menores del análisis de usuario final

Pedido de Gino: "arranquemos por la 3" (la lista de 3 incongruencias menores
del §12). Las tres son independientes entre sí, se hicieron juntas.

- [x] **Pintura de perfiles ahora sí aporta m²** — la superficie de un perfil
      (`sup` en Biblioteca, m²/m para pintura, ya existía y se usaba en
      Cómputo) se perdía al pasar por Anidado porque `useBibliotecaLineales()`
      (`Anidado.jsx`) no la incluía en el mapeo, y los grupos de tipo "perfil"
      nunca guardaban `sup_m2m`. Se agregó `sup_m2m` en 4 lugares: el mapeo de
      biblioteca, `elegir()` (selección manual de material en un grupo), el
      importador automático de un cómputo completo (`importar()`), y el
      grupo vacío nuevo (`addGrupoPerf()`). Con eso, `materialesUnificados()`
      (Anidado.jsx) y `materialesUnificadosAnidado()` (Presupuesto.jsx)
      calculan `sup = m_total × sup_m2m` para perfiles — mismo criterio
      "total con desperdicio incluido" que ya se usaba para `kg_total`, no
      solo el metraje útil. **Compatibilidad**: los grupos de anidado que ya
      existían antes de este fix no tienen `sup_m2m` guardado (quedó en
      `undefined` → tratado como 0 por el fallback `||0`), así que van a
      seguir dando m²=0 hasta que alguien vuelva a seleccionar el material en
      ese grupo puntual (lo cual dispara `elegir()` de nuevo y lo completa).
      No hubo necesidad de migrar datos viejos porque no rompe nada, solo
      sigue sin aportar el dato hasta que se toque ese grupo.
      Probado en navegador de punta a punta: grupo de perfil IPE 200 con
      `m_total=12` y `sup_m2m=0.552` → importado a Presupuesto → fila de
      Hierros con `m²/pieza = 6.624` exacto (12 × 0.552).
- [x] **"H. Especiales" renombrado a "H. Especiales (legado)"** — en
      `RUBROS` (`Historial.jsx`, usado en el formulario "Nuevo Trabajo" y en
      la vista de detalle). Se dejó la key `k: "hesp"` sin tocar a propósito
      — es la misma key que usa `calcPresupuesto()` en `Presupuesto.jsx`
      (`rubros.hesp`) para la conversión 1:1 "Presupuesto Aprobado →
      Historial" (`auto_m4`); cambiar la key hubiera roto ese mapeo. Solo se
      tocó el label visible, no la estructura de datos. El bar del resumen
      de ítem en Presupuesto (`⏰ H. Especiales`, línea ~1086) se dejó igual
      a propósito — ahí sí tiene contexto real porque solo aparece cuando
      hay datos legado (`if (usd === 0) return null`), no es un campo
      huérfano en ese lugar.
- [x] **La sesión ya sobrevive un F5** — nuevo `SESION_USUARIO_KEY =
      "smeas_sesion_usuario_id"` en `sessionStorage` (`App.js`): se guarda el
      `id` del usuario logueado en un efecto (`useEffect` sobre `[usuario]`,
      se borra si `usuario` es `null`, ej. al usar "Cambiar usuario"), y el
      `useState` de `usuario` lo lee como inicializador perezoso, buscando
      ese id en `iUsuarios` (la lista ya cargada de localStorage al inicio
      del módulo). Se eligió `sessionStorage` (no `localStorage`) a propósito
      — sobrevive un refresh accidental dentro de la misma pestaña/ventana,
      pero se sigue pidiendo login si se cierra el navegador, que es el
      comportamiento esperado para una PC compartida entre vendedores.
      Probado en navegador: login → F5 → sigue en Cómputo como Administrador
      sin pasar por la pantalla de login.

Build limpio (`CI=true react-scripts build`, cero warnings) después de los 3 fixes.

---

## 9.8 FIXES 2026-08-01 — Tarifario cargado con datos reales de Gestsoft (MMN)

Gino compartió capturas de pantalla del sistema viejo de Montajes Núñez
(Gestsoft) con las tarifas reales: MO Fabricación/Montaje, Materiales
Generales, Traslados/servicios, Pinturas, Galvanizado, Interés financiero.
Se cargó todo como **default** del Tarifario (`TARIFARIO_DEFAULT` en
`src/utils/storage.js`) — no se tocó `localStorage`, así que solo aplica en
instalaciones nuevas o hasta que Gino guarde algo en Config (después de eso
el default queda congelado para esa instalación, mismo patrón que el resto
del tarifario).

- [x] **MO Fabricación** (5 roles) y **MO Montajes** (ampliado de 4 a 8
      roles, agregando Oficial/½ Oficial/Supervisor Construcción y
      Transporte a Obra/Complemento Montaje) — con las tarifas USD/hora
      reales.
- [x] **Materiales Generales** — 95 ítems reales (tornillería, rejillas,
      metal desplegado, chapas trapezoidales, resinas, isopanel, etc.),
      antes vacío.
- [x] **Terceriz. Fabricación** — 21 ítems (corte y plegado, curvado,
      cálculo estructural, ensayos, pruebas hidráulicas, tornería, soldadura
      de pernos Nelson, etc.), antes vacío.
- [x] **Traslados** — 23 ítems (grúas, chatas, transporte especial,
      viáticos, hospedaje, andamios, baño químico, generador), antes vacío.
      **Nota de clasificación**: la planilla de Gino mezclaba transporte y
      servicios tercerizados en una misma lista; se repartió por criterio
      propio entre `traslados` (logística/equipo de obra) y
      `terc_fabricacion` (procesos de taller/ensayos) — si algo quedó en el
      catálogo equivocado, es un simple editar-y-mover en Config, no rompe
      nada.
- [x] **Catálogo de Pinturas — nuevo** (`tarifario.pinturas`, 33 productos
      reales con USD/litro: Hempel, Interpon, Zinga, fondos, terminaciones).
      Antes Trat. Superficie no tenía QuickPick de pinturas, cada fila se
      cargaba 100% a mano. Se agregó `addPinturaDesdeCatalogo()` +
      `<QuickPick>` en `TabTrat` (Presupuesto.jsx), mismo patrón que
      Materiales Generales/Terceriz./Traslados. La "Rend x Lt" (rendimiento
      m²/L) que trae la planilla de Gino **no se cargó** — el modelo actual
      de fila de pintura no tiene ese campo (el usuario carga litros a
      mano); quedaría bien como mejora futura para auto-calcular litros
      necesarios a partir de m² a pintar.
- [x] **Interés financiero — nuevo catálogo + selector, sin romper lo
      viejo**: Gino pidió "las dos" opciones (tabla fija de Gestsoft + el
      % anual manual que ya existía). Se agregó `tarifario.interes_financiero`
      (14 plazos: 30/60/90/120/150/180 días × USD/UYU, + "Sin interés" +
      "120 días factoring", cada uno con su % ya definido) y un
      `<select>` "+ Desde tabla de plazos (Config)..." arriba de los campos
      manuales en el bloque Interés financiero de Presupuesto — al elegir un
      plazo, carga `interes_pct` + `interes_dias` en un solo `onChange`
      (no se tocó el campo `interes_pct` que ya usa `calcPresupuesto()`,
      así que el cálculo de dinero es exactamente el mismo de siempre). Los
      campos manuales siguen ahí y se pueden editar después de elegir del
      dropdown, o ignorarlo del todo y tipear a mano como antes.
      **Bug encontrado y corregido en el momento**: el primer intento
      llamaba a `set()` dos veces seguidas (una para `interes_pct`, otra
      para `interes_dias`) — como `set` arma el objeto nuevo a partir del
      `pres` del closure (no de forma funcional), la segunda llamada pisaba
      el cambio de la primera y el % quedaba en 0. Se corrigió llamando a
      `onChange({...pres, interes_pct, interes_dias})` una sola vez. Se
      verificó en navegador: elegir "120 días — UYU (6.7%)" deja
      `% anual=6.7` y `Días plazo=120` los dos correctos.
      **Configuración nueva en Config.jsx**: componente `CatalogoInteres`
      (nombre + moneda + días + %), tarjeta "📅 Interés financiero (por
      plazo)".
- [x] **Galvanizado** — `galvanizado_usd_kg` default pasó de 0 a 1.00
      (tasa "común" de Gestsoft). La tasa de "roscas" (2.15 USD/kg, un caso
      puntual de piezas roscadas galvanizadas) no se cargó como tasa global
      — queda para cargar como ítem de Materiales Generales si hace falta,
      no vale la pena duplicar el campo global del Tratamiento de
      Superficie por un caso especial.

**Biblioteca de precios (hierros) — arrancada, con un bug de fondo corregido:**

- [x] **Bug crítico encontrado y corregido**: `mergeSeed()` en
      `BibliotecaMateriales.jsx` pisaba `precio_usd_kg` a `0` SIEMPRE al
      migrar/agregar un ítem nuevo del seed, sin importar qué valor trajera
      el literal del seed (`{ ...p, precio_usd_kg: 0, ... }`). Esto
      significa que, ANTES de este fix, cargar precios reales directamente
      en `PERFILES_DATA`/`PLANCHUELAS_DATA`/`PLANCHAS_DATA` no hubiera
      funcionado para nadie — el precio se hubiera perdido igual en el
      primer load. Se cambió a `precio_usd_kg: p.precio_usd_kg || 0` (2
      lugares) para que el seed pueda traer un default real, sin afectar
      el comportamiento para usuarios que ya tienen datos guardados (esos
      siguen intactos, este fix solo cambia qué pasa con ítems nuevos).
- [x] **HEB** (13 de 19 tamaños con precio real), **HEA** (1 de 19, solo
      HEA 360 aparecía en las capturas), **IPN** (19 de 20) y **UPN** (13
      de 17) cargados con los USD/kg reales de Gestsoft — verificado en
      navegador con biblioteca "de instalación nueva" (localStorage
      limpio): 45 ítems con precio real, matcheado por altura nominal
      (ej. "IPN 10" de Gestsoft = `IPN100` del seed, mismo criterio en
      HEB/UPN).
- [x] **Segunda pasada — cargados en esta sesión** (330 de 577 ítems del
      total Perfiles+Planchuelas+Planchas, subiendo de 45): Ángulo (25/55,
      solo los tamaños en pulgadas que aparecían en las capturas — los
      métricos 30x30...200x200 quedan en 0, Gestsoft no los mostró),
      **Tubo cuadrado/rectangular/redondo — 116 de 116, el 100%** (precio
      uniforme 1,27 USD/kg confirmado en decenas de filas reales, con
      1,33 para 150x150/200x200 cuadrado y 200x100 rectangular en
      adelante), Caño SCH40 (13/14) y SCH80 (8/13) matcheados por
      pulgada+mm exactos, Redondo macizo en pulgadas (9/10, usando el
      precio "genérico" de Gestsoft cuando había dos calidades para el
      mismo tamaño — SAE1045/1020 no distinguido, la Biblioteca tampoco
      tiene ese campo), Cuadrado macizo (5/12, solo los tamaños con match
      mm exacto o casi exacto), W americanas (11/21), **Planchuelas — 78
      de 78, el 100%** (`mkPL()` ahora calcula un precio representativo
      por ancho: 1,17 USD/kg hasta 80mm, 1,22 desde 100mm — patrón
      confirmado en ~90 filas reales de Gestsoft), Planchas (20/37,
      matcheadas por espesor real en mm contra "PLANCHAS DE HIERRO LISO"
      y "CHAPA DECAPADA" de Gestsoft, ignorando el número de calibre
      porque los estándares de calibre no coinciden entre sistemas).
      **Nota importante sobre Malla/Metal Desplegado/Rejillas**: los
      precios que mandó Gino para estos ya habían quedado cargados en
      `mat_generales` del Tarifario en la tanda anterior (§9.8) — no hacía
      falta repetirlos acá, la Biblioteca de perfiles no es donde viven.
- [x] **Tercera pasada — Perfil C real + 2 categorías nuevas** (306 de 536
      ítems de Perfiles, subiendo de 232):
  - **Perfil C: 42 ítems nuevos** (`GN_PERFILC_*`) con la granularidad real
    de Gestsoft — 9 familias de dimensión (100-44-14, 100-60-20, 120-53-17,
    120-65-18, 140-55-18, 140-70-20, 160-60-20, 180-50-20, 240-65-24,
    80-54-14) × Decapado 2,0/2,5mm o Zincgrip 1,24/1,5/2,0/2,5mm según lo
    que mostraba cada planilla, todos con `cat:"Perfil C conformado"` para
    que aparezcan junto a los 13 genéricos que ya existían. El campo `sup`
    (superficie de pintura) se calculó con la fórmula que ya usa el resto
    de "Perfil C conformado" en el seed (`2×(alto+2×ala+2×labio)/1000`,
    verificada contra 2 ítems existentes antes de aplicarla a los nuevos).
    Dos filas de origen tenían valores de kg/m repetidos entre espesores
    distintos en la planilla de Gestsoft (140-55-18 DECAPADO 2,0 y 2,5 con
    el mismo kg/m; 140-70-20 y 160-60-20 ZINCGRIP con un caso similar) —
    se cargaron tal cual estaban en la fuente, sin "corregirlos", por si
    ese kg/m menor a mayor espesor es un error de picada real que Gino
    prefiera revisar él mismo contra la planilla original.
  - **Categoría nueva "Caño Cédula"** (`cat:"Caño Cédula"`, 23 ítems) —
    para "CAÑO CON COSTURA... CÉDULA 20/40" de Gestsoft, que es un
    producto distinto de Caño SCH40/80 (más liviano, tubo con costura en
    vez de sin costura) y no tenía categoría propia.
  - **Categoría nueva "U Chico"** (`cat:"U Chico"`, 5 ítems: 40x20x5,
    50x25x5, 50x38x5, 60x30x6, 65x42x5,5) — perfil U más robusto que
    "Perfil U conformado" (que es chapa doblada fina, 1,5-3mm), tampoco
    tenía categoría propia.
  - Ambas categorías nuevas agregadas también al filtro `CATS` de la UI de
    Biblioteca (antes solo eran 23 categorías fijas en un array, sin eso
    los ítems nuevos existían en los datos pero no aparecían al filtrar).
  - Verificado en navegador con instalación limpia: 536 ítems totales en
    Perfiles (era 462), 306 con precio real (era 45 al empezar la sesión).
- [x] **Cuarta pasada — Chapa Galvanizada delgada + Redondo liso**
      (2026-08-01, a partir de una relectura de fotos 4 y 11 que Gino
      señaló que sí tenían dato aprovechable):
  - **Chapa Galvanizada — categoría nueva, 10 ítems** (`GN_CHAPA_GALV_*`,
    N12 a N30, 0,31mm a 2,52mm). No existía ningún ítem de chapa
    galvanizada por debajo de 3,18mm en el seed. A diferencia del resto
    de Planchas (que usan `mkPA()` y calculan `kg_m2 = espesor×7,85`), acá
    se cargaron como objetos literales con el `kg_m2` **real** que reportó
    Gestsoft (ej. N12: 22,12 kg/m² vs 2,52mm×7,85=19,78 de la fórmula
    genérica) — la diferencia es el recubrimiento de zinc, que sí pesa.
    Usar la fórmula genérica ahí hubiera subestimado el peso real ~10%.
  - **Redondo liso — 10 de 31 ítems** (6,8,10,12,14,16,20,22,25,32mm,
    todos a 1,52 USD/kg): la sección "REDONDO" (no solo "REDONDO
    CONFORMADO") de Gestsoft es diámetro en mm, igual que "Redondo liso"
    del seed — antes se había mapeado por error solo contra la categoría
    "Redondo" en pulgadas, dejando esta en 0. 18 y 28mm no tenían dato en
    las capturas, quedan en 0.
  - Verificado en navegador con instalación limpia: Perfiles 316/536 con
    precio (era 306), Planchas 30/47 (era 20, +10 galvanizadas +10 de la
    Plancha 1 1/4"/1 3/4" que ya estaban contadas antes).
- [ ] **Sigue pendiente** (~220 ítems, sin dato real confiable): HEA (solo
      1 de 19), IPE (0, no apareció en ninguna captura), Cajón UPN, Barra
      conformada, Hexagonal, T, Perfil U conformado, Caño Galvanizado,
      Redondo liso 18/28mm. Si Gino manda más capturas de estas categorías
      puntuales, se cargan igual que las anteriores.

Build limpio (`CI=true react-scripts build`, cero warnings) después de todos los cambios de esta sección.

---

## 9.9 Gestión de usuarios (2026-08-01)

Pantalla de alta/edición de usuarios en Config, admin-only, pendiente desde
el análisis final de usuario final (§12 — "no hay forma de dar de alta un
vendedor o supervisor sin editar `localStorage` a mano").

- **`Config.jsx`**: nueva card "👤 Usuarios" (ancho completo, arriba del
  grid del tarifario). `GestionUsuarios` + `FilaUsuario` — cada fila tiene
  emoji (texto libre, 1-2 caracteres), nombre, rol (`<select>` admin/
  supervisor/operario, etiquetados Administrador/Gerencia/Vendedor igual
  que en el login) y clave (input `password` con ojito mostrar/ocultar,
  mismo patrón que `Login`). Reutiliza `ModalConfirmarEliminar` para
  borrar un usuario (pide contraseña de Administrador, igual que borrar
  cualquier otra cosa en el sistema — sin `window.confirm`).
- **Guardrail**: no se puede eliminar el último usuario con `rol:"admin"`
  — el botón 🗑 queda deshabilitado con tooltip "No podés eliminar el
  último Administrador" (`esUltimoAdmin = u.rol==="admin" && admins.length<=1`).
  Sin este freno, un admin podría borrarse a sí mismo (o al único admin
  que queda) y dejar la app sin nadie que pueda entrar a Config, Backup o
  aprobar borrados.
- **`App.js`**: `<Config usuario={usuario} usuarios={usuarios} setUsuarios={setUsuarios} />`
  — antes `Config` no recibía `usuarios`/`setUsuarios`, solo el `usuario`
  logueado; el estado ya vivía en `App` (se guarda en `smeas_usuarios` vía
  el `useEffect` que ya existía), solo hacía falta pasarlo.
- Sin hash de contraseña ni backend — coherente con cómo ya se manejan las
  claves en todo el resto del sistema (texto plano en `localStorage`,
  aceptable para una PC compartida entre el equipo de MMN, no para un
  SaaS multi-tenant expuesto a internet; si el proyecto avanza a ese punto
  hay que revisar esto junto con el resto de la migración a backend).
- Probado de punta a punta en navegador: alta de "Juan Vendedor" (rol
  Vendedor, clave 1234) desde Config → aparece en la pantalla de login →
  contraseña incorrecta rechazada → contraseña correcta entra → Config le
  muestra el banner "Solo lectura" y oculta todos los botones de editar/
  eliminar (tarifario y usuarios) → botón "⬆️ Restaurar backup" no
  aparece en el sidebar para ese rol, consistente con `puedeEliminar()`.
  Usuario de prueba borrado al final.

Build limpio (`CI=true react-scripts build`, cero warnings).

---

## 9.10 Tanda grande 2026-08-02 — conexión anidado↔presupuesto↔cómputo, bug crítico de precios en 0, reestructura de Insumos y Precios, agrandado general

Sesión larga con muchos pedidos encadenados. Resumen por tema:

### Galvanizado en Cómputo + conexión completa anidado→presupuesto
- **Cómputo**: `fichaVacia()` ahora incluye `galvanizado`/`pct_galvanizado`, con su
  toggle en `FichaDrawer` (mismo patrón que Granallado/Pintura) y badge en la
  ficha y en la fila compacta de la tabla de piezas.
- `agregarMaterialesGlobal()` (export "Materiales" de Cómputo) ahora agrega
  también `granallado`/`pintura`/`galvanizado` por material (true si CUALQUIER
  pieza de ese material los tenía marcados), y `importarMateriales()` en
  Presupuesto ya no los fuerza a `false` — los usa para setear `arena`/
  `pintura`/`galvanizado` en la fila de Hierros importada.
- **`materialesUnificados`/`materialesUnificadosAnidado`** (Anidado.jsx y
  Presupuesto.jsx) ahora devuelven también `unidades` (barras/hojas útiles +
  desperdicio), `precio_usd_kg` (de Biblioteca) y `precio_total` — se ven en
  la tabla "Materiales unificados" de Anidado y alimentan el panel "🔗
  Anidado vinculado" de Presupuesto (barras/hojas a comprar, m² a arenar, m²
  a pintar, kg a galvanizar, todo visible ANTES de importar).

### Bug crítico: "no se traen los precios" / m² y USD en 0
Causa raíz real (confirmada con capturas de Gino): **datos creados antes de
que yo cargara precios reales a la Biblioteca, o antes del fix de `sup_m2m`,
nunca se actualizan retroactivamente** — ni migrando el seed ni recalculando,
porque `mergeSeed` protege a propósito cualquier valor ya guardado (aunque
sea 0) para no pisar ediciones del usuario.
- **Fix 1 — `sup_m2m` fallback**: `materialesUnificados`/
  `materialesUnificadosAnidado` ahora, si el grupo no tiene `sup_m2m`
  guardado, lo buscan en la Biblioteca por `material_id`/nombre al vuelo. No
  hace falta migrar nada, se calcula bien apenas se lee.
- **Fix 2 — sync de precios por defecto**: nuevo botón "🔄 Actualizar N
  precios nuevos" en Perfiles/Planchuelas/Planchas/Rejillas (solo aparece si
  hay ítems con `precio_usd_kg=0` que el seed sí tiene cargado) —
  `sincronizarPreciosDefault()` solo toca ítems en 0, nunca pisa un precio
  real que el usuario ya haya puesto.
- Probado de punta a punta simulando exactamente el caso de Gino (Biblioteca
  con HEB160 en 0 + anidado sin `sup_m2m`): m²/pieza pasó de 0 a 7.68 con el
  fallback, confirmado en navegador.
- **Bug aparte, mismo síntoma**: cambiar la categoría en una fila de MO
  Fab/Mon no actualizaba el USD/hora (quedaba con el rate de la categoría
  anterior) — arreglado en `TabMO`.

### % de desperdicio (Anidado + Presupuesto)
- Anidado: en la fila colapsada de cada grupo, "b.útiles/b.desp/total" y
  "hojas desp/m² desp" ahora son mucho más grandes (14-16px, antes 12), más
  un badge nuevo "⚠ X% desp." por material.
- Presupuesto: nueva columna "% Desp." en Hierros (solo se completa en filas
  importadas de un anidado, calculado como `1 - kg_útil/kg_total` del grupo).
  Total ponderado por kg en el pie de tabla del ítem, y badge de "%
  desperdicio general" tanto en el resumen del ítem como en el resumen
  general del presupuesto (`calcItem`/`calcPresupuesto` ahora devuelven
  `pct_desperdicio`).

### Dashboard de rubros con USD/kg
`BarraRubro` ahora acepta `kg` y muestra, además de $ y %, cuántos USD/kg del
total representa ese rubro. Nuevo componente `ResumenRubros` (compartido)
reemplaza la lista de 9 `<BarraRubro>` repetida — se usa tanto en el
resumen general del presupuesto como en una pestaña nueva "📊 Resumen"
dentro del editor de rubros de cada ítem (antes solo existía a nivel
presupuesto completo, no por ítem).

### Insumos y Precios — reestructura completa
- Ya no es una sola pestaña "Tarifario" con tarjetas — ahora es **una
  pestaña por rubro**: Materiales, MO Fab., MO Mon., Mat. Generales, Terc.
  Fab., Terc. Mon., Traslados, Pinturas, Interés Fin., Trat. Superficie,
  Pantógrafo (11 pestañas).
- "Materiales" agrupa Perfiles/Planchas/Planchuelas/Rejillas como
  sub-pestañas dentro de una sola pestaña top-level.
- Cada catálogo (`CatalogoEditable`) tiene su propio filtro de búsqueda, y
  ahora también un botón "📝" por fila que despliega Proveedor/Fecha del
  precio/Observaciones — corresponde al pedido de que cualquier alta de
  material/traslado/tercerizado tenga dónde anotar esos datos.
- Materiales Generales de Presupuesto (`TabMatGenerales`) sumó columnas
  Proveedor y Observaciones (Traslados y Terc. Fab/Mon ya las tenían vía
  "detalle"/"empresa"; Cómputo ya las tenía en la ficha).
- **Precio en lote** ahora respeta el filtro activo (búsqueda + categoría)
  en las 4 fichas de materiales — se puede aplicar un precio solo a "las
  planchas galvanizadas" o "los perfiles IPN" filtrando primero.
- Se agregaron 2 precios de Plancha que faltaban en la foto reenviada
  (2 1/2" y 3", 1.26 y 1.46 USD/kg).

### Otros cambios de esta tanda
- Subtítulo del sidebar: "Metraje · Metalúrgica" (se sacó "ERP").
- Cómputo: eliminado el botón "Materiales (todos los cómputos)" y su panel
  (`agregarMaterialesGlobal`/`VistaMaterialesGlobal` borrados del todo).
- Cómputo: nuevo filtro de cabecera (nombre/cliente/N° + rango de fechas) —
  se agregó campo `cliente` a los cómputos, que antes no existía.
- Anidado: nuevo filtro de cabecera (nombre/cliente/obra + rango de fechas)
  — se agregaron campos `cliente`/`obra` a los anidados.
- **Agrandado general**: `INP`/`TH`/`TD`/`BDG`/`BTN` en `colors.js` subieron
  1-2px de base (cascada a casi toda la app). Además, agrandados a mano los
  números "generales" más importantes: TOTAL USD del presupuesto (22→28px),
  badges de kg/$/USD-kg de cada ítem (12→14px), tarjetas de Cómputo (Total
  kg/Superficie, 18→22px y 17→20px), resumen de pieza en la ficha de Cómputo
  (16→19px), KPIs de Historial (Kg totales/USD total/USD-kg real/Kg-h real,
  18→22px) y su barra de % por rubro (11→13px).

### Pendiente / no verificado con screenshot esta vez
- La captura de pantalla (`computer{screenshot}`) falló por una falla de la
  herramienta del navegador (no es un error de la app) — todo lo de esta
  sección se verificó por build limpio + lectura de texto/DOM vía
  `javascript_tool`, no visualmente. Vale una revisión visual rápida de
  Gino, en particular el agrandado general, por si algún bloque quedó
  apretado en pantallas chicas.
- "Cuando se presiona Listo en un ítem, debe volver a la pantalla anterior"
  — probado en navegador, el comportamiento actual YA hace eso (cierra el
  modal, vuelve a la lista de ítems). No se encontró el bug reportado; si
  Gino ve algo distinto, hacen falta los pasos exactos para reproducirlo.
- Botón "+ Agregar usuario" en Config y el flujo de historial de precios —
  confirmados existentes y funcionando en el código; si Gino no los ve,
  probablemente sea caché del navegador o no estar logueado como
  Administrador (el botón es admin-only).

Build limpio (`CI=true react-scripts build`, cero warnings) en cada paso de
esta tanda.

---

## 9.11 Tanda 2026-08-02 (tarde) — históricos reales, monto por ficha en Anidado, Tercerización unificada

### Históricos de Historial — el gap real
Gino reportó dos veces "no cargaste los históricos" y "falta el USD/kg". Investigando:
el archivo `steel-measurement-historial-real-MMN.json` (239 registros reales de
"Datos de fabricación.xlsx", generado el 2026-07-31) seguía en el scratchpad de
la sesión — **nunca se había cargado a la app, solo se había entregado como
descarga**. El USD/kg en realidad siempre existió en Historial (columna de la
tabla + KPI), pero con la tabla vacía no había nada que mostrar, lo cual
generó la confusión de "falta".
- Nuevo `src/utils/historialSeed.js` — exporta `HISTORIAL_SEED`, los 239
  registros reales tal cual estaban en el backup (mismo formato que usa
  `restoreBackup`, ya validado contra el shape que espera `Historial.jsx`).
- `Historial.jsx` ahora usa `HISTORIAL_SEED` como default de
  `loadLS("smeas_historial", ...)` en vez de `[]` — mismo patrón que los
  precios por defecto de la Biblioteca: si el usuario ya tiene datos
  guardados, no se pisan; si no tiene nada, arranca con el histórico real.
- Verificado en navegador con `smeas_historial` limpio: "239 trabajos
  registrados", 32 categorías en el filtro, columna USD/KG con valores reales
  (3.94, 4.60, 5.06...).

### Anidado — monto por ficha
`Grupo` (perfil/3D) ahora también muestra un badge "$X" (kg total del grupo ×
USD/kg de Biblioteca) junto a los badges de barras/desperdicio/% que ya
estaban. Requirió agregar `precio_usd_kg` a `useBibliotecaLineales()`, que
antes no lo traía.

### Insumos y Precios — Tercerización unificada + tratamientos/cortes extensibles
- **Terc. Fabricación y Terc. Montajes se unificaron en una sola pestaña
  "🏭 Tercerización"** (`tarifario.terceros`, nuevo). El editor de rubros de
  Presupuesto sigue teniendo pestañas separadas "Terc. Fab."/"Terc. Mon."
  (son rubros de costo distintos), pero ambas ahora eligen del MISMO catálogo
  de referencia. Migración automática en `loadTarifario()`: si un tarifario
  guardado no tiene `terceros` todavía, se arma uniendo
  `terc_fabricacion`+`terc_montajes` la primera vez que se carga — no hace
  falta que el usuario haga nada.
- **"Otros tratamientos" / "Otros cortes"** — Trat. Superficie y Pantógrafo
  ahora tienen, además de sus 2 campos fijos de siempre (que son los que
  realmente calcula Presupuesto), un catálogo extensible abajo para anotar
  precios de referencia de tratamientos/cortes que no sean los 2 fijos (ej.
  Metalizado, corte láser). Aclarado en la UI que estos "extra" todavía NO
  se auto-calculan en el ítem — para cobrarlos hoy hay que cargarlos en
  Trat. Superficie → Pinturas del ítem (que sí es una lista libre). No se
  tocó `calcItem`/`TabTrat` para no arriesgar romper el cálculo existente.
- **Todos los catálogos (`CatalogoEditable`) rediseñados**: Proveedor/Fecha
  del precio/Observaciones ahora están SIEMPRE visibles en la fila (antes
  había que abrir un toggle "📝"), y los contenedores usan todo el ancho
  disponible en vez de `maxWidth:560/380`.

Build limpio (`CI=true react-scripts build`) en cada paso.

### Todavía pendiente (pedido explícitamente, no implementado aún)
- Presupuesto → fila de Hierros: el campo "Nombre" es texto libre (no un selector de Biblioteca), así que su marca "sin precio" sólo mira el `usd_kg` propio de la fila, no si ese nombre existe en Insumos y Precios.

## §9.12 — Cliente centralizado, marca "sin precio" en selectores, buscador propio en Insumos y Precios (2026-08-02)

- **Cliente como lista centralizada con autocompletado**: `loadClientes()`/
  `registrarCliente()` nuevas en `storage.js` (dedup case-insensitive).
  Datalist HTML5 global (`#clientes-datalist`) montado una sola vez en
  `App.js`; los campos "Cliente" de Cómputo, Anidado y Presupuesto (alta y
  detalle) usan `list="clientes-datalist"` + `onBlur` que registra el
  nombre tipeado. Autocompletado nativo del navegador, sin librería.
- **Marca "⚠ sin precio" en selectores de material**: el `Combobox` de
  Cómputo y el de Anidado (implementaciones separadas) ahora muestran un
  `⚠` junto a cada opción de la lista y junto al valor ya seleccionado
  cuando el material no tiene `precio_kg`/`precio_usd_kg` cargado en
  Insumos y Precios. `useBibliotecaPlanchas()` (Anidado) ganó el campo
  `precio_usd_kg` que le faltaba para esto. En la fila de Hierros de
  Presupuesto (campo libre, no selector) se agregó la misma marca pero
  evaluando el `usd_kg` propio de la fila.
- **Buscador propio de Insumos y Precios**: input en la cabecera del
  módulo que busca por nombre en los 4 catálogos de materiales físicos
  (perfiles/planchas/planchuelas/rejillas) y en los 8 catálogos de
  tarifario (MO Fab/Mon, Mat. Generales, Tercerización, Traslados,
  Pinturas, Trat. Superficie extra, Pantógrafo extra) a la vez —
  independiente del buscador global de la app. Los resultados muestran
  rubro y precio (o "⚠ sin precio"); al hacer clic se navega a la
  pestaña/sub-pestaña correcta. El sub-tab de Materiales (Planchas/
  Perfiles/Planchuelas/Rejillas) se subió de estado local de
  `SeccionMateriales` a estado del componente raíz para que el buscador
  pueda saltar directo a la sub-pestaña correcta.

Build limpio en cada paso; verificado en navegador con datos de prueba
(seed): marca "sin precio" confirmada en HEB 340+ (sin precio) vs HEB 100
(con precio) tanto en Anidado como en la fila de Hierros de Presupuesto;
buscador probado con "HEB" (18 resultados en Perfiles) y clic-para-navegar
confirmado.

- **Historial → Biblioteca con confirmación previa**: al cambiar el estado
  de un presupuesto a "Aprobado", se comparan los `usd_kg` realmente
  cargados en las filas de Hierros del ítem contra el `precio_usd_kg`
  actual de cada material en Insumos y Precios (busca por nombre en
  perfiles/planchuelas/planchas). Si hay diferencias, se muestra un
  `window.confirm` con el detalle línea por línea (nombre, precio actual →
  precio nuevo) — **nunca se actualiza en silencio**, tal como pidió el
  usuario ("preguntar siempre antes"). Si confirma, actualiza
  `precio_usd_kg` y agrega una entrada a `historial_precios` con
  proveedor `"Presupuesto <nro>"` y la fecha de hoy. Si cancela, no se
  toca nada — el cambio de estado del presupuesto sigue adelante igual
  (la confirmación sólo gatea la sincronización de precios, no la
  aprobación en sí). Verificado en navegador: camino de aceptar (HEB 340
  $0.00→$2.45, historial_precios con proveedor "Presupuesto P-001") y
  camino de rechazar (precio queda sin tocar) ambos probados con
  `window.confirm` interceptado.

- **Filtros independientes por campo** (Cómputo, Anidado, Presupuesto,
  Historial): el campo de búsqueda combinado (nombre+cliente+obra en un
  solo texto) se separó en un input por campo, todos combinables a la vez
  (AND lógico):
  - Cómputo: Nombre/N° · Cliente (con autocompletado `clientes-datalist`) · Desde/Hasta.
  - Anidado: Nombre · Cliente · Obra · Desde/Hasta.
  - Presupuesto: Nombre/N° · Cliente · Obra · Desde/Hasta (antes no tenía
    rango de fechas en la lista, se agregó).
  - Historial: Cliente · Obra · N° OT · Categoría (dropdown, ya existía) ·
    Desde/Hasta (nuevo) · USD/kg mín/máx (ya existía).
  Verificado en navegador: Cómputo filtra "1 de 1" por nombre y "0 de 1"
  por cliente (el cómputo seed no tiene cliente cargado — correcto);
  Historial filtra 239→33 registros al buscar cliente "Saceem".

- **Tooltips para términos técnicos** (respuesta a la pregunta pendiente
  "¿cómo resolvemos la falta de ayuda para términos como % desperdicio o
  USD/kg?"): se usó el mismo mecanismo liviano que ya usa el resto de la
  app (`title` nativo del navegador, sin librería nueva ni sistema de
  onboarding aparte) en las cabeceras de columna y badges que muestran
  estos términos — Anidado (badges "% desp." e "incidencia%" en fichas de
  perfil y plancha), Presupuesto (columna "% Desp." y "USD/kg" de
  Hierros, "$/kg" de `BarraRubro`, cajas de "% desperdicio general" a
  nivel presupuesto e ítem) e Historial (columna "USD/kg" de la tabla y
  "USD/kg Min/Prom/Max"/"Kg/h Min/Prom/Max" del benchmark). Verificado en
  navegador que el atributo `title` se renderiza correctamente.

## §9.13 — Auditoría de pendientes: gaps reales encontrados y corregidos (2026-08-03)

El usuario señaló que había pedidos anteriores sin implementar del todo.
Auditoría de la conversación completa contra el código actual encontró:

- **GrupoPlancha (Anidado) sin "monto" ni "kg desperdicio"**: el pedido
  explícito era "cada ficha debe mostrar la cantidad de kgs útiles, kgs de
  desperdicio, monto y % de desperdicio" — la ficha de PERFIL 3D
  (`Grupo`) tenía las 4 métricas, pero la de PLANCHA 2D (`GrupoPlancha`)
  sólo mostraba m² de desperdicio (no kg) y no tenía badge de monto en
  USD. Corregido: se agregaron `kg_total`/`kg_desp` (derivados de
  `area_total_m2`/`area_desp_m2` × `kg_m2`) y el badge `$monto` (kg_total
  × `precio_usd_kg` de la plancha en Biblioteca), mismo patrón que
  `Grupo`. Verificado en navegador: con una plancha sin precio el badge
  de monto no aparece (correcto); asignando una plancha con precio real
  ($0.99/kg) el badge muestra "$333.06" = 336.42 kg × $0.99, y "kg desp
  219.79 / kg total 336.42" — matemática correcta.

- **Proveedor / Fecha del precio / Observaciones incompletos en los
  ítems de Presupuesto**: el pedido decía "tanto en la base de datos
  como en un presupuesto o computo o anidado" debía tener ese trío de
  campos. La base de datos (Insumos y Precios) y Cómputo ya lo tenían
  completo; en Presupuesto sólo `Mat. Generales` tenía los 3 campos.
  Corregido en las 4 pestañas de rubro restantes:
  - `TabHierros`: agregado `fecha_precio` + `obs` (tenía sólo proveedor).
  - `TabMatGenerales`: agregado `fecha_precio` (tenía proveedor + obs).
  - `TabTerc`: agregado `fecha_precio` (tenía empresa=proveedor + detalle=obs).
  - `TabTraslados`: agregado `proveedor` + `fecha_precio` (tenía sólo detalle=obs).
  `TabPanto` se dejó sin proveedor/fecha porque es corte interno
  (pantógrafo propio), no un insumo de terceros — ya tenía "detalle".
  Cada tabla ganó columnas nuevas y los `colSpan` de la fila de
  TOTALES se recalcularon para no desalinear las columnas de subtotal.
  Verificado en navegador con matemática exacta en las 4 pestañas
  (10kg×$2.45=$24.50 Hierros, 5×$2.50=$12.50 Mat.Generales,
  10×$3=$30.00 Terc., 4×$25=$100.00 Traslados) — todas correctas.

- **Filtro "Tipo" faltante**: el pedido original listaba explícitamente
  "(fecha, tipo, cliente, etc)" como ejemplos de filtros independientes.
  Cómputo/Anidado no tienen concepto de "tipo", pero Presupuesto (tipo:
  Fabricación/Montaje/Fab+Mont) e Historial (`tipo_trabajo`, mismos 3
  valores) sí lo tienen y no estaba filtrable. Agregado un `<select>`
  "Todos los tipos" a ambas listas, combinable con el resto de filtros.

- **Anidado sin campo de observaciones**: el pedido decía "en un
  presupuesto o computo o anidado" — Cómputo ya tenía proveedor/fecha/obs
  por ficha de pieza, Presupuesto ya quedó cubierto en el punto anterior,
  pero los grupos de Anidado (`Grupo` perfil y `GrupoPlancha` plancha)
  sólo tenían los 3 toggles de tratamiento (`fichaVacia`), sin ningún
  campo de texto. Se agregó `g.obs` (input junto a los toggles, mismo
  placeholder "Observaciones, proveedor, fecha del precio...") con un
  `onChange` que NO resetea `resultado` — a diferencia del resto de los
  campos del grupo (`largo_barra_mm`, `material_id`, etc.) que sí anulan
  el resultado calculado porque afectan el corte, escribir una
  observación no debería obligar a recalcular. Verificado en navegador:
  se tipeó una observación con el grupo ya calculado y `g.resultado`
  siguió presente (no se perdió el cálculo).

  Se evaluó también agregar un campo "obra" separado a Cómputo (ya que
  Anidado/Presupuesto lo tienen), pero el campo "nombre" de Cómputo ya
  está literalmente etiquetado "Nombre obra" en el formulario de alta —
  agregar un segundo campo hubiera sido redundante, así que se dejó como
  está.

Build limpio y verificado en navegador en cada paso de esta ronda.

## §9.14 — Bug crítico de anidado (empalme de piezas largas) + mejoras de carga de piezas (2026-08-03)

El usuario reportó con capturas de pantalla que el optimizador de corte daba
resultados muy por debajo de lo necesario (ej. "necesito 88.3 barras
útiles" calculado a mano, la app mostraba sólo 6 barras en total).

- **BUG CRÍTICO en `runFFD` (Anidado.jsx)**: cualquier pieza más larga que
  la barra (`largo > largo_barra_mm`) se descartaba en silencio
  (`if (largo>largo_barra_mm) return;`) — nunca sumaba al cálculo. Esto
  es gravísimo en estructuras metálicas reales, donde columnas/vigas de
  más de 6-12m son moneda corriente y se resuelven con **empalme**
  (soldar dos o más tramos de barra). Con los datos exactos de las
  capturas (Tubo Cuad 100×100×3,0 y Caño SCH 40 6"), la app descartaba
  casi todas las piezas — sólo sobrevivían las que por casualidad medían
  menos que la barra.

  **Fix**: `runFFD` ahora calcula `mm_util_total` directamente sobre las
  piezas originales (nunca se pierde el largo real pedido, sin importar
  cómo se resuelva el corte) y, para cada pieza que exceda la barra, la
  descompone en `floor(largo/barra)` tramos completos (0% desperdicio en
  esos tramos, etiquetados "(empalme)") más un resto que compite
  normalmente por espacio junto con las demás piezas (etiquetado
  "(resto)"). Verificado con los datos EXACTOS de las capturas, primero
  en un script Node aislado y después inyectando el mismo anidado en la
  app real vía localStorage y calculando en el navegador:
  - Tubo Cuad 100×100×3,0: `b_util 88.27` (usuario calculó a mano 88.3 ✓), `b_total 91`, `3% desp.` — antes daba `b_total: 6`.
  - Caño SCH 40 6" (168.3×7.11): `b_util 31.24` (usuario calculó a mano 31.3 ✓).

- **Campo Etiqueta de pieza demasiado angosto** (72px → truncaba
  "Horizontal" a "Horizont", visible en las capturas): agrandado a 160px
  en `Grupo` (perfil) y `GrupoPlancha` (plancha).

- **Selector de material sin info de referencia**: el Combobox de
  material (Cómputo y Anidado) ahora muestra, junto al nombre, el largo
  de barra o m² de hoja + kg/m o kg/m² (ej. "6m · 8.6 kg/m") tanto en el
  valor seleccionado como en cada opción de la lista — para poder
  verificar de un vistazo sin salir del selector. Se agregó `largo_mm` y
  `sheet_w/sheet_h` a `useBiblioteca()` de Cómputo.jsx, que antes no los
  exponía (Anidado ya los tenía).

- **Dropdown de material fuera de vista ("hay que scrollear para ver")**:
  el Combobox (Cómputo y Anidado) ahora mide la posición del campo antes
  de abrir y si no hay espacio suficiente debajo en el viewport, abre el
  desplegable hacia ARRIBA (`bottom` en vez de `top`) en lugar de
  siempre hacia abajo sin importar dónde esté el campo en la pantalla.

- **Enter → siguiente campo** en las tablas de piezas de Anidado
  (Etiqueta → Largo → Cantidad, y Enter en Cantidad agrega una fila
  nueva con foco automático en su Etiqueta) y en el formulario de
  alta de pieza de Cómputo (Largo → [Ancho] → Cantidad → agrega).
  Verificado en navegador con eventos de teclado reales.

- **Clonar pieza** (Anidado, botón ⧉ junto a cada fila): duplica la
  pieza (mismo largo/etiqueta) para editar sólo cantidad o largo sin
  tener que volver a tipear todo. Cómputo ya tenía esto (botón
  "Duplicar" preexistente en cada pieza) — no fue necesario agregarlo.

- **"Ingresar varias medidas del mismo material sin rebuscarlo"**
  (Cómputo): el formulario de alta de pieza (`FormPieza`) ya no se
  cierra al agregar — el material seleccionado se mantiene, sólo se
  limpian largo/ancho/cantidad, y el foco vuelve automáticamente al
  campo de largo. Verificado en navegador con un caso real: al agregar
  una pieza HEB100×2500mm×6ud con Enter, el total del ítem subió
  exactamente 306kg, el combo siguió mostrando "HEB 100" seleccionado,
  el largo quedó vacío y el foco volvió al campo de largo — listo para
  cargar la siguiente medida del mismo perfil sin buscar nada de nuevo.

- **Clonar cómputo completo** (botón "⧉ Clonar" en cada tarjeta de la
  lista): duplica el cómputo con nuevo N° y todos sus ítems/piezas con
  ids nuevos, sufijo "(copia)" en el nombre.

- **Clonar ítem** (botón ⧉ en la cabecera de cada ítem, junto a
  eliminar): duplica el ítem completo con sus piezas, se inserta
  inmediatamente después del original.

- **"Precio del ítem" en la cabecera colapsada** (Cómputo): nuevo helper
  `calcPiezaUSD(p, tc)` que replica el cálculo de `FichaDrawer` (precio
  cargado en la ficha de cada pieza × kg/m/m² según corresponda,
  convertido a USD si está en UYU) y lo suma por ítem × cantidad de
  unidades. Sólo aparece si hay al menos una pieza con cotización
  cargada — no rompe nada si no se usa esa función. Verificado con
  matemática exacta: pieza a $2.5/kg × 1533.6kg = $3834.00 mostrado
  correctamente en el badge.

Build limpio en cada paso; toda la ronda verificada en navegador con
datos reales (no sólo lectura de código), incluyendo el caso más
riesgoso (el bug de empalme) confirmado contra los cálculos manuales
exactos que pasó el usuario en sus capturas.

## §9.15 — Badges de "barras/hojas a comprar" y "kg total" prominentes + bug de eliminación bloqueada (2026-08-03)

- **"Cantidad de barras a comprar" y "kg totales" poco visibles**: en la
  ficha colapsada de un grupo (Anidado), el % de desperdicio y el monto
  en USD se mostraban como badges grandes y coloreados, pero la cantidad
  de barras/hojas a comprar (`b_total`/`n_hojas`) y el kg total quedaban
  como texto chico sin destacar — el usuario pidió que aparecieran con
  la misma jerarquía visual. Ahora "🔩 N barras"/"🔩 N hojas" y "⚖ N kg"
  son badges del mismo tamaño/peso que "⚠ % desp." y "$ monto", tanto en
  `Grupo` (perfil) como en `GrupoPlancha`. Verificado en navegador: 4
  barras de HEB160 a 6m con kg_m=42.6 → badge "⚖ 1022.40 kg" (4×6×42.6,
  matemática correcta).

- **BUG: no se podían eliminar anidados — "contraseña de Administrador
  incorrecta"**: en `ConfirmarEliminar.jsx`, `ModalConfirmarEliminar`
  exige la contraseña de un usuario con rol admin para confirmar
  cualquier borrado (Cómputo/Anidado/Presupuesto/Historial/usuarios).
  Causa raíz más probable: el usuario Administrador no tiene contraseña
  cargada (`clave` vacío) o cambió la contraseña y no la recuerda — sin
  contraseña real configurada, NINGÚN valor tipeado puede coincidir
  nunca, dejando el borrado permanentemente bloqueado sin pista de cómo
  salir. Se mejoró el mensaje de error para que señale la salida
  inmediata: "Si no la recordás, podés verla o cambiarla en Sistema →
  Config → Gestión de usuarios (ícono 👁️ junto a la contraseña)" — ahí
  cualquier admin logueado puede revelar en texto plano o cambiar la
  contraseña de cualquier usuario, incluida la propia, sin necesitar la
  contraseña vieja. Verificado en navegador: contraseña incorrecta
  muestra el mensaje nuevo con la guía; contraseña correcta elimina
  normalmente. **Acción para el usuario**: andá a Sistema → Config →
  Gestión de usuarios, buscá tu usuario Administrador, hacé clic en el
  👁️ junto al campo de contraseña para ver qué hay cargado ahí (puede
  estar vacío) y escribí una que vayas a recordar.

Build limpio; ambos cambios verificados en navegador con datos reales.

## §9.16 — Negociación suma en vez de restar + kg/USD-kg destacados (2026-08-03)

- **"La negociación debe aumentar el precio no disminuirlo"**: en
  `calcPresupuesto`, `neg_usd` pasó de restarse a sumarse al subtotal —
  `gran_total = total_usd + neg_usd + int_usd` (antes `- neg_usd`). El
  interés financiero también se recalcula sobre el subtotal YA con la
  negociación sumada (`(total_usd + neg_usd) * interes_pct/100`), no
  sobre el subtotal original. Label del campo cambiado de "Negociación
  (descuento)" a "Negociación (aumenta el total)", y el indicador pasó
  de "− $X" en rojo a "+ $X" en verde. Verificado en navegador con un
  caso exacto: subtotal $1000, negociación 10% → +$100, interés 4% sobre
  $1100 → +$44, total $1144 — matemática confirmada.

- **"Los kg y el USD/kg deben verse igual de grande que el total"**: en
  el panel de Resumen de Presupuesto (columna derecha), "TOTAL USD" era
  grande (28px) pero los kg y USD/kg debajo eran una sola línea chica
  (14px). Ahora son dos bloques propios con etiqueta en mayúsculas
  ("KG TOTALES" / "USD/KG") y valor a 22px — mismo tratamiento visual
  que el total, no una nota al pie.

## §9.17 — RESUELTO: candado circular de roles — nadie con rol Administrador (2026-08-03)

Causa raíz encontrada por captura de pantalla del propio Config del
usuario: su único usuario, nombrado "Administrador", tenía el
**desplegable de rol en "Gerencia"** (supervisor), no en "Administrador".
El nombre del usuario es sólo un label — lo que cuenta para los permisos
es el campo `rol`. Con cero usuarios `rol==="admin"` en el sistema:

1. **Borrado bloqueado**: `ModalConfirmarEliminar` exige que ALGÚN
   usuario tenga `rol==="admin"` Y esa contraseña — sin ningún admin,
   ninguna contraseña puede matchear jamás, sin importar qué tan
   "correcta" sea.
2. **"+Agregar usuario" invisible**: `Config`'s `soloLectura = usuario?.rol
   !== "admin"` — el usuario logueado tiene rol "supervisor", así que la
   pantalla entera queda en solo lectura (banner amarillo incluido).

Y lo peor: como Config queda en solo lectura sin un admin activo, **el
usuario no podía arreglar su propio rol** — el desplegable que lo
arreglaría estaba deshabilitado por el mismo problema que había que
arreglar. Candado circular real, no percepción.

**Fix en `Config.jsx`**: `soloLectura` ahora es `usuario?.rol !== "admin"
&& hayAdmin` — si NINGÚN usuario en todo el sistema tiene rol admin, la
pantalla se desbloquea igual (sin importar el rol de quien esté
logueado) específicamente para poder arreglarlo, con un banner rojo
explicando la situación. En cuanto hay al menos un admin real, la
restricción normal vuelve a aplicar.

Verificado en navegador reproduciendo el estado exacto del usuario
(un solo usuario "Administrador" con `rol:"supervisor"`, `clave:"admin"`):
banner rojo apareció, dropdown de rol quedó editable, se cambió a
"Administrador", y after eso el borrado con contraseña "admin" funcionó
correctamente — círculo cerrado de punta a punta.

**Acción para el usuario**: recargá la app (ya con este fix), andá a
Sistema → Config, y ahora el desplegable de rol de tu usuario va a estar
editable — cambialo a "Administrador" y guardá. Con eso se resuelven los
dos síntomas de una sola vez.

## §9.18 — Confirmación con casilla al borrar pieza/grupo (2026-08-03)

Pedido: "no se debe poder borrar un ítem de un anidado o un material de
un ítem de cómputo sin un popup y casilla de validación, para evitar
borrar por error". Estos son borrados frecuentes durante la edición
(no como borrar un cómputo/anidado entero), así que NO se reutilizó
`ModalConfirmarEliminar` (pide contraseña de Admin — sería demasiada
fricción para algo que se hace todo el rato). Se creó
`ModalConfirmarBorrado` en `ConfirmarEliminar.jsx`: popup liviano con
una casilla "Sí, quiero eliminar esto" — el botón "Eliminar" queda
deshabilitado hasta que se tilda. Conectado en:
- **Anidado**: borrar un grupo completo (PERFIL 3D o PLANCHA 2D) —
  antes el ✕ borraba al instante.
- **Cómputo**: borrar una pieza/material dentro de un ítem — antes el
  ✕ borraba al instante (el ✕ de "cancelar formulario nuevo" no se
  tocó, sólo el de las filas ya agregadas).

Verificado en navegador: en ambos casos el botón "Eliminar" está
`disabled` hasta tildar la casilla, cancelar cierra sin borrar nada, y
confirmar sí borra (Cómputo: 4→3 piezas con los totales del ítem
recalculados; Anidado: 5→1 grupos en pasos sucesivos, con los kg/badges
del resto de los grupos actualizándose bien en cada paso).

Nota: durante la primera prueba automatizada apareció un error de
consola ("Cannot read properties of null (reading 'resumen')") al
confirmar un borrado — se investigó a fondo repitiendo la acción varias
veces de forma controlada (un clic por vez, con logging de errores
activo) y NO volvió a reproducirse; se concluyó que fue un artefacto de
clics ambiguos en el script de prueba (no del código de la app), no un
bug real — se deja documentado por si reaparece con un patrón de uso
distinto.

## §9.19 — Taxonomía compartida Familia/Categoría (2026-08-06)

Ver `TAXONOMIA-COMPARTIDA-MMN.md` en la raíz del proyecto para el acuerdo
completo entre steel-measurement, Predictor Eq y steelCRM (documento
compartido con las otras dos sesiones).

- **`src/utils/taxonomia.js`** (nuevo): mapeo Familia (8) → Categoría (32),
  copiado tal cual del `DEFAULT_FAMILIES` de Predictor Eq v25 — fuente
  canónica, no reinventado acá. Exporta `familiaDe(categoria)`.
- **Benchmark de Historial**: toggle "Por Categoría / Por Familia".
  `calcBenchmark(trabajos, agruparPor)` ahora acepta agrupar por familia
  sin tocar el campo `categoria` existente ni el comportamiento por
  defecto (sigue siendo "Por Categoría"). Verificado en navegador: 8
  familias, suma de "N° trabajos" = 239 = total de trabajos — el
  agrupamiento cubre el 100% de los datos sin pérdidas.

Build limpio.

## §9.20 — Esquema de IDs compartido Presupuesto ↔ Cálculo (2026-08-15)

Acordado desde la sesión de steelCRM. Ver `TAXONOMIA-COMPARTIDA-MMN.md` §7
para el detalle completo. Resumen: steelCRM genera el código de presupuesto
(`nro`), steel-measurement genera el código de cálculo — relación
muchos-a-muchos en ambos sentidos (un cálculo puede derivar en varios
presupuestos, un presupuesto puede tener varios cálculos). steelCRM ya
migró su campo de `idCalc` (string único) a `idsCalc` (array), compatible
hacia atrás. Formato del código de cálculo queda libre por ahora — si acá
se define un formato fijo en el futuro, avisar en el documento compartido.

También corregida ahí una nota vieja: la entrada de "Integración Steel
Measurement ↔ steelCRM" en la lista de pendientes (línea ~773) decía que
steelCRM era "solo documentación, sin código construido" — ya no es así,
tiene código React funcionando con 614 presupuestos + 183 contactos reales
de MMN importados.

## §9.21 — Otros tratamientos/cortes conectados al cálculo + carga de presupuestos históricos (2026-08-16)

**A. "Otros tratamientos" y "Otros cortes" ahora suman al ítem** (antes eran
catálogos de referencia sin efecto en el cálculo, señalado por el usuario
como pendiente):
- `TabTrat` (Presupuesto.jsx): nuevo array `ts.otros` (fila = nombre +
  USD/kg), subtotal SIEMPRE recalculado en vivo como
  `usd_kg × hier_kg_item` (nunca guardado stale, para no desincronizar si
  cambian los hierros del ítem después). `calcItem()` suma este subtotal a
  `trat_usd`. QuickPick opcional desde `tarifario.trat_superficie_extra`
  (Config) además de la carga manual.
- `TabPanto`: "Otros cortes" reutiliza el mecanismo ya existente de
  `corte_pantografo` (ya estaba conectado al cálculo) — se agregó un
  QuickPick desde `tarifario.pantografo_extra`, visible solo si ese
  catálogo tiene datos cargados en Config.
- Verificado en navegador con datos reales: cargar "1.5 USD/kg" en Otros
  tratamientos sobre un ítem de 43124 kg sumó exactamente $64686.00 (=
  1.5 × 43124) al total del ítem y al Resumen del presupuesto. Fila
  probada, verificada y eliminada después (no queda en los datos reales).

**B. Carga de presupuestos históricos aproximados** (235 registros,
misma fuente "Datos de fabricación.xlsx" que ya alimenta el Historial):
- `src/utils/presupuestosHistoricosSeed.js` (nuevo, generado por script):
  un presupuesto por trabajo histórico, UN ítem con una fila por rubro
  (Hierros, Mat. Generales, MO Fab, MO Mon, Terceros Fab/Mon, Trat.
  Superficie, Traslados, Pantógrafo), dimensionada para que el total
  coincida EXACTO con el `usd_total` real de cada trabajo (normalización
  proporcional de los `%` por rubro, que no siempre suman 100% en la
  fuente — diferencia máxima verificada entre los 235 registros: $0.02,
  puro redondeo). `estado: "aprobado"`, `nro: "H-<OT>"`,
  `negociacion_pct: 0` a propósito (no se toma del histórico — ahora la
  negociación suma al total, usar el valor viejo, pensado como descuento,
  infllaría el monto reconstruido).
- **Es una aproximación, no el cálculo real**: no tiene detalle
  pieza por pieza — un solo ítem "Trabajo completo (importado de
  histórico)" con montos por rubro, sin materiales/horas específicas.
- Carga: botón "📥 Cargar histórico (235)" en el header de Presupuesto,
  gateado por `ModalConfirmarBorrado` (generalizado con props
  `verbo`/`checkboxLabel`/`labelBoton`/`color` para reusarlo en acciones
  no destructivas — antes tenía "Eliminar" fijo). SUMA a los presupuestos
  existentes, nunca reemplaza. Flag `smeas_historico_cargado` en
  localStorage oculta el botón después de la primera carga (no se puede
  cargar duplicado desde la UI).
- Nota: no se usó `window.confirm` — el proyecto evita diálogos nativos
  del navegador en favor de modales propios (patrón ya establecido toda
  esta sesión con `ModalConfirmarBorrado`/`ModalConfirmarEliminar`).
- Verificado en navegador: carga de los 235, un presupuesto de ejemplo
  (H-4176, Barandas - Defensas, $213071.60) con la suma de sus 5 rubros
  coincidiendo exacto con el total, KG totales y USD/kg mostrados
  correctamente en el Resumen.

**C. Limpieza de `historialSeed.js`** (2026-08-16, mismo día — el usuario
señaló las fechas corruptas vistas en la lista de Presupuestos y pidió
limpiarlas): la fuente tenía 239 registros originalmente, 5 con datos
sospechosos. Investigado uno por uno:
- 1 registro real con fecha corrupta pero recuperable: OT 4416 (Cajones
  UPN, Marinao, $23800, 6652 kg) tenía `fecha: "16/024/202"` — corregido
  a `"2024-04-16"` por contexto (linda en la secuencia de OTs con la
  4415, del mismo cliente/fecha, y con la 4272→2023-11-13 y 4547→
  2024-09-11 antes/después).
- 4 registros que NO eran trabajos reales, sino basura del import de
  Excel (fila vacía o de fórmula que se coló): `nro_ot` con decimales
  tipo fracción (`"0.21637426900584794"`), `fecha: "%"` (el símbolo del
  formato de celda, no un valor), `cliente`/`obra`/`notas` vacíos,
  montos triviales (2 de $1 con 0.02–0.06 kg). Eliminados de
  `historialSeed.js` — bajan el total de 239 a **235**.
- `presupuestosHistoricosSeed.js` regenerado desde el `historialSeed.js`
  corregido (mismo script, mismo chequeo de integridad: diferencia
  máxima $0.02 en los 235). Verificado en navegador tras limpiar
  localStorage y recargar: 0 presupuestos con fecha fuera de formato
  `YYYY-MM-DD`, H-4416 con fecha correcta.
- Esto afecta también al Historial y su Benchmark (mismos 235 registros,
  4 menos que antes) — no hubo verificación adicional en Historial en
  esta pasada porque el fix es puramente de datos (menos basura, no
  cambia lógica de agrupamiento).

Build limpio (`CI=true npx react-scripts build`, exit 0) y verificación
completa en navegador (login, Presupuesto, carga histórica, edición de
Otros tratamientos, Pantógrafo, limpieza de datos) para los tres puntos.

## §9.22 — Tipo de ítem (Fab/Montaje/Fab+Mont) + rubros activos por ítem, corrección de estado del PDF (2026-08-17)

Gino compartió `MN005_ProgramaCalculo.xlsx` (cálculo real hecho a mano para
un rótulo JCDecaux, con el formato del programa de cálculo interno MMN) y
preguntó si validaba la estructura de steel-measurement. Comparado rubro
por rubro contra `Presupuesto.jsx`: los 9 rubros coinciden casi campo a
campo (USD/KG, Subtotal KG, Subtotal USD, Porc.Item, filas de desperdicio
separadas por hierro — igual que el export Anidado→Presupuesto). El gap
real encontrado: el Excel separa el trabajo en dos ítems de Gestsoft
independientes (ID fabricación vs ID sitio/montaje), cada uno con su
propio subtotal y USD/kg — steel-measurement mezclaba todos los rubros en
un solo ítem sin esa distinción.

**Fix**: no se tocó el schema de los 9 rubros (nada de migración). Se
agregaron 2 campos nuevos a cada ítem, ambos con default que preserva el
comportamiento actual:
- `tipo: "fabricacion" | "montaje" | "fab_mont"` (default `"fab_mont"`).
- `rubrosActivos: {hierros, mat_generales, mo_fabricacion, mo_montajes,
  terc_fabricacion, terc_montajes, trat_superficie, traslados,
  corte_pantografo}` (default: todos `true`).

`PRESET_TIPO_RUBROS` en `Presupuesto.jsx` define qué rubros se activan al
elegir cada tipo (ej. "Fabricación" activa Hierros/MatGen/MOFab/TratSup/
Pantógrafo y desactiva MOMon/TercMon/Traslados). El usuario puede
override cualquier rubro individual después con un chip ☑/☐ por rubro.
**Es puramente visual — nunca borra datos ni cambia `calcItem()`**: un
rubro desactivado con filas cargadas sigue sumando al total, solo se
oculta su pestaña en el editor (mismo principio que "Otros tratamientos"
de la sesión anterior: nunca perder plata por un toggle de UI).

Ítems viejos/históricos sin `rubrosActivos` (los 235 del seed histórico,
cualquier presupuesto guardado antes de este cambio) se tratan como
"todo activo" — `activo(id) = item.rubrosActivos ? item.rubrosActivos[id]
!== false : true` — cero necesidad de migrar datos existentes.

Verificado en navegador sobre H-4176 (real, cargado del histórico): elegir
"🔨 Fabricación" ocultó las pestañas MO Mon/Terc.Mon/Traslados sin cambiar
el TOTAL USD ($213,071.60 intacto) ni el Resumen (Traslados $2,733.42
seguía sumando aunque su pestaña estaba oculta); re-marcar el chip
individual de Traslados la trajo de vuelta; volver a "Fab+Mont" restauró
los 9 rubros activos. Build limpio.

**Corrección de estado — Exportación a PDF**: en el status check anterior
de esta misma sesión (más arriba en esta conversación) se reportó "no
implementada, 0 referencias a jsPDF/print" — eso era correcto en el
momento en que se verificó. Al probar el ítem H-4176 en este paso apareció
un botón "🖨️ PDF" que no debería haber estado ahí. Investigado: el archivo
`src/utils/pdfPresupuesto.js` tiene fecha de creación en disco
**2026-08-16 23:40**, 37 minutos después de la última edición de este
`PLAN.md` en esta sesión (23:03, §9.21) — es decir, se agregó por fuera de
este hilo de trabajo, probablemente desde la sesión de coordinación con
steelCRM (el propio archivo dice en su comentario que es la misma función
compartida entre los dos repos, correspondiente a D1 de steelCRM). No fue
un error de grep — el archivo genuinamente no existía cuando se reportó.
No se tocó ese código (no es de esta sesión), solo se corrigió el estado
en el punto de la sección 9.4 más arriba.

## §9.23 — Auditoría de "qué falta": 4 gaps reales cerrados (2026-08-17)

Pedido: relevamiento honesto de qué le falta al software para seguir
desarrollando (releído `PLAN.md` completo + verificado contra código
actual, no solo memoria — confirmó que la sección "Config marcado
`pronto:true`" ya estaba obsoleta, y que 2 hallazgos de julio seguían
reales: Historial de solo lectura y los 4 `window.confirm()`). De la
lista priorizada, Gino eligió atacar 4 puntos en esta misma sesión:

**1. Historial: los trabajos ya se pueden editar.** `DetalleTrabajo`
recibía `onChange` como prop pero no lo usaba en ningún input — quedaba
100% de solo lectura después de creado (sólo crear/eliminar). Ahora todos
los campos crudos (N° OT, fecha, tipo, cliente, obra, categoría, kg/USD
totales, horas fab/mont est. y real, % por rubro, negociación, días de
obra, observaciones) son inputs conectados a `onChange({...t,[k]:v})`,
que ya llamaba `touch()` del lado del padre — no hizo falta tocar esa
parte. Los valores CALCULADOS (USD/kg real, kg/h real, % de desvío) siguen
de solo lectura, como corresponde. Verificado en navegador: editar
Cliente en la OT 1731 actualiza `smeas_historial` y `updated_at` avanza.

**2. Los 4 `window.confirm()` restantes migrados a los modales propios**
(`ModalConfirmarBorrado`, generalizado la sesión anterior con
`verbo`/`checkboxLabel`/`labelBoton`/`color`):
- `BibliotecaMateriales.jsx`: guardar datos técnicos y eliminar material
  — ambos separados en función "real" (sin el confirm) + estado de modal
  que la dispara.
- `Computo.jsx`: eliminar ítem — mismo patrón que ya usaba Anidado desde
  §9.18 (`ModalConfirmarBorrado` con casilla, no pide contraseña porque es
  un borrado frecuente durante la edición).
- `Presupuesto.jsx`: sync de precios Historial→Biblioteca al aprobar (el
  más viejo del proyecto, de antes de que existiera el patrón) — la
  función se partió en `calcularCambiosPrecios()` (pura) +
  `aplicarCambiosPrecios()` (efecto), con el estado del modal en
  `DetallePresupuesto`. El cambio de estado del presupuesto sigue
  aplicándose de inmediato pase lo que pase con el modal (mismo
  comportamiento que antes — sólo la sincronización de precios queda
  gateada por la confirmación, nunca la aprobación en sí).
- `ModalConfirmarBorrado` ganó `whiteSpace:"pre-line"` + scroll en el
  subtítulo (antes una sola línea) para poder mostrar listas
  multi-línea como el detalle de cambios de precio.
- Verificado en navegador los 4: guardar/eliminar material en Biblioteca,
  eliminar ítem de Cómputo (3→4→3 ítems), y el de sync de precios con un
  caso real forzado (`$0.50 → $1.54 USD/kg`, confirmado y verificado que
  actualizó `precio_usd_kg` + `historial_precios` con proveedor
  "Presupuesto H-4176").
- `grep window\.confirm` en `src/` → 0 resultados funcionales (sólo queda
  la mención en un comentario).

**3. Formato de `codigo_calculo` definido: `SM-AAAA-NNNN`.** Contador
anual propio en localStorage (`newCodigoCalculo()` en `storage.js`,
mismo patrón que `newNroPresupuesto()` pero con formato fijo, no
configurable por empresa — tiene que ser estable entre proyectos). Se
asigna al crear o clonar un presupuesto; los presupuestos viejos/
históricos sin el campo lo reciben por "backfill" la primera vez que se
exportan (ver punto 4). Visible en el topbar del detalle: "🔗
SM-2026-0001". `TAXONOMIA-COMPARTIDA-MMN.md` §7 actualizado — reemplaza
el "libre por ahora, sin acordar" anterior.

**4. Transporte steel-measurement → steelCRM: lado steel-measurement
construido.** Botón "⬇️ steelCRM" en el detalle de Presupuesto, junto al
de PDF — descarga `steelmeasurement-export-<codigo_calculo>.json` con el
RESUMEN comercial (cliente, obra, tipo, fecha, kg, USD total, USD/kg,
codigo_calculo, estado_sm) — deliberadamente SIN el desglose de los 9
rubros de costo, mismo criterio de privacidad que ya usa el PDF.
`exportPresupuestoParaSteelCRM()` en `storage.js`, mismo mecanismo de
descarga que `exportBackup()`. Contrato completo (forma del JSON) documentado
en `TAXONOMIA-COMPARTIDA-MMN.md` §8 nueva, para que la sesión de steelCRM
construya el importador cuando le toque — **no se tocó código de
steelCRM en esta sesión**, respetando el límite ya establecido de "cada
proyecto, su propia sesión". Gaps anotados ahí mismo para esa sesión:
vocabulario de `estado` distinto entre los dos sistemas (por eso el campo
se llama `estado_sm`, no `estado`), y que Presupuesto todavía no tiene un
campo de Categoría/Familia (sólo Historial lo tiene) — así que el export
no lo puede llevar todavía. Verificado en navegador: backfill de
`codigo_calculo` al exportar un presupuesto histórico sin el campo,
aparece correctamente en el topbar.

Build limpio (`CI=true npx react-scripts build`, exit 0) después de cada
punto; los 4 verificados en navegador con datos reales, no sólo lectura
de código.

## §9.24 — Categoría/Familia en Presupuesto + primera suite de tests automatizados (2026-08-19)

De la lista de §9.23, Gino eligió los puntos A (Categoría en Presupuesto)
y C (tests automatizados).

**A. Presupuesto ahora tiene campo `categoria`.** Dropdown `SelectCategoria`
(nuevo, en `Presupuesto.jsx`) agrupado por Familia vía `<optgroup>`, mismo
mapeo de `taxonomia.js` que ya usa Historial — a propósito NO es texto
libre como el de Historial, para no divergir de la lista canónica de 32.
Agregado tanto al modal de creación (`ModalNuevo`) como al detalle
("Datos generales"), con la Familia derivada (`familiaDe()`) mostrada
debajo como texto de referencia. El export a steelCRM (`exportPresupuestoParaSteelCRM`
en `storage.js`) ahora lleva `categoria` y `familia` — cierra el gap
anotado en `TAXONOMIA-COMPARTIDA-MMN.md` §8 la sesión pasada. Presupuestos
viejos quedan con `categoria:""` hasta que alguien los abra y la
complete a mano (no hay forma de inferirla retroactivamente). Verificado
en navegador de punta a punta: creado un presupuesto de prueba con
categoría "Barandas - Defensas", el detalle mostró "Familia: Herrería
liviana", y el `.json` exportado llevó ambos campos correctos
(interceptando el `Blob` de la descarga para leer su contenido, ya que
este navegador de pruebas no permite completar la descarga real).

**C. Primera suite de tests automatizados** (`src/components/__tests__/`,
Jest + React Testing Library — ya venían preinstalados con create-react-app,
no hubo que agregar dependencias). Se exportaron 7 funciones que antes
eran privadas del módulo (`calcItem`/`calcPresupuesto`/`iItem`/`iPresupuesto`
de `Presupuesto.jsx`, `runFFD` de `Anidado.jsx`, `calcTrabajo`/`calcBenchmark`/
`iTrabajo` de `Historial.jsx`) — sin tocar su lógica, sólo agregar la
palabra `export`, para poder testearlas de forma aislada sin renderizar
componentes. Priorizado lo que más costó esta sesión, no cobertura
exhaustiva:
- `runFFD.test.js` — **regression test del bug crítico de empalme**
  (2026-08-03): una pieza más larga que la barra se descartaba en
  silencio antes del fix. Caso sintético mínimo (pieza de 15m en barras
  de 6m → 2 barras de empalme + 1 con 3m de resto) fija el comportamiento
  correcto para siempre; si alguien reintroduce el bug, este test falla.
- `calcItem.test.js` — rubros del ítem, `no_agrega_kg`, y el signo de la
  negociación (SUMA, nunca resta — otro bug ya corregido esta sesión que
  ahora queda protegido).
- `calcTrabajo.test.js` — ratios de Historial (USD/kg real, kg/h,
  desvío), y que `calcBenchmark` cubre el 100% de los trabajos tanto
  agrupando por Categoría como por Familia (verificado a mano en
  navegador en la sesión del 2026-08-06, ahora es un test permanente).
- 12 tests, 3 suites, los 12 pasan (`CI=true npx react-scripts test
  --watchAll=false`, exit 0).

No se armó CI (GitHub Actions o similar) para correr esto automáticamente
en cada cambio — sigue siendo manual (`npm test`). Evaluar si vale la pena
cuando el repo tenga control de versiones remoto.

Build limpio y ambos puntos verificados (A en navegador con datos reales,
C corriendo la suite completa).

## §9.25 — Auditoría de integración: Config en 6 pestañas + sidebar limpio (2026-08-22)

Gino pidió auditar que las pantallas no tengan "herramientas entreveradas"
y usen pestañas/desplegables — mismo principio de la Regla 6 de steelCRM
(una pantalla acumulando herramientas sueltas porque cada una se agregó
para un pedido puntual, sin pensar el conjunto). Auditadas 3 pantallas
(esta, más 2 del lado steelCRM — ver `CLAUDE.md` de esa sesión):

- **`Config.jsx` tenía solo 2 pestañas (Empresa/Usuarios), pero "Empresa"
  acumulaba 4 cosas sin relación entre sí**: nombre de empresa,
  Numeración de presupuestos, Diseño del PDF, y un sistema de temas
  (`TEMA_ACTUAL`/`cambiarTema`) que ni siquiera estaba documentado en este
  PLAN — lo agregó otra sesión sin dejar rastro acá. Separado en **6
  pestañas reales**: Empresa (solo nombre), Numeración, PDF, Apariencia,
  Usuarios, y una nueva Backup y Datos.
- **Backup/Restaurar movidos del sidebar a Config.** Vivían como 2
  botones sueltos permanentes al pie del sidebar (`App.js`), sin relación
  visual con "Sistema" donde vive el resto de la configuración admin.
  Ahora son la pestaña "💾 Backup y Datos" de Config — mismo componente
  `BackupYDatos`, misma lógica (`exportBackup`/`parseBackup`/
  `restoreBackup`, gateado por `puedeEliminar` para Restaurar), sin
  cambios de comportamiento, solo de ubicación. "🧪 Seed datos prueba" se
  dejó donde estaba — ya está gateado por `NODE_ENV==="development"`, no
  llega nunca a producción, no era un problema real.
- Verificado en navegador: las 6 pestañas de Config renderizan cada una
  su contenido aislado, "Descargar backup" sigue funcionando igual
  (interceptado el Blob de la descarga: 9 claves `smeas_*` exportadas
  correctamente), sidebar sin los botones sueltos.

Del lado steelCRM (repo separado, `C:\Users\Gino\Documents\steelcrm`):
`Importar.jsx` tenía 2 secciones ("Cargar datos"/"Mantenimiento", del fix
del 2026-08-22 anterior) pero renderizadas juntas en un solo scroll, no
como pestañas reales — convertidas a pestañas de verdad con el mismo
`TAB_BTN` que ya usa `Config.jsx` de ese proyecto. Detalle completo en el
`CLAUDE.md` de la sesión de coordinación de steelCRM, no acá — para no
duplicar el registro de cambios de un repo ajeno.

Build limpio en los 2 repos, los 3 cambios verificados en navegador con
datos reales (incluida la vista de Mantenimiento de steelCRM mostrando
2 presupuestos de prueba reales del entorno de desarrollo).

## §9.26 — Nuevo módulo: Dashboard (2026-08-22)

Pedido de Gino: un dashboard de estadísticas/KPIs (presupuestos, empresas
cotizadas, materiales más usados). Planificado primero, mismo lenguaje
visual que el Dashboard de steelCRM (`KPI`/`Bar`, filtros con
desplegables, comparación ▲▼% vs. período anterior) — leído el código
real de `steelcrm/src/components/Dashboard.jsx` y `shared.jsx` antes de
diseñar, no copiado de memoria. Aprobado el plan, implementado.

- **`src/components/Dashboard.jsx`** (nuevo). Grupo de sidebar propio
  ("📈 Dashboard", ícono distinto al de Historial que ya usaba "📊" —
  si no hubiera quedado igual en el nav). 4 pestañas: 📊 Resumen
  (presupuestos/monto/kg/USD-kg-promedio/empresas cotizadas, cada KPI
  con flecha vs. período anterior), 📈 Tendencia (barras por mes, últimos
  12), 🏢 Empresas (ranking con medallas 🥇🥈🥉), 🔩 Materiales (ranking
  por kg, **el único que steelCRM no puede tener** — steelCRM no calcula
  materiales, sólo el monto final).
- **Fuente de datos seleccionable** (pedido explícito): filtro
  "Fuente" = Presupuesto / Historial / Ambos. Función de normalización
  (`normalizarPresupuesto`/`normalizarTrabajo`) lleva los dos modelos a
  una forma común (fecha/cliente/categoria/kg/usd/materiales) sin tocar
  ninguno de los dos originales.
- **Los 235 presupuestos históricos aproximados quedan excluidos del
  ranking de Materiales** (`p.origen_historico`): su "hierro" es la
  categoría entera puesta como nombre (ver §9.21), no un material real —
  mezclarlos ahí sería directamente incorrecto, no sólo impreciso. Sí
  cuentan normalmente en Resumen/Tendencia/Empresas, donde el kg/USD
  agregado es real y confiable.
- Filtros comunes: Período (mismo esquema que steelCRM, con período
  anterior para el ▲▼%), Desde/Hasta manual, Categoría (dropdown
  `FAMILIAS` con optgroup, mismo que el nuevo selector de Presupuesto),
  Cliente/Empresa (texto libre).
- **`SelectCategoria` de `Presupuesto.jsx` exportado** para poder
  reusarlo acá sin duplicar la lista de 32 con sus 8 optgroups — único
  cambio a un archivo existente en esta tanda, sin tocar lógica.
- Verificado en navegador con los 235 registros reales de Historial
  (período "Todo"): $4.903.462 total, 1.265.766 kg, 39 empresas, ranking
  de Empresas correcto (CCFC 🥇 $742.791/15 pres., Saceem 🥈, Consorcio
  Puerto 🥉). Materiales confirmado vacío con sólo históricos cargados,
  y poblado correctamente (2/2 materiales, kg exactos) al inyectar un
  presupuesto de prueba con hierros reales — que después se eliminó.
- Build limpio (`CI=true npx react-scripts build`, exit 0 verificado
  sin `| tail` de por medio — un build anterior esta sesión había
  fallado en silencio porque el pipe a `tail` enmascaraba el exit code
  real de `react-scripts build`; ojo con ese patrón en sesiones futuras).

## §9.27 — Fase 2 del backend compartido: capa de acceso a datos (2026-08-22)

Ver `steel-backend/CLAUDE.md` y `BACKEND-COMPARTIDO-MMN.md` (raíz de este
repo) para el detalle completo de esquema y decisiones — acá sólo lo que
tocó código de Steel Measurement.

- **`@supabase/supabase-js` instalado**, `src/utils/supabaseClient.js`
  nuevo (cliente inicializado desde `REACT_APP_SUPABASE_URL`/
  `REACT_APP_SUPABASE_ANON_KEY` en `.env.local`, gitignored).
- **`src/utils/storage.js`**: agregadas `loadDBClientes`/`saveDBCliente`,
  `loadDBPresupuestosSM`/`saveDBPresupuestoSM`, `loadDBItems`/`saveDBItem`
  (ítems + 8 rubros de costo normalizados + tratamiento de superficie con
  pinturas/otros). **Nada de esto está cableado a la UI todavía** — es
  capacidad nueva detrás de la misma abstracción, sin cambiar el
  comportamiento actual (Fase 3, dual-write, es el paso que la conecta).
  `horas_especiales` deliberadamente sin cubrir — no tiene UI real hoy.
- `saveDBItem` reemplaza todas las filas de cada rubro en cada guardado
  (delete + insert) en vez de diffear — mismo patrón que el estado de
  React hoy, que reemplaza el array completo.
- **`scripts/test-fase2.mjs`** (nuevo): login real contra Supabase Auth +
  prueba de punta a punta de `clientes`/`presupuestos_sm` sin depender de
  la UI. Pensado para correr desde la terminal del usuario, nunca pasando
  contraseñas por el chat de la sesión de Claude.
- **Verificado en la práctica, con el proyecto Supabase real** (tenant
  "Tenant Demo", usuario admin real de Gino): login, `SELECT` sobre
  `profiles`, `SELECT`/`INSERT` sobre `clientes` (con el trigger de
  `tenant_id` completando solo), `SELECT` sobre `presupuestos_sm`. Todo
  ✅ en la corrida final.
- **Pendiente**: `computos`, `anidados`, `historial_trabajos`, biblioteca
  de materiales y tarifario sin capa de acceso propia todavía. Ninguna
  conexión a la UI real (Fase 3) arrancada.

---

*Steel Measurement — construido desde las planillas que ya funcionan*
