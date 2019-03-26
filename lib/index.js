"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var rpc_websockets_1 = require("rpc-websockets");

var CONDUCTOR_CONFIG = '/_dna_connections.json';

exports.connect = function (paramUrl) {
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(fulfill, reject) {
      var url, ws;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = paramUrl;

              if (_context.t0) {
                _context.next = 5;
                break;
              }

              _context.next = 4;
              return getUrlFromContainer().catch(function () {
                return reject('Could not auto-detect DNA interface from conductor. \
Ensure the web UI is hosted by a Holochain Conductor or manually specify url as parameter to connect');
              });

            case 4:
              _context.t0 = _context.sent;

            case 5:
              url = _context.t0;
              ws = new rpc_websockets_1.Client(url);
              ws.on('open', function () {
                var callRaw = function callRaw() {
                  for (var _len = arguments.length, methodSegments = new Array(_len), _key = 0; _key < _len; _key++) {
                    methodSegments[_key] = arguments[_key];
                  }

                  return function (params) {
                    var method = methodSegments.length === 1 ? methodSegments[0] : methodSegments.join('/');
                    return ws.call(method, params);
                  };
                };

                var call = function call() {
                  for (var _len2 = arguments.length, methodSegments = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    methodSegments[_key2] = arguments[_key2];
                  }

                  return function (params) {
                    var instanceId;
                    var zome;
                    var func;

                    if (methodSegments.length === 1 && methodSegments[0].split('/').length === 3) {
                      var _methodSegments$0$spl = methodSegments[0].split('/');

                      var _methodSegments$0$spl2 = (0, _slicedToArray2.default)(_methodSegments$0$spl, 3);

                      instanceId = _methodSegments$0$spl2[0];
                      zome = _methodSegments$0$spl2[1];
                      func = _methodSegments$0$spl2[2];
                    } else if (methodSegments.length === 3) {
                      instanceId = methodSegments[0];
                      zome = methodSegments[1];
                      func = methodSegments[2];
                    } else {
                      throw new Error("Invalid arguments ".concat(methodSegments, ". Must call with either a single slash delimited string \"instance/zome/func\" or three parameters for instance, zome and func."));
                    }

                    var callObject = {
                      'instance_id': instanceId,
                      zome: zome,
                      'function': func,
                      params: params
                    };
                    return ws.call('call', callObject);
                  };
                }; // define a function which will close the websocket connection


                var close = function close() {
                  return ws.close();
                };

                fulfill({
                  call: call,
                  callRaw: callRaw,
                  close: close,
                  ws: ws
                });
              });

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

function getUrlFromContainer() {
  return fetch(CONDUCTOR_CONFIG).then(function (data) {
    return data.json();
  }).then(function (json) {
    return json.dna_interface.driver.port;
  }).then(function (port) {
    return "ws://localhost:".concat(port);
  });
}

var holochainclient = {
  connect: exports.connect
};