var ndarray = require('ndarray')
var unsqueeze = require('../')
var show = require('ndarray-show')

console.log(show(unsqueeze(ndarray([1, 2, 3]))))
console.log(show(unsqueeze(ndarray([1, 2, 3]), 0)))
