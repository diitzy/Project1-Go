// ======================================
// profile.js
// Modular, terkomentar, dengan validasi
// ======================================

// Entry point: jalankan init() saat DOM siap
document.addEventListener('DOMContentLoaded', init);

function init() {
  initProfileSection();
  initEditToggle();
  initPasswordModal();
  initLogout();
  loadUserOrdersTable();
}

// --------------------------------------
// PROFILE SECTION: render & populate
// --------------------------------------
function initProfileSection() {
  const user = getUserFromStorage();
  renderProfileCard(user);
  populateProfileForm(user);
}

/** Baca objek user dari localStorage dengan safe-parse */
function getUserFromStorage() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('JSON parse error pada user:', err);
    return {};
  }
}

/** Tampilkan nama & email di kartu profil */
function renderProfileCard(user) {
  document.getElementById('profile-name').textContent = user.nama || 'Nama User';
  document.getElementById('profile-email').textContent = user.email || 'email@contoh.com';
}

/** Isi nilai form sesuai data user, default readonly */
function populateProfileForm(user) {
  ['fullname','email','phone','birthdate','address'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.value = user[id] || '';
      el.disabled = true;
    }
  });
}

// --------------------------------------
// EDIT TOGGLE: enable/disable & save
// --------------------------------------
function initEditToggle() {
  const form = document.getElementById('profile-form');
  const formActions = form.querySelector('.form-actions');

  // Tombol Edit: aktifkan semua input, tampilkan tombol simpan/batal
  document.getElementById('edit-toggle-btn')
    .addEventListener('click', () => {
      toggleFormEditable(form, true);
      formActions.style.display = 'flex';
    });

  // Tombol Batal: kembalikan form ke state readonly & clear errors
  document.getElementById('cancel-btn')
    .addEventListener('click', () => {
      toggleFormEditable(form, false);
      formActions.style.display = 'none';
      const user = getUserFromStorage();
      populateProfileForm(user);
      clearErrors();
    });

  // Submit: validasi & simpan
  form.addEventListener('submit', handleProfileSave);
}

/** Toggle semua input (kecuali button) pada form */
function toggleFormEditable(form, editable) {
  Array.from(form.elements).forEach(el => {
    if (el.tagName !== 'BUTTON') el.disabled = !editable;
  });
}

/** Validasi & simpan data profil */
function handleProfileSave(event) {
  event.preventDefault();
  clearErrors();

  const fullname  = document.getElementById('fullname').value.trim();
  const email     = document.getElementById('email').value.trim();
  const phone     = document.getElementById('phone').value.trim();
  const birthdate = document.getElementById('birthdate').value;
  const address   = document.getElementById('address').value.trim();

  let valid = true;
  // Validasi Nama
  if (fullname.length < 3) {
    showError('error-fullname', 'Nama minimal 3 karakter.');
    valid = false;
  }
  // Validasi Email
  if (!validateEmail(email)) {
    showError('error-email', 'Format email tidak valid.');
    valid = false;
  }
  // Validasi Telepon (9–15 digit angka)
  if (!/^\d{9,15}$/.test(phone)) {
    showError('error-phone', 'Nomor telepon 9–15 digit angka.');
    valid = false;
  }
  // Validasi Tanggal Lahir
  if (!birthdate) {
    showError('error-birthdate', 'Tanggal lahir wajib diisi.');
    valid = false;
  }
  // Validasi Alamat
  if (address.length < 5) {
    showError('error-address', 'Alamat minimal 5 karakter.');
    valid = false;
  }
  if (!valid) return;  // batalkan jika ada error

  // Simpan perubahan ke localStorage
  try {
    const user = getUserFromStorage();
    const updated = { ...user, nama: fullname, email, phone, birthdate, address };
    localStorage.setItem('user', JSON.stringify(updated));
    alert('Profil berhasil diperbarui!');
    renderProfileCard(updated);
    populateProfileForm(updated);
    toggleFormEditable(event.target, false);
    document.querySelector('.form-actions').style.display = 'none';
  } catch (err) {
    console.error('Error saving profile:', err);
    alert('Gagal menyimpan profil. Silakan coba lagi.');
  }
}

/** Tampilkan pesan error di bawah input */
function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
}

/** Clear semua pesan error */
function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

// --------------------------------------
// PASSWORD MODAL
// --------------------------------------
function initPasswordModal() {
  const modal = document.getElementById('password-modal');
  const openBtn = document.getElementById('change-password-btn');
  const closeBtns = modal.querySelectorAll('.close-modal');

  // Buka modal
  openBtn?.addEventListener('click', () => modal.style.display = 'flex');
  // Tutup modal
  closeBtns.forEach(btn => btn.addEventListener('click', () => modal.style.display = 'none'));
  // Submit ganti password
  document.getElementById('password-form').addEventListener('submit', handleChangePassword);
}

function handleChangePassword(event) {
  event.preventDefault();
  clearPasswordErrors();

  const current = document.getElementById('current-password').value;
  const neu     = document.getElementById('new-password').value;
  const confirm = document.getElementById('confirm-password').value;

  let valid = true;
  if (current.length < 6) {
    showError('error-current-password', 'Password minimal 6 karakter.');
    valid = false;
  }
  if (neu.length < 6) {
    showError('error-new-password', 'Password baru minimal 6 karakter.');
    valid = false;
  }
  if (neu !== confirm) {
    showError('error-confirm-password', 'Konfirmasi password tidak cocok.');
    valid = false;
  }
  if (!valid) return;

  // Simulasi perubahan password
  alert('Password berhasil diubah!');
  document.getElementById('password-modal').style.display = 'none';
}

function clearPasswordErrors() {
  ['error-current-password','error-new-password','error-confirm-password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

// --------------------------------------
// LOGOUT
// --------------------------------------
function initLogout() {
  const btn = document.getElementById('logout-btn');
  btn?.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  });
}

// --------------------------------------
// ORDER HISTORY: fetch & render table
// --------------------------------------
async function loadUserOrdersTable() {
  const tbody = document.querySelector('#user-order-table tbody');
  tbody.innerHTML = '<tr><td colspan="5">Memuat riwayat...</td></tr>';

  try {
    const res = await fetch('/user/orders', {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const orders = await res.json();
    if (!Array.isArray(orders) || orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">Belum ada pesanan.</td></tr>';
      return;
    }
    tbody.innerHTML = orders.map(renderOrderRow).join('');
  } catch (err) {
    console.error('Error loading orders:', err);
    tbody.innerHTML = `<tr><td colspan="5">Gagal memuat: ${err.message}</td></tr>`;
  }
}

function renderOrderRow(order) {
  const date = new Date(order.CreatedAt).toLocaleString('id-ID');
  const items = order.Items.map(i =>
    `${i.Name} (${i.Quantity}×Rp${i.Price.toLocaleString('id-ID')})`
  ).join('<br>');
  return `
    <tr>
      <td>${order.ID}</td>
      <td>${date}</td>
      <td>${items}</td>
      <td>Rp ${order.Total.toLocaleString('id-ID')}</td>
      <td>${order.status}</td>
    </tr>`;
}

// --------------------------------------
// HELPERS
// --------------------------------------
function getToken() {
  return localStorage.getItem('token') || '';
}

function validateEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}
