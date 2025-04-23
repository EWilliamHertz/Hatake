```javascript
document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const updateCartDisplay = () => {
        const cartItemsDiv = document.getElementById('cart-items');
        const cartTotalSpan = document.getElementById('cart-total');
        cartItemsDiv.innerHTML = '';

        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalSpan.textContent = 'Total: $0.00';
            return;
        }

        let total = 0;
        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <div>
                    <button class="quantity-decrease" data-index="${index}">-</button>
                    <button class="quantity-increase" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}">Remove</button>
                </div>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            cartItemsDiv.appendChild(itemDiv);
            total += item.price * item.quantity;
        });

        cartTotalSpan.textContent = `Total: $${total.toFixed(2)}`;
    };

    const attachPreOrderListeners = () => {
        const buttons = document.querySelectorAll('.pre-order-btn');
        console.log(`Found ${buttons.length} pre-order buttons`); // Debug: Check number of buttons
        buttons.forEach(button => {
            button.removeEventListener('click', handlePreOrderClick); // Prevent duplicate listeners
            button.addEventListener('click', handlePreOrderClick);
        });
    };

    const handlePreOrderClick = (e) => {
        e.stopPropagation(); // Prevent parent click events
        const button = e.currentTarget;
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        console.log(`Clicked Pre-Order for: ${name}, Price: ${price}`); // Debug: Log click event

        if (!name || isNaN(price)) {
            console.error('Invalid product data:', { name, price });
            alert('Error: Invalid product data.');
            return;
        }

        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        saveCart();
        updateCartDisplay();
        alert(`Added ${name} ($${price.toFixed(2)}) to pre-order cart! Email ewilliamhe@gmail.com to confirm your pre-order.`);
    };

    document.getElementById('cart-items').addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        if (isNaN(index)) return;

        if (e.target.classList.contains('quantity-increase')) {
            cart[index].quantity += 1;
        } else if (e.target.classList.contains('quantity-decrease')) {
            cart[index].quantity -= 1;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
        } else if (e.target.classList.contains('remove-item')) {
            cart.splice(index, 1);
        }

        saveCart();
        updateCartDisplay();
    });

    document.getElementById('clear-cart').addEventListener('click', () => {
        cart = [];
        saveCart();
        updateCartDisplay();
        alert('Cart cleared!');
    });

    document.getElementById('checkout').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Please email your pre-order details to ewilliamhe@gmail.com to complete your purchase.');
    });

    // Initial setup
    attachPreOrderListeners();
    updateCartDisplay();

    // Re-attach listeners after sort/filter (called from script.js)
    window.reAttachCartListeners = attachPreOrderListeners;
});
```
