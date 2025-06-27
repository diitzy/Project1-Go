document.addEventListener("DOMContentLoaded", () => {

    // Fungsi untuk memperbarui tampilan UI berdasarkan status login user
    const updateUserInterface = () => {
        const user = JSON.parse(localStorage.getItem("user"));  // Ambil data user dari localStorage
        const userIconLink = document.querySelector(".user-icon-link");  // Ambil elemen ikon user

        if (!userIconLink) return;  // Jika elemen tidak ditemukan, keluar dari fungsi

        if (user) {
            // Jika user terautentikasi, tampilkan dropdown user
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
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    localStorage.removeItem("cart");
                    alert("Logout berhasil!");
                    window.location.href = "/home";  // Redirect ke halaman home
                });
            }

            // Tambahkan event listener untuk tombol profile
            const profileBtn = document.getElementById("profileBtn");
            if (profileBtn) {
                profileBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    window.location.href = "/profile";  // Redirect ke halaman profil
                });
            }

        } else {
            // Jika user belum login, tampilkan ikon default dan arahkan ke halaman login
            userIconLink.innerHTML = '<i class="ri-user-line"></i>';
            userIconLink.href = "/login";
        }
    };

    // Jalankan fungsi saat halaman dimuat
    updateUserInterface();
});
