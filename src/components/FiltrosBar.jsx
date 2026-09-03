import { C, INP, LBL, CARD, BTN } from "../styles/colors";
import AutocompleteCliente from "./AutocompleteCliente";
import AutocompleteEmpresa from "./AutocompleteEmpresa";

// Barra de filtros compartida (2026-08-25) — mismo lenguaje visual en toda
// la app: tarjeta colapsable con un label arriba de cada campo (antes solo
// lo tenía Dashboard; el resto de las pantallas usaba una fila compacta sin
// labels). Cada pantalla define sus propios `campos` (solo los que le
// aplican — Cómputo no tiene Obra, Presupuesto tiene Estado aparte, etc.)
// y guarda sus valores en un único objeto de estado, en vez de un useState
// por campo — mismo criterio que ya usaba Dashboard.
//
// campo: { key, label, type: "text"|"date"|"select"|"number"|"clienteAuto"|"empresaAuto",
//          placeholder?, options?: string[] | {value,label}[], minWidth? }
export default function FiltrosBar({ campos, valores, setValores, abierto, setAbierto, defaults, extra }) {
  const set = (k, v) => setValores(f => ({ ...f, [k]: v }));
  const limpiar = () => setValores(defaults || Object.fromEntries(campos.map(c => [c.key, ""])));

  const renderCampo = (campo) => {
    const { key, type, placeholder, options = [] } = campo;
    const val = valores[key] ?? "";
    const common = { style: { ...INP }, value: val };

    if (type === "clienteAuto") {
      return <AutocompleteCliente style={INP} value={val} placeholder={placeholder || "Buscar…"} onChange={v => set(key, v)} />;
    }
    if (type === "empresaAuto") {
      return <AutocompleteEmpresa style={INP} value={val} placeholder={placeholder || "Buscar…"} onChange={v => set(key, v)} />;
    }
    if (type === "date") {
      return <input type="date" {...common} onChange={e => set(key, e.target.value)} />;
    }
    if (type === "number") {
      return <input type="number" step="0.01" {...common} placeholder={placeholder} onChange={e => set(key, e.target.value)} />;
    }
    if (type === "select") {
      const opts = options.map(o => typeof o === "string" ? { value: o, label: o } : o);
      return (
        <select {...common} onChange={e => set(key, e.target.value)}>
          <option value="">{placeholder || "Todos"}</option>
          {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    }
    if (type === "groupedSelect") {
      // options acá es { [grupo]: string[] } — ej. FAMILIAS (Familia → Categorías)
      return (
        <select {...common} onChange={e => set(key, e.target.value)}>
          <option value="">{placeholder || "Todas"}</option>
          {Object.entries(options).map(([grupo, items]) => (
            <optgroup key={grupo} label={grupo}>
              {items.map(it => <option key={it} value={it}>{it}</option>)}
            </optgroup>
          ))}
        </select>
      );
    }
    // "text" por defecto
    return <input type="text" {...common} placeholder={placeholder} onChange={e => set(key, e.target.value)} />;
  };

  return (
    <div style={{ ...CARD(), background: C.iron, marginBottom: 16 }}>
      <div onClick={() => setAbierto(a => !a)}
        style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", userSelect: "none",
          fontSize: 12, fontWeight: 700, color: C.muted, ...(abierto ? { marginBottom: 10 } : {}) }}>
        <span>{abierto ? "▾" : "▸"}</span> 🔍 Filtros
      </div>
      {abierto && (
        // 2026-09-02, a pedido de Gino: los campos quedaban apretados a la
        // izquierda con espacio libre sin usar a la derecha — cada campo
        // ahora crece para ocupar el ancho real de la tarjeta (respetando
        // su minWidth), y "✕ Todo" se empuja al margen derecho.
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          {campos.map(campo => (
            <div key={campo.key} style={{ minWidth: campo.minWidth || 150, flex: campo.flex ?? 1 }}>
              <label style={LBL}>{campo.label}</label>
              {renderCampo(campo)}
            </div>
          ))}
          {extra}
          <button style={{ ...BTN("ghost"), padding: "9px 14px", marginLeft: "auto" }} onClick={limpiar}>✕ Todo</button>
        </div>
      )}
    </div>
  );
}
