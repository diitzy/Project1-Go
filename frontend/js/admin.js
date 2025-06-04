document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    const tableBody = document.querySelector('#product-table tbody');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    const cancelEditButton = document.getElementById('cancel-edit');
    const hiddenId = document.getElementById('product-id');

    const API_URL = '/api/products';

    // READ: Fungsi untuk mengambil dan menampilkan semua produk
    const fetchProducts = async () => {
        const response = await fetch(API_URL);
        const products = await response.json();

        tableBody.innerHTML = ''; // Kosongkan tabel sebelum diisi
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>Rp ${product.price.toLocaleString('id-ID')}</td>
                <td>${product.stock}</td>
                <td><img src="${product.image}" alt="${product.name}" width="50"></td>
                <td>
                    <button class="action-btn edit-btn" onclick="editProduct(${product.ID})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteProduct(${product.ID})">Hapus</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    };

    // CREATE / UPDATE: Fungsi untuk menangani submit form
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productData = {
            name: document.getElementById('name').value,
            price: parseFloat(document.getElementById('price').value),
            stock: parseInt(document.getElementById('stock').value),
            image: document.getElementById('image').value,
        };

        const id = hiddenId.value;
        let response;

        if (id) {
            // UPDATE
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
        } else {
            // CREATE
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
        }

        if (response.ok) {
            resetForm();
            fetchProducts();
        } else {
            alert('Gagal menyimpan produk.');
        }
    });

    // Fungsi untuk mereset form ke mode "Tambah"
    const resetForm = () => {
        form.reset();
        hiddenId.value = '';
        formTitle.textContent = 'Tambah Produk Baru';
        submitButton.textContent = 'Simpan Produk';
        cancelEditButton.style.display = 'none';
    };

    // Menghubungkan fungsi ke window agar bisa dipanggil dari HTML
    window.editProduct = async (id) => {
        const response = await fetch(`${API_URL}/${id}`);
        const product = await response.json();

        hiddenId.value = product.ID;
        document.getElementById('name').value = product.name;
        document.getElementById('price').value = product.price;
        document.getElementById('stock').value = product.stock;
        document.getElementById('image').value = product.image;

        formTitle.textContent = 'Edit Produk';
        submitButton.textContent = 'Update Produk';
        cancelEditButton.style.display = 'inline-block';
    };

    cancelEditButton.addEventListener('click', resetForm);

    // DELETE: Fungsi untuk menghapus produk
    window.deleteProduct = async (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchProducts();
            } else {
                alert('Gagal menghapus produk.');
            }
        }
    };

    // Panggil fetchProducts saat halaman pertama kali dimuat
    fetchProducts();
}); 