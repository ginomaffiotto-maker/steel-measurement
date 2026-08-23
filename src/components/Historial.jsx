import { useState, useEffect } from "react";
import { C, TH, TD, INP, LBL, BDG, BTN } from "../styles/colors";
import { saveLS, loadLS, uid, stamp, touch, resolverClienteId, saveDBTrabajoHistorico } from "../utils/storage";
import { supabase } from "../utils/supabaseClient";
import AutocompleteCliente from "./AutocompleteCliente";
import { puedeEliminar, ModalConfirmarEliminar } from "./ConfirmarEliminar";
import { HISTORIAL_SEED } from "../utils/historialSeed";
import { familiaDe } from "../utils/taxonomia";

// ─── HELPERS ─────────────────────────────────────────────────────
const n2  = v => (Math.round((+v || 0) * 100) / 100).toFixed(2);
const n3  = v => (Math.round((+v || 0) * 1000) / 1000).toFixed(3);

// Tooltips para términos técnicos en cabeceras de tabla (title nativo del navegador)
const TH_TOOLTIPS = {
  "USD/kg": "Precio total en dólares del trabajo dividido los kg totales",
  "USD/kg Min": "El USD/kg más bajo entre los trabajos de esta categoría",
  "USD/kg Prom": "Promedio de USD/kg de los trabajos de esta categoría",
  "USD/kg Max": "El USD/kg más alto entre los trabajos de esta categoría",
  "Kg/h Min": "La menor productividad (kg fabricados por hora) de esta categoría",
  "Kg/h Prom": "Productividad promedio (kg fabricados por hora) de esta categoría",
  "Kg/h Max": "La mayor productividad (kg fabricados por hora) de esta categoría",
};

const TIPOS = ["Fabricación", "Montaje", "Fab+Mont"];

// Mismos 9 rubros que calcPresupuesto() en Presupuesto.jsx — así el benchmark
// M5↔M4 y la conversión auto_m4 son 1:1, sin mapeos.
const RUBROS = [
  { k: "hier",  label: "Hierros",       color: C.info  },
  { k: "mat",   label: "Mat. Generales",color: C.steel },
  { k: "moFab", label: "MO Fab.",       color: C.ok    },
  { k: "moMon", label: "MO Mont.",      color: C.teal  },
  { k: "hesp",  label: "H. Especiales (legado)", color: C.warn  },
  { k: "tFab",  label: "Terc. Fab.",    color: C.pur   },
  { k: "tMon",  label: "Terc. Mont.",   color: C.pink  },
  { k: "trat",  label: "Trat. Sup.",    color: C.gold  },
  { k: "trasl", label: "Traslados",     color: C.muted },
  { k: "panto", label: "Corte Panto",   color: C.err   },
];

const ORIGEN_CFG = {
  manual:       { label: "Manual",        color: C.muted },
  import_excel: { label: "Excel",         color: C.info  },
  auto_m4:      { label: "Desde M4",      color: C.ok    },
};

function genNro(lista) {
  const nums = lista.map(t => parseInt((t.nro_ot || "").replace(/\D/g, ""), 10)).filter(n => !isNaN(n));
  return "OT-" + String((nums.length ? Math.max(...nums) : 0) + 1).padStart(3, "0");
}

export const iTrabajo = () => ({
  id: uid(), nro_ot: "", fecha: new Date().toISOString().slice(0, 10),
  cliente: "", obra: "", categoria: "", tipo_trabajo: "Fabricación",
  kg_total: 0, metros_total: 0, usd_total: 0,
  desglose_pct: { hier:0, mat:0, moFab:0, moMon:0, hesp:0, tFab:0, tMon:0, trat:0, trasl:0, panto:0 },
  horas_fab_est: 0, horas_fab_real: 0, horas_mon_est: 0, horas_mon_real: 0,
  negociacion_pct: 0, dias_obra: 0, notas: "",
  origen: "manual", presupuesto_id: null,
  ...stamp(),
});

// ─── CÁLCULOS ────────────────────────────────────────────────────
export function calcTrabajo(t) {
  const kg  = +t.kg_total || 0;
  const usd = +t.usd_total || 0;
  const usd_kg_real     = kg > 0 ? usd / kg : 0;
  const kg_hora_fab_est  = (+t.horas_fab_est  > 0) ? kg / t.horas_fab_est  : 0;
  const kg_hora_fab_real = (+t.horas_fab_real > 0) ? kg / t.horas_fab_real : 0;
  const kg_hora_mon_est  = (+t.horas_mon_est  > 0) ? kg / t.horas_mon_est  : 0;
  const kg_hora_mon_real = (+t.horas_mon_real > 0) ? kg / t.horas_mon_real : 0;
  const desvio_fab_pct = (+t.horas_fab_est > 0) ? ((t.horas_fab_real - t.horas_fab_est) / t.horas_fab_est) * 100 : 0;
  const desvio_mon_pct = (+t.horas_mon_est > 0) ? ((t.horas_mon_real - t.horas_mon_est) / t.horas_mon_est) * 100 : 0;
  return { usd_kg_real, kg_hora_fab_est, kg_hora_fab_real, kg_hora_mon_est, kg_hora_mon_real, desvio_fab_pct, desvio_mon_pct };
}

