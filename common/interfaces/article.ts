import * as t from 'io-ts';

export const IArticle = t.type({
    name: t.string,
    description: t.string,
    url: t.string
})
export type IArticle = t.TypeOf<typeof IArticle>
