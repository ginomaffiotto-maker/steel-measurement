import { useState, useMemo, useEffect } from "react";
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
// Historial de esta función, resumido (detalle completo en el changelog
// del proyecto, 2026-09-13/14 — muchas rondas el mismo día): tuvo un
// `containerRef`/`fit()` que reescalaba TODAS las columnas al montar o
// resizear la ventana, agregado sin querer por otro commit (`d75f4a5`)
// que arreglaba algo distinto. Ese reescalado quedaba persistido en
// localStorage, pisando cualquier ajuste de default para siempre — se
// sacó del todo. Hoy es idéntica a la de Steel CRM (`SortTH`, shared.jsx):
// lee de localStorage o los defaults, sin ningún reescalado automático.
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

// 2026-09-14 (noche) — tope dinámico de arrastre: Gino grabó un video
// arrastrando "Monto U$S" bien ancha y reportó que el resto de las
// columnas quedaban empujadas, con las de los extremos en riesgo de
// salirse de la pantalla. El tope fijo (`maxWidth=500` en `ThResizable`,
// ver más abajo) no alcanza — 500px por columna sigue siendo demasiado
// si ya hay varias columnas anchas. Este helper calcula, en cada
// arrastre, cuánto puede crecer ESA columna sin que la suma total supere
// el ancho real del contenedor visible — matemáticamente no hay forma de
// que el resultado empuje nada fuera de pantalla, sea cual sea la
// combinación de anchos ya elegidos. Verificado en un HTML aislado:
// pedir 3000px para una columna quedó topeado a lo que realmente cabía,
// sin desbordar. `containerEl` es el mismo div `overflowX:auto` que ya
// envuelve la tabla — se le vuelve a pasar un `ref` liviano solo para
// esto (no reintroduce el `fit()` de arriba: acá no se persiste nada, ni
// se toca ninguna otra columna, solo se limita la que se está arrastrando
// en el momento).
export function clampAnchoColumna(containerEl, widths, key, deseadoPx) {
  if (!containerEl) return Math.max(30, deseadoPx);
  const otroTotal = Object.entries(widths).reduce((s, [k, v]) => k === key ? s : s + (Number(v) || 0), 0);
  const maxPermitido = Math.max(30, containerEl.clientWidth - otroTotal);
  return Math.max(30, Math.min(deseadoPx, maxPermitido));
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
// 2026-09-14 — columna "flex" (Nombre/Obra), PROBADO Y REVERTIDO EL
// MISMO DÍA: pedido de Gino de que las columnas angostas (Fecha/Tipo/
// KG/Monto/Acc) no quedaran con tanto aire de más al estirar la tabla a
// 100%. Dejar una sola columna sin `width`/`onResize` (para que absorba
// el sobrante) funcionaba para eso, pero rompió el drag — como esa
// columna vive cerca del principio de la fila, CUALQUIER resize de una
// columna a su derecha (sobre todo la última, "Acc", que ya está pegada
// al borde derecho de la tabla y no tiene a dónde crecer hacia la
// derecha) le pedía a ella sola toda la compensación, y visualmente el
// bloque de columnas del medio se corría entero para la izquierda —
// Gino lo describió como "quiero agrandar hacia la derecha y se agranda
// hacia la izquierda". Con TODAS las columnas bloqueadas (sin ninguna
// columna elástica) esa compensación se reparte fina entre todas en vez
// de concentrarse en una sola, así que no se nota — es el mismo motivo,
// verificado ese mismo día, por el que Steel CRM (que nunca tuvo
// columna flex) no tiene este problema. Se volvió a EXACTAMENTE el
// mismo mecanismo que ya usa Steel CRM (`SortTH`) — cada columna con
// `width`/`onResize` normal, ninguna elástica.
//
// 2026-09-14 (misma noche) — con el drag ya arreglado, Gino reportó dos
// cosas más: "Acc" seguía por defecto muy ancha, y las columnas se
// podían agrandar tanto que las de los extremos se salían de pantalla.
// Se probaron 2 arreglos intermedios ese mismo día, los dos con la
// tabla en `width:"100%"` — un tope fijo de arrastre (`maxWidth=500`,
// insuficiente: 500px por columna sigue siendo mucho si ya hay varias
// anchas) y una columna FILLER invisible al final de la fila para que
// absorbiera el sobrante en vez de que se repartiera entre las
// columnas reales (funcionaba — verificado con HTML aislado, cada
// columna real quedaba en su ancho exacto — pero dejaba un espacio
// muerto enorme, sin usar, dentro de la tabla; Gino lo rechazó por
// sentirse igual de "roto" que el hueco vacío ya descartado el
// 2026-09-13). **Arreglo definitivo**: sacar `width:"100%"` de la
// tabla directamente — sin ese valor, con `table-layout:fixed`, el
// ancho de la tabla pasa a ser la SUMA real de sus columnas (ninguna
// se infla ni se le pide que absorba nada), y el `<div
// style={{overflowX:"auto"}}>` que la envuelve no fuerza ningún ancho
// mínimo — si la tabla es angosta, el resto de la fila simplemente
// queda como fondo de la página (sin ningún borde/tarjeta propio
// alrededor de esta tabla que se vea "cortado a la mitad", a
// diferencia de lo que sí pasaba con el intento del 2026-09-13). Para
// "las columnas se salen de pantalla" ya no hace falta ningún tope de
// arrastre por columna — alcanza con `clampAnchoColumna` (ver abajo),
// que impide que la SUMA total supere el ancho visible del contenedor,
// sea cual sea la combinación de anchos elegidos.
export function ThResizable({ children, style, width, onResize, minWidth = 40, maxWidth = 500, onClick, title }) {
  function iniciarResize(e) {
    e.preventDefault(); e.stopPropagation();
    const startX = e.clientX, startW = width || 100;
    function onMove(ev) { onResize(Math.min(maxWidth, Math.max(minWidth, startW + (ev.clientX - startX)))); }
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
