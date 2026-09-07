import { siguienteNroComputo } from "../Computo";

// Ver Computo.jsx (comentario junto a la función) y CLAUDE.md 2026-08-24:
// el contador guardado en localStorage podía quedar atrás de cómputos
// importados o creados a mano con un N° más alto — "C-003" se sugería de
// nuevo pese a que ya existía un cómputo real con ese número. Este test
// fija esa garantía.
beforeEach(() => {
  localStorage.clear();
});

test("sugiere C-001 cuando no hay contador guardado ni cómputos previos", () => {
  expect(siguienteNroComputo([])).toBe("C-001");
});

test("nunca repite un N° ya usado, aunque el contador guardado esté atrás", () => {
  localStorage.setItem("smeas_computo_nro", "0"); // contador nunca avanzó
  const computos = [{ nro: "C-001" }, { nro: "C-002" }, { nro: "C-003" }];
  expect(siguienteNroComputo(computos)).toBe("C-004");
});

test("avanza el contador guardado entre llamadas sucesivas", () => {
  const primero = siguienteNroComputo([]);
  const segundo = siguienteNroComputo([]);
  expect(primero).toBe("C-001");
  expect(segundo).toBe("C-002");
});

test("salta huecos si varios números seguidos ya están ocupados", () => {
  const computos = [{ nro: "C-001" }, { nro: "C-002" }];
  expect(siguienteNroComputo(computos)).toBe("C-003");
});
