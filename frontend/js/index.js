document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("featured-product-container");
    const cartCountElement = document.querySelector(".cart-count");

    // Fungsi cek login
    function isUserLoggedIn() {
        return !!localStorage.getItem("token");
    }

    // Update jumlah item pada ikon keranjang
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    };

    // Update UI user (tidak diubah)
    const updateUserInterface = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const userIconLink = document.querySelector(".user-icon-link");

        if (!userIconLink) return;

        if (user) {
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
                </div>
            `;
            const logoutBtn = document.getElementById("logoutBtn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    localStorage.removeItem("cart");
                    alert("Logout berhasil!");
                    window.location.href = "/home";
                });
            }
            const profileBtn = document.getElementById("profileBtn");
            if (profileBtn) {
                profileBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    window.location.href = "/profile";
                });
            }
        } else {
            userIconLink.innerHTML = '<i class="ri-user-line"></i>';
            userIconLink.href = "/login";
        }
    };

    // Ambil produk unggulan (hanya 4 produk)
    const fetchFeaturedProducts = async () => {
        try {
            const response = await fetch("/api/products");

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const products = await response.json();

            if (!products || products.length === 0) {
                productContainer.innerHTML = "<p>Tidak ada produk tersedia.</p>";
                return;
            }

            productContainer.innerHTML = "";
            const featuredProducts = products.slice(0, 4);

            featuredProducts.forEach((product) => {
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
                    </div>
                `;
                productContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Gagal mengambil produk unggulan:", error);
            productContainer.innerHTML = "<p>Terjadi kesalahan saat memuat produk. Silakan refresh halaman.</p>";
        }
    };

    // Event listener untuk tombol "Tambah ke Keranjang" dengan validasi login
    productContainer.addEventListener("click", async (e) => {
        if (e.target.classList.contains("add-to-cart") || e.target.closest(".add-to-cart")) {
            // Validasi login di sini
            if (!isUserLoggedIn()) {
                alert("Silakan login terlebih dahulu untuk menambah produk ke keranjang!");
                window.location.href = "/login";
                return;
            }

            const button = e.target.classList.contains("add-to-cart")
                ? e.target
                : e.target.closest(".add-to-cart");

            const stock = parseInt(button.dataset.stock);

            if (stock <= 0) {
                alert("Stok produk tidak tersedia.");
                return;
            }

            const product = {
                id: parseInt(button.dataset.id),
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image
            };

            try {
                // Update stok di server
                const response = await fetch("/api/cart/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId: product.id, quantity: 1 }),
                });

                if (!response.ok) {
                    throw new Error("Gagal memperbarui stok");
                }

                // Update cart di localStorage
                let cart = JSON.parse(localStorage.getItem("cart") || "[]");
                const existingItem = cart.find(item => item.id === product.id);

                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    product.quantity = 1;
                    cart.push(product);
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();

                // Update UI
                const newStock = stock - 1;
                button.dataset.stock = newStock;
                const stockElement = button.previousElementSibling;
                if (stockElement && stockElement.tagName === 'SMALL') {
                    stockElement.textContent = `Stok: ${newStock}`;
                }

                if (newStock === 0) {
                    button.disabled = true;
                    button.innerHTML = '<i class="ri-shopping-cart-line"></i> Stok Habis';
                } else {
                    // Feedback visual
                    const originalHTML = button.innerHTML;
                    button.innerHTML = '<i class="ri-check-line"></i> Ditambahkan';
                    button.style.backgroundColor = "#51cf66";

                    setTimeout(() => {
                        button.innerHTML = originalHTML;
                        button.style.backgroundColor = "";
                    }, 1500);
                }

                alert(`${product.name} ditambahkan ke keranjang!`);
            } catch (error) {
                console.error("Error adding to cart:", error);
                alert("Gagal menambahkan produk ke keranjang. Silakan coba lagi.");
            }
        }
    });

    // Inisialisasi halaman
    fetchFeaturedProducts();
    updateCartCount();
    updateUserInterface();
});
