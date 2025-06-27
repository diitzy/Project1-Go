document.addEventListener("DOMContentLoaded", () => {
    // Ambil elemen form registrasi
    const form = document.getElementById("register-form");

    // Pastikan form ada sebelum menambahkan listener
    if (!form) return;

    // Tangani event submit form
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Cegah reload halaman

        // Ambil nilai input dari form
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        // Validasi konfirmasi password
        if (password !== confirmPassword) {
            alert("Password tidak cocok!");
            return;
        }

        try {
            // Kirim data ke endpoint register sebagai JSON
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password }) // Format kiriman sebagai JSON
            });

            // Baca response dari server
            const result = await response.json();

            // Jika response OK (status 2xx)
            if (response.ok) {
                alert("Registrasi berhasil!");
                window.location.href = "/login"; // Arahkan ke halaman login
            } else {
                // Tampilkan pesan error dari backend jika ada
                alert(result.message || "Registrasi gagal.");
            }
        } catch (error) {
            console.error("Error saat register:", error);
            alert("Terjadi kesalahan koneksi. Silakan coba lagi nanti.");
        }
    });
});
