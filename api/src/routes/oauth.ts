import { FastifyPluginCallback } from 'fastify';
import 'reflect-metadata';

import { AuthError, JwtService } from '../services/jwt';
import { OauthService } from '../services/oauth';
import { withSchema } from '../utils/withSchema';
import { IOAuthRequest } from '../common/interfaces/requests/oauth'

export const oauthRoutes = (
    jwts: JwtService,
    oauth: OauthService
): FastifyPluginCallback => (router, opts, done) => {
    router.post('/google', withSchema(IOAuthRequest, async (req, rep, request) => {
        try {
            const user = await oauth.googleLogin(request.idToken);
            return jwts.createTokens(user);
        } catch(e) {
            if (e instanceof AuthError) {
                return rep.code(401).send({ error: 'Authentication error' })
            }
            throw e
        }
    }))
    router.post('/github', withSchema(IOAuthRequest, async (req, rep, request) => {
        try {
            const user = await oauth.githubLogin(request.idToken);
            return jwts.createTokens(user);
        } catch(e) {
            if (e instanceof AuthError) {
                return rep.code(401).send({ error: 'Authentication error' })
            }
            throw e
        }
    }))
    done();
}
