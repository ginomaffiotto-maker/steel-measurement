import { calcTrabajo, calcBenchmark, iTrabajo } from "../Historial";

test("calcTrabajo calcula USD/kg real y productividad kg/h", () => {
  const t = { ...iTrabajo(), kg_total: 1000, usd_total: 5000, horas_fab_est: 80, horas_fab_real: 100 };
  const c = calcTrabajo(t);
  expect(c.usd_kg_real).toBeCloseTo(5, 2); // 5000/1000
  expect(c.kg_hora_fab_real).toBeCloseTo(10, 2); // 1000/100
  expect(c.kg_hora_fab_est).toBeCloseTo(12.5, 2); // 1000/80
  expect(c.desvio_fab_pct).toBeCloseTo(25, 2); // (100-80)/80 ×100
});

test("calcTrabajo no divide por cero cuando faltan horas u kg", () => {
  const t = { ...iTrabajo(), kg_total: 0, usd_total: 0 };
  const c = calcTrabajo(t);
  expect(c.usd_kg_real).toBe(0);
  expect(c.kg_hora_fab_real).toBe(0);
  expect(c.desvio_fab_pct).toBe(0);
});

// Regression: verificado a mano en navegador (sesión 2026-08-06) que el
// benchmark agrupado por Familia cubre el 100% de los trabajos — ningún
// registro se pierde al pasar de agrupar por Categoría a agrupar por
// Familia. Este test fija esa garantía.
test("calcBenchmark cubre el 100% de los trabajos, agrupando por categoría o por familia", () => {
  const trabajos = [
    { ...iTrabajo(), categoria: "Barandas - Defensas", kg_total: 100, usd_total: 500 },
    { ...iTrabajo(), categoria: "Barandas - Defensas", kg_total: 200, usd_total: 1200 },
    { ...iTrabajo(), categoria: "Camisas", kg_total: 50, usd_total: 300 },
  ];
  const porCategoria = calcBenchmark(trabajos, "categoria");
  expect(porCategoria.reduce((s, b) => s + b.n, 0)).toBe(3);

  const porFamilia = calcBenchmark(trabajos, "familia");
  expect(porFamilia.reduce((s, b) => s + b.n, 0)).toBe(3);
  // Barandas - Defensas → Herrería liviana, Camisas → Calderería (taxonomia.js)
  const familias = porFamilia.map(b => b.categoria).sort();
  expect(familias).toEqual(["Calderería", "Herrería liviana"]);
});

test("calcBenchmark ignora trabajos sin USD/kg válido (kg o usd en 0)", () => {
  const trabajos = [
    { ...iTrabajo(), categoria: "Skids", kg_total: 0, usd_total: 0 },
    { ...iTrabajo(), categoria: "Skids", kg_total: 100, usd_total: 500 },
  ];
  const bm = calcBenchmark(trabajos, "categoria");
  expect(bm[0].n).toBe(1); // sólo el segundo trabajo cuenta
});
