import fastify from "fastify";

import { Message } from "./common/message";
import { pipe } from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/Either";

// Ad-hoc database
const msgs = new Array<Message>()
const router = fastify({
    logger: true
})

module.exports = (router: any, opts: any, done: any) => {

    // Reply using return value
    router.post('/send', async (req: any, res: any) => {
        return pipe( // Allows to write nested functions in order of execution
            Message.decode(req.body),
            fold( // Takes handlers for two sides, calls whichever
                errs => `Errors: ${errs
                    .map(error => error.message)
                    .filter((x): x is string => x !== undefined)
                    .map(message => ` - ${message}\n`)
                    }`,
                m => {
                    msgs.push(m)
                    return 'Received'
                }
            )
        )
    })


    // Reply using callback
    router.get('/messages', (req: any, res: any) => {
        res.send(msgs)
    })

}