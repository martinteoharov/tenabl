/* eslint-disable @typescript-eslint/no-var-requires */

import fastify, { FastifyInstance } from "fastify";
import { connectToDB } from "./db";
import { jwtService } from "./services/jwt";

export const build = async (): Promise<FastifyInstance> => {
    const connection = await connectToDB();
    if (!process.env.SEED) throw new Error('Seed environment variable not set!')
    const jwt = jwtService(process.env.SEED, connection.manager)
    


    const app = fastify({ logger: true });
    app.register(require('./routes/auth'), { prefix: '/auth/' });
    app.register(require('./routes/oauth'), { prefix: './oauth' });
    app.register(require('./routes/review'), { prefix: '/review/' });
    app.register(require('./routes/comment'), { prefix: '/comment/'});

    app.listen(80, '0.0.0.0');

    return app;
};

build();
