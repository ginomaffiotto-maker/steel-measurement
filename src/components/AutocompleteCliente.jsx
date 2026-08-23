import { useState } from "react";
import { C } from "../styles/colors";
import { useListaClientes, registrarCliente } from "../utils/storage";

// Reemplaza el <input list="clientes-datalist"> nativo (2026-08-23) —
// el <datalist> de HTML filtra mal y de forma inconsistente entre
// navegadores, y en algunos casos daba la sensación de "trabar" el campo
// después de elegir una sugerencia. Filtrado propio, controlado, siempre
// editable después de elegir.
export default function AutocompleteCliente({ value, onChange, placeholder, style, autoFocus, onBlurExtra }) {
  const lista = useListaClientes();
  const [open, setOpen] = useState(false);

  const q = (value || "").trim().toLowerCase();
  const sugerencias = q ? lista.filter((n) => n.toLowerCase().includes(q)).slice(0, 8) : [];

  const elegir = (nombre) => {
    onChange(nombre);
    setOpen(false);
    registrarCliente(nombre);
  };

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
        onBlur={(e) => {
          setTimeout(() => setOpen(false), 120);
          registrarCliente(e.target.value);
          if (onBlurExtra) onBlurExtra(e);
        }}
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
              onMouseDown={(e) => { e.preventDefault(); elegir(n); }}
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
