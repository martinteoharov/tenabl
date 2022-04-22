import { Connection } from "typeorm";
import { PublicationModel } from "../db/entities/PublicationModel";
import { ReviewModel } from "../db/entities/ReviewModel";
import { UserModel } from "../db/entities/UserModel";

export const create = async(connection: Connection, user: UserModel, publication: PublicationModel, body: string) => {
    const review = new ReviewModel();

    review.user = user;
    review.publication = publication;
    review.body = JSON.parse(body); // TODO parse request.review to verify format before saving to DB

    // Get rid of old reviews for the same publication
    await connection.manager.delete(ReviewModel, { user: user, publication: publication });
    await connection.manager.save(review);

    return true
}
