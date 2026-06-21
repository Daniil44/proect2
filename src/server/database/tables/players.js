import pool from "../pool.js";
import {validateUsername} from "../validators/validators.js";

export async function initPlayers() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS players (
            id SERIAL PRIMARY KEY,
            username VARCHAR(25) UNIQUE NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `);
}

export async function getPlayer(username) {
    if (!validateUsername(username)) {
        throw new Error("Invalid username");
    }

    const result = await pool.query(
        `
            SELECT *
            FROM players
            WHERE username = $1
        `,
        [username]
    );

    return result.rows[0];
}

export async function createPlayer(username) {
    if (!validateUsername(username)) {
        throw new Error("Invalid username");
    }

    const result = await pool.query(
        `
            INSERT INTO players (username)
            VALUES ($1)
                RETURNING *
        `,
        [username]
    );

    return result.rows[0];
}