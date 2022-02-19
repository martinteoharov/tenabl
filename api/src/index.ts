import { greet } from "./common/greet";
import fastify from 'fastify';
import { createConnection } from "typeorm";
import { getMessageService } from "./services/messageService";
import { getMessageRoutes } from "./routes/message";

console.log(greet('World'));

async function main() {
    const conn = await createConnection()
    const messages = getMessageService(conn)
    const app = fastify({ logger: true })
    app.register(getMessageRoutes(messages), { prefix: '/' })
    app.listen(80, '0.0.0.0')
}

main()
