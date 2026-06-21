import {CONFIG} from "./config.js";

export function installChatControls(ui, {sendMessage, refreshHistory, notify}) {
    ui.messageForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const text = ui.messageInput.value.trim();

        if (!text) {
            notify("Сообщение пустое", "error");
            return;
        }

        if (text.length > CONFIG.chat.maxLength) {
            notify("Сообщение слишком длинное", "error");
            return;
        }

        sendMessage(text);
        ui.messageInput.value = "";
    });

    ui.chatRefreshButton.addEventListener("click", refreshHistory);
}

export function renderChatHistory(ui, messages) {
    ui.chatHistory.innerHTML = "";

    for (const message of messages.slice(-CONFIG.chat.historyLimit)) {
        appendChatMessage(ui, message, false);
    }

    ui.chatHistory.scrollTop = ui.chatHistory.scrollHeight;
}

export function appendChatMessage(ui, message, shouldScroll = true) {
    const item = document.createElement("div");
    item.className = "chat-message";

    const author = document.createElement("span");
    author.className = "chat-author";
    author.textContent = message.username || "system";

    const text = document.createElement("span");
    text.className = "chat-text";
    text.textContent = message.text || "";

    item.append(author, document.createTextNode(": "), text);
    ui.chatHistory.append(item);

    while (ui.chatHistory.children.length > CONFIG.chat.historyLimit) {
        ui.chatHistory.firstElementChild?.remove();
    }

    if (shouldScroll) {
        ui.chatHistory.scrollTop = ui.chatHistory.scrollHeight;
    }
}

export function appendChatSystem(ui, text) {
    const item = document.createElement("div");
    item.className = "chat-message chat-system";
    item.textContent = text;
    ui.chatHistory.append(item);
    ui.chatHistory.scrollTop = ui.chatHistory.scrollHeight;
}
