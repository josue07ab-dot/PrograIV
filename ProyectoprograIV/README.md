# TecnoAccesorios — Proyecto final Programación IV (Grupo 1)

Tienda en línea de accesorios tecnológicos. Dato particular: **marca y compatibilidad**.

Integrantes: Limberth Arce Orúe · Josué Abarca Barahona · Bianka Martínez Gamboa · Andrea Córdoba Sevilla

## Cómo ejecutarlo (Avance 1)

1. Descomprimir la carpeta `ProyectoPrograIV` en cualquier ubicación
   (por ejemplo `C:\Users\LAPTOP\OneDrive\Documents\ProyectoPrograIV`).
2. Abrir `index.html` con doble clic (Chrome o Edge). No necesita servidor ni base de datos.
3. Opcional: en VS Code, clic derecho sobre `index.html` → *Open with Live Server*
   para que la página se recargue sola al guardar cambios.

En el Avance 2 la tienda se ejecutará con Flask (`python run.py`); no se usa Apache ni XAMPP.

## Convención del código

- **Código en inglés**: nombres de archivos, carpetas, variables, funciones, clases CSS e `id`.
- **Comentarios en español.**
- **Textos que ve el cliente en español** (la tienda es para Costa Rica).

## Estructura y responsables

```
ProyectoPrograIV/
  index.html        Inicio                                  Josué
  contact.html      Contacto                                Josué
  catalog.html      Catálogo + búsqueda + filtro            Bianka
  product.html      Detalle (?id=1 ... ?id=12)              Bianka
  cart.html         Carrito                                 Limberth
  checkout.html     Finalizar compra                        Limberth
  register.html     Registro                                Andrea
  login.html        Acceso                                  Andrea
  account.html      Cuenta del cliente                      Andrea
  admin.html        Panel administrativo                    Andrea
  template.html     Punto de partida para páginas nuevas

  css/styles.css    Único CSS propio (cada quien en su sección)   Josué
  js/layout.js      Menú, pie y selector de vista de demostración  Josué
  js/home.js        Lógica del inicio                              Josué
  js/contact.js     Lógica de contacto                             Josué
  js/data.js        12 productos y 3 categorías (fuente única)     Bianka
  js/catalog.js     Búsqueda y filtro                              Bianka
  js/product.js     Ficha del producto                             Bianka
  js/common.js      Funciones compartidas (carrito, colones...)    Limberth
  js/cart.js        Carrito                                        Limberth
  js/checkout.js    Finalizar compra                               Limberth
  js/register.js, login.js, account.js, admin.js                   Andrea

  img/products/     p01.jpg ... p12.jpg                            Bianka
  img/categories/   audio.jpg, charging.jpg, peripherals.jpg       Josué
  img/placeholder.svg  Se muestra si falta una imagen
```

## Reglas para todos

1. Cada página nueva se crea **copiando `template.html`**.
2. **No copiar el menú** en cada página: lo dibuja `js/layout.js`.
3. Productos siempre desde `PRODUCTS` o `findProduct(id)`. No escribir precios a mano.
4. Precios siempre con `formatColones(monto)`.
5. Carrito siempre con las funciones de `common.js`. En localStorage solo se guarda `{ id, quantity }`.
6. Mensajes con `showAlert("messages", "danger" | "success" | "warning" | "info", "texto")`.
7. **Nunca** guardar contraseñas en localStorage, sessionStorage ni en el código.
8. Todo campo con su `<label for="...">` y un atributo `name` de la tabla de abajo.
9. Un solo CSS (`css/styles.css`); cada quien escribe en la sección con su nombre.
10. Probar cada página a 390, 820 y 1280 px (F12 → modo dispositivo).

## Funciones disponibles (js/common.js)

| Función | Para qué |
| --- | --- |
| `formatColones(29900)` | Devuelve `"₡29 900"` |
| `findProduct(id)` | Producto o `null` |
| `getCategoryName("audio")` | Devuelve `"Audio"` |
| `getAvailability(stock)` | `{ label, cssClass }` para un badge |
| `escapeHTML(texto)` | Escapar texto antes de usar `innerHTML` |
| `isValidQuantity(valor)` | `true` si es entero mayor o igual a 1 |
| `getCart()` / `saveCart(cart)` | Leer / guardar el carrito |
| `addToCart(id, cantidad)` | Valida, acumula repetidos y respeta existencias. Devuelve `{ ok, message }` |
| `updateCartItem(id, cantidad)` | Cambia la cantidad de una línea. Devuelve `{ ok, message }` |
| `removeFromCart(id)` / `clearCart()` | Eliminar una línea / vaciar |
| `getCartLines()` | `[{ product, quantity, subtotal }]` |
| `getCartTotal()` / `countCartItems()` | Total en colones / cantidad de artículos |
| `getDemoRole()` / `setDemoRole(rol)` | `visitor`, `customer` o `admin` (solo visual) |
| `showAlert(id, tipo, mensaje)` | Alerta Bootstrap con ícono y texto |
| `productCardHTML(p)` | Tarjeta de producto reutilizable |

## Nombres de campos (atributo `name`)

| Formulario | Campos `name` | Obligatorios en el servidor (Avance 2) |
| --- | --- | --- |
| Finalizar compra | `name`, `email`, `phone`, `address` | Todos |
| Contacto | `name`, `email`, `subject`, `message` | Todos |
| Registro | `name`, `email`, `password`, `password_confirm` | Todos (contraseña de 15 a 128 caracteres) |
| Acceso | `email`, `password` | Todos |
| Producto (admin) | `name`, `description`, `category_id`, `price`, `image`, `stock`, `brand`, `compatibility` | Todos menos `image` |
| Búsqueda | `q`, `category` | Ninguno |
| Carrito | `product_id`, `quantity` | Todos |

## Páginas → rutas de Flask (Avance 2)

| Página actual | Ruta | Método | Plantilla Jinja2 |
| --- | --- | --- | --- |
| index.html | `/` | GET | `home.html` |
| catalog.html | `/catalog?q=&category=` | GET | `catalog/list.html` |
| product.html?id=N | `/product/<int:id>` | GET | `catalog/detail.html` |
| cart.html | `/cart` | GET | `cart/cart.html` |
| — | `/cart/add`, `/cart/update`, `/cart/remove` | POST | redirección a `/cart` |
| checkout.html | `/checkout` | GET / POST | `orders/checkout.html` |
| — | `/order/<int:id>/confirmation` | GET | `orders/confirmation.html` |
| contact.html | `/contact` | GET / POST | `contact/contact.html` |
| register.html | `/register` | GET / POST | `auth/register.html` |
| login.html | `/login` | GET / POST | `auth/login.html` |
| — | `/logout` | POST | redirección a `/` |
| account.html | `/account` | GET / POST | `account/account.html` |
| admin.html | `/admin/...` | GET / POST | `admin/*.html` |

Fragmentos reutilizables previstos: `base.html` (lo que hoy hace `layout.js`), `catalog/_product_card.html`
(lo que hoy hace `productCardHTML`), `cart/_cart_line.html` y `_messages.html` (alertas con `flash`).

Listas que Jinja2 generará con `{% for %}`: categorías, destacados, catálogo, líneas del carrito,
resumen del pedido, historial de pedidos y tablas del panel administrativo.
