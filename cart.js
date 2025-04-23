```javascript
document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let preOrders = JSON.parse(localStorage.getItem('hatakePreOrders')) || [];

    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const savePreOrders = () => {
        localStorage.setItem('hatakePreOrders', JSON.stringify(preOrders));
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
        const forms = document.querySelectorAll('.pre-order-form');
        console.log(`Found ${buttons.length} pre-order buttons, ${forms.length} pre-order forms`);

        buttons.forEach(button => {
            button.removeEventListener('click', handlePreOrderClick);
            button.addEventListener('click', handlePreOrderClick);
        });

        forms.forEach(form => {
            form.removeEventListener('submit', handlePreOrderFormSubmit);
            form.addEventListener('submit', handlePreOrderFormSubmit);
        });
    };

    const handlePreOrderClick = (e) => {
        e.stopPropagation();
        const button = e.currentTarget;
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        console.log(`Clicked Pre-Order for: ${name}, Price: ${price}`);

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

    const handlePreOrderFormSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget;
        const name = form.getAttribute('data-name');
        const price = parseFloat(form.getAttribute('data-price'));
        const email = form.querySelector('.pre-order-email').value;
        const quantity = parseInt(form.querySelector('.pre-order-quantity').value);
        const messageElement = form.querySelector('.pre-order-message');
        console.log(`Form submitted for: ${name}, Price: ${price}, Email: ${email}, Quantity: ${quantity}`);

        if (!name || isNaN(price) || !email || isNaN(quantity) || quantity < 1 || quantity > 5) {
            console.error('Invalid form data:', { name, price, email, quantity });
            messageElement.textContent = 'Please enter a valid email and quantity (1-5).';
            return;
        }

        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ name, price, quantity });
        }

        preOrders.push({ email, name, quantity, price, date: new Date().toISOString() });
        saveCart();
        savePreOrders();
        updateCartDisplay();
        messageElement.textContent = 'Pre-order submitted! Check your cart and email ewilliamhe@gmail.com to confirm.';
        form.reset();
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

    // Expose for re-attachment after sort/filter
    window.reAttachCartListeners = attachPreOrderListeners;
});
```