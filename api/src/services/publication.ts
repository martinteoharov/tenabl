import { EntityManager } from 'typeorm';
import { IArticle } from '../common/interfaces/article';
import { PublicationModel } from "../db/entities/PublicationModel";

export class PublicationError extends Error {}

export interface PublicationService {
    // The function returns the existing publication or creates a new one (and then returns it)
    get(article: IArticle): Promise<PublicationModel>
    find(url: string): Promise<PublicationModel|undefined>
}

export function publicationService(entities: EntityManager): PublicationService {
    const service: PublicationService = {
        async get(art) {
            let publication = await service.find(art.url);
            // If publication does not exist, create it
            if (publication === undefined) {
                const url = new URL(art.url)
                if (!['http:', 'https:'].includes(url.protocol)) {
                    throw new PublicationError('Invalid protocol in publication URL')
                }
                publication = new PublicationModel();
                publication.publisher = url.hostname;
                publication.url = art.url;
                publication.title = art.name;
                publication.description = art.description;
                await entities.save(publication);
            }
            return publication;
        },
        async find(urlString) {
            return await entities.findOne(PublicationModel, { url: urlString });
        }
    }
    return service
}
