;(function (graph) {
  function require(moduleId) {
    function localRequire(relativePath) {
      return require(graph[moduleId].dependecies[relativePath])
    }
    var exports = {}
    ;(function (require, exports, code) {
      eval(code)
    })(localRequire, exports, graph[moduleId].code)
    return exports
  }
  require('./src/index.js')
})({
  './src/index.js': {
    dependecies: { './app.js': './src/app.js' },
    code: '"use strict";\n\nvar _app = _interopRequireDefault(require("./app.js"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }\n\nvar result = (0, _app["default"])(1, 2);\nconsole.log(\'结果为\' + result);'
  },
  './src/app.js': {
    dependecies: {},
    code: '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports["default"] = sum;\n\nfunction sum(a, b) {\n  return a + b;\n}'
  }
})
