/* =========================================================
   TecnoAccesorios - Contacto
   Responsable: Josué Abarca Barahona
   ========================================================= */

 const iconos = {
  exito: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/></svg>`
};

const iconoCerrar = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg>`;

const contenedorToast = document.getElementById("messages");
const form = document.getElementById("contact-form");

function mostrarToast(tipo, titulo, descripcion) {
  const toast = document.createElement("div");
  toast.className = `toast show ${tipo}`;
  toast.innerHTML = `
    <div class="contenido">
      <div class="icono">${iconos[tipo]}</div>
      <div class="texto">
        <p class="titulo">${titulo}</p>
        <p class="descripcion">${descripcion}</p>
      </div>
    </div>
    <button type="button" class="btn-cerrar" aria-label="Cerrar">
      <div class="icono">${iconoCerrar}</div>
    </button>
  `;
  contenedorToast.appendChild(toast);

  const cerrar = () => {
    toast.classList.add("cerrando");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
    setTimeout(() => toast.remove(), 500);
  };

  toast.querySelector(".btn-cerrar").addEventListener("click", cerrar);
  setTimeout(cerrar, 4000);
}

function validarFormulario() {
  const reglas = [
    { id: "name",    valido: v => v.trim().length >= 3 },
    { id: "email",   valido: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
    { id: "subject", valido: v => v.trim().length > 0 },
    { id: "message", valido: v => v.trim().length > 0 }
  ];

  let todoValido = true;

  reglas.forEach(({ id, valido }) => {
    const campo = document.getElementById(id);
    const ok = valido(campo.value);
    campo.classList.toggle("is-invalid", !ok);  // muestra/oculta .invalid-feedback
    if (!ok) todoValido = false;
  });

  return todoValido;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validarFormulario()) {
    mostrarToast("error", "Error!", "Revisa los campos marcados en rojo");
    return;
  }

  mostrarToast("exito", "Éxito!", "Tu mensaje fue enviado correctamente");
  form.reset();
});

// quita el rojo en cuanto el usuario corrige el campo
form.querySelectorAll("input, textarea").forEach(campo => {
  campo.addEventListener("input", () => campo.classList.remove("is-invalid"));
});

