ndarray-unpack
==============
Converts an [ndarray](https://github.com/mikolalysenko/ndarray) into an array-of-native-arrays.  (Same format used by [numeric.js](http://www.numericjs.com/)).  Like all ndarray modules this works both in node.js and in the browser.

## Example

```javascript
//Create an ndarray and set a value
var x = require("zeros")([5,5])
x.set(2,2,1)

//Convert ndarray into array-of-arrays
console.log(require("unpack")(x))
```

## Install

    npm install ndarray-unpack
    
### `require("ndarray-unpack")(array)`
Converts `array` into an array-of-arrays style array.

* `array` is an ndarray

**Returns** An array-of-arrays having the same contents as `array`

## Credits
(c) 2013 Mikola Lysenko. MIT License