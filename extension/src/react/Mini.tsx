import { classList } from "@lbfalvy/react-utils";
import React from "react";
import { useVariable } from "../common/React/helpers/useVariable";
import { rtr } from "../services/auth";
import { Article, AuthdArticle } from "../services/ratings";
import './Mini.css';
import './Overlay.css';

interface Props {
    article: Article,
    go: (to: 'comments' | 'rate') => void
}

export function Mini({ article, go }: Props): React.ReactElement {
    console.log('Mini view')
    const judgement = article.judgement
    const token = useVariable(rtr.session)
    const [authd, setAuthd] = React.useState<AuthdArticle>()
    React.useEffect(() => {
        if (!token) setAuthd(undefined);
        else article.authenticated(token).then(setAuthd)
    })
    const nextPage = !authd || authd.ownReview ? 'comments' : 'rate'
    if (judgement) return <div
        className={classList('tenabl_mini', 'tenabl_overlay')}
        // If the user isn't logged in, or if they have already reviewed, show the comments
        onClick={() => go(nextPage)}
    >
        {judgement.conclusion}: {judgement.confidence}
    </div>
    return <div
        className={classList('tenabl_mini', 'tenabl_overlay')}
        onClick={() => go(nextPage)}
    >
        {nextPage == 'rate' && !article.hasComments ? <>
            Rate or comment on article
        </> : <>
            Comments via Tenabl
        </>}
    </div>
}