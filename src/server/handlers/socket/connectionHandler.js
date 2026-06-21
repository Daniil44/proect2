import {getLastMessages} from "../../database/tables/messages.js";

export async function connectionHandler(io, state, socket) {
    const { id, username } = socket.player;

    state.onlineUsers.add(username);

    state.players[id] = {
        id,
        username,
        position: {
            x: 0,
            y: 0,
            z: 0
        },
        input: {
            up: false,
            down: false,
            left: false,
            right: false
        },
        color: `#${Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, "0")}`
    };

    const messages = await getLastMessages();

    socket.emit("init", {
        selfId: id,
        players: state.players,
        chat: messages
    });

    socket.broadcast.emit(
        "player:joined",
        state.players[id]
    );

    socket.on("disconnect", () => {
        delete state.players[id];

        state.onlineUsers.delete(username);

        state.socketMap.delete(id);

        io.emit("player:left", id);
    });
}
