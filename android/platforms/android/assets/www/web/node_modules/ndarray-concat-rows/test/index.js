/* global describe, it */
'use strict'

var r = require('../')
var ndarray = require('ndarray')
var assert = require('chai').assert
var ndt = require('ndarray-tests')
var pool = require('ndarray-scratch')

describe('concat-rows', function () {
  it('concatenating nothing fails', function () {
    assert.throws(function () {
      r()
    }, Error, 'must not be empty')
  })

  it('concatenating an empty list', function () {
    assert.throws(function () {
      r([])
    }, Error, 'must not be empty')
  })

  it('concatenates rows', function () {
    //
    // [1 2 3] + [4 5 6] -> [1 2 3 4 5 6]
    //
    var out = r([ndarray([1, 2, 3]), ndarray([4, 5, 6])])
    assert(ndt.equal(out, ndarray([1, 2, 3, 4, 5, 6])))
  })

  it('concatenates rows into an output array', function () {
    //
    // [1 2 3] + [4 5 6] -> [1 2 3 4 5 6]
    //
    var out = pool.zeros([6])
    r(out, [ndarray([1, 2, 3]), ndarray([4, 5, 6])])
    assert(ndt.equal(out, ndarray([1, 2, 3, 4, 5, 6]), 1e-8))
  })

  it("throws an error if output size doesn't match input", function () {
    //
    // [1 2 3] + [4 5 6] -> [. . . . . . .] -> error
    //
    var out = pool.zeros([7])
    assert.throws(function () {
      r(out, [ndarray([1, 2, 3]), ndarray([4, 5, 6])])
    }, Error, 'first dimension of output')
  })

  it('concatenates a matrix + row vector', function () {
    var out = r([ndarray([1, 2, 3, 4], [2, 2]), ndarray([5, 6], [1, 2])])
    assert(ndt.equal(out, ndarray([1, 2, 3, 4, 5, 6], [3, 2]), 1e-8))
  })

  it('fails to concatenate vector + matrix', function () {
    assert.throws(function () {
      r([ndarray([5, 6]), ndarray([1, 2, 3, 4], [2, 2])])
    }, Error, 'all arrays must have the same dimensionality')
  })

  it('fails to concatenate matrix + vector', function () {
    assert.throws(function () {
      r([ndarray([1, 2, 3, 4], [2, 2]), ndarray([5, 6])])
    }, Error, 'all arrays must have the same dimensionality')
  })

  it('concatenates matrix rows', function () {
    //
    // [1 2]   [ 7  8]    [ 1  2]
    // [3 4] + [ 9 10] -> [ 3  4]
    // [5 6]   [11 12]    [ 5  6]
    //         [13 14]    [ 7  8]
    //                    [ 9 10]
    //                    [11 12]
    //                    [13 14]
    //
    var x = ndarray([1, 2, 3, 4, 5, 6], [3, 2])
    var y = ndarray([7, 8, 9, 10, 11, 12, 13, 14], [4, 2])
    var z = ndarray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], [7, 2])
    assert(ndt.equal(r([x, y]), z))
  })

  it("throws an error if cross dimensions don't match", function () {
    //
    // [1 2]   [ 7  8  9 10]
    // [3 4] + [11 12 13 14] -> error
    // [5 6]
    //
    var x = ndarray([1, 2, 3, 4, 5, 6], [3, 2])
    var y = ndarray([7, 8, 9, 10, 11, 12, 13, 14], [2, 4])
    assert.throws(function () {
      r([x, y])
    }, Error, 'last n-1')
  })

  it('concatenates 3d arrays', function () {
    var x = ndarray([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2])
    var y = ndarray([9, 10, 11, 12, 13, 14, 15, 16], [2, 2, 2])
    assert(ndt.equal(r([x, y]), ndarray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], [4, 2, 2])))
  })
})
