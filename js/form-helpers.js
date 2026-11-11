/* =========================================================
   TecnoAccesorios - Ayudas para formularios y acceso por rol
   Se carga DESPUÉS de common.js y layout.js.
   La usan register, login, account y admin.
   Responsable: Andrea Córdoba Sevilla
   ========================================================= */

/* ---------- Correo ---------- */

// Exige algo@dominio.ext (el type="email" del navegador acepta "a@b" sin punto)
function isValidEmail(value) {
  const email = String(value).trim();
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/* ---------- Errores por campo ---------- */

// Agrega o quita un id dentro de aria-describedby sin borrar los demás
function toggleDescribedBy(input, id, add) {
  const ids = (input.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
  const next = add ? [...new Set([...ids, id])] : ids.filter(item => item !== id);
  if (next.length) input.setAttribute("aria-describedby", next.join(" "));
  else input.removeAttribute("aria-describedby");
}

// Muestra el mensaje debajo del campo y lo enlaza para lectores de pantalla
function setFieldError(input, message) {
  const feedback = input.closest(".mb-3, [class*='col-']")?.querySelector(".invalid-feedback");
  input.classList.add("is-invalid");
  input.setAttribute("aria-invalid", "true");
  if (!feedback) return;
  feedback.textContent = message;
  feedback.id = feedback.id || `${input.id}-error`;
  toggleDescribedBy(input, feedback.id, true);
}

function clearFieldError(input) {
  input.classList.remove("is-invalid");
  input.removeAttribute("aria-invalid");
  const feedback = input.closest(".mb-3, [class*='col-']")?.querySelector(".invalid-feedback");
  if (feedback && feedback.id) toggleDescribedBy(input, feedback.id, false);
}

/*
  Conecta validadores a los campos.
  validators = { inputId: valor => "mensaje de error" o "" }
  - Valida al salir del campo (blur).
  - Si el campo ya tenía error, revalida mientras se escribe.
  Devuelve validateAll(): marca todos los campos y retorna el primero inválido (o null).
*/
function attachValidators(validators) {
  const entries = Object.entries(validators).map(([id, check]) => [document.getElementById(id), check]);

  function validate(input, check) {
    const message = check(input.value);
    if (message) setFieldError(input, message);
    else clearFieldError(input);
    return message;
  }

  entries.forEach(([input, check]) => {
    input.addEventListener("blur", () => validate(input, check));
    input.addEventListener("input", () => {
      if (input.classList.contains("is-invalid")) validate(input, check);
    });
  });

  return function validateAll() {
    let firstInvalid = null;
    entries.forEach(([input, check]) => {
      if (validate(input, check) && !firstInvalid) firstInvalid = input;
    });
    return firstInvalid;
  };
}

function clearAllFieldErrors(form) {
  form.querySelectorAll(".is-invalid").forEach(clearFieldError);
}

/* ---------- Mostrar / ocultar contraseña ---------- */

function bindPasswordToggle(checkbox, inputs) {
  checkbox.addEventListener("change", () => {
    inputs.forEach(input => { input.type = checkbox.checked ? "text" : "password"; });
  });
}

/* ---------- Acceso por rol de demostración ----------
   Es solo visual: oculta el contenido y explica qué hacer.
   La protección real llega con las sesiones de Flask (Avance 2).
   messages = { visitor: {text, href, linkText}, customer: {...}, admin: {...} } */
function requireDemoRole(requiredRole, contentId, noticeId, messages) {
  const role = getDemoRole();
  if (role === requiredRole) return true;

  const content = document.getElementById(contentId);
  const notice = document.getElementById(noticeId);
  const info = messages[role];
  if (content) content.hidden = true;
  if (notice && info) {
    notice.innerHTML = `
      <div class="account-panel access-notice" role="status">
        <h2 class="h5">${escapeHTML(info.title)}</h2>
        <p class="mb-3">${escapeHTML(info.text)}</p>
        ${info.href ? `<a class="btn btn-main" href="${info.href}">${escapeHTML(info.linkText)}</a>` : ""}
      </div>`;
  }
  return false;
}
