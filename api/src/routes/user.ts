import { FastifyPluginCallback } from 'fastify';
import { JwtService } from '../services/jwt';
import { withSchema } from '../utils/withSchema';
import { IUserProfileEdit } from '../common/interfaces/user';
import { checkPassword, PasswordService } from '../services/password';
import { UserService } from '../services/user';

export const userRoutes = (
    jwts: JwtService,
    userService: UserService,
    passwordService: PasswordService
): FastifyPluginCallback => (router, opts, done) => {
    router.get('/profile', jwts.withUser((req, rep, user) => {
        return {
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email
        }
    }));

    router.get('/profile/:id', jwts.withUser(async (req, rep, user) => {
        const id = (req.params as any).id;

        return {
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
        }
    }));

    router.post('/profile/edit', withSchema(IUserProfileEdit, jwts.withUser(async (req, rep, user, request) => {
        userService.update(user, { username: request.username, firstName: request.firstName, lastName: request.lastName, email: user.email })
        if (request.password && await passwordService.has(user)) {
            if (!checkPassword(request.password)) return rep.code(400).send({ error: "Failed to update user" });
            passwordService.change(user, request.password);
        }
        return { ok: "User updated successfuly" };
    })));
    done()
}
