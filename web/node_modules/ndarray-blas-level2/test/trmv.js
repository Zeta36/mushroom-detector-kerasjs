'use strict';

var chai = require('chai');
var assert = chai.assert;
var blas1 = require('ndarray-blas-level1');
var RandMatGen = require('./util/rand-matrix-gen.js');
var ndarray = require('ndarray');
var assertCloseTo = require('./util/close-to');
var constants = require('./util/constants');

var gemv = require('../gemv');
var trmv = require('../trmv');

describe('TRMV (triangular matrix vector product)', function () {
  var n = 15;
  var seed;
  var matGen = new RandMatGen(seed, Float64Array);
  var x = ndarray(new Float64Array(n), [n]);
  var x0 = ndarray(new Float64Array(n), [n]);
  var xn = ndarray(new Float64Array(n), [n]);
  var B = ndarray(new Float64Array(n * n), [n, n]);

  it('upper-triangular TRMV', function () {
    for (var t = 0; t < constants.NUM_TESTS; ++t) {
      seed = matGen.setRandomSeed(36);
      matGen.makeTriangularMatrix(n, n, false, B);
      matGen.makeGeneralMatrix(1, n, xn);
      blas1.copy(xn, x);

      assert(trmv(B, x, false));
      assert(gemv(1, B, xn, 0, x0));
      assertCloseTo(x, x0, constants.TEST_TOLERANCE, 'Failure seed value: "' + seed + '".');
    }
  });

  it('lower-triangular TRMV', function () {
    for (var t = 0; t < constants.NUM_TESTS; ++t) {
      seed = matGen.setRandomSeed(36);
      matGen.makeTriangularMatrix(n, n, true, B);
      matGen.makeGeneralMatrix(1, n, xn);
      blas1.copy(xn, x);

      assert(trmv(B, x, true));
      assert(gemv(1, B, xn, 0, x0));
      assertCloseTo(x, x0, constants.TEST_TOLERANCE, 'Failure seed value: "' + seed + '".');
    }
  });
});
