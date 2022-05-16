import * as t from 'io-ts';

export const IComment = t.type({
    url: t.string,
    comment: t.string,
    author: t.string,
    timestamp: t.number
});
export type IComment = t.TypeOf<typeof IComment>;
