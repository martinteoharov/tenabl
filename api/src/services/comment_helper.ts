import { Connection } from "typeorm";
import { CommentModel } from "../db/entities/CommentModel";
import { PublicationModel } from "../db/entities/PublicationModel";
import { UserModel } from "../db/entities/UserModel";

export const create_comment = async(connection: Connection, user: UserModel, publication: PublicationModel, user_comment: string) => {
    const comment = new CommentModel();
    comment.user = user;
    comment.publication = publication;
    // TODO filter out naughty words
    comment.comment = user_comment;

    // Get rid of old comment for the same publication
    await connection.manager.delete(CommentModel, { user: user, publication: publication });
    await connection.manager.save(comment);
    return true
}
