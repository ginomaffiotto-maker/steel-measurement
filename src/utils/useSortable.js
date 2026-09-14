import { useState, useMemo, useEffect, useRef } from "react";
import { BTN, C } from "../styles/colors";

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

// Suma de anchos de columna — el ancho real que se le da a la `<table>`
// (ver `useResizableColumns` más abajo). Al ser un número exacto (nunca
// "100%"), el navegador no tiene ningún sobrante que redistribuir entre
// columnas — elimina de raíz el bug de "las columnas se mueven al
// ensancharlas" sin depender de que el navegador respete `min-width`/
// `max-width` en celdas de tabla (no lo hace de forma confiable con
// `table-layout:fixed` — confirmado en vivo el 2026-09-13: fijar
// min=max=width en cada `<th>` no evitó que el navegador igual estirara
// una columna para llenar el 100%).
export function sumAnchos(widths) {
  return Object.values(widths).reduce((a, b) => a + (Number(b) || 0), 0);
}

// Columnas ajustables tipo Excel (2026-09-07, a pedido de Gino, mismo
// mecanismo ya construido en steelCRM/shared.jsx) — persiste el ancho de
// cada columna por dispositivo (localStorage), igual criterio que las
// preferencias de columnas de Kanban. `defaults` es un objeto {colKey:px}.
//
// `containerRef` (2026-09-13, arreglo real y definitivo del bug de
// resize — 3 intentos fallidos antes, ver historial de commits del mismo
// día): se lo pasa al `<div style={{overflowX:"auto"}}>` que envuelve la
// tabla. Al montar y en cada resize de ventana, si ese contenedor es más
// ANCHO que la suma actual de columnas, escala TODAS proporcionalmente
// para llenarlo — mismo efecto visual que el `width:"100%"` de siempre
// (la tabla se ve "llena"), pero calculado una sola vez por JS, nunca por
// el navegador en tiempo real. Arrastrar una columna después solo cambia
// ESA columna (`setWidth`, sin tocar las demás) — nunca dispara este
// recálculo, así que las demás no se mueven mientras se arrastra. Si el
// contenedor es más angosto que la suma, no se toca nada — aparece
// scroll horizontal, como siempre.
export function useResizableColumns(storageKey, defaults) {
  const [widths, setWidths] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return { ...defaults, ...saved };
    } catch { return defaults; }
  });
  const containerRef = useRef(null);
  useEffect(() => {
    function fit() {
      const el = containerRef.current;
      if (!el) return;
      const disponible = el.clientWidth;
      setWidths(prev => {
        const total = sumAnchos(prev);
        if (!total || disponible <= total) return prev;
        const factor = disponible / total;
        const next = {};
        for (const k in prev) next[k] = Math.round(prev[k] * factor);
        try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
        return next;
      });
    }
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [storageKey]);
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
  return { widths, setWidth, reset, containerRef };
}

// <th> con handle de arrastre en el borde derecho — mismo mecanismo que
// SortTH de steelCRM, adaptado al patrón de este repo (headers armados
// inline con onClick de ordenarPor, sin un componente <th> compartido
// previo). Sin `width`/`onResize`, se comporta igual que un <th> normal.
// 2026-09-13: le faltaban 2 cosas que SortTH sí tiene, causa real de que
// Costos nunca se sintiera tan sólido como Presupuestos de Steel CRM —
// (1) sin `minWidth` (solo tenía `maxWidth`), la columna se podía
// comprimir por debajo de su ancho real en vez de quedar fija de los dos
// lados; (2) sin `stopPropagation` en el `onClick` del handle, soltar el
// mouse después de arrastrar también reordenaba la columna (el click
// burbujeaba hasta el `<th>`, que tiene su propio `onClick` de orden).
//
// 2026-09-14 — columna "flex" (Nombre/Obra): pedido de Gino de que las
// columnas angostas (Fecha/Tipo/KG/Monto/Acc) no queden con tanto aire
// de más cuando la tabla se estira a 100%. No pasarle `width`/`onResize`
// a UNA columna del array (dejarla sin declarar, "auto") hace que esa
// columna absorba casi todo el espacio sobrante en vez de que el
// navegador lo reparta proporcional entre todas — verificado en vivo
// con un HTML aislado: el resto de las columnas queda con una inflación
// mínima (no perfecta — Chrome igual las infla ~15-20% aunque tengan
// min=max=width, no encontramos forma de evitar eso del todo con CSS
// puro) en vez del ~78% de antes, y arrastrar una columna bloqueada
// solo descuenta/suma a la columna flex, sin mover a las demás. La
// columna flex pierde su drag propio a propósito (no tiene sentido
// arrastrar algo que siempre ocupa "lo que sobra") — por eso no se le
// pasa `onResize`, así tampoco se dibuja su handle.
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
      style={{ ...style, position: "relative", ...(width ? { width, minWidth: width, maxWidth: width } : {}) }}>
      {children}
      {onResize && (
        <span onMouseDown={iniciarResize} onClick={e => e.stopPropagation()}
          style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 6, cursor: "col-resize", zIndex: 2 }} />
      )}
    </th>
  );
}
