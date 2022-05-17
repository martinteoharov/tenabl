import { spawnNotification } from "../helpers/notification";

// Generic headers
export const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Access-Control-Allow-Origin": "*"
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

interface RequestDetails {
  headers?: RequestInit['headers']
  params?: Record<string, string>
  body?: unknown
  silent?: boolean
}

export async function request<T>(method: 'GET'|'POST', url: string, details?: RequestDetails): Promise<T> {
  const init: RequestInit = {
    method,
    headers: defaultHeaders
  }
  if (details) {
    if (details.params) url += `?${new URLSearchParams(details.params).toString()}`
    if (details.headers) Object.assign(init.headers, details.headers)
    if (details.body) init.body = JSON.stringify(details.body)
  }
  const res = await fetch(url, init)
  if (res.ok) {
    if (res.status == 204) return (undefined as unknown as T)
    return res.json();
  } else {
    const errText = `${init.method} ${res.status} ${res.statusText}`;
    if (!details?.silent) spawnNotification({ type: "error", text: errText, timeout: 3000 })
    console.log(res);
    throw new HttpError(res.status, res.statusText, errText)
  }
}
