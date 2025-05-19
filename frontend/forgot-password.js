document.getElementById("forgot-password-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;

  try {
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email })
    });

    if (res.ok) {
      alert("Link reset password telah dikirim ke email Anda.");
    } else {
      alert("Gagal mengirim link. Pastikan email Anda terdaftar.");
    }
  } catch (error) {
    alert("Terjadi kesalahan. Coba lagi nanti.");
    console.error(error);
  }
});
