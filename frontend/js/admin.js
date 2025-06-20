document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    const tableBody = document.querySelector('#product-table tbody');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    const cancelEditButton = document.getElementById('cancel-edit');
    const hiddenId = document.getElementById('product-id');
    const imagePreview = document.getElementById('image-preview');
    const imageInput = document.getElementById('image');
    const orderSection = document.getElementById("order-section");
    const productSection = document.getElementById("product-section");

    const PUBLIC_API_BASE_URL = '/api/products';
    const ADMIN_API_BASE_URL = '/admin/products';

    const getToken = () => localStorage.getItem('token');

    const fetchProducts = async () => {
        try {
            const response = await fetch(PUBLIC_API_BASE_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const products = await response.json();

            tableBody.innerHTML = '';
            if (products && products.length > 0) {
                products.forEach(product => {
                    const productId = product.ID || product.id;
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${product.name}</td>
                        <td>Rp ${product.price ? product.price.toLocaleString('id-ID') : '0'}</td>
                        <td>${product.stock !== undefined ? product.stock : '0'}</td>
                        <td><img src="${product.image || 'https://placehold.co/50x50/eee/ccc?text=N/A'}" alt="${product.name}" width="50" onerror="this.onerror=null;this.src='https://placehold.co/50x50/eee/ccc?text=Error';"></td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editProduct(${productId})">Edit</button>
                            <button class="action-btn delete-btn" onclick="deleteProduct(${productId})">Hapus</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="5">Tidak ada produk.</td></tr>';
            }
        } catch (error) {
            console.error('Gagal mengambil produk:', error);
            tableBody.innerHTML = `<tr><td colspan="5">Gagal memuat produk: ${error.message}. Coba muat ulang halaman.</td></tr>`;
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', document.getElementById('name').value);
        formData.append('price', parseFloat(document.getElementById('price').value));
        formData.append('stock', parseInt(document.getElementById('stock').value));

        const imageFile = imageInput.files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const id = hiddenId.value;
        let url = ADMIN_API_BASE_URL;
        let method = 'POST';

        if (id) {
            url = `${ADMIN_API_BASE_URL}/${id}`;
            method = 'PUT';
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${getToken()}`
                },
                body: formData,
            });

            if (response.ok) {
                resetForm();
                fetchProducts();
                showNotification(id ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!', 'success');
            } else {
                const text = await response.text();
                try {
                    const errorData = JSON.parse(text);
                    console.error('Gagal menyimpan produk:', errorData);
                    showNotification(`Gagal menyimpan produk: ${errorData.error || response.statusText}`, 'error');
                } catch (e) {
                    console.error('Respon bukan JSON:', text);
                    showNotification(`Terjadi kesalahan: ${text}`, 'error');
                }
            }
        } catch (error) {
            console.error('Error saat submit form:', error);
            showNotification(`Terjadi kesalahan: ${error.message}`, 'error');
        }
    });

    const resetForm = () => {
        form.reset();
        hiddenId.value = '';
        imageInput.value = '';
        formTitle.textContent = 'Tambah Produk Baru';
        submitButton.textContent = 'Simpan Produk';
        cancelEditButton.style.display = 'none';
        imagePreview.src = '';
        imagePreview.style.display = 'none';
    };

    window.editProduct = async (id) => {
        try {
            const response = await fetch(`${PUBLIC_API_BASE_URL}/${id}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const product = await response.json();

            hiddenId.value = product.ID || product.id;
            document.getElementById('name').value = product.name;
            document.getElementById('price').value = product.price;
            document.getElementById('stock').value = product.stock;

            if (product.image) {
                imagePreview.src = product.image;
                imagePreview.style.display = 'block';
            } else {
                imagePreview.style.display = 'none';
            }

            formTitle.textContent = 'Edit Produk';
            submitButton.textContent = 'Update Produk';
            cancelEditButton.style.display = 'inline-block';
        } catch (error) {
            console.error('Gagal mengambil detail produk untuk diedit:', error);
            showNotification(`Gagal mengambil detail produk: ${error.message}`, 'error');
        }
    };

    cancelEditButton.addEventListener('click', resetForm);

    window.deleteProduct = async (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            try {
                const response = await fetch(`${ADMIN_API_BASE_URL}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                });

                if (response.ok) {
                    fetchProducts();
                    showNotification('Produk berhasil dihapus!', 'success');
                } else {
                    const text = await response.text();
                    try {
                        const errorData = JSON.parse(text);
                        console.error('Gagal menghapus produk:', errorData);
                        showNotification(`Gagal menghapus produk: ${errorData.error || response.statusText}`, 'error');
                    } catch (e) {
                        console.error('Respon bukan JSON:', text);
                        showNotification(`Terjadi kesalahan: ${text}`, 'error');
                    }
                }
            } catch (error) {
                console.error('Error saat menghapus produk:', error);
                showNotification(`Terjadi kesalahan saat menghapus: ${error.message}`, 'error');
            }
        }
    };

    function showNotification(message, type = 'info') {
        const notificationArea = document.getElementById('notification-area') || createNotificationArea();
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notificationArea.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function createNotificationArea() {
        const area = document.createElement('div');
        area.id = 'notification-area';
        area.style.position = 'fixed';
        area.style.top = '20px';
        area.style.right = '20px';
        area.style.zIndex = '1000';
        document.body.appendChild(area);
        return area;
    }

    const styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = `
        .notification { padding: 10px 20px; margin-bottom: 10px; border-radius: 5px; color: white; }
        .notification.success { background-color: #4CAF50; }
        .notification.error { background-color: #f44336; }
        .notification.info { background-color: #2196F3; }
    `;
    document.head.appendChild(styleSheet);

    // 🔐 Handler untuk logout
    const logoutLink = document.querySelector('.nav-link[href="/home"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token'); // Hapus token
            window.location.href = '/home';   // Arahkan ke halaman login atau home
        });
    }

    document.querySelector('a[href="#order-section"]').addEventListener("click", (e) => {
        e.preventDefault();
        productSection.style.display = "none";
        orderSection.style.display = "block";
        loadOrders();
    });

    document.querySelector('a[href="#product-section"]').addEventListener("click", (e) => {
        e.preventDefault();
        orderSection.style.display = "none";
        productSection.style.display = "block";
    });

    fetchProducts();
});

async function loadOrders() {
    const tableBody = document.querySelector("#order-table tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    try {
        const res = await fetch("http://localhost:8080/admin/orders");
        const orders = await res.json();

        orders.forEach(order => {
            const row = document.createElement("tr");

            const items = order.Items.map(item =>
                `${item.Name} (${item.Quantity} x ${item.Price})`
            ).join("<br>");

            row.innerHTML = `
                <td>${order.ID}</td>
                <td>${order.Name}</td>
                <td>${order.Address}</td>
                <td>${order.Payment}</td>
                <td>Rp ${order.Total.toLocaleString("id-ID")}</td>
                <td style="display: flex; justify-content: space-between; align-items: center;">
                    <span>
                        ${order.Items.map(item => `${item.Name} (${item.Quantity} x ${item.Price})`).join("<br>")}
                    </span>
                    <button style="margin-left: 10px;" onclick='printSingleOrder(${JSON.stringify(order).replace(/'/g, "\\'")})'>
                        🖨️ Print
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Gagal mengambil data pesanan:", error);
    }
}

function printSingleOrder(order) {
    const printWindow = window.open('', '', 'width=800,height=600');
    const itemRows = order.Items.map(item => {
        return `<tr>
            <td>${item.Name}</td>
            <td>${item.Quantity}</td>
            <td>Rp ${item.Price.toLocaleString("id-ID")}</td>
            <td>Rp ${(item.Price * item.Quantity).toLocaleString("id-ID")}</td>
        </tr>`;
    }).join('');

    printWindow.document.write(`
        <html>
        <head>
            <title>Detail Pesanan</title>
            <style>
                body { font-family: Arial; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { padding: 8px; border: 1px solid #000; text-align: left; }
            </style>
        </head>
        <body>
            <h2>Pesanan ID: ${order.ID}</h2>
            <p><strong>Nama:</strong> ${order.Name}</p>
            <p><strong>Alamat:</strong> ${order.Address}</p>
            <p><strong>Metode Pembayaran:</strong> ${order.Payment}</p>
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
                    ${itemRows}
                </tbody>
            </table>
            <h3>Total: Rp ${order.Total.toLocaleString("id-ID")}</h3>
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
