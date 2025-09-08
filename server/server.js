'use strict';

/**
 * Simple HTTP API (without external deps) - Users CRUD + Auth
 * - Similar style to the provided app.js (manual routing with Node http)
 * - Adds persistence to server/data/users.json
 * - Adds simple token-based auth (HMAC) using Node's crypto (no JWT dependency)
 * - CORS enabled
 *
 * Start: node server/server.js
 * Endpoints:
 *   GET    /api/info
 *   GET    /api/health
 *   GET    /api/users
 *   GET    /api/users/:id
 *   POST   /api/users
 *   PUT    /api/users/:id
 *   PATCH  /api/users/:id
 *   DELETE /api/users/:id
 *   POST   /api/auth/register
 *   POST   /api/auth/login
 *   GET    /api/auth/me        (Authorization: Bearer <token>)
 */

const http   = require('http');
const url    = require('url');
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const SECRET = process.env.API_SECRET || 'dev-secret-change-me';

// ---------- Utils ----------
const USERS_DB = path.join(__dirname, 'data', 'users.json');

function ensureDB() {
  const dir = path.dirname(USERS_DB);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(USERS_DB)) fs.writeFileSync(USERS_DB, '[]', 'utf-8');
}
ensureDB();

function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_DB, 'utf-8');
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('DB read error:', e);
    return [];
  }
}

function writeUsers(list) {
  try {
    fs.writeFileSync(USERS_DB, JSON.stringify(list, null, 2), 'utf-8');
  } catch (e) {
    console.error('DB write error:', e);
  }
}

function nextId(list) {
  const maxId = list.reduce((m, u) => Math.max(m, u.id || 0), 0);
  return maxId + 1;
}

function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        const data = JSON.parse(body);
        resolve(data);
      } catch (e) {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  });
  res.end(JSON.stringify(payload));
}

function notFound(res, message = 'Endpoint no encontrado') {
  sendJSON(res, 404, { success: false, message });
}

function badRequest(res, message = 'Solicitud inválida', extra = {}) {
  sendJSON(res, 400, { success: false, message, ...extra });
}

function ok(res, data, message = 'OK') {
  sendJSON(res, 200, { success: true, data, message });
}

function created(res, data, message = 'Creado') {
  sendJSON(res, 201, { success: true, data, message });
}

