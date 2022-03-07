import { FastifyInstance } from 'fastify';

import bcrypt from 'bcrypt';

import 'reflect-metadata';
import { PasswordModel } from '../db/entities/PasswordModel';
import { UserModel } from '../db/entities/UserModel';
import { Connection } from 'typeorm';
import { getDB } from '../db';
// import * as D from 'io-ts/Decoder';

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

        if(!exists) {
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

        const email = "test1@mail.com";
        const password = "password";

        const user = await connection.manager.createQueryBuilder(UserModel, 'user')
            .where("user.email = :email", { email: email })
            .getOne();

        if(!user) {
            console.log("Warning: user is undefined");
            return res.code(404);
        }

        const hash = await connection.manager.createQueryBuilder(PasswordModel, 'password')
            .where("user_id = :id", { id: user.id })
            .getOne();

        if(!hash) {
            console.log("Warning: hash is undefined");
            return res.code(404);
        }

        if (!await bcrypt.compare(password, hash.hash)){
            return res.send("INCORRECT PASSWORD");
        }

        return res.send("AUTHENTICATED");
    });

    done();
}
