import "dotenv/config";
import {createApp} from "./bootstrap.js";

export async function startApp() {
    const app = await createApp()

    const port = Number(process.env.PORT);
    const host = process.env.HOST;

    await app.listen({
        port,
        host
    });

    console.log(`Server started at ${host}:${port}`);
}
