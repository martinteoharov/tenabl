import { FastifyInstance, FastifyReply } from 'fastify';

import bcrypt from 'bcrypt';

import 'reflect-metadata';

import { PasswordModel } from '../db/entities/PasswordModel';
import { UserModel } from '../db/entities/UserModel';

import { Connection } from 'typeorm';
import { getDB } from '../db';

import PasswordSchema from '../common/schemas/password';
import RegisterSchema from '../common/schemas/register';
import RefreshSchema from '../common/schemas/refresh';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';

import { createTokens, authenticateAccessToken, authenticateRefreshToken } from '../services/jwt';


const connection: Connection = getDB();

export default (router: FastifyInstance, opts: any, done: () => any) => {
    router.decorateRequest('user', {}); // Request parameter that stores the user (Doesn't work and I can't be bothered debugging it anymore)

    router.post('/register', async (req, res) => pipe(req.body, RegisterSchema.decode, fold(
            async () => res.code(400).send({ error: "Tiq requesti na maika si shte gi prashtash piklio" }),
            async (request) => {
                // Pass requirements: Minimum eight chars, one uppercase, one lowercase, one number and one special character
                const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

                // Basic email regex
                const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i; 

                // Check if acceptedTerms is false
                if (!request.acceptedTerms) {
                    res.code(400).send({ error: "Begai se kato ne acceptvash terms, shibanqk" })
                    return
                }

                if (!passwordRegex.test(request.password)) {
                    res.code(400).send({ error: "Password does not meet standards" })
                    return
                }

                // Validate email based on RFC 5322 specifications
                if (!emailRegex.test(request.email)) {
                    res.code(400).send({ error: "Invalid email format" })
                    return
                }

                // Check if user already exists
                const emailExists = await connection.manager.findOne(UserModel, { email: request.email }) !== undefined;
                if (emailExists) {
                    res.code(400).send({ error: "User already exists" })
                    return
                }

                const user = new UserModel(); // Create user instance
                user.firstName = request.firstName;
                user.lastName = request.lastName;
                user.username = request.username;
                user.email = request.email;
                user.acceptedTerms = request.acceptedTerms;

                await connection.manager.save(user);

                // Create password hash
                const salt = await bcrypt.genSalt(6);
                const hash = await bcrypt.hash(request.password, salt);

                const pass = new PasswordModel() // Create password instance
                pass.user = user.id;
                pass.hash = hash;

                // Save password table entry
                await connection.manager.save(pass);

                return res.code(200).send({ ok: "User created" });
            }
        ))
    )

    router.post('/login', async (req, res) => pipe(req.body, PasswordSchema.decode, fold(
            async () => res.code(400).send({ error: "Invalid request" }),
            async (request) => {
                const user = await connection.manager.findOne(UserModel, { email: request.email }); // Fetch user profile with given email

                if (!user) {
                    return res.code(400).send({ error: "User does not exist" });
                    return
                }

                const hash = await connection.manager.findOne(PasswordModel, { user: user.id }); // Fetch user password hash

                if (!hash) {
                    return res.code(400).send({ error: "Kura mi qnko" }); // User has no password, probably logged in with OAuth
                    return
                }

                if (!await bcrypt.compare(request.password, hash.hash)) { // Check password
                    return res.code(403).send({ error: "Invalid password" });
                    return
                }

                if (process.env.SEED === undefined) { // Check if the SEED environment variable is set
                    console.log("[!] Environment variable SEED not set");
                    return res.code(500).send({ error: "Qnko nqma kur" });
                    return
                }

                console.log("Before sendTokens()")
                return sendTokens(res, user); // Send JWT and refresh token
            }
        ))
    );

    router.get('/test', async (req, res) => { // Send a GET request to /api/auth/test to check JWT token
        const user = await authenticateAccessToken(req, res);
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
                const user = await authenticateRefreshToken(request.refreshToken, res);

                if (user !== undefined) { // Create new access and refresh tokens.
                    sendTokens(res, user);
                }
            }))
    )
    done();
}

const sendTokens = async (res: FastifyReply, user: UserModel | undefined) => {
    if (process.env.SEED === undefined) { // Check if the SEED environment variable is set
        console.log("[!] Environment variable SEED not set");
        return res.code(500).send({ error: "Qnko nqma kur" });
    }

    if (user === undefined) {
        console.log("[!] Environment variable SEED not set");
        return res.code(500).send({ error: "Qnko nqma kur" });
    }

    const response = await createTokens(process.env.SEED, user);
    return res.code(200).send(response); // Send JWT and refresh token
}
