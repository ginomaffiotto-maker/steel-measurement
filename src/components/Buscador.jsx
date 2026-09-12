import { useState, useEffect } from "react";
import { C, BDG, BTN } from "../styles/colors";
import { supabase } from "../utils/supabaseClient";
import {
  loadLS, saveLS, buscarVinculosCRM,
  useMergeComputosNube, useMergeAnidadosNube, useMergePresupuestosNube, useMergeHistorialNube,
} from "../utils/storage";
import { FAMILIAS, TIPOS_TRABAJO, familiaDe } from "../utils/taxonomia";
import FiltrosBar from "./FiltrosBar";
import FichaSolicitudModal from "./FichaSolicitud";

const n2 = v => (Math.round((+v || 0) * 100) / 100).toFixed(2);

// Normaliza cada tipo de registro a una forma común para buscar/mostrar.
// Recibe las listas por parámetro (no las lee de localStorage directo) —
// mismo bug real que tenía Dashboard (2026-09-03): sin esto, Buscador
// mostraba 0 en Cómputos/Anidados/Presupuestos si era la primera pantalla
// visitada, porque el merge de Fase 5 sólo corría en las pantallas dueñas
// (Cómputo/Anidado/Presupuesto/Historial). Guarda `_raw` (el objeto
// original) en cada fila — lo usa `cadenaDe()` para trazar el recorrido
// Solicitud→Cómputo→Anidado→Presupuesto sin tener que volver a buscarlo
// (2026-09-12, a pedido de Gino).
function normalizar(computos, anidados, presupuestos, historial, solicitudes, usuarios) {
  const filas = [];
  solicitudes.forEach(s => filas.push({
    tipo: "solicitud", id: s.id, icon: "📥", label: "Solicitud",
    titulo: s.producto || s.obra || s.cliente_nombre || "Sin nombre", sub: `${s.cliente_nombre || "sin cliente"} · ${s.estado || ""}`, fecha: s.fecha_recepcion || "",
    texto: [s.producto, s.obra, s.cliente_nombre, s.empresa].join(" "),
    vendedor: usuarios.find(u => u.profileId === s.asignado_a)?.id || "", categoria: s.categoria || "", tipo_trabajo: s.tipo_trabajo || "",
    _raw: s,
  }));
  computos.filter(c => !c.eliminado).forEach(c => filas.push({
    tipo: "computo", id: c.id, icon: "📐", label: "Cómputo",
    titulo: c.nombre || "Sin nombre", sub: c.nro || "", fecha: c.fecha || "",
    texto: [c.nombre, c.nro].join(" "),
    vendedor: c.vendedor || "", categoria: c.categoria || "", tipo_trabajo: c.tipo_trabajo || "",
    _raw: c,
  }));
  anidados.filter(a => !a.eliminado).forEach(a => filas.push({
    tipo: "anidado", id: a.id, icon: "✂️", label: "Anidado",
    titulo: a.nombre || "Sin nombre", sub: `${(a.grupos||[]).length} grupos`, fecha: a.fecha || "",
    texto: [a.nombre].join(" "),
    vendedor: a.vendedor || "", categoria: a.categoria || "", tipo_trabajo: a.tipo_trabajo || "",
    _raw: a,
  }));
  presupuestos.filter(p => !p.eliminado).forEach(p => filas.push({
    tipo: "presupuesto", id: p.id, icon: "💰", label: "Presupuesto",
    titulo: p.nombre || "Sin nombre", sub: `${p.nro || ""} · ${p.cliente || "sin cliente"}`, fecha: p.fecha || "",
    texto: [p.nombre, p.nro, p.cliente, p.obra, p.detalle].join(" "),
    vendedor: p.vendedor || "", categoria: p.categoria || "", tipo_trabajo: p.tipo_trabajo || "",
    _raw: p,
  }));
  historial.filter(h => !h.eliminado).forEach(h => filas.push({
    tipo: "historial", id: h.id, icon: "📊", label: "Historial",
    titulo: h.cliente || h.nro_ot || "Sin cliente", sub: `${h.nro_ot || ""} · ${h.categoria || "sin categoría"} · $${n2(h.usd_total)}`, fecha: h.fecha || "",
    texto: [h.nro_ot, h.cliente, h.obra, h.categoria].join(" "),
    vendedor: h.vendedor || "", categoria: h.categoria || "", tipo_trabajo: h.tipo_trabajo || "",
    _raw: h,
  }));
  return filas;
}

