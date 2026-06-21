import {CONFIG, MOVEMENT_KEYS} from "./config.js";
import {createEmptyInput, hasActiveInput, isSameInput, pressedKeys, state} from "./state.js";

let sendInput = () => {};

export function installInputControls(ui, {send}) {
    sendInput = send;

    window.addEventListener("keydown", (event) => handleKeyEvent(event, true), true);
    window.addEventListener("keyup", (event) => handleKeyEvent(event, false), true);
    window.addEventListener("blur", resetInput);
    window.addEventListener("pagehide", resetInput);
    window.addEventListener("contextmenu", resetInput);
    window.addEventListener("pagehide", resetInput);

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            resetInput();
        }
    });


    ui.usernameInput.addEventListener("focus", resetInput);
    ui.messageInput.addEventListener("focus", resetInput);

    window.setInterval(syncActiveInput, CONFIG.input.syncMs);
}

export function resetInput(shouldSend = true) {
    pressedKeys.clear();

    const nextInput = createEmptyInput();
    const changed = !isSameInput(nextInput, state.input);
    state.input = nextInput;

    if (shouldSend && (changed || state.socket?.connected)) {
        sendInput();
    }
}

export function sendCurrentInput() {
    sendInput();
}

function handleKeyEvent(event, isPressed) {
    if (!MOVEMENT_KEYS.has(event.code)) return;

    if (isPressed && isTypingTarget(event.target)) return;

    if (isPressed) {
        pressedKeys.add(event.code);
    } else {
        pressedKeys.delete(event.code);
    }

    applyPressedKeys();
    event.preventDefault();
}

function applyPressedKeys() {
    const nextInput = getInputFromPressedKeys();

    if (isSameInput(nextInput, state.input)) return;

    state.input = nextInput;
    sendInput();
}

function syncActiveInput() {
    if (state.socket?.connected && hasActiveInput()) {
        sendInput();
    }
}

function getInputFromPressedKeys() {
    return {
        up: pressedKeys.has("KeyW") || pressedKeys.has("ArrowUp"),
        down: pressedKeys.has("KeyS") || pressedKeys.has("ArrowDown"),
        left: pressedKeys.has("KeyA") || pressedKeys.has("ArrowLeft"),
        right: pressedKeys.has("KeyD") || pressedKeys.has("ArrowRight")
    };
}

function isTypingTarget(target) {
    return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}
