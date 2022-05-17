import { FastifyPluginCallback } from 'fastify';

import 'reflect-metadata';


import { JwtService } from '../services/jwt';
import { PublicationService } from '../services/publication';
import { StatisticsService } from '../services/statistics';

export const statisticsRoutes = (
    jwts: JwtService,
    publications: PublicationService,
    statistics: StatisticsService
): FastifyPluginCallback => (router, opts, done) => {
    router.get<{ Querystring: { url?: string }}>('/judgement' , async (req, rep) => {
        if (!req.query.url) return rep.code(400).send({ error: 'Missing url' })
        const publication = await publications.find(req.query.url)
        if (!publication) return rep.code(404).send({ error: 'Unrecognized publication' })
        return await statistics.judge(publication)
    })
    router.get<{ Querystring: { url?: string }}>('/assessment' , async (req, rep) => {
        if (!req.query.url) return rep.code(400).send({ error: 'Missing url' })
        const publication = await publications.find(req.query.url)
        if (!publication) return rep.code(404).send({ error: 'Unrecognized publication' })
        return await statistics.anal(publication)
    })
    done();
}
