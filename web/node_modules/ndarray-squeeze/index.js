'use strict'

var ndarray = require('ndarray')

module.exports = squeeze

function squeeze (a, axes) {
  var i
  var shape = []
  var stride = []

  if (axes !== undefined && !Array.isArray(axes)) {
    throw new Error('axes must be an Array list of dimensions to squeeze')
  }

  for (i = 0; i < a.shape.length; i++) {
    if (a.shape[i] !== 1 || (axes !== undefined && axes.indexOf(i) === -1)) {
      shape.push(a.shape[i])
      stride.push(a.stride[i])
    }
  }

  return ndarray(a.data, shape, stride, a.offset)
}
