import { Access, DecodeAccessResult, Refresh, DecodeRefreshResult } from '../common/interfaces/jwt';
import { UserModel } from '../db/entities/UserModel';
import { encode, decode, TAlgorithm } from 'jwt-simple';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getDB } from '../db';
import { SessionModel } from '../db/entities/SessionModel';
import { v4 as uuidv4 } from 'uuid';

const connection = getDB();

// Create access and refresh tokens
const createTokens = async (secretKey: string, user: UserModel): Promise<{ accessToken: string; refreshToken: string; }> => {
    // Check if too many sessions exist
    checkUserSessions(user.id);

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
        userId: user.id,
        username: user.username,
        issued: issued,
        expires: expiresAccess
    };

    const refresh: Refresh = {
        userId: user.id,
        sessionId: session.id,
        expires: expiresRefresh
    };

    const accessToken = encode(access, secretKey, algorithm);
    const refreshToken = encode(refresh, secretKey, algorithm);

    session.refresh_token = refreshToken;
    await connection.manager.save(session);

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
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
        res.code(500).send({ error: "Qnko nqma kur" })
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
export const authenticateRefreshToken = async (stringToken: string, res: FastifyReply) => {
    if (process.env.SEED === undefined) { // Check if env variable SEED is declared
        console.log("[!] Environment variable SEED not set");
        res.code(500).send({ error: "Qnko nqma kur" })
        return undefined;
    }

    const decoded = decodeRefreshToken(process.env.SEED, stringToken);

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

    if (stringToken !== session.refresh_token) { // If token does not match, invalidate current refresh token
        connection.manager.remove(session);
        res.code(401).send({ error: "Invalid refresh token" })
        return undefined;
    }

    connection.manager.delete(SessionModel, {user: userId, refresh_token: stringToken}); // Delete used token
    return await connection.manager.findOne(UserModel, userId); // Return the UserModel
}

// This function is used to create and send the appropriate JWT tokens
export const sendTokens = async (res: FastifyReply, user: UserModel | undefined) => {
    if (process.env.SEED === undefined) { // Check if the SEED environment variable is set
        console.log("[!] Environment variable SEED not set");
        return res.code(500).send({ error: "Qnko nqma kur" });
    }

    if (user === undefined) {
        console.log("[!] Environment variable SEED not set");
        return res.code(500).send({ error: "Qnko nqma kur" });
    }

    const response = await createTokens(process.env.SEED, user);
    return res.code(200).send(response); // Send JWT and refresh token
}

const checkUserSessions = async (userId: string) => {
    // Delete all but 10 of the most recent sessions
    const deleted = await connection.manager.find(SessionModel, {where: {user: userId}, order: {started: 'ASC'}, skip: 9, select: ['id']})
    if (deleted.length !== 0) {
        connection.manager.delete(SessionModel, deleted);
    }
}

