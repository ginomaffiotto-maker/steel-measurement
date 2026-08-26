# Diccionario de datos — Steel Platform (Supabase)

**Para:** cualquier sesión que escriba SQL, un reporte, una migración nueva,
o cualquier documento (manual, arquitectura) que necesite el detalle
columna por columna del esquema real.
**De:** sesión de documentación (`steelCRM - BUILDIING`)
**Fecha:** 2026-08-25
**Fuente:** las 24 migraciones de `steel-backend/supabase/migrations/`,
leídas completas (no de memoria).
**Relación con los otros dos documentos**: `ENTIDADES-COMPARTIDAS.md`
es el mapa de relaciones (qué tabla se conecta con cuál y por qué);
`ARQUITECTURA-COMPARTIDA.md` es cómo está armado el software. Este
documento es el nivel más fino: cada columna, su tipo, sus restricciones y
su significado de negocio cuando no es obvio. No repite lo que ya explican
los otros dos — para relaciones o para arquitectura, ir a esos.

---

## 0. Convenciones globales (para no repetir 58 veces lo mismo)

Salvo que se diga lo contrario en la tabla puntual, **toda tabla** tiene:

- `id uuid primary key default gen_random_uuid()`
- `tenant_id uuid not null references tenants(id) on delete cascade` — completado solo por el trigger `set_tenant_id_from_auth` en cada INSERT (no hace falta pasarlo desde el frontend); protegido por RLS (`tenant_id = current_tenant_id()`)
- Índice sobre `tenant_id` (o compuesto, cuando hay una columna de filtro frecuente — ej. `(tenant_id, estado)`)

**Excepciones a `id uuid` puro** (las únicas 5 en todo el esquema):
- `biblioteca_perfiles`, `biblioteca_planchuelas`, `biblioteca_planchas`, `biblioteca_rejillas` → `id` es **`text`**, sin default — usan el código de catálogo legible (`"HEB100"`) como identidad estable, a propósito, para poder matchear contra el catálogo semilla en cualquier instalación nueva.
- `tarifario_config` → PK es `tenant_id` directo (una sola fila por tenant, no una lista).

**`created_at`/`updated_at`** (`timestamptz default now()`): presentes en las
entidades "cabecera" (presupuestos, clientes, obras, computos, anidados,
etc.); **ausentes** en casi todas las tablas de detalle/línea (piezas,
rubros de costo, comentarios — estas solo tienen `created_at` o ninguna).

**Soft-delete** (`eliminado boolean not null default false` +
`eliminado_por text` + a veces `eliminado_fecha timestamptz`): no está en
todas las tablas — ver marca ✅ por tabla más abajo. Nunca se borra de
verdad una fila marcada; se filtra de las vistas activas y es recuperable
desde una Papelera admin-only. Detalle completo del patrón en
`ENTIDADES-COMPARTIDAS.md` §7.

---

## 1. Plataforma

### `tenants`
| Columna | Tipo | Nota |
|---|---|---|
| `nombre` | text not null | |
| `plan` | text not null default `'free'` | Sin lógica de billing todavía — solo el campo. |

### `profiles`
Única tabla sin `id` autogenerado: `id uuid primary key references auth.users(id) on delete cascade` — es 1:1 con el usuario real de Supabase Auth. Sin trigger de `tenant_id` (se asigna a mano al crear el usuario, antes de que exista sesión para que `current_tenant_id()` funcione).

| Columna | Tipo | Nota |
|---|---|---|
| `nombre` | text not null | |
| `rol` | text not null, check in (`admin`,`supervisor`,`vendedor`) | |
| `emoji`, `foto` | text | Avatar. |

Función `current_tenant_id()` (security definer): devuelve el `tenant_id` del usuario autenticado — la usan todas las policies RLS.

### `tenant_settings`
PK compuesta `(tenant_id, key)`. `value jsonb not null default '{}'`. Config libre por tenant — sin uso confirmado en UI todavía.

---

