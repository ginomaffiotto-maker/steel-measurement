import { runFFD } from "../Anidado";

// Regression test del bug crítico encontrado 2026-08-03: una pieza más
// larga que la barra se descartaba en silencio (nunca sumaba al cálculo),
// haciendo que el optimizador de corte devolviera muchas menos barras de
// las que hacían falta comprar en la realidad. Fix: la pieza se descompone
// en tramos completos de barra ("empalme", 0% desperdicio) + un resto que
// compite normalmente por espacio.

test("pieza más larga que la barra se empalma (no se descarta)", () => {
  const piezas = [{ largo_mm: 15000, cantidad: 1, etiqueta: "Columna" }];
  const { barras, resumen } = runFFD(piezas, 6000, 3, 10);

  // 15m de pieza = 2 barras enteras (empalme) + 1 barra con 3m de resto
  expect(resumen.b_total).toBe(3);
  expect(resumen.m_util).toBeCloseTo(15, 2);
  expect(resumen.kg_util).toBeCloseTo(150, 1); // 15m × 10kg/m

  const forzadas = barras.filter(b => b.forzada);
  expect(forzadas.length).toBe(2);
  forzadas.forEach(b => expect(b.piezas[0].etiqueta).toContain("(empalme)"));

  const conResto = barras.find(b => !b.forzada);
  expect(conResto.piezas[0].etiqueta).toContain("(resto)");
  expect(conResto.piezas[0].largo_mm).toBeCloseTo(3000, 0);
});

test("mm_util_total siempre refleja el largo real pedido, no lo que entró en el bin-packing", () => {
  // Antes del fix esto daba mm_util_total = 0 (la pieza se descartaba antes
  // de sumar). Con 3 piezas de 15m c/u tiene que dar 45m parejo, sin importar
  // cuántas barras termine usando el packing.
  const piezas = [{ largo_mm: 15000, cantidad: 3, etiqueta: "Columna" }];
  const { resumen } = runFFD(piezas, 6000, 3, 1);
  expect(resumen.m_util).toBeCloseTo(45, 2);
});

test("piezas que sí entran en la barra arman FFD normal (sin empalme)", () => {
  const piezas = [
    { largo_mm: 3000, cantidad: 2, etiqueta: "A" }, // 2×3m llenan 1 barra de 6m exacto
    { largo_mm: 2000, cantidad: 1, etiqueta: "B" }, // no entra más en esa barra → 2da barra
  ];
  const { barras, resumen } = runFFD(piezas, 6000, 0, 5);
  expect(resumen.b_total).toBe(2);
  expect(barras.every(b => !b.forzada)).toBe(true);
  expect(barras[0].piezas.length).toBe(2); // las 2 de 3000mm compartiendo la primera barra
  expect(barras[1].piezas.length).toBe(1); // la de 2000mm sola en la segunda
});
