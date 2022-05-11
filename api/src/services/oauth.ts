import { FastifyReply } from 'fastify';
import { OAuth2Client } from 'google-auth-library';
import { Connection } from 'typeorm';
import { OAuthModel } from '../db/entities/OAuthModel';
import { UserModel } from '../db/entities/UserModel';
import axios from 'axios';
import * as userService from './user';

const googleClientId = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubSecret = process.env.GITHUB_SECRET;

// Login user using Google OAuth 2
export const googleLogin = async(connection: Connection, token: string, res: FastifyReply) => {
      const ticket = await googleClientId.verifyIdToken({
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
            const processedUser = await userService.create(connection, user);
            if (processedUser === undefined){
                  return res.code(500).send({ error: "Kura mi qnko" })
            }
            const oauthData = new OAuthModel();
            oauthData.user = processedUser.id;
            oauthData.google_auth_sub = payload['sub'];
 
            connection.manager.create(OAuthModel, oauthData);
            return processedUser;
      }
      return await connection.manager.findOne(UserModel, googleOAuth.user);
}

export const githubLogin = async(connection: Connection, requestToken: string, res: FastifyReply): Promise<UserModel | undefined> => {
      axios({
            method: 'post',
            url: `https://github.com/login/oauth/access_token?client_id=${githubClientId}&client_secret=${githubSecret}&code=${requestToken}`,
            headers: {
                  accept: 'application/json'
            }
      }).then(async (authResponse) => {
            const accessToken = authResponse.data.access_token
            
            // Fetch the user info
            axios({
                  method: 'get',
                  url: `https://api.github.com/user`,
                  headers: {
                    Authorization: 'token ' + accessToken
                  }
                }).then(async (userInfoResponse) => {
                  const githubOAuth = await connection.manager.findOne(OAuthModel, { github_auth_username: userInfoResponse.data.username });

                  // If user does not exist, create one
                  if (githubOAuth === undefined){
                        const names = userInfoResponse.data.name.split(' ');
                        const user = {
                              firstName: names[0],
                              lastName: names[1],
                              email: userInfoResponse.data.email,
                              username: userInfoResponse.data.username,
                              acceptedTerms: true
                        };

                        const processedUser = await userService.create(connection, user);
                        if (processedUser === undefined){
                              return res.code(500).send({ error: "Kura mi qnko" })
                        }
                        const oauthData = new OAuthModel();
                        oauthData.user = processedUser.id;
                        oauthData.github_auth_username = userInfoResponse.data.username;
            
                        connection.manager.create(OAuthModel, oauthData);
                        return processedUser;
                  }
                  return await connection.manager.findOne(UserModel, githubOAuth.user);
                })
                .catch(async (_) => {
                  return res.code(401).send({ error: "GitHub profile permissions not given" })
            })
      })
      .catch(async (_) => {
            return res.code(401).send({ error: "Invalid token" })
      })
      return undefined;
}

