/* =========================================================
   TecnoAccesorios - Datos de demostración (Avance 1)
   ---------------------------------------------------------
   Fuente ÚNICA de productos y categorías. La usan inicio,
   catálogo, detalle, carrito, pago y panel administrativo.
   En el Avance 2 estos datos pasan a SQLite (tablas
   categories y products) y este archivo se elimina.
   Responsable: Bianka Martínez Gamboa
   ========================================================= */

// Licencia de TODAS las fotos de producto (se muestra en detalle y catálogo).
// Unsplash permite uso gratuito, incluso comercial; el crédito es voluntario.
const IMAGE_LICENSE = "Licencia Unsplash";

const CATEGORIES = [
  { id: "audio",       name: "Audio",           image: "img/categories/audio.jpg" },
  { id: "charging",    name: "Carga y energía", image: "img/categories/charging.jpg" },
  { id: "peripherals", name: "Periféricos",     image: "img/categories/peripherals.jpg" }
];

const PRODUCTS = [
  // ---------- AUDIO ----------
  {
    id: 1,
    name: "Audífonos inalámbricos Tune 520BT",
    description: "Audífonos on-ear con Bluetooth 5.3, hasta 57 horas de batería y micrófono para llamadas.",
    category: "audio",
    price: 29900,
    images: [
      { src: "img/products/p01.jpg", author: "Valentina Tamayo", url: "https://unsplash.com/photos/a-close-up-of-a-pair-of-headphones-Kv7It-09g6U" },
      { src: "img/products/p01-2.jpg", author: "Caio Pezzo", url: "https://unsplash.com/photos/white-jbl-wireless-headphones-GpbJK8Tk0Tk" }
    ],
    stock: 15,
    brand: "JBL",
    compatibility: "Android, iOS, Windows y macOS (Bluetooth)",
    featured: true
  },
  {
    id: 2,
    name: "Audífonos in-ear Galaxy Buds FE",
    description: "Audífonos intrauditivos con cancelación activa de ruido y estuche de carga.",
    category: "audio",
    price: 49900,
    images: [
      { src: "img/products/p02.jpg", author: "Daniel Romero", url: "https://unsplash.com/photos/person-holding-black-round-plastic-EETAEub4A4A" },
      { src: "img/products/p02-2.jpg", author: "Daniel Romero", url: "https://unsplash.com/photos/person-holding-black-game-controller-K63lOA4Ijyk" }
    ],
    illustrative: true,
    stock: 8,
    brand: "Samsung",
    compatibility: "Android (funciones completas en Galaxy); iOS solo audio básico",
    featured: false
  },
  {
    id: 3,
    name: "Parlante portátil Flip Essential",
    description: "Parlante Bluetooth resistente al agua IPX7, ideal para exteriores.",
    category: "audio",
    price: 54900,
    images: [
      { src: "img/products/p03.jpg", author: "Mariah Hewines", url: "https://unsplash.com/photos/a-black-bag-in-the-water-spTJbsZaclk" },
      { src: "img/products/p03-2.jpg", author: "Daren Inshape", url: "https://unsplash.com/photos/a-man-holding-a-black-speaker-in-his-hand-Twinih9fIog" }
    ],
    stock: 5,
    brand: "JBL",
    compatibility: "Cualquier dispositivo con Bluetooth 4.2 o superior",
    featured: true
  },
  {
    id: 4,
    name: "Diadema gamer Cloud Stinger 2",
    description: "Diadema para videojuegos con micrófono abatible y almohadillas de espuma viscoelástica.",
    category: "audio",
    price: 32500,
    images: [
      { src: "img/products/p04.jpg", author: "Dom", url: "https://unsplash.com/photos/black-and-red-headphones-on-brown-wooden-table-utRgGWjrS7k" },
      { src: "img/products/p04-2.jpg", author: "Fausto Sandoval", url: "https://unsplash.com/photos/black-and-red-corded-headphones-on-white-table-w5m3PIGvkqI" }
    ],
    stock: 0,
    brand: "HyperX",
    compatibility: "PC, PS5, Xbox Series y Nintendo Switch (conector 3,5 mm)",
    featured: false
  },

  // ---------- CARGA Y ENERGÍA ----------
  {
    id: 5,
    name: "Cargador de pared 67 W USB-C",
    description: "Cargador compacto de 67 W con carga rápida para teléfonos, tabletas y laptops pequeñas.",
    category: "charging",
    price: 14900,
    images: [
      { src: "img/products/p05.jpg", author: "Andrey Matveev", url: "https://unsplash.com/photos/a-couple-of-white-wires-sitting-next-to-each-other-f0EpYkZ-cp4" },
      { src: "img/products/p05-2.jpg", author: "JESUS ECA", url: "https://unsplash.com/photos/white-usb-cable-on-white-surface-pAO3likB4BE" }
    ],
    illustrative: true,
    stock: 25,
    brand: "Anker",
    compatibility: "iPhone 15/16, Samsung Galaxy, iPad y laptops USB-C de bajo consumo",
    featured: true
  },
  {
    id: 6,
    name: "Batería externa 20 000 mAh",
    description: "Power bank con dos puertos USB-A y un puerto USB-C de 22,5 W.",
    category: "charging",
    price: 24900,
    images: [
      { src: "img/products/p06.jpg", author: "Markus Winkler", url: "https://unsplash.com/photos/white-electronic-device-on-green-textile-JHEIAnOXbkc" },
      { src: "img/products/p06-2.jpg", author: "Andrey Matveev", url: "https://unsplash.com/photos/white-power-bank-with-three-charging-cables-7JbgHNq4h4k" }
    ],
    stock: 12,
    brand: "Xiaomi",
    compatibility: "Teléfonos, audífonos y relojes con carga USB",
    featured: false
  },
  {
    id: 7,
    name: "Cable USB-C a Lightning 1 m",
    description: "Cable trenzado con certificación MFi para carga rápida y transferencia de datos.",
    category: "charging",
    price: 8500,
    images: [
      { src: "img/products/p07.jpg", author: "Adam Birkett", url: "https://unsplash.com/photos/iphone-cable-1M0omkZlGM4" },
      { src: "img/products/p07-2.jpg", author: "Manahil Manstashah", url: "https://unsplash.com/photos/white-usb-cable-on-white-surface-4pdahuUVGZs" }
    ],
    stock: 40,
    brand: "Baseus",
    compatibility: "iPhone 8 a iPhone 14 y AirPods con puerto Lightning",
    featured: false
  },
  {
    id: 8,
    name: "Base de carga inalámbrica 15 W",
    description: "Cargador Qi2 tipo pad con indicador LED y protección contra sobrecalentamiento.",
    category: "charging",
    price: 18900,
    images: [
      { src: "img/products/p08.jpg", author: "Studio Proper", url: "https://unsplash.com/photos/white-round-plastic-frame-on-black-table-CWWa6f1EB5g" },
      { src: "img/products/p08-2.jpg", author: "Studio Proper", url: "https://unsplash.com/photos/black-and-gray-computer-mouse-beside-black-computer-keyboard-EfwdRR4OYAM" }
    ],
    illustrative: true,
    stock: 3,
    brand: "Belkin",
    compatibility: "Teléfonos con carga inalámbrica Qi/Qi2 (iPhone 12 o superior, Galaxy S)",
    featured: false
  },

  // ---------- PERIFÉRICOS ----------
  {
    id: 9,
    name: "Mouse inalámbrico M240 Silent",
    description: "Mouse silencioso con Bluetooth, diseño ambidiestro y hasta 18 meses de batería.",
    category: "peripherals",
    price: 12900,
    images: [
      { src: "img/products/p09.jpg", author: "Auguras Pipiras", url: "https://unsplash.com/photos/black-and-gray-cordless-computer-mouse-ta7Y61vwnJ8" },
      { src: "img/products/p09-2.jpg", author: "Auguras Pipiras", url: "https://unsplash.com/photos/black-cordless-computer-mouse-on-white-surface-d62p4lEN4R0" }
    ],
    illustrative: true,
    stock: 20,
    brand: "Logitech",
    compatibility: "Windows, macOS, ChromeOS, iPadOS y Android",
    featured: true
  },
  {
    id: 10,
    name: "Teclado mecánico Kumara K552",
    description: "Teclado mecánico compacto TKL con switches rojos e iluminación RGB.",
    category: "peripherals",
    price: 27900,
    images: [
      { src: "img/products/p10.jpg", author: "JL Cabrera", url: "https://unsplash.com/photos/a-computer-keyboard-with-a-red-button-on-it-0gEra2HHQbQ" },
      { src: "img/products/p10-2.jpg", author: "JL Cabrera", url: "https://unsplash.com/photos/a-close-up-of-a-keyboard-with-a-red-button-4XoIpoGHY3I" },
      { src: "img/products/p10-3.jpg", author: "JL Cabrera", url: "https://unsplash.com/@thekidph" }
    ],
    illustrative: true,
    stock: 7,
    brand: "Redragon",
    compatibility: "PC con Windows y Linux (USB); macOS con funciones limitadas",
    featured: false
  },
  {
    id: 11,
    name: "Hub USB-C 7 en 1",
    description: "Adaptador con HDMI 4K, 3 puertos USB-A, lector SD/microSD y carga PD de 100 W.",
    category: "peripherals",
    price: 22900,
    images: [
      { src: "img/products/p11.jpg", author: "Andrey Matveev", url: "https://unsplash.com/photos/a-computer-mouse-sitting-on-top-of-a-white-table-TAsJIiyS_nM" }
    ],
    illustrative: true,
    stock: 10,
    brand: "UGREEN",
    compatibility: "MacBook, laptops Windows y tabletas con puerto USB-C",
    featured: false
  },
  {
    id: 12,
    name: "Cámara web C920 Full HD",
    description: "Cámara 1080p con dos micrófonos estéreo y corrección automática de luz.",
    category: "peripherals",
    price: 45900,
    images: [
      { src: "img/products/p12.jpg", author: "Emiliano Cicero", url: "https://unsplash.com/photos/black-and-silver-speaker-on-white-table-lq87UxGSiEQ" },
      { src: "img/products/p12-2.jpg", author: "Ernest Ojeh", url: "https://unsplash.com/photos/black-speaker-on-white-table-cJGDRjl0TEs" }
    ],
    illustrative: true,
    stock: 4,
    brand: "Logitech",
    compatibility: "Windows, macOS y ChromeOS; Zoom, Teams y Meet",
    featured: false
  }
];

// La foto principal de cada producto (images[0]) también se guarda en "image",
// que es el campo que usan las tarjetas, el carrito y el panel administrativo.
PRODUCTS.forEach(p => { p.image = p.images[0].src; });
