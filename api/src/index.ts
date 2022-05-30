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
import { pubsubService } from "./services/pubsub";
import { dummyData } from "./db/dummyData";
import { statisticsRoutes } from "./routes/statistics";
import { statisticsService } from "./services/statistics";

function getEnv(name: string): string {
    const val = process.env[name]
    if (!val) throw new Error(`${name} environment variable not set`)
    return val
}

export const build = async (): Promise<FastifyInstance> => {
    const connection = await connectToDB();
    const jwts = jwtService(getEnv('SEED'), connection.manager)
    const publications = await publicationService(connection.manager)
    const comments = commentService(connection.manager)
    const users = userService(connection.manager)
    const oauth = oauthService(users, connection.manager, getEnv('GITHUB_CLIENT_ID'), getEnv('GITHUB_SECRET'))
    const passwords = passwordService(connection.manager)
    const reviews = await reviewService(connection.manager)
    const statistics = statisticsService(reviews)
    await dummyData(publications, users, reviews, connection.manager, true);
    //                                    this is not a release build ^^^^
    const app = fastify({
        logger: true,
        ignoreTrailingSlash: true,
    });
    app.register(pubsubService())
    app.register(authRoutes(users, passwords, jwts, connection.manager), { prefix: '/auth' });
    app.register(oauthRoutes(jwts, oauth), { prefix: '/oauth' });
    app.register(userRoutes(jwts, users, passwords), { prefix: '/user' });
    app.register(reviewRoutes(jwts, publications, reviews), { prefix: '/review' });
    app.register(commentRoutes(jwts, comments, publications), { prefix: '/comment' });
    app.register(statisticsRoutes(jwts, publications, statistics), { prefix: '/statistics' })
    app.listen(80, '0.0.0.0');
    return app;
};

build();
