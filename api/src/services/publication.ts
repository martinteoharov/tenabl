import { EntityManager } from 'typeorm';
import { PublicationModel } from "../db/entities/PublicationModel";

export class PublicationError extends Error {}

export interface PublicationService {
    // The function returns the existing publication or creates a new one (and then returns it)
    get(url: string): Promise<PublicationModel>
    find(url: string): Promise<PublicationModel|undefined>
}

export function publicationService(entities: EntityManager): PublicationService {
    const service: PublicationService = {
        async get(urlString) {
            let publication = await service.find(urlString);
            // If publication does not exist, create it
            if (publication === undefined) {
                const url = new URL(urlString)
                if (!['http:', 'https:'].includes(url.protocol)) {
                    throw new PublicationError('Invalid protocol in publication URL')
                }
                publication = new PublicationModel();
                publication.publisher = url.hostname;
                publication.url = urlString;
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
