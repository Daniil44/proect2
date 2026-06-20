import Fastify from "fastify";
import {checkConnection, initDb} from "./database/initDb.js";


export async function createApp() {
    const app = Fastify({ logger: false });

    if (!await initDatabase()) {
        throw new Error("Init failed");
    }

    app.register(async (app) => {
        app.get("/health", async (req, res) => {
            return res.send({
                status: "ok"
            })
        })
    })

    return app
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