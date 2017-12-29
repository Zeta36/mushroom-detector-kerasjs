'use strict';

module.exports = function dot (x, y) {
  var i, tmp;
  var dx = x.data;
  var ox = x.stride[0];
  var px = x.offset;

  var sum = 0;
  if (x === y) {
    for (i = x.shape[0] - 1; i >= 0; i--, px += ox) {
      tmp = dx[px];
      sum += tmp * tmp;
    }
  } else {
    var dy = y.data;
    var oy = y.stride[0];
    var py = y.offset;
    for (i = x.shape[0] - 1; i >= 0; i--, px += ox, py += oy) {
      sum += dy[py] * dx[px];
    }
  }
  return sum;
};
