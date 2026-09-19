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

// Set de piezas realista tipo "vigas de alma llena": almas (tiras altas y
// angostas), alas (tiras bajas y anchas) y rigidizadores (piezas chicas y
// altas) con áreas y alturas que NO están correlacionadas entre sí — el
// mismo patrón que hace fallar al ordenamiento por área.
function piezasVigaDeAlmaLlena() {
  return [
    { largo_mm: 5800, ancho_mm: 900, cantidad: 4, etiqueta: "Alma" },
    { largo_mm: 5800, ancho_mm: 300, cantidad: 8, etiqueta: "Ala" },
    { largo_mm: 5800, ancho_mm: 250, cantidad: 4, etiqueta: "Ala corta" },
    { largo_mm: 400, ancho_mm: 850, cantidad: 10, etiqueta: "Rigidizador" },
    { largo_mm: 200, ancho_mm: 780, cantidad: 10, etiqueta: "Rigidizador chico" },
  ];
}

test("ordenar por altura (FFDH) + best-fit da igual o menos planchas que ordenar por área", () => {
  const piezas = piezasVigaDeAlmaLlena();
  const nuevo = run2DFFD(piezas, 6000, 1500);
  const viejo = run2DFFD_viejo(piezas, 6000, 1500);

  expect(nuevo.resumen.n_hojas).toBeLessThanOrEqual(viejo.resumen.n_hojas);
  // el área útil real (lo que hay que cortar) es la misma pieza por pieza,
  // sin importar el algoritmo — solo cambia cuántas planchas hacen falta
  expect(nuevo.resumen.area_util_m2).toBeCloseTo(viejo.resumen.area_util_m2, 1);
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

test("una pieza más grande que la plancha en cualquier orientación se descarta sin sumar una plancha fantasma vacía", () => {
  const piezas = [
    { largo_mm: 7000, ancho_mm: 2000, cantidad: 1, etiqueta: "Demasiado grande" },
    { largo_mm: 1000, ancho_mm: 500, cantidad: 1, etiqueta: "Normal" },
  ];
  const r = run2DFFD(piezas, 6000, 1500);
  expect(r.resumen.n_hojas).toBe(1); // solo la pieza que sí entra
  expect(r.hojas[0].shelves.flatMap(s => s.piezas).length).toBe(1);
});

test("todas las piezas pedidas terminan colocadas en alguna hoja (ninguna se pierde)", () => {
  const piezas = piezasVigaDeAlmaLlena();
  const r = run2DFFD(piezas, 6000, 1500);
  const totalPedidas = piezas.reduce((s, p) => s + (parseInt(p.cantidad) || 1), 0);
  const totalColocadas = r.hojas.reduce((s, h) => s + h.shelves.reduce((s2, sh) => s2 + sh.piezas.length, 0), 0);
  expect(totalColocadas).toBe(totalPedidas);
});

test("__debug numeros reales (temporal)", () => {
  const piezas = piezasVigaDeAlmaLlena();
  const nuevo = run2DFFD(piezas, 6000, 1500);
  const viejo = run2DFFD_viejo(piezas, 6000, 1500);
  console.log("NUEVO n_hojas:", nuevo.resumen.n_hojas, "pct_util:", nuevo.resumen.pct_util);
  console.log("VIEJO n_hojas:", viejo.resumen.n_hojas);
  expect(true).toBe(true);
});
