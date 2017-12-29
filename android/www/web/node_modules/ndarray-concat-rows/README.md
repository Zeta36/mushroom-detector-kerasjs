# ndarray-concat-rows [![Build Status](https://travis-ci.org/scijs/ndarray-concat-rows.svg)](https://travis-ci.org/scijs/ndarray-concat-rows) [![npm version](https://badge.fury.io/js/ndarray-concat-rows.svg)](https://badge.fury.io/js/ndarray-concat-rows) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

> Concatenate ndarrays by row (along the first dimension)

## Introduction

This module takes a list of input ndarrays and concatenates it along the first dimension. That is, a 3 &times; 2 ndarray concatenated with a 10 &times; 2 ndarray yields a 13 &times; 2 ndarray.

## Examples

Understanding `(+)` in the comments below to indicate row concatenation,

```javascript
var ndarray = require('ndarray')
var r = require('ndarray-concat-rows')

// Concatenating vectors:
//   [1 2] (+) [3 4] -> [1 2 3 4]
//
r([ ndarray([1, 2]), ndarray([3, 4]) ])
// => ndarray([1, 2, 3, 4])

// Concatenating matrices:
//                       [1  2]
//   [1 2]     [5  6]    [3  4]
//   [3 4] (+) [7  8] -> [4  5]
//             [9 10]    [7  8]
//                       [9 10]
//
r([ ndarray([1, 2, 3, 4], [2, 2]), ndarray([5, 6, 7, 8, 9, 10], [3, 2]) ])
// => ndarray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [5, 2])
```

## Installation

```javascript
$ npm install ndarray-concat-rows
```

## API

#### `require('ndarray-concat-rows')([output,] input, [options])`
**Arguments**:
- `output` (optional): An optional output destination. The shape must match the shape of the concatenated arrays, otherwise an error will be thrown. If not provided, storage will be allocated using [`ndarray-scratch`](https://github.com/scijs/ndarray-scratch).
- `input`: A javascript `Array` containing ndarrays to be concatenated. If this is missing or empty, an error will be thrown. Given n-dimensional input, all arguments must have the same dimensionality and the last n-1 dimensions of each arguments must have the same length.
- `options` (optional): An optional object containing options. Options are:
  - `dtype`: If no `output` ndarray is provided, the dtype of the output will be `double` (equivalently `float64`) by default, or otherwise the dtype specified here. See [ndarray dtypes](https://github.com/scijs/ndarray#arraydtype).

**Returns**: A reference to the output ndarray containing the concatenated data.

## License
&copy; 2016 Ricky Reusser. MIT License.
