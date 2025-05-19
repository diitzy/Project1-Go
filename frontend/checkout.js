// Ambil data dari localStorage
const cart = JSON.parse(localStorage.getItem("cart") || "[]");

// Referensi elemen DOM
const cartItems = document.getElementById("cart-items");
const totalPriceElem = document.getElementById("total-price");

// Tampilkan item dalam keranjang dan hitung total harga
let total = 0;

cart.forEach(item => {
  const li = document.createElement("li");
  li.textContent = `${item.name} x${item.quantity} - Rp${(item.price * item.quantity).toLocaleString()}`;
  cartItems.appendChild(li);
  total += item.price * item.quantity;
});

// Tampilkan total harga ke elemen total
totalPriceElem.textContent = "Rp" + total.toLocaleString();

// Event listener untuk submit form checkout
document.getElementById("checkout-form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Mencegah reload halaman saat submit

  // Ambil nilai dari input dan siapkan payload data
  const data = {
    name: document.getElementById("name").value,
    address: document.getElementById("address").value,
    payment: document.getElementById("payment").value,
    cart: cart
  };

  try {
    // Kirim data checkout ke server menggunakan Fetch API
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    // Cek respons dari server
    if (response.ok) {
      alert("Pesanan berhasil dilakukan!");
      localStorage.removeItem("cart"); // Kosongkan keranjang
      window.location.href = "/home";  // Redirect ke halaman utama
    } else {
      alert("Gagal melakukan checkout.");
    }
  } catch (error) {
    // Tangani error jaringan atau server
    console.error("Checkout error:", error);
    alert("Terjadi kesalahan saat checkout.");
  }
});
