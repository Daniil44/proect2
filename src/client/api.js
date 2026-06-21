export async function postJson(url, body) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    return parseResponse(response);
}

export async function parseResponse(response) {
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error(payload?.message || `HTTP ${response.status}`);
        error.status = response.status;
        error.payload = payload;
        throw error;
    }

    return payload;
}

export function formatError(error, fallback) {
    if (error?.status === 400) {
        return error.payload?.message || "Данные не прошли валидацию";
    }

    return error?.message || fallback;
}
