import * as t from 'io-ts';

export const ICommentPostRequest = t.type({
    url: t.string,
    comment: t.string
});
export type ICommentPostRequest = t.TypeOf<typeof ICommentPostRequest>;
