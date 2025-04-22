document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('product-search');
    const sortSelect = document.getElementById('product-sort');
    const productGrid = document.querySelector('.product-grid');
    const products = Array.from(document.querySelectorAll('.product'));

    // Store original product order
    const originalProducts = products.map(product => product.cloneNode(true));

    // Search functionality
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        filterProducts();
    });

    // Real-time search as user types
    searchInput.addEventListener('input', filterProducts);

    function filterProducts() {
        const query = searchInput.value.trim().toLowerCase();
        products.forEach(product => {
            const name = product.querySelector('h3').textContent.toLowerCase();
            product.style.display = name.includes(query) ? 'block' : 'none';
        });
    }

    // Sort functionality
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
            // Reset to original order
            sortedProducts = originalProducts.map(product => product.cloneNode(true));
        }

        // Clear and repopulate product grid
        productGrid.innerHTML = '';
        sortedProducts.forEach(product => productGrid.appendChild(product));
    });
});