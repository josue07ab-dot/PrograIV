/* =========================================================
   TecnoAccesorios - Registro
   Responsable: Andrea Córdoba Sevilla
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const emailInput = document.getElementById("register-email");
  const passwordInput = document.getElementById("register-password");
  const confirmInput = document.getElementById("register-confirm");

  // Comprueba el correo y que ambas contraseñas cumplan las reglas.
  form.addEventListener("submit", event => {
    event.preventDefault();
    form.classList.add("was-validated");

    const emailValid = emailInput.validity.valid;
    const passwordLengthValid = passwordInput.value.length >= 15 && passwordInput.value.length <= 128;
    const passwordsMatch = passwordInput.value === confirmInput.value;

    confirmInput.setCustomValidity(passwordsMatch ? "" : "Las contraseñas no coinciden.");
    passwordInput.setCustomValidity(passwordLengthValid ? "" : "Longitud de contraseña no válida.");

    if (!emailValid) {
      showAlert("messages", "danger", "Correo inválido. Revisa el formato, por ejemplo nombre@correo.com.");
      emailInput.focus();
      return;
    }
    if (!passwordLengthValid) {
      showAlert("messages", "danger", "La contraseña debe tener entre 15 y 128 caracteres.");
      passwordInput.focus();
      return;
    }
    if (!passwordsMatch) {
      showAlert("messages", "danger", "Las contraseñas no coinciden. Vuelve a escribir la confirmación.");
      confirmInput.focus();
      return;
    }
    if (!form.checkValidity()) {
      showAlert("messages", "danger", "Completa todos los campos obligatorios.");
      form.querySelector(":invalid")?.focus();
      return;
    }

    // No se guardan los datos ni la contraseña: solo se simula el resultado.
    form.reset();
    form.classList.remove("was-validated");
    passwordInput.setCustomValidity("");
    confirmInput.setCustomValidity("");
    showAlert("messages", "success", "¡Registro simulado correctamente! Ya puedes ir a Ingresar.");
  });

  passwordInput.addEventListener("input", () => passwordInput.setCustomValidity(""));
  confirmInput.addEventListener("input", () => confirmInput.setCustomValidity(""));
});