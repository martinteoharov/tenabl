import { Subscribe } from "@lbfalvy/mini-events"
import { IComment } from "../common/interfaces/comment"
import { IFlags } from "../common/interfaces/review"

export interface Judgement {
    conclusion: 'true'|'false'|'divisive'
    confidence: number
}

// export interface Section {
//     review(rev: string): Promise<void>
//     judgement?: Judgement | undefined
// }

export interface Article {
    judgement?: Judgement | undefined
    ownComment?: string | undefined
    ownReview?: IFlags | undefined
    loadComments(offset: number): Promise<IComment[]>
    comment(cmt: string): Promise<void>
    review(rev: IFlags): Promise<void>
    update: Subscribe<[]>
}

async function getRatings(url: string): Promise<Article> {
    
}