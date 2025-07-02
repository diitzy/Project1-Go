document.addEventListener('DOMContentLoaded', () => initCheckoutModule());

export function initCheckoutModule() {
    try {
        checkAuthentication(); // Validasi login
        const cartItems = getCartItems(); // Ambil data keranjang
        renderCartSummary(cartItems); // Render list dan total
        attachFormListener(cartItems); // Pasang listener form
    } catch (err) {
        console.error('Error initializing Checkout Module:', err);
        alert('Terjadi kesalahan pada modul Checkout.');
    }
}

// ----------------------------------------------
// Bagian Auth & Data
// ----------------------------------------------

/**
 * Validasi autentikasi user, redirect jika belum login
 */
function checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Silakan login terlebih dahulu untuk melakukan checkout.');
        window.location.href = '/login';
        throw new Error('User not authenticated');
    }
}

/**
 * Ambil dan parse data keranjang dari localStorage
 * @returns {Array<Object>}
 */
function getCartItems() {
    try {
        const raw = localStorage.getItem('cart') || '[]';
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.error('Gagal parse data keranjang:', err);
        return [];
    }
}

// ----------------------------------------------
// Rendering Ringkasan Belanja
// ----------------------------------------------

/**
 * Render daftar item dan hitung total harga
 * @param {Array<Object>} cartItems
 */
function renderCartSummary(cartItems) {
    const listEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('total-price');
    listEl.innerHTML = '';
    let total = 0;

    if (cartItems.length === 0) {
        listEl.innerHTML = '<li>Keranjang kosong.</li>';
    } else {
        cartItems.forEach(item => {
            // Validasi data item
            if (!item.name || typeof item.quantity !== 'number' || typeof item.price !== 'number') return;
            const subtotal = item.price * item.quantity;
            total += subtotal;
            const li = document.createElement('li');
            li.textContent = `${item.name} × ${item.quantity} – Rp ${subtotal.toLocaleString('id-ID')}`;
            listEl.appendChild(li);
        });
    }

    totalEl.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

// ----------------------------------------------
// Form Handling & Submission
// ----------------------------------------------

/**
 * Pasang listener pada form checkout
 * @param {Array<Object>} cartItems
 */
async function validateStockBeforeCheckout(cartItems) {
    for (const item of cartItems) {
        // Gunakan 'item.id' jika tidak ada 'product_id'
        const productId = item.product_id || item.id;
        if (!productId) {
            alert("ID produk tidak ditemukan untuk item keranjang.");
            throw new Error("ID produk undefined");
        }

        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
            alert(`Gagal mengambil data produk untuk ID ${productId}`);
            throw new Error("Gagal mengambil data produk");
        }

        const product = await res.json();

        // Validasi stok
        if (item.quantity > product.stock) {
            alert(`Stok tidak mencukupi untuk produk "${product.name}".\n\n` +
                  `Jumlah diminta: ${item.quantity}\nStok tersedia: ${product.stock}`);
            throw new Error(`Stok tidak mencukupi untuk ${product.name}`);
        }
    }
}

function attachFormListener(cartItems) {
    const form = document.getElementById('checkout-form');
    if (!form) return;


    form.addEventListener('submit', async event => {
        event.preventDefault();

        // Ambil nilai input
        const name = document.getElementById('name').value.trim();
        const address = document.getElementById('address').value.trim();
        const payment = document.getElementById('payment').value;

        // Validasi form
        if (!validateForm(name, address, payment, cartItems)) return;

        const orderData = {
            name,
            address,
            payment,
            items: cartItems.map(({
                id,
                ...rest
            }) => rest)
        };

        await validateStockBeforeCheckout(cartItems);
        await submitOrder(orderData);
    });
}

/**
 * Validasi data form dan keranjang
 * @returns {boolean}
 */
function validateForm(name, address, payment, cartItems) {
    if (!name || !address || !payment) {
        alert('Mohon lengkapi semua data pemesan.');
        return false;
    }
    if (cartItems.length === 0) {
        alert('Keranjang Anda kosong.');
        return false;
    }
    return true;
}

/**
 * Kirim data order ke server dan tangani respons
 * @param {Object} orderData
 */
async function submitOrder(cartItemsRaw) {
    const token = localStorage.getItem("token");

    // Konversi data mentah jadi array
    const cartItems = Array.isArray(cartItemsRaw)
        ? cartItemsRaw
        : (typeof cartItemsRaw === 'string'
            ? JSON.parse(cartItemsRaw)
            : []);

    if (cartItems.length === 0) {
        alert("Keranjang kosong atau gagal terbaca.");
        return;
    }

    const payload = {
        items: cartItems.map(item => ({
            product_id: item.product_id || item.id,
            quantity: item.quantity,
            price: item.price
        }))
    };

    // validasi tambahan
    if (payload.items.some(item => !item.product_id || item.product_id === 0)) {
        alert("Terdapat item dengan Product ID tidak valid!");
        return;
    }

    const res = await fetch("/checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const errMsg = await res.text();
        throw new Error("Checkout error: " + errMsg);
    }

    const result = await res.json();
    alert("Checkout berhasil!");
    console.log(result);
}
