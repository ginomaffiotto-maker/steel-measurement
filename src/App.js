import { useState, useEffect, useRef } from "react";
import { C } from "./styles/colors";
import { saveLS, loadLS, iUsuarios, exportBackup, parseBackup, restoreBackup, loadClientes } from "./utils/storage";
import { ModalConfirmarEliminar, puedeEliminar } from "./components/ConfirmarEliminar";
import BibliotecaMateriales from "./components/BibliotecaMateriales";
import Computo from "./components/Computo";
import Anidado from "./components/Anidado";
import Presupuesto from "./components/Presupuesto";
import Historial from "./components/Historial";
import Config from "./components/Config";
import Buscador from "./components/Buscador";
import { seedTestData } from "./utils/seedTestData";

// ─── MÓDULOS / NAVEGACIÓN ────────────────────────────────────────
const GRUPOS = [
  {
    id: "buscador", icon: "🔍", label: "Buscar",
    tabs: [{ icon: "🔍", label: "Buscar", tab: "Buscador" }],
  },
  {
    id: "computo", icon: "📐", label: "Cómputo",
    tabs: [
      { icon: "📐", label: "Cómputo",  tab: "Computo" },
      { icon: "✂️", label: "Anidado",  tab: "Anidado" },
    ],
  },
  {
    id: "presupuesto", icon: "💰", label: "Presupuesto",
    tabs: [{ icon: "💰", label: "Presupuesto", tab: "Presupuesto" }],
  },
  {
    id: "historial", icon: "📊", label: "Historial",
    tabs: [{ icon: "📊", label: "Trabajos", tab: "Historial" }],
  },
  {
    id: "sistema", icon: "⚙️", label: "Sistema",
    tabs: [
      { icon: "⚙️", label: "Config",     tab: "Config" },
      { icon: "📦", label: "Insumos y Precios", tab: "Biblioteca" },
    ],
  },
];

const ROL_COLOR = { admin: "#e8a020", operario: "#4caf82", supervisor: "#4a9eda" };
const ROL_LABEL = { admin: "Administrador", operario: "Vendedor", supervisor: "Gerencia" };

