'use strict';

var blas1 = require('ndarray-blas-level1');

module.exports = trsv;

// Solve Ax=b where A is upper triangular
function trsv (A, x, isLower) {
  var dot = blas1.dot;
  var n = A.shape[1];
  var i = 0;
  if (isLower) {
    x.set(0, x.get(0) / A.get(0, 0));
    for (i = 1; i < n; i++) {
      x.set(i, (x.get(i) - dot(A.pick(i, null).hi(i), x.hi(i))) / A.get(i, i));
    }
  } else {
    x.set(n - 1, x.get(n - 1) / A.get(n - 1, n - 1));
    for (i = n - 2; i >= 0; i--) {
      x.set(i, (x.get(i) - dot(A.pick(i, null).lo(i + 1), x.lo(i + 1))) / A.get(i, i));
    }
  }
  return true;
}
