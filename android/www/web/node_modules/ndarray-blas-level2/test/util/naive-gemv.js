'use strict';

module.exports = naiveGEMV;

function naiveGEMV (alpha, A, x, beta, y) {
  var m = A.shape[0];
  var n = A.shape[1];
  for (var i = 0; i < m; ++i) {
    var d = 0;
    for (var j = 0; j < n; ++j) {
      d += A.get(i, j) * x.get(j);
    }
    y.set(i, alpha * d + beta * y.get(i));
  }
  return true;
}
