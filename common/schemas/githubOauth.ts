import * as t from 'io-ts';

const GithubOAuthSchema = t.type({
    idToken: t.string
});

type GithubOAuthSchemaType = t.TypeOf<typeof GithubOAuthSchema>;

export default GithubOAuthSchema;