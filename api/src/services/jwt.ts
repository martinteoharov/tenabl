import { Session, DecodeResult } from '../common/jwt_interfaces';
import { UserModel } from '../db/entities/UserModel';
import { encode, decode, TAlgorithm } from 'jwt-simple';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { getDB } from '../db';

const connection = getDB();

// Create a JWT token
export const createToken = (secretKey: string, user: UserModel): string => {
    const algorithm: TAlgorithm = 'HS512'; // Signing algorithm
    const issued = Date.now();
    const expiration_period = 60 * 60 * 1000; // One hour expiration in miliseconds
    const expires = issued + expiration_period;
    const session: Session = {
        id: user.id,
        username: user.username,
        issued: issued,
        expires: expires
    };

    return encode(session, secretKey, algorithm);
}

// Decode and check validity of JWT
const decodeToken = (secretKey: string, tokenString: string): DecodeResult => {
    const algorithm: TAlgorithm = 'HS512';

    let result: Session;

    try {
        return {
            type: 'valid',
            session: decode(tokenString, secretKey, false, algorithm)
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

// Check if token is valid
export const authenticateToken = async (req: FastifyRequest, res: FastifyReply) => {
    if (process.env.SEED === undefined) { // Check if env variable SEED is declared
        console.log("[!] Environment variable SEED not set");
        res.code(500).send({ error: "Internal server error" })
        return undefined;
    }

    if (req.headers.auth === undefined) { // Check if Auth header is present
        res.code(401).send({ error: "Unauthorised" });
        return undefined;
    }

    const decoded = decodeToken(process.env.SEED, req.headers.auth as string);

    if (decoded.type !== 'valid') { // Only allow valid token to authenticate
        res.code(401).send({ error: "Invalid token" });
        return undefined;
    }

    if (decoded.session.expires < Date.now()) {
        res.code(302).redirect('/api/auth/login');
        return undefined;
    }

    return await connection.manager.findOne(UserModel, decoded.session.id); // Return the UserModel
}