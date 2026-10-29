/* =========================================================
   TecnoAccesorios - Finalizar compra (simulada)
   ---------------------------------------------------------
   Requisitos del Avance 1 que cubre esta página:
   - Formulario con nombre, correo, teléfono y dirección.
   - Validación de obligatorios y formato de correo, con
     mensajes claros (texto + ícono, no solo color).
   - Resumen del pedido calculado desde PRODUCTS.
   - Confirmación explícita (casilla + modal) antes de comprar.
   - No permite comprar con el carrito vacío.
   - No dice que se guardó en un servidor (Avance 1).
   Responsable: Limberth Arce Orúe
   ========================================================= */

// Reglas de validación de cada campo (iguales a las del servidor en el Avance 2)
const CHECKOUT_RULES = {
  name: value => {
    if (value === "") return "Ingresá tu nombre completo.";
    if (value.length < 3) return "El nombre debe tener al menos 3 caracteres.";
    if (value.length > 80) return "El nombre no puede superar 80 caracteres.";
    return "";
  },
  email: value => {
    if (value === "") return "Ingresá tu correo electrónico.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "El correo no tiene un formato válido (ejemplo: nombre@correo.com).";
    if (value.length > 120) return "El correo no puede superar 120 caracteres.";
    return "";
  },
  phone: value => {
    if (value === "") return "Ingresá un número de teléfono.";
    if (!/^\d{4}-?\d{4}$/.test(value)) return "El teléfono debe tener 8 dígitos (ejemplo: 8888-8888).";
    return "";
  },
  address: value => {
    if (value === "") return "Ingresá la dirección de entrega.";
    if (value.length < 10) return "La dirección es muy corta; agregá provincia, cantón y señas.";
    if (value.length > 200) return "La dirección no puede superar 200 caracteres.";
    return "";
  }
};

const FIELD_LABELS = { name: "Nombre", email: "Correo", phone: "Teléfono", address: "Dirección" };

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");
  const confirmModal = new bootstrap.Modal(document.getElementById("confirm-modal"));
  let orderPlaced = false;   // evita confirmar dos veces

  // ---------- Mostrar formulario o estado vacío ----------
  function renderPage() {
    const lines = getCartLines();
    const isEmpty = lines.length === 0;
    document.getElementById("empty-checkout").classList.toggle("d-none", !isEmpty);
    document.getElementById("checkout-content").classList.toggle("d-none", isEmpty);
    if (isEmpty) return;

    // Resumen: precios siempre desde PRODUCTS, nunca desde el formulario
    document.getElementById("summary-lines").innerHTML = lines.map(line => `
      <li class="d-flex justify-content-between gap-3 mb-2">
        <span>${escapeHTML(line.product.name)} <span class="text-body-secondary">× ${line.quantity}</span></span>
        <span class="text-nowrap">${formatColones(line.subtotal)}</span>
      </li>`).join("");
    document.getElementById("summary-total").textContent = formatColones(getCartTotal());
  }

  // ---------- Validar un campo y mostrar su mensaje ----------
  function validateField(fieldName) {
    const input = form.elements[fieldName];
    const message = CHECKOUT_RULES[fieldName](input.value.trim());
    setFieldError(input, message);
    return message;
  }

  function setFieldError(input, message) {
    const errorBox = document.getElementById(`${input.id}-error`);
    input.classList.toggle("is-invalid", message !== "");
    if (message) {
      input.setAttribute("aria-invalid", "true");
      errorBox.textContent = "✖ " + message;
    } else {
      input.removeAttribute("aria-invalid");
      errorBox.textContent = "";
    }
  }

  // Validar al salir de cada campo, y si ya tenía error, revalidar
  // mientras escribe para que el mensaje desaparezca al corregirlo
  Object.keys(CHECKOUT_RULES).forEach(fieldName => {
    const input = form.elements[fieldName];
    input.addEventListener("blur", () => validateField(fieldName));
    input.addEventListener("input", () => {
      if (input.classList.contains("is-invalid")) validateField(fieldName);
    });
  });

  // ---------- Enviar: validar todo y abrir el modal ----------
  form.addEventListener("submit", ev => {
    ev.preventDefault();

    if (getCartLines().length === 0) {
      renderPage();
      showAlert("messages", "warning", "Tu carrito está vacío; no se puede finalizar la compra.");
      return;
    }

    const errors = [];
    Object.keys(CHECKOUT_RULES).forEach(fieldName => {
      const message = validateField(fieldName);
      if (message) errors.push({ fieldName, message });
    });

    const accept = form.elements.accept;
    if (!accept.checked) {
      setFieldError(accept, "Debés marcar la casilla para confirmar que es una compra simulada.");
      errors.push({ fieldName: "accept", message: "Falta aceptar que la compra es simulada." });
    } else {
      setFieldError(accept, "");
    }

    if (errors.length > 0) {
      showAlert("messages", "danger",
        `El formulario está incompleto: hay ${errors.length} campo(s) por corregir. Revisá los mensajes en rojo.`);
      form.elements[errors[0].fieldName].focus();   // lleva al primer error
      return;
    }

    document.getElementById("messages").innerHTML = "";
    fillConfirmModal();
    confirmModal.show();
  });

  // Desmarcar el error de la casilla al marcarla
  form.elements.accept.addEventListener("change", ev => {
    if (ev.target.checked) setFieldError(ev.target, "");
  });

  // ---------- Contenido del modal ----------
  function fillConfirmModal() {
    document.getElementById("confirm-data").innerHTML = Object.keys(FIELD_LABELS).map(fieldName => `
      <dt class="col-4">${FIELD_LABELS[fieldName]}</dt>
      <dd class="col-8">${escapeHTML(form.elements[fieldName].value.trim())}</dd>`).join("");
    document.getElementById("confirm-total").textContent = formatColones(getCartTotal());
  }

  // ---------- Confirmar la compra simulada ----------
  document.getElementById("btn-confirm-order").addEventListener("click", ev => {
    if (orderPlaced) return;
    orderPlaced = true;
    ev.currentTarget.disabled = true;   // evita doble clic

    const items = countCartItems();
    const total = getCartTotal();
    const orderNumber = createOrderNumber();

    clearCart();   // el carrito se vacía solo después de confirmar
    confirmModal.hide();

    document.getElementById("checkout-content").classList.add("d-none");
    document.getElementById("page-title").textContent = "Pedido confirmado";
    document.getElementById("order-number").textContent = orderNumber;
    document.getElementById("order-detail").textContent =
      `${items} artículo(s) · Total ${formatColones(total)}`;

    const done = document.getElementById("order-done");
    done.classList.remove("d-none");
    done.focus();   // el lector de pantalla anuncia la confirmación

    // Si recargan la página, el carrito ya está vacío: no se repite la compra
  });

  // Número de demostración: TA-AAAAMMDD-1234
  function createOrderNumber() {
    const today = new Date();
    const date = today.getFullYear().toString() +
      String(today.getMonth() + 1).padStart(2, "0") +
      String(today.getDate()).padStart(2, "0");
    const random = Math.floor(1000 + Math.random() * 9000);
    return `TA-${date}-${random}`;
  }

  renderPage();
});
