/* =========================================================
   TecnoAccesorios - Carrito de demostración
   ---------------------------------------------------------
   Requisitos del Avance 1 que cubre esta página:
   - Lista de productos agregados.
   - Cantidad editable (botones − / + y escribiendo el número).
   - Impide cantidades menores que 1 y mayores a las existencias.
   - Eliminar un producto y vaciar el carrito (con modal).
   - Subtotal por línea y total general.
   - Estado vacío con mensaje claro.
   Usa las funciones de carrito de common.js.
   Responsable: Limberth Arce Orúe
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const linesContainer = document.getElementById("cart-lines");

  // ---------- Dibujar el carrito completo ----------
  function renderCart() {
    const lines = getCartLines();
    const isEmpty = lines.length === 0;

    document.getElementById("empty-cart").classList.toggle("d-none", !isEmpty);
    document.getElementById("cart-content").classList.toggle("d-none", isEmpty);
    if (isEmpty) return;

    linesContainer.innerHTML = lines.map(lineHTML).join("");
    renderSummary();
  }

  // ---------- HTML de una línea del carrito ----------
  // Avance 2: equivale a templates/cart/_cart_line.html
  function lineHTML(line) {
    const p = line.product;
    return `
      <article class="cart-line" data-id="${p.id}" aria-labelledby="line-name-${p.id}">
        <div class="row g-3 align-items-center">
          <div class="col-auto">
            <img src="${p.image}" alt="${escapeHTML(p.name)}" class="cart-thumb"
                 onerror="this.onerror=null;this.src='img/placeholder.svg';">
          </div>

          <div class="col">
            <span class="brand-label">${escapeHTML(p.brand)}</span>
            <h3 class="h6 mb-1" id="line-name-${p.id}">
              <a href="product.html?id=${p.id}" class="text-decoration-none">${escapeHTML(p.name)}</a>
            </h3>
            <p class="small text-body-secondary mb-0">Precio unitario: ${formatColones(p.price)}</p>
          </div>

          <div class="col-12 col-sm-auto">
            <label for="qty-${p.id}" class="form-label small mb-1">Cantidad</label>
            <div class="input-group input-group-sm qty-control">
              <button type="button" class="btn btn-outline-secondary" data-action="decrease"
                      aria-label="Restar una unidad de ${escapeHTML(p.name)}" ${line.quantity <= 1 ? "disabled" : ""}>−</button>
              <input type="number" id="qty-${p.id}" name="quantity" class="form-control"
                     value="${line.quantity}" min="1" max="${p.stock}" step="1" inputmode="numeric"
                     aria-describedby="qty-error-${p.id}">
              <button type="button" class="btn btn-outline-secondary" data-action="increase"
                      aria-label="Sumar una unidad de ${escapeHTML(p.name)}" ${line.quantity >= p.stock ? "disabled" : ""}>+</button>
            </div>
            <div id="qty-error-${p.id}" class="invalid-feedback d-block small" aria-live="polite"></div>
          </div>

          <div class="col-6 col-sm-auto text-sm-end">
            <span class="small text-body-secondary d-block">Subtotal</span>
            <span class="line-subtotal">${formatColones(line.subtotal)}</span>
          </div>

          <div class="col-6 col-sm-auto text-end">
            <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove">
              Eliminar<span class="visually-hidden"> ${escapeHTML(p.name)}</span>
            </button>
          </div>
        </div>
      </article>`;
  }

  // ---------- Resumen (artículos y total) ----------
  function renderSummary() {
    document.getElementById("summary-items").textContent = countCartItems();
    document.getElementById("summary-total").textContent = formatColones(getCartTotal());
  }

  // ---------- Cambiar cantidad de una línea ----------
  function changeQuantity(productId, newValue) {
    const product = findProduct(productId);
    const errorBox = document.getElementById(`qty-error-${productId}`);
    const input = document.getElementById(`qty-${productId}`);
    const result = updateCartItem(productId, newValue);

    if (!result.ok) {
      // Se muestra el error junto al campo y se devuelve el valor anterior
      const current = getCart().find(item => item.id === product.id);
      input.value = current ? current.quantity : 1;
      input.classList.add("is-invalid");
      input.setAttribute("aria-invalid", "true");
      errorBox.textContent = "✖ " + result.message;
      return;
    }

    // Se vuelve a dibujar todo para actualizar subtotal, total y botones
    renderCart();
    document.getElementById(`qty-${productId}`).focus();
  }

  // ---------- Eventos de las líneas (delegación) ----------
  linesContainer.addEventListener("click", ev => {
    const button = ev.target.closest("button[data-action]");
    if (!button) return;

    const lineElement = button.closest(".cart-line");
    const productId = Number(lineElement.dataset.id);
    const current = getCart().find(item => item.id === productId);
    if (!current) return;

    const action = button.dataset.action;
    if (action === "increase") changeQuantity(productId, current.quantity + 1);
    if (action === "decrease") changeQuantity(productId, current.quantity - 1);
    if (action === "remove") {
      const name = findProduct(productId).name;
      removeFromCart(productId);
      renderCart();
      showAlert("messages", "info", `"${name}" se eliminó del carrito.`);
    }
  });

  // Al escribir la cantidad y salir del campo (o presionar Enter)
  linesContainer.addEventListener("change", ev => {
    if (!ev.target.matches('input[name="quantity"]')) return;
    const productId = Number(ev.target.closest(".cart-line").dataset.id);
    changeQuantity(productId, ev.target.value);
  });

  // ---------- Vaciar carrito (botón dentro del modal) ----------
  document.getElementById("btn-confirm-clear").addEventListener("click", () => {
    clearCart();
    bootstrap.Modal.getInstance(document.getElementById("clear-modal")).hide();
    renderCart();
    showAlert("messages", "info", "Se vació el carrito.");
  });

  renderCart();
});
