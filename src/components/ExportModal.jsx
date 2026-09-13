import { useState } from "react";
import { C, INP, LBL, CARD, BTN } from "../styles/colors";
import { loadLS } from "../utils/storage";
import { toastError, toastWarn, toastOk } from "../utils/toastBus";
import { syncToGoogleSheet } from "../utils/googleDrive";
import { calcPresupuesto } from "./Presupuesto";
import { calcTrabajo } from "./Historial";

// Centro de exportación de Steel Costos (2026-09-13, plan acordado con
// Gino) — hasta ahora no existía nada equivalente al ExportModal de Steel
// CRM. Mismo patrón: filtros + hojas + columnas toggleables + Excel o
// Google Sheets en vivo (reusa el Client ID ya guardado en Config >
// Sistema > Backup y Datos, mismo proyecto de Google que Steel CRM).
//
// Fuente de datos: lee localStorage directo al abrir (smeas_computos/
// _anidados/_presupuestos/_historial) — mismo criterio que ya usa el
// Buscador Global de esta app, sin necesidad de levantar estas 4
// entidades a estado de App.js solo para esto.
//
// Alcance v1, acordado explícitamente: Cómputos y Anidados exportan solo
// metadata (sin Kg/Monto) — esos totales se calculan hoy con una cadena
// de reduce anidada dentro del render de cada pantalla, no como función
// reusable como sí lo son calcPresupuesto/calcTrabajo. Presupuestos e
// Historial sí incluyen Kg/Monto reales, usando las mismas funciones que
// ya usan sus propias pantallas (mismos números, no una reimplementación
// aparte).

const COLS_COMPUTO = [
  { key: "nro", lbl: "N°" }, { key: "nombre", lbl: "Nombre" }, { key: "fecha", lbl: "Fecha" },
  { key: "cliente", lbl: "Cliente" }, { key: "obra", lbl: "Obra" }, { key: "empresa", lbl: "Empresa" },
  { key: "categoria", lbl: "Categoría" }, { key: "tipo_trabajo", lbl: "Tipo de trabajo" }, { key: "vendedor", lbl: "Vendedor" },
];
const COLS_ANIDADO = [
  { key: "nombre", lbl: "Nombre" }, { key: "fecha", lbl: "Fecha" },
  { key: "cliente", lbl: "Cliente" }, { key: "obra", lbl: "Obra" }, { key: "empresa", lbl: "Empresa" },
  { key: "categoria", lbl: "Categoría" }, { key: "tipo_trabajo", lbl: "Tipo de trabajo" }, { key: "vendedor", lbl: "Vendedor" },
];
const COLS_PRESUPUESTO = [
  { key: "nro", lbl: "N°" }, { key: "nombre", lbl: "Nombre" }, { key: "fecha", lbl: "Fecha" },
  { key: "cliente", lbl: "Cliente" }, { key: "obra", lbl: "Obra" }, { key: "empresa", lbl: "Empresa" },
  { key: "tipo_trabajo", lbl: "Tipo de trabajo" }, { key: "vendedor", lbl: "Vendedor" },
  { key: "kg", lbl: "Kg" }, { key: "monto", lbl: "Monto USD" }, { key: "estado", lbl: "Estado" },
];
const COLS_HISTORIAL = [
  { key: "nro_ot", lbl: "OT" }, { key: "fecha", lbl: "Fecha" }, { key: "cliente", lbl: "Cliente" },
  { key: "obra", lbl: "Obra" }, { key: "categoria", lbl: "Categoría" }, { key: "vendedor", lbl: "Vendedor" },
  { key: "kg", lbl: "Kg" }, { key: "usd", lbl: "USD" }, { key: "usd_kg", lbl: "USD/kg" }, { key: "origen", lbl: "Origen" },
];
const HOJAS = [
  { key: "computos", lbl: "📐 Cómputos" }, { key: "anidados", lbl: "✂️ Anidados" },
  { key: "presupuestos", lbl: "📋 Presupuestos" }, { key: "historial", lbl: "🗂 Historial" },
];

