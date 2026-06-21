import { WORLD_SIZE, PLAYER_SPEED } from "../constants/gameRules.js";


function clampPosition(pos) {
    return {
        x: Math.max(-WORLD_SIZE, Math.min(WORLD_SIZE, pos.x)),
        y: 0,
        z: Math.max(-WORLD_SIZE, Math.min(WORLD_SIZE, pos.z)),
    }
}


function processInput(input, deltaTime) {
    let deltaX = 0;
    let deltaZ = 0;

    if (input.left) deltaX -= 1;
    if (input.right) deltaX += 1;
    if (input.up) deltaZ -= 1;
    if (input.down) deltaZ += 1;

    if (deltaX === 0 && deltaZ === 0) return null;

    const len = Math.hypot(deltaX, deltaZ);

    deltaX /= len;
    deltaZ /= len;

    return {
        toAddX: deltaX * PLAYER_SPEED * deltaTime,
        toAddZ: deltaZ * PLAYER_SPEED * deltaTime,
    };
}


export function applyMovement(player, deltaTime) {
    if (!player.input) return;

    const result = processInput(player.input, deltaTime);
    if (result == null) return;


    player.position.x += result.toAddX;
    player.position.z += result.toAddZ;

    player.position = clampPosition(player.position)
}


