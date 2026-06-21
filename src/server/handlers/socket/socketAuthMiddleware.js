import { verifyToken } from "../../utils/jwt.js";

export function socketAuthMiddleware(io, state) {
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("AUTH_TOKEN_MISSING"));
        }

        try {
            const payload = verifyToken(token);

            const existingSocketId = state.socketMap.get(payload.id);

            if (existingSocketId) {
                const existingSocket = io.sockets.sockets.get(existingSocketId);

                if (existingSocket) {
                    existingSocket.disconnect(true);
                }
            }

            state.socketMap.set(payload.id, socket.id);

            socket.player = {
                id: payload.id,
                username: payload.username
            };

            next();

        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return next(new Error("AUTH_TOKEN_EXPIRED"));
            }

            return next(new Error("AUTH_TOKEN_INVALID"));
        }
    });
}