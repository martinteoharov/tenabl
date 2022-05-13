// import { fetchGet } from "../fetch"
import { ArticleStatistics } from "../../common/interfaces/statistics";

export const getStatisticsByArticleID = async (id: number): Promise<ArticleStatistics | undefined> => {
    // const articleStatistics = await fetchGet("/api/user/profile") as unknown as ArticleStatistics;
    console.log(id);

    const articleStatistics: ArticleStatistics = {
        voteCount: 123,
        trust: {
            positive: 34,
            negative: 62
        },
        concise: {
            positive: 43,
            negative: 75
        }
    }

    if (articleStatistics) {
        return articleStatistics;
    }

    return undefined;
}