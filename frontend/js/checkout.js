// checkout.js — versi aman, redirect jika belum login

document.addEventListener("DOMContentLoaded", () => {
    // --- CEK LOGIN SAAT AKSES HALAMAN ---
    if (!localStorage.getItem("token")) {
        alert("Silakan login terlebih dahulu untuk melakukan checkout.");
        window.location.href = "/login";
        return; // Stop eksekusi JS jika tidak login
    }

    // --- TAMPILKAN RINGKASAN BELANJA ---
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartItemsList = document.getElementById("cart-items");
    const totalPriceElem = document.getElementById("total-price");

    let total = 0;
    cartItemsList.innerHTML = "";

    if (cartItems.length === 0) {
        cartItemsList.innerHTML = "<li>Keranjang kosong.</li>";
        totalPriceElem.textContent = "Rp0";
    } else {
        cartItems.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            const li = document.createElement("li");
            li.innerHTML = `
                <div>
                    <strong>${item.name}</strong> &times; ${item.quantity}
                    <span style="float:right;">Rp ${subtotal.toLocaleString("id-ID")}</span>
                </div>
            `;
            cartItemsList.appendChild(li);
        });

        totalPriceElem.textContent = "Rp" + total.toLocaleString("id-ID");
    }

    // --- HANDLE SUBMIT FORM CHECKOUT ---
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            // Validasi input (nama, alamat, metode bayar)
            const name = document.getElementById("name").value.trim();
            const address = document.getElementById("address").value.trim();
            const payment = document.getElementById("payment").value;

            if (!name || !address || !payment) {
                alert("Mohon lengkapi semua data pemesan.");
                return;
            }

            if (cartItems.length === 0) {
                alert("Keranjang belanja Anda kosong.");
                return;
            }

            // Siapkan data order
            const orderData = {
                name,
                address,
                payment,
                cart: cartItems
            };

            try {
                // Kirim ke backend (assume endpoint /api/orders, sesuaikan jika beda)
                const response = await fetch("/api/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                    body: JSON.stringify(orderData)
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.message || "Gagal melakukan pemesanan.");
                }

                // Berhasil!
                alert("Pemesanan berhasil! Terima kasih sudah belanja.");
                // Kosongkan keranjang di localStorage
                localStorage.removeItem("cart");
                // Redirect ke halaman sukses, home, atau order history
                window.location.href = "/home";
            } catch (err) {
                alert("Checkout gagal: " + err.message);
            }
        });
    }
});
