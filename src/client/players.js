import * as THREE from "three";
import {CSS2DObject} from "three/addons/renderers/CSS2DRenderer.js";
import {CONFIG} from "./config.js";
import {state} from "./state.js";

export function createPlayerManager(scene) {
    function syncPlayers(playersById = {}) {
        const nextIds = new Set(Object.keys(playersById).map(String));

        for (const [id, player] of Object.entries(playersById)) {
            upsertPlayer({...player, id: player.id ?? id});
        }

        for (const id of state.players.keys()) {
            if (!nextIds.has(id)) {
                removePlayer(id);
            }
        }
    }

    function upsertPlayer(player) {
        const id = String(player.id);
        const existing = state.players.get(id);

        if (existing) {
            existing.username = player.username;
            existing.target.set(player.position.x, 0, player.position.z);
            existing.nameElement.textContent = player.username;
            updatePlayerColor(existing, player.color);
            return existing;
        }

        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(normalizePlayerColor(player.color)),
            roughness: 0.5,
            metalness: 0.08
        });

        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(CONFIG.playerSize, CONFIG.playerSize, CONFIG.playerSize),
            material
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.position.set(player.position.x, CONFIG.playerSize / 2, player.position.z);

        const nameElement = document.createElement("div");
        nameElement.className = "username-label";
        nameElement.textContent = player.username;

        const nameLabel = new CSS2DObject(nameElement);
        nameLabel.position.set(0, 1.05, 0);
        mesh.add(nameLabel);

        scene.add(mesh);

        const record = {
            id,
            username: player.username,
            mesh,
            nameElement,
            nameLabel,
            target: new THREE.Vector3(player.position.x, 0, player.position.z),
            messageLabel: null,
            messageTimeout: null,
            color: normalizePlayerColor(player.color)
        };
        state.players.set(id, record);

        return record;
    }

    function removePlayer(id) {
        const player = state.players.get(String(id));

        if (!player) return;

        if (player.messageTimeout) {
            window.clearTimeout(player.messageTimeout);
        }

        removeCssLabel(player.messageLabel);
        removeCssLabel(player.nameLabel);

        player.mesh.removeFromParent();
        player.mesh.geometry.dispose();
        player.mesh.material.dispose();
        state.players.delete(String(id));
    }

    function showPlayerBubble(message) {
        const player = findPlayerForMessage(message);

        if (!player) return;

        if (player.messageTimeout) {
            window.clearTimeout(player.messageTimeout);
        }

        removeCssLabel(player.messageLabel);

        const element = document.createElement("div");
        element.className = "message-label";
        element.textContent = message.text;

        const label = new CSS2DObject(element);
        label.position.set(0, 1.75, 0);
        player.mesh.add(label);

        player.messageLabel = label;
        player.messageTimeout = window.setTimeout(() => {
            removeCssLabel(label);
            player.messageLabel = null;
            player.messageTimeout = null;
        }, CONFIG.chat.bubbleMs);
    }

    function updatePlayers() {
        for (const player of state.players.values()) {
            player.mesh.position.x += (player.target.x - player.mesh.position.x) * 0.28;
            player.mesh.position.z += (player.target.z - player.mesh.position.z) * 0.28;
        }
    }

    function updateCamera(camera) {
        const self = state.players.get(String(state.selfId));
        const target = self ? self.mesh.position : CONFIG.camera.lookAhead;
        const nextPosition = new THREE.Vector3(target.x, 0, target.z).add(CONFIG.camera.offset);

        camera.position.lerp(nextPosition, 0.08);
        camera.lookAt(target.x, 0.2, target.z);
    }

    function findPlayerForMessage(message) {
        if (message.id != null) {
            const byId = state.players.get(String(message.id));
            if (byId) return byId;
        }

        for (const player of state.players.values()) {
            if (player.username === message.username) {
                return player;
            }
        }

        return null;
    }

    return {
        syncPlayers,
        upsertPlayer,
        removePlayer,
        showPlayerBubble,
        updatePlayers,
        updateCamera
    };
}

function normalizePlayerColor(color) {
    return color || "#ffffff";
}

function updatePlayerColor(player, color) {
    const nextColor = normalizePlayerColor(color);

    if (player.color === nextColor) {
        return;
    }

    player.mesh.material.color.set(nextColor);
    player.color = nextColor;
}

function removeCssLabel(label) {
    if (!label) return;

    label.removeFromParent();
    label.element?.remove();
}
