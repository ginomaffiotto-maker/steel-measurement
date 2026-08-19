import { calcItem, calcPresupuesto, iItem, iPresupuesto } from "../Presupuesto";

function itemConHierro(usd, kg) {
  return {
    ...iItem(),
    hierros: [{ id: "h1", subtotal_usd: usd, subtotal_kg: kg }],
  };
}

test("calcItem suma los rubros y calcula USD/kg correctamente", () => {
  const it = {
    ...iItem(),
    cantidad: 2,
    hierros: [{ id: "h1", subtotal_usd: 100, subtotal_kg: 50 }],
    mat_generales: [{ id: "m1", subtotal_usd: 20 }],
    mo_fabricacion: [{ id: "f1", subtotal_usd: 30, cant_horas: 5 }],
  };
  const c = calcItem(it);
  // total por unidad = 100+20+30 = 150; ×2 unidades = 300
  expect(c.total_usd).toBeCloseTo(300, 2);
  expect(c.total_kg).toBeCloseTo(100, 2); // 50kg × 2 unidades
  expect(c.usd_kg).toBeCloseTo(3, 2); // 300/100
  expect(c.kg_hora_fab).toBeCloseTo(10, 2); // 50kg hierro / 5h (por unidad, no ×cant)
});

test("no_agrega_kg pone total_kg en 0 sin tocar el monto en USD", () => {
  const it = { ...itemConHierro(100, 50), no_agrega_kg: true };
  const c = calcItem(it);
  expect(c.total_kg).toBe(0);
  expect(c.total_usd).toBeCloseTo(100, 2);
});

// Regression test 2026-08-03: la negociación tiene que SUMAR al total, no
// restar (bug reportado por el usuario: "la negociación debe aumentar el
// precio no disminuirlo"). El interés financiero se calcula sobre el
// subtotal YA con la negociación sumada, no sobre el original.
test("negociación SUMA al total (nunca resta) y el interés se calcula sobre subtotal+negociación", () => {
  const p = {
    ...iPresupuesto(),
    items: [itemConHierro(1000, 100)],
    neg_modo: "pct",
    negociacion_pct: 10,
    interes_pct: 4,
  };
  const c = calcPresupuesto(p);
  expect(c.total_usd).toBeCloseTo(1000, 2);
  expect(c.neg_usd).toBeCloseTo(100, 2); // +10% de 1000
  expect(c.int_usd).toBeCloseTo(44, 2); // 4% de (1000+100)
  expect(c.gran_total).toBeCloseTo(1144, 2); // 1000+100+44
});

test("negociación en modo USD fijo (no %) también suma", () => {
  const p = {
    ...iPresupuesto(),
    items: [itemConHierro(500, 50)],
    neg_modo: "usd",
    negociacion_usd: 75,
  };
  const c = calcPresupuesto(p);
  expect(c.gran_total).toBeCloseTo(575, 2);
});

test("calcPresupuesto agrega varios ítems y respeta la cantidad de cada uno", () => {
  const p = {
    ...iPresupuesto(),
    items: [
      { ...itemConHierro(100, 10), cantidad: 1 },
      { ...itemConHierro(50, 5), cantidad: 3 },
    ],
  };
  const c = calcPresupuesto(p);
  expect(c.total_usd).toBeCloseTo(100 + 50 * 3, 2);
  expect(c.total_kg).toBeCloseTo(10 + 5 * 3, 2);
  expect(c.rubros.hier).toBeCloseTo(100 + 50 * 3, 2);
});
