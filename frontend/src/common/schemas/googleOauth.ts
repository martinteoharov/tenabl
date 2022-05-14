import * as t from 'io-ts';

const GoogleOAuthSchema = t.type({
    idToken: t.string
});

type GoogleOAuthSchemaType = t.TypeOf<typeof GoogleOAuthSchema>;

export default GoogleOAuthSchema;