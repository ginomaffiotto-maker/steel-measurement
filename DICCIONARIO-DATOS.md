# Diccionario de datos — Steel Platform (Supabase)

**Para:** cualquier sesión que escriba SQL, un reporte, una migración nueva,
o cualquier documento (manual, arquitectura) que necesite el detalle
columna por columna del esquema real.
**De:** sesión de documentación (`steelCRM - BUILDIING` → `SteelPlatform`)
**Fecha:** 2026-08-25, actualizado 2026-09-11
**Fuente:** las 65 migraciones de `steel-backend/supabase/migrations/`,
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
desde una Papelera (admin y supervisor desde 2026-08-25; la purga real
sigue siendo admin-only). Detalle completo del patrón en
`ENTIDADES-COMPARTIDAS.md` §7, y del candado de dueño (RLS por
propiedad, distinto de esto) en `ENTIDADES-COMPARTIDAS.md` §8.

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
| `acceso_crm`, `acceso_costos` | boolean not null default `true` | 2026-09-04 — control de acceso por módulo (vender Steel CRM/Steel Costos por separado dentro del mismo tenant). Default `true` no bloquea a nadie ya invitado; solo se aplica en el cliente (React), RLS no lo verifica. |
| `invitado_pendiente` | boolean not null default `false` | 2026-09-03 — se marca al invitar, se limpia sola en el primer login real. Alimenta el badge "⏳ Invitado — pendiente". |

Función `current_tenant_id()` (security definer): devuelve el `tenant_id` del usuario autenticado — la usan todas las policies RLS. Desde 2026-09-03 existe también `current_user_rol()` (mismo patrón), usada por las policies del candado de dueño (ver `ENTIDADES-COMPARTIDAS.md` §8).

### `tenant_settings`
PK compuesta `(tenant_id, key)`. `value jsonb not null default '{}'`. Sin uso real hasta 2026-09-02 — desde esa fecha: Steel CRM guarda acá su Config completo (key `"config"`) y la API key de IA (key `"ai_key"`), Steel Costos guarda nombre de empresa/datos de empresa/formato de numeración/símbolo de moneda, cada uno con su propia key. Gana la nube sobre el valor local una sola vez al montar (mismo criterio que Fase 5 del resto de entidades).

### `categorias_trabajo` (única, compartida entre Steel CRM y Steel Costos — nueva 2026-09-06)
| Columna | Tipo | Nota |
|---|---|---|
| `familia` | text not null | |
| `categoria` | text not null | `unique(tenant_id, categoria)`. |
| `orden` | int not null default 0 | |
| `updated_at` | timestamptz | Única tabla de esta lista que sí tiene trigger de `updated_at` desde el día que se creó. |

Reemplaza la constante fija que vivía en código (`CATEGORIAS_DEFAULT` en
steelcrm, `utils/taxonomia.js` en Steel Costos) — alta al vuelo desde
cualquiera de los dos sistemas. Backfill automático de las 32 categorías
canónicas (Predictor Eq v25) por tenant existente, `on conflict do
nothing`. Los campos `categoria`/`tipo` de `presupuestos_crm`/
`solicitudes`/`computos` la referencian **por valor** (texto), sin FK.

---

## 2. `clientes` (única, compartida entre Steel CRM y Steel Costos)

| Columna | Tipo | Nota |
|---|---|---|
| `nombre`, `empresa`, `cargo` | text | |
| `celular`, `tel`, `tel_linea`, `email`, `linkedin` | text | Canales de contacto — usados por los botones directos de "contactar" en la UI. |
| `zona` | text | |
| `cumpleanos` | date | |
| `notas` | text | |
| `empresa_id` | uuid → `empresas` on delete set null | Agregada 2026-08-29. Convive con `empresa` (texto) — no se resuelve/sincroniza en ningún `toDB` todavía (a diferencia de `obra_id`/`empresa_id` en otras tablas), queda la columna lista para cuando se decida wirearla. |
| `eliminado`, `eliminado_por`, `eliminado_fecha` | ✅ soft-delete | |

Índice extra: `(tenant_id, empresa)` — soporta el patrón `matchClienteBudget` (empresa con varios contactos).

### `empresas` (única, compartida entre Steel CRM y Steel Costos — nueva 2026-08-29)
| Columna | Tipo | Nota |
|---|---|---|
| `nombre` | text | Razón social. |
| `rut`, `direccion`, `telefono`, `email`, `notas` | text | |
| `eliminado`, `eliminado_por`, `eliminado_fecha` | ✅ soft-delete | |

