document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let preOrders = JSON.parse(localStorage.getItem('hatakePreOrders')) || [];

    // Initialize EmailJS with your Public Key (олу

    (function(){
        emailjs.init("Y394pQh4XZfrZd4GP");
    })();

    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const savePreOrders = () => {
        localStorage.setItem('hatakePreOrders', JSON.stringify(preOrders));
    };

    const updateCartDisplay = () => {
        // Only update cart display on cart.html
        const cartItemsDiv = document.getElementById('cart-items');
        const cartTotalSpan = document.getElementById('cart-total');
        if (!cartItemsDiv || !cartTotalSpan) return; // Skip if not on cart.html

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
        if (!modal || !modalMessage) return; // Skip if modal not present
        modalMessage.textContent = message;
        modal.style.display = 'block';
    };

    const closeModal = () => {
        const modal = document.getElementById('pre-order-modal');
        if (!modal) return; // Skip if modal not present
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

        return emailjs.send("service_9wx14wb", "template_j9fc4ya", templateParams)
            .then(response => {
                console.log('Pre-order email sent successfully:', response.status, response.text);
                return true;
            }, error => {
                console.error('Failed to send pre-order email:', error);
                return false;
            });
    };

    const sendCheckoutEmail = (cartItems) => {
        const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
        const templateParams = {
            cart_items: cartItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price.toFixed(2),
                total: (item.price * item.quantity).toFixed(2)
            })),
            cart_total: cartTotal
        };

        return emailjs.send("service_9wx14wb", "template_592t939", templateParams)
            .then(response => {
                console.log('Checkout email sent successfully:', response.status, response.text);
                return true;
            }, error => {
                console.error('Failed to send checkout email:', error);
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
        const modalClose = document.querySelector('.modal-close');
        const modalButton = document.querySelector('.modal-button');
        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modalButton) modalButton.addEventListener('click', closeModal);
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

    // Only attach cart item listeners on cart.html
    const cartItemsDiv = document.getElementById('cart-items');
    if (cartItemsDiv) {
        cartItemsDiv.addEventListener('click', (e) => {
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
    }

    // Only attach clear cart and checkout listeners on cart.html
    const clearCartButton = document.getElementById('clear-cart');
    const checkoutButton = document.getElementById('checkout');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', () => {
            cart = [];
            saveCart();
            updateCartDisplay();
            showModal('Cart cleared!');
        });
    }
    if (checkoutButton) {
        checkoutButton.addEventListener('click', async () => {
            if (cart.length === 0) {
                showModal('Your cart is empty!');
                return;
            }

            // Send email with cart contents
            const emailSent = await sendCheckoutEmail(cart);

            // Show modal with updated message
            let modalMessage = 'Checkout submitted!';
            if (emailSent) {
                modalMessage += ' We have notified ewilliamhe@gmail.com of your order.';
            } else {
                modalMessage += ' Failed to notify ewilliamhe@gmail.com. Please email them manually.';
            }
            modalMessage += ' You can also email your pre-order details to ewilliamhe@gmail.com to confirm your purchase.';
            showModal(modalMessage);

            // Clear the cart after checkout
            cart = [];
            saveCart();
            updateCartDisplay();
        });
    }

    // Initial setup
    attachPreOrderListeners();
    updateCartDisplay();

    // Expose for re-attachment after sort/filter
    window.reAttachCartListeners = attachPreOrderListeners;
});