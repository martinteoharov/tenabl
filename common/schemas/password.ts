import * as t from 'io-ts';

const PasswordSchema = t.type({
    email: t.string,
    password: t.string
});

type PasswordSchemaType = t.TypeOf<typeof PasswordSchema>;

export default PasswordSchema;