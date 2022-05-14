import { FastifyPluginCallback } from 'fastify';

import 'reflect-metadata';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';

import ReviewSchema from '../common/schemas/review';

import { JwtService } from '../services/jwt';
import { PublicationError, PublicationService } from '../services/publication';
import { ReviewService } from '../services/review';

export const reviewRoutes = (
    jwts: JwtService,
    publications: PublicationService,
    reviews: ReviewService
): FastifyPluginCallback => (router, opts, done) => {
    router.post('/submit', jwts.withUser(async (req, res, user) => pipe(req.body, ReviewSchema.decode, fold(
        async () => res.code(400).send({ error: 'Invalid request body' }),
        async (request) => {
            try {
                const publication = await publications.get(request.url);
                await reviews.create(user, publication, request.flags)
                return res.code(200).send({ ok: 'Review submitted' });
            } catch(e) { // If publication does not exist, create it
                if (e instanceof PublicationError) {
                    return res.code(400).send({ error: 'Invalid URL provided' });
                }
                // return res.code(400).send({ error: 'Invalid review' });
                throw e
            }
        }
    ))))
    done();
}
