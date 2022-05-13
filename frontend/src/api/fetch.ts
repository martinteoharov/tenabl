import { spawnNotification } from "../helpers/notification";
import { rtr } from "src/services/authService";

// Generic headers
export const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
};

export const fetchPost = async (url: string, data: any, headers: HeadersInit = defaultHeaders): Promise<Response | undefined> => {
  const requestInit: RequestInit = {
    method: "POST",
    headers,
    body: JSON.stringify(data)
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

export const fetchGet = async (url: string, headers: HeadersInit = defaultHeaders): Promise<Response | undefined> => {
  const requestInit: RequestInit = {
    method: "GET",
    headers,
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
