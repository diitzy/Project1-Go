// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navMenu = document.querySelector(".nav-menu");

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    const icon = mobileMenuBtn.querySelector("i");
    if (navMenu.classList.contains("active")) {
      icon.classList.remove("ri-menu-line");
      icon.classList.add("ri-close-line");
    } else {
      icon.classList.remove("ri-close-line");
      icon.classList.add("ri-menu-line");
    }
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    // Close mobile menu if open
    if (navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      const icon = mobileMenuBtn.querySelector("i");
      icon.classList.remove("ri-close-line");
      icon.classList.add("ri-menu-line");
    }

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 70,
        behavior: "smooth",
      });
    }
  });
});

// Shopping Cart Functionality
const cartButtons = document.querySelectorAll(".add-to-cart");
const cartCount = document.querySelector(".cart-count");
let itemsInCart = 0;

if (cartButtons.length > 0 && cartCount) {
  cartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      itemsInCart++;
      cartCount.textContent = itemsInCart;

      // Animation for button
      button.innerHTML = '<i class="ri-check-line"></i> Ditambahkan';
      button.style.backgroundColor = "#51cf66";

      setTimeout(() => {
        button.innerHTML =
          '<i class="ri-shopping-cart-line"></i> Tambah ke Keranjang';
        button.style.backgroundColor = "";
      }, 1500);
    });
  });
}

// Active Navigation Link
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function highlightActiveLink() {
  let scrollPosition = window.scrollY + 100;

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

// Add active class style
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

window.addEventListener("scroll", highlightActiveLink);
window.addEventListener("load", highlightActiveLink);

// Form Submission
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const name = this.querySelector("#name").value;
    const email = this.querySelector("#email").value;
    const message = this.querySelector("#message").value;

    // Basic validation
    if (!name || !email || !message) {
      alert("Harap isi semua kolom formulir.");
      return;
    }

    // Here you would normally send the data to a server
    // For demo purposes, we'll just show a success message
    this.innerHTML = `
            <div class="success-message">
                <i class="ri-check-line" style="font-size: 48px; color: #51cf66; margin-bottom: 20px;"></i>
                <h3>Terima Kasih!</h3>
                <p>Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.</p>
            </div>
        `;
  });
}

// Contoh fetch di script.js
fetch("/api/products")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    // Tampilkan ke UI
  });
