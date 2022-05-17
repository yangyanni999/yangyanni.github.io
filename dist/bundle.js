(function(modules) {

  function __webpack_require__(moduleId) {

    const module = {
      i: moduleId,
      l: false,
      exports: {}
    }

    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)

    return module.exports

  }

  return __webpack_require__(__webpack_require__.s = "./index.js")

})({
  
    'index.js':
    (
      function(module, exports, __webpack_require__) {
        eval(`const sum = _webpack_require_('./app.js');

const result = sum(1, 2);
console.log('结果为' + result);`)
      }
    ),
  
    'app.js':
    (
      function(module, exports, __webpack_require__) {
        eval(`module.exports = function sum(a, b) {
  return a + b;
};`)
      }
    ),
  
})