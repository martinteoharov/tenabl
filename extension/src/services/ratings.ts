import { Subscribe, Variable } from "@lbfalvy/mini-events"
import { IArticle } from "../common/interfaces/article"
import { IComment } from "../common/interfaces/comment"
import { IFlags } from "../common/interfaces/review"
import { IJudgement } from '../common/interfaces/statistics'
import { getComment, postComment, listComments, signalComment } from "../common/React/api/query/comment"
import { getReview, postReview } from "../common/React/api/query/review"
import { getJudgement } from '../common/React/api/query/statistics'

// export interface Section {
//     review(rev: string): Promise<void>
//     judgement?: Judgement | undefined
// }

export interface AuthdArticle {
    ownComment?: string | undefined
    ownReview?: IFlags | undefined
    comment(cmt: string): Promise<void>
    review(rev: IFlags): Promise<void>
}

export interface Article {
    judgement?: IJudgement | undefined
    hasComments: boolean
    loadComments(offset: number): Promise<IComment[]>
    update: Subscribe<[]>
    authenticated(token: Variable<string>): Promise<AuthdArticle>
}

// async function getMock(): Article {
//     return {
//         judgement: {
//             conclusion: 'true',
//             confidence: 0.7
//         },
//         update: ()
//     }
// }

export async function getRatings(article: IArticle): Promise<[Article, () => void]> {
    console.log('Getting ratings for', article)
    const [signal, listen, cleanup] = await signalComment(article.url)
    console.log('Connected to socket')
    const loadComments = async (oofset: number) => {
        const l = await listComments(article.url, oofset, 10)
        return l.map(c => ({ url: article.url, ...c }))
    }
    const service: Article = {
        judgement: await getJudgement(article.url),
        authenticated: async (token) => ({
            ownComment: await getComment(token.get(), article.url),
            ownReview: await getReview(token.get(), article.url),
            comment: async comment => {
                await postComment(token.get(), { article, comment })
                signal()
            },
            review: flags => postReview(token.get(), { article, flags })
        }),
        loadComments,
        update: listen,
        hasComments: (await loadComments(0)).length > 0
    }
    return [service, cleanup]
}