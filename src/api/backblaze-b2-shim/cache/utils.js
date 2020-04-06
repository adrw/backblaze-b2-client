// use: let deferred = new Deferred();
/** Backwards compatible Promise.defer() function */
exports.Deferred = function () {
  // credit: https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred#Backwards_and_forwards_compatible_helper
  this.resolve = null
  this.reject = null
  this.promise = new Promise(
    function (resolve, reject) {
      this.resolve = resolve
      this.reject = reject
    }.bind(this)
  )

  Object.freeze(this)
}
