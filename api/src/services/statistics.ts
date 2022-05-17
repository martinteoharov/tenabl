import { PublicationModel } from "../db/entities/PublicationModel";
import { IJudgement, IStatistics } from '../common/interfaces/statistics'
import { ReviewService } from "./review";

export interface StatisticsService {
    judge(publication: PublicationModel): Promise<IJudgement>
    anal(publication?: PublicationModel): Promise<IStatistics[]>
}

export function statisticsService(
    reviews: ReviewService
): StatisticsService {
    const service: StatisticsService = {
        async anal(publication) {
            const revs = await reviews.getAll(publication)
            const trues = revs.filter(r => r.credibility = 'trustworthy').length
            const falses = revs.filter(r => r.credibility = 'false').length
            const goods = revs.filter(r => r.quality == 'concise').length
            const bads = revs.filter(r => r.quality == 'vague').length
            const outdated = revs.filter(r => r.outdated).length
            const total = revs.length
            return [
                {
                    name: 'credibility',
                    positive: trues,
                    negative: falses
                },
                {
                    name: 'quality',
                    positive: goods,
                    negative: bads
                },
                {
                    name: 'outdated',
                    positive: outdated,
                    negative: total - outdated
                }
            ]
        },
        async judge(publication) {
            const revs = await reviews.getAll(publication)
            const trues = revs.filter(r => r.credibility = 'trustworthy').length
            const falses = revs.filter(r => r.credibility = 'false').length
            const total = revs.length
            if (falses * 2 < trues) return {
                conclusion: 'true',
                confidence: (trues - falses) / total
            }
            if (trues * 2 < falses) return {
                conclusion: 'false',
                confidence: (falses - trues) / total
            }
            return {
                conclusion: 'divisive',
                confidence: (falses + trues) / total
            }
        }
    }
    return service
}
