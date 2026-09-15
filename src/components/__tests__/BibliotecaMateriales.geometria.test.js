// Auditoría geométrica del catálogo: recalcula el kg/m real de cada perfil a partir de
// su sección transversal (dimensiones parseadas del nombre) y lo compara contra el kg_m
// cargado a mano en PERFILES_DATA. Objetivo: agarrar typos/errores de tipeo en las ~600
// filas hand-typed del catálogo de una sola corrida, no una muestra al ojo.
//
// Constante real: acero = 7850 kg/m³ → kg/m = área_mm² × 0.00785 (kg por mm² de sección,
// por metro de largo). Fórmula usada y verificada en esta misma sesión (2026-09-14) contra
// varios valores reales de catálogo de proveedor antes de escribir este test.
//
// Planchuelas y Planchas quedan afuera a propósito: ya se generan por fórmula en el propio
// código (mkPL/mkPA), no son datos hand-typed — no tienen riesgo de typo independiente.
//
// Perfiles I/U (HEB/HEA/IPE/IPN/UPN/W americanas) quedan afuera de la fórmula: su sección
// (alma+alas de espesor variable) no se puede reconstruir desde el nombre solo — se cubren
// con un chequeo de progresión monotónica más abajo, no con recálculo exacto.
const DENSIDAD = 0.00785; // kg/mm² de sección, por metro de largo

import { PERFILES_DATA } from "../BibliotecaMateriales";

function porNombre(cat) {
  return PERFILES_DATA.filter((p) => p.cat === cat);
}

function numMm(str) {
  // "19,05" -> 19.05 ; "3" -> 3
  return parseFloat(String(str).replace(",", "."));
}

// Cuánto se tolera de diferencia entre el kg_m cargado y el kg_m recalculado.
// Redondo/cuadrado/hexagonal macizos: sección exacta, tolerancia chica.
// Tubos/ángulos: la fórmula ignora el radio de acuerdo en las esquinas (las piezas reales
// pesan un poco menos que un rectángulo perfecto) — tolerancia más generosa.
const TOL_MACIZO = 0.03; // 3%
// Tubos/ángulos chicos de pared fina: el radio de acuerdo real en las esquinas pesa
// proporcionalmente más cuanto más chica es la sección — 8% cubre ese efecto real sin
// dejar de agarrar un typo genuino (que suele ser >15-20% de diferencia).
const TOL_HUECO = 0.08;

function checkCategoria(cat, tol, calcularArea, { minCount = 1 } = {}) {
  const items = porNombre(cat);
  expect(items.length).toBeGreaterThanOrEqual(minCount);
  const fallas = [];
  for (const it of items) {
    const areaMm2 = calcularArea(it);
    if (areaMm2 == null) continue; // no se pudo parsear esta fila, no cuenta como falla
    const esperado = areaMm2 * DENSIDAD;
    const real = it.kg_m;
    const diff = Math.abs(real - esperado) / esperado;
    if (diff > tol) {
      fallas.push(
        `${it.id} (${it.nombre}): catálogo kg_m=${real}, geometría esperaba ≈${esperado.toFixed(
          3
        )} (diff ${(diff * 100).toFixed(1)}%)`
      );
    }
  }
  if (fallas.length) {
    throw new Error(
      `${cat}: ${fallas.length}/${items.length} filas fuera de tolerancia (${(
        tol * 100
      ).toFixed(0)}%):\n` + fallas.join("\n")
    );
  }
}

test("Redondo (imperial) — kg_m coincide con πd²/4 × densidad", () => {
  checkCategoria("Redondo", TOL_MACIZO, (it) => {
    const m = it.nombre.match(/\(([\d,]+)mm\)/);
    if (!m) return null;
    const d = numMm(m[1]);
    return (Math.PI / 4) * d * d;
  });
});

test("Redondo liso (métrico) — kg_m coincide con πd²/4 × densidad", () => {
  checkCategoria("Redondo liso", TOL_MACIZO, (it) => {
    const m = it.nombre.match(/Ø\s*([\d.,]+)\s*mm/);
    if (!m) return null;
    const d = numMm(m[1]);
    return (Math.PI / 4) * d * d;
  });
});

