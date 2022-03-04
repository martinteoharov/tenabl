import fastify, { FastifyInstance } from "fastify";

import { Message } from "./common/message";
import { pipe } from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/Either";

import 'reflect-metadata';
import { PasswordModel } from './db/entities/PasswordModel';
import { UserModel } from './db/entities/UserModel';
import { Connection, createConnection } from "typeorm";

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

        const user = new UserModel();
        user.email = 'test@email.com';
        user.username = 'Test';
        console.log("Created user:");
        console.log(user);

        const response = await connection.manager.save(user);

        console.log("DB response:");
        console.log(response);

        res.send(user);
    })

    router.post('/login', async (req, res) => {
        // Connection available here
        const response = connection.manager.find(PasswordModel, {
            relations: ['user']
        })
        console.log(response);

        res.send(response);
    })

    done();
}