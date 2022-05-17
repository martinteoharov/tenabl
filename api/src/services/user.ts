import { EntityManager } from "typeorm";
import { IUserProfile } from "../common/interfaces/user";
import { UserModel } from "../db/entities/UserModel";

export interface UserService {
    create(details: IUserProfile): Promise<UserModel>
    find(email: string): Promise<UserModel | undefined>
    update(user: UserModel, details: IUserProfile): Promise<void>
    generateName(firstName: string, lastName: string): Promise<string>
}

export function userService(
    entities: EntityManager
): UserService {
    return {
        async create({ email, firstName, lastName, username }) {
            if (!email.includes('@')) {
                throw new Error('Invalid email address')
            }
            const user = new UserModel()
            user.first_name = firstName;
            user.last_name = lastName;
            user.username = username;
            user.email = email;
            await entities.save(user)
            return user
        },
        async find(email) {
            return await entities.findOne(UserModel, { where: { email } })
        },
        async update(user, details) {
            user.email = details.email ?? user.email
            user.username = details.username ?? user.username
            user.first_name = details.firstName ?? user.first_name
            user.last_name = details.lastName ?? user.last_name
            await entities.save(user)
        },
        async generateName(firstName, lastName) {
            const base = `${firstName}_${lastName}`.toLowerCase()
            let username: string
            do {
                username = `${base}${Math.floor((Math.random() * 100_000) + 1)}`
            } while (await entities.count(UserModel, { username }) > 0)
            // Bold to assume we will ever have a reasonable chance for this to clash, but
            // better safe than sorry
            return username;
        }
    }
}
