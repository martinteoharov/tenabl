import { IUserProfile, IUserProfileEdit } from "../../../interfaces/user";
import { request } from "../fetch";

export const getUserProfile = async (token: string): Promise<IUserProfile | undefined> => {
    const userProfile: IUserProfile = await request('GET', "/api/user/profile", { token, silent404: true });
    if (userProfile) {
        return userProfile;
    }
    return undefined;
}

export const saveUserProfile = async (body: IUserProfileEdit): Promise<IUserProfile | undefined> => {
    const userProfile: IUserProfile = await request('POST', "/api/user/profile/edit", { body });
    if (userProfile) {
        return userProfile;
    }
    return undefined;
}
