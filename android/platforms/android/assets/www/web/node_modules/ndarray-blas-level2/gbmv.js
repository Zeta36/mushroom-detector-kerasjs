'use strict';

module.exports = gbmv;

function gbmv (A, kl, ku, x, y, alpha, beta) {
  var r = 0;
  var i = 0;
  var c = 0;
  var sum = 0;
  var idx = 0;
  var m = A.shape[0];
  var n = A.shape[1];
  var Kl = Math.min(kl, m - 1);
  var Ku = Math.min(ku, n - 1);

  var alpha0 = alpha === undefined ? 1 : alpha;
  var beta0 = beta === undefined ? 0 : beta;

  while (r <= Kl) {
    sum = 0;
    var max = Math.min(r + Ku, n - 1);
    for (c = 0; c <= max; c++) {
      sum += A.get(r, c) * x.get(c);
    }
    y.set(r, sum * alpha0 + beta0 * y.get(r));
    r++;
  }
  if (r < m) {
    i = 0;
    while (r + Ku < n) {
      sum = 0;
      for (c = 0; c <= Kl + Ku; c++) {
        idx = i + c + 1;
        sum += A.get(r, idx) * x.get(idx);
      }
      y.set(r, sum * alpha0 + beta0 * y.get(r));
      r++;
      i++;
      if (r === m) {
        break;
      }
    }
  }
  if (r < m) {
    i++;
    while (r - Kl < n) {
      sum = 0;
      for (c = i; c < n; c++) {
        sum += A.get(r, c) * x.get(c);
      }
      y.set(r, sum * alpha0 + beta0 * y.get(r));
      r++;
      i++;
      if (r === m) {
        break;
      }
    }
  }
  return true;
}
