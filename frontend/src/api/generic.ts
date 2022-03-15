// Generic headers
export const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
};

// add more as we go
export type Method = "POST" | "GET";

/*
 * A generic POST function
 *
 *    url: the target URL of the request
 *    data: the data you want to transmit
 *    headers: the headers for the request, default headers have been provided so you don't need to pass any
 */
export const genericFetch = async (url: string, data: any, method: Method, headers: HeadersInit = defaultHeaders): Promise<Response> => {
  const requestInit: RequestInit = {
    method,
    headers,
    body: method === "POST" ? JSON.stringify(data) : null,
  };

  const res = await fetch(url, requestInit);

  return res.json();
};

/*
 * A generic authenticated POST function
 *    url: the target URL of the request
 *    data: the data you want to transmit
 *    headers: the headers for the request, default headers have been provided so you don't need to pass any
 */
export const genericAuthFetch = async (url: string, data: any): Promise<Response> => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};
