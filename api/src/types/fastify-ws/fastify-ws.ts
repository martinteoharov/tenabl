declare module "fastify-ws" {
    import { FastifyPluginCallback } from "fastify";
    import { ServerOptions } from "ws";

    type Falsey = null | false | undefined | 0 | [] | ''
    const cb: FastifyPluginCallback<{
        library?: 'ws' | 'wss' | Falsey
        path?: ServerOptions['path']
    }>
    export = cb
}
