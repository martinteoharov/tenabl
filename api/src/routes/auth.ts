import { FastifyPluginCallback } from 'fastify';

import 'reflect-metadata';

import { UserModel } from '../db/entities/UserModel';

import { EntityManager, EntityNotFoundError } from 'typeorm';

import PasswordSchema from '../common/schemas/password';
import RegisterSchema from '../common/schemas/register';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';

import { JwtService } from '../services/jwt';
import { checkPassword, PasswordService } from '../services/password';
import { UserService } from '../services/user';

export const authRoutes =(
    users: UserService,
    passwords: PasswordService, 
    jwts: JwtService,
    entities: EntityManager
): FastifyPluginCallback => (router, opts, done) => {
    router.post('/register', async (req, rep) => pipe(req.body, RegisterSchema.decode, fold(
        async () => rep.code(400).send({ error: "Tiq requesti na maika si shte gi prashtash piklio" }),
        async (request) => {
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
        }
    )))
    router.post('/login', async (req, res) => pipe(req.body, PasswordSchema.decode, fold(
        async () => res.code(400).send({ error: "Invalid request" }),
        async (request) => {
            try {
                const user = await users.find(request.email)
                if (!passwords.verify(user, request.password)) {
                    return res.code(422).send({ error: 'Invalid password' })
                }
                // Create session
                return jwts.createTokens(user);
            } catch(e) {
                if (e instanceof EntityNotFoundError) { // Thrown by users.find
                    return res.code(404).send({ error: 'User not found' })
                }
                throw e
            }
        }
    )));
    // Send a GET request to /api/auth/test to check JWT token
    router.get('/test', jwts.withUser(async (req, res, user) => {
        res.code(200).send({ ok: `Hello ${user.username}` });
    }));
    router.post('/refresh', jwts.refresh)
    done();
}
