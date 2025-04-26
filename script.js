document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, script.js running");

    // Theme toggle functionality with local storage
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Check for saved theme preference in local storage
    const savedTheme = localStorage.getItem("theme");
    console.log("Saved theme from localStorage:", savedTheme);
    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
        themeToggle.textContent = "☀️";
        console.log("Applied dark mode on page load");
    } else {
        body.classList.remove("dark-mode");
        themeToggle.textContent = "🌙";
        console.log("Applied light mode on page load");
    }

    themeToggle.addEventListener("click", () => {
        console.log("Theme toggle clicked");
        body.classList.toggle("dark-mode");
        const isDarkMode = body.classList.contains("dark-mode");
        themeToggle.textContent = isDarkMode ? "☀️" : "🌙";
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
        console.log("Theme set to:", isDarkMode ? "dark" : "light");
    });

    // Back to top button functionality
    const backToTopButton = document.getElementById("back-to-top");
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

    // Countdown timer functionality for multiple timers
    function startCountdowns() {
        console.log("startCountdowns function called");
        const timers = document.querySelectorAll(".countdown-timer");
        console.log(`Found ${timers.length} countdown timers`);

        if (timers.length === 0) {
            console.error("No elements with class 'countdown-timer' found");
            return;
        }

        timers.forEach((timer, index) => {
            console.log(`Processing timer ${index + 1}`);
            const targetDateStr = timer.getAttribute("data-target");
            console.log(`Target date for timer ${index + 1}: ${targetDateStr}`);

            const targetDate = new Date(targetDateStr).getTime();
            if (isNaN(targetDate)) {
                console.error(`Invalid date for timer ${index + 1}: ${targetDateStr}`);
                timer.innerHTML = "Date Error";
                return;
            }

            timer.innerHTML = "Starting...";

            const interval = setInterval(() => {
                const now = new Date().getTime();
                const distance = targetDate - now;

                if (distance < 0) {
                    clearInterval(interval);
                    timer.innerHTML = "Available Now!";
                    console.log(`Timer ${index + 1} has finished`);
                    return;
                }

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                timer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
                console.log(`Timer ${index + 1} updated: ${days}d ${hours}h ${minutes}m ${seconds}s`);
            }, 1000);
        });
    }

    try {
        startCountdowns();
    } catch (error) {
        console.error("Error in startCountdowns:", error);
    }

    // Product sorting functionality
    const productSort = document.getElementById("product-sort");
    const productGrid = document.querySelector(".product-grid");

    if (productSort && productGrid) {
        // Store the original order of products
        const originalProducts = Array.from(productGrid.children);

        productSort.addEventListener("change", () => {
            console.log("Product sort changed to:", productSort.value);
            const sortValue = productSort.value;

            // Get all products as an array
            let products = Array.from(productGrid.children);

            if (sortValue === "default") {
                // Restore original order
                products = originalProducts;
            } else {
                // Sort by price
                products.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector("p").textContent.replace("$", ""));
                    const priceB = parseFloat(b.querySelector("p").textContent.replace("$", ""));
                    return sortValue === "price-low" ? priceA - priceB : priceB - priceA;
                });
            }

            // Clear the grid and re-append sorted products
            productGrid.innerHTML = "";
            products.forEach(product => productGrid.appendChild(product));
            console.log("Products sorted:", sortValue);
        });
    }
});