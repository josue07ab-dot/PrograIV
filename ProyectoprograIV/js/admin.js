/* =========================================================
   TecnoAccesorios - Panel administrativo
   Responsable: Andrea Córdoba Sevilla
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // Copia local de los datos para que las acciones de la demostración no cambien data.js.
  const adminProducts = PRODUCTS.map(product => ({
    ...product,
    image: product.image || (product.images && product.images[0] ? product.images[0].src : "img/placeholder.svg")
  }));

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

  const categorySelect = document.getElementById("product-category");
  CATEGORIES.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });

  function renderProducts() {
    const tbody = document.getElementById("admin-products-table");
    tbody.innerHTML = adminProducts.map(product => `
      <tr>
        <th scope="row">${escapeHTML(product.name)}</th>
        <td>${escapeHTML(product.brand || "—")}</td>
        <td>${escapeHTML(getCategoryName(product.category))}</td>
        <td>${formatColones(product.price)}</td>
        <td><span class="badge ${product.stock <= 5 ? "text-bg-warning" : "text-bg-success"}">${Number(product.stock)}</span></td>
        <td><button type="button" class="btn btn-sm btn-outline-main" data-edit-product="${Number(product.id)}">Editar</button></td>
      </tr>`).join("");
  }

  function renderOrders() {
    document.getElementById("admin-orders-table").innerHTML = demoOrders.map(order => `
      <tr><th scope="row">${escapeHTML(order.id)}</th><td>${escapeHTML(order.customer)}</td><td>${escapeHTML(order.date)}</td><td>${formatColones(order.total)}</td><td><span class="badge text-bg-info">${escapeHTML(order.status)}</span></td></tr>`).join("");
  }

  function renderCustomers() {
    document.getElementById("admin-customers-table").innerHTML = demoCustomers.map((customer, index) => `
      <tr><th scope="row">${escapeHTML(customer.name)}</th><td>${escapeHTML(customer.email)}</td>
      <td><span class="badge ${customer.active ? "text-bg-success" : "text-bg-secondary"}">${customer.active ? "Activo" : "Inactivo"}</span></td>
      <td><button type="button" class="btn btn-sm btn-outline-main" data-toggle-customer="${index}">${customer.active ? "Desactivar" : "Activar"}</button></td></tr>`).join("");
  }

  function resetProductForm() {
    document.getElementById("admin-product-form").reset();
    document.getElementById("product-id").value = "";
    document.getElementById("product-form-title").textContent = "Agregar producto";
    document.getElementById("admin-product-form").classList.remove("was-validated");
  }

  document.getElementById("admin-product-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
      showAlert("messages", "danger", "Revisa los campos obligatorios del producto.");
      form.querySelector(":invalid")?.focus();
      return;
    }

    const formData = new FormData(form);
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      showAlert("messages", "danger", "El precio debe ser mayor que cero y las existencias un entero igual o mayor que cero.");
      return;
    }

    const productId = Number(formData.get("product_id"));
    const existing = productId ? adminProducts.find(product => product.id === productId) : null;
    const productData = {
      id: existing ? existing.id : Math.max(0, ...adminProducts.map(product => product.id)) + 1,
      name: String(formData.get("name")).trim(),
      description: String(formData.get("description")).trim(),
      category: String(formData.get("category_id")),
      price,
      image: String(formData.get("image")).trim() || "img/placeholder.svg",
      stock,
      brand: String(formData.get("brand")).trim(),
      compatibility: String(formData.get("compatibility")).trim(),
      images: [{ src: String(formData.get("image")).trim() || "img/placeholder.svg" }]
    };

    if (existing) {
      Object.assign(existing, productData);
      showAlert("messages", "success", "Producto actualizado en la demostración.");
    } else {
      adminProducts.push(productData);
      showAlert("messages", "success", "Producto agregado a la lista de demostración.");
    }
    renderProducts();
    resetProductForm();
  });

  document.getElementById("reset-product-form").addEventListener("click", () => {
    window.setTimeout(resetProductForm, 0);
  });

  document.getElementById("admin-products-table").addEventListener("click", event => {
    const button = event.target.closest("[data-edit-product]");
    if (!button) return;
    const product = adminProducts.find(item => item.id === Number(button.dataset.editProduct));
    if (!product) return;

    document.getElementById("product-id").value = product.id;
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-brand").value = product.brand || "";
    document.getElementById("product-description").value = product.description || "";
    document.getElementById("product-category").value = product.category || "";
    document.getElementById("product-price").value = product.price;
    document.getElementById("product-stock").value = product.stock;
    document.getElementById("product-image").value = product.image || "";
    document.getElementById("product-compatibility").value = product.compatibility || "";
    document.getElementById("product-form-title").textContent = "Editar producto";
    document.getElementById("product-name").focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.getElementById("admin-customers-table").addEventListener("click", event => {
    const button = event.target.closest("[data-toggle-customer]");
    if (!button) return;
    const customer = demoCustomers[Number(button.dataset.toggleCustomer)];
    if (!customer) return;
    customer.active = !customer.active;
    renderCustomers();
    showAlert("messages", "success", `Estado actualizado: ${customer.name} ahora está ${customer.active ? "activo" : "inactivo"}.`);
  });

  renderProducts();
  renderOrders();
  renderCustomers();
});