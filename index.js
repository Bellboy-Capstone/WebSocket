const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const server = http.createServer(express);
const wss = new WebSocket.Server({ server:server });


wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        const message_str = message.toString();
        wss.clients.forEach(function each(client){
            if(client !=ws && message.startswith('system')){
                console.log(`System is connected`);
                client.send(message);
            }
            else if(client !=ws && message.startswith('services')){
                console.log('Services is connected');
                client.send(message);
            }
        })
   

  })

server.listen(port, function() {
    console.log(`Server is listening on ${port}!`)
  })
});
