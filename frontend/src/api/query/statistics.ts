// import { fetchGet } from "../fetch"
import { IArticle } from "../../common/interfaces/article";
import { IArticleStatistics } from "../../common/interfaces/statistics";

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
        { name: "concise", positive: 54, negative: 24 }
    ]
}

export const getStatisticsByArticleID = async (id: string): Promise<IArticleStatistics | undefined> => {
    // const articleStatistics = await fetchGet("/api/user/profile") as unknown as ArticleStatistics;
    console.log(id);


    if (articleStatistics) {
        return articleStatistics;
    }

    return undefined;
}