"Igual que Cliente y Obra" (pedido de Gino) — reemplaza el texto libre que
tenía Empresa hasta ahora, sin ninguna tabla propia. Sin auto-creación
silenciosa al tipear en ningún formulario: la única forma de crear una fila
nueva es `EmpresaRapidaModal`, obligatorio. Sin pantalla de administración
propia (a diferencia de Clientes/Obras, que sí la tienen en Steel CRM) —
decisión explícita de Gino, solo alta desde el cartel por ahora. La
migración `20260829150000_empresas.sql` backfillea automáticamente toda
razón social ya en uso en `clientes`/`obras`/`presupuestos_crm`/
`presupuestos_sm`/`historial_trabajos` (no en `computos`/`anidados`: esas
dos nunca tuvieron columna `empresa` en la base, nada que recuperar).

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
| `estado_nativo` | text not null default `'enviado'`, check in (`enviado`,`en negociación`,`recotizado`,`licitación`,`aceptado`,`facturado`,`no aprobado`) | El estado comercial real. No confundir con `estado_sm` (informativo, viene de un import de Steel Costos) — ese campo vive del lado local/UI, no en esta tabla. |
| `probabilidad`, `cierre` | numeric / date | Usados por Forecast. |
| `notas` | text | |
| `vendedor_id` | uuid → `profiles` on delete set null | |
| `motivo_perdida` | text | Obligatorio en la UI cuando `estado_nativo = 'no aprobado'`. |
| `recotizacion_de_id` | uuid → `presupuestos_crm` (self) on delete set null | Cadena de recotización — una recotización es una fila nueva, no un cambio de estado del original. |
| `estado_obra` | text, check in (`''`,`Adjudicada`,`Licitación`,`Directa`) | |
| `plazo_pago`, `porcentaje_negociacion`, `acabado_superficial` | int / numeric / text | |
| `ids_calc` | **text[]** | Códigos de cálculo de Steel Costos vinculados — texto libre, sin FK. Ver §6 de `ENTIDADES-COMPARTIDAS.md`. |
| `fecha_aceptado`, `fecha_facturado` | date | |
| `fecha_rechazo` | date | 2026-09-06 — espejo de las dos anteriores, autocompletada la primera vez que el presupuesto llega a "no aprobado" (excepto por recotización). Alimenta "Tiempo de Respuesta" en Dashboard para el caso de rechazo, no solo aprobación. |
| `empresa_id` | uuid → `empresas` on delete set null | 2026-09-05. |
| `costo_real_usd` | numeric | 2026-09-03 — colchón de negociación (no es margen contable). Steel Costos lo calcula y escribe (desglose real por rubro, sin markup); Steel CRM solo lee, vía `presupuesto_calculo_link`. |
| `margen_negociacion_pct` | numeric | 2026-09-03 — % que el vendedor tiene para negociar sin bajar del costo real. Visible al vendedor dueño, no solo admin/supervisor. |
| `link_archivos` | text | 2026-09-06 — enlace a carpeta (Drive/Dropbox). Se copia una sola vez desde `solicitudes.link_archivos` al crear el presupuesto desde una Solicitud; si no, se carga directo. La Ficha de Aceptados lo hereda en vivo por su relación 1:1, sin columna propia. |
| `terminos_condiciones` | text | 2026-09-06 — override opcional por presupuesto del bloque "Términos y condiciones" del PDF; el default vive en Config > Sistema (localStorage, no en esta tabla). |
| `mostrar_usd_kg_pdf` | boolean, nullable | 2026-09-04 — override por presupuesto del toggle USD/kg del PDF. `null` = usa el default de la empresa; `true`/`false` = fuerza mostrar/ocultar. |
| `eliminado`, `eliminado_por`, `eliminado_fecha` | ✅ soft-delete | |

**Candado de dueño (RLS, 2026-09-03)** — ver `ENTIDADES-COMPARTIDAS.md` §8:
UPDATE (incluye el soft-delete) restringido a `vendedor_id = auth.uid()` o
admin/supervisor; SELECT/INSERT sin cambios.

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
| `vendedor_id` | uuid → `profiles` on delete set null | 2026-09-03 — nullable, completado solo por trigger (`seguimientos_set_vendedor`) en cada INSERT nuevo, sin backfill retroactivo. **Candado de dueño más estricto que el resto (ver `ENTIDADES-COMPARTIDAS.md` §8)**: restringe también el SELECT — un vendedor sin asignación no ve los seguimientos de otro (confirmado por Gino: "son de cada vendedor"). Un registro sin `vendedor_id` (todo lo viejo) queda visible/editable por cualquiera. |
| `eliminado`, `eliminado_por`, `eliminado_fecha` | ✅ soft-delete | |

