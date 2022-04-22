import * as t from 'io-ts';

const RefreshSchema = t.type({
    refreshToken: t.string
})

type RefreshSchemaType = t.TypeOf<typeof RefreshSchema>;

export default RefreshSchema;