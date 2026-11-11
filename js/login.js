/* =========================================================
   TecnoAccesorios - Ingresar
   Responsable: Andrea Córdoba Sevilla
   ========================================================= */

/*
  Cuentas de demostración.
  Regla 7 del README: no se guardan contraseñas en el código. Por eso aquí solo hay el
  resumen SHA-256 de "correo|contraseña", nunca la contraseña. Al ingresar se calcula el
  mismo resumen con lo que escribe la persona y se comparan.
  En el Avance 2 esto lo reemplaza el servidor (Flask) con contraseñas con hash y sal.
*/
const DEMO_ACCOUNTS = {
  "cliente@tecnoaccesorios.cr": { role: "customer", hash: "02847591894a6b0cee32f8905587dbec2997f02a24c674818e29adcea60f3923", destination: "account.html" },
  "admin@tecnoaccesorios.cr": { role: "admin", hash: "e1905435e26bc99d13a8039564d474c49f6a4b768565b3835caa5ce213881694", destination: "admin.html" }
};

// Mismo mensaje para "el correo no existe" y "la contraseña no coincide":
// así no se revela qué cuentas existen.
const LOGIN_ERROR_MESSAGE = "Correo o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.";

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, "0")).join("");
}

// Devuelve la cuenta si los datos corresponden a una; si no, null.
async function checkCredentials(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const attempt = await sha256Hex(`${normalizedEmail}|${password}`);
  const account = DEMO_ACCOUNTS[normalizedEmail];
  return account && account.hash === attempt ? account : null;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");

  // Si ya hay una vista de cliente o administrador activa, se avisa en vez de pedir los datos otra vez.
  const currentRole = getDemoRole();
  if (currentRole !== "visitor") {
    const destination = currentRole === "admin" ? "admin.html" : "account.html";
    const label = currentRole === "admin" ? "el panel administrativo" : "tu cuenta";
    document.getElementById("messages").innerHTML = `
      <div class="alert alert-info" role="status">
        <span aria-hidden="true" class="me-1">ℹ</span>Ya hay una sesión de demostración activa.
        <a href="${destination}" class="alert-link">Ir a ${label}</a>
      </div>`;
  }

  const validateAll = attachValidators({
    "login-email": value => {
      if (value.trim() === "") return "Escribe tu correo electrónico.";
      return isValidEmail(value) ? "" : "Correo inválido: revisa el formato, por ejemplo nombre@correo.com.";
    },
    "login-password": value => value === "" ? "Escribe tu contraseña." : ""
  });

  bindPasswordToggle(document.getElementById("show-password"), [passwordInput]);

  form.addEventListener("submit", async event => {
    event.preventDefault();

    // 1) Campos vacíos o con formato inválido: se dice qué falta (todavía no es un error de credenciales).
    const firstInvalid = validateAll();
    if (firstInvalid) {
      showAlert("messages", "danger", "Completa tu correo y tu contraseña para ingresar.");
      firstInvalid.focus();
      return;
    }

    // 2) Se comprueba si los datos corresponden a una cuenta.
    if (!(window.crypto && window.crypto.subtle)) {
      showAlert("messages", "danger", "Este navegador no permite verificar la contraseña. Abre la página con un navegador actualizado o desde la dirección publicada (https).");
      return;
    }

    const account = await checkCredentials(emailInput.value, passwordInput.value);

    if (!account) {
      // Acceso incorrecto: mensaje genérico, se borra la contraseña y se deja el correo para reintentar.
      showAlert("messages", "danger", LOGIN_ERROR_MESSAGE);
      passwordInput.value = "";
      passwordInput.focus();
      return;
    }

    try { sessionStorage.removeItem("ta_demo_name"); } catch (e) { /* se ignora */ }
    setDemoRole(account.role);
    window.location.href = account.destination;
  });
});
