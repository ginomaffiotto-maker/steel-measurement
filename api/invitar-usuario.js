// api/invitar-usuario.js — función serverless de Vercel (2026-09-03, mismo
// patrón que ya está en producción en Steel CRM, api/invitar-usuario.js de
// ese repo). Reemplaza el flujo de "generar comando y pegarlo en tu
// terminal" (scripts/crear-usuario.mjs, steel-backend) por un envío real
// desde la propia pantalla de Config > Usuarios.
//
// Usa la SUPABASE_SERVICE_ROLE_KEY — por eso vive acá y no en el cliente:
// esta key ya se filtró por chat varias veces este proyecto (ver CLAUDE.md
// de steelcrm, entradas del 23-24/8), así que a propósito NO se agrega como
// variable de entorno local — solo existe en Vercel (Project Settings >
// Environment Variables de ESTE proyecto, steel-measurement, separado del
// de steelcrm aunque comparten backend), y el cliente siempre llama a esta
// URL de producción, corra local o no.
//
// Nunca confía en lo que mande el navegador para decidir tenant_id ni rol
// del que invita — valida el token real de sesión (Authorization: Bearer)
// contra Supabase Auth, resuelve el profile real de quien llama, y solo
// sigue si esa fila dice rol="admin". El tenant_id de la persona nueva sale
// de esa misma fila (nunca de un campo del formulario).
const { createClient } = require('@supabase/supabase-js');

// El cliente siempre le pega a esta URL de producción, corra local
// (localhost:3002) o no — eso hace que el request sea cross-origin en
// desarrollo, y el navegador exige CORS explícito (incluida la preflight
// OPTIONS, porque manda un header Authorization custom). Permitido: la
// propia producción y localhost en cualquier puerto (dev).
function setCors(req, res) {
  const origin = req.headers.origin || '';
  if (origin === 'https://steel-measurement.vercel.app' || /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async (req, res) => {
  setCors(req, res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_KEY) {
    res.status(500).json({ error: 'Backend no configurado (falta SUPABASE_SERVICE_ROLE_KEY en Vercel).' });
    return;
  }

  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) {
    res.status(401).json({ error: 'Sesión no encontrada — volvé a iniciar sesión e intentá de nuevo.' });
    return;
  }

  const { nombre, email, rol } = req.body || {};
  if (!nombre?.trim() || !email?.trim()) {
    res.status(400).json({ error: 'Ingresá nombre y email.' });
    return;
  }
  if (!['admin', 'supervisor', 'vendedor'].includes(rol)) {
    res.status(400).json({ error: `Rol inválido: "${rol}".` });
    return;
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);

  const { data: userData, error: eUser } = await admin.auth.getUser(token);
  if (eUser || !userData?.user) {
    res.status(401).json({ error: 'Sesión inválida o vencida — volvé a iniciar sesión.' });
    return;
  }

  const { data: callerProfile, error: eCaller } = await admin
    .from('profiles')
    .select('rol, tenant_id')
    .eq('id', userData.user.id)
    .single();
  if (eCaller || !callerProfile) {
    res.status(403).json({ error: 'No se encontró tu perfil real en el sistema.' });
    return;
  }
  if (callerProfile.rol !== 'admin') {
    res.status(403).json({ error: 'Solo un administrador puede invitar usuarios nuevos.' });
    return;
  }

  const { data: created, error: eCreate } = await admin.auth.admin.inviteUserByEmail(email.trim(), {
    redirectTo: `https://${req.headers.host}`,
  });
  if (eCreate) {
    res.status(400).json({ error: 'No se pudo enviar la invitación: ' + eCreate.message });
    return;
  }

  const { error: eProfile } = await admin.from('profiles').insert({
    id: created.user.id,
    tenant_id: callerProfile.tenant_id,
    nombre: nombre.trim(),
    rol,
  });
  if (eProfile) {
    res.status(500).json({ error: 'La invitación se mandó, pero falló crear el perfil: ' + eProfile.message });
    return;
  }

  res.status(200).json({ ok: true, userId: created.user.id });
};
