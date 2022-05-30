import { event, Subscribe } from "@lbfalvy/mini-events";
import { spawnNotification } from "../helpers/notification";

// Generic headers
export const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Access-Control-Allow-Origin": "*"
};

let baseUri = ''

export function setBaseUri(uri: string) {
  baseUri = uri
}

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
  token?: string
  headers?: RequestInit['headers']
  params?: Record<string, string>
  body?: unknown
  silent?: boolean
  silent404?: boolean
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
    if (details.token) Object.assign(init.headers, { 'Authorization': `Bearer ${details.token}` })
  }
  const res = await fetch(`${baseUri}${url}`, init)
  if (res.ok) {
    if (res.status == 204) return (undefined as unknown as T)
    return res.json();
  } else {
    if (details?.silent404 && res.status == 404) return (undefined as unknown as T);
    const errText = `${init.method} ${res.status} ${res.statusText}`;
    if (!details?.silent) spawnNotification({ type: "error", text: errText, timeout: 3000 })
    console.log(res);
    throw new HttpError(res.status, res.statusText, errText)
  }
}

interface Socket {
  send(m: string): void
  message: Subscribe<[string]>
  closed: Subscribe<[]>
  close(): void
}

export const socket = async (url: string, params: Record<string, string>): Promise<Socket> => {
  console.log('URL params for socket', params)
  if (params) url += `?${new URLSearchParams(params).toString()}`
  const base = baseUri || location.origin
  if (!base.startsWith('http')) throw new Error(`Cannot derive websocket URL from base "${base}"`)
  const origin = 'ws' + base.slice('http'.length)
  const absoluteUrl = `${origin}${url}`
  console.log('Connecting to socket via', absoluteUrl)
  const ws = new WebSocket(absoluteUrl)
  console.log('WS:', ws)
  await new Promise(r => ws.addEventListener('open', r))
  const [recv, message] = event<[string]>()
  const [close, closed] = event<[]>()
  ws.addEventListener('message', ev => recv(ev.data))
  ws.addEventListener('close', () => close())
  return {
    send: s => ws.send(s),
    message,
    closed,
    close: () => ws.close()
  }
}
