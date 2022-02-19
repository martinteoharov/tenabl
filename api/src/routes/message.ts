import { FastifyPluginCallback } from "fastify"
import { fold } from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/function"
import { Message } from "../common/message"
import { MessageService } from "../services/messageService"

export const getMessageRoutes = (
    svc: MessageService
): FastifyPluginCallback => (fastify, opts, done) => {
    // Reply using return value
    fastify.post('/messages', req => pipe(
        // Pipe allows to write nested functions in order of execution
        Message.decode(req.body),
        fold( // Selects a handler according to the value of the Either
            async errs => `Errors: ${
                errs
                .map(error => error.message)
                .filter((x): x is string => x !== undefined)
                .map(message => ` - ${message}\n`)
            }`,
            async m => {
                await svc.postMesage(m)
                return 'Received'
            }
        )
    ))

    // Reply using callback
    fastify.get('/messages', (req, res) => {
        svc.getMessages().then(m => res.send(m))
    })

    done()
}
