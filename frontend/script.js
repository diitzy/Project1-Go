document.addEventListener('DOMContentLoaded', function () {
	// ===================== Toggle Mobile Menu =====================
	const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
	const navMenu = document.querySelector(".nav-menu");

	if (mobileMenuBtn && navMenu) {
		mobileMenuBtn.addEventListener("click", () => {
			navMenu.classList.toggle("active");

			const icon = mobileMenuBtn.querySelector("i");
			if (!icon) return;

			// Ganti ikon menu berdasarkan status menu
			if (navMenu.classList.contains("active")) {
				icon.classList.replace("ri-menu-line", "ri-close-line");
			} else {
				icon.classList.replace("ri-close-line", "ri-menu-line");
			}
		});
	}

	// ===================== Smooth Scroll & Tutup Menu saat Klik =====================
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener("click", function (e) {
			e.preventDefault();

			// Tutup menu jika sedang aktif
			if (navMenu && navMenu.classList.contains("active")) {
				navMenu.classList.remove("active");

				const icon = mobileMenuBtn?.querySelector("i");
				icon?.classList.replace("ri-close-line", "ri-menu-line");
			}

			const targetId = this.getAttribute("href");
			if (!targetId || targetId === "#") return;

			const targetElement = document.querySelector(targetId);
			if (targetElement) {
				window.scrollTo({
					top: targetElement.offsetTop - 70,
					behavior: "smooth"
				});
			}
		});
	});

	// ===================== Tambah ke Keranjang =====================
	const cartButtons = document.querySelectorAll(".add-to-cart");
	const cartCount = document.querySelector(".cart-count");
	let itemsInCart = 0;

	if (cartButtons.length > 0 && cartCount) {
		cartButtons.forEach(button => {
			button.addEventListener("click", () => {
				itemsInCart++;
				cartCount.textContent = itemsInCart;

				// Ambil data produk dari atribut data
				const product = {
					id: button.dataset.id,
					name: button.dataset.name,
					price: button.dataset.price
				};

				// Simpan ke localStorage
				const cart = JSON.parse(localStorage.getItem("cart")) || [];
				cart.push(product);
				localStorage.setItem("cart", JSON.stringify(cart));

				// Berikan feedback visual
				button.innerHTML = '<i class="ri-check-line"></i> Ditambahkan';
				button.style.backgroundColor = "#51cf66";

				setTimeout(() => {
					button.innerHTML = '<i class="ri-shopping-cart-line"></i> Tambah ke Keranjang';
					button.style.backgroundColor = "";
				}, 1500);
			});
		});
	}

	// ===================== Highlight NavLink Aktif Saat Scroll =====================
	const sections = document.querySelectorAll("section[id]");
	const navLinks = document.querySelectorAll(".nav-link");

	function highlightActiveLink() {
		const scrollPosition = window.scrollY + 100;

		sections.forEach(section => {
			const top = section.offsetTop - 100;
			const height = section.offsetHeight;
			const id = section.getAttribute("id");

			if (scrollPosition >= top && scrollPosition < top + height) {
				navLinks.forEach(link => {
					link.classList.remove("active");
					if (link.getAttribute("href") === `#${id}`) {
						link.classList.add("active");
					}
				});
			}
		});
	}

	window.addEventListener("scroll", highlightActiveLink);
	window.addEventListener("load", highlightActiveLink);

	// Tambahkan style untuk link aktif
	document.head.insertAdjacentHTML(
		"beforeend",
		`
		<style>
			.nav-link.active {
				color: #ff6b6b;
			}
			.nav-link.active:after {
				width: 100%;
			}
		</style>
	`
	);

		// ===================== Register Form Handler =====================
	const registerForm = document.querySelector(".register-container form"); // Menggunakan selector yang lebih spesifik
	// Anda mungkin ingin menambahkan elemen untuk pesan registrasi, seperti loginMessage
	// const registerMessage = document.getElementById("registerMessage");

	if (registerForm) {
		registerForm.addEventListener("submit", async function (e) {
			e.preventDefault();

			const email = document.getElementById("email").value;
			const password = document.getElementById("password").value;
			const confirmPassword = document.getElementById("confirm-password").value; // Pastikan ini ada

			if (password !== confirmPassword) {
				alert("Konfirmasi password tidak cocok!"); // Atau tampilkan pesan di UI
				return;
			}

			try {
				const response = await fetch("/api/register", { // Sesuaikan endpoint API registrasi Anda
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password })
				});

				const data = await response.json();

				if (response.status === 201 && data.message === "Registrasi berhasil") { // Sesuaikan status kode dan pesan
					alert("Registrasi berhasil! Silakan login."); // Atau tampilkan pesan di UI
					window.location.href = "/login"; // Alihkan ke halaman login
				} else {
					alert(data.message || "Registrasi gagal."); // Tampilkan pesan error
				}
			} catch (err) {
				alert("Terjadi kesalahan koneksi saat registrasi."); // Tangani error koneksi
			}
		});
	}



	// ===================== Login Form Handler =====================
	loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/login", { // Sesuaikan endpoint jika berbeda
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Simpan token ke localStorage
            localStorage.setItem("token", data.token);

            alert("Login berhasil!");

            // LAKUKAN PENGARAHAN BERDASARKAN ROLE
            if (data.role === "admin") {
                window.location.href = "/admin"; // Arahkan admin ke halaman admin
            } else {
                window.location.href = "/shop"; // Arahkan user biasa ke halaman toko
            }

        } else {
            alert(data.error || "Login gagal.");
        }
    } catch (err) {
        alert("Terjadi kesalahan koneksi.");
    }
});

	// ===================== Navigasi Login/Profile (Perbaikan) =====================
	const user = JSON.parse(localStorage.getItem("user"));
	const iconContainer = document.querySelector(".icon-container"); // Container utama ikon
	const userLoginLink = document.querySelector(".icon-container .user-icon"); // Link login asli

	if (user && iconContainer && userLoginLink) {
		// Hapus link login yang sudah ada
		userLoginLink.style.display = "none"; // Sembunyikan link login

		// Buat elemen dropdown profil
		const profileDropdown = document.createElement("div");
		profileDropdown.classList.add("dropdown");
		profileDropdown.innerHTML = `
			<button class="dropbtn"><i class="ri-user-line"></i> ${user.email}</button>
			<div class="dropdown-content">
				<a href="#" id="logoutBtn">Logout</a>
			</div>
		`;
		iconContainer.appendChild(profileDropdown); // Tambahkan dropdown ke dalam icon-container

		// Tambahkan style dropdown (jika belum ada atau perlu disesuaikan)
		const dropdownStyle = `
			.dropdown { position: relative; display: inline-block; }
			.dropbtn {
				background: none;
				border: none;
				color: var(--text-color-dark); /* Gunakan warna yang sesuai dengan tema Anda */
				font-size: 1.2rem; /* Sesuaikan ukuran font */
				cursor: pointer;
				padding: 0 10px;
				display: flex;
				align-items: center;
				gap: 5px;
			}
			.dropbtn i {
				font-size: 1.4rem;
			}
			.dropdown-content {
				display: none;
				position: absolute;
				background-color: white;
				min-width: 120px;
				box-shadow: 0 8px 16px rgba(0,0,0,0.2);
				z-index: 100; /* Pastikan z-index cukup tinggi */
				right: 0; /* Posisikan dropdown di kanan ikon */
				top: 100%; /* Posisikan di bawah ikon */
				border-radius: 5px;
				overflow: hidden;
			}
			.dropdown-content a {
				color: black;
				padding: 10px 16px;
				text-decoration: none;
				display: block;
				font-weight: normal;
			}
			.dropdown-content a:hover {
				background-color: #f1f1f1;
			}
			.dropdown:hover .dropdown-content {
				display: block;
			}
			@media (max-width: 768px) {
				.dropdown {
					display: block; /* Agar dropdown tetap di daftar menu mobile */
					width: 100%;
				}
				.dropbtn {
					width: 100%;
					justify-content: center;
					color: white; /* Sesuaikan warna untuk menu mobile */
				}
				.dropdown-content {
					position: static; /* Hilangkan posisi absolut di mobile */
					width: 100%;
					box-shadow: none;
					border-radius: 0;
					background-color: #333; /* Sesuaikan warna latar belakang */
				}
				.dropdown-content a {
					color: white; /* Sesuaikan warna teks untuk mobile */
				}
			}
		`;

			// Hanya tambahkan style jika belum ada
			if (!document.getElementById("dropdown-style")) {
				const styleTag = document.createElement("style");
				styleTag.id = "dropdown-style";
				styleTag.innerText = dropdownStyle;	
				document.head.appendChild(styleTag);
			}


			// Logout handler
			document.getElementById("logoutBtn").addEventListener("click", (e) => {
				e.preventDefault(); // Mencegah navigasi default
				localStorage.removeItem("user");
				window.location.href = "/home"; // Arahkan kembali ke home setelah logout
			});
		} else if (userLoginLink) {
			// Arahkan ke login jika belum login dan userLoginLink ada
			userLoginLink.addEventListener("click", (e) => {
				e.preventDefault(); // Mencegah navigasi default
				window.location.href = "/login";
			});
		}

		// ===================== Navigasi ke Cart =====================
		const cartIcon = document.querySelector(".ri-shopping-cart-line");
		if (cartIcon) {
			cartIcon.addEventListener("click", () => {
				window.location.href = "/cart";
			});
		}

	// ===================== Contoh Fetch API Contact =====================
	fetch("/api/contact")
		.then(res => res.json())
		.then(data => {
			console.log(data);
			// TODO: Tampilkan data kontak ke UI jika diperlukan
		});
});