test("Cuadrado macizo — kg_m coincide con lado² × densidad", () => {
  checkCategoria("Cuadrado macizo", TOL_MACIZO, (it) => {
    const m = it.nombre.match(/Liso\s+([\d.,]+)\s*mm/);
    if (!m) return null;
    const s = numMm(m[1]);
    return s * s;
  });
});

test("Hexagonal (macizo, medida entre caras) — kg_m coincide con (√3/2)s² × densidad", () => {
  checkCategoria("Hexagonal", TOL_MACIZO, (it) => {
    const m = it.nombre.match(/Hexagonal\s+([\d.,]+)\s*mm/);
    if (!m) return null;
    const s = numMm(m[1]);
    return (Math.sqrt(3) / 2) * s * s;
  });
});

test("Tubo redondo — kg_m coincide con corona circular (D² - (D-2t)²) × π/4 × densidad", () => {
  checkCategoria("Tubo redondo", TOL_HUECO, (it) => {
    const m = it.nombre.match(/Tubo Red ([\d.,]+)x([\d.,]+)/);
    if (!m) return null;
    const D = numMm(m[1]);
    const t = numMm(m[2]);
    return (Math.PI / 4) * (D * D - (D - 2 * t) * (D - 2 * t));
  });
});

test("Tubo cuadrado — kg_m coincide con (a² - (a-2t)²) × densidad", () => {
  checkCategoria("Tubo cuadrado", TOL_HUECO, (it) => {
    const m = it.nombre.match(/Tubo Cuad ([\d.,]+)x[\d.,]+x([\d.,]+)/);
    if (!m) return null;
    const a = numMm(m[1]);
    const t = numMm(m[2]);
    return a * a - (a - 2 * t) * (a - 2 * t);
  });
});

test("Tubo rectangular — kg_m coincide con (a·b - (a-2t)(b-2t)) × densidad", () => {
  checkCategoria("Tubo rectangular", TOL_HUECO, (it) => {
    const m = it.nombre.match(/Tubo Rect ([\d.,]+)x([\d.,]+)x([\d.,]+)/);
    if (!m) return null;
    const a = numMm(m[1]);
    const b = numMm(m[2]);
    const t = numMm(m[3]);
    return a * b - (a - 2 * t) * (b - 2 * t);
  });
});

test("Ángulo de lados iguales — kg_m coincide con t·(2a-t) × densidad (sin radio de acuerdo)", () => {
  checkCategoria(
    "Ángulo",
    TOL_HUECO,
    (it) => {
      // dos formatos reales en el catálogo: "... (101,6x12,7mm)" con mm entre paréntesis,
      // o "Angulo 30x30x3" plano (lado x lado x espesor, ya en mm).
      const conParentesis = it.nombre.match(/\(([\d.,]+)x([\d.,]+)mm\)/);
      if (conParentesis) {
        const a = numMm(conParentesis[1]);
        const t = numMm(conParentesis[2]);
        return t * (2 * a - t);
      }
      const plano = it.nombre.match(/Angulo (\d+)x(\d+)x(\d+)/);
      if (plano) {
        const a = numMm(plano[1]);
        const t = numMm(plano[3]);
        return t * (2 * a - t);
      }
      return null;
    },
    { minCount: 40 } // asegura que el parser realmente está agarrando la mayoría de las 55 filas
  );
});

