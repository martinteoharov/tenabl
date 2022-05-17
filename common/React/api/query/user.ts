import { fetchGetAuth, fetchPostAuth } from "../fetch"
import { IUserProfile, IUserProfileEdit } from "../../../interfaces/user";

export const getUserProfile = async (token: string): Promise<IUserProfile | undefined> => {
    const userProfile = await fetchGetAuth(token, "/api/user/profile") as unknown as IUserProfile;

    if (userProfile) {
        return userProfile;
    }

    return undefined;
}

export const saveUserProfile = async (profile: IUserProfileEdit): Promise<IUserProfile | undefined> => {
    // TODO valdiate profile...

    const userProfile = await fetchPostAuth("/api/user/profile/edit", profile) as unknown as IUserProfile;
    if (userProfile) {
        return userProfile;
    }

    return undefined;
}