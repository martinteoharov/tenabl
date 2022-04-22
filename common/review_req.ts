import * as t from 'io-ts';

const review_req = t.type({
    user: t.string,
    url: t.string,
    review: t.string
})

type review_req = t.TypeOf<typeof review_req>

export default review_req