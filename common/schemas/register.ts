import * as t from 'io-ts';

const RegisterSchema = t.type({
    firstName: t.string,
    lastName: t.string,
    email: t.string,
    username: t.string,
    password: t.string
});

type RegisterSchemaType = t.TypeOf<typeof RegisterSchema>;

export default RegisterSchema;