// Benchmark Min/Prom/Max por categoría — esto es lo que M4 va a consumir.
export function calcBenchmark(trabajos, agruparPor = "categoria") {
  const porGrupo = {};
  for (const t of trabajos) {
    const cat = t.categoria || "(sin categoría)";
    const grupo = agruparPor === "familia" ? familiaDe(cat) : cat;
    const c = calcTrabajo(t);
    if (c.usd_kg_real <= 0) continue;
    (porGrupo[grupo] = porGrupo[grupo] || []).push(c);
  }
  return Object.entries(porGrupo).map(([categoria, arr]) => {
    const usdKg = arr.map(a => a.usd_kg_real);
    const kgH   = arr.map(a => a.kg_hora_fab_real).filter(v => v > 0);
    return {
      categoria, n: arr.length,
      usd_kg_min: Math.min(...usdKg), usd_kg_prom: usdKg.reduce((s,v)=>s+v,0)/usdKg.length, usd_kg_max: Math.max(...usdKg),
      kg_h_min: kgH.length ? Math.min(...kgH) : 0, kg_h_prom: kgH.length ? kgH.reduce((s,v)=>s+v,0)/kgH.length : 0, kg_h_max: kgH.length ? Math.max(...kgH) : 0,
    };
  }).sort((a,b) => a.categoria.localeCompare(b.categoria));
}

