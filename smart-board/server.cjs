console.log("🔥 NEW SERVER STARTING [UNIQUE_MARKER_12345]");
require('dotenv').config();
console.log('📌 API Key loaded:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.slice(0, 20) + '...' : 'NOT SET');
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const OpenAI = require('openai').default;

let openai = null;
function getOpenAI() {
  if (!openai) {
    const key = process.env.OPENAI_API_KEY;
    console.log('🔑 Loading OpenAI client with key:', key ? key.slice(0, 20) + '...' : 'NOT SET');
    if (!key) throw new Error('OPENAI_API_KEY is not set');
    openai = new OpenAI({
      apiKey: key,
      baseURL: 'https://api.euron.one/api/v1/euri',
    });
  }
  return openai;
}

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Debug middleware - MUST fire
app.use((req, res, next) => {
  console.log(`📨 REQUEST HIT MIDDLEWARE: ${req.method} ${req.path}`);
  console.log('Middleware is executing!');
  return next();
});

console.log('✅ Middleware registered');

const db = new Database(path.join(__dirname, 'smartboard.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    priority TEXT NOT NULL DEFAULT 'none' CHECK(priority IN ('high','medium','low','none')),
    columnId TEXT NOT NULL DEFAULT 'todo' CHECK(columnId IN ('todo','in-progress','review','done')),
    dueDate TEXT,
    assignees TEXT NOT NULL DEFAULT '[]',
    commentsCount INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);

function rowToTask(row) {
  return {
    ...row,
    assignees: JSON.parse(row.assignees),
    dueDate: row.dueDate || undefined,
  };
}

// ===== ROUTES =====

// GET /api/tasks
app.get('/api/tasks', (req, res) => {
  const { sort = 'createdAt_desc', priority = 'all', search = '', column = '', assignee = '', dueFrom = '', dueTo = '' } = req.query;
  let where = [];
  let params = {};

  if (priority !== 'all') {
    where.push('priority = @priority');
    params.priority = priority;
  }

  if (search) {
    where.push('(title LIKE @search OR description LIKE @search)');
    params.search = `%${search}%`;
  }

  if (column) {
    where.push('columnId = @column');
    params.column = column;
  }

  if (assignee) {
    where.push("assignees LIKE @assignee");
    params.assignee = `%"${assignee}"%`;
  }

  if (dueFrom) {
    where.push('dueDate >= @dueFrom');
    params.dueFrom = dueFrom;
  }

  if (dueTo) {
    where.push('dueDate <= @dueTo');
    params.dueTo = dueTo;
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
  const ORDER_MAP = {
    createdAt_desc: 'createdAt DESC',
    createdAt_asc: 'createdAt ASC',
    priority: `CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 WHEN 'low' THEN 2 ELSE 3 END, createdAt DESC`,
    title: 'title COLLATE NOCASE ASC',
    comments_desc: 'commentsCount DESC',
  };
  const orderBy = ORDER_MAP[sort] || ORDER_MAP.createdAt_desc;
  const rows = db.prepare(`SELECT * FROM tasks ${whereClause} ORDER BY ${orderBy}`).all(params);
  res.json(rows.map(rowToTask));
});

// GET /api/tasks/:id
app.get('/api/tasks/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Task not found' });
  res.json(rowToTask(row));
});

// POST /api/tasks
app.post('/api/tasks', (req, res) => {
  const { title, description = '', priority = 'none', columnId = 'todo', dueDate, assignees = ['You'] } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });
  const now = new Date().toISOString();
  const task = {
    id: uuidv4(),
    title: title.trim(),
    description: description.trim(),
    priority,
    columnId,
    dueDate: dueDate || null,
    assignees: JSON.stringify(assignees),
    commentsCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  db.prepare(`
    INSERT INTO tasks (id, title, description, priority, columnId, dueDate, assignees, commentsCount, createdAt, updatedAt)
    VALUES (@id, @title, @description, @priority, @columnId, @dueDate, @assignees, @commentsCount, @createdAt, @updatedAt)
  `).run(task);
  res.status(201).json(rowToTask({ ...task }));
});

// PUT /api/tasks/:id
app.put('/api/tasks/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });
  const updates = {
    title: req.body.title ?? existing.title,
    description: req.body.description ?? existing.description,
    priority: req.body.priority ?? existing.priority,
    columnId: req.body.columnId ?? existing.columnId,
    dueDate: req.body.dueDate !== undefined ? (req.body.dueDate || null) : existing.dueDate,
    assignees: req.body.assignees ? JSON.stringify(req.body.assignees) : existing.assignees,
    commentsCount: req.body.commentsCount ?? existing.commentsCount,
    updatedAt: new Date().toISOString(),
  };
  db.prepare(`
    UPDATE tasks SET title=@title, description=@description, priority=@priority,
    columnId=@columnId, dueDate=@dueDate, assignees=@assignees, commentsCount=@commentsCount, updatedAt=@updatedAt
    WHERE id=@id
  `).run({ ...updates, id: req.params.id });
  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json(rowToTask(updated));
});

