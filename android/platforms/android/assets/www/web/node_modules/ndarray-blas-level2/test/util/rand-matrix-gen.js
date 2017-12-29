'use strict';

var ndarray = require('ndarray');
var ops = require('ndarray-ops');
var fill = require('ndarray-fill');
var band = require('ndarray-band');
var MersenneTwister = require('mersennetwister');

module.exports = function (seed, arrayType) {
  var NUMBER_ARRAY = arrayType;
  var randGenSeed = seed;
  var prng = new MersenneTwister(seed);

  var exports = {};

  function getRandom () {
    return prng.random();
  }

  exports.getSeed = function () {
    if (!prng) {
      throw new Error('Number generator not initialized.');
    }
    return randGenSeed;
  };

  exports.setNewSeed = function (seed) {
    if (!prng) {
      throw new Error('Number generator not initialized.');
    }
    prng.seed(seed);
    randGenSeed = seed;
  };

  exports.setRandomSeed = function (length) {
    if (!prng) {
      throw new Error('Number generator not initialized.');
    }
    var len = length || 36;
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < len; ++i) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    prng.seed(text);
    randGenSeed = text;
    return text;
  };

  exports.makeGeneralMatrix = function (m, n, M) {
    if (!prng) {
      throw new Error('Number generator not initialized.');
    }
    var numElems = m * n;

    var A = M || ndarray(new NUMBER_ARRAY(numElems), [m, n]);
    fill(A, getRandom);
    return A;
  };

  exports.makeSymmetricMatrix = function (n, M) {
    if (!prng) {
      throw new Error('Number generator not initialized.');
    }
    var numElems = n * n;
    var A = M || ndarray(new NUMBER_ARRAY(numElems), [n, n]);
    ops.assigns(A, 0);
    fill(A, function (i, j) {
      var val = A.get(j, i);
      if (val !== 0) {
        return val;
      } else {
        return prng.random();
      }
    });
    return A;
  };

  exports.makeSymmBandedMatrix = function (n, k, M) {
    if (!prng) {
      throw new Error('Number generator not initialized.');
    }
    var numElems = n * n;
    var A = M || ndarray(new NUMBER_ARRAY(numElems), [n, n]);
    ops.assigns(A, 0);

    var i, band2;
    var band1 = band(A, 0);
    fill(band1, getRandom);
    for (i = 1; i <= k; ++i) {
      band1 = band(A, i);
      band2 = band(A, -i);
      fill(band1, getRandom);
      ops.assign(band2, band1);
    }
    return A;
  };

  exports.makeBandedMatrix = function (m, n, kl, ku, M) {
    if (!prng) {
      throw new Error('Number generator not initialized.');
    }
    var i;
    var numElems = m * n;
    var A = M || ndarray(new NUMBER_ARRAY(numElems), [m, n]);
    ops.assigns(A, 0);
    var numLower = Math.min(kl, m);
    var numUpper = Math.min(ku, n);
    for (i = numLower; i >= -numUpper; i--) {
      fill(band(A, i), getRandom);
    }
    return A;
  };
  exports.makeTriangularMatrix = function (m, n, lower, M) {
    if (!prng) {
      throw new Error('Number generator not initialized.');
    }
    var numElems = m * n;
    var A = M || ndarray(new NUMBER_ARRAY(numElems), [m, n]);
    ops.assigns(A, 0);
    var i = 0;
    if (lower) {
      for (i = 0; i < m; ++i) {
        fill(band(A, i), getRandom);
      }
    } else {
      for (i = 0; i < n; ++i) {
        fill(band(A, -i), getRandom);
      }
    }
    return A;
  };

  exports.makePackedMatrix = function (n, M) {
    var numElems = ((n + 1) * n) / 2;
    var A = M || ndarray(new NUMBER_ARRAY(numElems), [numElems]);
    fill(A, getRandom);
    return A;
  };

  return exports;
};
