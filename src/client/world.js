import * as THREE from "three";
import {CSS2DRenderer} from "three/addons/renderers/CSS2DRenderer.js";
import {WORLD_SIZE} from "../constants/gameRules.js";
import {CONFIG} from "./config.js";

export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111318);

    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(WORLD_SIZE * 2, WORLD_SIZE * 2, 32, 32),
        new THREE.MeshStandardMaterial({
            color: 0x263530,
            roughness: 0.86,
            metalness: 0.05
        })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(WORLD_SIZE * 2, WORLD_SIZE * 2, 0x6ee7a8, 0x3d4a46);
    grid.position.y = 0.01;
    scene.add(grid);

    const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(WORLD_SIZE * 2, 0.05, WORLD_SIZE * 2)),
        new THREE.LineBasicMaterial({color: 0xf4d35e})
    );
    edge.position.y = 0.05;
    scene.add(edge);

    scene.add(new THREE.HemisphereLight(0xeaf7ff, 0x202820, 1.65));

    const sun = new THREE.DirectionalLight(0xffffff, 1.8);
    sun.position.set(9, 18, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    return scene;
}

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        CONFIG.camera.fov,
        window.innerWidth / Math.max(window.innerHeight, 1),
        CONFIG.camera.near,
        CONFIG.camera.far
    );
    camera.position.copy(CONFIG.camera.offset);
    camera.lookAt(CONFIG.camera.lookAhead);
    return camera;
}

export function createRenderer() {
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    return renderer;
}

export function createLabelRenderer() {
    const renderer = new CSS2DRenderer();
    renderer.domElement.className = "label-renderer";
    return renderer;
}

export function createResizeController({renderer, labelRenderer, camera}) {
    const applySize = () => {
        const width = Math.max(1, window.innerWidth);
        const height = Math.max(1, window.innerHeight);

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height, false);
        labelRenderer.setSize(width, height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", applySize);

    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", applySize);
    }

    return {
        resize: applySize
    };
}
