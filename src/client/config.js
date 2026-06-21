import * as THREE from "three";

export const CONFIG = {
    playerSize: 1,
    camera: {
        fov: 50,
        near: 0.1,
        far: 150,
        offset: new THREE.Vector3(0, 18, 18),
        lookAhead: new THREE.Vector3(0, 0, 0)
    },
    chat: {
        maxLength: 200,
        bubbleMs: 5000,
        historyLimit: 50
    },
    input: {
        staleKeyMs: 1500,
        syncMs: 180
    },
    notifications: {
        ttlMs: 4500
    }
};

export const MOVEMENT_KEYS = new Set([
    "KeyW",
    "KeyS",
    "KeyA",
    "KeyD",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight"
]);
