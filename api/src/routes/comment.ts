import { FastifyPluginCallback } from 'fastify';

import 'reflect-metadata';



import { CommentService } from '../services/comment';
import { PublicationError, PublicationService } from '../services/publication';
import { JwtService } from '../services/jwt';
import { withSchema } from '../utils/withSchema';
import { ICommentPostRequest } from '../common/interfaces/requests/comment';

export const commentRoutes = (
    jwts: JwtService,
    comments: CommentService,
    publications: PublicationService
): FastifyPluginCallback => (router, opts, done) => {
    router.post('/', jwts.withUser(withSchema(ICommentPostRequest, async (req, rep, request, user) => {
        try {
            const publication = await publications.get(request.url);
            await comments.create(user, publication, request.comment);
            return rep.code(204).send();
        } catch(e) { // If publication does not exist, create it
            if (e instanceof PublicationError) {
                return rep.code(400).send({ error: 'Invalid URL provided' });
            } else {
                return rep.code(400).send({ error: 'Invalid comment' });
            }
        }
    })))
    router.get<{ Querystring: { url?: string } }>('/', jwts.withUser(async (req, rep, user) => {
        if (!req.query.url) return rep.code(400).send({ error: 'Missing url' })
        const publication = await publications.find(req.query.url)
        if (!publication) return rep.code(404).send({ error: 'Unrecognized publication' })
        const comment = await comments.get(user, publication)
        if (!comment) return rep.code(404).send({ error: 'Not commented' })
        return { comment }
    }))
    done()
}
