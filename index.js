var http = require("http");
var fs = require("fs");
var WebSocket = require("ws");
var webSocketServer = require("websocket").server;
var webSocketsServerPort = process.env.PORT || 3000;

var clients = []; //list of connected clients

//helps wtih input strings
function htmlEntities(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

//http server
var server = http.createServer(function (request, response) {
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
var wsServer = new webSocketServer({
  httpServer: server,
});

//gets called everytime a connection occurs with WebSocket
wsServer.on("request", function (request) {
  console.log(new Date() + " Connection from origin " + request.origin + ".");
  var connection = request.accept(null, request.origin);
  var index = clients.push(connection) - 1;
  var client_name = true;
  console.log(" Connection accepted.");

  connection.on("message", function (message) {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question("Hello, who is this?", (message) => {
      if (message.type === "utf8") {
        if (client_name === true) {
          client_name = htmlEntities(message.utf8Data);
        } else {
          // log and broadcast the message
          console.log(
            new Date() +
              " Hello !" +
              message.utf8Data +
              ",you are connected to BellBoy deivce"
          );
        }
      }
    });

    connection.on("close", function (connection) {
      if (client_name !== true) {
        console.log(" Peer " + connection.remoteAddress + " disconnected.");
        // remove client from the list of connected clients
        clients.splice(index, 1);
      }
    });
  });
});
