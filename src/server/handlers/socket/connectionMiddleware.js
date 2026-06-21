import {inputHandler} from "./inputHandler.js";
import {messageHandler} from "./messageHandler.js";
import {connectionHandler} from "./connectionHandler.js";


export function connectionMiddleware(io, state) {
    io.on("connection", async (socket) => {
        try {
            await connectionHandler(io, state, socket);

            inputHandler(state, socket);

            messageHandler(io, state, socket);
        } catch (e) {
            console.error("CONNECTION_HANDLER_ERROR", e);
            socket.disconnect(true);
        }
    });
}