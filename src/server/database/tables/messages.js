import pool from "../pool.js";
import {validateMessage, validateUsername} from "../validators/validators.js";

export async function initMessages() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            username VARCHAR(25) NOT NULL,
            text TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `);
}

export async function createMessage(username, msg) {
    if (!validateUsername(username)) {
        throw new Error("Invalid username");
    }

    if (!validateMessage(msg)) {
        throw new Error("Invalid message");
    }

    const result = await pool.query(
        "INSERT INTO messages (username, text, created_at) VALUES ($1, $2, NOW())",
        [username, msg]
    );

    return result.rows[0];
}


export async function getLastMessages() {
    const res = await pool.query(`
        SELECT username, text, created_at
        FROM messages
        ORDER BY created_at DESC
            LIMIT 50
    `);

    return res.rows.reverse();
}