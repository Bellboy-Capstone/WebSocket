var app = require("express")();
var http = require("http").createServer(app);
var ws = require("ws");

wss = new ws.Server({ noServer: true });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

var server = http.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:%s", process.env.PORT || 3000);
});

server.on("upgrade", function (request, socket, head) {
  wss.handleUpgrade(request, socket, head, (socket) => {
    wss.emit("connection", socket, request);
  });
});

// Whenever a new client connects, this function is called.
wss.on("connection", function (connection) {
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
    var string = data;
    console.log(data);

    // Get incoming message data.

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
      wss.clients.forEach(function (c) {
        // Check if connection is a website.
        if (c.website === true) {
          c.send(string);
        }
      });
    }
  });
});
