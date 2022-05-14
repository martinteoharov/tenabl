import { FastifyPluginCallback } from 'fastify';
import 'reflect-metadata';
import GoogleOAuthSchema from '../common/schemas/googleOauth';
import GithubOAuthSchema from '../common/schemas/githubOauth';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';
import { AuthError, JwtService } from '../services/jwt';
import { OauthService } from '../services/oauth';

export const oauthRoutes = (
    jwts: JwtService,
    oauth: OauthService
): FastifyPluginCallback => (router, opts, done) => {
    router.post('/google', async (req, rep) => pipe(req.body, GoogleOAuthSchema.decode, fold(
        async () => rep.code(400).send({ error: "Invalid request" }),
        async (request) => {
            try {
                const user = await oauth.googleLogin(request.idToken);
                return jwts.createTokens(user);
            } catch(e) {
                if (e instanceof AuthError) {
                    return rep.code(401).send({ error: 'Authentication error' })
                }
                throw e
            }
        }
    )))
    router.post('/github', async (req, rep) => pipe(req.body, GithubOAuthSchema.decode, fold(
        async () => rep.code(400).send({ error: "Invalid request" }),
        async (request) => {
            try {
                const user = await oauth.githubLogin(request.idToken);
                return jwts.createTokens(user);
            } catch(e) {
                if (e instanceof AuthError) {
                    return rep.code(401).send({ error: 'Authentication error' })
                }
                throw e
            }
        }
    )))
    done();
}
