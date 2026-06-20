import Fastify from "fastify";


export async function createApp() {
    const app = Fastify({ logger: false });

    app.register(async (app) => {
        app.get("/health", async (req, res) => {
            return res.send({
                status: "ok"
            })
        })
    })

    return app
}