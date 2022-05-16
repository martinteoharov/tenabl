import { fetchPost } from "../fetch";

// import { spawnNotification } from "src/helpers/notification";
const OAuthGoogleEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
const redirect_uri = "https://tenabl.net";
const OAuthTenablEndpoint = "http://tenabl.net/api/oauth/google"

interface OAuthGoogleRequest {
    client_id: string;
    redirect_uri: string;
    response_type: "token" | "code";
    scope: string;
}

interface Props {
    clientId: string;
}

export const loginGoogleOAuth = async (data: Props) => {
    const req: OAuthGoogleRequest = {
        client_id: data.clientId.toString(),
        redirect_uri: redirect_uri.toString(),
        response_type: "token",
        scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
    }

    const url = OAuthGoogleEndpoint + "?" + new URLSearchParams({ ...req }).toString();

    console.log(url);

    window.open(url);
}


export const redirectGoogleOAuth = async (accessToken: string) => {
    const token = await fetchPost(OAuthTenablEndpoint, { idToken: accessToken });
    return token;
}