import {createPlayer, getPlayer} from "../database/tables/players.js";
import {createToken} from "../utils/jwt.js";
import {validateUsername} from "../database/validators/validators.js";

export async function login(request, reply) {
    let { username } = request.body

    username = (username || "").trim()

    if (!validateUsername(username)) {
        return reply.status(400).send({
            error: "INVALID_USERNAME",
            message: "Invalid username"
        });
    }

    try {
        let player = await getPlayer(username);


        if (!player) {
            player = await createPlayer(username);
        }

        const token = createToken(player);

        return reply.send({
            token,
            username: player.username
        });
    } catch (e) {
        console.error("Login error:", e);

        return reply.status(500).send({
            error: "INTERNAL_ERROR",
            message: "Something went wrong"
        });
    }
}

