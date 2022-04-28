import { FastifyInstance } from 'fastify';

import 'reflect-metadata';
import { Connection } from 'typeorm';
import { getDB } from '../db';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';

import CommentSchema from '../common/schemas/comment';

import { authenticateAccessToken } from '../services/jwt';
import * as publicationService from '../services/publication';
import * as commentService from '../services/comment';

const connection: Connection = getDB();

export default (router: FastifyInstance, opts: any, done: () => any) => {
    router.post('/submit', async (req, res) => pipe(req.body, CommentSchema.decode, fold(
        async () => res.code(400).send({ error: 'Invalid request body' }),
        async (request) => {
            const user = await authenticateAccessToken(req, res);
            if (!user) {
                return res.code(401).send({ error: 'Unauthorised' });
            }

            const publication = await publicationService.verify(connection, request.url);
            if (!publication) { // If publication does not exist, create it
                return res.code(400).send({ error: 'Invalid URL provided' });
            }

            const created = await commentService.create(connection, user, publication, request.comment);
            if (created) {
                return res.code(200).send({ ok: 'Comment submitted' });
            }

            return res.code(400).send({ error: 'Invalid comment' });
        }
    ))
    )

    done();
}
