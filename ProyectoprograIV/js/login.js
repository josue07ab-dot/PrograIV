/* =========================================================
   TecnoAccesorios - Ingresar
   Responsable: Andrea Córdoba Sevilla
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");

  form.addEventListener("submit", event => {
    event.preventDefault();
    form.classList.add("was-validated");

    if (!form.checkValidity()) {
      showAlert("messages", "danger", "Correo o contraseña incorrectos.");
      form.querySelector(":invalid")?.focus();
      return;
    }

    // En esta entrega no existe autenticación real; no se almacena la contraseña.
    const email = emailInput.value.trim();
    if (!emailInput.validity.valid || passwordInput.value.trim() === "") {
      showAlert("messages", "danger", "Correo o contraseña incorrectos.");
      return;
    }

    setDemoRole("customer");
    window.location.href = "account.html";
  });
});