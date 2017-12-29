'use strict';

Math.sign = Math.sign || function (x) {
  x = +x; // convert to a number
  if (x === 0 || isNaN(x)) {
    return x;
  }
  return x > 0 ? 1 : -1;
};

module.exports = function rotg (a, b, csr) {
  // Based on Algorithm 4 from "Discontinuous Plane
  // Rotations and the Symmetric Eigenvalue Problem"
  // by Anderson, 2000.
  var c = 0;
  var s = 0;
  var r = 0;
  var t = 0;
  var u = 0;

  if (b === 0) {
    c = Math.sign(a);
    s = 0;
    r = Math.abs(a);
  } else if (a === 0) {
    c = 0;
    s = Math.sign(b);
    r = Math.abs(b);
  } else if (Math.abs(a) > Math.abs(b)) {
    t = b / a;
    u = Math.sign(a) * Math.sqrt(1 + t * t);
    c = 1 / u;
    s = t * c;
    r = a * u;
  } else {
    t = a / b;
    u = Math.sign(a) * Math.sqrt(1 + t * t);
    s = 1 / u;
    c = t * s;
    r = b * u;
  }
  // try to save some unnecessary object creation
  if (csr !== undefined && csr.length > 2) {
    csr[0] = c;
    csr[1] = s;
    csr[2] = r;
  } else {
    return [c, s, r];
  }
};

