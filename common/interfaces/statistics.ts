import { IArticle } from "./article";
import * as t from 'io-ts';

export const IStatistics = t.type({
    name: t.string,
    positive: t.number,
    negative: t.number,
})
export type IStatistics = t.TypeOf<typeof IStatistics>

export const IArticleStatistics = t.type({
    article: IArticle,
    statistics: t.array(IStatistics),
})
export type IArticleStatistics = t.TypeOf<typeof IArticleStatistics>

export const ITotalStatistics = t.type({
    statistics: t.array(IStatistics)
})
export type ITotalStatistics = t.TypeOf<typeof ITotalStatistics>

export const IJudgement = t.type({
    conclusion: t.union([
        t.literal('true'),
        t.literal('false'),
        t.literal('divisive')
    ]),
    confidence: t.number
})
export type IJudgement = t.TypeOf<typeof IJudgement>
