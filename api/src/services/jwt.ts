import { Access, DecodeAccessResult, Refresh, DecodeRefreshResult } from '../common/jwt_interfaces';
import { UserModel } from '../db/entities/UserModel';
import { encode, decode, TAlgorithm } from 'jwt-simple';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getDB } from '../db';
import { SessionModel } from '../db/entities/SessionModel';
import { v4 as uuidv4 } from 'uuid';

const connection = getDB();

// Create access and refresh tokens
export const createTokens = async (secretKey: string, user: UserModel): Promise<{ access_token: string; refresh_token: string; }> => {
    // Check if too many sessions exist
    checkUserSessions(user.id);

    const algorithm: TAlgorithm = 'HS512'; // Signing algorithm
    const issued = Date.now();
    const expiration_access = 60 * 60 * 1000; // One hour expiration in miliseconds
    const expires_access = issued + expiration_access;
    const expiration_refresh = 7 * 24 * 60 * 60 * 1000; // One week expiration in miliseconds
    const expires_refresh = issued + expiration_refresh;

    const session = new SessionModel();
    session.id = uuidv4();
    session.started = new Date();
    session.user = user;

    const access: Access = {
        userId: user.id,
        username: user.username,
        issued: issued,
        expires: expires_access
    };

    const refresh: Refresh = {
        userId: user.id,
        sessionId: session.id,
        expires: expires_refresh
    };

    const access_token = encode(access, secretKey, algorithm);
    const refresh_token = encode(refresh, secretKey, algorithm);

    session.refresh_token = refresh_token;
    await connection.manager.save(session);

    return {
        access_token: access_token,
        refresh_token: refresh_token
    }
}

// Decode and check validity of JWT
const decodeAccessToken = (secretKey: string, tokenString: string): DecodeAccessResult => {
    const algorithm: TAlgorithm = 'HS512';

    try {
        return {
            type: 'valid',
            access: decode(tokenString, secretKey, false, algorithm)
        }
    } catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        return {
            type: 'invalid-token' // Return invalid token
        };
    }
}

// Decode and check validity of refresh token
const decodeRefreshToken = (secretKey: string, tokenString: string): DecodeRefreshResult => {
    const algorithm: TAlgorithm = 'HS512';
    
    try {
        return {
            type: 'valid',
            refresh: decode(tokenString, secretKey, false, algorithm)
        }
    } catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        return {
            type: 'invalid-token' // Return invalid token
        };
    }
}

// Check if JWT and/or refresh token are valid
export const authenticateAccessToken = async (req: FastifyRequest, res: FastifyReply) => {
    if (process.env.SEED === undefined) { // Check if env variable SEED is declared
        console.log("[!] Environment variable SEED not set");
        res.code(500).send({ error: "Internal server error" })
        return undefined;
    }

    if (req.headers.auth === undefined) { // Check if Auth header is present
        res.code(401).send({ error: "Unauthorised" });
        return undefined;
    }

    const decoded = decodeAccessToken(process.env.SEED, req.headers.auth as string);

    if (decoded.type !== 'valid') { // Only allow valid token to authenticate
        res.code(401).send({ error: "Invalid token" });
        return undefined;
    }

    const userId = decoded.access.userId;

    return await connection.manager.findOne(UserModel, userId); // Return the UserModel
}

// Check validity of the refresh token
export const authenticateRefreshToken = async (string_token: string, res: FastifyReply) => {
    if (process.env.SEED === undefined) { // Check if env variable SEED is declared
        console.log("[!] Environment variable SEED not set");
        res.code(500).send({ error: "Internal server error" })
        return undefined;
    }

    const decoded = decodeRefreshToken(process.env.SEED, string_token);

    if (decoded.type !== 'valid') { // Only allow valid token to authenticate
        res.code(401).send({ error: "Invalid token" });
        return undefined;
    }

    const userId = decoded.refresh.userId;

    // Grab currently valid token for the user
    const session = await connection.manager.findOne(SessionModel, decoded.refresh.sessionId);

    console.log("CURRENT SESSION");
    console.log(session);

    if (decoded.refresh.expires < Date.now() || session === undefined) { // If refresh token is expired or no current token exists, send to login
        res.code(302).redirect('/api/auth/login');
        return undefined;
    }

    if (string_token !== session.refresh_token) { // If token does not match, invalidate current refresh token
        connection.manager.remove(session);
        res.code(401).send({ error: "Invalid refresh token" })
        return undefined;
    }

    connection.manager.delete(SessionModel, {user: userId, refresh_token: string_token}); // Delete used token
    return await connection.manager.findOne(UserModel, userId); // Return the UserModel
}

const checkUserSessions = async (userId: string) => {
    // Delete all but 10 of the most recent sessions
    const deleted = await connection.manager.find(SessionModel, {where: {user: userId}, order: {started: 'ASC'}, take: 10, select: ['id']})
    connection.manager.delete(SessionModel, deleted);
}