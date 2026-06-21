export const pressedKeys = new Set();

export const state = {
    token: null,
    selfId: null,
    socket: null,
    players: new Map(),
    input: createEmptyInput()
};

export function createEmptyInput() {
    return {
        up: false,
        down: false,
        left: false,
        right: false
    };
}

export function isSameInput(a, b) {
    return a.up === b.up && a.down === b.down && a.left === b.left && a.right === b.right;
}

export function hasActiveInput(input = state.input) {
    return input.up || input.down || input.left || input.right;
}
