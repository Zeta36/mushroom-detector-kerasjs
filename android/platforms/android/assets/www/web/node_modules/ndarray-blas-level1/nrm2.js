'use strict';

var hypot = function hypot (a, b) {
  if (a === 0 && b === 0) {
    return 0;
  }
  var x = Math.abs(a);
  var y = Math.abs(b);
  var t = Math.min(x, y);
  var u = Math.max(x, y);
  t = t / u;
  return u * Math.sqrt(1 + t * t);
};

module.exports = function nrm2 (x) {
  var i, tmp;
  var dx = x.data;
  var ox = x.stride[0];
  var px = x.offset;
  var sum = 0;
  for (i = x.shape[0] - 1; i >= 0; i--, px += ox) {
    tmp = dx[px];
    sum = hypot(sum, tmp);
  }
  return sum;
};
