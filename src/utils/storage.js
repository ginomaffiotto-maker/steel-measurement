import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

// "" en una columna numeric/uuid/date rompe el insert — Postgres no la
// coerciona a null solo (encontrado en Fase 4 con datos reales,
// 2026-08-24: cantidad_total, anidado_id, computo_id de registros viejos
// donde el campo quedó vacío en vez de sin tocar). Un campo de texto
// tolera "" sin problema, así que convertir siempre "" → null acá es
// seguro — nunca se está mandando algo con significado distinto a "vacío".
const saneado = (obj) => {
  const limpio = {};
  for (const k in obj) limpio[k] = obj[k] === "" ? null : obj[k];
  return limpio;
};

// `{ ...obj, id: undefined }` no alcanza para que Postgres use su propio
// default de id — hay que omitir la clave del todo, no dejarla en undefined.
// Encontrado en Fase 4 al migrar datos reales (tarifario_mo_fab rechazaba
// con "null value in column id"). Usar esto en vez de ese patrón siempre
// que se inserte una fila nueva dejando que la base genere el id.
const sinId = (obj) => { const { id, ...resto } = obj; return saneado(resto); };

// UUID válido, no cualquier string en el campo id — encontrado en Fase 4
// con datos reales (2026-08-24): registros viejos (de antes de que uid()
// usara crypto.randomUUID(), o de seeds de prueba tipo "seed_anid_001")
// tienen ids como "mry49eatlzth", que Postgres rechaza en una columna
// uuid. computos/anidados/presupuestos_sm usan id como identidad real
// (upsert por id) así que hace falta un uuid válido — a diferencia de la
// biblioteca de materiales, que usa códigos de catálogo a propósito (ver
// saveDBMaterial) y por eso esa columna es texto, no uuid.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const conIdValido = (r) => (r.id && UUID_RE.test(String(r.id)) ? r : { ...r, id: uid() });
// Exportado para el fallback de purga (2026-08-25): si el id local no es un
// uuid real, no se puede confiar en que sea el mismo id de la fila remota
// (conIdValido lo reemplazó por uno nuevo al sincronizar por primera vez).
export const esUUID = (id) => !!id && UUID_RE.test(String(id));

// Listas blancas en vez de negras (mismo criterio que
// COLUMNAS_HISTORIAL_TRABAJO más abajo): el objeto local fue creciendo
// campos sueltos con el tiempo (categoria_id viejo sin uso, cantidad en
// vez de cantidad_total, etc. — encontrados recién al migrar datos reales
// en Fase 4) que no tienen columna en la tabla. Elegir explícitamente
// evita que un campo nuevo local rompa el insert.
const COLUMNAS_PRESUPUESTO_SM = [
  "id", "nro", "codigo_calculo", "nombre", "cliente_id", "contacto", "obra", "obra_id", "empresa", "empresa_id", "detalle",
  "tipo_trabajo", "categoria", "estado", "clonado_de_id", "negociacion_pct", "negociacion_usd",
  "neg_modo", "interes_pct", "interes_dias", "notas", "fecha", "tc", "vendedor",
  "eliminado", "eliminado_por", "eliminado_fecha",
];
const COLUMNAS_COMPUTO = ["id", "nombre", "fecha", "cliente_id", "cantidad_total", "nro", "obra", "obra_id", "empresa", "empresa_id",
  "categoria", "tipo_trabajo", "vendedor", "eliminado", "eliminado_por", "eliminado_fecha"];
const COLUMNAS_ANIDADO = ["id", "nombre", "fecha", "cliente_id", "obra", "obra_id", "empresa", "empresa_id",
  "categoria", "tipo_trabajo", "vendedor", "eliminado", "eliminado_por", "eliminado_fecha"];
const COLUMNAS_ITEM_PRESUPUESTO = [
  "id", "presupuesto_id", "titulo", "cantidad", "n_plano", "no_agrega_kg", "computo_id", "anidado_id", "tipo", "orden",
];
// Referencias a otro registro por id — si quedaron apuntando a un id
// viejo que ya no existe en ningún lado (ej. un anidado renombrado en una
// corrida de migración anterior, cuyo id viejo no se pudo reconstruir
// retroactivamente), es más seguro soltar la referencia que hacer
// fallar todo el presupuesto por un vínculo que de todos modos ya no
// apunta a nada real.
const CAMPOS_REF_UUID = new Set(["cliente_id", "obra_id", "empresa_id", "computo_id", "anidado_id", "clonado_de_id", "vendedor"]);
const soloColumnas = (obj, columnas) => {
  const row = {};
  for (const k of columnas) {
    if (obj[k] === undefined) continue;
    let v = obj[k] === "" ? null : obj[k];
    if (v != null && CAMPOS_REF_UUID.has(k) && !UUID_RE.test(String(v))) v = null;
    row[k] = v;
  }
  return row;
};

// Barrera de arranque para Fase 5 (2026-08-23, tras el bug de origen vacío en
// Vercel): un `useEffect(..., [])` corre al MONTAR, pero supabase-js recién
// termina de restaurar la sesión persistida (localStorage del cliente auth)
// de forma asíncrona — en un origen nuevo con `usuario` ya restaurado
// sincrónicamente de sessionStorage, una query podía salir antes de que el
// cliente tuviera el JWT adjunto, RLS la bloqueaba, y devolvía vacío en
// silencio (mismo bug de fondo que encontró la sesión de steelCRM, distinta
// causa concreta acá). `getSession()` espera esa inicialización si todavía
// está en curso — usar esto como primera línea de cualquier efecto de
// Fase 5 antes de consultar la base.
const esperarSesion = async () => {
  if (!supabase) return false;
  const { data } = await supabase.auth.getSession();
  return !!data?.session;
};

export const loadLS = (k, d) => {
  try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch { return d; }
};
export const saveLS = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
};

// Reintento de sincronización — mismo mecanismo agregado del lado de
// Steel CRM (2026-08-29): un dualWrite* puede fallar en silencio (nunca
// bloquea el guardado local), así que sin esto no hay forma de saber que
// algo quedó solo en este dispositivo. Genérico a propósito, hoy solo se
// conecta a Presupuesto.
const SYNC_PENDIENTES_KEY = "smeas_sync_pendientes";

export function obtenerSyncPendientes() {
  return loadLS(SYNC_PENDIENTES_KEY, []);
}

export function marcarSyncPendiente(tipo, id) {
  const actuales = obtenerSyncPendientes();
  if (actuales.some(p => p.tipo === tipo && p.id === id)) return;
  saveLS(SYNC_PENDIENTES_KEY, [...actuales, { tipo, id, fecha: new Date().toISOString() }]);
}

export function limpiarSyncPendiente(tipo, id) {
  saveLS(SYNC_PENDIENTES_KEY, obtenerSyncPendientes().filter(p => !(p.tipo === tipo && p.id === id)));
}

export const uid = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

// created_at/updated_at para entidades de nivel superior (presupuesto, trabajo
// histórico, cómputo, anidado, ítem de biblioteca) — preparación para sync con
// backend futuro, no se usa en sub-filas dentro de un ítem.
export const stamp = () => {
  const now = new Date().toISOString();
  return { created_at: now, updated_at: now };
};
export const touch = (obj) => ({ ...obj, updated_at: new Date().toISOString() });

// Cache de módulo + pub-sub chico (2026-08-30) — useListaClientes/
// useListaObras/useListaEmpresas cacheaban en una variable de módulo para
// no repetir el fetch, pero mutar esa variable sola nunca re-renderiza los
// componentes YA MONTADOS con el hook (React no reacciona a una variable
// externa que cambia sin pasar por setState). Bug real reportado por Gino:
// crear una empresa nueva desde el cartel la guardaba bien en Supabase,
// pero el cartel "no existe todavía" seguía ahí — el hook ya montado en
// ese mismo formulario nunca se enteró del alta. Cada hook se suscribe acá
// al montar; quien crea un registro nuevo notifica con `.set(...)` y todos
// los montados se actualizan en el momento, sin esperar a un reload.
function crearCacheSuscribible(inicial) {
  let valor = inicial;
  const listeners = new Set();
  return {
    get: () => valor,
    set: (nuevo) => { valor = nuevo; listeners.forEach((fn) => fn(valor)); },
    suscribir: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
  };
}

// ─── CLIENTES (lista centralizada, autocompletado) ────────────────
// Cómputo, Anidado y Presupuesto comparten esta lista para que "CCFC" y
// "Ccfc" no queden como 2 clientes distintos en el Buscador/filtros — se
// arma sola: cada vez que alguien tipea un cliente nuevo se agrega acá.
export const loadClientes = () => loadLS("smeas_clientes", []);
const cacheListaClientes = crearCacheSuscribible(loadClientes());
export const registrarCliente = (nombre) => {
  const n = (nombre || "").trim();
  if (!n) return;
  const lista = loadClientes();
  if (!lista.some(c => c.toLowerCase() === n.toLowerCase())) {
    const actualizada = [...lista, n];
    saveLS("smeas_clientes", actualizada);
    cacheListaClientes.set(Array.from(new Set([...cacheListaClientes.get(), n])).sort((a, b) => a.localeCompare(b, "es")));
  }
  // Fase 3 (piloto, 2026-08-22): dual-write en paralelo, nunca bloquea ni
  // puede romper el guardado local — localStorage sigue siendo la única
  // fuente de verdad real en esta fase. Si falla (sin internet, backend
  // caído), solo queda un warning en consola.
  if (supabase) {
    resolverClienteId(n).catch((e) => {
      console.warn(`[Fase 3] No se pudo sincronizar cliente "${n}" con el backend:`, e.message || e);
    });
  }
};

// ─── CLIENTES — capa de acceso al backend (Fase 2, sin cablear a la UI
// todavía). Reemplaza la lista de nombres de arriba: acá `clientes` es la
// tabla unificada compartida con steelCRM (ver BACKEND-COMPARTIDO.md en
// la raíz de este repo). Requiere sesión de Supabase Auth activa — sin eso,
// RLS devuelve vacío en loadDBClientes y rechaza el insert en saveDBCliente.
export const loadDBClientes = async () => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const { data, error } = await supabase.from("clientes").select("*").order("nombre");
  if (error) throw error;
  return data;
};
export const saveDBCliente = async (cliente) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const { data, error } = await supabase.from("clientes").upsert(cliente).select().single();
  if (error) throw error;
  return data;
};

