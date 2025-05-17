# 🛒 Project E-Commerce Web App

Ini adalah project web e-commerce sederhana yang dibangun menggunakan **Gin (Go)** di sisi backend dan **HTML/CSS/JS** di sisi frontend. Backend terstruktur secara modular dan terhubung ke database MySQL menggunakan GORM. Frontend sepenuhnya statis dan di-render dari folder publik.

---

## 📁 Struktur Proyek
project-1/
│
├── frontend/                     # 📦 Frontend statis
│   ├── img/                      # 📁 Gambar produk / asset UI
│   │   ├── about.webp
│   │   ├── bg.png
│   │   └── gambar produk 1.jpg
│   ├── about.html                # 🧾 Halaman About
│   ├── contact.html              # 🧾 Halaman Contact
│   ├── index.html                # 🧾 Halaman utama
│   ├── shop.html                 # 🧾 Halaman katalog produk
│   ├── script.js                 # 📜 Interaksi user (keranjang, tombol, dsb)
│   └── style.css                 # 🎨 Styling UI
│
├── src/                          # 📦 Backend modular
│   ├── config/                   # ⚙️ Konfigurasi database
│   │   └── config.go
│   ├── controllers/              # 🧠 Handler untuk setiap endpoint
│   │   └── product_controller.go
│   ├── models/                   # 📚 Model database
│   │   └── product.go
│   ├── routes/                   # 🌐 Definisi endpoint API & view
│   │   ├── routes.go             # -> /api/products
│   │   └── viewRoute.go          # -> /static/* untuk HTML statis
│   └── services/                 # 🔧 Logika bisnis produk
│       └── product_service.go
│
├── main.go                       # 🚀 Entry point aplikasi
├── go.mod                        # 📦 Module dependencies
└── go.sum                        # 📦 Integrity hash dependencies

---

⚙️ Fitur Utama
✅ Modular REST API dengan Gin
✅ Auto migrate GORM untuk model Product
✅ Frontend statis interaktif dengan keranjang belanja (localStorage)
✅ Arsitektur scalable dan mudah di-maintain

💡 Rencana Fitur Lanjutan
🔐 Autentikasi pengguna
🛍️ Checkout & payment simulation
📦 Manajemen stok dan kategori
📈 Dashboard admin
