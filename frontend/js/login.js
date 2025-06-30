document.addEventListener('DOMContentLoaded', initLoginModule);

function initLoginModule() {
    initShowPasswordToggle();
    initLoginForm();
}

// --------------------------------------
// SHOW/HIDE PASSWORD
// --------------------------------------
function initShowPasswordToggle() {
    const passwordInput = document.getElementById('password');
    const toggleCheckbox = document.getElementById('show-password');

    if (!passwordInput || !toggleCheckbox) return;

    // Saat checkbox berubah, ubah tipe input password
    toggleCheckbox.addEventListener('change', () => {
        passwordInput.type = toggleCheckbox.checked ? 'text' : 'password';
    });
}

// --------------------------------------
// LOGIN FORM: Validasi & Submit
// --------------------------------------
function initLoginForm() {
    const form = document.getElementById('loginForm');
    const messageContainer = document.getElementById('loginMessage');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearMessage();

        // Ambil dan trim nilai input
        const emailInput = document.getElementById('email');
        const passInput  = document.getElementById('password');
        const email      = emailInput.value.trim();
        const password   = passInput.value;

        let valid = true;

        // Reset style error
        [emailInput, passInput].forEach(el => el.classList.remove('input-error'));

        // Validasi: email wajib dan format benar
        if (!email) {
            showError('loginMessage', 'Email harus diisi.', true);
            emailInput.classList.add('input-error');
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('loginMessage', 'Format email tidak valid.', true);
            emailInput.classList.add('input-error');
            valid = false;
        }

        // Validasi: password wajib dan minimal 6 karakter
        if (!password) {
            showError('loginMessage', 'Password harus diisi.', true);
            passInput.classList.add('input-error');
            valid = false;
        } else if (password.length < 6) {
            showError('loginMessage', 'Password minimal 6 karakter.', true);
            passInput.classList.add('input-error');
            valid = false;
        }

        if (!valid) return;

        // Kirim request login
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Simpan token & user
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    email: email,
                    role: data.role || 'user'
                }));

                alert('Login berhasil!');
                
                showError('loginMessage', 'Login berhasil! Mengarahkan...', false);
                // Arahkan sesuai role
                setTimeout(() => {
                    if (data.role === 'admin') {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/shop';
                    }
                }, 800);
            } else {
                // Gagal login: tampilkan pesan server
                showError('loginMessage', data.error || 'Login gagal. Periksa kredensial.', true);
            }
        } catch (err) {
            console.error('Error koneksi saat login:', err);
            showError('loginMessage', 'Terjadi kesalahan koneksi.', true);
        }
    });
}

// --------------------------------------
// HELPERS: Tampilkan & Bersihkan Pesan
// --------------------------------------
/**
 * showError:
 * @param {string} containerId - ID elemen untuk menampilkan pesan
 * @param {string} msg - Teks pesan
 * @param {boolean} isError - true=merah, false=hijau
 */
function showError(containerId, msg, isError) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.textContent = msg;
    el.style.color = isError ? '#dc3545' : '#28a745';
}

/** clearMessage: Hapus pesan login sebelumnya */
function clearMessage() {
    const el = document.getElementById('loginMessage');
    if (el) {
        el.textContent = '';
    }
}
