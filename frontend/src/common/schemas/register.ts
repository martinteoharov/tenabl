import * as t from 'io-ts';

const RegisterSchema = t.type({
    firstName: t.string,
    lastName: t.string,
    email: t.string,
    username: t.string,
    password: t.string,
    acceptedTerms: t.boolean
});

type RegisterSchemaType = t.TypeOf<typeof RegisterSchema>;

export default RegisterSchema;