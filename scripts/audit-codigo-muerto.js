#!/usr/bin/env node
/**
 * audit-codigo-muerto.js
 *
 * Busca exports con nombre (no default) que nunca se usan en ningún otro
 * lugar del mismo repo — mismo tipo de hallazgo que encontró `exportarExcel`
 * (2026-09-06, 0 call-sites reales, reemplazado hace tiempo por
 * ExportModal/PrintModal sin que nadie borrara la función vieja), pero
 * sistemático en vez de por casualidad con grep suelto.
 *
 * Offline, sin login, sin red — solo lee `src/`.
 *
 * Uso:
 *   node scripts/audit-codigo-muerto.js
 *   node scripts/audit-codigo-muerto.js --json   (salida cruda, para diffear entre corridas)
 *
 * Qué NO hace (limitaciones a propósito, no bugs):
 * - Solo mira exports CON NOMBRE (`export function X`, `export const X =`,
 *   `export { X }`) — los `export default` (todo componente de pantalla
 *   montado en App.js) no se chequean: se importan con un nombre elegido
 *   en el punto de uso, no hay un identificador único que grepear.
 * - Cuenta ocurrencias del identificador como palabra completa en TODO
 *   `src/`, sin diferenciar si es realmente una llamada a la función o una
 *   variable local con el mismo nombre en otro archivo — un nombre común
 *   (ej. una palabra genérica) puede dar un falso positivo/negativo.
 *   Revisar cada hallazgo a mano antes de borrar código.
 * - No sabe de re-exports indirectos (`export { X } from "./y"` en un
 *   tercer archivo) más allá de lo que ya cubre el propio parser al leer
 *   ese archivo como cualquier otro.
 */
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const REPO_ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.resolve(REPO_ROOT, "src");
const SOLO_JSON = process.argv.includes("--json");

function listarArchivos(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(listarArchivos(full));
    else if (/\.(js|jsx)$/.test(entry.name) && !/\.test\.js$/.test(entry.name)) out.push(full);
  }
  return out;
}

function parsear(file) {
  const code = fs.readFileSync(file, "utf8");
  try {
    return { code, ast: parser.parse(code, { sourceType: "module", plugins: ["jsx"] }) };
  } catch (e) {
    console.error(`⚠️  No se pudo parsear ${path.relative(REPO_ROOT, file)}: ${e.message}`);
    return null;
  }
}

// ─── 1. Recolectar exports con nombre, por archivo ─────────────────────
function exportsDelArchivo(ast) {
  const nombres = new Set();
  traverse(ast, {
    ExportNamedDeclaration(p) {
      const decl = p.node.declaration;
      if (decl) {
        if (decl.type === "FunctionDeclaration" && decl.id) nombres.add(decl.id.name);
        if (decl.type === "VariableDeclaration") {
          decl.declarations.forEach(d => { if (d.id.type === "Identifier") nombres.add(d.id.name); });
        }
      }
      (p.node.specifiers || []).forEach(s => {
        if (s.type === "ExportSpecifier" && s.exported.type === "Identifier") nombres.add(s.exported.name);
      });
    },
  });
  return nombres;
}

function main() {
  const archivos = listarArchivos(SRC_DIR);
  const porArchivo = {}; // file -> { code, exports: Set }
  for (const file of archivos) {
    const parsed = parsear(file);
    if (!parsed) continue;
    porArchivo[file] = { code: parsed.code, exports: exportsDelArchivo(parsed.ast) };
  }

  const codigoTotal = archivos.map(f => porArchivo[f]?.code || "").join("\n");
  const hallazgos = [];

  for (const [file, { exports }] of Object.entries(porArchivo)) {
    for (const nombre of exports) {
      // `\b` (word boundary) da falso positivo con identificadores que
      // terminan en un carácter no-\w válido en JS pero no en regex — ej.
      // `f$`: la transición "$" → "(" nunca es un \b real, así que
      // `\bf\$\b` nunca matchea `f$(...)`, aunque el código lo use por
      // todos lados. Se usa lookaround negativo contra el set real de
      // caracteres de identificador de JS (incluye "$" y "_") en vez de \b.
      const escapado = nombre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`(?<![A-Za-z0-9_$])${escapado}(?![A-Za-z0-9_$])`, "g");
      const totalOcurrencias = (codigoTotal.match(re) || []).length;
      // Se resta 1 por la propia declaración/exportación — si no queda
      // ninguna ocurrencia más en TODO el repo, es candidato real.
      if (totalOcurrencias <= 1) {
        hallazgos.push({ archivo: path.relative(REPO_ROOT, file), nombre });
      }
    }
  }

  hallazgos.sort((a, b) => a.archivo.localeCompare(b.archivo) || a.nombre.localeCompare(b.nombre));

  if (SOLO_JSON) {
    console.log(JSON.stringify(hallazgos, null, 2));
  } else {
    console.log(`Analizados ${archivos.length} archivos, ${Object.values(porArchivo).reduce((s, x) => s + x.exports.size, 0)} exports con nombre.\n`);
    if (hallazgos.length === 0) {
      console.log("✅ Sin candidatos a código muerto detectados.");
    } else {
      console.log(`⚠️  ${hallazgos.length} export(s) sin ninguna otra ocurrencia en el repo (revisar antes de borrar, ver limitaciones en la cabecera del script):\n`);
      let ultimoArchivo = null;
      for (const { archivo, nombre } of hallazgos) {
        if (archivo !== ultimoArchivo) { console.log(`\n${archivo}`); ultimoArchivo = archivo; }
        console.log(`  - ${nombre}`);
      }
    }
  }
  process.exit(0);
}

main();
