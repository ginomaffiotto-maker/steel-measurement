import { useState, useMemo, useEffect } from "react";
import { INP, BTN, C } from "../styles/colors";

// Hook de orden reusable para listas — un click en una columna/opción ordena
// por ese campo, un segundo click invierte la dirección. Mismo criterio en
// Cómputo, Anidado, Presupuesto e Historial para que el comportamiento sea
// consistente en todo el sistema.
export function useSortable(items, campoInicial, dirInicial = "desc") {
  const [campo, setCampo] = useState(campoInicial);
  const [dir, setDir] = useState(dirInicial);

  function ordenarPor(nuevoCampo, dirPorDefecto = "asc") {
    if (campo === nuevoCampo) setDir(d => (d === "asc" ? "desc" : "asc"));
    else { setCampo(nuevoCampo); setDir(dirPorDefecto); }
  }

  const ordenados = useMemo(() => {
    if (!campo) return items;
    const arr = [...items];
    arr.sort((a, b) => {
      let va = a[campo], vb = b[campo];
      if (va == null) va = "";
      if (vb == null) vb = "";
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return dir === "asc" ? -1 : 1;
      if (va > vb) return dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [items, campo, dir]);

  return { ordenados, campo, dir, ordenarPor };
}

// Control de orden para grids de cards (sin columnas de tabla que clickear)
// — select de campo + botón que invierte la dirección. Mismo componente en
// Cómputo y Anidado para que se vea y se comporte igual en los dos.
// Corta una lista larga a `porPagina` ítems por vez en vez de montarla
// completa en el DOM (2026-08-30/31 — mismo patrón que rompió Presupuestos
// de Steel CRM: un DOM con ~622 filas montadas siempre disparaba reflow/
// recálculo de estilo caro en cada commit de React, confirmado con el
// profiler de Chrome — no era un problema de cálculo en JS. Historial.jsx
// tiene 235 trabajos históricos reales y sigue creciendo, mismo riesgo).
// `resetDeps` son las dependencias que, al cambiar, deben volver a la
// página 1 (típicamente filtros/orden).
export function usePaginado(items, porPagina = 50, resetDeps = []) {
  const [pagina, setPagina] = useState(1);
  useEffect(() => { setPagina(1); }, resetDeps); // eslint-disable-line react-hooks/exhaustive-deps
  const totalPaginas = Math.max(1, Math.ceil(items.length / porPagina));
  const paginaActual = Math.min(pagina, totalPaginas);
  const itemsPagina = useMemo(
    () => items.slice((paginaActual - 1) * porPagina, paginaActual * porPagina),
    [items, paginaActual, porPagina]
  );
  return { pagina: paginaActual, totalPaginas, itemsPagina, setPagina };
}

export function Paginador({ pagina, totalPaginas, setPagina }) {
  if (totalPaginas <= 1) return null;
  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:14, marginTop:12 }}>
      <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina <= 1}
        style={{ ...BTN("ghost"), padding:"5px 12px", opacity: pagina <= 1 ? 0.4 : 1 }}>◀ Anterior</button>
      <span style={{ fontSize:12, color:C.muted }}>Página {pagina} de {totalPaginas}</span>
      <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina >= totalPaginas}
        style={{ ...BTN("ghost"), padding:"5px 12px", opacity: pagina >= totalPaginas ? 0.4 : 1 }}>Siguiente ▶</button>
    </div>
  );
}

// Encabezado de columna clickeable para listas en formato "fila" (divs, no
// <table>) que ya tienen su propio layout con badges/subtítulos — Cómputo y
// Anidado (2026-09-06, a pedido de Gino, mismo criterio de columnas
// ordenables que ya tienen Presupuesto/Historial con <th>, pero sin obligar
// a esas dos pantallas a convertir su fila a una tabla real).
export function ColSort({ campo, label, sortCampo, sortDir, ordenarPor, align }) {
  const activo = sortCampo === campo;
  return (
    <div onClick={() => ordenarPor(campo)} title={"Ordenar por " + label}
      style={{ fontSize:9, color: activo ? C.accent : C.muted, textTransform:"uppercase",
        cursor:"pointer", userSelect:"none", fontWeight: activo ? 800 : 400, textAlign: align || "left" }}>
      {label}{activo ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
    </div>
  );
}

// Columnas ajustables tipo Excel (2026-09-07, a pedido de Gino, mismo
// mecanismo ya construido en steelCRM/shared.jsx) — persiste el ancho de
// cada columna por dispositivo (localStorage), igual criterio que las
// preferencias de columnas de Kanban. `defaults` es un objeto {colKey:px}.
export function useResizableColumns(storageKey, defaults) {
  const [widths, setWidths] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return { ...defaults, ...saved };
    } catch { return defaults; }
  });
  function setWidth(key, px) {
    setWidths(prev => {
      const next = { ...prev, [key]: Math.max(30, Math.round(px)) };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      return next;
    });
  }
  function reset() {
    setWidths(defaults);
    try { localStorage.removeItem(storageKey); } catch {}
  }
  return { widths, setWidth, reset };
}

// <th> con handle de arrastre en el borde derecho — mismo mecanismo que
// SortTH de steelCRM, adaptado al patrón de este repo (headers armados
// inline con onClick de ordenarPor, sin un componente <th> compartido
// previo). Sin `width`/`onResize`, se comporta igual que un <th> normal.
export function ThResizable({ children, style, width, onResize, minWidth = 40, onClick, title }) {
  function iniciarResize(e) {
    e.preventDefault(); e.stopPropagation();
    const startX = e.clientX, startW = width || 100;
    function onMove(ev) { onResize(Math.max(minWidth, startW + (ev.clientX - startX))); }
    function onUp() { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }
  return (
    <th onClick={onClick} title={title}
      style={{ ...style, position: "relative", ...(width ? { width, maxWidth: width } : {}) }}>
      {children}
      {onResize && (
        <span onMouseDown={iniciarResize}
          style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 6, cursor: "col-resize", zIndex: 2 }} />
      )}
    </th>
  );
}

export function OrdenarControl({ campo, dir, ordenarPor, opciones }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
      <select value={campo} onChange={e => ordenarPor(e.target.value)}
        style={{ ...INP, width:"auto", padding:"6px 8px" }} title="Ordenar por">
        {opciones.map(o => <option key={o.value} value={o.value}>Ordenar: {o.label}</option>)}
      </select>
      <button onClick={() => ordenarPor(campo)}
        style={{ ...BTN("ghost"), padding:"6px 10px" }} title={dir === "asc" ? "Ascendente" : "Descendente"}>
        {dir === "asc" ? "↑" : "↓"}
      </button>
    </div>
  );
}
