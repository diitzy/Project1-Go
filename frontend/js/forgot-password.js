document.addEventListener('DOMContentLoaded', initForgotPasswordModule);

/** Inisialisasi modul lupa password */
function initForgotPasswordModule() {
    initFormSubmission();
}

/** Setup event listener pada form */
function initFormSubmission() {
    const form = document.getElementById('forgot-password-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();  // cegah reload
        clearFormMessages(); // bersihkan pesan sebelumnya

        // Ambil elemen dan nilai input
        const emailEl = document.getElementById('email');
        const email   = emailEl.value.trim();
        let isValid   = true;

        // Validasi input email: tidak boleh kosong
        if (!email) {
            showFieldError('error-email', 'Email wajib diisi.');
            isValid = false;
        }
        // Validasi format email
        else if (!emailEl.checkValidity()) {
            showFieldError('error-email', 'Format email tidak valid.');
            isValid = false;
        }
        
        if (!isValid) return;

        // Jika valid, kirim permintaan ke server
        try {
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                showFormMessage('Link reset password telah dikirim ke email Anda.', false);
            } else {
                showFormMessage('Gagal mengirim link. Pastikan email terdaftar.', true);
            }
        } catch (err) {
            console.error('Kesalahan koneksi:', err);
            showFormMessage('Terjadi kesalahan jaringan. Coba lagi nanti.', true);
        }
    });
}

/** Tampilkan pesan error untuk field tertentu */
function showFieldError(id, message) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = message;
    }
}

/** Tampilkan pesan umum di bawah form */
function showFormMessage(message, isError) {
    const el = document.getElementById('form-message');
    if (el) {
        el.textContent = message;
        el.style.color = isError ? '#dc3545' : '#28a745';
    }
}

/** Bersihkan semua pesan error dan pesan umum */
function clearFormMessages() {
    const errorEl = document.getElementById('error-email');
    const msgEl   = document.getElementById('form-message');
    if (errorEl) errorEl.textContent = '';
    if (msgEl)   msgEl.textContent   = '';
}
