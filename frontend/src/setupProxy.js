const { createProxyMiddleware} = require('http-proxy-middleware')

module.exports = function (app) {
    app.use('/api', createProxyMiddleware({
        target: 'http://api',
        changeOrigin: true,
        secure: false,
        prependPath: false,
        pathRewrite: {
            "^/api": ""
        }
    }))
}