document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let preOrders = JSON.parse(localStorage.getItem('hatakePreOrders')) || [];

    // Initialize EmailJS with your User ID
    (function(){
        emailjs.init("YOUR_EMAILJS_USER_ID"); // Replace with your EmailJS User ID
    })();

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

    const showModal = (message) => {
        const modal = document.getElementById('pre-order-modal');
        const modalMessage = document.getElementById('modal-message');
        modalMessage.textContent = message;
        modal.style.display = 'block';
    };

    const closeModal = () => {
        const modal = document.getElementById('pre-order-modal');
        modal.style.display = 'none';
    };

    const sendPreOrderEmail = (email, name, quantity, price) => {
        const total = (price * quantity).toFixed(2);
        const templateParams = {
            user_email: email,
            product_name: name,
            quantity: quantity,
            price: price.toFixed(2),
            total: total
        };

        return emailjs.send('YOUR_EMAILJS_SERVICE_ID', 'YOUR_EMAILJS_TEMPLATE_ID', templateParams)
            .then(response => {
                console.log('Email sent successfully:', response.status, response.text);
                return true;
            }, error => {
                console.error('Failed to send email:', error);
                return false;
            });
    };

    const attachPreOrderListeners = () => {
        const forms = document.querySelectorAll('.pre-order-form');
        console.log(`Found ${forms.length} pre-order forms`);

        forms.forEach(form => {
            form.removeEventListener('submit', handlePreOrderFormSubmit);
            form.addEventListener('submit', handlePreOrderFormSubmit);
        });

        // Modal close handlers
        document.querySelector('.modal-close').addEventListener('click', closeModal);
        document.querySelector('.modal-button').addEventListener('click', closeModal);
    };

    const handlePreOrderFormSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget;
        const name = form.getAttribute('data-name');
        const price = parseFloat(form.getAttribute('data-price'));
        const email = form.querySelector('.pre-order-email').value;
        const quantity = parseInt(form.querySelector('.pre-order-quantity').value);
        const messageElement = form.querySelector('.pre-order-message');
        console.log(`Form submitted for: ${name}, Price: ${price}, Email: ${email}, Quantity: ${quantity}`);

        // Validate inputs
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!name || isNaN(price) || !emailRegex.test(email) || isNaN(quantity) || quantity < 1 || quantity > 5) {
            console.error('Invalid form data:', { name, price, email, quantity });
            messageElement.textContent = 'Please enter a valid email and quantity (1-5).';
            return;
        }

        // Update cart
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ name, price, quantity });
        }

        // Save pre-order
        preOrders.push({ email, name, quantity, price, date: new Date().toISOString() });
        saveCart();
        savePreOrders();
        updateCartDisplay();

        // Send email to ewilliamhe@gmail.com
        const emailSent = await sendPreOrderEmail(email, name, quantity, price);

        // Show modal with updated message
        let modalMessage = `Added ${quantity} x ${name} ($${price.toFixed(2)} each) to your cart!`;
        if (emailSent) {
            modalMessage += ' We have notified ewilliamhe@gmail.com of your pre-order.';
        } else {
            modalMessage += ' Failed to notify ewilliamhe@gmail.com. Please email them manually.';
        }
        showModal(modalMessage);
        messageElement.textContent = 'Pre-order submitted! Check your cart.';
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
        showModal('Cart cleared!');
    });

    document.getElementById('checkout').addEventListener('click', () => {
        if (cart.length === 0) {
            showModal('Your cart is empty!');
            return;
        }
        showModal('Please email your pre-order details to ewilliamhe@gmail.com to complete your purchase.');
    });

    // Initial setup
    attachPreOrderListeners();
    updateCartDisplay();

    // Expose for re-attachment after sort/filter
    window.reAttachCartListeners = attachPreOrderListeners;
});