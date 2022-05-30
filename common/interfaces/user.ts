import * as t from 'io-ts';

export const IUserPublic = t.type({
    username: t.string,
    firstName: t.string,
    lastName: t.string,
})
export type IUserPublic = t.TypeOf<typeof IUserPublic>

export const IUserProfile = t.type({
    username: t.string,
    firstName: t.string,
    lastName: t.string,
    email: t.string
})
export type IUserProfile = t.TypeOf<typeof IUserProfile>

export const IUserProfileEdit = t.type({
    username: t.string,
    firstName: t.string,
    lastName: t.string,
    password: t.union([t.string, t.undefined])
})
export type IUserProfileEdit = t.TypeOf<typeof IUserProfileEdit>
