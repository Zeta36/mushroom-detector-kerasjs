'use strict'

var tile = require('../')
var ndarray = require('ndarray')
var show = require('ndarray-show')

console.log('[3] x [2] =\n' + show(tile(ndarray(new Float64Array([1, 2, 3])), [2])))
console.log('\n[3] x [1, 2] =\n' + show(tile(ndarray(new Float64Array([1, 2, 3])), [1, 2])))
console.log('\n[2, 2] x [2, 2] =\n' + show(tile(ndarray(new Float64Array([1, 2, 3, 4]), [2, 2]), [2, 2])))
console.log('\n[2, 2] x [2] =\n' + show(tile(ndarray(new Float64Array([1, 2, 3, 4]), [2, 2]), [2])))

console.log('\n[2, 2] x [1, 1, 2] =\n' + show(tile(ndarray(new Float64Array([1, 2, 3, 4]), [2, 2]), [1, 1, 2])))
