var io = require("socket.io-client");
var uuidv4 = require('uuid/v4');

function SignalingServerClient() {
  this.users = Object.create(null);
  this._callbacks = { type: [calbacks] };
}

SignalingServerClient.prototype.connect = function(url) {
  this._socket = io(url);
  return new Promise((resolv, reject) => {
    this._socket.once("_users", message => {
      this.users = message;
      resolve(this.users);
    });
  });
};

SignalingServerClient.prototype.send = function(to, message) {
  const socketId = this.users[to].socketId;
  const id = uuidv4();
  return new Promise((resolve, reject) => {
    this._socket.once("_message_callback_" + id, resp => {
      resolve(resp);
    });
    this._socket.emit("_message", { to, data: message });
  });
};

SignalingServerClient.prototype.on = function(event, callback) {
  if(event === "message") {
    this._socket.on("_message", callback);
  }
};

module.exports = SignalingServerClient;
