/* global it, describe */

'use strict'

var tile = require('../')
var ndarray = require('ndarray')
var assert = require('chai').assert
var ndt = require('ndarray-tests')
var show = require('ndarray-show')
var pool = require('ndarray-scratch')

describe('ndarray-tile', function () {
  describe('with allocation', function () {
    it('[3] x [0]', function () {
      var a = ndarray(new Float64Array([1, 2, 3]))
      assert.throws(function () {
        tile(a, [0])
      }, Error, 'greater than zero')
    })

    it('[3] x [1]', function () {
      var a = ndarray(new Float64Array([1, 2, 3]))
      var b = tile(a, [1])
      var c = ndarray(new Float64Array([1, 2, 3]), [3])
      console.log(show(c))
      assert.deepEqual(b.shape, c.shape)
      assert.equal(b.dimension, c.dimension)
      assert(ndt.equal(b, c))
    })

    it('[3] x [2]', function () {
      var a = ndarray(new Float64Array([1, 2, 3]))
      var b = tile(a, [2])
      var c = ndarray(new Float64Array([1, 2, 3, 1, 2, 3]), [6])
      console.log(show(c))
      assert.deepEqual(b.shape, c.shape)
      assert.equal(b.dimension, c.dimension)
      assert(ndt.equal(b, c))
    })

    it('[3] x [1,2]', function () {
      var a = ndarray(new Float64Array([1, 2, 3]))
      var b = tile(a, [1, 2])
      var c = ndarray(new Float64Array([1, 1, 2, 2, 3, 3]), [3, 2])
      console.log(show(c))
      assert.deepEqual(b.shape, c.shape)
      assert.equal(b.dimension, c.dimension)
      assert(ndt.equal(b, c))
    })

    it('[3,2] x [2,2]', function () {
      var a = ndarray(new Float64Array([1, 2, 3]))
      var b = tile(a, [2, 2])
      var c = ndarray(new Float64Array([1, 1, 2, 2, 3, 3, 1, 1, 2, 2, 3, 3]), [6, 2])
      console.log(show(c))
      assert.deepEqual(b.shape, c.shape)
      assert.equal(b.dimension, c.dimension)
      assert(ndt.equal(b, c))
    })

    it('[3,2] x [2,1]', function () {
      var a = ndarray(new Float64Array([1, 4, 2, 5, 3, 6]), [3, 2])
      var b = tile(a, [2, 1])
      var c = ndarray(new Float64Array([1, 4, 2, 5, 3, 6, 1, 4, 2, 5, 3, 6]), [6, 2])
      console.log(show(c))
      assert.deepEqual(b.shape, c.shape)
      assert.equal(b.dimension, c.dimension)
      assert(ndt.equal(b, c))
    })

    it('[3,2] x [1,2]', function () {
      var a = ndarray(new Float64Array([1, 4, 2, 5, 3, 6]), [3, 2])
      var b = tile(a, [1, 2])
      var c = ndarray(new Float64Array([1, 4, 1, 4, 2, 5, 2, 5, 3, 6, 3, 6]), [3, 4])
      console.log(show(c))
      assert.deepEqual(b.shape, c.shape)
      assert.equal(b.dimension, c.dimension)
      assert(ndt.equal(b, c))
    })

    it('[3,2] x [2,2,2]', function () {
      var a = ndarray(new Float64Array([1, 4, 2, 5, 3, 6]), [3, 2])
      var b = tile(a, [2, 2, 2])
      var c = ndarray(new Float64Array([1, 1, 4, 4, 1, 1, 4, 4, 2, 2, 5, 5, 2, 2, 5, 5, 3, 3, 6, 6, 3, 3, 6, 6, 1, 1, 4, 4, 1, 1, 4, 4, 2, 2, 5, 5, 2, 2, 5, 5, 3, 3, 6, 6, 3, 3, 6, 6]), [6, 4, 2])
      assert.deepEqual(b.shape, c.shape)
      assert.equal(b.dimension, c.dimension)
      assert(ndt.equal(b, c))
    })
  })

  describe('without allocation', function () {
    it('[3] x [1]', function () {
      var a = ndarray(new Float64Array([1, 2, 3]))
      var b = pool.zeros([3])
      tile(b, a, [1])
      var c = ndarray(new Float64Array([1, 2, 3]), [3])
      assert.deepEqual(b.shape, c.shape)
      assert.equal(b.dimension, c.dimension)
      assert(ndt.equal(b, c))
    })

    it('[3] x [2]', function () {
      var a = ndarray(new Float64Array([1, 2, 3]))
      var b = pool.zeros([6])
      tile(b, a, [2])
      var c = ndarray(new Float64Array([1, 2, 3, 1, 2, 3]), [6])
      assert.deepEqual(b.shape, c.shape)
      assert.equal(b.dimension, c.dimension)
      assert(ndt.equal(b, c))
    })

    it('[3] x [1,2]', function () {
      var a = ndarray(new Float64Array([1, 2, 3]))
      var b = pool.zeros([3, 2])
      tile(b, a, [1, 2])
      var c = ndarray(new Float64Array([1, 1, 2, 2, 3, 3]), [3, 2])
      assert.deepEqual(b.shape, c.shape)
      assert.equal(b.dimension, c.dimension)
      assert(ndt.equal(b, c))
    })

    it('[3,2] x [2,2]', function () {
      var a = ndarray(new Float64Array([1, 2, 3]))
      var b = pool.zeros([6, 2])
      tile(b, a, [2, 2])
      var c = ndarray(new Float64Array([1, 1, 2, 2, 3, 3, 1, 1, 2, 2, 3, 3]), [6, 2])
      assert.deepEqual(b.shape, c.shape)
      assert.equal(b.dimension, c.dimension)
      assert(ndt.equal(b, c))
    })

    it('[3,2] x [2,1]', function () {
      var a = ndarray(new Float64Array([1, 4, 2, 5, 3, 6]), [3, 2])
      var b = pool.zeros([6, 2])
      tile(b, a, [2, 1])
      var c = ndarray(new Float64Array([1, 4, 2, 5, 3, 6, 1, 4, 2, 5, 3, 6]), [6, 2])
      assert.deepEqual(b.shape, c.shape)
      assert.equal(b.dimension, c.dimension)
      assert(ndt.equal(b, c))
    })

    it('[3,2] x [1,2]', function () {
      var a = ndarray(new Float64Array([1, 4, 2, 5, 3, 6]), [3, 2])
      var b = pool.zeros([3, 4])
      tile(b, a, [1, 2])
      var c = ndarray(new Float64Array([1, 4, 1, 4, 2, 5, 2, 5, 3, 6, 3, 6]), [3, 4])
      assert.deepEqual(b.shape, c.shape)
      assert.equal(b.dimension, c.dimension)
      assert(ndt.equal(b, c))
    })

    it('[3,2] x [2,2,2]', function () {
      var a = ndarray(new Float64Array([1, 4, 2, 5, 3, 6]), [3, 2])
      var b = pool.zeros([6, 4, 2])
      tile(b, a, [2, 2, 2])
      var c = ndarray(new Float64Array([1, 1, 4, 4, 1, 1, 4, 4, 2, 2, 5, 5, 2, 2, 5, 5, 3, 3, 6, 6, 3, 3, 6, 6, 1, 1, 4, 4, 1, 1, 4, 4, 2, 2, 5, 5, 2, 2, 5, 5, 3, 3, 6, 6, 3, 3, 6, 6]), [6, 4, 2])
      assert.deepEqual(b.shape, c.shape)
      assert.equal(b.dimension, c.dimension)
      assert(ndt.equal(b, c))
    })
  })
})
