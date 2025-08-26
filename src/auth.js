// auth.js — BiteBack (mejorado)

// ===== Helpers de DOM y rutas =====
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const pageName = () => (location.pathname.split("/").pop() || "index.html").toLowerCase();
const go = (url) => (location.href = url);

// ===== Persistencia coherente =====
const STORAGE_KEY = "usuarioActual";

const getUser = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch { return null; }
};
const setUser = (u) => localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
const clearUser = () => localStorage.removeItem(STORAGE_KEY);

const isLoggedIn = () => {
    const u = getUser();
    return !!(u && u.sesionIniciada);
};

// ===== Guardas de navegación =====
// Páginas que NO requieren sesión: login, registro, index (el resto sí)
const PUBLIC_PAGES = new Set(["login.html", "registro.html", "index.html", ""]);

// Redirige si intenta ver página privada sin sesión
const protectRoute = () => {
    const p = pageName();
    if (!PUBLIC_PAGES.has(p) && !isLoggedIn()) {
        go("login.html");
    }
};

// Si ya está logueado, evita mostrar login/registro
const avoidAuthWhenLogged = () => {
    const p = pageName();
    if (isLoggedIn() && (p === "login.html" || p === "registro.html")) {
        go("perfil.html");
    }
};

// ===== UI pequeñas =====
const setGreeting = () => {
    const u = getUser();
    const saludo = $("#saludoUsuario");
    if (saludo && u) saludo.textContent = `Hola, ${u.nombre}`;
};

// ===== Registro =====
const mountRegister = () => {
    const form = $("#registroForm") || $("#formRegistro"); // soporta tus dos ids
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Soporta name o id en minúsculas/mayúsculas
        const nombre = (form.nombre?.value ?? $("#Nombre")?.value ?? "").trim();
        const email = (form.correo?.value ?? $("#Correo")?.value ?? "").trim();
        const pass = (form.password?.value ?? $("#password")?.value ?? "");
        const conf = (form.confirmar?.value ?? $("#Confirmar")?.value ?? "");

        // Tipo de usuario: radios (mejor) o select (fallback)
        const radioRol = $('input[name="tipoUsuario"]:checked');
        const selectRol = $("#tipoUsuario");
        const tipo = radioRol ? radioRol.value : (selectRol ? selectRol.value : "");

        // Validaciones
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!nombre || !email || !pass) return alert("Todos los campos son obligatorios.");
        if (!emailRegex.test(email)) return alert("Correo electrónico no válido.");
        if (pass.length < 6) return alert("La contraseña debe tener al menos 6 caracteres.");
        if (pass !== conf) return alert("Las contraseñas no coinciden.");
        if (!tipo) return alert("Selecciona tu tipo de usuario.");

        // Extras si es negocio (si existen los campos)
        const nombreComercial = $("#nombreComercial")?.value?.trim() || "";
        const nit = $("#nit")?.value?.trim() || "";

        const usuario = {
            nombre,
            email,
            password: pass,             // Nota: cifrar en backend real
            tipo,
            nombreComercial,
            nit,
            sesionIniciada: false,
            creadoEn: new Date().toISOString(),
        };

        setUser(usuario);
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        go("login.html");
    });

    // Mostrar/ocultar extras según rol (si existen)
    const extraFields = $("#extraFields");
    if (extraFields) {
        const onChangeRol = () => {
            const val = $('input[name="tipoUsuario"]:checked')?.value || $("#tipoUsuario")?.value || "";
            const negocio = val === "restaurante" || val === "supermercado";
            extraFields.hidden = !negocio;
        };
        document.querySelectorAll('input[name="tipoUsuario"]').forEach(r => r.addEventListener("change", onChangeRol));
        $("#tipoUsuario")?.addEventListener("change", onChangeRol);
        onChangeRol();
    }
};

// ===== Login =====
const mountLogin = () => {
    const form = $("#loginForm") || $("#formLogin");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = (form.email?.value ?? $("#Correo")?.value ?? $("#correoLogin")?.value ?? "").trim();
        const pass = (form.password?.value ?? $("#password")?.value ?? $("#passwordLogin")?.value ?? "");

        const u = getUser();
        if (u && u.email === email && u.password === pass) {
            u.sesionIniciada = true;
            setUser(u);
            alert("Inicio de sesión exitoso.");
            go("perfil.html"); // o panel_cliente.html si ya lo tienes
        } else {
            alert("Credenciales incorrectas.");
        }
    });

    // Mostrar/ocultar contraseña si tienes botón 👁️
    const toggle = $("#togglePass") || $("#togglePassLogin");
    const passEl = $("#password") || $("#passwordLogin");
    toggle?.addEventListener("click", () => {
        if (!passEl) return;
        passEl.type = passEl.type === "password" ? "text" : "password";
        toggle.textContent = passEl.type === "password" ? "👁️" : "🙈";
    });
};

// ===== Perfil =====
const mountProfile = () => {
    const nombreEl = $("#nombrePerfil");
    const correoEl = $("#correoPerfil");
    const tipoEl = $("#tipoPerfil");
    if (!nombreEl && !correoEl && !tipoEl) return;

    const u = getUser();
    if (!u || !u.sesionIniciada) return go("login.html");

    nombreEl && (nombreEl.textContent = u.nombre);
    correoEl && (correoEl.textContent = u.email);
    tipoEl && (tipoEl.textContent = u.tipo);

    $("#cerrarSesion")?.addEventListener("click", () => {
        const cur = getUser();
        if (cur) { cur.sesionIniciada = false; setUser(cur); }
        // o clearUser() si quieres limpiar todo
        alert("Has cerrado sesión.");
        go("login.html");
    });
};

// ===== Bootstrap =====
document.addEventListener("DOMContentLoaded", () => {
    protectRoute();          // bloquea privadas si no hay sesión
    avoidAuthWhenLogged();   // evita mostrar login/registro si ya hay sesión
    setGreeting();           // "Hola, <nombre>" si hay span#saludoUsuario

    // Monta handlers específicos
    mountRegister();
    mountLogin();
    mountProfile();
});

// ===== Función pública por si necesitas llamar desde HTML =====
function cerrarSesion() {
    const u = getUser();
    if (u) { u.sesionIniciada = false; setUser(u); }
    alert("Has cerrado sesión.");
    go("login.html");
}
window.cerrarSesion = cerrarSesion;
