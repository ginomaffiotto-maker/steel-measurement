import { useState } from "react";
import { C } from "../styles/colors";
import { useListaEmpresas } from "../utils/storage";

// Mismo patrón que AutocompleteCliente/AutocompleteObra — solo sugiere,
// nunca crea nada al tipear. Desde 2026-08-29 la lista sale de la tabla
// real `empresas` (antes derivaba de `clientes.empresa`, sin tabla
// propia) — la única forma de crear una empresa nueva es
// EmpresaRapidaModal, obligatorio en las pantallas que la usan.
export default function AutocompleteEmpresa({ value, onChange, placeholder, style, autoFocus }) {
  const lista = useListaEmpresas();
  const [open, setOpen] = useState(false);

  const q = (value || "").trim().toLowerCase();
  const sugerencias = q ? lista.filter((e) => (e.nombre || "").toLowerCase().includes(q)).slice(0, 8) : [];

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
          {sugerencias.map((e2) => (
            <div
              key={e2.id}
              onMouseDown={(e) => { e.preventDefault(); onChange(e2.nombre); setOpen(false); }}
              style={{ padding: "7px 10px", cursor: "pointer", fontSize: 13, color: C.text }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.bg; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {e2.nombre}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
