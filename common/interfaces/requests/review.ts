import * as t from 'io-ts';
import { IFlags } from '../review';

export const IReviewPostRequest = t.type({
    url: t.string,
    flags: IFlags
});
export type IReviewPostRequest = t.TypeOf<typeof IReviewPostRequest>;