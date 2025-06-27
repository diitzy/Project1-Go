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
	const messageSection = document.getElementById("message-section");

	const PUBLIC_API_BASE_URL = '/api/products';
	const ADMIN_API_BASE_URL = '/admin/products';

	const getToken = () => localStorage.getItem('token');

	// ✅ Perbaikan: Tambahkan fungsi untuk update navigation
	function updateNavigation(activeSection) {
		// Remove active class from all nav links
		document.querySelectorAll('.sidebar nav a').forEach(link => {
			link.classList.remove('active');
		});

		// Add active class to current section
		document.querySelector(`a[href="#${activeSection}"]`).classList.add('active');

		// Hide all sections
		productSection.style.display = "none";
		orderSection.style.display = "none";
		messageSection.style.display = "none";

		// Show selected section
		document.getElementById(activeSection).style.display = "block";
	}

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

	// ✅ Perbaikan: Navigation handlers
	document.querySelector('a[href="#product-section"]').addEventListener("click", (e) => {
		e.preventDefault();
		updateNavigation("product-section");
		fetchProducts();
	});

	document.querySelector('a[href="#order-section"]').addEventListener("click", (e) => {
		e.preventDefault();
		updateNavigation("order-section");
		loadOrders();
	});

	document.querySelector('a[href="#message-section"]').addEventListener("click", (e) => {
		e.preventDefault();
		updateNavigation("message-section");
		loadMessages();
	});

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

	// ✅ Perbaikan: Fungsi loadMessages dengan error handling yang lebih baik
	async function loadMessages() {
		const tableBody = document.querySelector("#message-table tbody");

		// Show loading state
		tableBody.innerHTML = "<tr><td colspan='4'>Memuat pesan...</td></tr>";

		try {
			console.log("🔄 Memuat pesan...");
			const response = await fetch("/admin/messages", {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${getToken()}` // ✅ Tambahkan authorization
				}
			});

			console.log("📡 Response status:", response.status);
			console.log("📡 Response headers:", response.headers);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const contentType = response.headers.get('content-type');
			if (!contentType || !contentType.includes('application/json')) {
				const text = await response.text();
				console.error("❌ Response bukan JSON:", text);
				throw new Error("Server mengembalikan response yang tidak valid");
			}

			const messages = await response.json();
			console.log("✅ Messages loaded:", messages);

			// Clear table
			tableBody.innerHTML = "";

			if (!messages || messages.length === 0) {
				tableBody.innerHTML = "<tr><td colspan='4'>Tidak ada pesan.</td></tr>";
				return;
			}

			// Populate table
			messages.forEach(msg => {
				const row = document.createElement("tr");
				const createdAt = msg.CreatedAt ? new Date(msg.CreatedAt).toLocaleString("id-ID") : 'Tidak diketahui';

				row.innerHTML = `
                    <td>${msg.Name || 'Tidak ada nama'}</td>
                    <td>${msg.Email || 'Tidak ada email'}</td>
                    <td style="max-width: 300px; word-wrap: break-word;">${msg.Message || 'Tidak ada pesan'}</td>
                    <td>${createdAt}</td>
                `;
				tableBody.appendChild(row);
			});

			showNotification(`${messages.length} pesan berhasil dimuat`, 'success');

		} catch (error) {
			console.error("❌ Error loading messages:", error);
			tableBody.innerHTML = `<tr><td colspan='4'>Gagal memuat pesan: ${error.message}</td></tr>`;
			showNotification(`Gagal memuat pesan: ${error.message}`, 'error');
		}
	}

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
			localStorage.removeItem('token');
			window.location.href = '/home';
		});
	}

	// ✅ Perbaikan: Fungsi loadOrders dengan URL yang konsisten
	// File: frontend/js/admin.js

	// 1) Ubah signature loadOrders jadi terima startDate & endDate
async function loadOrders(startDate, endDate) {
  const tableBody = document.querySelector("#order-table tbody");
  // Tampilkan loading placeholder
  tableBody.innerHTML = "<tr><td colspan='8'>Memuat pesanan...</td></tr>";

  try {
    // 1) Bangun URL dengan query params jika ada filter
    let url = "/admin/orders";
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    // 2) Fetch data dari backend, sertakan token untuk autentikasi
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // 3) Parsing JSON dan reset isi tabel
    const orders = await response.json();
    tableBody.innerHTML = "";

    // 4) Jika tidak ada data, tampilkan placeholder
    if (!orders || orders.length === 0) {
      tableBody.innerHTML = "<tr><td colspan='8'>Tidak ada pesanan.</td></tr>";
      return;
    }

    // 5) Untuk setiap order, lakukan grouping items + render row
    orders.forEach(order => {
      // 5a) Grouping item agar duplikat dijumlahkan
      const groupedItems = [];
      order.Items.forEach(item => {
        const found = groupedItems.find(i =>
          i.Name === item.Name && i.Price === item.Price
        );
        if (found) {
          // jika sudah ada, jumlahkan kuantitasnya
          found.Quantity += item.Quantity;
        } else {
          // jika belum ada, clone object dan masukkan
          groupedItems.push({
            Name:     item.Name,
            Price:    item.Price,
            Quantity: item.Quantity
          });
        }
      });

      // 5b) Bangun HTML string untuk kolom Item (dipisah <br>)
      const itemsHtml = groupedItems
        .map(i => `${i.Name} (${i.Quantity} x ${i.Price.toLocaleString("id-ID")})`)
        .join("<br>");

      // 5c) Karena JSON dari Go bisa mengirim field 'status' atau 'Status',
      //     gunakan nullish-coalescing untuk membaca yang tersedia
      const currentStatus = order.status ?? order.Status;

      // 5d) Render satu baris <tr> dengan 8 kolom:
      //     ID, Nama, Alamat, Payment, Total, Item(+Print), Status, Aksi
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${order.ID}</td>
        <td>${order.Name}</td>
        <td>${order.Address}</td>
        <td>${order.Payment}</td>
        <td>Rp ${order.Total.toLocaleString("id-ID")}</td>
        <td style="display:flex;justify-content:space-between;align-items:center;">
          <span>${itemsHtml}</span>
          <!-- tombol Print -->
          <button
            style="margin-left:10px;"
            onclick='printSingleOrder(${JSON.stringify(order).replace(/'/g,"\\'")})'
            title="Print Order"
          >
            🖨️
          </button>
        </td>
        <!-- kolom Status -->
        <td>${currentStatus}</td>
        <!-- kolom Aksi: hanya tampilkan tombol jika status pending -->
        <td>
          ${currentStatus === "pending"
            ? `<button
                 class="status-btn"
                 data-id="${order.ID}"
                 data-status="berhasil"
               >
                 Set Berhasil
               </button>`
            : `<span>✔️</span>`
          }
        </td>
      `;
      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error("❌ Gagal mengambil data pesanan:", error);
    tableBody.innerHTML = `
      <tr>
        <td colspan='8'>
          Gagal memuat pesanan: ${error.message}
        </td>
      </tr>`;
  }
}

// Pastikan juga Anda sudah mendaftarkan listener untuk tombol `.status-btn`:
document.querySelector("#order-table tbody")
  .addEventListener("click", async e => {
    const btn = e.target.closest(".status-btn");
    if (!btn) return;

    const id     = btn.dataset.id;
    const status = btn.dataset.status;
    try {
      // Panggil API untuk update status
      const res = await fetch(`/admin/orders/${id}/status`, {
        method:  "PATCH",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Status update gagal");
      // Refresh tabel setelah sukses
      await loadOrders();
    } catch (err) {
      console.error(err);
      alert("Gagal mengubah status: " + err.message);
    }
  });

// Panggil loadOrders saat pertama kali halaman siap
document.addEventListener("DOMContentLoaded", () => {
  loadOrders();
});

	// 2) Event listener untuk tombol Filter
	document.getElementById("filter-orders")
		.addEventListener("click", () => {
			const start = document.getElementById("start-date").value;
			const end = document.getElementById("end-date").value;
			if (!start || !end) {
				alert("Silakan pilih tanggal mulai dan akhir terlebih dahulu.");
				return;
			}
			loadOrders(start, end);
		});

	// 3) Event listener untuk tombol Refresh (hapus filter)
	document.getElementById("refresh-orders")
		.addEventListener("click", () => {
			document.getElementById("start-date").value = "";
			document.getElementById("end-date").value = "";
			loadOrders(); // tanpa argumen = semua pesanan
		});

	// 4) Panggil loadOrders saat pertama kali halaman di-load
	document.addEventListener("DOMContentLoaded", () => {
		loadOrders();
	});

	// 5) Pastikan juga kamu punya listener click untuk .status-btn
	document.querySelector("#order-table tbody")
		.addEventListener("click", async e => {
			const btn = e.target.closest(".status-btn");
			if (!btn) return;
			const id = btn.dataset.id;
			const status = btn.dataset.status;
			try {
				const res = await fetch(`/admin/orders/${id}/status`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						'Authorization': `Bearer ${getToken()}`
					},
					body: JSON.stringify({
						status
					})
				});
				if (!res.ok) throw new Error("Gagal update status");
				loadOrders(); // refresh setelah sukses
			} catch (err) {
				console.error(err);
				alert("Error mengubah status");
			}
		});

	// Expose loadOrders globally for navigation
	window.loadOrders = loadOrders;

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

	// Expose printSingleOrder globally
	window.printSingleOrder = printSingleOrder;

	// Initialize with products section
	fetchProducts();
});