### `historial_interacciones`
`cliente_id → clientes`, `presupuesto_id → presupuestos_crm` (ambos `on delete set null`), `fecha`, `tipo`, `resumen`, `texto_completo`. ✅ soft-delete. Sin ningún flujo de edición de una interacción ya guardada (solo crear/borrar/restaurar). El borrado (soft-delete y purga real) quedó restringido (RLS, 2026-09-05) a admin/supervisor únicamente, sin excepción de "quien la cargó" — decisión de Gino: es un registro del cliente/equipo, no de una persona.

### `competencia`
`empresa`, `presupuesto_id → presupuestos_crm`, `precio_usd`, `kg_cotizados`, `motivo`, `motivo_detalle`, `notas`, `fecha`, `eliminado`, `eliminado_por`, `eliminado_fecha`. ✅ soft-delete desde 2026-09-07 — hasta esa fecha era el único borrado duro (sin Papelera, sin contraseña) de todo el sistema; sin RLS especial, mismo patrón que clientes/obras/presupuestos.

### `obras`
`nombre`, `direccion`, `empresa`, `fecha_inicio`, `fecha_fin`, `estado` (check in `activa`/`finalizada`/`pausada`/`cancelada`), `notas`, `empresa_id` (uuid → `empresas` on delete set null, 2026-09-05). ✅ soft-delete. Hasta 2026-08-29 solo la consumía Steel CRM (`obra_presupuestos`) — desde esa fecha también `computos`/`anidados`/`presupuestos_sm` de Steel Costos, vía `obra_id` directo (sin tabla de vínculo intermedia).

### `obra_presupuestos`
Solo `obra_id → obras`, `presupuesto_id → presupuestos_crm` (ambos cascade), `unique(obra_id, presupuesto_id)`. Tabla de vínculo pura — el esquema permite muchos-a-muchos pero la UI fuerza 1 obra por presupuesto (ver `ENTIDADES-COMPARTIDAS.md` §4).

### `solicitudes`
| Columna | Tipo | Nota |
|---|---|---|
| `cliente_id` | uuid → `clientes` on delete set null | |
| `cliente_nombre`, `obra`, `direccion_obra`, `contacto`, `tel`, `email` | text | Copia desnormalizada — la solicitud puede llegar antes de cargar el cliente formalmente. |
| `fecha_recepcion`, `fecha_limite`, `fecha_envio`, `fecha_resolucion` | date | `fecha_limite` obligatoria en la UI desde el 2026-08-26. |
| `categoria` | text | Agregada 2026-08-26. Lista canónica de 32 (ahora tabla real `categorias_trabajo`, ver §1), obligatoria en la UI al guardar. |
| `creado_por` | text | Agregada 2026-08-26. Nombre fijado una sola vez al crear la solicitud — a diferencia de `asignado_a` (reasignable), este no cambia, para no perder el rastro de quién la cargó originalmente. |
| `tipos_trabajo` | text[] not null default `'{}'` | Lista vieja de 10 estilo Gestsoft. Reemplazada en la UI por `tipo_trabajo` (abajo) el 2026-09-06 — se sigue leyendo como respaldo en 3 lugares (prioridad automática, badge de lista, creación de presupuesto) pero ya no se vuelve a escribir. |
| `tipo_trabajo` | text | 2026-09-06/07 — valor único (Fabricación/Montaje/Fabricación y Montaje, mismo criterio que `presupuestos_crm.tipo`), reemplaza a `tipos_trabajo`. Agregada el 06/9 en el frontend pero la columna real (y el sync) llegó un día después — bug real: el valor elegido quedaba 100% local hasta entonces. |
| `producto` | text | 2026-09-05 — existía y era obligatorio en el formulario desde antes, pero nunca se sincronizaba (bug real: Steel Costos, que lee esta tabla directo, nunca lo veía). |
| `empresa` | text | 2026-09-05, mismo bug/fix que `producto`. |
| `empresa_id` | uuid → `empresas` on delete set null | 2026-09-05. |
| `estado_obra` | text, check in (`''`,`Adjudicada`,`Licitación`,`Directa`) | 2026-09-02 — mismo campo/lista que ya tenía `presupuestos_crm`, obligatorio al crear. |
| `prioridad_manual` | text, nullable | 2026-09-05 — override opcional del score automático de prioridad (0-100). El score se sigue calculando siempre y se muestra como referencia; si `prioridad_manual` está cargado, gana. |
| `link_archivos`, `notas` | text | |
| `horas_estimadas`, `horas_reales` | numeric | **Sin uso desde 2026-09-06** — el cronómetro manual (junto con `fecha_inicio_elab`/`cronometro_activo`) se sacó del todo, sin datos reales detrás de ningún reporte. Reemplazado por 2 tiempos medidos solos: "Solicitud → Presupuesto" (Dashboard > Pipeline, por fecha) y "Tiempo de Respuesta" extendido a rechazo (vía `presupuestos_crm.fecha_rechazo`). |
| `fecha_inicio_elab`, `cronometro_activo` | date / boolean | Ídem — sin uso desde 2026-09-06, columnas sin borrar. |
| `nro_gestsoft` | text | Vínculo con el sistema legado. |
| `estado` | text not null default `'recibida'`, check in (`recibida`,`en elaboración`,`enviada`,`ganada`,`perdida`) | |
| `asignado_a` | uuid → `profiles` on delete set null | |
| `presupuesto_id` | uuid → `presupuestos_crm` on delete set null | Se completa al "ganar". |
| `eliminado`, `eliminado_por`, `eliminado_fecha` | ✅ soft-delete | |

