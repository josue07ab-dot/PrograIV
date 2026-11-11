/* =========================================================
   TecnoAccesorios - Catálogo: búsqueda y filtro
   ---------------------------------------------------------
   - Busca por nombre (sin importar mayúsculas ni tildes).
   - Filtra por categoría.
   - Lee ?q= y ?category= de la URL (las tarjetas del inicio
     llegan con ?category=audio, etc.) y la mantiene al día.
   Avance 2: el filtrado lo hará SQLite con
     WHERE name LIKE ? AND category_id = ?
   Responsable: Bianka Martínez Gamboa
   ========================================================= */

// "Audífonos" -> "audifonos" (para comparar sin tildes ni mayúsculas)
function normalizeText(text) {
  return String(text).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

function filterProducts(text, category) {
  const query = normalizeText(text);
  return PRODUCTS.filter(p =>
    (query === "" || normalizeText(p.name).includes(query)) &&
    (category === "" || p.category === category)
  );
}

// ---------- Créditos de las imágenes ----------
// Autor y enlace de cada foto salen de data.js (images). Todas son de Unsplash.
function renderImageCredits() {
  const list = document.getElementById("image-credits");
  list.innerHTML = PRODUCTS.map(p => {
    const many = p.images.length > 1;
    const links = p.images.map((photo, i) =>
      `<a href="${escapeHTML(photo.url)}" target="_blank" rel="noopener noreferrer">` +
      `${escapeHTML(photo.author)}${many ? ` (foto ${i + 1})` : ""}</a>`
    ).join(", ");
    return `<li>${escapeHTML(p.name)}: ${many ? "fotos de" : "foto de"} ${links} en Unsplash ` +
           `(${IMAGE_LICENSE})${p.illustrative ? ", imágenes ilustrativas" : ""}.</li>`;
  }).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-filter");
  const productList = document.getElementById("product-list");
  const summary = document.getElementById("results-summary");
  const messages = document.getElementById("messages");

  // Opciones de categoría desde los datos
  CATEGORIES.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.name;
    categorySelect.appendChild(option);
  });

  // Créditos de las fotos (una línea por producto)
  renderImageCredits();

  // Valores iniciales desde la URL
  const params = new URLSearchParams(window.location.search);
  searchInput.value = params.get("q") || "";
  const urlCategory = params.get("category") || "";
  categorySelect.value = CATEGORIES.some(c => c.id === urlCategory) ? urlCategory : "";

  function render() {
    const text = searchInput.value;
    const category = categorySelect.value;
    const results = filterProducts(text, category);

    productList.innerHTML = results.map(productCardHTML).join("");

    summary.textContent = results.length === 1
      ? "Se encontró 1 producto."
      : `Se encontraron ${results.length} productos.`;

    if (results.length === 0) {
      showAlert(messages, "warning",
        `No hay productos que coincidan con "${text.trim() || "la búsqueda"}"` +
        (category ? ` en ${getCategoryName(category)}` : "") +
        '. Probá con otra palabra o elegí "Todas las categorías".');
    } else {
      messages.innerHTML = "";
    }

    // Mantener la URL al día (se puede recargar sin perder el filtro)
    const newParams = new URLSearchParams();
    if (text.trim()) newParams.set("q", text.trim());
    if (category) newParams.set("category", category);
    const query = newParams.toString();
    history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }

  searchInput.addEventListener("input", render);
  categorySelect.addEventListener("change", render);
  document.getElementById("search-form").addEventListener("submit", ev => {
    ev.preventDefault();   // Enter no recarga la página
    render();
  });
  document.getElementById("btn-clear").addEventListener("click", () => {
    searchInput.value = "";
    categorySelect.value = "";
    render();
    searchInput.focus();
  });

  render();
});
