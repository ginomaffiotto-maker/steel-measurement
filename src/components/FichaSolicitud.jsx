import { useState } from "react";
import { C, INP, LBL, BTN, BDG } from "../styles/colors";
import { supabase } from "../utils/supabaseClient";
import { TIPOS_TRABAJO, SelectCategoria } from "../utils/taxonomia";
import { useListaClientes, useListaObras, useListaEmpresas } from "../utils/storage";
import AutocompleteCliente from "./AutocompleteCliente";
import AutocompleteEmpresa from "./AutocompleteEmpresa";
import AutocompleteObra from "./AutocompleteObra";
import ClienteRapidoModal from "./ClienteRapidoModal";
import ObraRapidaModal from "./ObraRapidaModal";
import EmpresaRapidaModal from "./EmpresaRapidaModal";

// Colores/íconos de Solicitud, compartidos entre SolicitudesAsignadas.jsx y
// Buscador.jsx (2026-09-12) — antes vivían duplicados solo en el primero.
export const ESTADO_SOLICITUD_COLOR = { recibida: C.info, "en elaboración": C.warn, enviada: C.pur, ganada: C.ok, perdida: C.err, "no cotizado": C.muted };
export const PRIORIDAD_ICONO = { alta: "🔴", media: "🟡", baja: "🟢" };
const ESTADOS_SOLICITUD = ["recibida", "en elaboración", "enviada", "ganada", "perdida", "no cotizado"];