// ─── PANTALLA LOGIN ──────────────────────────────────────────────
function Login({ usuarios, setUsuarios, onLogin }) {
  const [sel, setSel]       = useState(null);
  const [pass, setPass]     = useState("");
  const [err, setErr]       = useState("");
  const [show, setShow]     = useState(false);

  const entrar = (e) => {
    e.preventDefault();
    if (!sel.clave) { onLogin(sel); return; }
    if (pass === sel.clave) { onLogin(sel); }
    else { setErr("Contraseña incorrecta"); setPass(""); }
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ width: 56, height: 56, background: C.accent, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 14px" }}>📐</div>
        <div style={{ color: C.accent, fontWeight: 900, fontSize: 24, letterSpacing: -0.5 }}>Steel Measurement</div>
        <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>Metraje · Cómputo · Presupuesto Industrial</div>
      </div>

      {/* Selección usuario */}
      {!sel && (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {usuarios.map(u => (
            <button key={u.id} onClick={() => { setSel(u); setPass(""); setErr(""); }}
              style={{ background: C.card, border: `2px solid ${C.border}`, borderRadius: 14, padding: "22px 28px", cursor: "pointer", textAlign: "center", minWidth: 130, transition: "all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "scale(1)"; }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: (ROL_COLOR[u.rol] || C.accent) + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 10px", border: `2px solid ${(ROL_COLOR[u.rol] || C.accent)}44`, overflow: "hidden" }}>
                {u.foto ? <img src={u.foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (u.emoji || "👤")}
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{u.nombre}</div>
              <div style={{ fontSize: 10, color: ROL_COLOR[u.rol] || C.muted, fontWeight: 600, marginTop: 3, textTransform: "uppercase", letterSpacing: .5 }}>
                {ROL_LABEL[u.rol] || u.rol}
              </div>
            </button>
          ))}
          {usuarios.length === 0 && (
            <span style={{ color: C.accent, cursor: "pointer", fontSize: 13 }}
              onClick={() => setUsuarios([{ id: 1, nombre: "Admin", rol: "admin", emoji: "⚙️", clave: "admin" }])}>
              Crear usuario por defecto
            </span>
          )}
        </div>
      )}

      {/* Formulario contraseña */}
      {sel && (
        <form onSubmit={entrar} style={{ width: "100%", maxWidth: 320 }}>
          <div style={{ background: C.card, border: `2px solid ${C.accent}44`, borderRadius: 14, padding: "28px 24px 22px" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.accent + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto", border: `3px solid ${C.accent}55`, overflow: "hidden" }}>
                {sel.foto ? <img src={sel.foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (sel.emoji || "👤")}
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginTop: 10 }}>{sel.nombre}</div>
              <div style={{ fontSize: 10, color: ROL_COLOR[sel.rol] || C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5, marginTop: 3 }}>
                {ROL_LABEL[sel.rol] || sel.rol}
              </div>
            </div>

            {sel.clave ? (
              <div style={{ marginBottom: 14, position: "relative" }}>
                <label style={{ fontSize: 11, color: C.muted, marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: .5 }}>Contraseña</label>
                <input type={show ? "text" : "password"} value={pass} autoFocus
                  onChange={e => { setPass(e.target.value); setErr(""); }}
                  placeholder="Ingresá tu contraseña"
                  style={{ width: "100%", padding: "10px 36px 10px 12px", borderRadius: 8, fontSize: 14, border: `1.5px solid ${err ? C.err : C.border}`, background: C.bg, color: C.text, outline: "none", boxSizing: "border-box" }}
                />
                <span onClick={() => setShow(v => !v)} style={{ position: "absolute", right: 10, top: 34, cursor: "pointer", fontSize: 14, color: C.muted }}>
                  {show ? "🙈" : "👁️"}
                </span>
                {err && <div style={{ color: C.err, fontSize: 12, marginTop: 5, fontWeight: 600 }}>⚠ {err}</div>}
              </div>
            ) : (
              <div style={{ color: C.muted, fontSize: 12, textAlign: "center", marginBottom: 14 }}>Sin contraseña configurada.</div>
            )}

            <button type="submit" style={{ width: "100%", padding: 10, borderRadius: 8, background: C.accent, color: "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 8 }}>
              Ingresar →
            </button>
            <button type="button" onClick={() => setSel(null)} style={{ width: "100%", padding: 8, borderRadius: 8, background: "transparent", color: C.muted, border: `1px solid ${C.border}`, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
              ← Cambiar usuario
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────
const SESION_USUARIO_KEY = "smeas_sesion_usuario_id";

export default function App() {
  const [usuarios, setUsuarios] = useState(iUsuarios);
  const [usuario,  setUsuario]  = useState(() => {
    const savedId = sessionStorage.getItem(SESION_USUARIO_KEY);
    if (savedId == null) return null;
    return iUsuarios.find(u => String(u.id) === savedId) || null;
  });
  const [grupo,    setGrupo]    = useState("computo");
  const [tab,      setTab]      = useState("Computo");
  const [collapsed, setCollapsed] = useState(false);
  const [pendingBackup, setPendingBackup] = useState(null);
  const [importErr, setImportErr] = useState("");
  const [seedErr, setSeedErr] = useState("");
  const [tcGlobal, setTcGlobal] = useState(() => loadLS("smeas_tc_global", 40));
  const fileInputRef = useRef(null);

  useEffect(() => { saveLS("smeas_usuarios", usuarios); }, [usuarios]);
  useEffect(() => { saveLS("smeas_tc_global", tcGlobal); }, [tcGlobal]);
  useEffect(() => {
    if (usuario) sessionStorage.setItem(SESION_USUARIO_KEY, String(usuario.id));
    else sessionStorage.removeItem(SESION_USUARIO_KEY);
  }, [usuario]);

  const elegirArchivoBackup = () => { setImportErr(""); fileInputRef.current?.click(); };
  const onArchivoBackup = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        setPendingBackup(parseBackup(reader.result));
      } catch (err) {
        setImportErr(err.message || "No se pudo leer el archivo.");
      }
    };
    reader.readAsText(file);
  };
  const confirmarRestaurar = () => {
    restoreBackup(pendingBackup);
    setPendingBackup(null);
    window.location.reload();
  };

  const navGrupo = (id) => {
    const g = GRUPOS.find(x => x.id === id);
    if (!g) return;
    setGrupo(id);
    setTab(g.tabs[0].tab);
  };

  // Navega a un tab específico desde afuera (ej. resultado del Buscador global),
  // actualizando también el grupo del sidebar para que quede resaltado bien.
  const irATab = (tabDestino) => {
    const g = GRUPOS.find(x => x.tabs.some(t => t.tab === tabDestino));
    if (g) setGrupo(g.id);
    setTab(tabDestino);
  };

  const grupoObj = GRUPOS.find(g => g.id === grupo);
  const SW = collapsed ? 56 : 180;

  if (!usuario) return <Login usuarios={usuarios} setUsuarios={setUsuarios} onLogin={setUsuario} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, color: C.text }}>

      {/* Lista global de clientes para autocompletado (Cómputo/Anidado/Presupuesto) */}
      <datalist id="clientes-datalist">
        {loadClientes().map(c => <option key={c} value={c} />)}
      </datalist>

      {/* ── SIDEBAR ── */}
      <div style={{ width: SW, minHeight: "100vh", background: C.card, borderRight: `2px solid ${C.accent}33`, display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100, overflowX: "hidden", transition: "width .2s", flexShrink: 0 }}>

        {/* Logo */}
        <div style={{ padding: "14px 10px 10px", borderBottom: `1px solid ${C.border}33`, display: "flex", alignItems: "center", gap: 8, minHeight: 52 }}>
          <div style={{ width: 28, height: 28, background: C.accent, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>📐</div>
          {!collapsed && (
            <div>
              <div style={{ color: C.accent, fontWeight: 900, fontSize: 12, letterSpacing: -0.3, lineHeight: 1 }}>Steel Measurement</div>
              <div style={{ color: C.muted, fontSize: 9, letterSpacing: 1, textTransform: "uppercase" }}>Metraje · Metalúrgica</div>
            </div>
          )}
        </div>

        {/* Menú */}
        <div style={{ flex: 1, padding: "8px 0", overflowY: "auto" }}>
          {GRUPOS.map(g => {
            const active = grupo === g.id;
            return (
              <div key={g.id}>
                <button onClick={() => navGrupo(g.id)} title={g.label} style={{
                  width: "100%", display: "flex", alignItems: "center",
                  gap: 10, padding: collapsed ? "10px 0" : "10px 14px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  background: active ? C.accent + "18" : "transparent",
                  border: "none", borderLeft: active ? `3px solid ${C.accent}` : "3px solid transparent",
                  cursor: "pointer", color: active ? C.accent : C.muted, transition: "all .15s",
                }}>
                  <span style={{ fontSize: 17, flexShrink: 0 }}>{g.icon}</span>
                  {!collapsed && <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, whiteSpace: "nowrap" }}>{g.label}</span>}
                </button>

                {active && (
                  <div style={{ paddingLeft: collapsed ? 0 : 14, paddingBottom: 4 }}>
                    {g.tabs.map(t => {
                      const isTab = tab === t.tab;
                      return (
                        <button key={t.tab} onClick={() => setTab(t.tab)} title={t.label} style={{
                          width: "100%", display: "flex", alignItems: "center",
                          gap: 8, padding: collapsed ? "7px 0" : "7px 10px",
                          justifyContent: collapsed ? "center" : "flex-start",
                          background: isTab ? C.accent + "22" : "transparent",
                          border: "none", borderRadius: 6, cursor: "pointer",
                          color: isTab ? C.accent : C.mutedL,
                        }}>
                          <span style={{ fontSize: collapsed ? 14 : 12 }}>{t.icon}</span>
                          {!collapsed && <span style={{ fontSize: 12, fontWeight: isTab ? 700 : 400, whiteSpace: "nowrap" }}>{t.label}</span>}
                          {!collapsed && t.pronto && (
                            <span style={{ marginLeft: "auto", fontSize: 9, color: C.muted, background: C.iron, padding: "1px 5px", borderRadius: 3, border: `1px solid ${C.border}` }}>pronto</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${C.border}33`, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 8 }}>
          {!collapsed && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button onClick={exportBackup} title="Descarga un .json con todos los datos de la app"
                style={{ width:"100%", background:C.ok+"18", border:`1px solid ${C.ok}44`, borderRadius:6, padding:"5px 8px", cursor:"pointer", color:C.ok, fontSize:10, fontWeight:700, letterSpacing:.3 }}>
                ⬇️ Backup
              </button>
              {puedeEliminar(usuario) && (
                <button onClick={elegirArchivoBackup} title="Restaura los datos desde un archivo de backup .json"
                  style={{ width:"100%", background:C.info+"18", border:`1px solid ${C.info}44`, borderRadius:6, padding:"5px 8px", cursor:"pointer", color:C.info, fontSize:10, fontWeight:700, letterSpacing:.3 }}>
                  ⬆️ Restaurar
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="application/json" onChange={onArchivoBackup} style={{ display:"none" }} />
              {importErr && <div style={{ color:C.err, fontSize:9, fontWeight:600 }}>⚠ {importErr}</div>}
            </div>
          )}
          {process.env.NODE_ENV === "development" && !collapsed && (
            <button
              onClick={() => {
                try {
                  seedTestData();
                  window.location.reload();
                } catch (err) {
                  console.error("Error al cargar datos de prueba:", err);
                  setSeedErr(err.message || "Error desconocido, ver consola (F12).");
                }
              }}
              title="Carga cómputo + anidado de prueba y recarga la app"
              style={{ width:"100%", background:C.pur+"18", border:`1px solid ${C.pur}44`, borderRadius:6, padding:"5px 8px", cursor:"pointer", color:C.pur, fontSize:10, fontWeight:700, letterSpacing:.3 }}>
              🧪 Seed datos prueba
            </button>
          )}
          {seedErr && <div style={{ color:C.err, fontSize:9, fontWeight:600 }}>⚠ {seedErr}</div>}
          <button onClick={() => setCollapsed(c => !c)} style={{ width: "100%", background: "transparent", border: `1px solid ${C.border}44`, borderRadius: 6, padding: "5px 0", cursor: "pointer", color: C.muted, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {collapsed ? "▶" : "◀"}
          </button>
          <div onClick={() => setUsuario(null)} title="Cambiar usuario" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 2px", justifyContent: collapsed ? "center" : "flex-start" }}>
            {usuario.foto
              ? <img src={usuario.foto} alt="" style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
              : <span style={{ fontSize: 18, flexShrink: 0 }}>{usuario.emoji || "👤"}</span>}
            {!collapsed && (
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{usuario.nombre}</div>
                <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase" }}>↩ cambiar</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <div style={{ marginLeft: SW, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", transition: "margin-left .2s" }}>

        {/* Topbar */}
        <div style={{ background: C.card, borderBottom: `1px solid ${C.border}33`, padding: "8px 20px", display: "flex", alignItems: "center", gap: 8, position: "sticky", top: 0, zIndex: 50 }}>
          <span style={{ fontSize: 14 }}>{grupoObj?.icon}</span>
          <span style={{ color: C.muted, fontSize: 13 }}>{grupoObj?.label}</span>
          <span style={{ color: C.accent, fontWeight: 700, fontSize: 13 }}> › {tab}</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <div title="Tipo de cambio global — lo usan todos los cómputos y presupuestos nuevos"
              style={{ display: "flex", alignItems: "center", gap: 6, background: C.iron, padding: "3px 10px", borderRadius: 4, border: `1px solid ${C.gold}44` }}>
              <span style={{ fontSize: 11, color: C.muted }}>TC 1 USD =</span>
              <input type="number" min="1" step="0.01" value={tcGlobal}
                onChange={e => setTcGlobal(parseFloat(e.target.value) || 1)}
                onFocus={e => e.target.select()}
                style={{ width: 56, background: "transparent", border: "none", color: C.gold, fontWeight: 700, fontSize: 11, textAlign: "right", outline: "none" }} />
              <span style={{ fontSize: 11, color: C.muted }}>UYU</span>
            </div>
            <span style={{ fontSize: 11, color: C.muted, background: C.iron, padding: "3px 10px", borderRadius: 4, border: `1px solid ${C.border}` }}>
              {usuario.emoji} {usuario.nombre}
            </span>
          </div>
        </div>

        {/* Tab activo */}
        <div style={{ padding: 24, flex: 1 }}>
          {tab === "Buscador"    && <Buscador onIrA={irATab} />}
          {tab === "Biblioteca"  && <BibliotecaMateriales usuario={usuario} />}
          {tab === "Computo"     && <Computo onNidar={() => irATab("Anidado")} onExportarPresupuesto={() => irATab("Presupuesto")} usuario={usuario} tcGlobal={tcGlobal} />}
          {tab === "Anidado"     && <Anidado usuario={usuario} />}
          {tab === "Presupuesto" && <Presupuesto usuario={usuario} tcGlobal={tcGlobal} />}
          {tab === "Historial"   && <Historial usuario={usuario} />}
          {tab === "Config"      && <Config usuario={usuario} usuarios={usuarios} setUsuarios={setUsuarios} />}
        </div>
      </div>

      {pendingBackup && (
        <ModalConfirmarEliminar
          verbo="Restaurar"
          titulo={`backup del ${new Date(pendingBackup.exported_at).toLocaleString("es-UY")}`}
          subtitulo="Esto reemplaza TODOS los datos actuales de la app (presupuestos, cómputos, historial, biblioteca) por los del archivo. No se puede deshacer."
          labelBoton="♻️ Restaurar y reemplazar todo"
          onConfirm={confirmarRestaurar}
          onClose={() => setPendingBackup(null)}
        />
      )}
    </div>
  );
}
