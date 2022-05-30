import { EntityManager } from "typeorm";
import { CommentModel } from "../db/entities/CommentModel";
import { PublicationModel } from "../db/entities/PublicationModel";
import { UserModel } from "../db/entities/UserModel";

export interface CommentService {
    create(user: UserModel, publication: PublicationModel, body: string): Promise<void>
    get(user: UserModel, publication: PublicationModel): Promise<string|undefined>
    fetch(publication: PublicationModel, offset: number, limit: number): Promise<CommentModel[]>
}

export function commentService(entities: EntityManager): CommentService {
    return {
        async create(user, publication, body) {
            const comment = new CommentModel();
            comment.user = user;
            comment.publication = publication;
            comment.body = body; // TODO filter out naughty words
            // Get rid of old comment for the same publication
            await entities.delete(CommentModel, { user, publication });
            await entities.save(comment);
        },
        async get(user, publication) {
            const comment = await entities.findOne(CommentModel, { where: { user, publication }})
            return comment?.body
        },
        async fetch(publication, offset, limit) {
            return await entities.find(CommentModel, {
                where: { publication },
                skip: offset,
                take: limit,
                relations: ['user']
            })
        }
    }
}
