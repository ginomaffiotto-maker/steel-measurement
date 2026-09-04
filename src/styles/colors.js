// Registro de temas — permite volver al tema actual o sumar uno nuevo por
// cliente sin tocar el resto de la app: todo lo demás (BTN/INP/CARD/etc.)
// consume el objeto C sin saber de dónde salió.
const THEMES = {
  // El tema original de Steel Costos — paleta idéntica a steelCRM.
  industrial_dark: {
    bg: "#0d0f12", card: "#13161c", iron: "#1e2330", border: "#252a36",
    steel: "#8fa3b8", steelDk: "#4a5568", accent: "#e85d04", text: "#d4dde8",
    muted: "#6b7a90", mutedL: "#8fa3b8", ok: "#2ea043", err: "#d73a49",
    warn: "#d97706", info: "#1f6feb", pur: "#8b5cf6", gold: "#c9a84c",
    teal: "#0d9488", pink: "#ec4899",
    radiusSm: 6, radiusLg: 10,
    // Sistema "Acero" (2026-08-24, mismo cambio en steelCRM): IBM Plex en
    // vez de Inter (uno de los defaults más asociados a UI "genérica de
    // IA"), la fuente ya está cargada en index.html. warn separado del
    // accent (antes #f0a500, muy cerca del naranja de marca).
    fontSans: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontMono: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  // Basado en la referencia visual de Gino (Lovable, paleta zinc + IBM Plex).
  // Colores convertidos de OKLCH a hex 1:1 desde la escala zinc de Tailwind.
  // info/pur/gold/teal/pink: la referencia solo define ok/warn/danger — el
  // resto son criterio propio para no perder las distinciones de color que
  // ya usa la app (ej. azul = perfiles lineales). accent (2026-08-24,
  // sistema "Acero", mismo cambio en steelCRM): la referencia era monocromo
  // puro (accent = text, negro) — se reemplazó por el naranja de marca para
  // que el tema claro tenga el mismo color de marca que el oscuro.
  metalsales_light: {
    bg: "#f4f4f5", card: "#fafafa", iron: "#ffffff", border: "#e4e4e7",
    steel: "#71717a", steelDk: "#52525b", accent: "#c2410c", text: "#18181b",
    muted: "#71717a", mutedL: "#a1a1aa", ok: "#059669", err: "#dc2626",
    warn: "#d97706", info: "#2563eb", pur: "#8b5cf6", gold: "#b45309",
    teal: "#0d9488", pink: "#ec4899",
    radiusSm: 8, radiusLg: 10,
    fontSans: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
    fontMono: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  },
};

const TEMA_DEFAULT = "industrial_dark";
function temaActivo() {
  try {
    const t = localStorage.getItem("smeas_tema");
    return THEMES[t] ? t : TEMA_DEFAULT;
  } catch { return TEMA_DEFAULT; }
}
export const TEMA_ACTUAL = temaActivo();
export const TEMAS_DISPONIBLES = [
  { key: "industrial_dark", label: "Industrial (oscuro)" },
  { key: "metalsales_light", label: "MetalSales (claro)" },
];
export function cambiarTema(key) {
  if (!THEMES[key]) return;
  localStorage.setItem("smeas_tema", key);
  window.location.reload();
}

export const C = THEMES[TEMA_ACTUAL];

// Aplica el tema como variables CSS globales — cubre lo que vive fuera de
// React (fondo de <body>, scrollbar) además de lo que ya usa C.* inline.
if (typeof document !== "undefined") {
  const root = document.documentElement.style;
  root.setProperty("--bg", C.bg);
  root.setProperty("--text", C.text);
  root.setProperty("--border", C.border);
  root.setProperty("--accent", C.accent);
  root.setProperty("--font-sans", C.fontSans);
}

export const INP = {
  background: C.iron, border: `1px solid ${C.border}`, borderRadius: C.radiusSm,
  padding: "9px 12px", color: C.text, fontSize: 14, width: "100%",
  boxSizing: "border-box", outline: "none",
};
export const LBL = {
  fontSize: 12, color: C.muted, marginBottom: 4, display: "block",
  textTransform: "uppercase", letterSpacing: .5,
};
export const TH = {
  textAlign: "left", padding: "10px 12px", color: C.muted, fontSize: 12,
  fontWeight: 700, borderBottom: `1px solid ${C.border}`, background: C.card,
  position: "sticky", top: 0, zIndex: 1, textTransform: "uppercase", letterSpacing: .5,
  whiteSpace: "nowrap",
};
export const TD = {
  padding: "9px 12px", borderBottom: `1px solid ${C.border}18`,
  fontSize: 14, verticalAlign: "middle",
};
export const BDG = (c, sm) => ({
  background: c + "22", color: c, border: `1px solid ${c}44`, borderRadius: 4,
  padding: sm ? "2px 9px" : "4px 11px", fontSize: sm ? 12 : 13, fontWeight: 700,
  display: "inline-block", whiteSpace: "nowrap",
});
export const CARD = (a) => ({
  background: C.card, border: `1px solid ${a || C.border}`, borderRadius: C.radiusLg,
  padding: 18, marginBottom: 14,
});
export const BTN = (variant = "ghost") => {
  const map = {
    primary:  { background: C.accent, color: "#fff", border: "none" },
    ghost:    { background: "transparent", color: C.muted, border: `1px solid ${C.border}` },
    ok:       { background: C.ok + "22", color: C.ok, border: `1px solid ${C.ok}44` },
    danger:   { background: "transparent", color: C.err, border: `1px solid ${C.err}44` },
  };
  return { ...map[variant], borderRadius: C.radiusSm, padding: "8px 15px", fontSize: 13, fontWeight: 600, cursor: "pointer" };
};
