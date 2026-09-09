// Bus de eventos chico para poder disparar un toast desde cualquier archivo
// sin pasar el estado de toasts como prop por varios niveles de componentes
// (2026-09-07, reemplazo de alert() nativo). App.js se suscribe una sola vez
// vía useToastBus() (components/Toast.jsx).
const listeners = new Set();

export function toastError(msg) { emit(msg, "err"); }
export function toastWarn(msg) { emit(msg, "warn"); }
export function toastOk(msg) { emit(msg, "ok"); }

function emit(msg, tipo) {
  listeners.forEach(fn => fn(msg, tipo));
}

export function onToastBus(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
