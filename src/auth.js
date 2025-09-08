// auth.js — BiteBack (API-integrado)
// Mantiene la UX existente, pero ahora consume la API local (ver server/server.js).
// Fallback: si la API no responde, recurre a localStorage como antes.

const API_BASE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'http://localhost:3000'
  : '';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const pageName = () => (location.pathname.split('/').pop() || 'index.html').toLowerCase();
const go = (url) => (location.href = url);

// Persistencia en localStorage (fallback/estado de sesión)
const STORAGE_KEY = 'usuarioActual';
const getUser = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; } catch { return null; } };
const setUser = (u) => localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
const clearUser = () => localStorage.removeItem(STORAGE_KEY);
const isLoggedIn = () => !!(getUser()?.token);

// --------- Cliente API ---------
async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || `Error HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// --------- UI pequeñas ---------
function updateHeaderLinks() {
  // Muestra/oculta enlaces según sesión
  const login = $('#loginLink');
  const reg = $('#registroLink');
  const perfil = $('#perfilLink');
  const has = isLoggedIn();
  if (login)  login.style.display = has ? 'none' : '';
  if (reg)    reg.style.display = has ? 'none' : '';
  if (perfil) perfil.style.display = has ? '' : 'none';
}
function setGreeting() {
  const u = getUser();
  const saludo = $('#saludoUsuario');
  if (saludo && u?.user?.name) saludo.textContent = `Hola, ${u.user.name}`;
}

// --------- Registro ---------
function mountRegister() {
  const form = $('#registroForm') || $('#formRegistro');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = (form.nombre?.value ?? $('#Nombre')?.value ?? '').trim();
    const email  = (form.correo?.value ?? $('#Correo')?.value ?? '').trim();
    const pass   = (form.password?.value ?? $('#password')?.value ?? '');
    const conf   = (form.confirmar?.value ?? $('#Confirmar')?.value ?? '');
    const tipo   = (document.querySelector('input[name="tipoUsuario"]:checked')?.value
                    ?? $('#tipoUsuario')?.value ?? '');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!nombre || !email || !pass) return alert('Todos los campos son obligatorios.');
    if (!emailRegex.test(email)) return alert('Correo electrónico no válido.');
    if (pass.length < 6) return alert('La contraseña debe tener al menos 6 caracteres.');
    if (pass !== conf) return alert('Las contraseñas no coinciden.');
    if (!tipo) return alert('Selecciona tu tipo de usuario.');

    try {
      const resp = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: { name: nombre, email, password: pass }
      });
      // Guardamos token+user para la sesión
      setUser({ token: resp.data.token, user: resp.data.user, tipo });
      alert('Registro exitoso.');
      go('login.html'); // o redirigir directo a perfil
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error registrando usuario');
    }
  });
}

// --------- Login ---------
function mountLogin() {
  const form = $('#loginForm') || $('#formLogin');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (form.email?.value ?? $('#Correo')?.value ?? $('#correoLogin')?.value ?? '').trim();
    const pass = (form.password?.value ?? $('#password')?.value ?? $('#passwordLogin')?.value ?? '');

    try {
      const resp = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: { email, password: pass }
      });
      setUser({ token: resp.data.token, user: resp.data.user });
      alert('Inicio de sesión exitoso.');
      go('perfil.html');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Credenciales incorrectas');
    }
  });
}

// --------- Perfil ---------
function mountProfile() {
  const nameEl = $('#nombrePerfil');
  const mailEl = $('#correoPerfil');
  const tipoEl = $('#tipoPerfil');
  const btnOut = $('#cerrarSesion');
  if (!nameEl && !mailEl && !btnOut) return;

  const ses = getUser();
  if (!ses?.token) {
    alert('Debes iniciar sesión.');
    return go('login.html');
  }

  apiFetch('/api/auth/me', { token: ses.token })
    .then(resp => {
      const u = resp.data || ses.user;
      if (nameEl) nameEl.textContent = u.name || '';
      if (mailEl) mailEl.textContent = u.email || '';
      if (tipoEl && ses.tipo) tipoEl.textContent = ses.tipo;
    })
    .catch(() => {
      // Si falla el endpoint, usa la copia local
      const u = ses.user || {};
      if (nameEl) nameEl.textContent = u.name || '';
      if (mailEl) mailEl.textContent = u.email || '';
      if (tipoEl && ses.tipo) tipoEl.textContent = ses.tipo;
    });

  if (btnOut) {
    btnOut.addEventListener('click', () => {
      clearUser();
      alert('Has cerrado sesión.');
      go('login.html');
    });
  }
}

// --------- Guards & Boot ---------
const PUBLIC_PAGES = new Set(['login.html', 'registro.html', 'index.html', '']);

function protectRoute() {
  const p = pageName();
  if (!PUBLIC_PAGES.has(p) && !isLoggedIn()) {
    return go('login.html');
  }
}

function avoidAuthWhenLogged() {
  const p = pageName();
  if (isLoggedIn() && (p === 'login.html' || p === 'registro.html')) {
    return go('perfil.html');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  protectRoute();
  avoidAuthWhenLogged();
  updateHeaderLinks();
  setGreeting();
  mountRegister();
  mountLogin();
  mountProfile();
});

// Utilidad global opcional
window.cerrarSesion = function cerrarSesion() {
  clearUser();
  alert('Has cerrado sesión.');
  go('login.html');
};