function getIdFromPath(pathname) {
  const parts = pathname.split('/').filter(Boolean); // e.g. ["api", "users", "123"]
  return parts.length >= 3 ? parts[2] : null;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeUserForOutput(u) {
  const { passwordHash, salt, ...pub } = u;
  return pub;
}

function hashPassword(plain, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.createHmac('sha256', salt).update(plain).digest('hex');
  return { salt, passwordHash: hash };
}

function verifyPassword(plain, salt, passwordHash) {
  const hash = crypto.createHmac('sha256', salt).update(plain).digest('hex');
  return hash === passwordHash;
}

// Simple token (HMAC) generation & verification (no external deps)
function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/=+$/,'').replace(/\+/g,'-').replace(/\//g,'_');
}
function signToken(payloadObj) {
  const payload = JSON.stringify(payloadObj);
  const p64 = base64url(payload);
  const sig = crypto.createHmac('sha256', SECRET).update(p64).digest('hex');
  return `${p64}.${sig}`;
}
function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [p64, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', SECRET).update(p64).digest('hex');
  if (sig !== expected) return null;
  try {
    const json = Buffer.from(p64.replace(/-/g,'+').replace(/_/g,'/'), 'base64').toString('utf-8');
    const payload = JSON.parse(json);
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// ---------- HTTP Server ----------
const server = http.createServer(async (req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  const method = req.method.toUpperCase();

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    });
    return res.end();
  }

  // ROUTING
  try {
    // Info & health
    if (pathname === '/api/info' && method === 'GET') {
      return ok(res, {
        name: 'BiteBack Demo API',
        version: '1.0.0',
        description: 'API de ejemplo con CRUD de usuarios y autenticación simple',
        endpoints: {
          'GET /api/users': 'Listar usuarios (query: search, page, limit)',
          'GET /api/users/:id': 'Obtener usuario por ID',
          'POST /api/users': 'Crear usuario (name, email, age?, password?)',
          'PUT /api/users/:id': 'Reemplazar usuario',
          'PATCH /api/users/:id': 'Actualizar parcialmente usuario',
          'DELETE /api/users/:id': 'Eliminar usuario',
          'POST /api/auth/register': 'Registro (name, email, password, age?)',
          'POST /api/auth/login': 'Login (email, password)',
          'GET /api/auth/me': 'Datos del usuario autenticado (Bearer token)'
        }
      }, 'Información de la API');
    }
    if (pathname === '/api/health' && method === 'GET') {
      return ok(res, { status: 'ok', time: new Date().toISOString() }, 'Salud OK');
    }

    // Users collection
    if (pathname === '/api/users' && method === 'GET') {
      const list = readUsers();
      const search = (query.search || '').toString().trim().toLowerCase();
      let filtered = list;
      if (search) {
        filtered = list.filter(u =>
          (u.name || '').toLowerCase().includes(search) ||
          (u.email || '').toLowerCase().includes(search)
        );
      }
      const limit = Math.max(1, Math.min(100, parseInt(query.limit || '20', 10) || 20));
      const page  = Math.max(1, parseInt(query.page || '1', 10) || 1);
      const start = (page - 1) * limit;
      const end   = start + limit;
      const pageItems = filtered.slice(start, end).map(sanitizeUserForOutput);

      return ok(res, {
        items: pageItems,
        page,
        limit,
        total: filtered.length
      }, 'Usuarios listados');
    }

    if (/^\/api\/users\/\d+$/.test(pathname) && method === 'GET') {
      const id = parseInt(getIdFromPath(pathname), 10);
      const list = readUsers();
      const user = list.find(u => u.id === id);
      if (!user) return notFound(res, 'Usuario no encontrado');
      return ok(res, sanitizeUserForOutput(user), 'Usuario encontrado');
    }

    if (pathname === '/api/users' && method === 'POST') {
      const body = await parseJSONBody(req).catch(() => null);
      if (!body) return badRequest(res, 'JSON inválido');

      const { name, email, age, password } = body;
      const errors = [];
      if (!name || !name.trim()) errors.push('El nombre es requerido');
      if (!email || !validateEmail(email)) errors.push('Email inválido');
      if (age !== undefined && !(Number.isInteger(age) && age >= 0 && age <= 120)) errors.push('Edad inválida (0-120)');
      if (password !== undefined && (typeof password !== 'string' || password.length < 6)) errors.push('Contraseña inválida (>=6)');

      const list = readUsers();
      if (email && list.some(u => u.email.toLowerCase() === email.toLowerCase())) errors.push('El email ya está registrado');

      if (errors.length) return badRequest(res, 'Errores de validación', { errors });

      const newUser = {
        id: nextId(list),
        name: name.trim(),
        email: email.trim(),
        age: age !== undefined ? parseInt(age, 10) : undefined
      };

      if (password) {
        const { salt, passwordHash } = hashPassword(password);
        newUser.salt = salt;
        newUser.passwordHash = passwordHash;
      }

      list.push(newUser);
      writeUsers(list);
      return created(res, sanitizeUserForOutput(newUser), 'Usuario creado');
    }

    if (/^\/api\/users\/\d+$/.test(pathname) && method === 'PUT') {
      const id = parseInt(getIdFromPath(pathname), 10);
      const list = readUsers();
      const idx = list.findIndex(u => u.id === id);
      if (idx === -1) return notFound(res, 'Usuario no encontrado');

      const body = await parseJSONBody(req).catch(() => null);
      if (!body) return badRequest(res, 'JSON inválido');

      const { name, email, age, password } = body;
      const errors = [];
      if (!name || !name.trim()) errors.push('El nombre es requerido');
      if (!email || !validateEmail(email)) errors.push('Email inválido');
      if (age !== undefined && !(Number.isInteger(age) && age >= 0 && age <= 120)) errors.push('Edad inválida (0-120)');
      if (password !== undefined && (typeof password !== 'string' || password.length < 6)) errors.push('Contraseña inválida (>=6)');
      const listNoSelf = list.filter(u => u.id !== id);
      if (email && listNoSelf.some(u => u.email.toLowerCase() === email.toLowerCase())) errors.push('El email ya está registrado');
      if (errors.length) return badRequest(res, 'Errores de validación', { errors });

      const updated = {
        id,
        name: name.trim(),
        email: email.trim(),
        age: age !== undefined ? parseInt(age, 10) : undefined
      };
      if (password) {
        const { salt, passwordHash } = hashPassword(password);
        updated.salt = salt;
        updated.passwordHash = passwordHash;
      } else {
        // preserve old hash if any
        updated.salt = list[idx].salt;
        updated.passwordHash = list[idx].passwordHash;
      }

      list[idx] = updated;
      writeUsers(list);
      return ok(res, sanitizeUserForOutput(updated), 'Usuario actualizado');
    }

    if (/^\/api\/users\/\d+$/.test(pathname) && method === 'PATCH') {
      const id = parseInt(getIdFromPath(pathname), 10);
      const list = readUsers();
      const idx = list.findIndex(u => u.id === id);
      if (idx === -1) return notFound(res, 'Usuario no encontrado');

      const body = await parseJSONBody(req).catch(() => null);
      if (!body) return badRequest(res, 'JSON inválido');

      const { name, email, age, password } = body;
      const errors = [];
      if (email !== undefined && !validateEmail(email)) errors.push('Email inválido');
      if (age !== undefined && !(Number.isInteger(age) && age >= 0 && age <= 120)) errors.push('Edad inválida (0-120)');
      if (password !== undefined && (typeof password !== 'string' || password.length < 6)) errors.push('Contraseña inválida (>=6)');
      const listNoSelf = list.filter(u => u.id !== id);
      if (email !== undefined && listNoSelf.some(u => u.email.toLowerCase() === email.toLowerCase())) errors.push('El email ya está registrado');
      if (errors.length) return badRequest(res, 'Errores de validación', { errors });

      const prev = list[idx];
      const updated = { ...prev };
      if (name !== undefined)  updated.name  = name.trim();
      if (email !== undefined) updated.email = email.trim();
      if (age !== undefined)   updated.age   = parseInt(age, 10);
      if (password !== undefined) {
        const { salt, passwordHash } = hashPassword(password);
        updated.salt = salt;
        updated.passwordHash = passwordHash;
      }

      list[idx] = updated;
      writeUsers(list);
      return ok(res, sanitizeUserForOutput(updated), 'Usuario actualizado');
    }

    if (/^\/api\/users\/\d+$/.test(pathname) && method === 'DELETE') {
      const id = parseInt(getIdFromPath(pathname), 10);
      const list = readUsers();
      const idx = list.findIndex(u => u.id === id);
      if (idx === -1) return notFound(res, 'Usuario no encontrado');
      const deleted = list.splice(idx, 1)[0];
      writeUsers(list);
      return ok(res, sanitizeUserForOutput(deleted), 'Usuario eliminado');
    }

    // --- AUTH ---
    if (pathname === '/api/auth/register' && method === 'POST') {
      const body = await parseJSONBody(req).catch(() => null);
      if (!body) return badRequest(res, 'JSON inválido');
      const { name, email, password, age } = body;
      const errors = [];
      if (!name || !name.trim()) errors.push('El nombre es requerido');
      if (!email || !validateEmail(email)) errors.push('Email inválido');
      if (!password || typeof password !== 'string' || password.length < 6) errors.push('Contraseña inválida (>=6)');
      if (age !== undefined && !(Number.isInteger(age) && age >= 0 && age <= 120)) errors.push('Edad inválida (0-120)');

      const list = readUsers();
      if (email && list.some(u => u.email.toLowerCase() === email.toLowerCase())) errors.push('El email ya está registrado');
      if (errors.length) return badRequest(res, 'Errores de validación', { errors });

      const { salt, passwordHash } = hashPassword(password);
      const user = {
        id: nextId(list),
        name: name.trim(),
        email: email.trim(),
        age: age !== undefined ? parseInt(age, 10) : undefined,
        salt,
        passwordHash
      };
      list.push(user);
      writeUsers(list);

      const token = signToken({ sub: user.id, exp: Date.now() + (1000 * 60 * 60 * 24 * 7) }); // 7 days
      return created(res, { token, user: sanitizeUserForOutput(user) }, 'Registro exitoso');
    }

    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseJSONBody(req).catch(() => null);
      if (!body) return badRequest(res, 'JSON inválido');
      const { email, password } = body;
      if (!email || !validateEmail(email) || !password) return badRequest(res, 'Credenciales inválidas');

      const list = readUsers();
      const user = list.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user || !user.passwordHash || !user.salt) {
        return badRequest(res, 'Usuario o contraseña incorrectos');
      }
      const okPass = verifyPassword(password, user.salt, user.passwordHash);
      if (!okPass) return badRequest(res, 'Usuario o contraseña incorrectos');

      const token = signToken({ sub: user.id, exp: Date.now() + (1000 * 60 * 60 * 24 * 7) });
      return ok(res, { token, user: sanitizeUserForOutput(user) }, 'Login exitoso');
    }

    if (pathname === '/api/auth/me' && method === 'GET') {
      const auth = req.headers['authorization'] || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      const payload = verifyToken(token);
      if (!payload || !payload.sub) return badRequest(res, 'Token inválido o expirado');

      const list = readUsers();
      const user = list.find(u => u.id === payload.sub);
      if (!user) return notFound(res, 'Usuario no encontrado');
      return ok(res, sanitizeUserForOutput(user), 'Yo');
    }

    // Default 404
    return notFound(res);

  } catch (err) {
    console.error('Unexpected error:', err);
    return sendJSON(res, 500, { success: false, message: 'Error interno del servidor' });
  }
});

server.listen(PORT, () => {
  console.log(`BiteBack API corriendo en http://localhost:${PORT}`);
  console.log(`Info: http://localhost:${PORT}/api/info`);
});

module.exports = server;
