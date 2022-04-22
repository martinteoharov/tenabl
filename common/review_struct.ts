import * as t from 'io-ts';

const review_struct = t.type({
    trustworty: t.boolean,
    concise: t.boolean,
    outdated: t.boolean
})

type review_struct = t.TypeOf<typeof review_struct>

export default review_struct