import { classList } from "@lbfalvy/react-utils";
import { Article } from "../services/ratings";
import './Rate.css';
import './Overlay.css';
import React from "react";
import ReviewSchema from "../common/schemas/review";

interface Props {
    article: Article,
    go: (to: 'comments' | 'mini') => void
}

export function Rate({ article, go }: Props): React.ReactElement {
    const [review, setReview] = React.useState(article.ownReview ?? {})
    const submit = React.useCallback(async (r: ReviewSchema) => {
        const final = { ...review, ...r }
        await article.review(final)
        setReview(final)
    }, [article])
    return <div
        className={classList('rate', 'overlay')}
    >
        
    </div>
}