// Fase 5 (piloto, 2026-08-23): Supabase como fuente primaria, localStorage
// como respaldo si falla (sin internet, Supabase caído/dormido en el plan
// free). Nunca deja al usuario sin la lista — arranca con lo local (síncrono,
// sin esperar red) y la mejora con lo remoto en cuanto llega. Devuelve la
// UNIÓN de ambas listas (no reemplaza) para no perder un nombre tipeado
// hace un segundo que todavía no llegó a sincronizarse.
export const loadClientesConNube = async () => {
  const local = loadClientes();
  if (!supabase) return local;
  try {
    const remotos = await loadDBClientes();
    const nombresRemotos = (remotos || []).map((c) => c.nombre).filter(Boolean);
    const set = new Set([...nombresRemotos, ...local]);
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  } catch (e) {
    console.warn("[Fase 5] No se pudo leer clientes de la nube, usando la lista local:", e.message || e);
    return local;
  }
};

// Hook compartido por AutocompleteCliente (y cualquier otro campo que
// necesite la lista) — cachea en módulo para no repetir el fetch cada vez
// que se monta un campo nuevo en la misma pantalla. Suscribible (ver
// crearCacheSuscribible) para que un alta nueva se refleje al instante en
// cualquier otro campo ya montado.
export const useListaClientes = () => {
  const [lista, setLista] = useState(() => cacheListaClientes.get());
  useEffect(() => {
    const unsub = cacheListaClientes.suscribir(setLista);
    let vivo = true;
    (async () => {
      await esperarSesion();
      if (!vivo) return;
      const l = await loadClientesConNube();
      cacheListaClientes.set(l);
    })();
    return () => { vivo = false; unsub(); };
  }, []);
  return lista;
};

// Busca un cliente por nombre (case-insensitive, match exacto) y lo crea si
// no existe — usado por el dual-write de Fase 3 para resolver el `cliente`
// de texto libre que usa hoy la UI local a un `cliente_id` real. Cachea en
// memoria durante la sesión para no repetir la búsqueda en cada tipeo.
// `empresa` (2026-08-23) es opcional: si el contacto ya existe pero sin
// empresa cargada, se la completa; nunca pisa una empresa ya cargada.
const _cacheClienteIds = new Map();
export const resolverClienteId = async (nombre, empresa) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const n = (nombre || "").trim();
  if (!n) return null;
  const emp = (empresa || "").trim() || null;
  const key = n.toLowerCase();
  if (_cacheClienteIds.has(key)) return _cacheClienteIds.get(key);

  const { data: existentes, error: eSel } = await supabase.from("clientes").select("id, nombre, empresa").ilike("nombre", n);
  if (eSel) throw eSel;
  const match = existentes?.find((c) => (c.nombre || "").trim().toLowerCase() === key);

  let id;
  if (match) {
    id = match.id;
    if (emp && !match.empresa) {
      const { error: eUpd } = await supabase.from("clientes").update({ empresa: emp }).eq("id", id);
      if (eUpd) throw eUpd;
    }
  } else {
    const { data: creado, error: eIns } = await supabase.from("clientes").insert({ nombre: n, empresa: emp }).select("id").single();
    if (eIns) throw eIns;
    id = creado.id;
  }
  _cacheClienteIds.set(key, id);
  return id;
};

// Camino inverso: dado un cliente_id (uuid), devuelve el nombre — usado para
// reconstruir un registro que viene de la nube y no existía local todavía
// (Fase 5, 2026-08-23). Cachea por id.
const _cacheNombrePorId = new Map();
export const resolverNombreCliente = async (id) => {
  if (!id || !supabase) return "";
  if (_cacheNombrePorId.has(id)) return _cacheNombrePorId.get(id);
  const { data, error } = await supabase.from("clientes").select("nombre").eq("id", id).maybeSingle();
  if (error || !data) return "";
  _cacheNombrePorId.set(id, data.nombre || "");
  return data.nombre || "";
};

// ─── EMPRESAS — capa de acceso al backend (2026-08-29) ─────────────
// Tabla `empresas`, compartida con steelCRM — hasta esta fecha "empresa"
// era texto libre derivado de `clientes.empresa`, sin ninguna tabla
// propia. Mismo criterio que obras: sin auto-creación silenciosa al
// tipear, la única forma de crear una empresa nueva es EmpresaRapidaModal
// (obligatorio) — el id se resuelve por nombre exacto contra la lista ya
// cargada acá.
export const loadDBEmpresas = async () => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const { data, error } = await supabase.from("empresas").select("*").order("nombre");
  if (error) throw error;
  return data;
};
export const saveDBEmpresa = async (empresa) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const nombre = (empresa.nombre || "").trim();
  // Evita duplicados (bug real reportado por Gino, 2026-08-30) — mismo
  // criterio que steelcrm: a diferencia de Obra (dos obras reales
  // distintas pueden compartir nombre), una Empresa es una razón social
  // real, no debería poder crearse dos veces. Solo aplica en el alta
  // (sin id todavía) — no interfiere con una actualización real.
  if (nombre && !empresa.id) {
    const { data: existentes, error: eSel } = await supabase.from("empresas").select("*").ilike("nombre", nombre);
    if (!eSel) {
      const match = existentes?.find((e) => (e.nombre || "").trim().toLowerCase() === nombre.toLowerCase());
      if (match) return match;
    }
  }
  const { data, error } = await supabase.from("empresas").upsert(empresa).select().single();
  if (error) throw error;
  return data;
};

const cacheListaEmpresas = crearCacheSuscribible([]);
export const useListaEmpresas = () => {
  const [lista, setLista] = useState(() => cacheListaEmpresas.get());
  useEffect(() => {
    const unsub = cacheListaEmpresas.suscribir(setLista);
    if (!supabase) return unsub;
    let vivo = true;
    (async () => {
      if (!(await esperarSesion()) || !vivo) return;
      loadDBEmpresas()
        .then((rows) => cacheListaEmpresas.set(rows || []))
        .catch(() => {});
    })();
    return () => { vivo = false; unsub(); };
  }, []);
  return lista;
};
// Llamado por EmpresaRapidaModal tras crear — sin esto, el cartel "no
// existe todavía" seguía mostrándose en el propio formulario que acaba de
// crearla (ver comentario de crearCacheSuscribible).
export const agregarAListaEmpresas = (nueva) => {
  // Sin el filter, si el fetch de montaje de otro campo resuelve justo
  // después de este prepend, la fila recién creada podía quedar
  // duplicada en la lista en memoria por un instante (nunca en la base
  // — bug real visto por Gino, era una carrera de timing, no datos).
  cacheListaEmpresas.set([nueva, ...cacheListaEmpresas.get().filter((e) => e.id !== nueva.id)]);
};

// ─── OBRAS — capa de acceso al backend (2026-08-29) ────────────────
// Tabla `obras`, compartida con steelCRM (ver ENTIDADES-COMPARTIDAS.md) —
// hasta ahora Steel Measurement nunca la usaba: "obra" era texto libre
// suelto en Anidado/Presupuesto y ni siquiera existía como campo en
// Cómputo. A diferencia de clientes, acá NO hay auto-creación silenciosa
// al tipear — la única forma de crear una obra nueva es ObraRapidaModal
// (obligatorio, pedido de Gino), por eso no existe un "resolverObraId" con
// creación automática: el id se resuelve buscando por nombre exacto en la
// lista ya cargada por useListaObras, algo que la UI ya garantiza que
// exista antes de dejar guardar.
export const loadDBObras = async () => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const { data, error } = await supabase.from("obras").select("*").order("nombre");
  if (error) throw error;
  return data;
};
export const saveDBObra = async (obra) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const { data, error } = await supabase.from("obras").upsert(obra).select().single();
  if (error) throw error;
  return data;
};

const cacheListaObras = crearCacheSuscribible([]);
export const useListaObras = () => {
  const [lista, setLista] = useState(() => cacheListaObras.get());
  useEffect(() => {
    const unsub = cacheListaObras.suscribir(setLista);
    if (!supabase) return unsub;
    let vivo = true;
    (async () => {
      if (!(await esperarSesion()) || !vivo) return;
      loadDBObras()
        .then((rows) => cacheListaObras.set(rows || []))
        .catch(() => {});
    })();
    return () => { vivo = false; unsub(); };
  }, []);
  return lista;
};
// Llamado por ObraRapidaModal tras crear — mismo motivo que agregarAListaEmpresas.
export const agregarAListaObras = (nueva) => {
  cacheListaObras.set([nueva, ...cacheListaObras.get().filter((o) => o.id !== nueva.id)]);
};

// ─── PRESUPUESTOS — capa de acceso al backend (Fase 2, sin cablear a la UI
// todavía). Mismo criterio que clientes arriba: no traduce campos, el caller
// arma la fila ya en forma de `presupuestos_sm` (tenant_id, cliente_id
// resuelto contra la tabla clientes, clonado_de_id, etc.).
// IMPORTANTE: no incluye `items` — esa es la tabla items_presupuesto_sm
// (9 rubros de costo, piezas, normalizada), todavía sin capa de acceso propia.
export const loadDBPresupuestosSM = async () => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const { data, error } = await supabase.from("presupuestos_sm").select("*").order("fecha", { ascending: false });
  if (error) throw error;
  return data;
};
export const saveDBPresupuestoSM = async (presupuesto) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const row = soloColumnas(conIdValido(presupuesto), COLUMNAS_PRESUPUESTO_SM);
  const { data, error } = await supabase.from("presupuestos_sm").upsert(row).select().single();
  if (error) throw error;
  return data;
};

const camposDesdeRemoto = (r, cliente, items) => ({
  nro: r.nro || "", codigo_calculo: r.codigo_calculo || "", nombre: r.nombre || "",
  cliente, contacto: r.contacto || "", obra: r.obra || "", detalle: r.detalle || "",
  tipo_trabajo: r.tipo_trabajo || "Fabricación", categoria: r.categoria || "",
  estado: r.estado || "borrador", clonado_de: r.clonado_de_id || null,
  negociacion_pct: r.negociacion_pct || 0, negociacion_usd: r.negociacion_usd || 0,
  neg_modo: r.neg_modo || "pct", interes_pct: r.interes_pct || 0, interes_dias: r.interes_dias || 30,
  items: items || [], notas: r.notas || "", fecha: r.fecha, updated_at: r.updated_at,
});

