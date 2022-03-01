import fastify from "fastify";
import decorators from "./decorators";


const app = fastify({logger: true})
    .register(decorators)
    .register(require('./routes'), {prefix: '/'})
    .decorate('verifyJWTandLevel',  (request, reply, done) => {    
        done()
      })
      .decorate('verifyUserAndPassword', (request, reply, done) => {
        console.log(request, reply)
        done()
      })
      .register(require('fastify-auth'))
      .after(() => {
        fastify.route({
          method: 'POST',
          url: '/auth-multiple',
          preHandler: fastify.auth([
            fastify.verifyJWTandLevel,
            fastify.verifyUserAndPassword
          ]),
          handler: (req, reply) => {
            req.log.info('Auth route')
            reply.send({ hello: 'world' })
          }
        })
      })
    ;

app.listen(3000, (err, address) => {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
})