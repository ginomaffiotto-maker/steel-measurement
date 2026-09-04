# Backend compartido Steel CRM + Steel Costos — diseño de esquema

**Estado: Fase 0 (diseño) — sin implementar todavía.** Este documento es la fuente
de verdad del esquema Postgres/Supabase compartido entre Steel CRM y Steel
Measurement. Antes de tocar clasificación de datos o agregar una tabla nueva,
leer esto primero — mismo criterio que `TAXONOMIA-COMPARTIDA.md` para la
taxonomía.

Predictor Eq queda fuera de este backend por ahora (sigue siendo herramienta
standalone de un archivo HTML) — ver [[erp_modular_roadmap]] en la memoria del
proyecto de coordinación para la arquitectura de integración en 3 etapas.

---

## 0. Decisiones de arranque (confirmadas con Gino, 2026-08-22)

| Decisión | Elegido |
|---|---|
| Motivo | Preparar la base para vender como SaaS (no hay demanda multi-tenant real todavía) |
| Alcance | Backend **compartido** entre Steel CRM y Steel Costos (un solo proyecto, `tenant_id` desde el día uno) |
| Stack | **Supabase** (Postgres gestionado + Auth + API) |
| Migración de datos existentes | **Dual-write**: la app sigue escribiendo a localStorage y también al backend en paralelo durante un tiempo, antes de cortar la lectura |
| Clientes | **Unificados** en una sola tabla — Steel Costos pasa de autocompletar texto libre a elegir un cliente real del CRM (cambio de UX real en ese sistema) |
| Autenticación | **Supabase Auth con email real** por usuario (reemplaza selección de usuario + password en texto plano) |
| Relación presupuesto↔cálculo | **Tabla de relación real** (`presupuesto_calculo_link`) — reemplaza el export/import manual de JSON (Punto E) y el array `idsCalc` de códigos string |
| Items de Steel Costos (rubros, piezas, grupos) | **Tablas normalizadas**, no JSONB — con dos excepciones puntuales (ver §4) |

---

## 1. Plataforma

```
tenants(id, nombre, plan, created_at)

profiles(id → auth.users.id, tenant_id → tenants, nombre, rol[admin|supervisor|vendedor],
  emoji, foto, created_at, updated_at)

tenant_settings(tenant_id → tenants, key, value jsonb, updated_at, PK(tenant_id, key))
```

`tenant_settings` reemplaza 1:1 las claves sueltas que hoy viven en `localStorage`
por config (numeración de presupuestos, bloques del PDF, nombre de empresa, tema,
tipo de cambio global, etc.) — mismo patrón `loadLS`/`saveLS` de hoy, solo que
centralizado. No hace falta una tabla dedicada por tipo de config.

**Auth — reemplaza el login actual** (selección de usuario + password en texto
plano, comparado literal, sesión no persistida). Cada usuario real necesita un
email para loguearse vía Supabase Auth. `profiles` extiende `auth.users` con lo
que hoy vive en el objeto usuario de `scrm_usuarios`/`smeas_usuarios` (`nombre`,
`rol`, `emoji`, `foto`) — **sin** guardar ninguna contraseña en la tabla, eso lo
maneja Supabase Auth.

---

## 2. Clientes (unificado entre los dos sistemas)

```
clientes(id, tenant_id → tenants, nombre, empresa, cargo, celular, tel, tel_linea,
  email, linkedin, zona, cumpleanos, notas, created_at, updated_at)
```

Reemplaza tanto las fichas completas de Steel CRM como la lista simple de nombres
de Steel Costos (`smeas_clientes`). La convención `matchClienteBudget`
(clienteId exacto → nombre parcial → nunca por empresa sola) deja de hacer falta
como heurística — con FK real, el match es directo por `cliente_id`.

---

## 3. Steel CRM

