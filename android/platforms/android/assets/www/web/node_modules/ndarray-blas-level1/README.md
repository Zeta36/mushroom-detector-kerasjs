# ndarray-blas-level1

[![Build Status][travis-image]][travis-url] [![npm version][npm-image]][npm-url]  [![Dependency Status][david-image]][david-url] [![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

[BLAS Level 1 operations](http://www.netlib.org/blas/) for [ndarrays](https://github.com/scijs/ndarray)

*A quick note on why this exists*: The goal is not to reinvent the wheel. There are lots of implementations of BLAS out there. Even for JS. There's a [nodejs wrapper for LAPACK](https://www.npmjs.com/package/lapack). Depending on what you need, maybe you should use that. The goal of this is to bring standardized BLAS operations to [ndarrays](https://github.com/scijs/ndarray) so that algorithms can be made as future-resistant as possible by writing them in terms of standardized, easily-translatable operations.

## Usage

This library implements the basic vector operations of the Level 1 Basic Linear Algebra Subprograms (BLAS). Many of these functions are also implemented in [ndarray-ops](https://github.com/scijs/ndarray-ops)—which also has functions that are not included in BLAS. So the right answer is probably some blend of the two. This library exists mainly to frame things in a relatively standard, coherent framework.

*NB: This library performs no checks to ensure you're only passing one-dimensional vectors. It simply iterates across the first dimension of the array, so if you pass it higher-dimensional arrays, don't expect a meaningful result.*

| Function | Operation | Description |
| -------- | --------- | ----------- |
| `swap(x,y)` | <img alt="x &bsol;leftrightarrow y" valign="middle" src="images/x-leftrightarrow-y-d6701cce16.png" width="57" height="32"> | Swap the elements of x and y |
| `scal(alpha,x)` | <img alt="x &bsol;leftarrow &bsol;alpha x" valign="middle" src="images/x-leftarrow-alpha-x-ac5492ee2b.png" width="71" height="28"> | Multiple vector x by scalar alpha |
| `copy(x,y)` | <img alt="y &bsol;leftarrow x" valign="middle" src="images/y-leftarrow-x-102cdc5897.png" width="57" height="32"> | Copy x into y |
| `axpy(alpha, x, y)` | <img alt="y &bsol;leftarrow &bsol;alpha x &plus; y" valign="middle" src="images/y-leftarrow-alpha-x-y-bd020b1eff.png" width="105" height="32"> | Multiple x by alpha and add it to y |
| `cpsc(alpha, x, y)` | <img alt="y &bsol;leftarrow &bsol;alpha x" valign="middle" src="images/y-leftarrow-alpha-x-38418573e1.png" width="70" height="32"> | Multiply x by alpha and assign it to y |
| `dot(x,y)` | <img alt="dot &bsol;leftarrow x&Hat;T y" valign="middle" src="images/dot-leftarrow-xt-y-7c5dabdf33.png" width="97" height="32"> | Calculate the inner product of x and y. |
| `nrm2(x)` | <img alt="nrm2 &bsol;leftarrow &vert;&vert;x&vert;&vert;&lowbar;2" valign="middle" src="images/nrm2-leftarrow-x_2-805a3d3f22.png" width="126.5" height="33">| Calculate the 2-norm of x |
| `asum(x)` | <img alt="asum &bsol;leftarrow &vert;&vert;x&vert;&vert;&lowbar;1" valign="middle" src="images/asum-leftarrow-x_1-d6c6e11b98.png" width="126.5" height="33"> | Calculate the 1-norm of x |
| `iamax(x)` |  <img alt="&bsol;underset&lcub;i&rcub; &lcub;&bsol;mathrm&lcub;argmax&rcub;&rcub; &vert;x&lowbar;i&vert;" valign="middle" src="images/underseti-mathrmargmax-x_i-0f60ac97fb.png" width="98" height="46.5"> | the argmax of x |
| `rotg(a,b)` |  <img alt="" valign="middle" src="images/rotg.png" height="46.5"> | Calculates the Givens rotation parameters [c, s, r]
 |

## Example

Usage should be pretty straightforward. There aren't really any options or variations.

```javascript
var blas1 = require('ndarray-blas-level1');

var x = ndarray([1,2,3]);
var y = ndarray([3,4,5]);

blas1.axpy(2, x, y);
```

## License
&copy; 2015 [Scijs](https://github.com/scijs). MIT License.

## Authors
Ricky Reusser, Philipp Burckhardt, Tim Bright

[travis-image]: https://travis-ci.org/scijs/ndarray-blas-level1.svg?branch=master
[travis-url]: https://travis-ci.org/scijs/ndarray-blas-level1
[npm-image]: https://badge.fury.io/js/ndarray-blas-level1.svg
[npm-url]: http://badge.fury.io/js/ndarray-blas-level1
[david-image]: https://david-dm.org/scijs/ndarray-blas-level1.svg
[david-url]: https://david-dm.org/scijs/ndarray-blas-level1