// GET /api/reports/summary
app.get('/api/reports/summary', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as c FROM tasks').get().c;
  const byColumn = db.prepare('SELECT columnId, COUNT(*) as count FROM tasks GROUP BY columnId').all();
  const byPriority = db.prepare('SELECT priority, COUNT(*) as count FROM tasks GROUP BY priority').all();
  const columnMap = { todo: 0, 'in-progress': 0, review: 0, done: 0 };
  byColumn.forEach((r) => { columnMap[r.columnId] = r.count; });
  const priorityMap = { high: 0, medium: 0, low: 0, none: 0 };
  byPriority.forEach((r) => { priorityMap[r.priority] = r.count; });
  const now = new Date();
  function periodStats(sinceISO) {
    const created = db.prepare('SELECT COUNT(*) as c FROM tasks WHERE createdAt >= ?').get(sinceISO).c;
    const todo = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE columnId = 'todo' AND updatedAt >= ?").get(sinceISO).c;
    const inProgress = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE columnId = 'in-progress' AND updatedAt >= ?").get(sinceISO).c;
    const review = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE columnId = 'review' AND updatedAt >= ?").get(sinceISO).c;
    const done = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE columnId = 'done' AND updatedAt >= ?").get(sinceISO).c;
    return { created, todo, inProgress, review, done };
  }
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const dailyStats = periodStats(todayStart);
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const weeklyStats = periodStats(weekStart);
  const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const monthlyStats = periodStats(monthStart);
  const todayDay = now.getDay();
  const daysSinceMonday = todayDay === 0 ? 6 : todayDay - 1;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday);
  const progressData = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
    const dayEndISO = dayEnd.toISOString();
    const dayLabel = day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const created = db.prepare('SELECT COUNT(*) as c FROM tasks WHERE createdAt < ?').get(dayEndISO).c;
    const done = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE columnId = 'done' AND updatedAt < ?").get(dayEndISO).c;
    const inReview = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE columnId = 'review' AND updatedAt < ?").get(dayEndISO).c;
    progressData.push({ day: dayLabel, total: created, done, review: inReview });
  }
  const overdue = db.prepare("SELECT COUNT(*) as c FROM tasks WHERE dueDate IS NOT NULL AND dueDate < ? AND columnId != 'done'")
    .get(now.toISOString().split('T')[0]).c;
  res.json({ total, columns: columnMap, priorities: priorityMap, daily: dailyStats, weekly: weeklyStats, monthly: monthlyStats, progressData, overdue });
});

// Test different path (NOT /api/*)
console.log('About to register GET /test-route');
try {
  app.get('/test-route', (req, res) => {
    console.log('🎯 GET TEST ROUTE HIT!');
    res.json({ msg: 'GET test route works' });
  });
  console.log('✅ GET /test-route registered successfully');
} catch (e) {
  console.error('❌ Error registering GET /test-route:', e.message);
}

console.log('About to register POST /test-route');
try {
  app.post('/test-route', (req, res) => {
    console.log('🎯 POST TEST ROUTE HIT!');
    res.json({ msg: 'POST test route works' });
  });
  console.log('✅ POST /test-route registered successfully');
} catch (e) {
  console.error('❌ Error registering POST /test-route:', e.message);
}

// POST /api/chat
app.post('/api/chat', async (req, res) => {
  console.log('🎯🎯🎯 CHAT HANDLER CALLED 🎯🎯🎯');
  const { messages, tasks } = req.body;
  if (!Array.isArray(messages)) return res.status(400).json({ error: 'messages required' });
  try {
    const systemPrompt = `You are an AI assistant for PlanPilot, a Kanban task management app.\nTasks: ${tasks?.length || 0}`;
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    });
    res.json({ content: completion.choices[0].message.content });
  } catch (err) {
    console.error('❌ Chat error:', err.message);
    console.error('Error status:', err.status);
    console.error('Error response:', err.response?.data || err.error || 'no response data');
    res.status(500).json({
      error: 'AI failed',
      detail: err.message,
      status: err.status,
      type: err.type
    });
  }
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', (req, res) => {
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Task not found' });
  res.json({ success: true });
});

// START SERVER
const server = app.listen(PORT, () => {
  console.log(`✅ Smart Board API running at http://localhost:${PORT}`);
});

function gracefulShutdown(signal) {
  console.log(`\n${signal} received — shutting down...`);
  try {
    db.pragma('wal_checkpoint(TRUNCATE)');
    db.close();
  } catch (err) {
    console.error('Error closing database:', err.message);
  }
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 3000);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('exit', () => { try { db.close(); } catch (_) {} });
