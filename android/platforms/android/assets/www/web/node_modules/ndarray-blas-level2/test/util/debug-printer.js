'use strict';

module.exports.printPackedMatrix = function (A, lower) {
  var getIndex;
  var n = (Math.sqrt(8 * A.shape[0] + 1) - 1) / 2;
  if (lower) {
    getIndex = function (i, j) {
      return i + (2 * n - j - 1) * j / 2;
    };
  } else {
    getIndex = function (i, j) {
      return i + j * (j + 1) / 2;
    };
  }

  var matString = '[\n';
  for (var i = 0; i < n; ++i) {
    var rowString = '';
    for (var j = 0; j < n; ++j) {
      if (j !== 0) {
        rowString += '\t';
      }
      var val = '0';
      if ((lower && j <= i) || (!lower && j >= i)) {
        var index = getIndex(i, j);
        val = A.get(index);
      }
      rowString += val.toString().substring(0, 6);
    }
    matString += rowString + '\n';
  }
  matString += ']';
  return matString;
};
