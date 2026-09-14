import { render, screen, fireEvent, act } from "@testing-library/react";
import Computo from "../Computo";
import { saveDBComputo } from "../../utils/storage";

// Segunda causa real del mismo bug, confirmada con datos reales en
// Supabase (no solo local): `saveDBComputo` hace un DELETE + INSERT
// COMPLETO de computo_items/computo_piezas en cada edición, y
// `dualWriteComputo` se disparaba sin esperar en cada cambio — dos
// ediciones seguidas mandaban dos requests en paralelo, y si la más VIEJA
// (con menos datos) tardaba más en volver que la más NUEVA, terminaba
// corriendo su DELETE+INSERT último y borraba lo que la más nueva ya
// había guardado bien. `dualWriteComputo` ahora encola por cómputo:
// cada escritura espera a que la ANTERIOR (para el mismo id) termine
// antes de arrancar la propia.
jest.mock("../../utils/supabaseClient", () => ({
  supabase: { auth: { getSession: () => Promise.resolve({ data: { session: null } }) } },
}));
jest.mock("../../utils/storage", () => ({
  ...jest.requireActual("../../utils/storage"),
  saveDBComputo: jest.fn(() => Promise.resolve({ id: "computo-1" })),
}));

// Bug real (2026-09-13): reportado por Gino con una pieza real perdida
// ("Reguera N° 4") y reproducido en QA — un cómputo con 2 ítems, cada uno
// con una pieza cargada, perdía TODAS las piezas de los DOS ítems al
// recargar la página (local y remoto). Causa raíz: `updateItem`/
// `agregarItem`/`eliminarItem`/`clonarItem` armaban el próximo `computo`
// a partir de la variable `computo` calculada en el render actual — si dos
// ediciones se disparan sin que React llegue a re-renderizar entre medio
// (típico al cargar varias piezas rápido, o vía automatización), la
// segunda pisaba a la primera al reemplazar el ítem/cómputo entero con una
// base ya vieja. El fix (`mutateComputo`/`updateItemMutator`) resuelve
// siempre contra el estado más fresco.
//
// Este test reproduce la misma clase de carrera sin depender del buscador
// de materiales (Combobox): edita el título del Ítem 1 y agrega un Ítem 2
// dentro del MISMO batch de React (sin esperar un re-render entre medio) —
// mismo mecanismo que agregar una pieza a un ítem mientras otro ítem
// también se está editando. Con el bug real, una de las dos ediciones se
// perdía sin importar el orden.

const USUARIO = { id: 1, nombre: "QA", rol: "admin" };

function seedComputo() {
  const item1 = { id: "item-1", titulo: "Ítem 1", cantidad: 1, n_plano: "", piezas: [] };
  const item2 = { id: "item-2", titulo: "Ítem 2", cantidad: 1, n_plano: "", piezas: [] };
  const computo = {
    id: "computo-1", nro: "C-TEST", nombre: "Cómputo de prueba QA",
    fecha: "2026-09-13", cliente: "Cliente QA", empresa: "", obra: "",
    categoria: "", tipo_trabajo: "Fabricación", vendedor: "",
    cantidad_total: 1, items: [item1],
  };
  localStorage.setItem("smeas_computos", JSON.stringify([computo]));
  return { computo, item2 };
}

beforeEach(() => {
  localStorage.clear();
});

test("agregar un ítem y editar otro en el mismo batch no pierde ninguno de los dos cambios", () => {
  seedComputo();
  render(<Computo usuario={USUARIO} usuarios={[]} tcGlobal={40} logear={() => {}} />);

  // Entrar al detalle del cómputo sembrado.
  fireEvent.click(screen.getByText("Cómputo de prueba QA"));

  const tituloInput = screen.getByDisplayValue("Ítem 1");
  const agregarItemBtn = screen.getByText("+ Ítem");

  // Las dos acciones se disparan DENTRO del mismo act() — React las procesa
  // como un solo batch, sin volver a renderizar el componente (y por lo
  // tanto sin refrescar la variable `computo` del render) entre una y otra.
  // Así se reproduce la carrera real sin necesitar esperas artificiales.
  act(() => {
    fireEvent.change(tituloInput, { target: { value: "Ítem 1 editado" } });
    fireEvent.click(agregarItemBtn);
  });

  // Ninguna de las dos ediciones debe perderse: el título cambiado sigue
  // ahí (getByDisplayValue ya tira si no lo encuentra), Y el ítem nuevo
  // también se creó (2 inputs de título en pantalla).
  screen.getByDisplayValue("Ítem 1 editado");
  expect(screen.getAllByPlaceholderText("Nombre del ítem")).toHaveLength(2);

  const guardado = JSON.parse(localStorage.getItem("smeas_computos"));
  const c = guardado.find((x) => x.id === "computo-1");
  expect(c.items).toHaveLength(2);
  expect(c.items[0].titulo).toBe("Ítem 1 editado");
});

