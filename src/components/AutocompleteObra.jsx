import { useState } from "react";
import { C } from "../styles/colors";
import { useListaObras } from "../utils/storage";

// Mismo patrón visual que AutocompleteCliente/AutocompleteEmpresa
// (2026-08-29) — a diferencia de esos dos, NO registra nada al tipear: la
// única forma de crear una obra nueva es ObraRapidaModal (obligatorio).
// Este campo solo sugiere las obras reales ya existentes.
export default function AutocompleteObra({ value, onChange, placeholder, style, autoFocus }) {
  const lista = useListaObras();
  const [open, setOpen] = useState(false);

  const q = (value || "").trim().toLowerCase();
  const sugerencias = q ? lista.filter((o) => (o.nombre || "").toLowerCase().includes(q)).slice(0, 8) : [];

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        autoComplete="off"
        autoFocus={autoFocus}
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        style={style}
      />
      {open && sugerencias.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
          marginTop: 2, maxHeight: 180, overflowY: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,.35)",
        }}>
          {sugerencias.map((o) => (
            <div
              key={o.id}
              onMouseDown={(e) => { e.preventDefault(); onChange(o.nombre); setOpen(false); }}
              style={{ padding: "7px 10px", cursor: "pointer", fontSize: 13, color: C.text }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.bg; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {o.nombre}{o.empresa ? <span style={{ color: C.muted }}> — {o.empresa}</span> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
