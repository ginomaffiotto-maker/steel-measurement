import { useState } from "react";
import { C, CARD } from "../styles/colors";
import { loadLS } from "../utils/storage";
import FiltrosBar from "./FiltrosBar";
import { FAMILIAS, TIPOS_TRABAJO, familiaDe } from "../utils/taxonomia";
import { calcPresupuesto } from "./Presupuesto";
import { HISTORIAL_SEED } from "../utils/historialSeed";

// ─── HELPERS DE FORMATO ────────────────────────────────────────────
const n0 = v => Math.round(+v || 0).toLocaleString("es-UY");
const n2 = v => (+v || 0).toLocaleString("es-UY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fU = v => "U$S " + n0(v);
const medal = i => ["🥇", "🥈", "🥉"][i] || "";

// ─── KPI / BARRA — mismo lenguaje visual que el Dashboard de steelCRM ──
function KPI({ label, value, sub, color = C.accent, cmp, icon }) {
  return (
    <div style={{ ...CARD(), borderTop: `3px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>{icon} {label}</div>
        {cmp && (
          <span style={{ fontSize: 10, fontWeight: 800, color: cmp.pos ? C.ok : C.err, background: (cmp.pos ? C.ok : C.err) + "18", borderRadius: 4, padding: "1px 6px", whiteSpace: "nowrap" }}>
            {cmp.pos ? "▲" : "▼"} {Math.abs(cmp.val)}%
          </span>
        )}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color, margin: "4px 0" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
function Bar({ pct, color = C.accent, h = 8 }) {
  return (
    <div style={{ height: h, borderRadius: 3, background: C.border, overflow: "hidden", margin: "5px 0" }}>
      <div style={{ height: "100%", width: `${Math.min(pct || 0, 100)}%`, background: color, borderRadius: 3, transition: "width .4s" }} />
    </div>
  );
}

// ─── PERÍODO — mismo esquema que steelCRM (comparación vs. período anterior) ──
const PERIODOS = [
  { key: "1m", lbl: "Último mes" },
  { key: "3m", lbl: "Últ. 3m" },
  { key: "6m", lbl: "Últ. 6m" },
  { key: "anio", lbl: "Este año" },
  { key: "todo", lbl: "Todo" },
];
function getFechaDesde(per) {
  const d = new Date();
  if (per === "1m") { d.setMonth(d.getMonth() - 1); return d.toISOString().split("T")[0]; }
  if (per === "3m") { d.setMonth(d.getMonth() - 3); return d.toISOString().split("T")[0]; }
  if (per === "6m") { d.setMonth(d.getMonth() - 6); return d.toISOString().split("T")[0]; }
  if (per === "anio") return new Date().getFullYear() + "-01-01";
  return null;
}
function getPeriodoAnterior(per) {
  const d = new Date();
  if (per === "1m") { const hasta = new Date(d); hasta.setMonth(d.getMonth() - 1); const desde = new Date(d); desde.setMonth(d.getMonth() - 2); return { desde: desde.toISOString().split("T")[0], hasta: hasta.toISOString().split("T")[0] }; }
  if (per === "3m") { const hasta = new Date(d); hasta.setMonth(d.getMonth() - 3); const desde = new Date(d); desde.setMonth(d.getMonth() - 6); return { desde: desde.toISOString().split("T")[0], hasta: hasta.toISOString().split("T")[0] }; }
  if (per === "6m") { const hasta = new Date(d); hasta.setMonth(d.getMonth() - 6); const desde = new Date(d); desde.setMonth(d.getMonth() - 12); return { desde: desde.toISOString().split("T")[0], hasta: hasta.toISOString().split("T")[0] }; }
  if (per === "anio") { const anio = d.getFullYear() - 1; return { desde: anio + "-01-01", hasta: anio + "-12-31" }; }
  return null;
}
function calcDelta(actual, anterior) {
  if (!anterior) return null;
  const v = +(((actual - anterior) / anterior) * 100).toFixed(1);
  return { val: v, pos: v >= 0 };
}
function getUltimosMeses(n) {
  const NOMBRES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const hoy = new Date();
  const meses = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    meses.push({ key: d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"), lbl: NOMBRES[d.getMonth()] + " " + String(d.getFullYear()).slice(2) });
  }
  return meses;
}

// ─── NORMALIZACIÓN — Presupuesto e Historial a una forma común ────────
// Los materiales (hierros por nombre) sólo existen en Presupuesto — un
// trabajo de Historial es un agregado (% por rubro), no tiene desglose
// pieza por pieza. Los presupuestos históricos aproximados (origen_historico)
// tampoco tienen materiales reales: su "hierro" es la categoría entera
// puesta como nombre (ver PLAN-HISTORIAL.md §9.21) — se excluyen del ranking de
// materiales para no mezclar un nombre de categoría con un material real.
function normalizarPresupuesto(p) {
  const c = calcPresupuesto(p);
  const materiales = p.origen_historico ? [] : (p.items || []).flatMap(it => it.hierros || []);
  return {
    fuente: "presupuesto", fecha: p.fecha || "", cliente: (p.cliente || "").trim(),
    categoria: p.categoria || "", tipo_trabajo: p.tipo_trabajo || "", vendedor: p.vendedor || "",
    kg: c.total_kg, usd: c.gran_total, materiales,
  };
}
function normalizarTrabajo(t) {
  return {
    fuente: "historial", fecha: t.fecha || "", cliente: (t.cliente || "").trim(),
    categoria: t.categoria || "", tipo_trabajo: t.tipo_trabajo || "", vendedor: t.vendedor || "",
    kg: +t.kg_total || 0, usd: +t.usd_total || 0, materiales: [],
  };
}

// ─── FILTROS ───────────────────────────────────────────────────────
// Barra compartida (FiltrosBar.jsx, 2026-08-25) — este era el original del
// que se copió el patrón para el resto de las pantallas; ahora usa el mismo
// componente para no mantener dos implementaciones del mismo look.
const FILT_DEFAULTS = { fuente: "ambos", periodo: "6m", desde: "", hasta: "", categoria: "", familia: "", tipo: "", vendedor: "", cliente: "" };
function dashCampos(usuarios) {
  const campos = [
    { key: "fuente", label: "Fuente", type: "select", minWidth: 130,
      options: [{ value: "ambos", label: "Ambos" }, { value: "presupuesto", label: "Presupuesto" }, { value: "historial", label: "Historial" }] },
    { key: "periodo", label: "Período", type: "select", minWidth: 130, options: PERIODOS.map(p => ({ value: p.key, label: p.lbl })) },
    { key: "desde", label: "Desde", type: "date", minWidth: 150 },
    { key: "hasta", label: "Hasta", type: "date", minWidth: 150 },
    { key: "categoria", label: "Categoría", type: "groupedSelect", minWidth: 170, options: FAMILIAS },
    { key: "familia", label: "Familia", type: "select", minWidth: 170, options: Object.keys(FAMILIAS) },
    { key: "tipo", label: "Tipo", type: "select", minWidth: 140, options: TIPOS_TRABAJO },
  ];
  if (usuarios.length > 0) campos.push({ key: "vendedor", label: "Vendedor", type: "select", minWidth: 170, options: usuarios.map(u => ({ value: u.id, label: u.nombre })) });
  campos.push({ key: "cliente", label: "Cliente / Empresa", type: "clienteAuto", flex: 1, minWidth: 160, placeholder: "Buscar…" });
  return campos;
}

// ─── PESTAÑA RESUMEN ───────────────────────────────────────────────
function TabResumen({ actual, anterior }) {
  const kgTot = actual.reduce((s, r) => s + r.kg, 0);
  const usdTot = actual.reduce((s, r) => s + r.usd, 0);
  const usdKgProm = kgTot > 0 ? usdTot / kgTot : 0;
  const empresas = new Set(actual.map(r => r.cliente.toLowerCase()).filter(Boolean));

  const kgAnt = anterior.reduce((s, r) => s + r.kg, 0);
  const usdAnt = anterior.reduce((s, r) => s + r.usd, 0);
  const empresasAnt = new Set(anterior.map(r => r.cliente.toLowerCase()).filter(Boolean));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
      <KPI icon="📋" label="Presupuestos" value={n0(actual.length)} color={C.accent} cmp={calcDelta(actual.length, anterior.length)} />
      <KPI icon="💰" label="Monto total" value={fU(usdTot)} color={C.ok} cmp={calcDelta(usdTot, usdAnt)} />
      <KPI icon="⚖️" label="Kg totales" value={n0(kgTot)} color={C.info} cmp={calcDelta(kgTot, kgAnt)} />
      <KPI icon="📐" label="USD/kg promedio" value={n2(usdKgProm)} color={C.gold} />
      <KPI icon="🏢" label="Empresas cotizadas" value={n0(empresas.size)} color={C.pur} cmp={calcDelta(empresas.size, empresasAnt.size)} />
    </div>
  );
}

// ─── PESTAÑA TENDENCIA ─────────────────────────────────────────────
function TabTendencia({ registros }) {
  const meses = getUltimosMeses(12);
  const porMes = meses.map(m => {
    const delMes = registros.filter(r => r.fecha && r.fecha.slice(0, 7) === m.key);
    return { ...m, usd: delMes.reduce((s, r) => s + r.usd, 0), kg: delMes.reduce((s, r) => s + r.kg, 0), n: delMes.length };
  });
  const maxUsd = Math.max(1, ...porMes.map(m => m.usd));
  return (
    <div style={CARD()}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.steel, marginBottom: 14 }}>Últimos 12 meses — monto USD</div>
      {porMes.map(m => (
        <div key={m.key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 50, fontSize: 11, color: C.muted }}>{m.lbl}</div>
          <div style={{ flex: 1 }}><Bar pct={m.usd / maxUsd * 100} color={C.accent} h={14} /></div>
          <div style={{ width: 110, textAlign: "right", fontSize: 12, fontWeight: 700, color: C.text }}>{fU(m.usd)}</div>
          <div style={{ width: 60, textAlign: "right", fontSize: 11, color: C.muted }}>{m.n} pres.</div>
        </div>
      ))}
    </div>
  );
}

// ─── PESTAÑA EMPRESAS ──────────────────────────────────────────────
function TabEmpresas({ registros }) {
  const porEmpresa = {};
  registros.forEach(r => {
    const key = r.cliente || "(sin cliente)";
    if (!porEmpresa[key]) porEmpresa[key] = { nombre: key, usd: 0, kg: 0, n: 0 };
    porEmpresa[key].usd += r.usd; porEmpresa[key].kg += r.kg; porEmpresa[key].n += 1;
  });
  const ranking = Object.values(porEmpresa).filter(e => e.nombre !== "(sin cliente)").sort((a, b) => b.usd - a.usd).slice(0, 20);
  if (ranking.length === 0) return <div style={{ textAlign: "center", padding: 40, color: C.muted, fontSize: 13 }}>Sin datos para este filtro.</div>;
  const maxUsd = ranking[0].usd || 1;
  return (
    <div style={CARD()}>
      {ranking.map((e, i) => (
        <div key={e.nombre} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 24, textAlign: "center", fontSize: 14 }}>{medal(i) || (i + 1)}</div>
          <div style={{ width: 160, fontSize: 13, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.nombre}</div>
          <div style={{ flex: 1 }}><Bar pct={e.usd / maxUsd * 100} color={C.pur} h={12} /></div>
          <div style={{ width: 110, textAlign: "right", fontSize: 12, fontWeight: 700 }}>{fU(e.usd)}</div>
          <div style={{ width: 70, textAlign: "right", fontSize: 11, color: C.muted }}>{e.n} pres.</div>
        </div>
      ))}
    </div>
  );
}

// ─── PESTAÑA MATERIALES ────────────────────────────────────────────
function TabMateriales({ registros, fuente }) {
  const porMaterial = {};
  registros.forEach(r => {
    (r.materiales || []).forEach(h => {
      const key = (h.nombre || "").trim() || "(sin nombre)";
      if (key === "(sin nombre)") return;
      if (!porMaterial[key]) porMaterial[key] = { nombre: key, kg: 0, n: 0 };
      porMaterial[key].kg += +h.subtotal_kg || 0; porMaterial[key].n += 1;
    });
  });
  const ranking = Object.values(porMaterial).sort((a, b) => b.kg - a.kg).slice(0, 20);
  return (
    <div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>
        Sólo cuenta materiales de Presupuestos reales (no los 235 históricos aproximados, que no tienen detalle pieza por pieza — ver PLAN-HISTORIAL.md §9.21).
        {fuente === "historial" && <span style={{ color: C.warn }}> — Fuente actual "Historial" no tiene materiales: cambiá a "Presupuesto" o "Ambos".</span>}
      </div>
      {ranking.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: C.muted, fontSize: 13 }}>Sin datos para este filtro.</div>
      ) : (
        <div style={CARD()}>
          {ranking.map((m, i) => {
            const maxKg = ranking[0].kg || 1;
            return (
              <div key={m.nombre} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 24, textAlign: "center", fontSize: 14 }}>{medal(i) || (i + 1)}</div>
                <div style={{ width: 220, fontSize: 13, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.nombre}</div>
                <div style={{ flex: 1 }}><Bar pct={m.kg / maxKg * 100} color={C.info} h={12} /></div>
                <div style={{ width: 100, textAlign: "right", fontSize: 12, fontWeight: 700 }}>{n0(m.kg)} kg</div>
                <div style={{ width: 60, textAlign: "right", fontSize: 11, color: C.muted }}>{m.n}×</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── RAÍZ ───────────────────────────────────────────────────────────
const TABS = [
  { key: "resumen", icon: "📊", lbl: "Resumen" },
  { key: "tendencia", icon: "📈", lbl: "Tendencia" },
  { key: "empresas", icon: "🏢", lbl: "Empresas" },
  { key: "materiales", icon: "🔩", lbl: "Materiales" },
];

export default function Dashboard({ usuarios = [] }) {
  const [tab, setTab] = useState("resumen");
  const [filt, setFilt] = useState(FILT_DEFAULTS);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(true);

  const presupuestos = loadLS("smeas_presupuestos", []);
  const historial = loadLS("smeas_historial", HISTORIAL_SEED);

  let registros = [];
  if (filt.fuente !== "historial") registros = registros.concat(presupuestos.map(normalizarPresupuesto));
  if (filt.fuente !== "presupuesto") registros = registros.concat(historial.map(normalizarTrabajo));

  const desde = filt.desde || getFechaDesde(filt.periodo);
  const hasta = filt.hasta || null;
  const aplicarFiltrosComunes = r => {
    if (filt.categoria && r.categoria !== filt.categoria) return false;
    if (filt.familia && familiaDe(r.categoria) !== filt.familia) return false;
    if (filt.tipo && r.tipo_trabajo !== filt.tipo) return false;
    if (filt.vendedor && String(r.vendedor) !== filt.vendedor) return false;
    if (filt.cliente && !r.cliente.toLowerCase().includes(filt.cliente.toLowerCase())) return false;
    return true;
  };
  const enRango = (r, d, h) => (!d || (r.fecha && r.fecha >= d)) && (!h || (r.fecha && r.fecha <= h));

  const actual = registros.filter(r => aplicarFiltrosComunes(r) && enRango(r, desde, hasta));
  const perAnt = getPeriodoAnterior(filt.periodo);
  const anterior = perAnt ? registros.filter(r => aplicarFiltrosComunes(r) && enRango(r, perAnt.desde, perAnt.hasta)) : [];

  // Tendencia y Materiales usan sólo los filtros de categoría/cliente/fuente
  // (no el recorte de período — igual que "últimos N meses" fijo de steelCRM).
  const paraTendenciaYRanking = registros.filter(aplicarFiltrosComunes);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 20 }}>📊</span>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: C.text }}>Dashboard</h2>
      </div>

      <FiltrosBar campos={dashCampos(usuarios)} valores={filt} setValores={setFilt} defaults={FILT_DEFAULTS}
        abierto={filtrosAbiertos} setAbierto={setFiltrosAbiertos} />

      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "2px solid " + C.border + "44", flexWrap: "wrap" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding: "9px 18px", border: "none", borderBottom: tab === t.key ? "2px solid " + C.accent : "2px solid transparent",
              background: "transparent", color: tab === t.key ? C.accent : C.muted, cursor: "pointer",
              fontWeight: tab === t.key ? 700 : 400, fontSize: 13, marginBottom: -2, whiteSpace: "nowrap" }}>
            {t.icon} {t.lbl}
          </button>
        ))}
      </div>

      {tab === "resumen" && <TabResumen actual={actual} anterior={anterior} />}
      {tab === "tendencia" && <TabTendencia registros={paraTendenciaYRanking} />}
      {tab === "empresas" && <TabEmpresas registros={paraTendenciaYRanking} />}
      {tab === "materiales" && <TabMateriales registros={paraTendenciaYRanking} fuente={filt.fuente} />}
    </div>
  );
}