## 2. `clientes` (única, compartida entre Steel CRM y Steel Measurement)

| Columna | Tipo | Nota |
|---|---|---|
| `nombre`, `empresa`, `cargo` | text | |
| `celular`, `tel`, `tel_linea`, `email`, `linkedin` | text | Canales de contacto — usados por los botones directos de "contactar" en la UI. |
| `zona` | text | |
| `cumpleanos` | date | |
| `notas` | text | |
| `eliminado`, `eliminado_por`, `eliminado_fecha` | ✅ soft-delete | |

Índice extra: `(tenant_id, empresa)` — soporta el patrón `matchClienteBudget` (empresa con varios contactos).

---

## 3. Steel CRM

### `presupuestos_crm` — entidad central
| Columna | Tipo | Nota |
|---|---|---|
| `nro` | text not null | Único por `(tenant_id, nro)`. Formato configurable en Config > Sistema (prefijo, dígitos, año, reinicio anual). |
| `cliente_id` | uuid → `clientes` on delete set null | |
| `cliente_nombre`, `empresa` | text | Copia desnormalizada (para no perder el nombre si el cliente se borra). |
| `fecha` | date | |
| `tipo` | text | Campo interno; la UI lo muestra como "Categoría" (32 valores canónicos de Predictor Eq, ver `TAXONOMIA-COMPARTIDA.md`). |
| `categoria`, `producto`, `descripcion`, `obra` | text | |
| `kg_cotizados`, `precio_usd_kg`, `monto_usd`, `monto_final` | numeric | El monto digitado por el usuario (`monto_final`) siempre prevalece sobre el cálculo automático — nunca se sobreescribe sin acción explícita. |
| `moneda` | text not null default `'USD'`, check in (`USD`,`UYU`) | |
| `estado_nativo` | text not null default `'enviado'`, check in (`enviado`,`en negociación`,`recotizado`,`licitación`,`aceptado`,`facturado`,`no aprobado`) | El estado comercial real. No confundir con `estado_sm` (informativo, viene de un import de Steel Measurement) — ese campo vive del lado local/UI, no en esta tabla. |
| `probabilidad`, `cierre` | numeric / date | Usados por Forecast. |
| `notas` | text | |
| `vendedor_id` | uuid → `profiles` on delete set null | |
| `motivo_perdida` | text | Obligatorio en la UI cuando `estado_nativo = 'no aprobado'`. |
| `recotizacion_de_id` | uuid → `presupuestos_crm` (self) on delete set null | Cadena de recotización — una recotización es una fila nueva, no un cambio de estado del original. |
| `estado_obra` | text, check in (`''`,`Adjudicada`,`Licitación`,`Directa`) | |
| `plazo_pago`, `porcentaje_negociacion`, `acabado_superficial` | int / numeric / text | |
| `ids_calc` | **text[]** | Códigos de cálculo de Steel Measurement vinculados — texto libre, sin FK. Ver §6 de `ENTIDADES-COMPARTIDAS.md`. |
| `fecha_aceptado`, `fecha_facturado` | date | |
| `eliminado`, `eliminado_por`, `eliminado_fecha` | ✅ soft-delete | |

### `comentarios_presupuesto` / `comentarios_obra` / `comentarios_ficha_aceptado`
Misma forma en las 3 (genéricas vía `comentarioToDB`/`FromDB` con `table` como parámetro):

| Columna | Tipo | Nota |
|---|---|---|
| `presupuesto_id` / `obra_id` / `ficha_id` | uuid → tabla padre, `on delete cascade` | |
| `autor` | text | Nombre, no FK a `profiles` — el permiso de borrado compara por nombre. |
| `texto` | text not null | |
| `fecha`, `hora` | date / text | |
| `eliminado`, `eliminado_por` | ✅ soft-delete (sin `eliminado_fecha` en estas 3 — "soft-delete liviano") | |

