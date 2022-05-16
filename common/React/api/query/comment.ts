import { ICommentPostRequest } from "../../../interfaces/requests/comment";
import { fetchGetAuth, fetchPostAuth } from "../fetch";

export const postComment = async (token: string, data: ICommentPostRequest): Promise<void> => {
    return await fetchPostAuth(token, '/api/comment/', data)
}

export const getComment = async (token: string, url: string): Promise<{ comment: string } | undefined> => {
    return await fetchGetAuth(token, '/api/comment/')
}
