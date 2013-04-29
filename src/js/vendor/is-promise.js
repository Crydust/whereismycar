define(function(require, exports, module){

module.exports = isPromise;

function isPromise(obj) {
  return obj && typeof obj.then === 'function';
}

});