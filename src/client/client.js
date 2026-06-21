import {formatError, postJson} from "./api.js";
import {appendChatMessage, appendChatSystem, installChatControls, renderChatHistory} from "./chat.js";
import {installInputControls} from "./input.js";
import {createNotifier} from "./notifications.js";
import {createPlayerManager} from "./players.js";
import {createSocketController} from "./socket.js";
import {state} from "./state.js";
import {createCamera, createLabelRenderer, createRenderer, createResizeController, createScene} from "./world.js";
import {createInterface, enterGame, setLoginBusy, toggleChat} from "./ui.js";

const ui = createInterface();
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
const labelRenderer = createLabelRenderer();
const notify = createNotifier(ui.notifications);
const playerManager = createPlayerManager(scene);

ui.gameRoot.append(renderer.domElement, labelRenderer.domElement);

const resizeController = createResizeController({renderer, labelRenderer, camera});
resizeController.resize();

const socketController = createSocketController({
    appendChatMessage: (message) => appendChatMessage(ui, message),
    appendChatSystem: (message) => appendChatSystem(ui, message),
    enterGame: () => enterGame(ui, resizeController),
    notify,
    playerManager,
    renderChatHistory: (messages) => renderChatHistory(ui, messages),
    setLoginBusy: (isBusy) => setLoginBusy(ui, isBusy)
});

installInputControls(ui, {
    send: () => {
        if (state.socket?.connected) {
            state.socket.emit("player:input", state.input);
        }
    }
});

installChatControls(ui, {
    notify,
    refreshHistory,
    sendMessage: socketController.sendMessage
});

ui.loginForm.addEventListener("submit", handleLogin);
ui.chatCollapseButton.addEventListener("click", () => toggleChat(ui));

requestAnimationFrame(animate);

async function handleLogin(event) {
    event.preventDefault();

    const username = ui.usernameInput.value.trim();
    setLoginBusy(ui, true);

    try {
        const data = await postJson("/auth/login", {username});
        state.token = data.token;
        socketController.connectSocket(data.token);
    } catch (error) {
        notify(formatError(error, "Не удалось войти"), "error");
        setLoginBusy(ui, false);
    }
}

function refreshHistory() {
    if (!state.token) {
        notify("Сначала войдите в игру", "error");
        return;
    }

    ui.chatRefreshButton.disabled = true;
    notify("Обновляю историю", "info");
    socketController.connectSocket(state.token);

    window.setTimeout(() => {
        ui.chatRefreshButton.disabled = false;
    }, 1200);
}

function animate() {
    requestAnimationFrame(animate);

    playerManager.updatePlayers();
    playerManager.updateCamera(camera);
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}
