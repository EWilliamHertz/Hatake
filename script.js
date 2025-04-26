document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, script.js running");

    // Theme toggle functionality with local storage
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Check for saved theme preference in local storage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        body.setAttribute("data-theme", "dark");
        themeToggle.textContent = "☀️";
    } else {
        body.setAttribute("data-theme", "light");
        themeToggle.textContent = "🌙";
    }

    themeToggle.addEventListener("click", () => {
        const currentTheme = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
        body.setAttribute("data-theme", currentTheme);
        themeToggle.textContent = currentTheme === "dark" ? "☀️" : "🌙";
        localStorage.setItem("theme", currentTheme);
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

            // Validate the target date
            const targetDate = new Date(targetDateStr).getTime();
            if (isNaN(targetDate)) {
                console.error(`Invalid date for timer ${index + 1}: ${targetDateStr}`);
                timer.innerHTML = "Invalid Date";
                return;
            }

            // Start countdown for this timer
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

    // Start all countdowns with a slight delay to ensure DOM is fully rendered
    try {
        setTimeout(startCountdowns, 100); // Delay to handle nested elements
    } catch (error) {
        console.error("Error in startCountdowns:", error);
    }

    // Search bar functionality
    const searchBar = document.getElementById("search-bar");
    const searchButton = document.getElementById("search-button");

    function performSearch() {
        const query = searchBar.value.trim().toLowerCase();
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
            "invest": "partner.html",
            "retailers": "partner.html"
        };

        let redirectPage = "index.html";
        for (const keyword in searchMap) {
            if (query.includes(keyword)) {
                redirectPage = searchMap[keyword];
                break;
            }
        }

        // If no keyword match, search page content
        const pages = [
            { url: "index.html", keywords: ["home", "welcome", "pre-order", "testimonials"] },
            { url: "shop.html", keywords: ["shop", "products", "sleeves", "deckbox", "binder", "duffel", "top-loader"] },
            { url: "about.html", keywords: ["about", "story", "behind the scenes", "hatake tcg"] },
            { url: "events.html", keywords: ["events", "convention", "launch party", "swecard"] },
            { url: "mtg.html", keywords: ["mtg", "magic the gathering", "tournaments", "modern", "legacy"] },
            { url: "partner.html", keywords: ["partner", "invest", "retailers", "sales"] }
        ];

        for (const page of pages) {
            if (page.keywords.some(keyword => query.includes(keyword))) {
                redirectPage = page.url;
                break;
            }
        }

        window.location.href = redirectPage;
    }

    if (searchButton) {
        searchButton.addEventListener("click", performSearch);
    }

    if (searchBar) {
        searchBar.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                performSearch();
            }
        });
    }
});