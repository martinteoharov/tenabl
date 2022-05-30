// import { fetchGet } from "../fetch"
import { IAssGetResult, IJudgementGetResult } from "../../../interfaces/requests/statistics";
import { IArticleStatistics, ITotalStatistics } from "../../../interfaces/statistics";
import { HttpError, request } from "../fetch";

export async function getStatistics(url: string): Promise<IArticleStatistics>
export async function getStatistics(): Promise<ITotalStatistics>
export async function getStatistics(url?: string | undefined): Promise<IAssGetResult | undefined> {
    try {
        if (url) return {
            statistics: await request('GET', '/api/statistics/assessment', { params: { url }, silent: true }),
            article: await request('GET', '/api/statistics/article', { params: { url }, silent: true })
        }
        return {
            statistics: await request('GET', '/api/statistics/assessment', { silent: true })
        }
    } catch(ex) {
        if (ex instanceof HttpError && ex.code == 404) {
            return undefined
        }
        throw ex
    }
}

export async function getJudgement(url: string): Promise<IJudgementGetResult | undefined> {
    return await request('GET', '/api/statistics/judgement', { params: { url }, silent404: true })
}
