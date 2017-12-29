/* global describe, it */
'use strict'

var ndarray = require('ndarray')
var assert = require('chai').assert
var squeeze = require('../')
var ndt = require('ndarray-tests')

describe('ndarray-squeeze', function () {
  it('removes singleton dimensions', function () {
    var a = squeeze(ndarray([1, 2, 3, 4], [1, 1, 1, 1, 2, 1, 2]))
    var b = ndarray([1, 2, 3, 4], [2, 2])
    assert(ndt.equal(a, b))
  })

  it('removes a specific singleton dimension', function () {
    var a = squeeze(ndarray([1, 2, 3, 4], [1, 1, 1, 1, 2, 1, 2]), [5])
    var b = ndarray([1, 2, 3, 4], [1, 1, 1, 1, 2, 2])
    assert(ndt.equal(a, b))
  })

  it('removes multiple specific singleton dimensions', function () {
    var a = squeeze(ndarray([1, 2, 3, 4], [1, 1, 1, 1, 2, 1, 2]), [1, 5])
    var b = ndarray([1, 2, 3, 4], [1, 1, 1, 2, 2])
    assert(ndt.equal(a, b))
  })

  it('throws an error if axes not an array', function () {
    assert.throws(function () {
      squeeze(ndarray([1, 2, 3, 4], [1, 1, 1, 1, 2, 1, 2]), 5)
    }, Error, 'must be an Array')
  })

  it('ignores non-singleton dimensions', function () {
    var a = ndarray([1, 2, 3, 4], [1, 2, 2])
    assert(ndt.equal(squeeze(a, [0]), ndarray([1, 2, 3, 4], [2, 2])))
    assert(ndt.equal(squeeze(a, [1]), ndarray([1, 2, 3, 4], [1, 2, 2])))
    assert(ndt.equal(squeeze(a, [2]), ndarray([1, 2, 3, 4], [1, 2, 2])))
  })
})
