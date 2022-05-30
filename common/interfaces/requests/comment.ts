import * as t from 'io-ts';
import { IArticle } from '../article';

export const ICommentPostRequest = t.type({
    article: IArticle,
    comment: t.string
});
export type ICommentPostRequest = t.TypeOf<typeof ICommentPostRequest>;

export const ICommentGetResponse = t.type({
    comment: t.string
});
export type ICommentGetResponse = t.TypeOf<typeof ICommentGetResponse>;

export const ICommentListGetResponse = t.array(t.type({
    comment: t.string,
    author: t.string
}));
export type ICommentListGetResponse = t.TypeOf<typeof ICommentListGetResponse>;
