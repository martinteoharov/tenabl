import { fetchPost } from "../fetch";

const OAuthGithubEndpoint = "https://github.com/login/oauth/authorize";
const redirect_uri = "https://www.tenabl.net";
const OAuthGithubTenablEndpoint = "http://localhost/api/oauth/github"
// const OAuthGithubTenablEndpoint = "https://tenabl.net/api/oauth/github"

interface OAuthGithubRequest {
    client_id: string;
    redirect_uri: string;
    scope: string;
}

interface Props {
    clientId: string;
}

export const loginGithubOAuth = async (data: Props) => {
    const req: OAuthGithubRequest = {
        client_id: data.clientId.toString(),
        redirect_uri: redirect_uri.toString(),
        scope: "read:user user:email"
    }

    const url = OAuthGithubEndpoint + "?" + new URLSearchParams({ ...req }).toString();

    window.open(url);
}


export const redirectGithubOAuth = async (code: string) => {
    const token = await fetchPost(OAuthGithubTenablEndpoint, { idToken: code });
    return token;
}