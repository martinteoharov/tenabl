import { FastifyPluginCallback } from 'fastify';

import 'reflect-metadata';

import { IReviewPostRequest } from '../common/interfaces/requests/review';

import { JwtService } from '../services/jwt';
import { PublicationError, PublicationService } from '../services/publication';
import { ReviewService } from '../services/review';
import { withSchema } from '../utils/withSchema';

export const reviewRoutes = (
    jwts: JwtService,
    publications: PublicationService,
    reviews: ReviewService
): FastifyPluginCallback => (router, opts, done) => {
    router.post('/', jwts.withUser(withSchema(IReviewPostRequest, async (req, rep, request, user) => {
        try {
            const publication = await publications.get(request.article);
            await reviews.create(user, publication, request.flags)
            return rep.code(200).send({ ok: 'Review submitted' });
        } catch(e) { // If publication does not exist, create it
            if (e instanceof PublicationError) {
                return rep.code(400).send({ error: 'Invalid URL provided' });
            }
            // return res.code(400).send({ error: 'Invalid review' });
            throw e
        }
    })))
    router.get<{ Querystring: { url?: string }}>('/' , jwts.withUser(async (req, rep, user) => {
        if (!req.query.url) return rep.code(400).send({ error: 'Missing url' })
        const publication = await publications.find(req.query.url)
        if (!publication) return rep.code(404).send({ error: 'Unrecognized publication' })
        const review = await reviews.get(user, publication)
        if (review) return review
        return rep.code(404).send({ error: 'Not reviewed' })
    }))
    done();
}
