import * as t from 'io-ts';

const register_req = t.type({
    first_name: t.string,
    last_name: t.string,
    email: t.string,
    username: t.string,
    password: t.string,
    accepted_terms: t.boolean
})

type register_req = t.TypeOf<typeof register_req>

export default register_req