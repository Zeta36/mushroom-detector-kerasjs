'use strict';

var blas1 = require('ndarray-blas-level1');

module.exports = trmv;

// Compute the product of an upper triangular matrix with a vector
function trmv (A, x, isLower) {
  var dot = blas1.dot;
  var n = A.shape[1];
  var i = 0;
  if (isLower) {
    for (i = n - 1; i >= 0; i--) {
      x.set(i, dot(A.pick(i, null).hi(i + 1), x.hi(i + 1)));
    }
  } else {
    for (i = 0; i < n; i++) {
      x.set(i, dot(A.pick(i, null).lo(i), x.lo(i)));
    }
  }
  return true;
}