// ─── MODAL: NUEVO TRABAJO (manual) ───────────────────────────────
function ModalNuevo({ onSave, onClose }) {
  const [f, setF] = useState(iTrabajo());
  const set  = (k, v) => setF(x => ({ ...x, [k]: v }));
  const setR = (k, v) => setF(x => ({ ...x, desglose_pct: { ...x.desglose_pct, [k]: v } }));
  const sumaPct = Object.values(f.desglose_pct).reduce((s,v)=>s+(+v||0),0);

  return (
    <div style={{ position:"fixed",inset:0,zIndex:1000,background:"#000a",display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
      <div style={{ background:C.card,border:`1.5px solid ${C.accent}55`,borderRadius:14,padding:28,width:"100%",maxWidth:640,maxHeight:"90vh",overflowY:"auto" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
          <div style={{ color:C.accent,fontWeight:800,fontSize:16 }}>📊 Nuevo Trabajo (Historial)</div>
          <button onClick={onClose} style={{ background:"none",border:"none",color:C.muted,fontSize:18,cursor:"pointer" }}>✕</button>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14 }}>
          <div><label style={LBL}>N° OT</label><input style={INP} value={f.nro_ot} placeholder="OT-001" onChange={e=>set("nro_ot",e.target.value)}/></div>
          <div><label style={LBL}>Fecha</label><input type="date" style={INP} value={f.fecha} onChange={e=>set("fecha",e.target.value)}/></div>
          <div><label style={LBL}>Cliente</label><input style={INP} value={f.cliente} onChange={e=>set("cliente",e.target.value)}/></div>
          <div><label style={LBL}>Obra</label><input style={INP} value={f.obra} onChange={e=>set("obra",e.target.value)}/></div>
          <div><label style={LBL}>Categoría</label><input style={INP} value={f.categoria} placeholder="ej: Naves industriales" onChange={e=>set("categoria",e.target.value)}/></div>
          <div>
            <label style={LBL}>Tipo de trabajo</label>
            <select style={INP} value={f.tipo_trabajo} onChange={e=>set("tipo_trabajo",e.target.value)}>
              {TIPOS.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14 }}>
          <div><label style={LBL}>Kg totales</label><input type="number" style={INP} value={f.kg_total} onChange={e=>set("kg_total",+e.target.value)}/></div>
          <div><label style={LBL}>Metros totales</label><input type="number" style={INP} value={f.metros_total} onChange={e=>set("metros_total",+e.target.value)}/></div>
          <div><label style={LBL}>USD total</label><input type="number" style={INP} value={f.usd_total} onChange={e=>set("usd_total",+e.target.value)}/></div>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:14 }}>
          <div><label style={LBL}>Hs Fab. Est.</label><input type="number" style={INP} value={f.horas_fab_est} onChange={e=>set("horas_fab_est",+e.target.value)}/></div>
          <div><label style={LBL}>Hs Fab. Real</label><input type="number" style={INP} value={f.horas_fab_real} onChange={e=>set("horas_fab_real",+e.target.value)}/></div>
          <div><label style={LBL}>Hs Mont. Est.</label><input type="number" style={INP} value={f.horas_mon_est} onChange={e=>set("horas_mon_est",+e.target.value)}/></div>
          <div><label style={LBL}>Hs Mont. Real</label><input type="number" style={INP} value={f.horas_mon_real} onChange={e=>set("horas_mon_real",+e.target.value)}/></div>
        </div>

        <div style={{ background:C.iron, borderRadius:8, padding:12, marginBottom:14 }}>
          <div style={{ fontSize:11, color:C.muted, fontWeight:700, marginBottom:8, display:"flex", justifyContent:"space-between" }}>
            <span>DESGLOSE % POR RUBRO (post-obra)</span>
            <span style={{ color: Math.abs(sumaPct-100) < 0.5 ? C.ok : C.warn }}>{n2(sumaPct)}%</span>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:8 }}>
            {RUBROS.map(r => (
              <div key={r.k}>
                <label style={{ fontSize:10, color:r.color }}>{r.label}</label>
                <input type="number" style={{ ...INP, padding:"4px 7px", fontSize:12 }} value={f.desglose_pct[r.k]}
                  onChange={e=>setR(r.k,+e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14 }}>
          <div><label style={LBL}>Negociación %</label><input type="number" style={INP} value={f.negociacion_pct} onChange={e=>set("negociacion_pct",+e.target.value)}/></div>
          <div><label style={LBL}>Días de obra</label><input type="number" style={INP} value={f.dias_obra} onChange={e=>set("dias_obra",+e.target.value)}/></div>
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={LBL}>Observaciones</label>
          <textarea style={{ ...INP, minHeight:60, resize:"vertical" }} value={f.notas} onChange={e=>set("notas",e.target.value)}/>
        </div>

        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button style={BTN("ghost")} onClick={onClose}>Cancelar</button>
          <button style={BTN("primary")} disabled={!f.kg_total || !f.usd_total}
            onClick={() => onSave(f)}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL: IMPORTAR DESDE PRESUPUESTO (auto_m4) ─────────────────
function ModalImportarM4({ onSave, onClose }) {
  const presupuestos = loadLS("smeas_presupuestos", []);
  const historial = loadLS("smeas_historial", []);
  const yaImportados = new Set(historial.filter(t=>t.presupuesto_id).map(t=>t.presupuesto_id));
  const candidatos = presupuestos.filter(p => p.estado === "aprobado" && !yaImportados.has(p.id));

  return (
    <div style={{ position:"fixed",inset:0,zIndex:1000,background:"#000a",display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
      <div style={{ background:C.card,border:`1.5px solid ${C.ok}55`,borderRadius:14,padding:24,width:"100%",maxWidth:520,maxHeight:"80vh",overflowY:"auto" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
          <div style={{ color:C.ok,fontWeight:800,fontSize:15 }}>✅ Convertir presupuesto aprobado a historial</div>
          <button onClick={onClose} style={{ background:"none",border:"none",color:C.muted,fontSize:18,cursor:"pointer" }}>✕</button>
        </div>
        {candidatos.length === 0 && (
          <div style={{ color:C.muted, fontSize:13, textAlign:"center", padding:20 }}>
            No hay presupuestos "Aprobado" pendientes de convertir.
          </div>
        )}
        {candidatos.map(p => (
          <div key={p.id} onClick={() => onSave(p)}
            style={{ background:C.iron, borderRadius:8, padding:12, marginBottom:8, cursor:"pointer", border:`1px solid ${C.border}` }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=C.ok+"66"}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <div style={{ fontWeight:700, fontSize:13 }}>{p.nombre} <span style={{ color:C.muted, fontWeight:400, fontSize:11 }}>({p.nro})</span></div>
            <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{p.cliente || "—"} · {p.obra || "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Convierte un presupuesto M4 (+ su cálculo) en un borrador de TrabajoHistorico.
// Requiere que quien llame ya haya corrido calcPresupuesto(p) en Presupuesto.jsx;
// acá recalculamos liviano a partir de p.items para no importar ese módulo.
function presupuestoAHistorial(p) {
  // Reconstrucción liviana de totales por rubro (mismo cálculo que calcPresupuesto)
  const rubros = { hier:0, mat:0, moFab:0, moMon:0, hesp:0, tFab:0, tMon:0, trat:0, trasl:0, panto:0 };
  let total_usd = 0, total_kg = 0, horas_fab = 0, horas_mon = 0;
  for (const it of p.items || []) {
    const cant = +it.cantidad || 1;
    const hier_usd  = (it.hierros||[]).reduce((s,h)=>s+(+h.subtotal_usd||0),0);
    const hier_kg   = (it.hierros||[]).reduce((s,h)=>s+(+h.subtotal_kg||0),0);
    const mat_usd   = (it.mat_generales||[]).reduce((s,m)=>s+(+m.subtotal_usd||0),0);
    const moFab_usd = (it.mo_fabricacion||[]).reduce((s,m)=>s+(+m.subtotal_usd||0),0);
    const moFab_h   = (it.mo_fabricacion||[]).reduce((s,m)=>s+(+m.cant_horas||0),0);
    const moMon_usd = (it.mo_montajes||[]).reduce((s,m)=>s+(+m.subtotal_usd||0),0);
    const moMon_h   = (it.mo_montajes||[]).reduce((s,m)=>s+(+m.cant_horas||0),0);
    const hesp_usd  = (it.horas_especiales||[]).reduce((s,h)=>s+(+h.subtotal_usd||0),0);
    const tFab_usd  = (it.terc_fabricacion||[]).reduce((s,t)=>s+(+t.subtotal_usd||0),0);
    const tMon_usd  = (it.terc_montajes||[]).reduce((s,t)=>s+(+t.subtotal_usd||0),0);
    const ts = it.trat_superficie || {};
    const trat_usd  = (ts.pinturas||[]).reduce((s,pp)=>s+(+pp.subtotal_usd||0),0) + (+ts.arenado_m2||0)*(+ts.arenado_usd_m2||10);
    const trasl_usd = (it.traslados||[]).reduce((s,t)=>s+(+t.subtotal_usd||0),0);
    const panto_usd = (it.corte_pantografo||[]).reduce((s,cc)=>s+(+cc.subtotal_usd||0),0);
    const total_unit = hier_usd+mat_usd+moFab_usd+moMon_usd+hesp_usd+tFab_usd+tMon_usd+trat_usd+trasl_usd+panto_usd;

    rubros.hier+=hier_usd*cant; rubros.mat+=mat_usd*cant; rubros.moFab+=moFab_usd*cant; rubros.moMon+=moMon_usd*cant;
    rubros.hesp+=hesp_usd*cant; rubros.tFab+=tFab_usd*cant; rubros.tMon+=tMon_usd*cant; rubros.trat+=trat_usd*cant;
    rubros.trasl+=trasl_usd*cant; rubros.panto+=panto_usd*cant;
    total_usd += total_unit*cant;
    total_kg  += it.no_agrega_kg ? 0 : hier_kg*cant;
    horas_fab += moFab_h*cant; horas_mon += moMon_h*cant;
  }
  const neg_usd = p.neg_modo === "usd" ? (+p.negociacion_usd||0) : total_usd*(+p.negociacion_pct||0)/100;
  const int_usd = (total_usd-neg_usd)*(+p.interes_pct||0)/100;
  const gran_total = total_usd-neg_usd+int_usd;
  const desglose_pct = {};
  RUBROS.forEach(r => { desglose_pct[r.k] = total_usd>0 ? +(rubros[r.k]/total_usd*100).toFixed(1) : 0; });

  return {
    ...iTrabajo(),
    cliente: p.cliente || "", obra: p.obra || "", tipo_trabajo: p.tipo_trabajo || "Fabricación",
    fecha: new Date().toISOString().slice(0,10),
    kg_total: +n3(total_kg), usd_total: +n2(gran_total),
    desglose_pct,
    horas_fab_est: 0, horas_fab_real: +n2(horas_fab), horas_mon_est: 0, horas_mon_real: +n2(horas_mon),
    negociacion_pct: p.negociacion_pct || 0,
    notas: `Importado desde presupuesto ${p.nro} — completar horas estimadas y fecha de cierre.`,
    origen: "auto_m4", presupuesto_id: p.id,
  };
}

// ─── VISTA DETALLE ────────────────────────────────────────────────
function DetalleTrabajo({ t, onChange, onBack }) {
  const c = calcTrabajo(t);
  const origen = ORIGEN_CFG[t.origen] || ORIGEN_CFG.manual;
  const set  = (k, v) => onChange({ ...t, [k]: v });
  const setR = (k, v) => onChange({ ...t, desglose_pct: { ...t.desglose_pct, [k]: v } });
  const lblMini = { fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:.5, display:"block", marginBottom:3 };
  const inpMini = { ...INP, padding:"6px 9px", fontSize:13 };

  return (
    <div>
      <button style={{ ...BTN("ghost"), marginBottom:16 }} onClick={onBack}>← Volver</button>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <div style={{ fontWeight:800, fontSize:19 }}>{t.nro_ot || "Trabajo"} — {t.cliente || "Sin cliente"}</div>
        <span style={BDG(origen.color, true)}>{origen.label}</span>
      </div>

      {/* Datos generales — editables */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:16, marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:700, color:C.steel, marginBottom:10 }}>Datos generales</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          <div><label style={lblMini}>N° OT</label><input style={inpMini} value={t.nro_ot} onChange={e=>set("nro_ot",e.target.value)}/></div>
          <div><label style={lblMini}>Fecha</label><input type="date" style={inpMini} value={t.fecha} onChange={e=>set("fecha",e.target.value)}/></div>
          <div>
            <label style={lblMini}>Tipo de trabajo</label>
            <select style={inpMini} value={t.tipo_trabajo} onChange={e=>set("tipo_trabajo",e.target.value)}>
              {TIPOS.map(x=><option key={x} value={x}>{x}</option>)}
            </select>
          </div>
          <div><label style={lblMini}>Cliente</label><input style={inpMini} value={t.cliente} onChange={e=>set("cliente",e.target.value)}/></div>
          <div><label style={lblMini}>Obra</label><input style={inpMini} value={t.obra} onChange={e=>set("obra",e.target.value)}/></div>
          <div><label style={lblMini}>Categoría</label><input style={inpMini} value={t.categoria} onChange={e=>set("categoria",e.target.value)}/></div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
          <label style={lblMini}>Kg totales</label>
          <input type="number" style={{ ...inpMini, fontSize:20, fontWeight:800, color:C.accent, border:"none", background:"transparent", padding:0 }}
            value={t.kg_total} onChange={e=>set("kg_total",+e.target.value)}/>
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
          <label style={lblMini}>USD total</label>
          <input type="number" style={{ ...inpMini, fontSize:20, fontWeight:800, color:C.accent, border:"none", background:"transparent", padding:0 }}
            value={t.usd_total} onChange={e=>set("usd_total",+e.target.value)}/>
        </div>
        {[
          ["USD/kg real", n2(c.usd_kg_real)],
          ["Kg/h fab. real", n2(c.kg_hora_fab_real)],
        ].map(([lbl,val]) => (
          <div key={lbl} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
            <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", marginBottom:5 }}>{lbl}</div>
            <div style={{ fontSize:22, fontWeight:800, color:C.accent }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:16, marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:700, color:C.steel, marginBottom:10, display:"flex", justifyContent:"space-between" }}>
          <span>Desglose por rubro (%, post-obra)</span>
          <span style={{ color: Math.abs(Object.values(t.desglose_pct||{}).reduce((s,v)=>s+(+v||0),0)-100) < 0.5 ? C.ok : C.warn }}>
            {n2(Object.values(t.desglose_pct||{}).reduce((s,v)=>s+(+v||0),0))}%
          </span>
        </div>
        {RUBROS.map(r => {
          const pct = +t.desglose_pct?.[r.k] || 0;
          return (
            <div key={r.k} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
              <div style={{ width:110, fontSize:12, color:C.muted }}>{r.label}</div>
              <div style={{ flex:1, background:C.iron, borderRadius:4, height:8, overflow:"hidden" }}>
                <div style={{ width:`${Math.min(pct,100)}%`, background:r.color, height:"100%" }} />
              </div>
              <input type="number" style={{ ...inpMini, width:64, textAlign:"right", color:r.color, fontWeight:800 }}
                value={pct} onChange={e=>setR(r.k,+e.target.value)} />
            </div>
          );
        })}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.steel, marginBottom:10 }}>Fabricación</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:6 }}>
            <div><label style={lblMini}>Hs Est.</label><input type="number" style={inpMini} value={t.horas_fab_est} onChange={e=>set("horas_fab_est",+e.target.value)}/></div>
            <div><label style={lblMini}>Hs Real</label><input type="number" style={inpMini} value={t.horas_fab_real} onChange={e=>set("horas_fab_real",+e.target.value)}/></div>
          </div>
          <div style={{ fontSize:12, color: c.desvio_fab_pct > 10 ? C.err : c.desvio_fab_pct < -5 ? C.ok : C.muted, fontWeight:700 }}>
            Desvío: {c.desvio_fab_pct > 0 ? "+" : ""}{n2(c.desvio_fab_pct)}%
          </div>
          <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>Kg/h est.: {n2(c.kg_hora_fab_est)} · real: {n2(c.kg_hora_fab_real)}</div>
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.steel, marginBottom:10 }}>Montaje</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:6 }}>
            <div><label style={lblMini}>Hs Est.</label><input type="number" style={inpMini} value={t.horas_mon_est} onChange={e=>set("horas_mon_est",+e.target.value)}/></div>
            <div><label style={lblMini}>Hs Real</label><input type="number" style={inpMini} value={t.horas_mon_real} onChange={e=>set("horas_mon_real",+e.target.value)}/></div>
          </div>
          <div style={{ fontSize:12, color: c.desvio_mon_pct > 10 ? C.err : c.desvio_mon_pct < -5 ? C.ok : C.muted, fontWeight:700 }}>
            Desvío: {c.desvio_mon_pct > 0 ? "+" : ""}{n2(c.desvio_mon_pct)}%
          </div>
          <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>Kg/h est.: {n2(c.kg_hora_mon_est)} · real: {n2(c.kg_hora_mon_real)}</div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div><label style={lblMini}>Negociación %</label><input type="number" style={inpMini} value={t.negociacion_pct} onChange={e=>set("negociacion_pct",+e.target.value)}/></div>
        <div><label style={lblMini}>Días de obra</label><input type="number" style={inpMini} value={t.dias_obra} onChange={e=>set("dias_obra",+e.target.value)}/></div>
      </div>

      <div>
        <label style={lblMini}>Observaciones</label>
        <textarea style={{ ...INP, minHeight:60, resize:"vertical" }} value={t.notas} onChange={e=>set("notas",e.target.value)} />
      </div>
    </div>
  );
}

// ─── VISTA BENCHMARK ──────────────────────────────────────────────
function Benchmark({ trabajos }) {
  const [agruparPor, setAgruparPor] = useState("categoria");
  const bm = calcBenchmark(trabajos, agruparPor);
  const colLabel = agruparPor === "familia" ? "Familia" : "Categoría";
  if (bm.length === 0) return (
    <div style={{ textAlign:"center", padding:40, color:C.muted, fontSize:13 }}>
      Sin datos suficientes todavía para el benchmark.
    </div>
  );
  return (
    <div>
      <div style={{ display:"flex", gap:6, marginBottom:12 }}>
        <button onClick={()=>setAgruparPor("categoria")} style={{ ...BTN(agruparPor==="categoria"?"ok":"ghost"), padding:"5px 14px", fontSize:11 }}>Por Categoría</button>
        <button onClick={()=>setAgruparPor("familia")} style={{ ...BTN(agruparPor==="familia"?"ok":"ghost"), padding:"5px 14px", fontSize:11 }}>Por Familia</button>
      </div>
      <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead><tr>
          {[colLabel,"N° trabajos","USD/kg Min","USD/kg Prom","USD/kg Max","Kg/h Min","Kg/h Prom","Kg/h Max"].map(h=>(
            <th key={h} title={TH_TOOLTIPS[h]||TH_TOOLTIPS[colLabel]} style={TH}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {bm.map(b => (
            <tr key={b.categoria}>
              <td style={TD}><span style={{ fontWeight:700 }}>{b.categoria}</span></td>
              <td style={{ ...TD, textAlign:"center" }}>{b.n}</td>
              <td style={{ ...TD, textAlign:"right", color:C.ok }}>{n2(b.usd_kg_min)}</td>
              <td style={{ ...TD, textAlign:"right", fontWeight:700 }}>{n2(b.usd_kg_prom)}</td>
              <td style={{ ...TD, textAlign:"right", color:C.err }}>{n2(b.usd_kg_max)}</td>
              <td style={{ ...TD, textAlign:"right", color:C.ok }}>{n2(b.kg_h_min)}</td>
              <td style={{ ...TD, textAlign:"right", fontWeight:700 }}>{n2(b.kg_h_prom)}</td>
              <td style={{ ...TD, textAlign:"right", color:C.err }}>{n2(b.kg_h_max)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

// ─── HISTORIAL (EXPORT DEFAULT) ───────────────────────────────────
export default function Historial({ usuario }) {
  const [trabajos, setTrabajos] = useState(() => loadLS("smeas_historial", HISTORIAL_SEED));
  const [vista, setVista] = useState("lista"); // lista | detalle | benchmark
  const [selId, setSelId] = useState(null);
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroObra, setFiltroObra] = useState("");
  const [filtroOT, setFiltroOT] = useState("");
  const [filtCat, setFiltCat] = useState("");
  const [filtTipo, setFiltTipo] = useState("");
  const [filtDesde, setFiltDesde] = useState("");
  const [filtHasta, setFiltHasta] = useState("");
  const [usdKgMin, setUsdKgMin] = useState("");
  const [usdKgMax, setUsdKgMax] = useState("");
  const [confirmarDelId, setConfirmarDelId] = useState(null);

  useEffect(() => { saveLS("smeas_historial", trabajos); }, [trabajos]);

  // Ir directo a un trabajo desde el Buscador global
  useEffect(() => {
    const pendId = loadLS("smeas_ir_a_historial", null);
    if (!pendId) return;
    saveLS("smeas_ir_a_historial", null);
    setSelId(pendId);
    setVista("detalle");
  }, []); // eslint-disable-line

  const selTrab = trabajos.find(t => t.id === selId) || null;
  const categorias = [...new Set(trabajos.map(t => t.categoria).filter(Boolean))].sort();

  const usdKgDe = (t) => (+t.kg_total > 0) ? (+t.usd_total || 0) / (+t.kg_total) : 0;

  const lista = trabajos
    .filter(t => !filtCat || t.categoria === filtCat)
    .filter(t => !filtTipo || t.tipo_trabajo === filtTipo)
    .filter(t => !usdKgMin || (usdKgDe(t) >= +usdKgMin))
    .filter(t => !usdKgMax || (usdKgDe(t) <= +usdKgMax))
    .filter(t => !filtroCliente || (t.cliente||"").toLowerCase().includes(filtroCliente.toLowerCase()))
    .filter(t => !filtroObra    || (t.obra||"").toLowerCase().includes(filtroObra.toLowerCase()))
    .filter(t => !filtroOT      || (t.nro_ot||"").toLowerCase().includes(filtroOT.toLowerCase()))
    .filter(t => !filtDesde || (t.fecha||"") >= filtDesde)
    .filter(t => !filtHasta || (t.fecha||"") <= filtHasta);

  // Fase 3 (piloto, 2026-08-22): dual-write en paralelo, nunca bloquea ni
  // puede romper el guardado local. Mismo criterio que el resto de Fase 3.
  const dualWriteTrabajo = async (t) => {
    if (!supabase) return;
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
    } catch (e) {
      console.warn(`[Fase 3] No se pudo sincronizar trabajo "${t.nro_ot || t.id}" con el backend:`, e.message || e);
    }
  };

  const crear = (form) => {
    const nuevo = { ...iTrabajo(), ...form };
    const all = [nuevo, ...trabajos];
    nuevo.nro_ot = nuevo.nro_ot || genNro(all);
    setTrabajos(all);
    setNuevoOpen(false);
    dualWriteTrabajo(nuevo);
  };

  const importarDeM4 = (presupuesto) => {
    const nuevo = presupuestoAHistorial(presupuesto);
    const all = [nuevo, ...trabajos];
    nuevo.nro_ot = genNro(all);
    setTrabajos(all);
    setImportOpen(false);
    setSelId(nuevo.id);
    setVista("detalle");
  };

  const upd = (t) => {
    const actualizado = touch(t);
    setTrabajos(prev => prev.map(x => x.id===t.id ? actualizado : x));
    dualWriteTrabajo(actualizado);
  };
  const del = (id) => setTrabajos(prev => prev.filter(x => x.id!==id));
  const trabajoAEliminar = confirmarDelId ? trabajos.find(t=>t.id===confirmarDelId) : null;

  if (vista === "detalle" && selTrab) {
    return <DetalleTrabajo t={selTrab} onChange={upd} onBack={() => { setVista("lista"); setSelId(null); }} />;
  }

  return (
    <div>
      {trabajoAEliminar && (
        <ModalConfirmarEliminar
          titulo={`trabajo "${trabajoAEliminar.nro_ot||"Sin OT"}" — ${trabajoAEliminar.cliente||"sin cliente"}`}
          onConfirm={() => { del(trabajoAEliminar.id); setConfirmarDelId(null); }}
          onClose={() => setConfirmarDelId(null)}
        />
      )}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontWeight:800, fontSize:20, color:C.accent }}>📊 Historial de Trabajos</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{trabajos.length} trabajo{trabajos.length!==1?"s":""} registrado{trabajos.length!==1?"s":""}</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button style={BTN("ok")} onClick={() => setImportOpen(true)}>✅ Desde presupuesto</button>
          <button style={BTN("primary")} onClick={() => setNuevoOpen(true)}>+ Nuevo trabajo</button>
        </div>
      </div>

      {/* Toggle Lista / Benchmark */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        <button onClick={() => setVista("lista")} style={{ ...BTN(vista==="lista"?"ok":"ghost"), padding:"5px 14px" }}>📋 Tabla</button>
        <button onClick={() => setVista("benchmark")} style={{ ...BTN(vista==="benchmark"?"ok":"ghost"), padding:"5px 14px" }}>📈 Benchmark</button>
      </div>

      {vista === "benchmark" && <Benchmark trabajos={trabajos} />}

      {vista === "lista" && (
        <>
          <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
            <AutocompleteCliente style={{ ...INP, maxWidth:160 }} value={filtroCliente} placeholder="🔍 Cliente…"
              onChange={setFiltroCliente} />
            <input style={{ ...INP, maxWidth:150 }} value={filtroObra} placeholder="🔍 Obra…"
              onChange={e => setFiltroObra(e.target.value)} />
            <input style={{ ...INP, maxWidth:120 }} value={filtroOT} placeholder="🔍 N° OT…"
              onChange={e => setFiltroOT(e.target.value)} />
            <select style={{ ...INP, maxWidth:180 }} value={filtCat} onChange={e=>setFiltCat(e.target.value)}>
              <option value="">Todas las categorías</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select style={{ ...INP, maxWidth:150 }} value={filtTipo} onChange={e=>setFiltTipo(e.target.value)}>
              <option value="">Todos los tipos</option>
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="date" style={{ ...INP, maxWidth:140 }} value={filtDesde} title="Desde" onChange={e=>setFiltDesde(e.target.value)} />
            <input type="date" style={{ ...INP, maxWidth:140 }} value={filtHasta} title="Hasta" onChange={e=>setFiltHasta(e.target.value)} />
            <input type="number" step="0.01" style={{ ...INP, maxWidth:110 }} placeholder="USD/kg mín" value={usdKgMin} onChange={e=>setUsdKgMin(e.target.value)} />
            <input type="number" step="0.01" style={{ ...INP, maxWidth:110 }} placeholder="USD/kg máx" value={usdKgMax} onChange={e=>setUsdKgMax(e.target.value)} />
          </div>

          {lista.length === 0 && (
            <div style={{ textAlign:"center", padding:60, color:C.muted }}>
              {trabajos.length === 0 ? (
                <>
                  <div style={{ fontSize:40, marginBottom:12 }}>📊</div>
                  <div style={{ fontSize:15, fontWeight:700, marginBottom:6, color:C.steel }}>Sin trabajos todavía</div>
                  <div style={{ fontSize:12, marginBottom:20 }}>Cargá el primero manualmente o convertí un presupuesto aprobado</div>
                </>
              ) : (
                <div style={{ fontSize:13 }}>No hay resultados para ese filtro</div>
              )}
            </div>
          )}

          {lista.length > 0 && (
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr>
                  {["OT","Fecha","Cliente","Obra","Categoría","Kg","USD","USD/kg","Origen",""].map(h=>(
                    <th key={h} title={TH_TOOLTIPS[h]} style={TH}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {lista.map(t => {
                    const c = calcTrabajo(t);
                    const origen = ORIGEN_CFG[t.origen] || ORIGEN_CFG.manual;
                    return (
                      <tr key={t.id} onClick={() => { setSelId(t.id); setVista("detalle"); }}
                        style={{ cursor:"pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background=C.iron+"55"}
                        onMouseLeave={e => e.currentTarget.style.background=""}>
                        <td style={TD}><span style={{ color:C.muted, fontSize:11 }}>{t.nro_ot}</span></td>
                        <td style={TD}><span style={{ fontSize:11, color:C.muted }}>{t.fecha}</span></td>
                        <td style={TD}><span style={{ fontWeight:700 }}>{t.cliente||"—"}</span></td>
                        <td style={TD}><span style={{ fontSize:12, color:C.steel }}>{t.obra||"—"}</span></td>
                        <td style={TD}><span style={BDG(C.steel,true)}>{t.categoria||"—"}</span></td>
                        <td style={{ ...TD, textAlign:"right" }}>{n3(t.kg_total)}</td>
                        <td style={{ ...TD, textAlign:"right", fontWeight:700, color:C.ok }}>${n2(t.usd_total)}</td>
                        <td style={{ ...TD, textAlign:"right", color:C.accent, fontWeight:700 }}>{n2(c.usd_kg_real)}</td>
                        <td style={TD}><span style={BDG(origen.color,true)}>{origen.label}</span></td>
                        <td style={TD} onClick={e=>e.stopPropagation()}>
                          {puedeEliminar(usuario) && (
                            <button onClick={() => setConfirmarDelId(t.id)}
                              style={{ background:"none", border:"none", color:C.err, cursor:"pointer", fontSize:13 }}>🗑</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {nuevoOpen && <ModalNuevo onSave={crear} onClose={() => setNuevoOpen(false)} />}
      {importOpen && <ModalImportarM4 onSave={importarDeM4} onClose={() => setImportOpen(false)} />}
    </div>
  );
}
