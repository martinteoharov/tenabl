import { EntityManager } from "typeorm";
import ReviewSchema from "../common/schemas/review";
import { PublicationModel } from "../db/entities/PublicationModel";
import { ReviewModel } from "../db/entities/ReviewModel";
import { UserModel } from "../db/entities/UserModel";

export interface ReviewService {
    create(user: UserModel, publication: PublicationModel, body: ReviewSchema['flags']): Promise<void>
}

export function reviewService(entities: EntityManager): ReviewService {
    return {
        async create(user, publication, body) {
            const review = new ReviewModel();

            review.user = user;
            review.publication = publication;
            review.body = JSON.stringify(body); // TODO parse body to verify format before saving to DB

            // Get rid of old reviews for the same publication
            await entities.delete(ReviewModel, { user: user, publication: publication });
            await entities.save(review);
        }
    }
}
