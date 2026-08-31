import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { C, INP } from "../styles/colors";

// Normaliza texto para comparar sin acentos/mayúsculas y con los símbolos
// especiales de perfiles (×, ², ½, ¼, ¾) reducidos a su equivalente ASCII.
// Antes vivía duplicada, idéntica, en Computo.jsx y Anidado.jsx (unificada
// 2026-08-30 junto con Combobox e infoMaterial de más abajo).
export const normalizarTexto = s => String(s || "").toLowerCase()
  .normalize("NFD").replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
  .replace(/×/g, "x").replace(/²/g, "2").replace(/½/g, "1/2")
  .replace(/¼/g, "1/4").replace(/¾/g, "3/4").replace(/\s+/g, " ").trim();

// Info de referencia rápida de un material: largo de barra o m² de la hoja, + kg/m o kg/m².
export function infoMaterial(o) {
  if (o.kg_m2) {
    const sup = o.sheet_w && o.sheet_h ? `${(o.sheet_w * o.sheet_h / 1e6).toFixed(2)}m²` : null;
    return [sup, o.kg_m2 ? `${o.kg_m2} kg/m²` : null].filter(Boolean).join(" · ");
  }
  if (o.kg_m) {
    const largo = o.largo_mm ? `${(o.largo_mm / 1000)}m` : null;
    return [largo, `${o.kg_m} kg/m`].filter(Boolean).join(" · ");
  }
  return null;
}

