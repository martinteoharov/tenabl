import * as t from 'io-ts';

export const IOAuthRequest = t.type({
    idToken: t.string
});
export type IOAuthRequest = t.TypeOf<typeof IOAuthRequest>;
