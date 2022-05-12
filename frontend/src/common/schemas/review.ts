import * as t from 'io-ts';

const ReviewSchema = t.type({
    url: t.string,
    review: t.string
});

type ReviewSchemaType = t.TypeOf<typeof ReviewSchema>;

export default ReviewSchema;