**Candado de dueño (RLS, 2026-09-05)** — ver `ENTIDADES-COMPARTIDAS.md` §8:
UPDATE restringido a `asignado_a = auth.uid()`, sin asignar, o admin/
supervisor — con una excepción real: el dueño actual SÍ puede reasignar
`asignado_a` a un tercero (el `WITH CHECK` solo valida `tenant_id`).

### `solicitud_versiones`
`solicitud_id → solicitudes` cascade, `v` (int), `fecha`, `autor`, `descripcion`, `nro_gestsoft`. Sin soft-delete propio (vive y muere con la solicitud).

### `metas`
`nombre`, `tipo` (check in `monto`/`presupuestos`/`aprobacion`/`seguimientos`/`clientes_nuevos`/`kg_vendidos`), `valor`, `periodo` (check in `mes`/`trimestre`/`semestre`/`anio`), `icono`, `color`, `asignado_a_todos` (boolean default true), `activa`, `umbral_alerta` (numeric default 80), `notas_supervisor`, `mostrar_en_inicio`.
`escalones` (jsonb, nullable — `[{valor, premio}, ...]`, 3 escalones mínimo/medio/máximo) y `sobregiro` (jsonb, nullable — `{desde, hasta, premioAdicional}`, extensión proporcional más allá del último escalón, hoy solo usada por `tipo="monto"`). Agregadas 2026-08-31: antes Bonificaciones.jsx (steelcrm) tenía sus propios 3 escalones + sobregiro hardcodeados en `calcBonus()`, ahora editables desde Config > Metas y leídos de acá — `calcBonus()` queda como fallback para cuando una meta todavía no tiene `escalones` cargados.
`alcance` (text, 2026-09-05 — `individual`/`equipo`) y `beneficiario` (text, mismo commit — **no es FK real**, guarda el id LOCAL de quién cobra el bono de una meta de equipo; las ventas de `asignadoA` se siguen sumando todas, pero el premio lo ve solo esta persona, ej. el supervisor). `valores_por_usuario` (jsonb, mismo commit) quedó **sin uso desde el frontend** — el primer intento (tabla de "objetivos personalizados por usuario" dentro de la meta) se probó en vivo y se revirtió, Gino no lo encontró claro.

### `meta_usuarios`
`meta_id → metas` cascade, `profile_id → profiles` cascade, `unique(meta_id, profile_id)`. Solo se llena cuando `asignado_a_todos = false`.

### `fichas_aceptados`
`presupuesto_id → presupuestos_crm`, **unique** (relación 1:1). `numero_ot`, `forma_pago`, `contactos_admin`, `notas_admin`, `kg_fabricados`, `kg_montados`, `horas_fabricacion`, `horas_montaje`, `detalles_trabajo`, `cambios_cliente`, `link_planos`, `link_contrato`, `link_otros`, `notas_docs`, `fecha_fin`. ✅ soft-delete.

