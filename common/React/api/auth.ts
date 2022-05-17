// import { spawnNotification } from "src/helpers/notification";
import { ITokenPair } from '../../interfaces/jwt'
import { ILoginRequest, IRegisterRequest } from '../../interfaces/requests/auth';
import { request } from './fetch';

export const fetchLogin = async (body: ILoginRequest): Promise<ITokenPair> => {
    // TODO typescript TokenPair
    return await request('POST', "/api/auth/login", { body });
}

export const fetchRegister = async (body: IRegisterRequest): Promise<ITokenPair> => {
    // TODO typescript TokenPair
    return await request('POST', "/api/auth/register", { body });
}

export const fetchRefresh = async (token: string): Promise<ITokenPair> => {
    return await request('POST', '/api/auth/refresh', { token })
}
