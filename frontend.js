$(function () {
    "use strict";

    // for better performance - to avoid searching in DOM
    var content = $('#content');
 


    // name sent to the server
    var client_name = false;

    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // open connection
    var connection = new WebSocket('ws://127.0.0.1:3000');

    client.on('connect', function(connection) {
      console.log('WebSocket Client Connected');
      connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });

    // incoming messages
    connection.onmessage = function (message) {
     
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }

        if (json.type === 'history') { // entire message history
            // insert every single message to the chat window
            for (var i=0; i < json.data.length; i++) {
                addText(json.data[i].text);
            }
        } else if (json.type === 'message') { // it's a single message
            input.removeAttr('disabled'); // let the user write another message
            addText(json.data[i].text);;
        } else {
            console.log('this is not proper JSON format ', json);
        }
    };

    //Send mesage when user presses Enter key
    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            // send the message as an ordinary text
            connection.send(msg);
            $(this).val('');
            // disable the input field to make the user wait until server
            // sends back response
            input.attr('disabled', 'disabled');

            // we know that the first message sent from a user their name
            if (client_name === false) {
                client_name = msg;
            }
        }
    });

    // send message
    function addText(message) {
        content.prepend( +
             + ': ' + message + '</p>');
        }
    });
});
