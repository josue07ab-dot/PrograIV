/* =========================================================
   TecnoAccesorios - Mi cuenta
   Responsable: Andrea Córdoba Sevilla
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // Esta página es para clientes. La comprobación es solo visual (Avance 1).
  const allowed = requireDemoRole("customer", "page-content", "access-notice", {
    visitor: {
      title: "Ingresa para ver tu cuenta",
      text: "Esta sección muestra tus datos y tu historial de pedidos. Inicia sesión para continuar.",
      href: "login.html",
      linkText: "Ir a Ingresar"
    },
    admin: {
      title: "Esta página es para clientes",
      text: "Estás viendo el sitio como administrador. Cambia la vista de demostración a Cliente para ver Mi cuenta."
    }
  });
  if (!allowed) return;

  const nameOutput = document.getElementById("account-name");
  const nameInput = document.getElementById("account-name-input");
  const form = document.getElementById("account-form");

  // Datos ficticios para demostrar cómo se vería una cuenta de cliente.
  nameInput.value = nameOutput.textContent;

  const orders = [
    { id: "TA-2026-018", date: "12/10/2026", total: 79800, status: "Entregado" },
    { id: "TA-2026-011", date: "03/09/2026", total: 29900, status: "En preparación" },
    { id: "TA-2026-004", date: "16/08/2026", total: 45900, status: "Entregado" }
  ];

  // Color del estado; el texto del estado siempre se muestra (el color no es la única pista).
  const STATUS_CLASSES = {
    "Entregado": "text-bg-success",
    "Enviado": "text-bg-primary",
    "En preparación": "text-bg-warning",
    "Cancelado": "text-bg-secondary"
  };

  const ordersTable = document.getElementById("orders-table");
  if (orders.length === 0) {
    ordersTable.innerHTML = `<tr><td colspan="4" class="text-center text-secondary py-4">Todavía no tienes pedidos.</td></tr>`;
  } else {
    ordersTable.innerHTML = orders.map(order => `
      <tr>
        <th scope="row">${escapeHTML(order.id)}</th>
        <td>${escapeHTML(order.date)}</td>
        <td>${formatColones(order.total)}</td>
        <td><span class="badge ${STATUS_CLASSES[order.status] || "text-bg-secondary"}">${escapeHTML(order.status)}</span></td>
      </tr>`).join("");
  }

  const validateName = attachValidators({
    "account-name-input": value => value.trim().length >= 2 ? "" : "Escribe un nombre de al menos 2 caracteres."
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const firstInvalid = validateName();
    if (firstInvalid) {
      showAlert("messages", "danger", "No se pudo actualizar: revisa el nombre.");
      firstInvalid.focus();
      return;
    }
    // El cambio solo vive en esta vista; se pierde al recargar.
    nameOutput.textContent = nameInput.value.trim().replace(/\s+/g, " ");
    showAlert("messages", "success", "Nombre actualizado en esta vista de demostración.");
  });
});
