import {CONFIG} from "./config.js";

export function createInterface() {
    document.body.innerHTML = "";

    const gameRoot = document.createElement("main");
    gameRoot.className = "game-root is-hidden";

    const loginPanel = document.createElement("section");
    loginPanel.className = "login-panel";

    const loginForm = document.createElement("form");
    loginForm.className = "login-form";

    const loginTitle = document.createElement("h1");
    loginTitle.textContent = "Three Chat";

    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.name = "username";
    usernameInput.placeholder = "Ник";
    usernameInput.minLength = 3;
    usernameInput.maxLength = 25;
    usernameInput.autocomplete = "nickname";
    usernameInput.pattern = "[a-zA-Z0-9_]+";
    usernameInput.required = true;

    const loginButton = document.createElement("button");
    loginButton.type = "submit";
    loginButton.textContent = "Войти";

    loginForm.append(loginTitle, usernameInput, loginButton);
    loginPanel.append(loginForm);

    const chatPanel = document.createElement("aside");
    chatPanel.className = "chat-panel is-hidden";

    const chatHeader = document.createElement("div");
    chatHeader.className = "chat-header";

    const chatTitle = document.createElement("div");
    chatTitle.className = "chat-title";
    chatTitle.textContent = "Чат";

    const chatActions = document.createElement("div");
    chatActions.className = "chat-actions";

    const chatRefreshButton = document.createElement("button");
    chatRefreshButton.type = "button";
    chatRefreshButton.className = "icon-button";
    chatRefreshButton.title = "Обновить историю";
    chatRefreshButton.setAttribute("aria-label", "Обновить историю");
    chatRefreshButton.textContent = "↻";

    const chatCollapseButton = document.createElement("button");
    chatCollapseButton.type = "button";
    chatCollapseButton.className = "icon-button";
    chatCollapseButton.title = "Свернуть чат";
    chatCollapseButton.setAttribute("aria-label", "Свернуть чат");
    chatCollapseButton.textContent = "−";

    chatActions.append(chatRefreshButton, chatCollapseButton);
    chatHeader.append(chatTitle, chatActions);

    const chatHistory = document.createElement("div");
    chatHistory.className = "chat-history";
    chatHistory.setAttribute("aria-live", "polite");

    chatPanel.append(chatHeader, chatHistory);

    const messageDock = document.createElement("div");
    messageDock.className = "message-dock is-hidden";

    const messageForm = document.createElement("form");
    messageForm.className = "message-form";

    const messageInput = document.createElement("input");
    messageInput.type = "text";
    messageInput.placeholder = "Сообщение";
    messageInput.maxLength = CONFIG.chat.maxLength;
    messageInput.autocomplete = "off";

    const messageButton = document.createElement("button");
    messageButton.type = "submit";
    messageButton.textContent = "Отправить";

    messageForm.append(messageInput, messageButton);
    messageDock.append(messageForm);

    const notifications = document.createElement("div");
    notifications.className = "notifications";

    document.body.append(gameRoot, loginPanel, chatPanel, messageDock, notifications);
    usernameInput.focus();

    return {
        gameRoot,
        loginPanel,
        loginForm,
        usernameInput,
        loginButton,
        chatPanel,
        chatCollapseButton,
        chatRefreshButton,
        chatHistory,
        messageDock,
        messageForm,
        messageInput,
        messageButton,
        notifications
    };
}

export function enterGame(ui, resizeController) {
    ui.loginPanel.classList.add("is-hidden");
    ui.gameRoot.classList.remove("is-hidden");
    ui.chatPanel.classList.remove("is-hidden");
    ui.messageDock.classList.remove("is-hidden");
    setLoginBusy(ui, false);
    resizeController.resize();
    ui.messageInput.focus();
}

export function setLoginBusy(ui, isBusy) {
    ui.loginButton.disabled = isBusy;
    ui.usernameInput.disabled = isBusy;
    ui.loginButton.textContent = isBusy ? "Вход..." : "Войти";
}

export function toggleChat(ui) {
    const collapsed = ui.chatPanel.classList.toggle("is-collapsed");
    ui.chatCollapseButton.textContent = collapsed ? "+" : "−";
    ui.chatCollapseButton.title = collapsed ? "Развернуть чат" : "Свернуть чат";
    ui.chatCollapseButton.setAttribute(
        "aria-label",
        collapsed ? "Развернуть чат" : "Свернуть чат"
    );
}
