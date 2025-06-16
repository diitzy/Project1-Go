document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("token")) {
    alert("Silakan login terlebih dahulu untuk melakukan checkout.");
    window.location.href = "/login";
    return;
  }

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
      li.innerHTML = `<strong>${item.name}</strong> &times; ${item.quantity} - Rp ${subtotal.toLocaleString("id-ID")}`;
      cartItemsList.appendChild(li);
    });
    totalPriceElem.textContent = "Rp" + total.toLocaleString("id-ID");
  }

  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", async function (e) {
      e.preventDefault();

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

      cartItems.forEach(item => {
        delete item.id;  // pastikan tidak kirim ID ke backend
      });

      const orderData = { name, address, payment, items: cartItems };

      try {
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
        localStorage.removeItem("cart");
        window.location.href = "/home";
      } catch (err) {
        alert("Checkout gagal: " + err.message);
      }
    });
  }
  console.log("ORDER YANG DIKIRIM:", JSON.stringify(orderData, null, 2));

});
