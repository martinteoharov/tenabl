import { FastifyInstance, FastifyReply } from 'fastify';

import { UserModel } from '../db/entities/UserModel';

import { Connection } from 'typeorm';
import { getDB } from '../db';

import * as userService from '../services/user';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';

const connection: Connection = getDB();

export default (router: FastifyInstance, opts: any, done: () => any) => {
    // router.decorateRequest('user', {}); // Request parameter that stores the user (Doesn't work and I can't be bothered debugging it anymore)

    router.get('/{id}', async (req, res) => pipe(fold(
        async () => res.code(400).send({ error: "Tiq requesti na maika si shte gi prashtash piklio" }),
        async (req) => {
        }
    ))
    )
}