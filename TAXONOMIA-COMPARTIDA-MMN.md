# Taxonomía y roles compartidos — steel-measurement / Predictor Eq / steelCRM

**Para:** las sesiones de Claude Code que trabajan en steelCRM y en Predictor Eq
**De:** sesión de Claude Code trabajando en steel-measurement
**Fecha:** 2026-08-06
**Por qué existe este documento:** Gino (dueño de MMN) está construyendo tres
softwares que en algún momento se van a interconectar. Antes de que eso pase,
hace falta que los tres hablen el mismo idioma — mismos nombres para las
mismas cosas, y límites claros de quién es dueño de qué dato. Este documento
es ese acuerdo. Si estás por tocar clasificación de trabajos, familias,
categorías, o el histórico de fabricación en cualquiera de los tres
proyectos, leé esto primero.

---

## 1. Los tres softwares y su rol

Gino los describió así, y es la definición que queda fija:

> steel-measurement hace el **cálculo detallado** (cómputo pieza por pieza,
> anidado, presupuesto por rubro) → alimenta el **Historial** → **Predictor
> Eq** usa ese histórico para **estimar rápido** antes de cotizar en detalle
> → **steelCRM** sigue el **recorrido comercial** de esa cotización (cliente,
> seguimiento, kanban) usando las mismas etiquetas Familia/Categoría para que
> los reportes crucen bien entre los tres.

En criollo, cada uno es dueño de una capa distinta del mismo trabajo:

| Software | Responde a | Dueño de |
|---|---|---|
| **steel-measurement** | "¿Cuánto material, cuántas horas, cuánto cuesta ESTE trabajo específico calculado en detalle?" | El cómputo de materiales, el anidado/optimización de corte, el presupuesto rubro por rubro, y el registro (Historial) de trabajos ya hechos. |
| **Predictor Eq** | "¿Cuánto debería costar ESTE TIPO de trabajo, a ojo, antes de perder tiempo calculándolo en detalle?" | La estimación estadística por similitud/regresión contra el histórico. |
| **steelCRM** | "¿En qué etapa está esta venta, con qué cliente, quién le tiene que escribir hoy?" | El recorrido comercial: cliente, seguimiento, kanban, forecast, aprobaciones. |

**Regla de convivencia:** ninguno debe reimplementar lo que el otro ya hace
bien. steelCRM no recalcula materiales. Predictor Eq no gestiona el
pipeline comercial. steel-measurement no intenta predecir estadísticamente
trabajos que todavía no se calcularon. Si sentís la tentación de duplicar
una función de otro de los tres, es señal de que en realidad hace falta
conectar los dos sistemas, no copiar la lógica.

---

## 2. La taxonomía: 3 niveles, y quién los usa hoy

Hay tres niveles de clasificación de "tipo de trabajo" dando vueltas entre
los tres sistemas — y **ya había una colisión de nombres real** antes de
este documento (ver §3). Estos son los nombres que quedan fijos de acá en
más:

| Nivel | Nombre fijo | Qué es | Cuántos valores | Ejemplo |
|---|---|---|---|---|
| 1 | **Familia** | Agrupador amplio de negocio | 8 (hoy, en Predictor Eq v25) | "Herrería liviana", "Calderería" |
| 2 | **Categoría** | El tipo de trabajo específico — es el nivel que ya se usa activamente en steel-measurement y Predictor Eq | 32 | "Barandas - Defensas", "Escalera Marinera" |
| 3 | **Subcategoría** | Variante específica de material/terminación dentro de una Categoría | ~150 (catálogo legado de Gestsoft) | "Baranda galvanizada" vs "Baranda pintada" dentro de "Barandas - Defensas" |

### Nivel 2 (Categoría) — el ancla estable, ya unificado

Verificado línea por línea: las 32 Categorías de `HISTORIAL_SEED` en
steel-measurement y las 32 claves de `TIP_VARS`/`DEFAULT_FAMILIES` en
Predictor Eq v25 son **idénticas, byte a byte**. Los dos sistemas ya vienen
del mismo Excel origen ("Datos de fabricación.xlsx") y ya coinciden en este
nivel sin que nadie lo haya coordinado a propósito. Este es el nivel que
**no hay que tocar** — es el más maduro y el más usado activamente.