### `ficha_ordenes_compra` / `ficha_facturas`
Misma forma: `ficha_id → fichas_aceptados` cascade, `numero`, `fecha`, `monto`.

### `ficha_fechas_pago`
`ficha_id → fichas_aceptados` cascade, `fecha`, `monto`, `nota`, `cobrado` (boolean default false).

---

## 4. Steel Costos

### `presupuestos_sm` — entidad central
| Columna | Tipo | Nota |
|---|---|---|
| `nro` | text | Numeración interna de Steel Costos — **no** es lo mismo que `nro` de `presupuestos_crm`. |
| `codigo_calculo` | text | Antes `not null` — relajado (`fix_steel_measurement_schema`, 24/8) porque hay presupuestos reales más viejos que la funcionalidad y nunca tuvieron uno. Único por `(tenant_id, codigo_calculo)`. Es el identificador que viaja a Steel CRM (`ids_calc`). |
| `nombre`, `contacto`, `obra`, `detalle`, `empresa` | text | |
| `cliente_id` | uuid → `clientes` on delete set null | |
| `obra_id` | uuid → `obras` on delete set null | Agregada 2026-08-29. `obra` (texto) sigue existiendo aparte — `obra_id` es la resolución real contra la tabla `obras` compartida con Steel CRM, sin auto-creación silenciosa (a diferencia de `cliente_id`): la única forma de crear una obra nueva es `ObraRapidaModal`. |
| `empresa_id` | uuid → `empresas` on delete set null | Agregada 2026-08-29, mismo criterio que `obra_id`. La columna `empresa` (texto, razón social) ya existía en la base pero nunca se sincronizaba — el campo local se llama `cliente`, no `empresa`, y quedaba descartado explícitamente antes del insert (bug real, cerrado el mismo día junto con `empresa_id`). |
| `tipo_trabajo`, `categoria` | text | Misma lista canónica de 32 que `tipo` en Steel CRM — sin traducción. Viaja Cómputo → Anidado → Presupuesto (traspaso automático, nunca pisa lo ya cargado a mano). |
| `estado` | text not null default `'borrador'`, check in (`borrador`,`enviado`,`aprobado`,`rechazado`) | **Vocabulario propio, distinto al de Steel CRM** — nunca mapear 1:1. |
| `clonado_de_id` | uuid → `presupuestos_sm` (self) on delete set null | |
| `negociacion_pct`, `negociacion_usd`, `neg_modo` | numeric/text | |
| `interes_pct`, `interes_dias` | numeric/int | Interés financiero por plazo de pago. |
| `tc` | numeric | Tipo de cambio histórico de ese presupuesto puntual — agregado tarde (`fix_steel_measurement_schema`, era un campo real de la UI que nunca se había persistido). |
| `vendedor` | uuid → `profiles` on delete set null | |
| `notas`, `fecha` | text/date | |
| `costo_real_usd` | numeric | 2026-09-03 — Steel Costos lo calcula (desglose real por rubro, sin markup) y lo guarda; Steel CRM solo lee vía `presupuesto_calculo_link` para el colchón de negociación. |
| `estado_crm` | text, nullable | 2026-09-04 — espejo inverso de `estado_sm` (Steel CRM local): solo referencia, escrito desde Steel CRM cuando cambia el `estado_nativo` de un presupuesto ya vinculado. Nunca pisa `estado` (arriba), que sigue siendo el real de Steel Costos. |
| `link_archivos` | text | 2026-09-06 — mismo criterio que `presupuestos_crm.link_archivos`: viaja por la cadena Solicitud → Cómputo → Anidado → Presupuesto, o se carga directo si no hay origen. |
| `eliminado`, `eliminado_por`, `eliminado_fecha` | ✅ soft-delete | |

**Candado de dueño (RLS, 2026-09-03)** — mismo criterio que `presupuestos_crm`, ver `ENTIDADES-COMPARTIDAS.md` §8.

### `items_presupuesto_sm`
`presupuesto_id → presupuestos_sm` cascade. `titulo`, `cantidad` (default 1), `n_plano`, `no_agrega_kg` (boolean). `computo_id → computos` on delete set null (opcional). `anidado_id → anidados` on delete set null (opcional, agregada después — un ítem puede traer material de un cómputo o de un anidado). `tipo` check in (`fabricacion`,`montaje`,`fab_mont`). `orden` int.

