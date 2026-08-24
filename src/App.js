import { useState, useEffect } from "react";
import { C } from "./styles/colors";
import { saveLS, loadLS, iUsuarios } from "./utils/storage";
import { supabase } from "./utils/supabaseClient";
import BibliotecaMateriales from "./components/BibliotecaMateriales";
import Computo from "./components/Computo";
import Anidado from "./components/Anidado";
import Presupuesto from "./components/Presupuesto";
import Historial from "./components/Historial";
import Dashboard from "./components/Dashboard";
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
    id: "dashboard", icon: "📈", label: "Dashboard",
    tabs: [{ icon: "📈", label: "Dashboard", tab: "Dashboard" }],
  },
  {
    id: "sistema", icon: "⚙️", label: "Sistema",
    tabs: [
      { icon: "⚙️", label: "Config",     tab: "Config" },
      { icon: "📦", label: "Insumos y Precios", tab: "Biblioteca" },
    ],
  },
];

// ─── PANTALLA LOGIN ──────────────────────────────────────────────
// Login real vía Supabase Auth (reemplaza selección de usuario + password en
// texto plano) — mismo mecanismo que steelCRM, mismo "hermano". El objeto que
// sale de acá (onLogin) mantiene la misma forma que usaba el login viejo
// ({ id, nombre, rol, emoji, foto }) para no tocar el resto de la app — se
// busca o crea el registro local por email. Reemplaza también el intento de
// login silencioso que existía antes en entrar(): ya no hace falta, ahora
// Supabase Auth es siempre el mecanismo principal.
function Login({ usuarios, setUsuarios, onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);
  const [cargando, setCargando] = useState(false);

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14,
    border: `1.5px solid ${err ? C.err : C.border}`,
    background: C.bg, color: C.text, outline: "none", boxSizing: "border-box",
  };

  const entrar = async (e) => {
    e.preventDefault();
    if (!supabase) { setErr("Backend no configurado (faltan variables de entorno)"); return; }
    setCargando(true);
    setErr("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (authError) {
      setErr("Email o contraseña incorrectos");
      setPass("");
      setCargando(false);
      return;
    }
    const authUser = data.user;
    let local = usuarios.find(u => u.email && u.email.toLowerCase() === authUser.email.toLowerCase());
    if (!local) {
      const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", authUser.id).single();
      if (profileError || !profile) {
        setErr("Tu cuenta no tiene un perfil asignado todavía — avisale al administrador.");
        setCargando(false);
        return;
      }
      local = {
        id: Date.now(), nombre: profile.nombre, rol: profile.rol,
        emoji: profile.emoji || "👤", foto: profile.foto || "", clave: "",
        email: authUser.email,
      };
      setUsuarios(prev => [...prev, local]);
    }
    setCargando(false);
    onLogin(local);
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ width: 56, height: 56, background: C.accent, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", margin: "0 auto 14px" }}>📐</div>
        <div style={{ color: C.accent, fontWeight: 900, fontSize: 24, letterSpacing: -0.5 }}>Steel Measurement</div>
        <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>Metraje · Cómputo · Presupuesto Industrial</div>
      </div>

      <form onSubmit={entrar} style={{ width: "100%", maxWidth: 340 }}>
        <div style={{ background: C.card, border: `2px solid ${C.accent}66`, borderRadius: 14, padding: "28px 28px 24px", boxShadow: `0 8px 28px ${C.accent}22` }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErr(""); }}
              placeholder="tu@email.com"
              autoComplete="username"
              style={inputStyle}
              required
            />
          </div>
          <div style={{ marginBottom: 16, position: "relative" }}>
            <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5 }}>Contraseña</label>
            <input
              type={show ? "text" : "password"}
              value={pass}
              onChange={e => { setPass(e.target.value); setErr(""); }}
              placeholder="Ingresá tu contraseña"
              autoComplete="new-password"
              style={inputStyle}
              required
            />
            <span onClick={() => setShow(v => !v)} style={{ position: "absolute", right: 10, top: 34, cursor: "pointer", fontSize: 16, color: C.muted }}>
              {show ? "🙈" : "👁️"}
            </span>
          </div>
          {err && <div style={{ color: C.err, fontSize: 12, marginBottom: 12, fontWeight: 600 }}>⚠ {err}</div>}
          <button type="submit" disabled={cargando} style={{ width: "100%", padding: "11px", borderRadius: 8, background: C.accent, color: "#fff", border: "none", fontWeight: 700, fontSize: 15, cursor: cargando ? "default" : "pointer", opacity: cargando ? 0.7 : 1 }}>
            {cargando ? "Ingresando…" : "Ingresar →"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────
const SESION_USUARIO_KEY = "smeas_sesion_usuario_id";
const SESION_TAB_KEY = "smeas_sesion_tab";

export default function App() {
  const [usuarios, setUsuarios] = useState(iUsuarios);
  const [usuario,  setUsuario]  = useState(() => {
    const savedId = sessionStorage.getItem(SESION_USUARIO_KEY);
    if (savedId == null) return null;
    return iUsuarios.find(u => String(u.id) === savedId) || null;
  });
  // Recupera la última pestaña activa tras una recarga (ej. al cambiar el
  // tema en Config, que fuerza un reload) — antes siempre volvía a Cómputo.
  const tabGuardado = (() => {
    try { return JSON.parse(sessionStorage.getItem(SESION_TAB_KEY) || "null"); } catch { return null; }
  })();
  const [grupo,    setGrupo]    = useState(tabGuardado?.grupo || "computo");
  const [tab,      setTab]      = useState(tabGuardado?.tab || "Computo");
  const [collapsed, setCollapsed] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const [seedErr, setSeedErr] = useState("");
  const [tcGlobal, setTcGlobal] = useState(() => loadLS("smeas_tc_global", 40));

  // Responsive: en pantallas angostas (celular, ventana chica) la barra
  // colapsa sola al cruzar el umbral — el usuario todavía puede expandirla
  // a mano con el botón ◀/▶, esto solo fija el estado inicial/al resize.
  // Mismo patrón que steelCRM (commit c81b5ac).
  useEffect(() => {
    const onResize = () => setCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => { saveLS("smeas_usuarios", usuarios); }, [usuarios]);
  useEffect(() => { saveLS("smeas_tc_global", tcGlobal); }, [tcGlobal]);
  useEffect(() => {
    if (usuario) sessionStorage.setItem(SESION_USUARIO_KEY, String(usuario.id));
    else sessionStorage.removeItem(SESION_USUARIO_KEY);
  }, [usuario]);
  useEffect(() => {
    sessionStorage.setItem(SESION_TAB_KEY, JSON.stringify({ grupo, tab }));
  }, [grupo, tab]);

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
          {tab === "Dashboard"   && <Dashboard />}
          {tab === "Config"      && <Config usuario={usuario} usuarios={usuarios} setUsuarios={setUsuarios} />}
        </div>
      </div>
    </div>
  );
}
