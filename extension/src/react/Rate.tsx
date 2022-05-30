import { classList } from "@lbfalvy/react-utils";
import { Article } from "../services/ratings";
import './Rate.css';
import './Overlay.css';
import React from "react";
import Button from "../common/React/components/Button";

interface Props {
    // article: Article,
    // go: (to: 'comments' | 'mini') => void
}

export function Rate(/*{ article, go }: Props*/): React.ReactElement {
    // const [review, setReview] = React.useState(article.ownReview ?? {})
    // const submit = React.useCallback(async (r: ReviewSchema) => {
    //     const final = { ...review, ...r }
    //     await article.review(final)
    //     setReview(final)
    // }, [article])
    return <div
        className={classList('tenabl_rate', 'tenabl_overlay')}
    >
        <label className="tenabl_true">
            <Button size='fill' onClick={() => {}}>True</Button>
        </label>
        <label className="tenabl_false">
            <Button size='fill' onClick={() => {}}>False</Button>
        </label>
        <label className="tenabl_concise">
            <Button size='fill' onClick={() => {}}>Concise</Button>
        </label>
        <label className="tenabl_vague">
            <Button size='fill' onClick={() => {}}>Vague</Button>
        </label>
        <label className="tenabl_outdated">
            <Button size='fill' onClick={() => {}}>Outdated</Button>
        </label>
        <label className="tenabl_comments_btn">
            <Button size='fill' onClick={() => {}}>Proceed to comments</Button>
        </label>
    </div>
}