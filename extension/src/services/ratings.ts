import { Subscribe } from "@lbfalvy/mini-events"
import { IComment } from "../common/interfaces/comment"
import { IFlags } from "../common/interfaces/review"
import { IJudgement } from '../common/interfaces/statistics'
import { getComment } from "../common/React/api/query/comment"
import { getReview } from "../common/React/api/query/review"

// export interface Section {
//     review(rev: string): Promise<void>
//     judgement?: Judgement | undefined
// }

export interface Article {
    judgement?: IJudgement | undefined
    ownComment?: string | undefined
    ownReview?: IFlags | undefined
    loadComments(offset: number): Promise<IComment[]>
    comment(cmt: string): Promise<void>
    review(rev: IFlags): Promise<void>
    update: Subscribe<[]>
}

async function getRatings(token: string, url: string): Promise<Article> {
    const ownComment = await getComment(token, url)
    const ownReview = await getReview(token, url)

}