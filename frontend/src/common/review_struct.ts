import * as t from 'io-ts';

const ReviewStruct = t.type({
    trustworty: t.boolean,
    concise: t.boolean,
    outdated: t.boolean
});

type ReviewStructType = t.TypeOf<typeof ReviewStruct>;

export default ReviewStructType;