```
presupuestos_crm(id, tenant_id → tenants, nro, cliente_id → clientes, cliente_nombre,
  empresa, fecha, tipo, categoria, producto, descripcion, obra, kg_cotizados,
  precio_usd_kg, monto_usd, monto_final, moneda, estado_nativo, probabilidad,
  cierre, notas, vendedor_id → profiles, motivo_perdida,
  recotizacion_de_id → presupuestos_crm, estado_obra, plazo_pago,
  porcentaje_negociacion, acabado_superficial, created_at, updated_at)

comentarios_presupuesto(id, presupuesto_id → presupuestos_crm, autor, texto,
  fecha, hora, created_at)

descuentos_pendientes(id, presupuesto_id → presupuestos_crm, monto_original,
  monto_solicitado, motivo, solicitado_por → profiles, fecha, estado,
  resuelto_por → profiles, resuelto_fecha)

seguimientos(id, tenant_id → tenants, cliente_id → clientes,
  presupuesto_id → presupuestos_crm, fecha, hora, tipo, nota, completado,
  zoom_link, solicitud_id → solicitudes, created_at, updated_at)

historial_interacciones(id, tenant_id → tenants, cliente_id → clientes, fecha,
  tipo, resumen, presupuesto_id → presupuestos_crm, texto_completo, created_at)

competencia(id, tenant_id → tenants, empresa, presupuesto_id → presupuestos_crm,
  precio_usd, kg_cotizados, motivo, motivo_detalle, notas, fecha, created_at)

obras(id, tenant_id → tenants, nombre, direccion, empresa, fecha_inicio,
  fecha_fin, estado, notas, created_at, updated_at)
obra_presupuestos(obra_id → obras, presupuesto_id → presupuestos_crm)

solicitudes(id, tenant_id → tenants, cliente_id → clientes, cliente_nombre, obra,
  direccion_obra, contacto, tel, email, fecha_recepcion, fecha_limite,
  fecha_envio, fecha_resolucion, tipos_trabajo text[], link_archivos, notas,
  horas_estimadas, horas_reales, fecha_inicio_elab, cronometro_activo,
  nro_gestsoft, estado, asignado_a → profiles, presupuesto_id → presupuestos_crm,
  created_at, updated_at)
solicitud_versiones(id, solicitud_id → solicitudes, v, fecha, autor, descripcion,
  nro_gestsoft)

metas(id, tenant_id → tenants, nombre,
  tipo[monto|presupuestos|aprobacion|seguimientos|clientes_nuevos|kg_vendidos],
  valor, periodo[mes|trimestre|semestre|anio], icono, color, asignado_a_todos bool,
  activa, umbral_alerta, notas_supervisor, mostrar_en_inicio, created_at, updated_at)
meta_usuarios(meta_id → metas, profile_id → profiles)

fichas_aceptados(id, tenant_id → tenants, presupuesto_id → presupuestos_crm UNIQUE,
  numero_ot, forma_pago, contactos_admin, notas_admin, kg_fabricados,
  kg_montados, horas_fabricacion, horas_montaje, detalles_trabajo,
  cambios_cliente, link_planos, link_contrato, link_otros, notas_docs, fecha_fin,
  created_at, updated_at)
ficha_ordenes_compra(id, ficha_id → fichas_aceptados, numero, fecha, monto)
ficha_facturas(id, ficha_id → fichas_aceptados, numero, fecha, monto)
ficha_fechas_pago(id, ficha_id → fichas_aceptados, fecha, monto, nota, cobrado)
```

Notas:
- `estado_sm` deja de ser un campo copiado a mano en `presupuestos_crm` — se
  muestra por join contra `presupuesto_calculo_link` → `presupuestos_sm.estado`.
- El score de prioridad 0-100 de Solicitudes **no se persiste** hoy (se calcula
  al vuelo con `calcPrioridad()`) — se mantiene igual, no es una columna.
- `asignado_a_todos` + `meta_usuarios` reemplaza el campo `asignadoA` que hoy es
  `"todos"` (string) o un array de ids — se separa en dos formas explícitas.
- `obra_presupuestos` reemplaza el array `presupuestosIds` de Obras.

---

## 4. Steel Costos