### Los 9 rubros de costo por ítem (todas `item_id → items_presupuesto_sm` cascade)

| Tabla | Columnas propias | Nota |
|---|---|---|
| `item_hierros` | `nombre`, `proveedor`, `fecha_precio`, `obs`, `cantidad`, `kg_pieza`, `area_pieza_m2`, `usd_kg`, `arena`/`pintura`/`galvanizado` (bool), `corte_maquina` (bool), `maquina` (text), `plegado`/`cilindrado` (bool) — estas últimas 4 agregadas 2026-09-02, mismo criterio que arena/pintura/galvanizado, `pct_arena`/`pct_pintura`/`pct_galvanizado` (numeric, 2026-09-07 — % parcial de cada tratamiento, la ficha lo tenía en el modelo local desde antes pero nunca aplanado a columnas reales; guardar fallaba con "column ficha not found"), `subtotal_kg`/`subtotal_m2`/`subtotal_usd`, `pct_desperdicio`, `orden` | Material principal (perfiles/planchas del ítem). |
| `item_mat_generales` | `nombre`, `proveedor`, `fecha_precio`, `cantidad`, `kg_unit`, `m2_unit`, `usd_unit`, `obs`, `subtotal_usd`, `orden` | Bulones, insumos, etc. |
| `item_mo_fabricacion` / `item_mo_montajes` | `categoria`, `tipo_hora`, `pct_adicional`, `tarea`, `detalle`, `cant_horas`, `usd_hora`, `subtotal_usd`, `orden` | Mano de obra propia. |
| `item_terc_fabricacion` / `item_terc_montajes` | `nombre`, `empresa`, `fecha_precio`, `cantidad`, `unidad`, `usd_unit`, `subtotal_usd`, `detalle`, `orden` | Tercerizado. |
| `item_traslados` | `nombre`, `proveedor`, `fecha_precio`, `cantidad`, `unidad`, `usd_unit`, `detalle`, `subtotal_usd`, `orden` | |
| `item_corte_pantografo` | `nombre`, `tipo` (check `2D`/`3D`), `usd_kg`, `kg`, `subtotal_usd`, `detalle`, `orden` | |
| `item_maquinado` | `nombre`, `cantidad`, `kg_unit`, `usd_unit`, `obs`, `subtotal_usd`, `orden` | 2026-09-02, nuevo. Plegado/Cilindrado/Corte de máquina — mismo shape que `item_mat_generales`. Se auto-completa al importar materiales de Anidado si la pieza tenía alguna de las 3 operaciones marcada. |
| `item_trat_superficie` | `item_id` **unique** (1:1 con el ítem, no una lista) — `arenado_m2`, `arenado_usd_m2`, `galvanizado` (bool), `galvanizado_kg`, `galvanizado_usd_kg`, `pintura_m2` | Cabecera de tratamiento; pinturas y otros cuelgan de acá, no del ítem. |
| `item_trat_pinturas` | `trat_id → item_trat_superficie` cascade — `nombre`, `usd_lt`, `cant_lt`, `cant_manos`, `subtotal_usd` | |
| `item_trat_otros` | `trat_id → item_trat_superficie` cascade — `nombre`, `usd_kg` | |

### `computos`
`nombre`, `fecha`, `cliente_id → clientes`, `cantidad_total`, `nro`, `categoria`, `tipo_trabajo` (agregadas 24/8, ver arriba), `vendedor → profiles`. ✅ soft-delete (agregado 24/8, mismo commit que `categoria`/`tipo_trabajo`/`vendedor` — un hueco real donde estos 3 campos se guardaban solo local y nunca sincronizaban, cerrado en la misma migración). `obra` (text) y `obra_id → obras` on delete set null, agregadas 2026-08-29 — antes Cómputo no tenía ningún campo de obra propio, distinto de su `nombre`. `empresa` (text) y `empresa_id → empresas` on delete set null, mismo commit — tampoco tenía columna de empresa (el valor solo viajaba embebido en el cliente vía `resolverClienteId`). `solicitud_id → solicitudes` on delete set null (2026-09-05) — primer FK real cruzando de Steel Costos hacia una tabla propiedad de Steel CRM; antes "Crear cómputo" desde una solicitud asignada no dejaba rastro persistente. `link_archivos` (text, 2026-09-06).

