// profil.js
document.addEventListener('DOMContentLoaded', function () {
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
    editBtn.addEventListener('click', function () {
        Array.from(form.elements).forEach(input => input.disabled = false);
        formActions.style.display = 'flex';
    });

    // Cancel Edit
    document.getElementById('cancel-btn').addEventListener('click', function () {
        Array.from(form.elements).forEach(input => input.disabled = true);
        formActions.style.display = 'none';
    });

    // Simpan perubahan (contoh, simpan ke localStorage)
    form.addEventListener('submit', function (e) {
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