// Trazabilidad del recorrido completo (2026-09-12, a pedido de Gino: "que
// se pueda trazar el recorrido y las solicitudes, cómputos, anidados o
// presupuestos asociados"). A partir de cualquier resultado, calcula qué
// otros registros de la cadena Solicitud→Cómputo(s)→Anidado(s)→
// Presupuesto(s) están relacionados — usando los vínculos reales que ya
// existen (`computos.solicitud_id`, `anidados.computo_id`,
// `items_presupuesto_sm.anidado_id` por ítem). Un presupuesto puede tener
// varios ítems de anidados distintos, y una solicitud puede tener varios
// cómputos — por eso todo se maneja como arrays, nunca "el primero".
function cadenaDe(fila, { computos, anidados, presupuestos, solicitudes }) {
  let solicitud = null, comps = [], anids = [], preses = [];
  if (fila.tipo === "solicitud") {
    solicitud = fila._raw;
    comps = computos.filter(c => c.solicitud_id === solicitud.id);
  } else if (fila.tipo === "computo") {
    comps = [fila._raw];
    if (fila._raw.solicitud_id) solicitud = solicitudes.find(s => s.id === fila._raw.solicitud_id) || null;
  } else if (fila.tipo === "anidado") {
    anids = [fila._raw];
    if (fila._raw.computo_id) {
      const c = computos.find(x => x.id === fila._raw.computo_id);
      if (c) { comps = [c]; if (c.solicitud_id) solicitud = solicitudes.find(s => s.id === c.solicitud_id) || null; }
    }
  } else if (fila.tipo === "presupuesto") {
    preses = [fila._raw];
    const anidadoIds = (fila._raw.items || []).map(it => it.anidado_id).filter(Boolean);
    anids = anidados.filter(a => anidadoIds.includes(a.id));
  }
  // Completa hacia abajo (solicitud → cómputos → anidados → presupuestos)
  // lo que no vino ya armado desde el tipo de partida.
  if (solicitud && fila.tipo !== "solicitud" && comps.length === 0) {
    comps = computos.filter(c => c.solicitud_id === solicitud.id);
  }
  if (comps.length && fila.tipo !== "anidado" && anids.length === 0) {
    const compIds = comps.map(c => c.id);
    anids = anidados.filter(a => compIds.includes(a.computo_id));
  }
  if (anids.length && fila.tipo !== "presupuesto" && preses.length === 0) {
    const anidIds = anids.map(a => a.id);
    preses = presupuestos.filter(p => (p.items || []).some(it => anidIds.includes(it.anidado_id)));
  }
  return { solicitud, comps, anids, preses };
}

const TAB_DESTINO = { computo: "Computo", anidado: "Anidado", presupuesto: "Presupuesto", historial: "Historial" };
const PEND_KEY = { computo: "smeas_ir_a_computo", anidado: "smeas_ir_a_anidado", presupuesto: "smeas_ir_a_presupuesto", historial: "smeas_ir_a_historial" };

const FILT_DEFAULTS = { texto: "", cliente: "", desde: "", hasta: "", familia: "", tipo: "", vendedor: "" };
function buscadorCampos(usuarios) {
  const campos = [
    { key: "texto", label: "Texto (nombre, N°, obra...)", type: "text", placeholder: "Buscar...", flex: "2 1 280px", minWidth: 280 },
    { key: "cliente", label: "Cliente", type: "text", placeholder: "Nombre del cliente", flex: "1 1 220px", minWidth: 220 },
    { key: "desde", label: "Desde", type: "date", flex: "1 1 180px", minWidth: 180 },
    { key: "hasta", label: "Hasta", type: "date", flex: "1 1 180px", minWidth: 180 },
    { key: "familia", label: "Familia", type: "select", options: Object.keys(FAMILIAS), flex: "1 1 170px", minWidth: 170 },
    { key: "tipo", label: "Tipo", type: "select", options: TIPOS_TRABAJO, flex: "1 1 140px", minWidth: 140 },
  ];
  if (usuarios.length > 0) campos.push({ key: "vendedor", label: "Vendedor", type: "select", options: usuarios.map(u => ({ value: u.id, label: u.nombre })), flex: "1 1 170px", minWidth: 170 });
  return campos;
}

