# Signaling Server Client

[![](https://img.shields.io/travis/woodstage/signaling-server-client.svg?style=flat-square)](https://travis-ci.org/woodstage/signaling-server-client)
[![npm version](http://img.shields.io/npm/dm/signaling-server-client.svg?style=flat-square)](https://www.npmjs.com/signaling-server-client)

Client for [Signaling Server](https://github.com/woodstage/signaling-server)

## Installation
`
npm install signaling-server-client
`

## Usage
```javascript
var SignalingServerClient = require("signaling-server-client");


var client = new SignalingServerClient();
var users = null;

// register events from signaling server
client.on("users", function(connectedUsers) {
  // got all users which are connected to signaling server
  users = connectedUsers
});

client.on("user_online", function(onlineUser) {
  // got user online notification

});

client.on("user_offline", function(offlineUser) {
  // got user offline notification
  
});

client.on("message", function(message) {
  // got user offline notification
  // reply sender
  return { reply: "I got your message" + JSON.stringify(message) };
});

// connect to signaling server
client.connect(SIGNALING_SERVER_URL).then(function(connectedUsers) {
  // send message to other user
  client.send(users[0], {message: "Hello World!"}).then(function(reply) {
    // got reply from other user
  });
});
```
