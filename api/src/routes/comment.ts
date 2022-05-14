import { FastifyPluginCallback } from 'fastify';

import 'reflect-metadata';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';

import CommentSchema from '../common/schemas/comment';

import { CommentService } from '../services/comment';
import { PublicationError, PublicationService } from '../services/publication';
import { JwtService } from '../services/jwt';

export const commentRoutes = (
    jwts: JwtService,
    comments: CommentService,
    publications: PublicationService
): FastifyPluginCallback => (router, opts, done) => {
    router.post('/submit', jwts.withUser(async (req, res, user) => pipe(req.body, CommentSchema.decode, fold(
        async () => res.code(400).send({ error: 'Invalid request body' }),
        async (request) => {
            try {
                const publication = await publications.get(request.url);
                await comments.create(user, publication, request.comment);
                return res.code(200).send({ ok: 'Comment submitted' });
            } catch(e) { // If publication does not exist, create it
                if (e instanceof PublicationError) {
                    return res.code(400).send({ error: 'Invalid URL provided' });
                } else {
                    return res.code(400).send({ error: 'Invalid comment' });
                }
            }
        }
    ))))
    done()
}