### `descuentos_pendientes`
| Columna | Tipo | Nota |
|---|---|---|
| `presupuesto_id` | uuid → `presupuestos_crm` on delete cascade | |
| `monto_original`, `monto_solicitado` | numeric | |
| `motivo` | text | |
| `solicitado_por`, `resuelto_por` | uuid → `profiles` on delete set null | |
| `fecha`, `resuelto_fecha` | timestamptz | |
| `estado` | text not null default `'pendiente'`, check in (`pendiente`,`aprobado`,`rechazado`) | Nunca se borra al resolver — es el único historial de descuentos del sistema. |

### `seguimientos`
| Columna | Tipo | Nota |
|---|---|---|
| `cliente_id` | uuid → `clientes` on delete set null | |
| `presupuesto_id` | uuid → `presupuestos_crm` on delete set null | |
| `solicitud_id` | uuid → `solicitudes` on delete set null | FK agregada con `alter table` después de que existiera `solicitudes` (dependencia circular de creación). |
| `fecha`, `hora`, `tipo`, `nota` | date/text | |
| `completado` | boolean not null default false | |
| `zoom_link` | text | |
| `eliminado`, `eliminado_por`, `eliminado_fecha` | ✅ soft-delete | |

### `historial_interacciones`
`cliente_id → clientes`, `presupuesto_id → presupuestos_crm` (ambos `on delete set null`), `fecha`, `tipo`, `resumen`, `texto_completo`. ✅ soft-delete.

### `competencia`
`empresa`, `presupuesto_id → presupuestos_crm`, `precio_usd`, `kg_cotizados`, `motivo`, `motivo_detalle`, `notas`, `fecha`. Sin soft-delete.

### `obras`
`nombre`, `direccion`, `empresa`, `fecha_inicio`, `fecha_fin`, `estado` (check in `activa`/`finalizada`/`pausada`/`cancelada`), `notas`. ✅ soft-delete.

### `obra_presupuestos`
Solo `obra_id → obras`, `presupuesto_id → presupuestos_crm` (ambos cascade), `unique(obra_id, presupuesto_id)`. Tabla de vínculo pura — el esquema permite muchos-a-muchos pero la UI fuerza 1 obra por presupuesto (ver `ENTIDADES-COMPARTIDAS.md` §4).

### `solicitudes`
| Columna | Tipo | Nota |
|---|---|---|
| `cliente_id` | uuid → `clientes` on delete set null | |
| `cliente_nombre`, `obra`, `direccion_obra`, `contacto`, `tel`, `email` | text | Copia desnormalizada — la solicitud puede llegar antes de cargar el cliente formalmente. |
| `fecha_recepcion`, `fecha_limite`, `fecha_envio`, `fecha_resolucion` | date | |
| `tipos_trabajo` | text[] not null default `'{}'` | |
| `link_archivos`, `notas` | text | |
| `horas_estimadas`, `horas_reales` | numeric | |
| `fecha_inicio_elab`, `cronometro_activo` | date / boolean | Cronómetro de elaboración de la cotización. |
| `nro_gestsoft` | text | Vínculo con el sistema legado. |
| `estado` | text not null default `'recibida'`, check in (`recibida`,`en elaboración`,`enviada`,`ganada`,`perdida`) | |
| `asignado_a` | uuid → `profiles` on delete set null | |
| `presupuesto_id` | uuid → `presupuestos_crm` on delete set null | Se completa al "ganar". |
| `eliminado`, `eliminado_por`, `eliminado_fecha` | ✅ soft-delete | |

### `solicitud_versiones`
`solicitud_id → solicitudes` cascade, `v` (int), `fecha`, `autor`, `descripcion`, `nro_gestsoft`. Sin soft-delete propio (vive y muere con la solicitud).

### `metas`
`nombre`, `tipo` (check in `monto`/`presupuestos`/`aprobacion`/`seguimientos`/`clientes_nuevos`/`kg_vendidos`), `valor`, `periodo` (check in `mes`/`trimestre`/`semestre`/`anio`), `icono`, `color`, `asignado_a_todos` (boolean default true), `activa`, `umbral_alerta` (numeric default 80), `notas_supervisor`, `mostrar_en_inicio`.

