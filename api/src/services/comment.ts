import { EntityManager } from "typeorm";
import { CommentModel } from "../db/entities/CommentModel";
import { PublicationModel } from "../db/entities/PublicationModel";
import { UserModel } from "../db/entities/UserModel";

export interface CommentService {
    create(user: UserModel, publication: PublicationModel, body: string): Promise<void>
}

export function commentService(entities: EntityManager): CommentService {
    return {
        async create(user, publication, body) {
    
            const comment = new CommentModel();
            comment.user = user;
            comment.publication = publication;
            comment.body = body; // TODO filter out naughty words
        
            // Get rid of old comment for the same publication
            await entities.delete(CommentModel, { user: user, publication: publication });
            await entities.save(comment);
        }
    }
}
