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
async function submitOrder(orderData) {
    try {
        const response = await fetch('/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || 'Gagal melakukan pemesanan.');
        }

        alert('Pemesanan berhasil!');
        localStorage.removeItem('cart');
        window.location.href = '/home';
    } catch (err) {
        console.error('Checkout error:', err);
        alert(`Checkout gagal: ${err.message}`);
    }
}
