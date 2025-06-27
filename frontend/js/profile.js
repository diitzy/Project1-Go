// profil.js
document.addEventListener('DOMContentLoaded', function() {
	// Ambil data user dari localStorage (setelah login)
	const user = JSON.parse(localStorage.getItem('user')) || {};
	// Contoh data tambahan jika ada
	// const token = localStorage.getItem('token');

	// Isi profil di card
	document.getElementById('profile-name').textContent = user.nama || 'Nama User';
	document.getElementById('profile-email').textContent = user.email || 'user@email.com';

	// Form input
	document.getElementById('fullname').value = user.nama || '';
	document.getElementById('email').value = user.email || '';
	document.getElementById('phone').value = user.phone || '';
	document.getElementById('birthdate').value = user.birthdate || '';
	document.getElementById('address').value = user.address || '';

	// Edit Profil Toggle
	const editBtn = document.getElementById('edit-toggle-btn');
	const form = document.getElementById('profile-form');
	const formActions = form.querySelector('.form-actions');
	editBtn.addEventListener('click', function() {
		Array.from(form.elements).forEach(input => input.disabled = false);
		formActions.style.display = 'flex';
	});

	// Cancel Edit
	document.getElementById('cancel-btn').addEventListener('click', function() {
		Array.from(form.elements).forEach(input => input.disabled = true);
		formActions.style.display = 'none';
	});

	// Simpan perubahan (contoh, simpan ke localStorage)
	form.addEventListener('submit', function(e) {
		e.preventDefault();
		const updatedUser = {
			...user,
			nama: document.getElementById('fullname').value,
			email: document.getElementById('email').value,
			phone: document.getElementById('phone').value,
			birthdate: document.getElementById('birthdate').value,
			address: document.getElementById('address').value
		};
		localStorage.setItem('user', JSON.stringify(updatedUser));
		alert('Profil berhasil diperbarui!');
		location.reload();
	});
});

async function loadUserOrders() {
	const token = localStorage.getItem("token");
	const orderContainer = document.querySelector(".order-history");

	try {
		const res = await fetch("/user/orders", {
			headers: {
				"Authorization": "Bearer " + token
			}
		});

		if (!res.ok) {
			throw new Error("Gagal memuat riwayat pesanan.");
		}

		const orders = await res.json();

		if (!orders.length) return;

		// Kosongkan kontainer sebelumnya
		orderContainer.innerHTML = "";

		orders.forEach(order => {
			const items = order.Items.map(item =>
				`<li>${item.Name} (${item.Quantity} x Rp ${item.Price.toLocaleString("id-ID")})</li>`
			).join("");

			const card = document.createElement("div");
			card.className = "order-card";
			card.innerHTML = `
                <h4>ID Pesanan: ${order.ID}</h4>
                <p><strong>Tanggal:</strong> ${new Date(order.CreatedAt).toLocaleString("id-ID")}</p>
                <p><strong>Alamat:</strong> ${order.Address}</p>
                <p><strong>Total:</strong> Rp ${order.Total.toLocaleString("id-ID")}</p>
                <ul>
                    ${order.Items.map(item => `<li>${item.Name} (${item.Quantity} x Rp ${item.Price.toLocaleString("id-ID")})</li>`).join("")}
                </ul>
                <button onclick='printOrder(${JSON.stringify(order).replace(/'/g, "\\'")})' style="margin-top: 10px;">🖨️ Cetak Pesanan Ini</button>
            `;
			orderContainer.appendChild(card);
		});
	} catch (err) {
		console.error(err);
		orderContainer.innerHTML = `<p>Gagal memuat riwayat pesanan. Silakan coba lagi nanti.</p>`;
	}
}

// Panggil saat halaman dimuat
loadUserOrders();

function printOrder(order) {
	const printWindow = window.open('', '', 'width=800,height=600');

	const itemsHtml = order.Items.map(item => `
        <tr>
            <td>${item.Name}</td>
            <td>${item.Quantity}</td>
            <td>Rp ${item.Price.toLocaleString("id-ID")}</td>
            <td>Rp ${(item.Price * item.Quantity).toLocaleString("id-ID")}</td>
        </tr>
    `).join('');

	printWindow.document.write(`
        <html>
        <head>
            <title>Pesanan #${order.ID}</title>
            <style>
                body { font-family: Arial; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { padding: 8px; border: 1px solid #000; text-align: left; }
                h2, p { margin-bottom: 5px; }
            </style>
        </head>
        <body>
            <h2>Detail Pesanan</h2>
            <p><strong>ID Pesanan:</strong> ${order.ID}</p>
            <p><strong>Tanggal:</strong> ${new Date(order.CreatedAt).toLocaleString("id-ID")}</p>
            <p><strong>Alamat:</strong> ${order.Address}</p>
            <p><strong>Total:</strong> Rp ${order.Total.toLocaleString("id-ID")}</p>

            <table>
                <thead>
                    <tr>
                        <th>Produk</th>
                        <th>Qty</th>
                        <th>Harga</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
        </body>
        </html>
    `);

	printWindow.document.close();
	printWindow.print();
}

document.getElementById("logout-btn").addEventListener("click", function() {
	localStorage.removeItem("token");
	localStorage.removeItem("user");
	// Jika pakai cookie, hapus juga cookie token-nya
	window.location.href = "/";
});


// frontend/js/profile.js

// helper untuk token
function getToken() {
	return localStorage.getItem("token"); // atau sesuai implementasi Anda
}

// render satu order ke dalam <tr>
function buildItemsHtml(items) {
  // 1) Group berdasarkan ProductID (atau Name+Price)
  const map = {};
  items.forEach(it => {
    const key = it.ProductID; // atau `${it.Name}-${it.Price}`
    if (map[key]) {
      map[key].Quantity += it.Quantity;
    } else {
      // clone object untuk aman
      map[key] = { ...it };
    }
  });

  // 2) Buat string HTML
  return Object.values(map)
    .map(i => `${i.Name} (${i.Quantity} x Rp ${i.Price.toLocaleString("id-ID")})`)
    .join("<br>");
}

// Render satu baris order
function renderUserOrder(order) {
  const date = new Date(order.CreatedAt).toLocaleString("id-ID", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });

  const itemsHtml = buildItemsHtml(order.Items);

  return `
    <tr>
      <td>${order.ID}</td>
      <td>${date}</td>
      <td>${itemsHtml}</td>
      <td>Rp ${order.Total.toLocaleString("id-ID")}</td>
      <td>${order.status}</td>
    </tr>
  `;
}

// Load & tampilkan riwayat
async function loadUserOrders() {
  const tbody = document.querySelector("#user-order-table tbody");
  tbody.innerHTML = `<tr><td colspan="5">Memuat riwayat...</td></tr>`;
  try {
    const res = await fetch("/user/orders", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    if (!res.ok) throw new Error(res.statusText);
    const orders = await res.json();
    if (!orders.length) {
      tbody.innerHTML = `<tr><td colspan="5">Belum ada pesanan.</td></tr>`;
      return;
    }
    tbody.innerHTML = orders.map(renderUserOrder).join("");
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="5">Gagal memuat: ${err.message}</td></tr>`;
  }
}

// load saat halaman siap
document.addEventListener("DOMContentLoaded", () => {
	loadUserOrders();
});