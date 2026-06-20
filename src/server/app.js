import "dotenv/config";
import {createApp} from "./bootstrap.js";
import {Server} from "socket.io";

export async function startApp() {
    const app = await createApp()

    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '127.0.0.1';

    await app.listen({
        port,
        host
    });

    console.log(`Server started at ${host}:${port}`);

    await startSocket(app.server);
}

export async function startSocket(httpServer) {
    const io = new Server(
        httpServer, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
        console.log("Connect:", socket.id);

        socket.on("disconnect", () => {
            console.log("Disconnect:", socket.id);
        });
    });

}
