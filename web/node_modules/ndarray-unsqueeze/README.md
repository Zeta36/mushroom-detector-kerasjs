# ndarray-unsqueeze [![Build Status](https://travis-ci.org/scijs/ndarray-unsqueeze.svg)](https://travis-ci.org/scijs/ndarray-unsqueeze) [![npm version](https://badge.fury.io/js/ndarray-unsqueeze.svg)](https://badge.fury.io/js/ndarray-unsqueeze) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

> Add singleton dimensions to an ndarray

## Introduction

This module takes an input ndarray and either appends a singleton dimension (a dimension of length one) or inserts it before a specific dimension.

## Examples

```javascript
var ndarray = require('ndarray')
var unsqueeze = require('ndarray-unsqueeze')

unsqueeze(ndarray([1, 2, 3, 4], [2, 2]))
// => ndarray([1, 2, 3, 4], [2, 2, 1])

unsqueeze(ndarray([1, 2, 3, 4], [2, 2]), 0)
// => ndarray([1, 2, 3, 4], [1, 2, 2])
```

Note that ndarrays have no concept of row or column vectors. If you need a matrix explicitly representing a row or column vector, you can use unsqueeze:

```javascript
var show = require('ndarray-show')

// Create a 3 x 1 matrix by appending a singleton dimension:
show(unsqueeze(ndarray([1,2,3])))
// => 1.000
//    2.000
//    3.000

// Create a 1 x 3 matrix by prepending a singleton dimension:
show(unsqueeze(ndarray([1,2,3]), 0))
// => 1.000  2.000  3.000

```

## Installation

```javascript
$ npm install ndarray-unsqueeze
```

## API

#### `require('ndarray-unsqueeze')(input[, axis])`

Arguments:
- `input`: The input ndarray to be unsqueeze
- `axes` (optional):  An integer index of the dimension at which to insert the singleton dimension. If unspecified, singleton dimension is appended to the shape.

Returns:
A new array view of the unsqueezed ndarray (i.e. a new ndarray object with the same underlying data).

## See Also
- [`ndarray-squeeze`](https://github.com/scijs/ndarray-squeeze)

## License
&copy; 2016 Ricky Reusser. MIT License.
