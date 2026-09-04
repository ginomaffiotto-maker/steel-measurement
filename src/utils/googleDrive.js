// ─── GOOGLE DRIVE BACKUP ────────────────────────────────────────────────────
// Mismo mecanismo que ya tiene Steel CRM (Google Identity Services + Drive
// API v3 directo desde el browser, sin backend ni librería adicional) — acá
// adaptado 2026-09-03, a pedido de Gino, para que Measurement tenga la misma
// opción de respaldo automático/manual a la nube personal del usuario.

const SCOPE = 'https://www.googleapis.com/auth/drive.file';
const BACKUP_FILENAME = 'steelmeasurement_backup.json';

let _tokenClient = null;
let _accessToken = null;
let _tokenExpiry = 0; // timestamp ms

// ── Cargar script GIS ──────────────────────────────────────────────────────
function loadGIS() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) { resolve(); return; }
    if (document.getElementById('gsi-script')) {
      const wait = setInterval(() => {
        if (window.google?.accounts?.oauth2) { clearInterval(wait); resolve(); }
      }, 100);
      return;
    }
    const s = document.createElement('script');
    s.id = 'gsi-script';
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error('No se pudo cargar Google Identity Services.'));
    document.head.appendChild(s);
  });
}

// ── Obtener token (pide autorización si es necesario) ──────────────────────
export async function authorize(clientId, interactive = true) {
  await loadGIS();
  return new Promise((resolve, reject) => {
    _tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPE,
      callback: (resp) => {
        if (resp.error) { reject(new Error(resp.error_description || resp.error)); return; }
        _accessToken = resp.access_token;
        _tokenExpiry = Date.now() + (resp.expires_in - 60) * 1000; // 1 min de margen
        resolve(_accessToken);
      },
    });
    _tokenClient.requestAccessToken({ prompt: interactive ? 'consent' : '' });
  });
}

function tokenValid() {
  return _accessToken && Date.now() < _tokenExpiry;
}

async function ensureToken(clientId) {
  if (tokenValid()) return;
  await authorize(clientId, false);
}

// ── Recopilar todos los datos del localStorage (mismo criterio dinámico
//    que exportBackup() en storage.js — cualquier key "smeas_*", sin
//    mantener una lista fija que se pueda desactualizar) ───────────────────
function getBackupData() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("smeas_")) data[k] = localStorage.getItem(k);
  }
  return { app: "steel-measurement", version: 1, exported_at: new Date().toISOString(), data };
}

// ── Subir backup a Drive ──────────────────────────────────────────────────
export async function backupToDrive(clientId) {
  await ensureToken(clientId);

  const content = JSON.stringify(getBackupData(), null, 2);

  const search = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name%3D'${BACKUP_FILENAME}'+and+trashed%3Dfalse&fields=files(id,name,modifiedTime)`,
    { headers: { Authorization: `Bearer ${_accessToken}` } }
  );
  if (!search.ok) throw new Error(`Error buscando en Drive: ${search.status}`);
  const { files } = await search.json();
  const existing = files?.[0];

  let resp;
  if (existing) {
    resp = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${_accessToken}`,
          'Content-Type': 'application/json',
        },
        body: content,
      }
    );
  } else {
    const boundary = '-------steelmeasurement_boundary';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelim = `\r\n--${boundary}--`;
    const metaPart = `Content-Type: application/json\r\n\r\n${JSON.stringify({ name: BACKUP_FILENAME, mimeType: 'application/json' })}`;
    const filePart = `Content-Type: application/json\r\n\r\n${content}`;
    const body = delimiter + metaPart + delimiter + filePart + closeDelim;

    resp = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${_accessToken}`,
          'Content-Type': `multipart/related; boundary="${boundary}"`,
        },
        body,
      }
    );
  }

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `Drive error ${resp.status}`);
  }

  const result = await resp.json();
  return { fileId: result.id, date: new Date().toISOString() };
}

// ── Restaurar desde Drive — devuelve el payload ya validado por
//    parseBackup(), para que quien llame lo aplique con restoreBackup()
//    (mismo camino que ya usa "Restaurar desde archivo", con su propia
//    confirmación antes de pisar todo lo local) ────────────────────────────
export async function restoreFromDrive(clientId) {
  await ensureToken(clientId);

  const search = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name%3D'${BACKUP_FILENAME}'+and+trashed%3Dfalse&fields=files(id,modifiedTime)`,
    { headers: { Authorization: `Bearer ${_accessToken}` } }
  );
  if (!search.ok) throw new Error(`Error buscando en Drive: ${search.status}`);
  const { files } = await search.json();
  if (!files?.length) throw new Error('No se encontró ningún respaldo en tu Google Drive.');

  const dl = await fetch(
    `https://www.googleapis.com/drive/v3/files/${files[0].id}?alt=media`,
    { headers: { Authorization: `Bearer ${_accessToken}` } }
  );
  if (!dl.ok) throw new Error(`Error descargando respaldo: ${dl.status}`);

  const text = await dl.text();
  if (!text || !text.trim().startsWith("{")) throw new Error('El archivo encontrado no es un respaldo válido.');
  return JSON.parse(text); // validado con parseBackup() del lado del llamador
}

// ── Formatear fecha legible ───────────────────────────────────────────────
export function formatBackupDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' });
}
