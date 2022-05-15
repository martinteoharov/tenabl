import * as t from 'io-ts';

export const IUserPublic = t.type({
    username: t.string,
    firstName: t.string,
    lastName: t.string,
})
export type IUserPublic = t.TypeOf<typeof IUserProfile>

export const IUserProfile = t.type({
    username: t.string,
    firstName: t.string,
    lastName: t.string,
    email: t.string
})
export type IUserProfile = t.TypeOf<typeof IUserProfile>
