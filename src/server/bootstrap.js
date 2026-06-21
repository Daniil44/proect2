import Fastify from "fastify";
import {checkConnection, initDb} from "./database/initDb.js";
import {Server} from "socket.io";
import {socketAuthMiddleware} from "./handlers/socket/socketAuthMiddleware.js";
import {connectionMiddleware} from "./handlers/socket/connectionMiddleware.js";
import {TICK_MS, TICK_RATE} from "../constants/gameRules.js";
import {applyMovement} from "../utils/moveUtils.js";
import fastifyStatic from "@fastify/static";
import {fileURLToPath} from "url";
import path from "node:path";
import {healthRoute} from "./handlers/routes/healthRoute.js";
import {loginRoute} from "./handlers/routes/loginRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function createApp() {
    const app = Fastify({ logger: false });

    if (!await initDatabase()) {
        throw new Error("Init failed");
    }


    await app.register(fastifyStatic, {
        root: path.join(__dirname, "../../public/dist"),
        index: ["index.html"]
    });

    await app.register(healthRoute)

    await app.register(loginRoute)

    await initSocketIo(app);

    await app.ready();

    console.log("Server ready");

    return app;
}

async function initSocketIo(app) {
    const io = new Server(app.server, {
        cors: {
            origin: "*"
        }
    });

    const state = {
        players: {},
        onlineUsers: new Set(),
        socketMap: new Map()
    };

    socketAuthMiddleware(io, state);
    connectionMiddleware(io, state);

    setInterval(() => {
        const dt = 1 / TICK_RATE;

        for (const player of Object.values(state.players)) {
            applyMovement(player, dt);
        }

        io.emit("world:update", {
            players: state.players
        });
    }, TICK_MS);
}

async function initDatabase(){
    if (!await checkConnection()) {
        return false;
    }
    try {
        await initDb();
    } catch (error) {
        console.error("Database error", error);
        return false;
    }

    return true;

}