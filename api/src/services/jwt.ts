import { Session, EncodeResult, DecodeResult, ExpirationStatus } from '../common/jwt_interfaces';
import { UserModel } from '../db/entities/UserModel';
import { encode, decode, TAlgorithm } from 'jwt-simple';

// Create a JWT token
export function createToken(secretKey: string, user: UserModel): string {
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
export function decodeToken(secretKey: string, tokenString: string): DecodeResult {
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