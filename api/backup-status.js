// api/backup-status.js — función serverless de Vercel (2026-09-04). Lectura
// de solo estado: cuándo fue el último backup real (ver api/backup-cron.js)
// del tenant de quien llama. No dispara ningún backup — solo informa.
//
// Mismo bucket compartido que usa api/backup-cron.js — Steel Costos tiene
// su propia copia de este archivo (api/backup-status.js, mismo contenido)
// para no depender de un fetch cross-proyecto; los dos leen el mismo
// backup real, generado por el único cron (steelcrm.vercel.app).
const { createClient } = require('@supabase/supabase-js');

const ORIGENES_PERMITIDOS = ['https://steelcrm.vercel.app', 'https://steelcostos.vercel.app', 'https://steel-measurement.vercel.app'];
function setCors(req, res) {
  const origin = req.headers.origin || '';
  if (ORIGENES_PERMITIDOS.includes(origin) || /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async (req, res) => {
  setCors(req, res);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_KEY) {
    res.status(500).json({ error: 'Backend no configurado (falta SUPABASE_SERVICE_ROLE_KEY en Vercel).' });
    return;
  }

  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) { res.status(401).json({ error: 'Sesión no encontrada.' }); return; }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data: userData, error: eUser } = await admin.auth.getUser(token);
  if (eUser || !userData?.user) { res.status(401).json({ error: 'Sesión inválida o vencida.' }); return; }

  const { data: perfil, error: ePerfil } = await admin.from('profiles').select('tenant_id').eq('id', userData.user.id).single();
  if (ePerfil || !perfil?.tenant_id) { res.status(403).json({ error: 'No se encontró tu perfil real.' }); return; }

  const { data: listado, error: eList } = await admin.storage.from('backups')
    .list(perfil.tenant_id, { sortBy: { column: 'name', order: 'desc' } });
  if (eList) { res.status(500).json({ error: eList.message }); return; }

  const archivos = (listado || []).filter(f => /^backup_\d{4}-\d{2}-\d{2}\.json$/.test(f.name));
  const ultimo = archivos[0]?.name?.replace('backup_', '').replace('.json', '') || null;
  res.status(200).json({ ok: true, ultimo, total: archivos.length });
};
