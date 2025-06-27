document.getElementById("forgot-password-form").addEventListener("submit", async function (e) {
    // Mencegah perilaku default (reload halaman)
    e.preventDefault();

    // Ambil nilai email dari input form
    const email = document.getElementById("email").value;

    try {
        // Kirim permintaan POST ke endpoint reset password
        const res = await fetch("/api/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email }) // Konversi data menjadi JSON
        });

        // Tanggapi hasil dari server
        if (res.ok) {
            alert("Link reset password telah dikirim ke email Anda.");
        } else {
            alert("Gagal mengirim link. Pastikan email Anda terdaftar.");
        }
    } catch (error) {
        // Tangani jika terjadi kesalahan jaringan/server
        alert("Terjadi kesalahan. Coba lagi nanti.");
        console.error(error); // Tampilkan detail error di konsol
    }
});
