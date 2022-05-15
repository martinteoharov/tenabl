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

  if (res.ok) {
    return res.json();
  } else {
    const errText = `Error: ${res.statusText} ${res.status}`;
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

  if (res.ok) {
    return res.json();
  } else {
    const errText = `${res.statusText} ${res.status}`;
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

  if (res.ok) {
    return res.json();
  } else {
    const errText = `${res.statusText} ${res.status}`;
    spawnNotification({ type: "error", text: errText, timeout: 3000 })
    console.log(res);
    return undefined;
  }
};


// export const fetchPostAuth = async (url: string, data: any): Promise<Response> => {
//   const requestInit = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   };

//   const res = await fetch(url, requestInit);
//   return res.json();
// };
