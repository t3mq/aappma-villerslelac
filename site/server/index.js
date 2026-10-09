import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { unlink } from 'node:fs/promises';
import path from 'node:path';

const prisma = new PrismaClient();
const app = express();

// Aucune valeur de repli : un secret par défaut connu permettrait de forger
// des jetons d'administration. On refuse de démarrer sans secret explicite.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('✗ JWT_SECRET manquant. Définissez-le dans .env (openssl rand -hex 32).');
  process.exit(1);
}

const PORT = process.env.PORT || 3001;

// Fichiers de l'espace documents. En Docker, ce dossier est un volume
// (uploads_data) : les fichiers survivent aux reconstructions de l'image.
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || 'uploads');
mkdirSync(UPLOAD_DIR, { recursive: true });

// Derrière Caddy : req.ip doit refléter l'adresse réelle du client,
// sans quoi le limiteur de connexions compterait toutes les requêtes ensemble.
app.set('trust proxy', 1);

// En production le site et l'API partagent le même domaine (Caddy proxifie /api)
// et en développement le proxy Vite fait de même : CORS n'est donc nécessaire
// que pour un front hébergé ailleurs, auquel cas on liste les origines permises.
if (process.env.CORS_ORIGIN) {
  app.use(cors({ origin: process.env.CORS_ORIGIN.split(',').map((o) => o.trim()) }));
}

app.use(express.json({ limit: '100kb' }));

// ── Erreurs ──
// Express 5 transmet automatiquement les rejets des handlers async au
// middleware d'erreur défini en bas de fichier : pas besoin de try/catch ici.
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// ── Validation des entrées ──
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value, field, { max = 255, required = true } = {}) {
  if (value === undefined || value === null) {
    if (required) throw new HttpError(400, `Le champ « ${field} » est requis.`);
    return null;
  }
  if (typeof value !== 'string') {
    throw new HttpError(400, `Le champ « ${field} » doit être un texte.`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    if (required) throw new HttpError(400, `Le champ « ${field} » est requis.`);
    return null;
  }
  if (trimmed.length > max) {
    throw new HttpError(400, `Le champ « ${field} » ne doit pas dépasser ${max} caractères.`);
  }
  return trimmed;
}

// Les dates sont stockées en texte : imposer le format ISO garantit que le tri
// SQL (lexicographique) reste équivalent à un tri chronologique.
function isoDate(value, field) {
  const parsed = text(value, field, { max: 10 });
  if (!ISO_DATE.test(parsed) || Number.isNaN(Date.parse(parsed))) {
    throw new HttpError(400, `Le champ « ${field} » doit être une date au format AAAA-MM-JJ.`);
  }
  return parsed;
}

function email(value, field) {
  const parsed = text(value, field, { max: 255 });
  if (!EMAIL.test(parsed)) {
    throw new HttpError(400, `Le champ « ${field} » doit être une adresse e-mail valide.`);
  }
  return parsed;
}

function oneOf(value, field, allowed) {
  const parsed = text(value, field, { max: 60 });
  if (!allowed.includes(parsed)) {
    throw new HttpError(400, `Le champ « ${field} » doit valoir : ${allowed.join(', ')}.`);
  }
  return parsed;
}

function identifier(param) {
  const n = Number(param);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, 'Identifiant invalide.');
  return n;
}

// null (racine) ou l'identifiant d'un dossier.
function optionalIdentifier(value) {
  if (value === undefined || value === null || value === '' || value === 'null') return null;
  return identifier(value);
}

const ROLES = ['Président', 'Trésorier', 'Secrétaire', 'Membre'];

// ── Limitation des tentatives de connexion (anti force brute) ──
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 10;
const loginAttempts = new Map();

function loginLimiter(req, res, next) {
  const entry = loginAttempts.get(req.ip);
  const now = Date.now();

  if (entry && now - entry.since < LOGIN_WINDOW_MS) {
    if (entry.count >= LOGIN_MAX_ATTEMPTS) {
      const minutes = Math.ceil((LOGIN_WINDOW_MS - (now - entry.since)) / 60000);
      return res.status(429).json({ error: `Trop de tentatives. Réessayez dans ${minutes} minutes.` });
    }
  } else {
    loginAttempts.set(req.ip, { since: now, count: 0 });
  }
  next();
}

function recordFailedLogin(ip) {
  const entry = loginAttempts.get(ip);
  if (entry) entry.count += 1;
}

// Purge des compteurs expirés pour que la Map ne grossisse pas indéfiniment.
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of loginAttempts) {
    if (now - entry.since >= LOGIN_WINDOW_MS) loginAttempts.delete(ip);
  }
}, LOGIN_WINDOW_MS).unref();

