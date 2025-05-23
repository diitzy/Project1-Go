// Tambahkan event listener saat form dikirim
document.getElementById("forgot-password-form").addEventListener("submit", async function (e) {
  // Mencegah reload halaman saat submit form
  e.preventDefault();

  // Ambil nilai email dari input field
  const email = document.getElementById("email").value;

  try {
    // Kirim request POST ke endpoint API untuk reset password
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email }) // Konversi data ke JSON
    });

    // Tanggapi hasil request
    if (res.ok) {
      alert("Link reset password telah dikirim ke email Anda.");
    } else {
      alert("Gagal mengirim link. Pastikan email Anda terdaftar.");
    }
  } catch (error) {
    // Tampilkan pesan jika terjadi error jaringan atau server
    alert("Terjadi kesalahan. Coba lagi nanti.");
    console.error(error);
  }
});
