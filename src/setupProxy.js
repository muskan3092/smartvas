const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://6ef623b7779c.ngrok-free.app',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': '',
      },
      onProxyReq: (proxyReq, req, res) => {
        // Add necessary headers to bypass CORS
        proxyReq.setHeader('ngrok-skip-browser-warning', 'true');
        proxyReq.setHeader('Origin', 'https://6ef623b7779c.ngrok-free.app');
      },
    })
  );
};