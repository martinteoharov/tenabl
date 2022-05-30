import { FastifyPluginCallback } from 'fastify';

import 'reflect-metadata';

import { UserModel } from '../db/entities/UserModel';

import { EntityManager } from 'typeorm';



import { JwtService } from '../services/jwt';
import { checkPassword, PasswordService } from '../services/password';
import { UserService } from '../services/user';
import { withSchema } from '../utils/withSchema';
import { IRegisterRequest, ILoginRequest } from '../common/interfaces/requests/auth';

export const authRoutes = (
    users: UserService,
    passwords: PasswordService,
    jwts: JwtService,
    entities: EntityManager
): FastifyPluginCallback => (router, opts, done) => {
    router.post('/register', withSchema(IRegisterRequest, async (req, rep, request) => {
        // Check if user already exists
        if (await entities.count(UserModel, { email: request.email })) {
            rep.code(409).send({ error: "User already exists" });
            return
        }
        if (!checkPassword(request.password)) {
            return rep.code(400).send({ error: "Password does not meet standards" });
        }
        const user = await users.create(request);
        if (!user) {
            return rep.code(400).send({ error: "Kura mi qnko" });
        }
        await passwords.create(user, request.password);

        return rep.code(200).send({ ok: "User created" });
    }))
    router.post('/login', withSchema(ILoginRequest, async (req, rep, request) => {
        const user = await users.find(request.email)
        if (!user) return rep.code(404).send({ error: 'User not found' })
        if (!await passwords.verify(user, request.password)) {
            return rep.code(422).send({ error: 'Invalid password' })
        }
        // Create session
        return jwts.createTokens(user);
    }));
    // Send a GET request to /api/auth/test to check JWT token
    router.get('/test', jwts.withUser(async (req, rep, user) => {
        rep.code(200).send({ ok: `Hello ${user.username}` });
    }));
    router.post('/refresh', jwts.refresh)
    done();
}
