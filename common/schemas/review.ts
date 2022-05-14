import * as t from 'io-ts';

const ReviewSchema = t.type({
    url: t.string,
    flags: t.type({
        reliable: t.boolean
    })
});

type ReviewSchema = t.TypeOf<typeof ReviewSchema>;

export default ReviewSchema;