```
presupuestos_sm(id, tenant_id → tenants, nro, codigo_calculo UNIQUE, nombre,
  cliente_id → clientes, contacto, obra, detalle, tipo_trabajo, categoria,
  estado[borrador|enviado|aprobado|rechazado], clonado_de_id → presupuestos_sm,
  negociacion_pct, negociacion_usd, neg_modo, interes_pct, interes_dias, notas,
  fecha, created_at, updated_at)

items_presupuesto_sm(id, presupuesto_id → presupuestos_sm, titulo, cantidad,
  n_plano, no_agrega_kg, computo_id → computos, tipo[fabricacion|montaje|fab_mont],
  orden, created_at, updated_at)

item_hierros(id, item_id → items_presupuesto_sm, nombre, proveedor, fecha_precio,
  obs, cantidad, kg_pieza, area_pieza_m2, usd_kg, arena, pintura, galvanizado,
  subtotal_kg, subtotal_m2, subtotal_usd, pct_desperdicio, orden)
item_mat_generales(id, item_id → items_presupuesto_sm, nombre, proveedor,
  fecha_precio, cantidad, kg_unit, m2_unit, usd_unit, obs, subtotal_usd, orden)
item_mo_fabricacion(id, item_id → items_presupuesto_sm, categoria, tipo_hora,
  pct_adicional, tarea, detalle, cant_horas, usd_hora, subtotal_usd, orden)
item_mo_montajes(  misma forma que item_mo_fabricacion  )
item_terc_fabricacion(id, item_id → items_presupuesto_sm, nombre, empresa,
  fecha_precio, cantidad, unidad, usd_unit, subtotal_usd, detalle, orden)
item_terc_montajes(  misma forma que item_terc_fabricacion  )
item_traslados(id, item_id → items_presupuesto_sm, nombre, proveedor,
  fecha_precio, cantidad, unidad, usd_unit, detalle, subtotal_usd, orden)
item_corte_pantografo(id, item_id → items_presupuesto_sm, nombre, tipo[2D|3D|null],
  usd_kg, kg, subtotal_usd, detalle, orden)
item_trat_superficie(id, item_id → items_presupuesto_sm UNIQUE, arenado_m2,
  arenado_usd_m2, galvanizado bool, galvanizado_kg, galvanizado_usd_kg, pintura_m2)
item_trat_pinturas(id, trat_id → item_trat_superficie, nombre, usd_lt, cant_lt,
  cant_manos, subtotal_usd)
item_trat_otros(id, trat_id → item_trat_superficie, nombre, usd_kg)

computos(id, tenant_id → tenants, nombre, fecha, cliente_id → clientes,
  cantidad_total, nro, created_at, updated_at)
computo_items(id, computo_id → computos, titulo, cantidad, n_plano, orden)
computo_piezas(id, computo_item_id → computo_items, tipo[perfil|plancha],
  material_id, material_nombre, kg_m, sup_m2m, largo_mm, ancho_mm, kg_m2,
  cantidad, granallado, pct_granallado, pintura, pct_pintura, galvanizado,
  pct_galvanizado, corte_maquina, maquina, precio_raw, precio_por[kg|m|m2],
  moneda, proveedor, fecha_precio, obs)

anidados(id, tenant_id → tenants, nombre, fecha, cliente_id → clientes, obra,
  created_at, updated_at)
anidado_grupos(id, anidado_id → anidados, tipo[perfil|plancha], material_id,
  material_nombre, kg_m, sup_m2m, largo_barra_mm, kerf_mm, sheet_w, sheet_h,
  granallado, pintura, galvanizado, resultado jsonb, orden)
anidado_piezas(id, grupo_id → anidado_grupos, largo_mm, ancho_mm, cantidad, etiqueta)

historial_trabajos(id, tenant_id → tenants, nro_ot, fecha, cliente_id → clientes,
  obra, categoria, tipo_trabajo, kg_total, metros_total, usd_total, pct_hier,
  pct_mat, pct_mo_fab, pct_mo_mon, pct_hesp, pct_t_fab, pct_t_mon, pct_trat,
  pct_trasl, pct_panto)

biblioteca_perfiles(id, tenant_id → tenants, nombre, cat, kg_m, largo, sup,
  precio_usd_kg, created_at, updated_at)
biblioteca_planchuelas(id, tenant_id → tenants, nombre, cat, ancho_mm,
  espesor_mm, kg_m, largo, sup, precio_usd_kg, created_at, updated_at)
biblioteca_planchas(id, tenant_id → tenants, nombre, espesor, kg_m2, largo_mm,
  ancho_mm, area_m2, kg_ud, precio_usd_kg, created_at, updated_at)
biblioteca_rejillas(id, tenant_id → tenants, nombre, kg_m2, largo_mm, ancho_mm,
  area_m2, kg_ud, precio_usd_kg, notas, created_at, updated_at)
material_historial_precios(id, material_tipo[perfil|planchuela|plancha|rejilla],
  material_id, fecha, proveedor, precio)

tarifario_mo_fab(id, tenant_id → tenants, nombre, usd_hora)
tarifario_mo_mon(id, tenant_id → tenants, nombre, usd_hora)
tarifario_mat_generales(id, tenant_id → tenants, nombre, usd)
tarifario_terceros(id, tenant_id → tenants, nombre, usd)
tarifario_traslados(id, tenant_id → tenants, nombre, usd)
tarifario_pinturas(id, tenant_id → tenants, nombre, usd)
tarifario_interes_financiero(id, tenant_id → tenants, nombre, moneda, dias, pct)
tarifario_config(tenant_id → tenants UNIQUE, arenado_usd_m2, galvanizado_usd_kg,
  panto_usd_kg_2d, panto_usd_kg_3d)
```