// Fase 5 (piloto, 2026-08-23): fusiona por id. Si el presupuesto no existe
// local, lo agrega (ej. creado desde otro dispositivo). Si ya existe, compara
// `updated_at` — si la nube tiene una versión más nueva, la trae y pisa el
// local (bug real detectado 2026-08-29: antes nunca actualizaba nada ya
// conocido, así que un cambio hecho en otro dispositivo no se veía nunca).
// Límite conocido y aceptado: si dos dispositivos editan lo mismo antes de
// que cualquiera sincronice, gana el que se guardó más tarde en el reloj
// del servidor — no hay resolución de conflictos real.
export const useMergePresupuestosNube = (setPresupuestos) => {
  useEffect(() => {
    if (!supabase) return;
    let vivo = true;
    (async () => {
      if (!(await esperarSesion()) || !vivo) return;
      try {
        const remotos = await loadDBPresupuestosSM();
        let faltantes = [];
        let actualizables = [];
        setPresupuestos((local) => {
          const localPorId = new Map(local.map((p) => [p.id, p]));
          faltantes = (remotos || []).filter((r) => !localPorId.has(r.id));
          actualizables = (remotos || []).filter((r) => {
            const l = localPorId.get(r.id);
            return l && r.updated_at && (!l.updated_at || new Date(r.updated_at) > new Date(l.updated_at));
          });
          return local;
        });
        for (const r of actualizables) {
          if (!vivo) return;
          try {
            const [cliente, items] = await Promise.all([resolverNombreCliente(r.cliente_id), loadDBItems(r.id)]);
            if (vivo) setPresupuestos((prev) => prev.map((p) => p.id === r.id ? { ...p, ...camposDesdeRemoto(r, cliente, items) } : p));
          } catch (e) {
            console.warn(`[Fase 5] No se pudo actualizar el presupuesto ${r.nro || r.id} desde la nube:`, e.message || e);
          }
        }
        for (const r of faltantes) {
          if (!vivo) return;
          try {
            const [cliente, items] = await Promise.all([resolverNombreCliente(r.cliente_id), loadDBItems(r.id)]);
            const nuevo = { id: r.id, created_at: r.created_at, ...camposDesdeRemoto(r, cliente, items) };
            if (vivo) setPresupuestos((prev) => (prev.some((p) => p.id === nuevo.id) ? prev : [...prev, nuevo]));
          } catch (e) {
            console.warn(`[Fase 5] No se pudo traer el presupuesto ${r.nro || r.id} de la nube:`, e.message || e);
          }
        }
      } catch (e) {
        console.warn("[Fase 5] No se pudo leer presupuestos de la nube:", e.message || e);
      }
    })();
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

// ─── ÍTEMS DE PRESUPUESTO — 9 rubros de costo (Fase 2, sin cablear a la UI).
// Cada rubro es un array de filas salvo trat_superficie (objeto con
// pinturas/otros anidados). Guardar reemplaza TODAS las filas del rubro para
// ese ítem (delete + insert) en vez de diffear — mismo patrón que el estado
// de React hoy, que reemplaza el array completo en cada guardado. No incluye
// horas_especiales: sin UI para agregar filas, siempre vacío en la práctica
// (ver BACKEND-COMPARTIDO.md).
const RUBROS_ITEM = [
  ["hierros", "item_hierros"],
  ["mat_generales", "item_mat_generales"],
  ["mo_fabricacion", "item_mo_fabricacion"],
  ["mo_montajes", "item_mo_montajes"],
  ["terc_fabricacion", "item_terc_fabricacion"],
  ["terc_montajes", "item_terc_montajes"],
  ["traslados", "item_traslados"],
  ["corte_pantografo", "item_corte_pantografo"],
];

export const loadDBItems = async (presupuestoId) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const { data: itemsRows, error: eItems } = await supabase
    .from("items_presupuesto_sm").select("*").eq("presupuesto_id", presupuestoId).order("orden");
  if (eItems) throw eItems;

  const items = [];
  for (const row of itemsRows) {
    const item = { ...row };
    for (const [campo, tabla] of RUBROS_ITEM) {
      const { data, error } = await supabase.from(tabla).select("*").eq("item_id", row.id).order("orden");
      if (error) throw error;
      item[campo] = data;
    }
    const { data: trat, error: eTrat } = await supabase
      .from("item_trat_superficie").select("*").eq("item_id", row.id).maybeSingle();
    if (eTrat) throw eTrat;
    if (trat) {
      const [{ data: pinturas, error: eP }, { data: otros, error: eO }] = await Promise.all([
        supabase.from("item_trat_pinturas").select("*").eq("trat_id", trat.id),
        supabase.from("item_trat_otros").select("*").eq("trat_id", trat.id),
      ]);
      if (eP) throw eP;
      if (eO) throw eO;
      item.trat_superficie = { ...trat, pinturas, otros };
    } else {
      item.trat_superficie = null;
    }
    items.push(item);
  }
  return items;
};

// Comentarios internos (2026-08-24) — guardado directo al comentar, no
// espera a que se guarde el registro completo (a diferencia del flujo de
// dos pasos que tenía steelCRM, que generaba confusión). `tabla`/`campoFK`
// varían por entidad: ("comentarios_computo","computo_id"),
// ("comentarios_anidado","anidado_id"), ("comentarios_presupuesto_sm","presupuesto_id").
export const saveDBComentario = async (tabla, campoFK, entityId, comentario) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  // Se conserva el id local (uid() ya genera uuid real) en vez de dejar
  // que la base genere el suyo — así local y remoto quedan con el mismo
  // id y se puede borrar/actualizar el comentario por id más adelante
  // (2026-08-24, agregado al sumar borrado de comentarios).
  const { data, error } = await supabase.from(tabla).insert({ ...comentario, [campoFK]: entityId }).select().single();
  if (error) throw error;
  return data;
};

export const deleteDBComentario = async (tabla, id) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const { error } = await supabase.from(tabla).delete().eq("id", id);
  if (error) throw error;
};

// Genérico: borra una fila cualquiera por tabla+id — mismo mecanismo que
// deleteDBComentario de arriba (no específico de comentarios pese al
// nombre original), reusado para "eliminar definitivamente" desde la
// Papelera (2026-08-25, mismo patrón que steelCRM) en vez de duplicar.
export const deleteDBFila = deleteDBComentario;

// Respaldo de deleteDBFila para el caso borde de ids legacy no-uuid (2026-08-25,
// mismo diseño coordinado con steelCRM): si el id local no es el mismo que el
// remoto (conIdValido le asignó uno nuevo al sincronizar por primera vez),
// borrar por id no encuentra la fila real y la deja huérfana en silencio.
// Acá se busca por un combo de campos "razonablemente único" en vez del id —
// solo borra si el match da EXACTAMENTE una fila; si da 0 o más de una, no
// toca nada (mejor una fila huérfana posible que arriesgarse a borrar la
// equivocada por una coincidencia de nombre).
export async function deleteFilaPorMatchDB(tabla, match) {
  if (!supabase) return;
  const filtro = Object.fromEntries(Object.entries(match).filter(([, v]) => v != null && v !== ""));
  if (!Object.keys(filtro).length) return;
  const { data, error } = await supabase.from(tabla).select("id").match(filtro);
  if (error) { console.error(`deleteFilaPorMatchDB(${tabla}) select`, error); return; }
  if (!data || data.length !== 1) {
    if (data && data.length > 1) console.warn(`deleteFilaPorMatchDB(${tabla}): match ambiguo (${data.length} filas), no se borra nada por seguridad`);
    return;
  }
  const { error: delError } = await supabase.from(tabla).delete().eq("id", data[0].id);
  if (delError) console.error(`deleteFilaPorMatchDB(${tabla}) delete`, delError);
}

export const saveDBItem = async (presupuestoId, item) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const {
    hierros, mat_generales, mo_fabricacion, mo_montajes, terc_fabricacion, terc_montajes,
    traslados, corte_pantografo, trat_superficie,
  } = item;
  const row = soloColumnas(conIdValido(item), COLUMNAS_ITEM_PRESUPUESTO);

  const { data: savedItem, error: eItem } = await supabase
    .from("items_presupuesto_sm").upsert({ ...row, presupuesto_id: presupuestoId }).select().single();
  if (eItem) throw eItem;
  const itemId = savedItem.id;

  const rubrosData = {
    hierros, mat_generales, mo_fabricacion, mo_montajes,
    terc_fabricacion, terc_montajes, traslados, corte_pantografo,
  };

  for (const [campo, tabla] of RUBROS_ITEM) {
    const { error: eDel } = await supabase.from(tabla).delete().eq("item_id", itemId);
    if (eDel) throw eDel;
    const filas = (rubrosData[campo] || []).map((f) => ({ ...sinId(f), item_id: itemId }));
    if (filas.length) {
      const { error: eIns } = await supabase.from(tabla).insert(filas);
      if (eIns) throw eIns;
    }
  }

  // trat_superficie se borra y se recrea entero — el cascade de la FK ya
  // limpia pinturas/otros del trat_id viejo, no hace falta borrarlos aparte.
  const { error: eDelTrat } = await supabase.from("item_trat_superficie").delete().eq("item_id", itemId);
  if (eDelTrat) throw eDelTrat;
  if (trat_superficie) {
    const { pinturas = [], otros = [], id, ...tratRow } = trat_superficie;
    const { data: savedTrat, error: eTrat } = await supabase
      .from("item_trat_superficie").insert(saneado({ ...tratRow, item_id: itemId })).select().single();
    if (eTrat) throw eTrat;
    if (pinturas.length) {
      const { error: eP } = await supabase.from("item_trat_pinturas")
        .insert(pinturas.map((p) => ({ ...sinId(p), trat_id: savedTrat.id })));
      if (eP) throw eP;
    }
    if (otros.length) {
      const { error: eO } = await supabase.from("item_trat_otros")
        .insert(otros.map((o) => ({ ...sinId(o), trat_id: savedTrat.id })));
      if (eO) throw eO;
    }
  }

  return itemId;
};

// ─── CÓMPUTOS (Fase 2, sin cablear a la UI) ────────────────────────
export const loadDBComputos = async () => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const { data, error } = await supabase.from("computos").select("*").order("fecha", { ascending: false });
  if (error) throw error;
  return data;
};

