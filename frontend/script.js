// Toggle menu mobile: membuka & menutup menu ketika tombol diklik
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navMenu = document.querySelector(".nav-menu");

if (mobileMenuBtn) {
	// Pasang event listener pada tombol menu mobile
	mobileMenuBtn.addEventListener("click", () => {
		navMenu.classList.toggle("active"); // Toggle kelas aktif pada nav menu

		const icon = mobileMenuBtn.querySelector("i");
		if (navMenu.classList.contains("active")) {
			// Ganti icon menjadi close jika menu aktif
			icon.classList.remove("ri-menu-line");
			icon.classList.add("ri-close-line");
		} else {
			// Kembalikan icon menu jika menu tidak aktif
			icon.classList.remove("ri-close-line");
			icon.classList.add("ri-menu-line");
		}
	});
}

// Smooth scrolling untuk anchor link yang mengarah ke section dalam halaman
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		e.preventDefault();

		// Jika menu mobile terbuka, tutup saat klik link navigasi
		if (navMenu.classList.contains("active")) {
			navMenu.classList.remove("active");
			const icon = mobileMenuBtn.querySelector("i");
			icon.classList.remove("ri-close-line");
			icon.classList.add("ri-menu-line");
		}

		const targetId = this.getAttribute("href");
		if (targetId === "#") return; // Abaikan jika hanya '#' tanpa target

		const targetElement = document.querySelector(targetId);
		if (targetElement) {
			// Scroll dengan animasi smooth ke posisi section dikurangi offset header (70px)
			window.scrollTo({
				top: targetElement.offsetTop - 70,
				behavior: "smooth",
			});
		}
	});
});

// Fungsi untuk menambah produk ke keranjang belanja dan animasi tombol
const cartButtons = document.querySelectorAll(".add-to-cart");
const cartCount = document.querySelector(".cart-count");
let itemsInCart = 0;

if (cartButtons.length > 0 && cartCount) {
	cartButtons.forEach((button) => {
		button.addEventListener("click", () => {
			itemsInCart++; // Hitung jumlah item di keranjang
			cartCount.textContent = itemsInCart; // Update tampilan jumlah item

			// Ubah tampilan tombol saat berhasil ditambahkan
			button.innerHTML = '<i class="ri-check-line"></i> Ditambahkan';
			button.style.backgroundColor = "#51cf66";

			// Kembalikan tombol ke tampilan awal setelah 1.5 detik
			setTimeout(() => {
				button.innerHTML =
					'<i class="ri-shopping-cart-line"></i> Tambah ke Keranjang';
				button.style.backgroundColor = "";
			}, 1500);
		});
	});
}

// Highlight link navigasi aktif berdasarkan scroll posisi section
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function highlightActiveLink() {
	let scrollPosition = window.scrollY + 100; // Offset untuk akurasi highlight

	sections.forEach((section) => {
		const sectionTop = section.offsetTop - 100;
		const sectionHeight = section.offsetHeight;
		const sectionId = section.getAttribute("id");

		if (
			scrollPosition >= sectionTop &&
			scrollPosition < sectionTop + sectionHeight
		) {
			navLinks.forEach((link) => {
				link.classList.remove("active");
				if (link.getAttribute("href") === `#${sectionId}`) {
					link.classList.add("active");
				}
			});
		}
	});
}

// Tambahkan style khusus untuk link aktif secara dinamis
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

// Pasang event listener untuk highlight link saat scroll dan load halaman
window.addEventListener("scroll", highlightActiveLink);
window.addEventListener("load", highlightActiveLink);

// Contoh fetch data produk dari API dan log hasilnya ke console// Contoh fetch data contact dari API dan log hasilnya ke console
	fetch("/api/contact")
	.then((res) => res.json())
	.then((data) => {
		console.log(data);
		// TODO: tampilkan produk ke UI sesuai kebutuhan
	});