**Excepciones a "todo normalizado" (a criterio, confirmadas con Gino 2026-08-22):**
- `anidado_grupos.resultado` queda como **JSONB** — es un resultado calculado de
  la optimización de corte (barras/hojas + resumen), no una línea de costo; no
  hay necesidad real de consultarlo con SQL fila por fila.
- `material_historial_precios` es **una sola tabla** para los 4 tipos de
  material (con `material_tipo` como discriminador) en vez de 4 tablas
  duplicadas — el subobjeto es idéntico en los 4.

**No se crean todavía** (sin uso real hoy, se agregan el día que haga falta):
- `horas_especiales` — sin UI para agregar filas, siempre vacío en los 300+
  presupuestos del seed histórico.
- `terc_fabricacion`/`terc_montajes` del tarifario legado — reemplazados por
  `tarifario_terceros` (catálogo unificado en uso real).
- `trat_superficie_extra`/`pantografo_extra` — vacíos por defecto, extensibles
  desde Config pero sin contenido real todavía.

---

## 5. Vínculo entre sistemas (reemplaza el Punto E)

```
presupuesto_calculo_link(id, tenant_id → tenants,
  presupuesto_crm_id → presupuestos_crm, presupuesto_sm_id → presupuestos_sm,
  created_at)
```

Relación muchos a muchos real (un cálculo puede derivar en varios presupuestos;
un presupuesto puede necesitar varios cálculos — mismo acuerdo de
`TAXONOMIA-COMPARTIDA.md` §7). Con esto, el export/import manual de JSON
entre Steel Costos y Steel CRM (botón "⬇️ Steel CRM", `Importar.jsx` →
"Cargar desde Steel Costos") deja de hacer falta una vez que los dos
sistemas escriben contra el mismo backend — queda pendiente decidir en Fase 2/3
si se retira el importador manual o se deja como vía alternativa (ej. para
cuando Steel Costos se usa offline).

---

## 6. Pendiente antes de generar migraciones SQL reales (Fase 1)

- Políticas RLS por `tenant_id` en cada tabla (no diseñadas todavía — son
  mecánicas una vez que el esquema está fijo, pero hay que escribirlas).
- Reglas de `ON DELETE` (¿cascade? ¿restrict?) por cada FK — no decidido acá,
  se resuelve al escribir las migraciones.
- Índices (mínimo: `tenant_id` en toda tabla raíz, `nro`/`codigo_calculo`
  únicos por tenant, FKs).
- Confirmar con Gino si los usuarios reales del equipo ya tienen emails
  utilizables para Supabase Auth, o hay que asignar/crear algunos.

## 7. Arquitectura de migración (Fases, ver [[erp_modular_roadmap]])

0. **Diseño del esquema** ← este documento, completo.
1. Infraestructura: crear proyecto Supabase, Auth, aplicar migraciones, RLS.
2. Capa de acceso a datos: `loadDB`/`saveDB` en cada repo, detrás de la misma
   abstracción `storage.js` que ya existe.
3. Dual-write piloto en Steel CRM (localStorage sigue siendo fuente de verdad,
   cada guardado también escribe a Supabase) — verificar paridad.
4. Migración de datos históricos (619 presupuestos Steel CRM + históricos de
   Steel Costos) a un solo tenant real.
5. Corte de lectura a Supabase, una vez verificada la paridad.
