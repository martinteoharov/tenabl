import { ICommentGetResponse, ICommentPostRequest } from "../../../interfaces/requests/comment";
import { request } from "../fetch";

export const postComment = async (token: string, body: ICommentPostRequest): Promise<void> => {
    return await request('POST', '/api/comment/', { token, body })
}

export const getComment = async (token: string, url: string): Promise<ICommentGetResponse | undefined> => {
    return await request('GET', '/api/comment/', { token, params: { url } })
}
