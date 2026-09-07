import { FAMILIAS, familiaDe } from "./taxonomia";

// familiaDe resuelve Categoría → Familia para Historial/Comparativa
// (agrupar por familia, ver CLAUDE.md — "calcBenchmark cubre el 100% de
// los trabajos"). Si el índice interno (categoriaAFamilia) se desincroniza
// de FAMILIAS, un trabajo real podría quedar agrupado como "Sin familia"
// en silencio sin que nadie lo note.
test("toda categoría de FAMILIAS resuelve a su propia familia real (índice consistente)", () => {
  Object.entries(FAMILIAS).forEach(([familia, categorias]) => {
    categorias.forEach(categoria => {
      expect(familiaDe(categoria)).toBe(familia);
    });
  });
});

test("una categoría inexistente devuelve 'Sin familia' en vez de undefined/explotar", () => {
  expect(familiaDe("Categoría que no existe")).toBe("Sin familia");
  expect(familiaDe("")).toBe("Sin familia");
  expect(familiaDe(undefined)).toBe("Sin familia");
});

test("ninguna categoría está repetida en más de una Familia", () => {
  const vistas = new Map();
  const duplicadas = [];
  Object.entries(FAMILIAS).forEach(([familia, categorias]) => {
    categorias.forEach(categoria => {
      if (vistas.has(categoria)) duplicadas.push({ categoria, familias: [vistas.get(categoria), familia] });
      vistas.set(categoria, familia);
    });
  });
  expect(duplicadas).toEqual([]);
});
