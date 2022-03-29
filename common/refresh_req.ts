import * as t from 'io-ts';

const refresh_req = t.type({
    refresh_token: t.string
})

type refresh_req = t.TypeOf<typeof refresh_req>

export default refresh_req