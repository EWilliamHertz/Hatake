document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, script.js running");

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

    // Search bar functionality
    const searchBar = document.getElementById("search-bar");
    const searchButton = document.getElementById("search-button");

    console.log("Search bar element:", searchBar);
    console.log("Search button element:", searchButton);

    if (!searchBar || !searchButton) {
        console.error("Search bar or button not found in the DOM");
        return;
    }

    function performSearch() {
        console.log("performSearch function called");
        const query = searchBar.value.trim().toLowerCase();
        console.log("Search query:", query);

        if (!query) {
            alert("Please enter a search term.");
            return;
        }

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

        let redirectPage = "index.html";
        for (const keyword in searchMap) {
            if (query.includes(keyword)) {
                redirectPage = searchMap[keyword];
                console.log(`Match found for keyword "${keyword}", redirecting to ${redirectPage}`);
                break;
            }
        }

        console.log("Redirecting to:", redirectPage);
        window.location.href = redirectPage;
    }

    searchButton.addEventListener("click", () => {
        console.log("Search button clicked");
        performSearch();
    });

    searchBar.addEventListener("keypress", (event) => {
        console.log("Key pressed in search bar:", event.key);
        if (event.key === "Enter") {
            event.preventDefault();
            console.log("Enter key pressed, performing search");
            performSearch();
        }
    });
});