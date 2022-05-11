import { FastifyInstance } from 'fastify';

import 'reflect-metadata';

import { UserModel } from '../db/entities/UserModel';

import { Connection } from 'typeorm';
import { getDB } from '../db';

import PasswordSchema from '../common/schemas/password';
import RegisterSchema from '../common/schemas/register';
import RefreshSchema from '../common/schemas/refresh';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';

import * as jwtService from '../services/jwt';
import * as userService from '../services/user';
import * as passwordService from '../services/password';

const connection: Connection = getDB();

export default (router: FastifyInstance, opts: unknown, done: () => unknown) => {
    router.post('/register', async (req, res) => pipe(req.body, RegisterSchema.decode, fold(
        async () => res.code(400).send({ error: "Tiq requesti na maika si shte gi prashtash piklio" }),
        async (request) => {
            // Check if user already exists
            const emailExists = await connection.manager.findOne(UserModel, { email: request.email }) !== undefined;
            if (emailExists) {
                res.code(400).send({ error: "User already exists" });
                return
            }

            const isPasswordValid = passwordService.checkPassword(request.password);
            if (!isPasswordValid) {
                return res.code(400).send({ error: "Password does not meet standards" });
            }

            const user = await userService.create(connection, request);
            if (!user) {
                return res.code(400).send({ error: "Kura mi qnko" });
            }

            const pass = await passwordService.create(connection, user, request.password);
            if (!pass) {
                return res.code(400).send({ error: "Qnko nqma pishka" });
            }

            return res.code(200).send({ ok: "User created" });
        }
    ))
    )

    router.post('/login', async (req, res) => pipe(req.body, PasswordSchema.decode, fold(
        async () => res.code(400).send({ error: "Invalid request" }),
        async (request) => {
            const response = await userService.login(connection, request, res);
            if (!response) {
                return response;
            }
            // Send JWT and refresh token
            return jwtService.sendTokens(res, response);
        }
    ))
    );

    router.get('/test', async (req, res) => { // Send a GET request to /api/auth/test to check JWT token
        const user = await jwtService.authenticateAccessToken(req, res);
        if (user !== undefined) {
            res.code(200).send({ ok: `Hello ${user.username}` });
            return
        }
    })

    router.get('/login', (req, res) => { res.send({ ok: "Successful redirect" }) }) // Only here for testing redirection for expired tokens

    // Send a POST request to /api/auth/refresh to get new access and refresh tokens.
    router.post('/refresh', async (req, res) => pipe(req.body, RefreshSchema.decode, fold(
        async () => res.code(400).send({ error: "Prati normalen request be pedal" }),
        async (request) => {
            const user = await jwtService.authenticateRefreshToken(request.refreshToken, res);

            if (user !== undefined) { // Create new access and refresh tokens.
                jwtService.sendTokens(res, user);
            }
        }))
    )
    done();
}
