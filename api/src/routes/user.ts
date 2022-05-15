import { FastifyPluginCallback } from 'fastify';
import { JwtService } from '../services/jwt';

export const userRoutes = (
    jwts: JwtService
): FastifyPluginCallback => (router, opts, done) => {
    router.get('/profile', jwts.withUser(async (req, rep, user) => {
        return {
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email
        }
    }));
    done()
}
