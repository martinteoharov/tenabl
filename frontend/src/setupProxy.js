 const { createProxyMiddleware} = require('http-proxy-middleware')

console.log('Stuff is actually happening')

module.exports = function (app) {
    app.use('/api', createProxyMiddleware('/api', {
        target: 'http://api',
        changeOrigin: true,
        secure: false,
        prependPath: false,
        pathRewrite: { "^/api": "" },
        logLevel: 'debug'
    }))
    const wsUrl = '/pubsub'
    app.use(wsUrl, createProxyMiddleware(wsUrl, {
        target: 'ws://api',
        changeOrigin: true,
        secure: false,
        prependPath: false,
        ws: true,
        pathRewrite: { [`^${wsUrl}`]: '' },
        logLevel: 'debug'
    }))
}