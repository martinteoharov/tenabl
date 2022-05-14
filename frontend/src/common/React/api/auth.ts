// import { spawnNotification } from "src/helpers/notification";
import { fetchPost } from "./fetch"

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

export const fetchLogin = async (data: UserLoginRequest) => {
    // TODO typescript TokenPair
    const res = await fetchPost("/api/auth/login", data);

    return res;
}

export const fetchRegister = async (data: UserRegisterRequest) => {
    // TODO typescript TokenPair
    const res = await fetchPost("/api/auth/register", data);

    return res;
}