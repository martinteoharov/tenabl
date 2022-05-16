import { spawnNotification } from "../helpers/notification";
import { rtr } from "../services/authService";

// Generic headers
export const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};

export const fetchPost = async <Type>(url: string, data: Type, headers: HeadersInit = defaultHeaders): Promise<Response | undefined> => {
  const requestInit: RequestInit = {
    method: "POST",
    headers,
    body: JSON.stringify(data)
  };

  const res = await fetch(url, requestInit);
  const body = await res.json();

  if (res.ok) {
    return body;
  } else {
    const errText = `${requestInit.method} ${res.status} ${body.status}`;
    spawnNotification({ type: "error", text: errText, timeout: 3000 })
    console.log(res);

    return undefined;
  }

};

interface fetchGet {
  url: string;
  params?: any;
  headers?: HeadersInit;
}

export const fetchGet = async ({ url, params, headers = defaultHeaders }: fetchGet): Promise<Response | undefined> => {
  const requestInit: RequestInit = {
    method: "GET",
    headers,
  };

  url += new URLSearchParams(params).toString();

  const res = await fetch(url, requestInit);
  const body = await res.json();

  if (res.ok) {
    return body;
  } else {
    const errText = `${requestInit.method} ${res.status} ${body.error}`;
    spawnNotification({ type: "error", text: errText, timeout: 3000 })
    console.log(res);

    return undefined;
  }
};

export const fetchPostAuth = async (url: string, data: any, headers: HeadersInit = defaultHeaders): Promise<Response | undefined> => {
  const token = rtr.session.get()?.get();

  const requestInit: RequestInit = {
    method: "POST",
    headers: {
      ...headers,
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data)
  };

  const res = await fetch(url, requestInit);
  const body = await res.json();

  console.log(res);
  console.log(body);
  if (res.ok) {
    spawnNotification({ type: "success", text: body.ok })
    return body;
  } else {
    const errText = `${requestInit.method} ${res.status} ${body.error}`;
    spawnNotification({ type: "error", text: errText, timeout: 3000 })
    console.log(res);
    return undefined;
  }
};

export const fetchGetAuth = async (url: string, headers: HeadersInit = defaultHeaders): Promise<Response | undefined> => {
  const token = rtr.session.get()?.get();

  const requestInit: RequestInit = {
    method: "GET",
    headers: {
      ...headers,
      "Authorization": `Bearer ${token}`,
    },
  };

  const res = await fetch(url, requestInit);
  const body = await res.json();

  if (res.ok) {
    return body;
  } else {
    const errText = `${requestInit.method} ${res.status} ${body.error}`;
    spawnNotification({ type: "error", text: errText, timeout: 3000 })
    console.log(res);
    return undefined;
  }
};