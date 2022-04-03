import * as t from 'io-ts';

const password_req = t.type({
    email: t.string,
    password: t.string
})

type password_req = t.TypeOf<typeof password_req>

export default password_req