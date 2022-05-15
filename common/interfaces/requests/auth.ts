import * as t from 'io-ts';

export const IRegisterRequest = t.type({
    firstName: t.string,
    lastName: t.string,
    email: t.string,
    username: t.string,
    password: t.string
});
export type IRegisterRequest = t.TypeOf<typeof IRegisterRequest>;

export { ITokenPair as IRegisterResponse } from '../jwt'

export const ILoginRequest = t.type({
    email: t.string,
    password: t.string
});
export type ILoginRequest = t.TypeOf<typeof ILoginRequest>;

export { ITokenPair as ILoginResponse } from '../jwt'
