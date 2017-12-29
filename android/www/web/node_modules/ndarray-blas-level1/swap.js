'use strict';

module.exports = function swap (x, y) {
  var i, tmp;
  var dx = x.data;
  var dy = y.data;

  var ox = x.stride[0];
  var oy = y.stride[0];
  var px = x.offset;
  var py = y.offset;

  for (i = x.shape[0] - 1; i >= 0; i--, px += ox, py += oy) {
    tmp = dx[px];
    dx[px] = dy[py];
    dy[py] = tmp;
  }
};
