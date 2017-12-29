'use strict'

module.exports = concatRows
var extend = require('util-extend')
var ops = require('ndarray-ops')
var pool = require('ndarray-scratch')

var defaults = {
  dtype: 'double'
}

function concatRows () {
  var output, input, inputs, options, d, i, shape, idx, l, slice

  options = extend({}, defaults)

  if (arguments.length === 0) {
    throw new Error('Array of ndarrays to concatenate must not be empty')
  }

  if (Array.isArray(arguments[0])) {
    // If the first argument is an array, then assume it's the list
    // of arrays to concatenate:
    inputs = arguments[0]
    extend(options, arguments[1] || {})
  } else if (arguments.length === 2) {
    // Otherwise assume the first argument is the output array:
    inputs = arguments[1]
    output = arguments[0]
    extend(options, arguments[2] || {})
  }

  if (inputs.length === 0) {
    throw new Error('Array of ndarrays to concatenate must not be empty')
  }

  for (d = 0; d < inputs.length; d++) {
    // Verify the other dimensions:
    if (!shape) {
      // If no shape is set, set it:
      shape = inputs[d].shape.slice(0)
    } else {
      // At the very least, all arrays must share teh same dimensionality:
      if (inputs[d].dimension !== shape.length) {
        throw new Error('all arrays must have the same dimensionality')
      }
      // If shape is set, then this shape must match:
      for (i = 1; i < inputs[d].shape.length; i++) {
        if (inputs[d].shape[i] !== shape[i]) {
          throw new Error('last n-1 dimensions of concatenated rows must have the same size')
        }
      }

      // Add to the size of the concatenated dimension:
      shape[0] += inputs[d].shape[0]
    }
  }

  if (output) {
    if (shape[0] !== output.shape[0]) {
      throw new Error('first dimension of output array must match the total number of concatenated rows')
    }
  } else {
    // NB: Nothing after this can fail, otherwise we leak memory. So all
    // assertions MUST happen before this.
    output = pool.zeros(shape, options.dtype)
  }

  for (i = 0, idx = 0; i < inputs.length; i++) {
    input = inputs[i]
    l = input.shape[0]
    slice = output.lo(idx).hi(l)
    ops.assign(slice, input)
    idx += l
  }

  return output
}
