'use strict';

var MatrixGenerator = require('./rand-matrix-gen.js');
var printer = require('./debug-printer.js');
var show = require('ndarray-show');

describe('Matrix Creation Test', function () {
  it('matrix creation', function () {
    var matGen = new MatrixGenerator('seed string', Float64Array);
    var a;

    console.log('\n');
    console.log('General Matrix:');
    a = matGen.makeGeneralMatrix(5, 5);
    console.log(show(a));

    console.log('Banded Matrix: 1 lower, 2 upper diagonals:');
    a = matGen.makeBandedMatrix(5, 5, 1, 2);
    console.log(show(a));

    console.log('Symmetric Matrix:');
    a = matGen.makeSymmetricMatrix(5);
    console.log(show(a));

    console.log('Symmetric Banded Matrix: 2 off-diagonals:');
    a = matGen.makeSymmBandedMatrix(5, 2);
    console.log(show(a));

    console.log('Lower Triangular Banded Matrix:');
    a = matGen.makeTriangularMatrix(5, 5, true);
    console.log(show(a));

    console.log('Upper Triangular Banded Matrix:');
    a = matGen.makeTriangularMatrix(5, 5, false);
    console.log(show(a));

    console.log('Lower Packed Matrix:');
    a = matGen.makePackedMatrix(5);
    console.log(printer.printPackedMatrix(a, true));

    console.log('Upper Packed Matrix:');
    console.log(printer.printPackedMatrix(a, false));
  });
});
