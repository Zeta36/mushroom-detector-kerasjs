'use strict';

module.exports = function scal (alpha, x) {
  var i;
  var dx = x.data;
  var ox = x.stride[0];
  var px = x.offset;
  for (i = x.shape[0] - 1; i >= 0; i--, px += ox) {
    dx[px] *= alpha;
  }
};
