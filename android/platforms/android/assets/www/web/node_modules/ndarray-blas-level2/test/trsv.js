'use strict';

var chai = require('chai');
var assert = chai.assert;
var RandMatGen = require('./util/rand-matrix-gen.js');
var ndarray = require('ndarray');
var assertCloseTo = require('./util/close-to');
var constants = require('./util/constants');

var gemv = require('../gemv');
var trsv = require('../trsv');

describe('TRSV (triangular solve)', function () {
  var n = 15;
  var seed;
  var matGen = new RandMatGen(seed, Float64Array);
  var B = ndarray(new Float64Array(n * n), [n, n]);
  var x = ndarray(new Float64Array(n), [n]);
  var x0 = ndarray(new Float64Array(n), [n]);

  it('upper-triangular TRSV', function () {
    for (var t = 0; t < constants.NUM_TESTS; ++t) {
      seed = matGen.setRandomSeed(36);
      matGen.makeTriangularMatrix(n, n, false, B);
      matGen.makeGeneralMatrix(1, n, x);

      assert(gemv(1, B, x, 0, x0));
      assert(trsv(B, x0, false)); // value of x
      assertCloseTo(x, x0, constants.TEST_TOLERANCE, 'Failure seed value: "' + seed + '".');
    }
  });

  it('lower-triangular TRSV', function () {
    for (var t = 0; t < constants.NUM_TESTS; ++t) {
      seed = matGen.setRandomSeed(36);
      matGen.makeTriangularMatrix(n, n, true, B);
      matGen.makeGeneralMatrix(1, n, x);

      assert(gemv(1, B, x, 0, x0));
      assert(trsv(B, x0, true)); // value of x
      assertCloseTo(x, x0, constants.TEST_TOLERANCE, 'Failure seed value: "' + seed + '".');
    }
  });
});
