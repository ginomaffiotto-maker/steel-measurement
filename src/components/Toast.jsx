import { useState, useRef } from "react";
import { C, BTN } from "../styles/colors";

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
