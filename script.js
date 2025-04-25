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

    // Countdown timer functionality
    function startCountdown() {
        const countdownDate = new Date("Oct 15, 2025 00:00:00").getTime();
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownDate - now;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            document.getElementById("countdown-timer").innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            if (distance < 0) {
                clearInterval(timer);
                document.getElementById("countdown-timer").innerHTML = "Launched!";
            }
        }, 1000);
    }
    startCountdown();
});