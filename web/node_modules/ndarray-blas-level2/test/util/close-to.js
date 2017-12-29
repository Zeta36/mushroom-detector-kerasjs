'use strict';

var chai = require('chai');
var assert = chai.assert;
var ndt = require('ndarray-tests');

module.exports = closeTo;

function closeTo (a, b, tol, msg) {
  return assert(ndt.approximatelyEqual(a, b, tol), msg);
}
