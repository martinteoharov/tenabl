// import { fetchGet } from "../fetch"
import { IArticle } from "../../../interfaces/article";
import { IArticleStatistics, ITotalStatistics } from "../../../interfaces/statistics";

const article: IArticle = {
    id: "123",
    name: "Victor is a sad cunt",
    description: "Very bad stuff...",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}

const articleStatistics: IArticleStatistics = {
    article,
    statistics: [
        { name: "trustworthiness", positive: 125, negative: 54 },
        { name: "concise", positive: 89, negative: 24 },
        { name: "outdated", positive: 100, negative: 169 },
        { name: "biased", positive: 54, negative: 69 },
    ]
}

export async function getStatisticsByArticleID(id: string): Promise<IArticleStatistics>
export async function getStatisticsByArticleID(): Promise<ITotalStatistics>
export async function getStatisticsByArticleID(id?: string | undefined): Promise<IArticleStatistics | ITotalStatistics | undefined> {
    // if ID is not defined, fetch median statistics
    if (!id) {
        // const articleStatistics = await fetchGet("/api/statistics/") as unknown as ArticleStatistics;
        return {
            ...articleStatistics,
            article: undefined
        }
    }

    if (articleStatistics) {
        return articleStatistics;
    }

    return undefined;
}
