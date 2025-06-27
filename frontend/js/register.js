document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");

    form?.addEventListener("submit", async (e) => {
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
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            if (response.ok) {
                alert("Registrasi berhasil!");
                window.location.href = "/login";
            } else {
                alert(result.message || "Registrasi gagal.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan koneksi.");
        }
    });
});
