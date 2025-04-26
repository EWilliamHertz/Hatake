document.addEventListener("DOMContentLoaded", () => {
    // Initialize EmailJS
    emailjs.init("YOUR_EMAILJS_USER_ID"); // Replace with your EmailJS User ID

    const forms = document.querySelectorAll(".pre-order-form");
    const modal = document.getElementById("pre-order-modal");
    const modalMessage = document.getElementById("modal-message");
    const modalClose = document.querySelector(".modal-close");
    const modalButton = document.querySelector(".modal-button");

    forms.forEach(form => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = form.querySelector(".pre-order-email").value;
            const quantity = form.querySelector(".pre-order-quantity").value;
            const productName = form.dataset.name;
            const productPrice = form.dataset.price;
            const totalPrice = (parseFloat(productPrice) * parseInt(quantity)).toFixed(2);

            // Simulate sending pre-order data (replace with actual EmailJS call)
            const templateParams = {
                to_email: email,
                product_name: productName,
                quantity: quantity,
                total_price: totalPrice,
            };

            // Simulate successful submission
            modalMessage.innerHTML = `Thank you for pre-ordering ${quantity} x ${productName}! Total: $${totalPrice}.`;
            modal.style.display = "flex";

            // Reset form
            form.reset();
            form.querySelector(".pre-order-message").innerHTML = "Pre-order submitted! Check your email.";

            // Uncomment the following to enable actual EmailJS integration
            /*
            emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
                .then(() => {
                    modalMessage.innerHTML = `Thank you for pre-ordering ${quantity} x ${productName}! Total: $${totalPrice}.`;
                    modal.style.display = "flex";
                    form.reset();
                    form.querySelector(".pre-order-message").innerHTML = "Pre-order submitted! Check your email.";
                }, (error) => {
                    console.error("EmailJS error:", error);
                    form.querySelector(".pre-order-message").innerHTML = "Error submitting pre-order. Please try again.";
                });
            */
        });
    });

    // Close modal on button click
    modalButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal on close icon click
    modalClose.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});