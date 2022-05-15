/* eslint-disable @typescript-eslint/no-var-requires */

import fastify, { FastifyInstance } from "fastify";
import { connectToDB } from "./db";
import { jwtService } from "./services/jwt";
import { authRoutes } from "./routes/auth";
import { commentService } from "./services/comment";
import { commentRoutes } from "./routes/comment";
import { publicationService } from "./services/publication";
import { oauthService } from "./services/oauth";
import { userService } from "./services/user";
import { passwordService } from "./services/password";
import { oauthRoutes } from "./routes/oauth";
import { reviewService } from "./services/review";
import { reviewRoutes } from "./routes/review";
import { userRoutes } from "./routes/user";

process.env["GOOGLE_CLIENT_ID"] = "285508928409-fd6e0j8b9bdavg8ce7fj461c1lc3tlmh.apps.googleusercontent.com";
process.env["GITHUB_CLIENT_ID"] = "285508928409-fd6e0j8b9bdavg8ce7fj461c1lc3tlmh.apps.googleusercontent.com";
process.env["GITHUB_SECRET"] = "285508928409-fd6e0j8b9bdavg8ce7fj461c1lc3tlmh.apps.googleusercontent.com";

function getEnv(name: string): string {
    const val = process.env[name]
    if (!val) throw new Error(`${name} environment variable not set`)
    return val
}

export const build = async (): Promise<FastifyInstance> => {
    const connection = await connectToDB();
    const jwts = jwtService(getEnv('SEED'), connection.manager)
    const publications = publicationService(connection.manager)
    const comments = commentService(connection.manager)
    const users = userService(connection.manager)
    const oauth = oauthService(users, connection.manager, /*getEnv('GOOGLE_CLIENT_ID'),*/ getEnv('GITHUB_CLIENT_ID'), getEnv('GITHUB_SECRET'))
    const passwords = passwordService(connection.manager)
    const reviews = reviewService(connection.manager)
    const app = fastify({
        logger: true,
        ignoreTrailingSlash: true
    });
    app.register(authRoutes(users, passwords, jwts, connection.manager), { prefix: '/auth' });
    app.register(oauthRoutes(jwts, oauth), { prefix: '/oauth' });
    app.register(userRoutes(jwts), { prefix: '/user' });
    app.register(reviewRoutes(jwts, publications, reviews), { prefix: '/review' });
    app.register(commentRoutes(jwts, comments, publications), { prefix: '/comment' });

    app.listen(80, '0.0.0.0');

    return app;
};

build();
