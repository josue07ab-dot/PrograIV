/* =========================================================
   TecnoAccesorios - Ingresar
   Responsable: Andrea Córdoba Sevilla
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");

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
      return isValidEmail(value) ? "" : "Revisa el formato del correo, por ejemplo nombre@correo.com.";
    },
    "login-password": value => value === "" ? "Escribe tu contraseña." : ""
  });

  bindPasswordToggle(document.getElementById("show-password"), [document.getElementById("login-password")]);

  form.addEventListener("submit", event => {
    event.preventDefault();

    // Campos vacíos o con formato inválido: se dice qué falta (no es un error de credenciales).
    const firstInvalid = validateAll();
    if (firstInvalid) {
      showAlert("messages", "danger", "Completa tu correo y tu contraseña para ingresar.");
      firstInvalid.focus();
      return;
    }

    // En esta entrega no existe autenticación real; no se almacena la contraseña.
    // En el Avance 2 el servidor comparará las credenciales y, si fallan, mostrará
    // siempre el mismo mensaje genérico: "Correo o contraseña incorrectos."
    setDemoRole("customer");
    window.location.href = "account.html";
  });
});
