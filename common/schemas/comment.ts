import * as t from 'io-ts';

const CommentSchema = t.type({
    url: t.string,
    comment: t.string
});

type CommentSchemaType = t.TypeOf<typeof CommentSchema>;

export default CommentSchema;