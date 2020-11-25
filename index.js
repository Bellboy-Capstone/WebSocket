var http = require("http");
var fs = require("fs");
var WebSocket = require("ws");
var webSocketServer = require("websocket").server;
var webSocketsServerPort = process.env.PORT || 3000;

//http server
var server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url)
    var homePageHTML = fs.readFileSync("./index.html");
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(homePageHTML);
    response.end();
});

//websocket server request
var bellboy = new webSocketServer({
  httpServer: server,
});

//when bellboy is connected
bellboy.on('connection',function connection(ws){
  // send message to all clients
    ws.on("message", function incoming(message) {
      bellboy.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN ) {
            client.send(message);
          }
        });
      })
    // close connection
    ws.on("close", function (connection) {
        console.log(" Peer " + connection.remoteAddress + " disconnected.");
 
    })

  });

//websocket server
server.listen(webSocketsServerPort, function () {
  console.log(
    new Date() + " Server is listening on port " + webSocketsServerPort
  );
});
