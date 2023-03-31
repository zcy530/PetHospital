const {createProxyMiddleware } = require('http-proxy-middleware')
 
module.exports = function(app) {
 app.use(createProxyMiddleware('/petHospital', { 
     target: 'https://139.224.190.111:443',
     pathRewrite: {
       '^/petHospital': '',
     },
     changeOrigin: true,
     secure: false
   }));
   app.use(createProxyMiddleware('/client', {
       target: 'https://139.224.190.111:443',
       pathRewrite: {
         '^/client': '',
       },
       changeOrigin: true,
       secure: false
   }));
}