document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS with your Public Key
    (function(){
        emailjs.init("Y394pQh4XZfrZd4GP");
    })();

    const showModal = (message) => {
        const modal = document.getElementById('pre-order-modal');
        const modalMessage = document.getElementById('modal-message');
        if (!modal || !modalMessage) return;
        modalMessage.textContent = message;
        modal.style.display = 'block';
    };

    const closeModal = () => {
        const modal = document.getElementById('pre-order-modal');
        if (!modal) return;
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

        // Send email to ewilliamhe@gmail.com
        const emailSent = await sendPreOrderEmail(email, name, quantity, price);

        // Show modal with updated message
        let modalMessage = `Pre-order submitted for ${quantity} x ${name} ($${price.toFixed(2)} each)!`;
        if (emailSent) {
            modalMessage += ' We have notified ewilliamhe@gmail.com of your pre-order.';
        } else {
            modalMessage += ' Failed to notify ewilliamhe@gmail.com. Please email them manually.';
        }
        showModal(modalMessage);
        messageElement.textContent = 'Pre-order submitted!';
        form.reset();
    };

    // Initial setup
    attachPreOrderListeners();

    // Expose for re-attachment after sort/filter
    window.reAttachCartListeners = attachPreOrderListeners;
});
