#!/usr/bin/env node
/**
 * audit-contraste.mjs
 *
 * Calcula el ratio de contraste WCAG entre cada color de texto y cada
 * fondo real de la paleta (colors.js), en los dos temas — sin login, sin
 * red, offline.
 *
 * Por qué existe: el bug del logo invisible en el login (2026-08-23,
 * accent = text en metalsales_light) y la fila invisible en Solicitudes
 * por bajo contraste (2026-09-04) se encontraron los dos por casualidad,
 * mirando una captura. Este script los hubiera detectado antes de que
 * Gino los viera.
 *
 * Uso:
 *   node scripts/audit-contraste.mjs
 *   (o node ../steel-measurement/scripts/audit-contraste.mjs para ese repo)
 *
 * Qué NO hace (limitación a propósito, no bug): no sabe qué texto se
 * pinta sobre qué fondo en cada componente real — evalúa TODAS las
 * combinaciones de "color de texto conocido" × "fondo conocido" de la
 * paleta y marca las que fallan. Un color que la paleta define pero que
 * en la práctica nunca se usa como texto (ej. `border`) puede generar un
 * falso positivo — revisar antes de "arreglar" un hallazgo puntual.
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const path = require("path");
const fs = require("fs");

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const COLORS_FILE = path.resolve(REPO_ROOT, "src/styles/colors.js");

// ─── Extrae los temas del archivo real (sin ejecutar el módulo — colors.js
// hace cosas de browser como localStorage.getItem al importarlo). Parseo
// simple del objeto THEMES a mano, no un parser AST — alcanza porque el
// archivo siempre lo escribe como literal plano hex.
function extraerTemas(code) {
  const bloque = code.match(/const THEMES = \{([\s\S]*?)\n\};/);
  if (!bloque) throw new Error("No se encontró THEMES en colors.js — ¿cambió el formato?");
  const temas = {};
  const temaRe = /(\w+):\s*\{([^}]*)\}/g;
  let m;
  while ((m = temaRe.exec(bloque[1]))) {
    const nombre = m[1];
    const props = {};
    const propRe = /(\w+):\s*"(#[0-9a-fA-F]{3,8})"/g;
    let pm;
    while ((pm = propRe.exec(m[2]))) props[pm[1]] = pm[2];
    if (Object.keys(props).length) temas[nombre] = props;
  }
  return temas;
}

// ─── WCAG contrast ratio ────────────────────────────────────────────────
function hexA(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  if (h.length === 8) h = h.slice(0, 6); // ignora alpha (#rrggbbaa) para el cálculo
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function luminancia([r, g, b]) {
  const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const [rl, gl, bl] = [f(r), f(g), f(b)];
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}
function ratio(hex1, hex2) {
  const l1 = luminancia(hexA(hex1)) + 0.05;
  const l2 = luminancia(hexA(hex2)) + 0.05;
  return l1 > l2 ? l1 / l2 : l2 / l1;
}

// Fondos reales de la app (superficies donde se pinta texto encima) y
// colores que la app usa como texto (incluye los "semánticos" — ok/err/
// warn/etc. — porque se usan como texto de estado, no solo como fondo de
// badge). `border`/`radiusSm`/`radiusLg`/`fontSans`/`fontMono` se excluyen
// a propósito — no son colores de texto reales.
const FONDOS = ["bg", "card", "iron"];
const TEXTOS = ["text", "muted", "mutedL", "accent", "ok", "err", "warn", "info", "pur", "gold", "teal", "pink"];
const MIN_NORMAL = 4.5; // WCAG AA, texto normal
const MIN_GRANDE = 3.0; // WCAG AA, texto grande/negrita (>=18px o >=14px bold) — la mayoría de badges/labels de este sistema entran acá

function main() {
  const code = fs.readFileSync(COLORS_FILE, "utf8");
  const temas = extraerTemas(code);
  let huboFallosCriticos = false;

  for (const [nombreTema, paleta] of Object.entries(temas)) {
    console.log(`\n=== ${nombreTema} ===`);
    for (const fondo of FONDOS) {
      if (!paleta[fondo]) continue;
      for (const texto of TEXTOS) {
        if (!paleta[texto] || texto === fondo) continue;
        const r = ratio(paleta[texto], paleta[fondo]);
        const rr = r.toFixed(2);
        if (r < MIN_GRANDE) {
          console.log(`  ❌ ${texto} sobre ${fondo}: ${rr}:1 — falla incluso para texto grande (mínimo ${MIN_GRANDE}:1)`);
          huboFallosCriticos = true;
        } else if (r < MIN_NORMAL) {
          console.log(`  ⚠️  ${texto} sobre ${fondo}: ${rr}:1 — ok solo para texto grande/negrita, no para texto normal (mínimo ${MIN_NORMAL}:1)`);
        }
      }
    }
  }

  console.log("\n" + (huboFallosCriticos
    ? "⚠️  Hay combinaciones que fallan incluso el umbral más permisivo — revisar si ese color+fondo se usa realmente como texto en algún componente."
    : "✅ Sin fallos críticos (⚠️ arriba son solo aptos para texto grande, no bloqueante)."));
  process.exit(huboFallosCriticos ? 1 : 0);
}

main();
