const {createProxyMiddleware } = require('http-proxy-middleware')
 
module.exports = function(app) {
 app.use(createProxyMiddleware('/petHospital', { 
     target: 'https://47.120.14.174:443/petHospital',
     pathRewrite: {
       '^/petHospital': '',
     },
     changeOrigin: true,
     secure: false
   }));
   app.use(createProxyMiddleware('/client', {
       target: 'https://47.120.14.174:443/petHospital',
       pathRewrite: {
         '^/client': '',
       },
       changeOrigin: true,
       secure: false
   }));
}