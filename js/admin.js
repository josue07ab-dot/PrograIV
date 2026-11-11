/* =========================================================
   TecnoAccesorios - Panel administrativo
   Responsable: Andrea Córdoba Sevilla
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // El panel es solo para administradores. La comprobación es visual (Avance 1);
  // la protección real llegará con las sesiones de Flask en el Avance 2.
  const allowed = requireDemoRole("admin", "page-content", "access-notice", {
    visitor: {
      title: "Sección solo para administradores",
      text: "Para ver el panel, cambia la vista de demostración a Administrador (selector de la barra superior). Es solo una simulación, no hay autenticación real.",
      href: "login.html",
      linkText: "Ir a Ingresar"
    },
    customer: {
      title: "Sección solo para administradores",
      text: "Estás viendo el sitio como cliente. Cambia la vista de demostración a Administrador para abrir el panel."
    }
  });
  if (!allowed) return;

  // Copia local de los datos para que las acciones de la demostración no cambien data.js.
  const adminProducts = PRODUCTS.map(product => ({
    ...product,
    image: product.image || (product.images && product.images[0] ? product.images[0].src : "img/placeholder.svg")
  }));

  const ORDER_STATUSES = ["Pendiente", "Enviado", "Entregado", "Cancelado"];
  const STATUS_CLASSES = {
    "Pendiente": "text-bg-warning",
    "Enviado": "text-bg-primary",
    "Entregado": "text-bg-success",
    "Cancelado": "text-bg-secondary"
  };

  const demoOrders = [
    { id: "TA-2026-021", customer: "María Solano", date: "25/10/2026", total: 79800, status: "Pendiente" },
    { id: "TA-2026-020", customer: "Daniel Rojas", date: "24/10/2026", total: 49900, status: "Enviado" },
    { id: "TA-2026-019", customer: "Sofía Mora", date: "22/10/2026", total: 22900, status: "Entregado" }
  ];
  const demoCustomers = [
    { name: "María Solano", email: "maria@example.com", active: true },
    { name: "Daniel Rojas", email: "daniel@example.com", active: true },
    { name: "Sofía Mora", email: "sofia@example.com", active: false }
  ];

  const form = document.getElementById("admin-product-form");
  const categorySelect = document.getElementById("product-category");
  const cancelButton = document.getElementById("cancel-edit");

  CATEGORIES.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });

  /* ---------- Validación del formulario de producto ---------- */

  // Solo rutas internas img/... o direcciones https:// (evita javascript: y similares).
  const IMAGE_PATTERN = /^(img\/[\w\-./]+|https:\/\/\S+)$/i;

  const validateProduct = attachValidators({
    "product-name": value => value.trim().length >= 2 ? "" : "Escribe el nombre del producto (mínimo 2 caracteres).",
    "product-brand": value => value.trim() !== "" ? "" : "Escribe la marca.",
    "product-description": value => value.trim().length >= 10 ? "" : "Escribe una descripción de al menos 10 caracteres.",
    "product-category": value => value !== "" ? "" : "Selecciona una categoría.",
    "product-price": value => /^\d+$/.test(value.trim()) && Number(value) >= 1 ? "" : "Escribe un precio entero mayor que cero.",
    "product-stock": value => /^\d+$/.test(value.trim()) ? "" : "Escribe las existencias como número entero (0 o más).",
    "product-image": value => value.trim() === "" || IMAGE_PATTERN.test(value.trim()) ? "" : "Usa una ruta como img/products/p01.jpg o una dirección https://.",
    "product-compatibility": value => value.trim() !== "" ? "" : "Escribe con qué dispositivos es compatible."
  });

  /* ---------- Dibujo de tablas ---------- */

  function renderProducts() {
    const tbody = document.getElementById("admin-products-table");
    if (adminProducts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-secondary py-4">No hay productos en el inventario.</td></tr>`;
      return;
    }
    tbody.innerHTML = adminProducts.map(product => {
      const availability = getAvailability(product.stock);
      const name = escapeHTML(product.name);
      return `
      <tr>
        <th scope="row">${name}</th>
        <td>${escapeHTML(product.brand || "—")}</td>
        <td>${escapeHTML(getCategoryName(product.category))}</td>
        <td>${formatColones(product.price)}</td>
        <td><span class="badge ${availability.cssClass}">${Number(product.stock)} · ${availability.label}</span></td>
        <td class="text-nowrap">
          <button type="button" class="btn btn-sm btn-outline-main" data-edit-product="${Number(product.id)}">Editar<span class="visually-hidden"> ${name}</span></button>
          <button type="button" class="btn btn-sm btn-outline-danger" data-delete-product="${Number(product.id)}">Eliminar<span class="visually-hidden"> ${name}</span></button>
        </td>
      </tr>`;
    }).join("");
  }

  function renderOrders() {
    document.getElementById("admin-orders-table").innerHTML = demoOrders.map(order => `
      <tr>
        <th scope="row">${escapeHTML(order.id)}</th>
        <td>${escapeHTML(order.customer)}</td>
        <td>${escapeHTML(order.date)}</td>
        <td>${formatColones(order.total)}</td>
        <td><span class="badge ${STATUS_CLASSES[order.status] || "text-bg-secondary"}">${escapeHTML(order.status)}</span></td>
        <td>
          <select class="form-select form-select-sm status-select" data-order-status="${escapeHTML(order.id)}" aria-label="Cambiar estado del pedido ${escapeHTML(order.id)}">
            ${ORDER_STATUSES.map(status => `<option value="${status}" ${status === order.status ? "selected" : ""}>${status}</option>`).join("")}
          </select>
        </td>
      </tr>`).join("");
  }

  function renderCustomers() {
    document.getElementById("admin-customers-table").innerHTML = demoCustomers.map((customer, index) => `
      <tr><th scope="row">${escapeHTML(customer.name)}</th><td>${escapeHTML(customer.email)}</td>
      <td><span class="badge ${customer.active ? "text-bg-success" : "text-bg-secondary"}">${customer.active ? "Activo" : "Inactivo"}</span></td>
      <td><button type="button" class="btn btn-sm btn-outline-main" data-toggle-customer="${index}">${customer.active ? "Desactivar" : "Activar"}<span class="visually-hidden"> a ${escapeHTML(customer.name)}</span></button></td></tr>`).join("");
  }

  /* ---------- Formulario: agregar / editar ---------- */

  function resetProductForm() {
    form.reset();
    clearAllFieldErrors(form);
    document.getElementById("product-id").value = "";
    document.getElementById("product-form-title").textContent = "Agregar producto";
    cancelButton.classList.add("d-none");
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const firstInvalid = validateProduct();
    if (firstInvalid) {
      showAlert("messages", "danger", "Revisa los campos marcados del producto: cada uno explica qué corregir.");
      firstInvalid.focus();
      return;
    }

    const formData = new FormData(form);
    const productId = Number(formData.get("product_id"));
    const existing = productId ? adminProducts.find(product => product.id === productId) : null;
    const image = String(formData.get("image")).trim() || "img/placeholder.svg";

    const productData = {
      id: existing ? existing.id : Math.max(0, ...adminProducts.map(product => product.id)) + 1,
      name: String(formData.get("name")).trim(),
      description: String(formData.get("description")).trim(),
      category: String(formData.get("category_id")),
      price: Number(formData.get("price")),
      image,
      stock: Number(formData.get("stock")),
      brand: String(formData.get("brand")).trim(),
      compatibility: String(formData.get("compatibility")).trim(),
      // Si la imagen no cambió se conserva la galería original (varias fotos).
      images: existing && existing.image === image ? existing.images : [{ src: image }]
    };

    if (existing) {
      Object.assign(existing, productData);
      showAlert("messages", "success", `Producto "${productData.name}" actualizado en la demostración.`);
    } else {
      adminProducts.push(productData);
      showAlert("messages", "success", `Producto "${productData.name}" agregado a la lista de demostración.`);
    }
    renderProducts();
    resetProductForm();
  });

  document.getElementById("reset-product-form").addEventListener("click", () => {
    window.setTimeout(resetProductForm, 0);
  });
  cancelButton.addEventListener("click", resetProductForm);

  /* ---------- Acciones de la tabla de productos ---------- */

  document.getElementById("admin-products-table").addEventListener("click", event => {
    const editButton = event.target.closest("[data-edit-product]");
    const deleteButton = event.target.closest("[data-delete-product]");

    if (editButton) {
      const product = adminProducts.find(item => item.id === Number(editButton.dataset.editProduct));
      if (!product) return;
      clearAllFieldErrors(form);
      document.getElementById("product-id").value = product.id;
      document.getElementById("product-name").value = product.name;
      document.getElementById("product-brand").value = product.brand || "";
      document.getElementById("product-description").value = product.description || "";
      document.getElementById("product-category").value = product.category || "";
      document.getElementById("product-price").value = product.price;
      document.getElementById("product-stock").value = product.stock;
      document.getElementById("product-image").value = product.image || "";
      document.getElementById("product-compatibility").value = product.compatibility || "";
      document.getElementById("product-form-title").textContent = `Editar producto: ${product.name}`;
      cancelButton.classList.remove("d-none");
      document.getElementById("product-name").focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (deleteButton) {
      const index = adminProducts.findIndex(item => item.id === Number(deleteButton.dataset.deleteProduct));
      if (index === -1) return;
      const product = adminProducts[index];
      if (!window.confirm(`¿Eliminar "${product.name}" del inventario de demostración?`)) return;
      // Si se estaba editando este mismo producto, se limpia el formulario.
      if (Number(document.getElementById("product-id").value) === product.id) resetProductForm();
      adminProducts.splice(index, 1);
      renderProducts();
      showAlert("messages", "success", `Producto "${product.name}" eliminado de la demostración.`);
    }
  });

  /* ---------- Pedidos: cambiar estado ---------- */

  document.getElementById("admin-orders-table").addEventListener("change", event => {
    const select = event.target.closest("[data-order-status]");
    if (!select) return;
    const order = demoOrders.find(item => item.id === select.dataset.orderStatus);
    if (!order || !ORDER_STATUSES.includes(select.value)) return;
    order.status = select.value;
    renderOrders();
    // Se devuelve el foco al mismo selector para no perder el lugar con teclado.
    document.querySelector(`[data-order-status="${order.id}"]`)?.focus();
    showAlert("messages", "success", `Pedido ${order.id}: estado cambiado a "${order.status}".`);
  });

  /* ---------- Clientes: activar / desactivar ---------- */

  document.getElementById("admin-customers-table").addEventListener("click", event => {
    const button = event.target.closest("[data-toggle-customer]");
    if (!button) return;
    const index = Number(button.dataset.toggleCustomer);
    const customer = demoCustomers[index];
    if (!customer) return;
    if (customer.active && !window.confirm(`¿Desactivar a ${customer.name}?`)) return;
    customer.active = !customer.active;
    renderCustomers();
    document.querySelector(`[data-toggle-customer="${index}"]`)?.focus();
    showAlert("messages", "success", `Estado actualizado: ${customer.name} ahora está ${customer.active ? "activo" : "inactivo"}.`);
  });

  renderProducts();
  renderOrders();
  renderCustomers();
});
