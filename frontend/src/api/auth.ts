import { genericFetch } from "./generic";

export interface UserLogin {
    username: string;
    password: string;
}

export interface UserRegister {
    username: string;
    email: string;
    password: string;
}

export const login = async (data: UserLogin) => {
    const res = await genericFetch("/api/login", data, "POST");

    return res;
}

export const register = async (data: UserRegister) => {
    const res = await genericFetch("/api/register", data, "POST");

    return res;
}