import { FastifyInstance, FastifyReply } from 'fastify';

import * as jwtService from '../services/jwt';

export default (router: FastifyInstance, opts: any, done: () => any) => {
    // router.decorateRequest('user', {}); // Request parameter that stores the user (Doesn't work and I can't be bothered debugging it anymore)

    router.get('/profile', async (req, res) => {
        // const user = await jwtService.authenticateAccessToken(req, res);

        res.code(200).send({ username: "martinteoharov", firstName: "Martin", lastName: "Teoharov", email: "martin.teoharov15@gmail.com" });
    });

    done();
}