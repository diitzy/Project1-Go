document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("product-container");
    const cartCountElement = document.querySelector(".cart-count");

    // Fungsi untuk memperbarui jumlah item di ikon keranjang
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    };

    // Ambil produk dari API dan tampilkan
    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products");
            const products = await response.json();

            if (!products) {
                productContainer.innerHTML = "<p>Gagal memuat produk.</p>";
                return;
            }

            productContainer.innerHTML = ""; // Kosongkan kontainer
            products.forEach((product) => {
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
            console.error("Gagal mengambil produk:", error);
            productContainer.innerHTML = "<p>Terjadi kesalahan saat memuat produk.</p>";
        }
    };

    // Event listener untuk tombol "Tambah ke Keranjang"
    productContainer.addEventListener("click", async (e) => {
        if (e.target.classList.contains("add-to-cart")) {
            const button = e.target;
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

            // Panggil API untuk mengurangi stok di backend
            const response = await fetch("/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id, quantity: 1 }),
            });

            if (!response.ok) {
                alert("Gagal memperbarui stok. Silakan coba lagi.");
                return;
            }

            // Kelola keranjang di localStorage
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
            alert(`${product.name} ditambahkan ke keranjang!`);
            
            // Perbarui stok di UI dan muat ulang produk
            button.dataset.stock = stock - 1;
            fetchProducts();
        }
    });

    // Panggil fungsi saat halaman dimuat
    fetchProducts();
    updateCartCount();
});