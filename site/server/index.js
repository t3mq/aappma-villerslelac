import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

const ROLES = ['Président', 'Trésorier', 'Secrétaire', 'Membre'];
const CATEGORIES = ['Règlement', 'Cartes', 'Comptes rendus'];

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

// ── Documents (réservés à l'espace d'administration) ──
app.get('/api/documents', auth, async (_req, res) => {
  res.json(await prisma.document.findMany({ orderBy: { createdAt: 'desc' } }));
});

app.post('/api/documents', auth, async (req, res) => {
  const data = {
    title: text(req.body?.title, 'titre', { max: 200 }),
    category: oneOf(req.body?.category, 'catégorie', CATEGORIES),
    filename: text(req.body?.filename, 'nom de fichier', { max: 255 }),
  };
  res.status(201).json(await prisma.document.create({ data }));
});

app.delete('/api/documents/:id', auth, async (req, res) => {
  await prisma.document.delete({ where: { id: identifier(req.params.id) } });
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
  // P2025 : Prisma n'a pas trouvé l'enregistrement visé par un update/delete.
  if (err?.code === 'P2025') {
    return res.status(404).json({ error: 'Élément introuvable.' });
  }
  // P2002 : violation d'une contrainte d'unicité.
  if (err?.code === 'P2002') {
    return res.status(409).json({ error: 'Cet élément existe déjà.' });
  }
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur.' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
