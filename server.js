const WebSocketServer = require('ws').Server,
  express = require('express'),
  http = require('http'),
  app = express(),
  fs = require('fs');


  app.use(express.static('public'));
  sslSrv = http.createServer(app).listen(process.env.PORT||443);
  console.log("The HTTPS server is up and running");