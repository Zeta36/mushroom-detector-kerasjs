'use strict';

var blas1 = require('ndarray-blas-level1');

module.exports = gemv;

function gemv (alpha, A, x, beta, y) {
  var dot = blas1.dot;
  for (var i = A.shape[0] - 1; i >= 0; i--) {
    y.set(i, y.get(i) * beta + alpha * dot(A.pick(i, null), x));
  }
  return true;
}
