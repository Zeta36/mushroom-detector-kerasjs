# ndarray-squeeze [![Build Status](https://travis-ci.org/scijs/ndarray-squeeze.svg)](https://travis-ci.org/scijs/ndarray-squeeze) [![npm version](https://badge.fury.io/js/ndarray-squeeze.svg)](https://badge.fury.io/js/ndarray-squeeze) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

> Remove singleton dimensions from an ndarray

## Introduction

This module takes an input ndarray and removes any dimensions with length 1 or, optionally, specified dimensions with length 1.

## Examples

```javascript
var ndarray = require('ndarray')
var squeeze = require('ndarray-squeeze')

squeeze(ndarray([1, 2, 3, 4], [2, 1, 1, 2, 1]))
// => ndarray([1, 2, 3, 4], [2, 2])

squeeze(ndarray([1, 2, 3, 4], [2, 1, 1, 2, 1]), [1])
// => ndarray([1, 2, 3, 4], [2, 1, 2, 1])
```

## Installation

```javascript
$ npm install ndarray-squeeze
```

## API

#### `require('ndarray-squeeze')(input[, axes])`

Arguments:
- `input`: The input ndarray to be squeezed
- `axes` (optional):  An `Array` list of dimensions to be squeezed. Non-singleton dimensions will be ignored. If not provided, all singleton dimensions will be removed.

Returns:
A new array view of the squeezed ndarray (i.e. a new ndarray object with the same underlying data).

## See Also
- [`ndarray-unsqueeze`](https://github.com/scijs/ndarray-unsqueeze)

## License
&copy; 2016 Ricky Reusser. MIT License.
