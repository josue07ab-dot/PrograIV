/* =========================================================
   TecnoAccesorios - Detalle de producto
   ---------------------------------------------------------
   Lee ?id= de la URL, muestra la ficha completa (incluye
   marca y compatibilidad) y agrega al carrito usando
   addToCart() de common.js.
   Avance 2: Flask busca el producto con
     SELECT ... FROM products WHERE id = ? AND active = 1
   y devuelve 404 si no existe.
   Responsable: Bianka Martínez Gamboa
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(window.location.search).get("id");
  const product = findProduct(id);

  // ---------- Producto inexistente ----------
  if (!product) {
    document.getElementById("not-found").classList.remove("d-none");
    document.getElementById("breadcrumb-product").textContent = "No encontrado";
    document.title = "Producto no encontrado | TecnoAccesorios";
    return;
  }

  // ---------- Llenar la ficha ----------
  const availability = getAvailability(product.stock);
  document.title = `${product.name} | TecnoAccesorios`;
  document.getElementById("breadcrumb-product").textContent = product.name;

  // ---------- Galería de fotos ----------
  // Cada producto tiene de 1 a 3 fotos (images en data.js). Las miniaturas
  // solo aparecen si hay 2 o más; al elegir una cambian la foto grande y su crédito.
  const image = document.getElementById("detail-image");
  const thumbs = document.getElementById("detail-thumbs");
  const creditBox = document.getElementById("detail-image-credit");
  const photoCount = product.images.length;

  function showPhoto(index) {
    const photo = product.images[index];
    image.onerror = () => { image.onerror = null; image.src = "img/placeholder.svg"; };
    image.src = photo.src;
    image.alt = photoCount > 1
      ? `${product.name} (foto ${index + 1} de ${photoCount})`
      : product.name;

    thumbs.querySelectorAll("button").forEach((button, i) => {
      button.classList.toggle("active", i === index);
      button.setAttribute("aria-pressed", String(i === index));
    });

    // Crédito: autor con enlace + licencia. Si la foto es de un modelo
    // parecido, se avisa que es ilustrativa.
    const note = product.illustrative ? " Imagen ilustrativa: el producto real puede variar." : "";
    creditBox.innerHTML =
      `Foto: <a href="${escapeHTML(photo.url)}" target="_blank" rel="noopener noreferrer">` +
      `${escapeHTML(photo.author)} en Unsplash</a> · ${IMAGE_LICENSE}.${note}`;
  }

  if (photoCount > 1) {
    thumbs.innerHTML = product.images.map((photo, i) => `
      <button type="button" class="product-thumb" data-index="${i}"
              aria-label="Ver foto ${i + 1} de ${photoCount}">
        <img src="${escapeHTML(photo.src)}" alt=""
             onerror="this.onerror=null;this.src='img/placeholder.svg';">
      </button>`).join("");
    thumbs.classList.remove("d-none");

    // Un solo evento para todas las miniaturas (delegación)
    thumbs.addEventListener("click", ev => {
      const button = ev.target.closest("button[data-index]");
      if (button) showPhoto(Number(button.dataset.index));
    });
  }
  showPhoto(0);

  document.getElementById("detail-brand").textContent = product.brand;
  document.getElementById("detail-name").textContent = product.name;

  const categoryLink = document.getElementById("detail-category");
  categoryLink.textContent = getCategoryName(product.category);
  categoryLink.href = `catalog.html?category=${product.category}`;

  const badge = document.getElementById("detail-availability");
  badge.textContent = availability.label;
  badge.classList.add(...availability.cssClass.split(" "));

  document.getElementById("detail-price").textContent = formatColones(product.price);
  document.getElementById("detail-description").textContent = product.description;
  document.getElementById("detail-brand-spec").textContent = product.brand;
  document.getElementById("detail-compatibility").textContent = product.compatibility;
  document.getElementById("detail-stock").textContent =
    product.stock > 0 ? `${product.stock} unidad(es)` : "Sin existencias";

  document.getElementById("product-id").value = product.id;

  // ---------- Cantidad y botón ----------
  const quantityInput = document.getElementById("quantity");
  const addButton = document.getElementById("btn-add");
  const help = document.getElementById("quantity-help");

  if (product.stock <= 0) {
    quantityInput.disabled = true;
    addButton.disabled = true;
    addButton.textContent = "Agotado";
    help.textContent = "Este producto no tiene existencias por el momento.";
  } else {
    quantityInput.max = product.stock;
    help.textContent = `Podés agregar de 1 a ${product.stock} unidad(es).`;
  }

  document.getElementById("product-detail").classList.remove("d-none");

  document.getElementById("add-form").addEventListener("submit", ev => {
    ev.preventDefault();
    const value = quantityInput.value.trim();

    if (!isValidQuantity(value)) {
      markInvalid(true);
      showAlert("messages", "danger", "Ingresá una cantidad entera mayor o igual a 1.");
      quantityInput.focus();
      return;
    }

    const result = addToCart(product.id, Number(value));
    markInvalid(!result.ok);
    if (result.ok) {
      quantityInput.value = 1;
      showAlert("messages", "success", result.message + " Podés verlo en el carrito.");
    } else {
      showAlert("messages", "danger", result.message);
    }
  });

  function markInvalid(isInvalid) {
    quantityInput.classList.toggle("is-invalid", isInvalid);
    if (isInvalid) quantityInput.setAttribute("aria-invalid", "true");
    else quantityInput.removeAttribute("aria-invalid");
  }

  // ---------- Relacionados (misma categoría) ----------
  const related = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);
  if (related.length) {
    document.getElementById("related-list").innerHTML = related.map(productCardHTML).join("");
    document.getElementById("related-section").classList.remove("d-none");
  }
});
