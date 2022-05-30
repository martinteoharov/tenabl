import { FastifyPluginCallback, RawReplyDefaultExpression, RawRequestDefaultExpression } from "fastify";
import { DefaultRoute } from "fastify/types/route";
import { IncomingMessage } from "http";
import ws from "ws";

export const pubsubService = (): FastifyPluginCallback => (fastify, opts, done) => {
    const wsConns = new Set<IncomingMessage>()
    fastify.server.on('clientError', (err, socket) => {
        console.log('CLIENT ERROR', err.name, err.message, err.cause)
    })
    fastify.addHook('onError', (req, rep, err, done) => {
        console.log('ONERROR', req.url)
        if (wsConns.has(req.raw)) {
            rep.hijack()
        }
    })
    fastify.server.on('upgrade', (req, sock) => {
        console.log('Upgrade fired!')
        wsConns.add(req)
        sock.on('close', () => wsConns.delete(req))
    })
    fastify.server.on('connect', (req, sock, head) => {
        console.log('CONNECT')
    })
    fastify.server.on('connection', (sock) => {
        console.log("CONNECTION")
    })
    console.log(' ================ LOGS ALL SET ================ ')
    // This carnage is required purely because ts-ignore, getDefaultRoute and DefaultRoute
    // are all unpopular/undesired enough not to get properly designed and tested.
    let oldDef: DefaultRoute<RawRequestDefaultExpression, RawReplyDefaultExpression>
    /// @ts-ignore see https://github.com/fastify/fastify/issues/3919
    // eslint-disable-next-line prefer-const
    oldDef = fastify.getDefaultRoute()
    fastify.setDefaultRoute((req, rep) => wsConns.has(req) || oldDef(req, rep))
    const wss = new ws.Server({
        server: fastify.server,
    })
    const table = new Map<string, Set<ws.WebSocket>>()
    wss.on('connection', (conn, req) => {
        console.log('ws url:', req.url)
        const channel = req.url
        if (!channel) return conn.close(400, 'no channel specified')
        const set = table.get(channel) ?? new Set()
        if (!table.has(channel)) table.set(channel, set)
        set.add(conn)
        conn.on('message', msg => set.forEach(conn => conn.send(msg)))
        conn.on('close', () => set.delete(conn))
    })
    done()
}
