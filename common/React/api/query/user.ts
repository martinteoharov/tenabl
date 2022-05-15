import { fetchGetAuth } from "../fetch"
import { IUserProfile } from "../../../interfaces/user";

export const getUserProfile = async (): Promise<IUserProfile | undefined> => {
    const userProfile = await fetchGetAuth("/api/user/profile") as unknown as IUserProfile;

    if (userProfile) {
        return userProfile;
    }

    return undefined;
}
