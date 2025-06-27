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
    document.head.insertAdjacentHTML("beforeend", `
        <style>
            .nav-link.active {
                color: #ff6b6b;
            }
            .nav-link.active:after {
                width: 100%;
            }
        </style>
    `);

    // ===================== Tambahkan CSS untuk Dropdown =====================
    const dropdownStyles = `
        <style>
            .user-dropdown {
                position: relative;
                display: inline-block;
            }
            .user-button {
                background: none;
                border: none;
                color: inherit;
                font-size: 1rem;
                cursor: pointer;
                padding: 8px 12px;
                display: flex;
                align-items: center;
                gap: 8px;
                border-radius: 6px;
                transition: background-color 0.3s ease;
            }
            .user-button:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
            .user-email {
                max-width: 150px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .dropdown-arrow {
                font-size: 1.2rem;
                transition: transform 0.3s ease;
            }
            .user-dropdown:hover .dropdown-arrow {
                transform: rotate(180deg);
            }
            .dropdown-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                min-width: 180px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1000;
                border: 1px solid #e1e5e9;
            }
            .user-dropdown:hover .dropdown-menu {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            .dropdown-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 16px;
                color: #333;
                text-decoration: none;
                transition: background-color 0.2s ease;
                border-bottom: 1px solid #f0f0f0;
            }
            .dropdown-item:last-child {
                border-bottom: none;
            }
            .dropdown-item:hover {
                background-color: #f8f9fa;
            }
            .dropdown-item i {
                font-size: 1.1rem;
                width: 16px;
            }
            @media (max-width: 768px) {
                .user-email {
                    display: none;
                }
                .dropdown-menu {
                    right: -20px;
                    min-width: 160px;
                }
            }
        </style>
    `;

    // Tambahkan styles ke head jika belum ada
    if (!document.getElementById("user-dropdown-styles")) {
        const styleElement = document.createElement("div");
        styleElement.id = "user-dropdown-styles";
        styleElement.innerHTML = dropdownStyles;
        document.head.appendChild(styleElement);
    }

    // ===================== Navigasi ke Cart =====================
    const cartIcon = document.querySelector(".ri-shopping-cart-line");
    if (cartIcon && cartIcon.closest('a')) {
        cartIcon.closest('a').addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "/cart";
        });
    }

    // ===================== Fetch API Contact =====================
    fetch("/api/contact")
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('Network response was not ok');
        })
        .then(data => {
            console.log(data);
            // TODO: Tampilkan data kontak ke UI jika diperlukan
        })
        .catch(error => {
            console.log('Fetch contact API error:', error);
        });
});
