document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#enquiry-form");
    const message = document.querySelector("#enquiry-message");

    if (!form) return;

    form.addEventListener("submit", async event => {
        event.preventDefault();
        message.textContent = "Submitting...";

        const data = Object.fromEntries(new FormData(form).entries());

        try {
            await apiRequest("/api/enquiries", {
                method: "POST",
                body: JSON.stringify(data)
            });

            form.reset();
            message.textContent = "Thank you. Your enquiry has been submitted successfully.";
        } catch (error) {
            message.textContent = error.message || "Unable to submit your enquiry.";
        }
    });
});
