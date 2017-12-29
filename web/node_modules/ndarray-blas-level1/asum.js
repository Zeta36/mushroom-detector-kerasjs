'use strict';

module.exports = function asum (x) {
  var i;
  var dx = x.data;
  var ox = x.stride[0];
  var px = x.offset;
  var sum = 0;
  for (i = x.shape[0] - 1; i >= 0; i--, px += ox) {
    sum += Math.abs(dx[px]);
  }
  return sum;
};
