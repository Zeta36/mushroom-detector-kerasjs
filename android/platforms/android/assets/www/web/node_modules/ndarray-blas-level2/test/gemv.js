'use strict';

var chai = require('chai');
var assert = chai.assert;
var RandMatGen = require('./util/rand-matrix-gen.js');
var naiveGEMV = require('./util/naive-gemv');
var ndarray = require('ndarray');
var assertCloseTo = require('./util/close-to');
var constants = require('./util/constants');

var gemv = require('../gemv');

describe('GEMV (general matrix vector product)', function () {
  var m = 10;
  var n = 15;
  var alpha = 0;
  var beta = 0;
  var seed;
  var matGen = new RandMatGen(seed, Float64Array);
  var A = ndarray(new Float64Array(m * n), [m, n]);
  var x = ndarray(new Float64Array(n), [n]);
  var y = ndarray(new Float64Array(m), [m]);
  var y0 = ndarray(new Float64Array(m), [m]);

  it('gemv', function () {
    for (var t = 0; t < constants.NUM_TESTS; ++t) {
      alpha = Math.random();
      beta = Math.random();
      seed = matGen.setRandomSeed(36);
      matGen.makeGeneralMatrix(m, n, A);
      matGen.makeGeneralMatrix(1, n, x);

      assert(gemv(alpha, A, x, beta, y));
      assert(naiveGEMV(alpha, A, x, beta, y0));
      assertCloseTo(y0, y, constants.TEST_TOLERANCE, 'Failure seed value: "' + seed + '".');
    }
  });
});
