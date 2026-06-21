export function inputHandler(state, socket) {
    socket.on("player:input", (input) => {
        const player = state.players[socket.player.id];

        if (!player) return;

        player.input = ["up", "down", "left", "right"].reduce(
            (result, key) => ({
                ...result,
                [key]: Boolean(input[key])
            }),
            {}
        );
    });
}