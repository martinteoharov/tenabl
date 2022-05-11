import bcrypt from 'bcrypt';
import { Connection } from "typeorm";
import { PasswordModel } from "../db/entities/PasswordModel";
import { UserModel } from "../db/entities/UserModel";

export const checkPassword = (password: string) => {
    // Pass requirements: Minimum eight chars, one uppercase, one lowercase, one number and one special character
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    return passwordRegex.test(password);
}

export const create = async(connection: Connection, user: UserModel, password: string) => {
    const valid = checkPassword(password);

    // Create password hash
    const salt = await bcrypt.genSalt(6);
    const hash = await bcrypt.hash(password, salt);

    const pass = new PasswordModel() // Create password instance
    pass.user = user.id;
    pass.hash = hash;

    // Save password table entry
    await connection.manager.save(pass);
    return true;
}

export const verify = async(connection: Connection, user: UserModel, password: string) => {
    const hash = await connection.manager.findOne(PasswordModel, { user: user.id }); // Fetch user password hash
    console.log(hash)

    if (!hash) {
        return false; // User has no password, probably logged in with OAuth
    }
    
    if (!await bcrypt.compare(password, hash.hash)) { // Check password
        return false;
    }

    return true;
}
