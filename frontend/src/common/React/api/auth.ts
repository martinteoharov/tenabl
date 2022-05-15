// import { spawnNotification } from "src/helpers/notification";
import { fetchPost, fetchPostAuth } from "./fetch"
import { ITokenPair } from '../../interfaces/jwt'

export interface UserLoginRequest {
    email: string;
    password: string;
    acceptedTerms: boolean;
}

export interface UserRegisterRequest {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    acceptedTerms: boolean;
}

export const fetchLogin = async (data: UserLoginRequest): Promise<ITokenPair> => {
    // TODO typescript TokenPair
    return await fetchPost("/api/auth/login", data);
}

export const fetchRegister = async (data: UserRegisterRequest): Promise<ITokenPair> => {
    // TODO typescript TokenPair
    return await fetchPost("/api/auth/register", data);
}

export const fetchRefresh = async (token: string): Promise<ITokenPair> => {
    return await fetchPostAuth(token, '/api/auth/refresh')
}