Lista completa (32): Aberturas, Anclajes - Pernos, Barandas - Defensas,
Cajones UPN, Camisas, Cerramientos - Cercos - Fachada, Columnas, Cubas,
Cubiertas - Techos - Plataforma, Escalera Marinera, Escaleras, Herreria,
Industriales-Maritimas-Porticos, Marcos, Mesas Industriales, Moldes, Moldes
Circulares, Montajes, New Jersey, Pasos Peatonales, Perfiles a Medida,
Pernos - Insertos, Platinas, Plegados, Portones, Regueras, Rejas, Skids,
Soportes - Perfiles con Platina, Trabajos Variados, Tuberías, Vigas
Conformadas - Cerchas.

### Nivel 1 (Familia) — vivo, no congelado

Predictor Eq agrupa esas 32 Categorías en Familias más amplias, y **ese
agrupamiento cambió entre v22 y v25** (de 7 a 8 familias — se separó "Moldes
Encofrados" como familia propia, se renombró "Cerrajería Liviana" a
"Herrería liviana" y ganó "Aberturas", se separó "Anclajes, Pernos e
Insertos"). El propio archivo v25 tiene un comentario en la línea 1350:
`// v25: reordenamiento de familias para alinear con la estructura real de
Gestsoft` — es decir, alguien ya ajustó esto a mano una vez, sin este
documento como referencia. Que no vuelva a pasar sin dejar constancia acá.

**Mapeo actual (Predictor Eq v25 — 8 familias):**
```
Calderería:                    Camisas, Cubas, Tuberías
Moldes Encofrados:             Moldes, Moldes Circulares, New Jersey
Estructura Pesada:             Industriales-Maritimas-Porticos, Vigas Conformadas - Cerchas,
                                Columnas, Perfiles a Medida, Pasos Peatonales,
                                Cubiertas - Techos - Plataforma
Chapa Cortada-Plegada:         Plegados, Platinas, Cajones UPN
Herrería liviana:               Barandas - Defensas, Cerramientos - Cercos - Fachada, Portones,
                                Marcos, Escaleras, Escalera Marinera, Rejas, Herreria, Aberturas
Soportería y Equipos:          Soportes - Perfiles con Platina, Mesas Industriales, Skids, Regueras
Anclajes, Pernos e Insertos:   Anclajes - Pernos, Pernos - Insertos
Varios:                        Trabajos Variados, Montajes
```

steel-measurement **todavía no usa este nivel** — Historial sólo agrupa por
Categoría. steelCRM tampoco lo usa — no tiene ningún concepto de
Familia/Categoría implementado hoy.

### Nivel 3 (Subcategoría) — catálogo legado de Gestsoft, uso bajo

Viene de la pantalla vieja de Gestsoft (Familia|Categoría con precio
USD/kg de referencia — ojo que ahí Gestsoft le dice "Familia" a lo que acá
llamamos **Categoría**, ver tabla de colisión abajo). Gino confirmó que esa
pantalla "no se usa mucho... a veces como referencia". **Ningún sistema
implementa este nivel todavía** — queda documentado pero de baja prioridad.

---

## 3. La colisión de nombres que ya existía (por qué este documento importa)

Antes de este acuerdo, la palabra "Familia" se usaba para DOS niveles
distintos según el sistema:

| Sistema | Le llama "Familia" a... | Le llama "Categoría" a... |
|---|---|---|
| Gestsoft (pantalla legada) | Nivel 2 (Herrería, Camisas, Barandas...) | Nivel 3 (variantes específicas) |
| Predictor Eq | Nivel 1 (los 8 grupos amplios) | Nivel 2 (Herrería, Camisas, Barandas...) |
| steel-measurement (Historial) | *(no tiene este nivel)* | Nivel 2, campo `categoria` (sin nombre de nivel 1 explícito) |

**De acá en más, en los tres softwares:** Familia = Nivel 1, Categoría =
Nivel 2, Subcategoría = Nivel 3. Cuando alguien diga "familia" refiriéndose
a Gestsoft, mentalmente traducilo a "categoría" en este vocabulario.

---

## 4. Cómo se sincronizan los datos compartidos (sin backend común todavía)

Los tres siguen siendo apps cliente-only (localStorage, sin servidor
compartido). Mientras eso no cambie, no hay forma automática de mantener
sincronizado un archivo entre los tres — hay que hacerlo a mano, con una
regla clara:

1. **Predictor Eq v25 es la fuente canónica actual** del mapeo
   Familia→Categoría — es el más completo, el más recientemente ajustado, y
   el que ya tiene un historial de decisiones (v22→v25) sobre cómo agrupar.
2. Cuando alguno de los tres necesite este mapeo, **copia el objeto
   `DEFAULT_FAMILIES` tal cual está en la versión más nueva de Predictor
   Eq** — no lo reinventa, no lo edita "un poco distinto para que quede
   mejor" en su propio sistema.
3. Si en cualquiera de los tres sistemas hace falta CAMBIAR el mapeo
   (agregar categoría, mover una a otra familia, etc.), el cambio se hace
   primero en Predictor Eq (dueño canónico), se anota en este documento
   (actualizando la tabla de §2), y recién después se re-copia a los otros
   dos. Nunca al revés.
4. Cuando alguno de los tres proyectos tenga un backend real (steelCRM ya
   tiene esa visión de producto en su propio CLAUDE.md), este archivo pasa
   a vivir ahí como una tabla/endpoint único, y los tres dejan de tener
   copias — ese es el objetivo final, esto es el puente hasta llegar ahí.

### Un problema más grande que este documento no resuelve todavía

steel-measurement y Predictor Eq ya tienen **cada uno su propio histórico de
239+ trabajos**, con la MISMA fuente (el Excel de fabricación) pero
**reestructurado con nombres de campo distintos** (steel-measurement:
`nro_ot/fecha/categoria/kg_total/desglose_pct{hier,mat,moFab,moMon,hesp,
tFab,tMon,trat,trasl,panto}`; Predictor Eq: `ot/fecha/kg/usd/comp{MAT,MO,
TRAT,MAQ,GEN,MG,TRASLADO,PINT_EXT}` agrupado por categoría). No son
compatibles campo a campo hoy. Esto es una decisión más grande (¿cuál es la
fuente maestra de los registros históricos, no sólo de la taxonomía?) que
queda **fuera del alcance de este documento** — se deja anotada acá para
que no se pierda, y se resuelve en una conversación aparte cuando Gino
quiera encararla.

---

## 5. Qué implementar en cada sistema (a partir de esto)

- **steel-measurement**: agregar un archivo con el mapeo Familia→Categoría
  (copiado de Predictor Eq v25) y usarlo para agrupar el Benchmark de
  Historial por Familia además de por Categoría — sin tocar el campo
  `categoria` existente, que ya está bien.
- **Predictor Eq**: ningún cambio necesario — sigue siendo la fuente
  canónica. Si se ajusta la taxonomía a futuro, actualizar este documento
  en el mismo cambio.
- **steelCRM**: cuando incorpore clasificación de presupuestos por tipo de
  trabajo, usar directamente esta misma tabla (Familia/Categoría) — no
  inventar una propia. Sugerido: al menos etiquetar por Categoría (nivel 2,
  el más usado), Familia es opcional.

---

## 6. Desglose Fabricación vs Montaje — investigado, decisión pendiente de backend

**Fecha:** 2026-08-06. Se investigó si el desglose `moFab`/`moMon`/`hesp`/`tFab`/`tMon`
de steel-measurement (campo `desglose_pct` en Historial) es real o vestigial,
para decidir si Predictor Eq (fuente canónica, ver §4) necesita sumarlo a su
propio schema de componentes de costo.

**Medido sobre las 239 obras de `historialSeed.js`:**

| Campo | % obras con valor | USD total | Estado |
|---|---|---|---|
| `hesp` (ya marcado "legado" en la UI de Historial) | 0% (0/239) | $0 | **Muerto.** No propagar a ningún schema compartido. |
| `moFab` / `tFab` (Fabricación) | 92% / 32% | $8.527 / $375 | Real, mayoritario — casi todo trabajo pasa por taller. |
| `moMon` / `tMon` (Montaje en obra) | 5% (12/239) | $780 / $271 | Real pero minoritario — solo los trabajos cuyo alcance incluye instalación en obra, no solo taller. |

**Conclusión:** el desglose Fab/Mon de steel-measurement es real (no es como
`hesp`), pero **no viene del Excel compartido** — el Excel origen
("Datos de fabricación.xlsx") solo trae una columna de mano de obra sin
dividir (`COL_ALIAS` de Predictor Eq: `'mo':'comp_mo'`, sin equivalente
Fab/Mon). La separación existe porque steel-measurement la captura a mano,
obra por obra, en un formulario más granular que el Excel — no es algo que
Predictor Eq pueda heredar simplemente leyendo el mismo archivo de siempre.

**Nota relacionada, no confundir:** Predictor Eq ya tiene su propia noción de
horas de montaje, pero a otro nivel — la hoja "Montajes" del Excel trae una
columna `HM` (Horas Montaje) que hoy se fusiona directamente en `HF` al
importar (`COL_ALIAS`: `'hm':'hf'`). Ese caso es "el trabajo ENTERO es
montaje" (una Categoría propia, "Montajes"). El de steel-measurement es "esta
obra es mayormente taller pero una porción también fue montaje". Son
conceptos complementarios, ninguno reemplaza al otro.

**Decisión (2026-08-06):** no construir todavía ningún puente de datos entre
steel-measurement y Predictor Eq para este desglose — ambos siguen siendo
client-only (localStorage, sin backend), y armar transporte manual
(export/import JSON) para un campo que solo aplica al 5% de las obras no se
justifica todavía. Queda así:
- Predictor Eq **no** suma `mo_fab`/`mo_mon` a su schema de componentes por
  ahora — seguiría vacío igual, no hay de dónde poblarlo sin el puente.
- `hesp` se descarta como candidato a campo compartido en cualquier futuro
  schema unificado — confirmado 100% sin uso.
- Cuando exista backend compartido (visión de producto ya anotada en el
  CLAUDE.md de steelCRM), retomar esto: Predictor Eq podría sumar
  `mo_fab`/`mo_mon` opcionales en su modelo de obra, poblados desde
  steel-measurement en el momento de la migración a backend.

---

## 7. Esquema de IDs compartido — Presupuesto ↔ Cálculo (2026-08-15)

**Acordado con Gino, desde la sesión de steelCRM:** cada sistema es dueño de
generar un identificador distinto, y la relación entre ambos es
**muchos-a-muchos**, no uno-a-uno.

| Identificador | Lo genera | Formato |
|---|---|---|
| **Código de presupuesto** (`nro` en steelCRM, ej. `P-0001`) | **steelCRM** | Correlativo propio (`P-XXXX`), o el valor heredado al importar histórico. |
| **Código de cálculo** (`idCalc`/`idsCalc` en steelCRM) | **steel-measurement** | **Libre por ahora, sin formato fijo acordado.** Si en algún momento steel-measurement define un formato fijo (ej. `CALC-0001`), avisar acá para que steelCRM pueda validar/reconocer el patrón — hoy no valida nada, es texto libre. |

**Por qué muchos-a-muchos:** un cálculo puede derivar en más de un
presupuesto (ej. una obra se cotiza en dos alternativas a partir del mismo
cómputo), y un presupuesto puede necesitar más de un cálculo (ej. estructura
+ montaje calculados por separado, un mismo presupuesto los junta).

**Del lado de steelCRM ya está implementado:**
- El campo pasó de `idCalc` (string único — solo soportaba cálculo→presupuestos)
  a **`idsCalc` (array de strings)** — ahora soporta la relación completa en
  ambos sentidos.
- Compatibilidad hacia atrás: los presupuestos ya guardados con el `idCalc`
  viejo (string) se siguen leyendo bien — no hubo migración destructiva de
  datos existentes (incluye 614 presupuestos históricos importados desde
  Gestsoft el 2026-08-14).
- La UI edita como texto separado por coma (`CALC-001, CALC-004`), sin
  componente de chips — se parsea a array recién al guardar.

**Del lado de steel-measurement (a implementar cuando se conecten):** si va a
escribir el código de cálculo en un presupuesto de steelCRM (o viceversa,
leer el código de presupuesto), debe esperar un **array de strings**, no un
string único — aunque hoy en la práctica la mayoría de los presupuestos van
a tener 0 o 1 elemento.

**Nota de estado (corrige lo anotado en `PLAN.md` línea ~777):** a la fecha
de este documento steelCRM **ya no es solo documentación** — tiene código
React funcionando, con datos reales de MMN cargados (614 presupuestos +
183 contactos históricos importados desde la planilla de Gestsoft). La
integración Steel Measurement ↔ steelCRM mencionada en `PLAN.md` §"pendiente"
puede empezar a diseñarse sobre código real, no sobre un proyecto vacío.

---

*Documento vivo — si la taxonomía cambia, actualizar la tabla de §2 acá
antes que en cualquiera de los tres códigos.*