export const loadDBComputoCompleto = async (computoId) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const { data: computo, error: eC } = await supabase.from("computos").select("*").eq("id", computoId).single();
  if (eC) throw eC;
  const { data: items, error: eI } = await supabase
    .from("computo_items").select("*").eq("computo_id", computoId).order("orden");
  if (eI) throw eI;
  const itemsConPiezas = [];
  for (const item of items) {
    const { data: piezas, error: eP } = await supabase
      .from("computo_piezas").select("*").eq("computo_item_id", item.id);
    if (eP) throw eP;
    itemsConPiezas.push({ ...item, piezas });
  }
  return { ...computo, items: itemsConPiezas };
};

// Fase 5 (piloto, 2026-08-23): fusiona por id, mismo criterio que
// presupuestos — solo trae de la nube lo que no exista local todavía.
// Simplificación aceptada a propósito: las piezas que llegan así quedan con
// los campos de ficha (granallado/pintura/etc.) planos en vez de anidados
// bajo `.ficha` como espera la UI — indiferente en la práctica porque este
// camino solo corre para cómputos que nunca pasaron por este navegador.
export const useMergeComputosNube = (setComputos) => {
  useEffect(() => {
    if (!supabase) return;
    let vivo = true;
    (async () => {
      if (!(await esperarSesion()) || !vivo) return;
      try {
        const remotos = await loadDBComputos();
        let faltantes = [];
        setComputos((local) => {
          const idsLocales = new Set(local.map((c) => c.id));
          faltantes = (remotos || []).filter((r) => !idsLocales.has(r.id));
          return local;
        });
        for (const r of faltantes) {
          if (!vivo) return;
          try {
            const [cliente, completo] = await Promise.all([resolverNombreCliente(r.cliente_id), loadDBComputoCompleto(r.id)]);
            const { cliente_id, ...resto } = completo;
            const nuevo = { ...resto, cliente };
            if (vivo) setComputos((prev) => (prev.some((c) => c.id === nuevo.id) ? prev : [...prev, nuevo]));
          } catch (e) {
            console.warn(`[Fase 5] No se pudo traer el cómputo ${r.nro || r.id} de la nube:`, e.message || e);
          }
        }
      } catch (e) {
        console.warn("[Fase 5] No se pudo leer cómputos de la nube:", e.message || e);
      }
    })();
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

// NOTA: la app local guarda cada pieza con { ...campos, ficha: {...} } (objeto
// anidado); la tabla computo_piezas tiene esos campos de ficha aplanados
// directo en la fila. Acá se aplanan al guardar. `largo_mm_input` (string de
// edición en la UI, distinto de `largo_mm` ya parseado) no tiene columna
// propia — es un detalle de edición local, no un dato a persistir.
export const saveDBComputo = async (computo) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const { items } = computo;
  const row = soloColumnas(conIdValido(computo), COLUMNAS_COMPUTO);
  const { data: savedComputo, error: eC } = await supabase.from("computos").upsert(row).select().single();
  if (eC) throw eC;
  const computoId = savedComputo.id;

  const { error: eDel } = await supabase.from("computo_items").delete().eq("computo_id", computoId);
  if (eDel) throw eDel;

  for (const item of items || []) {
    const { piezas, id, ...itemRow } = item;
    const { data: savedItem, error: eI } = await supabase
      .from("computo_items").insert({ ...saneado(itemRow), computo_id: computoId }).select().single();
    if (eI) throw eI;
    if (piezas?.length) {
      const filas = piezas.map((p) => {
        const { id: pid, ficha, largo_mm_input, ...campos } = p;
        return saneado({ ...campos, ...(ficha || {}), computo_item_id: savedItem.id });
      });
      const { error: ePiezas } = await supabase.from("computo_piezas").insert(filas);
      if (ePiezas) throw ePiezas;
    }
  }
  return computoId;
};

// ─── ANIDADOS (optimización de corte) (Fase 2, sin cablear a la UI) ─
export const loadDBAnidados = async () => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const { data, error } = await supabase.from("anidados").select("*").order("fecha", { ascending: false });
  if (error) throw error;
  return data;
};

export const loadDBAnidadoCompleto = async (anidadoId) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const { data: anidado, error: eA } = await supabase.from("anidados").select("*").eq("id", anidadoId).single();
  if (eA) throw eA;
  const { data: grupos, error: eG } = await supabase
    .from("anidado_grupos").select("*").eq("anidado_id", anidadoId).order("orden");
  if (eG) throw eG;
  const gruposConPiezas = [];
  for (const grupo of grupos) {
    const { data: piezas, error: eP } = await supabase.from("anidado_piezas").select("*").eq("grupo_id", grupo.id);
    if (eP) throw eP;
    gruposConPiezas.push({ ...grupo, piezas });
  }
  return { ...anidado, grupos: gruposConPiezas };
};

export const saveDBAnidado = async (anidado) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const { grupos } = anidado;
  const row = soloColumnas(conIdValido(anidado), COLUMNAS_ANIDADO);
  const { data: savedAnidado, error: eA } = await supabase.from("anidados").upsert(row).select().single();
  if (eA) throw eA;
  const anidadoId = savedAnidado.id;

  const { error: eDel } = await supabase.from("anidado_grupos").delete().eq("anidado_id", anidadoId);
  if (eDel) throw eDel;

  for (const grupo of grupos || []) {
    const { piezas, id, ficha, ...grupoRow } = grupo;
    const { data: savedGrupo, error: eG } = await supabase
      .from("anidado_grupos")
      .insert(saneado({ ...grupoRow, ...(ficha || {}), anidado_id: anidadoId }))
      .select()
      .single();
    if (eG) throw eG;
    if (piezas?.length) {
      const filas = piezas.map((p) => ({ ...sinId(p), grupo_id: savedGrupo.id }));
      const { error: ePiezas } = await supabase.from("anidado_piezas").insert(filas);
      if (ePiezas) throw ePiezas;
    }
  }
  return anidadoId;
};

// Fase 5 (piloto, 2026-08-23): fusiona por id, mismo criterio que
// presupuestos/cómputos — solo trae de la nube lo que no exista local.
export const useMergeAnidadosNube = (setAnidados) => {
  useEffect(() => {
    if (!supabase) return;
    let vivo = true;
    (async () => {
      if (!(await esperarSesion()) || !vivo) return;
      try {
        const remotos = await loadDBAnidados();
        let faltantes = [];
        setAnidados((local) => {
          const idsLocales = new Set(local.map((a) => a.id));
          faltantes = (remotos || []).filter((r) => !idsLocales.has(r.id));
          return local;
        });
        for (const r of faltantes) {
          if (!vivo) return;
          try {
            const [cliente, completo] = await Promise.all([resolverNombreCliente(r.cliente_id), loadDBAnidadoCompleto(r.id)]);
            const { cliente_id, ...resto } = completo;
            const nuevo = { ...resto, cliente };
            if (vivo) setAnidados((prev) => (prev.some((a) => a.id === nuevo.id) ? prev : [...prev, nuevo]));
          } catch (e) {
            console.warn(`[Fase 5] No se pudo traer el anidado ${r.nombre || r.id} de la nube:`, e.message || e);
          }
        }
      } catch (e) {
        console.warn("[Fase 5] No se pudo leer anidados de la nube:", e.message || e);
      }
    })();
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

// ─── HISTORIAL DE TRABAJOS (benchmark) (Fase 2, sin cablear a la UI) ─
// Ojo al conectar esto en Fase 3: la tabla local (iTrabajo) guarda `cliente`
// como texto libre; la tabla de la base pide `cliente_id` ya resuelto contra
// `clientes` (mismo criterio de unificación que el resto). El caller tiene
// que hacer esa resolución antes de llamar a saveDBTrabajoHistorico.
// Fase 5 (piloto, 2026-08-23): mismo criterio de fusión por id que biblioteca
// — nunca pierde un trabajo que solo existe local.
export const useMergeHistorialNube = (setTrabajos) => {
  useEffect(() => {
    if (!supabase) return;
    let vivo = true;
    (async () => {
      if (!(await esperarSesion()) || !vivo) return;
      loadDBHistorialTrabajos()
        .then((remotos) => {
          if (!vivo) return;
          setTrabajos((local) => {
            const porId = new Map(local.map((t) => [t.id, t]));
            for (const r of remotos || []) if (!porId.has(r.id)) porId.set(r.id, r);
            return Array.from(porId.values());
          });
        })
        .catch((e) => {
          console.warn("[Fase 5] No se pudo leer el historial de la nube, usando solo local:", e.message || e);
        });
    })();
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const loadDBHistorialTrabajos = async () => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const { data, error } = await supabase.from("historial_trabajos").select("*").order("fecha", { ascending: false });
  if (error) throw error;
  return data;
};

// Lista blanca en vez de negra: el objeto local (iTrabajo) fue creciendo
// campos sueltos con el tiempo (created_at/updated_at de touch(), dias_obra,
// etc. — encontrados recién al migrar datos reales en Fase 4) que no tienen
// columna en historial_trabajos. Elegir explícitamente evita que aparezca
// un campo nuevo mañana y rompa el insert otra vez.
const COLUMNAS_HISTORIAL_TRABAJO = [
  "id", "tenant_id", "nro_ot", "fecha", "cliente_id", "empresa", "obra", "categoria",
  "tipo_trabajo", "vendedor", "eliminado", "eliminado_por", "eliminado_fecha",
  "kg_total", "metros_total", "usd_total",
  "pct_hier", "pct_mat", "pct_mo_fab", "pct_mo_mon", "pct_hesp",
  "pct_t_fab", "pct_t_mon", "pct_trat", "pct_trasl", "pct_panto",
];
export const saveDBTrabajoHistorico = async (trabajo) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const row = {};
  for (const k of COLUMNAS_HISTORIAL_TRABAJO) if (trabajo[k] !== undefined) row[k] = trabajo[k];
  const { data, error } = await supabase.from("historial_trabajos").upsert(row).select().single();
  if (error) throw error;
  return data;
};

// ─── BIBLIOTECA DE MATERIALES (Fase 2, sin cablear a la UI) ─────────
const BIBLIOTECA_TABLAS = {
  perfil: "biblioteca_perfiles",
  planchuela: "biblioteca_planchuelas",
  plancha: "biblioteca_planchas",
  rejilla: "biblioteca_rejillas",
};

// Fase 5 (piloto, 2026-08-23): fusiona por id en vez de reemplazar — nunca
// pierde un material que solo existe local (por ejemplo si todavía no pasó
// por la migración de Fase 4), y suma lo que exista remoto y no esté local.
export const useMergeBibliotecaNube = (tipo, setItems) => {
  useEffect(() => {
    if (!supabase) return;
    let vivo = true;
    (async () => {
      if (!(await esperarSesion()) || !vivo) return;
      loadDBBiblioteca(tipo)
        .then((remotos) => {
          if (!vivo) return;
          setItems((local) => {
            const porId = new Map(local.map((i) => [i.id, i]));
            for (const r of remotos || []) if (!porId.has(r.id)) porId.set(r.id, r);
            return Array.from(porId.values());
          });
        })
        .catch((e) => {
          console.warn(`[Fase 5] No se pudo leer biblioteca (${tipo}) de la nube, usando solo local:`, e.message || e);
        });
    })();
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo]);
};

export const loadDBBiblioteca = async (tipo) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const tabla = BIBLIOTECA_TABLAS[tipo];
  if (!tabla) throw new Error(`Tipo de material desconocido: ${tipo}`);
  const { data, error } = await supabase.from(tabla).select("*").order("nombre");
  if (error) throw error;
  return data;
};

// historial_precios[] NO se guarda acá — es de alta natural (cada cambio de
// precio agrega una fila, nunca se reemplaza el historial completo). Ver
// loadDBHistorialPrecios/addDBHistorialPrecio más abajo.
export const saveDBMaterial = async (tipo, material) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const tabla = BIBLIOTECA_TABLAS[tipo];
  if (!tabla) throw new Error(`Tipo de material desconocido: ${tipo}`);
  const { historial_precios, ...row } = material;
  const { data, error } = await supabase.from(tabla).upsert(saneado(row)).select().single();
  if (error) throw error;
  return data;
};

export const loadDBHistorialPrecios = async (tipo, materialId) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const { data, error } = await supabase
    .from("material_historial_precios")
    .select("*")
    .eq("material_tipo", tipo)
    .eq("material_id", materialId)
    .order("fecha", { ascending: false });
  if (error) throw error;
  return data;
};

export const addDBHistorialPrecio = async (tipo, materialId, entry) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const { data, error } = await supabase
    .from("material_historial_precios")
    .insert({ ...entry, material_tipo: tipo, material_id: materialId })
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ─── TARIFARIO (Fase 2, sin cablear a la UI) ────────────────────────
// terc_fabricacion/terc_montajes (legado) y trat_superficie_extra/
// pantografo_extra (vacíos por defecto) no tienen tabla propia todavía —
// ver BACKEND-COMPARTIDO.md. Se ignoran acá si vienen en el objeto.
const TARIFARIO_TABLAS = [
  ["mo_fab", "tarifario_mo_fab"],
  ["mo_mon", "tarifario_mo_mon"],
  ["mat_generales", "tarifario_mat_generales"],
  ["terceros", "tarifario_terceros"],
  ["traslados", "tarifario_traslados"],
  ["pinturas", "tarifario_pinturas"],
  ["interes_financiero", "tarifario_interes_financiero"],
];

const obtenerTenantId = async () => {
  // Sin filtrar por el usuario actual, esto seleccionaba TODOS los
  // profiles visibles por RLS (cualquier cuenta del mismo tenant) —
  // con más de una cuenta real (ej. la de prueba compartida), .single()
  // fallaba con "Cannot coerce the result to a single JSON object"
  // (encontrado migrando datos reales, 2026-08-24).
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single();
  if (error) throw error;
  return data.tenant_id;
};

export const loadDBTarifario = async () => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const resultado = {};
  for (const [campo, tabla] of TARIFARIO_TABLAS) {
    const { data, error } = await supabase.from(tabla).select("*");
    if (error) throw error;
    resultado[campo] = data;
  }
  const { data: config, error: eCfg } = await supabase.from("tarifario_config").select("*").maybeSingle();
  if (eCfg) throw eCfg;
  return {
    ...resultado,
    arenado_usd_m2: config?.arenado_usd_m2 ?? 0,
    galvanizado_usd_kg: config?.galvanizado_usd_kg ?? 0,
    panto_usd_kg_2d: config?.panto_usd_kg_2d ?? 0,
    panto_usd_kg_3d: config?.panto_usd_kg_3d ?? 0,
  };
};

