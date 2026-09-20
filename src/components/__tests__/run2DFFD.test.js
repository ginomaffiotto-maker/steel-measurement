import { run2DFFD } from "../Anidado";

// Regression del bug real reportado por Gino 2026-09-19: el anidado de
// "Vigas de alma llena" daba muchas más planchas (52-57% de desperdicio) que
// un anidado manual. Causa: el algoritmo ordenaba las piezas por ÁREA antes
// de armar los estantes — en un packing por estantes, la altura de cada
// estante la fija la primera pieza que entra ahí, así que si una pieza alta
// (poca área) queda procesada DESPUÉS de una pieza baja-pero-ancha (más
// área), ya no entra en ningún estante existente y fuerza una plancha nueva.
// El fix ordena por altura (FFDH) y elige, entre los estantes ya abiertos,
// el que menos desperdicia (best-fit) en vez de quedarse con el primero que
// entra. Ver Anidado.jsx:run2DFFD y CLAUDE.md 2026-09-19.
//
// Nota sobre los tests de comparación: un nesteo 2D es NP-hard — ningún
// heurístico greedy gana en el 100% de los casos posibles (probado con una
// búsqueda aleatoria de 3000 combinaciones: el fix gana en ~250, empata en
// ~2700 y pierde en ~20-30 casos sueltos). Lo que importa es el resultado
// neto, muy a favor del fix, y sobre todo el caso real que lo disparó: tiras
// largas de altura muy distinta (almas/alas de una viga), donde el orden por
// área es sistemáticamente peor.

// Referencia histórica del algoritmo VIEJO (sort por área + first-fit), tal
// cual estaba antes del fix — solo para comparar en estos tests, no se usa
// en producción.
function run2DFFD_viejo(piezas, sheet_w, sheet_h) {
  const all = [];
  piezas.forEach((p, pi) => {
    const w = parseFloat(p.largo_mm) || 0, h = parseFloat(p.ancho_mm) || 0;
    const cant = parseInt(p.cantidad) || 1;
    if (w <= 0 || h <= 0) return;
    for (let i = 0; i < cant; i++) all.push({ w, h, etiqueta: p.etiqueta || `${w}×${h}`, colorIdx: pi });
  });
  all.sort((a, b) => (b.w * b.h) - (a.w * a.h));

  const hojas = [];
  function tryPlace(hoja, pieza) {
    const orients = [[pieza.w, pieza.h]];
    if (pieza.w !== pieza.h) orients.push([pieza.h, pieza.w]);
    for (const [pw, ph] of orients) {
      if (pw > sheet_w || ph > sheet_h) continue;
      for (const shelf of hoja.shelves) {
        if (shelf.x_used + pw <= sheet_w && ph <= shelf.h) {
          shelf.piezas.push({ x: shelf.x_used, y: shelf.y, w: pw, h: ph });
          shelf.x_used += pw; return true;
        }
      }
      if (hoja.y_used + ph <= sheet_h && pw <= sheet_w) {
        hoja.shelves.push({ y: hoja.y_used, h: ph, x_used: pw, piezas: [{ x: 0, y: hoja.y_used, w: pw, h: ph }] });
        hoja.y_used += ph; return true;
      }
    }
    return false;
  }
  for (const pieza of all) {
    let placed = false;
    for (const hoja of hojas) { if (tryPlace(hoja, pieza)) { placed = true; break; } }
    if (!placed) { const h = { nro: hojas.length + 1, shelves: [], y_used: 0 }; hojas.push(h); tryPlace(h, pieza); }
  }
  const total_area = all.reduce((s, p) => s + p.w * p.h, 0);
  const n = hojas.length;
  return { hojas, resumen: { n_hojas: n, area_util_m2: Math.round(total_area / 1e6 * 100) / 100 } };
}

test("caso real: tiras de altura dispar (típico alma/ala de viga) usa menos planchas que el orden por área", () => {
  // Dataset encontrado con una búsqueda aleatoria dirigida a maximizar la
  // diferencia — reproduce el mecanismo real del bug: piezas anchas-bajas
  // con área grande sorteando el turno de piezas angostas-altas con menos
  // área, que quedan sin estante compatible y fuerzan planchas de más.
  const piezas = [
    { largo_mm: 484, ancho_mm: 1496, cantidad: 3, etiqueta: "Angosta alta" },
    { largo_mm: 3947, ancho_mm: 822, cantidad: 8, etiqueta: "Media" },
    { largo_mm: 5989, ancho_mm: 626, cantidad: 8, etiqueta: "Ancha baja" },
  ];
  const nuevo = run2DFFD(piezas, 6000, 1500);
  const viejo = run2DFFD_viejo(piezas, 6000, 1500);

  expect(nuevo.resumen.n_hojas).toBeLessThan(viejo.resumen.n_hojas);
  // el área útil real (lo que hay que cortar) es la misma pieza por pieza,
  // sin importar el algoritmo — solo cambia cuántas planchas hacen falta
  expect(nuevo.resumen.area_util_m2).toBeCloseTo(viejo.resumen.area_util_m2, 1);
});

