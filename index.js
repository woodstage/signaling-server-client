var io = require("socket.io-client");
var uuidv4 = require("uuid/v4");

function SignalingServerClient() {
  this.users = Object.create(null);
}

SignalingServerClient.prototype.connect = url => {
  this._socket = io(url);
  this._socket.on("_users", message => {
    this.users = message;
  });
  return new Promise((resolve, reject) => {
    this._socket.once("_users", message => {
      this.users = message;
      resolve(this.users);
    });
  });
};

SignalingServerClient.prototype.send = (to, message) => {
  const socketId = this.users[to].socketId;
  const id = uuidv4();
  return new Promise((resolve, reject) => {
    this._socket.once("_message_ack_" + id, resp => {
      resolve(resp);
    });
    this._socket.emit("_message", { id, to, data: message });
  });
};

SignalingServerClient.prototype.on = (event, callback) => {
  if (event === "message") {
    this._socket.on("_message", message => {
      const resp = callback(message);
      this._socket.emit("_message_ack_" + message.id, resp);
    });
  }
  if (event === "users") {
    this._socket.on("_users", callback);
  }
};

module.exports = SignalingServerClient;
