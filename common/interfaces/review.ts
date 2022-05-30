import * as t from 'io-ts';

export const IFlags = t.partial({
    credibility: t.union([
        t.literal('trustworthy'),
        t.literal('false'),
        t.undefined
    ]),
    quality: t.union([
        t.literal('concise'),
        t.literal('vague'),
        t.undefined,
    ]),
    outdated: t.union([
        t.boolean,
        t.undefined
    ])
})
export type IFlags = t.TypeOf<typeof IFlags>
