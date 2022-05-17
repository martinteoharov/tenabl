import * as t from 'io-ts';
import { IArticle } from '../article';
import { IFlags } from '../review';

export const IReviewPostRequest = t.type({
    article: IArticle,
    flags: IFlags
});
export type IReviewPostRequest = t.TypeOf<typeof IReviewPostRequest>;

export { IFlags as IReviewGetResponse } from '../review'
