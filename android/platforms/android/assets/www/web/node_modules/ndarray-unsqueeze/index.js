'use strict'

var ndarray = require('ndarray')

module.exports = unsqueeze

function unsqueeze (a, axis) {
  var shape, stride

  if (axis !== undefined && (!Number.isFinite(axis) || (axis % 1 !== axis))) {
    throw new Error('axis of dimension to unsqueeze must be an integer')
  }
  axis = axis === undefined ? a.shape.length : axis

  shape = a.shape.slice(0)
  stride = a.stride.slice(0)
  shape.splice(axis || 0, 0, 1)
  stride.splice(axis || 0, 0, (stride[axis] || 1) * (shape[axis + 1] || 1))

  return ndarray(a.data, shape, stride, a.offset)
}
