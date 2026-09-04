/**
 * SEED DE DATOS DE PRUEBA — Steel Costos
 * ─────────────────────────────────────────────
 * Pegar en la consola del navegador (F12 → Console) con la app abierta,
 * o importar como módulo en desarrollo.
 *
 * Crea:
 *   • 1 cómputo completo (3 ítems, perfiles + planchas)
 *   • 1 anidado completo (4 grupos perfil 1D + 1 grupo plancha 2D), con resultados pre-calculados
 *
 * Los materiales se buscan primero en la Biblioteca guardada.
 * Si no existen todavía (Biblioteca nunca abierta), usa valores default.
 */

export function seedTestData() {
  let _seq = 0;
  const uid = () => "seed_" + (++_seq).toString(36) + "_" + Math.random().toString(36).slice(2, 5);

  // ─── Cargar biblioteca ─────────────────────────────────────────
  const perfiles    = JSON.parse(localStorage.getItem("smeas_perfiles")    || "[]");
  const planchuelas = JSON.parse(localStorage.getItem("smeas_planchuelas") || "[]");
  const planchas    = JSON.parse(localStorage.getItem("smeas_planchas")    || "[]");

  const byName = (arr, nombre) => arr.find(m => m.nombre === nombre) || null;

  // ─── Materiales que necesitamos (con fallbacks si la biblioteca no está cargada) ─
  const M = {
    heb160: byName(perfiles, "HEB 160")               || { id:"fb_heb160",  nombre:"HEB 160",                cat:"HEB",          kg_m:42.6, sup:0.827, largo:12 },
    heb200: byName(perfiles, "HEB 200")               || { id:"fb_heb200",  nombre:"HEB 200",                cat:"HEB",          kg_m:61.3, sup:1.010, largo:12 },
    ipe200: byName(perfiles, "IPE 200")               || { id:"fb_ipe200",  nombre:"IPE 200",                cat:"IPE",          kg_m:22.4, sup:0.678, largo:12 },
    upn120: byName(perfiles, "UPN 120")               || { id:"fb_upn120",  nombre:"UPN 120",                cat:"UPN",          kg_m:17.4, sup:0.461, largo:6  },
    upn100: byName(perfiles, "UPN 100")               || { id:"fb_upn100",  nombre:"UPN 100",                cat:"UPN",          kg_m:13.5, sup:0.383, largo:6  },
    ang75:  byName(perfiles, "Ángulo 75×6")           || byName(planchuelas,"Ángulo 75×6")
                                                       || { id:"fb_ang75",   nombre:"Ángulo 75×6",            cat:"Ángulo",       kg_m:7.09, sup:0,     largo:6  },
    tub80:  byName(perfiles, "Tubo cuadrado 80×3")    || { id:"fb_tub80",   nombre:"Tubo cuadrado 80×3",     cat:"Tubo cuadrado",kg_m:9.1,  sup:0.30,  largo:6  },
    pl150x8:byName(planchuelas,"PL 150×8")            || { id:"fb_pl150",   nombre:"PL 150×8",               cat:"Planchuela",   kg_m:9.42, sup:0,     largo:6  },
    pl10:   byName(planchas,"Plancha e=10mm")
            || planchas.find(p => p.espesor === 10)
            || { id:"fb_pl10", nombre:"Plancha e=10mm", espesor:10, kg_m2:78.5, largo_mm:6000, ancho_mm:1500, kg_ud:706.5 },
  };

  // ─── Constructores de piezas ───────────────────────────────────
  const perf = (mat, largo_mm, cantidad) => ({
    id: uid(), tipo: "perfil",
    material_id: mat.id, material_nombre: mat.nombre,
    kg_m: mat.kg_m, sup_m2m: mat.sup || 0,
    largo_mm_input: largo_mm, cantidad,
  });

  const chapa = (mat, largo_mm, ancho_mm, cantidad) => ({
    id: uid(), tipo: "plancha",
    material_id: mat.id, material_nombre: mat.nombre,
    kg_m2: mat.kg_m2 || 78.5,
    largo_mm, ancho_mm, cantidad,
  });

  // ═══════════════════════════════════════════════════════════════
  // CÓMPUTO DE PRUEBA
  // ═══════════════════════════════════════════════════════════════
  const computo = {
    id: "seed_comp_001",
    nombre: "CCFC — Nave Industrial Sector A",
    fecha: "2026-06-19",
    cantidad: 1,
    items: [
      {
        id: uid(),
        titulo: "Pilares principales P1–P8",
        n_plano: "352-S-001",
        cantidad: 1,
        piezas: [
          perf(M.heb160,   4500,  8),   // fuste alto
          perf(M.heb160,   2750,  8),   // fuste bajo
          chapa(M.pl10,     400,  300, 16),  // cartelas
          perf(M.pl150x8,   600,  16),  // rigidizadores
        ],
      },
      {
        id: uid(),
        titulo: "Vigas carrera VPP",
        n_plano: "352-S-002",
        cantidad: 1,
        piezas: [
          perf(M.ipe200,  5800,  4),
          perf(M.ipe200,  2400,  8),
          perf(M.upn120,  2400,  4),
          chapa(M.pl10,    250,  200, 24),  // chapas de refuerzo
        ],
      },
      {
        id: uid(),
        titulo: "Arriostramiento horizontal",
        n_plano: "352-S-003",
        cantidad: 1,
        piezas: [
          perf(M.tub80,   3600, 12),
          perf(M.ang75,   1500, 20),
          perf(M.upn100,  2100,  8),
        ],
      },
    ],
  };

  // ═══════════════════════════════════════════════════════════════
  // ALGORITMO 1D — FFD (para calcular resultados del anidado)
  // ═══════════════════════════════════════════════════════════════
  function runFFD(piezas, largo_barra, kerf, kg_m) {
    const PALETTE = ["#e85d04","#3b82f6","#10b981","#f59e0b","#8b5cf6","#ec4899","#06b6d4","#84cc16","#f97316","#6366f1"];
    const all = [];
    piezas.forEach((p, pi) => {
      const cant = parseInt(p.cantidad) || 1;
      const largo = parseFloat(p.largo_mm) || 0;
      if (largo <= 0 || largo > largo_barra) return;
      for (let i = 0; i < cant; i++)
        all.push({ largo_mm: largo, etiqueta: p.etiqueta || `${largo}`, colorIdx: pi % PALETTE.length });
    });
    all.sort((a, b) => b.largo_mm - a.largo_mm);

    const barras = [];
    all.forEach(pieza => {
      let placed = false;
      for (const b of barras) {
        const need = pieza.largo_mm + (b.piezas.length > 0 ? kerf : 0);
        if (b.libre_mm >= need) {
          b.piezas.push({ ...pieza, pos_mm: largo_barra - b.libre_mm + (b.piezas.length > 0 ? kerf : 0) });
          b.libre_mm -= need;
          placed = true;
          break;
        }
      }
      if (!placed)
        barras.push({ nro: barras.length + 1, piezas: [{ ...pieza, pos_mm: 0 }], libre_mm: largo_barra - pieza.largo_mm });
    });

    const n = barras.length;
    const mm_util  = all.reduce((s, p) => s + p.largo_mm, 0);
    const mm_kerf  = barras.reduce((s, b) => s + Math.max(0, b.piezas.length - 1) * kerf, 0);
    const mm_total = n * largo_barra;
    const mm_desp  = mm_total - mm_util - mm_kerf;
    const kgm = parseFloat(kg_m) || 0;
    return {
      barras,
      resumen: {
        b_util:  +(mm_util  / largo_barra).toFixed(2),
        b_desp:  +(mm_desp  / largo_barra).toFixed(2),
        b_total: n,
        m_util:  +(mm_util  / 1000).toFixed(2),
        m_desp:  +(mm_desp  / 1000).toFixed(2),
        m_total: +(mm_total / 1000).toFixed(2),
        kg_util: +(mm_util  / 1000 * kgm).toFixed(1),
        kg_desp: +(mm_desp  / 1000 * kgm).toFixed(1),
        kg_total:+(mm_total / 1000 * kgm).toFixed(1),
        pct_desp: mm_total > 0 ? +(mm_desp / mm_total * 100).toFixed(1) : 0,
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // ALGORITMO 2D — Shelf FFD
  // ═══════════════════════════════════════════════════════════════
  function run2DFFD(piezas, sw, sh) {
    const all = [];
    piezas.forEach((p, pi) => {
      const w = parseFloat(p.largo_mm) || 0;
      const h = parseFloat(p.ancho_mm) || 0;
      const c = parseInt(p.cantidad)   || 1;
      if (!w || !h) return;
      for (let i = 0; i < c; i++)
        all.push({ w, h, etiqueta: p.etiqueta || `${w}×${h}`, colorIdx: pi });
    });
    all.sort((a, b) => b.w * b.h - a.w * a.h);

    const hojas = [];
    function tryPlace(hoja, pieza) {
      const orients = [[pieza.w, pieza.h]];
      if (pieza.w !== pieza.h) orients.push([pieza.h, pieza.w]);
      for (const [pw, ph] of orients) {
        if (pw > sw || ph > sh) continue;
        for (const shelf of hoja.shelves) {
          if (shelf.x_used + pw <= sw && ph <= shelf.h) {
            shelf.piezas.push({ x: shelf.x_used, y: shelf.y, w: pw, h: ph, etiqueta: pieza.etiqueta, colorIdx: pieza.colorIdx });
            shelf.x_used += pw;
            return true;
          }
        }
        if (hoja.y_used + ph <= sh && pw <= sw) {
          hoja.shelves.push({ y: hoja.y_used, h: ph, x_used: pw, piezas: [{ x: 0, y: hoja.y_used, w: pw, h: ph, etiqueta: pieza.etiqueta, colorIdx: pieza.colorIdx }] });
          hoja.y_used += ph;
          return true;
        }
      }
      return false;
    }
    for (const p of all) {
      let ok = false;
      for (const h of hojas) { if (tryPlace(h, p)) { ok = true; break; } }
      if (!ok) { const h = { nro: hojas.length + 1, shelves: [], y_used: 0 }; hojas.push(h); tryPlace(h, p); }
    }
    const total_area = all.reduce((s, p) => s + p.w * p.h, 0);
    const sheet_area = sw * sh;
    const n = hojas.length;
    const pct_util = n > 0 ? Math.round(total_area / (n * sheet_area) * 1000) / 10 : 0;
    return {
      hojas,
      resumen: {
        n_hojas:       n,
        area_util_m2:  Math.round(total_area / 1e6 * 100) / 100,
        area_total_m2: Math.round(n * sheet_area / 1e6 * 100) / 100,
        area_desp_m2:  Math.round((n * sheet_area - total_area) / 1e6 * 100) / 100,
        pct_util,
        pct_desp: Math.round((100 - pct_util) * 10) / 10,
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // ANIDADO DE PRUEBA
  // ═══════════════════════════════════════════════════════════════

  // Piezas para cada grupo
  const pzHEB = [
    { id: uid(), largo_mm: "4500", cantidad: "8", etiqueta: "H-4.5" },
    { id: uid(), largo_mm: "2750", cantidad: "8", etiqueta: "H-2.75" },
  ];
  const pzIPE = [
    { id: uid(), largo_mm: "5800", cantidad: "4", etiqueta: "V-5.8" },
    { id: uid(), largo_mm: "2400", cantidad: "8", etiqueta: "V-2.4" },
  ];
  const pzUPN120 = [
    { id: uid(), largo_mm: "2400", cantidad: "4", etiqueta: "U120" },
  ];
  const pzUPN100 = [
    { id: uid(), largo_mm: "2100", cantidad: "8", etiqueta: "U100" },
  ];
  const pzPl10 = [
    { id: uid(), largo_mm: "400", ancho_mm: "300", cantidad: "16", etiqueta: "Cart" },
    { id: uid(), largo_mm: "250", ancho_mm: "200", cantidad: "24", etiqueta: "Rig"  },
  ];

  const BARRA_HEB  = (M.heb160.largo || 12) * 1000;
  const BARRA_IPE  = (M.ipe200.largo || 12) * 1000;
  const BARRA_UPN  = (M.upn120.largo || 6)  * 1000;
  const BARRA_U100 = (M.upn100.largo || 6)  * 1000;
  const SW_PL      = M.pl10.largo_mm || 6000;
  const SH_PL      = M.pl10.ancho_mm || 1500;

  const anidado = {
    id: "seed_anid_001",
    nombre: "Corte CCFC — Nave Industrial",
    fecha: "2026-06-19",
    grupos: [
      {
        id: uid(), tipo: "perfil",
        material_id: M.heb160.id, material_nombre: M.heb160.nombre,
        kg_m: M.heb160.kg_m, largo_barra_mm: BARRA_HEB, kerf_mm: 3,
        piezas: pzHEB,
        resultado: runFFD(pzHEB, BARRA_HEB, 3, M.heb160.kg_m),
      },
      {
        id: uid(), tipo: "perfil",
        material_id: M.ipe200.id, material_nombre: M.ipe200.nombre,
        kg_m: M.ipe200.kg_m, largo_barra_mm: BARRA_IPE, kerf_mm: 3,
        piezas: pzIPE,
        resultado: runFFD(pzIPE, BARRA_IPE, 3, M.ipe200.kg_m),
      },
      {
        id: uid(), tipo: "perfil",
        material_id: M.upn120.id, material_nombre: M.upn120.nombre,
        kg_m: M.upn120.kg_m, largo_barra_mm: BARRA_UPN, kerf_mm: 2,
        piezas: pzUPN120,
        resultado: runFFD(pzUPN120, BARRA_UPN, 2, M.upn120.kg_m),
      },
      {
        id: uid(), tipo: "perfil",
        material_id: M.upn100.id, material_nombre: M.upn100.nombre,
        kg_m: M.upn100.kg_m, largo_barra_mm: BARRA_U100, kerf_mm: 2,
        piezas: pzUPN100,
        resultado: runFFD(pzUPN100, BARRA_U100, 2, M.upn100.kg_m),
      },
      {
        id: uid(), tipo: "plancha",
        material_id: M.pl10.id, material_nombre: M.pl10.nombre,
        kg_m2: M.pl10.kg_m2 || 78.5, sheet_w: SW_PL, sheet_h: SH_PL,
        piezas: pzPl10,
        resultado: run2DFFD(pzPl10, SW_PL, SH_PL),
      },
    ],
  };

  // ─── Guardar en localStorage ───────────────────────────────────
  const prevComputos = JSON.parse(localStorage.getItem("smeas_computos") || "[]");
  localStorage.setItem("smeas_computos", JSON.stringify([
    computo,
    ...prevComputos.filter(c => c.id !== "seed_comp_001"),
  ]));

  const prevAnidados = JSON.parse(localStorage.getItem("smeas_anidados") || "[]");
  localStorage.setItem("smeas_anidados", JSON.stringify([
    anidado,
    ...prevAnidados.filter(a => a.id !== "seed_anid_001"),
  ]));

  // ─── Resumen en consola ────────────────────────────────────────
  const totalPiezas = computo.items.reduce((s, i) => s + i.piezas.length, 0);
  const r1 = anidado.grupos[0].resultado.resumen;
  const r2 = anidado.grupos[1].resultado.resumen;
  const r5 = anidado.grupos[4].resultado.resumen;

  console.groupCollapsed("✅ Steel Costos — Datos de prueba cargados");
  console.log(`📐 Cómputo: "${computo.nombre}"`);
  console.log(`   ${computo.items.length} ítems / ${totalPiezas} piezas (perfiles + planchas)`);
  console.log(`✂️ Anidado: "${anidado.nombre}"`);
  console.log(`   HEB 160 → ${r1.b_total} barras ${BARRA_HEB}mm · ${r1.pct_desp}% desperdicio · ${r1.kg_total} kg total`);
  console.log(`   IPE 200 → ${r2.b_total} barras ${BARRA_IPE}mm · ${r2.pct_desp}% desperdicio · ${r2.kg_total} kg total`);
  console.log(`   Plancha 10mm → ${r5.n_hojas} hoja(s) ${SW_PL}×${SH_PL}mm · ${r5.pct_util}% aprovechamiento`);
  console.log("➜ Recargá con F5 para ver los datos");
  console.groupEnd();

  return { computo, anidado };
}

// Auto-run si se pega directo en consola (no como módulo)
if (typeof window !== "undefined" && typeof module === "undefined") {
  // eslint-disable-next-line no-undef
  seedTestData();
}
