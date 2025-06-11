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
