import { EntityManager } from "typeorm";
import { IFlags } from "../common/interfaces/review";
import { PublicationService } from "../services/publication";
import { ReviewService } from "../services/review";
import { UserService } from "../services/user";

export async function dummyData(
    pubs: PublicationService,
    users: UserService,
    revs: ReviewService,
    ent: EntityManager,
    isDemo: boolean
) {
    if (!isDemo) return;
    const pub = await pubs.get({
        name: "Example article",
        description: "example description...",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    })
    const data: IFlags[] = [
        { credibility: 'trustworthy', quality: 'vague', },
        { credibility: 'false', quality: 'vague', },
        { quality: 'vague', },
        { credibility: 'trustworthy', quality: 'concise', },
        { credibility: 'false', },
        { credibility: 'false', quality: 'vague', outdated: true },
        { outdated: true },
        { credibility: 'trustworthy', quality: 'concise' },
        { credibility: 'trustworthy', quality: 'vague', outdated: true },
    ]
    await Promise.all(data.map(async (row, i) => {
        const usr = await users.find(`john.doe${i}@example.com`) ?? await users.create({
            email: `john.doe${i}@example.com`,
            firstName: "John",
            lastName: "Doe",
            username: 'jdoe'
        })
        await revs.create(usr, pub, row)
    }))
}
