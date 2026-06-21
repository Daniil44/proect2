import {validateMessage} from "../../database/validators/validators.js";
import {createMessage} from "../../database/tables/messages.js";

export function messageHandler(io, state, socket) {
    socket.on("chat:message", async (msg) => {
        const player = state.players[socket.player.id];

        if (!player) {
            socket.emit("chat:error", {
                error: "PLAYER_NOT_FOUND",
                message: "Player does not exist in state"
            });
            return;
        }

        msg = (msg || "").trim();

        if (!validateMessage(msg)) {
            socket.emit("chat:error", {
                error: "INVALID_MESSAGE",
                message: "Invalid message"
            });
        }

        try {
            await createMessage(player.username, msg);
        } catch (e) {
            console.error("DB_ERROR", e);

            socket.emit("chat:error", {
                error: "CHAT_DB_ERROR",
                message: "Failed to create message"
            });

            return;
        }

        io.emit("chat:message", {
            username: player.username,
            text: msg,
            created_at: new Date().toISOString()
        });
    });
}