const API_BASE_URL = window.APP_API_BASE_URL || "http://localhost:5001";

document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".menu-button");
    const nav = document.querySelector(".nav-links");

    if (menuButton && nav) {
        menuButton.addEventListener("click", () => {
            nav.classList.toggle("open");
            menuButton.setAttribute("aria-expanded", String(nav.classList.contains("open")));
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => nav.classList.remove("open"));
        });
    }

    const year = document.querySelector("[data-year]");
    if (year) year.textContent = new Date().getFullYear();
});

async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    let data = {};
    try {
        data = await response.json();
    } catch {
        data = { success: false, message: "Unexpected server response" };
    }

    if (!response.ok) {
        const error = new Error(data.message || "Request failed");
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}
