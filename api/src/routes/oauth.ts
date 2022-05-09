import { FastifyInstance } from 'fastify';
import 'reflect-metadata';
import { Connection } from 'typeorm';
import { getDB } from '../db';
import GoogleOAuthSchema from '../common/schemas/googleOauth';
import GithubOAuthSchema from '../common/schemas/githubOauth';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/lib/Either';

import * as jwtService from '../services/jwt';
import * as oauthService from '../services/oauth';

const connection: Connection = getDB();

export default (router: FastifyInstance, opts: any, done: () => any) => {
    router.post('/google', async (req, res) => pipe(req.body, GoogleOAuthSchema.decode, fold(
        async () => res.code(400).send({ error: "Invalid request" }),
        async (request) => {
            const user = await oauthService.googleLogin(connection, request.idToken, res);
            return jwtService.sendTokens(res, user);
        }
    )))
    router.post('/github', async (req, res) => pipe(req.body, GithubOAuthSchema.decode, fold(
        async () => res.code(400).send({ error: "Invalid request" }),
        async (request) => {
            const user = await oauthService.githubLogin(connection, request.idToken, res);
            return jwtService.sendTokens(res, user);
        }
    )))
    done();
}
