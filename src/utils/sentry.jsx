import * as Sentry from "@sentry/react";

// Monitoreo de errores en producción (2026-09-07, a pedido de Gino) — hoy,
// si algo falla en silencio mientras Gino/Tiao usan el sistema, solo nos
// enteramos si esa persona lo nota y lo cuenta a mano. Esto lo captura
// solo, sin depender de que alguien avise — mismo mecanismo que Steel CRM
// (utils/sentry.jsx de ese repo), un proyecto de Sentry por sistema para
// distinguir de dónde viene cada error.
//
// Requiere la variable de entorno REACT_APP_SENTRY_DSN (local: .env.local;
// producción: Vercel > Settings > Environment Variables). Sin ese DSN, la
// función no hace nada — no rompe nada mientras no esté configurado.
// El DSN de Sentry es público por diseño (viaja en el bundle del browser,
// mismo criterio que la anon key de Supabase) — no es un secreto.
export function initSentry() {
  const dsn = process.env.REACT_APP_SENTRY_DSN;
  if (!dsn) return;
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    // Solo errores por ahora, sin session replay ni performance tracing —
    // es lo que hace falta hoy. Sumar integrations más adelante si hiciera
    // falta más detalle (ej. Sentry.replayIntegration()).
    tracesSampleRate: 0,
  });
}

// Pantalla de resguardo si React se cae del todo (crash real, no un error
// de red o de guardado que la app ya maneja) — reemplaza la pantalla en
// blanco que vería el usuario sin esto. Sin depender de styles/colors.js a
// propósito (este archivo corre antes de que el resto de la app monte).
export function SentryFallback({ error, resetError }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 14, background: "#0d0f12", color: "#e6edf3",
      fontFamily: "system-ui, sans-serif", padding: 24, textAlign: "center",
    }}>
      <div style={{ fontSize: 40 }}>⚠️</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>Algo salió mal.</div>
      <div style={{ fontSize: 13, color: "#8b949e", maxWidth: 420 }}>
        El error ya quedó registrado. Probá recargar la página — si se repite, avisá con la hora exacta.
      </div>
      <button onClick={() => { resetError(); window.location.reload(); }}
        style={{ marginTop: 8, padding: "8px 18px", borderRadius: 6, border: "1px solid #e85d04", background: "#e85d0422", color: "#e85d04", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
        Recargar
      </button>
      {process.env.NODE_ENV !== "production" && (
        <pre style={{ marginTop: 12, fontSize: 11, color: "#f85149", maxWidth: 600, overflow: "auto", textAlign: "left" }}>{String(error?.stack || error)}</pre>
      )}
    </div>
  );
}