test("agregar una pieza a un ítem y crear otro ítem en el mismo batch conserva la pieza", () => {
  // Ítem 1 ya arranca con una pieza cargada (equivalente a haber pasado
  // por el formulario de Perfil/Planchuela) — la carrera real que perdió
  // la Reguera N° 4 en producción es editar/crear OTRO ítem mientras esa
  // pieza ya está ahí, sin que React llegue a re-renderizar entre medio.
  const piezaDePrueba = {
    id: "pieza-1", tipo: "perfil", material_id: "MAT-1", material_nombre: "Perfil de prueba",
    kg_m: 2, sup_m2m: 0, largo_mm_input: "1000", largo_mm: "", ancho_mm: "", cantidad: 1, ficha: {},
  };
  localStorage.setItem("smeas_computos", JSON.stringify([{
    id: "computo-1", nro: "C-TEST", nombre: "Cómputo de prueba QA", fecha: "2026-09-13",
    cliente: "Cliente QA", empresa: "", obra: "", categoria: "", tipo_trabajo: "Fabricación",
    vendedor: "", cantidad_total: 1,
    items: [{ id: "item-1", titulo: "Ítem 1", cantidad: 1, n_plano: "", piezas: [piezaDePrueba] }],
  }]));

  render(<Computo usuario={USUARIO} usuarios={[]} tcGlobal={40} logear={() => {}} />);
  fireEvent.click(screen.getByText("Cómputo de prueba QA"));

  const agregarItemBtn = screen.getByText("+ Ítem");
  const cantidadInput = screen.getAllByDisplayValue("1").find((el) => el.type === "number");

  act(() => {
    // Edición concurrente sobre el propio ítem 1 (cantidad de unidades) +
    // alta de un ítem nuevo, sin re-render entre medio.
    if (cantidadInput) fireEvent.change(cantidadInput, { target: { value: "3" } });
    fireEvent.click(agregarItemBtn);
  });

  const guardado = JSON.parse(localStorage.getItem("smeas_computos"));
  const c = guardado.find((x) => x.id === "computo-1");
  expect(c.items).toHaveLength(2);
  // La pieza cargada en el ítem 1 tiene que seguir estando — antes del fix,
  // el alta del ítem 2 (armada sobre un `computo` desactualizado) la
  // descartaba sin ningún error visible.
  expect(c.items[0].piezas).toHaveLength(1);
  expect(c.items[0].piezas[0].material_nombre).toBe("Perfil de prueba");
});

