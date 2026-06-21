import {io} from "socket.io-client";
import {state} from "./state.js";
import {resetInput, sendCurrentInput} from "./input.js";

export function createSocketController({
    appendChatMessage,
    appendChatSystem,
    enterGame,
    notify,
    playerManager,
    renderChatHistory,
    setLoginBusy
}) {
    function connectSocket(token) {
        resetInput(true);

        if (state.socket) {
            state.socket.removeAllListeners();
            state.socket.disconnect();
        }

        const socket = io({
            transports: ["websocket"],
            auth: {token}
        });

        state.socket = socket;

        socket.on("connect", () => {
            sendCurrentInput();
        });

        socket.on("connect_error", (error) => {
            notify(error.message || "Ошибка подключения", "error");
            setLoginBusy(false);
        });

        socket.on("init", (payload) => {
            state.selfId = String(payload.selfId);
            playerManager.syncPlayers(payload.players || {});
            renderChatHistory(payload.chat || []);
            enterGame();
            notify("Вы в игре", "success");
        });

        socket.on("world:update", (payload) => {
            playerManager.syncPlayers(payload.players || {});
        });

        socket.on("player:joined", (player) => {
            playerManager.upsertPlayer(player);
            appendChatSystem(`${player.username} вошел`);
        });

        socket.on("player:left", (id) => {
            playerManager.removePlayer(String(id));
        });

        socket.on("chat:message", (message) => {
            appendChatMessage(message);
            playerManager.showPlayerBubble(message);
        });

        socket.on("chat:error", (error) => {
            notify(error?.message || "Сообщение не прошло валидацию", "error");
        });

        socket.on("disconnect", (reason) => {
            resetInput(false);

            if (reason !== "io client disconnect") {
                notify("Соединение с сервером потеряно", "warning");
            }
        });
    }

    function sendMessage(text) {
        state.socket?.emit("chat:message", text);
    }

    return {
        connectSocket,
        sendMessage
    };
}
