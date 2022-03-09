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

const connection: Connection = getDB();

export default (router: FastifyInstance, opts: any, done: () => any) => {

    router.post('/register', async (req, res) => {
        return await pipe(req.body, register_req.decode, fold(
            async () => res.code(400).send({ error: "Invalid request" }),
            async (request) => {

                // Verification checks
                const valid_pass = new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/).test(request.password);
                const valid_email = new RegExp(/([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/).test(request.email);

                // Check if accepted_terms is false
                if (!request.accepted_terms) {
                    res.code(400).send({ error: "Terms and conditions not accepted" })
                }

                // Pass requirements: Minimum eight chars, one uppercase, one lowercase, one number and one special character
                if (!valid_pass) {
                    res.code(400).send({ error: "Password does not meet standards" })
                }

                // Validate email based on RFC 5322 specifications
                if (!valid_email) {
                    res.code(400).send({ error: "Invalid email format" })
                }

                // Check if user already exists
                const email_exists = await connection.manager.findOne(UserModel, { email: request.email }) !== undefined;
                if (email_exists) {
                    res.code(400).send({ error: "User already exists" })
                }

                console.log("VALIDATED")

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

        // TODO fix decoding error
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

                if (!await bcrypt.compare(request.password, hash.hash)) { // Chech password
                    return res.code(403).send({ error: "Invalid password" });
                }

                return res.code(200).send({ ok: "Authenticated" });
                // TODO send JWT
            }
        ))
    });

    done();
}
