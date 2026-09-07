import { useState, useRef, useEffect, useCallback } from "react";
import { C, BTN } from "../styles/colors";
import { onToastBus } from "../utils/toastBus";

// Aviso temporal con botón "Deshacer" (2026-08-24) — se usa junto con
// soft-delete: al eliminar algo no se borra de verdad, solo se marca, y este
// toast da unos segundos para revertirlo sin tener que ir a la Papelera.
// Si se deja pasar, el registro sigue existiendo igual (marcado eliminado) —
// un admin todavía puede restaurarlo después desde la Papelera, sin límite
// de tiempo. Mismo espíritu que el toast de steelCRM, hook propio acá.
export function useUndoToast() {
  const [toast, setToast] = useState(null); // { msg, onUndo } | null
  const timerRef = useRef(null);

  const show = (msg, onUndo, duracionMs = 7000) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ msg, onUndo });
    timerRef.current = setTimeout(() => setToast(null), duracionMs);
  };

  const Toast = toast ? (
    <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:3000,
      background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 16px",
      display:"flex", alignItems:"center", gap:14, boxShadow:"0 10px 30px #0007" }}>
      <span style={{ fontSize:13, color:C.text }}>{toast.msg}</span>
      <button onClick={() => { toast.onUndo(); setToast(null); if (timerRef.current) clearTimeout(timerRef.current); }}
        style={{ ...BTN("ghost"), padding:"5px 14px", fontSize:12, borderColor:C.accent+"66", color:C.accent, whiteSpace:"nowrap" }}>
        ↩ Deshacer
      </button>
    </div>
  ) : null;

  return { show, Toast };
}

// Toast genérico (2026-09-07, reemplazo de alert() nativo) — se monta una
// sola vez en App.js y escucha el bus de utils/toastBus.js, así cualquier
// archivo puede avisar algo sin pasar props por varios niveles. Distinto de
// useUndoToast de arriba (uno solo a la vez, con acción de deshacer) — acá
// se apilan varios y cada uno se auto-cierra solo, mismo criterio que ya
// usa Steel CRM.
const TOAST_COLORS = {
  ok:   { bg: "#16a34a", border: "#22c55e", icon: "✅" },
  err:  { bg: "#b91c1c", border: "#ef4444", icon: "❌" },
  warn: { bg: "#b45309", border: "#f59e0b", icon: "⚠️" },
  info: { bg: "#1d4ed8", border: "#4a9eda", icon: "ℹ️" },
};

function GenericToastItem({ msg, tipo, onDone }) {
  const col = TOAST_COLORS[tipo] || TOAST_COLORS.info;
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: col.bg, border: "1px solid " + col.border, borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 13, fontWeight: 600, boxShadow: "0 6px 20px #0006", maxWidth: 380 }}>
    <span>{col.icon}</span><span>{msg}</span>
    </div>
  );
}

export function useToastBus() {
  const [toasts, setToasts] = useState([]);
  const remove = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);
  useEffect(() => onToastBus((msg, tipo) => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, tipo }]);
  }), []);
  const ToastBusContainer = toasts.length > 0 ? (
    <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 10, zIndex: 99999 }}>
      {toasts.map(t => <GenericToastItem key={t.id} msg={t.msg} tipo={t.tipo} onDone={() => remove(t.id)} />)}
    </div>
  ) : null;
  return ToastBusContainer;
}
