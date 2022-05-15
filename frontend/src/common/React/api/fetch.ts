import { number } from "fp-ts";
import { spawnNotification } from "../helpers/notification";

// Generic headers
export const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
  "Accept": "application/json",
};

export class HttpError extends Error {
  constructor(
    public code: number,
    public reason: string,
    message?: string
  ) {
    super(message)
  }
}

function handleResponse(res: Response): any {
  if (res.ok) {
    if (res.status == 204) return undefined
    return res.json();
  } else {
    const errText = `${res.statusText} ${res.status}`;
    spawnNotification({ type: "error", text: errText, timeout: 3000 })
    console.log(res);
    throw new HttpError(res.status, res.statusText, errText)
  }
}

export const fetchPost = async (url: string, data?: any, headers: HeadersInit = defaultHeaders): Promise<any> => {
  const requestInit: RequestInit = {
    method: "POST",
    headers,
    body: data === undefined ? undefined : JSON.stringify(data)
  };
  return handleResponse(await fetch(url, requestInit));
};

export const fetchGet = async (url: string, headers: HeadersInit = defaultHeaders): Promise<any> => {
  const requestInit: RequestInit = {
    method: "GET",
    headers,
  };
  return handleResponse(await fetch(url, requestInit));
};

export const fetchGetAuth = async (token: string, url: string, headers: HeadersInit = defaultHeaders): Promise<any> => {
  const requestInit: RequestInit = {
    method: "GET",
    headers: {
      ...headers,
      "Authorization": `Bearer ${token}`,
    },
  };
  return handleResponse(await fetch(url, requestInit));
};

export const fetchPostAuth = async (token: string, url: string, data?: any, headers: HeadersInit = defaultHeaders): Promise<any> => {
  const requestInit = {
    method: "POST",
    headers: {
      ...headers,
      "Authorization": `Bearer ${token}`,
    },
    body: data === undefined ? undefined : JSON.stringify(data)
  };
  return handleResponse(await fetch(url, requestInit));
};
