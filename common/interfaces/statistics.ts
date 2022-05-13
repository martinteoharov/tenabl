export interface ArticleStatistics {
    voteCount: number;
    trust: {
        positive: number;
        negative: number;
    };
    concise: {
        positive: number;
        negative: number;
    }
}