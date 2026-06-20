import pool from "../pool.js";

export async function initMessages() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            username VARCHAR(25) NOT NULL,
            text TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `);
}

async function getLastMessages() {
    const res = await pool.query(`
        SELECT nickname, text, created_at
        FROM messages
        ORDER BY created_at ASC
            LIMIT 50
    `);

    return res.rows;
}