**Candado de dueño (RLS, 2026-09-03)** — mismo criterio que `presupuestos_crm`, ver `ENTIDADES-COMPARTIDAS.md` §8.

### `computo_items`
`computo_id → computos` cascade. `titulo`, `cantidad`, `n_plano`, `orden`.

### `computo_piezas`
`computo_item_id → computo_items` cascade. `tipo` check (`perfil`,`plancha`). `material_id` (text, referencia lógica al catálogo de biblioteca — sin FK real porque biblioteca usa 4 tablas distintas según tipo). `material_nombre`, `kg_m`, `sup_m2m`, `largo_mm`, `ancho_mm`, `kg_m2`, `cantidad`. `granallado`/`pintura`/`galvanizado` (bool) + sus `pct_*`. `corte_maquina` (bool), `maquina`. `precio_raw`, `precio_por` (check `kg`/`m`/`m2`), `moneda`, `proveedor`, `fecha_precio`, `obs`.

### `anidados`
`nombre`, `fecha`, `cliente_id → clientes`, `obra`, `empresa`, `categoria`, `tipo_trabajo`, `vendedor → profiles`. ✅ soft-delete (mismo momento y motivo que `computos`). `obra_id → obras` on delete set null, agregada 2026-08-29 — convive con `obra` (texto), mismo criterio que `presupuestos_sm`. `empresa_id → empresas` on delete set null, mismo commit — `empresa` (texto) ya existía en la tabla pero nunca se sincronizaba (bug real, cerrado el mismo día: faltaba en el allowlist de columnas de `storage.js`). `link_archivos` (text, 2026-09-06).

**Candado de dueño (RLS, 2026-09-03)** — mismo criterio que `presupuestos_crm`, ver `ENTIDADES-COMPARTIDAS.md` §8.

### `anidado_grupos`
`anidado_id → anidados` cascade. `tipo` check (`perfil`,`plancha`). `material_id`, `material_nombre`, `kg_m`, `sup_m2m`, `kg_m2` (agregada aparte — los grupos tipo plancha la necesitan, los de perfil usan `kg_m`/`sup_m2m`). `largo_barra_mm`, `kerf_mm`, `sheet_w`, `sheet_h`. `granallado`/`pintura`/`galvanizado` (bool). **`resultado jsonb`** — salida calculada del algoritmo de optimización de corte, no una línea de costo estructurada. `procesos` (jsonb, 2026-09-06 — desglose de kg por proceso: granallado/pintura/galvanizado/plegado/cilindrado/corte por máquina; mismo criterio jsonb que `resultado` — es un objeto calculado, no columnas de costo sueltas. Bug real cerrado por esta migración: el campo se agregó al modelo local el 2026-09-02 sin agregarlo también a la tabla, así que TODO guardado de un anidado fallaba en silencio desde esa fecha hasta el 05/9). `orden`.

### `anidado_piezas`
`grupo_id → anidado_grupos` cascade. `largo_mm`, `ancho_mm`, `cantidad`, `etiqueta`.

### `historial_trabajos` — benchmark ("Comparativa") para Predictor Eq
`nro_ot`, `fecha`, `cliente_id → clientes`, `obra`, `empresa`, `categoria`, `tipo_trabajo`, `kg_total`, `metros_total`, `usd_total`, `vendedor → profiles` (agregada 25/8, después que `computos`/`anidados`/`presupuestos_sm` ya la tenían — a pedido de Gino, para poder filtrar por vendedor acá también). ✅ soft-delete. `empresa_id → empresas` on delete set null (2026-09-05). `horas_fab_est`, `horas_fab_real`, `horas_mon_est`, `horas_mon_real` (numeric not null default 0, 2026-09-05) — la pantalla ya calculaba kg/hora real y desvío % en vivo, pero estas 4 columnas nunca existieron en la base: el dato se perdía al sincronizar con otro dispositivo, quedaba solo en localStorage. Más 10 columnas `pct_*` (porcentaje de cada rubro sobre el total): `pct_hier`, `pct_mat`, `pct_mo_fab`, `pct_mo_mon`, `pct_hesp`, `pct_t_fab`, `pct_t_mon`, `pct_trat`, `pct_trasl`, `pct_panto`. **Afuera a propósito del candado de dueño** — Gino solo lo pidió para Cómputo/Anidado/Presupuesto.

