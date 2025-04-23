document.addEventListener("DOMContentLoaded", () => {
    // Back-to-Top Button
    const backToTopButton = document.getElementById("back-to-top");
    if (backToTopButton) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                backToTopButton.style.display = "block";
            } else {
                backToTopButton.style.display = "none";
            }
        });

        backToTopButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Dark Mode Toggle
    const themeToggle = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme") || "light";

    if (currentTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeToggle.textContent = "☀️";
    }

    themeToggle.addEventListener("click", () => {
        const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", theme);
        themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
        localStorage.setItem("theme", theme);
    });

    // Existing script for product sorting, searching, countdown timers, etc.
    const products = Array.from(document.querySelectorAll(".product"));
    const productGrid = document.getElementById("product-grid");
    const sortSelect = document.getElementById("product-sort");
    const searchInput = document.getElementById("product-search");
    const searchForm = document.getElementById("search-form");

    // Sorting functionality
    if (sortSelect && productGrid) {
        sortSelect.addEventListener("change", () => {
            const sortValue = sortSelect.value;
            let sortedProducts = [...products];

            if (sortValue === "price-low") {
                sortedProducts.sort((a, b) => parseFloat(a.querySelector("p").textContent.replace("$", "")) - parseFloat(b.querySelector("p").textContent.replace("$", "")));
            } else if (sortValue === "price-high") {
                sortedProducts.sort((a, b) => parseFloat(b.querySelector("p").textContent.replace("$", "")) - parseFloat(a.querySelector("p").textContent.replace("$", "")));
            }

            productGrid.innerHTML = "";
            sortedProducts.forEach(product => productGrid.appendChild(product));
        });
    }

    // Search functionality
    if (searchInput && searchForm && productGrid) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const searchTerm = searchInput.value.toLowerCase();
            products.forEach(product => {
                const productName = product.querySelector("h3").textContent.toLowerCase();
                product.style.display = productName.includes(searchTerm) ? "" : "none";
            });
        });
    }

    // Countdown timer functionality
    const timers = document.querySelectorAll(".countdown-timer");
    timers.forEach(timer => {
        const targetDate = new Date(timer.getAttribute("data-target")).getTime();
        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                timer.textContent = "Available Now!";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            timer.querySelector("span").textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        };
        updateTimer();
        setInterval(updateTimer, 1000);
    });

    // Pre-order form handling
    const forms = document.querySelectorAll(".pre-order-form");
    const modal = document.getElementById("pre-order-modal");
    const modalMessage = document.getElementById("modal-message");
    const modalClose = document.querySelector(".modal-close");
    const modalButton = document.querySelector(".modal-button");

    forms.forEach(form => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = form.querySelector(".pre-order-email").value;
            const quantity = form.querySelector(".pre-order-quantity").value;
            const productName = form.getAttribute("data-name");
            const price = form.getAttribute("data-price");
            const total = (parseFloat(price) * parseInt(quantity)).toFixed(2);

            modalMessage.textContent = `Thank you for pre-ordering ${quantity} ${productName}(s) at $${price} each. Total: $${total}.`;
            modal.style.display = "block";

            form.querySelector(".pre-order-message").textContent = "Pre-Order Submitted!";
            form.reset();
        });
    });

    if (modalClose) {
        modalClose.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    if (modalButton) {
        modalButton.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }
});

// Toggle product details
function toggleDetails(product) {
    product.classList.toggle("clicked");
}