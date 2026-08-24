import { useState, useMemo } from "react";
import { INP, BTN } from "../styles/colors";

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