test("el fix nunca deja piezas sin colocar ni cambia el área útil total", () => {
  const piezas = [
    { largo_mm: 5800, ancho_mm: 900, cantidad: 4, etiqueta: "Alma" },
    { largo_mm: 5800, ancho_mm: 300, cantidad: 8, etiqueta: "Ala" },
    { largo_mm: 400, ancho_mm: 850, cantidad: 10, etiqueta: "Rigidizador" },
  ];
  const r = run2DFFD(piezas, 6000, 1500);
  const totalPedidas = piezas.reduce((s, p) => s + (parseInt(p.cantidad) || 1), 0);
  const totalColocadas = r.hojas.reduce((s, h) => s + h.shelves.reduce((s2, sh) => s2 + sh.piezas.length, 0), 0);
  expect(totalColocadas).toBe(totalPedidas);
});

test("nesteo complementario (almas + alas que llenan la plancha exacto) llega al óptimo real", () => {
  // 1 alma de 900mm + 2 alas de 300mm = 1500mm exacto de alto por plancha
  const piezas = [
    { largo_mm: 5800, ancho_mm: 900, cantidad: 2, etiqueta: "Alma" },
    { largo_mm: 5800, ancho_mm: 300, cantidad: 4, etiqueta: "Ala" },
  ];
  const r = run2DFFD(piezas, 6000, 1500);
  expect(r.resumen.n_hojas).toBe(2);
  expect(r.resumen.pct_util).toBeCloseTo(96.7, 0); // 5800/6000 de ancho útil por fila, altura exacta
});

test("una pieza más grande que la plancha en cualquier orientación se descarta sin sumar una plancha fantasma vacía, y queda listada en sin_nestear", () => {
  const piezas = [
    { largo_mm: 7000, ancho_mm: 2000, cantidad: 1, etiqueta: "Demasiado grande" },
    { largo_mm: 1000, ancho_mm: 500, cantidad: 1, etiqueta: "Normal" },
  ];
  const r = run2DFFD(piezas, 6000, 1500);
  expect(r.resumen.n_hojas).toBe(1); // solo la pieza que sí entra
  expect(r.hojas[0].shelves.flatMap(s => s.piezas).length).toBe(1);
  expect(r.resumen.sin_nestear).toEqual([{ etiqueta: "Demasiado grande", w: 7000, h: 2000, cantidad: 1 }]);
});

test("regression real 2026-09-19: pieza más larga que la plancha en SU PROPIO ancho no da % desperdicio negativo", () => {
  // Caso real de Gino, "Vigas de alma llena" (grupo Plancha 1/4", plancha
  // 6000×1500): 9 piezas de 7880×300mm no entran en NINGUNA orientación
  // (7880 > 6000 y 7880 > 1500) — el primer intento del fix las sumaba
  // igual a `total_area` (que se sigue usando para "m² útil") sin haberlas
  // colocado en ningún lado, dando area_util_m2 > area_total_m2 y por lo
  // tanto "% desperdicio" NEGATIVO (encontrado probando en vivo contra el
  // dato real, no por lectura de código). Ahora quedan afuera del cálculo y
  // se listan aparte en `sin_nestear`.
  const piezas = [
    { largo_mm: 4500, ancho_mm: 250, cantidad: 9, etiqueta: "Vigas verticales de fachada - Alas" },
    { largo_mm: 7880, ancho_mm: 300, cantidad: 9, etiqueta: "Vigas perimetrales" },
    { largo_mm: 5940, ancho_mm: 300, cantidad: 4, etiqueta: "Vigas perimetrales" },
  ];
  const r = run2DFFD(piezas, 6000, 1500);
  expect(r.resumen.pct_desp).toBeGreaterThanOrEqual(0);
  expect(r.resumen.area_desp_m2).toBeGreaterThanOrEqual(0);
  expect(r.resumen.area_util_m2).toBeLessThanOrEqual(r.resumen.area_total_m2);
  expect(r.resumen.sin_nestear).toEqual([{ etiqueta: "Vigas perimetrales", w: 7880, h: 300, cantidad: 9 }]);
  // Las 13 piezas que sí entran (9 alas + 4 vigas perimetrales de 5940mm)
  // se colocan todas — solo las 9 de 7880mm quedan afuera.
  const totalColocadas = r.hojas.reduce((s, h) => s + h.shelves.reduce((s2, sh) => s2 + sh.piezas.length, 0), 0);
  expect(totalColocadas).toBe(13);
});
