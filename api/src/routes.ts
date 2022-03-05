import fastify, { FastifyInstance } from 'fastify';

import { Message } from './common/message';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';
import bcrypt from 'bcrypt';

import 'reflect-metadata';
import { PasswordModel } from './db/entities/PasswordModel';
import { UserModel } from './db/entities/UserModel';
import { Connection, createConnection } from 'typeorm';
// import * as D from 'io-ts/Decoder';

// Ad-hoc database
const msgs = new Array<Message>();

let connection: Connection;
(async () => {
    connection = await createConnection();
})();

const router = fastify({
    logger: true
})

export default (router: FastifyInstance, opts: any, done: () => any) => {

    // Reply using return value
    router.post('/send', async (req, res) => {
        return pipe( // Allows to write nested functions in order of execution
            Message.decode(req.body),
            fold( // Takes handlers for two sides, calls whichever
                errs => `Errors: ${errs
                    .map(error => error.message)
                    .filter((x): x is string => x !== undefined)
                    .map(message => ` - ${message}\n`)
                    }`,
                m => {
                    msgs.push(m)
                    return 'Received'
                }
            )
        )
    })

    // Reply using callback
    router.get('/messages', (req, res) => {
        res.send(msgs)
    })

    router.post('/register', async (req, res) => {
        const email = "test1@mail.com" // Hardcoded until I figure out how to parse the damn JSON
        const username = "username"
        const password = "password"

        const user = new UserModel();
        user.email = email;
        user.username = username;

        const exists = await connection.manager.createQueryBuilder(UserModel, 'user')
            .where("user.email = :email", { email: email })
            .getOne() === undefined;

        if (exists) {
            const response_user = await connection.manager.save(user);
            // TODO some error checking with response
            const salt = await bcrypt.genSalt(6);
            const hash = await bcrypt.hash(password, salt);

            const pass = new PasswordModel();
            pass.user = user.id;
            pass.hash = hash;

            const response_pass = await connection.manager.save(pass);

            console.log("PASSWORD");
            console.log(pass);
            // TODO some error checking again
            res.send("USER CREATED");
        } else {
            res.send("USER EXISTS")
        }
    })

    router.post('/login', async (req, res) => {

        const email = "test1@mail.com";
        const password = "password";

        const user = await connection.manager.createQueryBuilder(UserModel, 'user')
            .where("user.email = :email", { email: email })
            .getOne();

        if (user !== undefined) {
            const hash = await connection.manager.createQueryBuilder(PasswordModel, 'password')
                .where("user_id = :id", { id: user.id })
                .getOne();

            if (hash !== undefined){
                if (await bcrypt.compare(password, hash.hash)){
                    res.send("AUTHENTICATED");
                } else{
                    res.send("INCORRECT PASSWORD");
                }
            }
        } else {
            res.send("EMAIL NOT REGISTERED");
        }
    })

    done();
}