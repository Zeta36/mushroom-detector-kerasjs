/* global describe, it */
'use strict'

var ndarray = require('ndarray')
var assert = require('chai').assert
var unsqueeze = require('../')
var ndt = require('ndarray-tests')

describe('ndarray-unsqueeze', function () {
  it('appends a singleton dimension by default', function () {
    var a = unsqueeze(ndarray([1, 2, 3, 4], [2, 2]))
    var b = ndarray([1, 2, 3, 4], [2, 2, 1])
    assert(ndt.equal(a, b))
  })

  it('inserts a singleton dimension', function () {
    var a = unsqueeze(ndarray([1, 2, 3, 4], [2, 2]), 0)
    var b = ndarray([1, 2, 3, 4], [1, 2, 2])
    assert(ndt.equal(a, b))
  })

  it('inserts a singleton dimension at the end of a matrix', function () {
    var a = unsqueeze(ndarray([1, 2, 3, 4, 5, 6, 7, 8], [2, 4]).step(1, 2))
    var b = ndarray([1, 3, 5, 7], [2, 2, 1])
    assert(ndt.equal(a, b))
  })

  it('throws an error if dim to unsqueeze is not an integer', function () {
    assert.throws(function () {
      unsqueeze(ndarray([1, 2, 3, 4], [2, 2]), 1.5)
    }, Error, 'must be an integer')

    assert.throws(function () {
      unsqueeze(ndarray([1, 2, 3, 4], [2, 2]), [1])
    }, Error, 'must be an integer')
  })
})
