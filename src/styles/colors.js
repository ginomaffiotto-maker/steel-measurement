// Paleta idéntica a Steel CRM
export const C = {
  bg: "#0d0f12", card: "#13161c", iron: "#1e2330", border: "#252a36",
  steel: "#8fa3b8", steelDk: "#4a5568", accent: "#e85d04", text: "#d4dde8",
  muted: "#6b7a90", mutedL: "#8fa3b8", ok: "#2ea043", err: "#d73a49",
  warn: "#f0a500", info: "#1f6feb", pur: "#8b5cf6", gold: "#c9a84c",
  teal: "#0d9488", pink: "#ec4899"
};

export const INP = {
  background: C.iron, border: `1px solid ${C.border}`, borderRadius: 6,
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
  background: C.card, border: `1px solid ${a || C.border}`, borderRadius: 10,
  padding: 18, marginBottom: 14,
});
export const BTN = (variant = "ghost") => {
  const map = {
    primary:  { background: C.accent, color: "#fff", border: "none" },
    ghost:    { background: "transparent", color: C.muted, border: `1px solid ${C.border}` },
    ok:       { background: C.ok + "22", color: C.ok, border: `1px solid ${C.ok}44` },
    danger:   { background: "transparent", color: C.err, border: `1px solid ${C.err}44` },
  };
  return { ...map[variant], borderRadius: 6, padding: "8px 15px", fontSize: 13, fontWeight: 600, cursor: "pointer" };
};
