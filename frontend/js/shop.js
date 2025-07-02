document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("product-container");
    const cartCountElement = document.querySelector(".cart-count");

    // ===================== Fungsi Helper: Cek Apakah User Login =====================
    function isUserLoggedIn() {
        return !!localStorage.getItem("token");
    }

    // ===================== Update Jumlah Item di Keranjang =====================
    const updateCartCount = () => {
        try {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            if (cartCountElement) {
                cartCountElement.textContent = totalItems;
            }
        } catch (err) {
            console.error("Gagal membaca keranjang:", err);
            cartCountElement.textContent = "0";
        }
    };

    // ===================== Ambil dan Tampilkan Daftar Produk =====================
    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products");
            if (!response.ok) throw new Error("Respon gagal");

            const products = await response.json();
            if (!Array.isArray(products)) throw new Error("Data produk tidak valid");

            productContainer.innerHTML = "";
            products.forEach((product) => {
                if (!product || !product.name || !product.price || !product.image) return;

                const card = document.createElement("div");
                card.className = "product-card";
                card.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" />
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <div class="product-price">Rp ${product.price.toLocaleString("id-ID")}</div>
                        <small>Stok: ${product.stock}</small>
                        <button class="add-to-cart" 
                            data-id="${product.ID}" 
                            data-name="${product.name}" 
                            data-price="${product.price}" 
                            data-image="${product.image}"
                            data-stock="${product.stock}" 
                            ${product.stock === 0 ? 'disabled' : ''}>
                            <i class="ri-shopping-cart-line"></i> ${product.stock === 0 ? 'Stok Habis' : 'Tambah'}
                        </button>
                    </div>`;
                productContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Gagal memuat produk:", error);
            productContainer.innerHTML = "<p>Terjadi kesalahan saat memuat produk.</p>";
        }
    };

    // ===================== Tambah Produk ke Keranjang =====================
    productContainer.addEventListener("click", async (e) => {
        if (e.target.closest(".add-to-cart")) {
            const button = e.target.closest(".add-to-cart");

            if (!isUserLoggedIn()) {
                alert("Silakan login terlebih dahulu.");
                window.location.href = "/login";
                return;
            }

            const stock = parseInt(button.dataset.stock);
            if (isNaN(stock) || stock <= 0) {
                alert("Stok tidak tersedia.");
                return;
            }

            const product = {
                id: parseInt(button.dataset.id),
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image
            };

            if (isNaN(product.id) || isNaN(product.price)) {
                alert("Data produk tidak valid.");
                return;
            }

            try {
                const response = await fetch("/api/cart/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId: product.id, quantity: 1 })
                });

                if (!response.ok) throw new Error("Gagal update stok di server.");

                const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                const existingItem = cart.find(item => item.id === product.id);

                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    product.quantity = 1;
                    cart.push(product);
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                alert(`${product.name} ditambahkan ke keranjang!`);

                button.dataset.stock = stock - 1;
                fetchProducts();
            } catch (err) {
                console.error(err);
                alert("Terjadi kesalahan saat menambahkan produk.");
            }
        }
    });

    // ===================== Update UI Jika User Sudah Login =====================
    const updateUserInterface = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const userIconLink = document.querySelector(".user-icon-link");

        if (!userIconLink) return;

        if (user && user.email) {
            userIconLink.innerHTML = `
                <div class="user-dropdown">
                    <button class="user-button">
                        <i class="ri-user-line"></i>
                        <span class="user-email">${user.email}</span>
                        <i class="ri-arrow-down-s-line dropdown-arrow"></i>
                    </button>
                    <div class="dropdown-menu">
                        <a href="#" class="dropdown-item" id="profileBtn">
                            <i class="ri-user-settings-line"></i> Profile
                        </a>
                        <a href="#" class="dropdown-item" id="logoutBtn">
                            <i class="ri-logout-box-line"></i> Logout
                        </a>
                    </div>
                </div>`;

            document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.clear();
                alert("Logout berhasil!");
                window.location.href = "/home";
            });

            document.getElementById("profileBtn")?.addEventListener("click", (e) => {
                e.preventDefault();
                window.location.href = "/profile";
            });
        } else {
            userIconLink.innerHTML = '<i class="ri-user-line"></i>';
            userIconLink.href = "/login";
        }
    };

    // ===================== Inisialisasi Aplikasi =====================
    fetchProducts();
    updateCartCount();
    updateUserInterface();
});
