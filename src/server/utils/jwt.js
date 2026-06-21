import "dotenv/config"
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export function createToken(player) {
    return jwt.sign(
        {
            id: player.id,
            username: player.username
        },
        jwtSecret,
        {
            expiresIn: "7d"
        }
    );
}

export function verifyToken(token) {
    return jwt.verify(token, jwtSecret);
}