### `meta_usuarios`
`meta_id → metas` cascade, `profile_id → profiles` cascade, `unique(meta_id, profile_id)`. Solo se llena cuando `asignado_a_todos = false`.

### `fichas_aceptados`
`presupuesto_id → presupuestos_crm`, **unique** (relación 1:1). `numero_ot`, `forma_pago`, `contactos_admin`, `notas_admin`, `kg_fabricados`, `kg_montados`, `horas_fabricacion`, `horas_montaje`, `detalles_trabajo`, `cambios_cliente`, `link_planos`, `link_contrato`, `link_otros`, `notas_docs`, `fecha_fin`. ✅ soft-delete.

### `ficha_ordenes_compra` / `ficha_facturas`
Misma forma: `ficha_id → fichas_aceptados` cascade, `numero`, `fecha`, `monto`.

### `ficha_fechas_pago`
`ficha_id → fichas_aceptados` cascade, `fecha`, `monto`, `nota`, `cobrado` (boolean default false).

---

## 4. Steel Measurement

### `presupuestos_sm` — entidad central
| Columna | Tipo | Nota |
|---|---|---|
| `nro` | text | Numeración interna de Steel Measurement — **no** es lo mismo que `nro` de `presupuestos_crm`. |
| `codigo_calculo` | text | Antes `not null` — relajado (`fix_steel_measurement_schema`, 24/8) porque hay presupuestos reales más viejos que la funcionalidad y nunca tuvieron uno. Único por `(tenant_id, codigo_calculo)`. Es el identificador que viaja a Steel CRM (`ids_calc`). |
| `nombre`, `contacto`, `obra`, `detalle`, `empresa` | text | |
| `cliente_id` | uuid → `clientes` on delete set null | |
| `tipo_trabajo`, `categoria` | text | Misma lista canónica de 32 que `tipo` en Steel CRM — sin traducción. Viaja Cómputo → Anidado → Presupuesto (traspaso automático, nunca pisa lo ya cargado a mano). |
| `estado` | text not null default `'borrador'`, check in (`borrador`,`enviado`,`aprobado`,`rechazado`) | **Vocabulario propio, distinto al de Steel CRM** — nunca mapear 1:1. |
| `clonado_de_id` | uuid → `presupuestos_sm` (self) on delete set null | |
| `negociacion_pct`, `negociacion_usd`, `neg_modo` | numeric/text | |
| `interes_pct`, `interes_dias` | numeric/int | Interés financiero por plazo de pago. |
| `tc` | numeric | Tipo de cambio histórico de ese presupuesto puntual — agregado tarde (`fix_steel_measurement_schema`, era un campo real de la UI que nunca se había persistido). |
| `vendedor` | uuid → `profiles` on delete set null | |
| `notas`, `fecha` | text/date | |
| `eliminado`, `eliminado_por`, `eliminado_fecha` | ✅ soft-delete | |

### `items_presupuesto_sm`
`presupuesto_id → presupuestos_sm` cascade. `titulo`, `cantidad` (default 1), `n_plano`, `no_agrega_kg` (boolean). `computo_id → computos` on delete set null (opcional). `anidado_id → anidados` on delete set null (opcional, agregada después — un ítem puede traer material de un cómputo o de un anidado). `tipo` check in (`fabricacion`,`montaje`,`fab_mont`). `orden` int.

### Los 9 rubros de costo por ítem (todas `item_id → items_presupuesto_sm` cascade)