export const saveDBTarifario = async (tarifario) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  for (const [campo, tabla] of TARIFARIO_TABLAS) {
    const { error: eDel } = await supabase.from(tabla).delete().not("id", "is", null);
    if (eDel) throw eDel;
    const filas = (tarifario[campo] || []).map((f) => sinId(f));
    if (filas.length) {
      const { error: eIns } = await supabase.from(tabla).insert(filas);
      if (eIns) throw eIns;
    }
  }
  const tenantId = await obtenerTenantId();
  const { arenado_usd_m2, galvanizado_usd_kg, panto_usd_kg_2d, panto_usd_kg_3d } = tarifario;
  const { error: eCfg } = await supabase
    .from("tarifario_config")
    .upsert({ tenant_id: tenantId, arenado_usd_m2, galvanizado_usd_kg, panto_usd_kg_2d, panto_usd_kg_3d });
  if (eCfg) throw eCfg;
};

// Fase 5 (piloto, 2026-08-23): Supabase primero, local de respaldo si falla.
// A diferencia de la lista de clientes (que se UNE), acá se prefiere directo
// lo remoto si responde — cada edición de tarifario ya escribe a los dos
// lados a la vez (Fase 3), así que deberían estar sincronizados; no hay
// necesidad de mezclar. Cacheado en módulo para que las 4 secciones que
// editan el tarifario (BibliotecaMateriales.jsx) arranquen con el mismo dato.
let _cacheTarifario = null;
export const useTarifarioConNube = () => {
  const [tarifario, setTarifario] = useState(() => _cacheTarifario || loadTarifario());
  useEffect(() => {
    if (!supabase) return;
    let vivo = true;
    (async () => {
      if (!(await esperarSesion()) || !vivo) return;
      loadDBTarifario()
        .then((t) => {
          _cacheTarifario = t;
          if (vivo) setTarifario(t);
        })
        .catch((e) => {
          console.warn("[Fase 5] No se pudo leer el tarifario de la nube, usando el local:", e.message || e);
        });
    })();
    return () => { vivo = false; };
  }, []);
  return [tarifario, setTarifario];
};

// ─── MIGRACIÓN ÚNICA (Fase 4, 2026-08-23) ───────────────────────────
// Sube TODO lo que ya está en localStorage al backend real, usando los
// mismos loadDB/saveDB de Fase 3 (no es código nuevo sin probar). Pensada
// para correrse UNA vez, en el navegador de quien ya tiene sesión real —
// nunca se ejecuta sola, la dispara un botón admin-only en Config. Corre
// todo secuencial (no en paralelo) para no saturar la base y poder llevar
// un conteo de errores entidad por entidad sin que uno tumbe a los demás.
// Corrige en el propio localStorage (antes de subir) cualquier id que no
// sea un uuid válido — registros viejos, de antes de que uid() generara
// uuid real, o de seeds de prueba. Se persiste ya corregido para que
// saveDBItem(p.id,...) más abajo use el mismo id que terminó subiendo el
// presupuesto/cómputo/anidado dueño, y para que ediciones futuras (Fase 3)
// ya encuentren el id bueno en vez de volver a fallar cada vez.
// Devuelve además un mapa id-viejo → id-nuevo: los ítems de presupuesto
// referencian cómputos/anidados por id (computo_id/anidado_id) — sin este
// mapa, corregir el id del cómputo/anidado por un lado deja la referencia
// del ítem apuntando a un id que ya no existe en ningún lado (encontrado
// con "seed_anid_001" como anidado_id de un ítem real, 2026-08-24).
const normalizarIds = (key) => {
  const arr = loadLS(key, []);
  let cambio = false;
  const mapa = new Map();
  const normalizado = arr.map((r) => {
    if (r.id && !UUID_RE.test(String(r.id))) {
      const nuevo = uid();
      mapa.set(r.id, nuevo);
      cambio = true;
      return { ...r, id: nuevo };
    }
    return r;
  });
  if (cambio) saveLS(key, normalizado);
  return { arr: normalizado, mapa };
};

