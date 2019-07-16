const WebSocketServer = require('ws').Server,
  express = require('express'),
  http = require('http'),
  app = express(),
  fs = require('fs');
  CLIENTS=[];

var wss = null, sslSrv = null;

  app.use(express.static('public'));


  app.use(function(req, res, next) {
  if(req.headers['x-forwarded-proto']==='http') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  next();
});

  sslSrv = http.createServer(app).listen(process.env.PORT||8080);
  console.log("The HTTPS server is up and running");

// create the WebSocket server
wss = new WebSocketServer({server: sslSrv});
console.log("WebSocket Secure server is up and running.");

  /** successful connection */
wss.on('connection', function (client) {
	CLIENTS.push(client);
  console.log("A new WebSocket client was connected.");
  /** incomming message */
  client.on('message', function (message) {
    /** broadcast message to all clients */
    wss.broadcast(message, client);
  });
});

wss.on('error',function(err){

	console.log(err)});


// broadcasting the message to all WebSocket clients.
wss.broadcast = function (data, exclude) {
  var i = 0, n = CLIENTS.length , client = null;
  if (n < 1) return;
  console.log("Broadcasting message to all " + n + " WebSocket clients.");
  for (; i < n; i++) {
    client = CLIENTS[i];
    // don't send the message to the sender...
    if (client === exclude) continue;
    if (client.readyState === client.OPEN) client.send(data);
    else console.error('Error: the client state is ' + client.readyState);
  }
};