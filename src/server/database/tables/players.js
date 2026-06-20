import pool from "../pool.js";

function validateUsername(username) {
    if (typeof username !== "string") {
        return null;
    }

    const value = username.trim();

    if (value.length < 3) {
        return null;
    }

    if (value.length > 25) {
        return null;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return null;
    }

    return value;
}

export async function initPlayers() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS players (
            id SERIAL PRIMARY KEY,
            username VARCHAR(25) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `);
}

export async function getPlayer(username) {
    const validUsername = validateUsername(username);
    if (validUsername == null) {
        throw new Error("Invalid username");
    }

    const result = await pool.query(
        `
            SELECT *
            FROM players
            WHERE username = $1
        `,
        [validUsername]
    );

    return result.rows[0];
}

export async function createPlayer(username) {
    const validUsername = validateUsername(username);
    if (validUsername == null) {
        throw new Error("Invalid username");
    }

    const result = await pool.query(
        `
            INSERT INTO players (username)
            VALUES ($1)
                RETURNING *
        `,
        [validUsername]
    );

    return result.rows[0];
}