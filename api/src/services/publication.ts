import { Connection } from 'typeorm';
import { PublicationModel } from "../db/entities/PublicationModel";

export const verify = async(connection: Connection, url: string) => {
    let publication = await connection.manager.findOne(PublicationModel, { url: url });

    if (publication) {
        throw new Error("Publication exists?")
    }

    publication = new PublicationModel();
    const publisherName = /^[^/]*/.exec(url);
    if (publisherName === null){
        return false
    }

    // If publication does not exist, create it
    publication.publisher = publisherName[0];
    publication.url = url;

    await connection.manager.save(publication);

    return publication;
}
