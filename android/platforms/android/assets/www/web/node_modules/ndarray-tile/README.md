# ndarray-tile [![Build Status](https://travis-ci.org/scijs/ndarray-tile.svg)](https://travis-ci.org/scijs/ndarray-tile) [![npm version](https://badge.fury.io/js/ndarray-tile.svg)](https://badge.fury.io/js/ndarray-tile) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

> Repeat an ndarray

## Introduction

This module takes an input ndarray and repeats it some number of times in each dimension.

## Examples

```javascript
var tile = require('ndarray-tile')
var ndarray = require('ndarray')

// Repeat a vector:
tile(ndarray(new Float64Array([1, 2, 3])), [2])
// => 1 2 3 1 2 3


// Repeat a vector in a second dimension:
tile(ndarray(new Float64Array([1, 2, 3])), [1, 2])
// => 1 1
//    2 2
//    3 3


// Tile a matrix in two dimensions:
tile(ndarray(new Float64Array([1, 2, 3, 4]), 2, 2]), [2, 2])
// => 1 2 1 2
//    3 4 3 4
//    1 2 1 2
//    3 4 3 4
```

## Installation

```javascript
$ npm install ndarray-tile
```

## API

#### `require('ndarray-tile')([output,] input, reps)`
Tile ndarray `input` a number of times according to `reps` in each dimension.

**Arguments**:

- `output` (optional): Optional output array. If not provided, storage is allocated using [`ndarray-scratch`](https://github.com/scijs/ndarray-scratch).
- `input`: The input ndarray to be tiled
- `reps`:  An `Array` containing The number of repetitions in each dimension. Each entry must be an integer greater than zero.
  - If the length of `reps` is less than the dimemsionality of `input`, the ommitted dimensions are implicitly assumed to be one.
  - If the length of reps is greater than the dimensionality of `input`, then `input` is tiled in the new dimensions as specified.

**Returns**: a reference to the tiled output

## License
&copy; 2016 Ricky Reusser. MIT License.
