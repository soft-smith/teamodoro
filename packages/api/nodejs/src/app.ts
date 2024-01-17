import fastify from "fastify"

export const createApp = () => {
    const app = fastify({ logger: true })
    
    app.get("/", async () => {
        return { hello: "world" };
    })
    
    return app;
}