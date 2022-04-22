import { FastifyInstance } from 'fastify';

import 'reflect-metadata';
import { Connection } from 'typeorm';
import { getDB } from '../db';
import review_req from '../common/review_req';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';
import { ReviewModel } from '../db/entities/ReviewModel';
import { authenticateAccessToken } from '../services/jwt';
import { PublicationModel } from '../db/entities/PublicationModel';

const connection: Connection = getDB();

export default (router: FastifyInstance, opts: any, done: () => any) => {
    router.post('/submit', async (req, res) => pipe(req.body, review_req.decode, fold(
            async () => res.code(400).send({ error: 'Tiq requesti na maika si shte gi prashtash piklio' }),
            async (request) => {
                const review = new ReviewModel(); // Create user instance
                const user = await authenticateAccessToken(req, res);
                let publication = await connection.manager.findOne(PublicationModel, { url: request.url });
                if (user === undefined) {
                    res.code(401).send({ error: 'Unauthorised' });
                    return
                }
                if (publication === undefined) { // If publication does not exist, create it
                    publication = new PublicationModel();
                    publication.publisher = ''; // TODO figure out publisher name
                    publication.url = request.url;

                    connection.manager.save(publication)
                }
                review.user = user;
                review.publication = publication;
                review.review = request.review;

                await connection.manager.save(review);
                return res.code(200).send({ ok: 'Review submitted' });
            }
        ))
    )

    done();
}