### Biblioteca de materiales — 4 tablas, `id` **text** (no uuid, ver §0)
| Tabla | Columnas propias |
|---|---|
| `biblioteca_perfiles` | `nombre`, `cat`, `kg_m`, `largo`, `sup`, `precio_usd_kg` |
| `biblioteca_planchuelas` | `nombre`, `cat`, `ancho_mm`, `espesor_mm`, `kg_m`, `largo`, `sup`, `precio_usd_kg` |
| `biblioteca_planchas` | `nombre`, `espesor`, `kg_m2`, `largo_mm`, `ancho_mm`, `area_m2`, `kg_ud`, `precio_usd_kg` |
| `biblioteca_rejillas` | `nombre`, `kg_m2`, `largo_mm`, `ancho_mm`, `area_m2`, `kg_ud`, `precio_usd_kg`, `notas` |

### `material_historial_precios`
`material_tipo` check in (`perfil`,`planchuela`,`plancha`,`rejilla`,`mo_fab`,`mo_mon`,`mat_generales`,`terceros`,`traslados`,`pinturas`,`maquinado`,`trat_superficie_extra`,`pantografo_extra`,`arenado`,`galvanizado`,`panto_2d`,`panto_3d`) — ampliado 2026-09-02 (antes solo los 4 tipos de Biblioteca) —, `material_id` (**text**, sin FK real — apunta a una fila real según `material_tipo`, o al `tenant_id` para los 4 valores "pineados" de tarifario que no tienen id propio), `fecha`, `proveedor`, `precio`, `cambiado_por` (2026-09-02, texto libre con el nombre del usuario).

### Tarifario — 8 tablas de lista + 1 de config única
`tarifario_mo_fab`, `tarifario_mo_mon`, `tarifario_mat_generales`, `tarifario_terceros`, `tarifario_traslados`, `tarifario_pinturas`, `tarifario_maquinado` (2026-09-02, catálogo nuevo — Plegado/Cilindrado + las 8 máquinas de "Corte de máquina"): `nombre` + `usd`/`usd_hora` + `unidad`, `proveedor`, `fecha_precio` (date), `obs` (agregadas 2026-09-02 a los primeros 6 — el editor real, `CatalogoEditable`, siempre las mandó desde que existe; sin ellas, cada guardado de estos catálogos fallaba en silencio con "column ... not found in schema cache" y la lectura de Fase 5, que prefiere la nube, terminaba pisando el catálogo local correcto con la versión vacía de la nube). `tarifario_pinturas` además: `ficha_tecnica_link`, `rendimiento` (numeric, m²/L), `volumen_solidos` (numeric, %) — 2026-09-02. `tarifario_interes_financiero`: `nombre`, `moneda`, `dias`, `pct`. `tarifario_config` (PK = `tenant_id`, una sola fila): `arenado_usd_m2`, `galvanizado_usd_kg`, `panto_usd_kg_2d`, `panto_usd_kg_3d`, más `{arenado,galvanizado,panto_2d,panto_3d}_{proveedor,fecha_precio,obs}` (2026-09-02, ficha consistente con el resto de los catálogos).

### `comentarios_computo` / `comentarios_anidado` / `comentarios_presupuesto_sm`
Misma forma que los comentarios de Steel CRM (`computo_id`/`anidado_id`/`presupuesto_id` → tabla padre cascade, `autor`, `texto`, `fecha`, `hora`). Sin columnas de soft-delete propias en la migración original de Steel Costos — a diferencia de las de Steel CRM, que sí las ganaron después (`soft_delete_comentarios`, ver §0). Confirmar contra el código si esto cambió antes de asumir.

---

## 5. `presupuesto_calculo_link` — el vínculo real, activo desde 2026-08-29

`presupuesto_crm_id → presupuestos_crm` cascade, `presupuesto_sm_id → presupuestos_sm` cascade, `unique(presupuesto_crm_id, presupuesto_sm_id)`. Sin columnas de negocio — es una tabla de vínculo pura. Se escribe desde "☁️ Enviar a Steel CRM" en Steel Costos, se lee desde `BudgetModal` en Steel CRM. Detalle: `ENTIDADES-COMPARTIDAS.md` §6.

---

## 6. Mantenimiento de este documento

Misma Regla 9 que los otros dos documentos compartidos: toda sesión que
agregue, borre, modifique o relaje una columna/constraint en
`steel-backend/supabase/migrations/` actualiza la tabla correspondiente
acá, en el mismo commit.