| Tabla | Columnas propias | Nota |
|---|---|---|
| `item_hierros` | `nombre`, `proveedor`, `fecha_precio`, `obs`, `cantidad`, `kg_pieza`, `area_pieza_m2`, `usd_kg`, `arena`/`pintura`/`galvanizado` (bool), `subtotal_kg`/`subtotal_m2`/`subtotal_usd`, `pct_desperdicio`, `orden` | Material principal (perfiles/planchas del ítem). |
| `item_mat_generales` | `nombre`, `proveedor`, `fecha_precio`, `cantidad`, `kg_unit`, `m2_unit`, `usd_unit`, `obs`, `subtotal_usd`, `orden` | Bulones, insumos, etc. |
| `item_mo_fabricacion` / `item_mo_montajes` | `categoria`, `tipo_hora`, `pct_adicional`, `tarea`, `detalle`, `cant_horas`, `usd_hora`, `subtotal_usd`, `orden` | Mano de obra propia. |
| `item_terc_fabricacion` / `item_terc_montajes` | `nombre`, `empresa`, `fecha_precio`, `cantidad`, `unidad`, `usd_unit`, `subtotal_usd`, `detalle`, `orden` | Tercerizado. |
| `item_traslados` | `nombre`, `proveedor`, `fecha_precio`, `cantidad`, `unidad`, `usd_unit`, `detalle`, `subtotal_usd`, `orden` | |
| `item_corte_pantografo` | `nombre`, `tipo` (check `2D`/`3D`), `usd_kg`, `kg`, `subtotal_usd`, `detalle`, `orden` | |
| `item_trat_superficie` | `item_id` **unique** (1:1 con el ítem, no una lista) — `arenado_m2`, `arenado_usd_m2`, `galvanizado` (bool), `galvanizado_kg`, `galvanizado_usd_kg`, `pintura_m2` | Cabecera de tratamiento; pinturas y otros cuelgan de acá, no del ítem. |
| `item_trat_pinturas` | `trat_id → item_trat_superficie` cascade — `nombre`, `usd_lt`, `cant_lt`, `cant_manos`, `subtotal_usd` | |
| `item_trat_otros` | `trat_id → item_trat_superficie` cascade — `nombre`, `usd_kg` | |

### `computos`
`nombre`, `fecha`, `cliente_id → clientes`, `cantidad_total`, `nro`, `categoria`, `tipo_trabajo` (agregadas 24/8, ver arriba), `vendedor → profiles`. ✅ soft-delete (agregado 24/8, mismo commit que `categoria`/`tipo_trabajo`/`vendedor` — un hueco real donde estos 3 campos se guardaban solo local y nunca sincronizaban, cerrado en la misma migración).

### `computo_items`
`computo_id → computos` cascade. `titulo`, `cantidad`, `n_plano`, `orden`.

### `computo_piezas`
`computo_item_id → computo_items` cascade. `tipo` check (`perfil`,`plancha`). `material_id` (text, referencia lógica al catálogo de biblioteca — sin FK real porque biblioteca usa 4 tablas distintas según tipo). `material_nombre`, `kg_m`, `sup_m2m`, `largo_mm`, `ancho_mm`, `kg_m2`, `cantidad`. `granallado`/`pintura`/`galvanizado` (bool) + sus `pct_*`. `corte_maquina` (bool), `maquina`. `precio_raw`, `precio_por` (check `kg`/`m`/`m2`), `moneda`, `proveedor`, `fecha_precio`, `obs`.

### `anidados`
`nombre`, `fecha`, `cliente_id → clientes`, `obra`, `empresa`, `categoria`, `tipo_trabajo`, `vendedor → profiles`. ✅ soft-delete (mismo momento y motivo que `computos`).

### `anidado_grupos`
`anidado_id → anidados` cascade. `tipo` check (`perfil`,`plancha`). `material_id`, `material_nombre`, `kg_m`, `sup_m2m`, `kg_m2` (agregada aparte — los grupos tipo plancha la necesitan, los de perfil usan `kg_m`/`sup_m2m`). `largo_barra_mm`, `kerf_mm`, `sheet_w`, `sheet_h`. `granallado`/`pintura`/`galvanizado` (bool). **`resultado jsonb`** — única columna verdaderamente "libre" del esquema, a propósito: es la salida calculada del algoritmo de optimización de corte, no una línea de costo estructurada. `orden`.

