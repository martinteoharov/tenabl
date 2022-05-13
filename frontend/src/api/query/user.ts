import { fetchGetAuth } from "../fetch"
import { UserProfile } from "../../common/interfaces/user";

export const getUser = async (): Promise<UserProfile | undefined> => {
    const userProfile = await fetchGetAuth("/api/user/profile") as unknown as UserProfile;

    if (userProfile) {
        return userProfile;
    }

    return undefined;
}