// Ficha de Solicitud — dual mode (2026-09-14, a pedido de Gino: "que
// funcione como la de CRM, sin necesidad de verse igual ni tener la misma
// cantidad de datos"). Reemplaza a la ficha de solo lectura + el modal de
// alta separado que había hasta ahora — ahora es un solo componente que
// ve/crea/edita.
//
// Solo lectura (compatibilidad con el Buscador Global, que muestra
// solicitudes de TODO el tenant, no solo las propias) cuando no se pasa
// `usuario` — mismo comportamiento de siempre para ese caso, sin tocarlo.
//
// Editable cuando se pasa `usuario` (uso real: "Mis solicitudes
// asignadas"). A diferencia de Solicitudes.jsx en Steel CRM, deja afuera a
// propósito: motivo de pérdida, prioridad automática (score 0-100, depende
// de historial de cliente/presupuestos que este componente no trae) y el
// candado de estado con "↩️ Reabrir" (acá no hay un pipeline comercial que
// proteger de saltos accidentales) — el resto (campos vinculados de verdad
// con alta rápida, categoría/cliente obligatorios al crear, candado de
// dueño visible) sí se replica, porque mejora calidad de dato igual que en
// CRM.
//
// `children` opcional: usado por el Buscador Global para insertar la
// cadena de trazabilidad (Cómputos/Anidados/Presupuestos relacionados)
// debajo de los datos propios de la solicitud, sin que este componente
// necesite saber nada de esas otras entidades.
export default function FichaSolicitudModal({ s, usuario, onClose, onSaved, onCreated, children }) {
  const esNueva = !s;
  const editable = !!usuario;

  const [f, setF] = useState(() => ({
    cliente_nombre: s?.cliente_nombre || "", empresa: s?.empresa || "", obra: s?.obra || "",
    producto: s?.producto || "", direccion_obra: s?.direccion_obra || "", contacto: s?.contacto || "",
    tel: s?.tel || "", email: s?.email || "", categoria: s?.categoria || "",
    tipo_trabajo: s?.tipo_trabajo || "Fabricación", estado_obra: s?.estado_obra || "",
    estado: s?.estado || "recibida", prioridad_manual: s?.prioridad_manual || "",
    fecha_limite: s?.fecha_limite || "", mensaje_cliente: s?.mensaje_cliente || "", notas: s?.notas || "",
    link_archivos: s?.link_archivos || "",
  }));
  const set = (k, v) => setF(x => ({ ...x, [k]: v }));

  const [guardando, setGuardando] = useState(false);
  const [err, setErr] = useState("");
  const [errCliente, setErrCliente] = useState(false);
  const [errCategoria, setErrCategoria] = useState(false);

  // Mismo patrón que Cómputo/Anidado/Presupuesto (2026-08-29): Cliente/
  // Obra/Empresa dejan de ser texto libre — si lo tipeado no matchea nada
  // ya cargado, ofrece crear la ficha real antes de poder guardar.
  const listaClientes = useListaClientes();
  const listaObras = useListaObras();
  const listaEmpresas = useListaEmpresas();
  const clienteTexto = (f.cliente_nombre || "").trim();
  const clienteSinResolver = editable && clienteTexto && !listaClientes.some(n => n.toLowerCase() === clienteTexto.toLowerCase());
  const obraTexto = (f.obra || "").trim();
  const obraSinResolver = editable && obraTexto && !listaObras.some(o => (o.nombre || "").trim().toLowerCase() === obraTexto.toLowerCase());
  const empresaTexto = (f.empresa || "").trim();
  const empresaSinResolver = editable && empresaTexto && !listaEmpresas.some(e => (e.nombre || "").trim().toLowerCase() === empresaTexto.toLowerCase());
  const [showClienteRapido, setShowClienteRapido] = useState(false);
  const [showObraRapida, setShowObraRapida] = useState(false);
  const [showEmpresaRapida, setShowEmpresaRapida] = useState(false);

  // Candado de dueño (mismo criterio que Cómputo/Anidado/Presupuesto,
  // 2026-09-03): visible en la práctica solo si esta ficha se abre desde
  // un lugar que no filtra ya por dueño — hoy "Mis solicitudes asignadas"
  // solo trae las propias, así que esto es una protección de más, no algo
  // que dispare seguido.
  const esDeOtro = editable && !esNueva && usuario?.rol === "vendedor" && s.asignado_a && String(s.asignado_a) !== String(usuario.profileId);

  // Candado por campo (2026-09-15, a pedido de Gino: "que funcione como
  // la de CRM" — un campo ya cargado necesita habilitarse a mano para
  // tocarlo; uno vacío se completa directo, sin desbloquear nada). El
  // Estado queda afuera de este candado a propósito — no es "un dato que
  // se completa una vez", es el driver del flujo, se mueve libremente
  // mientras la solicitud esté abierta.
  const [desbloqueados, setDesbloqueados] = useState(() => new Set());
  const desbloquear = (campo) => setDesbloqueados(prev => new Set(prev).add(campo));
  // Congelado total si la solicitud ya está cerrada (ganada/perdida/no
  // cotizado) — ni desbloqueando se puede tocar nada, mismo criterio que
  // "no se puede cambiar ninguno después de aceptado o rechazado".
  const cerrada = !esNueva && ["ganada", "perdida", "no cotizado"].includes(s?.estado);

  function Bloqueable({ campo, label, children }) {
    const lleno = !esNueva && s && s[campo] != null && s[campo] !== "";
    const bloqueado = lleno && !desbloqueados.has(campo);
    if (bloqueado) {
      return (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={LBL}>{label}</label>
            <button type="button" onClick={() => desbloquear(campo)}
              style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
              🔓 Editar
            </button>
          </div>
          <div style={{ ...INP, background: "transparent", border: `1px solid ${C.border}55`, color: s[campo] ? C.text : C.muted }}>
            {String(s[campo])}
          </div>
        </div>
      );
    }
    return <div style={{ marginBottom: 10 }}><label style={LBL}>{label}</label>{children}</div>;
  }

  async function guardar() {
    const faltaCliente = !clienteTexto;
    const faltaCategoria = !f.categoria;
    setErrCliente(faltaCliente);
    setErrCategoria(faltaCategoria);
    if (faltaCliente || faltaCategoria) return;
    if (clienteSinResolver) { setErr(`El cliente "${clienteTexto}" no existe todavía — creálo con "+ Crear cliente nuevo" antes de guardar.`); return; }
    if (obraSinResolver) { setErr(`La obra "${obraTexto}" no existe todavía — creála con "+ Crear obra nueva" antes de guardar.`); return; }
    if (empresaSinResolver) { setErr(`La empresa "${empresaTexto}" no existe todavía — creála con "+ Crear empresa nueva" antes de guardar.`); return; }
    setGuardando(true); setErr("");
    const row = {
      cliente_nombre: clienteTexto, empresa: empresaTexto || null, obra: obraTexto || null,
      producto: f.producto.trim() || null, direccion_obra: f.direccion_obra.trim() || null,
      contacto: f.contacto.trim() || null, tel: f.tel.trim() || null, email: f.email.trim() || null,
      categoria: f.categoria, tipo_trabajo: f.tipo_trabajo || null, estado_obra: f.estado_obra || null,
      estado: f.estado, prioridad_manual: f.prioridad_manual || null,
      fecha_limite: f.fecha_limite || null, mensaje_cliente: f.mensaje_cliente.trim() || null,
      notas: f.notas.trim() || null, link_archivos: f.link_archivos.trim() || null,
    };
    let q;
    if (esNueva) {
      row.fecha_recepcion = new Date().toISOString().slice(0, 10);
      row.asignado_a = usuario.profileId;
      row.creado_por = usuario.nombre || "";
      row.eliminado = false;
      q = supabase.from("solicitudes").insert(row);
    } else {
      q = supabase.from("solicitudes").update(row).eq("id", s.id);
    }
    const { data, error } = await q.select().single();
    setGuardando(false);
    if (error) { setErr("No se pudo guardar: " + error.message); return; }
    if (esNueva) onCreated?.(data); else onSaved?.(data);
    onClose();
  }

  const campo = (label, valor) => valor ? (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.3 }}>{label}</div>
      <div style={{ fontSize: 13.5, color: C.text }}>{valor}</div>
    </div>
  ) : null;

  // ── MODO SOLO LECTURA (Buscador Global) — sin cambios de comportamiento ──
  if (!editable) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 3500, background: "#000a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
        onClick={onClose}>
        <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 24, width: "100%", maxWidth: 560, maxHeight: "85vh", overflowY: "auto" }}
          onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ color: C.accent, fontWeight: 800, fontSize: 16 }}>📥 {s.producto || s.obra || "Solicitud"}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.cliente_nombre || "Sin cliente"}{s.empresa ? ` — ${s.empresa}` : ""}</div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>✕</button>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <span style={BDG(ESTADO_SOLICITUD_COLOR[s.estado] || C.muted, true)}>{s.estado}</span>
            {s.prioridad_manual && <span style={BDG(C.muted, true)}>{PRIORIDAD_ICONO[s.prioridad_manual]} Prioridad {s.prioridad_manual}</span>}
            {s.categoria && <span style={BDG(C.muted, true)}>{s.categoria}</span>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            {campo("Obra", s.obra)}
            {campo("Dirección de obra", s.direccion_obra)}
            {campo("Contacto", s.contacto)}
            {campo("Teléfono", s.tel)}
            {campo("Email", s.email)}
            {campo("Tipo de trabajo", s.tipo_trabajo)}
            {campo("Estado de obra", s.estado_obra)}
            {campo("Fecha de recepción", s.fecha_recepcion)}
            {campo("Fecha límite", s.fecha_limite)}
            {campo("Fecha de envío", s.fecha_envio)}
            {campo("Fecha de resolución", s.fecha_resolucion)}
          </div>

          {s.mensaje_cliente && (
            <div style={{ marginTop: 6, marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 4 }}>Mensaje del cliente</div>
              <div style={{ fontSize: 13, color: C.text, background: C.iron, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", whiteSpace: "pre-wrap" }}>{s.mensaje_cliente}</div>
            </div>
          )}

          {s.notas && (
            <div style={{ marginTop: 6, marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 4 }}>Notas</div>
              <div style={{ fontSize: 13, color: C.text, whiteSpace: "pre-wrap" }}>{s.notas}</div>
            </div>
          )}

          {s.link_archivos && (
            <a href={s.link_archivos} target="_blank" rel="noreferrer"
              style={{ ...BTN("ghost"), display: "inline-block", marginTop: 10, textDecoration: "none" }}>📎 Abrir carpeta de archivos</a>
          )}

          {children}
        </div>
      </div>
    );
  }

  // ── MODO EDITABLE (crear / editar, "Mis solicitudes asignadas") ──
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3500, background: "#000a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={onClose}>
      <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 24, width: "100%", maxWidth: 560, maxHeight: "85vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>
        {showClienteRapido && (
          <ClienteRapidoModal nombreInicial={clienteTexto} empresaInicial={f.empresa}
            onClose={() => setShowClienteRapido(false)}
            onCreated={c => setF(x => ({ ...x, cliente_nombre: c.nombre, empresa: c.empresa || x.empresa }))} />
        )}
        {showObraRapida && (
          <ObraRapidaModal nombreInicial={obraTexto} empresaInicial={f.empresa}
            onClose={() => setShowObraRapida(false)}
            onCreated={o => setF(x => ({ ...x, obra: o.nombre }))} />
        )}
        {showEmpresaRapida && (
          <EmpresaRapidaModal nombreInicial={empresaTexto}
            onClose={() => setShowEmpresaRapida(false)}
            onCreated={e => setF(x => ({ ...x, empresa: e.nombre }))} />
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ color: C.accent, fontWeight: 800, fontSize: 15 }}>📥 {esNueva ? "Nueva solicitud" : "Solicitud"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>

        {esDeOtro && (
          <div style={{ background: C.warn + "15", border: `1px solid ${C.warn}44`, borderRadius: 8, padding: "8px 14px", marginBottom: 14, fontSize: 13, color: C.warn }}>
            🔒 Esta solicitud es de otro vendedor — solo la podés ver.
          </div>
        )}
        {cerrada && (
          <div style={{ background: C.muted + "15", border: `1px solid ${C.muted}44`, borderRadius: 8, padding: "8px 14px", marginBottom: 14, fontSize: 13, color: C.text }}>
            🔒 Solicitud {s.estado} — queda congelada, no se puede editar ningún campo.
          </div>
        )}
        {!esNueva && <div style={{ marginBottom: 14 }}><span style={BDG(ESTADO_SOLICITUD_COLOR[s.estado] || C.muted, true)}>{s.estado}</span></div>}

        <fieldset disabled={esDeOtro || cerrada} style={{ border: "none", margin: 0, padding: 0 }}>
          <Bloqueable campo="cliente_nombre" label="Cliente *">
            <AutocompleteCliente placeholder="Ej: Juan Pérez" value={f.cliente_nombre} autoFocus={esNueva}
              onChange={v => { set("cliente_nombre", v); if (v.trim()) setErrCliente(false); }}
              style={{ ...INP, marginBottom: (clienteSinResolver || errCliente) ? 4 : 10, ...(errCliente ? { border: "1px solid " + C.err } : {}) }} />
            {errCliente && !clienteSinResolver && <div style={{ fontSize: 11, color: C.err, fontWeight: 500, marginBottom: 10 }}>⚠ Indicá el Cliente</div>}
            {clienteSinResolver && (
              <div style={{ fontSize: 11, color: C.warn, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                ⚠️ Este cliente no existe todavía
                <button type="button" onClick={() => setShowClienteRapido(true)} style={{ background: "none", border: `1px solid ${C.warn}55`, color: C.warn, borderRadius: 5, padding: "1px 8px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>+ Crear cliente nuevo</button>
              </div>
            )}
          </Bloqueable>

          <Bloqueable campo="empresa" label="Empresa">
            <AutocompleteEmpresa placeholder="Ej: CCFC" value={f.empresa} onChange={v => set("empresa", v)}
              style={{ ...INP, marginBottom: empresaSinResolver ? 4 : 10 }} />
            {empresaSinResolver && (
              <div style={{ fontSize: 11, color: C.warn, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                ⚠️ Esta empresa no existe todavía
                <button type="button" onClick={() => setShowEmpresaRapida(true)} style={{ background: "none", border: `1px solid ${C.warn}55`, color: C.warn, borderRadius: 5, padding: "1px 8px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>+ Crear empresa nueva</button>
              </div>
            )}
          </Bloqueable>

          <Bloqueable campo="obra" label="Obra">
            <AutocompleteObra placeholder="Ej: Nave Industrial" value={f.obra} onChange={v => set("obra", v)}
              style={{ ...INP, marginBottom: obraSinResolver ? 4 : 10 }} />
            {obraSinResolver && (
              <div style={{ fontSize: 11, color: C.warn, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                ⚠️ Esta obra no existe todavía
                <button type="button" onClick={() => setShowObraRapida(true)} style={{ background: "none", border: `1px solid ${C.warn}55`, color: C.warn, borderRadius: 5, padding: "1px 8px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>+ Crear obra nueva</button>
              </div>
            )}
          </Bloqueable>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Bloqueable campo="producto" label="Producto"><input style={{ ...INP, marginBottom: 10 }} value={f.producto} onChange={e => set("producto", e.target.value)} /></Bloqueable>
            <Bloqueable campo="direccion_obra" label="Dirección de obra"><input style={{ ...INP, marginBottom: 10 }} value={f.direccion_obra} onChange={e => set("direccion_obra", e.target.value)} /></Bloqueable>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Bloqueable campo="contacto" label="Contacto"><input style={{ ...INP, marginBottom: 10 }} value={f.contacto} onChange={e => set("contacto", e.target.value)} /></Bloqueable>
            <Bloqueable campo="tel" label="Teléfono"><input style={{ ...INP, marginBottom: 10 }} value={f.tel} onChange={e => set("tel", e.target.value)} /></Bloqueable>
          </div>
          <Bloqueable campo="email" label="Email"><input style={{ ...INP, marginBottom: 10 }} value={f.email} onChange={e => set("email", e.target.value)} /></Bloqueable>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Bloqueable campo="categoria" label="Categoría *">
              <SelectCategoria value={f.categoria} onChange={v => { set("categoria", v); if (v) setErrCategoria(false); }}
                style={{ marginBottom: errCategoria ? 4 : 10, ...(errCategoria ? { border: "1px solid " + C.err } : {}) }} />
              {errCategoria && <div style={{ fontSize: 11, color: C.err, fontWeight: 500, marginBottom: 10 }}>⚠ Seleccioná una categoría</div>}
            </Bloqueable>
            <Bloqueable campo="tipo_trabajo" label="Tipo de trabajo">
              <select style={{ ...INP, marginBottom: 10 }} value={f.tipo_trabajo} onChange={e => set("tipo_trabajo", e.target.value)}>
                {TIPOS_TRABAJO.map(t => <option key={t}>{t}</option>)}
              </select>
            </Bloqueable>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Bloqueable campo="estado_obra" label="Estado de obra">
              <select style={{ ...INP, marginBottom: 10 }} value={f.estado_obra} onChange={e => set("estado_obra", e.target.value)}>
                <option value="">— Sin definir —</option>
                <option value="Adjudicada">Adjudicada</option>
                <option value="Licitación">Licitación</option>
                <option value="Directa">Directa</option>
              </select>
            </Bloqueable>
            <Bloqueable campo="prioridad_manual" label="Prioridad">
              <select style={{ ...INP, marginBottom: 10 }} value={f.prioridad_manual} onChange={e => set("prioridad_manual", e.target.value)}>
                <option value="">— Sin definir —</option>
                <option value="alta">🔴 Alta</option>
                <option value="media">🟡 Media</option>
                <option value="baja">🟢 Baja</option>
              </select>
            </Bloqueable>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={LBL}>Estado</label>
              <select style={{ ...INP, marginBottom: 10 }} value={f.estado} onChange={e => set("estado", e.target.value)}>
                {ESTADOS_SOLICITUD.map(es => <option key={es} value={es}>{es}</option>)}
              </select>
            </div>
            <Bloqueable campo="fecha_limite" label="Fecha límite"><input type="date" style={{ ...INP, marginBottom: 10 }} value={f.fecha_limite} onChange={e => set("fecha_limite", e.target.value)} /></Bloqueable>
          </div>

          {!esNueva && (s.fecha_recepcion || s.fecha_envio || s.fecha_resolucion) && (
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
              {campo("Fecha de recepción", s.fecha_recepcion)}
              {campo("Fecha de envío", s.fecha_envio)}
              {campo("Fecha de resolución", s.fecha_resolucion)}
            </div>
          )}

          <Bloqueable campo="mensaje_cliente" label="Mensaje del cliente">
            <textarea style={{ ...INP, marginBottom: 10, minHeight: 70 }} value={f.mensaje_cliente}
              placeholder="Pegá acá el mail, WhatsApp, o el pedido tal cual llegó..." onChange={e => set("mensaje_cliente", e.target.value)} />
          </Bloqueable>
          <Bloqueable campo="notas" label="Notas">
            <textarea style={{ ...INP, marginBottom: 10, minHeight: 60 }} value={f.notas} onChange={e => set("notas", e.target.value)} />
          </Bloqueable>
          <Bloqueable campo="link_archivos" label="Link de archivos (Drive, Dropbox, etc.)">
            <input style={{ ...INP, marginBottom: 14 }} value={f.link_archivos} placeholder="https://..." onChange={e => set("link_archivos", e.target.value)} />
          </Bloqueable>

          {err && <div style={{ fontSize: 12, color: C.err, marginBottom: 10 }}>{err}</div>}
          {!esDeOtro && !cerrada && (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={guardar} disabled={guardando} style={{ ...BTN("ok"), flex: 1, opacity: guardando ? 0.6 : 1 }}>{guardando ? "Guardando…" : esNueva ? "Crear" : "Guardar cambios"}</button>
              <button onClick={onClose} style={{ ...BTN("ghost"), flex: 1 }}>Cancelar</button>
            </div>
          )}
        </fieldset>

        {children}
      </div>
    </div>
  );
}
