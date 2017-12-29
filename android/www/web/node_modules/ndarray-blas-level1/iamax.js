'use strict';

module.exports = function iamax (x) {
  var i, tmp, imax;
  var xmax = -Infinity;
  var dx = x.data;
  var ox = x.stride[0];
  var px = x.offset;
  var l = x.shape[0];
  for (i = 0; i < l; i++, px += ox) {
    tmp = Math.abs(dx[px]);
    if (tmp > xmax) {
      xmax = tmp;
      imax = i;
    }
  }
  return imax;
};