export const migrarTodoALaNube = async (onProgress) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const log = (msg) => { if (onProgress) onProgress(msg); };
  const resumen = {
    clientes: { ok: 0, total: 0 }, presupuestos: { ok: 0, total: 0 },
    computos: { ok: 0, total: 0 }, anidados: { ok: 0, total: 0 },
    historial: { ok: 0, total: 0 }, biblioteca: { ok: 0, total: 0 },
    tarifario: { ok: 0, total: 1 }, errores: [],
  };

  const nombresClientes = loadClientes();
  resumen.clientes.total = nombresClientes.length;
  for (const nombre of nombresClientes) {
    try { await resolverClienteId(nombre); resumen.clientes.ok++; }
    catch (e) { resumen.errores.push(`Cliente "${nombre}": ${e.message || e}`); }
  }
  log(`Clientes: ${resumen.clientes.ok}/${resumen.clientes.total}`);

  // Cómputos y anidados se normalizan y suben ANTES que presupuestos: sus
  // ítems los referencian por id (computo_id/anidado_id), así que tienen
  // que existir ya en la base (FK) y con el id ya corregido (para poder
  // reescribir la referencia del ítem con el mapa de abajo).
  const { arr: computos, mapa: mapaComputos } = normalizarIds("smeas_computos");
  resumen.computos.total = computos.length;
  for (const c of computos) {
    try {
      const cliente_id = c.cliente ? await resolverClienteId(c.cliente) : null;
      const { cliente, ...resto } = c;
      await saveDBComputo({ ...resto, cliente_id });
      resumen.computos.ok++;
    } catch (e) { resumen.errores.push(`Cómputo ${c.nro || c.id}: ${e.message || e}`); }
  }
  log(`Cómputos: ${resumen.computos.ok}/${resumen.computos.total}`);

  const { arr: anidados, mapa: mapaAnidados } = normalizarIds("smeas_anidados");
  resumen.anidados.total = anidados.length;
  for (const a of anidados) {
    try {
      const cliente_id = a.cliente ? await resolverClienteId(a.cliente) : null;
      const { cliente, ...resto } = a;
      await saveDBAnidado({ ...resto, cliente_id });
      resumen.anidados.ok++;
    } catch (e) { resumen.errores.push(`Anidado ${a.nombre || a.id}: ${e.message || e}`); }
  }
  log(`Anidados: ${resumen.anidados.ok}/${resumen.anidados.total}`);

  const { arr: presupuestos } = normalizarIds("smeas_presupuestos");
  resumen.presupuestos.total = presupuestos.length;
  for (const p of presupuestos) {
    try {
      const cliente_id = p.cliente ? await resolverClienteId(p.cliente) : null;
      const { cliente, clonado_de, items, ...resto } = p;
      await saveDBPresupuestoSM({ ...resto, cliente_id, clonado_de_id: clonado_de || null });
      for (const item of items || []) {
        const itemCorregido = { ...item };
        if (itemCorregido.computo_id && mapaComputos.has(itemCorregido.computo_id)) {
          itemCorregido.computo_id = mapaComputos.get(itemCorregido.computo_id);
        }
        if (itemCorregido.anidado_id && mapaAnidados.has(itemCorregido.anidado_id)) {
          itemCorregido.anidado_id = mapaAnidados.get(itemCorregido.anidado_id);
        }
        await saveDBItem(p.id, itemCorregido);
      }
      resumen.presupuestos.ok++;
    } catch (e) { resumen.errores.push(`Presupuesto ${p.nro || p.id}: ${e.message || e}`); }
  }
  log(`Presupuestos: ${resumen.presupuestos.ok}/${resumen.presupuestos.total}`);

  const trabajos = loadLS("smeas_historial", []);
  resumen.historial.total = trabajos.length;
  for (const t of trabajos) {
    try {
      const cliente_id = t.cliente ? await resolverClienteId(t.cliente) : null;
      const { cliente, desglose_pct, ...resto } = t;
      const pct = desglose_pct || {};
      await saveDBTrabajoHistorico({
        ...resto, cliente_id,
        pct_hier: pct.hier, pct_mat: pct.mat, pct_mo_fab: pct.moFab, pct_mo_mon: pct.moMon,
        pct_hesp: pct.hesp, pct_t_fab: pct.tFab, pct_t_mon: pct.tMon, pct_trat: pct.trat,
        pct_trasl: pct.trasl, pct_panto: pct.panto,
      });
      resumen.historial.ok++;
    } catch (e) { resumen.errores.push(`Trabajo ${t.nro_ot || t.id}: ${e.message || e}`); }
  }
  log(`Historial: ${resumen.historial.ok}/${resumen.historial.total}`);

  for (const [tipo, key] of Object.entries(BIBLIOTECA_TABLAS_POR_KEY)) {
    const items = loadLS(key, []);
    resumen.biblioteca.total += items.length;
    for (const mat of items) {
      try {
        const { historial_precios, ...row } = mat;
        await saveDBMaterial(tipo, row);
        resumen.biblioteca.ok++;
      } catch (e) { resumen.errores.push(`${tipo} "${mat.nombre}": ${e.message || e}`); }
    }
  }
  log(`Biblioteca: ${resumen.biblioteca.ok}/${resumen.biblioteca.total}`);

  try {
    await saveDBTarifario(loadTarifario());
    resumen.tarifario.ok = 1;
  } catch (e) { resumen.errores.push(`Tarifario: ${e.message || e}`); }
  log(`Tarifario: ${resumen.tarifario.ok ? "OK" : "error"}`);

  return resumen;
};
const BIBLIOTECA_TABLAS_POR_KEY = {
  perfil: "smeas_perfiles", planchuela: "smeas_planchuelas",
  plancha: "smeas_planchas", rejilla: "smeas_rejillas",
};

