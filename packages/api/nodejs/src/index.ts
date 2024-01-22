import { createApp } from "./app.ts"

const app = createApp();

const start = async () => {
    try {
        await app.listen({
            host: "0.0.0.0",
            port: 3000
        });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

await start();