// ── Middleware d'authentification ──
function auth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw new HttpError(401, 'Non autorisé.');
  try {
    req.admin = jwt.verify(header.slice(7), JWT_SECRET);
  } catch {
    throw new HttpError(401, 'Session expirée, veuillez vous reconnecter.');
  }
  next();
}

// ── Santé ──
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'db-unavailable' });
  }
});

// ── Authentification ──
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  const mail = text(req.body?.email, 'email');
  const password = text(req.body?.password, 'mot de passe', { max: 200 });

  const admin = await prisma.admin.findUnique({ where: { email: mail } });
  // Le message reste identique dans les deux cas pour ne pas révéler
  // quelles adresses existent en base.
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    recordFailedLogin(req.ip);
    throw new HttpError(401, 'E-mail ou mot de passe incorrect.');
  }

  loginAttempts.delete(req.ip);
  const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

app.get('/api/auth/me', auth, (req, res) => {
  res.json({ id: req.admin.id, email: req.admin.email });
});

// ── Actualités (lecture publique, écriture authentifiée) ──
function newsPayload(body) {
  return {
    title: text(body?.title, 'titre', { max: 200 }),
    date: isoDate(body?.date, 'date'),
    excerpt: text(body?.excerpt, 'extrait', { max: 1000 }),
    content: text(body?.content, 'contenu', { max: 20000 }),
    image: text(body?.image, 'image', { max: 500, required: false }),
  };
}

app.get('/api/news', async (_req, res) => {
  res.json(await prisma.news.findMany({ orderBy: { date: 'desc' } }));
});

app.post('/api/news', auth, async (req, res) => {
  res.status(201).json(await prisma.news.create({ data: newsPayload(req.body) }));
});

app.put('/api/news/:id', auth, async (req, res) => {
  const id = identifier(req.params.id);
  res.json(await prisma.news.update({ where: { id }, data: newsPayload(req.body) }));
});

app.delete('/api/news/:id', auth, async (req, res) => {
  await prisma.news.delete({ where: { id: identifier(req.params.id) } });
  res.json({ ok: true });
});

// ── Événements (lecture publique, écriture authentifiée) ──
function eventPayload(body) {
  return {
    title: text(body?.title, 'titre', { max: 200 }),
    date: isoDate(body?.date, 'date'),
    description: text(body?.description, 'description', { max: 5000 }),
  };
}

app.get('/api/events', async (_req, res) => {
  res.json(await prisma.event.findMany({ orderBy: { date: 'asc' } }));
});

app.post('/api/events', auth, async (req, res) => {
  res.status(201).json(await prisma.event.create({ data: eventPayload(req.body) }));
});

app.put('/api/events/:id', auth, async (req, res) => {
  const id = identifier(req.params.id);
  res.json(await prisma.event.update({ where: { id }, data: eventPayload(req.body) }));
});

app.delete('/api/events/:id', auth, async (req, res) => {
  await prisma.event.delete({ where: { id: identifier(req.params.id) } });
  res.json({ ok: true });
});

// ── Espace documents (réservé à l'administration) ──
// Types acceptés, reconnus à l'extension : le type MIME annoncé par le
// navigateur n'est pas fiable. HTML et SVG sont volontairement exclus : ouverts
// depuis l'administration, ils pourraient exécuter du script sur le domaine.
const FILE_TYPES = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  odt: 'application/vnd.oasis.opendocument.text',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',
  odp: 'application/vnd.oasis.opendocument.presentation',
  rtf: 'application/rtf',
  txt: 'text/plain',
  csv: 'text/csv',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  zip: 'application/zip',
};
const MAX_FILE_SIZE_MB = 25;
const MAX_FILES_PER_UPLOAD = 20;
// Un champ String Prisma devient un VARCHAR(191) sous MySQL.
const MAX_NAME_LENGTH = 191;

function extensionOf(name) {
  return path.extname(name).slice(1).toLowerCase();
}

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    // Nom aléatoire sans extension : le nom choisi par l'utilisateur ne touche
    // jamais le système de fichiers.
    filename: (_req, _file, cb) => cb(null, randomUUID()),
  }),
  // Sans cela, les noms de fichiers sont décodés en latin1 et les accents
  // (« Règlement ») arrivent illisibles.
  defParamCharset: 'utf8',
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024, files: MAX_FILES_PER_UPLOAD },
  fileFilter: (_req, file, cb) => {
    if (FILE_TYPES[extensionOf(file.originalname)]) return cb(null, true);
    cb(new HttpError(400, `Type de fichier non accepté : « ${file.originalname} ».`));
  },
});

