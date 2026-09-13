import { useState, useEffect } from "react";
import { C, INP, LBL, TH, TD, CARD, BTN, BDG } from "../styles/colors";
import { supabase } from "../utils/supabaseClient";
import { useSortable } from "../utils/useSortable";
import { TIPOS_TRABAJO, SelectCategoria } from "../utils/taxonomia";
import FichaSolicitudModal, { ESTADO_SOLICITUD_COLOR as ESTADO_COLOR, PRIORIDAD_ICONO } from "./FichaSolicitud";

// Lee directo de la tabla `solicitudes` de steelCRM — mismo backend
// compartido, sin exportar/importar ningún archivo. Filtra por
// asignado_a = profileId del usuario logueado acá (misma cuenta de
// Supabase Auth en los dos sistemas). Solo alcanza a solicitudes de
// usuarios que ya tienen cuenta real — mismo bloqueo de siempre
// (meta_usuarios, vendedor_id) hasta que el resto del equipo la tenga.

// Alta directa de Solicitud, sin pasar por Steel CRM (2026-09-12, a pedido
// de Gino) — pensado para un cliente que compra SOLO Steel Costos y hace
// el proceso comercial con otra herramienta (o directo por correo/WhatsApp):
// necesita una bandeja de entrada real sin depender del CRM. Reusa la
// misma tabla compartida `solicitudes` (sin duplicar esquema) con un
// formulario liviano — a diferencia de Solicitudes.jsx (CRM), sin motivo
// de pérdida ni prioridad automática (dependen de historial de
// presupuestos que este componente no trae). Campos de dueño (estado
// "recibida", asignado_a/creado_por = quien la crea) se completan solos.
function NuevaSolicitudModal({ usuario, onClose, onCreated }) {
  const [f, setF] = useState({ cliente_nombre: "", empresa: "", obra: "", categoria: "", tipo_trabajo: "Fabricación", mensaje_cliente: "", fecha_limite: "", link_archivos: "" });
  const [guardando, setGuardando] = useState(false);
  const [errCliente, setErrCliente] = useState(false);
  const [err, setErr] = useState("");
  const set = (k, v) => setF(x => ({ ...x, [k]: v }));
  const guardar = async () => {
    const faltaCliente = !f.cliente_nombre.trim();
    setErrCliente(faltaCliente);
    if (faltaCliente) return;
    setGuardando(true); setErr("");
    const { data, error } = await supabase.from("solicitudes").insert({
      cliente_nombre: f.cliente_nombre.trim(),
      empresa: f.empresa.trim() || null,
      obra: f.obra.trim() || null,
      categoria: f.categoria || null,
      tipo_trabajo: f.tipo_trabajo || null,
      mensaje_cliente: f.mensaje_cliente.trim() || null,
      fecha_recepcion: new Date().toISOString().slice(0, 10),
      fecha_limite: f.fecha_limite || null,
      link_archivos: f.link_archivos.trim() || null,
      estado: "recibida", asignado_a: usuario.profileId, creado_por: usuario.profileId, eliminado: false,
    }).select().single();
    setGuardando(false);
    if (error) { setErr("No se pudo guardar: " + error.message); return; }
    onCreated(data);
  };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3500, background: "#000a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={onClose}>
      <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 24, width: "100%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ color: C.accent, fontWeight: 800, fontSize: 15 }}>📥 Nueva solicitud</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        <label style={LBL}>Cliente *</label>
        <input style={{ ...INP, marginBottom: errCliente ? 4 : 10, ...(errCliente ? { border: "1px solid " + C.err } : {}) }}
          value={f.cliente_nombre} autoFocus placeholder="Nombre del contacto"
          onChange={e => { set("cliente_nombre", e.target.value); if (e.target.value.trim()) setErrCliente(false); }} />
        {errCliente && <div style={{ fontSize: 11, color: C.err, fontWeight: 500, marginBottom: 10 }}>⚠ Indicá el Cliente</div>}
        <label style={LBL}>Empresa</label>
        <input style={{ ...INP, marginBottom: 10 }} value={f.empresa} placeholder="Razón social" onChange={e => set("empresa", e.target.value)} />
        <label style={LBL}>Obra</label>
        <input style={{ ...INP, marginBottom: 10 }} value={f.obra} placeholder="Ej: Nave Industrial" onChange={e => set("obra", e.target.value)} />
        <label style={LBL}>Categoría</label>
        <SelectCategoria value={f.categoria} onChange={v => set("categoria", v)} style={{ marginBottom: 10 }} />
        <label style={LBL}>Tipo de trabajo</label>
        <select style={{ ...INP, marginBottom: 10 }} value={f.tipo_trabajo} onChange={e => set("tipo_trabajo", e.target.value)}>
          {TIPOS_TRABAJO.map(t => <option key={t}>{t}</option>)}
        </select>
        <label style={LBL}>Mensaje del cliente / notas</label>
        <textarea style={{ ...INP, marginBottom: 10, minHeight: 70 }} value={f.mensaje_cliente}
          placeholder="Pegá acá el mail, WhatsApp, o el pedido tal cual llegó..." onChange={e => set("mensaje_cliente", e.target.value)} />
        <label style={LBL}>Fecha límite</label>
        <input type="date" style={{ ...INP, marginBottom: 10 }} value={f.fecha_limite} onChange={e => set("fecha_limite", e.target.value)} />
        <label style={LBL}>Link de archivos (Drive, Dropbox, etc.)</label>
        <input style={{ ...INP, marginBottom: 14 }} value={f.link_archivos} placeholder="https://..." onChange={e => set("link_archivos", e.target.value)} />
        {err && <div style={{ fontSize: 12, color: C.err, marginBottom: 10 }}>{err}</div>}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={guardar} disabled={guardando} style={{ ...BTN("ok"), flex: 1, opacity: guardando ? 0.6 : 1 }}>{guardando ? "Guardando…" : "Crear"}</button>
          <button onClick={onClose} style={{ ...BTN("ghost"), flex: 1 }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default function SolicitudesAsignadas({ usuario, irATab }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [verFicha, setVerFicha] = useState(null);
  // solicitud_id → cantidad de cómputos vinculados (2026-09-05, extendido
  // 2026-09-12) — para avisar antes de crear otro por error, sin bloquear
  // (puede haber un caso real para un segundo cómputo). Guarda la
  // CANTIDAD, no un id puntual: "ver cómputo(s)" navega a la lista de
  // Cómputo filtrada por esta solicitud, nunca abre uno directo, porque
  // puede haber varios vinculados a la misma (reportado por Gino,
  // 2026-09-12 — antes se guardaba solo el primero y los demás quedaban
  // invisibles desde acá).
  const [conComputo, setConComputo] = useState(new Map());
  const [nuevaSolicitud, setNuevaSolicitud] = useState(false);

  useEffect(() => {
    if (!supabase || !usuario?.profileId) { setCargando(false); return; }
    setCargando(true);
    supabase.from("solicitudes").select("*")
      .eq("asignado_a", usuario.profileId)
      .eq("eliminado", false)
      .not("estado", "in", '("ganada","perdida","no cotizado")')
      .then(({ data, error: err }) => {
        if (err) { setError(err.message); setCargando(false); return; }
        setSolicitudes(data || []);
        setError("");
        setCargando(false);
        const ids = (data || []).map(s => s.id);
        if (ids.length) {
          supabase.from("computos").select("id, solicitud_id").in("solicitud_id", ids).eq("eliminado", false)
            .then(({ data: cs }) => {
              const m = new Map();
              (cs || []).forEach(c => m.set(c.solicitud_id, (m.get(c.solicitud_id) || 0) + 1));
              setConComputo(m);
            });
        }
      });
  }, [usuario?.profileId]);

  // El número de "sin cómputo" del menú lateral se calcula aparte, en
  // App.js — antes se calculaba acá y se subía por prop, pero este
  // componente solo existe montado cuando la pestaña está activa, así que
  // el número quedaba en 0 hasta la primera visita (bug real reportado por
  // Gino, 2026-09-06).

  // Deja un payload chico para que Computo.jsx lo levante al montar y abra
  // el formulario de "nuevo" precargado — mismo criterio liviano que el
  // resto de la navegación cruzada de esta app (onNidar/onExportarPresupuesto
  // solo cambian de tab), sin lifetear estado nuevo a App.js.
  //
  // 2026-09-05, bug real reportado por Gino: `solicitudes` (Steel CRM)
  // nunca guardaba `producto` ni `empresa` en Supabase (columnas
  // agregadas recién ahora) — sin esos dos campos acá, no había nombre
  // real para el cómputo ni forma de traer la Obra sin pisarla, así que
  // se usaba la Obra como nombre y la Obra real quedaba vacía. Ahora:
  // Producto → nombre (el campo sigue editable a mano después — una
  // misma Solicitud puede pedir cosas de tipo distinto y Gino puede
  // querer un cómputo/presupuesto separado para cada una).
  function crearComputoDesde(s) {
    try {
      sessionStorage.setItem("smeas_prefill_computo", JSON.stringify({
        nombre: s.producto || s.obra || s.cliente_nombre || "Solicitud",
        cliente: s.cliente_nombre || "",
        empresa: s.empresa || "",
        obra: s.obra || "",
        categoria: s.categoria || "",
        solicitudId: s.id,
        // Fase 3 (2026-09-06, enlace a carpeta de archivos): mismo criterio
        // que categoria/obra — se copia una sola vez al crear, no es un
        // vínculo en vivo con la Solicitud.
        linkArchivos: s.link_archivos || "",
      }));
    } catch {}
    irATab("Computo");
  }

  // "Se puede pasar a cualquier etapa" (2026-09-12, a pedido de Gino) —
  // mismo criterio de precarga liviana que crearComputoDesde, pero
  // saltando directo a Anidado o Presupuesto. `solicitud_id` viaja en los
  // dos para no perder la trazabilidad (ver migración
  // 20260912120000_solicitud_id_anidados_presupuestos_sm.sql).
  function crearAnidadoDesde(s) {
    try {
      sessionStorage.setItem("smeas_prefill_anidado", JSON.stringify({
        nombre: s.producto || s.obra || s.cliente_nombre || "Solicitud",
        cliente: s.cliente_nombre || "", empresa: s.empresa || "", obra: s.obra || "",
        categoria: s.categoria || "", tipoTrabajo: s.tipo_trabajo || "",
        linkArchivos: s.link_archivos || "", solicitudId: s.id,
      }));
    } catch {}
    irATab("Anidado");
  }

  // Presupuesto invierte los nombres respecto a Solicitud/Anidado: acá
  // "cliente" es la razón social y "contacto" es la persona — mismo
  // mapeo que ya usa el resto de la app (ver "Pasar a Presupuesto" en
  // Anidado.jsx).
  function crearPresupuestoDesde(s) {
    try {
      sessionStorage.setItem("smeas_prefill_presupuesto", JSON.stringify({
        nombre: s.producto || s.obra || s.cliente_nombre || "Solicitud",
        cliente: s.empresa || "", contacto: s.cliente_nombre || "", obra: s.obra || "",
        categoria: s.categoria || "", tipo_trabajo: s.tipo_trabajo || "Fabricación",
        link_archivos: s.link_archivos || "", solicitud_id: s.id,
      }));
    } catch {}
    irATab("Presupuesto");
  }

  // Lleva a la pantalla de Cómputo filtrada por esta solicitud (evita
  // crear un cómputo de más por error) — nunca abre uno puntual, porque
  // puede haber varios vinculados a la misma solicitud (bug real
  // reportado por Gino, 2026-09-12: antes se guardaba y abría solo el
  // primero encontrado, los demás quedaban invisibles desde acá). Mismo
  // criterio liviano de sessionStorage que el resto de esta pantalla,
  // consumido una sola vez al montar Computo.jsx.
  function verComputosDeSolicitud(s) {
    try {
      sessionStorage.setItem("smeas_filtrar_computos_solicitud", JSON.stringify({
        id: s.id,
        label: s.obra || s.cliente_nombre || s.producto || "esta solicitud",
      }));
    } catch {}
    irATab("Computo");
  }

  // 2026-09-03, a pedido de Gino: mismo patrón de ordenamiento por columna
  // (clic en header, asc/desc) que ya tienen Cómputo/Anidado/Presupuesto/Historial.
  const { ordenados: lista, campo: sortCampo, dir: sortDir, ordenarPor } = useSortable(solicitudes, "fecha_limite", "asc");

  if (!usuario?.profileId) {
    return (
      <div style={CARD()}>
        <div style={{ color: C.muted, fontSize: 13 }}>
          Esta cuenta todavía no tiene un perfil real vinculado — las solicitudes asignadas necesitan eso para poder mostrarse acá.
        </div>
      </div>
    );
  }

  return (
    <div>
      {verFicha && <FichaSolicitudModal s={verFicha} onClose={() => setVerFicha(null)} />}
      {nuevaSolicitud && (
        <NuevaSolicitudModal usuario={usuario} onClose={() => setNuevaSolicitud(false)}
          onCreated={s => { setSolicitudes(prev => [s, ...prev]); setNuevaSolicitud(false); }} />
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 20, color: C.text }}>📥 Mis solicitudes asignadas</div>
        <button onClick={() => setNuevaSolicitud(true)} style={{ ...BTN("primary"), fontSize: 12 }}>+ Nueva solicitud</button>
      </div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>
        Cargadas y asignadas desde Steel CRM, o creadas directo acá — mismo backend, sin pasos manuales.
      </div>

      {cargando && <div style={{ color: C.muted, fontSize: 13 }}>Cargando…</div>}
      {error && <div style={{ color: C.err, fontSize: 13 }}>Error al leer solicitudes: {error}</div>}

      {!cargando && !error && solicitudes.length === 0 && (
        <div style={CARD()}>
          <div style={{ color: C.muted, fontSize: 13 }}>No tenés solicitudes asignadas en este momento.</div>
        </div>
      )}

      {!cargando && solicitudes.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
              <tr>
                {[
                  { h: "Prioridad", campo: "prioridad_manual", w: 100 }, { h: "Cliente", campo: "cliente_nombre", w: 160 }, { h: "Obra", campo: "obra", w: 180 },
                  { h: "Tipo", campo: "tipo_trabajo", w: 100 }, { h: "Categoría", campo: "categoria", w: 140 },
                  { h: "Recepción", campo: "fecha_recepcion", w: 100 }, { h: "Estado", campo: "estado", w: 110 },
                  { h: "Fecha límite", campo: "fecha_limite", w: 100 }, { h: "", campo: null, w: 260 },
                ].map(({ h, campo, w }) => (
                  <th key={h} title={campo ? "Ordenar por " + h : ""} style={{ ...TH, width: w, cursor: campo ? "pointer" : "default", userSelect: "none" }}
                    onClick={() => campo && ordenarPor(campo)}>
                    {h}{sortCampo === campo && campo ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lista.map(s => (
                <tr key={s.id} onClick={() => setVerFicha(s)} style={{ cursor: "pointer" }}
                  title="Ver ficha de la solicitud">
                  <td style={TD}>{PRIORIDAD_ICONO[s.prioridad_manual] ? `${PRIORIDAD_ICONO[s.prioridad_manual]} ${s.prioridad_manual[0].toUpperCase()}${s.prioridad_manual.slice(1)}` : "—"}</td>
                  <td style={TD}>{s.cliente_nombre || "—"}</td>
                  <td style={TD}>{s.obra || "—"}</td>
                  <td style={TD}>{s.tipo_trabajo || "—"}</td>
                  <td style={TD}>{s.categoria || "—"}</td>
                  <td style={TD}>{s.fecha_recepcion || "—"}</td>
                  <td style={TD}><span style={{ ...BDG(ESTADO_COLOR[s.estado] || C.muted, true) }}>{s.estado}</span></td>
                  <td style={TD}>{s.fecha_limite || "—"}</td>
                  <td onClick={e => e.stopPropagation()} style={{ ...TD, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, flexWrap: "nowrap" }}>
                    {conComputo.has(s.id) && (
                      <button onClick={() => verComputosDeSolicitud(s)} style={{ ...BDG(C.ok, true), fontSize: 11, cursor: "pointer", border: "none", whiteSpace: "nowrap" }} title="Ver el/los cómputo(s) ya vinculados a esta solicitud">
                        ✅ Ver cómputo{conComputo.get(s.id) > 1 ? `s (${conComputo.get(s.id)})` : ""}
                      </button>
                    )}
                    {/* "Se puede pasar a cualquier etapa" (2026-09-12) — antes solo
                        había "Crear cómputo". Select nativo en vez de un menú
                        propio: mismo patrón ya usado en el resto de esta app para
                        no manejar clicks-fuera a mano. */}
                    <select value="" onChange={e => {
                      const v = e.target.value;
                      if (v === "computo") crearComputoDesde(s);
                      else if (v === "anidado") crearAnidadoDesde(s);
                      else if (v === "presupuesto") crearPresupuestoDesde(s);
                    }} style={{ ...BTN("primary"), whiteSpace: "nowrap", cursor: "pointer" }}>
                      <option value="" disabled>+ Crear…</option>
                      <option value="computo">📐 Cómputo</option>
                      <option value="anidado">✂️ Anidado</option>
                      <option value="presupuesto">💰 Presupuesto</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