### `anidado_piezas`
`grupo_id → anidado_grupos` cascade. `largo_mm`, `ancho_mm`, `cantidad`, `etiqueta`.

### `historial_trabajos` — benchmark para Predictor Eq
`nro_ot`, `fecha`, `cliente_id → clientes`, `obra`, `empresa`, `categoria`, `tipo_trabajo`, `kg_total`, `metros_total`, `usd_total`, `vendedor → profiles` (agregada 25/8, después que `computos`/`anidados`/`presupuestos_sm` ya la tenían — a pedido de Gino, para poder filtrar por vendedor acá también). ✅ soft-delete. Más 10 columnas `pct_*` (porcentaje de cada rubro sobre el total): `pct_hier`, `pct_mat`, `pct_mo_fab`, `pct_mo_mon`, `pct_hesp`, `pct_t_fab`, `pct_t_mon`, `pct_trat`, `pct_trasl`, `pct_panto`.

### Biblioteca de materiales — 4 tablas, `id` **text** (no uuid, ver §0)
| Tabla | Columnas propias |
|---|---|
| `biblioteca_perfiles` | `nombre`, `cat`, `kg_m`, `largo`, `sup`, `precio_usd_kg` |
| `biblioteca_planchuelas` | `nombre`, `cat`, `ancho_mm`, `espesor_mm`, `kg_m`, `largo`, `sup`, `precio_usd_kg` |
| `biblioteca_planchas` | `nombre`, `espesor`, `kg_m2`, `largo_mm`, `ancho_mm`, `area_m2`, `kg_ud`, `precio_usd_kg` |
| `biblioteca_rejillas` | `nombre`, `kg_m2`, `largo_mm`, `ancho_mm`, `area_m2`, `kg_ud`, `precio_usd_kg`, `notas` |

### `material_historial_precios`
`material_tipo` check in (`perfil`,`planchuela`,`plancha`,`rejilla`), `material_id` (**text**, sin FK real — apunta a una de las 4 tablas de arriba según `material_tipo`), `fecha`, `proveedor`, `precio`.

### Tarifario — 7 tablas de lista + 1 de config única
`tarifario_mo_fab`, `tarifario_mo_mon`, `tarifario_mat_generales`, `tarifario_terceros`, `tarifario_traslados`, `tarifario_pinturas`: todas `nombre` + `usd`/`usd_hora`. `tarifario_interes_financiero`: `nombre`, `moneda`, `dias`, `pct`. `tarifario_config` (PK = `tenant_id`, una sola fila): `arenado_usd_m2`, `galvanizado_usd_kg`, `panto_usd_kg_2d`, `panto_usd_kg_3d`.

### `comentarios_computo` / `comentarios_anidado` / `comentarios_presupuesto_sm`
Misma forma que los comentarios de Steel CRM (`computo_id`/`anidado_id`/`presupuesto_id` → tabla padre cascade, `autor`, `texto`, `fecha`, `hora`). Sin columnas de soft-delete propias en la migración original de Steel Measurement — a diferencia de las de Steel CRM, que sí las ganaron después (`soft_delete_comentarios`, ver §0). Confirmar contra el código si esto cambió antes de asumir.

---

## 5. `presupuesto_calculo_link` — el vínculo real, sin usar

`presupuesto_crm_id → presupuestos_crm` cascade, `presupuesto_sm_id → presupuestos_sm` cascade, `unique(presupuesto_crm_id, presupuesto_sm_id)`. Sin columnas de negocio — es una tabla de vínculo pura. Estado y motivo por el que no está wireada: `ENTIDADES-COMPARTIDAS.md` §6.

---

## 6. Mantenimiento de este documento

Misma Regla 9 que los otros dos documentos compartidos: toda sesión que
agregue, borre, modifique o relaje una columna/constraint en
`steel-backend/supabase/migrations/` actualiza la tabla correspondiente
acá, en el mismo commit.
