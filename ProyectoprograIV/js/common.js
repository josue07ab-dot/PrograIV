/* =========================================================
   TecnoAccesorios - Funciones compartidas
   ---------------------------------------------------------
   Todas las páginas cargan este archivo DESPUÉS de data.js.
   Usen estas funciones en vez de escribir las suyas, así
   catálogo, detalle, carrito y pago leen lo mismo.
   Responsable: Limberth Arce Orúe
   ========================================================= */

const CART_KEY = "ta_cart";        // localStorage: [{ id, quantity }]
const ROLE_KEY = "ta_demo_role";   // localStorage: visitor | customer | admin

/* ---------- Formato y consulta de datos ---------- */

// 29900 -> "₡29 900"
function formatColones(amount) {
  return "₡" + Math.round(amount).toLocaleString("es-CR");
}

// Devuelve el producto o null si el id no existe
function findProduct(id) {
  return PRODUCTS.find(p => p.id === Number(id)) || null;
}

function getCategoryName(categoryId) {
  const category = CATEGORIES.find(c => c.id === categoryId);
  return category ? category.name : "Sin categoría";
}

// Disponibilidad simulada a partir de las existencias
function getAvailability(stock) {
  if (stock <= 0) return { label: "Agotado", cssClass: "text-bg-secondary" };
  if (stock <= 5) return { label: "Últimas unidades", cssClass: "text-bg-warning" };
  return { label: "Disponible", cssClass: "text-bg-success" };
}

// Escapa texto antes de meterlo en innerHTML (evita inyección de código)
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
}

// Valida que un valor sea un entero >= 1 (rechaza 0, negativos, decimales y vacío)
function isValidQuantity(value) {
  return /^\d+$/.test(String(value).trim()) && Number(value) >= 1;
}

/* =========================================================
   CARRITO (localStorage)
   Solo se guarda { id, quantity }. El nombre y el precio
   SIEMPRE se leen de PRODUCTS, igual que hará el servidor
   en el Avance 2 (nunca se confía en precios del navegador).
   ========================================================= */

function getCart() {
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) { /* almacenamiento no disponible: se ignora */ }
  updateCartBadge();
}

// Agrega un producto. Si ya estaba, ACUMULA la cantidad.
// Devuelve { ok: true/false, message: "..." }
function addToCart(productId, quantity = 1) {
  const product = findProduct(productId);
  if (!product) return { ok: false, message: "El producto no existe." };
  if (!isValidQuantity(quantity)) {
    return { ok: false, message: "La cantidad debe ser un número entero mayor o igual a 1." };
  }
  if (product.stock <= 0) return { ok: false, message: "Este producto está agotado." };

  quantity = Number(quantity);
  const cart = getCart();
  const line = cart.find(item => item.id === product.id);
  const newQuantity = (line ? line.quantity : 0) + quantity;

  if (newQuantity > product.stock) {
    return { ok: false, message: `Solo hay ${product.stock} unidad(es) disponibles de este producto.` };
  }

  if (line) line.quantity = newQuantity;
  else cart.push({ id: product.id, quantity: quantity });

  saveCart(cart);
  return { ok: true, message: `"${product.name}" se agregó al carrito.` };
}

// Cambia la cantidad de una línea (la usa la página del carrito)
function updateCartItem(productId, quantity) {
  const product = findProduct(productId);
  if (!product) return { ok: false, message: "El producto no existe." };
  if (!isValidQuantity(quantity)) {
    return { ok: false, message: "La cantidad mínima es 1. Para quitar el producto usá el botón Eliminar." };
  }
  quantity = Number(quantity);
  if (quantity > product.stock) {
    return { ok: false, message: `Solo hay ${product.stock} unidad(es) disponibles de "${product.name}".` };
  }

  const cart = getCart();
  const line = cart.find(item => item.id === product.id);
  if (!line) return { ok: false, message: "El producto ya no está en el carrito." };

  line.quantity = quantity;
  saveCart(cart);
  return { ok: true, message: "Cantidad actualizada." };
}

function removeFromCart(productId) {
  saveCart(getCart().filter(item => item.id !== Number(productId)));
}

function clearCart() {
  saveCart([]);
}

// Líneas listas para mostrar: [{ product, quantity, subtotal }]
// Descarta productos que ya no existan en PRODUCTS.
function getCartLines() {
  return getCart()
    .map(item => {
      const product = findProduct(item.id);
      return product ? { product, quantity: item.quantity, subtotal: product.price * item.quantity } : null;
    })
    .filter(line => line !== null);
}

function getCartTotal() {
  return getCartLines().reduce((sum, line) => sum + line.subtotal, 0);
}

function countCartItems() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

// Contador del botón Carrito en el menú
function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  const total = countCartItems();
  badge.textContent = total;
  badge.classList.toggle("d-none", total === 0);
}

/* =========================================================
   ROL DE DEMOSTRACIÓN
   SOLO cambia qué menú se ve. No es autenticación ni guarda
   contraseñas. La seguridad real llega en el Avance 2.
   ========================================================= */

function getDemoRole() {
  try {
    const role = localStorage.getItem(ROLE_KEY);
    return ["visitor", "customer", "admin"].includes(role) ? role : "visitor";
  } catch (e) {
    return "visitor";
  }
}

function setDemoRole(role) {
  try { localStorage.setItem(ROLE_KEY, role); } catch (e) { /* ignorar */ }
}

/* =========================================================
   MENSAJES
   Alerta Bootstrap con ícono + texto (el error no se
   comunica solo con color, como pide el documento).
   Uso: showAlert("messages", "danger", "Texto del error");
   Tipos: success | danger | warning | info
   ========================================================= */
function showAlert(container, type, message) {
  const icons = { success: "✔", danger: "✖", warning: "⚠", info: "ℹ" };
  const target = typeof container === "string" ? document.getElementById(container) : container;
  if (!target) return;
  target.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      <span aria-hidden="true" class="me-1">${icons[type] || ""}</span>${escapeHTML(message)}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>`;
}

/* =========================================================
   TARJETA DE PRODUCTO REUTILIZABLE
   Se usa en inicio (destacados), catálogo y relacionados.
   Avance 2: equivale a templates/catalog/_product_card.html
   ========================================================= */
function productCardHTML(p) {
  const availability = getAvailability(p.stock);
  return `
    <div class="col">
      <article class="card h-100 product-card">
        <img src="${p.image}" class="card-img-top" alt="${escapeHTML(p.name)}"
             onerror="this.onerror=null;this.src='img/placeholder.svg';">
        <div class="card-body d-flex flex-column">
          <span class="brand-label">${escapeHTML(p.brand)}</span>
          <h3 class="h6 card-title mt-1">${escapeHTML(p.name)}</h3>
          <p class="small text-body-secondary mb-2">${getCategoryName(p.category)}</p>
          <span class="badge ${availability.cssClass} align-self-start mb-2">${availability.label}</span>
          <p class="price mt-auto mb-3">${formatColones(p.price)}</p>
          <a href="product.html?id=${p.id}" class="btn btn-main w-100">
            Ver detalle<span class="visually-hidden"> de ${escapeHTML(p.name)}</span>
          </a>
        </div>
      </article>
    </div>`;
}
