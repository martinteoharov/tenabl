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
            async () => res.code(400).send({ error: 'Invalid request body' }),
            async (request) => {
                const user = await authenticateAccessToken(req, res);
                let publication = await connection.manager.findOne(PublicationModel, { url: request.url });
                if (user === undefined) {
                    res.code(401).send({ error: 'Unauthorised' });
                    return
                }
                if (publication === undefined) { // If publication does not exist, create it
                        publication = new PublicationModel();
                        const publisher_name = /^[^/]*/.exec(request.url); // TODO figure out publisher name
                        if (publisher_name === null){
                            res.code(400).send({ error: 'Invalid URL provided' });
                            return
                        }
                        publication.publisher = publisher_name[0];
                        publication.url = request.url;
    
                        await connection.manager.save(publication);
                    }
                    if (publication === undefined) { // If publication does not exist, create it
                        publication = new PublicationModel();
                        const publisher_name = /^[^/]*/.exec(request.url); // TODO figure out publisher name
                        if (publisher_name === null){
                            res.code(400).send({ error: 'Invalid URL provided' });
                            return
                        }
                        publication.publisher = publisher_name[0];
                        publication.url = request.url;
    
                        await connection.manager.save(publication);
                    }
                    const review = new ReviewModel();
                    review.user = user;
                    review.publication = publication;
                    // TODO parse request.review to verify format before saving to DB
                    review.review = JSON.parse(request.review);
                
                    // Get rid of old reviews for the same publication
                    await connection.manager.delete(ReviewModel, { user: user, publication: publication });
                    await connection.manager.save(review);
                    return res.code(200).send({ ok: 'Review submitted' });
            }
        ))
    )

    done();
}
