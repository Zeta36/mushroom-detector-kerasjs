'use strict';

module.exports.gemv = require('./gemv');
module.exports.gbmv = require('./gbmv');
module.exports.symv = require('./symv');
module.exports.sbmv = require('./sbmv');
module.exports.spmv = require('./spmv');
module.exports.trmv = require('./trmv');
module.exports.tbmv = require('./tbmv');
module.exports.trsv = require('./trsv');
module.exports.tbsv = require('./tbsv');
module.exports.tpsv = require('./tpsv');
module.exports.ger = require('./ger');
module.exports.syr = require('./syr');
module.exports.spr = require('./spr');
module.exports.syr2 = require('./syr2');
module.exports.spr2 = require('./spr2');

module.exports.trmv_lower = function (A, x) {
  console.warn('trmv_lower is deprecated. Please use the \'isLower\' flag with trmv.');
  return module.exports.trmv(A, x, true);
};

module.exports.trsv_lower = function (A, x) {
  console.warn('trsv_lower is deprecated. Please use the \'isLower\' flag with trsv.');
  return module.exports.trsv(A, x, true);
};
