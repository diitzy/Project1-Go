// Ambil data dari localStorage
const cart = JSON.parse(localStorage.getItem("cart") || "[]");
const cartItems = document.getElementById("cart-items");
const totalPriceElem = document.getElementById("total-price");

// Tampilkan item cart dan total
let total = 0;
cart.forEach(item => {
  const li = document.createElement("li");
  li.textContent = `${item.name} x${item.quantity} - Rp${(item.price * item.quantity).toLocaleString()}`;
  cartItems.appendChild(li);
  total += item.price * item.quantity;
});
totalPriceElem.textContent = "Rp" + total.toLocaleString();

// Submit form checkout
document.getElementById("checkout-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    address: document.getElementById("address").value,
    payment: document.getElementById("payment").value,
    cart: cart
  };

  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert("Pesanan berhasil dilakukan!");
      localStorage.removeItem("cart");
      window.location.href = "/home";
    } else {
      alert("Gagal melakukan checkout.");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    alert("Terjadi kesalahan saat checkout.");
  }
});
