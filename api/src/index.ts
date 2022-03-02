import fastify from "fastify";
import { greet } from "./common/greet";
import { Message } from "./common/message";

console.log(greet('World'));

const app = fastify({
    logger: true
})
    .register(require('./routes'), {prefix: '/'});

app.listen(80, '0.0.0.0')
