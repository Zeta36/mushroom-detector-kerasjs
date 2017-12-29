# ndarray-blas-level2

[![Build Status](https://travis-ci.org/scijs/ndarray-blas-level2.svg?branch=master)](https://travis-ci.org/scijs/ndarray-blas-level2) [![npm version](https://badge.fury.io/js/ndarray-blas-level2.svg)](http://badge.fury.io/js/ndarray-blas-level2) [![Dependency Status](https://david-dm.org/scijs/ndarray-blas-level2.svg)](https://david-dm.org/scijs/ndarray-blas-level2)

BLAS Level 2 operations for [ndarrays](https://github.com/scijs/ndarray)

## Usage

This library implements the basic matrix-vector operations of the Level 2 Basic Linear Algebra Subprograms (BLAS).

Note: It's possible to accomplish the lower triangular functions with the upper triangular version plus flipping and unflipping dimensions, but that's a little convoluted. Instead, the lower triangular versions are suffixed with \_lower just to keep it really simple.

### `gemv(alpha, A, x, beta, y)`
Calculate `y <- alpha*A*x + beta*y`

### `trmv(A, x, isLower)`
Calculate `x <- A*x` for the upper triangular matrix A. Data below the diagonal is ignored. If `isLower` is true, uses the lower triangular portion of A instead.

### `trsv(A, x, isLower)`
Calculate `x <- A^-1 x` for the upper triangular matrix A. Data below the diagonal is ignored.  If `isLower` is true, uses the lower triangular portion of A instead.

### `gbmv(A, kl, ku, x, y, alpha, beta)`
Calculates `y <- alpha*A*x + beta*y` for banded matrices. `kl` is the number of subdiagonals and `ku` are the number of super diagonals. `alpha` defaults to 1.0 and `beta` defaults to 0.0 if not specified.

### `symv(A, x, y, fromLower, alpha, beta)`
Calculates `y <- alpha*A*x + beta*y` for symmetric matrices. If `fromLower = true`, the function uses the lower triangular part of the matrix; for `false` it uses the upper triangular part. `alpha` defaults to 1.0 and `beta` defaults to 0.0 if not specified.

## Credits
&copy; 2016 Scijs Authors. MIT License.
