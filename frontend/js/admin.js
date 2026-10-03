function authHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function adminRequest(path, options = {}) {
    try {
        return await apiRequest(path, {
            ...options,
            headers: {
                ...(options.headers || {}),
                ...authHeaders()
            }
        });
    } catch (error) {
        if (error.status === 401 || error.status === 403) {
            clearToken();
            window.location.href = "admin-login.html";
        }
        throw error;
    }
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatDate(value) {
    return new Date(value).toLocaleString();
}

async function loadDashboard() {
    const enquiries = await adminRequest("/api/enquiries");

    const counts = {
        total: enquiries.length,
        NEW: 0,
        CONTACTED: 0,
        IN_PROGRESS: 0,
        COMPLETED: 0
    };

    enquiries.forEach(e => {
        if (counts[e.status] !== undefined) counts[e.status]++;
    });

    document.querySelector("#total-count").textContent = counts.total;
    document.querySelector("#new-count").textContent = counts.NEW;
    document.querySelector("#contacted-count").textContent = counts.CONTACTED;
    document.querySelector("#progress-count").textContent = counts.IN_PROGRESS;
    document.querySelector("#completed-count").textContent = counts.COMPLETED;

    const tbody = document.querySelector("#enquiries-body");

    if (!enquiries.length) {
        tbody.innerHTML = `<tr><td colspan="9">No enquiries found.</td></tr>`;
        return;
    }

    tbody.innerHTML = enquiries.map(e => `
        <tr>
            <td>${e.id}</td>
            <td>${escapeHtml(e.name)}</td>
            <td>${escapeHtml(e.company || "-")}</td>
            <td>${escapeHtml(e.email)}</td>
            <td>${escapeHtml(e.phone)}</td>
            <td>${escapeHtml(e.service)}</td>
            <td>
                <select class="status-select" data-id="${e.id}">
                    ${["NEW","CONTACTED","IN_PROGRESS","COMPLETED","CLOSED"].map(status =>
                        `<option value="${status}" ${e.status === status ? "selected" : ""}>${status}</option>`
                    ).join("")}
                </select>
            </td>
            <td>${formatDate(e.createdAt)}</td>
            <td>
                <button class="small-button view-button" data-id="${e.id}">View</button>
                <button class="small-button delete-button" data-id="${e.id}">Delete</button>
            </td>
        </tr>
    `).join("");

    tbody.querySelectorAll(".status-select").forEach(select => {
        select.addEventListener("change", async () => {
            try {
                await adminRequest(`/api/enquiries/${select.dataset.id}/status`, {
                    method: "PATCH",
                    body: JSON.stringify({ status: select.value })
                });
                await loadDashboard();
            } catch (error) {
                alert(error.message);
            }
        });
    });

    tbody.querySelectorAll(".view-button").forEach(button => {
        button.addEventListener("click", async () => {
            try {
                const e = await adminRequest(`/api/enquiries/${button.dataset.id}`);
                alert(
                    `Enquiry #${e.id}\n\n` +
                    `Name: ${e.name}\n` +
                    `Company: ${e.company || "-"}\n` +
                    `Email: ${e.email}\n` +
                    `Phone: ${e.phone}\n` +
                    `Service: ${e.service}\n` +
                    `Status: ${e.status}\n\n` +
                    `Message:\n${e.message}`
                );
            } catch (error) {
                alert(error.message);
            }
        });
    });

    tbody.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", async () => {
            if (!confirm("Delete this enquiry?")) return;

            try {
                await adminRequest(`/api/enquiries/${button.dataset.id}`, {
                    method: "DELETE"
                });
                await loadDashboard();
            } catch (error) {
                alert(error.message);
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    if (!getToken()) {
        window.location.href = "admin-login.html";
        return;
    }

    document.querySelector("#logout-button")?.addEventListener("click", () => {
        clearToken();
        window.location.href = "admin-login.html";
    });

    try {
        await loadDashboard();
    } catch (error) {
        console.error(error);
    }
});
