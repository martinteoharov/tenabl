import { classList } from "@lbfalvy/react-utils";
import { Article } from "../services/ratings";
import './Mini.css';
import './Overlay.css';

interface Props {
    article: Article,
    go: (to: 'comments' | 'rate') => void
}

export function Mini({ article, go }: Props): React.ReactElement {
    const judgement = article.judgement
    return <div
        className={classList('mini', 'overlay')}
        onClick={() => go(article.ownReview ? 'comments' : 'rate')}
    >
        {judgement ? <>
            {judgement.conclusion}: {judgement.confidence}
        </>:<>
            Rate article
        </>}
    </div>
}