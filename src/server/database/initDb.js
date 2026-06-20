import {initPlayers} from "./tables/players.js";
import {initMessages} from "./tables/messages.js";
import pool from "./pool.js";

export async function initDb() {
    await initPlayers()
    await initMessages()

    console.log("Database tables ready");
}

export async function checkConnection(){
    try {
        await pool.query("SELECT NOW()");
        return true;
    } catch {
        return false;
    }
}