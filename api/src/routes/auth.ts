import { FastifyInstance } from 'fastify';

import bcrypt from 'bcrypt';

import 'reflect-metadata';
import { PasswordModel } from '../db/entities/PasswordModel';
import { UserModel } from '../db/entities/UserModel';
import { Connection } from 'typeorm';
import { getDB } from '../db';
import password_req from '../common/password_req';
import register_req from '../common/register_req';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';
import { createToken, authenticateToken } from '../services/jwt';


const connection: Connection = getDB();

export default (router: FastifyInstance, opts: any, done: () => any) => {
    router.decorateRequest('user', {}); // Request parameter that stores the user (Doesn't work and I can't be bothered debugging it anymore)

    router.post('/register', async (req, res) => {
        return await pipe(req.body, register_req.decode, fold(
            async () => res.code(400).send({ error: "Invalid request" }),
            async (request) => {
                // Pass requirements: Minimum eight chars, one uppercase, one lowercase, one number and one special character
                const password_regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
                // Email regex explanation link: https://emailregex.com/
                const email_regex = /([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/;

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

                const userRepository = connection.getRepository(UserModel);

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

                const passRepository = connection.getRepository(PasswordModel);

                const pass = new PasswordModel() // Create password instance
                pass.user = user.id;
                pass.hash = hash;

                // Save password table entry
                await connection.manager.save(pass);

                return res.code(200).send({ ok: "User created" });
            }
        ))
    })

    router.post('/login', async (req, res) => {
        return await pipe(req.body, password_req.decode, fold(
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

                return res.code(200).send({ access_token: createToken(process.env.SEED, user) }); // Send JWT
            }
        ))
    });

    router.get('/test', {
        preHandler: (req, res, next) => {
            const user = authenticateToken(req, res);
            //req.user = user; // Typescript will whine about this
            next();
        }
    }, async (req, res) => { // Send a GET request to /api/auth/test to check JWT token
        //console.log(req.user)
        res.code(200).send({ ok: "Authenticated" });
    })

    router.get('/login', (req, res) => { res.send({ ok: "Successful redirect" }) }) // Only here for testing redirection for expired tokens

    done();
}
