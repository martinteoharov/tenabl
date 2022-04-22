import * as t from 'io-ts';

const comment_req = t.type({
    url: t.string,
    comment: t.string
})

type comment_req = t.TypeOf<typeof comment_req>

export default comment_req