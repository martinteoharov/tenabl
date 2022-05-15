import * as t from 'io-ts';

export const IFlags = t.type({
    reliable: t.boolean
})
export type IFlags = t.TypeOf<typeof IFlags>