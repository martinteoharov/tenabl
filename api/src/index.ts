import fastify from 'fastify';

const app = fastify({
    logger: true
})

app.register(require('./routes'), {prefix: '/'});

app.listen(3000, (err, address) => {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
})