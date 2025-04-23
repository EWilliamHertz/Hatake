document.addEventListener('DOMContentLoaded', () => {
    // Initialize countdown timers
    document.querySelectorAll('.countdown-timer').forEach(timer => {
        const targetDate = new Date(timer.getAttribute('data-target'));
        
        function updateTimer() {
            const now = new Date();
            const timeDifference = targetDate - now;

            if (timeDifference <= 0) {
                timer.textContent = 'Pre-Orders Closed!';
                return;
            }

            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            timer.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    });

    // Toggle details on click
    function toggleDetails(element) {
        document.querySelectorAll('.product').forEach(product => {
            if (product !== element) {
                product.classList.remove('clicked');
            }
        });
        element.classList.toggle('clicked');
    }

    // Expose toggleDetails to global scope for HTML onclick
    window.toggleDetails = toggleDetails;

    // Prevent click on details from closing the overlay
    document.querySelectorAll('.details').forEach(detail => {
        detail.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Search and sort functionality for shop page
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('product-search');
    const sortSelect = document.getElementById('product-sort');
    const productGrid = document.querySelector('.product-grid');
    const products = Array.from(document.querySelectorAll('.product'));

    if (searchForm && productGrid) {
        const originalProducts = products.map(product => product.cloneNode(true));

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            filterProducts();
        });

        searchInput.addEventListener('input', filterProducts);

        function filterProducts() {
            const query = searchInput.value.trim().toLowerCase();
            products.forEach(product => {
                const name = product.querySelector('h3').textContent.toLowerCase();
                product.style.display = name.includes(query) ? 'block' : 'none';
            });
        }

        
        sortSelect.addEventListener('change', () => {
            const sortValue = sortSelect.value;
            let sortedProducts = [...products];

            if (sortValue === 'price-low') {
                sortedProducts.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('p').textContent.replace('$', ''));
                    const priceB = parseFloat(b.querySelector('p').textContent.replace('$', ''));
                    return priceA - priceB;
                });
            } else if (sortValue === 'price-high') {
                sortedProducts.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('p').textContent.replace('$', ''));
                    const priceB = parseFloat(b.querySelector('p').textContent.replace('$', ''));
                    return priceB - priceA;
                });
            } else {
                sortedProducts = originalProducts.map(product => product.cloneNode(true));
            }

            productGrid.innerHTML = '';
            sortedProducts.forEach(product => productGrid.appendChild(product));
        });
    }
});
