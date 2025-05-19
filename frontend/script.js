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

	// ===================== Login Form Handler =====================
	const loginForm = document.getElementById("loginForm");
	const loginMessage = document.getElementById("loginMessage");

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

				if (response.status === 200 && data.message === "Login berhasil") {
					localStorage.setItem("user", JSON.stringify({ email: data.user }));

					if (loginMessage) {
						loginMessage.textContent = "Login berhasil! Mengalihkan...";
						loginMessage.style.color = "green";
					}

					setTimeout(() => {
						window.location.href = "/home";
					}, 1000);
				} else {
					loginMessage.textContent = data.message || "Login gagal.";
					loginMessage.style.color = "red";
				}
			} catch (err) {
				loginMessage.textContent = "Terjadi kesalahan koneksi.";
				loginMessage.style.color = "red";
			}
		});
	}

	// ===================== Navigasi Login/Profile =====================
	const user = JSON.parse(localStorage.getItem("user"));
	const navMenuContainer = document.querySelector(".nav-menu");
	const userIcon = document.querySelector(".ri-user-line");

	if (user && navMenuContainer) {
		const userIconContainer = document.querySelector(".icon-container.user");
		if (userIconContainer) userIconContainer.remove();

		const profileItem = document.createElement("li");
		profileItem.classList.add("nav-link");
		profileItem.innerHTML = `
			<div class="dropdown">
				<button class="dropbtn">${user.email}</button>
				<div class="dropdown-content">
					<a href="#" id="logoutBtn">Logout</a>
				</div>
			</div>
		`;
		navMenuContainer.appendChild(profileItem);

		// Tambahkan style dropdown
		const dropdownStyle = `
			.dropdown { position: relative; display: inline-block; }
			.dropbtn {
				background: none;
				border: none;
				color: white;
				font-weight: bold;
				cursor: pointer;
			}
			.dropdown-content {
				display: none;
				position: absolute;
				background-color: white;
				min-width: 120px;
				box-shadow: 0 8px 16px rgba(0,0,0,0.2);
				z-index: 1;
			}
			.dropdown-content a {
				color: black;
				padding: 10px 16px;
				text-decoration: none;
				display: block;
			}
			.dropdown-content a:hover {
				background-color: #ddd;
			}
			.dropdown:hover .dropdown-content {
				display: block;
			}
		`;
		const styleTag = document.createElement("style");
		styleTag.innerText = dropdownStyle;
		document.head.appendChild(styleTag);

		// Logout handler
		document.getElementById("logoutBtn").addEventListener("click", () => {
			localStorage.removeItem("user");
			location.reload();
		});
	} else if (userIcon) {
		// Arahkan ke login jika belum login
		userIcon.addEventListener("click", () => {
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
