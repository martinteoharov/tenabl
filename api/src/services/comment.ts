import { Connection } from "typeorm";
import { CommentModel } from "../db/entities/CommentModel";
import { PublicationModel } from "../db/entities/PublicationModel";
import { UserModel } from "../db/entities/UserModel";

export interface CommentService {
    create(user: UserModel, publication: PublicationModel, body: string): Promise<true>
}

export function commentService(connection: Connection): CommentService {
    return {
        async create(user, publication, body) {
    
            const comment = new CommentModel();
            comment.user = user;
            comment.publication = publication;
            comment.body = body; // TODO filter out naughty words
        
            // Get rid of old comment for the same publication
            await connection.manager.delete(CommentModel, { user: user, publication: publication });
            await connection.manager.save(comment);
        
            return true
        }
    }
}
