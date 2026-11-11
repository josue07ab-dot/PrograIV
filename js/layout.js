/* =========================================================
   TecnoAccesorios - Encabezado y pie de página compartidos
   ---------------------------------------------------------
   Cada página solo necesita:
     <body data-page="home">   (nombre de la página)
     <div id="site-header"></div>
     ... contenido ...
     <div id="site-footer"></div>
   Este archivo dibuja el menú según el rol de demostración.
   En el Avance 2 esto pasa a templates/base.html y el menú
   lo decide el servidor según la sesión (no el navegador).
   Responsable: Josué Abarca Barahona
   ========================================================= */

// Enlaces del menú por rol (este es el mapa de navegación)
const MENU = {
  visitor: [
    { page: "home",     text: "Inicio",       href: "index.html" },
    { page: "catalog",  text: "Catálogo",     href: "catalog.html" },
    { page: "contact",  text: "Contacto",     href: "contact.html" },
    { page: "login",    text: "Ingresar",     href: "login.html" },
    { page: "register", text: "Registrarse",  href: "register.html" }
  ],
  customer: [
    { page: "home",     text: "Inicio",       href: "index.html" },
    { page: "catalog",  text: "Catálogo",     href: "catalog.html" },
    { page: "contact",  text: "Contacto",     href: "contact.html" },
    { page: "account",  text: "Mi cuenta",    href: "account.html" }
  ],
  admin: [
    { page: "home",     text: "Inicio",       href: "index.html" },
    { page: "catalog",  text: "Catálogo",     href: "catalog.html" },
    { page: "admin",    text: "Panel administrativo", href: "admin.html" }
  ]
};

function renderHeader() {
  const container = document.getElementById("site-header");
  if (!container) return;

  const currentPage = document.body.dataset.page || "";
  const role = getDemoRole();

  const links = MENU[role].map(link => `
      <li class="nav-item">
        <a class="nav-link ${link.page === currentPage ? "active" : ""}"
           ${link.page === currentPage ? 'aria-current="page"' : ""}
           href="${link.href}">${link.text}</a>
      </li>`).join("");

  // El administrador no compra, por eso no ve el carrito
  const cartButton = role === "admin" ? "" : `
      <a href="cart.html" class="btn btn-outline-light position-relative ${currentPage === "cart" ? "active" : ""}">
        🛒 Carrito
        <span id="cart-count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-accent d-none">0</span>
        <span class="visually-hidden">artículos en el carrito</span>
      </a>`;

  const logoutButton = role === "visitor" ? "" : `
      <button type="button" id="btn-logout" class="btn btn-sm btn-outline-light">Cerrar sesión</button>`;

  container.innerHTML = `
    <a class="visually-hidden-focusable skip-link" href="#main-content">Saltar al contenido</a>
    <nav class="navbar navbar-expand-lg navbar-dark main-navbar" aria-label="Navegación principal">
      <div class="container">
        <a class="navbar-brand store-brand" href="index.html">
          <span aria-hidden="true">⚡</span> Tecno<span class="accent-text">Accesorios</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-menu"
                aria-controls="main-menu" aria-expanded="false" aria-label="Abrir menú de navegación">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="main-menu">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">${links}</ul>
          <div class="d-flex flex-wrap align-items-center gap-2">
            ${cartButton}
            ${logoutButton}
          </div>
        </div>
      </div>
    </nav>

    <!-- Selector de vista de DEMOSTRACIÓN (lo pide el Avance 1). No es seguridad real. -->
    <div class="demo-bar">
      <div class="container d-flex flex-wrap align-items-center gap-2 py-1">
        <label for="role-select" class="small mb-0">Vista de demostración:</label>
        <select id="role-select" class="form-select form-select-sm w-auto">
          <option value="visitor"  ${role === "visitor" ? "selected" : ""}>Visitante</option>
          <option value="customer" ${role === "customer" ? "selected" : ""}>Cliente</option>
          <option value="admin"    ${role === "admin" ? "selected" : ""}>Administrador</option>
        </select>
        <span class="small opacity-75">(simulado, sin autenticación)</span>
      </div>
    </div>`;

  document.getElementById("role-select").addEventListener("change", ev => {
    setDemoRole(ev.target.value);
    window.location.href = "index.html";
  });

  const logout = document.getElementById("btn-logout");
  if (logout) {
    logout.addEventListener("click", () => {
      setDemoRole("visitor");
      window.location.href = "index.html";
    });
  }

  updateCartBadge();
}

function renderFooter() {
  const container = document.getElementById("site-footer");
  if (!container) return;
  const year = new Date().getFullYear();
  container.innerHTML = `
    <footer class="site-footer mt-5">
      <div class="container py-4">
        <div class="row g-4">
          <div class="col-12 col-md-5">
            <p class="store-brand h5 mb-2">⚡ Tecno<span class="accent-text">Accesorios</span></p>
            <p class="small mb-0">Accesorios tecnológicos con marca y compatibilidad verificada para tus dispositivos.</p>
          </div>
          <div class="col-6 col-md-3">
            <h2 class="h6">Tienda</h2>
            <ul class="list-unstyled small mb-0">
              <li><a href="catalog.html">Catálogo</a></li>
              <li><a href="cart.html">Carrito</a></li>
              <li><a href="contact.html">Contacto</a></li>
            </ul>
          </div>
          <div class="col-6 col-md-4">
            <h2 class="h6">Proyecto académico</h2>
            <p class="small mb-0">Programación IV · UPI · Grupo 1<br>Compras simuladas, precios en colones.</p>
          </div>
        </div>
        <hr>
        <p class="small mb-0 text-center">© ${year} TecnoAccesorios · Sitio de demostración sin fines comerciales.</p>
      </div>
    </footer>`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});
