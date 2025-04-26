document.addEventListener("DOMContentLoaded", () => {
    // Theme toggle functionality with local storage
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Check for saved theme preference in local storage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
        themeToggle.textContent = "☀️";
    } else {
        themeToggle.textContent = "🌙";
    }

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        const isDarkMode = body.classList.contains("dark-mode");
        themeToggle.textContent = isDarkMode ? "☀️" : "🌙";
        // Save the theme preference to local storage
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
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
        // Select all elements with class 'countdown-timer'
        const timers = document.querySelectorAll(".countdown-timer");

        timers.forEach(timer => {
            // Get the target date from the data-target attribute
            const targetDate = new Date(timer.getAttribute("data-target")).getTime();

            // Start a countdown for this specific timer
            const interval = setInterval(() => {
                const now = new Date().getTime();
                const distance = targetDate - now;

                // Calculate days, hours, minutes, seconds
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Update the timer display
                timer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

                // If the countdown is finished, display a message
                if (distance < 0) {
                    clearInterval(interval);
                    timer.innerHTML = "Available Now!";
                }
            }, 1000);
        });
    }

    // Start all countdowns
    startCountdowns();

    // Search bar functionality
    const searchBar = document.getElementById("search-bar");
    const searchButton = document.getElementById("search-button");

    function performSearch() {
        const query = searchBar.value.trim().toLowerCase();
        if (!query) {
            alert("Please enter a search term.");
            return;
        }

        // Define search mappings: keywords to page URLs
        const searchMap = {
            "sleeves": "shop.html",
            "matte sleeves": "shop.html",
            "top-loader": "shop.html",
            "toploaders": "shop.html",
            "deckbox": "shop.html",
            "deckboxes": "shop.html",
            "binder": "shop.html",
            "duffel bag": "shop.html",
            "duffel": "shop.html",
            "shop": "shop.html",
            "products": "shop.html",
            "about": "about.html",
            "story": "about.html",
            "behind the scenes": "about.html",
            "events": "events.html",
            "mtg": "mtg.html",
            "magic the gathering": "mtg.html",
            "partner": "partner.html",
            "press": "press-kit.html",
            "press kit": "press-kit.html",
            "contact": "about.html"
        };

        // Find a matching keyword
        let redirectPage = "index.html"; // Default to homepage if no match
        for (const keyword in searchMap) {
            if (query.includes(keyword)) {
                redirectPage = searchMap[keyword];
                break;
            }
        }

        // Redirect to the matched page
        window.location.href = redirectPage;
    }

    // Handle search button click
    if (searchButton) {
        searchButton.addEventListener("click", performSearch);
    }

    // Handle Enter key press in search bar
    if (searchBar) {
        searchBar.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                performSearch();
            }
        });
    }
});