import { render, screen, fireEvent, act } from "@testing-library/react";
import Presupuesto from "../Presupuesto";
import { saveDBPresupuestoSM, saveDBItem, buscarVinculosCRM } from "../../utils/storage";

// Mismo bug real y misma causa raíz ya encontrados y corregidos en
// Computo.jsx/dualWriteComputo y Anidado.jsx/dualWriteAnidado (ver
// mutateComputo.test.js) — acá el riesgo es todavía mayor, porque
// `saveDBItem` hace un DELETE + INSERT COMPLETO de los 9 rubros de costo
// por CADA ítem del presupuesto (no solo la fila del presupuesto en sí).
// `updPres` dispara `dualWritePresupuesto` con un debounce de 800ms — dos
// ediciones separadas por más de 800ms (típico: el usuario agrega un ítem,
// espera, agrega otro) disparan dos guardados reales que pueden llegar a
// Supabase en cualquier orden según la latencia de red de cada uno. La cola
// (mismo mecanismo que dualWriteComputo/dualWriteAnidado) asegura que la
// escritura más vieja nunca pueda pisar en la base a la más nueva.
//
// Sesión ready (a diferencia de Computo/Anidado, acá `dualWritePresupuestoCore`
// llama a `esperarSesion()` antes de escribir — necesita una sesión real
// simulada, si no el guardado ni siquiera arranca).
jest.mock("../../utils/supabaseClient", () => ({
  supabase: { auth: { getSession: () => Promise.resolve({ data: { session: { access_token: "qa" } } }) } },
}));
jest.mock("../../utils/storage", () => ({
  ...jest.requireActual("../../utils/storage"),
  saveDBPresupuestoSM: jest.fn(() => Promise.resolve({ id: "presupuesto-1" })),
  saveDBItem: jest.fn(() => Promise.resolve("item-x")),
  // Sin relación con el fix — DetallePresupuesto la llama directo en un
  // useEffect (para mostrar el vínculo con Steel CRM) apenas monta y
  // encadena `.then(...)` sobre el resultado sin `await`. Se define acá
  // sin cuerpo (jest.fn() a secas) y se le fija la implementación recién en
  // el test — en este entorno, el cuerpo escrito directo en la factory de
  // `jest.mock` no siempre queda activo al llamar la función a través del
  // módulo ya requerido (se comprobó con un mock aislado); fijarla con
  // `.mockImplementation(...)` después de importar sí es confiable.
  buscarVinculosCRM: jest.fn(),
}));

const USUARIO = { id: 1, nombre: "QA", rol: "admin" };

function seedPresupuesto() {
  localStorage.setItem("smeas_presupuestos", JSON.stringify([{
    id: "presupuesto-1", nro: "P-TEST", nombre: "Presupuesto de prueba QA", fecha: "2026-09-13",
    cliente: "", contacto: "", obra: "", categoria: "", tipo_trabajo: "Fabricación",
    vendedor: "", estado: "borrador", codigo_calculo: "SM-2026-0001",
    items: [], comentarios: [], notas: "",
  }]));
}

// Flushea la cadena de promesas reales que corre `dualWritePresupuestoCore`
// antes de llegar a `saveDBPresupuestoSM` (esperarSesion -> supabase.auth.
// getSession() -> ...) sin depender de timers falsos para esa parte.
async function flush(n = 5) {
  for (let i = 0; i < n; i++) await Promise.resolve();
}

beforeEach(() => {
  localStorage.clear();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test("dualWritePresupuesto serializa: la escritura de una edición vieja no puede pisar en Supabase a una más nueva", async () => {
  saveDBPresupuestoSM.mockClear();
  saveDBItem.mockClear();
  saveDBItem.mockImplementation(() => Promise.resolve("item-x"));
  buscarVinculosCRM.mockImplementation(() => Promise.resolve([]));
  const resolvers = [];
  saveDBPresupuestoSM.mockImplementation(
    (row) => new Promise((resolve) => resolvers.push(() => resolve(row)))
  );

  seedPresupuesto();
  render(<Presupuesto usuario={USUARIO} usuarios={[]} tcGlobal={40} logear={() => {}} />);
  fireEvent.click(screen.getByText("Presupuesto de prueba QA"));

  const agregarItemBtn = screen.getByText("+ Agregar ítem");

  // Edición #1: agrega un ítem (presupuesto queda con 1 ítem), y se deja que
  // el debounce de 800ms dispare `dualWritePresupuesto` — la escritura de
  // red (mockeada) queda pendiente, sin resolver todavía.
  await act(async () => {
    fireEvent.click(agregarItemBtn);
    jest.advanceTimersByTime(800);
    await flush();
  });
  expect(saveDBPresupuestoSM).toHaveBeenCalledTimes(1);

  // Edición #2, SIN esperar a que la #1 termine: agrega un segundo ítem
  // (2 en total) y deja pasar otro ciclo de debounce — mismo patrón real
  // que perdió datos en Cómputo: la escritura vieja (#1) todavía no volvió
  // de la red cuando la nueva (#2) ya está lista para salir.
  await act(async () => {
    fireEvent.click(agregarItemBtn);
    jest.advanceTimersByTime(800);
    await flush();
  });

  // La escritura #2 tiene que estar ESPERANDO a la #1 en la cola — todavía
  // no debería haberse llamado a saveDBPresupuestoSM una segunda vez.
  expect(saveDBPresupuestoSM).toHaveBeenCalledTimes(1);
  // Y por lo tanto tampoco se disparó saveDBItem para el ítem 2 — solo el
  // guardado del ítem que ya había en la escritura #1 en curso.
  expect(saveDBItem).toHaveBeenCalledTimes(0);

  // Ahora "responde" la request más vieja (#1) — con el bug real, las dos
  // ya habrían salido en paralelo y esto no cambiaría nada.
  await act(async () => {
    resolvers[0]();
    await flush();
  });

  // La escritura #1 termina de guardar su único ítem...
  expect(saveDBItem).toHaveBeenCalledTimes(1);
  // ...y RECIÉN AHORA arranca la escritura #2 (la cola la deja pasar).
  expect(saveDBPresupuestoSM).toHaveBeenCalledTimes(2);

  // La #2 no tiene ninguna respuesta pendiente que resolver a mano (el mock
  // vuelve a usar el `mockImplementation` de arriba, así que también quedó
  // encolada) — resolverla y confirmar que guarda sus 2 ítems, nunca los
  // que tenía la escritura vieja.
  await act(async () => {
    resolvers[1]();
    await flush();
  });
  expect(saveDBItem).toHaveBeenCalledTimes(3); // 1 (escritura #1) + 2 (escritura #2)
});
