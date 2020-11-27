var http = require("http");
var fs = require("fs");
var WebSocket = require("ws");
var WebSocketServer = require("websocket").server;

// Getting the port from the environment is required to deploy on Heroku.
var webSocketsServerPort = process.env.PORT || 3000;

// HTTP Server: Sends the index file (demo page) to http clients.
var server = http.createServer(function (request, response) {
  var homePageHTML = fs.readFileSync("./index.html");
  response.writeHead(200, { "Content-Type": "text/html" });
  response.write(homePageHTML);
  response.end();
});

// Make the web server listen on port <webSocketsServerPort>
server.listen(webSocketsServerPort, function () {
  console.log(
    new Date() + " Server is listening on port " + webSocketsServerPort
  );
});

// Create a new WebSocketServer on the same port as the HTTP server.
var wsServer = new WebSocketServer({
  httpServer: server,
});

// Whenever a new client connects, this function is called.
wsServer.on("request", function (request) {
  var connection = request.accept(null, request.origin);
  console.log(new Date() + " Connection from origin " + request.origin + ".");

  // Adds an additional variable to the connection object, website:bool
  connection.website = false;
  connection.registered = false;

  /**
   * Called when a new connection is made.
   */
  connection.on("open", function (data) {
    connection.send("Please register by replying BELLBOY or WEBSITE.");
  });

  /**
   * Called when the the client sends a message to the server.
   */
  connection.on("message", function (data) {
    console.log(
      "Got Message: %s from a %s",
      data,
      connection.website ? "Website" : "Bellboy"
    );
    var string = data.utf8Data.toString();

    // This part of the statement runs if the device is unregistered.
    if (connection.registered === false) {
      console.log("An unregistered device connected, and needs to register...");
      // Set up as a bellboy or website:
      if (string.toUpperCase().startsWith("BELLBOY")) {
        console.log("A BELLBOY client registered.");
        connection.registered = true;
      } else if (string.toUpperCase().startsWith("WEBSITE")) {
        console.log("A WEBSITE client registered.");
        connection.registered = true;
        connection.website = true; // Indicate that this is a website.
      } else {
        // If neither BELLBOY or WEBSITE is specified, send an error message back.
        console.log("Incorrect first message, waiting for correct input.");
        connection.send("Failed to register, please send BELLBOY or WEBSITE.");
      }
    } else {
      // Forward messages to all websites if the message is from a bellboy.
      if (!connection.website) {
        wsServer.connections.forEach(function (c) {
          // Check if connection is a website.
          if (c.website === true) {
            c.send(string);
          }
        });
      }
    }
  });
});
