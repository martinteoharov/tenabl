import * as t from 'io-ts';

export const IAccess = t.type({
    type: t.literal('access'),
    userId: t.string,
    username: t.string,
    /**
     * Timestamp indicating when the session was created, in Unix milliseconds.
     */
    issued: t.number,
    /**
     * Timestamp indicating when the session should expire, in Unix milliseconds.
     */
    expires: t.number,
})
export type IAccess = t.TypeOf<typeof IAccess>

export const IRefresh = t.type({
    type: t.literal('refresh'),
    sessionId: t.string,
    userId: t.string,
    /**
     * Timestamp indicating when the session should expire, in Unix milliseconds.
     */
    expires: t.number,
})
export type IRefresh = t.TypeOf<typeof IRefresh>

export const IToken = t.union([IAccess, IRefresh])
export type IToken = t.TypeOf<typeof IToken>

export const ITokenPair =  t.type({
    accessToken: t.string,
    refreshToken: t.string
})
export type ITokenPair = t.TypeOf<typeof ITokenPair>