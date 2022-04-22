import { FastifyInstance } from 'fastify';

import 'reflect-metadata';
import { Connection } from 'typeorm';
import { getDB } from '../db';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';

import ReviewSchema from '../common/schemas/review';

import { authenticateAccessToken } from '../services/jwt';
import * as publicationService from '../services/publication';
import * as reviewService from '../services/review';

const connection: Connection = getDB();

export default (router: FastifyInstance, opts: any, done: () => any) => {
    router.post('/submit', async (req, res) => pipe(req.body, ReviewSchema.decode, fold(
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
                
                if (await reviewService.create(connection, user, publication, request.review)) {
                    return res.code(200).send({ ok: 'Review submitted' });
                }

                return res.code(400).send({ error: 'Invalid review' });
            }
        ))
    )

    done();
}
