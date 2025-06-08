document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartItemsList = document.getElementById("cart-items");
    const totalPriceElem = document.getElementById("total-price");

    let total = 0;

    if (cartItemsList) {
        cart.forEach(item => {
            const li = document.createElement("li");
            const subtotal = item.price * item.quantity;
            li.textContent = `${item.name} x ${item.quantity} - Rp ${subtotal.toLocaleString("id-ID")}`;
            cartItemsList.appendChild(li);
            total += subtotal;
        });
    }

    if (totalPriceElem) {
        totalPriceElem.textContent = "Rp " + total.toLocaleString("id-ID");
    }

    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            if (cart.length === 0) {
                alert("Keranjang Anda kosong. Tidak dapat melanjutkan checkout.");
                return;
            }

            const name = document.getElementById("name").value;
            const address = document.getElementById("address").value;
            const payment = document.getElementById("payment").value;

            const items = cart.map(item => ({
                productID: parseInt(item.id),
                name: item.name,
                price: parseFloat(item.price),
                quantity: item.quantity || 1
            }));

            const orderData = {
                userID: 1, // Ganti dengan ID user yang login kalau tersedia dari token
                name,
                address,
                payment,
                total,
                items
            };

            try {
                const response = await fetch("/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderData)
                });

                if (response.ok) {
                    alert("Pesanan berhasil dilakukan!");
                    localStorage.removeItem("cart");
                    window.location.href = "/home";
                } else {
                    const errorData = await response.json();
                    alert(`Gagal checkout: ${errorData.error || 'Silakan coba lagi.'}`);
                }
            } catch (error) {
                console.error("Checkout error:", error);
                alert("Terjadi kesalahan saat melakukan checkout.");
            }
        });
    }
});