async function removeStoredFile(storageKey) {
  if (!storageKey) return;
  // Un fichier déjà absent du disque n'empêche pas de retirer l'entrée.
  await unlink(path.join(UPLOAD_DIR, storageKey)).catch((err) => {
    if (err.code !== 'ENOENT') console.error(err);
  });
}

async function assertFolderExists(id) {
  if (id === null) return;
  if (!(await prisma.folder.findUnique({ where: { id } }))) {
    throw new HttpError(404, 'Dossier introuvable.');
  }
}

async function assertUniqueFolderName(name, parentId, exceptId) {
  const duplicate = await prisma.folder.findFirst({
    where: { name, parentId, ...(exceptId && { NOT: { id: exceptId } }) },
  });
  if (duplicate) throw new HttpError(409, `Un dossier « ${name} » existe déjà à cet endroit.`);
}

// Remonte depuis la destination jusqu'à la racine : si l'on croise le dossier
// déplacé, la destination est l'un de ses descendants (boucle impossible).
async function assertNotInsideItself(folderId, targetParentId) {
  let current = targetParentId;
  while (current !== null) {
    if (current === folderId) {
      throw new HttpError(400, 'Un dossier ne peut pas être déplacé dans lui-même ou dans l’un de ses sous-dossiers.');
    }
    const folder = await prisma.folder.findUnique({ where: { id: current }, select: { parentId: true } });
    if (!folder) throw new HttpError(404, 'Dossier introuvable.');
    current = folder.parentId;
  }
}

// Dossiers
app.get('/api/folders', auth, async (_req, res) => {
  res.json(await prisma.folder.findMany({ orderBy: { name: 'asc' } }));
});

app.post('/api/folders', auth, async (req, res) => {
  const name = text(req.body?.name, 'nom', { max: MAX_NAME_LENGTH });
  const parentId = optionalIdentifier(req.body?.parentId);
  await assertFolderExists(parentId);
  await assertUniqueFolderName(name, parentId);
  res.status(201).json(await prisma.folder.create({ data: { name, parentId } }));
});

// Renommage et/ou déplacement : seuls les champs présents sont modifiés.
app.patch('/api/folders/:id', auth, async (req, res) => {
  const id = identifier(req.params.id);
  const body = req.body ?? {};
  const current = await prisma.folder.findUnique({ where: { id } });
  if (!current) throw new HttpError(404, 'Dossier introuvable.');

  const data = {};
  if ('name' in body) data.name = text(body.name, 'nom', { max: MAX_NAME_LENGTH });
  if ('parentId' in body) {
    data.parentId = optionalIdentifier(body.parentId);
    await assertNotInsideItself(id, data.parentId);
  }
  await assertUniqueFolderName(data.name ?? current.name, data.parentId ?? current.parentId, id);
  res.json(await prisma.folder.update({ where: { id }, data }));
});

// Pas de suppression récursive : vider un dossier d'un clic par erreur
// effacerait des fichiers sans retour possible.
app.delete('/api/folders/:id', auth, async (req, res) => {
  const id = identifier(req.params.id);
  const [subfolders, documents] = await Promise.all([
    prisma.folder.count({ where: { parentId: id } }),
    prisma.document.count({ where: { folderId: id } }),
  ]);
  if (subfolders + documents > 0) {
    throw new HttpError(409, 'Ce dossier n’est pas vide : déplacez ou supprimez d’abord son contenu.');
  }
  await prisma.folder.delete({ where: { id } });
  res.json({ ok: true });
});

// Documents
app.get('/api/documents', auth, async (_req, res) => {
  res.json(await prisma.document.findMany({ orderBy: { createdAt: 'desc' } }));
});

app.post('/api/documents', auth, upload.array('files'), async (req, res) => {
  const files = req.files ?? [];
  try {
    if (files.length === 0) throw new HttpError(400, 'Aucun fichier reçu.');
    const folderId = optionalIdentifier(req.body?.folderId);
    await assertFolderExists(folderId);
    const created = await prisma.$transaction(
      files.map((file) =>
        prisma.document.create({
          data: {
            title: file.originalname.slice(0, MAX_NAME_LENGTH),
            filename: file.originalname.slice(0, MAX_NAME_LENGTH),
            storageKey: file.filename,
            mimeType: FILE_TYPES[extensionOf(file.originalname)],
            size: file.size,
            folderId,
          },
        }),
      ),
    );
    res.status(201).json(created);
  } catch (err) {
    // Rien en base : les fichiers déjà écrits sur le disque seraient orphelins.
    await Promise.all(files.map((file) => removeStoredFile(file.filename)));
    throw err;
  }
});

