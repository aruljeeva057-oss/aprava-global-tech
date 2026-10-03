document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#contact-form");
    const message = document.querySelector("#contact-message");

    if (!form) return;

    form.addEventListener("submit", async event => {
        event.preventDefault();
        message.textContent = "Sending...";

        const data = Object.fromEntries(new FormData(form).entries());

        try {
            await apiRequest("/api/contact", {
                method: "POST",
                body: JSON.stringify(data)
            });

            form.reset();
            message.textContent = "Thank you. Your message has been submitted successfully.";
        } catch (error) {
            message.textContent = error.message || "Unable to submit your message.";
        }
    });
});
