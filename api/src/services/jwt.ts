import { Access, Refresh, Token } from '../common/interfaces/jwt';
import { UserModel } from '../db/entities/UserModel';
import { encode, decode, TAlgorithm } from 'jwt-simple';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';
import { SessionModel } from '../db/entities/SessionModel';
import { v4 as uuidv4 } from 'uuid';
import { EntityManager, EntityNotFoundError } from 'typeorm';

interface TokenPair {
    accessToken: string
    refreshToken: string
}

export interface JwtService {
    createTokens(user: UserModel): Promise<TokenPair>
    // Decode and check validity of JWT
    decodeToken(token: string): Token
    withUser(
        cb: (
            req: FastifyRequest,
            rep: FastifyReply, 
            user: UserModel
        ) => ReturnType<RouteHandlerMethod>
    ): RouteHandlerMethod
    refresh: RouteHandlerMethod
}

class AuthorizationError extends Error {}

function getBearer(header: string): string {
    if (!header.startsWith('Bearer '))
        throw new AuthorizationError('Invalid header format')
    return header.slice('Bearer '.length)
}

export function jwtService(secret: string, entities: EntityManager): JwtService {
    const seed = process.env.SEED
    if (!seed) throw new Error('Environment variable SEED not set')
    const service: JwtService = {
        async createTokens(user) {
            // Check if too many sessions exist
            const deleted = await entities.find(SessionModel, {
                select: ['id'],
                where: { user },
                order: { started: 'DESC' },
                skip: 10,
            })
            if (deleted.length != 0) {
                entities.delete(SessionModel, deleted);
            }

            const algorithm: TAlgorithm = 'HS512'; // Signing algorithm
            const issued = Date.now();
            const expirationAccess = 60 * 60 * 1000; // One hour expiration in miliseconds
            const expiresAccess = issued + expirationAccess;
            const expirationRefresh = 7 * 24 * 60 * 60 * 1000; // One week expiration in miliseconds
            const expiresRefresh = issued + expirationRefresh;

            const session = new SessionModel();
            session.id = uuidv4();
            session.started = new Date();
            session.user = user;

            const access: Access = {
                type: 'access',
                userId: user.id,
                username: user.username,
                issued: issued,
                expires: expiresAccess
            };

            const refresh: Refresh = {
                type: 'refresh',
                userId: user.id,
                sessionId: session.id,
                expires: expiresRefresh
            };

            const accessToken = encode(access, secret, algorithm);
            const refreshToken = encode(refresh, secret, algorithm);

            session.refresh_token = refreshToken;
            await entities.save(session);

            return {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        },
        decodeToken(token) {
            const algorithm: TAlgorithm = 'HS512';
            return decode(token, secret, false, algorithm)
        },
        withUser(cb) {
            return async (req, rep) => {
                if (req.headers.authorization === undefined) {
                    return rep.code(401).send({ error: "Unauthorised" });
                }
                try {
                    const token = getBearer(req.headers.authorization);
                    const access = service.decodeToken(token);
                    if (access.type !== 'access') {
                        return rep.code(401).send({ error: 'Wrong token type' })
                    }
                    const userId = access.userId;
                    // Obtain the UserModel
                    const user = await entities.findOneOrFail(UserModel, userId);
                    return cb(req, rep, user)
                } catch(e) {
                    if (e instanceof AuthorizationError) {
                        return rep.code(401).send({ error: "Unrecognized authorization scheme"})
                    } else {
                        return rep.code(401).send({ error: "Invalid token" });
                    }
                }

            }
        },
        async refresh(req, rep) {
            if (req.headers.authorization === undefined) {
                return rep.code(401).send({ error: "Unauthorised" });
            }
            try {
                const token = getBearer(req.headers.authorization);
                const refresh = service.decodeToken(token);
                if (refresh.type !== 'refresh') {
                    return rep.code(401).send({ error: 'Wrong token type' })
                }
                if (refresh.expires < Date.now()) {
                    return rep.code(401).send({ error: 'Token expired' })
                }
                // Obtain the UserModel
                const user = await entities.findOneOrFail(UserModel, refresh.userId);
                const session = await entities.findOneOrFail(SessionModel, refresh.sessionId);
                entities.delete(SessionModel, session);
                const response = await service.createTokens(user)
                return rep.code(200).send(response);
            } catch(e) {
                if (e instanceof AuthorizationError) {
                    return rep.code(401).send({ error: "Unrecognized authorization scheme"})
                } else if (e instanceof EntityNotFoundError) {
                    return rep.code(410).send({ error: 'Session invalidated' });
                } else {
                    return rep.code(401).send({ error: "Invalid token" });
                }
            }
        }
    }
    return service
}
