import { Connection } from 'typeorm';
import { PublicationModel } from "../db/entities/PublicationModel";

export const verify_publication = async(connection: Connection, url: string) => {
    let publication = await connection.manager.findOne(PublicationModel, { url: url });
    if (publication !== undefined) { // If publication does not exist, create it
        return publication
    }

    publication = new PublicationModel();
    const publisher_name = /^[^/]*/.exec(url);
    if (publisher_name === null){
        return false
    }
    // If publication does not exist, create it
    publication.publisher = publisher_name[0];
    publication.url = url;

    await connection.manager.save(publication);
    return publication
}
