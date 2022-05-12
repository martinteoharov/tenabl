import * as passwordService from '../services/password';
import { Connection } from "typeorm";
import { UserModel } from "../db/entities/UserModel";
import { FastifyReply } from 'fastify';

export const create = async (connection: Connection, request: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    acceptedTerms: boolean;
}) => {
    // Basic email regex
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i;

    // Check if acceptedTerms is false
    if (!request.acceptedTerms) {
        return false;
    }

    // Validate email based on RFC 5322 specifications
    if (!emailRegex.test(request.email)) {
        return false;
    }

    const user = new UserModel(); // Create user instance
    user.first_name = request.firstName;
    user.last_name = request.lastName;
    user.username = request.username;
    user.email = request.email;
    user.accepted_terms = request.acceptedTerms;

    await connection.manager.save(user);
    return user;
}

// Function that returns an array of status code and error response or userModel object
export const login = async (connection: Connection, request: {
    email: string;
    password: string;
}, res: FastifyReply) => {
    // Fetch user profile with given email
    const user = await connection.manager.findOne(UserModel, { email: request.email });

    if (!user) {
        res.code(400).send({ error: "User does not exist" });
        return undefined
    }

    if (!await passwordService.verify(connection, user, request.password)) {
        res.code(400).send({ error: "Invalid password" });
        return undefined
    }

    // Check if the SEED environment variable is set
    if (process.env.SEED === undefined) {
        console.log("[!] Environment variable SEED not set");
        res.code(500).send({ error: "Qnko nqma kur" });
        return undefined
    }

    return user;
}
