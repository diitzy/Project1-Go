document.addEventListener("DOMContentLoaded", () => {

    // Fungsi untuk memperbarui tampilan UI user (ikon, email, menu dropdown)
    const updateUserInterface = () => {
        const user = JSON.parse(localStorage.getItem("user"));  // Ambil data user dari localStorage
        const userIconLink = document.querySelector(".user-icon-link");  // Dapatkan elemen untuk ikon user

        // Jika elemen tidak ditemukan, hentikan fungsi
        if (!userIconLink) return;

        // Jika user login (data user tersedia)
        if (user) {
            // Tampilkan dropdown user dengan email, profile, dan logout
            userIconLink.innerHTML = `
                <div class="user-dropdown">
                    <button class="user-button">
                        <i class="ri-user-line"></i>
                        <span class="user-email">${user.email}</span>
                        <i class="ri-arrow-down-s-line dropdown-arrow"></i>
                    </button>
                    <div class="dropdown-menu">
                        <a href="#" class="dropdown-item" id="profileBtn">
                            <i class="ri-user-settings-line"></i> Profile
                        </a>
                        <a href="#" class="dropdown-item" id="logoutBtn">
                            <i class="ri-logout-box-line"></i> Logout
                        </a>
                    </div>
                </div>
            `;

            // Tambahkan event listener untuk tombol logout
            const logoutBtn = document.getElementById("logoutBtn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    // Hapus data user dari localStorage dan arahkan ke halaman home
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    localStorage.removeItem("cart");
                    alert("Logout berhasil!");
                    window.location.href = "/home";
                });
            }

            // Tambahkan event listener untuk tombol profile
            const profileBtn = document.getElementById("profileBtn");
            if (profileBtn) {
                profileBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    // Arahkan ke halaman profil user
                    window.location.href = "/profile";
                });
            }

        } else {
            // Jika belum login, tampilkan ikon default dan arahkan ke halaman login
            userIconLink.innerHTML = '<i class="ri-user-line"></i>';
            userIconLink.href = "/login";
        }
    };

    // Jalankan fungsi saat halaman dimuat
    updateUserInterface();
});
