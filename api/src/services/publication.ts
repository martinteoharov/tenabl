import { EntityManager } from 'typeorm';
import { PublicationModel } from "../db/entities/PublicationModel";

export class PublicationError extends Error {}

export interface PublicationService {
    // The function returns the existing publication or creates a new one (and then returns it)
    get(url: string): Promise<PublicationModel>
}

export function publicationService(entities: EntityManager): PublicationService {
    return {
        async get(urlString: string) {
            let publication = await entities.findOne(PublicationModel, { url: urlString });
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
        }
    }
}