test("editar un campo de cabecera (Nombre) justo después de agregar un ítem, en el mismo batch, no pierde el ítem nuevo ni la pieza ya cargada", () => {
  // Tercera causa real del mismo bug (2026-09-14), reproducida en vivo con
  // datos reales de Supabase (C-016: 2 piezas cargadas, ninguna sobrevivió
  // ni local ni remoto). A diferencia de `agregarItem`/`eliminarItem`
  // (ya arreglados el 2026-09-13, ver test de arriba), `updateComputo`
  // — usado por Nombre/Tipo de trabajo/Categoría/Vendedor/Archivos/
  // Cantidad total — seguía armando el objeto de reemplazo a partir del
  // `computo` capturado en el render ANTES de aplicar el patch. Si esa
  // edición de cabecera se dispara justo después de una edición de
  // ítem/pieza dentro del mismo batch (típico: tocar el selector de
  // Vendedor o Cantidad total apenas se termina de cargar una pieza), el
  // reemplazo completo pisaba lo que la edición de ítem ya había agregado
  // — aunque esa SÍ usara el patrón seguro (`mutateComputo`). El fix hace
  // que `updateComputo` también resuelva contra el estado más fresco.
  const piezaDePrueba = {
    id: "pieza-1", tipo: "perfil", material_id: "MAT-1", material_nombre: "Perfil de prueba",
    kg_m: 2, sup_m2m: 0, largo_mm_input: "1000", largo_mm: "", ancho_mm: "", cantidad: 1, ficha: {},
  };
  localStorage.setItem("smeas_computos", JSON.stringify([{
    id: "computo-1", nro: "C-TEST", nombre: "Cómputo de prueba QA", fecha: "2026-09-13",
    cliente: "Cliente QA", empresa: "", obra: "", categoria: "", tipo_trabajo: "Fabricación",
    vendedor: "", cantidad_total: 1,
    items: [{ id: "item-1", titulo: "Ítem 1", cantidad: 1, n_plano: "", piezas: [piezaDePrueba] }],
  }]));

  render(<Computo usuario={USUARIO} usuarios={[]} tcGlobal={40} logear={() => {}} />);
  fireEvent.click(screen.getByText("Cómputo de prueba QA"));

  const agregarItemBtn = screen.getByText("+ Ítem");
  const nombreInput = screen.getByDisplayValue("Cómputo de prueba QA");

  // Orden real del bug: primero la edición de ítem (agrega Ítem 2, ya
  // arreglada — funcional y fresca), DESPUÉS la edición de cabecera (la
  // que todavía armaba su reemplazo con el `computo` viejo) — sin
  // re-render entre medio.
  act(() => {
    fireEvent.click(agregarItemBtn);
    fireEvent.change(nombreInput, { target: { value: "Cómputo renombrado" } });
  });

  const guardado = JSON.parse(localStorage.getItem("smeas_computos"));
  const c = guardado.find((x) => x.id === "computo-1");
  expect(c.nombre).toBe("Cómputo renombrado");
  expect(c.items).toHaveLength(2);
  expect(c.items[0].piezas).toHaveLength(1);
  expect(c.items[0].piezas[0].material_nombre).toBe("Perfil de prueba");
});

test("dualWriteComputo serializa: la escritura de una edición vieja no puede pisar en Supabase a una más nueva", async () => {
  saveDBComputo.mockClear();
  const resolvers = [];
  saveDBComputo.mockImplementation(
    (row) => new Promise((resolve) => resolvers.push(() => resolve(row)))
  );

  localStorage.setItem("smeas_computos", JSON.stringify([{
    id: "computo-1", nro: "C-TEST", nombre: "Cómputo de prueba QA", fecha: "2026-09-13",
    cliente: "", empresa: "", obra: "", categoria: "", tipo_trabajo: "Fabricación",
    vendedor: "", cantidad_total: 1,
    items: [{ id: "item-1", titulo: "Ítem 1", cantidad: 1, n_plano: "", piezas: [] }],
  }]));

  render(<Computo usuario={USUARIO} usuarios={[]} tcGlobal={40} logear={() => {}} />);
  fireEvent.click(screen.getByText("Cómputo de prueba QA"));

  const agregarItemBtn = screen.getByText("+ Ítem");
  // Dos altas de ítem seguidas, SIN esperar a que la primera llamada de
  // red (mockeada) resuelva — exactamente el patrón real de cargar varias
  // piezas rápido, una detrás de la otra.
  await act(async () => {
    fireEvent.click(agregarItemBtn); // dispara dualWriteComputo #1 (2 ítems)
    fireEvent.click(agregarItemBtn); // dispara dualWriteComputo #2 (3 ítems)
    await Promise.resolve();
  });

  // La escritura #2 tiene que estar ESPERANDO a la #1 — todavía no debería
  // haberse llamado a saveDBComputo una segunda vez.
  expect(saveDBComputo).toHaveBeenCalledTimes(1);
  expect(saveDBComputo.mock.calls[0][0].items).toHaveLength(2);

  // Ahora "responde" la request más vieja (#1) — con el bug real, las dos
  // ya habrían salido en paralelo y esto no cambiaría nada.
  await act(async () => {
    resolvers[0]();
    await Promise.resolve();
    await Promise.resolve();
  });

  // Recién ahora debería dispararse la escritura #2, con los 3 ítems —
  // nunca al revés (la vieja, con 2, pisando a la nueva).
  expect(saveDBComputo).toHaveBeenCalledTimes(2);
  expect(saveDBComputo.mock.calls[1][0].items).toHaveLength(3);
});
