import { createClient } from "@supabase/supabase-js";

// Verifica una contraseña sin tocar la sesión principal de la app — crea un
// cliente de Supabase descartable (sin persistir sesión ni auto-refresh) que
// se usa una sola vez para el login y se descarta. Si usáramos el cliente
// principal (utils/supabaseClient.js), un login exitoso acá reemplazaría la
// sesión activa de quien esté usando la app en ese momento — por ejemplo, un
// admin aprobando el borrado de OTRO usuario terminaría logueado como el
// admin en vez del vendedor que originó la acción.
// (Mismo archivo que steelCRM, 2026-08-24 — genérico, sin cambios.)
export async function verificarPassword(email, password) {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return { ok: false, error: "Backend no configurado" };
  const clienteTemporal = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await clienteTemporal.auth.signInWithPassword({ email, password });
  if (error || !data?.user) return { ok: false, error: "Email o contraseña incorrectos" };
  return { ok: true, userId: data.user.id, email: data.user.email };
}