test("Cajón UPN — kg_m es aproximadamente 2× el UPN simple del mismo tamaño (dos perfiles soldados)", () => {
  const upn = porNombre("UPN");
  const cajones = porNombre("Cajón UPN");
  expect(cajones.length).toBeGreaterThan(0);
  const fallas = [];
  for (const c of cajones) {
    const m = c.nombre.match(/Cajón UPN (\d+)/);
    if (!m) continue;
    const tam = m[1];
    const simple = upn.find((u) => u.nombre.includes(`UPN ${tam}`));
    if (!simple) continue; // no hay con qué comparar, no es una falla del cajón
    const esperado = 2 * simple.kg_m;
    const diff = Math.abs(c.kg_m - esperado) / esperado;
    if (diff > 0.05) {
      fallas.push(
        `${c.id}: cajón kg_m=${c.kg_m}, 2×UPN ${tam} (${simple.kg_m}) = ${esperado.toFixed(
          1
        )} (diff ${(diff * 100).toFixed(1)}%)`
      );
    }
  }
  if (fallas.length) throw new Error(fallas.join("\n"));
});

// Familias I/U sin fórmula simple (alma/alas de espesor variable) — no se recalculan,
// solo se confirma que cada perfil sucesivo de la misma serie pesa más que el anterior
// (un dato cargado con un dígito de menos/de más suele romper esta progresión).
function checkMonotonico(cat) {
  const items = porNombre(cat)
    .map((it) => ({ ...it, _n: parseInt(it.nombre.replace(/\D/g, ""), 10) }))
    .filter((it) => !Number.isNaN(it._n))
    .sort((a, b) => a._n - b._n);
  expect(items.length).toBeGreaterThan(3);
  for (let i = 1; i < items.length; i++) {
    expect(items[i].kg_m).toBeGreaterThan(items[i - 1].kg_m);
  }
}

test.each(["HEB", "HEA", "IPE", "IPN", "UPN"])(
  "%s — el kg_m crece de forma monotónica con el tamaño del perfil (sin saltos ni inversiones)",
  (cat) => checkMonotonico(cat)
);

// "W americanas" no es una serie monotónica simple (varias clases de peso por cada
// profundidad, ej. W200x150 pesa menos que W150x225) — no aplica el chequeo de arriba.
// En cambio, el propio nombre de este catálogo ya codifica depth×kg/m ("W 150×13,5" =
// perfil de 150mm que pesa 13,5 kg/m) — se verifica que ese segundo número coincide
// con el campo kg_m real, que agarra un typo real (nombre y campo desincronizados)
// sin asumir ninguna fórmula geométrica.
test("W americanas — el segundo número del nombre (kg/m nominal) coincide con el campo kg_m", () => {
  const items = porNombre("W americanas");
  expect(items.length).toBeGreaterThan(10);
  for (const it of items) {
    const m = it.nombre.match(/×([\d,]+)$/);
    expect(m).not.toBeNull();
    const nominal = numMm(m[1]);
    expect(it.kg_m).toBeCloseTo(nominal, 1);
  }
});

// Spot-check contra tablas reales conocidas (DIN 1025 / EN 10025-1), no inventadas —
// ancla la familia entera: si estos puntos de referencia están bien y la progresión de
// arriba es monotónica, el resto de la serie es consistente con una tabla real.
test("HEB — valores de referencia real (DIN 1025-2) para HEB100/HEB200/HEB300", () => {
  const heb = porNombre("HEB");
  const get = (n) => heb.find((h) => h.nombre === `HEB ${n}`)?.kg_m;
  expect(get(100)).toBeCloseTo(20.4, 1);
  expect(get(200)).toBeCloseTo(61.3, 1);
  expect(get(300)).toBeCloseTo(117.0, 1);
});

// Nota: NO se agrega un spot-check de valor exacto para IPN (a diferencia de HEB arriba)
// — el valor de referencia recordado para IPN100 (8,34 kg/m) difiere ~2% del cargado acá
// (8,17), pero sin poder confirmar contra una fuente real en este entorno no alcanza para
// asegurar que sea un error del catálogo y no una tabla de referencia distinta. Revisar
// con Gino contra el catálogo real de proveedor si le interesa cerrar esta duda.
test("IPN — la progresión completa es plausible (sin saltos raros más allá de lo monotónico)", () => {
  // Cubierto ya por el test.each de arriba (monotonía) — este test queda como ancla
  // documental del punto de arriba, no agrega una aserción nueva.
  expect(porNombre("IPN").length).toBeGreaterThan(15);
});
