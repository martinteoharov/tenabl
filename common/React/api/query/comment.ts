import { map, Subscribe } from "@lbfalvy/mini-events";
import { ICommentGetResponse, ICommentListGetResponse, ICommentPostRequest } from "../../../interfaces/requests/comment";
import { request, socket } from "../fetch";

export const postComment = async (token: string, body: ICommentPostRequest): Promise<void> => {
    return await request('POST', '/api/comment/', { token, body })
}

export const getComment = async (token: string, url: string): Promise<string | undefined> => {
    const cmt: ICommentGetResponse = await request('GET', '/api/comment/', {
        token,
        params: { url },
        silent404: true
    })
    return cmt.comment
}

export const listComments = async (url: string, offset: number, limit: number): Promise<ICommentListGetResponse> => {
    return await request('GET', '/api/comment/list', {
        params: {
            url,
            offset: offset.toString(),
            limit: limit.toString()
        },
        silent404: true
    }) ?? []
}

export const signalComment = async (url: string): Promise<[() => void, Subscribe<[]>, () => void]> => {
    const soc = await socket('/api/comment/stream', { channel: url })
    return [
        () => soc.send(''),
        map(soc.message, () => []),
        () => soc.close()
    ]
}
