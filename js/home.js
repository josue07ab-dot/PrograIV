/* =========================================================
   TecnoAccesorios - Página de inicio
   Responsable: Josué Abarca Barahona
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  // Tarjetas de categoría: enlazan al catálogo ya filtrado (?category=)
  const categoryList = document.getElementById("category-list");
  categoryList.innerHTML = CATEGORIES.map(c => {
    const count = PRODUCTS.filter(p => p.category === c.id).length;
    return `
      <div class="col">
        <article class="card category-card h-100">
          <img src="${c.image}" class="card-img-top" alt=""
               onerror="this.onerror=null;this.src='img/placeholder.svg';">
          <div class="card-body">
            <h3 class="h5 mb-1">
              <a class="stretched-link" href="catalog.html?category=${c.id}">${escapeHTML(c.name)}</a>
            </h3>
            <p class="small text-body-secondary mb-0">${count} productos</p>
          </div>
        </article>
      </div>`;
  }).join("");

  // Productos destacados (featured: true en data.js)
  const featured = PRODUCTS.filter(p => p.featured);
  document.getElementById("featured-list").innerHTML = featured.map(productCardHTML).join("");
});
