import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'aappma-secret-key-change-in-production';
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ── Auth middleware ──
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Non autorise' });
  try {
    req.admin = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide' });
  }
}

// ── Auth routes ──
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis.' });

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

  const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

app.get('/api/auth/me', auth, (req, res) => {
  res.json({ id: req.admin.id, email: req.admin.email });
});

// ── News (public read, auth write) ──
app.get('/api/news', async (_req, res) => {
  const items = await prisma.news.findMany({ orderBy: { date: 'desc' } });
  res.json(items);
});

app.post('/api/news', auth, async (req, res) => {
  const { title, date, excerpt, content, image } = req.body;
  const item = await prisma.news.create({ data: { title, date, excerpt, content, image } });
  res.status(201).json(item);
});

app.put('/api/news/:id', auth, async (req, res) => {
  const { title, date, excerpt, content, image } = req.body;
  const item = await prisma.news.update({ where: { id: Number(req.params.id) }, data: { title, date, excerpt, content, image } });
  res.json(item);
});

app.delete('/api/news/:id', auth, async (req, res) => {
  await prisma.news.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

// ── Events (public read, auth write) ──
app.get('/api/events', async (_req, res) => {
  const items = await prisma.event.findMany({ orderBy: { date: 'asc' } });
  res.json(items);
});

app.post('/api/events', auth, async (req, res) => {
  const { title, date, description } = req.body;
  const item = await prisma.event.create({ data: { title, date, description } });
  res.status(201).json(item);
});

app.put('/api/events/:id', auth, async (req, res) => {
  const { title, date, description } = req.body;
  const item = await prisma.event.update({ where: { id: Number(req.params.id) }, data: { title, date, description } });
  res.json(item);
});

app.delete('/api/events/:id', auth, async (req, res) => {
  await prisma.event.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

// ── Documents (public read, auth write) ──
app.get('/api/documents', async (_req, res) => {
  const items = await prisma.document.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(items);
});

app.post('/api/documents', auth, async (req, res) => {
  const { title, category, filename } = req.body;
  const item = await prisma.document.create({ data: { title, category, filename } });
  res.status(201).json(item);
});

app.delete('/api/documents/:id', auth, async (req, res) => {
  await prisma.document.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

// ── Members (auth only) ──
app.get('/api/members', auth, async (_req, res) => {
  const items = await prisma.member.findMany({ orderBy: { name: 'asc' } });
  res.json(items);
});

app.post('/api/members', auth, async (req, res) => {
  const { name, email, role, cotisation } = req.body;
  const item = await prisma.member.create({ data: { name, email, role, cotisation } });
  res.status(201).json(item);
});

app.put('/api/members/:id', auth, async (req, res) => {
  const { name, email, role, cotisation } = req.body;
  const item = await prisma.member.update({ where: { id: Number(req.params.id) }, data: { name, email, role, cotisation } });
  res.json(item);
});

app.delete('/api/members/:id', auth, async (req, res) => {
  await prisma.member.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

// ── Photos (public read, auth write) ──
app.get('/api/photos', async (_req, res) => {
  const items = await prisma.photo.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(items);
});

app.post('/api/photos', auth, async (req, res) => {
  const { src, alt } = req.body;
  const item = await prisma.photo.create({ data: { src, alt } });
  res.status(201).json(item);
});

app.delete('/api/photos/:id', auth, async (req, res) => {
  await prisma.photo.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
