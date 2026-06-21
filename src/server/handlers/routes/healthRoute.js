export async function healthRoute(app) {
    app.get("/health", async (_, res) => {
        return res.send({
            status: "ok"
        })
    })
}