const {createProxyMiddleware } = require('http-proxy-middleware')
 
module.exports = function(app) {
 app.use(createProxyMiddleware('/petHospital', { 
     target: 'http://47.120.14.174:80',
     pathRewrite: {
       '^/petHospital': '',
     },
     changeOrigin: true,
     secure: false
   }));
   app.use(createProxyMiddleware('/client', {
       target: 'http://47.120.14.174:80',
       pathRewrite: {
         '^/client': '',
       },
       changeOrigin: true,
       secure: false
   }));
}