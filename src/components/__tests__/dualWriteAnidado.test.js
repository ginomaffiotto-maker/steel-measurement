import { render, screen, fireEvent, act } from "@testing-library/react";
import Anidado from "../Anidado";
import { saveDBAnidado } from "../../utils/storage";

// Mismo bug real y misma causa raíz ya encontrados y corregidos en
// Computo.jsx/dualWriteComputo (ver mutateComputo.test.js): `saveDBAnidado`
// hace un DELETE + INSERT COMPLETO de anidado_grupos/anidado_piezas en cada
// guardado, y `dualWriteAnidado` se disparaba sin esperar en cada edición —
// dos guardados seguidos del mismo anidado podían mandar dos requests en
// paralelo, y si el más VIEJO (con menos datos) tardaba más en volver que el
// más NUEVO, terminaba corriendo su DELETE+INSERT último y borraba lo que el
// más nuevo ya había guardado bien. `dualWriteAnidado` ahora encola por
// anidado: cada escritura espera a que la ANTERIOR (mismo id) termine antes
// de arrancar la propia.
jest.mock("../../utils/supabaseClient", () => ({
  supabase: { auth: { getSession: () => Promise.resolve({ data: { session: null } }) } },
}));
jest.mock("../../utils/storage", () => ({
  ...jest.requireActual("../../utils/storage"),
  saveDBAnidado: jest.fn(() => Promise.resolve({ id: "anidado-1" })),
}));

const USUARIO = { id: 1, nombre: "QA", rol: "admin" };

function seedAnidado() {
  localStorage.setItem("smeas_anidados", JSON.stringify([{
    id: "anidado-1", nombre: "Anidado de prueba QA", fecha: "2026-09-13",
    cliente: "", empresa: "", obra: "", categoria: "", tipo_trabajo: "Fabricación",
    vendedor: "", grupos: [],
  }]));
}

beforeEach(() => {
  localStorage.clear();
});

test("dualWriteAnidado serializa: la escritura de una edición vieja no puede pisar en Supabase a una más nueva", async () => {
  saveDBAnidado.mockClear();
  const resolvers = [];
  saveDBAnidado.mockImplementation(
    (row) => new Promise((resolve) => resolvers.push(() => resolve(row)))
  );

  seedAnidado();
  render(<Anidado usuario={USUARIO} usuarios={[]} tcGlobal={40} logear={() => {}} />);
  fireEvent.click(screen.getByText("Anidado de prueba QA"));

  const agregarPerfilBtn = screen.getByText("+ Perfil");

  // Edición #1: agrega un grupo (queda con 1) — se dispara sin esperar a que
  // la llamada de red (mockeada) resuelva. Cada click va en su propio ciclo
  // de act() (no los dos juntos) para no mezclar esto con el bug DISTINTO
  // de closure stale que ya tiene `upd`/`actual` en este archivo (sin
  // mutator tipo `mutateComputo` — fuera de alcance acá, esto solo prueba
  // la cola de escrituras).
  fireEvent.click(agregarPerfilBtn);
  await act(async () => { await Promise.resolve(); });
  expect(saveDBAnidado).toHaveBeenCalledTimes(1);
  expect(saveDBAnidado.mock.calls[0][0].grupos).toHaveLength(1);

  // Edición #2, SIN esperar a que la #1 termine: agrega un segundo grupo
  // (2 en total) — mismo patrón real que perdió datos en Cómputo, la
  // escritura vieja (#1) todavía no volvió de la red cuando la nueva (#2)
  // ya está lista para salir.
  fireEvent.click(agregarPerfilBtn);
  await act(async () => { await Promise.resolve(); });

  // La escritura #2 tiene que estar ESPERANDO a la #1 — todavía no debería
  // haberse llamado a saveDBAnidado una segunda vez.
  expect(saveDBAnidado).toHaveBeenCalledTimes(1);

  // Ahora "responde" la request más vieja (#1) — con el bug real, las dos ya
  // habrían salido en paralelo y esto no cambiaría nada.
  await act(async () => {
    resolvers[0]();
    await Promise.resolve();
    await Promise.resolve();
  });

  // Recién ahora debería dispararse la escritura #2, con los 2 grupos —
  // nunca al revés (la vieja, con 1, pisando a la nueva).
  expect(saveDBAnidado).toHaveBeenCalledTimes(2);
  expect(saveDBAnidado.mock.calls[1][0].grupos).toHaveLength(2);
});
