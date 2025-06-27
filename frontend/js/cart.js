document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-items-container");
    const totalPriceElem = document.querySelector(".total-price");
    const cartCountElement = document.querySelector(".cart-count");
    const checkoutBtn = document.getElementById("checkout-btn");

    // Ambil data cart dari localStorage (jika belum ada, gunakan array kosong)
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Fungsi untuk cek apakah user sudah login berdasarkan keberadaan token
    function isUserLoggedIn() {
        return !!localStorage.getItem("token");
    }

    // Fungsi untuk memperbarui jumlah item di ikon cart
    const updateCartCount = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    };

    // Fungsi untuk menampilkan isi keranjang di halaman
    const renderCart = () => {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Keranjang Anda masih kosong.</p>";
            totalPriceElem.textContent = "Rp 0";
            return;
        }

        cart.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.className = "cart-item";
            const subtotal = item.price * item.quantity;
            total += subtotal;

            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Rp ${item.price.toLocaleString("id-ID")}</p>
                    <div class="quantity-control">
                        <button class="decrease-btn" data-index="${index}">−</button>
                        <span class="quantity-display" data-index="${index}">
                            ${item.quantity}
                        </span>
                        <button class="increase-btn" data-index="${index}">+</button>
                    </div>
                    <p class="subtotal">Subtotal: Rp ${subtotal.toLocaleString("id-ID")}</p>
                </div>
                <button class="remove-btn" data-index="${index}" title="Hapus item">
                    <i class="ri-delete-bin-line"></i>
                </button>
            `;

            cartItemsContainer.appendChild(itemElement);
        });

        totalPriceElem.textContent = `Rp ${total.toLocaleString("id-ID")}`;
    };

    // Event listener untuk menghapus item dari cart (dan kirim ke server)
    cartItemsContainer.addEventListener("click", async (e) => {
        const removeButton = e.target.closest(".remove-btn");
        if (removeButton) {
            const index = parseInt(removeButton.dataset.index);
            const itemToRemove = cart[index];

            const response = await fetch("/api/cart/restore", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: itemToRemove.id,
                    quantity: itemToRemove.quantity
                }),
            });

            if (!response.ok) {
                alert("Gagal menghapus item dari server. Silakan coba lagi.");
                return;
            }

            cart.splice(index, 1);  // Hapus item dari array
            localStorage.setItem("cart", JSON.stringify(cart));  // Simpan ulang cart

            alert(`"${itemToRemove.name}" telah dihapus dari keranjang.`);
            renderCart();
            updateCartCount();
        }
    });

    // Event listener untuk tombol tambah/kurang kuantitas
    cartItemsContainer.addEventListener("click", (e) => {
        const inc = e.target.closest(".increase-btn");
        const dec = e.target.closest(".decrease-btn");

        if (inc || dec) {
            const idx = parseInt((inc || dec).dataset.index, 10);
            if (inc) {
                cart[idx].quantity += 1;
            } else if (dec && cart[idx].quantity > 1) {
                cart[idx].quantity -= 1;
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
            updateCartCount();
        }
    });

    // Handler tombol checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function (e) {
            e.preventDefault();

            if (!isUserLoggedIn()) {
                alert("Anda harus login atau register terlebih dahulu untuk checkout!");
                window.location.href = "/login";
                return;
            }

            window.location.href = "/checkout";  // Arahkan ke halaman checkout
        });
    }

    // Fungsi untuk menampilkan UI user login/logout
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

    // Jalankan fungsi saat halaman dimuat
    renderCart();
    updateCartCount();
    updateUserInterface();
});
