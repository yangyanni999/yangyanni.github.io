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
        eval(`import sum from './app1.js';
const result = sum(1, 2);
console.log('结果为' + result);`)
      }
    ),
  
    './app1.js':
    (
      function(module, exports,  _webpack_require_) {
        eval(`const sum = _webpack_require_('./app.js');

export default function () {
  return sum();
}`)
      }
    ),
  
    './app.js':
    (
      function(module, exports,  _webpack_require_) {
        eval(`module.exports = function (a, b) {
  return a - b;
};`)
      }
    ),
  
})