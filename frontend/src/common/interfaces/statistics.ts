import { IArticle } from "./article";

export interface IStatistics {
    name: string;
    positive: number;
    negative: number;
}

export interface IArticleStatistics {
    article: IArticle;
    statistics: IStatistics[];
}