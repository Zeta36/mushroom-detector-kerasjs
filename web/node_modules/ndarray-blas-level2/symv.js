'use strict';

var blas1 = require('ndarray-blas-level1');

module.exports = symv;

function symv (A, x, y, fromLower, alpha, beta) {
  var n = A.shape[0];

  var lower = fromLower || true;
  var alpha0 = alpha === undefined ? 1 : alpha;
  var beta0 = beta === undefined ? 0 : beta;

  var i = 0;
  var j = 0;
  var t1 = 0;
  var t2 = 0;

  if (beta0 === 0) {
    for (i = 0; i < y.shape[0]; ++i) {
      y.set(i, 0);
    }
  } else if (beta0 !== 1) {
    blas1.scal(beta0, y);
  }
  if (alpha0 === 0) {
    return true;
  } else if (alpha0 === 1) {
    if (lower) {
      for (j = 0; j < n; ++j) {
        t1 = x.get(j);
        t2 = 0;
        y.set(j, y.get(j) + t1 * A.get(j, j));
        for (i = j + 1; i < n; ++i) {
          y.set(i, y.get(i) + t1 * A.get(i, j));
          t2 = t2 + A.get(i, j) * x.get(i);
        }
        y.set(j, y.get(j) + t2);
      }
    } else {
      for (j = 0; j < n; ++j) {
        t1 = x.get(j);
        t2 = 0;
        for (i = 0; i <= j - 1; ++i) {
          y.set(i, y.get(i) + t1 * A.get(i, j));
          t2 = t2 + A.get(i, j) * x.get(i);
        }
        y.set(j, y.get(j) + t1 * A.get(j, j) + t2);
      }
    }
  } else {
    if (lower) {
      for (j = 0; j < n; ++j) {
        t1 = alpha0 * x.get(j);
        t2 = 0;
        y.set(j, y.get(j) + t1 * A.get(j, j));
        for (i = j + 1; i < n; ++i) {
          y.set(i, y.get(i) + t1 * A.get(i, j));
          t2 = t2 + A.get(i, j) * x.get(i);
        }
        y.set(j, y.get(j) + alpha0 * t2);
      }
    } else {
      for (j = 0; j < n; ++j) {
        t1 = alpha0 * x.get(j);
        t2 = 0;
        for (i = 0; i <= j - 1; ++i) {
          y.set(i, y.get(i) + t1 * A.get(i, j));
          t2 = t2 + A.get(i, j) * x.get(i);
        }
        y.set(j, y.get(j) + t1 * A.get(j, j) + alpha0 * t2);
      }
    }
  }

  return true;
}
