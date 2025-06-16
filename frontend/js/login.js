document.addEventListener("DOMContentLoaded", () => {
    // ===================== Register Form Handler =====================
    const registerForm = document.querySelector(".register-container form");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            if (password !== confirmPassword) {
                alert("Konfirmasi password tidak cocok!");
                return;
            }

            try {
                const response = await fetch("/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.status === 201 && data.message === "Registrasi berhasil") {
                    alert("Registrasi berhasil! Silakan login.");
                    window.location.href = "/login";
                } else {
                    alert(data.message || "Registrasi gagal.");
                }
            } catch (err) {
                alert("Terjadi kesalahan koneksi saat registrasi.");
            }
        });
    }

    // ===================== Show Password =====================
    const passwordInput = document.getElementById("password");
    const showPasswordCheckbox = document.getElementById("show-password");
    if (passwordInput && showPasswordCheckbox) {
        showPasswordCheckbox.addEventListener("change", function () {
            passwordInput.type = this.checked ? "text" : "password";
        });
    }

    // ===================== Login Form Handler =====================
    const loginForm = document.querySelector(".login-container form, form");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Simpan token dan user data ke localStorage
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify({
                        email: email,
                        role: data.role || "user"
                    }));

                    alert("Login berhasil!");

                    // Arahkan berdasarkan role
                    if (data.role === "admin") {
                        window.location.href = "/admin";
                    } else {
                        window.location.href = "/shop";
                    }
                } else {
                    alert(data.error || "Login gagal.");
                }
            } catch (err) {
                alert("Terjadi kesalahan koneksi.");
            }
        });
    }

    // ===================== Fungsi untuk Update UI Berdasarkan Status Login =====================
    function updateUserInterface() {
        const user = JSON.parse(localStorage.getItem("user"));
        const userIconLink = document.querySelector(".user-icon-link");

        if (!userIconLink) return;

        if (user) {
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

            document.getElementById("logoutBtn").addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                alert("Logout berhasil!");
                window.location.href = "/home";
            });

            const profileBtn = document.getElementById("profileBtn");
            if (profileBtn) {
                profileBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    window.location.href = "/profile";
                });
            }

        } else {
            userIconLink.innerHTML = '<i class="ri-user-line"></i>';
            userIconLink.href = "/login";
        }
    }

    updateUserInterface();
});
