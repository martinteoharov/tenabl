import { FastifyReply } from 'fastify';
import { OAuth2Client } from 'google-auth-library';
import { Connection } from 'typeorm';
import { OAuthModel } from '../db/entities/OAuthModel';
import { UserModel } from '../db/entities/UserModel';
import * as userService from './user';

const client = new OAuth2Client(process.env.CLIENT_ID);
// Login user using Google OAuth 2
export const googleLogin = async(connection: Connection, token: string, res: FastifyReply) => {
      const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
      });

      const payload = ticket.getPayload();
      if (payload === undefined){
            res.code(401).send({ error: "Invalid token" });
            return undefined;
      }

      if (payload['given_name'] === undefined || payload['family_name'] == undefined || payload['email'] == undefined){
            res.code(401).send({ error: "Google profile permissions not given" });
            return undefined;
      }

      const googleOAuth = await connection.manager.findOne(OAuthModel, { google_auth_sub: payload['sub'] });
      // If user does not exist, create one
      if (googleOAuth === undefined){
            const username = await userService.generateUsername(connection, payload['given_name'], payload['family_name']);
            const user = {
                  firstName: payload['given_name'],
                  lastName: payload['family_name'],
                  email: payload['email'],
                  username: username,
                  acceptedTerms: true
            };
            return await userService.create(connection, user);
      }
      return await connection.manager.findOne(UserModel, googleOAuth.user);
}