// Backup manual: descarga/restaura todas las claves smeas_* de localStorage.
export const exportBackup = () => {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("smeas_")) data[k] = localStorage.getItem(k);
  }
  const payload = { app: "steel-measurement", version: 1, exported_at: new Date().toISOString(), data };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  a.href = url;
  a.download = `steel-measurement-backup-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const parseBackup = (jsonText) => {
  const payload = JSON.parse(jsonText);
  if (!payload || payload.app !== "steel-measurement" || typeof payload.data !== "object") {
    throw new Error("Archivo de backup inválido o corrupto.");
  }
  return payload;
};

export const restoreBackup = (payload) => {
  Object.entries(payload.data).forEach(([k, v]) => localStorage.setItem(k, v));
};

// ─── ENVÍO DIRECTO A STEEL CRM ───────────────────────────────────
// Reemplaza el mecanismo viejo de export/import .json (2026-08-29) — los
// dos sistemas comparten el mismo backend de Supabase desde el 23/8, así
// que ya no hace falta el archivo intermedio. Usa la tabla
// `presupuesto_calculo_link` (creada el 22/8, sin wirear hasta ahora a
// propósito — ver ENTIDADES-COMPARTIDAS.md §6) para un vínculo real,
// verificable, en vez del `ids_calc` de texto libre.
//
// Sólo lleva el RESUMEN comercial (cliente, obra, kg, USD total, USD/kg) —
// nunca el desglose interno de los 9 rubros de costo, mismo criterio de
// privacidad que ya usaba el export viejo y que sigue usando el PDF del
// presupuesto (buildPresupuestoHTML).
export const buscarVinculoCRM = async (presupuestoSmId) => {
  if (!supabase || !presupuestoSmId) return null;
  const { data, error } = await supabase
    .from("presupuesto_calculo_link")
    .select("presupuesto_crm_id, presupuestos_crm(nro)")
    .eq("presupuesto_sm_id", presupuestoSmId)
    .maybeSingle();
  if (error || !data) return null;
  return { crmId: data.presupuesto_crm_id, nro: data.presupuestos_crm?.nro || null };
};

// El N° de presupuesto de Steel CRM es único por tenant y sigue un formato
// configurable (Config > Sistema, sólo en el localStorage de Steel CRM) que
// acá no se puede replicar — se usa un N° provisorio "SM-<código de
// cálculo>" y queda para quien reciba el presupuesto en Steel CRM corregirlo
// con "Corregir N° de Presupuesto" (Importar > Mantenimiento, ya existe).
export const enviarPresupuestoASteelCRM = async (pres, calc, usuario) => {
  if (!supabase) throw new Error("Supabase no configurado (faltan REACT_APP_SUPABASE_URL/ANON_KEY)");
  const existente = await buscarVinculoCRM(pres.id);
  if (existente) return existente;

  const nombreParaClientes = (pres.contacto || pres.cliente || "").trim();
  const empresaParaClientes = pres.contacto ? pres.cliente : null;
  const cliente_id = nombreParaClientes ? await resolverClienteId(nombreParaClientes, empresaParaClientes) : null;

  const rowCrm = saneado({
    nro: `SM-${pres.codigo_calculo}`,
    cliente_id,
    cliente_nombre: pres.contacto || pres.cliente || "",
    empresa: pres.contacto ? pres.cliente : "",
    fecha: pres.fecha || null,
    tipo: pres.categoria || "",
    categoria: pres.categoria || "",
    obra: pres.obra || "",
    kg_cotizados: calc.total_kg,
    precio_usd_kg: calc.usd_kg,
    monto_usd: calc.gran_total,
    vendedor_id: usuario?.profileId || null,
  });
  const { data: crmRow, error: errCrm } = await supabase.from("presupuestos_crm").insert(rowCrm).select().single();
  if (errCrm) throw errCrm;

  const { error: errLink } = await supabase
    .from("presupuesto_calculo_link")
    .insert({ presupuesto_crm_id: crmRow.id, presupuesto_sm_id: pres.id });
  if (errLink) throw errLink;

  return { crmId: crmRow.id, nro: crmRow.nro };
};

export const iUsuarios = loadLS("smeas_usuarios", [
  { id: 1, nombre: "Administrador", rol: "admin", emoji: "⚙️", clave: "admin" },
]);

// Tarifario configurable (Config): catálogo extensible de ítems por rubro
// (MO Fab, MO Mon, Materiales Generales, Terc. Fab, Terc. Mon, Traslados) +
// tarifas sueltas (arenado, galvanizado, pantógrafo). Se puede agregar
// cualquier ítem nuevo a cada catálogo — no está limitado a una lista fija.
// Sirve como catálogo para elegir rápido al cargar un presupuesto; el
// usuario puede editar el monto por fila sin que eso cambie el tarifario.
const mkCat = (prefix, campo, entries) =>
  entries.map(([nombre, valor], i) => ({ id: `${prefix}_${i}`, nombre, [campo]: valor }));

const TARIFARIO_DEFAULT = {
  // 2026-08-31, a pedido de Gino: horas por día para el cálculo de "días
  // estimados" de MO — antes era una constante fija (8) sin forma de
  // tocarla. Este es el default global; cada ítem lo puede pisar solo
  // para ese presupuesto (ver TabMO en Presupuesto.jsx).
  horas_por_dia: 8,
  mo_fab: [
    { id: "mo_fab_1", nombre: "OFICIAL FAB",     usd_hora: 34 },
    { id: "mo_fab_2", nombre: "1/2 OFICIAL FAB", usd_hora: 28 },
    { id: "mo_fab_3", nombre: "PEON FAB",        usd_hora: 22 },
    { id: "mo_fab_4", nombre: "SUPERVISOR",      usd_hora: 39 },
    { id: "mo_fab_5", nombre: "DIBUJANTE",       usd_hora: 32 },
  ],
  mo_mon: [
    { id: "mo_mon_1", nombre: "OFICIAL MONTADOR",         usd_hora: 37 },
    { id: "mo_mon_2", nombre: "1/2 OFICIAL MONTADOR",     usd_hora: 30 },
    { id: "mo_mon_3", nombre: "SUPERVISOR EN OBRA",       usd_hora: 43 },
    { id: "mo_mon_4", nombre: "OFICIAL CONSTRUCCION",     usd_hora: 31 },
    { id: "mo_mon_5", nombre: "1/2 OFICIAL CONSTRUCCION", usd_hora: 25 },
    { id: "mo_mon_6", nombre: "SUPERVISOR CONSTRUCCION",  usd_hora: 35 },
    { id: "mo_mon_7", nombre: "TRANSPORTE A OBRA",        usd_hora: 15 },
    { id: "mo_mon_8", nombre: "COMPLEMENTO MONTAJE",      usd_hora: 7 },
  ],
  mat_generales: mkCat("mg", "usd", [
    ["MALLA ELECTRO SOLDADA 50X50", 110],
    ["BULON DE 1/2\"X1 1/2\" + TUERCA + ARANDELA", 1.5],
    ["CERROJO STANDAR", 30],
    ["SILICONA NEUTRA", 5],
    ["SILICONA SIKA FLEX", 15],
    ["VARILLA ROSCADA 25MM", 15],
    ["CODO HIERRO CED. 40 48.2 EXT. ESP. 3,68", 3],
    ["REJILLA RJ08 990X3000MM (GALVANIZADA)", 365],
    ["REJILLA RJ06 630X6000MM (GALVANIZADA)", 470],
    ["ZINGA EN LATA (GALVANIZADO EN FRIO)", 150],
    ["TUERCA 5/8", 0.25],
    ["METAL DESPLEGADO GA431 1200X3000MM", 150],
    ["METAL DESPLEGADO MD431", 54],
    ["METAL DESPLEGADO MD431A", 24],
    ["VARILLA ROSCADA 1/2", 6.5],
    ["BULON DE 5/8\"X1 1/2\" + TUERCA + ARANDELA", 2],
    ["BULON DE 1/2\"X2\" + TUERCA", 1.5],
    ["RESINA EPOXICA HILTI HY-200 500CC", 53],
    ["RESINA EPOXICA HILTI HY-10 500CC", 27],
    ["METAL DESPLEGADO MD 454 (1220X2440)MM", 60],
    ["VARILLA ROSCADA M16 8,8", 15],
    ["CHAPA TRAPEZOIDAL 1,83M X 1,01M ESP 0,5MM", 20],
    ["REJILLA RJ02 810X6000MM (LAMINADA)", 300],
    ["CHAPA M. PERFORADA 4MM, ESP 0,9", 65],
    ["VARILLA ROSCADA 3/8\" INOX", 6.05],
    ["VARILLA ROSCADA M10 INOX", 4],
    ["METAL DESPLEGADO S31 (HIERROS SABATINI)", 90],
    ["BULON DE 1\" + TUERCA + ARANDELA", 3],
    ["BULON 3/8 X 4\" CON TUERCA Y ARANDELA", 0.3],
    ["TEJIDO 40X40MM, ROLLO 25M X 2M", 275],
    ["BRIDA SLIP ON 10\" CLASE 150", 65],
    ["STEEL DECK 0,89MM / UTIL 0,91", 30],
    ["VARILLA ROSCADA 1\"", 10.5],
    ["METAL DESPLEGADO MD 454 (1500X3000)MM", 125],
    ["REJILLA RJ07 990X2000MM (GALVANIZADA)", 215],
    ["METAL DESPLEGADO MD 411 3000X1000", 45],
    ["HORMIGON TIPO C-20 VOLCADO 1MT3", 105],
    ["CHAPA TRAPEZOIDAL 0,5MM L=6,10 MTS", 125],
    ["BULON M16 X 50MM GALV CAL", 0.7],
    ["TUERCA M16 GALV CAL", 0.3],
    ["ARANDELA PLANA M16 GALV CAL", 0.1],
    ["TUERCA 5/8\" GALV CAL", 0.4],
    ["ARANDELA 5/8\" GALV CAL", 0.1],
    ["TUERCA M10 GALV CAL", 0.06],
    ["BULON 5/16 X 4\"", 0.8],
    ["BULON 1/2\" COMPLETO GALV CAL", 0.65],
    ["VARILLA ROSCADA 3/4\"", 6.5],
    ["TUERCA 3/4\" GALV CAL", 0.3],
    ["ARANDELA 3/4\" GALV CAL", 0.15],
    ["ACC SOLD CAÑO 1\" SCH40", 10],
    ["EMBALAJE Y PRESENTACIÓN", 50],
    ["TEJIDO ROMBOIDAL 50X50MM (25X2,2M)", 265],
    ["REJILLA RJ01 630X6000MM (LAMINADA)", 390],
    ["REJILLA RJ061 999X3000MM (GALV-MOLDURA)", 200],
    ["REJILLA RJ060 998X3000 (GALV-MOLDURA)", 371],
    ["RUEDA GIRATORIA CON FRENO 3\" (150KG)", 13],
    ["METAL DESPLEGADO MD 415 (1500X3000)MM", 110],
    ["ECONOPANEL ESP=0,5 M LINEAL", 15],
    ["TORNILLO AUTOPERFORANTE X 100", 20],
    ["REJILLA RJA 30 DENTADA / GALV. CALIENTE", 320],
    ["REJILLA RJ09 630X3000MM", 110],
    ["PLANCHUELA CON PUAS (PORTONES)", 10],
    ["RUEDA DE PORTON CON RESORTE", 75],
    ["TEJIDO ROMBOIDAL 50X50MM 3MM X M2", 10],
    ["BISAGRA", 5],
    ["PASADOR", 15],
    ["METAL DESPLEGADO 3000X1500 (75X38 E=3)", 70],
    ["CHAPA PERFORADA 6,35 1500X3000", 700],
    ["JUEGO RIEL STANLEY (RIEL + CARROS)", 150],
    ["CERRADURA STANLEY", 100],
    ["ISOPANEL 150CM", 50],
    ["METAL DESPLEGADO MD475 1500X3000", 145],
    ["CADENAS DE IZAJE", 2000],
    ["CODO SOLDABLE", 5],
    ["VARILLA ROSCADA 5/8 GALV. EN CALIENTE", 10],
    ["METAL DESPLEGADO MD45B 1220X2440", 75],
    ["METAL DESPLEGADO MD 433", 55],
    ["REJILLA RJA 31 DENTADA / GALV. CALIENTE", 427],
    ["BROCA SDS MAX", 30],
    ["ANCLAJE QUIMICO BCM-MAX", 25],
    ["ANCLAJE QUIMICO HILTI HY 200, 500ML", 50],
    ["TENSOR GRILLETE-GRILLETE 10X100MM INOX", 23],
    ["METAL DESPLEGADO MD484 1500X3000MM", 220],
    ["STEEL DECK 0,71MM / UTIL 0,91", 12],
    ["PERNOS NELSON 19X120MM", 4],
    ["PERFIL C PGC 160X60X20 E=2MM LARGO 6MTS", 55],
    ["CORREA Z 240X65X25 ESPESOR 2,5MM", 28],
    ["TEJIDO 80X80MM ROLLO 25M X 1,8M", 160],
    ["ISOPANEL 100", 50],
    ["CHAPA TRAPEZOIDAL CALIBRE 22 (0,7MM) AL", 10.6],
    ["REJILLA TM 633X5,8 633X5800 (GALV)", 435],
    ["PERFIL C 180X50X25", 9.9],
    ["ESCALONES RJ80C (630X300MM)", 64],
    ["METAL DESPLEGADO MD 454 (1000X2000MM)", 45],
    ["METAL DESPLEGADO MD 458 (1200X2440MM)", 20],
  ]),
  terc_fabricacion: mkCat("tf", "usd", [
    ["CORTE Y DOBLADO VARILLAS POR KILO", 0.45],
    ["CORTE Y PLEGADO", 0.5],
    ["CORTE Y DOBLADO ESTRIBOS MANO DE OBRA", 0.35],
    ["CILINDRADOS", 0.25],
    ["CURVADO", 100],
    ["CALCULO ESTRUCTURAL", 1000],
    ["PLEGADO POR METRO LINEAL", 5],
    ["ENSAYOS / END", 500],
    ["TORNERIA", 100],
    ["PINTURA AL HORNO", 100],
    ["ROSCADOS", 4],
    ["PLEGADOS", 0.35],
    ["PRUEBA HIDRAULICA CAÑERIAS (15KG/CM2)", 2500],
    ["PRUEBA NEUMATICA DE ESTANQUEIDAD", 2500],
    ["ENSAYO DE FLOTABILIDAD", 4000],
    ["ENSAYO DE ADHERENCIA Y CONTROL DE ESPESOR", 1000],
    ["MECANIZADO", 1],
    ["SOLDADORA DE PERNOS NELSON", 300],
    ["SOLD PERNOS T.NELSON + OPERARIO X DIA", 380],
    ["SOLD PERNOS T.NELSON (FLETE MONTEVIDEO)", 460],
    ["HORMIGON CONCRETO TIPO C20 X MT3", 100],
  ]),
  terc_montajes: [],
  // Unificado — Terc. Fabricación y Terc. Montajes se muestran juntos en Insumos
  // y Precios desde 2026-08-02 (antes eran 2 catálogos separados). Se arranca
  // con los mismos ítems que tenía terc_fabricacion; terc_fabricacion/
  // terc_montajes se conservan por compatibilidad con tarifarios ya guardados.
  terceros: mkCat("terc", "usd", [
    ["CORTE Y DOBLADO VARILLAS POR KILO", 0.45],
    ["CORTE Y PLEGADO", 0.5],
    ["CORTE Y DOBLADO ESTRIBOS MANO DE OBRA", 0.35],
    ["CILINDRADOS", 0.25],
    ["CURVADO", 100],
    ["CALCULO ESTRUCTURAL", 1000],
    ["PLEGADO POR METRO LINEAL", 5],
    ["ENSAYOS / END", 500],
    ["TORNERIA", 100],
    ["PINTURA AL HORNO", 100],
    ["ROSCADOS", 4],
    ["PLEGADOS", 0.35],
    ["PRUEBA HIDRAULICA CAÑERIAS (15KG/CM2)", 2500],
    ["PRUEBA NEUMATICA DE ESTANQUEIDAD", 2500],
    ["ENSAYO DE FLOTABILIDAD", 4000],
    ["ENSAYO DE ADHERENCIA Y CONTROL DE ESPESOR", 1000],
    ["MECANIZADO", 1],
    ["SOLDADORA DE PERNOS NELSON", 300],
    ["SOLD PERNOS T.NELSON + OPERARIO X DIA", 380],
    ["SOLD PERNOS T.NELSON (FLETE MONTEVIDEO)", 460],
    ["HORMIGON CONCRETO TIPO C20 X MT3", 100],
  ]),
  traslados: mkCat("tr", "usd", [
    ["HIDRO GRUA 20 TON", 90],
    ["TRANSPORTE POR KM CHATA COMUN 12 MTS", 3.5],
    ["TRANSPORTE ESPECIAL 4 MTS ANCHO MDEO", 600],
    ["TRANSPORTE MN", 75],
    ["PLATAFORMA DE TIJERA", 500],
    ["PREVENCIONISTA", 500],
    ["HIDRO GRUA MN", 65],
    ["BRAZO ARTICULADO BOOM 9MTS X 30 DIAS", 2000],
    ["GRUA MAS DE 100T", 200],
    ["ELEVADOR", 12],
    ["GRUA 100 TON", 200],
    ["RETRO EXCAVADORA X HORA", 35],
    ["GENERADOR NAFTA 2,5KW (DIARIO)", 21],
    ["BAÑO QUIMICO", 90],
    ["ALQUILER DE ANDAMIOS", 200],
    ["HOSPEDAJE POR NOCHE", 60],
    ["TRANSPORTE ESPECIAL", 1500],
    ["TRASLADO A OBRA", 5],
    ["VIATICO MAYOR 25KM", 22],
    ["HOSPEDAJE", 1500],
    ["PASAJE CADA 15 DIAS", 25],
    ["CHATA 12M", 200],
    ["TIJERA", 150],
  ]),
  pinturas: mkCat("pi", "usd", [
    ["FONDO ANTIOXIDO", 10],
    ["ESMALTE SINTETICO", 12],
    ["ARENADO SA 2 1/2", 10],
    ["FONDO EPOXI", 18],
    ["INTERMEDIA EPOXI (INTERSEAL 670)", 18],
    ["TERMINACION PU (INTERTHANE 990)", 25],
    ["TERMINACION EPOXI (INTERIOR)", 25],
    ["INTERZINC 52 (ZINC SILICATO)", 37],
    ["FOSFATO DE ZINC (INTERGARD 251)", 21],
    ["INTERTHERM 50", 28.4],
    ["INTERZINC 22 (ZINC INORGANICO)", 37],
    ["INTERLINE 850", 24],
    ["ZINGA (GALVANIZADO EN FRIO)", 92],
    ["ESFUMADITA", 5],
    ["CROMOX (CONVERTIDOR DE OXIDO)", 28],
    ["TERMINACION PU (INTERTHANE 870)", 25],
    ["INTERTUF 262", 18],
    ["INTERZONE 854", 25],
    ["ESMALTE EPOXI (INTERGARD 740)", 25],
    ["HEMPADUR MIO 15570", 20],
    ["HEMPADUR MASTIC 45880", 22],
    ["HEMPATHANE HS 55610", 23.5],
    ["INTERZONE 954", 22],
    ["HEMPADUR AVANTGUARD 750 1736G", 42.6],
    ["HEMPADUR QUATTRO 17634", 22],
    ["HEMPADUR TIE COAT 49183", 23],
    ["HEMPEL S A/F GLOBIC 9000 7890", 57.6],
    ["INTERPRIME 198", 20],
    ["INTERGARD 269", 17],
    ["INTUMESCENTE C-THERM IC600WB", 34],
    ["INTERLAC 655", 25],
    ["HEMPAPRIME MULTI 500 WINTER 45953", 15],
    ["ESMALTE CONVERTIDOR DE OXIDO PROMET", 18],
  ]),
  interes_financiero: [
    { id: "int_30_usd",  nombre: "30 días",  moneda: "USD", dias: 30,  pct: 1.00 },
    { id: "int_60_usd",  nombre: "60 días",  moneda: "USD", dias: 60,  pct: 1.40 },
    { id: "int_90_usd",  nombre: "90 días",  moneda: "USD", dias: 90,  pct: 1.70 },
    { id: "int_120_usd", nombre: "120 días", moneda: "USD", dias: 120, pct: 2.20 },
    { id: "int_150_usd", nombre: "150 días", moneda: "USD", dias: 150, pct: 2.80 },
    { id: "int_180_usd", nombre: "180 días", moneda: "USD", dias: 180, pct: 3.40 },
    { id: "int_30_uyu",  nombre: "30 días",  moneda: "UYU", dias: 30,  pct: 3.00 },
    { id: "int_60_uyu",  nombre: "60 días",  moneda: "UYU", dias: 60,  pct: 4.00 },
    { id: "int_90_uyu",  nombre: "90 días",  moneda: "UYU", dias: 90,  pct: 5.00 },
    { id: "int_120_uyu", nombre: "120 días", moneda: "UYU", dias: 120, pct: 6.70 },
    { id: "int_150_uyu", nombre: "150 días", moneda: "UYU", dias: 150, pct: 8.40 },
    { id: "int_180_uyu", nombre: "180 días", moneda: "UYU", dias: 180, pct: 10.00 },
    { id: "int_sin_usd", nombre: "Sin interés", moneda: "USD", dias: 0, pct: 0 },
    { id: "int_120_usd_factoring", nombre: "120 días (factoring)", moneda: "USD", dias: 120, pct: 4.00 },
  ],
  arenado_usd_m2: 10, galvanizado_usd_kg: 1.00,
  panto_usd_kg_2d: 0, panto_usd_kg_3d: 0,
  // Catálogos de referencia extensibles — Arenado/Granallado y Galvanizado
  // (arriba) siguen siendo los 2 campos que realmente calcula Presupuesto;
  // acá se pueden agregar OTROS tipos de tratamiento/corte para tener el
  // precio de referencia a mano (ej. Metalizado, Fosfatizado), aunque
  // todavía no se auto-calculan en el ítem — hay que cargarlos a mano en
  // Trat. Superficie → Pinturas, que sí es una lista libre.
  trat_superficie_extra: [],
  pantografo_extra: [],
};
// Cacheado por el string crudo de localStorage (no por saveTarifario, que es
// una sola vía de escritura entre varias) — calcItem() lo llama una vez por
// cada fila de costo de cada ítem de cada presupuesto visible, y Presupuesto.jsx
// vuelve a llamar calcItem/calcPresupuesto en cada render sin memoizar (bug de
// performance real, cuelgue de unos segundos al listar presupuestos — mismo
// patrón que el fix aplicado en Steel CRM, ver CLAUDE.md 2026-08-30). Sin este
// cache, cada uno de esos llamados repetía un localStorage.getItem + JSON.parse
// + merge del tarifario completo. Comparar contra el string crudo (no contra un
// flag manual) hace que se invalide solo ante cualquier escritura, venga de
// saveTarifario o de restoreBackup (que además siempre recarga la página).
// Sentinel en vez de null/undefined: localStorage.getItem() ya puede devolver
// null cuando no hay tarifario guardado, así que null no sirve para distinguir
// "todavía no se llamó nunca" de "se llamó y no había nada guardado".
const _SIN_CACHEAR = Symbol("sin cachear");
let _tarifarioRawCache = _SIN_CACHEAR, _tarifarioParsedCache = null;
export const loadTarifario = () => {
  const raw = localStorage.getItem("smeas_tarifario");
  if (raw === _tarifarioRawCache) return _tarifarioParsedCache;
  const t = raw ? JSON.parse(raw) : null;
  let merged;
  if (!t) {
    merged = TARIFARIO_DEFAULT;
  } else {
    // completa catálogos que puedan faltar si el tarifario se guardó con una versión vieja
    merged = { ...TARIFARIO_DEFAULT, ...t };
    // Migración 2026-08-02: terc_fabricacion + terc_montajes → terceros unificado
    // (solo si el tarifario guardado todavía no tiene "terceros").
    if (!t.terceros) {
      merged.terceros = [...(t.terc_fabricacion || TARIFARIO_DEFAULT.terc_fabricacion), ...(t.terc_montajes || [])];
    }
  }
  _tarifarioRawCache = raw;
  _tarifarioParsedCache = merged;
  return merged;
};
export const saveTarifario = (t) => saveLS("smeas_tarifario", t);

// ─── NUMERACIÓN DE PRESUPUESTOS ─────────────────────────────────────
// Formato configurable (Sistema > Empresa): prefijo, si incluye el año,
// dígitos del secuencial, si reinicia cada 1° de enero. Antes se calculaba
// escaneando el máximo numérico de todos los nro existentes (genNro) — eso
// se rompía con los históricos importados (H-4176, H-13183...), que traían
// números de OT reales de miles/decenas de miles y hacían que el próximo
// presupuesto nuevo saliera con un número gigante sin sentido. Ahora usa un
// contador propio en localStorage, igual que steelCRM.
const NUMERACION_DEFAULT = { prefijo: "P-", incluirAnio: false, digitos: 3, reiniciaPorAnio: false };
export const loadNumeracion = () => ({ ...NUMERACION_DEFAULT, ...loadLS("smeas_numeracion", {}) });
export const saveNumeracion = (cfg) => saveLS("smeas_numeracion", cfg);
function contadorKeyPres(cfg) {
  return cfg.reiniciaPorAnio ? `smeas_last_nro_${new Date().getFullYear()}` : "smeas_last_nro";
}
function formatearNroPres(cfg, n) {
  const anioTxt = cfg.incluirAnio ? String(new Date().getFullYear()) : "";
  return `${cfg.prefijo || ""}${anioTxt}${String(n).padStart(cfg.digitos || 3, "0")}`;
}
export const peekNroPresupuesto = () => {
  const cfg = loadNumeracion();
  const last = Number(localStorage.getItem(contadorKeyPres(cfg)) || "0");
  return formatearNroPres(cfg, last + 1);
};
// ─── CÓDIGO DE CÁLCULO (SM-AAAA-NNNN) ───────────────────────────────
// Identificador propio de steel-measurement para vincular un cálculo con
// presupuestos de steelCRM (campo idsCalc allá — ver TAXONOMIA-COMPARTIDA.md
// §7, donde este formato reemplaza el "libre por ahora, sin acordar" anterior).
// Formato FIJO (a diferencia de nro, que sí es configurable por empresa) porque
// tiene que ser estable entre los dos proyectos. Contador anual propio.
export const newCodigoCalculo = () => {
  const anio = new Date().getFullYear();
  const key = `smeas_last_codigo_calculo_${anio}`;
  const next = Number(localStorage.getItem(key) || "0") + 1;
  localStorage.setItem(key, String(next));
  return `SM-${anio}-${String(next).padStart(4, "0")}`;
};

// ─── BLOQUES DEL PDF ─────────────────────────────────────────────────
// Qué secciones se imprimen y en qué orden (Sistema > Config). Si no hay
// nada guardado, abrirPDFPresupuesto usa BLOQUES_DEFAULT del generador.
export const loadBloquesPDF = () => loadLS("smeas_pdf_bloques", null);
export const saveBloquesPDF = (bloques) => saveLS("smeas_pdf_bloques", bloques);

export const newNroPresupuesto = () => {
  const cfg = loadNumeracion();
  const key = contadorKeyPres(cfg);
  const next = Number(localStorage.getItem(key) || "0") + 1;
  localStorage.setItem(key, String(next));
  return formatearNroPres(cfg, next);
};
