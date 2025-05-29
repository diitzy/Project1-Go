document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    const tableBody = document.querySelector('#product-table tbody');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    const cancelEditButton = document.getElementById('cancel-edit');
    const hiddenId = document.getElementById('product-id');

    const API_URL = '/api/admin/products';
    const PUBLIC_API_URL = '/api/products';

    // PERBAIKAN: Fungsi untuk mendapatkan token dari localStorage
    const getAuthToken = () => {
        return localStorage.getItem('token');
    };

    // PERBAIKAN: Fungsi untuk membuat headers dengan authorization
    const getAuthHeaders = () => {
        const token = getAuthToken();
        return {
            'Authorization': `Bearer ${token}`
        };
    };

    // PERBAIKAN: Cek apakah user sudah login dan role admin
    const checkAdminAccess = () => {
        const token = getAuthToken();
        const role = localStorage.getItem('role');
        
        if (!token || role !== 'admin') {
            alert('Anda harus login sebagai admin untuk mengakses halaman ini');
            window.location.href = '/login';
            return false;
        }
        return true;
    };

    // Cek akses admin saat halaman dimuat
    if (!checkAdminAccess()) {
        return;
    }

    // READ: Fungsi untuk mengambil dan menampilkan semua produk
    const fetchProducts = async () => {
        try {
            const response = await fetch(PUBLIC_API_URL);
            const products = await response.json();

            tableBody.innerHTML = '';
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
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Gagal mengambil data produk');
        }
    };

    // CREATE / UPDATE: Fungsi untuk menangani submit form
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', document.getElementById('name').value);
        formData.append('price', document.getElementById('price').value);
        formData.append('stock', document.getElementById('stock').value);
        
        const imageFile = document.getElementById('image').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const id = hiddenId.value;
        let url = API_URL;
        let method = 'POST';

        if (id) {
            url = `${API_URL}/${id}`;
            method = 'PUT';
        }

        try {
            // PERBAIKAN: Tambahkan token dalam request
            const response = await fetch(url, {
                method: method,
                headers: getAuthHeaders(), // Tambahkan authorization header
                body: formData,
            });
            
            if (response.ok) {
                resetForm();
                fetchProducts();
                alert('Produk berhasil disimpan!');
            } else {
                const error = await response.json();
                console.error('Server error:', error);
                alert(`Gagal menyimpan produk: ${error.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Terjadi kesalahan jaringan');
        }
    });

    // Fungsi untuk mereset form ke mode "Tambah"
    const resetForm = () => {
        form.reset();
        hiddenId.value = '';
        formTitle.textContent = 'Tambah Produk Baru';
        submitButton.textContent = 'Simpan Produk';
        cancelEditButton.style.display = 'none';
        
        // PERBAIKAN: Set image input sebagai required lagi untuk produk baru
        document.getElementById('image').required = true;
    };

    // Edit Product
    window.editProduct = async (id) => {
        try {
            const response = await fetch(`${PUBLIC_API_URL}/${id}`);
            const product = await response.json();

            hiddenId.value = product.ID;
            document.getElementById('name').value = product.name;
            document.getElementById('price').value = product.price;
            document.getElementById('stock').value = product.stock;

            formTitle.textContent = 'Edit Produk';
            submitButton.textContent = 'Update Produk';
            cancelEditButton.style.display = 'inline-block';
            
            // PERBAIKAN: Image tidak required saat edit
            document.getElementById('image').required = false;
        } catch (error) {
            console.error('Error fetching product:', error);
            alert('Gagal mengambil data produk');
        }
    };

    cancelEditButton.addEventListener('click', resetForm);

    // DELETE: Fungsi untuk menghapus produk
    window.deleteProduct = async (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders(), // Tambahkan authorization header
                });
                
                if (response.ok) {
                    fetchProducts();
                    alert('Produk berhasil dihapus!');
                } else {
                    const error = await response.json();
                    alert(`Gagal menghapus produk: ${error.error || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Network error:', error);
                alert('Terjadi kesalahan jaringan');
            }
        }
    };

    // Panggil fetchProducts saat halaman pertama kali dimuat
    fetchProducts();
});