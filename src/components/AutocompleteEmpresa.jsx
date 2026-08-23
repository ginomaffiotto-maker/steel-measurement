import { useState } from "react";
import { C } from "../styles/colors";
import { useListaEmpresas } from "../utils/storage";

// Mismo patrón que AutocompleteCliente, pero para el campo "Empresa"
// (2026-08-23) — sin efecto de registro automático, es solo metadata que
// viaja junto al Cliente (contacto). La lista sale de `clientes.empresa`.
export default function AutocompleteEmpresa({ value, onChange, placeholder, style, autoFocus }) {
  const lista = useListaEmpresas();
  const [open, setOpen] = useState(false);

  const q = (value || "").trim().toLowerCase();
  const sugerencias = q ? lista.filter((n) => n.toLowerCase().includes(q)).slice(0, 8) : [];

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
          {sugerencias.map((n) => (
            <div
              key={n}
              onMouseDown={(e) => { e.preventDefault(); onChange(n); setOpen(false); }}
              style={{ padding: "7px 10px", cursor: "pointer", fontSize: 13, color: C.text }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.bg; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {n}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
