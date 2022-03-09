import { FastifyInstance } from 'fastify';

import bcrypt from 'bcrypt';

import 'reflect-metadata';
import { PasswordModel } from '../db/entities/PasswordModel';
import { UserModel } from '../db/entities/UserModel';
import { Connection } from 'typeorm';
import { getDB } from '../db';
import password_req from '../common/password_req';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';



const connection: Connection = getDB();

export default (router: FastifyInstance, opts: any, done: () => any) => {

    router.post('/register', async (req, res) => {

        const email = "test1@mail.com" // Hardcoded until I figure out how to parse the damn JSON
        const username = "username"
        const password = "password"

        const user = new UserModel();
        user.email = email;
        user.username = username;

        // Check if user already exists
        const exists = await connection.manager.createQueryBuilder(UserModel, 'user')
            .where("user.email = :email", { email: email })
            .getOne();

        if (!exists) {
            return res.code(404);
        }

        // Save user
        await connection.manager.save(user);

        // Create and store password
        const salt = await bcrypt.genSalt(6);
        const hash = await bcrypt.hash(password, salt);
        const pass = new PasswordModel();
        pass.user = user.id;
        pass.hash = hash;

        await connection.manager.save(pass);

        console.log(`Password: ${pass}`);

        // TODO some error checking again
        return res.send("USER CREATED");
    })

    router.post('/login', async (req, res) => {

        return await pipe(req, password_req.decode, fold(
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
