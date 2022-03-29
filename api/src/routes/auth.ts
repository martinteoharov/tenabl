import { FastifyInstance, FastifyReply } from 'fastify';

import bcrypt from 'bcrypt';

import 'reflect-metadata';
import { PasswordModel } from '../db/entities/PasswordModel';
import { UserModel } from '../db/entities/UserModel';
import { Connection } from 'typeorm';
import { getDB } from '../db';
import password_req from '../common/password_req';
import register_req from '../common/register_req';
import refresh_req from '../common/refresh_req';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';
import { createTokens, authenticateAccessToken, authenticateRefreshToken } from '../services/jwt';


const connection: Connection = getDB();

export default (router: FastifyInstance, opts: any, done: () => any) => {
    router.decorateRequest('user', {}); // Request parameter that stores the user (Doesn't work and I can't be bothered debugging it anymore)

    router.post('/register', async (req, res) => pipe(req.body, register_req.decode, fold(
            async () => res.code(400).send({ error: "Invalid request" }),
            async (request) => {
                // Pass requirements: Minimum eight chars, one uppercase, one lowercase, one number and one special character
                const password_regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
                // Basic email regex
                const email_regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i; 

                // Check if accepted_terms is false
                if (!request.accepted_terms) {
                    res.code(400).send({ error: "Terms and conditions not accepted" })
                }

                if (!password_regex.test(request.password)) {
                    res.code(400).send({ error: "Password does not meet standards" })
                }

                // Validate email based on RFC 5322 specifications
                if (!email_regex.test(request.email)) {
                    res.code(400).send({ error: "Invalid email format" })
                }

                // Check if user already exists
                const email_exists = await connection.manager.findOne(UserModel, { email: request.email }) !== undefined;
                if (email_exists) {
                    res.code(400).send({ error: "User already exists" })
                }

                const user = new UserModel(); // Create user instance
                user.first_name = request.first_name;
                user.last_name = request.last_name;
                user.username = request.username;
                user.email = request.email;
                user.accepted_terms = request.accepted_terms;

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

    router.post('/login', async (req, res) => pipe(req.body, password_req.decode, fold(
            async () => res.code(400).send({ error: "Invalid request" }),
            async (request) => {
                const user = await connection.manager.findOne(UserModel, { email: request.email }); // Fetch user profile with given email

                if (!user) {
                    return res.code(400).send({ error: "User does not exist" });
                }

                const hash = await connection.manager.findOne(PasswordModel, { user: user.id }); // Fetch user password hash

                if (!hash) {
                    return res.code(400).send({ error: "Try OAuth" }); // User has no password, probably logged in with OAuth
                }

                if (!await bcrypt.compare(request.password, hash.hash)) { // Check password
                    return res.code(403).send({ error: "Invalid password" });
                }

                if (process.env.SEED === undefined) { // Check if the SEED environment variable is set
                    console.log("[!] Environment variable SEED not set");
                    return res.code(500).send({ error: "Internal server error" });
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
        }
    })

    router.get('/login', (req, res) => { res.send({ ok: "Successful redirect" }) }) // Only here for testing redirection for expired tokens

    // Send a POST request to /api/auth/refresh to get new access and refresh tokens.
    router.post('/refresh', async (req, res) => pipe(req.body, refresh_req.decode, fold(
            async () => res.code(400).send({ error: "Invalid request" }),
            async (request) => {
                const user = await authenticateRefreshToken(request.refresh_token, res);

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
        return res.code(500).send({ error: "Internal server error" });
    }

    if (user === undefined) {
        console.log("[!] Environment variable SEED not set");
        return res.code(500).send({ error: "Internal server error" });
    }

    const response = await createTokens(process.env.SEED, user);
    return res.code(200).send(response); // Send JWT and refresh token
}