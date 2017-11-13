"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _socket = require("socket.io-client");

var _socket2 = _interopRequireDefault(_socket);

var _v = require("uuid/v4");

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SignalingServerClient = function () {
  function SignalingServerClient() {
    _classCallCheck(this, SignalingServerClient);

    this.users = Object.create(null);
  }

  _createClass(SignalingServerClient, [{
    key: "connect",
    value: function connect(url) {
      var _this = this;

      this._socket = (0, _socket2.default)(url);
      this._socket.on("_users", function (users) {
        _this.users = users;
      });
      this._socket.on("_user_online", function (user) {
        _this.users[user.profile.id] = user;
      });
      this._socket.on("_user_offline", function (user) {
        delete _this.users[user.profile.id];
      });
      return new Promise(function (resolve, reject) {
        _this._socket.once("_users", function (message) {
          _this.users = message;
          resolve(_this.users);
        });
      });
    }
  }, {
    key: "send",
    value: function send(to, message) {
      var _this2 = this;

      var socketId = this.users[to].socketId;
      var id = (0, _v2.default)();
      return new Promise(function (resolve, reject) {
        _this2._socket.once("_message_ack_" + id, function (resp) {
          resolve(resp);
        });
        _this2._socket.emit("_message", { id: id, to: to, data: message });
      });
    }
  }, {
    key: "on",
    value: function on(event, callback) {
      var _this3 = this;

      if (event === "message") {
        this._socket.on("_message", function (message) {
          var resp = callback(message);
          _this3._socket.emit("_message_ack_" + message.id, resp);
        });
      }
      if (event === "users") {
        this._socket.on("_users", callback);
      }
      if (event === "user_online") {
        this._socket.on("_user_online", callback);
      }
      if (event === "user_offline") {
        this._socket.on("_user_offline", callback);
      }
    }
  }]);

  return SignalingServerClient;
}();

exports.default = SignalingServerClient;