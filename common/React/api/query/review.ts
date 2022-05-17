import { IReviewPostRequest } from "../../../interfaces/requests/review";
import { request } from "../fetch";

export const postReview = async (token: string, body: IReviewPostRequest): Promise<void> => {
    return await request('POST', '/api/review/', { token, body })
}

export const getReview = async (token: string, url: string): Promise< | undefined> => {
    return await request('GET', '/api/review/', { token, params: { url } })
}