export default function Buscador({ onIrA, usuarios = [] }) {
  const [filt, setFilt] = useState(FILT_DEFAULTS);
  const [abierto, setAbierto] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState("");
  // Fila expandida (trazabilidad, 2026-09-12) — clave `${tipo}_${id}`, o
  // null si ninguna está abierta. El click en la fila alterna esto en vez
  // de navegar directo (el botón "Abrir →" es el que navega ahora).
  const [expandido, setExpandido] = useState(null);
  const [verFichaSolicitud, setVerFichaSolicitud] = useState(null);
  // presupuesto_sm_id → vínculos con Steel CRM (2026-09-12) — cargado
  // on-demand solo cuando se expande una fila cuya cadena incluye
  // presupuestos, para no disparar N consultas de más en cada búsqueda.
  const [vinculosCRM, setVinculosCRM] = useState(new Map());

  // Mismo bug real que tenía Dashboard.jsx (2026-09-04): el merge de Fase 5
  // traía todo de la nube a estado de React pero nunca lo guardaba de vuelta
  // en localStorage — cada vez que se reabría el Buscador Global, arrancaba
  // de cero desde el localStorage viejo y volvía a pedir todo a la nube de
  // nuevo, en vez de partir de lo que ya se había traído la vez anterior.
  const [computos, setComputos] = useState(() => loadLS("smeas_computos", []));
  useMergeComputosNube(computos, setComputos, usuarios);
  useEffect(() => { saveLS("smeas_computos", computos); }, [computos]);
  const [anidados, setAnidados] = useState(() => loadLS("smeas_anidados", []));
  useMergeAnidadosNube(anidados, setAnidados, usuarios);
  useEffect(() => { saveLS("smeas_anidados", anidados); }, [anidados]);
  const [presupuestos, setPresupuestos] = useState(() => loadLS("smeas_presupuestos", []));
  useMergePresupuestosNube(presupuestos, setPresupuestos, usuarios);
  useEffect(() => { saveLS("smeas_presupuestos", presupuestos); }, [presupuestos]);
  const [historial, setHistorial] = useState(() => loadLS("smeas_historial", []));
  useMergeHistorialNube(setHistorial);
  useEffect(() => { saveLS("smeas_historial", historial); }, [historial]);

  // Solicitudes (2026-09-12): lectura directa de Steel CRM, mismo criterio
  // que "Mis solicitudes asignadas" — pero acá SIN filtrar por asignado_a,
  // para poder trazar cualquier solicitud del tenant, no solo las propias
  // (el SELECT de esa tabla ya está abierto a todo el tenant, verificado
  // en la migración 20260905180000_rls_propiedad_solicitudes.sql).
  const [solicitudes, setSolicitudes] = useState([]);
  useEffect(() => {
    if (!supabase) return;
    supabase.from("solicitudes").select("*").eq("eliminado", false)
      .then(({ data }) => setSolicitudes(data || []));
  }, []);

  const todas = normalizar(computos, anidados, presupuestos, historial, solicitudes, usuarios);
  const activo = filt.texto.trim() || filt.cliente.trim() || filt.desde || filt.hasta || filt.familia || filt.tipo || filt.vendedor || tipoFiltro;

  // Sin el filtro de tipo — así los badges muestran cuántos hay de cada uno
  // para los filtros de texto/cliente/fecha actuales, no solo del tipo ya
  // elegido (que siempre daría 0 en los demás).
  const porTexto = todas
    .filter(f => !filt.texto.trim() || f.texto.toLowerCase().includes(filt.texto.trim().toLowerCase()))
    .filter(f => !filt.cliente.trim() || f.texto.toLowerCase().includes(filt.cliente.trim().toLowerCase()))
    .filter(f => !filt.desde || (f.fecha && f.fecha >= filt.desde))
    .filter(f => !filt.hasta || (f.fecha && f.fecha <= filt.hasta))
    .filter(f => !filt.vendedor || String(f.vendedor) === filt.vendedor)
    .filter(f => !filt.tipo || f.tipo_trabajo === filt.tipo)
    .filter(f => !filt.familia || familiaDe(f.categoria) === filt.familia);

  const resultados = porTexto
    .filter(f => !tipoFiltro || f.tipo === tipoFiltro)
    .sort((a,b) => (b.fecha||"").localeCompare(a.fecha||""));

  // Solicitud no tiene pantalla propia en Steel Costos (vive en Steel
  // CRM) — "abrir" acá significa mostrar su ficha de solo lectura, no
  // navegar de tab.
  const ir = (fila) => {
    if (fila.tipo === "solicitud") { setVerFichaSolicitud(fila._raw); return; }
    saveLS(PEND_KEY[fila.tipo], fila.id);
    onIrA && onIrA(TAB_DESTINO[fila.tipo]);
  };

  const toggleExpandido = (fila) => {
    const key = `${fila.tipo}_${fila.id}`;
    if (expandido === key) { setExpandido(null); return; }
    setExpandido(key);
    const { preses } = cadenaDe(fila, { computos, anidados, presupuestos, solicitudes });
    preses.forEach(p => {
      if (vinculosCRM.has(p.id) || !supabase) return;
      buscarVinculosCRM(p.id).then(v => setVinculosCRM(prev => new Map(prev).set(p.id, v)));
    });
  };

  const conteos = { solicitud:0, computo:0, anidado:0, presupuesto:0, historial:0 };
  porTexto.forEach(f => conteos[f.tipo]++);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
        <span style={{ fontSize:20 }}>🔍</span>
        <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:C.text }}>Buscador Global</h2>
      </div>

      <div style={{ fontSize:12, color:C.muted, marginBottom:16, maxWidth:680 }}>
        Busca en Solicitudes, Cómputos, Anidados, Presupuestos e Historial a la vez, por texto,
        cliente (solo aplica a Presupuesto/Historial/Solicitud, que son los que tienen ese dato)
        y rango de fecha. Hacé clic en un resultado para ver su recorrido completo (de qué
        Solicitud salió, qué Cómputos/Anidados/Presupuestos generó) — "Abrir →" lleva directo a él.
      </div>

      <FiltrosBar campos={buscadorCampos(usuarios)} valores={filt} setValores={setFilt} defaults={FILT_DEFAULTS}
        abierto={abierto} setAbierto={setAbierto} />

      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <button onClick={()=>setTipoFiltro("")} style={{...BTN(tipoFiltro===""?"ok":"ghost"), padding:"7px 18px", fontSize:12}}>Todos ({todas.length})</button>
        <button onClick={()=>setTipoFiltro("solicitud")} style={{...BTN(tipoFiltro==="solicitud"?"ok":"ghost"), padding:"7px 18px", fontSize:12}}>📥 Solicitudes ({conteos.solicitud})</button>
        <button onClick={()=>setTipoFiltro("computo")} style={{...BTN(tipoFiltro==="computo"?"ok":"ghost"), padding:"7px 18px", fontSize:12}}>📐 Cómputos ({conteos.computo})</button>
        <button onClick={()=>setTipoFiltro("anidado")} style={{...BTN(tipoFiltro==="anidado"?"ok":"ghost"), padding:"7px 18px", fontSize:12}}>✂️ Anidados ({conteos.anidado})</button>
        <button onClick={()=>setTipoFiltro("presupuesto")} style={{...BTN(tipoFiltro==="presupuesto"?"ok":"ghost"), padding:"7px 18px", fontSize:12}}>💰 Presupuestos ({conteos.presupuesto})</button>
        <button onClick={()=>setTipoFiltro("historial")} style={{...BTN(tipoFiltro==="historial"?"ok":"ghost"), padding:"7px 18px", fontSize:12}}>📊 Historial ({conteos.historial})</button>
      </div>

      {!activo && (
        <div style={{ textAlign:"center", color:C.muted, padding:"40px 0", fontSize:13 }}>
          Escribí algo o elegí un tipo para buscar. Hay {todas.length} registros en total
          ({conteos.computo && `${todas.filter(f=>f.tipo==="computo").length} cómputos`}).
        </div>
      )}

      {activo && resultados.length === 0 && (
        <div style={{ textAlign:"center", color:C.muted, padding:"40px 0", fontSize:13 }}>Sin resultados.</div>
      )}

      {activo && resultados.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {resultados.map(f => {
            const key = `${f.tipo}_${f.id}`;
            const expandidoAca = expandido === key;
            const cadena = expandidoAca ? cadenaDe(f, { computos, anidados, presupuestos, solicitudes }) : null;
            return (
              <div key={key} style={{ background:C.card, border:`1px solid ${expandidoAca ? C.accent+"88" : C.border}`, borderRadius:8, overflow:"hidden" }}>
                <div onClick={()=>toggleExpandido(f)}
                  style={{ padding:"10px 14px", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}
                  onMouseEnter={e=>{ if (!expandidoAca) e.currentTarget.parentElement.style.borderColor=C.accent+"88"; }}
                  onMouseLeave={e=>{ if (!expandidoAca) e.currentTarget.parentElement.style.borderColor=C.border; }}>
                  <span style={{ fontSize:16 }}>{f.icon}</span>
                  <span style={BDG(C.muted,true)}>{f.label}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:13, color:C.text }}>{f.titulo}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{f.sub}</div>
                  </div>
                  <span style={{ fontSize:11, color:C.muted }}>{f.fecha}</span>
                  <button onClick={e=>{ e.stopPropagation(); ir(f); }}
                    style={{ ...BTN("ghost"), padding:"4px 12px", fontSize:11.5 }}>
                    {f.tipo === "solicitud" ? "👁 Ver ficha" : "Abrir →"}
                  </button>
                  <span style={{ color:C.muted, fontSize:12 }}>{expandidoAca ? "▾" : "▸"}</span>
                </div>

                {expandidoAca && (
                  <div style={{ padding:"4px 14px 14px", borderTop:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:11, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:.3, margin:"10px 0 8px" }}>
                      Recorrido relacionado
                    </div>
                    {!cadena.solicitud && !cadena.comps.length && !cadena.anids.length && !cadena.preses.length && (
                      <div style={{ fontSize:12.5, color:C.muted }}>Sin más vínculos conocidos todavía.</div>
                    )}
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {cadena.solicitud && (
                        <ChipGrupo label="📥 Solicitud">
                          <Chip icon="📥" texto={cadena.solicitud.producto || cadena.solicitud.obra || cadena.solicitud.cliente_nombre || "Solicitud"}
                            onClick={()=>setVerFichaSolicitud(cadena.solicitud)} />
                        </ChipGrupo>
                      )}
                      {cadena.comps.length > 0 && (
                        <ChipGrupo label={`📐 Cómputo${cadena.comps.length>1?"s":""}`}>
                          {cadena.comps.map(c => (
                            <Chip key={c.id} icon="📐" texto={`${c.nombre||"Sin nombre"} (${c.nro||""})`}
                              onClick={()=>ir({ tipo:"computo", id:c.id })} />
                          ))}
                        </ChipGrupo>
                      )}
                      {cadena.anids.length > 0 && (
                        <ChipGrupo label={`✂️ Anidado${cadena.anids.length>1?"s":""}`}>
                          {cadena.anids.map(a => (
                            <Chip key={a.id} icon="✂️" texto={a.nombre||"Sin nombre"}
                              onClick={()=>ir({ tipo:"anidado", id:a.id })} />
                          ))}
                        </ChipGrupo>
                      )}
                      {cadena.preses.length > 0 && (
                        <ChipGrupo label={`💰 Presupuesto${cadena.preses.length>1?"s":""}`}>
                          {cadena.preses.map(p => {
                            const vinc = vinculosCRM.get(p.id);
                            return (
                              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                                <Chip icon="💰" texto={`${p.nombre||"Sin nombre"} (${p.nro||""})`}
                                  onClick={()=>ir({ tipo:"presupuesto", id:p.id })} />
                                {vinc === undefined && <span style={{ fontSize:11, color:C.muted }}>· revisando vínculo con Steel CRM…</span>}
                                {Array.isArray(vinc) && vinc.length === 0 && <span style={{ fontSize:11, color:C.muted }}>· sin enviar a Steel CRM</span>}
                                {Array.isArray(vinc) && vinc.map(v => (
                                  <span key={v.crmId} style={{ fontSize:11, color:C.accent }}>· 🔗 Steel CRM: {v.nro || "s/n"}{v.estado ? ` (${v.estado})` : ""}</span>
                                ))}
                              </div>
                            );
                          })}
                        </ChipGrupo>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {verFichaSolicitud && <FichaSolicitudModal s={verFichaSolicitud} onClose={()=>setVerFichaSolicitud(null)} />}
    </div>
  );
}

function ChipGrupo({ label, children }) {
  return (
    <div>
      <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>{label}</div>
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>{children}</div>
    </div>
  );
}

function Chip({ icon, texto, onClick }) {
  return (
    <button onClick={onClick}
      style={{ display:"inline-flex", alignItems:"center", gap:6, alignSelf:"flex-start",
        background:C.iron, border:`1px solid ${C.border}`, borderRadius:6, padding:"5px 10px",
        fontSize:12.5, color:C.text, cursor:"pointer", textAlign:"left" }}
      onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent+"88"}
      onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
      <span>{icon}</span>{texto}<span style={{ color:C.accent, marginLeft:4 }}>→</span>
    </button>
  );
}
