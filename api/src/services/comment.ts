import { Connection } from "typeorm";
import { CommentModel } from "../db/entities/CommentModel";
import { PublicationModel } from "../db/entities/PublicationModel";
import { UserModel } from "../db/entities/UserModel";

export const create = async(connection: Connection, user: UserModel, publication: PublicationModel, body: string) => {

    const comment = new CommentModel();
    comment.user = user;
    comment.publication = publication;
    comment.body = body; // TODO filter out naughty words

    // Get rid of old comment for the same publication
    await connection.manager.delete(CommentModel, { user: user, publication: publication });
    await connection.manager.save(comment);

    return true
}
