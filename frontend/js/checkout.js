document.addEventListener("DOMContentLoaded", () => {
    // Cek apakah user sudah login (harus ada token)
    if (!localStorage.getItem("token")) {
        alert("Silakan login terlebih dahulu untuk melakukan checkout.");
        window.location.href = "/login";
        return;
    }

    // Ambil data keranjang dari localStorage
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartItemsList = document.getElementById("cart-items");
    const totalPriceElem = document.getElementById("total-price");

    let total = 0;
    cartItemsList.innerHTML = "";

    // Tampilkan pesan jika keranjang kosong
    if (cartItems.length === 0) {
        cartItemsList.innerHTML = "<li>Keranjang kosong.</li>";
        totalPriceElem.textContent = "Rp0";
    } else {
        // Render setiap item dalam keranjang
        cartItems.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            const li = document.createElement("li");
            li.innerHTML = `<strong>${item.name}</strong> &times; ${item.quantity} - Rp ${subtotal.toLocaleString("id-ID")}`;
            cartItemsList.appendChild(li);
        });

        // Tampilkan total harga semua item
        totalPriceElem.textContent = "Rp" + total.toLocaleString("id-ID");
    }

    const checkoutForm = document.getElementById("checkout-form");

    // Tambahkan event listener untuk form checkout
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            // Ambil data dari form
            const name = document.getElementById("name").value.trim();
            const address = document.getElementById("address").value.trim();
            const payment = document.getElementById("payment").value;

            // Validasi input
            if (!name || !address || !payment) {
                alert("Mohon lengkapi semua data pemesan.");
                return;
            }

            if (cartItems.length === 0) {
                alert("Keranjang belanja Anda kosong.");
                return;
            }

            // Hapus ID dari tiap item sebelum dikirim ke backend
            cartItems.forEach(item => {
                delete item.id;
            });

            // Data yang akan dikirim ke server
            const orderData = {
                name,
                address,
                payment,
                items: cartItems
            };

            try {
                // Kirim data pemesanan ke server
                const response = await fetch("/checkout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                    body: JSON.stringify(orderData)
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error || "Gagal melakukan pemesanan.");
                }

                alert("Pemesanan berhasil!");
                localStorage.removeItem("cart"); // Hapus keranjang setelah sukses
                window.location.href = "/home";  // Redirect ke home
            } catch (err) {
                alert("Checkout gagal: " + err.message);
            }

            // Debug log: tampilkan data order di console
            console.log("ORDER YANG DIKIRIM:", JSON.stringify(orderData, null, 2));
        });
    }
});
