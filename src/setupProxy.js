const {createProxyMiddleware } = require('http-proxy-middleware')
 
module.exports = function(app) {
 app.use(createProxyMiddleware('/petHospital', { 
     target: 'http://172.30.227.51:8080',
     pathRewrite: {
       '^/petHospital': '',
     },
     changeOrigin: true,
     secure: false
   }));
   app.use(createProxyMiddleware('/client', {
       target: 'http://172.30.227.51:8080',
       pathRewrite: {
         '^/client': '',
       },
       changeOrigin: true,
       secure: false
   }));
}