import {CONFIG} from "./config.js";

export function createNotifier(container) {
    return function notify(message, type = "info") {
        const item = document.createElement("div");
        item.className = `notification notification-${type}`;
        item.textContent = message;

        container.append(item);

        window.setTimeout(() => {
            item.classList.add("is-leaving");
            window.setTimeout(() => item.remove(), 180);
        }, CONFIG.notifications.ttlMs);
    };
}
