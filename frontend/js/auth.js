const TOKEN_KEY = "aprava_admin_token";

function saveToken(token) {
    sessionStorage.setItem(TOKEN_KEY, token);
}

function getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
}

function clearToken() {
    sessionStorage.removeItem(TOKEN_KEY);
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#admin-login-form");
    const message = document.querySelector("#login-message");

    if (!form) return;

    if (getToken()) {
        window.location.href = "admin-dashboard.html";
        return;
    }

    form.addEventListener("submit", async event => {
        event.preventDefault();
        message.textContent = "Signing in...";

        const data = Object.fromEntries(new FormData(form).entries());

        try {
            const response = await apiRequest("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(data)
            });

            saveToken(response.token);
            window.location.href = "admin-dashboard.html";
        } catch {
            message.textContent = "Invalid username or password.";
        }
    });
});