// Renommage et/ou déplacement : seuls les champs présents sont modifiés.
app.patch('/api/documents/:id', auth, async (req, res) => {
  const id = identifier(req.params.id);
  const body = req.body ?? {};
  const data = {};
  if ('title' in body) data.title = text(body.title, 'nom', { max: MAX_NAME_LENGTH });
  if ('folderId' in body) {
    data.folderId = optionalIdentifier(body.folderId);
    await assertFolderExists(data.folderId);
  }
  res.json(await prisma.document.update({ where: { id }, data }));
});

app.get('/api/documents/:id/file', auth, async (req, res, next) => {
  const doc = await prisma.document.findUnique({ where: { id: identifier(req.params.id) } });
  if (!doc) throw new HttpError(404, 'Élément introuvable.');
  if (!doc.storageKey) throw new HttpError(404, 'Aucun fichier n’est associé à ce document.');

  // Un nom renommé sans son extension donnerait un fichier que l'ordinateur
  // ne sait plus ouvrir : on remet celle d'origine.
  const ext = path.extname(doc.filename);
  const name = extensionOf(doc.title) === ext.slice(1).toLowerCase() ? doc.title : doc.title + ext;

  res.attachment(name);
  res.type(doc.mimeType ?? 'application/octet-stream');
  res.set('X-Content-Type-Options', 'nosniff');
  res.sendFile(path.join(UPLOAD_DIR, doc.storageKey), (err) => {
    if (err && !res.headersSent) next(new HttpError(404, 'Fichier introuvable sur le serveur.'));
  });
});

app.delete('/api/documents/:id', auth, async (req, res) => {
  const doc = await prisma.document.delete({ where: { id: identifier(req.params.id) } });
  await removeStoredFile(doc.storageKey);
  res.json({ ok: true });
});

// ── Adhérents (réservés à l'espace d'administration) ──
function memberPayload(body) {
  return {
    name: text(body?.name, 'nom', { max: 120 }),
    email: email(body?.email, 'e-mail'),
    role: oneOf(body?.role, 'rôle', ROLES),
    cotisation: body?.cotisation === true,
  };
}

app.get('/api/members', auth, async (_req, res) => {
  res.json(await prisma.member.findMany({ orderBy: { name: 'asc' } }));
});

app.post('/api/members', auth, async (req, res) => {
  res.status(201).json(await prisma.member.create({ data: memberPayload(req.body) }));
});

app.put('/api/members/:id', auth, async (req, res) => {
  const id = identifier(req.params.id);
  res.json(await prisma.member.update({ where: { id }, data: memberPayload(req.body) }));
});

app.delete('/api/members/:id', auth, async (req, res) => {
  await prisma.member.delete({ where: { id: identifier(req.params.id) } });
  res.json({ ok: true });
});

// ── Galerie photos (lecture publique, écriture authentifiée) ──
app.get('/api/photos', async (_req, res) => {
  res.json(await prisma.photo.findMany({ orderBy: { createdAt: 'desc' } }));
});

app.post('/api/photos', auth, async (req, res) => {
  const data = {
    src: text(req.body?.src, 'source', { max: 500 }),
    alt: text(req.body?.alt, 'description', { max: 200 }),
  };
  res.status(201).json(await prisma.photo.create({ data }));
});

app.delete('/api/photos/:id', auth, async (req, res) => {
  await prisma.photo.delete({ where: { id: identifier(req.params.id) } });
  res.json({ ok: true });
});

// ── Route inconnue ──
app.use((_req, res) => {
  res.status(404).json({ error: 'Ressource introuvable.' });
});

// ── Gestion centralisée des erreurs ──
app.use((err, _req, res, _next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: `Fichier trop volumineux (${MAX_FILE_SIZE_MB} Mo maximum).` });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: `${MAX_FILES_PER_UPLOAD} fichiers maximum par envoi.` });
    }
    return res.status(400).json({ error: 'Envoi de fichiers invalide.' });
  }
  // P2025 : Prisma n'a pas trouvé l'enregistrement visé par un update/delete.
  if (err?.code === 'P2025') {
    return res.status(404).json({ error: 'Élément introuvable.' });
  }
  // P2002 : violation d'une contrainte d'unicité.
  if (err?.code === 'P2002') {
    return res.status(409).json({ error: 'Cet élément existe déjà.' });
  }
  // P2003 : contrainte de clé étrangère (ex. dossier encore utilisé).
  if (err?.code === 'P2003') {
    return res.status(409).json({ error: 'Cet élément est encore utilisé.' });
  }
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur.' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
