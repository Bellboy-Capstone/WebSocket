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

//websocket server
server.listen(webSocketsServerPort, function () {
  console.log(
    new Date() + " Server is listening on port " + webSocketsServerPort
  );
});

//websocket server request
var bellboy = new webSocketServer({
  httpServer: server,
});

//gets called everytime a connection occurs with WebSocket
bellboy.on("request", function (request) {
  console.log(new Date() + " Connection from origin " + request.origin + ".");
  var connection = request.accept('echo-protocol', request.origin);
  var client_name = true;
  console.log(" Connection accepted.");

  connection.on("message", function (message) {
    if (message.type === 'utf8') {
        console.log('Received Message: ' + message.utf8Data);
        connection.sendUTF(message.utf8Data);
    }
    else if (message.type === 'binary') {
        console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        connection.sendBytes(message.binaryData);
    }
})
    const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
    });

    readline.question("Hello, who is this?", (message) => {
          // log and broadcast the message
          console.log(
            new Date() +
              " Hello !" +
              message.utf8Data +
              ",you are connected to BellBoy deivce"
          );
        });

    connection.on("close", function (connection) {
      if (client_name !== true) {
        console.log(" Peer " + connection.remoteAddress + " disconnected.");
        // remove client from the list of connected clients
    
      }
    });
  });

