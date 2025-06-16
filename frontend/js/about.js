document.addEventListener("DOMContentLoaded", () => {
    const updateUserInterface = () => {
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
            const logoutBtn = document.getElementById("logoutBtn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    localStorage.removeItem("cart");
                    alert("Logout berhasil!");
                    window.location.href = "/home";
                });
            }
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
    };
    updateUserInterface();
});