// Selector de material con filtro de texto — usado en Cómputo, Anidado y
// Presupuesto (Hierros). Antes había una copia casi idéntica en Computo.jsx
// y otra en Anidado.jsx, mantenidas a mano por separado (2026-08-30).
// `precioField` varía entre pantallas porque cada una normaliza su propio
// catálogo de materiales con un nombre de campo distinto (precio_kg en
// Cómputo, precio_usd_kg en Anidado) — no es un error, son dos formas
// reales de la misma info; se pasa como prop en vez de asumir un nombre fijo.
export function Combobox({ opciones, value, onChange, placeholder = "Buscar…", precioField = "precio_kg" }) {
  const [busq, setBusq] = useState("");
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null); // posición calculada del trigger, null hasta que se abre
  const ref = useRef(null);
  const panelRef = useRef(null);

  // 2026-08-30: la lista se dibujaba con position:absolute DENTRO de la
  // tabla del ítem — cualquier tabla/contenedor con overflow (la mayoría
  // acá tienen overflowX:"auto" para el scroll horizontal, lo que por
  // spec de CSS también activa overflow-y:auto) la recortaba en vez de
  // dejarla flotar sobre el resto de la pantalla (confirmado en vivo por
  // Gino: con el ítem chico, la lista se veía cortada a 2-3 filas). Fix:
  // portal a document.body con position:fixed calculada desde el trigger,
  // así ningún contenedor con scroll/overflow la puede recortar.
  const calcularRect = () => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const espacioAbajo = window.innerHeight - r.bottom;
    const abrirArriba = espacioAbajo < 380 && r.top > 380;
    setRect({ left: r.left, width: Math.max(r.width, 300), top: abrirArriba ? r.top - 4 : r.bottom + 4, abrirArriba });
  };

  useEffect(() => {
    if (!open) return;
    const cerrarSiEsAfuera = e => {
      if (ref.current?.contains(e.target)) return;
      if (panelRef.current?.contains(e.target)) return;
      setOpen(false); setBusq("");
    };
    document.addEventListener("mousedown", cerrarSiEsAfuera);
    // Reubicar si la página (o un contenedor con scroll propio) se mueve
    // mientras está abierto, para que no quede "flotando" en un lugar viejo.
    window.addEventListener("scroll", calcularRect, true);
    window.addEventListener("resize", calcularRect);
    return () => {
      document.removeEventListener("mousedown", cerrarSiEsAfuera);
      window.removeEventListener("scroll", calcularRect, true);
      window.removeEventListener("resize", calcularRect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useLayoutEffect(() => { if (open) calcularRect(); }, [open]);

  const sel = opciones.find(o => o.id === value) || null;
  const q = normalizarTexto(busq.trim());
  const tokens = q ? q.split(" ").filter(Boolean) : [];
  const lista = tokens.length === 0
    ? opciones.slice(0, 80)
    : opciones.filter(o => { const hay = normalizarTexto(o.nombre + " " + (o.cat || "")); return tokens.every(t => hay.includes(t)); }).slice(0, 80);

  const panel = open && rect && createPortal(
    <div ref={panelRef} style={{ position: "fixed", left: rect.left, width: rect.width, zIndex: 9999,
      ...(rect.abrirArriba ? { bottom: window.innerHeight - rect.top } : { top: rect.top }),
      background: C.card, border: `1px solid ${C.accent}55`, borderRadius: 8,
      boxShadow: "0 8px 24px #00000077", overflow: "hidden" }}>
      <div style={{ padding: "8px 8px 4px" }}>
        <input autoFocus type="text" placeholder="Escribí para filtrar…" value={busq}
          onChange={e => setBusq(e.target.value)}
          style={{ ...INP, width: "100%", padding: "6px 8px", fontSize: 12 }} />
      </div>
      <div style={{ maxHeight: 340, overflowY: "auto" }}>
        {lista.length === 0 && <div style={{ padding: "10px 12px", color: C.muted, fontSize: 12 }}>Sin resultados para "{busq}"</div>}
        {lista.map(o => (
          <div key={o.id} onMouseDown={() => { onChange(o); setBusq(""); setOpen(false); }}
            style={{ padding: "7px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13,
              background: value === o.id ? C.accent + "22" : "transparent",
              color: value === o.id ? C.accent : C.text,
              borderLeft: value === o.id ? `3px solid ${C.accent}` : "3px solid transparent" }}
            onMouseEnter={e => e.currentTarget.style.background = C.iron}
            onMouseLeave={e => e.currentTarget.style.background = value === o.id ? C.accent + "22" : "transparent"}>
            <span style={{ flex: 1 }}>{o.nombre}</span>
            {infoMaterial(o) && <span style={{ fontSize: 10, color: C.muted, flexShrink: 0 }}>{infoMaterial(o)}</span>}
            {!o[precioField] && <span title="Sin precio cargado" style={{ fontSize: 10, color: C.warn }}>⚠</span>}
            {o.cat && <span style={{ fontSize: 10, color: C.muted }}>{o.cat}</span>}
            {value === o.id && <span style={{ color: C.accent }}>✓</span>}
          </div>
        ))}
      </div>
    </div>,
    document.body
  );

  return (
    <div ref={ref} style={{ position: "relative", width: 240 }}>
      <div onClick={() => setOpen(v => !v)}
        style={{ ...INP, width: "100%", display: "flex", alignItems: "center", gap: 6,
          cursor: "pointer", padding: "6px 8px", border: `1px solid ${open ? C.accent : C.border}` }}>
        {sel ? (
          <>
            <span style={{ flex: 1, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sel.nombre}</span>
            {infoMaterial(sel) && <span style={{ fontSize: 10, color: C.muted, flexShrink: 0 }}>{infoMaterial(sel)}</span>}
            {!sel[precioField] && <span title="Sin precio cargado en Insumos y Precios" style={{ fontSize: 11, color: C.warn, flexShrink: 0 }}>⚠ sin precio</span>}
            <span onMouseDown={e => { e.stopPropagation(); onChange(null); setBusq(""); setOpen(false); }}
              style={{ cursor: "pointer", color: C.muted, fontSize: 14, padding: "0 3px" }}>✕</span>
          </>
        ) : <span style={{ flex: 1, color: C.muted, fontSize: 12 }}>{placeholder}</span>}
        <span style={{ color: C.muted, fontSize: 10 }}>{open ? "▲" : "▼"}</span>
      </div>
      {panel}
    </div>
  );
}
