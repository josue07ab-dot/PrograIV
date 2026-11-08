/* =========================================================
   TecnoAccesorios - Registro
   Responsable: Andrea Córdoba Sevilla
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const nameInput = document.getElementById("register-name");
  const passwordInput = document.getElementById("register-password");
  const confirmInput = document.getElementById("register-confirm");
  const counter = document.getElementById("password-counter");

  const PASSWORD_MIN = 15;
  const PASSWORD_MAX = 128;

  // Cada validador devuelve el mensaje de error o "" si el valor es correcto.
  const validateAll = attachValidators({
    "register-name": value => value.trim().length >= 2 ? "" : "Escribe tu nombre completo (mínimo 2 caracteres).",
    "register-email": value => {
      if (value.trim() === "") return "Escribe tu correo electrónico.";
      return isValidEmail(value) ? "" : "Revisa el formato del correo, por ejemplo nombre@correo.com.";
    },
    "register-password": value => {
      if (value.length === 0) return "Escribe una contraseña.";
      if (value.length < PASSWORD_MIN) return `Faltan ${PASSWORD_MIN - value.length} caracteres: la contraseña debe tener al menos ${PASSWORD_MIN}.`;
      return value.length <= PASSWORD_MAX ? "" : `La contraseña no puede superar ${PASSWORD_MAX} caracteres.`;
    },
    "register-confirm": value => {
      if (value.length === 0) return "Confirma tu contraseña.";
      return value === passwordInput.value ? "" : "Las contraseñas no coinciden.";
    }
  });

  // Contador visible mientras se escribe (no se anuncia en cada tecla para no saturar al lector de pantalla).
  passwordInput.addEventListener("input", () => {
    counter.textContent = `${passwordInput.value.length} / ${PASSWORD_MAX}`;
    // Si ya se escribió la confirmación, se revisa de nuevo al cambiar la contraseña.
    if (confirmInput.value !== "") confirmInput.dispatchEvent(new Event("blur"));
  });

  bindPasswordToggle(document.getElementById("show-passwords"), [passwordInput, confirmInput]);

  form.addEventListener("submit", event => {
    event.preventDefault();

    const firstInvalid = validateAll();
    if (firstInvalid) {
      const count = form.querySelectorAll(".is-invalid").length;
      showAlert("messages", "danger", count === 1
        ? "Hay 1 campo por corregir. Revisa el mensaje debajo del campo marcado."
        : `Hay ${count} campos por corregir. Revisa los mensajes debajo de cada campo marcado.`);
      firstInvalid.focus();
      return;
    }

    // No se guardan los datos ni la contraseña: solo se simula el resultado.
    form.reset();
    clearAllFieldErrors(form);
    counter.textContent = `0 / ${PASSWORD_MAX}`;
    passwordInput.type = "password";
    confirmInput.type = "password";
    showAlert("messages", "success", "¡Registro simulado correctamente! Ya puedes ir a Ingresar.");
    nameInput.focus();
  });
});