export default function ExportModal({ usuarios = [], onClose }) {
  const [hojasSel, setHojasSel] = useState(new Set(HOJAS.map(h => h.key)));
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [filtVend, setFiltVend] = useState("");
  const [colsComputo, setColsComputo] = useState(new Set(COLS_COMPUTO.map(c => c.key)));
  const [colsAnidado, setColsAnidado] = useState(new Set(COLS_ANIDADO.map(c => c.key)));
  const [colsPresupuesto, setColsPresupuesto] = useState(new Set(COLS_PRESUPUESTO.map(c => c.key)));
  const [colsHistorial, setColsHistorial] = useState(new Set(COLS_HISTORIAL.map(c => c.key)));
  const [sheetsBusy, setSheetsBusy] = useState(false);

  const toggleHoja = k => setHojasSel(s => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const toggleCol = (set, setSet, k) => setSet(s => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const nombreVendedor = id => usuarios.find(u => String(u.id) === String(id))?.nombre || (id || "");
  const enRango = fecha => (!desde || (fecha && fecha >= desde)) && (!hasta || (fecha && fecha <= hasta));

  function construirWorkbook() {
    if (!window.XLSX) { toastError("Librería Excel no cargada, recargá la página."); return null; }
    const X = window.XLSX, wb = X.utils.book_new();

    if (hojasSel.has("computos")) {
      let rows = loadLS("smeas_computos", []).filter(c => !c.eliminado && enRango(c.fecha));
      if (filtVend) rows = rows.filter(c => String(c.vendedor) === filtVend);
      const cols = COLS_COMPUTO.filter(c => colsComputo.has(c.key));
      if (rows.length) X.utils.book_append_sheet(wb, X.utils.json_to_sheet(rows.map(r => {
        const row = {};
        cols.forEach(c => { row[c.lbl] = c.key === "vendedor" ? nombreVendedor(r.vendedor) : (r[c.key] ?? ""); });
        return row;
      })), "Cómputos");
    }

    if (hojasSel.has("anidados")) {
      let rows = loadLS("smeas_anidados", []).filter(a => !a.eliminado && enRango(a.fecha));
      if (filtVend) rows = rows.filter(a => String(a.vendedor) === filtVend);
      const cols = COLS_ANIDADO.filter(c => colsAnidado.has(c.key));
      if (rows.length) X.utils.book_append_sheet(wb, X.utils.json_to_sheet(rows.map(r => {
        const row = {};
        cols.forEach(c => { row[c.lbl] = c.key === "vendedor" ? nombreVendedor(r.vendedor) : (r[c.key] ?? ""); });
        return row;
      })), "Anidados");
    }

    if (hojasSel.has("presupuestos")) {
      let rows = loadLS("smeas_presupuestos", []).filter(p => !p.eliminado && enRango(p.fecha));
      if (filtVend) rows = rows.filter(p => String(p.vendedor) === filtVend);
      const cols = COLS_PRESUPUESTO.filter(c => colsPresupuesto.has(c.key));
      if (rows.length) X.utils.book_append_sheet(wb, X.utils.json_to_sheet(rows.map(p => {
        const calc = (colsPresupuesto.has("kg") || colsPresupuesto.has("monto")) ? calcPresupuesto(p) : null;
        const row = {};
        cols.forEach(c => {
          if (c.key === "vendedor") row[c.lbl] = nombreVendedor(p.vendedor);
          else if (c.key === "kg") row[c.lbl] = calc ? Math.round(calc.total_kg * 100) / 100 : 0;
          else if (c.key === "monto") row[c.lbl] = calc ? Math.round(calc.gran_total * 100) / 100 : 0;
          else row[c.lbl] = p[c.key] ?? "";
        });
        return row;
      })), "Presupuestos");
    }

    if (hojasSel.has("historial")) {
      let rows = loadLS("smeas_historial", []).filter(t => !t.eliminado && enRango(t.fecha));
      if (filtVend) rows = rows.filter(t => String(t.vendedor) === filtVend);
      const cols = COLS_HISTORIAL.filter(c => colsHistorial.has(c.key));
      if (rows.length) X.utils.book_append_sheet(wb, X.utils.json_to_sheet(rows.map(t => {
        const calc = colsHistorial.has("usd_kg") ? calcTrabajo(t) : null;
        const row = {};
        cols.forEach(c => {
          if (c.key === "vendedor") row[c.lbl] = nombreVendedor(t.vendedor);
          else if (c.key === "kg") row[c.lbl] = Number(t.kg_total) || 0;
          else if (c.key === "usd") row[c.lbl] = Number(t.usd_total) || 0;
          else if (c.key === "usd_kg") row[c.lbl] = calc ? Math.round(calc.usd_kg_real * 100) / 100 : 0;
          else row[c.lbl] = t[c.key] ?? "";
        });
        return row;
      })), "Historial");
    }

    if (!wb.SheetNames?.length) { toastWarn("No hay datos para exportar con los filtros seleccionados."); return null; }
    return wb;
  }

  function exportar() {
    const wb = construirWorkbook();
    if (!wb) return;
    const fecha = new Date().toISOString().split("T")[0];
    window.XLSX.writeFile(wb, `SteelCostos_${fecha}.xlsx`);
    onClose();
  }

  async function enviarASheets() {
    const wb = construirWorkbook();
    if (!wb) return;
    const clientId = (localStorage.getItem("smeas_drive_client_id") || "").trim();
    if (!clientId) { toastError("Configurá primero el Client ID de Google en Config > Sistema > Backup y Datos."); return; }
    setSheetsBusy(true);
    try {
      const existingSheetId = localStorage.getItem("smeas_export_sheet_id") || null;
      const { spreadsheetId, url } = await syncToGoogleSheet(clientId, wb, existingSheetId);
      localStorage.setItem("smeas_export_sheet_id", spreadsheetId);
      toastOk("Exportado a Google Sheets");
      window.open(url, "_blank");
    } catch (e) {
      toastError(e.message || "No se pudo exportar a Google Sheets");
    } finally {
      setSheetsBusy(false);
    }
  }

  const chk = (checked, onChange, lbl) => (
    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, color: checked ? C.text : C.muted, userSelect: "none" }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ width: 13, height: 13, cursor: "pointer", accentColor: C.accent }} />
      {lbl}
    </label>
  );

  const seccionCols = (titulo, cols, sel, setSel) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: .5 }}>{titulo}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setSel(new Set(cols.map(c => c.key)))} style={{ fontSize: 11, color: C.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>Todas</button>
          <button onClick={() => setSel(new Set())} style={{ fontSize: 11, color: C.muted, background: "none", border: "none", cursor: "pointer" }}>Ninguna</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {cols.map(c => chk(sel.has(c.key), () => toggleCol(sel, setSel, c.key), c.lbl))}
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000b", zIndex: 2000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: 20 }}>
      <div style={{ background: C.card, border: `1px solid ${C.accent}55`, borderRadius: 12, padding: 24, width: "100%", maxWidth: 680, marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.accent }}>📊 Exportar</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 22 }}>✕</button>
        </div>

        <div style={{ ...CARD(), marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>🔍 Filtros (por fecha, aplican a todas las hojas)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div><label style={LBL}>Desde</label><input type="date" style={INP} value={desde} onChange={e => setDesde(e.target.value)} /></div>
            <div><label style={LBL}>Hasta</label><input type="date" style={INP} value={hasta} onChange={e => setHasta(e.target.value)} /></div>
            <div>
              <label style={LBL}>Vendedor</label>
              <select style={INP} value={filtVend} onChange={e => setFiltVend(e.target.value)}>
                <option value="">Todos</option>
                {usuarios.map(u => <option key={u.id} value={String(u.id)}>{u.nombre}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>📑 Hojas a incluir</div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {HOJAS.map(h => chk(hojasSel.has(h.key), () => toggleHoja(h.key), h.lbl))}
          </div>
        </div>

        {hojasSel.has("computos") && seccionCols("📐 Columnas — Cómputos", COLS_COMPUTO, colsComputo, setColsComputo)}
        {hojasSel.has("anidados") && seccionCols("✂️ Columnas — Anidados", COLS_ANIDADO, colsAnidado, setColsAnidado)}
        {hojasSel.has("presupuestos") && seccionCols("📋 Columnas — Presupuestos", COLS_PRESUPUESTO, colsPresupuesto, setColsPresupuesto)}
        {hojasSel.has("historial") && seccionCols("🗂 Columnas — Historial", COLS_HISTORIAL, colsHistorial, setColsHistorial)}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={onClose} style={{ ...BTN("ghost"), padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>Cancelar</button>
          <button onClick={enviarASheets} disabled={sheetsBusy} style={{ ...BTN("ghost"), padding: "8px 16px", borderRadius: 8, cursor: sheetsBusy ? "default" : "pointer", fontWeight: 700, opacity: sheetsBusy ? .6 : 1 }}>
            {sheetsBusy ? "Enviando..." : "🔗 Google Sheets"}
          </button>
          <button onClick={exportar} style={{ ...BTN("primary"), padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>⬇ Exportar Excel</button>
        </div>
      </div>
    </div>
  );
}
