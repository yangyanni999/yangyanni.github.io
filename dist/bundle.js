(function(modules) {

  function  _webpack_require_(moduleId) {

    const module = {
      i: moduleId,
      l: false,
      exports: {}
    }

    modules[moduleId].call(module.exports, module, module.exports,  _webpack_require_)

    return module.exports

  }

  return  _webpack_require_("./index.js")

})({
  
    './index.js':
    (
      function(module, exports,  _webpack_require_) {
        eval(`"use strict";

var _app = _interopRequireDefault(require("./app1.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var result = (0, _app["default"])(1, 2);
console.log('结果为' + result);`)
      }
    ),
  
    './app1.js':
    (
      function(module, exports,  _webpack_require_) {
        eval(`"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var sum = _webpack_require_('./app.js');

function _default() {
  return sum();
}`)
      }
    ),
  
    './app.js':
    (
      function(module, exports,  _webpack_require_) {
        eval(`"use strict";

module.exports = function (a, b) {
  return a - b;
};`)
      }
    ),
  
})