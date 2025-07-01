document.addEventListener('DOMContentLoaded', initContactModule);

function initContactModule() {
    setupUserInterface();
    setupLogoutHandler();
}

// ----------------------------------------------
// BAGIAN USER INTERFACE: Menampilkan Data User
// ----------------------------------------------

/**
 * Setup tampilan ikon user: dropdown jika login, atau tautan login
 */
function setupUserInterface() {
    const userIconLink = document.querySelector('.user-icon-link');
    if (!userIconLink) {
        console.warn('Elemen .user-icon-link tidak ditemukan.');
        return;
    }

    const user = getUserFromLocalStorage();
    if (user && typeof user.email === 'string' && user.email.trim()) {
        renderUserDropdown(userIconLink, user.email);
    } else {
        showDefaultUserIcon(userIconLink);
    }
}

/**
 * Tampilkan ikon default dan arahkan ke login
 * @param {HTMLElement} container
 */
function showDefaultUserIcon(container) {
    container.textContent = '';
    const icon = document.createElement('i');
    icon.className = 'ri-user-line';
    container.appendChild(icon);
    container.setAttribute('href', '/login');
}

/**
 * Ambil dan parse data user di localStorage dengan validasi
 * @returns {Object}
 */
function getUserFromLocalStorage() {
    let raw;
    try {
        raw = localStorage.getItem('user');
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch (err) {
        console.error('Gagal membaca atau parse data user:', err);
        return {};
    }
}

/**
 * Render dropdown user dengan email
 * @param {HTMLElement} container
 * @param {string} email
 */
function renderUserDropdown(container, email) {
    // Reset kontainer
    container.textContent = '';

    // Struktur dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';

    const button = document.createElement('button');
    button.className = 'user-button';

    // Ikon dan email
    const icon = document.createElement('i');
    icon.className = 'ri-user-line';

    const spanEmail = document.createElement('span');
    spanEmail.className = 'user-email';
    spanEmail.textContent = email;

    const arrow = document.createElement('i');
    arrow.className = 'ri-arrow-down-s-line dropdown-arrow';

    button.append(icon, spanEmail, arrow);
    dropdown.append(button);

    // Menu dropdown
    const menu = document.createElement('div');
    menu.className = 'dropdown-menu';

    const logoutItem = document.createElement('a');
    logoutItem.className = 'dropdown-item';
    logoutItem.id = 'logoutBtn';
    logoutItem.href = '#';
    logoutItem.innerHTML = '<i class="ri-logout-box-line"></i> Logout';

    menu.append(logoutItem);
    dropdown.append(menu);
    container.append(dropdown);
}

// ----------------------------------------------
// HANDLER LOGOUT
// ----------------------------------------------

/**
 * Pasang listener untuk tombol logout
 */
function setupLogoutHandler() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) {
        // Logout belum dirender
        return;
    }

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });
}

/**
 * Proses logout user dengan validasi dan notifikasi
 */
function handleLogout() {
    try {
        // Hapus data sensitif
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('cart');

        alert('Logout berhasil!');
        window.location.href = '/home';
    } catch (err) {
        console.error('Gagal logout:', err);
        alert('Terjadi kesalahan saat logout. Silakan coba lagi.');
    }
}
