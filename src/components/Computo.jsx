import { useState, useEffect, useRef, useMemo } from "react";
import { C, TH, TD, INP, LBL, BDG, BTN } from "../styles/colors";
import { saveLS, loadLS, uid, stamp, touch, registrarCliente } from "../utils/storage";
import { puedeEliminar, ModalConfirmarEliminar, ModalConfirmarBorrado } from "./ConfirmarEliminar";

// ─── HELPERS ─────────────────────────────────────────────────────
const TH_R  = { ...TH, textAlign: "right" };
const TD_R  = { ...TD, textAlign: "right", fontVariantNumeric: "tabular-nums" };
const n2    = v => (Math.round(v * 100)  / 100).toFixed(2);
const n3    = v => (Math.round(v * 1000) / 1000).toFixed(3);
const normStr = s => String(s||"").toLowerCase()
  .replace(/×/g,"x").replace(/²/g,"2").replace(/½/g,"1/2")
  .replace(/¼/g,"1/4").replace(/¾/g,"3/4").replace(/\s+/g," ").trim();

// ─── TOGGLE UI helper ─────────────────────────────────────────────
function Toggle({ on, onChange, label, color = C.ok }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <button onClick={() => onChange(!on)}
        style={{ width:36, height:20, borderRadius:10, background: on ? color : C.iron,
          border:`1px solid ${on ? color : C.border}`, cursor:"pointer",
          position:"relative", transition:"all .2s", padding:0, flexShrink:0 }}>
        <div style={{ width:16, height:16, borderRadius:8, background:"#fff",
          position:"absolute", top:2, left: on ? 18 : 2, transition:"left .15s" }} />
      </button>
      <span style={{ fontSize:13, color: on ? C.text : C.muted }}>{label}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMBOBOX
// ═══════════════════════════════════════════════════════════════
// Info de referencia rápida de un material: largo de barra o m² de la hoja, + kg/m o kg/m².
function infoMaterial(o) {
  if (o.kg_m2) {
    const sup = o.sheet_w && o.sheet_h ? `${(o.sheet_w*o.sheet_h/1e6).toFixed(2)}m²` : null;
    return [sup, o.kg_m2 ? `${o.kg_m2} kg/m²` : null].filter(Boolean).join(" · ");
  }
  if (o.kg_m) {
    const largo = o.largo_mm ? `${(o.largo_mm/1000)}m` : null;
    return [largo, `${o.kg_m} kg/m`].filter(Boolean).join(" · ");
  }
  return null;
}

function Combobox({ opciones, value, onChange, placeholder = "Buscar…" }) {
  const [busq, setBusq] = useState("");
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setBusq(""); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const sel = opciones.find(o => o.id === value) || null;
  const q = normStr(busq.trim());
  const tokens = q ? q.split(" ").filter(Boolean) : [];
  const lista = tokens.length === 0
    ? opciones.slice(0, 80)
    : opciones.filter(o => { const hay = normStr(o.nombre+" "+(o.cat||"")); return tokens.every(t=>hay.includes(t)); }).slice(0,80);
  const abrir = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setOpenUp(window.innerHeight - r.bottom < 320 && r.top > 320);
    }
    setOpen(v=>!v);
  };
  return (
    <div ref={ref} style={{ position:"relative", width:240 }}>
      <div onClick={abrir}
        style={{ ...INP, width:"100%", display:"flex", alignItems:"center", gap:6,
          cursor:"pointer", padding:"6px 8px", border:`1px solid ${open?C.accent:C.border}` }}>
        {sel ? (
          <>
            <span style={{ flex:1,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{sel.nombre}</span>
            {infoMaterial(sel) && <span style={{fontSize:10,color:C.muted,flexShrink:0}}>{infoMaterial(sel)}</span>}
            {!sel.precio_kg && <span title="Sin precio cargado en Insumos y Precios" style={{ fontSize:11, color:C.warn }}>⚠ sin precio</span>}
            <span onMouseDown={e=>{e.stopPropagation();onChange(null);setBusq("");setOpen(false);}}
              style={{ cursor:"pointer",color:C.muted,fontSize:14,padding:"0 3px" }}>✕</span>
          </>
        ) : <span style={{ flex:1,color:C.muted,fontSize:12 }}>{placeholder}</span>}
        <span style={{ color:C.muted,fontSize:10 }}>{open?"▲":"▼"}</span>
      </div>
      {open && (
        <div style={{ position:"absolute", ...(openUp ? {bottom:"calc(100% + 4px)"} : {top:"calc(100% + 4px)"}), left:0,width:300,zIndex:9999,
          background:C.card,border:`1px solid ${C.accent}55`,borderRadius:8,
          boxShadow:"0 8px 24px #00000077",overflow:"hidden" }}>
          <div style={{ padding:"8px 8px 4px" }}>
            <input autoFocus type="text" placeholder="Escribí para filtrar…" value={busq}
              onChange={e=>setBusq(e.target.value)}
              style={{ ...INP,width:"100%",padding:"6px 8px",fontSize:12 }} />
          </div>
          <div style={{ maxHeight:260,overflowY:"auto" }}>
            {lista.length===0 && <div style={{ padding:"10px 12px",color:C.muted,fontSize:12 }}>Sin resultados para "{busq}"</div>}
            {lista.map(o=>(
              <div key={o.id} onMouseDown={()=>{onChange(o);setBusq("");setOpen(false);}}
                style={{ padding:"7px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontSize:13,
                  background:value===o.id?C.accent+"22":"transparent",
                  color:value===o.id?C.accent:C.text,
                  borderLeft:value===o.id?`3px solid ${C.accent}`:"3px solid transparent" }}
                onMouseEnter={e=>e.currentTarget.style.background=C.iron}
                onMouseLeave={e=>e.currentTarget.style.background=value===o.id?C.accent+"22":"transparent"}>
                <span style={{ flex:1 }}>{o.nombre}</span>
                {infoMaterial(o) && <span style={{fontSize:10,color:C.muted,flexShrink:0}}>{infoMaterial(o)}</span>}
                {!o.precio_kg && <span title="Sin precio cargado" style={{ fontSize:10, color:C.warn }}>⚠</span>}
                {o.cat&&<span style={{ fontSize:10,color:C.muted }}>{o.cat}</span>}
                {value===o.id&&<span style={{ color:C.accent }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MODELOS ──────────────────────────────────────────────────────
const fichaVacia = () => ({
  granallado: false, pct_granallado: 100,
  pintura: false, pct_pintura: 100,
  galvanizado: false, pct_galvanizado: 100,
  corte_maquina: false, maquina: "",
  precio_raw: "",
  precio_por: "kg",   // "kg" | "m" | "m2"
  moneda: "USD",
  proveedor: "",
  fecha_precio: "",
  obs: ""
});

const piezaVacia = (tipo = "perfil") => ({
  id: uid(), tipo,
  material_id: "", material_nombre: "", kg_m: 0, sup_m2m: 0,
  largo_mm_input: "",
  largo_mm: "", ancho_mm: "", kg_m2: 0,
  cantidad: 1,
  ficha: fichaVacia()
});

const itemVacio = (n = 1) => ({
  id: uid(), titulo: `Ítem ${n}`, cantidad: 1, n_plano: "", piezas: [],
});

const computoVacio = () => ({
  id: uid(), nombre: "", fecha: new Date().toISOString().split("T")[0], cliente: "",
  cantidad_total: 1,
  items: [itemVacio(1)],
  ...stamp(),
});

// ─── CÁLCULOS ─────────────────────────────────────────────────────
function calcPieza(p) {
  if (p.tipo === "perfil") {
    const largo    = (parseFloat(p.largo_mm_input) || 0) / 1000;
    const kg_pieza = largo * p.kg_m;
    const total_kg = kg_pieza * p.cantidad;
    const total_sup = largo * p.sup_m2m * p.cantidad;
    const total_m   = largo * p.cantidad;
    return { largo, kg_pieza, total_kg, total_sup, total_m };
  } else {
    const area      = ((parseFloat(p.largo_mm) || 0) / 1000) * ((parseFloat(p.ancho_mm) || 0) / 1000);
    const kg_pieza  = area * p.kg_m2;
    const total_kg  = kg_pieza * p.cantidad;
    const total_sup = area * p.cantidad;
    return { area, kg_pieza, total_kg, total_sup, total_m: 0 };
  }
}

// Precio en USD de una pieza, si tiene cotización cargada en su ficha (precio_raw).
function calcPiezaUSD(p, tc) {
  const ficha = p.ficha || fichaVacia();
  const precioRaw = parseFloat(ficha.precio_raw) || 0;
  if (precioRaw <= 0) return 0;
  const tcNum = parseFloat(tc) || 40;
  const precioUSD = ficha.moneda === "UYU" ? precioRaw / tcNum : precioRaw;
  const calc = calcPieza(p);
  const por = ficha.precio_por || "kg";
  if (por === "kg")  return precioUSD * calc.total_kg;
  if (por === "m")   return precioUSD * (calc.total_m || 0);
  if (por === "m2")  return precioUSD * calc.total_sup;
  return 0;
}

function calcResumen(piezas) {
  const mapa = {}; let totalKg = 0;
  piezas.forEach(p => {
    const c = calcPieza(p);
    totalKg += c.total_kg;
    const key = p.material_nombre || "Sin material";
    if (!mapa[key]) mapa[key] = { nombre:key, piezas:0, metros:0, kg:0, sup:0 };
    mapa[key].piezas += p.cantidad;
    mapa[key].metros += c.total_m || 0;
    mapa[key].kg     += c.total_kg;
    mapa[key].sup    += c.total_sup;
  });
  return { filas: Object.values(mapa), totalKg };
}

// ─── BIBLIOTECA ───────────────────────────────────────────────────
function useBiblioteca() {
  return useMemo(() => {
    const perfiles    = loadLS("smeas_perfiles",    []);
    const planchuelas = loadLS("smeas_planchuelas", []);
    const planchas    = loadLS("smeas_planchas",    []);
    const lineales = [...perfiles, ...planchuelas].map(p => ({
      id:p.id, nombre:p.nombre, cat:p.cat, kg_m:p.kg_m, sup_m2m:p.sup||0,
      largo_mm:(p.largo||6)*1000,
      precio_kg: parseFloat(p.precio||p.precio_usd_kg||p.precio_kg||0)||0,
    }));
    const chapas = planchas.map(p => ({
      id:p.id, nombre:p.nombre, espesor:p.espesor, kg_m2:p.kg_m2,
      sheet_w:p.largo_mm, sheet_h:p.ancho_mm,
      precio_kg: parseFloat(p.precio||p.precio_usd_kg||p.precio_kg||0)||0,
    }));
    return { lineales, chapas };
  }, []);
}

// ═══════════════════════════════════════════════════════════════
// FICHA DRAWER — panel lateral por pieza
// ═══════════════════════════════════════════════════════════════
const MAQUINAS_OPTS = ["Plasma / Pantógrafo","Láser","Oxicorte","Cizalla","Sierra","Torno","Fresadora","Otro"];

function FichaDrawer({ pieza, tc, bib, onClose, onChange }) {
  // Backward compat: migrar arenado → granallado si vienen datos viejos
  const ficha0 = pieza.ficha || fichaVacia();
  const ficha  = {
    ...fichaVacia(),
    ...ficha0,
    granallado:     ficha0.granallado     ?? ficha0.arenado     ?? false,
    pct_granallado: ficha0.pct_granallado ?? ficha0.pct_arena   ?? 100,
  };
  const setF  = (k, v) => onChange({ ...pieza, ficha: { ...ficha, [k]: v } });
  const tcNum = parseFloat(tc) || 40;
  const calc  = calcPieza(pieza);
  const por   = ficha.precio_por || "kg";

  // Precio precargado de biblioteca
  const bibMats  = pieza.tipo === "perfil" ? (bib?.lineales||[]) : (bib?.chapas||[]);
  const matBib   = bibMats.find(m => m.id === pieza.material_id);
  const precioBib = matBib?.precio_kg || 0;

  const precioRaw = parseFloat(ficha.precio_raw) || 0;
  const precioUSD = ficha.moneda === "UYU" ? precioRaw / tcNum : precioRaw;
  const precioUYU = ficha.moneda === "USD" ? precioRaw * tcNum : precioRaw;

  // Total según unidad
  let totalUSD = 0;
  if (precioUSD > 0) {
    if (por === "kg")  totalUSD = precioUSD * calc.total_kg;
    else if (por === "m")  totalUSD = precioUSD * (calc.total_m || 0);
    else if (por === "m2") totalUSD = precioUSD * calc.total_sup;
  }

  const supGranallado = ficha.granallado  ? calc.total_sup * (parseFloat(ficha.pct_granallado)||100)  / 100 : 0;
  const supPintura    = ficha.pintura     ? calc.total_sup * (parseFloat(ficha.pct_pintura)||100)     / 100 : 0;
  const kgGalvanizado = ficha.galvanizado ? calc.total_kg  * (parseFloat(ficha.pct_galvanizado)||100) / 100 : 0;

  const POR_OPTS = pieza.tipo === "plancha"
    ? [["kg","/ kg"],["m2","/ m²"]]
    : [["kg","/ kg"],["m","/ m"]];

  const sufijo = por === "kg" ? "/kg" : por === "m" ? "/m" : "/m²";

  const SECT = { fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:.8,
    color:C.muted, padding:"14px 0 8px", borderBottom:`1px solid ${C.border}44`, marginBottom:12 };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000, background:"#00000066" }}
      onClick={onClose}>
      <div style={{ position:"absolute", right:0, top:0, bottom:0, width:380,
        background:C.card, borderLeft:`2px solid ${C.border}`, padding:24,
        overflowY:"auto", display:"flex", flexDirection:"column", gap:0 }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
          <div>
            <div style={{ fontWeight:800, fontSize:15, color:C.text, marginBottom:2 }}>
              {pieza.material_nombre || "Sin material"}
            </div>
            <div style={{ fontSize:11, color:C.muted }}>
              {pieza.tipo === "perfil"
                ? `${pieza.largo_mm_input || 0} mm × ${pieza.cantidad} ud`
                : `${pieza.largo_mm||0} × ${pieza.ancho_mm||0} mm × ${pieza.cantidad} ud`}
            </div>
          </div>
          <button onClick={onClose}
            style={{ background:"transparent", border:"none", color:C.muted, cursor:"pointer", fontSize:18, padding:"0 4px", lineHeight:1 }}>✕</button>
        </div>

        {/* Resumen kg / m² / metros */}
        <div style={{ display:"flex", gap:8, marginBottom:8 }}>
          <div style={{ flex:1, background:C.iron, borderRadius:8, padding:"8px 12px", textAlign:"center" }}>
            <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:.5 }}>kg total</div>
            <div style={{ fontSize:19, fontWeight:800, color:C.ok }}>{n2(calc.total_kg)}</div>
          </div>
          <div style={{ flex:1, background:C.iron, borderRadius:8, padding:"8px 12px", textAlign:"center" }}>
            <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:.5 }}>m² total</div>
            <div style={{ fontSize:19, fontWeight:800, color:C.teal }}>{n3(calc.total_sup)}</div>
          </div>
          {pieza.tipo === "perfil" && (calc.total_m||0) > 0 && (
            <div style={{ flex:1, background:C.iron, borderRadius:8, padding:"8px 12px", textAlign:"center" }}>
              <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:.5 }}>metros</div>
              <div style={{ fontSize:19, fontWeight:800, color:C.steel }}>{n3(calc.total_m)}</div>
            </div>
          )}
        </div>

        {/* ─── PROCESOS ─── */}
        <div style={SECT}>Procesos</div>

        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:16 }}>

          {/* Granallado */}
          <Toggle on={ficha.granallado} onChange={v=>setF("granallado",v)} label="Granallado" color={C.warn} />
          {ficha.granallado && (
            <div style={{ paddingLeft:46, display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:11, color:C.muted }}>% sup. a granallar:</span>
                <input type="number" min="1" max="100" value={ficha.pct_granallado}
                  onChange={e => setF("pct_granallado", Math.min(100, Math.max(1, parseInt(e.target.value)||100)))}
                  onFocus={e=>e.target.select()}
                  style={{ ...INP, width:56, padding:"3px 6px", textAlign:"right" }} />
                <span style={{ fontSize:11, color:C.muted }}>%</span>
              </div>
              {supGranallado > 0 && (
                <div style={{ fontSize:11, color:C.warn }}>→ {n3(supGranallado)} m² a granallar</div>
              )}
            </div>
          )}

          {/* Pintura */}
          <Toggle on={ficha.pintura} onChange={v=>setF("pintura",v)} label="Pintura" color={C.info} />
          {ficha.pintura && (
            <div style={{ paddingLeft:46, display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:11, color:C.muted }}>% sup. a pintar:</span>
                <input type="number" min="1" max="100" value={ficha.pct_pintura}
                  onChange={e => setF("pct_pintura", Math.min(100, Math.max(1, parseInt(e.target.value)||100)))}
                  onFocus={e=>e.target.select()}
                  style={{ ...INP, width:56, padding:"3px 6px", textAlign:"right" }} />
                <span style={{ fontSize:11, color:C.muted }}>%</span>
              </div>
              {supPintura > 0 && (
                <div style={{ fontSize:11, color:C.info }}>→ {n3(supPintura)} m² a pintar</div>
              )}
            </div>
          )}

          {/* Galvanizado */}
          <Toggle on={ficha.galvanizado} onChange={v=>setF("galvanizado",v)} label="Galvanizado" color={C.gold} />
          {ficha.galvanizado && (
            <div style={{ paddingLeft:46, display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:11, color:C.muted }}>% kg a galvanizar:</span>
                <input type="number" min="1" max="100" value={ficha.pct_galvanizado}
                  onChange={e => setF("pct_galvanizado", Math.min(100, Math.max(1, parseInt(e.target.value)||100)))}
                  onFocus={e=>e.target.select()}
                  style={{ ...INP, width:56, padding:"3px 6px", textAlign:"right" }} />
                <span style={{ fontSize:11, color:C.muted }}>%</span>
              </div>
              {kgGalvanizado > 0 && (
                <div style={{ fontSize:11, color:C.gold }}>→ {n2(kgGalvanizado)} kg a galvanizar</div>
              )}
            </div>
          )}

          {/* Corte de máquina */}
          <Toggle on={ficha.corte_maquina} onChange={v=>setF("corte_maquina",v)} label="Corte de máquina" color={C.pur} />
          {ficha.corte_maquina && (
            <div style={{ paddingLeft:46 }}>
              <select value={ficha.maquina||""}
                onChange={e=>setF("maquina",e.target.value)}
                style={{ ...INP, width:"100%", padding:"5px 8px", fontSize:12, cursor:"pointer" }}>
                <option value="">— Seleccionar máquina —</option>
                {MAQUINAS_OPTS.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* ─── PRECIO ─── */}
        <div style={SECT}>Precio</div>

        {/* Precio por */}
        <div style={{ marginBottom:10 }}>
          <div style={{ fontSize:10, color:C.muted, marginBottom:5 }}>Precio por:</div>
          <div style={{ display:"flex", gap:6 }}>
            {POR_OPTS.map(([val,lbl])=>(
              <button key={val} onClick={()=>setF("precio_por",val)}
                style={{ flex:1, padding:"5px 0", borderRadius:6, fontSize:12, fontWeight:700, cursor:"pointer",
                  background: por===val ? C.steel+"44" : "transparent",
                  color: por===val ? C.text : C.muted,
                  border:`1px solid ${por===val ? C.steel : C.border}` }}>{lbl}</button>
            ))}
          </div>
        </div>

        {/* Moneda */}
        <div style={{ display:"flex", gap:6, marginBottom:8 }}>
          <button onClick={()=>setF("moneda","USD")}
            style={{ flex:1, padding:"6px 0", borderRadius:6, fontSize:12, fontWeight:700, cursor:"pointer",
              background: ficha.moneda==="USD" ? C.accent : "transparent",
              color: ficha.moneda==="USD" ? "#fff" : C.muted,
              border:`1px solid ${ficha.moneda==="USD" ? C.accent : C.border}` }}>USD</button>
          <button onClick={()=>setF("moneda","UYU")}
            style={{ flex:1, padding:"6px 0", borderRadius:6, fontSize:12, fontWeight:700, cursor:"pointer",
              background: ficha.moneda==="UYU" ? C.gold : "transparent",
              color: ficha.moneda==="UYU" ? "#000" : C.muted,
              border:`1px solid ${ficha.moneda==="UYU" ? C.gold : C.border}` }}>UYU</button>
        </div>

        {/* Input precio */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
          <input type="number" min="0" step="0.01" placeholder="Precio"
            value={ficha.precio_raw}
            onChange={e=>setF("precio_raw",e.target.value)}
            onFocus={e=>e.target.select()}
            style={{ ...INP, flex:1, padding:"7px 10px" }} />
          <span style={{ fontSize:12, color:C.muted, whiteSpace:"nowrap" }}>{ficha.moneda}{sufijo}</span>
        </div>

        {/* Precio biblioteca (referencia) */}
        {precioBib > 0 && (
          <div style={{ fontSize:11, color:C.muted, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
            <span>Precio biblioteca:</span>
            <span style={{ color:C.steel }}>{precioBib.toFixed(2)} USD/kg</span>
            {!ficha.precio_raw && (
              <button onClick={()=>{ setF("precio_raw", String(precioBib)); }}
                style={{ fontSize:10, padding:"2px 8px", borderRadius:4, cursor:"pointer",
                  background:C.iron, border:`1px solid ${C.border}`, color:C.muted }}>Usar</button>
            )}
          </div>
        )}

        {/* Conversión y total */}
        {precioRaw > 0 && (
          <div style={{ fontSize:11, color:C.muted, background:C.iron, borderRadius:6, padding:"8px 12px", marginBottom:12 }}>
            <div style={{ color:C.ok }}>
              {ficha.moneda==="USD"
                ? `= ${n2(precioUYU)} UYU${sufijo}`
                : `= ${n2(precioUSD)} USD${sufijo}`}
              <span style={{ color:C.muted }}> (TC: {tcNum})</span>
            </div>
            {totalUSD > 0 && (
              <div style={{ marginTop:4, color:C.steel }}>
                Total: <strong style={{ color:C.text }}>{n2(totalUSD)} USD</strong>
                {por !== "kg" && calc.total_kg > 0 &&
                  <span style={{ color:C.muted }}> · {n2(totalUSD/calc.total_kg)} USD/kg</span>}
              </div>
            )}
          </div>
        )}

        {/* Proveedor */}
        <div style={{ marginBottom:8 }}>
          <div style={{ fontSize:10, color:C.muted, marginBottom:4 }}>Proveedor</div>
          <input type="text" placeholder="Nombre del proveedor"
            value={ficha.proveedor||""}
            onChange={e=>setF("proveedor",e.target.value)}
            style={{ ...INP, width:"100%", padding:"6px 10px", fontSize:12 }} />
        </div>

        {/* Fecha cotización */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10, color:C.muted, marginBottom:4 }}>Fecha de cotización al proveedor</div>
          <input type="date"
            value={ficha.fecha_precio||""}
            onChange={e=>setF("fecha_precio",e.target.value)}
            style={{ ...INP, width:"100%", padding:"6px 10px", fontSize:12,
              color: ficha.fecha_precio ? C.text : C.muted }} />
        </div>

        {/* TC — global, no editable por cómputo */}
        <div style={{ fontSize:11, color:C.muted, marginBottom:16, display:"flex", alignItems:"center", gap:6 }}>
          <span>1 USD = <b style={{ color:C.gold }}>{tcNum}</b> UYU</span>
          <span style={{ color:C.muted }}>(TC global — se edita en la barra lateral)</span>
        </div>

        {/* ─── OBSERVACIONES ─── */}
        <div style={SECT}>Observaciones</div>
        <textarea
          placeholder="Notas de esta pieza: tratamiento especial, etc."
          value={ficha.obs}
          onChange={e=>setF("obs",e.target.value)}
          rows={3}
          style={{ ...INP, resize:"vertical", fontFamily:"inherit", fontSize:12, lineHeight:1.5 }} />

        {/* Badges de estado activo */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:16 }}>
          {ficha.granallado    && <span style={BDG(C.warn,  true)}>◈ Granallado {ficha.pct_granallado}%</span>}
          {ficha.pintura       && <span style={BDG(C.info,  true)}>🎨 Pintura {ficha.pct_pintura}%</span>}
          {ficha.galvanizado   && <span style={BDG(C.gold,  true)}>🔩 Galvanizado {ficha.pct_galvanizado}%</span>}
          {ficha.corte_maquina && <span style={BDG(C.pur,   true)}>⚙ {ficha.maquina||"Corte máq."}</span>}
          {ficha.precio_raw    && <span style={BDG(C.ok,    true)}>$ {ficha.precio_raw} {ficha.moneda}{sufijo}</span>}
          {ficha.proveedor     && <span style={BDG(C.steel, true)}>🏭 {ficha.proveedor}</span>}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FORMULARIO — fila nueva pieza
// ═══════════════════════════════════════════════════════════════
function FormPieza({ tipo, bib, onAgregar, onCancelar }) {
  const [p, setP] = useState(piezaVacia(tipo));
  const opciones  = tipo === "perfil" ? bib.lineales : bib.chapas;
  const set       = (k, v) => setP(prev => ({ ...prev, [k]: v }));
  const elegirMaterial = mat => {
    if (!mat) { setP(prev => ({ ...prev, material_id:"", material_nombre:"", kg_m:0, sup_m2m:0, kg_m2:0 })); return; }
    const precioBib = mat.precio_kg || 0;
    const fichaActual = p.ficha || fichaVacia();
    const fichaConPrecio = precioBib > 0 && !fichaActual.precio_raw
      ? { ...fichaActual, precio_raw: String(precioBib) }
      : fichaActual;
    if (tipo === "perfil") setP(prev => ({ ...prev, material_id:mat.id, material_nombre:mat.nombre, kg_m:mat.kg_m, sup_m2m:mat.sup_m2m, ficha:fichaConPrecio }));
    else                   setP(prev => ({ ...prev, material_id:mat.id, material_nombre:mat.nombre, kg_m2:mat.kg_m2, ficha:fichaConPrecio }));
  };
  const calc  = calcPieza(p);
  const listo = p.material_id &&
    (tipo==="perfil"
      ? parseFloat(p.largo_mm_input)>0
      : parseFloat(p.largo_mm)>0 && parseFloat(p.ancho_mm)>0) &&
    (parseInt(p.cantidad)||0)>0;

  const submit = () => {
    if (!listo) return;
    onAgregar(p);
    // Mantiene el material seleccionado — sólo limpia largo/ancho/cantidad
    // para poder seguir cargando medidas del mismo material sin rebuscarlo.
    setP(prev => ({ ...prev, id: uid(), largo_mm_input:"", largo_mm:"", ancho_mm:"", cantidad:1 }));
    setTimeout(() => document.getElementById("form-pieza-largo")?.focus(), 0);
  };
  const onEnterRow = (e, esUltimo) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (esUltimo) { submit(); return; }
    const inputs = Array.from(e.target.closest("tr").querySelectorAll("input"));
    const idx = inputs.indexOf(e.target);
    if (idx >= 0 && inputs[idx+1]) inputs[idx+1].focus();
  };
  return (
    <tr style={{ background:C.accent+"08", borderTop:`2px solid ${C.accent}44` }}>
      <td style={{ ...TD, width:36, textAlign:"center" }}>
        <span style={BDG(tipo==="perfil"?C.info:C.teal,true)}>{tipo==="perfil"?"▭":"🟦"}</span>
      </td>
      <td style={TD}>
        <Combobox opciones={opciones} value={p.material_id} onChange={elegirMaterial}
          placeholder={tipo==="perfil"?"Buscar perfil…":"Buscar plancha…"} />
      </td>
      <td style={{ ...TD_R,color:C.muted,fontSize:11 }}>
        {tipo==="perfil"
          ? (p.kg_m>0?`${p.kg_m.toFixed(3)}`:"—")
          : (p.kg_m2>0?`${p.kg_m2.toFixed(2)}/m²`:"—")}
      </td>
      <td style={TD}>
        {tipo==="perfil" ? (
          <div style={{ display:"flex",alignItems:"center",gap:4 }}>
            <input id="form-pieza-largo" type="number" placeholder="ej: 1755" value={p.largo_mm_input}
              onChange={e=>set("largo_mm_input",e.target.value)} onFocus={e=>e.target.select()}
              onKeyDown={e=>onEnterRow(e,false)}
              style={{ ...INP,width:88,padding:"5px 8px",textAlign:"right" }} />
            <span style={{ color:C.muted,fontSize:10,whiteSpace:"nowrap" }}>mm</span>
          </div>
        ) : (
          <div style={{ display:"flex",gap:4,alignItems:"center" }}>
            <input id="form-pieza-largo" type="number" value={p.largo_mm} onChange={e=>set("largo_mm",e.target.value)}
              onFocus={e=>e.target.select()} placeholder="largo" onKeyDown={e=>onEnterRow(e,false)}
              style={{ ...INP,width:68,padding:"5px 6px",textAlign:"right" }} />
            <span style={{ color:C.muted,fontSize:10 }}>×</span>
            <input type="number" value={p.ancho_mm} onChange={e=>set("ancho_mm",e.target.value)}
              onFocus={e=>e.target.select()} placeholder="ancho" onKeyDown={e=>onEnterRow(e,false)}
              style={{ ...INP,width:68,padding:"5px 6px",textAlign:"right" }} />
            <span style={{ color:C.muted,fontSize:10,whiteSpace:"nowrap" }}>mm</span>
          </div>
        )}
      </td>
      <td style={TD}>
        <div style={{ display:"flex",alignItems:"center",gap:4 }}>
          <input type="number" min="1" value={p.cantidad}
            onChange={e=>set("cantidad",e.target.value===""?"":parseInt(e.target.value)||1)}
            onBlur={e=>{const v=parseInt(e.target.value);set("cantidad",(!v||v<1)?1:v);}}
            onFocus={e=>e.target.select()} onKeyDown={e=>onEnterRow(e,true)}
            style={{ ...INP,width:54,padding:"5px 6px",textAlign:"right" }} />
          <span style={{ color:C.muted,fontSize:10 }}>ud</span>
        </div>
      </td>
      <td style={{ ...TD_R,color:C.muted,fontSize:12 }}>{p.material_id?n3(calc.kg_pieza):"—"}</td>
      <td style={{ ...TD_R,color:C.ok,fontWeight:700 }}>{p.material_id?n2(calc.total_kg):"—"}</td>
      <td style={{ ...TD_R,color:C.teal,fontSize:12 }}>{p.material_id?n3(calc.total_sup):"—"}</td>
      <td style={{ ...TD,textAlign:"center" }}></td>
      <td style={{ ...TD,textAlign:"center" }}>
        <div style={{ display:"flex",gap:4,justifyContent:"center" }}>
          <button onClick={submit} title="Agregar (Enter)"
            style={{ ...BTN(listo?"ok":"ghost"),padding:"4px 12px",opacity:listo?1:0.4 }}>✓</button>
          <button onClick={onCancelar} title="Cerrar formulario"
            style={{ ...BTN("danger"),padding:"4px 10px" }}>✕</button>
        </div>
      </td>
    </tr>
  );
}

// ═══════════════════════════════════════════════════════════════
// TABLA DE UN ÍTEM — con accordion toggle + ficha por pieza
// ═══════════════════════════════════════════════════════════════
function TablaItem({ item, bib, onChange, expanded, onToggle, onEliminar, onClonar, tc, canDelete }) {
  const [form,        setForm]        = useState(null);
  const [showResumen, setShowResumen] = useState(false);
  const [fichaTarget, setFichaTarget] = useState(null); // id de pieza con ficha abierta
  const [confirmarPiezaId, setConfirmarPiezaId] = useState(null);

  // No cierra el formulario — así se puede seguir cargando largo/cantidad
  // del mismo material sin tener que volver a buscarlo cada vez.
  const agregarPieza  = p     => { onChange({ ...item, piezas: [...item.piezas, p] }); };
  const eliminarPieza = id    => onChange({ ...item, piezas: item.piezas.filter(p=>p.id!==id) });
  const piezaAEliminar = confirmarPiezaId ? item.piezas.find(p=>p.id===confirmarPiezaId) : null;
  const editarPieza   = (id,k,v) => onChange({ ...item, piezas: item.piezas.map(p=>p.id===id?{...p,[k]:v}:p) });
  const updatePieza   = (actualizada)  => onChange({ ...item, piezas: item.piezas.map(p=>p.id===actualizada.id?actualizada:p) });
  const duplicarPieza = id => {
    const idx=item.piezas.findIndex(p=>p.id===id);
    const orig=item.piezas[idx]; if (!orig) return;
    const copia={...orig, id:uid(), ficha:{...(orig.ficha||fichaVacia())}};
    const nuevas=[...item.piezas.slice(0,idx+1),copia,...item.piezas.slice(idx+1)];
    onChange({ ...item, piezas:nuevas });
  };
  const moverPieza = (id,dir) => {
    const idx=item.piezas.findIndex(p=>p.id===id);
    if (dir===-1&&idx===0) return;
    if (dir===1&&idx===item.piezas.length-1) return;
    const arr=[...item.piezas]; [arr[idx],arr[idx+dir]]=[arr[idx+dir],arr[idx]];
    onChange({ ...item, piezas:arr });
  };

  const { filas, totalKg:kgUd } = calcResumen(item.piezas);
  const supUd    = item.piezas.reduce((s,p)=>s+calcPieza(p).total_sup,0);
  const usdUd    = item.piezas.reduce((s,p)=>s+calcPiezaUSD(p,tc),0);
  const cant     = item.cantidad || 1;
  const kgTotal  = kgUd  * cant;
  const supTotal = supUd * cant;
  const usdTotal = usdUd * cant;

  const piezaFicha = fichaTarget ? item.piezas.find(p=>p.id===fichaTarget) : null;

  // Indicadores de ficha por pieza
  const fichaIcono = (p) => {
    const f = p.ficha || fichaVacia();
    const granallado = f.granallado ?? f.arenado ?? false;
    const activos = [granallado&&"◈",f.pintura&&"🎨",f.galvanizado&&"🔩",f.corte_maquina&&"⚙",f.precio_raw&&"$"].filter(Boolean);
    return activos;
  };

  return (
    <>
      {/* Ficha Drawer — se monta sobre todo */}
      {piezaFicha && (
        <FichaDrawer
          pieza={piezaFicha}
          tc={tc}
          bib={bib}
          onClose={()=>setFichaTarget(null)}
          onChange={actualizada=>{updatePieza(actualizada);}}
        />
      )}

      {piezaAEliminar && (
        <ModalConfirmarBorrado
          titulo={`"${piezaAEliminar.material_nombre || "este material"}"`}
          subtitulo="Se pierde esta pieza y su cálculo de kg/m²."
          onConfirm={()=>{ eliminarPieza(confirmarPiezaId); setConfirmarPiezaId(null); }}
          onClose={()=>setConfirmarPiezaId(null)}
        />
      )}

      {/* Cabecera accordion del ítem */}
      <div style={{ background:C.iron, borderRadius:expanded?`10px 10px 0 0`:10,
        border:`1px solid ${C.border}`, marginBottom: expanded ? 0 : 6,
        borderBottom: expanded ? `1px solid ${C.accent}22` : undefined }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", cursor:"pointer" }}
          onClick={onToggle}>
          <span style={{ fontSize:12, color:expanded?C.accent:C.muted, fontWeight:700,
            transition:"transform .2s", display:"inline-block",
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>

          {/* Título editable */}
          <input value={item.titulo}
            onChange={e=>{e.stopPropagation();onChange({...item,titulo:e.target.value});}}
            onClick={e=>e.stopPropagation()}
            onFocus={e=>{e.stopPropagation();e.target.style.background=C.bg;e.target.style.borderColor=C.accent;}}
            onBlur={e=>{e.target.style.background="transparent";e.target.style.borderColor=C.border+"66";}}
            placeholder="Nombre del ítem"
            title="Click para editar el nombre del ítem"
            style={{ ...INP, width:220, fontSize:14, fontWeight:700, padding:"4px 8px",
              background:"transparent", border:`1px solid ${C.border}66`, cursor:"text",
              color:C.text }} />

          {/* N° plano */}
          <div style={{ display:"flex",alignItems:"center",gap:4 }} onClick={e=>e.stopPropagation()}>
            <span style={{ fontSize:10,color:C.muted }}>Plano:</span>
            <input type="text" placeholder="352-S-001" value={item.n_plano||""}
              onChange={e=>onChange({...item,n_plano:e.target.value})}
              style={{ ...INP,width:90,padding:"3px 6px",fontSize:11,background:"transparent",border:`1px solid ${C.border}66` }} />
          </div>

          {/* Cantidad unidades */}
          <div style={{ display:"flex",alignItems:"center",gap:4 }} onClick={e=>e.stopPropagation()}>
            <span style={{ fontSize:10,color:C.muted }}>Ud:</span>
            <input type="number" min="1" value={item.cantidad??1}
              onChange={e=>onChange({...item,cantidad:parseInt(e.target.value)||1})}
              onFocus={e=>e.target.select()}
              style={{ ...INP,width:46,padding:"3px 5px",textAlign:"center",fontSize:13,fontWeight:800,color:C.accent,background:"transparent",border:`1px solid ${C.accent}55` }} />
          </div>

          {/* Stats */}
          <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center" }}>
            {kgTotal>0 && <>
              <span style={BDG(C.ok,true)}>{n2(kgTotal)} kg</span>
              <span style={BDG(C.teal,true)}>{n2(supTotal)} m²</span>
              {usdTotal>0 && <span title="Precio del ítem según cotizaciones cargadas en las fichas de pieza" style={{...BDG(C.gold,true),fontWeight:800}}>${n2(usdTotal)}</span>}
              <span style={{ fontSize:11,color:C.muted }}>{item.piezas.length} pzas</span>
            </>}
            <button onClick={e=>{e.stopPropagation();onClonar();}}
              title="Clonar este ítem completo"
              style={{ background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:13,padding:"2px 4px" }}>⧉</button>
            {canDelete && (
              <button onClick={e=>{e.stopPropagation();onEliminar();}}
                title="Eliminar ítem"
                style={{ background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:12,padding:"2px 4px" }}>✕</button>
            )}
          </div>
        </div>
      </div>

      {/* Cuerpo accordion */}
      {expanded && (
        <div style={{ background:C.card, border:`1px solid ${C.border}`,
          borderTop:"none", borderRadius:`0 0 10px 10px`,
          padding:16, marginBottom:12 }}>

          {/* Tabla de piezas */}
          <div style={{ background:C.bg, borderRadius:8, border:`1px solid ${C.border}`, overflowX:"auto", marginBottom:10 }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:820 }}>
              <thead>
                <tr>
                  <th style={{ ...TH,width:36 }}></th>
                  <th style={TH}>Material</th>
                  <th style={{ ...TH_R,color:C.muted,width:74 }}>kg/m</th>
                  <th style={TH}>Largo / Dims <span style={{ color:C.muted,fontWeight:400 }}>(mm)</span></th>
                  <th style={{ ...TH,width:90,textAlign:"right" }}>Cant. <span style={{ color:C.muted,fontWeight:400 }}>(ud)</span></th>
                  <th style={TH_R}>kg/pieza</th>
                  <th style={{ ...TH_R,color:C.ok }}>kg parcial</th>
                  <th style={{ ...TH_R,color:C.teal }}>Sup (m²)</th>
                  <th style={{ ...TH,width:50,textAlign:"center" }}>Ficha</th>
                  <th style={{ ...TH,width:88 }}></th>
                </tr>
              </thead>
              <tbody>
                {item.piezas.length===0 && !form && (
                  <tr><td colSpan={10} style={{ ...TD,textAlign:"center",color:C.muted,padding:24,fontSize:13 }}>
                    Sin piezas — usá los botones de abajo para agregar
                  </td></tr>
                )}
                {item.piezas.map(p => {
                  const c = calcPieza(p);
                  const iconos = fichaIcono(p);
                  const tieneFicha = iconos.length > 0;
                  return (
                    <tr key={p.id}
                      onMouseEnter={e=>e.currentTarget.style.background=C.iron}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ ...TD,textAlign:"center" }}>
                        <span style={BDG(p.tipo==="perfil"?C.info:C.teal,true)}>{p.tipo==="perfil"?"▭":"🟦"}</span>
                      </td>
                      <td style={{ ...TD,fontWeight:600 }}>{p.material_nombre||<span style={{ color:C.err }}>Sin material</span>}</td>
                      <td style={{ ...TD_R,color:C.muted,fontSize:11 }}>
                        {p.tipo==="perfil"
                          ? (p.kg_m>0?`${p.kg_m.toFixed(3)}`:"—")
                          : (p.kg_m2>0?`${p.kg_m2.toFixed(2)}/m²`:"—")}
                      </td>
                      <td style={TD}>
                        {p.tipo==="perfil" ? (
                          <div style={{ display:"flex",alignItems:"center",gap:4 }}>
                            <input type="number" value={p.largo_mm_input}
                              onChange={e=>editarPieza(p.id,"largo_mm_input",e.target.value)}
                              onFocus={e=>e.target.select()} placeholder="largo"
                              style={{ ...INP,width:80,padding:"3px 6px",textAlign:"right" }} />
                            <span style={{ color:C.muted,fontSize:10 }}>mm</span>
                            {p.largo_mm_input && <span style={{ color:C.steelDk,fontSize:10 }}>({((parseFloat(p.largo_mm_input)||0)/1000).toFixed(3)}m)</span>}
                          </div>
                        ) : (
                          <div style={{ display:"flex",alignItems:"center",gap:4 }}>
                            <input type="number" value={p.largo_mm}
                              onChange={e=>editarPieza(p.id,"largo_mm",e.target.value)}
                              onFocus={e=>e.target.select()} placeholder="largo"
                              style={{ ...INP,width:68,padding:"3px 6px",textAlign:"right" }} />
                            <span style={{ color:C.muted,fontSize:10 }}>×</span>
                            <input type="number" value={p.ancho_mm}
                              onChange={e=>editarPieza(p.id,"ancho_mm",e.target.value)}
                              onFocus={e=>e.target.select()} placeholder="ancho"
                              style={{ ...INP,width:68,padding:"3px 6px",textAlign:"right" }} />
                            <span style={{ color:C.muted,fontSize:10 }}>mm</span>
                          </div>
                        )}
                      </td>
                      <td style={{ ...TD,textAlign:"right" }}>
                        <div style={{ display:"flex",alignItems:"center",justifyContent:"flex-end",gap:4 }}>
                          <input type="number" min="1" value={p.cantidad}
                            onChange={e=>editarPieza(p.id,"cantidad",e.target.value===""?"":parseInt(e.target.value)||1)}
                            onBlur={e=>{const v=parseInt(e.target.value);editarPieza(p.id,"cantidad",(!v||v<1)?1:v);}}
                            onFocus={e=>e.target.select()}
                            style={{ ...INP,width:54,textAlign:"right",padding:"3px 5px" }} />
                          <span style={{ color:C.muted,fontSize:10 }}>ud</span>
                        </div>
                      </td>
                      <td style={{ ...TD_R,color:C.steel }}>{n3(c.kg_pieza)}</td>
                      <td style={{ ...TD_R,color:C.ok,fontWeight:700 }}>{n2(c.total_kg)}</td>
                      <td style={{ ...TD_R,color:C.teal }}>{n3(c.total_sup)}</td>
                      {/* BOTÓN FICHA */}
                      <td style={{ ...TD,textAlign:"center" }}>
                        <button
                          onClick={()=>setFichaTarget(fichaTarget===p.id?null:p.id)}
                          title="Abrir ficha de pieza"
                          style={{ background: tieneFicha ? C.accent+"22" : "transparent",
                            border:`1px solid ${tieneFicha?C.accent:C.border}44`,
                            borderRadius:6, padding:"3px 7px", cursor:"pointer",
                            color: tieneFicha ? C.accent : C.muted, fontSize:12, fontWeight:700 }}>
                          {tieneFicha ? iconos.join("") : "⚙"}
                        </button>
                      </td>
                      <td style={{ ...TD,textAlign:"center" }}>
                        <div style={{ display:"flex",gap:2,justifyContent:"center" }}>
                          <button onClick={()=>moverPieza(p.id,-1)} title="Subir"
                            style={{ background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:12,padding:"2px 3px" }}>↑</button>
                          <button onClick={()=>moverPieza(p.id,1)} title="Bajar"
                            style={{ background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:12,padding:"2px 3px" }}>↓</button>
                          <button onClick={()=>duplicarPieza(p.id)} title="Duplicar"
                            style={{ background:"transparent",border:"none",color:C.info,cursor:"pointer",fontSize:12,padding:"2px 3px" }}>⧉</button>
                          <button onClick={()=>setConfirmarPiezaId(p.id)} title="Eliminar"
                            style={{ background:"transparent",border:"none",color:C.err,cursor:"pointer",fontSize:13,padding:"2px 3px" }}>✕</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {form && <FormPieza tipo={form} bib={bib} onAgregar={agregarPieza} onCancelar={()=>setForm(null)} />}
              </tbody>
              {item.piezas.length>0 && (
                <tfoot>
                  <tr style={{ background:C.iron, borderTop:`2px solid ${C.border}` }}>
                    <td colSpan={6} style={{ ...TD,color:C.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5 }}>
                      1 unidad
                    </td>
                    <td style={{ ...TD_R,color:C.steel,fontWeight:700 }}>{n2(kgUd)} kg</td>
                    <td style={{ ...TD_R,color:C.teal }}>{n2(supUd)} m²</td>
                    <td colSpan={2}></td>
                  </tr>
                  {cant>1 && (
                    <tr style={{ background:C.accent+"10" }}>
                      <td colSpan={6} style={{ ...TD,color:C.accent,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5 }}>
                        × {cant} unidades
                      </td>
                      <td style={{ ...TD_R,color:C.ok,fontWeight:800,fontSize:15 }}>{n2(kgTotal)} kg</td>
                      <td style={{ ...TD_R,color:C.teal,fontWeight:700 }}>{n2(supTotal)} m²</td>
                      <td colSpan={2}></td>
                    </tr>
                  )}
                </tfoot>
              )}
            </table>
          </div>

          {/* Botones agregar */}
          {!form && (
            <div style={{ display:"flex",gap:8,marginBottom:16 }}>
              <button onClick={()=>setForm("perfil")}  style={{ ...BTN("ghost"),borderColor:C.info+"66",color:C.info }}>+ Perfil / planchuela</button>
              <button onClick={()=>setForm("plancha")} style={{ ...BTN("ghost"),borderColor:C.teal+"66",color:C.teal }}>+ Plancha</button>
            </div>
          )}

          {/* Resumen por material */}
          {filas.length>0 && (
            <div style={{ background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden" }}>
              <button onClick={()=>setShowResumen(v=>!v)}
                style={{ width:"100%",background:"transparent",border:"none",
                  borderBottom:showResumen?`1px solid ${C.border}`:"none",
                  padding:"9px 14px",display:"flex",alignItems:"center",gap:8,cursor:"pointer",color:C.muted }}>
                <span style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,color:C.steel }}>
                  Resumen por material — 1 unidad
                </span>
                <span style={{ marginLeft:"auto",fontSize:11 }}>{showResumen?"▲ Ocultar":"▼ Ver"}</span>
              </button>
              {showResumen && (
                <div style={{ padding:14 }}>
                  <table style={{ width:"100%",borderCollapse:"collapse" }}>
                    <thead><tr>
                      <th style={TH}>Material</th>
                      <th style={TH_R}>Piezas</th>
                      <th style={TH_R}>Metros</th>
                      <th style={{ ...TH_R,color:C.ok }}>kg (1 ud)</th>
                      <th style={{ ...TH_R,color:C.accent }}>kg total</th>
                      <th style={{ ...TH_R,color:C.teal }}>Sup m²</th>
                      <th style={{ ...TH_R,color:C.pur }}>Incidencia</th>
                    </tr></thead>
                    <tbody>
                      {filas.sort((a,b)=>b.kg-a.kg).map(f=>(
                        <tr key={f.nombre}
                          onMouseEnter={e=>e.currentTarget.style.background=C.iron}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <td style={{ ...TD,fontWeight:600 }}>{f.nombre}</td>
                          <td style={TD_R}>{f.piezas}</td>
                          <td style={{ ...TD_R,color:C.steel }}>{f.metros>0?n2(f.metros):"—"}</td>
                          <td style={{ ...TD_R,color:C.ok,fontWeight:700 }}>{n2(f.kg)}</td>
                          <td style={{ ...TD_R,color:C.accent,fontWeight:700 }}>{n2(f.kg*cant)}</td>
                          <td style={{ ...TD_R,color:C.teal }}>{n3(f.sup)}</td>
                          <td style={{ ...TD_R,color:C.pur,fontWeight:700 }}>
                            {kgUd>0?`${(f.kg/kgUd*100).toFixed(1)}%`:"—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════
export default function Computo({ onNidar, onExportarPresupuesto, usuario, tcGlobal }) {
  const [computos,      setComputos]      = useState(() => loadLS("smeas_computos", []));
  const [selId,         setSelId]         = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [creando,       setCreando]       = useState(false);
  const [nuevo,         setNuevo]         = useState({ nombre:"", fecha:new Date().toISOString().split("T")[0], nro:"", cliente:"" });
  const [confirmarDelId, setConfirmarDelId] = useState(null);
  const [busqNombre,    setBusqNombre]    = useState("");
  const [busqCliente,   setBusqCliente]   = useState("");
  const [fDesde,        setFDesde]        = useState("");
  const [fHasta,        setFHasta]        = useState("");
  const bib = useBiblioteca();

  useEffect(() => { saveLS("smeas_computos", computos); }, [computos]);

  // Ir directo a un cómputo desde el Buscador global
  useEffect(() => {
    const pendId = loadLS("smeas_ir_a_computo", null);
    if (!pendId) return;
    saveLS("smeas_ir_a_computo", null);
    setSelId(pendId);
  }, []); // eslint-disable-line

  // Al seleccionar computo, expandir primer ítem por defecto
  useEffect(() => {
    const comp = computos.find(c=>c.id===selId);
    if (comp?.items?.length) {
      setExpandedItems(new Set([comp.items[0].id]));
    }
  }, [selId]); // eslint-disable-line

  const computo = computos.find(c=>c.id===selId) || null;

  const crearComputo = () => {
    if (!nuevo.nombre.trim()) return;
    const counter = (loadLS("smeas_computo_nro",0)) + 1;
    saveLS("smeas_computo_nro", counter);
    const nro = nuevo.nro?.trim() || `C-${String(counter).padStart(3,"0")}`;
    const c = { ...computoVacio(), nro, nombre:nuevo.nombre.trim(), fecha:nuevo.fecha, cliente:(nuevo.cliente||"").trim() };
    setComputos(prev=>[c,...prev]);
    setSelId(c.id); setCreando(false);
    setNuevo({ nombre:"", fecha:new Date().toISOString().split("T")[0], nro:"", cliente:"" });
  };

  const clonarComputo = (c) => {
    const counter = (loadLS("smeas_computo_nro",0)) + 1;
    saveLS("smeas_computo_nro", counter);
    const nro = `C-${String(counter).padStart(3,"0")}`;
    const nuevoC = {
      ...c, id: uid(), nro, nombre: `${c.nombre} (copia)`,
      items: c.items.map(it => ({
        ...it, id: uid(),
        piezas: it.piezas.map(p => ({ ...p, id: uid(), ficha: { ...p.ficha } })),
      })),
      ...stamp(),
    };
    setComputos(prev=>[nuevoC,...prev]);
    setSelId(nuevoC.id);
  };

  const computosFiltrados = computos.filter(c => {
    const enNombre  = !busqNombre  || [c.nombre,c.nro].join(" ").toLowerCase().includes(busqNombre.toLowerCase());
    const enCliente = !busqCliente || (c.cliente||"").toLowerCase().includes(busqCliente.toLowerCase());
    const enDesde   = !fDesde || (c.fecha||"") >= fDesde;
    const enHasta   = !fHasta || (c.fecha||"") <= fHasta;
    return enNombre && enCliente && enDesde && enHasta;
  });

  const eliminarComputo = id => {
    setComputos(prev=>prev.filter(c=>c.id!==id));
    if (selId===id) setSelId(null);
  };
  const computoAEliminar = confirmarDelId ? computos.find(c=>c.id===confirmarDelId) : null;

  const updateComputo = (upd) => setComputos(prev=>prev.map(c=>c.id===upd.id?touch(upd):c));

  const updateItem = (itemAct) => {
    if (!computo) return;
    updateComputo({ ...computo, items:computo.items.map(it=>it.id===itemAct.id?itemAct:it) });
  };

  const agregarItem = () => {
    if (!computo) return;
    const n = computo.items.length+1;
    const nuevo = itemVacio(n);
    updateComputo({ ...computo, items:[...computo.items, nuevo] });
    setExpandedItems(prev=>new Set([...prev, nuevo.id]));
  };

  const eliminarItem = (id) => {
    if (!computo || computo.items.length<=1) return;
    if (!window.confirm("¿Eliminar este ítem?")) return;
    updateComputo({ ...computo, items:computo.items.filter(it=>it.id!==id) });
    setExpandedItems(prev=>{ const n=new Set(prev); n.delete(id); return n; });
  };

  const clonarItem = (item) => {
    if (!computo) return;
    const nuevo = {
      ...item, id: uid(), titulo: `${item.titulo} (copia)`,
      piezas: item.piezas.map(p => ({ ...p, id: uid(), ficha: { ...p.ficha } })),
    };
    const idx = computo.items.findIndex(it => it.id === item.id);
    const items = [...computo.items];
    items.splice(idx+1, 0, nuevo);
    updateComputo({ ...computo, items });
    setExpandedItems(prev => new Set([...prev, nuevo.id]));
  };

  const toggleItem = id => setExpandedItems(prev=>{
    const n=new Set(prev);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });

  const totalesGlobales = computo ? (() => {
    let kg=0, sup=0;
    const multTotal = computo.cantidad_total || 1;
    computo.items.forEach(it=>{
      const cant=it.cantidad||1;
      it.piezas.forEach(p=>{
        const c=calcPieza(p);
        kg  += c.total_kg  * cant;
        sup += c.total_sup * cant;
      });
    });
    return { kg: kg*multTotal, sup: sup*multTotal };
  })() : null;

  // ── VISTA: GRID DE OBRAS ─────────────────────────────────────
  if (!selId) {
    return (
      <div>
        {computoAEliminar && (
          <ModalConfirmarEliminar
            titulo={`cómputo "${computoAEliminar.nombre||"Sin nombre"}"`}
            onConfirm={() => { eliminarComputo(computoAEliminar.id); setConfirmarDelId(null); }}
            onClose={() => setConfirmarDelId(null)}
          />
        )}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
          <span style={{ fontSize:20 }}>📐</span>
          <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:C.text }}>Cómputo de Materiales</h2>
          <span style={BDG(C.info,true)}>MÓDULO 2</span>
          <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={()=>setCreando(v=>!v)}
              style={{ ...BTN("primary"), padding:"6px 18px", fontSize:12 }}>+ Nuevo cómputo</button>
          </div>
        </div>

        {/* Formulario nuevo computo */}
        {creando && (
          <div style={{ background:C.iron, border:`1px solid ${C.accent}44`, borderRadius:10,
            padding:20, marginBottom:20, maxWidth:480 }}>
            <div style={{ fontWeight:700, fontSize:14, color:C.accent, marginBottom:14 }}>Nuevo cómputo</div>
            <label style={LBL}>Nombre obra</label>
            <input type="text" placeholder="Ej: Galpón CCFC" value={nuevo.nombre}
              onChange={e=>setNuevo(v=>({...v,nombre:e.target.value}))}
              onKeyDown={e=>e.key==="Enter"&&crearComputo()}
              autoFocus style={{ ...INP,marginBottom:10 }} />
            <label style={LBL}>N° Cómputo <span style={{ fontWeight:400 }}>(se genera solo)</span></label>
            <input type="text"
              placeholder={`C-${String((loadLS("smeas_computo_nro",0))+1).padStart(3,"0")}`}
              value={nuevo.nro} onChange={e=>setNuevo(v=>({...v,nro:e.target.value}))}
              style={{ ...INP,marginBottom:10 }} />
            <label style={LBL}>Fecha</label>
            <input type="date" value={nuevo.fecha}
              onChange={e=>setNuevo(v=>({...v,fecha:e.target.value}))}
              style={{ ...INP,marginBottom:10 }} />
            <label style={LBL}>Cliente</label>
            <input type="text" placeholder="Ej: CCFC" value={nuevo.cliente} list="clientes-datalist"
              onChange={e=>setNuevo(v=>({...v,cliente:e.target.value}))}
              onBlur={e=>registrarCliente(e.target.value)}
              style={{ ...INP,marginBottom:14 }} />
            <div style={{ display:"flex",gap:8 }}>
              <button onClick={crearComputo} style={{ ...BTN("ok"),flex:1 }}>Crear</button>
              <button onClick={()=>setCreando(false)} style={{ ...BTN("ghost"),flex:1 }}>Cancelar</button>
            </div>
          </div>
        )}

        {computos.length===0 && !creando && (
          <div style={{ textAlign:"center", color:C.muted, padding:"60px 0", fontSize:14 }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📐</div>
            <div>No hay cómputos aún. Creá el primero.</div>
          </div>
        )}

        {computos.length > 0 && (
          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
            <input type="text" placeholder="🔍 Nombre / N°…" value={busqNombre} onChange={e=>setBusqNombre(e.target.value)}
              style={{ ...INP, width:170, padding:"6px 10px" }}/>
            <input type="text" placeholder="🔍 Cliente…" list="clientes-datalist" value={busqCliente} onChange={e=>setBusqCliente(e.target.value)}
              style={{ ...INP, width:150, padding:"6px 10px" }}/>
            <input type="date" value={fDesde} onChange={e=>setFDesde(e.target.value)} title="Desde"
              style={{ ...INP, width:140, padding:"6px 8px" }}/>
            <input type="date" value={fHasta} onChange={e=>setFHasta(e.target.value)} title="Hasta"
              style={{ ...INP, width:140, padding:"6px 8px" }}/>
            <span style={{ fontSize:11, color:C.muted }}>{computosFiltrados.length} de {computos.length}</span>
          </div>
        )}

        {computos.length > 0 && computosFiltrados.length === 0 && (
          <div style={{ textAlign:"center", color:C.muted, padding:"40px 0", fontSize:13 }}>Sin resultados.</div>
        )}

        {/* Grid de obras */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:14 }}>
          {computosFiltrados.map(c => {
            const multTotal = c.cantidad_total || 1;
            const tot = c.items.reduce((s,it)=>s+it.piezas.reduce((s2,p)=>s2+calcPieza(p).total_kg,0)*(it.cantidad||1),0) * multTotal;
            const sup = c.items.reduce((s,it)=>s+it.piezas.reduce((s2,p)=>s2+calcPieza(p).total_sup,0)*(it.cantidad||1),0) * multTotal;
            return (
              <div key={c.id}
                style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12,
                  padding:20, cursor:"pointer", transition:"border-color .15s",
                  display:"flex", flexDirection:"column", gap:10 }}
                onClick={()=>setSelId(c.id)}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent+"88"}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                {/* Header */}
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
                  <div>
                    {c.nro && <span style={{ ...BDG(C.accent,true), marginBottom:6, display:"inline-block" }}>{c.nro}</span>}
                    {multTotal>1 && <span style={{ ...BDG(C.pur,true), marginBottom:6, marginLeft:6, display:"inline-block" }}>×{multTotal} estructuras</span>}
                    <div style={{ fontWeight:800, fontSize:15, color:C.text, lineHeight:1.3, marginTop:4 }}>{c.nombre||"Sin nombre"}</div>
                    <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{c.fecha}{c.cliente?` · ${c.cliente}`:""}</div>
                  </div>
                </div>
                {/* Stats */}
                <div style={{ display:"flex", gap:8 }}>
                  <div style={{ flex:1, background:C.iron, borderRadius:8, padding:"10px 12px" }}>
                    <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:.5 }}>Total kg</div>
                    <div style={{ fontSize:22, fontWeight:800, color:C.ok }}>{tot>0?n2(tot):"—"}</div>
                  </div>
                  <div style={{ flex:1, background:C.iron, borderRadius:8, padding:"10px 12px" }}>
                    <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:.5 }}>Superficie</div>
                    <div style={{ fontSize:22, fontWeight:800, color:C.teal }}>{sup>0?n2(sup):"—"} <span style={{ fontSize:13 }}>m²</span></div>
                  </div>
                </div>
                {/* Footer */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:11, color:C.muted }}>{c.items.length} ítem{c.items.length!==1?"s":""}</span>
                  <div style={{ display:"flex", gap:6 }} onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>clonarComputo(c)} title="Clonar este cómputo completo"
                      style={{ ...BTN("ghost"), padding:"4px 10px", fontSize:11 }}>
                      ⧉ Clonar
                    </button>
                    <button onClick={()=>{saveLS("smeas_anidar_pending",c.id); onNidar&&onNidar();}}
                      style={{ ...BTN("ghost"), padding:"4px 10px", fontSize:11, borderColor:C.pur+"66", color:C.pur }}>
                      ✂️ Anidar
                    </button>
                    {puedeEliminar(usuario) && (
                      <button onClick={()=>setConfirmarDelId(c.id)}
                        style={{ ...BTN("danger"), padding:"4px 10px", fontSize:11 }}>
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── VISTA: DETALLE DE OBRA ───────────────────────────────────
  if (!computo) { setSelId(null); return null; }
  const tc = computo.tc ?? tcGlobal;

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
        <button onClick={()=>setSelId(null)}
          style={{ background:"transparent", border:"none", color:C.accent, cursor:"pointer",
            fontSize:13, fontWeight:700, padding:"4px 0" }}>
          ← Obras
        </button>
        <span style={{ color:C.border }}>/</span>
        <span style={{ fontSize:13, color:C.muted }}>
          {computo.nro && <span style={{ fontWeight:800, color:C.accent, marginRight:6 }}>{computo.nro}</span>}
          {computo.nombre}
        </span>
      </div>

      {/* Encabezado obra */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12,
        padding:"16px 20px", marginBottom:20, display:"flex", alignItems:"center",
        gap:16, flexWrap:"wrap" }}>
        <div>
          <input value={computo.nombre}
            onChange={e=>updateComputo({...computo,nombre:e.target.value})}
            onFocus={e=>{e.target.style.background=C.iron;e.target.style.borderColor=C.accent;}}
            onBlur={e=>{e.target.style.background="transparent";e.target.style.borderColor=C.border+"66";}}
            title="Click para editar el nombre de la obra"
            style={{ ...INP, fontSize:17, fontWeight:800, background:"transparent",
              border:`1px solid ${C.border}66`, padding:"2px 6px", width:"auto", minWidth:200, cursor:"text" }} />
          <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{computo.fecha}</div>
        </div>

        {/* Cantidad total del cómputo — multiplicador de estructuras iguales */}
        <div style={{ display:"flex", alignItems:"center", gap:6, background:C.iron,
          border:`1px solid ${C.accent}55`, borderRadius:8, padding:"6px 12px" }}>
          <span style={{ fontSize:11, color:C.muted }}>Cant. total obra:</span>
          <input type="number" min="1" step="1"
            value={computo.cantidad_total ?? 1}
            onChange={e=>updateComputo({...computo,cantidad_total:parseInt(e.target.value)||1})}
            onFocus={e=>e.target.select()}
            style={{ ...INP,width:50,padding:"3px 6px",textAlign:"center",background:"transparent",border:`1px solid ${C.accent}66`,fontSize:14,fontWeight:800,color:C.accent }} />
          <span style={{ fontSize:10, color:C.muted }}>estructura{(computo.cantidad_total??1)!==1?"s":""} igual{(computo.cantidad_total??1)!==1?"es":""}</span>
        </div>

        {/* Totales */}
        {totalesGlobales && totalesGlobales.kg>0 && <>
          <div style={{ background:C.iron, border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 14px", textAlign:"center" }}>
            <div style={{ fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:.5 }}>Total obra</div>
            <div style={{ fontSize:20,fontWeight:800,color:C.ok }}>{n2(totalesGlobales.kg)} kg</div>
          </div>
          <div style={{ background:C.iron, border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 14px", textAlign:"center" }}>
            <div style={{ fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:.5 }}>Superficie</div>
            <div style={{ fontSize:20,fontWeight:800,color:C.teal }}>{n2(totalesGlobales.sup)} m²</div>
          </div>
        </>}

        <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
          <button onClick={()=>{saveLS("smeas_anidar_pending",selId);onNidar&&onNidar();}}
            style={{ ...BTN("ghost"),borderColor:C.pur+"66",color:C.pur,display:"flex",alignItems:"center",gap:6,fontWeight:700 }}>
            ✂️ Anidar
          </button>
        </div>
      </div>

      {/* Ítems accordion */}
      <div style={{ marginBottom:12 }}>
        {computo.items.map(item => (
          <TablaItem
            key={item.id}
            item={item}
            bib={bib}
            onChange={updateItem}
            expanded={expandedItems.has(item.id)}
            onToggle={()=>toggleItem(item.id)}
            onEliminar={()=>eliminarItem(item.id)}
            onClonar={()=>clonarItem(item)}
            tc={tc}
            canDelete={computo.items.length>1}
          />
        ))}
      </div>

      <button onClick={agregarItem}
        style={{ ...BTN("ghost"), padding:"7px 18px", fontSize:12, borderColor:C.accent+"66", color:C.accent }}>
        + Ítem
      </button>
    </div>
  );
}
