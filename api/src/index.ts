import { greet } from "./common/greet";
import fastify from 'fastify';
import { Message } from "./common/message";
import { pipe } from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/Either";

console.log(greet('World'));

// Ad-hoc database
const msgs = new Array<Message>()

const app = fastify({
    logger: true
})

// Reply using return value
app.post('/send', async (req, res) => {
    return pipe( // Allows to write nested functions in order of execution
        Message.decode(req.body),
        fold( // Takes handlers for two sides, calls whichever
            errs => `Errors: ${
                errs
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
app.get('/messages', (req, res) => {
    res.send(msgs)
})

app.listen(80, '0.0.0.0')