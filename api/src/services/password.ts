import bcrypt from 'bcrypt';
import { EntityManager } from "typeorm";
import { PasswordModel } from "../db/entities/PasswordModel";
import { UserModel } from "../db/entities/UserModel";

export function checkPassword(password: string): boolean {
    if (password.length < 8) return false // Minimum eight chars
    if (!/[A-Z]/.test(password)) return false // one uppercase
    if (!/[a-z]/.test(password)) return false // one lowercase
    if (!/[0-9]/.test(password)) return false // one digit
    if (!/[^a-zA-Z0-9]/.test(password)) return false // one special character (aka. none of the above)
    return true
}

export interface PasswordService {
    create(user: UserModel, password: string): Promise<void>
    change(user: UserModel, password: string): Promise<void>
    verify(user: UserModel, password: string): Promise<boolean>
}

async function hash(cleartext: string): Promise<string> {
    // Create password hash
    const salt = await bcrypt.genSalt(6);
    return await bcrypt.hash(cleartext, salt);
}

export function passwordService(entities: EntityManager): PasswordService {
    return {
        async create(user, password) {
            if (!checkPassword(password)) {
                throw new Error('Invalid password')
            }
            if (await entities.count(PasswordModel, { where: { user } }) > 0) {
                throw new Error('User already has a password')
            }
            const pass = new PasswordModel()
            pass.user = user.id;
            pass.hash = await hash(password);
            await entities.save(pass);
        },
        async change(user, password) {
            if (!checkPassword(password)) {
                throw new Error('Invalid password')
            }
            const pass = await entities.findOneOrFail(PasswordModel, { where: { user } })
            pass.hash = await hash(password)
            await entities.save(pass)
        },
        async verify(user, password) {
            const hash = await entities.findOneOrFail(PasswordModel, { user: user.id });
            return await bcrypt.compare(password, hash.hash) // Check password
        }
    }
}
