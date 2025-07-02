document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");

    // Validasi jika form tidak ditemukan
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Ambil nilai input dengan validasi awal
        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value;
        const confirmPassword = document.getElementById("confirm-password")?.value;

        // ======================= Validasi Manual ==========================
        if (!email || !password || !confirmPassword) {
            alert("Semua kolom harus diisi.");
            return;
        }

        if (!email.includes("@") || email.length < 5) {
            alert("Format email tidak valid.");
            return;
        }

        if (password.length < 6) {
            alert("Password minimal 6 karakter.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Konfirmasi password tidak cocok.");
            return;
        }

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Registrasi berhasil!");
                window.location.href = "/login";
            } else {
                alert(result?.message || "Registrasi gagal. Coba lagi.");
            }
        } catch (error) {
            console.error("Gagal terhubung ke server:", error);
            alert("Terjadi kesalahan koneksi. Silakan coba lagi nanti.");
        }
    });
});
