import { EntityManager } from "typeorm";
import { IFlags } from '../common/interfaces/review'
import { PublicationModel } from "../db/entities/PublicationModel";
import { ReviewModel } from "../db/entities/ReviewModel";
import { UserModel } from "../db/entities/UserModel";

export interface ReviewService {
    create(user: UserModel, publication: PublicationModel, body: IFlags): Promise<void>
    get(user: UserModel, publication: PublicationModel): Promise<IFlags|undefined>
    getAll(publication?: PublicationModel): Promise<IFlags[]>
    empty: boolean
}

export async function reviewService(entities: EntityManager): Promise<ReviewService> {
    return {
        async create(user, publication, body) {
            const review = new ReviewModel();

            review.user = user;
            review.publication = publication;
            review.body = JSON.stringify(body); // TODO parse body to verify format before saving to DB

            // Get rid of old reviews for the same publication
            await entities.delete(ReviewModel, { user: user, publication: publication });
            await entities.save(review);
        },
        async get(user, publication) {
            const review = await entities.findOne(ReviewModel, { where: { user, publication }})
            return review && JSON.parse(review.body)
        },
        async getAll(publication) {
            const reviews = publication
                ? await entities.find(ReviewModel, { where: { publication }})
                : await entities.find(ReviewModel)
            return reviews.map(rev => JSON.parse(rev.body))
        },
        empty: await entities.count(ReviewModel) == 0
    }
}
