/* =========================================================
   TecnoAccesorios - Mi cuenta
   Responsable: Andrea Córdoba Sevilla
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const nameOutput = document.getElementById("account-name");
  const emailOutput = document.getElementById("account-email");
  const nameInput = document.getElementById("account-name-input");
  const form = document.getElementById("account-form");

  // Datos ficticios para demostrar cómo se vería una cuenta de cliente.
  nameInput.value = nameOutput.textContent;

  const orders = [
    { id: "TA-2026-018", date: "12/10/2026", total: 79800, status: "Entregado" },
    { id: "TA-2026-011", date: "03/09/2026", total: 29900, status: "En preparación" },
    { id: "TA-2026-004", date: "16/08/2026", total: 45900, status: "Entregado" }
  ];

  document.getElementById("orders-table").innerHTML = orders.map(order => `
    <tr>
      <th scope="row">${escapeHTML(order.id)}</th>
      <td>${escapeHTML(order.date)}</td>
      <td>${formatColones(order.total)}</td>
      <td><span class="badge ${order.status === "Entregado" ? "text-bg-success" : "text-bg-warning"}">${escapeHTML(order.status)}</span></td>
    </tr>`).join("");

  form.addEventListener("submit", event => {
    event.preventDefault();
    form.classList.add("was-validated");
    const newName = nameInput.value.trim();
    if (!form.checkValidity() || newName.length < 2) {
      showAlert("messages", "danger", "Escribe un nombre de al menos dos caracteres.");
      nameInput.focus();
      return;
    }
    nameOutput.textContent = newName;
    showAlert("messages", "success", "Nombre actualizado en esta vista de demostración.");
  });
});