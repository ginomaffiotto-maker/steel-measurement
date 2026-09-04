// api/eliminar-usuario.js — función serverless de Vercel (2026-09-03, mismo
// patrón que api/invitar-usuario.js). Reemplaza el flujo de "generar
// comando y pegarlo en la terminal" (scripts/eliminar-usuario.mjs,
// steel-backend) por una revocación real desde la propia pantalla de
// Config > Usuarios — antes, borrar de la lista local no tocaba la cuenta
// real, que seguía pudiendo loguearse hasta correr el script a mano.
//
// Mismo criterio de seguridad que invitar-usuario.js: usa la
// SUPABASE_SERVICE_ROLE_KEY (solo en Vercel, nunca en la máquina de nadie),
// nunca confía en lo que mande el navegador para decidir si quien llama es
// admin — valida el token real de sesión y el rol en `profiles`.
//
// `admin.auth.admin.deleteUser` borra la fila de auth.users; `profiles.id`
// tiene `on delete cascade` contra auth.users(id), así que la fila de
// profiles se borra sola — no hace falta un segundo delete acá.
const { createClient } = require('@supabase/supabase-js');

const ORIGENES_PERMITIDOS = ['https://steelcostos.vercel.app', 'https://steel-measurement.vercel.app'];
function setCors(req, res) {
  const origin = req.headers.origin || '';
  if (ORIGENES_PERMITIDOS.includes(origin) || /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
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

  const { userId } = req.body || {};
  if (!userId?.trim()) {
    res.status(400).json({ error: 'Falta el usuario a eliminar.' });
    return;
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);

  const { data: userData, error: eUser } = await admin.auth.getUser(token);
  if (eUser || !userData?.user) {
    res.status(401).json({ error: 'Sesión inválida o vencida — volvé a iniciar sesión.' });
    return;
  }

  if (userData.user.id === userId) {
    res.status(400).json({ error: 'No podés eliminar tu propia cuenta desde acá.' });
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
    res.status(403).json({ error: 'Solo un administrador puede eliminar usuarios.' });
    return;
  }

  // El objetivo tiene que ser del mismo tenant — nunca confiar en que el
  // navegador mande un id ajeno por error (o a propósito).
  const { data: targetProfile, error: eTarget } = await admin
    .from('profiles')
    .select('tenant_id')
    .eq('id', userId)
    .single();
  if (eTarget || !targetProfile) {
    res.status(404).json({ error: 'No se encontró ese usuario.' });
    return;
  }
  if (targetProfile.tenant_id !== callerProfile.tenant_id) {
    res.status(403).json({ error: 'Ese usuario no pertenece a tu empresa.' });
    return;
  }

  const { error: eDelete } = await admin.auth.admin.deleteUser(userId);
  if (eDelete) {
    res.status(400).json({ error: 'No se pudo eliminar: ' + eDelete.message });
    return;
  }

  res.status(200).json({ ok: true });
};
