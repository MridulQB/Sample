var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value2) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value2);
};
var __privateSet = (obj, member, value2, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value2) : member.set(obj, value2);
  return value2;
};
var _actor;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const index$1 = "";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var buffer$1 = {};
var base64Js = {};
base64Js.byteLength = byteLength;
base64Js.toByteArray = toByteArray;
base64Js.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}
revLookup["-".charCodeAt(0)] = 62;
revLookup["_".charCodeAt(0)] = 63;
function getLens(b64) {
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error("Invalid string. Length must be a multiple of 4");
  }
  var validLen = b64.indexOf("=");
  if (validLen === -1)
    validLen = len;
  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
}
function byteLength(b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
  var curByte = 0;
  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
  var i;
  for (i = 0; i < len; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 255;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  return arr;
}
function tripletToBase64(num) {
  return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (uint8[i + 2] & 255);
    output.push(tripletToBase64(tmp));
  }
  return output.join("");
}
function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3;
  var parts = [];
  var maxChunkLength = 16383;
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(
      lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
    );
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(
      lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
    );
  }
  return parts.join("");
}
var ieee754$1 = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
ieee754$1.read = function(buffer2, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer2[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer2[offset + i], i += d, nBits -= 8) {
  }
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer2[offset + i], i += d, nBits -= 8) {
  }
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};
ieee754$1.write = function(buffer2, value2, offset, isLE, mLen, nBytes) {
  var e, m, c2;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value2 < 0 || value2 === 0 && 1 / value2 < 0 ? 1 : 0;
  value2 = Math.abs(value2);
  if (isNaN(value2) || value2 === Infinity) {
    m = isNaN(value2) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value2) / Math.LN2);
    if (value2 * (c2 = Math.pow(2, -e)) < 1) {
      e--;
      c2 *= 2;
    }
    if (e + eBias >= 1) {
      value2 += rt / c2;
    } else {
      value2 += rt * Math.pow(2, 1 - eBias);
    }
    if (value2 * c2 >= 2) {
      e++;
      c2 /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value2 * c2 - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value2 * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer2[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
  }
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer2[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
  }
  buffer2[offset + i - d] |= s * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(exports) {
  const base64 = base64Js;
  const ieee7542 = ieee754$1;
  const customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
  exports.Buffer = Buffer3;
  exports.SlowBuffer = SlowBuffer;
  exports.INSPECT_MAX_BYTES = 50;
  const K_MAX_LENGTH = 2147483647;
  exports.kMaxLength = K_MAX_LENGTH;
  Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
  if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
    console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
  }
  function typedArraySupport() {
    try {
      const arr = new Uint8Array(1);
      const proto = { foo: function() {
        return 42;
      } };
      Object.setPrototypeOf(proto, Uint8Array.prototype);
      Object.setPrototypeOf(arr, proto);
      return arr.foo() === 42;
    } catch (e) {
      return false;
    }
  }
  Object.defineProperty(Buffer3.prototype, "parent", {
    enumerable: true,
    get: function() {
      if (!Buffer3.isBuffer(this))
        return void 0;
      return this.buffer;
    }
  });
  Object.defineProperty(Buffer3.prototype, "offset", {
    enumerable: true,
    get: function() {
      if (!Buffer3.isBuffer(this))
        return void 0;
      return this.byteOffset;
    }
  });
  function createBuffer(length) {
    if (length > K_MAX_LENGTH) {
      throw new RangeError('The value "' + length + '" is invalid for option "size"');
    }
    const buf = new Uint8Array(length);
    Object.setPrototypeOf(buf, Buffer3.prototype);
    return buf;
  }
  function Buffer3(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      if (typeof encodingOrOffset === "string") {
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      }
      return allocUnsafe(arg);
    }
    return from(arg, encodingOrOffset, length);
  }
  Buffer3.poolSize = 8192;
  function from(value2, encodingOrOffset, length) {
    if (typeof value2 === "string") {
      return fromString(value2, encodingOrOffset);
    }
    if (ArrayBuffer.isView(value2)) {
      return fromArrayView(value2);
    }
    if (value2 == null) {
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value2
      );
    }
    if (isInstance(value2, ArrayBuffer) || value2 && isInstance(value2.buffer, ArrayBuffer)) {
      return fromArrayBuffer(value2, encodingOrOffset, length);
    }
    if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value2, SharedArrayBuffer) || value2 && isInstance(value2.buffer, SharedArrayBuffer))) {
      return fromArrayBuffer(value2, encodingOrOffset, length);
    }
    if (typeof value2 === "number") {
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    }
    const valueOf = value2.valueOf && value2.valueOf();
    if (valueOf != null && valueOf !== value2) {
      return Buffer3.from(valueOf, encodingOrOffset, length);
    }
    const b = fromObject(value2);
    if (b)
      return b;
    if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value2[Symbol.toPrimitive] === "function") {
      return Buffer3.from(value2[Symbol.toPrimitive]("string"), encodingOrOffset, length);
    }
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value2
    );
  }
  Buffer3.from = function(value2, encodingOrOffset, length) {
    return from(value2, encodingOrOffset, length);
  };
  Object.setPrototypeOf(Buffer3.prototype, Uint8Array.prototype);
  Object.setPrototypeOf(Buffer3, Uint8Array);
  function assertSize(size) {
    if (typeof size !== "number") {
      throw new TypeError('"size" argument must be of type number');
    } else if (size < 0) {
      throw new RangeError('The value "' + size + '" is invalid for option "size"');
    }
  }
  function alloc(size, fill, encoding) {
    assertSize(size);
    if (size <= 0) {
      return createBuffer(size);
    }
    if (fill !== void 0) {
      return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
    }
    return createBuffer(size);
  }
  Buffer3.alloc = function(size, fill, encoding) {
    return alloc(size, fill, encoding);
  };
  function allocUnsafe(size) {
    assertSize(size);
    return createBuffer(size < 0 ? 0 : checked(size) | 0);
  }
  Buffer3.allocUnsafe = function(size) {
    return allocUnsafe(size);
  };
  Buffer3.allocUnsafeSlow = function(size) {
    return allocUnsafe(size);
  };
  function fromString(string2, encoding) {
    if (typeof encoding !== "string" || encoding === "") {
      encoding = "utf8";
    }
    if (!Buffer3.isEncoding(encoding)) {
      throw new TypeError("Unknown encoding: " + encoding);
    }
    const length = byteLength2(string2, encoding) | 0;
    let buf = createBuffer(length);
    const actual = buf.write(string2, encoding);
    if (actual !== length) {
      buf = buf.slice(0, actual);
    }
    return buf;
  }
  function fromArrayLike(array2) {
    const length = array2.length < 0 ? 0 : checked(array2.length) | 0;
    const buf = createBuffer(length);
    for (let i = 0; i < length; i += 1) {
      buf[i] = array2[i] & 255;
    }
    return buf;
  }
  function fromArrayView(arrayView) {
    if (isInstance(arrayView, Uint8Array)) {
      const copy = new Uint8Array(arrayView);
      return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
    }
    return fromArrayLike(arrayView);
  }
  function fromArrayBuffer(array2, byteOffset, length) {
    if (byteOffset < 0 || array2.byteLength < byteOffset) {
      throw new RangeError('"offset" is outside of buffer bounds');
    }
    if (array2.byteLength < byteOffset + (length || 0)) {
      throw new RangeError('"length" is outside of buffer bounds');
    }
    let buf;
    if (byteOffset === void 0 && length === void 0) {
      buf = new Uint8Array(array2);
    } else if (length === void 0) {
      buf = new Uint8Array(array2, byteOffset);
    } else {
      buf = new Uint8Array(array2, byteOffset, length);
    }
    Object.setPrototypeOf(buf, Buffer3.prototype);
    return buf;
  }
  function fromObject(obj) {
    if (Buffer3.isBuffer(obj)) {
      const len = checked(obj.length) | 0;
      const buf = createBuffer(len);
      if (buf.length === 0) {
        return buf;
      }
      obj.copy(buf, 0, 0, len);
      return buf;
    }
    if (obj.length !== void 0) {
      if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
        return createBuffer(0);
      }
      return fromArrayLike(obj);
    }
    if (obj.type === "Buffer" && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data);
    }
  }
  function checked(length) {
    if (length >= K_MAX_LENGTH) {
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
    }
    return length | 0;
  }
  function SlowBuffer(length) {
    if (+length != length) {
      length = 0;
    }
    return Buffer3.alloc(+length);
  }
  Buffer3.isBuffer = function isBuffer(b) {
    return b != null && b._isBuffer === true && b !== Buffer3.prototype;
  };
  Buffer3.compare = function compare2(a, b) {
    if (isInstance(a, Uint8Array))
      a = Buffer3.from(a, a.offset, a.byteLength);
    if (isInstance(b, Uint8Array))
      b = Buffer3.from(b, b.offset, b.byteLength);
    if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b)) {
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    }
    if (a === b)
      return 0;
    let x = a.length;
    let y = b.length;
    for (let i = 0, len = Math.min(x, y); i < len; ++i) {
      if (a[i] !== b[i]) {
        x = a[i];
        y = b[i];
        break;
      }
    }
    if (x < y)
      return -1;
    if (y < x)
      return 1;
    return 0;
  };
  Buffer3.isEncoding = function isEncoding(encoding) {
    switch (String(encoding).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return true;
      default:
        return false;
    }
  };
  Buffer3.concat = function concat2(list, length) {
    if (!Array.isArray(list)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    if (list.length === 0) {
      return Buffer3.alloc(0);
    }
    let i;
    if (length === void 0) {
      length = 0;
      for (i = 0; i < list.length; ++i) {
        length += list[i].length;
      }
    }
    const buffer2 = Buffer3.allocUnsafe(length);
    let pos = 0;
    for (i = 0; i < list.length; ++i) {
      let buf = list[i];
      if (isInstance(buf, Uint8Array)) {
        if (pos + buf.length > buffer2.length) {
          if (!Buffer3.isBuffer(buf))
            buf = Buffer3.from(buf);
          buf.copy(buffer2, pos);
        } else {
          Uint8Array.prototype.set.call(
            buffer2,
            buf,
            pos
          );
        }
      } else if (!Buffer3.isBuffer(buf)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      } else {
        buf.copy(buffer2, pos);
      }
      pos += buf.length;
    }
    return buffer2;
  };
  function byteLength2(string2, encoding) {
    if (Buffer3.isBuffer(string2)) {
      return string2.length;
    }
    if (ArrayBuffer.isView(string2) || isInstance(string2, ArrayBuffer)) {
      return string2.byteLength;
    }
    if (typeof string2 !== "string") {
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string2
      );
    }
    const len = string2.length;
    const mustMatch = arguments.length > 2 && arguments[2] === true;
    if (!mustMatch && len === 0)
      return 0;
    let loweredCase = false;
    for (; ; ) {
      switch (encoding) {
        case "ascii":
        case "latin1":
        case "binary":
          return len;
        case "utf8":
        case "utf-8":
          return utf8ToBytes2(string2).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return len * 2;
        case "hex":
          return len >>> 1;
        case "base64":
          return base64ToBytes(string2).length;
        default:
          if (loweredCase) {
            return mustMatch ? -1 : utf8ToBytes2(string2).length;
          }
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer3.byteLength = byteLength2;
  function slowToString(encoding, start, end) {
    let loweredCase = false;
    if (start === void 0 || start < 0) {
      start = 0;
    }
    if (start > this.length) {
      return "";
    }
    if (end === void 0 || end > this.length) {
      end = this.length;
    }
    if (end <= 0) {
      return "";
    }
    end >>>= 0;
    start >>>= 0;
    if (end <= start) {
      return "";
    }
    if (!encoding)
      encoding = "utf8";
    while (true) {
      switch (encoding) {
        case "hex":
          return hexSlice(this, start, end);
        case "utf8":
        case "utf-8":
          return utf8Slice(this, start, end);
        case "ascii":
          return asciiSlice(this, start, end);
        case "latin1":
        case "binary":
          return latin1Slice(this, start, end);
        case "base64":
          return base64Slice(this, start, end);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return utf16leSlice(this, start, end);
        default:
          if (loweredCase)
            throw new TypeError("Unknown encoding: " + encoding);
          encoding = (encoding + "").toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer3.prototype._isBuffer = true;
  function swap(b, n, m) {
    const i = b[n];
    b[n] = b[m];
    b[m] = i;
  }
  Buffer3.prototype.swap16 = function swap16() {
    const len = this.length;
    if (len % 2 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    }
    for (let i = 0; i < len; i += 2) {
      swap(this, i, i + 1);
    }
    return this;
  };
  Buffer3.prototype.swap32 = function swap32() {
    const len = this.length;
    if (len % 4 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    }
    for (let i = 0; i < len; i += 4) {
      swap(this, i, i + 3);
      swap(this, i + 1, i + 2);
    }
    return this;
  };
  Buffer3.prototype.swap64 = function swap64() {
    const len = this.length;
    if (len % 8 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    }
    for (let i = 0; i < len; i += 8) {
      swap(this, i, i + 7);
      swap(this, i + 1, i + 6);
      swap(this, i + 2, i + 5);
      swap(this, i + 3, i + 4);
    }
    return this;
  };
  Buffer3.prototype.toString = function toString() {
    const length = this.length;
    if (length === 0)
      return "";
    if (arguments.length === 0)
      return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
  };
  Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
  Buffer3.prototype.equals = function equals(b) {
    if (!Buffer3.isBuffer(b))
      throw new TypeError("Argument must be a Buffer");
    if (this === b)
      return true;
    return Buffer3.compare(this, b) === 0;
  };
  Buffer3.prototype.inspect = function inspect() {
    let str = "";
    const max = exports.INSPECT_MAX_BYTES;
    str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
    if (this.length > max)
      str += " ... ";
    return "<Buffer " + str + ">";
  };
  if (customInspectSymbol) {
    Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
  }
  Buffer3.prototype.compare = function compare2(target, start, end, thisStart, thisEnd) {
    if (isInstance(target, Uint8Array)) {
      target = Buffer3.from(target, target.offset, target.byteLength);
    }
    if (!Buffer3.isBuffer(target)) {
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
      );
    }
    if (start === void 0) {
      start = 0;
    }
    if (end === void 0) {
      end = target ? target.length : 0;
    }
    if (thisStart === void 0) {
      thisStart = 0;
    }
    if (thisEnd === void 0) {
      thisEnd = this.length;
    }
    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
      throw new RangeError("out of range index");
    }
    if (thisStart >= thisEnd && start >= end) {
      return 0;
    }
    if (thisStart >= thisEnd) {
      return -1;
    }
    if (start >= end) {
      return 1;
    }
    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target)
      return 0;
    let x = thisEnd - thisStart;
    let y = end - start;
    const len = Math.min(x, y);
    const thisCopy = this.slice(thisStart, thisEnd);
    const targetCopy = target.slice(start, end);
    for (let i = 0; i < len; ++i) {
      if (thisCopy[i] !== targetCopy[i]) {
        x = thisCopy[i];
        y = targetCopy[i];
        break;
      }
    }
    if (x < y)
      return -1;
    if (y < x)
      return 1;
    return 0;
  };
  function bidirectionalIndexOf(buffer2, val, byteOffset, encoding, dir) {
    if (buffer2.length === 0)
      return -1;
    if (typeof byteOffset === "string") {
      encoding = byteOffset;
      byteOffset = 0;
    } else if (byteOffset > 2147483647) {
      byteOffset = 2147483647;
    } else if (byteOffset < -2147483648) {
      byteOffset = -2147483648;
    }
    byteOffset = +byteOffset;
    if (numberIsNaN(byteOffset)) {
      byteOffset = dir ? 0 : buffer2.length - 1;
    }
    if (byteOffset < 0)
      byteOffset = buffer2.length + byteOffset;
    if (byteOffset >= buffer2.length) {
      if (dir)
        return -1;
      else
        byteOffset = buffer2.length - 1;
    } else if (byteOffset < 0) {
      if (dir)
        byteOffset = 0;
      else
        return -1;
    }
    if (typeof val === "string") {
      val = Buffer3.from(val, encoding);
    }
    if (Buffer3.isBuffer(val)) {
      if (val.length === 0) {
        return -1;
      }
      return arrayIndexOf(buffer2, val, byteOffset, encoding, dir);
    } else if (typeof val === "number") {
      val = val & 255;
      if (typeof Uint8Array.prototype.indexOf === "function") {
        if (dir) {
          return Uint8Array.prototype.indexOf.call(buffer2, val, byteOffset);
        } else {
          return Uint8Array.prototype.lastIndexOf.call(buffer2, val, byteOffset);
        }
      }
      return arrayIndexOf(buffer2, [val], byteOffset, encoding, dir);
    }
    throw new TypeError("val must be string, number or Buffer");
  }
  function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    let indexSize = 1;
    let arrLength = arr.length;
    let valLength = val.length;
    if (encoding !== void 0) {
      encoding = String(encoding).toLowerCase();
      if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
        if (arr.length < 2 || val.length < 2) {
          return -1;
        }
        indexSize = 2;
        arrLength /= 2;
        valLength /= 2;
        byteOffset /= 2;
      }
    }
    function read(buf, i2) {
      if (indexSize === 1) {
        return buf[i2];
      } else {
        return buf.readUInt16BE(i2 * indexSize);
      }
    }
    let i;
    if (dir) {
      let foundIndex = -1;
      for (i = byteOffset; i < arrLength; i++) {
        if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
          if (foundIndex === -1)
            foundIndex = i;
          if (i - foundIndex + 1 === valLength)
            return foundIndex * indexSize;
        } else {
          if (foundIndex !== -1)
            i -= i - foundIndex;
          foundIndex = -1;
        }
      }
    } else {
      if (byteOffset + valLength > arrLength)
        byteOffset = arrLength - valLength;
      for (i = byteOffset; i >= 0; i--) {
        let found = true;
        for (let j = 0; j < valLength; j++) {
          if (read(arr, i + j) !== read(val, j)) {
            found = false;
            break;
          }
        }
        if (found)
          return i;
      }
    }
    return -1;
  }
  Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
  };
  Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
  };
  Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
  };
  function hexWrite(buf, string2, offset, length) {
    offset = Number(offset) || 0;
    const remaining = buf.length - offset;
    if (!length) {
      length = remaining;
    } else {
      length = Number(length);
      if (length > remaining) {
        length = remaining;
      }
    }
    const strLen = string2.length;
    if (length > strLen / 2) {
      length = strLen / 2;
    }
    let i;
    for (i = 0; i < length; ++i) {
      const parsed = parseInt(string2.substr(i * 2, 2), 16);
      if (numberIsNaN(parsed))
        return i;
      buf[offset + i] = parsed;
    }
    return i;
  }
  function utf8Write(buf, string2, offset, length) {
    return blitBuffer(utf8ToBytes2(string2, buf.length - offset), buf, offset, length);
  }
  function asciiWrite(buf, string2, offset, length) {
    return blitBuffer(asciiToBytes(string2), buf, offset, length);
  }
  function base64Write(buf, string2, offset, length) {
    return blitBuffer(base64ToBytes(string2), buf, offset, length);
  }
  function ucs2Write(buf, string2, offset, length) {
    return blitBuffer(utf16leToBytes(string2, buf.length - offset), buf, offset, length);
  }
  Buffer3.prototype.write = function write(string2, offset, length, encoding) {
    if (offset === void 0) {
      encoding = "utf8";
      length = this.length;
      offset = 0;
    } else if (length === void 0 && typeof offset === "string") {
      encoding = offset;
      length = this.length;
      offset = 0;
    } else if (isFinite(offset)) {
      offset = offset >>> 0;
      if (isFinite(length)) {
        length = length >>> 0;
        if (encoding === void 0)
          encoding = "utf8";
      } else {
        encoding = length;
        length = void 0;
      }
    } else {
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    }
    const remaining = this.length - offset;
    if (length === void 0 || length > remaining)
      length = remaining;
    if (string2.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
      throw new RangeError("Attempt to write outside buffer bounds");
    }
    if (!encoding)
      encoding = "utf8";
    let loweredCase = false;
    for (; ; ) {
      switch (encoding) {
        case "hex":
          return hexWrite(this, string2, offset, length);
        case "utf8":
        case "utf-8":
          return utf8Write(this, string2, offset, length);
        case "ascii":
        case "latin1":
        case "binary":
          return asciiWrite(this, string2, offset, length);
        case "base64":
          return base64Write(this, string2, offset, length);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return ucs2Write(this, string2, offset, length);
        default:
          if (loweredCase)
            throw new TypeError("Unknown encoding: " + encoding);
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  };
  Buffer3.prototype.toJSON = function toJSON() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) {
      return base64.fromByteArray(buf);
    } else {
      return base64.fromByteArray(buf.slice(start, end));
    }
  }
  function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    const res = [];
    let i = start;
    while (i < end) {
      const firstByte = buf[i];
      let codePoint = null;
      let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
      if (i + bytesPerSequence <= end) {
        let secondByte, thirdByte, fourthByte, tempCodePoint;
        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 128) {
              codePoint = firstByte;
            }
            break;
          case 2:
            secondByte = buf[i + 1];
            if ((secondByte & 192) === 128) {
              tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
              if (tempCodePoint > 127) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 3:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
              if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 4:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            fourthByte = buf[i + 3];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
              if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                codePoint = tempCodePoint;
              }
            }
        }
      }
      if (codePoint === null) {
        codePoint = 65533;
        bytesPerSequence = 1;
      } else if (codePoint > 65535) {
        codePoint -= 65536;
        res.push(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      res.push(codePoint);
      i += bytesPerSequence;
    }
    return decodeCodePointsArray(res);
  }
  const MAX_ARGUMENTS_LENGTH = 4096;
  function decodeCodePointsArray(codePoints) {
    const len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints);
    }
    let res = "";
    let i = 0;
    while (i < len) {
      res += String.fromCharCode.apply(
        String,
        codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
      );
    }
    return res;
  }
  function asciiSlice(buf, start, end) {
    let ret = "";
    end = Math.min(buf.length, end);
    for (let i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i] & 127);
    }
    return ret;
  }
  function latin1Slice(buf, start, end) {
    let ret = "";
    end = Math.min(buf.length, end);
    for (let i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i]);
    }
    return ret;
  }
  function hexSlice(buf, start, end) {
    const len = buf.length;
    if (!start || start < 0)
      start = 0;
    if (!end || end < 0 || end > len)
      end = len;
    let out = "";
    for (let i = start; i < end; ++i) {
      out += hexSliceLookupTable[buf[i]];
    }
    return out;
  }
  function utf16leSlice(buf, start, end) {
    const bytes2 = buf.slice(start, end);
    let res = "";
    for (let i = 0; i < bytes2.length - 1; i += 2) {
      res += String.fromCharCode(bytes2[i] + bytes2[i + 1] * 256);
    }
    return res;
  }
  Buffer3.prototype.slice = function slice(start, end) {
    const len = this.length;
    start = ~~start;
    end = end === void 0 ? len : ~~end;
    if (start < 0) {
      start += len;
      if (start < 0)
        start = 0;
    } else if (start > len) {
      start = len;
    }
    if (end < 0) {
      end += len;
      if (end < 0)
        end = 0;
    } else if (end > len) {
      end = len;
    }
    if (end < start)
      end = start;
    const newBuf = this.subarray(start, end);
    Object.setPrototypeOf(newBuf, Buffer3.prototype);
    return newBuf;
  };
  function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0)
      throw new RangeError("offset is not uint");
    if (offset + ext > length)
      throw new RangeError("Trying to access beyond buffer length");
  }
  Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE2(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert)
      checkOffset(offset, byteLength3, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;
    while (++i < byteLength3 && (mul *= 256)) {
      val += this[offset + i] * mul;
    }
    return val;
  };
  Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      checkOffset(offset, byteLength3, this.length);
    }
    let val = this[offset + --byteLength3];
    let mul = 1;
    while (byteLength3 > 0 && (mul *= 256)) {
      val += this[offset + --byteLength3] * mul;
    }
    return val;
  };
  Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 1, this.length);
    return this[offset];
  };
  Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
  };
  Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
  };
  Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
  };
  Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
  };
  Buffer3.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === void 0 || last === void 0) {
      boundsError(offset, this.length - 8);
    }
    const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
    const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
    return BigInt(lo) + (BigInt(hi) << BigInt(32));
  });
  Buffer3.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === void 0 || last === void 0) {
      boundsError(offset, this.length - 8);
    }
    const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
    const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
    return (BigInt(hi) << BigInt(32)) + BigInt(lo);
  });
  Buffer3.prototype.readIntLE = function readIntLE2(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert)
      checkOffset(offset, byteLength3, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;
    while (++i < byteLength3 && (mul *= 256)) {
      val += this[offset + i] * mul;
    }
    mul *= 128;
    if (val >= mul)
      val -= Math.pow(2, 8 * byteLength3);
    return val;
  };
  Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert)
      checkOffset(offset, byteLength3, this.length);
    let i = byteLength3;
    let mul = 1;
    let val = this[offset + --i];
    while (i > 0 && (mul *= 256)) {
      val += this[offset + --i] * mul;
    }
    mul *= 128;
    if (val >= mul)
      val -= Math.pow(2, 8 * byteLength3);
    return val;
  };
  Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 1, this.length);
    if (!(this[offset] & 128))
      return this[offset];
    return (255 - this[offset] + 1) * -1;
  };
  Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    const val = this[offset] | this[offset + 1] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    const val = this[offset + 1] | this[offset] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
  };
  Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
  };
  Buffer3.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === void 0 || last === void 0) {
      boundsError(offset, this.length - 8);
    }
    const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
    return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
  });
  Buffer3.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === void 0 || last === void 0) {
      boundsError(offset, this.length - 8);
    }
    const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
    return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
  });
  Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return ieee7542.read(this, offset, true, 23, 4);
  };
  Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return ieee7542.read(this, offset, false, 23, 4);
  };
  Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 8, this.length);
    return ieee7542.read(this, offset, true, 52, 8);
  };
  Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 8, this.length);
    return ieee7542.read(this, offset, false, 52, 8);
  };
  function checkInt(buf, value2, offset, ext, max, min) {
    if (!Buffer3.isBuffer(buf))
      throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value2 > max || value2 < min)
      throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length)
      throw new RangeError("Index out of range");
  }
  Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE2(value2, offset, byteLength3, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      const maxBytes = Math.pow(2, 8 * byteLength3) - 1;
      checkInt(this, value2, offset, byteLength3, maxBytes, 0);
    }
    let mul = 1;
    let i = 0;
    this[offset] = value2 & 255;
    while (++i < byteLength3 && (mul *= 256)) {
      this[offset + i] = value2 / mul & 255;
    }
    return offset + byteLength3;
  };
  Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value2, offset, byteLength3, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      const maxBytes = Math.pow(2, 8 * byteLength3) - 1;
      checkInt(this, value2, offset, byteLength3, maxBytes, 0);
    }
    let i = byteLength3 - 1;
    let mul = 1;
    this[offset + i] = value2 & 255;
    while (--i >= 0 && (mul *= 256)) {
      this[offset + i] = value2 / mul & 255;
    }
    return offset + byteLength3;
  };
  Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 1, 255, 0);
    this[offset] = value2 & 255;
    return offset + 1;
  };
  Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 2, 65535, 0);
    this[offset] = value2 & 255;
    this[offset + 1] = value2 >>> 8;
    return offset + 2;
  };
  Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 2, 65535, 0);
    this[offset] = value2 >>> 8;
    this[offset + 1] = value2 & 255;
    return offset + 2;
  };
  Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 4, 4294967295, 0);
    this[offset + 3] = value2 >>> 24;
    this[offset + 2] = value2 >>> 16;
    this[offset + 1] = value2 >>> 8;
    this[offset] = value2 & 255;
    return offset + 4;
  };
  Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 4, 4294967295, 0);
    this[offset] = value2 >>> 24;
    this[offset + 1] = value2 >>> 16;
    this[offset + 2] = value2 >>> 8;
    this[offset + 3] = value2 & 255;
    return offset + 4;
  };
  function wrtBigUInt64LE(buf, value2, offset, min, max) {
    checkIntBI(value2, min, max, buf, offset, 7);
    let lo = Number(value2 & BigInt(4294967295));
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    let hi = Number(value2 >> BigInt(32) & BigInt(4294967295));
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    return offset;
  }
  function wrtBigUInt64BE(buf, value2, offset, min, max) {
    checkIntBI(value2, min, max, buf, offset, 7);
    let lo = Number(value2 & BigInt(4294967295));
    buf[offset + 7] = lo;
    lo = lo >> 8;
    buf[offset + 6] = lo;
    lo = lo >> 8;
    buf[offset + 5] = lo;
    lo = lo >> 8;
    buf[offset + 4] = lo;
    let hi = Number(value2 >> BigInt(32) & BigInt(4294967295));
    buf[offset + 3] = hi;
    hi = hi >> 8;
    buf[offset + 2] = hi;
    hi = hi >> 8;
    buf[offset + 1] = hi;
    hi = hi >> 8;
    buf[offset] = hi;
    return offset + 8;
  }
  Buffer3.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value2, offset = 0) {
    return wrtBigUInt64LE(this, value2, offset, BigInt(0), BigInt("0xffffffffffffffff"));
  });
  Buffer3.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value2, offset = 0) {
    return wrtBigUInt64BE(this, value2, offset, BigInt(0), BigInt("0xffffffffffffffff"));
  });
  Buffer3.prototype.writeIntLE = function writeIntLE2(value2, offset, byteLength3, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert) {
      const limit = Math.pow(2, 8 * byteLength3 - 1);
      checkInt(this, value2, offset, byteLength3, limit - 1, -limit);
    }
    let i = 0;
    let mul = 1;
    let sub = 0;
    this[offset] = value2 & 255;
    while (++i < byteLength3 && (mul *= 256)) {
      if (value2 < 0 && sub === 0 && this[offset + i - 1] !== 0) {
        sub = 1;
      }
      this[offset + i] = (value2 / mul >> 0) - sub & 255;
    }
    return offset + byteLength3;
  };
  Buffer3.prototype.writeIntBE = function writeIntBE(value2, offset, byteLength3, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert) {
      const limit = Math.pow(2, 8 * byteLength3 - 1);
      checkInt(this, value2, offset, byteLength3, limit - 1, -limit);
    }
    let i = byteLength3 - 1;
    let mul = 1;
    let sub = 0;
    this[offset + i] = value2 & 255;
    while (--i >= 0 && (mul *= 256)) {
      if (value2 < 0 && sub === 0 && this[offset + i + 1] !== 0) {
        sub = 1;
      }
      this[offset + i] = (value2 / mul >> 0) - sub & 255;
    }
    return offset + byteLength3;
  };
  Buffer3.prototype.writeInt8 = function writeInt8(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 1, 127, -128);
    if (value2 < 0)
      value2 = 255 + value2 + 1;
    this[offset] = value2 & 255;
    return offset + 1;
  };
  Buffer3.prototype.writeInt16LE = function writeInt16LE(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 2, 32767, -32768);
    this[offset] = value2 & 255;
    this[offset + 1] = value2 >>> 8;
    return offset + 2;
  };
  Buffer3.prototype.writeInt16BE = function writeInt16BE(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 2, 32767, -32768);
    this[offset] = value2 >>> 8;
    this[offset + 1] = value2 & 255;
    return offset + 2;
  };
  Buffer3.prototype.writeInt32LE = function writeInt32LE(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 4, 2147483647, -2147483648);
    this[offset] = value2 & 255;
    this[offset + 1] = value2 >>> 8;
    this[offset + 2] = value2 >>> 16;
    this[offset + 3] = value2 >>> 24;
    return offset + 4;
  };
  Buffer3.prototype.writeInt32BE = function writeInt32BE(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 4, 2147483647, -2147483648);
    if (value2 < 0)
      value2 = 4294967295 + value2 + 1;
    this[offset] = value2 >>> 24;
    this[offset + 1] = value2 >>> 16;
    this[offset + 2] = value2 >>> 8;
    this[offset + 3] = value2 & 255;
    return offset + 4;
  };
  Buffer3.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value2, offset = 0) {
    return wrtBigUInt64LE(this, value2, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  Buffer3.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value2, offset = 0) {
    return wrtBigUInt64BE(this, value2, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function checkIEEE754(buf, value2, offset, ext, max, min) {
    if (offset + ext > buf.length)
      throw new RangeError("Index out of range");
    if (offset < 0)
      throw new RangeError("Index out of range");
  }
  function writeFloat(buf, value2, offset, littleEndian, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf, value2, offset, 4);
    }
    ieee7542.write(buf, value2, offset, littleEndian, 23, 4);
    return offset + 4;
  }
  Buffer3.prototype.writeFloatLE = function writeFloatLE(value2, offset, noAssert) {
    return writeFloat(this, value2, offset, true, noAssert);
  };
  Buffer3.prototype.writeFloatBE = function writeFloatBE(value2, offset, noAssert) {
    return writeFloat(this, value2, offset, false, noAssert);
  };
  function writeDouble(buf, value2, offset, littleEndian, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf, value2, offset, 8);
    }
    ieee7542.write(buf, value2, offset, littleEndian, 52, 8);
    return offset + 8;
  }
  Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value2, offset, noAssert) {
    return writeDouble(this, value2, offset, true, noAssert);
  };
  Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value2, offset, noAssert) {
    return writeDouble(this, value2, offset, false, noAssert);
  };
  Buffer3.prototype.copy = function copy(target, targetStart, start, end) {
    if (!Buffer3.isBuffer(target))
      throw new TypeError("argument should be a Buffer");
    if (!start)
      start = 0;
    if (!end && end !== 0)
      end = this.length;
    if (targetStart >= target.length)
      targetStart = target.length;
    if (!targetStart)
      targetStart = 0;
    if (end > 0 && end < start)
      end = start;
    if (end === start)
      return 0;
    if (target.length === 0 || this.length === 0)
      return 0;
    if (targetStart < 0) {
      throw new RangeError("targetStart out of bounds");
    }
    if (start < 0 || start >= this.length)
      throw new RangeError("Index out of range");
    if (end < 0)
      throw new RangeError("sourceEnd out of bounds");
    if (end > this.length)
      end = this.length;
    if (target.length - targetStart < end - start) {
      end = target.length - targetStart + start;
    }
    const len = end - start;
    if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
      this.copyWithin(targetStart, start, end);
    } else {
      Uint8Array.prototype.set.call(
        target,
        this.subarray(start, end),
        targetStart
      );
    }
    return len;
  };
  Buffer3.prototype.fill = function fill(val, start, end, encoding) {
    if (typeof val === "string") {
      if (typeof start === "string") {
        encoding = start;
        start = 0;
        end = this.length;
      } else if (typeof end === "string") {
        encoding = end;
        end = this.length;
      }
      if (encoding !== void 0 && typeof encoding !== "string") {
        throw new TypeError("encoding must be a string");
      }
      if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      if (val.length === 1) {
        const code2 = val.charCodeAt(0);
        if (encoding === "utf8" && code2 < 128 || encoding === "latin1") {
          val = code2;
        }
      }
    } else if (typeof val === "number") {
      val = val & 255;
    } else if (typeof val === "boolean") {
      val = Number(val);
    }
    if (start < 0 || this.length < start || this.length < end) {
      throw new RangeError("Out of range index");
    }
    if (end <= start) {
      return this;
    }
    start = start >>> 0;
    end = end === void 0 ? this.length : end >>> 0;
    if (!val)
      val = 0;
    let i;
    if (typeof val === "number") {
      for (i = start; i < end; ++i) {
        this[i] = val;
      }
    } else {
      const bytes2 = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
      const len = bytes2.length;
      if (len === 0) {
        throw new TypeError('The value "' + val + '" is invalid for argument "value"');
      }
      for (i = 0; i < end - start; ++i) {
        this[i + start] = bytes2[i % len];
      }
    }
    return this;
  };
  const errors = {};
  function E(sym, getMessage, Base) {
    errors[sym] = class NodeError extends Base {
      constructor() {
        super();
        Object.defineProperty(this, "message", {
          value: getMessage.apply(this, arguments),
          writable: true,
          configurable: true
        });
        this.name = `${this.name} [${sym}]`;
        this.stack;
        delete this.name;
      }
      get code() {
        return sym;
      }
      set code(value2) {
        Object.defineProperty(this, "code", {
          configurable: true,
          enumerable: true,
          value: value2,
          writable: true
        });
      }
      toString() {
        return `${this.name} [${sym}]: ${this.message}`;
      }
    };
  }
  E(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(name) {
      if (name) {
        return `${name} is outside of buffer bounds`;
      }
      return "Attempt to access memory outside buffer bounds";
    },
    RangeError
  );
  E(
    "ERR_INVALID_ARG_TYPE",
    function(name, actual) {
      return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
    },
    TypeError
  );
  E(
    "ERR_OUT_OF_RANGE",
    function(str, range, input) {
      let msg = `The value of "${str}" is out of range.`;
      let received = input;
      if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
        received = addNumericalSeparator(String(input));
      } else if (typeof input === "bigint") {
        received = String(input);
        if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
          received = addNumericalSeparator(received);
        }
        received += "n";
      }
      msg += ` It must be ${range}. Received ${received}`;
      return msg;
    },
    RangeError
  );
  function addNumericalSeparator(val) {
    let res = "";
    let i = val.length;
    const start = val[0] === "-" ? 1 : 0;
    for (; i >= start + 4; i -= 3) {
      res = `_${val.slice(i - 3, i)}${res}`;
    }
    return `${val.slice(0, i)}${res}`;
  }
  function checkBounds(buf, offset, byteLength3) {
    validateNumber(offset, "offset");
    if (buf[offset] === void 0 || buf[offset + byteLength3] === void 0) {
      boundsError(offset, buf.length - (byteLength3 + 1));
    }
  }
  function checkIntBI(value2, min, max, buf, offset, byteLength3) {
    if (value2 > max || value2 < min) {
      const n = typeof min === "bigint" ? "n" : "";
      let range;
      if (byteLength3 > 3) {
        if (min === 0 || min === BigInt(0)) {
          range = `>= 0${n} and < 2${n} ** ${(byteLength3 + 1) * 8}${n}`;
        } else {
          range = `>= -(2${n} ** ${(byteLength3 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength3 + 1) * 8 - 1}${n}`;
        }
      } else {
        range = `>= ${min}${n} and <= ${max}${n}`;
      }
      throw new errors.ERR_OUT_OF_RANGE("value", range, value2);
    }
    checkBounds(buf, offset, byteLength3);
  }
  function validateNumber(value2, name) {
    if (typeof value2 !== "number") {
      throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value2);
    }
  }
  function boundsError(value2, length, type) {
    if (Math.floor(value2) !== value2) {
      validateNumber(value2, type);
      throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value2);
    }
    if (length < 0) {
      throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
    }
    throw new errors.ERR_OUT_OF_RANGE(
      type || "offset",
      `>= ${type ? 1 : 0} and <= ${length}`,
      value2
    );
  }
  const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
  function base64clean(str) {
    str = str.split("=")[0];
    str = str.trim().replace(INVALID_BASE64_RE, "");
    if (str.length < 2)
      return "";
    while (str.length % 4 !== 0) {
      str = str + "=";
    }
    return str;
  }
  function utf8ToBytes2(string2, units) {
    units = units || Infinity;
    let codePoint;
    const length = string2.length;
    let leadSurrogate = null;
    const bytes2 = [];
    for (let i = 0; i < length; ++i) {
      codePoint = string2.charCodeAt(i);
      if (codePoint > 55295 && codePoint < 57344) {
        if (!leadSurrogate) {
          if (codePoint > 56319) {
            if ((units -= 3) > -1)
              bytes2.push(239, 191, 189);
            continue;
          } else if (i + 1 === length) {
            if ((units -= 3) > -1)
              bytes2.push(239, 191, 189);
            continue;
          }
          leadSurrogate = codePoint;
          continue;
        }
        if (codePoint < 56320) {
          if ((units -= 3) > -1)
            bytes2.push(239, 191, 189);
          leadSurrogate = codePoint;
          continue;
        }
        codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
      } else if (leadSurrogate) {
        if ((units -= 3) > -1)
          bytes2.push(239, 191, 189);
      }
      leadSurrogate = null;
      if (codePoint < 128) {
        if ((units -= 1) < 0)
          break;
        bytes2.push(codePoint);
      } else if (codePoint < 2048) {
        if ((units -= 2) < 0)
          break;
        bytes2.push(
          codePoint >> 6 | 192,
          codePoint & 63 | 128
        );
      } else if (codePoint < 65536) {
        if ((units -= 3) < 0)
          break;
        bytes2.push(
          codePoint >> 12 | 224,
          codePoint >> 6 & 63 | 128,
          codePoint & 63 | 128
        );
      } else if (codePoint < 1114112) {
        if ((units -= 4) < 0)
          break;
        bytes2.push(
          codePoint >> 18 | 240,
          codePoint >> 12 & 63 | 128,
          codePoint >> 6 & 63 | 128,
          codePoint & 63 | 128
        );
      } else {
        throw new Error("Invalid code point");
      }
    }
    return bytes2;
  }
  function asciiToBytes(str) {
    const byteArray = [];
    for (let i = 0; i < str.length; ++i) {
      byteArray.push(str.charCodeAt(i) & 255);
    }
    return byteArray;
  }
  function utf16leToBytes(str, units) {
    let c2, hi, lo;
    const byteArray = [];
    for (let i = 0; i < str.length; ++i) {
      if ((units -= 2) < 0)
        break;
      c2 = str.charCodeAt(i);
      hi = c2 >> 8;
      lo = c2 % 256;
      byteArray.push(lo);
      byteArray.push(hi);
    }
    return byteArray;
  }
  function base64ToBytes(str) {
    return base64.toByteArray(base64clean(str));
  }
  function blitBuffer(src2, dst, offset, length) {
    let i;
    for (i = 0; i < length; ++i) {
      if (i + offset >= dst.length || i >= src2.length)
        break;
      dst[i + offset] = src2[i];
    }
    return i;
  }
  function isInstance(obj, type) {
    return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
  }
  function numberIsNaN(obj) {
    return obj !== obj;
  }
  const hexSliceLookupTable = function() {
    const alphabet2 = "0123456789abcdef";
    const table = new Array(256);
    for (let i = 0; i < 16; ++i) {
      const i162 = i * 16;
      for (let j = 0; j < 16; ++j) {
        table[i162 + j] = alphabet2[i] + alphabet2[j];
      }
    }
    return table;
  }();
  function defineBigIntMethod(fn) {
    return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
  }
  function BufferBigIntNotDefined() {
    throw new Error("BigInt not supported");
  }
})(buffer$1);
var ReplicaRejectCode;
(function(ReplicaRejectCode2) {
  ReplicaRejectCode2[ReplicaRejectCode2["SysFatal"] = 1] = "SysFatal";
  ReplicaRejectCode2[ReplicaRejectCode2["SysTransient"] = 2] = "SysTransient";
  ReplicaRejectCode2[ReplicaRejectCode2["DestinationInvalid"] = 3] = "DestinationInvalid";
  ReplicaRejectCode2[ReplicaRejectCode2["CanisterReject"] = 4] = "CanisterReject";
  ReplicaRejectCode2[ReplicaRejectCode2["CanisterError"] = 5] = "CanisterError";
})(ReplicaRejectCode || (ReplicaRejectCode = {}));
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  const links = document.getElementsByTagName("link");
  return Promise.all(deps.map((dep) => {
    dep = assetsURL(dep);
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    const isBaseRelative = !!importerUrl;
    if (isBaseRelative) {
      for (let i = links.length - 1; i >= 0; i--) {
        const link2 = links[i];
        if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
          return;
        }
      }
    } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule()).catch((err) => {
    const e = new Event("vite:preloadError", { cancelable: true });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  });
};
const alphabet = "abcdefghijklmnopqrstuvwxyz234567";
const lookupTable = /* @__PURE__ */ Object.create(null);
for (let i = 0; i < alphabet.length; i++) {
  lookupTable[alphabet[i]] = i;
}
lookupTable["0"] = lookupTable.o;
lookupTable["1"] = lookupTable.i;
function encode$2(input) {
  let skip = 0;
  let bits = 0;
  let output = "";
  function encodeByte(byte) {
    if (skip < 0) {
      bits |= byte >> -skip;
    } else {
      bits = byte << skip & 248;
    }
    if (skip > 3) {
      skip -= 8;
      return 1;
    }
    if (skip < 4) {
      output += alphabet[bits >> 3];
      skip += 5;
    }
    return 0;
  }
  for (let i = 0; i < input.length; ) {
    i += encodeByte(input[i]);
  }
  return output + (skip < 0 ? alphabet[bits >> 3] : "");
}
function decode$2(input) {
  let skip = 0;
  let byte = 0;
  const output = new Uint8Array(input.length * 4 / 3 | 0);
  let o = 0;
  function decodeChar(char) {
    let val = lookupTable[char.toLowerCase()];
    if (val === void 0) {
      throw new Error(`Invalid character: ${JSON.stringify(char)}`);
    }
    val <<= 3;
    byte |= val >>> skip;
    skip += 5;
    if (skip >= 8) {
      output[o++] = byte;
      skip -= 8;
      if (skip > 0) {
        byte = val << 5 - skip & 255;
      } else {
        byte = 0;
      }
    }
  }
  for (const c2 of input) {
    decodeChar(c2);
  }
  return output.slice(0, o);
}
const lookUpTable = new Uint32Array([
  0,
  1996959894,
  3993919788,
  2567524794,
  124634137,
  1886057615,
  3915621685,
  2657392035,
  249268274,
  2044508324,
  3772115230,
  2547177864,
  162941995,
  2125561021,
  3887607047,
  2428444049,
  498536548,
  1789927666,
  4089016648,
  2227061214,
  450548861,
  1843258603,
  4107580753,
  2211677639,
  325883990,
  1684777152,
  4251122042,
  2321926636,
  335633487,
  1661365465,
  4195302755,
  2366115317,
  997073096,
  1281953886,
  3579855332,
  2724688242,
  1006888145,
  1258607687,
  3524101629,
  2768942443,
  901097722,
  1119000684,
  3686517206,
  2898065728,
  853044451,
  1172266101,
  3705015759,
  2882616665,
  651767980,
  1373503546,
  3369554304,
  3218104598,
  565507253,
  1454621731,
  3485111705,
  3099436303,
  671266974,
  1594198024,
  3322730930,
  2970347812,
  795835527,
  1483230225,
  3244367275,
  3060149565,
  1994146192,
  31158534,
  2563907772,
  4023717930,
  1907459465,
  112637215,
  2680153253,
  3904427059,
  2013776290,
  251722036,
  2517215374,
  3775830040,
  2137656763,
  141376813,
  2439277719,
  3865271297,
  1802195444,
  476864866,
  2238001368,
  4066508878,
  1812370925,
  453092731,
  2181625025,
  4111451223,
  1706088902,
  314042704,
  2344532202,
  4240017532,
  1658658271,
  366619977,
  2362670323,
  4224994405,
  1303535960,
  984961486,
  2747007092,
  3569037538,
  1256170817,
  1037604311,
  2765210733,
  3554079995,
  1131014506,
  879679996,
  2909243462,
  3663771856,
  1141124467,
  855842277,
  2852801631,
  3708648649,
  1342533948,
  654459306,
  3188396048,
  3373015174,
  1466479909,
  544179635,
  3110523913,
  3462522015,
  1591671054,
  702138776,
  2966460450,
  3352799412,
  1504918807,
  783551873,
  3082640443,
  3233442989,
  3988292384,
  2596254646,
  62317068,
  1957810842,
  3939845945,
  2647816111,
  81470997,
  1943803523,
  3814918930,
  2489596804,
  225274430,
  2053790376,
  3826175755,
  2466906013,
  167816743,
  2097651377,
  4027552580,
  2265490386,
  503444072,
  1762050814,
  4150417245,
  2154129355,
  426522225,
  1852507879,
  4275313526,
  2312317920,
  282753626,
  1742555852,
  4189708143,
  2394877945,
  397917763,
  1622183637,
  3604390888,
  2714866558,
  953729732,
  1340076626,
  3518719985,
  2797360999,
  1068828381,
  1219638859,
  3624741850,
  2936675148,
  906185462,
  1090812512,
  3747672003,
  2825379669,
  829329135,
  1181335161,
  3412177804,
  3160834842,
  628085408,
  1382605366,
  3423369109,
  3138078467,
  570562233,
  1426400815,
  3317316542,
  2998733608,
  733239954,
  1555261956,
  3268935591,
  3050360625,
  752459403,
  1541320221,
  2607071920,
  3965973030,
  1969922972,
  40735498,
  2617837225,
  3943577151,
  1913087877,
  83908371,
  2512341634,
  3803740692,
  2075208622,
  213261112,
  2463272603,
  3855990285,
  2094854071,
  198958881,
  2262029012,
  4057260610,
  1759359992,
  534414190,
  2176718541,
  4139329115,
  1873836001,
  414664567,
  2282248934,
  4279200368,
  1711684554,
  285281116,
  2405801727,
  4167216745,
  1634467795,
  376229701,
  2685067896,
  3608007406,
  1308918612,
  956543938,
  2808555105,
  3495958263,
  1231636301,
  1047427035,
  2932959818,
  3654703836,
  1088359270,
  936918e3,
  2847714899,
  3736837829,
  1202900863,
  817233897,
  3183342108,
  3401237130,
  1404277552,
  615818150,
  3134207493,
  3453421203,
  1423857449,
  601450431,
  3009837614,
  3294710456,
  1567103746,
  711928724,
  3020668471,
  3272380065,
  1510334235,
  755167117
]);
function getCrc32(buf) {
  const b = new Uint8Array(buf);
  let crc = -1;
  for (let i = 0; i < b.length; i++) {
    const byte = b[i];
    const t = (byte ^ crc) & 255;
    crc = lookUpTable[t] ^ crc >>> 8;
  }
  return (crc ^ -1) >>> 0;
}
function isBytes$1(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function abytes$1(b, ...lengths) {
  if (!isBytes$1(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes$1(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
const crypto$1 = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
const rotr = (word, shift) => word << 32 - shift | word >>> shift;
function utf8ToBytes$1(str) {
  if (typeof str !== "string")
    throw new Error("utf8ToBytes expected string, got " + typeof str);
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes$1(data);
  abytes$1(data);
  return data;
}
class Hash {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function wrapConstructor(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function randomBytes(bytesLength = 32) {
  if (crypto$1 && typeof crypto$1.getRandomValues === "function") {
    return crypto$1.getRandomValues(new Uint8Array(bytesLength));
  }
  if (crypto$1 && typeof crypto$1.randomBytes === "function") {
    return crypto$1.randomBytes(bytesLength);
  }
  throw new Error("crypto.getRandomValues must be defined");
}
function setBigUint64(view, byteOffset, value2, isLE) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value2, isLE);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value2 >> _32n2 & _u32_max);
  const wl = Number(value2 & _u32_max);
  const h = isLE ? 4 : 0;
  const l = isLE ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE);
  view.setUint32(byteOffset + l, wl, isLE);
}
const Chi = (a, b, c2) => a & b ^ ~a & c2;
const Maj = (a, b, c2) => a & b ^ a & c2 ^ b & c2;
class HashMD extends Hash {
  constructor(blockLen, outputLen, padOffset, isLE) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    aexists(this);
    const { view, buffer: buffer2, blockLen } = this;
    data = toBytes(data);
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer2.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer: buffer2, view, blockLen, isLE } = this;
    let { pos } = this;
    buffer2[pos++] = 128;
    this.buffer.subarray(pos).fill(0);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i = pos; i < blockLen; i++)
      buffer2[i] = 0;
    setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i = 0; i < outLen; i++)
      oview.setUint32(4 * i, state[i], isLE);
  }
  digest() {
    const { buffer: buffer2, outputLen } = this;
    this.digestInto(buffer2);
    const res = buffer2.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const { blockLen, buffer: buffer2, length, finished, destroyed, pos } = this;
    to.length = length;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length % blockLen)
      to.buffer.set(buffer2);
    return to;
  }
}
const SHA256_K = /* @__PURE__ */ new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
const SHA256_IV = /* @__PURE__ */ new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
const SHA256_W = /* @__PURE__ */ new Uint32Array(64);
class SHA256 extends HashMD {
  constructor() {
    super(64, 32, 8, false);
    this.A = SHA256_IV[0] | 0;
    this.B = SHA256_IV[1] | 0;
    this.C = SHA256_IV[2] | 0;
    this.D = SHA256_IV[3] | 0;
    this.E = SHA256_IV[4] | 0;
    this.F = SHA256_IV[5] | 0;
    this.G = SHA256_IV[6] | 0;
    this.H = SHA256_IV[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      SHA256_W[i] = view.getUint32(offset, false);
    for (let i = 16; i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W2 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i = 0; i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    SHA256_W.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
}
class SHA224 extends SHA256 {
  constructor() {
    super();
    this.A = 3238371032 | 0;
    this.B = 914150663 | 0;
    this.C = 812702999 | 0;
    this.D = 4144912697 | 0;
    this.E = 4290775857 | 0;
    this.F = 1750603025 | 0;
    this.G = 1694076839 | 0;
    this.H = 3204075428 | 0;
    this.outputLen = 28;
  }
}
const sha256 = /* @__PURE__ */ wrapConstructor(() => new SHA256());
const sha224$1 = /* @__PURE__ */ wrapConstructor(() => new SHA224());
function sha224(data) {
  return sha224$1.create().update(new Uint8Array(data)).digest();
}
const JSON_KEY_PRINCIPAL = "__principal__";
const SELF_AUTHENTICATING_SUFFIX = 2;
const ANONYMOUS_SUFFIX = 4;
const MANAGEMENT_CANISTER_PRINCIPAL_HEX_STR = "aaaaa-aa";
const fromHexString = (hexString) => {
  var _a2;
  return new Uint8Array(((_a2 = hexString.match(/.{1,2}/g)) !== null && _a2 !== void 0 ? _a2 : []).map((byte) => parseInt(byte, 16)));
};
const toHexString = (bytes2) => bytes2.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
let Principal$1 = class Principal {
  constructor(_arr) {
    this._arr = _arr;
    this._isPrincipal = true;
  }
  static anonymous() {
    return new this(new Uint8Array([ANONYMOUS_SUFFIX]));
  }
  /**
   * Utility method, returning the principal representing the management canister, decoded from the hex string `'aaaaa-aa'`
   * @returns {Principal} principal of the management canister
   */
  static managementCanister() {
    return this.fromHex(MANAGEMENT_CANISTER_PRINCIPAL_HEX_STR);
  }
  static selfAuthenticating(publicKey) {
    const sha = sha224(publicKey);
    return new this(new Uint8Array([...sha, SELF_AUTHENTICATING_SUFFIX]));
  }
  static from(other) {
    if (typeof other === "string") {
      return Principal.fromText(other);
    } else if (Object.getPrototypeOf(other) === Uint8Array.prototype) {
      return new Principal(other);
    } else if (typeof other === "object" && other !== null && other._isPrincipal === true) {
      return new Principal(other._arr);
    }
    throw new Error(`Impossible to convert ${JSON.stringify(other)} to Principal.`);
  }
  static fromHex(hex) {
    return new this(fromHexString(hex));
  }
  static fromText(text) {
    let maybePrincipal = text;
    if (text.includes(JSON_KEY_PRINCIPAL)) {
      const obj = JSON.parse(text);
      if (JSON_KEY_PRINCIPAL in obj) {
        maybePrincipal = obj[JSON_KEY_PRINCIPAL];
      }
    }
    const canisterIdNoDash = maybePrincipal.toLowerCase().replace(/-/g, "");
    let arr = decode$2(canisterIdNoDash);
    arr = arr.slice(4, arr.length);
    const principal = new this(arr);
    if (principal.toText() !== maybePrincipal) {
      throw new Error(`Principal "${principal.toText()}" does not have a valid checksum (original value "${maybePrincipal}" may not be a valid Principal ID).`);
    }
    return principal;
  }
  static fromUint8Array(arr) {
    return new this(arr);
  }
  isAnonymous() {
    return this._arr.byteLength === 1 && this._arr[0] === ANONYMOUS_SUFFIX;
  }
  toUint8Array() {
    return this._arr;
  }
  toHex() {
    return toHexString(this._arr).toUpperCase();
  }
  toText() {
    const checksumArrayBuf = new ArrayBuffer(4);
    const view = new DataView(checksumArrayBuf);
    view.setUint32(0, getCrc32(this._arr));
    const checksum = new Uint8Array(checksumArrayBuf);
    const bytes2 = Uint8Array.from(this._arr);
    const array2 = new Uint8Array([...checksum, ...bytes2]);
    const result = encode$2(array2);
    const matches = result.match(/.{1,5}/g);
    if (!matches) {
      throw new Error();
    }
    return matches.join("-");
  }
  toString() {
    return this.toText();
  }
  /**
   * Serializes to JSON
   * @returns {JsonnablePrincipal} a JSON object with a single key, {@link JSON_KEY_PRINCIPAL}, whose value is the principal as a string
   */
  toJSON() {
    return { [JSON_KEY_PRINCIPAL]: this.toText() };
  }
  /**
   * Utility method taking a Principal to compare against. Used for determining canister ranges in certificate verification
   * @param {Principal} other - a {@link Principal} to compare
   * @returns {'lt' | 'eq' | 'gt'} `'lt' | 'eq' | 'gt'` a string, representing less than, equal to, or greater than
   */
  compareTo(other) {
    for (let i = 0; i < Math.min(this._arr.length, other._arr.length); i++) {
      if (this._arr[i] < other._arr[i])
        return "lt";
      else if (this._arr[i] > other._arr[i])
        return "gt";
    }
    if (this._arr.length < other._arr.length)
      return "lt";
    if (this._arr.length > other._arr.length)
      return "gt";
    return "eq";
  }
  /**
   * Utility method checking whether a provided Principal is less than or equal to the current one using the {@link Principal.compareTo} method
   * @param other a {@link Principal} to compare
   * @returns {boolean} boolean
   */
  ltEq(other) {
    const cmp = this.compareTo(other);
    return cmp == "lt" || cmp == "eq";
  }
  /**
   * Utility method checking whether a provided Principal is greater than or equal to the current one using the {@link Principal.compareTo} method
   * @param other a {@link Principal} to compare
   * @returns {boolean} boolean
   */
  gtEq(other) {
    const cmp = this.compareTo(other);
    return cmp == "gt" || cmp == "eq";
  }
};
function concat$1(...buffers) {
  const result = new Uint8Array(buffers.reduce((acc, curr) => acc + curr.byteLength, 0));
  let index2 = 0;
  for (const b of buffers) {
    result.set(new Uint8Array(b), index2);
    index2 += b.byteLength;
  }
  return result.buffer;
}
function toHex(buffer2) {
  return [...new Uint8Array(buffer2)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
const hexRe = new RegExp(/^[0-9a-fA-F]+$/);
function fromHex(hex) {
  if (!hexRe.test(hex)) {
    throw new Error("Invalid hexadecimal string.");
  }
  const buffer2 = [...hex].reduce((acc, curr, i) => {
    acc[i / 2 | 0] = (acc[i / 2 | 0] || "") + curr;
    return acc;
  }, []).map((x) => Number.parseInt(x, 16));
  return new Uint8Array(buffer2).buffer;
}
function compare(b1, b2) {
  if (b1.byteLength !== b2.byteLength) {
    return b1.byteLength - b2.byteLength;
  }
  const u1 = new Uint8Array(b1);
  const u2 = new Uint8Array(b2);
  for (let i = 0; i < u1.length; i++) {
    if (u1[i] !== u2[i]) {
      return u1[i] - u2[i];
    }
  }
  return 0;
}
function bufEquals(b1, b2) {
  return compare(b1, b2) === 0;
}
function uint8ToBuf$1(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength).buffer;
}
function bufFromBufLike$1(bufLike) {
  if (bufLike instanceof Uint8Array) {
    return uint8ToBuf$1(bufLike);
  }
  if (bufLike instanceof ArrayBuffer) {
    return bufLike;
  }
  if (Array.isArray(bufLike)) {
    return uint8ToBuf$1(new Uint8Array(bufLike));
  }
  if ("buffer" in bufLike) {
    return bufFromBufLike$1(bufLike.buffer);
  }
  return uint8ToBuf$1(new Uint8Array(bufLike));
}
class AgentError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "AgentError";
    this.__proto__ = AgentError.prototype;
    Object.setPrototypeOf(this, AgentError.prototype);
  }
}
function concat(...buffers) {
  const result = new Uint8Array(buffers.reduce((acc, curr) => acc + curr.byteLength, 0));
  let index2 = 0;
  for (const b of buffers) {
    result.set(new Uint8Array(b), index2);
    index2 += b.byteLength;
  }
  return result;
}
class PipeArrayBuffer {
  /**
   * Creates a new instance of a pipe
   * @param buffer an optional buffer to start with
   * @param length an optional amount of bytes to use for the length.
   */
  constructor(buffer2, length = (buffer2 === null || buffer2 === void 0 ? void 0 : buffer2.byteLength) || 0) {
    this._buffer = bufFromBufLike(buffer2 || new ArrayBuffer(0));
    this._view = new Uint8Array(this._buffer, 0, length);
  }
  get buffer() {
    return bufFromBufLike(this._view.slice());
  }
  get byteLength() {
    return this._view.byteLength;
  }
  /**
   * Read `num` number of bytes from the front of the pipe.
   * @param num The number of bytes to read.
   */
  read(num) {
    const result = this._view.subarray(0, num);
    this._view = this._view.subarray(num);
    return result.slice().buffer;
  }
  readUint8() {
    const result = this._view[0];
    this._view = this._view.subarray(1);
    return result;
  }
  /**
   * Write a buffer to the end of the pipe.
   * @param buf The bytes to write.
   */
  write(buf) {
    const b = new Uint8Array(buf);
    const offset = this._view.byteLength;
    if (this._view.byteOffset + this._view.byteLength + b.byteLength >= this._buffer.byteLength) {
      this.alloc(b.byteLength);
    } else {
      this._view = new Uint8Array(this._buffer, this._view.byteOffset, this._view.byteLength + b.byteLength);
    }
    this._view.set(b, offset);
  }
  /**
   * Whether or not there is more data to read from the buffer
   */
  get end() {
    return this._view.byteLength === 0;
  }
  /**
   * Allocate a fixed amount of memory in the buffer. This does not affect the view.
   * @param amount A number of bytes to add to the buffer.
   */
  alloc(amount) {
    const b = new ArrayBuffer((this._buffer.byteLength + amount) * 1.2 | 0);
    const v = new Uint8Array(b, 0, this._view.byteLength + amount);
    v.set(this._view);
    this._buffer = b;
    this._view = v;
  }
}
function uint8ToBuf(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength).buffer;
}
function bufFromBufLike(bufLike) {
  if (bufLike instanceof Uint8Array) {
    return uint8ToBuf(bufLike);
  }
  if (bufLike instanceof ArrayBuffer) {
    return bufLike;
  }
  if (Array.isArray(bufLike)) {
    return uint8ToBuf(new Uint8Array(bufLike));
  }
  if ("buffer" in bufLike) {
    return bufFromBufLike(bufLike.buffer);
  }
  return uint8ToBuf(new Uint8Array(bufLike));
}
function idlHash(s) {
  const utf8encoder = new TextEncoder();
  const array2 = utf8encoder.encode(s);
  let h = 0;
  for (const c2 of array2) {
    h = (h * 223 + c2) % 2 ** 32;
  }
  return h;
}
function idlLabelToId(label) {
  if (/^_\d+_$/.test(label) || /^_0x[0-9a-fA-F]+_$/.test(label)) {
    const num = +label.slice(1, -1);
    if (Number.isSafeInteger(num) && num >= 0 && num < 2 ** 32) {
      return num;
    }
  }
  return idlHash(label);
}
function eob() {
  throw new Error("unexpected end of buffer");
}
function safeRead(pipe, num) {
  if (pipe.byteLength < num) {
    eob();
  }
  return pipe.read(num);
}
function safeReadUint8(pipe) {
  const byte = pipe.readUint8();
  if (byte === void 0) {
    eob();
  }
  return byte;
}
function lebEncode(value2) {
  if (typeof value2 === "number") {
    value2 = BigInt(value2);
  }
  if (value2 < BigInt(0)) {
    throw new Error("Cannot leb encode negative values.");
  }
  const byteLength2 = (value2 === BigInt(0) ? 0 : Math.ceil(Math.log2(Number(value2)))) + 1;
  const pipe = new PipeArrayBuffer(new ArrayBuffer(byteLength2), 0);
  while (true) {
    const i = Number(value2 & BigInt(127));
    value2 /= BigInt(128);
    if (value2 === BigInt(0)) {
      pipe.write(new Uint8Array([i]));
      break;
    } else {
      pipe.write(new Uint8Array([i | 128]));
    }
  }
  return pipe.buffer;
}
function lebDecode(pipe) {
  let weight = BigInt(1);
  let value2 = BigInt(0);
  let byte;
  do {
    byte = safeReadUint8(pipe);
    value2 += BigInt(byte & 127).valueOf() * weight;
    weight *= BigInt(128);
  } while (byte >= 128);
  return value2;
}
function slebEncode(value2) {
  if (typeof value2 === "number") {
    value2 = BigInt(value2);
  }
  const isNeg = value2 < BigInt(0);
  if (isNeg) {
    value2 = -value2 - BigInt(1);
  }
  const byteLength2 = (value2 === BigInt(0) ? 0 : Math.ceil(Math.log2(Number(value2)))) + 1;
  const pipe = new PipeArrayBuffer(new ArrayBuffer(byteLength2), 0);
  while (true) {
    const i = getLowerBytes(value2);
    value2 /= BigInt(128);
    if (isNeg && value2 === BigInt(0) && (i & 64) !== 0 || !isNeg && value2 === BigInt(0) && (i & 64) === 0) {
      pipe.write(new Uint8Array([i]));
      break;
    } else {
      pipe.write(new Uint8Array([i | 128]));
    }
  }
  function getLowerBytes(num) {
    const bytes2 = num % BigInt(128);
    if (isNeg) {
      return Number(BigInt(128) - bytes2 - BigInt(1));
    } else {
      return Number(bytes2);
    }
  }
  return pipe.buffer;
}
function slebDecode(pipe) {
  const pipeView = new Uint8Array(pipe.buffer);
  let len = 0;
  for (; len < pipeView.byteLength; len++) {
    if (pipeView[len] < 128) {
      if ((pipeView[len] & 64) === 0) {
        return lebDecode(pipe);
      }
      break;
    }
  }
  const bytes2 = new Uint8Array(safeRead(pipe, len + 1));
  let value2 = BigInt(0);
  for (let i = bytes2.byteLength - 1; i >= 0; i--) {
    value2 = value2 * BigInt(128) + BigInt(128 - (bytes2[i] & 127) - 1);
  }
  return -value2 - BigInt(1);
}
function writeUIntLE(value2, byteLength2) {
  if (BigInt(value2) < BigInt(0)) {
    throw new Error("Cannot write negative values.");
  }
  return writeIntLE(value2, byteLength2);
}
function writeIntLE(value2, byteLength2) {
  value2 = BigInt(value2);
  const pipe = new PipeArrayBuffer(new ArrayBuffer(Math.min(1, byteLength2)), 0);
  let i = 0;
  let mul = BigInt(256);
  let sub = BigInt(0);
  let byte = Number(value2 % mul);
  pipe.write(new Uint8Array([byte]));
  while (++i < byteLength2) {
    if (value2 < 0 && sub === BigInt(0) && byte !== 0) {
      sub = BigInt(1);
    }
    byte = Number((value2 / mul - sub) % BigInt(256));
    pipe.write(new Uint8Array([byte]));
    mul *= BigInt(256);
  }
  return pipe.buffer;
}
function readUIntLE(pipe, byteLength2) {
  let val = BigInt(safeReadUint8(pipe));
  let mul = BigInt(1);
  let i = 0;
  while (++i < byteLength2) {
    mul *= BigInt(256);
    const byte = BigInt(safeReadUint8(pipe));
    val = val + mul * byte;
  }
  return val;
}
function readIntLE(pipe, byteLength2) {
  let val = readUIntLE(pipe, byteLength2);
  const mul = BigInt(2) ** (BigInt(8) * BigInt(byteLength2 - 1) + BigInt(7));
  if (val >= mul) {
    val -= mul * BigInt(2);
  }
  return val;
}
function iexp2(n) {
  const nBig = BigInt(n);
  if (n < 0) {
    throw new RangeError("Input must be non-negative");
  }
  return BigInt(1) << nBig;
}
const magicNumber = "DIDL";
const toReadableString_max = 400;
function zipWith(xs, ys, f) {
  return xs.map((x, i) => f(x, ys[i]));
}
class TypeTable {
  constructor() {
    this._typs = [];
    this._idx = /* @__PURE__ */ new Map();
  }
  has(obj) {
    return this._idx.has(obj.name);
  }
  add(type, buf) {
    const idx = this._typs.length;
    this._idx.set(type.name, idx);
    this._typs.push(buf);
  }
  merge(obj, knot) {
    const idx = this._idx.get(obj.name);
    const knotIdx = this._idx.get(knot);
    if (idx === void 0) {
      throw new Error("Missing type index for " + obj);
    }
    if (knotIdx === void 0) {
      throw new Error("Missing type index for " + knot);
    }
    this._typs[idx] = this._typs[knotIdx];
    this._typs.splice(knotIdx, 1);
    this._idx.delete(knot);
  }
  encode() {
    const len = lebEncode(this._typs.length);
    const buf = concat(...this._typs);
    return concat(len, buf);
  }
  indexOf(typeName) {
    if (!this._idx.has(typeName)) {
      throw new Error("Missing type index for " + typeName);
    }
    return slebEncode(this._idx.get(typeName) || 0);
  }
}
class Visitor {
  visitType(t, data) {
    throw new Error("Not implemented");
  }
  visitPrimitive(t, data) {
    return this.visitType(t, data);
  }
  visitEmpty(t, data) {
    return this.visitPrimitive(t, data);
  }
  visitBool(t, data) {
    return this.visitPrimitive(t, data);
  }
  visitNull(t, data) {
    return this.visitPrimitive(t, data);
  }
  visitReserved(t, data) {
    return this.visitPrimitive(t, data);
  }
  visitText(t, data) {
    return this.visitPrimitive(t, data);
  }
  visitNumber(t, data) {
    return this.visitPrimitive(t, data);
  }
  visitInt(t, data) {
    return this.visitNumber(t, data);
  }
  visitNat(t, data) {
    return this.visitNumber(t, data);
  }
  visitFloat(t, data) {
    return this.visitPrimitive(t, data);
  }
  visitFixedInt(t, data) {
    return this.visitNumber(t, data);
  }
  visitFixedNat(t, data) {
    return this.visitNumber(t, data);
  }
  visitPrincipal(t, data) {
    return this.visitPrimitive(t, data);
  }
  visitConstruct(t, data) {
    return this.visitType(t, data);
  }
  visitVec(t, ty, data) {
    return this.visitConstruct(t, data);
  }
  visitOpt(t, ty, data) {
    return this.visitConstruct(t, data);
  }
  visitRecord(t, fields, data) {
    return this.visitConstruct(t, data);
  }
  visitTuple(t, components, data) {
    const fields = components.map((ty, i) => [`_${i}_`, ty]);
    return this.visitRecord(t, fields, data);
  }
  visitVariant(t, fields, data) {
    return this.visitConstruct(t, data);
  }
  visitRec(t, ty, data) {
    return this.visitConstruct(ty, data);
  }
  visitFunc(t, data) {
    return this.visitConstruct(t, data);
  }
  visitService(t, data) {
    return this.visitConstruct(t, data);
  }
}
class Type {
  /* Display type name */
  display() {
    return this.name;
  }
  valueToString(x) {
    return toReadableString(x);
  }
  /* Implement `T` in the IDL spec, only needed for non-primitive types */
  buildTypeTable(typeTable) {
    if (!typeTable.has(this)) {
      this._buildTypeTableImpl(typeTable);
    }
  }
}
class PrimitiveType extends Type {
  checkType(t) {
    if (this.name !== t.name) {
      throw new Error(`type mismatch: type on the wire ${t.name}, expect type ${this.name}`);
    }
    return t;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _buildTypeTableImpl(typeTable) {
    return;
  }
}
class ConstructType extends Type {
  checkType(t) {
    if (t instanceof RecClass) {
      const ty = t.getType();
      if (typeof ty === "undefined") {
        throw new Error("type mismatch with uninitialized type");
      }
      return ty;
    }
    throw new Error(`type mismatch: type on the wire ${t.name}, expect type ${this.name}`);
  }
  encodeType(typeTable) {
    return typeTable.indexOf(this.name);
  }
}
class EmptyClass extends PrimitiveType {
  accept(v, d) {
    return v.visitEmpty(this, d);
  }
  covariant(x) {
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue() {
    throw new Error("Empty cannot appear as a function argument");
  }
  valueToString() {
    throw new Error("Empty cannot appear as a value");
  }
  encodeType() {
    return slebEncode(
      -17
      /* IDLTypeIds.Empty */
    );
  }
  decodeValue() {
    throw new Error("Empty cannot appear as an output");
  }
  get name() {
    return "empty";
  }
}
class UnknownClass extends Type {
  checkType(t) {
    throw new Error("Method not implemented for unknown.");
  }
  accept(v, d) {
    throw v.visitType(this, d);
  }
  covariant(x) {
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue() {
    throw new Error("Unknown cannot appear as a function argument");
  }
  valueToString() {
    throw new Error("Unknown cannot appear as a value");
  }
  encodeType() {
    throw new Error("Unknown cannot be serialized");
  }
  decodeValue(b, t) {
    let decodedValue = t.decodeValue(b, t);
    if (Object(decodedValue) !== decodedValue) {
      decodedValue = Object(decodedValue);
    }
    let typeFunc;
    if (t instanceof RecClass) {
      typeFunc = () => t.getType();
    } else {
      typeFunc = () => t;
    }
    Object.defineProperty(decodedValue, "type", {
      value: typeFunc,
      writable: true,
      enumerable: false,
      configurable: true
    });
    return decodedValue;
  }
  _buildTypeTableImpl() {
    throw new Error("Unknown cannot be serialized");
  }
  get name() {
    return "Unknown";
  }
}
class BoolClass extends PrimitiveType {
  accept(v, d) {
    return v.visitBool(this, d);
  }
  covariant(x) {
    if (typeof x === "boolean")
      return true;
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue(x) {
    return new Uint8Array([x ? 1 : 0]);
  }
  encodeType() {
    return slebEncode(
      -2
      /* IDLTypeIds.Bool */
    );
  }
  decodeValue(b, t) {
    this.checkType(t);
    switch (safeReadUint8(b)) {
      case 0:
        return false;
      case 1:
        return true;
      default:
        throw new Error("Boolean value out of range");
    }
  }
  get name() {
    return "bool";
  }
}
class NullClass extends PrimitiveType {
  accept(v, d) {
    return v.visitNull(this, d);
  }
  covariant(x) {
    if (x === null)
      return true;
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue() {
    return new ArrayBuffer(0);
  }
  encodeType() {
    return slebEncode(
      -1
      /* IDLTypeIds.Null */
    );
  }
  decodeValue(b, t) {
    this.checkType(t);
    return null;
  }
  get name() {
    return "null";
  }
}
class ReservedClass extends PrimitiveType {
  accept(v, d) {
    return v.visitReserved(this, d);
  }
  covariant(x) {
    return true;
  }
  encodeValue() {
    return new ArrayBuffer(0);
  }
  encodeType() {
    return slebEncode(
      -16
      /* IDLTypeIds.Reserved */
    );
  }
  decodeValue(b, t) {
    if (t.name !== this.name) {
      t.decodeValue(b, t);
    }
    return null;
  }
  get name() {
    return "reserved";
  }
}
class TextClass extends PrimitiveType {
  accept(v, d) {
    return v.visitText(this, d);
  }
  covariant(x) {
    if (typeof x === "string")
      return true;
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue(x) {
    const buf = new TextEncoder().encode(x);
    const len = lebEncode(buf.byteLength);
    return concat(len, buf);
  }
  encodeType() {
    return slebEncode(
      -15
      /* IDLTypeIds.Text */
    );
  }
  decodeValue(b, t) {
    this.checkType(t);
    const len = lebDecode(b);
    const buf = safeRead(b, Number(len));
    const decoder2 = new TextDecoder("utf8", { fatal: true });
    return decoder2.decode(buf);
  }
  get name() {
    return "text";
  }
  valueToString(x) {
    return '"' + x + '"';
  }
}
class IntClass extends PrimitiveType {
  accept(v, d) {
    return v.visitInt(this, d);
  }
  covariant(x) {
    if (typeof x === "bigint" || Number.isInteger(x))
      return true;
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue(x) {
    return slebEncode(x);
  }
  encodeType() {
    return slebEncode(
      -4
      /* IDLTypeIds.Int */
    );
  }
  decodeValue(b, t) {
    this.checkType(t);
    return slebDecode(b);
  }
  get name() {
    return "int";
  }
  valueToString(x) {
    return x.toString();
  }
}
class NatClass extends PrimitiveType {
  accept(v, d) {
    return v.visitNat(this, d);
  }
  covariant(x) {
    if (typeof x === "bigint" && x >= BigInt(0) || Number.isInteger(x) && x >= 0)
      return true;
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue(x) {
    return lebEncode(x);
  }
  encodeType() {
    return slebEncode(
      -3
      /* IDLTypeIds.Nat */
    );
  }
  decodeValue(b, t) {
    this.checkType(t);
    return lebDecode(b);
  }
  get name() {
    return "nat";
  }
  valueToString(x) {
    return x.toString();
  }
}
class FloatClass extends PrimitiveType {
  constructor(_bits) {
    super();
    this._bits = _bits;
    if (_bits !== 32 && _bits !== 64) {
      throw new Error("not a valid float type");
    }
  }
  accept(v, d) {
    return v.visitFloat(this, d);
  }
  covariant(x) {
    if (typeof x === "number" || x instanceof Number)
      return true;
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue(x) {
    const buf = new ArrayBuffer(this._bits / 8);
    const view = new DataView(buf);
    if (this._bits === 32) {
      view.setFloat32(0, x, true);
    } else {
      view.setFloat64(0, x, true);
    }
    return buf;
  }
  encodeType() {
    const opcode = this._bits === 32 ? -13 : -14;
    return slebEncode(opcode);
  }
  decodeValue(b, t) {
    this.checkType(t);
    const bytes2 = safeRead(b, this._bits / 8);
    const view = new DataView(bytes2);
    if (this._bits === 32) {
      return view.getFloat32(0, true);
    } else {
      return view.getFloat64(0, true);
    }
  }
  get name() {
    return "float" + this._bits;
  }
  valueToString(x) {
    return x.toString();
  }
}
class FixedIntClass extends PrimitiveType {
  constructor(_bits) {
    super();
    this._bits = _bits;
  }
  accept(v, d) {
    return v.visitFixedInt(this, d);
  }
  covariant(x) {
    const min = iexp2(this._bits - 1) * BigInt(-1);
    const max = iexp2(this._bits - 1) - BigInt(1);
    let ok = false;
    if (typeof x === "bigint") {
      ok = x >= min && x <= max;
    } else if (Number.isInteger(x)) {
      const v = BigInt(x);
      ok = v >= min && v <= max;
    } else {
      ok = false;
    }
    if (ok)
      return true;
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue(x) {
    return writeIntLE(x, this._bits / 8);
  }
  encodeType() {
    const offset = Math.log2(this._bits) - 3;
    return slebEncode(-9 - offset);
  }
  decodeValue(b, t) {
    this.checkType(t);
    const num = readIntLE(b, this._bits / 8);
    if (this._bits <= 32) {
      return Number(num);
    } else {
      return num;
    }
  }
  get name() {
    return `int${this._bits}`;
  }
  valueToString(x) {
    return x.toString();
  }
}
class FixedNatClass extends PrimitiveType {
  constructor(_bits) {
    super();
    this._bits = _bits;
  }
  accept(v, d) {
    return v.visitFixedNat(this, d);
  }
  covariant(x) {
    const max = iexp2(this._bits);
    let ok = false;
    if (typeof x === "bigint" && x >= BigInt(0)) {
      ok = x < max;
    } else if (Number.isInteger(x) && x >= 0) {
      const v = BigInt(x);
      ok = v < max;
    } else {
      ok = false;
    }
    if (ok)
      return true;
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue(x) {
    return writeUIntLE(x, this._bits / 8);
  }
  encodeType() {
    const offset = Math.log2(this._bits) - 3;
    return slebEncode(-5 - offset);
  }
  decodeValue(b, t) {
    this.checkType(t);
    const num = readUIntLE(b, this._bits / 8);
    if (this._bits <= 32) {
      return Number(num);
    } else {
      return num;
    }
  }
  get name() {
    return `nat${this._bits}`;
  }
  valueToString(x) {
    return x.toString();
  }
}
class VecClass extends ConstructType {
  constructor(_type) {
    super();
    this._type = _type;
    this._blobOptimization = false;
    if (_type instanceof FixedNatClass && _type._bits === 8) {
      this._blobOptimization = true;
    }
  }
  accept(v, d) {
    return v.visitVec(this, this._type, d);
  }
  covariant(x) {
    const bits = this._type instanceof FixedNatClass ? this._type._bits : this._type instanceof FixedIntClass ? this._type._bits : 0;
    if (ArrayBuffer.isView(x) && bits == x.BYTES_PER_ELEMENT * 8 || Array.isArray(x) && x.every((v, idx) => {
      try {
        return this._type.covariant(v);
      } catch (e) {
        throw new Error(`Invalid ${this.display()} argument: 

index ${idx} -> ${e.message}`);
      }
    }))
      return true;
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue(x) {
    const len = lebEncode(x.length);
    if (this._blobOptimization) {
      return concat(len, new Uint8Array(x));
    }
    if (ArrayBuffer.isView(x)) {
      return concat(len, new Uint8Array(x.buffer));
    }
    const buf = new PipeArrayBuffer(new ArrayBuffer(len.byteLength + x.length), 0);
    buf.write(len);
    for (const d of x) {
      const encoded = this._type.encodeValue(d);
      buf.write(new Uint8Array(encoded));
    }
    return buf.buffer;
  }
  _buildTypeTableImpl(typeTable) {
    this._type.buildTypeTable(typeTable);
    const opCode = slebEncode(
      -19
      /* IDLTypeIds.Vector */
    );
    const buffer2 = this._type.encodeType(typeTable);
    typeTable.add(this, concat(opCode, buffer2));
  }
  decodeValue(b, t) {
    const vec = this.checkType(t);
    if (!(vec instanceof VecClass)) {
      throw new Error("Not a vector type");
    }
    const len = Number(lebDecode(b));
    if (this._type instanceof FixedNatClass) {
      if (this._type._bits == 8) {
        return new Uint8Array(b.read(len));
      }
      if (this._type._bits == 16) {
        return new Uint16Array(b.read(len * 2));
      }
      if (this._type._bits == 32) {
        return new Uint32Array(b.read(len * 4));
      }
      if (this._type._bits == 64) {
        return new BigUint64Array(b.read(len * 8));
      }
    }
    if (this._type instanceof FixedIntClass) {
      if (this._type._bits == 8) {
        return new Int8Array(b.read(len));
      }
      if (this._type._bits == 16) {
        return new Int16Array(b.read(len * 2));
      }
      if (this._type._bits == 32) {
        return new Int32Array(b.read(len * 4));
      }
      if (this._type._bits == 64) {
        return new BigInt64Array(b.read(len * 8));
      }
    }
    const rets = [];
    for (let i = 0; i < len; i++) {
      rets.push(this._type.decodeValue(b, vec._type));
    }
    return rets;
  }
  get name() {
    return `vec ${this._type.name}`;
  }
  display() {
    return `vec ${this._type.display()}`;
  }
  valueToString(x) {
    const elements = x.map((e) => this._type.valueToString(e));
    return "vec {" + elements.join("; ") + "}";
  }
}
class OptClass extends ConstructType {
  constructor(_type) {
    super();
    this._type = _type;
  }
  accept(v, d) {
    return v.visitOpt(this, this._type, d);
  }
  covariant(x) {
    try {
      if (Array.isArray(x) && (x.length === 0 || x.length === 1 && this._type.covariant(x[0])))
        return true;
    } catch (e) {
      throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)} 

-> ${e.message}`);
    }
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue(x) {
    if (x.length === 0) {
      return new Uint8Array([0]);
    } else {
      return concat(new Uint8Array([1]), this._type.encodeValue(x[0]));
    }
  }
  _buildTypeTableImpl(typeTable) {
    this._type.buildTypeTable(typeTable);
    const opCode = slebEncode(
      -18
      /* IDLTypeIds.Opt */
    );
    const buffer2 = this._type.encodeType(typeTable);
    typeTable.add(this, concat(opCode, buffer2));
  }
  decodeValue(b, t) {
    const opt = this.checkType(t);
    if (!(opt instanceof OptClass)) {
      throw new Error("Not an option type");
    }
    switch (safeReadUint8(b)) {
      case 0:
        return [];
      case 1:
        return [this._type.decodeValue(b, opt._type)];
      default:
        throw new Error("Not an option value");
    }
  }
  get name() {
    return `opt ${this._type.name}`;
  }
  display() {
    return `opt ${this._type.display()}`;
  }
  valueToString(x) {
    if (x.length === 0) {
      return "null";
    } else {
      return `opt ${this._type.valueToString(x[0])}`;
    }
  }
}
class RecordClass extends ConstructType {
  constructor(fields = {}) {
    super();
    this._fields = Object.entries(fields).sort((a, b) => idlLabelToId(a[0]) - idlLabelToId(b[0]));
  }
  accept(v, d) {
    return v.visitRecord(this, this._fields, d);
  }
  tryAsTuple() {
    const res = [];
    for (let i = 0; i < this._fields.length; i++) {
      const [key, type] = this._fields[i];
      if (key !== `_${i}_`) {
        return null;
      }
      res.push(type);
    }
    return res;
  }
  covariant(x) {
    if (typeof x === "object" && this._fields.every(([k, t]) => {
      if (!x.hasOwnProperty(k)) {
        throw new Error(`Record is missing key "${k}".`);
      }
      try {
        return t.covariant(x[k]);
      } catch (e) {
        throw new Error(`Invalid ${this.display()} argument: 

field ${k} -> ${e.message}`);
      }
    }))
      return true;
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue(x) {
    const values = this._fields.map(([key]) => x[key]);
    const bufs = zipWith(this._fields, values, ([, c2], d) => c2.encodeValue(d));
    return concat(...bufs);
  }
  _buildTypeTableImpl(T) {
    this._fields.forEach(([_, value2]) => value2.buildTypeTable(T));
    const opCode = slebEncode(
      -20
      /* IDLTypeIds.Record */
    );
    const len = lebEncode(this._fields.length);
    const fields = this._fields.map(([key, value2]) => concat(lebEncode(idlLabelToId(key)), value2.encodeType(T)));
    T.add(this, concat(opCode, len, concat(...fields)));
  }
  decodeValue(b, t) {
    const record = this.checkType(t);
    if (!(record instanceof RecordClass)) {
      throw new Error("Not a record type");
    }
    const x = {};
    let expectedRecordIdx = 0;
    let actualRecordIdx = 0;
    while (actualRecordIdx < record._fields.length) {
      const [hash2, type] = record._fields[actualRecordIdx];
      if (expectedRecordIdx >= this._fields.length) {
        type.decodeValue(b, type);
        actualRecordIdx++;
        continue;
      }
      const [expectKey, expectType] = this._fields[expectedRecordIdx];
      const expectedId = idlLabelToId(this._fields[expectedRecordIdx][0]);
      const actualId = idlLabelToId(hash2);
      if (expectedId === actualId) {
        x[expectKey] = expectType.decodeValue(b, type);
        expectedRecordIdx++;
        actualRecordIdx++;
      } else if (actualId > expectedId) {
        if (expectType instanceof OptClass || expectType instanceof ReservedClass) {
          x[expectKey] = [];
          expectedRecordIdx++;
        } else {
          throw new Error("Cannot find required field " + expectKey);
        }
      } else {
        type.decodeValue(b, type);
        actualRecordIdx++;
      }
    }
    for (const [expectKey, expectType] of this._fields.slice(expectedRecordIdx)) {
      if (expectType instanceof OptClass || expectType instanceof ReservedClass) {
        x[expectKey] = [];
      } else {
        throw new Error("Cannot find required field " + expectKey);
      }
    }
    return x;
  }
  get name() {
    const fields = this._fields.map(([key, value2]) => key + ":" + value2.name);
    return `record {${fields.join("; ")}}`;
  }
  display() {
    const fields = this._fields.map(([key, value2]) => key + ":" + value2.display());
    return `record {${fields.join("; ")}}`;
  }
  valueToString(x) {
    const values = this._fields.map(([key]) => x[key]);
    const fields = zipWith(this._fields, values, ([k, c2], d) => k + "=" + c2.valueToString(d));
    return `record {${fields.join("; ")}}`;
  }
}
class TupleClass extends RecordClass {
  constructor(_components) {
    const x = {};
    _components.forEach((e, i) => x["_" + i + "_"] = e);
    super(x);
    this._components = _components;
  }
  accept(v, d) {
    return v.visitTuple(this, this._components, d);
  }
  covariant(x) {
    if (Array.isArray(x) && x.length >= this._fields.length && this._components.every((t, i) => {
      try {
        return t.covariant(x[i]);
      } catch (e) {
        throw new Error(`Invalid ${this.display()} argument: 

index ${i} -> ${e.message}`);
      }
    }))
      return true;
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue(x) {
    const bufs = zipWith(this._components, x, (c2, d) => c2.encodeValue(d));
    return concat(...bufs);
  }
  decodeValue(b, t) {
    const tuple = this.checkType(t);
    if (!(tuple instanceof TupleClass)) {
      throw new Error("not a tuple type");
    }
    if (tuple._components.length < this._components.length) {
      throw new Error("tuple mismatch");
    }
    const res = [];
    for (const [i, wireType] of tuple._components.entries()) {
      if (i >= this._components.length) {
        wireType.decodeValue(b, wireType);
      } else {
        res.push(this._components[i].decodeValue(b, wireType));
      }
    }
    return res;
  }
  display() {
    const fields = this._components.map((value2) => value2.display());
    return `record {${fields.join("; ")}}`;
  }
  valueToString(values) {
    const fields = zipWith(this._components, values, (c2, d) => c2.valueToString(d));
    return `record {${fields.join("; ")}}`;
  }
}
class VariantClass extends ConstructType {
  constructor(fields = {}) {
    super();
    this._fields = Object.entries(fields).sort((a, b) => idlLabelToId(a[0]) - idlLabelToId(b[0]));
  }
  accept(v, d) {
    return v.visitVariant(this, this._fields, d);
  }
  covariant(x) {
    if (typeof x === "object" && Object.entries(x).length === 1 && this._fields.every(([k, v]) => {
      try {
        return !x.hasOwnProperty(k) || v.covariant(x[k]);
      } catch (e) {
        throw new Error(`Invalid ${this.display()} argument: 

variant ${k} -> ${e.message}`);
      }
    }))
      return true;
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue(x) {
    for (let i = 0; i < this._fields.length; i++) {
      const [name, type] = this._fields[i];
      if (x.hasOwnProperty(name)) {
        const idx = lebEncode(i);
        const buf = type.encodeValue(x[name]);
        return concat(idx, buf);
      }
    }
    throw Error("Variant has no data: " + x);
  }
  _buildTypeTableImpl(typeTable) {
    this._fields.forEach(([, type]) => {
      type.buildTypeTable(typeTable);
    });
    const opCode = slebEncode(
      -21
      /* IDLTypeIds.Variant */
    );
    const len = lebEncode(this._fields.length);
    const fields = this._fields.map(([key, value2]) => concat(lebEncode(idlLabelToId(key)), value2.encodeType(typeTable)));
    typeTable.add(this, concat(opCode, len, ...fields));
  }
  decodeValue(b, t) {
    const variant = this.checkType(t);
    if (!(variant instanceof VariantClass)) {
      throw new Error("Not a variant type");
    }
    const idx = Number(lebDecode(b));
    if (idx >= variant._fields.length) {
      throw Error("Invalid variant index: " + idx);
    }
    const [wireHash, wireType] = variant._fields[idx];
    for (const [key, expectType] of this._fields) {
      if (idlLabelToId(wireHash) === idlLabelToId(key)) {
        const value2 = expectType.decodeValue(b, wireType);
        return { [key]: value2 };
      }
    }
    throw new Error("Cannot find field hash " + wireHash);
  }
  get name() {
    const fields = this._fields.map(([key, type]) => key + ":" + type.name);
    return `variant {${fields.join("; ")}}`;
  }
  display() {
    const fields = this._fields.map(([key, type]) => key + (type.name === "null" ? "" : `:${type.display()}`));
    return `variant {${fields.join("; ")}}`;
  }
  valueToString(x) {
    for (const [name, type] of this._fields) {
      if (x.hasOwnProperty(name)) {
        const value2 = type.valueToString(x[name]);
        if (value2 === "null") {
          return `variant {${name}}`;
        } else {
          return `variant {${name}=${value2}}`;
        }
      }
    }
    throw new Error("Variant has no data: " + x);
  }
}
class RecClass extends ConstructType {
  constructor() {
    super(...arguments);
    this._id = RecClass._counter++;
    this._type = void 0;
  }
  accept(v, d) {
    if (!this._type) {
      throw Error("Recursive type uninitialized.");
    }
    return v.visitRec(this, this._type, d);
  }
  fill(t) {
    this._type = t;
  }
  getType() {
    return this._type;
  }
  covariant(x) {
    if (this._type ? this._type.covariant(x) : false)
      return true;
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue(x) {
    if (!this._type) {
      throw Error("Recursive type uninitialized.");
    }
    return this._type.encodeValue(x);
  }
  _buildTypeTableImpl(typeTable) {
    if (!this._type) {
      throw Error("Recursive type uninitialized.");
    }
    typeTable.add(this, new Uint8Array([]));
    this._type.buildTypeTable(typeTable);
    typeTable.merge(this, this._type.name);
  }
  decodeValue(b, t) {
    if (!this._type) {
      throw Error("Recursive type uninitialized.");
    }
    return this._type.decodeValue(b, t);
  }
  get name() {
    return `rec_${this._id}`;
  }
  display() {
    if (!this._type) {
      throw Error("Recursive type uninitialized.");
    }
    return `μ${this.name}.${this._type.name}`;
  }
  valueToString(x) {
    if (!this._type) {
      throw Error("Recursive type uninitialized.");
    }
    return this._type.valueToString(x);
  }
}
RecClass._counter = 0;
function decodePrincipalId(b) {
  const x = safeReadUint8(b);
  if (x !== 1) {
    throw new Error("Cannot decode principal");
  }
  const len = Number(lebDecode(b));
  return Principal$1.fromUint8Array(new Uint8Array(safeRead(b, len)));
}
class PrincipalClass extends PrimitiveType {
  accept(v, d) {
    return v.visitPrincipal(this, d);
  }
  covariant(x) {
    if (x && x._isPrincipal)
      return true;
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue(x) {
    const buf = x.toUint8Array();
    const len = lebEncode(buf.byteLength);
    return concat(new Uint8Array([1]), len, buf);
  }
  encodeType() {
    return slebEncode(
      -24
      /* IDLTypeIds.Principal */
    );
  }
  decodeValue(b, t) {
    this.checkType(t);
    return decodePrincipalId(b);
  }
  get name() {
    return "principal";
  }
  valueToString(x) {
    return `${this.name} "${x.toText()}"`;
  }
}
class FuncClass extends ConstructType {
  constructor(argTypes, retTypes, annotations = []) {
    super();
    this.argTypes = argTypes;
    this.retTypes = retTypes;
    this.annotations = annotations;
  }
  static argsToString(types, v) {
    if (types.length !== v.length) {
      throw new Error("arity mismatch");
    }
    return "(" + types.map((t, i) => t.valueToString(v[i])).join(", ") + ")";
  }
  accept(v, d) {
    return v.visitFunc(this, d);
  }
  covariant(x) {
    if (Array.isArray(x) && x.length === 2 && x[0] && x[0]._isPrincipal && typeof x[1] === "string")
      return true;
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue([principal, methodName]) {
    const buf = principal.toUint8Array();
    const len = lebEncode(buf.byteLength);
    const canister = concat(new Uint8Array([1]), len, buf);
    const method = new TextEncoder().encode(methodName);
    const methodLen = lebEncode(method.byteLength);
    return concat(new Uint8Array([1]), canister, methodLen, method);
  }
  _buildTypeTableImpl(T) {
    this.argTypes.forEach((arg) => arg.buildTypeTable(T));
    this.retTypes.forEach((arg) => arg.buildTypeTable(T));
    const opCode = slebEncode(
      -22
      /* IDLTypeIds.Func */
    );
    const argLen = lebEncode(this.argTypes.length);
    const args = concat(...this.argTypes.map((arg) => arg.encodeType(T)));
    const retLen = lebEncode(this.retTypes.length);
    const rets = concat(...this.retTypes.map((arg) => arg.encodeType(T)));
    const annLen = lebEncode(this.annotations.length);
    const anns = concat(...this.annotations.map((a) => this.encodeAnnotation(a)));
    T.add(this, concat(opCode, argLen, args, retLen, rets, annLen, anns));
  }
  decodeValue(b) {
    const x = safeReadUint8(b);
    if (x !== 1) {
      throw new Error("Cannot decode function reference");
    }
    const canister = decodePrincipalId(b);
    const mLen = Number(lebDecode(b));
    const buf = safeRead(b, mLen);
    const decoder2 = new TextDecoder("utf8", { fatal: true });
    const method = decoder2.decode(buf);
    return [canister, method];
  }
  get name() {
    const args = this.argTypes.map((arg) => arg.name).join(", ");
    const rets = this.retTypes.map((arg) => arg.name).join(", ");
    const annon = " " + this.annotations.join(" ");
    return `(${args}) -> (${rets})${annon}`;
  }
  valueToString([principal, str]) {
    return `func "${principal.toText()}".${str}`;
  }
  display() {
    const args = this.argTypes.map((arg) => arg.display()).join(", ");
    const rets = this.retTypes.map((arg) => arg.display()).join(", ");
    const annon = " " + this.annotations.join(" ");
    return `(${args}) → (${rets})${annon}`;
  }
  encodeAnnotation(ann) {
    if (ann === "query") {
      return new Uint8Array([1]);
    } else if (ann === "oneway") {
      return new Uint8Array([2]);
    } else if (ann === "composite_query") {
      return new Uint8Array([3]);
    } else {
      throw new Error("Illegal function annotation");
    }
  }
}
class ServiceClass extends ConstructType {
  constructor(fields) {
    super();
    this._fields = Object.entries(fields).sort((a, b) => {
      if (a[0] < b[0]) {
        return -1;
      }
      if (a[0] > b[0]) {
        return 1;
      }
      return 0;
    });
  }
  accept(v, d) {
    return v.visitService(this, d);
  }
  covariant(x) {
    if (x && x._isPrincipal)
      return true;
    throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
  }
  encodeValue(x) {
    const buf = x.toUint8Array();
    const len = lebEncode(buf.length);
    return concat(new Uint8Array([1]), len, buf);
  }
  _buildTypeTableImpl(T) {
    this._fields.forEach(([_, func]) => func.buildTypeTable(T));
    const opCode = slebEncode(
      -23
      /* IDLTypeIds.Service */
    );
    const len = lebEncode(this._fields.length);
    const meths = this._fields.map(([label, func]) => {
      const labelBuf = new TextEncoder().encode(label);
      const labelLen = lebEncode(labelBuf.length);
      return concat(labelLen, labelBuf, func.encodeType(T));
    });
    T.add(this, concat(opCode, len, ...meths));
  }
  decodeValue(b) {
    return decodePrincipalId(b);
  }
  get name() {
    const fields = this._fields.map(([key, value2]) => key + ":" + value2.name);
    return `service {${fields.join("; ")}}`;
  }
  valueToString(x) {
    return `service "${x.toText()}"`;
  }
}
function toReadableString(x) {
  const str = JSON.stringify(x, (_key, value2) => typeof value2 === "bigint" ? `BigInt(${value2})` : value2);
  return str && str.length > toReadableString_max ? str.substring(0, toReadableString_max - 3) + "..." : str;
}
function encode$1(argTypes, args) {
  if (args.length < argTypes.length) {
    throw Error("Wrong number of message arguments");
  }
  const typeTable = new TypeTable();
  argTypes.forEach((t) => t.buildTypeTable(typeTable));
  const magic = new TextEncoder().encode(magicNumber);
  const table = typeTable.encode();
  const len = lebEncode(args.length);
  const typs = concat(...argTypes.map((t) => t.encodeType(typeTable)));
  const vals = concat(...zipWith(argTypes, args, (t, x) => {
    try {
      t.covariant(x);
    } catch (e) {
      const err = new Error(e.message + "\n\n");
      throw err;
    }
    return t.encodeValue(x);
  }));
  return concat(magic, table, len, typs, vals);
}
function decode$1(retTypes, bytes2) {
  const b = new PipeArrayBuffer(bytes2);
  if (bytes2.byteLength < magicNumber.length) {
    throw new Error("Message length smaller than magic number");
  }
  const magicBuffer = safeRead(b, magicNumber.length);
  const magic = new TextDecoder().decode(magicBuffer);
  if (magic !== magicNumber) {
    throw new Error("Wrong magic number: " + JSON.stringify(magic));
  }
  function readTypeTable(pipe) {
    const typeTable = [];
    const len = Number(lebDecode(pipe));
    for (let i = 0; i < len; i++) {
      const ty = Number(slebDecode(pipe));
      switch (ty) {
        case -18:
        case -19: {
          const t = Number(slebDecode(pipe));
          typeTable.push([ty, t]);
          break;
        }
        case -20:
        case -21: {
          const fields = [];
          let objectLength = Number(lebDecode(pipe));
          let prevHash;
          while (objectLength--) {
            const hash2 = Number(lebDecode(pipe));
            if (hash2 >= Math.pow(2, 32)) {
              throw new Error("field id out of 32-bit range");
            }
            if (typeof prevHash === "number" && prevHash >= hash2) {
              throw new Error("field id collision or not sorted");
            }
            prevHash = hash2;
            const t = Number(slebDecode(pipe));
            fields.push([hash2, t]);
          }
          typeTable.push([ty, fields]);
          break;
        }
        case -22: {
          const args = [];
          let argLength = Number(lebDecode(pipe));
          while (argLength--) {
            args.push(Number(slebDecode(pipe)));
          }
          const returnValues = [];
          let returnValuesLength = Number(lebDecode(pipe));
          while (returnValuesLength--) {
            returnValues.push(Number(slebDecode(pipe)));
          }
          const annotations = [];
          let annotationLength = Number(lebDecode(pipe));
          while (annotationLength--) {
            const annotation = Number(lebDecode(pipe));
            switch (annotation) {
              case 1: {
                annotations.push("query");
                break;
              }
              case 2: {
                annotations.push("oneway");
                break;
              }
              case 3: {
                annotations.push("composite_query");
                break;
              }
              default:
                throw new Error("unknown annotation");
            }
          }
          typeTable.push([ty, [args, returnValues, annotations]]);
          break;
        }
        case -23: {
          let servLength = Number(lebDecode(pipe));
          const methods = [];
          while (servLength--) {
            const nameLength = Number(lebDecode(pipe));
            const funcName = new TextDecoder().decode(safeRead(pipe, nameLength));
            const funcType = slebDecode(pipe);
            methods.push([funcName, funcType]);
          }
          typeTable.push([ty, methods]);
          break;
        }
        default:
          throw new Error("Illegal op_code: " + ty);
      }
    }
    const rawList = [];
    const length = Number(lebDecode(pipe));
    for (let i = 0; i < length; i++) {
      rawList.push(Number(slebDecode(pipe)));
    }
    return [typeTable, rawList];
  }
  const [rawTable, rawTypes] = readTypeTable(b);
  if (rawTypes.length < retTypes.length) {
    throw new Error("Wrong number of return values");
  }
  const table = rawTable.map((_) => Rec());
  function getType(t) {
    if (t < -24) {
      throw new Error("future value not supported");
    }
    if (t < 0) {
      switch (t) {
        case -1:
          return Null;
        case -2:
          return Bool;
        case -3:
          return Nat;
        case -4:
          return Int;
        case -5:
          return Nat8;
        case -6:
          return Nat16;
        case -7:
          return Nat32;
        case -8:
          return Nat64;
        case -9:
          return Int8;
        case -10:
          return Int16;
        case -11:
          return Int32;
        case -12:
          return Int64;
        case -13:
          return Float32;
        case -14:
          return Float64;
        case -15:
          return Text;
        case -16:
          return Reserved;
        case -17:
          return Empty;
        case -24:
          return Principal2;
        default:
          throw new Error("Illegal op_code: " + t);
      }
    }
    if (t >= rawTable.length) {
      throw new Error("type index out of range");
    }
    return table[t];
  }
  function buildType(entry) {
    switch (entry[0]) {
      case -19: {
        const ty = getType(entry[1]);
        return Vec(ty);
      }
      case -18: {
        const ty = getType(entry[1]);
        return Opt(ty);
      }
      case -20: {
        const fields = {};
        for (const [hash2, ty] of entry[1]) {
          const name = `_${hash2}_`;
          fields[name] = getType(ty);
        }
        const record = Record(fields);
        const tuple = record.tryAsTuple();
        if (Array.isArray(tuple)) {
          return Tuple(...tuple);
        } else {
          return record;
        }
      }
      case -21: {
        const fields = {};
        for (const [hash2, ty] of entry[1]) {
          const name = `_${hash2}_`;
          fields[name] = getType(ty);
        }
        return Variant(fields);
      }
      case -22: {
        const [args, returnValues, annotations] = entry[1];
        return Func(args.map((t) => getType(t)), returnValues.map((t) => getType(t)), annotations);
      }
      case -23: {
        const rec = {};
        const methods = entry[1];
        for (const [name, typeRef] of methods) {
          let type = getType(typeRef);
          if (type instanceof RecClass) {
            type = type.getType();
          }
          if (!(type instanceof FuncClass)) {
            throw new Error("Illegal service definition: services can only contain functions");
          }
          rec[name] = type;
        }
        return Service(rec);
      }
      default:
        throw new Error("Illegal op_code: " + entry[0]);
    }
  }
  rawTable.forEach((entry, i) => {
    if (entry[0] === -22) {
      const t = buildType(entry);
      table[i].fill(t);
    }
  });
  rawTable.forEach((entry, i) => {
    if (entry[0] !== -22) {
      const t = buildType(entry);
      table[i].fill(t);
    }
  });
  const types = rawTypes.map((t) => getType(t));
  const output = retTypes.map((t, i) => {
    return t.decodeValue(b, types[i]);
  });
  for (let ind = retTypes.length; ind < types.length; ind++) {
    types[ind].decodeValue(b, types[ind]);
  }
  if (b.byteLength > 0) {
    throw new Error("decode: Left-over bytes");
  }
  return output;
}
const Empty = new EmptyClass();
const Reserved = new ReservedClass();
const Unknown = new UnknownClass();
const Bool = new BoolClass();
const Null = new NullClass();
const Text = new TextClass();
const Int = new IntClass();
const Nat = new NatClass();
const Float32 = new FloatClass(32);
const Float64 = new FloatClass(64);
const Int8 = new FixedIntClass(8);
const Int16 = new FixedIntClass(16);
const Int32 = new FixedIntClass(32);
const Int64 = new FixedIntClass(64);
const Nat8 = new FixedNatClass(8);
const Nat16 = new FixedNatClass(16);
const Nat32 = new FixedNatClass(32);
const Nat64 = new FixedNatClass(64);
const Principal2 = new PrincipalClass();
function Tuple(...types) {
  return new TupleClass(types);
}
function Vec(t) {
  return new VecClass(t);
}
function Opt(t) {
  return new OptClass(t);
}
function Record(t) {
  return new RecordClass(t);
}
function Variant(fields) {
  return new VariantClass(fields);
}
function Rec() {
  return new RecClass();
}
function Func(args, ret, annotations = []) {
  return new FuncClass(args, ret, annotations);
}
function Service(t) {
  return new ServiceClass(t);
}
const IDL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Bool,
  BoolClass,
  ConstructType,
  Empty,
  EmptyClass,
  FixedIntClass,
  FixedNatClass,
  Float32,
  Float64,
  FloatClass,
  Func,
  FuncClass,
  Int,
  Int16,
  Int32,
  Int64,
  Int8,
  IntClass,
  Nat,
  Nat16,
  Nat32,
  Nat64,
  Nat8,
  NatClass,
  Null,
  NullClass,
  Opt,
  OptClass,
  PrimitiveType,
  Principal: Principal2,
  PrincipalClass,
  Rec,
  RecClass,
  Record,
  RecordClass,
  Reserved,
  ReservedClass,
  Service,
  ServiceClass,
  Text,
  TextClass,
  Tuple,
  TupleClass,
  Type,
  Unknown,
  UnknownClass,
  Variant,
  VariantClass,
  Vec,
  VecClass,
  Visitor,
  decode: decode$1,
  encode: encode$1
}, Symbol.toStringTag, { value: "Module" }));
var src$1 = {};
var buffer = {};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(exports) {
  var base64 = base64Js;
  var ieee7542 = ieee754$1;
  var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
  exports.Buffer = Buffer3;
  exports.SlowBuffer = SlowBuffer;
  exports.INSPECT_MAX_BYTES = 50;
  var K_MAX_LENGTH = 2147483647;
  exports.kMaxLength = K_MAX_LENGTH;
  Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
  if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
    console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
  }
  function typedArraySupport() {
    try {
      var arr = new Uint8Array(1);
      var proto = { foo: function() {
        return 42;
      } };
      Object.setPrototypeOf(proto, Uint8Array.prototype);
      Object.setPrototypeOf(arr, proto);
      return arr.foo() === 42;
    } catch (e) {
      return false;
    }
  }
  Object.defineProperty(Buffer3.prototype, "parent", {
    enumerable: true,
    get: function() {
      if (!Buffer3.isBuffer(this))
        return void 0;
      return this.buffer;
    }
  });
  Object.defineProperty(Buffer3.prototype, "offset", {
    enumerable: true,
    get: function() {
      if (!Buffer3.isBuffer(this))
        return void 0;
      return this.byteOffset;
    }
  });
  function createBuffer(length) {
    if (length > K_MAX_LENGTH) {
      throw new RangeError('The value "' + length + '" is invalid for option "size"');
    }
    var buf = new Uint8Array(length);
    Object.setPrototypeOf(buf, Buffer3.prototype);
    return buf;
  }
  function Buffer3(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      if (typeof encodingOrOffset === "string") {
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      }
      return allocUnsafe(arg);
    }
    return from(arg, encodingOrOffset, length);
  }
  Buffer3.poolSize = 8192;
  function from(value2, encodingOrOffset, length) {
    if (typeof value2 === "string") {
      return fromString(value2, encodingOrOffset);
    }
    if (ArrayBuffer.isView(value2)) {
      return fromArrayView(value2);
    }
    if (value2 == null) {
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value2
      );
    }
    if (isInstance(value2, ArrayBuffer) || value2 && isInstance(value2.buffer, ArrayBuffer)) {
      return fromArrayBuffer(value2, encodingOrOffset, length);
    }
    if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value2, SharedArrayBuffer) || value2 && isInstance(value2.buffer, SharedArrayBuffer))) {
      return fromArrayBuffer(value2, encodingOrOffset, length);
    }
    if (typeof value2 === "number") {
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    }
    var valueOf = value2.valueOf && value2.valueOf();
    if (valueOf != null && valueOf !== value2) {
      return Buffer3.from(valueOf, encodingOrOffset, length);
    }
    var b = fromObject(value2);
    if (b)
      return b;
    if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value2[Symbol.toPrimitive] === "function") {
      return Buffer3.from(
        value2[Symbol.toPrimitive]("string"),
        encodingOrOffset,
        length
      );
    }
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value2
    );
  }
  Buffer3.from = function(value2, encodingOrOffset, length) {
    return from(value2, encodingOrOffset, length);
  };
  Object.setPrototypeOf(Buffer3.prototype, Uint8Array.prototype);
  Object.setPrototypeOf(Buffer3, Uint8Array);
  function assertSize(size) {
    if (typeof size !== "number") {
      throw new TypeError('"size" argument must be of type number');
    } else if (size < 0) {
      throw new RangeError('The value "' + size + '" is invalid for option "size"');
    }
  }
  function alloc(size, fill, encoding) {
    assertSize(size);
    if (size <= 0) {
      return createBuffer(size);
    }
    if (fill !== void 0) {
      return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
    }
    return createBuffer(size);
  }
  Buffer3.alloc = function(size, fill, encoding) {
    return alloc(size, fill, encoding);
  };
  function allocUnsafe(size) {
    assertSize(size);
    return createBuffer(size < 0 ? 0 : checked(size) | 0);
  }
  Buffer3.allocUnsafe = function(size) {
    return allocUnsafe(size);
  };
  Buffer3.allocUnsafeSlow = function(size) {
    return allocUnsafe(size);
  };
  function fromString(string2, encoding) {
    if (typeof encoding !== "string" || encoding === "") {
      encoding = "utf8";
    }
    if (!Buffer3.isEncoding(encoding)) {
      throw new TypeError("Unknown encoding: " + encoding);
    }
    var length = byteLength2(string2, encoding) | 0;
    var buf = createBuffer(length);
    var actual = buf.write(string2, encoding);
    if (actual !== length) {
      buf = buf.slice(0, actual);
    }
    return buf;
  }
  function fromArrayLike(array2) {
    var length = array2.length < 0 ? 0 : checked(array2.length) | 0;
    var buf = createBuffer(length);
    for (var i = 0; i < length; i += 1) {
      buf[i] = array2[i] & 255;
    }
    return buf;
  }
  function fromArrayView(arrayView) {
    if (isInstance(arrayView, Uint8Array)) {
      var copy = new Uint8Array(arrayView);
      return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
    }
    return fromArrayLike(arrayView);
  }
  function fromArrayBuffer(array2, byteOffset, length) {
    if (byteOffset < 0 || array2.byteLength < byteOffset) {
      throw new RangeError('"offset" is outside of buffer bounds');
    }
    if (array2.byteLength < byteOffset + (length || 0)) {
      throw new RangeError('"length" is outside of buffer bounds');
    }
    var buf;
    if (byteOffset === void 0 && length === void 0) {
      buf = new Uint8Array(array2);
    } else if (length === void 0) {
      buf = new Uint8Array(array2, byteOffset);
    } else {
      buf = new Uint8Array(array2, byteOffset, length);
    }
    Object.setPrototypeOf(buf, Buffer3.prototype);
    return buf;
  }
  function fromObject(obj) {
    if (Buffer3.isBuffer(obj)) {
      var len = checked(obj.length) | 0;
      var buf = createBuffer(len);
      if (buf.length === 0) {
        return buf;
      }
      obj.copy(buf, 0, 0, len);
      return buf;
    }
    if (obj.length !== void 0) {
      if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
        return createBuffer(0);
      }
      return fromArrayLike(obj);
    }
    if (obj.type === "Buffer" && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data);
    }
  }
  function checked(length) {
    if (length >= K_MAX_LENGTH) {
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
    }
    return length | 0;
  }
  function SlowBuffer(length) {
    if (+length != length) {
      length = 0;
    }
    return Buffer3.alloc(+length);
  }
  Buffer3.isBuffer = function isBuffer(b) {
    return b != null && b._isBuffer === true && b !== Buffer3.prototype;
  };
  Buffer3.compare = function compare2(a, b) {
    if (isInstance(a, Uint8Array))
      a = Buffer3.from(a, a.offset, a.byteLength);
    if (isInstance(b, Uint8Array))
      b = Buffer3.from(b, b.offset, b.byteLength);
    if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b)) {
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    }
    if (a === b)
      return 0;
    var x = a.length;
    var y = b.length;
    for (var i = 0, len = Math.min(x, y); i < len; ++i) {
      if (a[i] !== b[i]) {
        x = a[i];
        y = b[i];
        break;
      }
    }
    if (x < y)
      return -1;
    if (y < x)
      return 1;
    return 0;
  };
  Buffer3.isEncoding = function isEncoding(encoding) {
    switch (String(encoding).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return true;
      default:
        return false;
    }
  };
  Buffer3.concat = function concat2(list, length) {
    if (!Array.isArray(list)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    if (list.length === 0) {
      return Buffer3.alloc(0);
    }
    var i;
    if (length === void 0) {
      length = 0;
      for (i = 0; i < list.length; ++i) {
        length += list[i].length;
      }
    }
    var buffer2 = Buffer3.allocUnsafe(length);
    var pos = 0;
    for (i = 0; i < list.length; ++i) {
      var buf = list[i];
      if (isInstance(buf, Uint8Array)) {
        if (pos + buf.length > buffer2.length) {
          Buffer3.from(buf).copy(buffer2, pos);
        } else {
          Uint8Array.prototype.set.call(
            buffer2,
            buf,
            pos
          );
        }
      } else if (!Buffer3.isBuffer(buf)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      } else {
        buf.copy(buffer2, pos);
      }
      pos += buf.length;
    }
    return buffer2;
  };
  function byteLength2(string2, encoding) {
    if (Buffer3.isBuffer(string2)) {
      return string2.length;
    }
    if (ArrayBuffer.isView(string2) || isInstance(string2, ArrayBuffer)) {
      return string2.byteLength;
    }
    if (typeof string2 !== "string") {
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string2
      );
    }
    var len = string2.length;
    var mustMatch = arguments.length > 2 && arguments[2] === true;
    if (!mustMatch && len === 0)
      return 0;
    var loweredCase = false;
    for (; ; ) {
      switch (encoding) {
        case "ascii":
        case "latin1":
        case "binary":
          return len;
        case "utf8":
        case "utf-8":
          return utf8ToBytes2(string2).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return len * 2;
        case "hex":
          return len >>> 1;
        case "base64":
          return base64ToBytes(string2).length;
        default:
          if (loweredCase) {
            return mustMatch ? -1 : utf8ToBytes2(string2).length;
          }
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer3.byteLength = byteLength2;
  function slowToString(encoding, start, end) {
    var loweredCase = false;
    if (start === void 0 || start < 0) {
      start = 0;
    }
    if (start > this.length) {
      return "";
    }
    if (end === void 0 || end > this.length) {
      end = this.length;
    }
    if (end <= 0) {
      return "";
    }
    end >>>= 0;
    start >>>= 0;
    if (end <= start) {
      return "";
    }
    if (!encoding)
      encoding = "utf8";
    while (true) {
      switch (encoding) {
        case "hex":
          return hexSlice(this, start, end);
        case "utf8":
        case "utf-8":
          return utf8Slice(this, start, end);
        case "ascii":
          return asciiSlice(this, start, end);
        case "latin1":
        case "binary":
          return latin1Slice(this, start, end);
        case "base64":
          return base64Slice(this, start, end);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return utf16leSlice(this, start, end);
        default:
          if (loweredCase)
            throw new TypeError("Unknown encoding: " + encoding);
          encoding = (encoding + "").toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer3.prototype._isBuffer = true;
  function swap(b, n, m) {
    var i = b[n];
    b[n] = b[m];
    b[m] = i;
  }
  Buffer3.prototype.swap16 = function swap16() {
    var len = this.length;
    if (len % 2 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    }
    for (var i = 0; i < len; i += 2) {
      swap(this, i, i + 1);
    }
    return this;
  };
  Buffer3.prototype.swap32 = function swap32() {
    var len = this.length;
    if (len % 4 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    }
    for (var i = 0; i < len; i += 4) {
      swap(this, i, i + 3);
      swap(this, i + 1, i + 2);
    }
    return this;
  };
  Buffer3.prototype.swap64 = function swap64() {
    var len = this.length;
    if (len % 8 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    }
    for (var i = 0; i < len; i += 8) {
      swap(this, i, i + 7);
      swap(this, i + 1, i + 6);
      swap(this, i + 2, i + 5);
      swap(this, i + 3, i + 4);
    }
    return this;
  };
  Buffer3.prototype.toString = function toString() {
    var length = this.length;
    if (length === 0)
      return "";
    if (arguments.length === 0)
      return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
  };
  Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
  Buffer3.prototype.equals = function equals(b) {
    if (!Buffer3.isBuffer(b))
      throw new TypeError("Argument must be a Buffer");
    if (this === b)
      return true;
    return Buffer3.compare(this, b) === 0;
  };
  Buffer3.prototype.inspect = function inspect() {
    var str = "";
    var max = exports.INSPECT_MAX_BYTES;
    str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
    if (this.length > max)
      str += " ... ";
    return "<Buffer " + str + ">";
  };
  if (customInspectSymbol) {
    Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
  }
  Buffer3.prototype.compare = function compare2(target, start, end, thisStart, thisEnd) {
    if (isInstance(target, Uint8Array)) {
      target = Buffer3.from(target, target.offset, target.byteLength);
    }
    if (!Buffer3.isBuffer(target)) {
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
      );
    }
    if (start === void 0) {
      start = 0;
    }
    if (end === void 0) {
      end = target ? target.length : 0;
    }
    if (thisStart === void 0) {
      thisStart = 0;
    }
    if (thisEnd === void 0) {
      thisEnd = this.length;
    }
    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
      throw new RangeError("out of range index");
    }
    if (thisStart >= thisEnd && start >= end) {
      return 0;
    }
    if (thisStart >= thisEnd) {
      return -1;
    }
    if (start >= end) {
      return 1;
    }
    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target)
      return 0;
    var x = thisEnd - thisStart;
    var y = end - start;
    var len = Math.min(x, y);
    var thisCopy = this.slice(thisStart, thisEnd);
    var targetCopy = target.slice(start, end);
    for (var i = 0; i < len; ++i) {
      if (thisCopy[i] !== targetCopy[i]) {
        x = thisCopy[i];
        y = targetCopy[i];
        break;
      }
    }
    if (x < y)
      return -1;
    if (y < x)
      return 1;
    return 0;
  };
  function bidirectionalIndexOf(buffer2, val, byteOffset, encoding, dir) {
    if (buffer2.length === 0)
      return -1;
    if (typeof byteOffset === "string") {
      encoding = byteOffset;
      byteOffset = 0;
    } else if (byteOffset > 2147483647) {
      byteOffset = 2147483647;
    } else if (byteOffset < -2147483648) {
      byteOffset = -2147483648;
    }
    byteOffset = +byteOffset;
    if (numberIsNaN(byteOffset)) {
      byteOffset = dir ? 0 : buffer2.length - 1;
    }
    if (byteOffset < 0)
      byteOffset = buffer2.length + byteOffset;
    if (byteOffset >= buffer2.length) {
      if (dir)
        return -1;
      else
        byteOffset = buffer2.length - 1;
    } else if (byteOffset < 0) {
      if (dir)
        byteOffset = 0;
      else
        return -1;
    }
    if (typeof val === "string") {
      val = Buffer3.from(val, encoding);
    }
    if (Buffer3.isBuffer(val)) {
      if (val.length === 0) {
        return -1;
      }
      return arrayIndexOf(buffer2, val, byteOffset, encoding, dir);
    } else if (typeof val === "number") {
      val = val & 255;
      if (typeof Uint8Array.prototype.indexOf === "function") {
        if (dir) {
          return Uint8Array.prototype.indexOf.call(buffer2, val, byteOffset);
        } else {
          return Uint8Array.prototype.lastIndexOf.call(buffer2, val, byteOffset);
        }
      }
      return arrayIndexOf(buffer2, [val], byteOffset, encoding, dir);
    }
    throw new TypeError("val must be string, number or Buffer");
  }
  function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    var indexSize = 1;
    var arrLength = arr.length;
    var valLength = val.length;
    if (encoding !== void 0) {
      encoding = String(encoding).toLowerCase();
      if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
        if (arr.length < 2 || val.length < 2) {
          return -1;
        }
        indexSize = 2;
        arrLength /= 2;
        valLength /= 2;
        byteOffset /= 2;
      }
    }
    function read(buf, i2) {
      if (indexSize === 1) {
        return buf[i2];
      } else {
        return buf.readUInt16BE(i2 * indexSize);
      }
    }
    var i;
    if (dir) {
      var foundIndex = -1;
      for (i = byteOffset; i < arrLength; i++) {
        if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
          if (foundIndex === -1)
            foundIndex = i;
          if (i - foundIndex + 1 === valLength)
            return foundIndex * indexSize;
        } else {
          if (foundIndex !== -1)
            i -= i - foundIndex;
          foundIndex = -1;
        }
      }
    } else {
      if (byteOffset + valLength > arrLength)
        byteOffset = arrLength - valLength;
      for (i = byteOffset; i >= 0; i--) {
        var found = true;
        for (var j = 0; j < valLength; j++) {
          if (read(arr, i + j) !== read(val, j)) {
            found = false;
            break;
          }
        }
        if (found)
          return i;
      }
    }
    return -1;
  }
  Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
  };
  Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
  };
  Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
  };
  function hexWrite(buf, string2, offset, length) {
    offset = Number(offset) || 0;
    var remaining = buf.length - offset;
    if (!length) {
      length = remaining;
    } else {
      length = Number(length);
      if (length > remaining) {
        length = remaining;
      }
    }
    var strLen = string2.length;
    if (length > strLen / 2) {
      length = strLen / 2;
    }
    for (var i = 0; i < length; ++i) {
      var parsed = parseInt(string2.substr(i * 2, 2), 16);
      if (numberIsNaN(parsed))
        return i;
      buf[offset + i] = parsed;
    }
    return i;
  }
  function utf8Write(buf, string2, offset, length) {
    return blitBuffer(utf8ToBytes2(string2, buf.length - offset), buf, offset, length);
  }
  function asciiWrite(buf, string2, offset, length) {
    return blitBuffer(asciiToBytes(string2), buf, offset, length);
  }
  function base64Write(buf, string2, offset, length) {
    return blitBuffer(base64ToBytes(string2), buf, offset, length);
  }
  function ucs2Write(buf, string2, offset, length) {
    return blitBuffer(utf16leToBytes(string2, buf.length - offset), buf, offset, length);
  }
  Buffer3.prototype.write = function write(string2, offset, length, encoding) {
    if (offset === void 0) {
      encoding = "utf8";
      length = this.length;
      offset = 0;
    } else if (length === void 0 && typeof offset === "string") {
      encoding = offset;
      length = this.length;
      offset = 0;
    } else if (isFinite(offset)) {
      offset = offset >>> 0;
      if (isFinite(length)) {
        length = length >>> 0;
        if (encoding === void 0)
          encoding = "utf8";
      } else {
        encoding = length;
        length = void 0;
      }
    } else {
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    }
    var remaining = this.length - offset;
    if (length === void 0 || length > remaining)
      length = remaining;
    if (string2.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
      throw new RangeError("Attempt to write outside buffer bounds");
    }
    if (!encoding)
      encoding = "utf8";
    var loweredCase = false;
    for (; ; ) {
      switch (encoding) {
        case "hex":
          return hexWrite(this, string2, offset, length);
        case "utf8":
        case "utf-8":
          return utf8Write(this, string2, offset, length);
        case "ascii":
        case "latin1":
        case "binary":
          return asciiWrite(this, string2, offset, length);
        case "base64":
          return base64Write(this, string2, offset, length);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return ucs2Write(this, string2, offset, length);
        default:
          if (loweredCase)
            throw new TypeError("Unknown encoding: " + encoding);
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  };
  Buffer3.prototype.toJSON = function toJSON() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) {
      return base64.fromByteArray(buf);
    } else {
      return base64.fromByteArray(buf.slice(start, end));
    }
  }
  function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    var res = [];
    var i = start;
    while (i < end) {
      var firstByte = buf[i];
      var codePoint = null;
      var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
      if (i + bytesPerSequence <= end) {
        var secondByte, thirdByte, fourthByte, tempCodePoint;
        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 128) {
              codePoint = firstByte;
            }
            break;
          case 2:
            secondByte = buf[i + 1];
            if ((secondByte & 192) === 128) {
              tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
              if (tempCodePoint > 127) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 3:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
              if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 4:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            fourthByte = buf[i + 3];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
              if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                codePoint = tempCodePoint;
              }
            }
        }
      }
      if (codePoint === null) {
        codePoint = 65533;
        bytesPerSequence = 1;
      } else if (codePoint > 65535) {
        codePoint -= 65536;
        res.push(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      res.push(codePoint);
      i += bytesPerSequence;
    }
    return decodeCodePointsArray(res);
  }
  var MAX_ARGUMENTS_LENGTH = 4096;
  function decodeCodePointsArray(codePoints) {
    var len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints);
    }
    var res = "";
    var i = 0;
    while (i < len) {
      res += String.fromCharCode.apply(
        String,
        codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
      );
    }
    return res;
  }
  function asciiSlice(buf, start, end) {
    var ret = "";
    end = Math.min(buf.length, end);
    for (var i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i] & 127);
    }
    return ret;
  }
  function latin1Slice(buf, start, end) {
    var ret = "";
    end = Math.min(buf.length, end);
    for (var i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i]);
    }
    return ret;
  }
  function hexSlice(buf, start, end) {
    var len = buf.length;
    if (!start || start < 0)
      start = 0;
    if (!end || end < 0 || end > len)
      end = len;
    var out = "";
    for (var i = start; i < end; ++i) {
      out += hexSliceLookupTable[buf[i]];
    }
    return out;
  }
  function utf16leSlice(buf, start, end) {
    var bytes2 = buf.slice(start, end);
    var res = "";
    for (var i = 0; i < bytes2.length - 1; i += 2) {
      res += String.fromCharCode(bytes2[i] + bytes2[i + 1] * 256);
    }
    return res;
  }
  Buffer3.prototype.slice = function slice(start, end) {
    var len = this.length;
    start = ~~start;
    end = end === void 0 ? len : ~~end;
    if (start < 0) {
      start += len;
      if (start < 0)
        start = 0;
    } else if (start > len) {
      start = len;
    }
    if (end < 0) {
      end += len;
      if (end < 0)
        end = 0;
    } else if (end > len) {
      end = len;
    }
    if (end < start)
      end = start;
    var newBuf = this.subarray(start, end);
    Object.setPrototypeOf(newBuf, Buffer3.prototype);
    return newBuf;
  };
  function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0)
      throw new RangeError("offset is not uint");
    if (offset + ext > length)
      throw new RangeError("Trying to access beyond buffer length");
  }
  Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE2(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert)
      checkOffset(offset, byteLength3, this.length);
    var val = this[offset];
    var mul = 1;
    var i = 0;
    while (++i < byteLength3 && (mul *= 256)) {
      val += this[offset + i] * mul;
    }
    return val;
  };
  Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      checkOffset(offset, byteLength3, this.length);
    }
    var val = this[offset + --byteLength3];
    var mul = 1;
    while (byteLength3 > 0 && (mul *= 256)) {
      val += this[offset + --byteLength3] * mul;
    }
    return val;
  };
  Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 1, this.length);
    return this[offset];
  };
  Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
  };
  Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
  };
  Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
  };
  Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
  };
  Buffer3.prototype.readIntLE = function readIntLE2(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert)
      checkOffset(offset, byteLength3, this.length);
    var val = this[offset];
    var mul = 1;
    var i = 0;
    while (++i < byteLength3 && (mul *= 256)) {
      val += this[offset + i] * mul;
    }
    mul *= 128;
    if (val >= mul)
      val -= Math.pow(2, 8 * byteLength3);
    return val;
  };
  Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert)
      checkOffset(offset, byteLength3, this.length);
    var i = byteLength3;
    var mul = 1;
    var val = this[offset + --i];
    while (i > 0 && (mul *= 256)) {
      val += this[offset + --i] * mul;
    }
    mul *= 128;
    if (val >= mul)
      val -= Math.pow(2, 8 * byteLength3);
    return val;
  };
  Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 1, this.length);
    if (!(this[offset] & 128))
      return this[offset];
    return (255 - this[offset] + 1) * -1;
  };
  Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    var val = this[offset] | this[offset + 1] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    var val = this[offset + 1] | this[offset] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
  };
  Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
  };
  Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return ieee7542.read(this, offset, true, 23, 4);
  };
  Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return ieee7542.read(this, offset, false, 23, 4);
  };
  Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 8, this.length);
    return ieee7542.read(this, offset, true, 52, 8);
  };
  Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 8, this.length);
    return ieee7542.read(this, offset, false, 52, 8);
  };
  function checkInt(buf, value2, offset, ext, max, min) {
    if (!Buffer3.isBuffer(buf))
      throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value2 > max || value2 < min)
      throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length)
      throw new RangeError("Index out of range");
  }
  Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE2(value2, offset, byteLength3, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      var maxBytes = Math.pow(2, 8 * byteLength3) - 1;
      checkInt(this, value2, offset, byteLength3, maxBytes, 0);
    }
    var mul = 1;
    var i = 0;
    this[offset] = value2 & 255;
    while (++i < byteLength3 && (mul *= 256)) {
      this[offset + i] = value2 / mul & 255;
    }
    return offset + byteLength3;
  };
  Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value2, offset, byteLength3, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      var maxBytes = Math.pow(2, 8 * byteLength3) - 1;
      checkInt(this, value2, offset, byteLength3, maxBytes, 0);
    }
    var i = byteLength3 - 1;
    var mul = 1;
    this[offset + i] = value2 & 255;
    while (--i >= 0 && (mul *= 256)) {
      this[offset + i] = value2 / mul & 255;
    }
    return offset + byteLength3;
  };
  Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 1, 255, 0);
    this[offset] = value2 & 255;
    return offset + 1;
  };
  Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 2, 65535, 0);
    this[offset] = value2 & 255;
    this[offset + 1] = value2 >>> 8;
    return offset + 2;
  };
  Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 2, 65535, 0);
    this[offset] = value2 >>> 8;
    this[offset + 1] = value2 & 255;
    return offset + 2;
  };
  Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 4, 4294967295, 0);
    this[offset + 3] = value2 >>> 24;
    this[offset + 2] = value2 >>> 16;
    this[offset + 1] = value2 >>> 8;
    this[offset] = value2 & 255;
    return offset + 4;
  };
  Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 4, 4294967295, 0);
    this[offset] = value2 >>> 24;
    this[offset + 1] = value2 >>> 16;
    this[offset + 2] = value2 >>> 8;
    this[offset + 3] = value2 & 255;
    return offset + 4;
  };
  Buffer3.prototype.writeIntLE = function writeIntLE2(value2, offset, byteLength3, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert) {
      var limit = Math.pow(2, 8 * byteLength3 - 1);
      checkInt(this, value2, offset, byteLength3, limit - 1, -limit);
    }
    var i = 0;
    var mul = 1;
    var sub = 0;
    this[offset] = value2 & 255;
    while (++i < byteLength3 && (mul *= 256)) {
      if (value2 < 0 && sub === 0 && this[offset + i - 1] !== 0) {
        sub = 1;
      }
      this[offset + i] = (value2 / mul >> 0) - sub & 255;
    }
    return offset + byteLength3;
  };
  Buffer3.prototype.writeIntBE = function writeIntBE(value2, offset, byteLength3, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert) {
      var limit = Math.pow(2, 8 * byteLength3 - 1);
      checkInt(this, value2, offset, byteLength3, limit - 1, -limit);
    }
    var i = byteLength3 - 1;
    var mul = 1;
    var sub = 0;
    this[offset + i] = value2 & 255;
    while (--i >= 0 && (mul *= 256)) {
      if (value2 < 0 && sub === 0 && this[offset + i + 1] !== 0) {
        sub = 1;
      }
      this[offset + i] = (value2 / mul >> 0) - sub & 255;
    }
    return offset + byteLength3;
  };
  Buffer3.prototype.writeInt8 = function writeInt8(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 1, 127, -128);
    if (value2 < 0)
      value2 = 255 + value2 + 1;
    this[offset] = value2 & 255;
    return offset + 1;
  };
  Buffer3.prototype.writeInt16LE = function writeInt16LE(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 2, 32767, -32768);
    this[offset] = value2 & 255;
    this[offset + 1] = value2 >>> 8;
    return offset + 2;
  };
  Buffer3.prototype.writeInt16BE = function writeInt16BE(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 2, 32767, -32768);
    this[offset] = value2 >>> 8;
    this[offset + 1] = value2 & 255;
    return offset + 2;
  };
  Buffer3.prototype.writeInt32LE = function writeInt32LE(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 4, 2147483647, -2147483648);
    this[offset] = value2 & 255;
    this[offset + 1] = value2 >>> 8;
    this[offset + 2] = value2 >>> 16;
    this[offset + 3] = value2 >>> 24;
    return offset + 4;
  };
  Buffer3.prototype.writeInt32BE = function writeInt32BE(value2, offset, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value2, offset, 4, 2147483647, -2147483648);
    if (value2 < 0)
      value2 = 4294967295 + value2 + 1;
    this[offset] = value2 >>> 24;
    this[offset + 1] = value2 >>> 16;
    this[offset + 2] = value2 >>> 8;
    this[offset + 3] = value2 & 255;
    return offset + 4;
  };
  function checkIEEE754(buf, value2, offset, ext, max, min) {
    if (offset + ext > buf.length)
      throw new RangeError("Index out of range");
    if (offset < 0)
      throw new RangeError("Index out of range");
  }
  function writeFloat(buf, value2, offset, littleEndian, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf, value2, offset, 4);
    }
    ieee7542.write(buf, value2, offset, littleEndian, 23, 4);
    return offset + 4;
  }
  Buffer3.prototype.writeFloatLE = function writeFloatLE(value2, offset, noAssert) {
    return writeFloat(this, value2, offset, true, noAssert);
  };
  Buffer3.prototype.writeFloatBE = function writeFloatBE(value2, offset, noAssert) {
    return writeFloat(this, value2, offset, false, noAssert);
  };
  function writeDouble(buf, value2, offset, littleEndian, noAssert) {
    value2 = +value2;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf, value2, offset, 8);
    }
    ieee7542.write(buf, value2, offset, littleEndian, 52, 8);
    return offset + 8;
  }
  Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value2, offset, noAssert) {
    return writeDouble(this, value2, offset, true, noAssert);
  };
  Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value2, offset, noAssert) {
    return writeDouble(this, value2, offset, false, noAssert);
  };
  Buffer3.prototype.copy = function copy(target, targetStart, start, end) {
    if (!Buffer3.isBuffer(target))
      throw new TypeError("argument should be a Buffer");
    if (!start)
      start = 0;
    if (!end && end !== 0)
      end = this.length;
    if (targetStart >= target.length)
      targetStart = target.length;
    if (!targetStart)
      targetStart = 0;
    if (end > 0 && end < start)
      end = start;
    if (end === start)
      return 0;
    if (target.length === 0 || this.length === 0)
      return 0;
    if (targetStart < 0) {
      throw new RangeError("targetStart out of bounds");
    }
    if (start < 0 || start >= this.length)
      throw new RangeError("Index out of range");
    if (end < 0)
      throw new RangeError("sourceEnd out of bounds");
    if (end > this.length)
      end = this.length;
    if (target.length - targetStart < end - start) {
      end = target.length - targetStart + start;
    }
    var len = end - start;
    if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
      this.copyWithin(targetStart, start, end);
    } else {
      Uint8Array.prototype.set.call(
        target,
        this.subarray(start, end),
        targetStart
      );
    }
    return len;
  };
  Buffer3.prototype.fill = function fill(val, start, end, encoding) {
    if (typeof val === "string") {
      if (typeof start === "string") {
        encoding = start;
        start = 0;
        end = this.length;
      } else if (typeof end === "string") {
        encoding = end;
        end = this.length;
      }
      if (encoding !== void 0 && typeof encoding !== "string") {
        throw new TypeError("encoding must be a string");
      }
      if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      if (val.length === 1) {
        var code2 = val.charCodeAt(0);
        if (encoding === "utf8" && code2 < 128 || encoding === "latin1") {
          val = code2;
        }
      }
    } else if (typeof val === "number") {
      val = val & 255;
    } else if (typeof val === "boolean") {
      val = Number(val);
    }
    if (start < 0 || this.length < start || this.length < end) {
      throw new RangeError("Out of range index");
    }
    if (end <= start) {
      return this;
    }
    start = start >>> 0;
    end = end === void 0 ? this.length : end >>> 0;
    if (!val)
      val = 0;
    var i;
    if (typeof val === "number") {
      for (i = start; i < end; ++i) {
        this[i] = val;
      }
    } else {
      var bytes2 = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
      var len = bytes2.length;
      if (len === 0) {
        throw new TypeError('The value "' + val + '" is invalid for argument "value"');
      }
      for (i = 0; i < end - start; ++i) {
        this[i + start] = bytes2[i % len];
      }
    }
    return this;
  };
  var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
  function base64clean(str) {
    str = str.split("=")[0];
    str = str.trim().replace(INVALID_BASE64_RE, "");
    if (str.length < 2)
      return "";
    while (str.length % 4 !== 0) {
      str = str + "=";
    }
    return str;
  }
  function utf8ToBytes2(string2, units) {
    units = units || Infinity;
    var codePoint;
    var length = string2.length;
    var leadSurrogate = null;
    var bytes2 = [];
    for (var i = 0; i < length; ++i) {
      codePoint = string2.charCodeAt(i);
      if (codePoint > 55295 && codePoint < 57344) {
        if (!leadSurrogate) {
          if (codePoint > 56319) {
            if ((units -= 3) > -1)
              bytes2.push(239, 191, 189);
            continue;
          } else if (i + 1 === length) {
            if ((units -= 3) > -1)
              bytes2.push(239, 191, 189);
            continue;
          }
          leadSurrogate = codePoint;
          continue;
        }
        if (codePoint < 56320) {
          if ((units -= 3) > -1)
            bytes2.push(239, 191, 189);
          leadSurrogate = codePoint;
          continue;
        }
        codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
      } else if (leadSurrogate) {
        if ((units -= 3) > -1)
          bytes2.push(239, 191, 189);
      }
      leadSurrogate = null;
      if (codePoint < 128) {
        if ((units -= 1) < 0)
          break;
        bytes2.push(codePoint);
      } else if (codePoint < 2048) {
        if ((units -= 2) < 0)
          break;
        bytes2.push(
          codePoint >> 6 | 192,
          codePoint & 63 | 128
        );
      } else if (codePoint < 65536) {
        if ((units -= 3) < 0)
          break;
        bytes2.push(
          codePoint >> 12 | 224,
          codePoint >> 6 & 63 | 128,
          codePoint & 63 | 128
        );
      } else if (codePoint < 1114112) {
        if ((units -= 4) < 0)
          break;
        bytes2.push(
          codePoint >> 18 | 240,
          codePoint >> 12 & 63 | 128,
          codePoint >> 6 & 63 | 128,
          codePoint & 63 | 128
        );
      } else {
        throw new Error("Invalid code point");
      }
    }
    return bytes2;
  }
  function asciiToBytes(str) {
    var byteArray = [];
    for (var i = 0; i < str.length; ++i) {
      byteArray.push(str.charCodeAt(i) & 255);
    }
    return byteArray;
  }
  function utf16leToBytes(str, units) {
    var c2, hi, lo;
    var byteArray = [];
    for (var i = 0; i < str.length; ++i) {
      if ((units -= 2) < 0)
        break;
      c2 = str.charCodeAt(i);
      hi = c2 >> 8;
      lo = c2 % 256;
      byteArray.push(lo);
      byteArray.push(hi);
    }
    return byteArray;
  }
  function base64ToBytes(str) {
    return base64.toByteArray(base64clean(str));
  }
  function blitBuffer(src2, dst, offset, length) {
    for (var i = 0; i < length; ++i) {
      if (i + offset >= dst.length || i >= src2.length)
        break;
      dst[i + offset] = src2[i];
    }
    return i;
  }
  function isInstance(obj, type) {
    return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
  }
  function numberIsNaN(obj) {
    return obj !== obj;
  }
  var hexSliceLookupTable = function() {
    var alphabet2 = "0123456789abcdef";
    var table = new Array(256);
    for (var i = 0; i < 16; ++i) {
      var i162 = i * 16;
      for (var j = 0; j < 16; ++j) {
        table[i162 + j] = alphabet2[i] + alphabet2[j];
      }
    }
    return table;
  }();
})(buffer);
var bignumber = { exports: {} };
(function(module) {
  (function(globalObject) {
    var BigNumber, isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i, mathceil = Math.ceil, mathfloor = Math.floor, bignumberError = "[BigNumber Error] ", tooManyDigits = bignumberError + "Number primitive has more than 15 significant digits: ", BASE = 1e14, LOG_BASE = 14, MAX_SAFE_INTEGER = 9007199254740991, POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13], SQRT_BASE = 1e7, MAX = 1e9;
    function clone(configObject) {
      var div, convertBase, parseNumeric, P = BigNumber2.prototype = { constructor: BigNumber2, toString: null, valueOf: null }, ONE = new BigNumber2(1), DECIMAL_PLACES = 20, ROUNDING_MODE = 4, TO_EXP_NEG = -7, TO_EXP_POS = 21, MIN_EXP = -1e7, MAX_EXP = 1e7, CRYPTO = false, MODULO_MODE = 1, POW_PRECISION = 0, FORMAT = {
        prefix: "",
        groupSize: 3,
        secondaryGroupSize: 0,
        groupSeparator: ",",
        decimalSeparator: ".",
        fractionGroupSize: 0,
        fractionGroupSeparator: " ",
        // non-breaking space
        suffix: ""
      }, ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz", alphabetHasNormalDecimalDigits = true;
      function BigNumber2(v, b) {
        var alphabet2, c2, caseChanged, e, i, isNum, len, str, x = this;
        if (!(x instanceof BigNumber2))
          return new BigNumber2(v, b);
        if (b == null) {
          if (v && v._isBigNumber === true) {
            x.s = v.s;
            if (!v.c || v.e > MAX_EXP) {
              x.c = x.e = null;
            } else if (v.e < MIN_EXP) {
              x.c = [x.e = 0];
            } else {
              x.e = v.e;
              x.c = v.c.slice();
            }
            return;
          }
          if ((isNum = typeof v == "number") && v * 0 == 0) {
            x.s = 1 / v < 0 ? (v = -v, -1) : 1;
            if (v === ~~v) {
              for (e = 0, i = v; i >= 10; i /= 10, e++)
                ;
              if (e > MAX_EXP) {
                x.c = x.e = null;
              } else {
                x.e = e;
                x.c = [v];
              }
              return;
            }
            str = String(v);
          } else {
            if (!isNumeric.test(str = String(v)))
              return parseNumeric(x, str, isNum);
            x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
          }
          if ((e = str.indexOf(".")) > -1)
            str = str.replace(".", "");
          if ((i = str.search(/e/i)) > 0) {
            if (e < 0)
              e = i;
            e += +str.slice(i + 1);
            str = str.substring(0, i);
          } else if (e < 0) {
            e = str.length;
          }
        } else {
          intCheck(b, 2, ALPHABET.length, "Base");
          if (b == 10 && alphabetHasNormalDecimalDigits) {
            x = new BigNumber2(v);
            return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
          }
          str = String(v);
          if (isNum = typeof v == "number") {
            if (v * 0 != 0)
              return parseNumeric(x, str, isNum, b);
            x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;
            if (BigNumber2.DEBUG && str.replace(/^0\.0*|\./, "").length > 15) {
              throw Error(tooManyDigits + v);
            }
          } else {
            x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
          }
          alphabet2 = ALPHABET.slice(0, b);
          e = i = 0;
          for (len = str.length; i < len; i++) {
            if (alphabet2.indexOf(c2 = str.charAt(i)) < 0) {
              if (c2 == ".") {
                if (i > e) {
                  e = len;
                  continue;
                }
              } else if (!caseChanged) {
                if (str == str.toUpperCase() && (str = str.toLowerCase()) || str == str.toLowerCase() && (str = str.toUpperCase())) {
                  caseChanged = true;
                  i = -1;
                  e = 0;
                  continue;
                }
              }
              return parseNumeric(x, String(v), isNum, b);
            }
          }
          isNum = false;
          str = convertBase(str, b, 10, x.s);
          if ((e = str.indexOf(".")) > -1)
            str = str.replace(".", "");
          else
            e = str.length;
        }
        for (i = 0; str.charCodeAt(i) === 48; i++)
          ;
        for (len = str.length; str.charCodeAt(--len) === 48; )
          ;
        if (str = str.slice(i, ++len)) {
          len -= i;
          if (isNum && BigNumber2.DEBUG && len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
            throw Error(tooManyDigits + x.s * v);
          }
          if ((e = e - i - 1) > MAX_EXP) {
            x.c = x.e = null;
          } else if (e < MIN_EXP) {
            x.c = [x.e = 0];
          } else {
            x.e = e;
            x.c = [];
            i = (e + 1) % LOG_BASE;
            if (e < 0)
              i += LOG_BASE;
            if (i < len) {
              if (i)
                x.c.push(+str.slice(0, i));
              for (len -= LOG_BASE; i < len; ) {
                x.c.push(+str.slice(i, i += LOG_BASE));
              }
              i = LOG_BASE - (str = str.slice(i)).length;
            } else {
              i -= len;
            }
            for (; i--; str += "0")
              ;
            x.c.push(+str);
          }
        } else {
          x.c = [x.e = 0];
        }
      }
      BigNumber2.clone = clone;
      BigNumber2.ROUND_UP = 0;
      BigNumber2.ROUND_DOWN = 1;
      BigNumber2.ROUND_CEIL = 2;
      BigNumber2.ROUND_FLOOR = 3;
      BigNumber2.ROUND_HALF_UP = 4;
      BigNumber2.ROUND_HALF_DOWN = 5;
      BigNumber2.ROUND_HALF_EVEN = 6;
      BigNumber2.ROUND_HALF_CEIL = 7;
      BigNumber2.ROUND_HALF_FLOOR = 8;
      BigNumber2.EUCLID = 9;
      BigNumber2.config = BigNumber2.set = function(obj) {
        var p, v;
        if (obj != null) {
          if (typeof obj == "object") {
            if (obj.hasOwnProperty(p = "DECIMAL_PLACES")) {
              v = obj[p];
              intCheck(v, 0, MAX, p);
              DECIMAL_PLACES = v;
            }
            if (obj.hasOwnProperty(p = "ROUNDING_MODE")) {
              v = obj[p];
              intCheck(v, 0, 8, p);
              ROUNDING_MODE = v;
            }
            if (obj.hasOwnProperty(p = "EXPONENTIAL_AT")) {
              v = obj[p];
              if (v && v.pop) {
                intCheck(v[0], -MAX, 0, p);
                intCheck(v[1], 0, MAX, p);
                TO_EXP_NEG = v[0];
                TO_EXP_POS = v[1];
              } else {
                intCheck(v, -MAX, MAX, p);
                TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
              }
            }
            if (obj.hasOwnProperty(p = "RANGE")) {
              v = obj[p];
              if (v && v.pop) {
                intCheck(v[0], -MAX, -1, p);
                intCheck(v[1], 1, MAX, p);
                MIN_EXP = v[0];
                MAX_EXP = v[1];
              } else {
                intCheck(v, -MAX, MAX, p);
                if (v) {
                  MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
                } else {
                  throw Error(bignumberError + p + " cannot be zero: " + v);
                }
              }
            }
            if (obj.hasOwnProperty(p = "CRYPTO")) {
              v = obj[p];
              if (v === !!v) {
                if (v) {
                  if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
                    CRYPTO = v;
                  } else {
                    CRYPTO = !v;
                    throw Error(bignumberError + "crypto unavailable");
                  }
                } else {
                  CRYPTO = v;
                }
              } else {
                throw Error(bignumberError + p + " not true or false: " + v);
              }
            }
            if (obj.hasOwnProperty(p = "MODULO_MODE")) {
              v = obj[p];
              intCheck(v, 0, 9, p);
              MODULO_MODE = v;
            }
            if (obj.hasOwnProperty(p = "POW_PRECISION")) {
              v = obj[p];
              intCheck(v, 0, MAX, p);
              POW_PRECISION = v;
            }
            if (obj.hasOwnProperty(p = "FORMAT")) {
              v = obj[p];
              if (typeof v == "object")
                FORMAT = v;
              else
                throw Error(bignumberError + p + " not an object: " + v);
            }
            if (obj.hasOwnProperty(p = "ALPHABET")) {
              v = obj[p];
              if (typeof v == "string" && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
                alphabetHasNormalDecimalDigits = v.slice(0, 10) == "0123456789";
                ALPHABET = v;
              } else {
                throw Error(bignumberError + p + " invalid: " + v);
              }
            }
          } else {
            throw Error(bignumberError + "Object expected: " + obj);
          }
        }
        return {
          DECIMAL_PLACES,
          ROUNDING_MODE,
          EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
          RANGE: [MIN_EXP, MAX_EXP],
          CRYPTO,
          MODULO_MODE,
          POW_PRECISION,
          FORMAT,
          ALPHABET
        };
      };
      BigNumber2.isBigNumber = function(v) {
        if (!v || v._isBigNumber !== true)
          return false;
        if (!BigNumber2.DEBUG)
          return true;
        var i, n, c2 = v.c, e = v.e, s = v.s;
        out:
          if ({}.toString.call(c2) == "[object Array]") {
            if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {
              if (c2[0] === 0) {
                if (e === 0 && c2.length === 1)
                  return true;
                break out;
              }
              i = (e + 1) % LOG_BASE;
              if (i < 1)
                i += LOG_BASE;
              if (String(c2[0]).length == i) {
                for (i = 0; i < c2.length; i++) {
                  n = c2[i];
                  if (n < 0 || n >= BASE || n !== mathfloor(n))
                    break out;
                }
                if (n !== 0)
                  return true;
              }
            }
          } else if (c2 === null && e === null && (s === null || s === 1 || s === -1)) {
            return true;
          }
        throw Error(bignumberError + "Invalid BigNumber: " + v);
      };
      BigNumber2.maximum = BigNumber2.max = function() {
        return maxOrMin(arguments, -1);
      };
      BigNumber2.minimum = BigNumber2.min = function() {
        return maxOrMin(arguments, 1);
      };
      BigNumber2.random = function() {
        var pow2_53 = 9007199254740992;
        var random53bitInt = Math.random() * pow2_53 & 2097151 ? function() {
          return mathfloor(Math.random() * pow2_53);
        } : function() {
          return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0);
        };
        return function(dp) {
          var a, b, e, k, v, i = 0, c2 = [], rand = new BigNumber2(ONE);
          if (dp == null)
            dp = DECIMAL_PLACES;
          else
            intCheck(dp, 0, MAX);
          k = mathceil(dp / LOG_BASE);
          if (CRYPTO) {
            if (crypto.getRandomValues) {
              a = crypto.getRandomValues(new Uint32Array(k *= 2));
              for (; i < k; ) {
                v = a[i] * 131072 + (a[i + 1] >>> 11);
                if (v >= 9e15) {
                  b = crypto.getRandomValues(new Uint32Array(2));
                  a[i] = b[0];
                  a[i + 1] = b[1];
                } else {
                  c2.push(v % 1e14);
                  i += 2;
                }
              }
              i = k / 2;
            } else if (crypto.randomBytes) {
              a = crypto.randomBytes(k *= 7);
              for (; i < k; ) {
                v = (a[i] & 31) * 281474976710656 + a[i + 1] * 1099511627776 + a[i + 2] * 4294967296 + a[i + 3] * 16777216 + (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];
                if (v >= 9e15) {
                  crypto.randomBytes(7).copy(a, i);
                } else {
                  c2.push(v % 1e14);
                  i += 7;
                }
              }
              i = k / 7;
            } else {
              CRYPTO = false;
              throw Error(bignumberError + "crypto unavailable");
            }
          }
          if (!CRYPTO) {
            for (; i < k; ) {
              v = random53bitInt();
              if (v < 9e15)
                c2[i++] = v % 1e14;
            }
          }
          k = c2[--i];
          dp %= LOG_BASE;
          if (k && dp) {
            v = POWS_TEN[LOG_BASE - dp];
            c2[i] = mathfloor(k / v) * v;
          }
          for (; c2[i] === 0; c2.pop(), i--)
            ;
          if (i < 0) {
            c2 = [e = 0];
          } else {
            for (e = -1; c2[0] === 0; c2.splice(0, 1), e -= LOG_BASE)
              ;
            for (i = 1, v = c2[0]; v >= 10; v /= 10, i++)
              ;
            if (i < LOG_BASE)
              e -= LOG_BASE - i;
          }
          rand.e = e;
          rand.c = c2;
          return rand;
        };
      }();
      BigNumber2.sum = function() {
        var i = 1, args = arguments, sum = new BigNumber2(args[0]);
        for (; i < args.length; )
          sum = sum.plus(args[i++]);
        return sum;
      };
      convertBase = function() {
        var decimal = "0123456789";
        function toBaseOut(str, baseIn, baseOut, alphabet2) {
          var j, arr = [0], arrL, i = 0, len = str.length;
          for (; i < len; ) {
            for (arrL = arr.length; arrL--; arr[arrL] *= baseIn)
              ;
            arr[0] += alphabet2.indexOf(str.charAt(i++));
            for (j = 0; j < arr.length; j++) {
              if (arr[j] > baseOut - 1) {
                if (arr[j + 1] == null)
                  arr[j + 1] = 0;
                arr[j + 1] += arr[j] / baseOut | 0;
                arr[j] %= baseOut;
              }
            }
          }
          return arr.reverse();
        }
        return function(str, baseIn, baseOut, sign, callerIsToString) {
          var alphabet2, d, e, k, r, x, xc, y, i = str.indexOf("."), dp = DECIMAL_PLACES, rm = ROUNDING_MODE;
          if (i >= 0) {
            k = POW_PRECISION;
            POW_PRECISION = 0;
            str = str.replace(".", "");
            y = new BigNumber2(baseIn);
            x = y.pow(str.length - i);
            POW_PRECISION = k;
            y.c = toBaseOut(
              toFixedPoint(coeffToString(x.c), x.e, "0"),
              10,
              baseOut,
              decimal
            );
            y.e = y.c.length;
          }
          xc = toBaseOut(str, baseIn, baseOut, callerIsToString ? (alphabet2 = ALPHABET, decimal) : (alphabet2 = decimal, ALPHABET));
          e = k = xc.length;
          for (; xc[--k] == 0; xc.pop())
            ;
          if (!xc[0])
            return alphabet2.charAt(0);
          if (i < 0) {
            --e;
          } else {
            x.c = xc;
            x.e = e;
            x.s = sign;
            x = div(x, y, dp, rm, baseOut);
            xc = x.c;
            r = x.r;
            e = x.e;
          }
          d = e + dp + 1;
          i = xc[d];
          k = baseOut / 2;
          r = r || d < 0 || xc[d + 1] != null;
          r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : i > k || i == k && (rm == 4 || r || rm == 6 && xc[d - 1] & 1 || rm == (x.s < 0 ? 8 : 7));
          if (d < 1 || !xc[0]) {
            str = r ? toFixedPoint(alphabet2.charAt(1), -dp, alphabet2.charAt(0)) : alphabet2.charAt(0);
          } else {
            xc.length = d;
            if (r) {
              for (--baseOut; ++xc[--d] > baseOut; ) {
                xc[d] = 0;
                if (!d) {
                  ++e;
                  xc = [1].concat(xc);
                }
              }
            }
            for (k = xc.length; !xc[--k]; )
              ;
            for (i = 0, str = ""; i <= k; str += alphabet2.charAt(xc[i++]))
              ;
            str = toFixedPoint(str, e, alphabet2.charAt(0));
          }
          return str;
        };
      }();
      div = function() {
        function multiply(x, k, base) {
          var m, temp, xlo, xhi, carry = 0, i = x.length, klo = k % SQRT_BASE, khi = k / SQRT_BASE | 0;
          for (x = x.slice(); i--; ) {
            xlo = x[i] % SQRT_BASE;
            xhi = x[i] / SQRT_BASE | 0;
            m = khi * xlo + xhi * klo;
            temp = klo * xlo + m % SQRT_BASE * SQRT_BASE + carry;
            carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
            x[i] = temp % base;
          }
          if (carry)
            x = [carry].concat(x);
          return x;
        }
        function compare3(a, b, aL, bL) {
          var i, cmp;
          if (aL != bL) {
            cmp = aL > bL ? 1 : -1;
          } else {
            for (i = cmp = 0; i < aL; i++) {
              if (a[i] != b[i]) {
                cmp = a[i] > b[i] ? 1 : -1;
                break;
              }
            }
          }
          return cmp;
        }
        function subtract(a, b, aL, base) {
          var i = 0;
          for (; aL--; ) {
            a[aL] -= i;
            i = a[aL] < b[aL] ? 1 : 0;
            a[aL] = i * base + a[aL] - b[aL];
          }
          for (; !a[0] && a.length > 1; a.splice(0, 1))
            ;
        }
        return function(x, y, dp, rm, base) {
          var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0, yL, yz, s = x.s == y.s ? 1 : -1, xc = x.c, yc = y.c;
          if (!xc || !xc[0] || !yc || !yc[0]) {
            return new BigNumber2(
              // Return NaN if either NaN, or both Infinity or 0.
              !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN : (
                // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
                xc && xc[0] == 0 || !yc ? s * 0 : s / 0
              )
            );
          }
          q = new BigNumber2(s);
          qc = q.c = [];
          e = x.e - y.e;
          s = dp + e + 1;
          if (!base) {
            base = BASE;
            e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
            s = s / LOG_BASE | 0;
          }
          for (i = 0; yc[i] == (xc[i] || 0); i++)
            ;
          if (yc[i] > (xc[i] || 0))
            e--;
          if (s < 0) {
            qc.push(1);
            more = true;
          } else {
            xL = xc.length;
            yL = yc.length;
            i = 0;
            s += 2;
            n = mathfloor(base / (yc[0] + 1));
            if (n > 1) {
              yc = multiply(yc, n, base);
              xc = multiply(xc, n, base);
              yL = yc.length;
              xL = xc.length;
            }
            xi = yL;
            rem = xc.slice(0, yL);
            remL = rem.length;
            for (; remL < yL; rem[remL++] = 0)
              ;
            yz = yc.slice();
            yz = [0].concat(yz);
            yc0 = yc[0];
            if (yc[1] >= base / 2)
              yc0++;
            do {
              n = 0;
              cmp = compare3(yc, rem, yL, remL);
              if (cmp < 0) {
                rem0 = rem[0];
                if (yL != remL)
                  rem0 = rem0 * base + (rem[1] || 0);
                n = mathfloor(rem0 / yc0);
                if (n > 1) {
                  if (n >= base)
                    n = base - 1;
                  prod = multiply(yc, n, base);
                  prodL = prod.length;
                  remL = rem.length;
                  while (compare3(prod, rem, prodL, remL) == 1) {
                    n--;
                    subtract(prod, yL < prodL ? yz : yc, prodL, base);
                    prodL = prod.length;
                    cmp = 1;
                  }
                } else {
                  if (n == 0) {
                    cmp = n = 1;
                  }
                  prod = yc.slice();
                  prodL = prod.length;
                }
                if (prodL < remL)
                  prod = [0].concat(prod);
                subtract(rem, prod, remL, base);
                remL = rem.length;
                if (cmp == -1) {
                  while (compare3(yc, rem, yL, remL) < 1) {
                    n++;
                    subtract(rem, yL < remL ? yz : yc, remL, base);
                    remL = rem.length;
                  }
                }
              } else if (cmp === 0) {
                n++;
                rem = [0];
              }
              qc[i++] = n;
              if (rem[0]) {
                rem[remL++] = xc[xi] || 0;
              } else {
                rem = [xc[xi]];
                remL = 1;
              }
            } while ((xi++ < xL || rem[0] != null) && s--);
            more = rem[0] != null;
            if (!qc[0])
              qc.splice(0, 1);
          }
          if (base == BASE) {
            for (i = 1, s = qc[0]; s >= 10; s /= 10, i++)
              ;
            round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);
          } else {
            q.e = e;
            q.r = +more;
          }
          return q;
        };
      }();
      function format2(n, i, rm, id) {
        var c0, e, ne, len, str;
        if (rm == null)
          rm = ROUNDING_MODE;
        else
          intCheck(rm, 0, 8);
        if (!n.c)
          return n.toString();
        c0 = n.c[0];
        ne = n.e;
        if (i == null) {
          str = coeffToString(n.c);
          str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS) ? toExponential(str, ne) : toFixedPoint(str, ne, "0");
        } else {
          n = round(new BigNumber2(n), i, rm);
          e = n.e;
          str = coeffToString(n.c);
          len = str.length;
          if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {
            for (; len < i; str += "0", len++)
              ;
            str = toExponential(str, e);
          } else {
            i -= ne;
            str = toFixedPoint(str, e, "0");
            if (e + 1 > len) {
              if (--i > 0)
                for (str += "."; i--; str += "0")
                  ;
            } else {
              i += e - len;
              if (i > 0) {
                if (e + 1 == len)
                  str += ".";
                for (; i--; str += "0")
                  ;
              }
            }
          }
        }
        return n.s < 0 && c0 ? "-" + str : str;
      }
      function maxOrMin(args, n) {
        var k, y, i = 1, x = new BigNumber2(args[0]);
        for (; i < args.length; i++) {
          y = new BigNumber2(args[i]);
          if (!y.s || (k = compare2(x, y)) === n || k === 0 && x.s === n) {
            x = y;
          }
        }
        return x;
      }
      function normalise(n, c2, e) {
        var i = 1, j = c2.length;
        for (; !c2[--j]; c2.pop())
          ;
        for (j = c2[0]; j >= 10; j /= 10, i++)
          ;
        if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {
          n.c = n.e = null;
        } else if (e < MIN_EXP) {
          n.c = [n.e = 0];
        } else {
          n.e = e;
          n.c = c2;
        }
        return n;
      }
      parseNumeric = function() {
        var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i, dotAfter = /^([^.]+)\.$/, dotBefore = /^\.([^.]+)$/, isInfinityOrNaN = /^-?(Infinity|NaN)$/, whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
        return function(x, str, isNum, b) {
          var base, s = isNum ? str : str.replace(whitespaceOrPlus, "");
          if (isInfinityOrNaN.test(s)) {
            x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
          } else {
            if (!isNum) {
              s = s.replace(basePrefix, function(m, p1, p2) {
                base = (p2 = p2.toLowerCase()) == "x" ? 16 : p2 == "b" ? 2 : 8;
                return !b || b == base ? p1 : m;
              });
              if (b) {
                base = b;
                s = s.replace(dotAfter, "$1").replace(dotBefore, "0.$1");
              }
              if (str != s)
                return new BigNumber2(s, base);
            }
            if (BigNumber2.DEBUG) {
              throw Error(bignumberError + "Not a" + (b ? " base " + b : "") + " number: " + str);
            }
            x.s = null;
          }
          x.c = x.e = null;
        };
      }();
      function round(x, sd, rm, r) {
        var d, i, j, k, n, ni, rd, xc = x.c, pows10 = POWS_TEN;
        if (xc) {
          out: {
            for (d = 1, k = xc[0]; k >= 10; k /= 10, d++)
              ;
            i = sd - d;
            if (i < 0) {
              i += LOG_BASE;
              j = sd;
              n = xc[ni = 0];
              rd = mathfloor(n / pows10[d - j - 1] % 10);
            } else {
              ni = mathceil((i + 1) / LOG_BASE);
              if (ni >= xc.length) {
                if (r) {
                  for (; xc.length <= ni; xc.push(0))
                    ;
                  n = rd = 0;
                  d = 1;
                  i %= LOG_BASE;
                  j = i - LOG_BASE + 1;
                } else {
                  break out;
                }
              } else {
                n = k = xc[ni];
                for (d = 1; k >= 10; k /= 10, d++)
                  ;
                i %= LOG_BASE;
                j = i - LOG_BASE + d;
                rd = j < 0 ? 0 : mathfloor(n / pows10[d - j - 1] % 10);
              }
            }
            r = r || sd < 0 || // Are there any non-zero digits after the rounding digit?
            // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
            // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
            xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);
            r = rm < 4 ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 && // Check whether the digit to the left of the rounding digit is odd.
            (i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
            if (sd < 1 || !xc[0]) {
              xc.length = 0;
              if (r) {
                sd -= x.e + 1;
                xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
                x.e = -sd || 0;
              } else {
                xc[0] = x.e = 0;
              }
              return x;
            }
            if (i == 0) {
              xc.length = ni;
              k = 1;
              ni--;
            } else {
              xc.length = ni + 1;
              k = pows10[LOG_BASE - i];
              xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
            }
            if (r) {
              for (; ; ) {
                if (ni == 0) {
                  for (i = 1, j = xc[0]; j >= 10; j /= 10, i++)
                    ;
                  j = xc[0] += k;
                  for (k = 1; j >= 10; j /= 10, k++)
                    ;
                  if (i != k) {
                    x.e++;
                    if (xc[0] == BASE)
                      xc[0] = 1;
                  }
                  break;
                } else {
                  xc[ni] += k;
                  if (xc[ni] != BASE)
                    break;
                  xc[ni--] = 0;
                  k = 1;
                }
              }
            }
            for (i = xc.length; xc[--i] === 0; xc.pop())
              ;
          }
          if (x.e > MAX_EXP) {
            x.c = x.e = null;
          } else if (x.e < MIN_EXP) {
            x.c = [x.e = 0];
          }
        }
        return x;
      }
      function valueOf(n) {
        var str, e = n.e;
        if (e === null)
          return n.toString();
        str = coeffToString(n.c);
        str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(str, e) : toFixedPoint(str, e, "0");
        return n.s < 0 ? "-" + str : str;
      }
      P.absoluteValue = P.abs = function() {
        var x = new BigNumber2(this);
        if (x.s < 0)
          x.s = 1;
        return x;
      };
      P.comparedTo = function(y, b) {
        return compare2(this, new BigNumber2(y, b));
      };
      P.decimalPlaces = P.dp = function(dp, rm) {
        var c2, n, v, x = this;
        if (dp != null) {
          intCheck(dp, 0, MAX);
          if (rm == null)
            rm = ROUNDING_MODE;
          else
            intCheck(rm, 0, 8);
          return round(new BigNumber2(x), dp + x.e + 1, rm);
        }
        if (!(c2 = x.c))
          return null;
        n = ((v = c2.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;
        if (v = c2[v])
          for (; v % 10 == 0; v /= 10, n--)
            ;
        if (n < 0)
          n = 0;
        return n;
      };
      P.dividedBy = P.div = function(y, b) {
        return div(this, new BigNumber2(y, b), DECIMAL_PLACES, ROUNDING_MODE);
      };
      P.dividedToIntegerBy = P.idiv = function(y, b) {
        return div(this, new BigNumber2(y, b), 0, 1);
      };
      P.exponentiatedBy = P.pow = function(n, m) {
        var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y, x = this;
        n = new BigNumber2(n);
        if (n.c && !n.isInteger()) {
          throw Error(bignumberError + "Exponent not an integer: " + valueOf(n));
        }
        if (m != null)
          m = new BigNumber2(m);
        nIsBig = n.e > 14;
        if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {
          y = new BigNumber2(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
          return m ? y.mod(m) : y;
        }
        nIsNeg = n.s < 0;
        if (m) {
          if (m.c ? !m.c[0] : !m.s)
            return new BigNumber2(NaN);
          isModExp = !nIsNeg && x.isInteger() && m.isInteger();
          if (isModExp)
            x = x.mod(m);
        } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0 ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7 : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {
          k = x.s < 0 && isOdd(n) ? -0 : 0;
          if (x.e > -1)
            k = 1 / k;
          return new BigNumber2(nIsNeg ? 1 / k : k);
        } else if (POW_PRECISION) {
          k = mathceil(POW_PRECISION / LOG_BASE + 2);
        }
        if (nIsBig) {
          half = new BigNumber2(0.5);
          if (nIsNeg)
            n.s = 1;
          nIsOdd = isOdd(n);
        } else {
          i = Math.abs(+valueOf(n));
          nIsOdd = i % 2;
        }
        y = new BigNumber2(ONE);
        for (; ; ) {
          if (nIsOdd) {
            y = y.times(x);
            if (!y.c)
              break;
            if (k) {
              if (y.c.length > k)
                y.c.length = k;
            } else if (isModExp) {
              y = y.mod(m);
            }
          }
          if (i) {
            i = mathfloor(i / 2);
            if (i === 0)
              break;
            nIsOdd = i % 2;
          } else {
            n = n.times(half);
            round(n, n.e + 1, 1);
            if (n.e > 14) {
              nIsOdd = isOdd(n);
            } else {
              i = +valueOf(n);
              if (i === 0)
                break;
              nIsOdd = i % 2;
            }
          }
          x = x.times(x);
          if (k) {
            if (x.c && x.c.length > k)
              x.c.length = k;
          } else if (isModExp) {
            x = x.mod(m);
          }
        }
        if (isModExp)
          return y;
        if (nIsNeg)
          y = ONE.div(y);
        return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
      };
      P.integerValue = function(rm) {
        var n = new BigNumber2(this);
        if (rm == null)
          rm = ROUNDING_MODE;
        else
          intCheck(rm, 0, 8);
        return round(n, n.e + 1, rm);
      };
      P.isEqualTo = P.eq = function(y, b) {
        return compare2(this, new BigNumber2(y, b)) === 0;
      };
      P.isFinite = function() {
        return !!this.c;
      };
      P.isGreaterThan = P.gt = function(y, b) {
        return compare2(this, new BigNumber2(y, b)) > 0;
      };
      P.isGreaterThanOrEqualTo = P.gte = function(y, b) {
        return (b = compare2(this, new BigNumber2(y, b))) === 1 || b === 0;
      };
      P.isInteger = function() {
        return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
      };
      P.isLessThan = P.lt = function(y, b) {
        return compare2(this, new BigNumber2(y, b)) < 0;
      };
      P.isLessThanOrEqualTo = P.lte = function(y, b) {
        return (b = compare2(this, new BigNumber2(y, b))) === -1 || b === 0;
      };
      P.isNaN = function() {
        return !this.s;
      };
      P.isNegative = function() {
        return this.s < 0;
      };
      P.isPositive = function() {
        return this.s > 0;
      };
      P.isZero = function() {
        return !!this.c && this.c[0] == 0;
      };
      P.minus = function(y, b) {
        var i, j, t, xLTy, x = this, a = x.s;
        y = new BigNumber2(y, b);
        b = y.s;
        if (!a || !b)
          return new BigNumber2(NaN);
        if (a != b) {
          y.s = -b;
          return x.plus(y);
        }
        var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
        if (!xe || !ye) {
          if (!xc || !yc)
            return xc ? (y.s = -b, y) : new BigNumber2(yc ? x : NaN);
          if (!xc[0] || !yc[0]) {
            return yc[0] ? (y.s = -b, y) : new BigNumber2(xc[0] ? x : (
              // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
              ROUNDING_MODE == 3 ? -0 : 0
            ));
          }
        }
        xe = bitFloor(xe);
        ye = bitFloor(ye);
        xc = xc.slice();
        if (a = xe - ye) {
          if (xLTy = a < 0) {
            a = -a;
            t = xc;
          } else {
            ye = xe;
            t = yc;
          }
          t.reverse();
          for (b = a; b--; t.push(0))
            ;
          t.reverse();
        } else {
          j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;
          for (a = b = 0; b < j; b++) {
            if (xc[b] != yc[b]) {
              xLTy = xc[b] < yc[b];
              break;
            }
          }
        }
        if (xLTy) {
          t = xc;
          xc = yc;
          yc = t;
          y.s = -y.s;
        }
        b = (j = yc.length) - (i = xc.length);
        if (b > 0)
          for (; b--; xc[i++] = 0)
            ;
        b = BASE - 1;
        for (; j > a; ) {
          if (xc[--j] < yc[j]) {
            for (i = j; i && !xc[--i]; xc[i] = b)
              ;
            --xc[i];
            xc[j] += BASE;
          }
          xc[j] -= yc[j];
        }
        for (; xc[0] == 0; xc.splice(0, 1), --ye)
          ;
        if (!xc[0]) {
          y.s = ROUNDING_MODE == 3 ? -1 : 1;
          y.c = [y.e = 0];
          return y;
        }
        return normalise(y, xc, ye);
      };
      P.modulo = P.mod = function(y, b) {
        var q, s, x = this;
        y = new BigNumber2(y, b);
        if (!x.c || !y.s || y.c && !y.c[0]) {
          return new BigNumber2(NaN);
        } else if (!y.c || x.c && !x.c[0]) {
          return new BigNumber2(x);
        }
        if (MODULO_MODE == 9) {
          s = y.s;
          y.s = 1;
          q = div(x, y, 0, 3);
          y.s = s;
          q.s *= s;
        } else {
          q = div(x, y, 0, MODULO_MODE);
        }
        y = x.minus(q.times(y));
        if (!y.c[0] && MODULO_MODE == 1)
          y.s = x.s;
        return y;
      };
      P.multipliedBy = P.times = function(y, b) {
        var c2, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc, base, sqrtBase, x = this, xc = x.c, yc = (y = new BigNumber2(y, b)).c;
        if (!xc || !yc || !xc[0] || !yc[0]) {
          if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
            y.c = y.e = y.s = null;
          } else {
            y.s *= x.s;
            if (!xc || !yc) {
              y.c = y.e = null;
            } else {
              y.c = [0];
              y.e = 0;
            }
          }
          return y;
        }
        e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
        y.s *= x.s;
        xcL = xc.length;
        ycL = yc.length;
        if (xcL < ycL) {
          zc = xc;
          xc = yc;
          yc = zc;
          i = xcL;
          xcL = ycL;
          ycL = i;
        }
        for (i = xcL + ycL, zc = []; i--; zc.push(0))
          ;
        base = BASE;
        sqrtBase = SQRT_BASE;
        for (i = ycL; --i >= 0; ) {
          c2 = 0;
          ylo = yc[i] % sqrtBase;
          yhi = yc[i] / sqrtBase | 0;
          for (k = xcL, j = i + k; j > i; ) {
            xlo = xc[--k] % sqrtBase;
            xhi = xc[k] / sqrtBase | 0;
            m = yhi * xlo + xhi * ylo;
            xlo = ylo * xlo + m % sqrtBase * sqrtBase + zc[j] + c2;
            c2 = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
            zc[j--] = xlo % base;
          }
          zc[j] = c2;
        }
        if (c2) {
          ++e;
        } else {
          zc.splice(0, 1);
        }
        return normalise(y, zc, e);
      };
      P.negated = function() {
        var x = new BigNumber2(this);
        x.s = -x.s || null;
        return x;
      };
      P.plus = function(y, b) {
        var t, x = this, a = x.s;
        y = new BigNumber2(y, b);
        b = y.s;
        if (!a || !b)
          return new BigNumber2(NaN);
        if (a != b) {
          y.s = -b;
          return x.minus(y);
        }
        var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
        if (!xe || !ye) {
          if (!xc || !yc)
            return new BigNumber2(a / 0);
          if (!xc[0] || !yc[0])
            return yc[0] ? y : new BigNumber2(xc[0] ? x : a * 0);
        }
        xe = bitFloor(xe);
        ye = bitFloor(ye);
        xc = xc.slice();
        if (a = xe - ye) {
          if (a > 0) {
            ye = xe;
            t = yc;
          } else {
            a = -a;
            t = xc;
          }
          t.reverse();
          for (; a--; t.push(0))
            ;
          t.reverse();
        }
        a = xc.length;
        b = yc.length;
        if (a - b < 0) {
          t = yc;
          yc = xc;
          xc = t;
          b = a;
        }
        for (a = 0; b; ) {
          a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
          xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
        }
        if (a) {
          xc = [a].concat(xc);
          ++ye;
        }
        return normalise(y, xc, ye);
      };
      P.precision = P.sd = function(sd, rm) {
        var c2, n, v, x = this;
        if (sd != null && sd !== !!sd) {
          intCheck(sd, 1, MAX);
          if (rm == null)
            rm = ROUNDING_MODE;
          else
            intCheck(rm, 0, 8);
          return round(new BigNumber2(x), sd, rm);
        }
        if (!(c2 = x.c))
          return null;
        v = c2.length - 1;
        n = v * LOG_BASE + 1;
        if (v = c2[v]) {
          for (; v % 10 == 0; v /= 10, n--)
            ;
          for (v = c2[0]; v >= 10; v /= 10, n++)
            ;
        }
        if (sd && x.e + 1 > n)
          n = x.e + 1;
        return n;
      };
      P.shiftedBy = function(k) {
        intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
        return this.times("1e" + k);
      };
      P.squareRoot = P.sqrt = function() {
        var m, n, r, rep, t, x = this, c2 = x.c, s = x.s, e = x.e, dp = DECIMAL_PLACES + 4, half = new BigNumber2("0.5");
        if (s !== 1 || !c2 || !c2[0]) {
          return new BigNumber2(!s || s < 0 && (!c2 || c2[0]) ? NaN : c2 ? x : 1 / 0);
        }
        s = Math.sqrt(+valueOf(x));
        if (s == 0 || s == 1 / 0) {
          n = coeffToString(c2);
          if ((n.length + e) % 2 == 0)
            n += "0";
          s = Math.sqrt(+n);
          e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);
          if (s == 1 / 0) {
            n = "5e" + e;
          } else {
            n = s.toExponential();
            n = n.slice(0, n.indexOf("e") + 1) + e;
          }
          r = new BigNumber2(n);
        } else {
          r = new BigNumber2(s + "");
        }
        if (r.c[0]) {
          e = r.e;
          s = e + dp;
          if (s < 3)
            s = 0;
          for (; ; ) {
            t = r;
            r = half.times(t.plus(div(x, t, dp, 1)));
            if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {
              if (r.e < e)
                --s;
              n = n.slice(s - 3, s + 1);
              if (n == "9999" || !rep && n == "4999") {
                if (!rep) {
                  round(t, t.e + DECIMAL_PLACES + 2, 0);
                  if (t.times(t).eq(x)) {
                    r = t;
                    break;
                  }
                }
                dp += 4;
                s += 4;
                rep = 1;
              } else {
                if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
                  round(r, r.e + DECIMAL_PLACES + 2, 1);
                  m = !r.times(r).eq(x);
                }
                break;
              }
            }
          }
        }
        return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
      };
      P.toExponential = function(dp, rm) {
        if (dp != null) {
          intCheck(dp, 0, MAX);
          dp++;
        }
        return format2(this, dp, rm, 1);
      };
      P.toFixed = function(dp, rm) {
        if (dp != null) {
          intCheck(dp, 0, MAX);
          dp = dp + this.e + 1;
        }
        return format2(this, dp, rm);
      };
      P.toFormat = function(dp, rm, format3) {
        var str, x = this;
        if (format3 == null) {
          if (dp != null && rm && typeof rm == "object") {
            format3 = rm;
            rm = null;
          } else if (dp && typeof dp == "object") {
            format3 = dp;
            dp = rm = null;
          } else {
            format3 = FORMAT;
          }
        } else if (typeof format3 != "object") {
          throw Error(bignumberError + "Argument not an object: " + format3);
        }
        str = x.toFixed(dp, rm);
        if (x.c) {
          var i, arr = str.split("."), g1 = +format3.groupSize, g2 = +format3.secondaryGroupSize, groupSeparator = format3.groupSeparator || "", intPart = arr[0], fractionPart = arr[1], isNeg = x.s < 0, intDigits = isNeg ? intPart.slice(1) : intPart, len = intDigits.length;
          if (g2) {
            i = g1;
            g1 = g2;
            g2 = i;
            len -= i;
          }
          if (g1 > 0 && len > 0) {
            i = len % g1 || g1;
            intPart = intDigits.substr(0, i);
            for (; i < len; i += g1)
              intPart += groupSeparator + intDigits.substr(i, g1);
            if (g2 > 0)
              intPart += groupSeparator + intDigits.slice(i);
            if (isNeg)
              intPart = "-" + intPart;
          }
          str = fractionPart ? intPart + (format3.decimalSeparator || "") + ((g2 = +format3.fractionGroupSize) ? fractionPart.replace(
            new RegExp("\\d{" + g2 + "}\\B", "g"),
            "$&" + (format3.fractionGroupSeparator || "")
          ) : fractionPart) : intPart;
        }
        return (format3.prefix || "") + str + (format3.suffix || "");
      };
      P.toFraction = function(md) {
        var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s, x = this, xc = x.c;
        if (md != null) {
          n = new BigNumber2(md);
          if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
            throw Error(bignumberError + "Argument " + (n.isInteger() ? "out of range: " : "not an integer: ") + valueOf(n));
          }
        }
        if (!xc)
          return new BigNumber2(x);
        d = new BigNumber2(ONE);
        n1 = d0 = new BigNumber2(ONE);
        d1 = n0 = new BigNumber2(ONE);
        s = coeffToString(xc);
        e = d.e = s.length - x.e - 1;
        d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
        md = !md || n.comparedTo(d) > 0 ? e > 0 ? d : n1 : n;
        exp = MAX_EXP;
        MAX_EXP = 1 / 0;
        n = new BigNumber2(s);
        n0.c[0] = 0;
        for (; ; ) {
          q = div(n, d, 0, 1);
          d2 = d0.plus(q.times(d1));
          if (d2.comparedTo(md) == 1)
            break;
          d0 = d1;
          d1 = d2;
          n1 = n0.plus(q.times(d2 = n1));
          n0 = d2;
          d = n.minus(q.times(d2 = d));
          n = d2;
        }
        d2 = div(md.minus(d0), d1, 0, 1);
        n0 = n0.plus(d2.times(n1));
        d0 = d0.plus(d2.times(d1));
        n0.s = n1.s = x.s;
        e = e * 2;
        r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
          div(n0, d0, e, ROUNDING_MODE).minus(x).abs()
        ) < 1 ? [n1, d1] : [n0, d0];
        MAX_EXP = exp;
        return r;
      };
      P.toNumber = function() {
        return +valueOf(this);
      };
      P.toPrecision = function(sd, rm) {
        if (sd != null)
          intCheck(sd, 1, MAX);
        return format2(this, sd, rm, 2);
      };
      P.toString = function(b) {
        var str, n = this, s = n.s, e = n.e;
        if (e === null) {
          if (s) {
            str = "Infinity";
            if (s < 0)
              str = "-" + str;
          } else {
            str = "NaN";
          }
        } else {
          if (b == null) {
            str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(coeffToString(n.c), e) : toFixedPoint(coeffToString(n.c), e, "0");
          } else if (b === 10 && alphabetHasNormalDecimalDigits) {
            n = round(new BigNumber2(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
            str = toFixedPoint(coeffToString(n.c), n.e, "0");
          } else {
            intCheck(b, 2, ALPHABET.length, "Base");
            str = convertBase(toFixedPoint(coeffToString(n.c), e, "0"), 10, b, s, true);
          }
          if (s < 0 && n.c[0])
            str = "-" + str;
        }
        return str;
      };
      P.valueOf = P.toJSON = function() {
        return valueOf(this);
      };
      P._isBigNumber = true;
      if (configObject != null)
        BigNumber2.set(configObject);
      return BigNumber2;
    }
    function bitFloor(n) {
      var i = n | 0;
      return n > 0 || n === i ? i : i - 1;
    }
    function coeffToString(a) {
      var s, z, i = 1, j = a.length, r = a[0] + "";
      for (; i < j; ) {
        s = a[i++] + "";
        z = LOG_BASE - s.length;
        for (; z--; s = "0" + s)
          ;
        r += s;
      }
      for (j = r.length; r.charCodeAt(--j) === 48; )
        ;
      return r.slice(0, j + 1 || 1);
    }
    function compare2(x, y) {
      var a, b, xc = x.c, yc = y.c, i = x.s, j = y.s, k = x.e, l = y.e;
      if (!i || !j)
        return null;
      a = xc && !xc[0];
      b = yc && !yc[0];
      if (a || b)
        return a ? b ? 0 : -j : i;
      if (i != j)
        return i;
      a = i < 0;
      b = k == l;
      if (!xc || !yc)
        return b ? 0 : !xc ^ a ? 1 : -1;
      if (!b)
        return k > l ^ a ? 1 : -1;
      j = (k = xc.length) < (l = yc.length) ? k : l;
      for (i = 0; i < j; i++)
        if (xc[i] != yc[i])
          return xc[i] > yc[i] ^ a ? 1 : -1;
      return k == l ? 0 : k > l ^ a ? 1 : -1;
    }
    function intCheck(n, min, max, name) {
      if (n < min || n > max || n !== mathfloor(n)) {
        throw Error(bignumberError + (name || "Argument") + (typeof n == "number" ? n < min || n > max ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(n));
      }
    }
    function isOdd(n) {
      var k = n.c.length - 1;
      return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
    }
    function toExponential(str, e) {
      return (str.length > 1 ? str.charAt(0) + "." + str.slice(1) : str) + (e < 0 ? "e" : "e+") + e;
    }
    function toFixedPoint(str, e, z) {
      var len, zs;
      if (e < 0) {
        for (zs = z + "."; ++e; zs += z)
          ;
        str = zs + str;
      } else {
        len = str.length;
        if (++e > len) {
          for (zs = z, e -= len; --e; zs += z)
            ;
          str += zs;
        } else if (e < len) {
          str = str.slice(0, e) + "." + str.slice(e);
        }
      }
      return str;
    }
    BigNumber = clone();
    BigNumber["default"] = BigNumber.BigNumber = BigNumber;
    if (module.exports) {
      module.exports = BigNumber;
    } else {
      if (!globalObject) {
        globalObject = typeof self != "undefined" && self ? self : window;
      }
      globalObject.BigNumber = BigNumber;
    }
  })(commonjsGlobal);
})(bignumber);
var bignumberExports = bignumber.exports;
var decoder_asm = function decodeAsm(stdlib, foreign, buffer2) {
  ;
  var heap = new stdlib.Uint8Array(buffer2);
  var pushInt = foreign.pushInt;
  var pushInt32 = foreign.pushInt32;
  var pushInt32Neg = foreign.pushInt32Neg;
  var pushInt64 = foreign.pushInt64;
  var pushInt64Neg = foreign.pushInt64Neg;
  var pushFloat = foreign.pushFloat;
  var pushFloatSingle = foreign.pushFloatSingle;
  var pushFloatDouble = foreign.pushFloatDouble;
  var pushTrue = foreign.pushTrue;
  var pushFalse = foreign.pushFalse;
  var pushUndefined = foreign.pushUndefined;
  var pushNull = foreign.pushNull;
  var pushInfinity = foreign.pushInfinity;
  var pushInfinityNeg = foreign.pushInfinityNeg;
  var pushNaN = foreign.pushNaN;
  var pushNaNNeg = foreign.pushNaNNeg;
  var pushArrayStart = foreign.pushArrayStart;
  var pushArrayStartFixed = foreign.pushArrayStartFixed;
  var pushArrayStartFixed32 = foreign.pushArrayStartFixed32;
  var pushArrayStartFixed64 = foreign.pushArrayStartFixed64;
  var pushObjectStart = foreign.pushObjectStart;
  var pushObjectStartFixed = foreign.pushObjectStartFixed;
  var pushObjectStartFixed32 = foreign.pushObjectStartFixed32;
  var pushObjectStartFixed64 = foreign.pushObjectStartFixed64;
  var pushByteString = foreign.pushByteString;
  var pushByteStringStart = foreign.pushByteStringStart;
  var pushUtf8String = foreign.pushUtf8String;
  var pushUtf8StringStart = foreign.pushUtf8StringStart;
  var pushSimpleUnassigned = foreign.pushSimpleUnassigned;
  var pushTagStart = foreign.pushTagStart;
  var pushTagStart4 = foreign.pushTagStart4;
  var pushTagStart8 = foreign.pushTagStart8;
  var pushTagUnassigned = foreign.pushTagUnassigned;
  var pushBreak = foreign.pushBreak;
  var pow3 = stdlib.Math.pow;
  var offset = 0;
  var inputLength = 0;
  var code2 = 0;
  function parse(input) {
    input = input | 0;
    offset = 0;
    inputLength = input;
    while ((offset | 0) < (inputLength | 0)) {
      code2 = jumpTable[heap[offset] & 255](heap[offset] | 0) | 0;
      if ((code2 | 0) > 0) {
        break;
      }
    }
    return code2 | 0;
  }
  function checkOffset(n) {
    n = n | 0;
    if (((offset | 0) + (n | 0) | 0) < (inputLength | 0)) {
      return 0;
    }
    return 1;
  }
  function readUInt16(n) {
    n = n | 0;
    return heap[n | 0] << 8 | heap[n + 1 | 0] | 0;
  }
  function readUInt32(n) {
    n = n | 0;
    return heap[n | 0] << 24 | heap[n + 1 | 0] << 16 | heap[n + 2 | 0] << 8 | heap[n + 3 | 0] | 0;
  }
  function INT_P(octet) {
    octet = octet | 0;
    pushInt(octet | 0);
    offset = offset + 1 | 0;
    return 0;
  }
  function UINT_P_8(octet) {
    octet = octet | 0;
    if (checkOffset(1) | 0) {
      return 1;
    }
    pushInt(heap[offset + 1 | 0] | 0);
    offset = offset + 2 | 0;
    return 0;
  }
  function UINT_P_16(octet) {
    octet = octet | 0;
    if (checkOffset(2) | 0) {
      return 1;
    }
    pushInt(
      readUInt16(offset + 1 | 0) | 0
    );
    offset = offset + 3 | 0;
    return 0;
  }
  function UINT_P_32(octet) {
    octet = octet | 0;
    if (checkOffset(4) | 0) {
      return 1;
    }
    pushInt32(
      readUInt16(offset + 1 | 0) | 0,
      readUInt16(offset + 3 | 0) | 0
    );
    offset = offset + 5 | 0;
    return 0;
  }
  function UINT_P_64(octet) {
    octet = octet | 0;
    if (checkOffset(8) | 0) {
      return 1;
    }
    pushInt64(
      readUInt16(offset + 1 | 0) | 0,
      readUInt16(offset + 3 | 0) | 0,
      readUInt16(offset + 5 | 0) | 0,
      readUInt16(offset + 7 | 0) | 0
    );
    offset = offset + 9 | 0;
    return 0;
  }
  function INT_N(octet) {
    octet = octet | 0;
    pushInt(-1 - (octet - 32 | 0) | 0);
    offset = offset + 1 | 0;
    return 0;
  }
  function UINT_N_8(octet) {
    octet = octet | 0;
    if (checkOffset(1) | 0) {
      return 1;
    }
    pushInt(
      -1 - (heap[offset + 1 | 0] | 0) | 0
    );
    offset = offset + 2 | 0;
    return 0;
  }
  function UINT_N_16(octet) {
    octet = octet | 0;
    var val = 0;
    if (checkOffset(2) | 0) {
      return 1;
    }
    val = readUInt16(offset + 1 | 0) | 0;
    pushInt(-1 - (val | 0) | 0);
    offset = offset + 3 | 0;
    return 0;
  }
  function UINT_N_32(octet) {
    octet = octet | 0;
    if (checkOffset(4) | 0) {
      return 1;
    }
    pushInt32Neg(
      readUInt16(offset + 1 | 0) | 0,
      readUInt16(offset + 3 | 0) | 0
    );
    offset = offset + 5 | 0;
    return 0;
  }
  function UINT_N_64(octet) {
    octet = octet | 0;
    if (checkOffset(8) | 0) {
      return 1;
    }
    pushInt64Neg(
      readUInt16(offset + 1 | 0) | 0,
      readUInt16(offset + 3 | 0) | 0,
      readUInt16(offset + 5 | 0) | 0,
      readUInt16(offset + 7 | 0) | 0
    );
    offset = offset + 9 | 0;
    return 0;
  }
  function BYTE_STRING(octet) {
    octet = octet | 0;
    var start = 0;
    var end = 0;
    var step = 0;
    step = octet - 64 | 0;
    if (checkOffset(step | 0) | 0) {
      return 1;
    }
    start = offset + 1 | 0;
    end = (offset + 1 | 0) + (step | 0) | 0;
    pushByteString(start | 0, end | 0);
    offset = end | 0;
    return 0;
  }
  function BYTE_STRING_8(octet) {
    octet = octet | 0;
    var start = 0;
    var end = 0;
    var length = 0;
    if (checkOffset(1) | 0) {
      return 1;
    }
    length = heap[offset + 1 | 0] | 0;
    start = offset + 2 | 0;
    end = (offset + 2 | 0) + (length | 0) | 0;
    if (checkOffset(length + 1 | 0) | 0) {
      return 1;
    }
    pushByteString(start | 0, end | 0);
    offset = end | 0;
    return 0;
  }
  function BYTE_STRING_16(octet) {
    octet = octet | 0;
    var start = 0;
    var end = 0;
    var length = 0;
    if (checkOffset(2) | 0) {
      return 1;
    }
    length = readUInt16(offset + 1 | 0) | 0;
    start = offset + 3 | 0;
    end = (offset + 3 | 0) + (length | 0) | 0;
    if (checkOffset(length + 2 | 0) | 0) {
      return 1;
    }
    pushByteString(start | 0, end | 0);
    offset = end | 0;
    return 0;
  }
  function BYTE_STRING_32(octet) {
    octet = octet | 0;
    var start = 0;
    var end = 0;
    var length = 0;
    if (checkOffset(4) | 0) {
      return 1;
    }
    length = readUInt32(offset + 1 | 0) | 0;
    start = offset + 5 | 0;
    end = (offset + 5 | 0) + (length | 0) | 0;
    if (checkOffset(length + 4 | 0) | 0) {
      return 1;
    }
    pushByteString(start | 0, end | 0);
    offset = end | 0;
    return 0;
  }
  function BYTE_STRING_64(octet) {
    octet = octet | 0;
    return 1;
  }
  function BYTE_STRING_BREAK(octet) {
    octet = octet | 0;
    pushByteStringStart();
    offset = offset + 1 | 0;
    return 0;
  }
  function UTF8_STRING(octet) {
    octet = octet | 0;
    var start = 0;
    var end = 0;
    var step = 0;
    step = octet - 96 | 0;
    if (checkOffset(step | 0) | 0) {
      return 1;
    }
    start = offset + 1 | 0;
    end = (offset + 1 | 0) + (step | 0) | 0;
    pushUtf8String(start | 0, end | 0);
    offset = end | 0;
    return 0;
  }
  function UTF8_STRING_8(octet) {
    octet = octet | 0;
    var start = 0;
    var end = 0;
    var length = 0;
    if (checkOffset(1) | 0) {
      return 1;
    }
    length = heap[offset + 1 | 0] | 0;
    start = offset + 2 | 0;
    end = (offset + 2 | 0) + (length | 0) | 0;
    if (checkOffset(length + 1 | 0) | 0) {
      return 1;
    }
    pushUtf8String(start | 0, end | 0);
    offset = end | 0;
    return 0;
  }
  function UTF8_STRING_16(octet) {
    octet = octet | 0;
    var start = 0;
    var end = 0;
    var length = 0;
    if (checkOffset(2) | 0) {
      return 1;
    }
    length = readUInt16(offset + 1 | 0) | 0;
    start = offset + 3 | 0;
    end = (offset + 3 | 0) + (length | 0) | 0;
    if (checkOffset(length + 2 | 0) | 0) {
      return 1;
    }
    pushUtf8String(start | 0, end | 0);
    offset = end | 0;
    return 0;
  }
  function UTF8_STRING_32(octet) {
    octet = octet | 0;
    var start = 0;
    var end = 0;
    var length = 0;
    if (checkOffset(4) | 0) {
      return 1;
    }
    length = readUInt32(offset + 1 | 0) | 0;
    start = offset + 5 | 0;
    end = (offset + 5 | 0) + (length | 0) | 0;
    if (checkOffset(length + 4 | 0) | 0) {
      return 1;
    }
    pushUtf8String(start | 0, end | 0);
    offset = end | 0;
    return 0;
  }
  function UTF8_STRING_64(octet) {
    octet = octet | 0;
    return 1;
  }
  function UTF8_STRING_BREAK(octet) {
    octet = octet | 0;
    pushUtf8StringStart();
    offset = offset + 1 | 0;
    return 0;
  }
  function ARRAY(octet) {
    octet = octet | 0;
    pushArrayStartFixed(octet - 128 | 0);
    offset = offset + 1 | 0;
    return 0;
  }
  function ARRAY_8(octet) {
    octet = octet | 0;
    if (checkOffset(1) | 0) {
      return 1;
    }
    pushArrayStartFixed(heap[offset + 1 | 0] | 0);
    offset = offset + 2 | 0;
    return 0;
  }
  function ARRAY_16(octet) {
    octet = octet | 0;
    if (checkOffset(2) | 0) {
      return 1;
    }
    pushArrayStartFixed(
      readUInt16(offset + 1 | 0) | 0
    );
    offset = offset + 3 | 0;
    return 0;
  }
  function ARRAY_32(octet) {
    octet = octet | 0;
    if (checkOffset(4) | 0) {
      return 1;
    }
    pushArrayStartFixed32(
      readUInt16(offset + 1 | 0) | 0,
      readUInt16(offset + 3 | 0) | 0
    );
    offset = offset + 5 | 0;
    return 0;
  }
  function ARRAY_64(octet) {
    octet = octet | 0;
    if (checkOffset(8) | 0) {
      return 1;
    }
    pushArrayStartFixed64(
      readUInt16(offset + 1 | 0) | 0,
      readUInt16(offset + 3 | 0) | 0,
      readUInt16(offset + 5 | 0) | 0,
      readUInt16(offset + 7 | 0) | 0
    );
    offset = offset + 9 | 0;
    return 0;
  }
  function ARRAY_BREAK(octet) {
    octet = octet | 0;
    pushArrayStart();
    offset = offset + 1 | 0;
    return 0;
  }
  function MAP(octet) {
    octet = octet | 0;
    var step = 0;
    step = octet - 160 | 0;
    if (checkOffset(step | 0) | 0) {
      return 1;
    }
    pushObjectStartFixed(step | 0);
    offset = offset + 1 | 0;
    return 0;
  }
  function MAP_8(octet) {
    octet = octet | 0;
    if (checkOffset(1) | 0) {
      return 1;
    }
    pushObjectStartFixed(heap[offset + 1 | 0] | 0);
    offset = offset + 2 | 0;
    return 0;
  }
  function MAP_16(octet) {
    octet = octet | 0;
    if (checkOffset(2) | 0) {
      return 1;
    }
    pushObjectStartFixed(
      readUInt16(offset + 1 | 0) | 0
    );
    offset = offset + 3 | 0;
    return 0;
  }
  function MAP_32(octet) {
    octet = octet | 0;
    if (checkOffset(4) | 0) {
      return 1;
    }
    pushObjectStartFixed32(
      readUInt16(offset + 1 | 0) | 0,
      readUInt16(offset + 3 | 0) | 0
    );
    offset = offset + 5 | 0;
    return 0;
  }
  function MAP_64(octet) {
    octet = octet | 0;
    if (checkOffset(8) | 0) {
      return 1;
    }
    pushObjectStartFixed64(
      readUInt16(offset + 1 | 0) | 0,
      readUInt16(offset + 3 | 0) | 0,
      readUInt16(offset + 5 | 0) | 0,
      readUInt16(offset + 7 | 0) | 0
    );
    offset = offset + 9 | 0;
    return 0;
  }
  function MAP_BREAK(octet) {
    octet = octet | 0;
    pushObjectStart();
    offset = offset + 1 | 0;
    return 0;
  }
  function TAG_KNOWN(octet) {
    octet = octet | 0;
    pushTagStart(octet - 192 | 0 | 0);
    offset = offset + 1 | 0;
    return 0;
  }
  function TAG_BIGNUM_POS(octet) {
    octet = octet | 0;
    pushTagStart(octet | 0);
    offset = offset + 1 | 0;
    return 0;
  }
  function TAG_BIGNUM_NEG(octet) {
    octet = octet | 0;
    pushTagStart(octet | 0);
    offset = offset + 1 | 0;
    return 0;
  }
  function TAG_FRAC(octet) {
    octet = octet | 0;
    pushTagStart(octet | 0);
    offset = offset + 1 | 0;
    return 0;
  }
  function TAG_BIGNUM_FLOAT(octet) {
    octet = octet | 0;
    pushTagStart(octet | 0);
    offset = offset + 1 | 0;
    return 0;
  }
  function TAG_UNASSIGNED(octet) {
    octet = octet | 0;
    pushTagStart(octet - 192 | 0 | 0);
    offset = offset + 1 | 0;
    return 0;
  }
  function TAG_BASE64_URL(octet) {
    octet = octet | 0;
    pushTagStart(octet | 0);
    offset = offset + 1 | 0;
    return 0;
  }
  function TAG_BASE64(octet) {
    octet = octet | 0;
    pushTagStart(octet | 0);
    offset = offset + 1 | 0;
    return 0;
  }
  function TAG_BASE16(octet) {
    octet = octet | 0;
    pushTagStart(octet | 0);
    offset = offset + 1 | 0;
    return 0;
  }
  function TAG_MORE_1(octet) {
    octet = octet | 0;
    if (checkOffset(1) | 0) {
      return 1;
    }
    pushTagStart(heap[offset + 1 | 0] | 0);
    offset = offset + 2 | 0;
    return 0;
  }
  function TAG_MORE_2(octet) {
    octet = octet | 0;
    if (checkOffset(2) | 0) {
      return 1;
    }
    pushTagStart(
      readUInt16(offset + 1 | 0) | 0
    );
    offset = offset + 3 | 0;
    return 0;
  }
  function TAG_MORE_4(octet) {
    octet = octet | 0;
    if (checkOffset(4) | 0) {
      return 1;
    }
    pushTagStart4(
      readUInt16(offset + 1 | 0) | 0,
      readUInt16(offset + 3 | 0) | 0
    );
    offset = offset + 5 | 0;
    return 0;
  }
  function TAG_MORE_8(octet) {
    octet = octet | 0;
    if (checkOffset(8) | 0) {
      return 1;
    }
    pushTagStart8(
      readUInt16(offset + 1 | 0) | 0,
      readUInt16(offset + 3 | 0) | 0,
      readUInt16(offset + 5 | 0) | 0,
      readUInt16(offset + 7 | 0) | 0
    );
    offset = offset + 9 | 0;
    return 0;
  }
  function SIMPLE_UNASSIGNED(octet) {
    octet = octet | 0;
    pushSimpleUnassigned((octet | 0) - 224 | 0);
    offset = offset + 1 | 0;
    return 0;
  }
  function SIMPLE_FALSE(octet) {
    octet = octet | 0;
    pushFalse();
    offset = offset + 1 | 0;
    return 0;
  }
  function SIMPLE_TRUE(octet) {
    octet = octet | 0;
    pushTrue();
    offset = offset + 1 | 0;
    return 0;
  }
  function SIMPLE_NULL(octet) {
    octet = octet | 0;
    pushNull();
    offset = offset + 1 | 0;
    return 0;
  }
  function SIMPLE_UNDEFINED(octet) {
    octet = octet | 0;
    pushUndefined();
    offset = offset + 1 | 0;
    return 0;
  }
  function SIMPLE_BYTE(octet) {
    octet = octet | 0;
    if (checkOffset(1) | 0) {
      return 1;
    }
    pushSimpleUnassigned(heap[offset + 1 | 0] | 0);
    offset = offset + 2 | 0;
    return 0;
  }
  function SIMPLE_FLOAT_HALF(octet) {
    octet = octet | 0;
    var f = 0;
    var g = 0;
    var sign = 1;
    var exp = 0;
    var mant = 0;
    var r = 0;
    if (checkOffset(2) | 0) {
      return 1;
    }
    f = heap[offset + 1 | 0] | 0;
    g = heap[offset + 2 | 0] | 0;
    if ((f | 0) & 128) {
      sign = -1;
    }
    exp = +(((f | 0) & 124) >> 2);
    mant = +(((f | 0) & 3) << 8 | g);
    if (+exp == 0) {
      pushFloat(+(+sign * 5960464477539063e-23 * +mant));
    } else if (+exp == 31) {
      if (+sign == 1) {
        if (+mant > 0) {
          pushNaN();
        } else {
          pushInfinity();
        }
      } else {
        if (+mant > 0) {
          pushNaNNeg();
        } else {
          pushInfinityNeg();
        }
      }
    } else {
      pushFloat(+(+sign * pow3(2, +(+exp - 25)) * +(1024 + mant)));
    }
    offset = offset + 3 | 0;
    return 0;
  }
  function SIMPLE_FLOAT_SINGLE(octet) {
    octet = octet | 0;
    if (checkOffset(4) | 0) {
      return 1;
    }
    pushFloatSingle(
      heap[offset + 1 | 0] | 0,
      heap[offset + 2 | 0] | 0,
      heap[offset + 3 | 0] | 0,
      heap[offset + 4 | 0] | 0
    );
    offset = offset + 5 | 0;
    return 0;
  }
  function SIMPLE_FLOAT_DOUBLE(octet) {
    octet = octet | 0;
    if (checkOffset(8) | 0) {
      return 1;
    }
    pushFloatDouble(
      heap[offset + 1 | 0] | 0,
      heap[offset + 2 | 0] | 0,
      heap[offset + 3 | 0] | 0,
      heap[offset + 4 | 0] | 0,
      heap[offset + 5 | 0] | 0,
      heap[offset + 6 | 0] | 0,
      heap[offset + 7 | 0] | 0,
      heap[offset + 8 | 0] | 0
    );
    offset = offset + 9 | 0;
    return 0;
  }
  function ERROR(octet) {
    octet = octet | 0;
    return 1;
  }
  function BREAK(octet) {
    octet = octet | 0;
    pushBreak();
    offset = offset + 1 | 0;
    return 0;
  }
  var jumpTable = [
    // Integer 0x00..0x17 (0..23)
    INT_P,
    // 0x00
    INT_P,
    // 0x01
    INT_P,
    // 0x02
    INT_P,
    // 0x03
    INT_P,
    // 0x04
    INT_P,
    // 0x05
    INT_P,
    // 0x06
    INT_P,
    // 0x07
    INT_P,
    // 0x08
    INT_P,
    // 0x09
    INT_P,
    // 0x0A
    INT_P,
    // 0x0B
    INT_P,
    // 0x0C
    INT_P,
    // 0x0D
    INT_P,
    // 0x0E
    INT_P,
    // 0x0F
    INT_P,
    // 0x10
    INT_P,
    // 0x11
    INT_P,
    // 0x12
    INT_P,
    // 0x13
    INT_P,
    // 0x14
    INT_P,
    // 0x15
    INT_P,
    // 0x16
    INT_P,
    // 0x17
    // Unsigned integer (one-byte uint8_t follows)
    UINT_P_8,
    // 0x18
    // Unsigned integer (two-byte uint16_t follows)
    UINT_P_16,
    // 0x19
    // Unsigned integer (four-byte uint32_t follows)
    UINT_P_32,
    // 0x1a
    // Unsigned integer (eight-byte uint64_t follows)
    UINT_P_64,
    // 0x1b
    ERROR,
    // 0x1c
    ERROR,
    // 0x1d
    ERROR,
    // 0x1e
    ERROR,
    // 0x1f
    // Negative integer -1-0x00..-1-0x17 (-1..-24)
    INT_N,
    // 0x20
    INT_N,
    // 0x21
    INT_N,
    // 0x22
    INT_N,
    // 0x23
    INT_N,
    // 0x24
    INT_N,
    // 0x25
    INT_N,
    // 0x26
    INT_N,
    // 0x27
    INT_N,
    // 0x28
    INT_N,
    // 0x29
    INT_N,
    // 0x2A
    INT_N,
    // 0x2B
    INT_N,
    // 0x2C
    INT_N,
    // 0x2D
    INT_N,
    // 0x2E
    INT_N,
    // 0x2F
    INT_N,
    // 0x30
    INT_N,
    // 0x31
    INT_N,
    // 0x32
    INT_N,
    // 0x33
    INT_N,
    // 0x34
    INT_N,
    // 0x35
    INT_N,
    // 0x36
    INT_N,
    // 0x37
    // Negative integer -1-n (one-byte uint8_t for n follows)
    UINT_N_8,
    // 0x38
    // Negative integer -1-n (two-byte uint16_t for n follows)
    UINT_N_16,
    // 0x39
    // Negative integer -1-n (four-byte uint32_t for nfollows)
    UINT_N_32,
    // 0x3a
    // Negative integer -1-n (eight-byte uint64_t for n follows)
    UINT_N_64,
    // 0x3b
    ERROR,
    // 0x3c
    ERROR,
    // 0x3d
    ERROR,
    // 0x3e
    ERROR,
    // 0x3f
    // byte string (0x00..0x17 bytes follow)
    BYTE_STRING,
    // 0x40
    BYTE_STRING,
    // 0x41
    BYTE_STRING,
    // 0x42
    BYTE_STRING,
    // 0x43
    BYTE_STRING,
    // 0x44
    BYTE_STRING,
    // 0x45
    BYTE_STRING,
    // 0x46
    BYTE_STRING,
    // 0x47
    BYTE_STRING,
    // 0x48
    BYTE_STRING,
    // 0x49
    BYTE_STRING,
    // 0x4A
    BYTE_STRING,
    // 0x4B
    BYTE_STRING,
    // 0x4C
    BYTE_STRING,
    // 0x4D
    BYTE_STRING,
    // 0x4E
    BYTE_STRING,
    // 0x4F
    BYTE_STRING,
    // 0x50
    BYTE_STRING,
    // 0x51
    BYTE_STRING,
    // 0x52
    BYTE_STRING,
    // 0x53
    BYTE_STRING,
    // 0x54
    BYTE_STRING,
    // 0x55
    BYTE_STRING,
    // 0x56
    BYTE_STRING,
    // 0x57
    // byte string (one-byte uint8_t for n, and then n bytes follow)
    BYTE_STRING_8,
    // 0x58
    // byte string (two-byte uint16_t for n, and then n bytes follow)
    BYTE_STRING_16,
    // 0x59
    // byte string (four-byte uint32_t for n, and then n bytes follow)
    BYTE_STRING_32,
    // 0x5a
    // byte string (eight-byte uint64_t for n, and then n bytes follow)
    BYTE_STRING_64,
    // 0x5b
    ERROR,
    // 0x5c
    ERROR,
    // 0x5d
    ERROR,
    // 0x5e
    // byte string, byte strings follow, terminated by "break"
    BYTE_STRING_BREAK,
    // 0x5f
    // UTF-8 string (0x00..0x17 bytes follow)
    UTF8_STRING,
    // 0x60
    UTF8_STRING,
    // 0x61
    UTF8_STRING,
    // 0x62
    UTF8_STRING,
    // 0x63
    UTF8_STRING,
    // 0x64
    UTF8_STRING,
    // 0x65
    UTF8_STRING,
    // 0x66
    UTF8_STRING,
    // 0x67
    UTF8_STRING,
    // 0x68
    UTF8_STRING,
    // 0x69
    UTF8_STRING,
    // 0x6A
    UTF8_STRING,
    // 0x6B
    UTF8_STRING,
    // 0x6C
    UTF8_STRING,
    // 0x6D
    UTF8_STRING,
    // 0x6E
    UTF8_STRING,
    // 0x6F
    UTF8_STRING,
    // 0x70
    UTF8_STRING,
    // 0x71
    UTF8_STRING,
    // 0x72
    UTF8_STRING,
    // 0x73
    UTF8_STRING,
    // 0x74
    UTF8_STRING,
    // 0x75
    UTF8_STRING,
    // 0x76
    UTF8_STRING,
    // 0x77
    // UTF-8 string (one-byte uint8_t for n, and then n bytes follow)
    UTF8_STRING_8,
    // 0x78
    // UTF-8 string (two-byte uint16_t for n, and then n bytes follow)
    UTF8_STRING_16,
    // 0x79
    // UTF-8 string (four-byte uint32_t for n, and then n bytes follow)
    UTF8_STRING_32,
    // 0x7a
    // UTF-8 string (eight-byte uint64_t for n, and then n bytes follow)
    UTF8_STRING_64,
    // 0x7b
    // UTF-8 string, UTF-8 strings follow, terminated by "break"
    ERROR,
    // 0x7c
    ERROR,
    // 0x7d
    ERROR,
    // 0x7e
    UTF8_STRING_BREAK,
    // 0x7f
    // array (0x00..0x17 data items follow)
    ARRAY,
    // 0x80
    ARRAY,
    // 0x81
    ARRAY,
    // 0x82
    ARRAY,
    // 0x83
    ARRAY,
    // 0x84
    ARRAY,
    // 0x85
    ARRAY,
    // 0x86
    ARRAY,
    // 0x87
    ARRAY,
    // 0x88
    ARRAY,
    // 0x89
    ARRAY,
    // 0x8A
    ARRAY,
    // 0x8B
    ARRAY,
    // 0x8C
    ARRAY,
    // 0x8D
    ARRAY,
    // 0x8E
    ARRAY,
    // 0x8F
    ARRAY,
    // 0x90
    ARRAY,
    // 0x91
    ARRAY,
    // 0x92
    ARRAY,
    // 0x93
    ARRAY,
    // 0x94
    ARRAY,
    // 0x95
    ARRAY,
    // 0x96
    ARRAY,
    // 0x97
    // array (one-byte uint8_t fo, and then n data items follow)
    ARRAY_8,
    // 0x98
    // array (two-byte uint16_t for n, and then n data items follow)
    ARRAY_16,
    // 0x99
    // array (four-byte uint32_t for n, and then n data items follow)
    ARRAY_32,
    // 0x9a
    // array (eight-byte uint64_t for n, and then n data items follow)
    ARRAY_64,
    // 0x9b
    // array, data items follow, terminated by "break"
    ERROR,
    // 0x9c
    ERROR,
    // 0x9d
    ERROR,
    // 0x9e
    ARRAY_BREAK,
    // 0x9f
    // map (0x00..0x17 pairs of data items follow)
    MAP,
    // 0xa0
    MAP,
    // 0xa1
    MAP,
    // 0xa2
    MAP,
    // 0xa3
    MAP,
    // 0xa4
    MAP,
    // 0xa5
    MAP,
    // 0xa6
    MAP,
    // 0xa7
    MAP,
    // 0xa8
    MAP,
    // 0xa9
    MAP,
    // 0xaA
    MAP,
    // 0xaB
    MAP,
    // 0xaC
    MAP,
    // 0xaD
    MAP,
    // 0xaE
    MAP,
    // 0xaF
    MAP,
    // 0xb0
    MAP,
    // 0xb1
    MAP,
    // 0xb2
    MAP,
    // 0xb3
    MAP,
    // 0xb4
    MAP,
    // 0xb5
    MAP,
    // 0xb6
    MAP,
    // 0xb7
    // map (one-byte uint8_t for n, and then n pairs of data items follow)
    MAP_8,
    // 0xb8
    // map (two-byte uint16_t for n, and then n pairs of data items follow)
    MAP_16,
    // 0xb9
    // map (four-byte uint32_t for n, and then n pairs of data items follow)
    MAP_32,
    // 0xba
    // map (eight-byte uint64_t for n, and then n pairs of data items follow)
    MAP_64,
    // 0xbb
    ERROR,
    // 0xbc
    ERROR,
    // 0xbd
    ERROR,
    // 0xbe
    // map, pairs of data items follow, terminated by "break"
    MAP_BREAK,
    // 0xbf
    // Text-based date/time (data item follows; see Section 2.4.1)
    TAG_KNOWN,
    // 0xc0
    // Epoch-based date/time (data item follows; see Section 2.4.1)
    TAG_KNOWN,
    // 0xc1
    // Positive bignum (data item "byte string" follows)
    TAG_KNOWN,
    // 0xc2
    // Negative bignum (data item "byte string" follows)
    TAG_KNOWN,
    // 0xc3
    // Decimal Fraction (data item "array" follows; see Section 2.4.3)
    TAG_KNOWN,
    // 0xc4
    // Bigfloat (data item "array" follows; see Section 2.4.3)
    TAG_KNOWN,
    // 0xc5
    // (tagged item)
    TAG_UNASSIGNED,
    // 0xc6
    TAG_UNASSIGNED,
    // 0xc7
    TAG_UNASSIGNED,
    // 0xc8
    TAG_UNASSIGNED,
    // 0xc9
    TAG_UNASSIGNED,
    // 0xca
    TAG_UNASSIGNED,
    // 0xcb
    TAG_UNASSIGNED,
    // 0xcc
    TAG_UNASSIGNED,
    // 0xcd
    TAG_UNASSIGNED,
    // 0xce
    TAG_UNASSIGNED,
    // 0xcf
    TAG_UNASSIGNED,
    // 0xd0
    TAG_UNASSIGNED,
    // 0xd1
    TAG_UNASSIGNED,
    // 0xd2
    TAG_UNASSIGNED,
    // 0xd3
    TAG_UNASSIGNED,
    // 0xd4
    // Expected Conversion (data item follows; see Section 2.4.4.2)
    TAG_UNASSIGNED,
    // 0xd5
    TAG_UNASSIGNED,
    // 0xd6
    TAG_UNASSIGNED,
    // 0xd7
    // (more tagged items, 1/2/4/8 bytes and then a data item follow)
    TAG_MORE_1,
    // 0xd8
    TAG_MORE_2,
    // 0xd9
    TAG_MORE_4,
    // 0xda
    TAG_MORE_8,
    // 0xdb
    ERROR,
    // 0xdc
    ERROR,
    // 0xdd
    ERROR,
    // 0xde
    ERROR,
    // 0xdf
    // (simple value)
    SIMPLE_UNASSIGNED,
    // 0xe0
    SIMPLE_UNASSIGNED,
    // 0xe1
    SIMPLE_UNASSIGNED,
    // 0xe2
    SIMPLE_UNASSIGNED,
    // 0xe3
    SIMPLE_UNASSIGNED,
    // 0xe4
    SIMPLE_UNASSIGNED,
    // 0xe5
    SIMPLE_UNASSIGNED,
    // 0xe6
    SIMPLE_UNASSIGNED,
    // 0xe7
    SIMPLE_UNASSIGNED,
    // 0xe8
    SIMPLE_UNASSIGNED,
    // 0xe9
    SIMPLE_UNASSIGNED,
    // 0xea
    SIMPLE_UNASSIGNED,
    // 0xeb
    SIMPLE_UNASSIGNED,
    // 0xec
    SIMPLE_UNASSIGNED,
    // 0xed
    SIMPLE_UNASSIGNED,
    // 0xee
    SIMPLE_UNASSIGNED,
    // 0xef
    SIMPLE_UNASSIGNED,
    // 0xf0
    SIMPLE_UNASSIGNED,
    // 0xf1
    SIMPLE_UNASSIGNED,
    // 0xf2
    SIMPLE_UNASSIGNED,
    // 0xf3
    // False
    SIMPLE_FALSE,
    // 0xf4
    // True
    SIMPLE_TRUE,
    // 0xf5
    // Null
    SIMPLE_NULL,
    // 0xf6
    // Undefined
    SIMPLE_UNDEFINED,
    // 0xf7
    // (simple value, one byte follows)
    SIMPLE_BYTE,
    // 0xf8
    // Half-Precision Float (two-byte IEEE 754)
    SIMPLE_FLOAT_HALF,
    // 0xf9
    // Single-Precision Float (four-byte IEEE 754)
    SIMPLE_FLOAT_SINGLE,
    // 0xfa
    // Double-Precision Float (eight-byte IEEE 754)
    SIMPLE_FLOAT_DOUBLE,
    // 0xfb
    ERROR,
    // 0xfc
    ERROR,
    // 0xfd
    ERROR,
    // 0xfe
    // "break" stop code
    BREAK
    // 0xff
  ];
  return {
    parse
  };
};
var utils$3 = {};
var constants$2 = {};
const Bignumber$2 = bignumberExports.BigNumber;
constants$2.MT = {
  POS_INT: 0,
  NEG_INT: 1,
  BYTE_STRING: 2,
  UTF8_STRING: 3,
  ARRAY: 4,
  MAP: 5,
  TAG: 6,
  SIMPLE_FLOAT: 7
};
constants$2.TAG = {
  DATE_STRING: 0,
  DATE_EPOCH: 1,
  POS_BIGINT: 2,
  NEG_BIGINT: 3,
  DECIMAL_FRAC: 4,
  BIGFLOAT: 5,
  BASE64URL_EXPECTED: 21,
  BASE64_EXPECTED: 22,
  BASE16_EXPECTED: 23,
  CBOR: 24,
  URI: 32,
  BASE64URL: 33,
  BASE64: 34,
  REGEXP: 35,
  MIME: 36
};
constants$2.NUMBYTES = {
  ZERO: 0,
  ONE: 24,
  TWO: 25,
  FOUR: 26,
  EIGHT: 27,
  INDEFINITE: 31
};
constants$2.SIMPLE = {
  FALSE: 20,
  TRUE: 21,
  NULL: 22,
  UNDEFINED: 23
};
constants$2.SYMS = {
  NULL: Symbol("null"),
  UNDEFINED: Symbol("undef"),
  PARENT: Symbol("parent"),
  BREAK: Symbol("break"),
  STREAM: Symbol("stream")
};
constants$2.SHIFT32 = Math.pow(2, 32);
constants$2.SHIFT16 = Math.pow(2, 16);
constants$2.MAX_SAFE_HIGH = 2097151;
constants$2.NEG_ONE = new Bignumber$2(-1);
constants$2.TEN = new Bignumber$2(10);
constants$2.TWO = new Bignumber$2(2);
constants$2.PARENT = {
  ARRAY: 0,
  OBJECT: 1,
  MAP: 2,
  TAG: 3,
  BYTE_STRING: 4,
  UTF8_STRING: 5
};
(function(exports) {
  const { Buffer: Buffer3 } = buffer;
  const Bignumber2 = bignumberExports.BigNumber;
  const constants2 = constants$2;
  const SHIFT322 = constants2.SHIFT32;
  const SHIFT16 = constants2.SHIFT16;
  const MAX_SAFE_HIGH = 2097151;
  exports.parseHalf = function parseHalf(buf) {
    var exp, mant, sign;
    sign = buf[0] & 128 ? -1 : 1;
    exp = (buf[0] & 124) >> 2;
    mant = (buf[0] & 3) << 8 | buf[1];
    if (!exp) {
      return sign * 5960464477539063e-23 * mant;
    } else if (exp === 31) {
      return sign * (mant ? 0 / 0 : Infinity);
    } else {
      return sign * Math.pow(2, exp - 25) * (1024 + mant);
    }
  };
  function toHex2(n) {
    if (n < 16) {
      return "0" + n.toString(16);
    }
    return n.toString(16);
  }
  exports.arrayBufferToBignumber = function(buf) {
    const len = buf.byteLength;
    let res = "";
    for (let i = 0; i < len; i++) {
      res += toHex2(buf[i]);
    }
    return new Bignumber2(res, 16);
  };
  exports.buildMap = (obj) => {
    const res = /* @__PURE__ */ new Map();
    const keys = Object.keys(obj);
    const length = keys.length;
    for (let i = 0; i < length; i++) {
      res.set(keys[i], obj[keys[i]]);
    }
    return res;
  };
  exports.buildInt32 = (f, g) => {
    return f * SHIFT16 + g;
  };
  exports.buildInt64 = (f1, f2, g1, g2) => {
    const f = exports.buildInt32(f1, f2);
    const g = exports.buildInt32(g1, g2);
    if (f > MAX_SAFE_HIGH) {
      return new Bignumber2(f).times(SHIFT322).plus(g);
    } else {
      return f * SHIFT322 + g;
    }
  };
  exports.writeHalf = function writeHalf(buf, half) {
    const u322 = Buffer3.allocUnsafe(4);
    u322.writeFloatBE(half, 0);
    const u = u322.readUInt32BE(0);
    if ((u & 8191) !== 0) {
      return false;
    }
    var s16 = u >> 16 & 32768;
    const exp = u >> 23 & 255;
    const mant = u & 8388607;
    if (exp >= 113 && exp <= 142) {
      s16 += (exp - 112 << 10) + (mant >> 13);
    } else if (exp >= 103 && exp < 113) {
      if (mant & (1 << 126 - exp) - 1) {
        return false;
      }
      s16 += mant + 8388608 >> 126 - exp;
    } else {
      return false;
    }
    buf.writeUInt16BE(s16, 0);
    return true;
  };
  exports.keySorter = function(a, b) {
    var lenA = a[0].byteLength;
    var lenB = b[0].byteLength;
    if (lenA > lenB) {
      return 1;
    }
    if (lenB > lenA) {
      return -1;
    }
    return a[0].compare(b[0]);
  };
  exports.isNegativeZero = (x) => {
    return x === 0 && 1 / x < 0;
  };
  exports.nextPowerOf2 = (n) => {
    let count = 0;
    if (n && !(n & n - 1)) {
      return n;
    }
    while (n !== 0) {
      n >>= 1;
      count += 1;
    }
    return 1 << count;
  };
})(utils$3);
const constants$1 = constants$2;
const MT$1 = constants$1.MT;
const SIMPLE = constants$1.SIMPLE;
const SYMS$1 = constants$1.SYMS;
let Simple$1 = class Simple {
  /**
   * Creates an instance of Simple.
   *
   * @param {integer} value - the simple value's integer value
   */
  constructor(value2) {
    if (typeof value2 !== "number") {
      throw new Error("Invalid Simple type: " + typeof value2);
    }
    if (value2 < 0 || value2 > 255 || (value2 | 0) !== value2) {
      throw new Error("value must be a small positive integer: " + value2);
    }
    this.value = value2;
  }
  /**
   * Debug string for simple value
   *
   * @returns {string} simple(value)
   */
  toString() {
    return "simple(" + this.value + ")";
  }
  /**
   * Debug string for simple value
   *
   * @returns {string} simple(value)
   */
  inspect() {
    return "simple(" + this.value + ")";
  }
  /**
   * Push the simple value onto the CBOR stream
   *
   * @param {cbor.Encoder} gen The generator to push onto
   * @returns {number}
   */
  encodeCBOR(gen) {
    return gen._pushInt(this.value, MT$1.SIMPLE_FLOAT);
  }
  /**
   * Is the given object a Simple?
   *
   * @param {any} obj - object to test
   * @returns {bool} - is it Simple?
   */
  static isSimple(obj) {
    return obj instanceof Simple;
  }
  /**
   * Decode from the CBOR additional information into a JavaScript value.
   * If the CBOR item has no parent, return a "safe" symbol instead of
   * `null` or `undefined`, so that the value can be passed through a
   * stream in object mode.
   *
   * @param {Number} val - the CBOR additional info to convert
   * @param {bool} hasParent - Does the CBOR item have a parent?
   * @returns {(null|undefined|Boolean|Symbol)} - the decoded value
   */
  static decode(val, hasParent) {
    if (hasParent == null) {
      hasParent = true;
    }
    switch (val) {
      case SIMPLE.FALSE:
        return false;
      case SIMPLE.TRUE:
        return true;
      case SIMPLE.NULL:
        if (hasParent) {
          return null;
        } else {
          return SYMS$1.NULL;
        }
      case SIMPLE.UNDEFINED:
        if (hasParent) {
          return void 0;
        } else {
          return SYMS$1.UNDEFINED;
        }
      case -1:
        if (!hasParent) {
          throw new Error("Invalid BREAK");
        }
        return SYMS$1.BREAK;
      default:
        return new Simple(val);
    }
  }
};
var simple = Simple$1;
let Tagged$1 = class Tagged {
  /**
   * Creates an instance of Tagged.
   *
   * @param {Number} tag - the number of the tag
   * @param {any} value - the value inside the tag
   * @param {Error} err - the error that was thrown parsing the tag, or null
   */
  constructor(tag, value2, err) {
    this.tag = tag;
    this.value = value2;
    this.err = err;
    if (typeof this.tag !== "number") {
      throw new Error("Invalid tag type (" + typeof this.tag + ")");
    }
    if (this.tag < 0 || (this.tag | 0) !== this.tag) {
      throw new Error("Tag must be a positive integer: " + this.tag);
    }
  }
  /**
   * Convert to a String
   *
   * @returns {String} string of the form '1(2)'
   */
  toString() {
    return `${this.tag}(${JSON.stringify(this.value)})`;
  }
  /**
   * Push the simple value onto the CBOR stream
   *
   * @param {cbor.Encoder} gen The generator to push onto
   * @returns {number}
   */
  encodeCBOR(gen) {
    gen._pushTag(this.tag);
    return gen.pushAny(this.value);
  }
  /**
   * If we have a converter for this type, do the conversion.  Some converters
   * are built-in.  Additional ones can be passed in.  If you want to remove
   * a built-in converter, pass a converter in whose value is 'null' instead
   * of a function.
   *
   * @param {Object} converters - keys in the object are a tag number, the value
   *   is a function that takes the decoded CBOR and returns a JavaScript value
   *   of the appropriate type.  Throw an exception in the function on errors.
   * @returns {any} - the converted item
   */
  convert(converters) {
    var er, f;
    f = converters != null ? converters[this.tag] : void 0;
    if (typeof f !== "function") {
      f = Tagged["_tag" + this.tag];
      if (typeof f !== "function") {
        return this;
      }
    }
    try {
      return f.call(Tagged, this.value);
    } catch (error) {
      er = error;
      this.err = er;
      return this;
    }
  }
};
var tagged$1 = Tagged$1;
const defaultBase$1 = self.location ? self.location.protocol + "//" + self.location.host : "";
const URL$3 = self.URL;
let URLWithLegacySupport$2 = class URLWithLegacySupport {
  constructor(url = "", base = defaultBase$1) {
    this.super = new URL$3(url, base);
    this.path = this.pathname + this.search;
    this.auth = this.username && this.password ? this.username + ":" + this.password : null;
    this.query = this.search && this.search.startsWith("?") ? this.search.slice(1) : null;
  }
  get hash() {
    return this.super.hash;
  }
  get host() {
    return this.super.host;
  }
  get hostname() {
    return this.super.hostname;
  }
  get href() {
    return this.super.href;
  }
  get origin() {
    return this.super.origin;
  }
  get password() {
    return this.super.password;
  }
  get pathname() {
    return this.super.pathname;
  }
  get port() {
    return this.super.port;
  }
  get protocol() {
    return this.super.protocol;
  }
  get search() {
    return this.super.search;
  }
  get searchParams() {
    return this.super.searchParams;
  }
  get username() {
    return this.super.username;
  }
  set hash(hash2) {
    this.super.hash = hash2;
  }
  set host(host) {
    this.super.host = host;
  }
  set hostname(hostname) {
    this.super.hostname = hostname;
  }
  set href(href) {
    this.super.href = href;
  }
  set origin(origin) {
    this.super.origin = origin;
  }
  set password(password) {
    this.super.password = password;
  }
  set pathname(pathname) {
    this.super.pathname = pathname;
  }
  set port(port) {
    this.super.port = port;
  }
  set protocol(protocol) {
    this.super.protocol = protocol;
  }
  set search(search) {
    this.super.search = search;
  }
  set searchParams(searchParams) {
    this.super.searchParams = searchParams;
  }
  set username(username) {
    this.super.username = username;
  }
  createObjectURL(o) {
    return this.super.createObjectURL(o);
  }
  revokeObjectURL(o) {
    this.super.revokeObjectURL(o);
  }
  toJSON() {
    return this.super.toJSON();
  }
  toString() {
    return this.super.toString();
  }
  format() {
    return this.toString();
  }
};
function format$2(obj) {
  if (typeof obj === "string") {
    const url = new URL$3(obj);
    return url.toString();
  }
  if (!(obj instanceof URL$3)) {
    const userPass = obj.username && obj.password ? `${obj.username}:${obj.password}@` : "";
    const auth = obj.auth ? obj.auth + "@" : "";
    const port = obj.port ? ":" + obj.port : "";
    const protocol = obj.protocol ? obj.protocol + "//" : "";
    const host = obj.host || "";
    const hostname = obj.hostname || "";
    const search = obj.search || (obj.query ? "?" + obj.query : "");
    const hash2 = obj.hash || "";
    const pathname = obj.pathname || "";
    const path = obj.path || pathname + search;
    return `${protocol}${userPass || auth}${host || hostname + port}${path}${hash2}`;
  }
}
var urlBrowser = {
  URLWithLegacySupport: URLWithLegacySupport$2,
  URLSearchParams: self.URLSearchParams,
  defaultBase: defaultBase$1,
  format: format$2
};
const { URLWithLegacySupport: URLWithLegacySupport$1, format: format$1 } = urlBrowser;
var relative$1 = (url, location2 = {}, protocolMap = {}, defaultProtocol) => {
  let protocol = location2.protocol ? location2.protocol.replace(":", "") : "http";
  protocol = (protocolMap[protocol] || defaultProtocol || protocol) + ":";
  let urlParsed;
  try {
    urlParsed = new URLWithLegacySupport$1(url);
  } catch (err) {
    urlParsed = {};
  }
  const base = Object.assign({}, location2, {
    protocol: protocol || urlParsed.protocol,
    host: location2.host || urlParsed.host
  });
  return new URLWithLegacySupport$1(url, format$1(base)).toString();
};
const {
  URLWithLegacySupport: URLWithLegacySupport2,
  format,
  URLSearchParams: URLSearchParams$1,
  defaultBase
} = urlBrowser;
const relative = relative$1;
var isoUrl = {
  URL: URLWithLegacySupport2,
  URLSearchParams: URLSearchParams$1,
  format,
  relative,
  defaultBase
};
const { Buffer: Buffer$2 } = buffer;
const ieee754 = ieee754$1;
const Bignumber$1 = bignumberExports.BigNumber;
const parser = decoder_asm;
const utils$2 = utils$3;
const c = constants$2;
const Simple2 = simple;
const Tagged2 = tagged$1;
const { URL: URL$2 } = isoUrl;
let Decoder$1 = class Decoder {
  /**
   * @param {Object} [opts={}]
   * @param {number} [opts.size=65536] - Size of the allocated heap.
   */
  constructor(opts) {
    opts = opts || {};
    if (!opts.size || opts.size < 65536) {
      opts.size = 65536;
    } else {
      opts.size = utils$2.nextPowerOf2(opts.size);
    }
    this._heap = new ArrayBuffer(opts.size);
    this._heap8 = new Uint8Array(this._heap);
    this._buffer = Buffer$2.from(this._heap);
    this._reset();
    this._knownTags = Object.assign({
      0: (val) => new Date(val),
      1: (val) => new Date(val * 1e3),
      2: (val) => utils$2.arrayBufferToBignumber(val),
      3: (val) => c.NEG_ONE.minus(utils$2.arrayBufferToBignumber(val)),
      4: (v) => {
        return c.TEN.pow(v[0]).times(v[1]);
      },
      5: (v) => {
        return c.TWO.pow(v[0]).times(v[1]);
      },
      32: (val) => new URL$2(val),
      35: (val) => new RegExp(val)
    }, opts.tags);
    this.parser = parser(commonjsGlobal, {
      // eslint-disable-next-line no-console
      log: console.log.bind(console),
      pushInt: this.pushInt.bind(this),
      pushInt32: this.pushInt32.bind(this),
      pushInt32Neg: this.pushInt32Neg.bind(this),
      pushInt64: this.pushInt64.bind(this),
      pushInt64Neg: this.pushInt64Neg.bind(this),
      pushFloat: this.pushFloat.bind(this),
      pushFloatSingle: this.pushFloatSingle.bind(this),
      pushFloatDouble: this.pushFloatDouble.bind(this),
      pushTrue: this.pushTrue.bind(this),
      pushFalse: this.pushFalse.bind(this),
      pushUndefined: this.pushUndefined.bind(this),
      pushNull: this.pushNull.bind(this),
      pushInfinity: this.pushInfinity.bind(this),
      pushInfinityNeg: this.pushInfinityNeg.bind(this),
      pushNaN: this.pushNaN.bind(this),
      pushNaNNeg: this.pushNaNNeg.bind(this),
      pushArrayStart: this.pushArrayStart.bind(this),
      pushArrayStartFixed: this.pushArrayStartFixed.bind(this),
      pushArrayStartFixed32: this.pushArrayStartFixed32.bind(this),
      pushArrayStartFixed64: this.pushArrayStartFixed64.bind(this),
      pushObjectStart: this.pushObjectStart.bind(this),
      pushObjectStartFixed: this.pushObjectStartFixed.bind(this),
      pushObjectStartFixed32: this.pushObjectStartFixed32.bind(this),
      pushObjectStartFixed64: this.pushObjectStartFixed64.bind(this),
      pushByteString: this.pushByteString.bind(this),
      pushByteStringStart: this.pushByteStringStart.bind(this),
      pushUtf8String: this.pushUtf8String.bind(this),
      pushUtf8StringStart: this.pushUtf8StringStart.bind(this),
      pushSimpleUnassigned: this.pushSimpleUnassigned.bind(this),
      pushTagUnassigned: this.pushTagUnassigned.bind(this),
      pushTagStart: this.pushTagStart.bind(this),
      pushTagStart4: this.pushTagStart4.bind(this),
      pushTagStart8: this.pushTagStart8.bind(this),
      pushBreak: this.pushBreak.bind(this)
    }, this._heap);
  }
  get _depth() {
    return this._parents.length;
  }
  get _currentParent() {
    return this._parents[this._depth - 1];
  }
  get _ref() {
    return this._currentParent.ref;
  }
  // Finish the current parent
  _closeParent() {
    var p = this._parents.pop();
    if (p.length > 0) {
      throw new Error(`Missing ${p.length} elements`);
    }
    switch (p.type) {
      case c.PARENT.TAG:
        this._push(
          this.createTag(p.ref[0], p.ref[1])
        );
        break;
      case c.PARENT.BYTE_STRING:
        this._push(this.createByteString(p.ref, p.length));
        break;
      case c.PARENT.UTF8_STRING:
        this._push(this.createUtf8String(p.ref, p.length));
        break;
      case c.PARENT.MAP:
        if (p.values % 2 > 0) {
          throw new Error("Odd number of elements in the map");
        }
        this._push(this.createMap(p.ref, p.length));
        break;
      case c.PARENT.OBJECT:
        if (p.values % 2 > 0) {
          throw new Error("Odd number of elements in the map");
        }
        this._push(this.createObject(p.ref, p.length));
        break;
      case c.PARENT.ARRAY:
        this._push(this.createArray(p.ref, p.length));
        break;
    }
    if (this._currentParent && this._currentParent.type === c.PARENT.TAG) {
      this._dec();
    }
  }
  // Reduce the expected length of the current parent by one
  _dec() {
    const p = this._currentParent;
    if (p.length < 0) {
      return;
    }
    p.length--;
    if (p.length === 0) {
      this._closeParent();
    }
  }
  // Push any value to the current parent
  _push(val, hasChildren) {
    const p = this._currentParent;
    p.values++;
    switch (p.type) {
      case c.PARENT.ARRAY:
      case c.PARENT.BYTE_STRING:
      case c.PARENT.UTF8_STRING:
        if (p.length > -1) {
          this._ref[this._ref.length - p.length] = val;
        } else {
          this._ref.push(val);
        }
        this._dec();
        break;
      case c.PARENT.OBJECT:
        if (p.tmpKey != null) {
          this._ref[p.tmpKey] = val;
          p.tmpKey = null;
          this._dec();
        } else {
          p.tmpKey = val;
          if (typeof p.tmpKey !== "string") {
            p.type = c.PARENT.MAP;
            p.ref = utils$2.buildMap(p.ref);
          }
        }
        break;
      case c.PARENT.MAP:
        if (p.tmpKey != null) {
          this._ref.set(p.tmpKey, val);
          p.tmpKey = null;
          this._dec();
        } else {
          p.tmpKey = val;
        }
        break;
      case c.PARENT.TAG:
        this._ref.push(val);
        if (!hasChildren) {
          this._dec();
        }
        break;
      default:
        throw new Error("Unknown parent type");
    }
  }
  // Create a new parent in the parents list
  _createParent(obj, type, len) {
    this._parents[this._depth] = {
      type,
      length: len,
      ref: obj,
      values: 0,
      tmpKey: null
    };
  }
  // Reset all state back to the beginning, also used for initiatlization
  _reset() {
    this._res = [];
    this._parents = [{
      type: c.PARENT.ARRAY,
      length: -1,
      ref: this._res,
      values: 0,
      tmpKey: null
    }];
  }
  // -- Interface to customize deoding behaviour
  createTag(tagNumber, value2) {
    const typ = this._knownTags[tagNumber];
    if (!typ) {
      return new Tagged2(tagNumber, value2);
    }
    return typ(value2);
  }
  createMap(obj, len) {
    return obj;
  }
  createObject(obj, len) {
    return obj;
  }
  createArray(arr, len) {
    return arr;
  }
  createByteString(raw2, len) {
    return Buffer$2.concat(raw2);
  }
  createByteStringFromHeap(start, end) {
    if (start === end) {
      return Buffer$2.alloc(0);
    }
    return Buffer$2.from(this._heap.slice(start, end));
  }
  createInt(val) {
    return val;
  }
  createInt32(f, g) {
    return utils$2.buildInt32(f, g);
  }
  createInt64(f1, f2, g1, g2) {
    return utils$2.buildInt64(f1, f2, g1, g2);
  }
  createFloat(val) {
    return val;
  }
  createFloatSingle(a, b, c2, d) {
    return ieee754.read([a, b, c2, d], 0, false, 23, 4);
  }
  createFloatDouble(a, b, c2, d, e, f, g, h) {
    return ieee754.read([a, b, c2, d, e, f, g, h], 0, false, 52, 8);
  }
  createInt32Neg(f, g) {
    return -1 - utils$2.buildInt32(f, g);
  }
  createInt64Neg(f1, f2, g1, g2) {
    const f = utils$2.buildInt32(f1, f2);
    const g = utils$2.buildInt32(g1, g2);
    if (f > c.MAX_SAFE_HIGH) {
      return c.NEG_ONE.minus(new Bignumber$1(f).times(c.SHIFT32).plus(g));
    }
    return -1 - (f * c.SHIFT32 + g);
  }
  createTrue() {
    return true;
  }
  createFalse() {
    return false;
  }
  createNull() {
    return null;
  }
  createUndefined() {
    return void 0;
  }
  createInfinity() {
    return Infinity;
  }
  createInfinityNeg() {
    return -Infinity;
  }
  createNaN() {
    return NaN;
  }
  createNaNNeg() {
    return NaN;
  }
  createUtf8String(raw2, len) {
    return raw2.join("");
  }
  createUtf8StringFromHeap(start, end) {
    if (start === end) {
      return "";
    }
    return this._buffer.toString("utf8", start, end);
  }
  createSimpleUnassigned(val) {
    return new Simple2(val);
  }
  // -- Interface for decoder.asm.js
  pushInt(val) {
    this._push(this.createInt(val));
  }
  pushInt32(f, g) {
    this._push(this.createInt32(f, g));
  }
  pushInt64(f1, f2, g1, g2) {
    this._push(this.createInt64(f1, f2, g1, g2));
  }
  pushFloat(val) {
    this._push(this.createFloat(val));
  }
  pushFloatSingle(a, b, c2, d) {
    this._push(this.createFloatSingle(a, b, c2, d));
  }
  pushFloatDouble(a, b, c2, d, e, f, g, h) {
    this._push(this.createFloatDouble(a, b, c2, d, e, f, g, h));
  }
  pushInt32Neg(f, g) {
    this._push(this.createInt32Neg(f, g));
  }
  pushInt64Neg(f1, f2, g1, g2) {
    this._push(this.createInt64Neg(f1, f2, g1, g2));
  }
  pushTrue() {
    this._push(this.createTrue());
  }
  pushFalse() {
    this._push(this.createFalse());
  }
  pushNull() {
    this._push(this.createNull());
  }
  pushUndefined() {
    this._push(this.createUndefined());
  }
  pushInfinity() {
    this._push(this.createInfinity());
  }
  pushInfinityNeg() {
    this._push(this.createInfinityNeg());
  }
  pushNaN() {
    this._push(this.createNaN());
  }
  pushNaNNeg() {
    this._push(this.createNaNNeg());
  }
  pushArrayStart() {
    this._createParent([], c.PARENT.ARRAY, -1);
  }
  pushArrayStartFixed(len) {
    this._createArrayStartFixed(len);
  }
  pushArrayStartFixed32(len1, len2) {
    const len = utils$2.buildInt32(len1, len2);
    this._createArrayStartFixed(len);
  }
  pushArrayStartFixed64(len1, len2, len3, len4) {
    const len = utils$2.buildInt64(len1, len2, len3, len4);
    this._createArrayStartFixed(len);
  }
  pushObjectStart() {
    this._createObjectStartFixed(-1);
  }
  pushObjectStartFixed(len) {
    this._createObjectStartFixed(len);
  }
  pushObjectStartFixed32(len1, len2) {
    const len = utils$2.buildInt32(len1, len2);
    this._createObjectStartFixed(len);
  }
  pushObjectStartFixed64(len1, len2, len3, len4) {
    const len = utils$2.buildInt64(len1, len2, len3, len4);
    this._createObjectStartFixed(len);
  }
  pushByteStringStart() {
    this._parents[this._depth] = {
      type: c.PARENT.BYTE_STRING,
      length: -1,
      ref: [],
      values: 0,
      tmpKey: null
    };
  }
  pushByteString(start, end) {
    this._push(this.createByteStringFromHeap(start, end));
  }
  pushUtf8StringStart() {
    this._parents[this._depth] = {
      type: c.PARENT.UTF8_STRING,
      length: -1,
      ref: [],
      values: 0,
      tmpKey: null
    };
  }
  pushUtf8String(start, end) {
    this._push(this.createUtf8StringFromHeap(start, end));
  }
  pushSimpleUnassigned(val) {
    this._push(this.createSimpleUnassigned(val));
  }
  pushTagStart(tag) {
    this._parents[this._depth] = {
      type: c.PARENT.TAG,
      length: 1,
      ref: [tag]
    };
  }
  pushTagStart4(f, g) {
    this.pushTagStart(utils$2.buildInt32(f, g));
  }
  pushTagStart8(f1, f2, g1, g2) {
    this.pushTagStart(utils$2.buildInt64(f1, f2, g1, g2));
  }
  pushTagUnassigned(tagNumber) {
    this._push(this.createTag(tagNumber));
  }
  pushBreak() {
    if (this._currentParent.length > -1) {
      throw new Error("Unexpected break");
    }
    this._closeParent();
  }
  _createObjectStartFixed(len) {
    if (len === 0) {
      this._push(this.createObject({}));
      return;
    }
    this._createParent({}, c.PARENT.OBJECT, len);
  }
  _createArrayStartFixed(len) {
    if (len === 0) {
      this._push(this.createArray([]));
      return;
    }
    this._createParent(new Array(len), c.PARENT.ARRAY, len);
  }
  _decode(input) {
    if (input.byteLength === 0) {
      throw new Error("Input too short");
    }
    this._reset();
    this._heap8.set(input);
    const code2 = this.parser.parse(input.byteLength);
    if (this._depth > 1) {
      while (this._currentParent.length === 0) {
        this._closeParent();
      }
      if (this._depth > 1) {
        throw new Error("Undeterminated nesting");
      }
    }
    if (code2 > 0) {
      throw new Error("Failed to parse");
    }
    if (this._res.length === 0) {
      throw new Error("No valid result");
    }
  }
  // -- Public Interface
  decodeFirst(input) {
    this._decode(input);
    return this._res[0];
  }
  decodeAll(input) {
    this._decode(input);
    return this._res;
  }
  /**
   * Decode the first cbor object.
   *
   * @param {Buffer|string} input
   * @param {string} [enc='hex'] - Encoding used if a string is passed.
   * @returns {*}
   */
  static decode(input, enc) {
    if (typeof input === "string") {
      input = Buffer$2.from(input, enc || "hex");
    }
    const dec = new Decoder({ size: input.length });
    return dec.decodeFirst(input);
  }
  /**
   * Decode all cbor objects.
   *
   * @param {Buffer|string} input
   * @param {string} [enc='hex'] - Encoding used if a string is passed.
   * @returns {Array<*>}
   */
  static decodeAll(input, enc) {
    if (typeof input === "string") {
      input = Buffer$2.from(input, enc || "hex");
    }
    const dec = new Decoder({ size: input.length });
    return dec.decodeAll(input);
  }
};
Decoder$1.decodeFirst = Decoder$1.decode;
var decoder = Decoder$1;
const { Buffer: Buffer$1 } = buffer;
const Decoder2 = decoder;
const utils$1 = utils$3;
class Diagnose extends Decoder2 {
  createTag(tagNumber, value2) {
    return `${tagNumber}(${value2})`;
  }
  createInt(val) {
    return super.createInt(val).toString();
  }
  createInt32(f, g) {
    return super.createInt32(f, g).toString();
  }
  createInt64(f1, f2, g1, g2) {
    return super.createInt64(f1, f2, g1, g2).toString();
  }
  createInt32Neg(f, g) {
    return super.createInt32Neg(f, g).toString();
  }
  createInt64Neg(f1, f2, g1, g2) {
    return super.createInt64Neg(f1, f2, g1, g2).toString();
  }
  createTrue() {
    return "true";
  }
  createFalse() {
    return "false";
  }
  createFloat(val) {
    const fl = super.createFloat(val);
    if (utils$1.isNegativeZero(val)) {
      return "-0_1";
    }
    return `${fl}_1`;
  }
  createFloatSingle(a, b, c2, d) {
    const fl = super.createFloatSingle(a, b, c2, d);
    return `${fl}_2`;
  }
  createFloatDouble(a, b, c2, d, e, f, g, h) {
    const fl = super.createFloatDouble(a, b, c2, d, e, f, g, h);
    return `${fl}_3`;
  }
  createByteString(raw2, len) {
    const val = raw2.join(", ");
    if (len === -1) {
      return `(_ ${val})`;
    }
    return `h'${val}`;
  }
  createByteStringFromHeap(start, end) {
    const val = Buffer$1.from(
      super.createByteStringFromHeap(start, end)
    ).toString("hex");
    return `h'${val}'`;
  }
  createInfinity() {
    return "Infinity_1";
  }
  createInfinityNeg() {
    return "-Infinity_1";
  }
  createNaN() {
    return "NaN_1";
  }
  createNaNNeg() {
    return "-NaN_1";
  }
  createNull() {
    return "null";
  }
  createUndefined() {
    return "undefined";
  }
  createSimpleUnassigned(val) {
    return `simple(${val})`;
  }
  createArray(arr, len) {
    const val = super.createArray(arr, len);
    if (len === -1) {
      return `[_ ${val.join(", ")}]`;
    }
    return `[${val.join(", ")}]`;
  }
  createMap(map2, len) {
    const val = super.createMap(map2);
    const list = Array.from(val.keys()).reduce(collectObject(val), "");
    if (len === -1) {
      return `{_ ${list}}`;
    }
    return `{${list}}`;
  }
  createObject(obj, len) {
    const val = super.createObject(obj);
    const map2 = Object.keys(val).reduce(collectObject(val), "");
    if (len === -1) {
      return `{_ ${map2}}`;
    }
    return `{${map2}}`;
  }
  createUtf8String(raw2, len) {
    const val = raw2.join(", ");
    if (len === -1) {
      return `(_ ${val})`;
    }
    return `"${val}"`;
  }
  createUtf8StringFromHeap(start, end) {
    const val = Buffer$1.from(
      super.createUtf8StringFromHeap(start, end)
    ).toString("utf8");
    return `"${val}"`;
  }
  static diagnose(input, enc) {
    if (typeof input === "string") {
      input = Buffer$1.from(input, enc || "hex");
    }
    const dec = new Diagnose();
    return dec.decodeFirst(input);
  }
}
var diagnose = Diagnose;
function collectObject(val) {
  return (acc, key) => {
    if (acc) {
      return `${acc}, ${key}: ${val[key]}`;
    }
    return `${key}: ${val[key]}`;
  };
}
const { Buffer: Buffer2 } = buffer;
const { URL: URL$1 } = isoUrl;
const Bignumber = bignumberExports.BigNumber;
const utils = utils$3;
const constants = constants$2;
const MT = constants.MT;
const NUMBYTES = constants.NUMBYTES;
const SHIFT32 = constants.SHIFT32;
const SYMS = constants.SYMS;
const TAG = constants.TAG;
const HALF = constants.MT.SIMPLE_FLOAT << 5 | constants.NUMBYTES.TWO;
const FLOAT = constants.MT.SIMPLE_FLOAT << 5 | constants.NUMBYTES.FOUR;
const DOUBLE = constants.MT.SIMPLE_FLOAT << 5 | constants.NUMBYTES.EIGHT;
const TRUE = constants.MT.SIMPLE_FLOAT << 5 | constants.SIMPLE.TRUE;
const FALSE = constants.MT.SIMPLE_FLOAT << 5 | constants.SIMPLE.FALSE;
const UNDEFINED = constants.MT.SIMPLE_FLOAT << 5 | constants.SIMPLE.UNDEFINED;
const NULL = constants.MT.SIMPLE_FLOAT << 5 | constants.SIMPLE.NULL;
const MAXINT_BN = new Bignumber("0x20000000000000");
const BUF_NAN = Buffer2.from("f97e00", "hex");
const BUF_INF_NEG = Buffer2.from("f9fc00", "hex");
const BUF_INF_POS = Buffer2.from("f97c00", "hex");
function toType(obj) {
  return {}.toString.call(obj).slice(8, -1);
}
class Encoder {
  /**
   * @param {Object} [options={}]
   * @param {function(Buffer)} options.stream
   */
  constructor(options) {
    options = options || {};
    this.streaming = typeof options.stream === "function";
    this.onData = options.stream;
    this.semanticTypes = [
      [URL$1, this._pushUrl],
      [Bignumber, this._pushBigNumber]
    ];
    const addTypes = options.genTypes || [];
    const len = addTypes.length;
    for (let i = 0; i < len; i++) {
      this.addSemanticType(
        addTypes[i][0],
        addTypes[i][1]
      );
    }
    this._reset();
  }
  addSemanticType(type, fun) {
    const len = this.semanticTypes.length;
    for (let i = 0; i < len; i++) {
      const typ = this.semanticTypes[i][0];
      if (typ === type) {
        const old = this.semanticTypes[i][1];
        this.semanticTypes[i][1] = fun;
        return old;
      }
    }
    this.semanticTypes.push([type, fun]);
    return null;
  }
  push(val) {
    if (!val) {
      return true;
    }
    this.result[this.offset] = val;
    this.resultMethod[this.offset] = 0;
    this.resultLength[this.offset] = val.length;
    this.offset++;
    if (this.streaming) {
      this.onData(this.finalize());
    }
    return true;
  }
  pushWrite(val, method, len) {
    this.result[this.offset] = val;
    this.resultMethod[this.offset] = method;
    this.resultLength[this.offset] = len;
    this.offset++;
    if (this.streaming) {
      this.onData(this.finalize());
    }
    return true;
  }
  _pushUInt8(val) {
    return this.pushWrite(val, 1, 1);
  }
  _pushUInt16BE(val) {
    return this.pushWrite(val, 2, 2);
  }
  _pushUInt32BE(val) {
    return this.pushWrite(val, 3, 4);
  }
  _pushDoubleBE(val) {
    return this.pushWrite(val, 4, 8);
  }
  _pushNaN() {
    return this.push(BUF_NAN);
  }
  _pushInfinity(obj) {
    const half = obj < 0 ? BUF_INF_NEG : BUF_INF_POS;
    return this.push(half);
  }
  _pushFloat(obj) {
    const b2 = Buffer2.allocUnsafe(2);
    if (utils.writeHalf(b2, obj)) {
      if (utils.parseHalf(b2) === obj) {
        return this._pushUInt8(HALF) && this.push(b2);
      }
    }
    const b4 = Buffer2.allocUnsafe(4);
    b4.writeFloatBE(obj, 0);
    if (b4.readFloatBE(0) === obj) {
      return this._pushUInt8(FLOAT) && this.push(b4);
    }
    return this._pushUInt8(DOUBLE) && this._pushDoubleBE(obj);
  }
  _pushInt(obj, mt, orig) {
    const m = mt << 5;
    if (obj < 24) {
      return this._pushUInt8(m | obj);
    }
    if (obj <= 255) {
      return this._pushUInt8(m | NUMBYTES.ONE) && this._pushUInt8(obj);
    }
    if (obj <= 65535) {
      return this._pushUInt8(m | NUMBYTES.TWO) && this._pushUInt16BE(obj);
    }
    if (obj <= 4294967295) {
      return this._pushUInt8(m | NUMBYTES.FOUR) && this._pushUInt32BE(obj);
    }
    if (obj <= Number.MAX_SAFE_INTEGER) {
      return this._pushUInt8(m | NUMBYTES.EIGHT) && this._pushUInt32BE(Math.floor(obj / SHIFT32)) && this._pushUInt32BE(obj % SHIFT32);
    }
    if (mt === MT.NEG_INT) {
      return this._pushFloat(orig);
    }
    return this._pushFloat(obj);
  }
  _pushIntNum(obj) {
    if (obj < 0) {
      return this._pushInt(-obj - 1, MT.NEG_INT, obj);
    } else {
      return this._pushInt(obj, MT.POS_INT);
    }
  }
  _pushNumber(obj) {
    switch (false) {
      case obj === obj:
        return this._pushNaN(obj);
      case isFinite(obj):
        return this._pushInfinity(obj);
      case obj % 1 !== 0:
        return this._pushIntNum(obj);
      default:
        return this._pushFloat(obj);
    }
  }
  _pushString(obj) {
    const len = Buffer2.byteLength(obj, "utf8");
    return this._pushInt(len, MT.UTF8_STRING) && this.pushWrite(obj, 5, len);
  }
  _pushBoolean(obj) {
    return this._pushUInt8(obj ? TRUE : FALSE);
  }
  _pushUndefined(obj) {
    return this._pushUInt8(UNDEFINED);
  }
  _pushArray(gen, obj) {
    const len = obj.length;
    if (!gen._pushInt(len, MT.ARRAY)) {
      return false;
    }
    for (let j = 0; j < len; j++) {
      if (!gen.pushAny(obj[j])) {
        return false;
      }
    }
    return true;
  }
  _pushTag(tag) {
    return this._pushInt(tag, MT.TAG);
  }
  _pushDate(gen, obj) {
    return gen._pushTag(TAG.DATE_EPOCH) && gen.pushAny(Math.round(obj / 1e3));
  }
  _pushBuffer(gen, obj) {
    return gen._pushInt(obj.length, MT.BYTE_STRING) && gen.push(obj);
  }
  _pushNoFilter(gen, obj) {
    return gen._pushBuffer(gen, obj.slice());
  }
  _pushRegexp(gen, obj) {
    return gen._pushTag(TAG.REGEXP) && gen.pushAny(obj.source);
  }
  _pushSet(gen, obj) {
    if (!gen._pushInt(obj.size, MT.ARRAY)) {
      return false;
    }
    for (const x of obj) {
      if (!gen.pushAny(x)) {
        return false;
      }
    }
    return true;
  }
  _pushUrl(gen, obj) {
    return gen._pushTag(TAG.URI) && gen.pushAny(obj.format());
  }
  _pushBigint(obj) {
    let tag = TAG.POS_BIGINT;
    if (obj.isNegative()) {
      obj = obj.negated().minus(1);
      tag = TAG.NEG_BIGINT;
    }
    let str = obj.toString(16);
    if (str.length % 2) {
      str = "0" + str;
    }
    const buf = Buffer2.from(str, "hex");
    return this._pushTag(tag) && this._pushBuffer(this, buf);
  }
  _pushBigNumber(gen, obj) {
    if (obj.isNaN()) {
      return gen._pushNaN();
    }
    if (!obj.isFinite()) {
      return gen._pushInfinity(obj.isNegative() ? -Infinity : Infinity);
    }
    if (obj.isInteger()) {
      return gen._pushBigint(obj);
    }
    if (!(gen._pushTag(TAG.DECIMAL_FRAC) && gen._pushInt(2, MT.ARRAY))) {
      return false;
    }
    const dec = obj.decimalPlaces();
    const slide = obj.multipliedBy(new Bignumber(10).pow(dec));
    if (!gen._pushIntNum(-dec)) {
      return false;
    }
    if (slide.abs().isLessThan(MAXINT_BN)) {
      return gen._pushIntNum(slide.toNumber());
    } else {
      return gen._pushBigint(slide);
    }
  }
  _pushMap(gen, obj) {
    if (!gen._pushInt(obj.size, MT.MAP)) {
      return false;
    }
    return this._pushRawMap(
      obj.size,
      Array.from(obj)
    );
  }
  _pushObject(obj) {
    if (!obj) {
      return this._pushUInt8(NULL);
    }
    var len = this.semanticTypes.length;
    for (var i = 0; i < len; i++) {
      if (obj instanceof this.semanticTypes[i][0]) {
        return this.semanticTypes[i][1].call(obj, this, obj);
      }
    }
    var f = obj.encodeCBOR;
    if (typeof f === "function") {
      return f.call(obj, this);
    }
    var keys = Object.keys(obj);
    var keyLength = keys.length;
    if (!this._pushInt(keyLength, MT.MAP)) {
      return false;
    }
    return this._pushRawMap(
      keyLength,
      keys.map((k) => [k, obj[k]])
    );
  }
  _pushRawMap(len, map2) {
    map2 = map2.map(function(a) {
      a[0] = Encoder.encode(a[0]);
      return a;
    }).sort(utils.keySorter);
    for (var j = 0; j < len; j++) {
      if (!this.push(map2[j][0])) {
        return false;
      }
      if (!this.pushAny(map2[j][1])) {
        return false;
      }
    }
    return true;
  }
  /**
   * Alias for `.pushAny`
   *
   * @param {*} obj
   * @returns {boolean} true on success
   */
  write(obj) {
    return this.pushAny(obj);
  }
  /**
   * Push any supported type onto the encoded stream
   *
   * @param {any} obj
   * @returns {boolean} true on success
   */
  pushAny(obj) {
    var typ = toType(obj);
    switch (typ) {
      case "Number":
        return this._pushNumber(obj);
      case "String":
        return this._pushString(obj);
      case "Boolean":
        return this._pushBoolean(obj);
      case "Object":
        return this._pushObject(obj);
      case "Array":
        return this._pushArray(this, obj);
      case "Uint8Array":
        return this._pushBuffer(this, Buffer2.isBuffer(obj) ? obj : Buffer2.from(obj));
      case "Null":
        return this._pushUInt8(NULL);
      case "Undefined":
        return this._pushUndefined(obj);
      case "Map":
        return this._pushMap(this, obj);
      case "Set":
        return this._pushSet(this, obj);
      case "URL":
        return this._pushUrl(this, obj);
      case "BigNumber":
        return this._pushBigNumber(this, obj);
      case "Date":
        return this._pushDate(this, obj);
      case "RegExp":
        return this._pushRegexp(this, obj);
      case "Symbol":
        switch (obj) {
          case SYMS.NULL:
            return this._pushObject(null);
          case SYMS.UNDEFINED:
            return this._pushUndefined(void 0);
          default:
            throw new Error("Unknown symbol: " + obj.toString());
        }
      default:
        throw new Error("Unknown type: " + typeof obj + ", " + (obj ? obj.toString() : ""));
    }
  }
  finalize() {
    if (this.offset === 0) {
      return null;
    }
    var result = this.result;
    var resultLength = this.resultLength;
    var resultMethod = this.resultMethod;
    var offset = this.offset;
    var size = 0;
    var i = 0;
    for (; i < offset; i++) {
      size += resultLength[i];
    }
    var res = Buffer2.allocUnsafe(size);
    var index2 = 0;
    var length = 0;
    for (i = 0; i < offset; i++) {
      length = resultLength[i];
      switch (resultMethod[i]) {
        case 0:
          result[i].copy(res, index2);
          break;
        case 1:
          res.writeUInt8(result[i], index2, true);
          break;
        case 2:
          res.writeUInt16BE(result[i], index2, true);
          break;
        case 3:
          res.writeUInt32BE(result[i], index2, true);
          break;
        case 4:
          res.writeDoubleBE(result[i], index2, true);
          break;
        case 5:
          res.write(result[i], index2, length, "utf8");
          break;
        default:
          throw new Error("unkown method");
      }
      index2 += length;
    }
    var tmp = res;
    this._reset();
    return tmp;
  }
  _reset() {
    this.result = [];
    this.resultMethod = [];
    this.resultLength = [];
    this.offset = 0;
  }
  /**
   * Encode the given value
   * @param {*} o
   * @returns {Buffer}
   */
  static encode(o) {
    const enc = new Encoder();
    const ret = enc.pushAny(o);
    if (!ret) {
      throw new Error("Failed to encode input");
    }
    return enc.finalize();
  }
}
var encoder = Encoder;
(function(exports) {
  exports.Diagnose = diagnose;
  exports.Decoder = decoder;
  exports.Encoder = encoder;
  exports.Simple = simple;
  exports.Tagged = tagged$1;
  exports.decodeAll = exports.Decoder.decodeAll;
  exports.decodeFirst = exports.Decoder.decodeFirst;
  exports.diagnose = exports.Diagnose.diagnose;
  exports.encode = exports.Encoder.encode;
  exports.decode = exports.Decoder.decode;
  exports.leveldb = {
    decode: exports.Decoder.decodeAll,
    encode: exports.Encoder.encode,
    buffer: true,
    name: "cbor"
  };
})(src$1);
const borc = /* @__PURE__ */ getDefaultExportFromCjs(src$1);
function hash(data) {
  return uint8ToBuf$1(sha256.create().update(new Uint8Array(data)).digest());
}
function hashValue(value2) {
  if (value2 instanceof borc.Tagged) {
    return hashValue(value2.value);
  } else if (typeof value2 === "string") {
    return hashString(value2);
  } else if (typeof value2 === "number") {
    return hash(lebEncode(value2));
  } else if (value2 instanceof ArrayBuffer || ArrayBuffer.isView(value2)) {
    return hash(value2);
  } else if (Array.isArray(value2)) {
    const vals = value2.map(hashValue);
    return hash(concat$1(...vals));
  } else if (value2 && typeof value2 === "object" && value2._isPrincipal) {
    return hash(value2.toUint8Array());
  } else if (typeof value2 === "object" && value2 !== null && typeof value2.toHash === "function") {
    return hashValue(value2.toHash());
  } else if (typeof value2 === "object") {
    return hashOfMap(value2);
  } else if (typeof value2 === "bigint") {
    return hash(lebEncode(value2));
  }
  throw Object.assign(new Error(`Attempt to hash a value of unsupported type: ${value2}`), {
    // include so logs/callers can understand the confusing value.
    // (when stringified in error message, prototype info is lost)
    value: value2
  });
}
const hashString = (value2) => {
  const encoded = new TextEncoder().encode(value2);
  return hash(encoded);
};
function requestIdOf(request2) {
  return hashOfMap(request2);
}
function hashOfMap(map2) {
  const hashed = Object.entries(map2).filter(([, value2]) => value2 !== void 0).map(([key, value2]) => {
    const hashedKey = hashString(key);
    const hashedValue = hashValue(value2);
    return [hashedKey, hashedValue];
  });
  const traversed = hashed;
  const sorted = traversed.sort(([k1], [k2]) => {
    return compare(k1, k2);
  });
  const concatenated = concat$1(...sorted.map((x) => concat$1(...x)));
  const result = hash(concatenated);
  return result;
}
var __rest$1 = globalThis && globalThis.__rest || function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
const domainSeparator$1 = new TextEncoder().encode("\nic-request");
class SignIdentity {
  /**
   * Get the principal represented by this identity. Normally should be a
   * `Principal.selfAuthenticating()`.
   */
  getPrincipal() {
    if (!this._principal) {
      this._principal = Principal$1.selfAuthenticating(new Uint8Array(this.getPublicKey().toDer()));
    }
    return this._principal;
  }
  /**
   * Transform a request into a signed version of the request. This is done last
   * after the transforms on the body of a request. The returned object can be
   * anything, but must be serializable to CBOR.
   * @param request - internet computer request to transform
   */
  async transformRequest(request2) {
    const { body } = request2, fields = __rest$1(request2, ["body"]);
    const requestId = requestIdOf(body);
    return Object.assign(Object.assign({}, fields), { body: {
      content: body,
      sender_pubkey: this.getPublicKey().toDer(),
      sender_sig: await this.sign(concat$1(domainSeparator$1, requestId))
    } });
  }
}
class AnonymousIdentity {
  getPrincipal() {
    return Principal$1.anonymous();
  }
  async transformRequest(request2) {
    return Object.assign(Object.assign({}, request2), { body: { content: request2.body } });
  }
}
var src = {};
var serializer$1 = {};
var value = {};
Object.defineProperty(value, "__esModule", { value: true });
const MAX_U64_NUMBER = 9007199254740992;
function _concat(a, ...args) {
  const newBuffer = new Uint8Array(a.byteLength + args.reduce((acc, b) => acc + b.byteLength, 0));
  newBuffer.set(new Uint8Array(a), 0);
  let i = a.byteLength;
  for (const b of args) {
    newBuffer.set(new Uint8Array(b), i);
    i += b.byteLength;
  }
  return newBuffer.buffer;
}
function _serializeValue(major, minor, value2) {
  value2 = value2.replace(/[^0-9a-fA-F]/g, "");
  const length = 2 ** (minor - 24);
  value2 = value2.slice(-length * 2).padStart(length * 2, "0");
  const bytes2 = [(major << 5) + minor].concat(value2.match(/../g).map((byte) => parseInt(byte, 16)));
  return new Uint8Array(bytes2).buffer;
}
function _serializeNumber(major, value2) {
  if (value2 < 24) {
    return new Uint8Array([(major << 5) + value2]).buffer;
  } else {
    const minor = value2 <= 255 ? 24 : value2 <= 65535 ? 25 : value2 <= 4294967295 ? 26 : 27;
    return _serializeValue(major, minor, value2.toString(16));
  }
}
function _serializeString(str) {
  const utf8 = [];
  for (let i = 0; i < str.length; i++) {
    let charcode = str.charCodeAt(i);
    if (charcode < 128) {
      utf8.push(charcode);
    } else if (charcode < 2048) {
      utf8.push(192 | charcode >> 6, 128 | charcode & 63);
    } else if (charcode < 55296 || charcode >= 57344) {
      utf8.push(224 | charcode >> 12, 128 | charcode >> 6 & 63, 128 | charcode & 63);
    } else {
      i++;
      charcode = (charcode & 1023) << 10 | str.charCodeAt(i) & 1023;
      utf8.push(240 | charcode >> 18, 128 | charcode >> 12 & 63, 128 | charcode >> 6 & 63, 128 | charcode & 63);
    }
  }
  return _concat(new Uint8Array(_serializeNumber(3, str.length)), new Uint8Array(utf8));
}
function tagged(tag, value2) {
  if (tag == 14277111) {
    return _concat(new Uint8Array([217, 217, 247]), value2);
  }
  if (tag < 24) {
    return _concat(new Uint8Array([(6 << 5) + tag]), value2);
  } else {
    const minor = tag <= 255 ? 24 : tag <= 65535 ? 25 : tag <= 4294967295 ? 26 : 27;
    const length = 2 ** (minor - 24);
    const value3 = tag.toString(16).slice(-length * 2).padStart(length * 2, "0");
    const bytes2 = [(6 << 5) + minor].concat(value3.match(/../g).map((byte) => parseInt(byte, 16)));
    return new Uint8Array(bytes2).buffer;
  }
}
value.tagged = tagged;
function raw(bytes2) {
  return new Uint8Array(bytes2).buffer;
}
value.raw = raw;
function uSmall(n) {
  if (isNaN(n)) {
    throw new RangeError("Invalid number.");
  }
  n = Math.min(Math.max(0, n), 23);
  const bytes2 = [(0 << 5) + n];
  return new Uint8Array(bytes2).buffer;
}
value.uSmall = uSmall;
function u8(u82, radix) {
  u82 = parseInt("" + u82, radix);
  if (isNaN(u82)) {
    throw new RangeError("Invalid number.");
  }
  u82 = Math.min(Math.max(0, u82), 255);
  u82 = u82.toString(16);
  return _serializeValue(0, 24, u82);
}
value.u8 = u8;
function u16(u162, radix) {
  u162 = parseInt("" + u162, radix);
  if (isNaN(u162)) {
    throw new RangeError("Invalid number.");
  }
  u162 = Math.min(Math.max(0, u162), 65535);
  u162 = u162.toString(16);
  return _serializeValue(0, 25, u162);
}
value.u16 = u16;
function u32(u322, radix) {
  u322 = parseInt("" + u322, radix);
  if (isNaN(u322)) {
    throw new RangeError("Invalid number.");
  }
  u322 = Math.min(Math.max(0, u322), 4294967295);
  u322 = u322.toString(16);
  return _serializeValue(0, 26, u322);
}
value.u32 = u32;
function u64$2(u642, radix) {
  if (typeof u642 == "string" && radix == 16) {
    if (u642.match(/[^0-9a-fA-F]/)) {
      throw new RangeError("Invalid number.");
    }
    return _serializeValue(0, 27, u642);
  }
  u642 = parseInt("" + u642, radix);
  if (isNaN(u642)) {
    throw new RangeError("Invalid number.");
  }
  u642 = Math.min(Math.max(0, u642), MAX_U64_NUMBER);
  u642 = u642.toString(16);
  return _serializeValue(0, 27, u642);
}
value.u64 = u64$2;
function iSmall(n) {
  if (isNaN(n)) {
    throw new RangeError("Invalid number.");
  }
  if (n === 0) {
    return uSmall(0);
  }
  n = Math.min(Math.max(0, -n), 24) - 1;
  const bytes2 = [(1 << 5) + n];
  return new Uint8Array(bytes2).buffer;
}
value.iSmall = iSmall;
function i8(i82, radix) {
  i82 = parseInt("" + i82, radix);
  if (isNaN(i82)) {
    throw new RangeError("Invalid number.");
  }
  i82 = Math.min(Math.max(0, -i82 - 1), 255);
  i82 = i82.toString(16);
  return _serializeValue(1, 24, i82);
}
value.i8 = i8;
function i16(i162, radix) {
  i162 = parseInt("" + i162, radix);
  if (isNaN(i162)) {
    throw new RangeError("Invalid number.");
  }
  i162 = Math.min(Math.max(0, -i162 - 1), 65535);
  i162 = i162.toString(16);
  return _serializeValue(1, 25, i162);
}
value.i16 = i16;
function i32(i322, radix) {
  i322 = parseInt("" + i322, radix);
  if (isNaN(i322)) {
    throw new RangeError("Invalid number.");
  }
  i322 = Math.min(Math.max(0, -i322 - 1), 4294967295);
  i322 = i322.toString(16);
  return _serializeValue(1, 26, i322);
}
value.i32 = i32;
function i64(i642, radix) {
  if (typeof i642 == "string" && radix == 16) {
    if (i642.startsWith("-")) {
      i642 = i642.slice(1);
    } else {
      i642 = "0";
    }
    if (i642.match(/[^0-9a-fA-F]/) || i642.length > 16) {
      throw new RangeError("Invalid number.");
    }
    let done = false;
    let newI64 = i642.split("").reduceRight((acc, x) => {
      if (done) {
        return x + acc;
      }
      let n = parseInt(x, 16) - 1;
      if (n >= 0) {
        done = true;
        return n.toString(16) + acc;
      } else {
        return "f" + acc;
      }
    }, "");
    if (!done) {
      return u64$2(0);
    }
    return _serializeValue(1, 27, newI64);
  }
  i642 = parseInt("" + i642, radix);
  if (isNaN(i642)) {
    throw new RangeError("Invalid number.");
  }
  i642 = Math.min(Math.max(0, -i642 - 1), 9007199254740992);
  i642 = i642.toString(16);
  return _serializeValue(1, 27, i642);
}
value.i64 = i64;
function number(n) {
  if (n >= 0) {
    if (n < 24) {
      return uSmall(n);
    } else if (n <= 255) {
      return u8(n);
    } else if (n <= 65535) {
      return u16(n);
    } else if (n <= 4294967295) {
      return u32(n);
    } else {
      return u64$2(n);
    }
  } else {
    if (n >= -24) {
      return iSmall(n);
    } else if (n >= -255) {
      return i8(n);
    } else if (n >= -65535) {
      return i16(n);
    } else if (n >= -4294967295) {
      return i32(n);
    } else {
      return i64(n);
    }
  }
}
value.number = number;
function bytes(bytes2) {
  return _concat(_serializeNumber(2, bytes2.byteLength), bytes2);
}
value.bytes = bytes;
function string(str) {
  return _serializeString(str);
}
value.string = string;
function array(items) {
  return _concat(_serializeNumber(4, items.length), ...items);
}
value.array = array;
function map(items, stable = false) {
  if (!(items instanceof Map)) {
    items = new Map(Object.entries(items));
  }
  let entries = Array.from(items.entries());
  if (stable) {
    entries = entries.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
  }
  return _concat(_serializeNumber(5, items.size), ...entries.map(([k, v]) => _concat(_serializeString(k), v)));
}
value.map = map;
function singleFloat(f) {
  const single = new Float32Array([f]);
  return _concat(new Uint8Array([(7 << 5) + 26]), new Uint8Array(single.buffer));
}
value.singleFloat = singleFloat;
function doubleFloat(f) {
  const single = new Float64Array([f]);
  return _concat(new Uint8Array([(7 << 5) + 27]), new Uint8Array(single.buffer));
}
value.doubleFloat = doubleFloat;
function bool(v) {
  return v ? true_() : false_();
}
value.bool = bool;
function true_() {
  return raw(new Uint8Array([(7 << 5) + 21]));
}
value.true_ = true_;
function false_() {
  return raw(new Uint8Array([(7 << 5) + 20]));
}
value.false_ = false_;
function null_() {
  return raw(new Uint8Array([(7 << 5) + 22]));
}
value.null_ = null_;
function undefined_() {
  return raw(new Uint8Array([(7 << 5) + 23]));
}
value.undefined_ = undefined_;
var __importStar = commonjsGlobal && commonjsGlobal.__importStar || function(mod2) {
  if (mod2 && mod2.__esModule)
    return mod2;
  var result = {};
  if (mod2 != null) {
    for (var k in mod2)
      if (Object.hasOwnProperty.call(mod2, k))
        result[k] = mod2[k];
  }
  result["default"] = mod2;
  return result;
};
Object.defineProperty(serializer$1, "__esModule", { value: true });
const cbor = __importStar(value);
const BufferClasses = [
  ArrayBuffer,
  Uint8Array,
  Uint16Array,
  Uint32Array,
  Int8Array,
  Int16Array,
  Int32Array,
  Float32Array,
  Float64Array
];
class JsonDefaultCborEncoder {
  // @param _serializer The CBOR Serializer to use.
  // @param _stable Whether or not keys from objects should be sorted (stable). This is
  //     particularly useful when testing encodings between JSON objects.
  constructor(_serializer, _stable = false) {
    this._serializer = _serializer;
    this._stable = _stable;
    this.name = "jsonDefault";
    this.priority = -100;
  }
  match(value2) {
    return ["undefined", "boolean", "number", "string", "object"].indexOf(typeof value2) != -1;
  }
  encode(value2) {
    switch (typeof value2) {
      case "undefined":
        return cbor.undefined_();
      case "boolean":
        return cbor.bool(value2);
      case "number":
        if (Math.floor(value2) === value2) {
          return cbor.number(value2);
        } else {
          return cbor.doubleFloat(value2);
        }
      case "string":
        return cbor.string(value2);
      case "object":
        if (value2 === null) {
          return cbor.null_();
        } else if (Array.isArray(value2)) {
          return cbor.array(value2.map((x) => this._serializer.serializeValue(x)));
        } else if (BufferClasses.find((x) => value2 instanceof x)) {
          return cbor.bytes(value2.buffer);
        } else if (Object.getOwnPropertyNames(value2).indexOf("toJSON") !== -1) {
          return this.encode(value2.toJSON());
        } else if (value2 instanceof Map) {
          const m = /* @__PURE__ */ new Map();
          for (const [key, item] of value2.entries()) {
            m.set(key, this._serializer.serializeValue(item));
          }
          return cbor.map(m, this._stable);
        } else {
          const m = /* @__PURE__ */ new Map();
          for (const [key, item] of Object.entries(value2)) {
            m.set(key, this._serializer.serializeValue(item));
          }
          return cbor.map(m, this._stable);
        }
      default:
        throw new Error("Invalid value.");
    }
  }
}
serializer$1.JsonDefaultCborEncoder = JsonDefaultCborEncoder;
class ToCborEncoder {
  constructor() {
    this.name = "cborEncoder";
    this.priority = -90;
  }
  match(value2) {
    return typeof value2 == "object" && typeof value2["toCBOR"] == "function";
  }
  encode(value2) {
    return value2.toCBOR();
  }
}
serializer$1.ToCborEncoder = ToCborEncoder;
class CborSerializer {
  constructor() {
    this._encoders = /* @__PURE__ */ new Set();
  }
  static withDefaultEncoders(stable = false) {
    const s = new this();
    s.addEncoder(new JsonDefaultCborEncoder(s, stable));
    s.addEncoder(new ToCborEncoder());
    return s;
  }
  removeEncoder(name) {
    for (const encoder2 of this._encoders.values()) {
      if (encoder2.name == name) {
        this._encoders.delete(encoder2);
      }
    }
  }
  addEncoder(encoder2) {
    this._encoders.add(encoder2);
  }
  getEncoderFor(value2) {
    let chosenEncoder = null;
    for (const encoder2 of this._encoders) {
      if (!chosenEncoder || encoder2.priority > chosenEncoder.priority) {
        if (encoder2.match(value2)) {
          chosenEncoder = encoder2;
        }
      }
    }
    if (chosenEncoder === null) {
      throw new Error("Could not find an encoder for value.");
    }
    return chosenEncoder;
  }
  serializeValue(value2) {
    return this.getEncoderFor(value2).encode(value2);
  }
  serialize(value2) {
    return this.serializeValue(value2);
  }
}
serializer$1.CborSerializer = CborSerializer;
class SelfDescribeCborSerializer extends CborSerializer {
  serialize(value2) {
    return cbor.raw(new Uint8Array([
      // Self describe CBOR.
      ...new Uint8Array([217, 217, 247]),
      ...new Uint8Array(super.serializeValue(value2))
    ]));
  }
}
serializer$1.SelfDescribeCborSerializer = SelfDescribeCborSerializer;
(function(exports) {
  function __export(m) {
    for (var p in m)
      if (!exports.hasOwnProperty(p))
        exports[p] = m[p];
  }
  var __importStar2 = commonjsGlobal && commonjsGlobal.__importStar || function(mod2) {
    if (mod2 && mod2.__esModule)
      return mod2;
    var result = {};
    if (mod2 != null) {
      for (var k in mod2)
        if (Object.hasOwnProperty.call(mod2, k))
          result[k] = mod2[k];
    }
    result["default"] = mod2;
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  __export(serializer$1);
  const value$1 = __importStar2(value);
  exports.value = value$1;
})(src);
class PrincipalEncoder {
  get name() {
    return "Principal";
  }
  get priority() {
    return 0;
  }
  match(value2) {
    return value2 && value2._isPrincipal === true;
  }
  encode(v) {
    return src.value.bytes(v.toUint8Array());
  }
}
class BufferEncoder {
  get name() {
    return "Buffer";
  }
  get priority() {
    return 1;
  }
  match(value2) {
    return value2 instanceof ArrayBuffer || ArrayBuffer.isView(value2);
  }
  encode(v) {
    return src.value.bytes(new Uint8Array(v));
  }
}
class BigIntEncoder {
  get name() {
    return "BigInt";
  }
  get priority() {
    return 1;
  }
  match(value2) {
    return typeof value2 === `bigint`;
  }
  encode(v) {
    if (v > BigInt(0)) {
      return src.value.tagged(2, src.value.bytes(fromHex(v.toString(16))));
    } else {
      return src.value.tagged(3, src.value.bytes(fromHex((BigInt("-1") * v).toString(16))));
    }
  }
}
const serializer = src.SelfDescribeCborSerializer.withDefaultEncoders(true);
serializer.addEncoder(new PrincipalEncoder());
serializer.addEncoder(new BufferEncoder());
serializer.addEncoder(new BigIntEncoder());
var CborTag;
(function(CborTag2) {
  CborTag2[CborTag2["Uint64LittleEndian"] = 71] = "Uint64LittleEndian";
  CborTag2[CborTag2["Semantic"] = 55799] = "Semantic";
})(CborTag || (CborTag = {}));
function encode(value2) {
  return serializer.serialize(value2);
}
function decodePositiveBigInt(buf) {
  const len = buf.byteLength;
  let res = BigInt(0);
  for (let i = 0; i < len; i++) {
    res = res * BigInt(256) + BigInt(buf[i]);
  }
  return res;
}
class Uint8ArrayDecoder extends borc.Decoder {
  createByteString(raw2) {
    return concat$1(...raw2);
  }
  createByteStringFromHeap(start, end) {
    if (start === end) {
      return new ArrayBuffer(0);
    }
    return new Uint8Array(this._heap.slice(start, end));
  }
}
function decode(input) {
  const buffer2 = new Uint8Array(input);
  const decoder2 = new Uint8ArrayDecoder({
    size: buffer2.byteLength,
    tags: {
      // Override tags 2 and 3 for BigInt support (borc supports only BigNumber).
      2: (val) => decodePositiveBigInt(val),
      3: (val) => -decodePositiveBigInt(val),
      [CborTag.Semantic]: (value2) => value2
    }
  });
  try {
    return decoder2.decodeFirst(buffer2);
  } catch (e) {
    throw new Error(`Failed to decode CBOR: ${e}, input: ${toHex(buffer2)}`);
  }
}
const randomNumber = () => {
  if (typeof window !== "undefined" && !!window.crypto && !!window.crypto.getRandomValues) {
    const array2 = new Uint32Array(1);
    window.crypto.getRandomValues(array2);
    return array2[0];
  }
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array2 = new Uint32Array(1);
    crypto.getRandomValues(array2);
    return array2[0];
  }
  if (typeof crypto !== "undefined" && crypto.randomInt) {
    return crypto.randomInt(0, 4294967295);
  }
  return Math.floor(Math.random() * 4294967295);
};
var SubmitRequestType;
(function(SubmitRequestType2) {
  SubmitRequestType2["Call"] = "call";
})(SubmitRequestType || (SubmitRequestType = {}));
function makeNonce() {
  const buffer2 = new ArrayBuffer(16);
  const view = new DataView(buffer2);
  const rand1 = randomNumber();
  const rand2 = randomNumber();
  const rand3 = randomNumber();
  const rand4 = randomNumber();
  view.setUint32(0, rand1);
  view.setUint32(4, rand2);
  view.setUint32(8, rand3);
  view.setUint32(12, rand4);
  return buffer2;
}
const NANOSECONDS_PER_MILLISECONDS = BigInt(1e6);
const REPLICA_PERMITTED_DRIFT_MILLISECONDS = 60 * 1e3;
class Expiry {
  constructor(deltaInMSec) {
    if (deltaInMSec < 90 * 1e3) {
      const raw_value2 = BigInt(Date.now() + deltaInMSec) * NANOSECONDS_PER_MILLISECONDS;
      const ingress_as_seconds2 = raw_value2 / BigInt(1e9);
      this._value = ingress_as_seconds2 * BigInt(1e9);
      return;
    }
    const raw_value = BigInt(Math.floor(Date.now() + deltaInMSec - REPLICA_PERMITTED_DRIFT_MILLISECONDS)) * NANOSECONDS_PER_MILLISECONDS;
    const ingress_as_seconds = raw_value / BigInt(1e9);
    const ingress_as_minutes = ingress_as_seconds / BigInt(60);
    const rounded_down_nanos = ingress_as_minutes * BigInt(60) * BigInt(1e9);
    this._value = rounded_down_nanos;
  }
  toCBOR() {
    return src.value.u64(this._value.toString(16), 16);
  }
  toHash() {
    return lebEncode(this._value);
  }
}
function makeNonceTransform(nonceFn = makeNonce) {
  return async (request2) => {
    const headers = request2.request.headers;
    request2.request.headers = headers;
    if (request2.endpoint === "call") {
      request2.body.nonce = nonceFn();
    }
  };
}
function httpHeadersTransform(headers) {
  const headerFields = [];
  headers.forEach((value2, key) => {
    headerFields.push([key, value2]);
  });
  return headerFields;
}
class AgentHTTPResponseError extends AgentError {
  constructor(message, response) {
    super(message);
    this.response = response;
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
class AgentCallError extends AgentError {
  constructor(message, response, requestId, senderPubkey, senderSig, ingressExpiry) {
    super(message);
    this.response = response;
    this.requestId = requestId;
    this.senderPubkey = senderPubkey;
    this.senderSig = senderSig;
    this.ingressExpiry = ingressExpiry;
    this.name = "AgentCallError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
class AgentQueryError extends AgentError {
  constructor(message, response, requestId, senderPubkey, senderSig, ingressExpiry) {
    super(message);
    this.response = response;
    this.requestId = requestId;
    this.senderPubkey = senderPubkey;
    this.senderSig = senderSig;
    this.ingressExpiry = ingressExpiry;
    this.name = "AgentQueryError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
class AgentReadStateError extends AgentError {
  constructor(message, response, requestId, senderPubkey, senderSig, ingressExpiry) {
    super(message);
    this.response = response;
    this.requestId = requestId;
    this.senderPubkey = senderPubkey;
    this.senderSig = senderSig;
    this.ingressExpiry = ingressExpiry;
    this.name = "AgentReadStateError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n$7 = /* @__PURE__ */ BigInt(0);
const _1n$8 = /* @__PURE__ */ BigInt(1);
const _2n$7 = /* @__PURE__ */ BigInt(2);
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function abytes(item) {
  if (!isBytes(item))
    throw new Error("Uint8Array expected");
}
function abool(title, value2) {
  if (typeof value2 !== "boolean")
    throw new Error(title + " boolean expected, got " + value2);
}
const hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
function bytesToHex(bytes2) {
  abytes(bytes2);
  let hex = "";
  for (let i = 0; i < bytes2.length; i++) {
    hex += hexes[bytes2[i]];
  }
  return hex;
}
function hexToNumber(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  return hex === "" ? _0n$7 : BigInt("0x" + hex);
}
const asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function asciiToBase16(ch) {
  if (ch >= asciis._0 && ch <= asciis._9)
    return ch - asciis._0;
  if (ch >= asciis.A && ch <= asciis.F)
    return ch - (asciis.A - 10);
  if (ch >= asciis.a && ch <= asciis.f)
    return ch - (asciis.a - 10);
  return;
}
function hexToBytes(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array2 = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array2[ai] = n1 * 16 + n2;
  }
  return array2;
}
function bytesToNumberBE(bytes2) {
  return hexToNumber(bytesToHex(bytes2));
}
function bytesToNumberLE(bytes2) {
  abytes(bytes2);
  return hexToNumber(bytesToHex(Uint8Array.from(bytes2).reverse()));
}
function numberToBytesBE(n, len) {
  return hexToBytes(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === "string") {
    try {
      res = hexToBytes(hex);
    } catch (e) {
      throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
    }
  } else if (isBytes(hex)) {
    res = Uint8Array.from(hex);
  } else {
    throw new Error(title + " must be hex string or Uint8Array");
  }
  const len = res.length;
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(title + " of length " + expectedLength + " expected, got " + len);
  return res;
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
const isPosBig = (n) => typeof n === "bigint" && _0n$7 <= n;
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max))
    throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
function bitLen(n) {
  let len;
  for (len = 0; n > _0n$7; n >>= _1n$8, len += 1)
    ;
  return len;
}
function bitGet(n, pos) {
  return n >> BigInt(pos) & _1n$8;
}
const bitMask = (n) => (_2n$7 << BigInt(n - 1)) - _1n$8;
const validatorFns = {
  bigint: (val) => typeof val === "bigint",
  function: (val) => typeof val === "function",
  boolean: (val) => typeof val === "boolean",
  string: (val) => typeof val === "string",
  stringOrUint8Array: (val) => typeof val === "string" || isBytes(val),
  isSafeInteger: (val) => Number.isSafeInteger(val),
  array: (val) => Array.isArray(val),
  field: (val, object) => object.Fp.isValid(val),
  hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
};
function validateObject(object, validators, optValidators = {}) {
  const checkField = (fieldName, type, isOptional) => {
    const checkVal = validatorFns[type];
    if (typeof checkVal !== "function")
      throw new Error("invalid validator function");
    const val = object[fieldName];
    if (isOptional && val === void 0)
      return;
    if (!checkVal(val, object)) {
      throw new Error("param " + String(fieldName) + " is invalid. Expected " + type + ", got " + val);
    }
  };
  for (const [fieldName, type] of Object.entries(validators))
    checkField(fieldName, type, false);
  for (const [fieldName, type] of Object.entries(optValidators))
    checkField(fieldName, type, true);
  return object;
}
const notImplemented = () => {
  throw new Error("not implemented");
};
function memoized(fn) {
  const map2 = /* @__PURE__ */ new WeakMap();
  return (arg, ...args) => {
    const val = map2.get(arg);
    if (val !== void 0)
      return val;
    const computed = fn(arg, ...args);
    map2.set(arg, computed);
    return computed;
  };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n$6 = BigInt(0), _1n$7 = BigInt(1), _2n$6 = /* @__PURE__ */ BigInt(2), _3n$4 = /* @__PURE__ */ BigInt(3);
const _4n$2 = /* @__PURE__ */ BigInt(4), _5n$1 = /* @__PURE__ */ BigInt(5), _8n$2 = /* @__PURE__ */ BigInt(8);
function mod(a, b) {
  const result = a % b;
  return result >= _0n$6 ? result : b + result;
}
function pow(num, power, modulo) {
  if (power < _0n$6)
    throw new Error("invalid exponent, negatives unsupported");
  if (modulo <= _0n$6)
    throw new Error("invalid modulus");
  if (modulo === _1n$7)
    return _0n$6;
  let res = _1n$7;
  while (power > _0n$6) {
    if (power & _1n$7)
      res = res * num % modulo;
    num = num * num % modulo;
    power >>= _1n$7;
  }
  return res;
}
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n$6) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number2, modulo) {
  if (number2 === _0n$6)
    throw new Error("invert: expected non-zero number");
  if (modulo <= _0n$6)
    throw new Error("invert: expected positive modulus, got " + modulo);
  let a = mod(number2, modulo);
  let b = modulo;
  let x = _0n$6, u = _1n$7;
  while (a !== _0n$6) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    b = a, a = r, x = u, u = m;
  }
  const gcd = b;
  if (gcd !== _1n$7)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function tonelliShanks(P) {
  const legendreC = (P - _1n$7) / _2n$6;
  let Q, S, Z;
  for (Q = P - _1n$7, S = 0; Q % _2n$6 === _0n$6; Q /= _2n$6, S++)
    ;
  for (Z = _2n$6; Z < P && pow(Z, legendreC, P) !== P - _1n$7; Z++) {
    if (Z > 1e3)
      throw new Error("Cannot find square root: likely non-prime P");
  }
  if (S === 1) {
    const p1div4 = (P + _1n$7) / _4n$2;
    return function tonelliFast(Fp3, n) {
      const root = Fp3.pow(n, p1div4);
      if (!Fp3.eql(Fp3.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  const Q1div2 = (Q + _1n$7) / _2n$6;
  return function tonelliSlow(Fp3, n) {
    if (Fp3.pow(n, legendreC) === Fp3.neg(Fp3.ONE))
      throw new Error("Cannot find square root");
    let r = S;
    let g = Fp3.pow(Fp3.mul(Fp3.ONE, Z), Q);
    let x = Fp3.pow(n, Q1div2);
    let b = Fp3.pow(n, Q);
    while (!Fp3.eql(b, Fp3.ONE)) {
      if (Fp3.eql(b, Fp3.ZERO))
        return Fp3.ZERO;
      let m = 1;
      for (let t2 = Fp3.sqr(b); m < r; m++) {
        if (Fp3.eql(t2, Fp3.ONE))
          break;
        t2 = Fp3.sqr(t2);
      }
      const ge = Fp3.pow(g, _1n$7 << BigInt(r - m - 1));
      g = Fp3.sqr(ge);
      x = Fp3.mul(x, ge);
      b = Fp3.mul(b, g);
      r = m;
    }
    return x;
  };
}
function FpSqrt(P) {
  if (P % _4n$2 === _3n$4) {
    const p1div4 = (P + _1n$7) / _4n$2;
    return function sqrt3mod4(Fp3, n) {
      const root = Fp3.pow(n, p1div4);
      if (!Fp3.eql(Fp3.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  if (P % _8n$2 === _5n$1) {
    const c1 = (P - _5n$1) / _8n$2;
    return function sqrt5mod8(Fp3, n) {
      const n2 = Fp3.mul(n, _2n$6);
      const v = Fp3.pow(n2, c1);
      const nv = Fp3.mul(n, v);
      const i = Fp3.mul(Fp3.mul(nv, _2n$6), v);
      const root = Fp3.mul(nv, Fp3.sub(i, Fp3.ONE));
      if (!Fp3.eql(Fp3.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  return tonelliShanks(P);
}
const isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n$7) === _1n$7;
const FIELD_FIELDS = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function validateField(field) {
  const initial = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "isSafeInteger",
    BITS: "isSafeInteger"
  };
  const opts = FIELD_FIELDS.reduce((map2, val) => {
    map2[val] = "function";
    return map2;
  }, initial);
  return validateObject(field, opts);
}
function FpPow(f, num, power) {
  if (power < _0n$6)
    throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n$6)
    return f.ONE;
  if (power === _1n$7)
    return num;
  let p = f.ONE;
  let d = num;
  while (power > _0n$6) {
    if (power & _1n$7)
      p = f.mul(p, d);
    d = f.sqr(d);
    power >>= _1n$7;
  }
  return p;
}
function FpInvertBatch(f, nums) {
  const tmp = new Array(nums.length);
  const lastMultiplied = nums.reduce((acc, num, i) => {
    if (f.is0(num))
      return acc;
    tmp[i] = acc;
    return f.mul(acc, num);
  }, f.ONE);
  const inverted = f.inv(lastMultiplied);
  nums.reduceRight((acc, num, i) => {
    if (f.is0(num))
      return acc;
    tmp[i] = f.mul(acc, tmp[i]);
    return f.mul(acc, num);
  }, inverted);
  return tmp;
}
function FpLegendre(order) {
  const legendreConst = (order - _1n$7) / _2n$6;
  return (f, x) => f.pow(x, legendreConst);
}
function nLength(n, nBitLength) {
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
function Field(ORDER, bitLen2, isLE = false, redef = {}) {
  if (ORDER <= _0n$6)
    throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
  const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen2);
  if (BYTES > 2048)
    throw new Error("invalid field: expected ORDER of <= 2048 bytes");
  let sqrtP;
  const f = Object.freeze({
    ORDER,
    isLE,
    BITS,
    BYTES,
    MASK: bitMask(BITS),
    ZERO: _0n$6,
    ONE: _1n$7,
    create: (num) => mod(num, ORDER),
    isValid: (num) => {
      if (typeof num !== "bigint")
        throw new Error("invalid field element: expected bigint, got " + typeof num);
      return _0n$6 <= num && num < ORDER;
    },
    is0: (num) => num === _0n$6,
    isOdd: (num) => (num & _1n$7) === _1n$7,
    neg: (num) => mod(-num, ORDER),
    eql: (lhs, rhs) => lhs === rhs,
    sqr: (num) => mod(num * num, ORDER),
    add: (lhs, rhs) => mod(lhs + rhs, ORDER),
    sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
    mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
    pow: (num, power) => FpPow(f, num, power),
    div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
    // Same as above, but doesn't normalize
    sqrN: (num) => num * num,
    addN: (lhs, rhs) => lhs + rhs,
    subN: (lhs, rhs) => lhs - rhs,
    mulN: (lhs, rhs) => lhs * rhs,
    inv: (num) => invert(num, ORDER),
    sqrt: redef.sqrt || ((n) => {
      if (!sqrtP)
        sqrtP = FpSqrt(ORDER);
      return sqrtP(f, n);
    }),
    invertBatch: (lst) => FpInvertBatch(f, lst),
    // TODO: do we really need constant cmov?
    // We don't have const-time bigints anyway, so probably will be not very useful
    cmov: (a, b, c2) => c2 ? b : a,
    toBytes: (num) => isLE ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
    fromBytes: (bytes2) => {
      if (bytes2.length !== BYTES)
        throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes2.length);
      return isLE ? bytesToNumberLE(bytes2) : bytesToNumberBE(bytes2);
    }
  });
  return Object.freeze(f);
}
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint")
    throw new Error("field order must be bigint");
  const bitLength = fieldOrder.toString(2).length;
  return Math.ceil(bitLength / 8);
}
function getMinHashLength(fieldOrder) {
  const length = getFieldBytesLength(fieldOrder);
  return length + Math.ceil(length / 2);
}
function mapHashToField(key, fieldOrder, isLE = false) {
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  if (len < 16 || len < minLen || len > 1024)
    throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
  const num = isLE ? bytesToNumberLE(key) : bytesToNumberBE(key);
  const reduced = mod(num, fieldOrder - _1n$7) + _1n$7;
  return isLE ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}
const os2ip = bytesToNumberBE;
function i2osp(value2, length) {
  anum(value2);
  anum(length);
  if (value2 < 0 || value2 >= 1 << 8 * length)
    throw new Error("invalid I2OSP input: " + value2);
  const res = Array.from({ length }).fill(0);
  for (let i = length - 1; i >= 0; i--) {
    res[i] = value2 & 255;
    value2 >>>= 8;
  }
  return new Uint8Array(res);
}
function strxor(a, b) {
  const arr = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) {
    arr[i] = a[i] ^ b[i];
  }
  return arr;
}
function anum(item) {
  if (!Number.isSafeInteger(item))
    throw new Error("number expected");
}
function expand_message_xmd(msg, DST, lenInBytes, H) {
  abytes(msg);
  abytes(DST);
  anum(lenInBytes);
  if (DST.length > 255)
    DST = H(concatBytes(utf8ToBytes("H2C-OVERSIZE-DST-"), DST));
  const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
  const ell = Math.ceil(lenInBytes / b_in_bytes);
  if (lenInBytes > 65535 || ell > 255)
    throw new Error("expand_message_xmd: invalid lenInBytes");
  const DST_prime = concatBytes(DST, i2osp(DST.length, 1));
  const Z_pad = i2osp(0, r_in_bytes);
  const l_i_b_str = i2osp(lenInBytes, 2);
  const b = new Array(ell);
  const b_0 = H(concatBytes(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
  b[0] = H(concatBytes(b_0, i2osp(1, 1), DST_prime));
  for (let i = 1; i <= ell; i++) {
    const args = [strxor(b_0, b[i - 1]), i2osp(i + 1, 1), DST_prime];
    b[i] = H(concatBytes(...args));
  }
  const pseudo_random_bytes = concatBytes(...b);
  return pseudo_random_bytes.slice(0, lenInBytes);
}
function expand_message_xof(msg, DST, lenInBytes, k, H) {
  abytes(msg);
  abytes(DST);
  anum(lenInBytes);
  if (DST.length > 255) {
    const dkLen = Math.ceil(2 * k / 8);
    DST = H.create({ dkLen }).update(utf8ToBytes("H2C-OVERSIZE-DST-")).update(DST).digest();
  }
  if (lenInBytes > 65535 || DST.length > 255)
    throw new Error("expand_message_xof: invalid lenInBytes");
  return H.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
}
function hash_to_field(msg, count, options) {
  validateObject(options, {
    DST: "stringOrUint8Array",
    p: "bigint",
    m: "isSafeInteger",
    k: "isSafeInteger",
    hash: "hash"
  });
  const { p, k, m, hash: hash2, expand, DST: _DST } = options;
  abytes(msg);
  anum(count);
  const DST = typeof _DST === "string" ? utf8ToBytes(_DST) : _DST;
  const log2p = p.toString(2).length;
  const L = Math.ceil((log2p + k) / 8);
  const len_in_bytes = count * m * L;
  let prb;
  if (expand === "xmd") {
    prb = expand_message_xmd(msg, DST, len_in_bytes, hash2);
  } else if (expand === "xof") {
    prb = expand_message_xof(msg, DST, len_in_bytes, k, hash2);
  } else if (expand === "_internal_pass") {
    prb = msg;
  } else {
    throw new Error('expand must be "xmd" or "xof"');
  }
  const u = new Array(count);
  for (let i = 0; i < count; i++) {
    const e = new Array(m);
    for (let j = 0; j < m; j++) {
      const elm_offset = L * (j + i * m);
      const tv = prb.subarray(elm_offset, elm_offset + L);
      e[j] = mod(os2ip(tv), p);
    }
    u[i] = e;
  }
  return u;
}
function isogenyMap(field, map2) {
  const COEFF = map2.map((i) => Array.from(i).reverse());
  return (x, y) => {
    const [xNum, xDen, yNum, yDen] = COEFF.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
    x = field.div(xNum, xDen);
    y = field.mul(y, field.div(yNum, yDen));
    return { x, y };
  };
}
function createHasher(Point, mapToCurve, def) {
  if (typeof mapToCurve !== "function")
    throw new Error("mapToCurve() must be defined");
  return {
    // Encodes byte string to elliptic curve.
    // hash_to_curve from https://www.rfc-editor.org/rfc/rfc9380#section-3
    hashToCurve(msg, options) {
      const u = hash_to_field(msg, 2, { ...def, DST: def.DST, ...options });
      const u0 = Point.fromAffine(mapToCurve(u[0]));
      const u1 = Point.fromAffine(mapToCurve(u[1]));
      const P = u0.add(u1).clearCofactor();
      P.assertValidity();
      return P;
    },
    // Encodes byte string to elliptic curve.
    // encode_to_curve from https://www.rfc-editor.org/rfc/rfc9380#section-3
    encodeToCurve(msg, options) {
      const u = hash_to_field(msg, 1, { ...def, DST: def.encodeDST, ...options });
      const P = Point.fromAffine(mapToCurve(u[0])).clearCofactor();
      P.assertValidity();
      return P;
    },
    // Same as encodeToCurve, but without hash
    mapToCurve(scalars) {
      if (!Array.isArray(scalars))
        throw new Error("mapToCurve: expected array of bigints");
      for (const i of scalars)
        if (typeof i !== "bigint")
          throw new Error("mapToCurve: expected array of bigints");
      const P = Point.fromAffine(mapToCurve(scalars)).clearCofactor();
      P.assertValidity();
      return P;
    }
  };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n$5 = BigInt(0);
const _1n$6 = BigInt(1);
function constTimeNegate(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
function validateW(W, bits) {
  if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
    throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
}
function calcWOpts(W, bits) {
  validateW(W, bits);
  const windows = Math.ceil(bits / W) + 1;
  const windowSize = 2 ** (W - 1);
  return { windows, windowSize };
}
function validateMSMPoints(points, c2) {
  if (!Array.isArray(points))
    throw new Error("array expected");
  points.forEach((p, i) => {
    if (!(p instanceof c2))
      throw new Error("invalid point at index " + i);
  });
}
function validateMSMScalars(scalars, field) {
  if (!Array.isArray(scalars))
    throw new Error("array of scalars expected");
  scalars.forEach((s, i) => {
    if (!field.isValid(s))
      throw new Error("invalid scalar at index " + i);
  });
}
const pointPrecomputes = /* @__PURE__ */ new WeakMap();
const pointWindowSizes = /* @__PURE__ */ new WeakMap();
function getW(P) {
  return pointWindowSizes.get(P) || 1;
}
function wNAF(c2, bits) {
  return {
    constTimeNegate,
    hasPrecomputes(elm) {
      return getW(elm) !== 1;
    },
    // non-const time multiplication ladder
    unsafeLadder(elm, n, p = c2.ZERO) {
      let d = elm;
      while (n > _0n$5) {
        if (n & _1n$6)
          p = p.add(d);
        d = d.double();
        n >>= _1n$6;
      }
      return p;
    },
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @param elm Point instance
     * @param W window size
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(elm, W) {
      const { windows, windowSize } = calcWOpts(W, bits);
      const points = [];
      let p = elm;
      let base = p;
      for (let window2 = 0; window2 < windows; window2++) {
        base = p;
        points.push(base);
        for (let i = 1; i < windowSize; i++) {
          base = base.add(p);
          points.push(base);
        }
        p = base.double();
      }
      return points;
    },
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @returns real and fake (for const-time) points
     */
    wNAF(W, precomputes, n) {
      const { windows, windowSize } = calcWOpts(W, bits);
      let p = c2.ZERO;
      let f = c2.BASE;
      const mask = BigInt(2 ** W - 1);
      const maxNumber = 2 ** W;
      const shiftBy = BigInt(W);
      for (let window2 = 0; window2 < windows; window2++) {
        const offset = window2 * windowSize;
        let wbits = Number(n & mask);
        n >>= shiftBy;
        if (wbits > windowSize) {
          wbits -= maxNumber;
          n += _1n$6;
        }
        const offset1 = offset;
        const offset2 = offset + Math.abs(wbits) - 1;
        const cond1 = window2 % 2 !== 0;
        const cond2 = wbits < 0;
        if (wbits === 0) {
          f = f.add(constTimeNegate(cond1, precomputes[offset1]));
        } else {
          p = p.add(constTimeNegate(cond2, precomputes[offset2]));
        }
      }
      return { p, f };
    },
    /**
     * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @param acc accumulator point to add result of multiplication
     * @returns point
     */
    wNAFUnsafe(W, precomputes, n, acc = c2.ZERO) {
      const { windows, windowSize } = calcWOpts(W, bits);
      const mask = BigInt(2 ** W - 1);
      const maxNumber = 2 ** W;
      const shiftBy = BigInt(W);
      for (let window2 = 0; window2 < windows; window2++) {
        const offset = window2 * windowSize;
        if (n === _0n$5)
          break;
        let wbits = Number(n & mask);
        n >>= shiftBy;
        if (wbits > windowSize) {
          wbits -= maxNumber;
          n += _1n$6;
        }
        if (wbits === 0)
          continue;
        let curr = precomputes[offset + Math.abs(wbits) - 1];
        if (wbits < 0)
          curr = curr.negate();
        acc = acc.add(curr);
      }
      return acc;
    },
    getPrecomputes(W, P, transform) {
      let comp = pointPrecomputes.get(P);
      if (!comp) {
        comp = this.precomputeWindow(P, W);
        if (W !== 1)
          pointPrecomputes.set(P, transform(comp));
      }
      return comp;
    },
    wNAFCached(P, n, transform) {
      const W = getW(P);
      return this.wNAF(W, this.getPrecomputes(W, P, transform), n);
    },
    wNAFCachedUnsafe(P, n, transform, prev) {
      const W = getW(P);
      if (W === 1)
        return this.unsafeLadder(P, n, prev);
      return this.wNAFUnsafe(W, this.getPrecomputes(W, P, transform), n, prev);
    },
    // We calculate precomputes for elliptic curve point multiplication
    // using windowed method. This specifies window size and
    // stores precomputed values. Usually only base point would be precomputed.
    setWindowSize(P, W) {
      validateW(W, bits);
      pointWindowSizes.set(P, W);
      pointPrecomputes.delete(P);
    }
  };
}
function pippenger(c2, fieldN, points, scalars) {
  validateMSMPoints(points, c2);
  validateMSMScalars(scalars, fieldN);
  if (points.length !== scalars.length)
    throw new Error("arrays of points and scalars must have equal length");
  const zero = c2.ZERO;
  const wbits = bitLen(BigInt(points.length));
  const windowSize = wbits > 12 ? wbits - 3 : wbits > 4 ? wbits - 2 : wbits ? 2 : 1;
  const MASK = (1 << windowSize) - 1;
  const buckets = new Array(MASK + 1).fill(zero);
  const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
  let sum = zero;
  for (let i = lastBits; i >= 0; i -= windowSize) {
    buckets.fill(zero);
    for (let j = 0; j < scalars.length; j++) {
      const scalar = scalars[j];
      const wbits2 = Number(scalar >> BigInt(i) & BigInt(MASK));
      buckets[wbits2] = buckets[wbits2].add(points[j]);
    }
    let resI = zero;
    for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
      sumI = sumI.add(buckets[j]);
      resI = resI.add(sumI);
    }
    sum = sum.add(resI);
    if (i !== 0)
      for (let j = 0; j < windowSize; j++)
        sum = sum.double();
  }
  return sum;
}
function validateBasic(curve) {
  validateField(curve.Fp);
  validateObject(curve, {
    n: "bigint",
    h: "bigint",
    Gx: "field",
    Gy: "field"
  }, {
    nBitLength: "isSafeInteger",
    nByteLength: "isSafeInteger"
  });
  return Object.freeze({
    ...nLength(curve.n, curve.nBitLength),
    ...curve,
    ...{ p: curve.Fp.ORDER }
  });
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function validatePointOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    a: "field",
    b: "field"
  }, {
    allowedPrivateKeyLengths: "array",
    wrapPrivateKey: "boolean",
    isTorsionFree: "function",
    clearCofactor: "function",
    allowInfinityPoint: "boolean",
    fromBytes: "function",
    toBytes: "function"
  });
  const { endo, Fp: Fp3, a } = opts;
  if (endo) {
    if (!Fp3.eql(a, Fp3.ZERO)) {
      throw new Error("invalid endomorphism, can only be defined for Koblitz curves that have a=0");
    }
    if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
      throw new Error("invalid endomorphism, expected beta: bigint and splitScalar: function");
    }
  }
  return Object.freeze({ ...opts });
}
const _0n$4 = BigInt(0), _1n$5 = BigInt(1), _2n$5 = BigInt(2), _3n$3 = BigInt(3), _4n$1 = BigInt(4);
function weierstrassPoints(opts) {
  const CURVE = validatePointOpts(opts);
  const { Fp: Fp3 } = CURVE;
  const Fn = Field(CURVE.n, CURVE.nBitLength);
  const toBytes2 = CURVE.toBytes || ((_c, point, _isCompressed) => {
    const a = point.toAffine();
    return concatBytes(Uint8Array.from([4]), Fp3.toBytes(a.x), Fp3.toBytes(a.y));
  });
  const fromBytes = CURVE.fromBytes || ((bytes2) => {
    const tail = bytes2.subarray(1);
    const x = Fp3.fromBytes(tail.subarray(0, Fp3.BYTES));
    const y = Fp3.fromBytes(tail.subarray(Fp3.BYTES, 2 * Fp3.BYTES));
    return { x, y };
  });
  function weierstrassEquation(x) {
    const { a, b } = CURVE;
    const x2 = Fp3.sqr(x);
    const x3 = Fp3.mul(x2, x);
    return Fp3.add(Fp3.add(x3, Fp3.mul(x, a)), b);
  }
  if (!Fp3.eql(Fp3.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx)))
    throw new Error("bad generator point: equation left != right");
  function isWithinCurveOrder(num) {
    return inRange(num, _1n$5, CURVE.n);
  }
  function normPrivateKeyToScalar(key) {
    const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n: N } = CURVE;
    if (lengths && typeof key !== "bigint") {
      if (isBytes(key))
        key = bytesToHex(key);
      if (typeof key !== "string" || !lengths.includes(key.length))
        throw new Error("invalid private key");
      key = key.padStart(nByteLength * 2, "0");
    }
    let num;
    try {
      num = typeof key === "bigint" ? key : bytesToNumberBE(ensureBytes("private key", key, nByteLength));
    } catch (error) {
      throw new Error("invalid private key, expected hex or " + nByteLength + " bytes, got " + typeof key);
    }
    if (wrapPrivateKey)
      num = mod(num, N);
    aInRange("private key", num, _1n$5, N);
    return num;
  }
  function assertPrjPoint(other) {
    if (!(other instanceof Point))
      throw new Error("ProjectivePoint expected");
  }
  const toAffineMemo = memoized((p, iz) => {
    const { px: x, py: y, pz: z } = p;
    if (Fp3.eql(z, Fp3.ONE))
      return { x, y };
    const is0 = p.is0();
    if (iz == null)
      iz = is0 ? Fp3.ONE : Fp3.inv(z);
    const ax = Fp3.mul(x, iz);
    const ay = Fp3.mul(y, iz);
    const zz = Fp3.mul(z, iz);
    if (is0)
      return { x: Fp3.ZERO, y: Fp3.ZERO };
    if (!Fp3.eql(zz, Fp3.ONE))
      throw new Error("invZ was invalid");
    return { x: ax, y: ay };
  });
  const assertValidMemo = memoized((p) => {
    if (p.is0()) {
      if (CURVE.allowInfinityPoint && !Fp3.is0(p.py))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x, y } = p.toAffine();
    if (!Fp3.isValid(x) || !Fp3.isValid(y))
      throw new Error("bad point: x or y not FE");
    const left = Fp3.sqr(y);
    const right = weierstrassEquation(x);
    if (!Fp3.eql(left, right))
      throw new Error("bad point: equation left != right");
    if (!p.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return true;
  });
  class Point {
    constructor(px, py, pz) {
      this.px = px;
      this.py = py;
      this.pz = pz;
      if (px == null || !Fp3.isValid(px))
        throw new Error("x required");
      if (py == null || !Fp3.isValid(py))
        throw new Error("y required");
      if (pz == null || !Fp3.isValid(pz))
        throw new Error("z required");
      Object.freeze(this);
    }
    // Does not validate if the point is on-curve.
    // Use fromHex instead, or call assertValidity() later.
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp3.isValid(x) || !Fp3.isValid(y))
        throw new Error("invalid affine point");
      if (p instanceof Point)
        throw new Error("projective point not allowed");
      const is0 = (i) => Fp3.eql(i, Fp3.ZERO);
      if (is0(x) && is0(y))
        return Point.ZERO;
      return new Point(x, y, Fp3.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     * Takes a bunch of Projective Points but executes only one
     * inversion on all of them. Inversion is very slow operation,
     * so this improves performance massively.
     * Optimization: converts a list of projective points to a list of identical points with Z=1.
     */
    static normalizeZ(points) {
      const toInv = Fp3.invertBatch(points.map((p) => p.pz));
      return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
    }
    /**
     * Converts hash string or Uint8Array to Point.
     * @param hex short/long ECDSA hex
     */
    static fromHex(hex) {
      const P = Point.fromAffine(fromBytes(ensureBytes("pointHex", hex)));
      P.assertValidity();
      return P;
    }
    // Multiplies generator point by privateKey.
    static fromPrivateKey(privateKey) {
      return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
    }
    // Multiscalar Multiplication
    static msm(points, scalars) {
      return pippenger(Point, Fn, points, scalars);
    }
    // "Private method", don't use it directly
    _setWindowSize(windowSize) {
      wnaf.setWindowSize(this, windowSize);
    }
    // A point on curve is valid if it conforms to equation.
    assertValidity() {
      assertValidMemo(this);
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (Fp3.isOdd)
        return !Fp3.isOdd(y);
      throw new Error("Field doesn't support isOdd");
    }
    /**
     * Compare one point to another.
     */
    equals(other) {
      assertPrjPoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      const U1 = Fp3.eql(Fp3.mul(X1, Z2), Fp3.mul(X2, Z1));
      const U2 = Fp3.eql(Fp3.mul(Y1, Z2), Fp3.mul(Y2, Z1));
      return U1 && U2;
    }
    /**
     * Flips point to one corresponding to (x, -y) in Affine coordinates.
     */
    negate() {
      return new Point(this.px, Fp3.neg(this.py), this.pz);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a, b } = CURVE;
      const b3 = Fp3.mul(b, _3n$3);
      const { px: X1, py: Y1, pz: Z1 } = this;
      let X3 = Fp3.ZERO, Y3 = Fp3.ZERO, Z3 = Fp3.ZERO;
      let t0 = Fp3.mul(X1, X1);
      let t1 = Fp3.mul(Y1, Y1);
      let t2 = Fp3.mul(Z1, Z1);
      let t3 = Fp3.mul(X1, Y1);
      t3 = Fp3.add(t3, t3);
      Z3 = Fp3.mul(X1, Z1);
      Z3 = Fp3.add(Z3, Z3);
      X3 = Fp3.mul(a, Z3);
      Y3 = Fp3.mul(b3, t2);
      Y3 = Fp3.add(X3, Y3);
      X3 = Fp3.sub(t1, Y3);
      Y3 = Fp3.add(t1, Y3);
      Y3 = Fp3.mul(X3, Y3);
      X3 = Fp3.mul(t3, X3);
      Z3 = Fp3.mul(b3, Z3);
      t2 = Fp3.mul(a, t2);
      t3 = Fp3.sub(t0, t2);
      t3 = Fp3.mul(a, t3);
      t3 = Fp3.add(t3, Z3);
      Z3 = Fp3.add(t0, t0);
      t0 = Fp3.add(Z3, t0);
      t0 = Fp3.add(t0, t2);
      t0 = Fp3.mul(t0, t3);
      Y3 = Fp3.add(Y3, t0);
      t2 = Fp3.mul(Y1, Z1);
      t2 = Fp3.add(t2, t2);
      t0 = Fp3.mul(t2, t3);
      X3 = Fp3.sub(X3, t0);
      Z3 = Fp3.mul(t2, t1);
      Z3 = Fp3.add(Z3, Z3);
      Z3 = Fp3.add(Z3, Z3);
      return new Point(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      assertPrjPoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      let X3 = Fp3.ZERO, Y3 = Fp3.ZERO, Z3 = Fp3.ZERO;
      const a = CURVE.a;
      const b3 = Fp3.mul(CURVE.b, _3n$3);
      let t0 = Fp3.mul(X1, X2);
      let t1 = Fp3.mul(Y1, Y2);
      let t2 = Fp3.mul(Z1, Z2);
      let t3 = Fp3.add(X1, Y1);
      let t4 = Fp3.add(X2, Y2);
      t3 = Fp3.mul(t3, t4);
      t4 = Fp3.add(t0, t1);
      t3 = Fp3.sub(t3, t4);
      t4 = Fp3.add(X1, Z1);
      let t5 = Fp3.add(X2, Z2);
      t4 = Fp3.mul(t4, t5);
      t5 = Fp3.add(t0, t2);
      t4 = Fp3.sub(t4, t5);
      t5 = Fp3.add(Y1, Z1);
      X3 = Fp3.add(Y2, Z2);
      t5 = Fp3.mul(t5, X3);
      X3 = Fp3.add(t1, t2);
      t5 = Fp3.sub(t5, X3);
      Z3 = Fp3.mul(a, t4);
      X3 = Fp3.mul(b3, t2);
      Z3 = Fp3.add(X3, Z3);
      X3 = Fp3.sub(t1, Z3);
      Z3 = Fp3.add(t1, Z3);
      Y3 = Fp3.mul(X3, Z3);
      t1 = Fp3.add(t0, t0);
      t1 = Fp3.add(t1, t0);
      t2 = Fp3.mul(a, t2);
      t4 = Fp3.mul(b3, t4);
      t1 = Fp3.add(t1, t2);
      t2 = Fp3.sub(t0, t2);
      t2 = Fp3.mul(a, t2);
      t4 = Fp3.add(t4, t2);
      t0 = Fp3.mul(t1, t4);
      Y3 = Fp3.add(Y3, t0);
      t0 = Fp3.mul(t5, t4);
      X3 = Fp3.mul(t3, X3);
      X3 = Fp3.sub(X3, t0);
      t0 = Fp3.mul(t3, t1);
      Z3 = Fp3.mul(t5, Z3);
      Z3 = Fp3.add(Z3, t0);
      return new Point(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    wNAF(n) {
      return wnaf.wNAFCached(this, n, Point.normalizeZ);
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed private key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(sc) {
      const { endo, n: N } = CURVE;
      aInRange("scalar", sc, _0n$4, N);
      const I = Point.ZERO;
      if (sc === _0n$4)
        return I;
      if (this.is0() || sc === _1n$5)
        return this;
      if (!endo || wnaf.hasPrecomputes(this))
        return wnaf.wNAFCachedUnsafe(this, sc, Point.normalizeZ);
      let { k1neg, k1, k2neg, k2 } = endo.splitScalar(sc);
      let k1p = I;
      let k2p = I;
      let d = this;
      while (k1 > _0n$4 || k2 > _0n$4) {
        if (k1 & _1n$5)
          k1p = k1p.add(d);
        if (k2 & _1n$5)
          k2p = k2p.add(d);
        d = d.double();
        k1 >>= _1n$5;
        k2 >>= _1n$5;
      }
      if (k1neg)
        k1p = k1p.negate();
      if (k2neg)
        k2p = k2p.negate();
      k2p = new Point(Fp3.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
      return k1p.add(k2p);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      const { endo, n: N } = CURVE;
      aInRange("scalar", scalar, _1n$5, N);
      let point, fake;
      if (endo) {
        const { k1neg, k1, k2neg, k2 } = endo.splitScalar(scalar);
        let { p: k1p, f: f1p } = this.wNAF(k1);
        let { p: k2p, f: f2p } = this.wNAF(k2);
        k1p = wnaf.constTimeNegate(k1neg, k1p);
        k2p = wnaf.constTimeNegate(k2neg, k2p);
        k2p = new Point(Fp3.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
        point = k1p.add(k2p);
        fake = f1p.add(f2p);
      } else {
        const { p, f } = this.wNAF(scalar);
        point = p;
        fake = f;
      }
      return Point.normalizeZ([point, fake])[0];
    }
    /**
     * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
     * Not using Strauss-Shamir trick: precomputation tables are faster.
     * The trick could be useful if both P and Q are not G (not in our case).
     * @returns non-zero affine point
     */
    multiplyAndAddUnsafe(Q, a, b) {
      const G = Point.BASE;
      const mul = (P, a2) => a2 === _0n$4 || a2 === _1n$5 || !P.equals(G) ? P.multiplyUnsafe(a2) : P.multiply(a2);
      const sum = mul(this, a).add(mul(Q, b));
      return sum.is0() ? void 0 : sum;
    }
    // Converts Projective point to affine (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    // (x, y, z) ∋ (x=x/z, y=y/z)
    toAffine(iz) {
      return toAffineMemo(this, iz);
    }
    isTorsionFree() {
      const { h: cofactor, isTorsionFree } = CURVE;
      if (cofactor === _1n$5)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point, this);
      throw new Error("isTorsionFree() has not been declared for the elliptic curve");
    }
    clearCofactor() {
      const { h: cofactor, clearCofactor } = CURVE;
      if (cofactor === _1n$5)
        return this;
      if (clearCofactor)
        return clearCofactor(Point, this);
      return this.multiplyUnsafe(CURVE.h);
    }
    toRawBytes(isCompressed = true) {
      abool("isCompressed", isCompressed);
      this.assertValidity();
      return toBytes2(Point, this, isCompressed);
    }
    toHex(isCompressed = true) {
      abool("isCompressed", isCompressed);
      return bytesToHex(this.toRawBytes(isCompressed));
    }
  }
  Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp3.ONE);
  Point.ZERO = new Point(Fp3.ZERO, Fp3.ONE, Fp3.ZERO);
  const _bits = CURVE.nBitLength;
  const wnaf = wNAF(Point, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
  return {
    CURVE,
    ProjectivePoint: Point,
    normPrivateKeyToScalar,
    weierstrassEquation,
    isWithinCurveOrder
  };
}
function SWUFpSqrtRatio(Fp3, Z) {
  const q = Fp3.ORDER;
  let l = _0n$4;
  for (let o = q - _1n$5; o % _2n$5 === _0n$4; o /= _2n$5)
    l += _1n$5;
  const c1 = l;
  const _2n_pow_c1_1 = _2n$5 << c1 - _1n$5 - _1n$5;
  const _2n_pow_c1 = _2n_pow_c1_1 * _2n$5;
  const c2 = (q - _1n$5) / _2n_pow_c1;
  const c3 = (c2 - _1n$5) / _2n$5;
  const c4 = _2n_pow_c1 - _1n$5;
  const c5 = _2n_pow_c1_1;
  const c6 = Fp3.pow(Z, c2);
  const c7 = Fp3.pow(Z, (c2 + _1n$5) / _2n$5);
  let sqrtRatio = (u, v) => {
    let tv1 = c6;
    let tv2 = Fp3.pow(v, c4);
    let tv3 = Fp3.sqr(tv2);
    tv3 = Fp3.mul(tv3, v);
    let tv5 = Fp3.mul(u, tv3);
    tv5 = Fp3.pow(tv5, c3);
    tv5 = Fp3.mul(tv5, tv2);
    tv2 = Fp3.mul(tv5, v);
    tv3 = Fp3.mul(tv5, u);
    let tv4 = Fp3.mul(tv3, tv2);
    tv5 = Fp3.pow(tv4, c5);
    let isQR = Fp3.eql(tv5, Fp3.ONE);
    tv2 = Fp3.mul(tv3, c7);
    tv5 = Fp3.mul(tv4, tv1);
    tv3 = Fp3.cmov(tv2, tv3, isQR);
    tv4 = Fp3.cmov(tv5, tv4, isQR);
    for (let i = c1; i > _1n$5; i--) {
      let tv52 = i - _2n$5;
      tv52 = _2n$5 << tv52 - _1n$5;
      let tvv5 = Fp3.pow(tv4, tv52);
      const e1 = Fp3.eql(tvv5, Fp3.ONE);
      tv2 = Fp3.mul(tv3, tv1);
      tv1 = Fp3.mul(tv1, tv1);
      tvv5 = Fp3.mul(tv4, tv1);
      tv3 = Fp3.cmov(tv2, tv3, e1);
      tv4 = Fp3.cmov(tvv5, tv4, e1);
    }
    return { isValid: isQR, value: tv3 };
  };
  if (Fp3.ORDER % _4n$1 === _3n$3) {
    const c12 = (Fp3.ORDER - _3n$3) / _4n$1;
    const c22 = Fp3.sqrt(Fp3.neg(Z));
    sqrtRatio = (u, v) => {
      let tv1 = Fp3.sqr(v);
      const tv2 = Fp3.mul(u, v);
      tv1 = Fp3.mul(tv1, tv2);
      let y1 = Fp3.pow(tv1, c12);
      y1 = Fp3.mul(y1, tv2);
      const y2 = Fp3.mul(y1, c22);
      const tv3 = Fp3.mul(Fp3.sqr(y1), v);
      const isQR = Fp3.eql(tv3, u);
      let y = Fp3.cmov(y2, y1, isQR);
      return { isValid: isQR, value: y };
    };
  }
  return sqrtRatio;
}
function mapToCurveSimpleSWU(Fp3, opts) {
  validateField(Fp3);
  if (!Fp3.isValid(opts.A) || !Fp3.isValid(opts.B) || !Fp3.isValid(opts.Z))
    throw new Error("mapToCurveSimpleSWU: invalid opts");
  const sqrtRatio = SWUFpSqrtRatio(Fp3, opts.Z);
  if (!Fp3.isOdd)
    throw new Error("Fp.isOdd is not implemented!");
  return (u) => {
    let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
    tv1 = Fp3.sqr(u);
    tv1 = Fp3.mul(tv1, opts.Z);
    tv2 = Fp3.sqr(tv1);
    tv2 = Fp3.add(tv2, tv1);
    tv3 = Fp3.add(tv2, Fp3.ONE);
    tv3 = Fp3.mul(tv3, opts.B);
    tv4 = Fp3.cmov(opts.Z, Fp3.neg(tv2), !Fp3.eql(tv2, Fp3.ZERO));
    tv4 = Fp3.mul(tv4, opts.A);
    tv2 = Fp3.sqr(tv3);
    tv6 = Fp3.sqr(tv4);
    tv5 = Fp3.mul(tv6, opts.A);
    tv2 = Fp3.add(tv2, tv5);
    tv2 = Fp3.mul(tv2, tv3);
    tv6 = Fp3.mul(tv6, tv4);
    tv5 = Fp3.mul(tv6, opts.B);
    tv2 = Fp3.add(tv2, tv5);
    x = Fp3.mul(tv1, tv3);
    const { isValid, value: value2 } = sqrtRatio(tv2, tv6);
    y = Fp3.mul(tv1, u);
    y = Fp3.mul(y, value2);
    x = Fp3.cmov(x, tv3, isValid);
    y = Fp3.cmov(y, value2, isValid);
    const e1 = Fp3.isOdd(u) === Fp3.isOdd(y);
    y = Fp3.cmov(Fp3.neg(y), y, e1);
    x = Fp3.div(x, tv4);
    return { x, y };
  };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n$3 = BigInt(0), _1n$4 = BigInt(1), _2n$4 = BigInt(2), _3n$2 = BigInt(3);
function NAfDecomposition(a) {
  const res = [];
  for (; a > _1n$4; a >>= _1n$4) {
    if ((a & _1n$4) === _0n$3)
      res.unshift(0);
    else if ((a & _3n$2) === _3n$2) {
      res.unshift(-1);
      a += _1n$4;
    } else
      res.unshift(1);
  }
  return res;
}
function bls(CURVE) {
  const { Fp: Fp3, Fr: Fr2, Fp2: Fp22, Fp6: Fp62, Fp12: Fp122 } = CURVE.fields;
  const BLS_X_IS_NEGATIVE = CURVE.params.xNegative;
  const TWIST = CURVE.params.twistType;
  const G1_ = weierstrassPoints({ n: Fr2.ORDER, ...CURVE.G1 });
  const G1 = Object.assign(G1_, createHasher(G1_.ProjectivePoint, CURVE.G1.mapToCurve, {
    ...CURVE.htfDefaults,
    ...CURVE.G1.htfDefaults
  }));
  const G2_ = weierstrassPoints({ n: Fr2.ORDER, ...CURVE.G2 });
  const G2 = Object.assign(G2_, createHasher(G2_.ProjectivePoint, CURVE.G2.mapToCurve, {
    ...CURVE.htfDefaults,
    ...CURVE.G2.htfDefaults
  }));
  let lineFunction;
  if (TWIST === "multiplicative") {
    lineFunction = (c0, c1, c2, f, Px, Py) => Fp122.mul014(f, c0, Fp22.mul(c1, Px), Fp22.mul(c2, Py));
  } else if (TWIST === "divisive") {
    lineFunction = (c0, c1, c2, f, Px, Py) => Fp122.mul034(f, Fp22.mul(c2, Py), Fp22.mul(c1, Px), c0);
  } else
    throw new Error("bls: unknown twist type");
  const Fp2div2 = Fp22.div(Fp22.ONE, Fp22.mul(Fp22.ONE, _2n$4));
  function pointDouble(ell, Rx, Ry, Rz) {
    const t0 = Fp22.sqr(Ry);
    const t1 = Fp22.sqr(Rz);
    const t2 = Fp22.mulByB(Fp22.mul(t1, _3n$2));
    const t3 = Fp22.mul(t2, _3n$2);
    const t4 = Fp22.sub(Fp22.sub(Fp22.sqr(Fp22.add(Ry, Rz)), t1), t0);
    const c0 = Fp22.sub(t2, t0);
    const c1 = Fp22.mul(Fp22.sqr(Rx), _3n$2);
    const c2 = Fp22.neg(t4);
    ell.push([c0, c1, c2]);
    Rx = Fp22.mul(Fp22.mul(Fp22.mul(Fp22.sub(t0, t3), Rx), Ry), Fp2div2);
    Ry = Fp22.sub(Fp22.sqr(Fp22.mul(Fp22.add(t0, t3), Fp2div2)), Fp22.mul(Fp22.sqr(t2), _3n$2));
    Rz = Fp22.mul(t0, t4);
    return { Rx, Ry, Rz };
  }
  function pointAdd(ell, Rx, Ry, Rz, Qx, Qy) {
    const t0 = Fp22.sub(Ry, Fp22.mul(Qy, Rz));
    const t1 = Fp22.sub(Rx, Fp22.mul(Qx, Rz));
    const c0 = Fp22.sub(Fp22.mul(t0, Qx), Fp22.mul(t1, Qy));
    const c1 = Fp22.neg(t0);
    const c2 = t1;
    ell.push([c0, c1, c2]);
    const t2 = Fp22.sqr(t1);
    const t3 = Fp22.mul(t2, t1);
    const t4 = Fp22.mul(t2, Rx);
    const t5 = Fp22.add(Fp22.sub(t3, Fp22.mul(t4, _2n$4)), Fp22.mul(Fp22.sqr(t0), Rz));
    Rx = Fp22.mul(t1, t5);
    Ry = Fp22.sub(Fp22.mul(Fp22.sub(t4, t5), t0), Fp22.mul(t3, Ry));
    Rz = Fp22.mul(Rz, t3);
    return { Rx, Ry, Rz };
  }
  const ATE_NAF = NAfDecomposition(CURVE.params.ateLoopSize);
  const calcPairingPrecomputes = memoized((point) => {
    const p = point;
    const { x, y } = p.toAffine();
    const Qx = x, Qy = y, negQy = Fp22.neg(y);
    let Rx = Qx, Ry = Qy, Rz = Fp22.ONE;
    const ell = [];
    for (const bit of ATE_NAF) {
      const cur = [];
      ({ Rx, Ry, Rz } = pointDouble(cur, Rx, Ry, Rz));
      if (bit)
        ({ Rx, Ry, Rz } = pointAdd(cur, Rx, Ry, Rz, Qx, bit === -1 ? negQy : Qy));
      ell.push(cur);
    }
    if (CURVE.postPrecompute) {
      const last = ell[ell.length - 1];
      CURVE.postPrecompute(Rx, Ry, Rz, Qx, Qy, pointAdd.bind(null, last));
    }
    return ell;
  });
  function millerLoopBatch(pairs, withFinalExponent = false) {
    let f12 = Fp122.ONE;
    if (pairs.length) {
      const ellLen = pairs[0][0].length;
      for (let i = 0; i < ellLen; i++) {
        f12 = Fp122.sqr(f12);
        for (const [ell, Px, Py] of pairs) {
          for (const [c0, c1, c2] of ell[i])
            f12 = lineFunction(c0, c1, c2, f12, Px, Py);
        }
      }
    }
    if (BLS_X_IS_NEGATIVE)
      f12 = Fp122.conjugate(f12);
    return withFinalExponent ? Fp122.finalExponentiate(f12) : f12;
  }
  function pairingBatch(pairs, withFinalExponent = true) {
    const res = [];
    G1.ProjectivePoint.normalizeZ(pairs.map(({ g1 }) => g1));
    G2.ProjectivePoint.normalizeZ(pairs.map(({ g2 }) => g2));
    for (const { g1, g2 } of pairs) {
      if (g1.equals(G1.ProjectivePoint.ZERO) || g2.equals(G2.ProjectivePoint.ZERO))
        throw new Error("pairing is not available for ZERO point");
      g1.assertValidity();
      g2.assertValidity();
      const Qa = g1.toAffine();
      res.push([calcPairingPrecomputes(g2), Qa.x, Qa.y]);
    }
    return millerLoopBatch(res, withFinalExponent);
  }
  function pairing(Q, P, withFinalExponent = true) {
    return pairingBatch([{ g1: Q, g2: P }], withFinalExponent);
  }
  const utils2 = {
    randomPrivateKey: () => {
      const length = getMinHashLength(Fr2.ORDER);
      return mapHashToField(CURVE.randomBytes(length), Fr2.ORDER);
    },
    calcPairingPrecomputes
  };
  const { ShortSignature } = CURVE.G1;
  const { Signature } = CURVE.G2;
  function normP1(point) {
    return point instanceof G1.ProjectivePoint ? point : G1.ProjectivePoint.fromHex(point);
  }
  function normP1Hash(point, htfOpts) {
    return point instanceof G1.ProjectivePoint ? point : G1.hashToCurve(ensureBytes("point", point), htfOpts);
  }
  function normP2(point) {
    return point instanceof G2.ProjectivePoint ? point : Signature.fromHex(point);
  }
  function normP2Hash(point, htfOpts) {
    return point instanceof G2.ProjectivePoint ? point : G2.hashToCurve(ensureBytes("point", point), htfOpts);
  }
  function getPublicKey(privateKey) {
    return G1.ProjectivePoint.fromPrivateKey(privateKey).toRawBytes(true);
  }
  function getPublicKeyForShortSignatures(privateKey) {
    return G2.ProjectivePoint.fromPrivateKey(privateKey).toRawBytes(true);
  }
  function sign(message, privateKey, htfOpts) {
    const msgPoint = normP2Hash(message, htfOpts);
    msgPoint.assertValidity();
    const sigPoint = msgPoint.multiply(G1.normPrivateKeyToScalar(privateKey));
    if (message instanceof G2.ProjectivePoint)
      return sigPoint;
    return Signature.toRawBytes(sigPoint);
  }
  function signShortSignature(message, privateKey, htfOpts) {
    const msgPoint = normP1Hash(message, htfOpts);
    msgPoint.assertValidity();
    const sigPoint = msgPoint.multiply(G1.normPrivateKeyToScalar(privateKey));
    if (message instanceof G1.ProjectivePoint)
      return sigPoint;
    return ShortSignature.toRawBytes(sigPoint);
  }
  function verify(signature, message, publicKey, htfOpts) {
    const P = normP1(publicKey);
    const Hm = normP2Hash(message, htfOpts);
    const G = G1.ProjectivePoint.BASE;
    const S = normP2(signature);
    const exp = pairingBatch([
      { g1: P.negate(), g2: Hm },
      // ePHM = pairing(P.negate(), Hm, false);
      { g1: G, g2: S }
      // eGS = pairing(G, S, false);
    ]);
    return Fp122.eql(exp, Fp122.ONE);
  }
  function verifyShortSignature(signature, message, publicKey, htfOpts) {
    const P = normP2(publicKey);
    const Hm = normP1Hash(message, htfOpts);
    const G = G2.ProjectivePoint.BASE;
    const S = normP1(signature);
    const exp = pairingBatch([
      { g1: Hm, g2: P },
      // eHmP = pairing(Hm, P, false);
      { g1: S, g2: G.negate() }
      // eSG = pairing(S, G.negate(), false);
    ]);
    return Fp122.eql(exp, Fp122.ONE);
  }
  function aNonEmpty(arr) {
    if (!Array.isArray(arr) || arr.length === 0)
      throw new Error("expected non-empty array");
  }
  function aggregatePublicKeys(publicKeys) {
    aNonEmpty(publicKeys);
    const agg = publicKeys.map(normP1).reduce((sum, p) => sum.add(p), G1.ProjectivePoint.ZERO);
    const aggAffine = agg;
    if (publicKeys[0] instanceof G1.ProjectivePoint) {
      aggAffine.assertValidity();
      return aggAffine;
    }
    return aggAffine.toRawBytes(true);
  }
  function aggregateSignatures(signatures) {
    aNonEmpty(signatures);
    const agg = signatures.map(normP2).reduce((sum, s) => sum.add(s), G2.ProjectivePoint.ZERO);
    const aggAffine = agg;
    if (signatures[0] instanceof G2.ProjectivePoint) {
      aggAffine.assertValidity();
      return aggAffine;
    }
    return Signature.toRawBytes(aggAffine);
  }
  function aggregateShortSignatures(signatures) {
    aNonEmpty(signatures);
    const agg = signatures.map(normP1).reduce((sum, s) => sum.add(s), G1.ProjectivePoint.ZERO);
    const aggAffine = agg;
    if (signatures[0] instanceof G1.ProjectivePoint) {
      aggAffine.assertValidity();
      return aggAffine;
    }
    return ShortSignature.toRawBytes(aggAffine);
  }
  function verifyBatch(signature, messages, publicKeys, htfOpts) {
    aNonEmpty(messages);
    if (publicKeys.length !== messages.length)
      throw new Error("amount of public keys and messages should be equal");
    const sig = normP2(signature);
    const nMessages = messages.map((i) => normP2Hash(i, htfOpts));
    const nPublicKeys = publicKeys.map(normP1);
    const messagePubKeyMap = /* @__PURE__ */ new Map();
    for (let i = 0; i < nPublicKeys.length; i++) {
      const pub = nPublicKeys[i];
      const msg = nMessages[i];
      let keys = messagePubKeyMap.get(msg);
      if (keys === void 0) {
        keys = [];
        messagePubKeyMap.set(msg, keys);
      }
      keys.push(pub);
    }
    const paired = [];
    try {
      for (const [msg, keys] of messagePubKeyMap) {
        const groupPublicKey = keys.reduce((acc, msg2) => acc.add(msg2));
        paired.push({ g1: groupPublicKey, g2: msg });
      }
      paired.push({ g1: G1.ProjectivePoint.BASE.negate(), g2: sig });
      return Fp122.eql(pairingBatch(paired), Fp122.ONE);
    } catch {
      return false;
    }
  }
  G1.ProjectivePoint.BASE._setWindowSize(4);
  return {
    getPublicKey,
    getPublicKeyForShortSignatures,
    sign,
    signShortSignature,
    verify,
    verifyBatch,
    verifyShortSignature,
    aggregatePublicKeys,
    aggregateSignatures,
    aggregateShortSignatures,
    millerLoopBatch,
    pairing,
    pairingBatch,
    G1,
    G2,
    Signature,
    ShortSignature,
    fields: {
      Fr: Fr2,
      Fp: Fp3,
      Fp2: Fp22,
      Fp6: Fp62,
      Fp12: Fp122
    },
    params: {
      ateLoopSize: CURVE.params.ateLoopSize,
      r: CURVE.params.r,
      G1b: CURVE.G1.b,
      G2b: CURVE.G2.b
    },
    utils: utils2
  };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n$2 = BigInt(0), _1n$3 = BigInt(1), _2n$3 = BigInt(2), _3n$1 = BigInt(3);
function calcFrobeniusCoefficients(Fp3, nonResidue, modulus, degree, num = 1, divisor) {
  const _divisor = BigInt(divisor === void 0 ? degree : divisor);
  const towerModulus = modulus ** BigInt(degree);
  const res = [];
  for (let i = 0; i < num; i++) {
    const a = BigInt(i + 1);
    const powers = [];
    for (let j = 0, qPower = _1n$3; j < degree; j++) {
      const power = (a * qPower - a) / _divisor % towerModulus;
      powers.push(Fp3.pow(nonResidue, power));
      qPower *= modulus;
    }
    res.push(powers);
  }
  return res;
}
function psiFrobenius(Fp3, Fp22, base) {
  const PSI_X = Fp22.pow(base, (Fp3.ORDER - _1n$3) / _3n$1);
  const PSI_Y = Fp22.pow(base, (Fp3.ORDER - _1n$3) / _2n$3);
  function psi(x, y) {
    const x2 = Fp22.mul(Fp22.frobeniusMap(x, 1), PSI_X);
    const y2 = Fp22.mul(Fp22.frobeniusMap(y, 1), PSI_Y);
    return [x2, y2];
  }
  const PSI2_X = Fp22.pow(base, (Fp3.ORDER ** _2n$3 - _1n$3) / _3n$1);
  const PSI2_Y = Fp22.pow(base, (Fp3.ORDER ** _2n$3 - _1n$3) / _2n$3);
  if (!Fp22.eql(PSI2_Y, Fp22.neg(Fp22.ONE)))
    throw new Error("psiFrobenius: PSI2_Y!==-1");
  function psi2(x, y) {
    return [Fp22.mul(x, PSI2_X), Fp22.neg(y)];
  }
  const mapAffine = (fn) => (c2, P) => {
    const affine = P.toAffine();
    const p = fn(affine.x, affine.y);
    return c2.fromAffine({ x: p[0], y: p[1] });
  };
  const G2psi3 = mapAffine(psi);
  const G2psi22 = mapAffine(psi2);
  return { psi, psi2, G2psi: G2psi3, G2psi2: G2psi22, PSI_X, PSI_Y, PSI2_X, PSI2_Y };
}
function tower12(opts) {
  const { ORDER } = opts;
  const Fp3 = Field(ORDER);
  const FpNONRESIDUE = Fp3.create(opts.NONRESIDUE || BigInt(-1));
  const FpLegendre$1 = FpLegendre(ORDER);
  const Fpdiv2 = Fp3.div(Fp3.ONE, _2n$3);
  const FP2_FROBENIUS_COEFFICIENTS = calcFrobeniusCoefficients(Fp3, FpNONRESIDUE, Fp3.ORDER, 2)[0];
  const Fp2Add = ({ c0, c1 }, { c0: r0, c1: r1 }) => ({
    c0: Fp3.add(c0, r0),
    c1: Fp3.add(c1, r1)
  });
  const Fp2Subtract = ({ c0, c1 }, { c0: r0, c1: r1 }) => ({
    c0: Fp3.sub(c0, r0),
    c1: Fp3.sub(c1, r1)
  });
  const Fp2Multiply = ({ c0, c1 }, rhs) => {
    if (typeof rhs === "bigint")
      return { c0: Fp3.mul(c0, rhs), c1: Fp3.mul(c1, rhs) };
    const { c0: r0, c1: r1 } = rhs;
    let t1 = Fp3.mul(c0, r0);
    let t2 = Fp3.mul(c1, r1);
    const o0 = Fp3.sub(t1, t2);
    const o1 = Fp3.sub(Fp3.mul(Fp3.add(c0, c1), Fp3.add(r0, r1)), Fp3.add(t1, t2));
    return { c0: o0, c1: o1 };
  };
  const Fp2Square = ({ c0, c1 }) => {
    const a = Fp3.add(c0, c1);
    const b = Fp3.sub(c0, c1);
    const c2 = Fp3.add(c0, c0);
    return { c0: Fp3.mul(a, b), c1: Fp3.mul(c2, c1) };
  };
  const Fp2fromBigTuple = (tuple) => {
    if (tuple.length !== 2)
      throw new Error("invalid tuple");
    const fps = tuple.map((n) => Fp3.create(n));
    return { c0: fps[0], c1: fps[1] };
  };
  const FP2_ORDER = ORDER * ORDER;
  const Fp2Nonresidue = Fp2fromBigTuple(opts.FP2_NONRESIDUE);
  const Fp22 = {
    ORDER: FP2_ORDER,
    isLE: Fp3.isLE,
    NONRESIDUE: Fp2Nonresidue,
    BITS: bitLen(FP2_ORDER),
    BYTES: Math.ceil(bitLen(FP2_ORDER) / 8),
    MASK: bitMask(bitLen(FP2_ORDER)),
    ZERO: { c0: Fp3.ZERO, c1: Fp3.ZERO },
    ONE: { c0: Fp3.ONE, c1: Fp3.ZERO },
    create: (num) => num,
    isValid: ({ c0, c1 }) => typeof c0 === "bigint" && typeof c1 === "bigint",
    is0: ({ c0, c1 }) => Fp3.is0(c0) && Fp3.is0(c1),
    eql: ({ c0, c1 }, { c0: r0, c1: r1 }) => Fp3.eql(c0, r0) && Fp3.eql(c1, r1),
    neg: ({ c0, c1 }) => ({ c0: Fp3.neg(c0), c1: Fp3.neg(c1) }),
    pow: (num, power) => FpPow(Fp22, num, power),
    invertBatch: (nums) => FpInvertBatch(Fp22, nums),
    // Normalized
    add: Fp2Add,
    sub: Fp2Subtract,
    mul: Fp2Multiply,
    sqr: Fp2Square,
    // NonNormalized stuff
    addN: Fp2Add,
    subN: Fp2Subtract,
    mulN: Fp2Multiply,
    sqrN: Fp2Square,
    // Why inversion for bigint inside Fp instead of Fp2? it is even used in that context?
    div: (lhs, rhs) => Fp22.mul(lhs, typeof rhs === "bigint" ? Fp3.inv(Fp3.create(rhs)) : Fp22.inv(rhs)),
    inv: ({ c0: a, c1: b }) => {
      const factor = Fp3.inv(Fp3.create(a * a + b * b));
      return { c0: Fp3.mul(factor, Fp3.create(a)), c1: Fp3.mul(factor, Fp3.create(-b)) };
    },
    sqrt: (num) => {
      if (opts.Fp2sqrt)
        return opts.Fp2sqrt(num);
      const { c0, c1 } = num;
      if (Fp3.is0(c1)) {
        if (Fp3.eql(FpLegendre$1(Fp3, c0), Fp3.ONE))
          return Fp22.create({ c0: Fp3.sqrt(c0), c1: Fp3.ZERO });
        else
          return Fp22.create({ c0: Fp3.ZERO, c1: Fp3.sqrt(Fp3.div(c0, FpNONRESIDUE)) });
      }
      const a = Fp3.sqrt(Fp3.sub(Fp3.sqr(c0), Fp3.mul(Fp3.sqr(c1), FpNONRESIDUE)));
      let d = Fp3.mul(Fp3.add(a, c0), Fpdiv2);
      const legendre = FpLegendre$1(Fp3, d);
      if (!Fp3.is0(legendre) && !Fp3.eql(legendre, Fp3.ONE))
        d = Fp3.sub(d, a);
      const a0 = Fp3.sqrt(d);
      const candidateSqrt = Fp22.create({ c0: a0, c1: Fp3.div(Fp3.mul(c1, Fpdiv2), a0) });
      if (!Fp22.eql(Fp22.sqr(candidateSqrt), num))
        throw new Error("Cannot find square root");
      const x1 = candidateSqrt;
      const x2 = Fp22.neg(x1);
      const { re: re1, im: im1 } = Fp22.reim(x1);
      const { re: re2, im: im2 } = Fp22.reim(x2);
      if (im1 > im2 || im1 === im2 && re1 > re2)
        return x1;
      return x2;
    },
    // Same as sgn0_m_eq_2 in RFC 9380
    isOdd: (x) => {
      const { re: x0, im: x1 } = Fp22.reim(x);
      const sign_0 = x0 % _2n$3;
      const zero_0 = x0 === _0n$2;
      const sign_1 = x1 % _2n$3;
      return BigInt(sign_0 || zero_0 && sign_1) == _1n$3;
    },
    // Bytes util
    fromBytes(b) {
      if (b.length !== Fp22.BYTES)
        throw new Error("fromBytes invalid length=" + b.length);
      return { c0: Fp3.fromBytes(b.subarray(0, Fp3.BYTES)), c1: Fp3.fromBytes(b.subarray(Fp3.BYTES)) };
    },
    toBytes: ({ c0, c1 }) => concatBytes(Fp3.toBytes(c0), Fp3.toBytes(c1)),
    cmov: ({ c0, c1 }, { c0: r0, c1: r1 }, c2) => ({
      c0: Fp3.cmov(c0, r0, c2),
      c1: Fp3.cmov(c1, r1, c2)
    }),
    reim: ({ c0, c1 }) => ({ re: c0, im: c1 }),
    // multiply by u + 1
    mulByNonresidue: ({ c0, c1 }) => Fp22.mul({ c0, c1 }, Fp2Nonresidue),
    mulByB: opts.Fp2mulByB,
    fromBigTuple: Fp2fromBigTuple,
    frobeniusMap: ({ c0, c1 }, power) => ({
      c0,
      c1: Fp3.mul(c1, FP2_FROBENIUS_COEFFICIENTS[power % 2])
    })
  };
  const Fp6Add = ({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) => ({
    c0: Fp22.add(c0, r0),
    c1: Fp22.add(c1, r1),
    c2: Fp22.add(c2, r2)
  });
  const Fp6Subtract = ({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) => ({
    c0: Fp22.sub(c0, r0),
    c1: Fp22.sub(c1, r1),
    c2: Fp22.sub(c2, r2)
  });
  const Fp6Multiply = ({ c0, c1, c2 }, rhs) => {
    if (typeof rhs === "bigint") {
      return {
        c0: Fp22.mul(c0, rhs),
        c1: Fp22.mul(c1, rhs),
        c2: Fp22.mul(c2, rhs)
      };
    }
    const { c0: r0, c1: r1, c2: r2 } = rhs;
    const t0 = Fp22.mul(c0, r0);
    const t1 = Fp22.mul(c1, r1);
    const t2 = Fp22.mul(c2, r2);
    return {
      // t0 + (c1 + c2) * (r1 * r2) - (T1 + T2) * (u + 1)
      c0: Fp22.add(t0, Fp22.mulByNonresidue(Fp22.sub(Fp22.mul(Fp22.add(c1, c2), Fp22.add(r1, r2)), Fp22.add(t1, t2)))),
      // (c0 + c1) * (r0 + r1) - (T0 + T1) + T2 * (u + 1)
      c1: Fp22.add(Fp22.sub(Fp22.mul(Fp22.add(c0, c1), Fp22.add(r0, r1)), Fp22.add(t0, t1)), Fp22.mulByNonresidue(t2)),
      // T1 + (c0 + c2) * (r0 + r2) - T0 + T2
      c2: Fp22.sub(Fp22.add(t1, Fp22.mul(Fp22.add(c0, c2), Fp22.add(r0, r2))), Fp22.add(t0, t2))
    };
  };
  const Fp6Square = ({ c0, c1, c2 }) => {
    let t0 = Fp22.sqr(c0);
    let t1 = Fp22.mul(Fp22.mul(c0, c1), _2n$3);
    let t3 = Fp22.mul(Fp22.mul(c1, c2), _2n$3);
    let t4 = Fp22.sqr(c2);
    return {
      c0: Fp22.add(Fp22.mulByNonresidue(t3), t0),
      // T3 * (u + 1) + T0
      c1: Fp22.add(Fp22.mulByNonresidue(t4), t1),
      // T4 * (u + 1) + T1
      // T1 + (c0 - c1 + c2)² + T3 - T0 - T4
      c2: Fp22.sub(Fp22.sub(Fp22.add(Fp22.add(t1, Fp22.sqr(Fp22.add(Fp22.sub(c0, c1), c2))), t3), t0), t4)
    };
  };
  const [FP6_FROBENIUS_COEFFICIENTS_1, FP6_FROBENIUS_COEFFICIENTS_2] = calcFrobeniusCoefficients(Fp22, Fp2Nonresidue, Fp3.ORDER, 6, 2, 3);
  const Fp62 = {
    ORDER: Fp22.ORDER,
    // TODO: unused, but need to verify
    isLE: Fp22.isLE,
    BITS: 3 * Fp22.BITS,
    BYTES: 3 * Fp22.BYTES,
    MASK: bitMask(3 * Fp22.BITS),
    ZERO: { c0: Fp22.ZERO, c1: Fp22.ZERO, c2: Fp22.ZERO },
    ONE: { c0: Fp22.ONE, c1: Fp22.ZERO, c2: Fp22.ZERO },
    create: (num) => num,
    isValid: ({ c0, c1, c2 }) => Fp22.isValid(c0) && Fp22.isValid(c1) && Fp22.isValid(c2),
    is0: ({ c0, c1, c2 }) => Fp22.is0(c0) && Fp22.is0(c1) && Fp22.is0(c2),
    neg: ({ c0, c1, c2 }) => ({ c0: Fp22.neg(c0), c1: Fp22.neg(c1), c2: Fp22.neg(c2) }),
    eql: ({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) => Fp22.eql(c0, r0) && Fp22.eql(c1, r1) && Fp22.eql(c2, r2),
    sqrt: notImplemented,
    // Do we need division by bigint at all? Should be done via order:
    div: (lhs, rhs) => Fp62.mul(lhs, typeof rhs === "bigint" ? Fp3.inv(Fp3.create(rhs)) : Fp62.inv(rhs)),
    pow: (num, power) => FpPow(Fp62, num, power),
    invertBatch: (nums) => FpInvertBatch(Fp62, nums),
    // Normalized
    add: Fp6Add,
    sub: Fp6Subtract,
    mul: Fp6Multiply,
    sqr: Fp6Square,
    // NonNormalized stuff
    addN: Fp6Add,
    subN: Fp6Subtract,
    mulN: Fp6Multiply,
    sqrN: Fp6Square,
    inv: ({ c0, c1, c2 }) => {
      let t0 = Fp22.sub(Fp22.sqr(c0), Fp22.mulByNonresidue(Fp22.mul(c2, c1)));
      let t1 = Fp22.sub(Fp22.mulByNonresidue(Fp22.sqr(c2)), Fp22.mul(c0, c1));
      let t2 = Fp22.sub(Fp22.sqr(c1), Fp22.mul(c0, c2));
      let t4 = Fp22.inv(Fp22.add(Fp22.mulByNonresidue(Fp22.add(Fp22.mul(c2, t1), Fp22.mul(c1, t2))), Fp22.mul(c0, t0)));
      return { c0: Fp22.mul(t4, t0), c1: Fp22.mul(t4, t1), c2: Fp22.mul(t4, t2) };
    },
    // Bytes utils
    fromBytes: (b) => {
      if (b.length !== Fp62.BYTES)
        throw new Error("fromBytes invalid length=" + b.length);
      return {
        c0: Fp22.fromBytes(b.subarray(0, Fp22.BYTES)),
        c1: Fp22.fromBytes(b.subarray(Fp22.BYTES, 2 * Fp22.BYTES)),
        c2: Fp22.fromBytes(b.subarray(2 * Fp22.BYTES))
      };
    },
    toBytes: ({ c0, c1, c2 }) => concatBytes(Fp22.toBytes(c0), Fp22.toBytes(c1), Fp22.toBytes(c2)),
    cmov: ({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }, c3) => ({
      c0: Fp22.cmov(c0, r0, c3),
      c1: Fp22.cmov(c1, r1, c3),
      c2: Fp22.cmov(c2, r2, c3)
    }),
    fromBigSix: (t) => {
      if (!Array.isArray(t) || t.length !== 6)
        throw new Error("invalid Fp6 usage");
      return {
        c0: Fp22.fromBigTuple(t.slice(0, 2)),
        c1: Fp22.fromBigTuple(t.slice(2, 4)),
        c2: Fp22.fromBigTuple(t.slice(4, 6))
      };
    },
    frobeniusMap: ({ c0, c1, c2 }, power) => ({
      c0: Fp22.frobeniusMap(c0, power),
      c1: Fp22.mul(Fp22.frobeniusMap(c1, power), FP6_FROBENIUS_COEFFICIENTS_1[power % 6]),
      c2: Fp22.mul(Fp22.frobeniusMap(c2, power), FP6_FROBENIUS_COEFFICIENTS_2[power % 6])
    }),
    mulByFp2: ({ c0, c1, c2 }, rhs) => ({
      c0: Fp22.mul(c0, rhs),
      c1: Fp22.mul(c1, rhs),
      c2: Fp22.mul(c2, rhs)
    }),
    mulByNonresidue: ({ c0, c1, c2 }) => ({ c0: Fp22.mulByNonresidue(c2), c1: c0, c2: c1 }),
    // Sparse multiplication
    mul1: ({ c0, c1, c2 }, b1) => ({
      c0: Fp22.mulByNonresidue(Fp22.mul(c2, b1)),
      c1: Fp22.mul(c0, b1),
      c2: Fp22.mul(c1, b1)
    }),
    // Sparse multiplication
    mul01({ c0, c1, c2 }, b0, b1) {
      let t0 = Fp22.mul(c0, b0);
      let t1 = Fp22.mul(c1, b1);
      return {
        // ((c1 + c2) * b1 - T1) * (u + 1) + T0
        c0: Fp22.add(Fp22.mulByNonresidue(Fp22.sub(Fp22.mul(Fp22.add(c1, c2), b1), t1)), t0),
        // (b0 + b1) * (c0 + c1) - T0 - T1
        c1: Fp22.sub(Fp22.sub(Fp22.mul(Fp22.add(b0, b1), Fp22.add(c0, c1)), t0), t1),
        // (c0 + c2) * b0 - T0 + T1
        c2: Fp22.add(Fp22.sub(Fp22.mul(Fp22.add(c0, c2), b0), t0), t1)
      };
    }
  };
  const FP12_FROBENIUS_COEFFICIENTS = calcFrobeniusCoefficients(Fp22, Fp2Nonresidue, Fp3.ORDER, 12, 1, 6)[0];
  const Fp12Add = ({ c0, c1 }, { c0: r0, c1: r1 }) => ({
    c0: Fp62.add(c0, r0),
    c1: Fp62.add(c1, r1)
  });
  const Fp12Subtract = ({ c0, c1 }, { c0: r0, c1: r1 }) => ({
    c0: Fp62.sub(c0, r0),
    c1: Fp62.sub(c1, r1)
  });
  const Fp12Multiply = ({ c0, c1 }, rhs) => {
    if (typeof rhs === "bigint")
      return { c0: Fp62.mul(c0, rhs), c1: Fp62.mul(c1, rhs) };
    let { c0: r0, c1: r1 } = rhs;
    let t1 = Fp62.mul(c0, r0);
    let t2 = Fp62.mul(c1, r1);
    return {
      c0: Fp62.add(t1, Fp62.mulByNonresidue(t2)),
      // T1 + T2 * v
      // (c0 + c1) * (r0 + r1) - (T1 + T2)
      c1: Fp62.sub(Fp62.mul(Fp62.add(c0, c1), Fp62.add(r0, r1)), Fp62.add(t1, t2))
    };
  };
  const Fp12Square = ({ c0, c1 }) => {
    let ab = Fp62.mul(c0, c1);
    return {
      // (c1 * v + c0) * (c0 + c1) - AB - AB * v
      c0: Fp62.sub(Fp62.sub(Fp62.mul(Fp62.add(Fp62.mulByNonresidue(c1), c0), Fp62.add(c0, c1)), ab), Fp62.mulByNonresidue(ab)),
      c1: Fp62.add(ab, ab)
    };
  };
  function Fp4Square2(a, b) {
    const a2 = Fp22.sqr(a);
    const b2 = Fp22.sqr(b);
    return {
      first: Fp22.add(Fp22.mulByNonresidue(b2), a2),
      // b² * Nonresidue + a²
      second: Fp22.sub(Fp22.sub(Fp22.sqr(Fp22.add(a, b)), a2), b2)
      // (a + b)² - a² - b²
    };
  }
  const Fp122 = {
    ORDER: Fp22.ORDER,
    // TODO: unused, but need to verify
    isLE: Fp62.isLE,
    BITS: 2 * Fp22.BITS,
    BYTES: 2 * Fp22.BYTES,
    MASK: bitMask(2 * Fp22.BITS),
    ZERO: { c0: Fp62.ZERO, c1: Fp62.ZERO },
    ONE: { c0: Fp62.ONE, c1: Fp62.ZERO },
    create: (num) => num,
    isValid: ({ c0, c1 }) => Fp62.isValid(c0) && Fp62.isValid(c1),
    is0: ({ c0, c1 }) => Fp62.is0(c0) && Fp62.is0(c1),
    neg: ({ c0, c1 }) => ({ c0: Fp62.neg(c0), c1: Fp62.neg(c1) }),
    eql: ({ c0, c1 }, { c0: r0, c1: r1 }) => Fp62.eql(c0, r0) && Fp62.eql(c1, r1),
    sqrt: notImplemented,
    inv: ({ c0, c1 }) => {
      let t = Fp62.inv(Fp62.sub(Fp62.sqr(c0), Fp62.mulByNonresidue(Fp62.sqr(c1))));
      return { c0: Fp62.mul(c0, t), c1: Fp62.neg(Fp62.mul(c1, t)) };
    },
    div: (lhs, rhs) => Fp122.mul(lhs, typeof rhs === "bigint" ? Fp3.inv(Fp3.create(rhs)) : Fp122.inv(rhs)),
    pow: (num, power) => FpPow(Fp122, num, power),
    invertBatch: (nums) => FpInvertBatch(Fp122, nums),
    // Normalized
    add: Fp12Add,
    sub: Fp12Subtract,
    mul: Fp12Multiply,
    sqr: Fp12Square,
    // NonNormalized stuff
    addN: Fp12Add,
    subN: Fp12Subtract,
    mulN: Fp12Multiply,
    sqrN: Fp12Square,
    // Bytes utils
    fromBytes: (b) => {
      if (b.length !== Fp122.BYTES)
        throw new Error("fromBytes invalid length=" + b.length);
      return {
        c0: Fp62.fromBytes(b.subarray(0, Fp62.BYTES)),
        c1: Fp62.fromBytes(b.subarray(Fp62.BYTES))
      };
    },
    toBytes: ({ c0, c1 }) => concatBytes(Fp62.toBytes(c0), Fp62.toBytes(c1)),
    cmov: ({ c0, c1 }, { c0: r0, c1: r1 }, c2) => ({
      c0: Fp62.cmov(c0, r0, c2),
      c1: Fp62.cmov(c1, r1, c2)
    }),
    // Utils
    // toString() {
    //   return '' + 'Fp12(' + this.c0 + this.c1 + '* w');
    // },
    // fromTuple(c: [Fp6, Fp6]) {
    //   return new Fp12(...c);
    // }
    fromBigTwelve: (t) => ({
      c0: Fp62.fromBigSix(t.slice(0, 6)),
      c1: Fp62.fromBigSix(t.slice(6, 12))
    }),
    // Raises to q**i -th power
    frobeniusMap(lhs, power) {
      const { c0, c1, c2 } = Fp62.frobeniusMap(lhs.c1, power);
      const coeff = FP12_FROBENIUS_COEFFICIENTS[power % 12];
      return {
        c0: Fp62.frobeniusMap(lhs.c0, power),
        c1: Fp62.create({
          c0: Fp22.mul(c0, coeff),
          c1: Fp22.mul(c1, coeff),
          c2: Fp22.mul(c2, coeff)
        })
      };
    },
    mulByFp2: ({ c0, c1 }, rhs) => ({
      c0: Fp62.mulByFp2(c0, rhs),
      c1: Fp62.mulByFp2(c1, rhs)
    }),
    conjugate: ({ c0, c1 }) => ({ c0, c1: Fp62.neg(c1) }),
    // Sparse multiplication
    mul014: ({ c0, c1 }, o0, o1, o4) => {
      let t0 = Fp62.mul01(c0, o0, o1);
      let t1 = Fp62.mul1(c1, o4);
      return {
        c0: Fp62.add(Fp62.mulByNonresidue(t1), t0),
        // T1 * v + T0
        // (c1 + c0) * [o0, o1+o4] - T0 - T1
        c1: Fp62.sub(Fp62.sub(Fp62.mul01(Fp62.add(c1, c0), o0, Fp22.add(o1, o4)), t0), t1)
      };
    },
    mul034: ({ c0, c1 }, o0, o3, o4) => {
      const a = Fp62.create({
        c0: Fp22.mul(c0.c0, o0),
        c1: Fp22.mul(c0.c1, o0),
        c2: Fp22.mul(c0.c2, o0)
      });
      const b = Fp62.mul01(c1, o3, o4);
      const e = Fp62.mul01(Fp62.add(c0, c1), Fp22.add(o0, o3), o4);
      return {
        c0: Fp62.add(Fp62.mulByNonresidue(b), a),
        c1: Fp62.sub(e, Fp62.add(a, b))
      };
    },
    // A cyclotomic group is a subgroup of Fp^n defined by
    //   GΦₙ(p) = {α ∈ Fpⁿ : α^Φₙ(p) = 1}
    // The result of any pairing is in a cyclotomic subgroup
    // https://eprint.iacr.org/2009/565.pdf
    _cyclotomicSquare: opts.Fp12cyclotomicSquare,
    _cyclotomicExp: opts.Fp12cyclotomicExp,
    // https://eprint.iacr.org/2010/354.pdf
    // https://eprint.iacr.org/2009/565.pdf
    finalExponentiate: opts.Fp12finalExponentiate
  };
  return { Fp: Fp3, Fp2: Fp22, Fp6: Fp62, Fp4Square: Fp4Square2, Fp12: Fp122 };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n$1 = BigInt(0), _1n$2 = BigInt(1), _2n$2 = BigInt(2), _3n = BigInt(3), _4n = BigInt(4);
const BLS_X = BigInt("0xd201000000010000");
const BLS_X_LEN = bitLen(BLS_X);
const { Fp: Fp$1, Fp2, Fp6, Fp4Square, Fp12 } = tower12({
  // Order of Fp
  ORDER: BigInt("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab"),
  // Finite extension field over irreducible polynominal.
  // Fp(u) / (u² - β) where β = -1
  FP2_NONRESIDUE: [_1n$2, _1n$2],
  Fp2mulByB: ({ c0, c1 }) => {
    const t0 = Fp$1.mul(c0, _4n);
    const t1 = Fp$1.mul(c1, _4n);
    return { c0: Fp$1.sub(t0, t1), c1: Fp$1.add(t0, t1) };
  },
  // Fp12
  // A cyclotomic group is a subgroup of Fp^n defined by
  //   GΦₙ(p) = {α ∈ Fpⁿ : α^Φₙ(p) = 1}
  // The result of any pairing is in a cyclotomic subgroup
  // https://eprint.iacr.org/2009/565.pdf
  Fp12cyclotomicSquare: ({ c0, c1 }) => {
    const { c0: c0c0, c1: c0c1, c2: c0c2 } = c0;
    const { c0: c1c0, c1: c1c1, c2: c1c2 } = c1;
    const { first: t3, second: t4 } = Fp4Square(c0c0, c1c1);
    const { first: t5, second: t6 } = Fp4Square(c1c0, c0c2);
    const { first: t7, second: t8 } = Fp4Square(c0c1, c1c2);
    const t9 = Fp2.mulByNonresidue(t8);
    return {
      c0: Fp6.create({
        c0: Fp2.add(Fp2.mul(Fp2.sub(t3, c0c0), _2n$2), t3),
        // 2 * (T3 - c0c0)  + T3
        c1: Fp2.add(Fp2.mul(Fp2.sub(t5, c0c1), _2n$2), t5),
        // 2 * (T5 - c0c1)  + T5
        c2: Fp2.add(Fp2.mul(Fp2.sub(t7, c0c2), _2n$2), t7)
      }),
      // 2 * (T7 - c0c2)  + T7
      c1: Fp6.create({
        c0: Fp2.add(Fp2.mul(Fp2.add(t9, c1c0), _2n$2), t9),
        // 2 * (T9 + c1c0) + T9
        c1: Fp2.add(Fp2.mul(Fp2.add(t4, c1c1), _2n$2), t4),
        // 2 * (T4 + c1c1) + T4
        c2: Fp2.add(Fp2.mul(Fp2.add(t6, c1c2), _2n$2), t6)
      })
    };
  },
  Fp12cyclotomicExp(num, n) {
    let z = Fp12.ONE;
    for (let i = BLS_X_LEN - 1; i >= 0; i--) {
      z = Fp12._cyclotomicSquare(z);
      if (bitGet(n, i))
        z = Fp12.mul(z, num);
    }
    return z;
  },
  // https://eprint.iacr.org/2010/354.pdf
  // https://eprint.iacr.org/2009/565.pdf
  Fp12finalExponentiate: (num) => {
    const x = BLS_X;
    const t0 = Fp12.div(Fp12.frobeniusMap(num, 6), num);
    const t1 = Fp12.mul(Fp12.frobeniusMap(t0, 2), t0);
    const t2 = Fp12.conjugate(Fp12._cyclotomicExp(t1, x));
    const t3 = Fp12.mul(Fp12.conjugate(Fp12._cyclotomicSquare(t1)), t2);
    const t4 = Fp12.conjugate(Fp12._cyclotomicExp(t3, x));
    const t5 = Fp12.conjugate(Fp12._cyclotomicExp(t4, x));
    const t6 = Fp12.mul(Fp12.conjugate(Fp12._cyclotomicExp(t5, x)), Fp12._cyclotomicSquare(t2));
    const t7 = Fp12.conjugate(Fp12._cyclotomicExp(t6, x));
    const t2_t5_pow_q2 = Fp12.frobeniusMap(Fp12.mul(t2, t5), 2);
    const t4_t1_pow_q3 = Fp12.frobeniusMap(Fp12.mul(t4, t1), 3);
    const t6_t1c_pow_q1 = Fp12.frobeniusMap(Fp12.mul(t6, Fp12.conjugate(t1)), 1);
    const t7_t3c_t1 = Fp12.mul(Fp12.mul(t7, Fp12.conjugate(t3)), t1);
    return Fp12.mul(Fp12.mul(Fp12.mul(t2_t5_pow_q2, t4_t1_pow_q3), t6_t1c_pow_q1), t7_t3c_t1);
  }
});
const Fr = Field(BigInt("0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001"));
const isogenyMapG2 = isogenyMap(Fp2, [
  // xNum
  [
    [
      "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97d6",
      "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97d6"
    ],
    [
      "0x0",
      "0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71a"
    ],
    [
      "0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71e",
      "0x8ab05f8bdd54cde190937e76bc3e447cc27c3d6fbd7063fcd104635a790520c0a395554e5c6aaaa9354ffffffffe38d"
    ],
    [
      "0x171d6541fa38ccfaed6dea691f5fb614cb14b4e7f4e810aa22d6108f142b85757098e38d0f671c7188e2aaaaaaaa5ed1",
      "0x0"
    ]
  ],
  // xDen
  [
    [
      "0x0",
      "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa63"
    ],
    [
      "0xc",
      "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa9f"
    ],
    ["0x1", "0x0"]
    // LAST 1
  ],
  // yNum
  [
    [
      "0x1530477c7ab4113b59a4c18b076d11930f7da5d4a07f649bf54439d87d27e500fc8c25ebf8c92f6812cfc71c71c6d706",
      "0x1530477c7ab4113b59a4c18b076d11930f7da5d4a07f649bf54439d87d27e500fc8c25ebf8c92f6812cfc71c71c6d706"
    ],
    [
      "0x0",
      "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97be"
    ],
    [
      "0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71c",
      "0x8ab05f8bdd54cde190937e76bc3e447cc27c3d6fbd7063fcd104635a790520c0a395554e5c6aaaa9354ffffffffe38f"
    ],
    [
      "0x124c9ad43b6cf79bfbf7043de3811ad0761b0f37a1e26286b0e977c69aa274524e79097a56dc4bd9e1b371c71c718b10",
      "0x0"
    ]
  ],
  // yDen
  [
    [
      "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa8fb",
      "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa8fb"
    ],
    [
      "0x0",
      "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa9d3"
    ],
    [
      "0x12",
      "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa99"
    ],
    ["0x1", "0x0"]
    // LAST 1
  ]
].map((i) => i.map((pair) => Fp2.fromBigTuple(pair.map(BigInt)))));
const isogenyMapG1 = isogenyMap(Fp$1, [
  // xNum
  [
    "0x11a05f2b1e833340b809101dd99815856b303e88a2d7005ff2627b56cdb4e2c85610c2d5f2e62d6eaeac1662734649b7",
    "0x17294ed3e943ab2f0588bab22147a81c7c17e75b2f6a8417f565e33c70d1e86b4838f2a6f318c356e834eef1b3cb83bb",
    "0xd54005db97678ec1d1048c5d10a9a1bce032473295983e56878e501ec68e25c958c3e3d2a09729fe0179f9dac9edcb0",
    "0x1778e7166fcc6db74e0609d307e55412d7f5e4656a8dbf25f1b33289f1b330835336e25ce3107193c5b388641d9b6861",
    "0xe99726a3199f4436642b4b3e4118e5499db995a1257fb3f086eeb65982fac18985a286f301e77c451154ce9ac8895d9",
    "0x1630c3250d7313ff01d1201bf7a74ab5db3cb17dd952799b9ed3ab9097e68f90a0870d2dcae73d19cd13c1c66f652983",
    "0xd6ed6553fe44d296a3726c38ae652bfb11586264f0f8ce19008e218f9c86b2a8da25128c1052ecaddd7f225a139ed84",
    "0x17b81e7701abdbe2e8743884d1117e53356de5ab275b4db1a682c62ef0f2753339b7c8f8c8f475af9ccb5618e3f0c88e",
    "0x80d3cf1f9a78fc47b90b33563be990dc43b756ce79f5574a2c596c928c5d1de4fa295f296b74e956d71986a8497e317",
    "0x169b1f8e1bcfa7c42e0c37515d138f22dd2ecb803a0c5c99676314baf4bb1b7fa3190b2edc0327797f241067be390c9e",
    "0x10321da079ce07e272d8ec09d2565b0dfa7dccdde6787f96d50af36003b14866f69b771f8c285decca67df3f1605fb7b",
    "0x6e08c248e260e70bd1e962381edee3d31d79d7e22c837bc23c0bf1bc24c6b68c24b1b80b64d391fa9c8ba2e8ba2d229"
  ],
  // xDen
  [
    "0x8ca8d548cff19ae18b2e62f4bd3fa6f01d5ef4ba35b48ba9c9588617fc8ac62b558d681be343df8993cf9fa40d21b1c",
    "0x12561a5deb559c4348b4711298e536367041e8ca0cf0800c0126c2588c48bf5713daa8846cb026e9e5c8276ec82b3bff",
    "0xb2962fe57a3225e8137e629bff2991f6f89416f5a718cd1fca64e00b11aceacd6a3d0967c94fedcfcc239ba5cb83e19",
    "0x3425581a58ae2fec83aafef7c40eb545b08243f16b1655154cca8abc28d6fd04976d5243eecf5c4130de8938dc62cd8",
    "0x13a8e162022914a80a6f1d5f43e7a07dffdfc759a12062bb8d6b44e833b306da9bd29ba81f35781d539d395b3532a21e",
    "0xe7355f8e4e667b955390f7f0506c6e9395735e9ce9cad4d0a43bcef24b8982f7400d24bc4228f11c02df9a29f6304a5",
    "0x772caacf16936190f3e0c63e0596721570f5799af53a1894e2e073062aede9cea73b3538f0de06cec2574496ee84a3a",
    "0x14a7ac2a9d64a8b230b3f5b074cf01996e7f63c21bca68a81996e1cdf9822c580fa5b9489d11e2d311f7d99bbdcc5a5e",
    "0xa10ecf6ada54f825e920b3dafc7a3cce07f8d1d7161366b74100da67f39883503826692abba43704776ec3a79a1d641",
    "0x95fc13ab9e92ad4476d6e3eb3a56680f682b4ee96f7d03776df533978f31c1593174e4b4b7865002d6384d168ecdd0a",
    "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
    // LAST 1
  ],
  // yNum
  [
    "0x90d97c81ba24ee0259d1f094980dcfa11ad138e48a869522b52af6c956543d3cd0c7aee9b3ba3c2be9845719707bb33",
    "0x134996a104ee5811d51036d776fb46831223e96c254f383d0f906343eb67ad34d6c56711962fa8bfe097e75a2e41c696",
    "0xcc786baa966e66f4a384c86a3b49942552e2d658a31ce2c344be4b91400da7d26d521628b00523b8dfe240c72de1f6",
    "0x1f86376e8981c217898751ad8746757d42aa7b90eeb791c09e4a3ec03251cf9de405aba9ec61deca6355c77b0e5f4cb",
    "0x8cc03fdefe0ff135caf4fe2a21529c4195536fbe3ce50b879833fd221351adc2ee7f8dc099040a841b6daecf2e8fedb",
    "0x16603fca40634b6a2211e11db8f0a6a074a7d0d4afadb7bd76505c3d3ad5544e203f6326c95a807299b23ab13633a5f0",
    "0x4ab0b9bcfac1bbcb2c977d027796b3ce75bb8ca2be184cb5231413c4d634f3747a87ac2460f415ec961f8855fe9d6f2",
    "0x987c8d5333ab86fde9926bd2ca6c674170a05bfe3bdd81ffd038da6c26c842642f64550fedfe935a15e4ca31870fb29",
    "0x9fc4018bd96684be88c9e221e4da1bb8f3abd16679dc26c1e8b6e6a1f20cabe69d65201c78607a360370e577bdba587",
    "0xe1bba7a1186bdb5223abde7ada14a23c42a0ca7915af6fe06985e7ed1e4d43b9b3f7055dd4eba6f2bafaaebca731c30",
    "0x19713e47937cd1be0dfd0b8f1d43fb93cd2fcbcb6caf493fd1183e416389e61031bf3a5cce3fbafce813711ad011c132",
    "0x18b46a908f36f6deb918c143fed2edcc523559b8aaf0c2462e6bfe7f911f643249d9cdf41b44d606ce07c8a4d0074d8e",
    "0xb182cac101b9399d155096004f53f447aa7b12a3426b08ec02710e807b4633f06c851c1919211f20d4c04f00b971ef8",
    "0x245a394ad1eca9b72fc00ae7be315dc757b3b080d4c158013e6632d3c40659cc6cf90ad1c232a6442d9d3f5db980133",
    "0x5c129645e44cf1102a159f748c4a3fc5e673d81d7e86568d9ab0f5d396a7ce46ba1049b6579afb7866b1e715475224b",
    "0x15e6be4e990f03ce4ea50b3b42df2eb5cb181d8f84965a3957add4fa95af01b2b665027efec01c7704b456be69c8b604"
  ],
  // yDen
  [
    "0x16112c4c3a9c98b252181140fad0eae9601a6de578980be6eec3232b5be72e7a07f3688ef60c206d01479253b03663c1",
    "0x1962d75c2381201e1a0cbd6c43c348b885c84ff731c4d59ca4a10356f453e01f78a4260763529e3532f6102c2e49a03d",
    "0x58df3306640da276faaae7d6e8eb15778c4855551ae7f310c35a5dd279cd2eca6757cd636f96f891e2538b53dbf67f2",
    "0x16b7d288798e5395f20d23bf89edb4d1d115c5dbddbcd30e123da489e726af41727364f2c28297ada8d26d98445f5416",
    "0xbe0e079545f43e4b00cc912f8228ddcc6d19c9f0f69bbb0542eda0fc9dec916a20b15dc0fd2ededda39142311a5001d",
    "0x8d9e5297186db2d9fb266eaac783182b70152c65550d881c5ecd87b6f0f5a6449f38db9dfa9cce202c6477faaf9b7ac",
    "0x166007c08a99db2fc3ba8734ace9824b5eecfdfa8d0cf8ef5dd365bc400a0051d5fa9c01a58b1fb93d1a1399126a775c",
    "0x16a3ef08be3ea7ea03bcddfabba6ff6ee5a4375efa1f4fd7feb34fd206357132b920f5b00801dee460ee415a15812ed9",
    "0x1866c8ed336c61231a1be54fd1d74cc4f9fb0ce4c6af5920abc5750c4bf39b4852cfe2f7bb9248836b233d9d55535d4a",
    "0x167a55cda70a6e1cea820597d94a84903216f763e13d87bb5308592e7ea7d4fbc7385ea3d529b35e346ef48bb8913f55",
    "0x4d2f259eea405bd48f010a01ad2911d9c6dd039bb61a6290e591b36e636a5c871a5c29f4f83060400f8b49cba8f6aa8",
    "0xaccbb67481d033ff5852c1e48c50c477f94ff8aefce42d28c0f9a88cea7913516f968986f7ebbea9684b529e2561092",
    "0xad6b9514c767fe3c3613144b45f1496543346d98adf02267d5ceef9a00d9b8693000763e3b90ac11e99b138573345cc",
    "0x2660400eb2e4f3b628bdd0d53cd76f2bf565b94e72927c1cb748df27942480e420517bd8714cc80d1fadc1326ed06f7",
    "0xe0fa1d816ddc03e6b24255e0d7819c171c40f65e273b853324efcd6356caa205ca2f570f13497804415473a1d634b8f",
    "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
    // LAST 1
  ]
].map((i) => i.map((j) => BigInt(j))));
const G2_SWU = mapToCurveSimpleSWU(Fp2, {
  A: Fp2.create({ c0: Fp$1.create(_0n$1), c1: Fp$1.create(BigInt(240)) }),
  // A' = 240 * I
  B: Fp2.create({ c0: Fp$1.create(BigInt(1012)), c1: Fp$1.create(BigInt(1012)) }),
  // B' = 1012 * (1 + I)
  Z: Fp2.create({ c0: Fp$1.create(BigInt(-2)), c1: Fp$1.create(BigInt(-1)) })
  // Z: -(2 + I)
});
const G1_SWU = mapToCurveSimpleSWU(Fp$1, {
  A: Fp$1.create(BigInt("0x144698a3b8e9433d693a02c96d4982b0ea985383ee66a8d8e8981aefd881ac98936f8da0e0f97f5cf428082d584c1d")),
  B: Fp$1.create(BigInt("0x12e2908d11688030018b12e8753eee3b2016c1f0f24f4070a0b9c14fcef35ef55a23215a316ceaa5d1cc48e98e172be0")),
  Z: Fp$1.create(BigInt(11))
});
const { G2psi, G2psi2 } = psiFrobenius(Fp$1, Fp2, Fp2.div(Fp2.ONE, Fp2.NONRESIDUE));
const htfDefaults = Object.freeze({
  // DST: a domain separation tag
  // defined in section 2.2.5
  // Use utils.getDSTLabel(), utils.setDSTLabel(value)
  DST: "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_",
  encodeDST: "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_",
  // p: the characteristic of F
  //    where F is a finite field of characteristic p and order q = p^m
  p: Fp$1.ORDER,
  // m: the extension degree of F, m >= 1
  //     where F is a finite field of characteristic p and order q = p^m
  m: 2,
  // k: the target security level for the suite in bits
  // defined in section 5.1
  k: 128,
  // option to use a message that has already been processed by
  // expand_message_xmd
  expand: "xmd",
  // Hash functions for: expand_message_xmd is appropriate for use with a
  // wide range of hash functions, including SHA-2, SHA-3, BLAKE2, and others.
  // BBS+ uses blake2: https://github.com/hyperledger/aries-framework-go/issues/2247
  hash: sha256
});
const COMPRESSED_ZERO = setMask(Fp$1.toBytes(_0n$1), { infinity: true, compressed: true });
function parseMask(bytes2) {
  bytes2 = bytes2.slice();
  const mask = bytes2[0] & 224;
  const compressed = !!(mask >> 7 & 1);
  const infinity = !!(mask >> 6 & 1);
  const sort = !!(mask >> 5 & 1);
  bytes2[0] &= 31;
  return { compressed, infinity, sort, value: bytes2 };
}
function setMask(bytes2, mask) {
  if (bytes2[0] & 224)
    throw new Error("setMask: non-empty mask");
  if (mask.compressed)
    bytes2[0] |= 128;
  if (mask.infinity)
    bytes2[0] |= 64;
  if (mask.sort)
    bytes2[0] |= 32;
  return bytes2;
}
function signatureG1ToRawBytes(point) {
  point.assertValidity();
  const isZero = point.equals(bls12_381.G1.ProjectivePoint.ZERO);
  const { x, y } = point.toAffine();
  if (isZero)
    return COMPRESSED_ZERO.slice();
  const P = Fp$1.ORDER;
  const sort = Boolean(y * _2n$2 / P);
  return setMask(numberToBytesBE(x, Fp$1.BYTES), { compressed: true, sort });
}
function signatureG2ToRawBytes(point) {
  point.assertValidity();
  const len = Fp$1.BYTES;
  if (point.equals(bls12_381.G2.ProjectivePoint.ZERO))
    return concatBytes(COMPRESSED_ZERO, numberToBytesBE(_0n$1, len));
  const { x, y } = point.toAffine();
  const { re: x0, im: x1 } = Fp2.reim(x);
  const { re: y0, im: y1 } = Fp2.reim(y);
  const tmp = y1 > _0n$1 ? y1 * _2n$2 : y0 * _2n$2;
  const sort = Boolean(tmp / Fp$1.ORDER & _1n$2);
  const z2 = x0;
  return concatBytes(setMask(numberToBytesBE(x1, len), { sort, compressed: true }), numberToBytesBE(z2, len));
}
const bls12_381 = bls({
  // Fields
  fields: {
    Fp: Fp$1,
    Fp2,
    Fp6,
    Fp12,
    Fr
  },
  // G1 is the order-q subgroup of E1(Fp) : y² = x³ + 4, #E1(Fp) = h1q, where
  // characteristic; z + (z⁴ - z² + 1)(z - 1)²/3
  G1: {
    Fp: Fp$1,
    // cofactor; (z - 1)²/3
    h: BigInt("0x396c8c005555e1568c00aaab0000aaab"),
    // generator's coordinates
    // x = 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507
    // y = 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569
    Gx: BigInt("0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb"),
    Gy: BigInt("0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1"),
    a: Fp$1.ZERO,
    b: _4n,
    htfDefaults: { ...htfDefaults, m: 1, DST: "BLS_SIG_BLS12381G1_XMD:SHA-256_SSWU_RO_NUL_" },
    wrapPrivateKey: true,
    allowInfinityPoint: true,
    // Checks is the point resides in prime-order subgroup.
    // point.isTorsionFree() should return true for valid points
    // It returns false for shitty points.
    // https://eprint.iacr.org/2021/1130.pdf
    isTorsionFree: (c2, point) => {
      const cubicRootOfUnityModP = BigInt("0x5f19672fdf76ce51ba69c6076a0f77eaddb3a93be6f89688de17d813620a00022e01fffffffefffe");
      const phi = new c2(Fp$1.mul(point.px, cubicRootOfUnityModP), point.py, point.pz);
      const xP = point.multiplyUnsafe(BLS_X).negate();
      const u2P = xP.multiplyUnsafe(BLS_X);
      return u2P.equals(phi);
    },
    // Clear cofactor of G1
    // https://eprint.iacr.org/2019/403
    clearCofactor: (_c, point) => {
      return point.multiplyUnsafe(BLS_X).add(point);
    },
    mapToCurve: (scalars) => {
      const { x, y } = G1_SWU(Fp$1.create(scalars[0]));
      return isogenyMapG1(x, y);
    },
    fromBytes: (bytes2) => {
      const { compressed, infinity, sort, value: value2 } = parseMask(bytes2);
      if (value2.length === 48 && compressed) {
        const P = Fp$1.ORDER;
        const compressedValue = bytesToNumberBE(value2);
        const x = Fp$1.create(compressedValue & Fp$1.MASK);
        if (infinity) {
          if (x !== _0n$1)
            throw new Error("G1: non-empty compressed point at infinity");
          return { x: _0n$1, y: _0n$1 };
        }
        const right = Fp$1.add(Fp$1.pow(x, _3n), Fp$1.create(bls12_381.params.G1b));
        let y = Fp$1.sqrt(right);
        if (!y)
          throw new Error("invalid compressed G1 point");
        if (y * _2n$2 / P !== BigInt(sort))
          y = Fp$1.neg(y);
        return { x: Fp$1.create(x), y: Fp$1.create(y) };
      } else if (value2.length === 96 && !compressed) {
        const x = bytesToNumberBE(value2.subarray(0, Fp$1.BYTES));
        const y = bytesToNumberBE(value2.subarray(Fp$1.BYTES));
        if (infinity) {
          if (x !== _0n$1 || y !== _0n$1)
            throw new Error("G1: non-empty point at infinity");
          return bls12_381.G1.ProjectivePoint.ZERO.toAffine();
        }
        return { x: Fp$1.create(x), y: Fp$1.create(y) };
      } else {
        throw new Error("invalid point G1, expected 48/96 bytes");
      }
    },
    toBytes: (c2, point, isCompressed) => {
      const isZero = point.equals(c2.ZERO);
      const { x, y } = point.toAffine();
      if (isCompressed) {
        if (isZero)
          return COMPRESSED_ZERO.slice();
        const P = Fp$1.ORDER;
        const sort = Boolean(y * _2n$2 / P);
        return setMask(numberToBytesBE(x, Fp$1.BYTES), { compressed: true, sort });
      } else {
        if (isZero) {
          const x2 = concatBytes(new Uint8Array([64]), new Uint8Array(2 * Fp$1.BYTES - 1));
          return x2;
        } else {
          return concatBytes(numberToBytesBE(x, Fp$1.BYTES), numberToBytesBE(y, Fp$1.BYTES));
        }
      }
    },
    ShortSignature: {
      fromHex(hex) {
        const { infinity, sort, value: value2 } = parseMask(ensureBytes("signatureHex", hex, 48));
        const P = Fp$1.ORDER;
        const compressedValue = bytesToNumberBE(value2);
        if (infinity)
          return bls12_381.G1.ProjectivePoint.ZERO;
        const x = Fp$1.create(compressedValue & Fp$1.MASK);
        const right = Fp$1.add(Fp$1.pow(x, _3n), Fp$1.create(bls12_381.params.G1b));
        let y = Fp$1.sqrt(right);
        if (!y)
          throw new Error("invalid compressed G1 point");
        const aflag = BigInt(sort);
        if (y * _2n$2 / P !== aflag)
          y = Fp$1.neg(y);
        const point = bls12_381.G1.ProjectivePoint.fromAffine({ x, y });
        point.assertValidity();
        return point;
      },
      toRawBytes(point) {
        return signatureG1ToRawBytes(point);
      },
      toHex(point) {
        return bytesToHex(signatureG1ToRawBytes(point));
      }
    }
  },
  // G2 is the order-q subgroup of E2(Fp²) : y² = x³+4(1+√−1),
  // where Fp2 is Fp[√−1]/(x2+1). #E2(Fp2 ) = h2q, where
  // G² - 1
  // h2q
  G2: {
    Fp: Fp2,
    // cofactor
    h: BigInt("0x5d543a95414e7f1091d50792876a202cd91de4547085abaa68a205b2e5a7ddfa628f1cb4d9e82ef21537e293a6691ae1616ec6e786f0c70cf1c38e31c7238e5"),
    Gx: Fp2.fromBigTuple([
      BigInt("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8"),
      BigInt("0x13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e")
    ]),
    // y =
    // 927553665492332455747201965776037880757740193453592970025027978793976877002675564980949289727957565575433344219582,
    // 1985150602287291935568054521177171638300868978215655730859378665066344726373823718423869104263333984641494340347905
    Gy: Fp2.fromBigTuple([
      BigInt("0x0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801"),
      BigInt("0x0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be")
    ]),
    a: Fp2.ZERO,
    b: Fp2.fromBigTuple([_4n, _4n]),
    hEff: BigInt("0xbc69f08f2ee75b3584c6a0ea91b352888e2a8e9145ad7689986ff031508ffe1329c2f178731db956d82bf015d1212b02ec0ec69d7477c1ae954cbc06689f6a359894c0adebbf6b4e8020005aaa95551"),
    htfDefaults: { ...htfDefaults },
    wrapPrivateKey: true,
    allowInfinityPoint: true,
    mapToCurve: (scalars) => {
      const { x, y } = G2_SWU(Fp2.fromBigTuple(scalars));
      return isogenyMapG2(x, y);
    },
    // Checks is the point resides in prime-order subgroup.
    // point.isTorsionFree() should return true for valid points
    // It returns false for shitty points.
    // https://eprint.iacr.org/2021/1130.pdf
    isTorsionFree: (c2, P) => {
      return P.multiplyUnsafe(BLS_X).negate().equals(G2psi(c2, P));
    },
    // Maps the point into the prime-order subgroup G2.
    // clear_cofactor_bls12381_g2 from cfrg-hash-to-curve-11
    // https://eprint.iacr.org/2017/419.pdf
    // prettier-ignore
    clearCofactor: (c2, P) => {
      const x = BLS_X;
      let t1 = P.multiplyUnsafe(x).negate();
      let t2 = G2psi(c2, P);
      let t3 = P.double();
      t3 = G2psi2(c2, t3);
      t3 = t3.subtract(t2);
      t2 = t1.add(t2);
      t2 = t2.multiplyUnsafe(x).negate();
      t3 = t3.add(t2);
      t3 = t3.subtract(t1);
      const Q = t3.subtract(P);
      return Q;
    },
    fromBytes: (bytes2) => {
      const { compressed, infinity, sort, value: value2 } = parseMask(bytes2);
      if (!compressed && !infinity && sort || // 00100000
      !compressed && infinity && sort || // 01100000
      sort && infinity && compressed) {
        throw new Error("invalid encoding flag: " + (bytes2[0] & 224));
      }
      const L = Fp$1.BYTES;
      const slc = (b, from, to) => bytesToNumberBE(b.slice(from, to));
      if (value2.length === 96 && compressed) {
        const b = bls12_381.params.G2b;
        const P = Fp$1.ORDER;
        if (infinity) {
          if (value2.reduce((p, c2) => p !== 0 ? c2 + 1 : c2, 0) > 0) {
            throw new Error("invalid compressed G2 point");
          }
          return { x: Fp2.ZERO, y: Fp2.ZERO };
        }
        const x_1 = slc(value2, 0, L);
        const x_0 = slc(value2, L, 2 * L);
        const x = Fp2.create({ c0: Fp$1.create(x_0), c1: Fp$1.create(x_1) });
        const right = Fp2.add(Fp2.pow(x, _3n), b);
        let y = Fp2.sqrt(right);
        const Y_bit = y.c1 === _0n$1 ? y.c0 * _2n$2 / P : y.c1 * _2n$2 / P ? _1n$2 : _0n$1;
        y = sort && Y_bit > 0 ? y : Fp2.neg(y);
        return { x, y };
      } else if (value2.length === 192 && !compressed) {
        if (infinity) {
          if (value2.reduce((p, c2) => p !== 0 ? c2 + 1 : c2, 0) > 0) {
            throw new Error("invalid uncompressed G2 point");
          }
          return { x: Fp2.ZERO, y: Fp2.ZERO };
        }
        const x1 = slc(value2, 0, L);
        const x0 = slc(value2, L, 2 * L);
        const y1 = slc(value2, 2 * L, 3 * L);
        const y0 = slc(value2, 3 * L, 4 * L);
        return { x: Fp2.fromBigTuple([x0, x1]), y: Fp2.fromBigTuple([y0, y1]) };
      } else {
        throw new Error("invalid point G2, expected 96/192 bytes");
      }
    },
    toBytes: (c2, point, isCompressed) => {
      const { BYTES: len, ORDER: P } = Fp$1;
      const isZero = point.equals(c2.ZERO);
      const { x, y } = point.toAffine();
      if (isCompressed) {
        if (isZero)
          return concatBytes(COMPRESSED_ZERO, numberToBytesBE(_0n$1, len));
        const flag = Boolean(y.c1 === _0n$1 ? y.c0 * _2n$2 / P : y.c1 * _2n$2 / P);
        return concatBytes(setMask(numberToBytesBE(x.c1, len), { compressed: true, sort: flag }), numberToBytesBE(x.c0, len));
      } else {
        if (isZero)
          return concatBytes(new Uint8Array([64]), new Uint8Array(4 * len - 1));
        const { re: x0, im: x1 } = Fp2.reim(x);
        const { re: y0, im: y1 } = Fp2.reim(y);
        return concatBytes(numberToBytesBE(x1, len), numberToBytesBE(x0, len), numberToBytesBE(y1, len), numberToBytesBE(y0, len));
      }
    },
    Signature: {
      // TODO: Optimize, it's very slow because of sqrt.
      fromHex(hex) {
        const { infinity, sort, value: value2 } = parseMask(ensureBytes("signatureHex", hex));
        const P = Fp$1.ORDER;
        const half = value2.length / 2;
        if (half !== 48 && half !== 96)
          throw new Error("invalid compressed signature length, must be 96 or 192");
        const z1 = bytesToNumberBE(value2.slice(0, half));
        const z2 = bytesToNumberBE(value2.slice(half));
        if (infinity)
          return bls12_381.G2.ProjectivePoint.ZERO;
        const x1 = Fp$1.create(z1 & Fp$1.MASK);
        const x2 = Fp$1.create(z2);
        const x = Fp2.create({ c0: x2, c1: x1 });
        const y2 = Fp2.add(Fp2.pow(x, _3n), bls12_381.params.G2b);
        let y = Fp2.sqrt(y2);
        if (!y)
          throw new Error("Failed to find a square root");
        const { re: y0, im: y1 } = Fp2.reim(y);
        const aflag1 = BigInt(sort);
        const isGreater = y1 > _0n$1 && y1 * _2n$2 / P !== aflag1;
        const isZero = y1 === _0n$1 && y0 * _2n$2 / P !== aflag1;
        if (isGreater || isZero)
          y = Fp2.neg(y);
        const point = bls12_381.G2.ProjectivePoint.fromAffine({ x, y });
        point.assertValidity();
        return point;
      },
      toRawBytes(point) {
        return signatureG2ToRawBytes(point);
      },
      toHex(point) {
        return bytesToHex(signatureG2ToRawBytes(point));
      }
    }
  },
  params: {
    ateLoopSize: BLS_X,
    // The BLS parameter x for BLS12-381
    r: Fr.ORDER,
    // order; z⁴ − z² + 1; CURVE.n from other curves
    xNegative: true,
    twistType: "multiplicative"
  },
  htfDefaults,
  hash: sha256,
  randomBytes
});
function blsVerify(pk, sig, msg) {
  const primaryKey = typeof pk === "string" ? pk : toHex(pk);
  const signature = typeof sig === "string" ? sig : toHex(sig);
  const message = typeof msg === "string" ? msg : toHex(msg);
  return bls12_381.verifyShortSignature(signature, message, primaryKey);
}
const decodeLeb128 = (buf) => {
  return lebDecode(new PipeArrayBuffer(buf));
};
const decodeTime = (buf) => {
  const decoded = decodeLeb128(buf);
  return new Date(Number(decoded) / 1e6);
};
var __classPrivateFieldSet$8 = globalThis && globalThis.__classPrivateFieldSet || function(receiver, state, value2, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value2) : f ? f.value = value2 : state.set(receiver, value2), value2;
};
var __classPrivateFieldGet$8 = globalThis && globalThis.__classPrivateFieldGet || function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Certificate_disableTimeVerification;
class CertificateVerificationError extends AgentError {
  constructor(reason) {
    super(`Invalid certificate: ${reason}`);
  }
}
var NodeType;
(function(NodeType2) {
  NodeType2[NodeType2["Empty"] = 0] = "Empty";
  NodeType2[NodeType2["Fork"] = 1] = "Fork";
  NodeType2[NodeType2["Labeled"] = 2] = "Labeled";
  NodeType2[NodeType2["Leaf"] = 3] = "Leaf";
  NodeType2[NodeType2["Pruned"] = 4] = "Pruned";
})(NodeType || (NodeType = {}));
function isBufferGreaterThan(a, b) {
  const a8 = new Uint8Array(a);
  const b8 = new Uint8Array(b);
  for (let i = 0; i < a8.length; i++) {
    if (a8[i] > b8[i]) {
      return true;
    }
  }
  return false;
}
class Certificate {
  constructor(certificate, _rootKey, _canisterId, _blsVerify, _maxAgeInMinutes = 5, disableTimeVerification = false) {
    this._rootKey = _rootKey;
    this._canisterId = _canisterId;
    this._blsVerify = _blsVerify;
    this._maxAgeInMinutes = _maxAgeInMinutes;
    _Certificate_disableTimeVerification.set(this, false);
    __classPrivateFieldSet$8(this, _Certificate_disableTimeVerification, disableTimeVerification, "f");
    this.cert = decode(new Uint8Array(certificate));
  }
  /**
   * Create a new instance of a certificate, automatically verifying it. Throws a
   * CertificateVerificationError if the certificate cannot be verified.
   * @constructs  Certificate
   * @param {CreateCertificateOptions} options {@link CreateCertificateOptions}
   * @param {ArrayBuffer} options.certificate The bytes of the certificate
   * @param {ArrayBuffer} options.rootKey The root key to verify against
   * @param {Principal} options.canisterId The effective or signing canister ID
   * @param {number} options.maxAgeInMinutes The maximum age of the certificate in minutes. Default is 5 minutes.
   * @throws {CertificateVerificationError}
   */
  static async create(options) {
    const cert = Certificate.createUnverified(options);
    await cert.verify();
    return cert;
  }
  static createUnverified(options) {
    let blsVerify$1 = options.blsVerify;
    if (!blsVerify$1) {
      blsVerify$1 = blsVerify;
    }
    return new Certificate(options.certificate, options.rootKey, options.canisterId, blsVerify$1, options.maxAgeInMinutes, options.disableTimeVerification);
  }
  lookup(path) {
    return lookup_path(path, this.cert.tree);
  }
  lookup_label(label) {
    return this.lookup([label]);
  }
  async verify() {
    const rootHash = await reconstruct(this.cert.tree);
    const derKey = await this._checkDelegationAndGetKey(this.cert.delegation);
    const sig = this.cert.signature;
    const key = extractDER(derKey);
    const msg = concat$1(domain_sep("ic-state-root"), rootHash);
    let sigVer = false;
    const lookupTime = lookupResultToBuffer(this.lookup(["time"]));
    if (!lookupTime) {
      throw new CertificateVerificationError("Certificate does not contain a time");
    }
    if (!__classPrivateFieldGet$8(this, _Certificate_disableTimeVerification, "f")) {
      const FIVE_MINUTES_IN_MSEC2 = 5 * 60 * 1e3;
      const MAX_AGE_IN_MSEC = this._maxAgeInMinutes * 60 * 1e3;
      const now = Date.now();
      const earliestCertificateTime = now - MAX_AGE_IN_MSEC;
      const fiveMinutesFromNow = now + FIVE_MINUTES_IN_MSEC2;
      const certTime = decodeTime(lookupTime);
      if (certTime.getTime() < earliestCertificateTime) {
        throw new CertificateVerificationError(`Certificate is signed more than ${this._maxAgeInMinutes} minutes in the past. Certificate time: ` + certTime.toISOString() + " Current time: " + new Date(now).toISOString());
      } else if (certTime.getTime() > fiveMinutesFromNow) {
        throw new CertificateVerificationError("Certificate is signed more than 5 minutes in the future. Certificate time: " + certTime.toISOString() + " Current time: " + new Date(now).toISOString());
      }
    }
    try {
      sigVer = await this._blsVerify(new Uint8Array(key), new Uint8Array(sig), new Uint8Array(msg));
    } catch (err) {
      sigVer = false;
    }
    if (!sigVer) {
      throw new CertificateVerificationError("Signature verification failed");
    }
  }
  async _checkDelegationAndGetKey(d) {
    if (!d) {
      return this._rootKey;
    }
    const cert = await Certificate.createUnverified({
      certificate: d.certificate,
      rootKey: this._rootKey,
      canisterId: this._canisterId,
      blsVerify: this._blsVerify,
      // Do not check max age for delegation certificates
      maxAgeInMinutes: Infinity
    });
    if (cert.cert.delegation) {
      throw new CertificateVerificationError("Delegation certificates cannot be nested");
    }
    await cert.verify();
    if (this._canisterId.toString() !== MANAGEMENT_CANISTER_ID) {
      const canisterInRange = check_canister_ranges({
        canisterId: this._canisterId,
        subnetId: Principal$1.fromUint8Array(new Uint8Array(d.subnet_id)),
        tree: cert.cert.tree
      });
      if (!canisterInRange) {
        throw new CertificateVerificationError(`Canister ${this._canisterId} not in range of delegations for subnet 0x${toHex(d.subnet_id)}`);
      }
    }
    const publicKeyLookup = lookupResultToBuffer(cert.lookup(["subnet", d.subnet_id, "public_key"]));
    if (!publicKeyLookup) {
      throw new Error(`Could not find subnet key for subnet 0x${toHex(d.subnet_id)}`);
    }
    return publicKeyLookup;
  }
}
_Certificate_disableTimeVerification = /* @__PURE__ */ new WeakMap();
const DER_PREFIX = fromHex("308182301d060d2b0601040182dc7c0503010201060c2b0601040182dc7c05030201036100");
const KEY_LENGTH = 96;
function extractDER(buf) {
  const expectedLength = DER_PREFIX.byteLength + KEY_LENGTH;
  if (buf.byteLength !== expectedLength) {
    throw new TypeError(`BLS DER-encoded public key must be ${expectedLength} bytes long`);
  }
  const prefix = buf.slice(0, DER_PREFIX.byteLength);
  if (!bufEquals(prefix, DER_PREFIX)) {
    throw new TypeError(`BLS DER-encoded public key is invalid. Expect the following prefix: ${DER_PREFIX}, but get ${prefix}`);
  }
  return buf.slice(DER_PREFIX.byteLength);
}
function lookupResultToBuffer(result) {
  if (result.status !== LookupStatus.Found) {
    return void 0;
  }
  if (result.value instanceof ArrayBuffer) {
    return result.value;
  }
  if (result.value instanceof Uint8Array) {
    return result.value.buffer;
  }
  return void 0;
}
async function reconstruct(t) {
  switch (t[0]) {
    case NodeType.Empty:
      return hash(domain_sep("ic-hashtree-empty"));
    case NodeType.Pruned:
      return t[1];
    case NodeType.Leaf:
      return hash(concat$1(domain_sep("ic-hashtree-leaf"), t[1]));
    case NodeType.Labeled:
      return hash(concat$1(domain_sep("ic-hashtree-labeled"), t[1], await reconstruct(t[2])));
    case NodeType.Fork:
      return hash(concat$1(domain_sep("ic-hashtree-fork"), await reconstruct(t[1]), await reconstruct(t[2])));
    default:
      throw new Error("unreachable");
  }
}
function domain_sep(s) {
  const len = new Uint8Array([s.length]);
  const str = new TextEncoder().encode(s);
  return concat$1(len, str);
}
var LookupStatus;
(function(LookupStatus2) {
  LookupStatus2["Unknown"] = "unknown";
  LookupStatus2["Absent"] = "absent";
  LookupStatus2["Found"] = "found";
})(LookupStatus || (LookupStatus = {}));
var LabelLookupStatus;
(function(LabelLookupStatus2) {
  LabelLookupStatus2["Less"] = "less";
  LabelLookupStatus2["Greater"] = "greater";
})(LabelLookupStatus || (LabelLookupStatus = {}));
function lookup_path(path, tree) {
  if (path.length === 0) {
    switch (tree[0]) {
      case NodeType.Leaf: {
        if (!tree[1]) {
          throw new Error("Invalid tree structure for leaf");
        }
        if (tree[1] instanceof ArrayBuffer) {
          return {
            status: LookupStatus.Found,
            value: tree[1]
          };
        }
        if (tree[1] instanceof Uint8Array) {
          return {
            status: LookupStatus.Found,
            value: tree[1].buffer
          };
        }
        return {
          status: LookupStatus.Found,
          value: tree[1]
        };
      }
      default: {
        return {
          status: LookupStatus.Found,
          value: tree
        };
      }
    }
  }
  const label = typeof path[0] === "string" ? new TextEncoder().encode(path[0]) : path[0];
  const lookupResult = find_label(label, tree);
  switch (lookupResult.status) {
    case LookupStatus.Found: {
      return lookup_path(path.slice(1), lookupResult.value);
    }
    case LabelLookupStatus.Greater:
    case LabelLookupStatus.Less: {
      return {
        status: LookupStatus.Absent
      };
    }
    default: {
      return lookupResult;
    }
  }
}
function flatten_forks(t) {
  switch (t[0]) {
    case NodeType.Empty:
      return [];
    case NodeType.Fork:
      return flatten_forks(t[1]).concat(flatten_forks(t[2]));
    default:
      return [t];
  }
}
function find_label(label, tree) {
  switch (tree[0]) {
    case NodeType.Labeled:
      if (isBufferGreaterThan(label, tree[1])) {
        return {
          status: LabelLookupStatus.Greater
        };
      }
      if (bufEquals(label, tree[1])) {
        return {
          status: LookupStatus.Found,
          value: tree[2]
        };
      }
      return {
        status: LabelLookupStatus.Less
      };
    case NodeType.Fork:
      const leftLookupResult = find_label(label, tree[1]);
      switch (leftLookupResult.status) {
        case LabelLookupStatus.Greater: {
          const rightLookupResult = find_label(label, tree[2]);
          if (rightLookupResult.status === LabelLookupStatus.Less) {
            return {
              status: LookupStatus.Absent
            };
          }
          return rightLookupResult;
        }
        case LookupStatus.Unknown: {
          let rightLookupResult = find_label(label, tree[2]);
          if (rightLookupResult.status === LabelLookupStatus.Less) {
            return {
              status: LookupStatus.Unknown
            };
          }
          return rightLookupResult;
        }
        default: {
          return leftLookupResult;
        }
      }
    case NodeType.Pruned:
      return {
        status: LookupStatus.Unknown
      };
    default:
      return {
        status: LookupStatus.Absent
      };
  }
}
function check_canister_ranges(params) {
  const { canisterId: canisterId2, subnetId, tree } = params;
  const rangeLookup = lookup_path(["subnet", subnetId.toUint8Array(), "canister_ranges"], tree);
  if (rangeLookup.status !== LookupStatus.Found || !(rangeLookup.value instanceof ArrayBuffer)) {
    throw new Error(`Could not find canister ranges for subnet ${subnetId}`);
  }
  const ranges_arr = decode(rangeLookup.value);
  const ranges = ranges_arr.map((v) => [
    Principal$1.fromUint8Array(v[0]),
    Principal$1.fromUint8Array(v[1])
  ]);
  const canisterInRange = ranges.some((r) => r[0].ltEq(canisterId2) && r[1].gtEq(canisterId2));
  return canisterInRange;
}
class CustomPath {
  constructor(key, path, decodeStrategy) {
    this.key = key;
    this.path = path;
    this.decodeStrategy = decodeStrategy;
  }
}
const request = async (options) => {
  const { agent, paths } = options;
  const canisterId2 = Principal$1.from(options.canisterId);
  const uniquePaths = [...new Set(paths)];
  const encodedPaths = uniquePaths.map((path) => {
    return encodePath(path, canisterId2);
  });
  const status = /* @__PURE__ */ new Map();
  const promises = uniquePaths.map((path, index2) => {
    return (async () => {
      var _a2;
      try {
        const response = await agent.readState(canisterId2, {
          paths: [encodedPaths[index2]]
        });
        if (agent.rootKey == null) {
          throw new Error("Agent is missing root key");
        }
        const cert = await Certificate.create({
          certificate: response.certificate,
          rootKey: agent.rootKey,
          canisterId: canisterId2,
          disableTimeVerification: true
        });
        const lookup2 = (cert2, path3) => {
          if (path3 === "subnet") {
            if (agent.rootKey == null) {
              throw new Error("Agent is missing root key");
            }
            const data2 = fetchNodeKeys(response.certificate, canisterId2, agent.rootKey);
            return {
              path: path3,
              data: data2
            };
          } else {
            return {
              path: path3,
              data: lookupResultToBuffer(cert2.lookup(encodePath(path3, canisterId2)))
            };
          }
        };
        const { path: path2, data } = lookup2(cert, uniquePaths[index2]);
        if (!data) {
          console.warn(`Expected to find result for path ${path2}, but instead found nothing.`);
          if (typeof path2 === "string") {
            status.set(path2, null);
          } else {
            status.set(path2.key, null);
          }
        } else {
          switch (path2) {
            case "time": {
              status.set(path2, decodeTime(data));
              break;
            }
            case "controllers": {
              status.set(path2, decodeControllers(data));
              break;
            }
            case "module_hash": {
              status.set(path2, decodeHex(data));
              break;
            }
            case "subnet": {
              status.set(path2, data);
              break;
            }
            case "candid": {
              status.set(path2, new TextDecoder().decode(data));
              break;
            }
            default: {
              if (typeof path2 !== "string" && "key" in path2 && "path" in path2) {
                switch (path2.decodeStrategy) {
                  case "raw":
                    status.set(path2.key, data);
                    break;
                  case "leb128": {
                    status.set(path2.key, decodeLeb128(data));
                    break;
                  }
                  case "cbor": {
                    status.set(path2.key, decodeCbor(data));
                    break;
                  }
                  case "hex": {
                    status.set(path2.key, decodeHex(data));
                    break;
                  }
                  case "utf-8": {
                    status.set(path2.key, decodeUtf8(data));
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        if ((_a2 = error === null || error === void 0 ? void 0 : error.message) === null || _a2 === void 0 ? void 0 : _a2.includes("Invalid certificate")) {
          throw new AgentError(error.message);
        }
        if (typeof path !== "string" && "key" in path && "path" in path) {
          status.set(path.key, null);
        } else {
          status.set(path, null);
        }
        console.group();
        console.warn(`Expected to find result for path ${path}, but instead found nothing.`);
        console.warn(error);
        console.groupEnd();
      }
    })();
  });
  await Promise.all(promises);
  return status;
};
const fetchNodeKeys = (certificate, canisterId2, root_key) => {
  if (!canisterId2._isPrincipal) {
    throw new Error("Invalid canisterId");
  }
  const cert = decode(new Uint8Array(certificate));
  const tree = cert.tree;
  let delegation = cert.delegation;
  let subnetId;
  if (delegation && delegation.subnet_id) {
    subnetId = Principal$1.fromUint8Array(new Uint8Array(delegation.subnet_id));
  } else if (!delegation && typeof root_key !== "undefined") {
    subnetId = Principal$1.selfAuthenticating(new Uint8Array(root_key));
    delegation = {
      subnet_id: subnetId.toUint8Array(),
      certificate: new ArrayBuffer(0)
    };
  } else {
    subnetId = Principal$1.selfAuthenticating(Principal$1.fromText("tdb26-jop6k-aogll-7ltgs-eruif-6kk7m-qpktf-gdiqx-mxtrf-vb5e6-eqe").toUint8Array());
    delegation = {
      subnet_id: subnetId.toUint8Array(),
      certificate: new ArrayBuffer(0)
    };
  }
  const canisterInRange = check_canister_ranges({ canisterId: canisterId2, subnetId, tree });
  if (!canisterInRange) {
    throw new Error("Canister not in range");
  }
  const subnetLookupResult = lookup_path(["subnet", delegation.subnet_id, "node"], tree);
  if (subnetLookupResult.status !== LookupStatus.Found) {
    throw new Error("Node not found");
  }
  if (subnetLookupResult.value instanceof ArrayBuffer) {
    throw new Error("Invalid node tree");
  }
  const nodeForks = flatten_forks(subnetLookupResult.value);
  const nodeKeys = /* @__PURE__ */ new Map();
  nodeForks.forEach((fork) => {
    const node_id = Principal$1.from(new Uint8Array(fork[1])).toText();
    const publicKeyLookupResult = lookup_path(["public_key"], fork[2]);
    if (publicKeyLookupResult.status !== LookupStatus.Found) {
      throw new Error("Public key not found");
    }
    const derEncodedPublicKey = publicKeyLookupResult.value;
    if (derEncodedPublicKey.byteLength !== 44) {
      throw new Error("Invalid public key length");
    } else {
      nodeKeys.set(node_id, derEncodedPublicKey);
    }
  });
  return {
    subnetId: Principal$1.fromUint8Array(new Uint8Array(delegation.subnet_id)).toText(),
    nodeKeys
  };
};
const encodePath = (path, canisterId2) => {
  const encoder2 = new TextEncoder();
  const encode2 = (arg) => {
    return new DataView(encoder2.encode(arg).buffer).buffer;
  };
  const canisterBuffer = new DataView(canisterId2.toUint8Array().buffer).buffer;
  switch (path) {
    case "time":
      return [encode2("time")];
    case "controllers":
      return [encode2("canister"), canisterBuffer, encode2("controllers")];
    case "module_hash":
      return [encode2("canister"), canisterBuffer, encode2("module_hash")];
    case "subnet":
      return [encode2("subnet")];
    case "candid":
      return [encode2("canister"), canisterBuffer, encode2("metadata"), encode2("candid:service")];
    default: {
      if ("key" in path && "path" in path) {
        if (typeof path["path"] === "string" || path["path"] instanceof ArrayBuffer) {
          const metaPath = path.path;
          const encoded = typeof metaPath === "string" ? encode2(metaPath) : metaPath;
          return [encode2("canister"), canisterBuffer, encode2("metadata"), encoded];
        } else {
          return path["path"];
        }
      }
    }
  }
  throw new Error(`An unexpeected error was encountered while encoding your path for canister status. Please ensure that your path, ${path} was formatted correctly.`);
};
const decodeHex = (buf) => {
  return toHex(buf);
};
const decodeCbor = (buf) => {
  return decode(buf);
};
const decodeUtf8 = (buf) => {
  return new TextDecoder().decode(buf);
};
const decodeControllers = (buf) => {
  const controllersRaw = decodeCbor(buf);
  return controllersRaw.map((buf2) => {
    return Principal$1.fromUint8Array(new Uint8Array(buf2));
  });
};
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CustomPath,
  encodePath,
  fetchNodeKeys,
  request
}, Symbol.toStringTag, { value: "Module" }));
const U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
const _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  let Ah = new Uint32Array(lst.length);
  let Al = new Uint32Array(lst.length);
  for (let i = 0; i < lst.length; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
const toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
const shrSH = (h, _l, s) => h >>> s;
const shrSL = (h, l, s) => h << 32 - s | l >>> s;
const rotrSH = (h, l, s) => h >>> s | l << 32 - s;
const rotrSL = (h, l, s) => h << 32 - s | l >>> s;
const rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
const rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
const rotr32H = (_h, l) => l;
const rotr32L = (h, _l) => h;
const rotlSH = (h, l, s) => h << s | l >>> 32 - s;
const rotlSL = (h, l, s) => l << s | h >>> 32 - s;
const rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
const rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
const add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
const add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
const add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
const add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
const add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
const add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
const u64 = {
  fromBig,
  split,
  toBig,
  shrSH,
  shrSL,
  rotrSH,
  rotrSL,
  rotrBH,
  rotrBL,
  rotr32H,
  rotr32L,
  rotlSH,
  rotlSL,
  rotlBH,
  rotlBL,
  add,
  add3L,
  add3H,
  add4L,
  add4H,
  add5H,
  add5L
};
const u64$1 = u64;
const [SHA512_Kh, SHA512_Kl] = /* @__PURE__ */ (() => u64$1.split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n) => BigInt(n))))();
const SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
const SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
class SHA512 extends HashMD {
  constructor() {
    super(128, 64, 16, false);
    this.Ah = 1779033703 | 0;
    this.Al = 4089235720 | 0;
    this.Bh = 3144134277 | 0;
    this.Bl = 2227873595 | 0;
    this.Ch = 1013904242 | 0;
    this.Cl = 4271175723 | 0;
    this.Dh = 2773480762 | 0;
    this.Dl = 1595750129 | 0;
    this.Eh = 1359893119 | 0;
    this.El = 2917565137 | 0;
    this.Fh = 2600822924 | 0;
    this.Fl = 725511199 | 0;
    this.Gh = 528734635 | 0;
    this.Gl = 4215389547 | 0;
    this.Hh = 1541459225 | 0;
    this.Hl = 327033209 | 0;
  }
  // prettier-ignore
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
  }
  // prettier-ignore
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4) {
      SHA512_W_H[i] = view.getUint32(offset);
      SHA512_W_L[i] = view.getUint32(offset += 4);
    }
    for (let i = 16; i < 80; i++) {
      const W15h = SHA512_W_H[i - 15] | 0;
      const W15l = SHA512_W_L[i - 15] | 0;
      const s0h = u64$1.rotrSH(W15h, W15l, 1) ^ u64$1.rotrSH(W15h, W15l, 8) ^ u64$1.shrSH(W15h, W15l, 7);
      const s0l = u64$1.rotrSL(W15h, W15l, 1) ^ u64$1.rotrSL(W15h, W15l, 8) ^ u64$1.shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i - 2] | 0;
      const W2l = SHA512_W_L[i - 2] | 0;
      const s1h = u64$1.rotrSH(W2h, W2l, 19) ^ u64$1.rotrBH(W2h, W2l, 61) ^ u64$1.shrSH(W2h, W2l, 6);
      const s1l = u64$1.rotrSL(W2h, W2l, 19) ^ u64$1.rotrBL(W2h, W2l, 61) ^ u64$1.shrSL(W2h, W2l, 6);
      const SUMl = u64$1.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
      const SUMh = u64$1.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
      SHA512_W_H[i] = SUMh | 0;
      SHA512_W_L[i] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i = 0; i < 80; i++) {
      const sigma1h = u64$1.rotrSH(Eh, El, 14) ^ u64$1.rotrSH(Eh, El, 18) ^ u64$1.rotrBH(Eh, El, 41);
      const sigma1l = u64$1.rotrSL(Eh, El, 14) ^ u64$1.rotrSL(Eh, El, 18) ^ u64$1.rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = u64$1.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
      const T1h = u64$1.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
      const T1l = T1ll | 0;
      const sigma0h = u64$1.rotrSH(Ah, Al, 28) ^ u64$1.rotrBH(Ah, Al, 34) ^ u64$1.rotrBH(Ah, Al, 39);
      const sigma0l = u64$1.rotrSL(Ah, Al, 28) ^ u64$1.rotrBL(Ah, Al, 34) ^ u64$1.rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = u64$1.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = u64$1.add3L(T1l, sigma0l, MAJl);
      Ah = u64$1.add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = u64$1.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = u64$1.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = u64$1.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = u64$1.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = u64$1.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = u64$1.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = u64$1.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = u64$1.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    SHA512_W_H.fill(0);
    SHA512_W_L.fill(0);
  }
  destroy() {
    this.buffer.fill(0);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
const sha512 = /* @__PURE__ */ wrapConstructor(() => new SHA512());
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n = BigInt(0), _1n$1 = BigInt(1), _2n$1 = BigInt(2), _8n$1 = BigInt(8);
const VERIFY_DEFAULT = { zip215: true };
function validateOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(curve, {
    hash: "function",
    a: "bigint",
    d: "bigint",
    randomBytes: "function"
  }, {
    adjustScalarBytes: "function",
    domain: "function",
    uvRatio: "function",
    mapToCurve: "function"
  });
  return Object.freeze({ ...opts });
}
function twistedEdwards(curveDef) {
  const CURVE = validateOpts(curveDef);
  const { Fp: Fp3, n: CURVE_ORDER, prehash, hash: cHash, randomBytes: randomBytes2, nByteLength, h: cofactor } = CURVE;
  const MASK = _2n$1 << BigInt(nByteLength * 8) - _1n$1;
  const modP = Fp3.create;
  const Fn = Field(CURVE.n, CURVE.nBitLength);
  const uvRatio2 = CURVE.uvRatio || ((u, v) => {
    try {
      return { isValid: true, value: Fp3.sqrt(u * Fp3.inv(v)) };
    } catch (e) {
      return { isValid: false, value: _0n };
    }
  });
  const adjustScalarBytes2 = CURVE.adjustScalarBytes || ((bytes2) => bytes2);
  const domain = CURVE.domain || ((data, ctx, phflag) => {
    abool("phflag", phflag);
    if (ctx.length || phflag)
      throw new Error("Contexts/pre-hash are not supported");
    return data;
  });
  function aCoordinate(title, n) {
    aInRange("coordinate " + title, n, _0n, MASK);
  }
  function assertPoint(other) {
    if (!(other instanceof Point))
      throw new Error("ExtendedPoint expected");
  }
  const toAffineMemo = memoized((p, iz) => {
    const { ex: x, ey: y, ez: z } = p;
    const is0 = p.is0();
    if (iz == null)
      iz = is0 ? _8n$1 : Fp3.inv(z);
    const ax = modP(x * iz);
    const ay = modP(y * iz);
    const zz = modP(z * iz);
    if (is0)
      return { x: _0n, y: _1n$1 };
    if (zz !== _1n$1)
      throw new Error("invZ was invalid");
    return { x: ax, y: ay };
  });
  const assertValidMemo = memoized((p) => {
    const { a, d } = CURVE;
    if (p.is0())
      throw new Error("bad point: ZERO");
    const { ex: X, ey: Y, ez: Z, et: T } = p;
    const X2 = modP(X * X);
    const Y2 = modP(Y * Y);
    const Z2 = modP(Z * Z);
    const Z4 = modP(Z2 * Z2);
    const aX2 = modP(X2 * a);
    const left = modP(Z2 * modP(aX2 + Y2));
    const right = modP(Z4 + modP(d * modP(X2 * Y2)));
    if (left !== right)
      throw new Error("bad point: equation left != right (1)");
    const XY = modP(X * Y);
    const ZT = modP(Z * T);
    if (XY !== ZT)
      throw new Error("bad point: equation left != right (2)");
    return true;
  });
  class Point {
    constructor(ex, ey, ez, et) {
      this.ex = ex;
      this.ey = ey;
      this.ez = ez;
      this.et = et;
      aCoordinate("x", ex);
      aCoordinate("y", ey);
      aCoordinate("z", ez);
      aCoordinate("t", et);
      Object.freeze(this);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    static fromAffine(p) {
      if (p instanceof Point)
        throw new Error("extended point not allowed");
      const { x, y } = p || {};
      aCoordinate("x", x);
      aCoordinate("y", y);
      return new Point(x, y, _1n$1, modP(x * y));
    }
    static normalizeZ(points) {
      const toInv = Fp3.invertBatch(points.map((p) => p.ez));
      return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
    }
    // Multiscalar Multiplication
    static msm(points, scalars) {
      return pippenger(Point, Fn, points, scalars);
    }
    // "Private method", don't use it directly
    _setWindowSize(windowSize) {
      wnaf.setWindowSize(this, windowSize);
    }
    // Not required for fromHex(), which always creates valid points.
    // Could be useful for fromAffine().
    assertValidity() {
      assertValidMemo(this);
    }
    // Compare one point to another.
    equals(other) {
      assertPoint(other);
      const { ex: X1, ey: Y1, ez: Z1 } = this;
      const { ex: X2, ey: Y2, ez: Z2 } = other;
      const X1Z2 = modP(X1 * Z2);
      const X2Z1 = modP(X2 * Z1);
      const Y1Z2 = modP(Y1 * Z2);
      const Y2Z1 = modP(Y2 * Z1);
      return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    negate() {
      return new Point(modP(-this.ex), this.ey, this.ez, modP(-this.et));
    }
    // Fast algo for doubling Extended Point.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
    // Cost: 4M + 4S + 1*a + 6add + 1*2.
    double() {
      const { a } = CURVE;
      const { ex: X1, ey: Y1, ez: Z1 } = this;
      const A = modP(X1 * X1);
      const B = modP(Y1 * Y1);
      const C = modP(_2n$1 * modP(Z1 * Z1));
      const D = modP(a * A);
      const x1y1 = X1 + Y1;
      const E = modP(modP(x1y1 * x1y1) - A - B);
      const G2 = D + B;
      const F = G2 - C;
      const H = D - B;
      const X3 = modP(E * F);
      const Y3 = modP(G2 * H);
      const T3 = modP(E * H);
      const Z3 = modP(F * G2);
      return new Point(X3, Y3, Z3, T3);
    }
    // Fast algo for adding 2 Extended Points.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
    // Cost: 9M + 1*a + 1*d + 7add.
    add(other) {
      assertPoint(other);
      const { a, d } = CURVE;
      const { ex: X1, ey: Y1, ez: Z1, et: T1 } = this;
      const { ex: X2, ey: Y2, ez: Z2, et: T2 } = other;
      if (a === BigInt(-1)) {
        const A2 = modP((Y1 - X1) * (Y2 + X2));
        const B2 = modP((Y1 + X1) * (Y2 - X2));
        const F2 = modP(B2 - A2);
        if (F2 === _0n)
          return this.double();
        const C2 = modP(Z1 * _2n$1 * T2);
        const D2 = modP(T1 * _2n$1 * Z2);
        const E2 = D2 + C2;
        const G3 = B2 + A2;
        const H2 = D2 - C2;
        const X32 = modP(E2 * F2);
        const Y32 = modP(G3 * H2);
        const T32 = modP(E2 * H2);
        const Z32 = modP(F2 * G3);
        return new Point(X32, Y32, Z32, T32);
      }
      const A = modP(X1 * X2);
      const B = modP(Y1 * Y2);
      const C = modP(T1 * d * T2);
      const D = modP(Z1 * Z2);
      const E = modP((X1 + Y1) * (X2 + Y2) - A - B);
      const F = D - C;
      const G2 = D + C;
      const H = modP(B - a * A);
      const X3 = modP(E * F);
      const Y3 = modP(G2 * H);
      const T3 = modP(E * H);
      const Z3 = modP(F * G2);
      return new Point(X3, Y3, Z3, T3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    wNAF(n) {
      return wnaf.wNAFCached(this, n, Point.normalizeZ);
    }
    // Constant-time multiplication.
    multiply(scalar) {
      const n = scalar;
      aInRange("scalar", n, _1n$1, CURVE_ORDER);
      const { p, f } = this.wNAF(n);
      return Point.normalizeZ([p, f])[0];
    }
    // Non-constant-time multiplication. Uses double-and-add algorithm.
    // It's faster, but should only be used when you don't care about
    // an exposed private key e.g. sig verification.
    // Does NOT allow scalars higher than CURVE.n.
    // Accepts optional accumulator to merge with multiply (important for sparse scalars)
    multiplyUnsafe(scalar, acc = Point.ZERO) {
      const n = scalar;
      aInRange("scalar", n, _0n, CURVE_ORDER);
      if (n === _0n)
        return I;
      if (this.is0() || n === _1n$1)
        return this;
      return wnaf.wNAFCachedUnsafe(this, n, Point.normalizeZ, acc);
    }
    // Checks if point is of small order.
    // If you add something to small order point, you will have "dirty"
    // point with torsion component.
    // Multiplies point by cofactor and checks if the result is 0.
    isSmallOrder() {
      return this.multiplyUnsafe(cofactor).is0();
    }
    // Multiplies point by curve order and checks if the result is 0.
    // Returns `false` is the point is dirty.
    isTorsionFree() {
      return wnaf.unsafeLadder(this, CURVE_ORDER).is0();
    }
    // Converts Extended point to default (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    toAffine(iz) {
      return toAffineMemo(this, iz);
    }
    clearCofactor() {
      const { h: cofactor2 } = CURVE;
      if (cofactor2 === _1n$1)
        return this;
      return this.multiplyUnsafe(cofactor2);
    }
    // Converts hash string or Uint8Array to Point.
    // Uses algo from RFC8032 5.1.3.
    static fromHex(hex, zip215 = false) {
      const { d, a } = CURVE;
      const len = Fp3.BYTES;
      hex = ensureBytes("pointHex", hex, len);
      abool("zip215", zip215);
      const normed = hex.slice();
      const lastByte = hex[len - 1];
      normed[len - 1] = lastByte & ~128;
      const y = bytesToNumberLE(normed);
      const max = zip215 ? MASK : Fp3.ORDER;
      aInRange("pointHex.y", y, _0n, max);
      const y2 = modP(y * y);
      const u = modP(y2 - _1n$1);
      const v = modP(d * y2 - a);
      let { isValid, value: x } = uvRatio2(u, v);
      if (!isValid)
        throw new Error("Point.fromHex: invalid y coordinate");
      const isXOdd = (x & _1n$1) === _1n$1;
      const isLastByteOdd = (lastByte & 128) !== 0;
      if (!zip215 && x === _0n && isLastByteOdd)
        throw new Error("Point.fromHex: x=0 and x_0=1");
      if (isLastByteOdd !== isXOdd)
        x = modP(-x);
      return Point.fromAffine({ x, y });
    }
    static fromPrivateKey(privKey) {
      return getExtendedPublicKey(privKey).point;
    }
    toRawBytes() {
      const { x, y } = this.toAffine();
      const bytes2 = numberToBytesLE(y, Fp3.BYTES);
      bytes2[bytes2.length - 1] |= x & _1n$1 ? 128 : 0;
      return bytes2;
    }
    toHex() {
      return bytesToHex(this.toRawBytes());
    }
  }
  Point.BASE = new Point(CURVE.Gx, CURVE.Gy, _1n$1, modP(CURVE.Gx * CURVE.Gy));
  Point.ZERO = new Point(_0n, _1n$1, _1n$1, _0n);
  const { BASE: G, ZERO: I } = Point;
  const wnaf = wNAF(Point, nByteLength * 8);
  function modN(a) {
    return mod(a, CURVE_ORDER);
  }
  function modN_LE(hash2) {
    return modN(bytesToNumberLE(hash2));
  }
  function getExtendedPublicKey(key) {
    const len = Fp3.BYTES;
    key = ensureBytes("private key", key, len);
    const hashed = ensureBytes("hashed private key", cHash(key), 2 * len);
    const head = adjustScalarBytes2(hashed.slice(0, len));
    const prefix = hashed.slice(len, 2 * len);
    const scalar = modN_LE(head);
    const point = G.multiply(scalar);
    const pointBytes = point.toRawBytes();
    return { head, prefix, scalar, point, pointBytes };
  }
  function getPublicKey(privKey) {
    return getExtendedPublicKey(privKey).pointBytes;
  }
  function hashDomainToScalar(context = new Uint8Array(), ...msgs) {
    const msg = concatBytes(...msgs);
    return modN_LE(cHash(domain(msg, ensureBytes("context", context), !!prehash)));
  }
  function sign(msg, privKey, options = {}) {
    msg = ensureBytes("message", msg);
    if (prehash)
      msg = prehash(msg);
    const { prefix, scalar, pointBytes } = getExtendedPublicKey(privKey);
    const r = hashDomainToScalar(options.context, prefix, msg);
    const R = G.multiply(r).toRawBytes();
    const k = hashDomainToScalar(options.context, R, pointBytes, msg);
    const s = modN(r + k * scalar);
    aInRange("signature.s", s, _0n, CURVE_ORDER);
    const res = concatBytes(R, numberToBytesLE(s, Fp3.BYTES));
    return ensureBytes("result", res, Fp3.BYTES * 2);
  }
  const verifyOpts = VERIFY_DEFAULT;
  function verify(sig, msg, publicKey, options = verifyOpts) {
    const { context, zip215 } = options;
    const len = Fp3.BYTES;
    sig = ensureBytes("signature", sig, 2 * len);
    msg = ensureBytes("message", msg);
    publicKey = ensureBytes("publicKey", publicKey, len);
    if (zip215 !== void 0)
      abool("zip215", zip215);
    if (prehash)
      msg = prehash(msg);
    const s = bytesToNumberLE(sig.slice(len, 2 * len));
    let A, R, SB;
    try {
      A = Point.fromHex(publicKey, zip215);
      R = Point.fromHex(sig.slice(0, len), zip215);
      SB = G.multiplyUnsafe(s);
    } catch (error) {
      return false;
    }
    if (!zip215 && A.isSmallOrder())
      return false;
    const k = hashDomainToScalar(context, R.toRawBytes(), A.toRawBytes(), msg);
    const RkA = R.add(A.multiplyUnsafe(k));
    return RkA.subtract(SB).clearCofactor().equals(Point.ZERO);
  }
  G._setWindowSize(8);
  const utils2 = {
    getExtendedPublicKey,
    // ed25519 private keys are uniform 32b. No need to check for modulo bias, like in secp256k1.
    randomPrivateKey: () => randomBytes2(Fp3.BYTES),
    /**
     * We're doing scalar multiplication (used in getPublicKey etc) with precomputed BASE_POINT
     * values. This slows down first getPublicKey() by milliseconds (see Speed section),
     * but allows to speed-up subsequent getPublicKey() calls up to 20x.
     * @param windowSize 2, 4, 8, 16
     */
    precompute(windowSize = 8, point = Point.BASE) {
      point._setWindowSize(windowSize);
      point.multiply(BigInt(3));
      return point;
    }
  };
  return {
    CURVE,
    getPublicKey,
    sign,
    verify,
    ExtendedPoint: Point,
    utils: utils2
  };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ED25519_P = BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949");
const ED25519_SQRT_M1 = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
BigInt(0);
const _1n = BigInt(1), _2n = BigInt(2);
BigInt(3);
const _5n = BigInt(5), _8n = BigInt(8);
function ed25519_pow_2_252_3(x) {
  const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
  const P = ED25519_P;
  const x2 = x * x % P;
  const b2 = x2 * x % P;
  const b4 = pow2(b2, _2n, P) * b2 % P;
  const b5 = pow2(b4, _1n, P) * x % P;
  const b10 = pow2(b5, _5n, P) * b5 % P;
  const b20 = pow2(b10, _10n, P) * b10 % P;
  const b40 = pow2(b20, _20n, P) * b20 % P;
  const b80 = pow2(b40, _40n, P) * b40 % P;
  const b160 = pow2(b80, _80n, P) * b80 % P;
  const b240 = pow2(b160, _80n, P) * b80 % P;
  const b250 = pow2(b240, _10n, P) * b10 % P;
  const pow_p_5_8 = pow2(b250, _2n, P) * x % P;
  return { pow_p_5_8, b2 };
}
function adjustScalarBytes(bytes2) {
  bytes2[0] &= 248;
  bytes2[31] &= 127;
  bytes2[31] |= 64;
  return bytes2;
}
function uvRatio(u, v) {
  const P = ED25519_P;
  const v3 = mod(v * v * v, P);
  const v7 = mod(v3 * v3 * v, P);
  const pow3 = ed25519_pow_2_252_3(u * v7).pow_p_5_8;
  let x = mod(u * v3 * pow3, P);
  const vx2 = mod(v * x * x, P);
  const root1 = x;
  const root2 = mod(x * ED25519_SQRT_M1, P);
  const useRoot1 = vx2 === u;
  const useRoot2 = vx2 === mod(-u, P);
  const noRoot = vx2 === mod(-u * ED25519_SQRT_M1, P);
  if (useRoot1)
    x = root1;
  if (useRoot2 || noRoot)
    x = root2;
  if (isNegativeLE(x, P))
    x = mod(-x, P);
  return { isValid: useRoot1 || useRoot2, value: x };
}
const Fp = /* @__PURE__ */ (() => Field(ED25519_P, void 0, true))();
const ed25519Defaults = /* @__PURE__ */ (() => ({
  // Param: a
  a: BigInt(-1),
  // Fp.create(-1) is proper; our way still works and is faster
  // d is equal to -121665/121666 over finite field.
  // Negative number is P - number, and division is invert(number, P)
  d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
  // Finite field 𝔽p over which we'll do calculations; 2n**255n - 19n
  Fp,
  // Subgroup order: how many points curve has
  // 2n**252n + 27742317777372353535851937790883648493n;
  n: BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989"),
  // Cofactor
  h: _8n,
  // Base point (x, y) aka generator point
  Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
  Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960"),
  hash: sha512,
  randomBytes,
  adjustScalarBytes,
  // dom2
  // Ratio of u to v. Allows us to combine inversion and square root. Uses algo from RFC8032 5.1.3.
  // Constant-time, u/√v
  uvRatio
}))();
const ed25519 = /* @__PURE__ */ (() => twistedEdwards(ed25519Defaults))();
var __classPrivateFieldSet$7 = globalThis && globalThis.__classPrivateFieldSet || function(receiver, state, value2, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value2) : f ? f.value = value2 : state.set(receiver, value2), value2;
};
var __classPrivateFieldGet$7 = globalThis && globalThis.__classPrivateFieldGet || function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ExpirableMap_inner, _ExpirableMap_expirationTime, _a, _b;
class ExpirableMap {
  /**
   * Create a new ExpirableMap.
   * @param {ExpirableMapOptions<any, any>} options - options for the map.
   * @param {Iterable<[any, any]>} options.source - an optional source of entries to initialize the map with.
   * @param {number} options.expirationTime - the time in milliseconds after which entries will expire.
   */
  constructor(options = {}) {
    _ExpirableMap_inner.set(this, void 0);
    _ExpirableMap_expirationTime.set(this, void 0);
    this[_a] = this.entries.bind(this);
    this[_b] = "ExpirableMap";
    const { source = [], expirationTime = 10 * 60 * 1e3 } = options;
    const currentTime = Date.now();
    __classPrivateFieldSet$7(this, _ExpirableMap_inner, new Map([...source].map(([key, value2]) => [key, { value: value2, timestamp: currentTime }])), "f");
    __classPrivateFieldSet$7(this, _ExpirableMap_expirationTime, expirationTime, "f");
  }
  /**
   * Prune removes all expired entries.
   */
  prune() {
    const currentTime = Date.now();
    for (const [key, entry] of __classPrivateFieldGet$7(this, _ExpirableMap_inner, "f").entries()) {
      if (currentTime - entry.timestamp > __classPrivateFieldGet$7(this, _ExpirableMap_expirationTime, "f")) {
        __classPrivateFieldGet$7(this, _ExpirableMap_inner, "f").delete(key);
      }
    }
    return this;
  }
  // Implementing the Map interface
  /**
   * Set the value for the given key. Prunes expired entries.
   * @param key for the entry
   * @param value of the entry
   * @returns this
   */
  set(key, value2) {
    this.prune();
    const entry = {
      value: value2,
      timestamp: Date.now()
    };
    __classPrivateFieldGet$7(this, _ExpirableMap_inner, "f").set(key, entry);
    return this;
  }
  /**
   * Get the value associated with the key, if it exists and has not expired.
   * @param key K
   * @returns the value associated with the key, or undefined if the key is not present or has expired.
   */
  get(key) {
    const entry = __classPrivateFieldGet$7(this, _ExpirableMap_inner, "f").get(key);
    if (entry === void 0) {
      return void 0;
    }
    if (Date.now() - entry.timestamp > __classPrivateFieldGet$7(this, _ExpirableMap_expirationTime, "f")) {
      __classPrivateFieldGet$7(this, _ExpirableMap_inner, "f").delete(key);
      return void 0;
    }
    return entry.value;
  }
  /**
   * Clear all entries.
   */
  clear() {
    __classPrivateFieldGet$7(this, _ExpirableMap_inner, "f").clear();
  }
  /**
   * Entries returns the entries of the map, without the expiration time.
   * @returns an iterator over the entries of the map.
   */
  entries() {
    const iterator = __classPrivateFieldGet$7(this, _ExpirableMap_inner, "f").entries();
    const generator = function* () {
      for (const [key, value2] of iterator) {
        yield [key, value2.value];
      }
    };
    return generator();
  }
  /**
   * Values returns the values of the map, without the expiration time.
   * @returns an iterator over the values of the map.
   */
  values() {
    const iterator = __classPrivateFieldGet$7(this, _ExpirableMap_inner, "f").values();
    const generator = function* () {
      for (const value2 of iterator) {
        yield value2.value;
      }
    };
    return generator();
  }
  /**
   * Keys returns the keys of the map
   * @returns an iterator over the keys of the map.
   */
  keys() {
    return __classPrivateFieldGet$7(this, _ExpirableMap_inner, "f").keys();
  }
  /**
   * forEach calls the callbackfn on each entry of the map.
   * @param callbackfn to call on each entry
   * @param thisArg to use as this when calling the callbackfn
   */
  forEach(callbackfn, thisArg) {
    for (const [key, value2] of __classPrivateFieldGet$7(this, _ExpirableMap_inner, "f").entries()) {
      callbackfn.call(thisArg, value2.value, key, this);
    }
  }
  /**
   * has returns true if the key exists and has not expired.
   * @param key K
   * @returns true if the key exists and has not expired.
   */
  has(key) {
    return __classPrivateFieldGet$7(this, _ExpirableMap_inner, "f").has(key);
  }
  /**
   * delete the entry for the given key.
   * @param key K
   * @returns true if the key existed and has been deleted.
   */
  delete(key) {
    return __classPrivateFieldGet$7(this, _ExpirableMap_inner, "f").delete(key);
  }
  /**
   * get size of the map.
   * @returns the size of the map.
   */
  get size() {
    return __classPrivateFieldGet$7(this, _ExpirableMap_inner, "f").size;
  }
}
_ExpirableMap_inner = /* @__PURE__ */ new WeakMap(), _ExpirableMap_expirationTime = /* @__PURE__ */ new WeakMap(), _a = Symbol.iterator, _b = Symbol.toStringTag;
const encodeLenBytes = (len) => {
  if (len <= 127) {
    return 1;
  } else if (len <= 255) {
    return 2;
  } else if (len <= 65535) {
    return 3;
  } else if (len <= 16777215) {
    return 4;
  } else {
    throw new Error("Length too long (> 4 bytes)");
  }
};
const encodeLen = (buf, offset, len) => {
  if (len <= 127) {
    buf[offset] = len;
    return 1;
  } else if (len <= 255) {
    buf[offset] = 129;
    buf[offset + 1] = len;
    return 2;
  } else if (len <= 65535) {
    buf[offset] = 130;
    buf[offset + 1] = len >> 8;
    buf[offset + 2] = len;
    return 3;
  } else if (len <= 16777215) {
    buf[offset] = 131;
    buf[offset + 1] = len >> 16;
    buf[offset + 2] = len >> 8;
    buf[offset + 3] = len;
    return 4;
  } else {
    throw new Error("Length too long (> 4 bytes)");
  }
};
const decodeLenBytes = (buf, offset) => {
  if (buf[offset] < 128)
    return 1;
  if (buf[offset] === 128)
    throw new Error("Invalid length 0");
  if (buf[offset] === 129)
    return 2;
  if (buf[offset] === 130)
    return 3;
  if (buf[offset] === 131)
    return 4;
  throw new Error("Length too long (> 4 bytes)");
};
const decodeLen = (buf, offset) => {
  const lenBytes = decodeLenBytes(buf, offset);
  if (lenBytes === 1)
    return buf[offset];
  else if (lenBytes === 2)
    return buf[offset + 1];
  else if (lenBytes === 3)
    return (buf[offset + 1] << 8) + buf[offset + 2];
  else if (lenBytes === 4)
    return (buf[offset + 1] << 16) + (buf[offset + 2] << 8) + buf[offset + 3];
  throw new Error("Length too long (> 4 bytes)");
};
Uint8Array.from([
  ...[48, 12],
  ...[6, 10],
  ...[43, 6, 1, 4, 1, 131, 184, 67, 1, 1]
  // DER encoded COSE
]);
const ED25519_OID = Uint8Array.from([
  ...[48, 5],
  ...[6, 3],
  ...[43, 101, 112]
  // id-Ed25519 OID
]);
Uint8Array.from([
  ...[48, 16],
  ...[6, 7],
  ...[42, 134, 72, 206, 61, 2, 1],
  ...[6, 5],
  ...[43, 129, 4, 0, 10]
  // OID secp256k1
]);
function wrapDER(payload, oid) {
  const bitStringHeaderLength = 2 + encodeLenBytes(payload.byteLength + 1);
  const len = oid.byteLength + bitStringHeaderLength + payload.byteLength;
  let offset = 0;
  const buf = new Uint8Array(1 + encodeLenBytes(len) + len);
  buf[offset++] = 48;
  offset += encodeLen(buf, offset, len);
  buf.set(oid, offset);
  offset += oid.byteLength;
  buf[offset++] = 3;
  offset += encodeLen(buf, offset, payload.byteLength + 1);
  buf[offset++] = 0;
  buf.set(new Uint8Array(payload), offset);
  return buf;
}
const unwrapDER = (derEncoded, oid) => {
  let offset = 0;
  const expect = (n, msg) => {
    if (buf[offset++] !== n) {
      throw new Error("Expected: " + msg);
    }
  };
  const buf = new Uint8Array(derEncoded);
  expect(48, "sequence");
  offset += decodeLenBytes(buf, offset);
  if (!bufEquals(buf.slice(offset, offset + oid.byteLength), oid)) {
    throw new Error("Not the expected OID.");
  }
  offset += oid.byteLength;
  expect(3, "bit string");
  const payloadLen = decodeLen(buf, offset) - 1;
  offset += decodeLenBytes(buf, offset);
  expect(0, "0 padding");
  const result = buf.slice(offset);
  if (payloadLen !== result.length) {
    throw new Error(`DER payload mismatch: Expected length ${payloadLen} actual length ${result.length}`);
  }
  return result;
};
var __classPrivateFieldSet$6 = globalThis && globalThis.__classPrivateFieldSet || function(receiver, state, value2, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value2) : f ? f.value = value2 : state.set(receiver, value2), value2;
};
var __classPrivateFieldGet$6 = globalThis && globalThis.__classPrivateFieldGet || function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Ed25519PublicKey_rawKey$1, _Ed25519PublicKey_derKey$1;
let Ed25519PublicKey$1 = class Ed25519PublicKey {
  // `fromRaw` and `fromDer` should be used for instantiation, not this constructor.
  constructor(key) {
    _Ed25519PublicKey_rawKey$1.set(this, void 0);
    _Ed25519PublicKey_derKey$1.set(this, void 0);
    if (key.byteLength !== Ed25519PublicKey.RAW_KEY_LENGTH) {
      throw new Error("An Ed25519 public key must be exactly 32bytes long");
    }
    __classPrivateFieldSet$6(this, _Ed25519PublicKey_rawKey$1, key, "f");
    __classPrivateFieldSet$6(this, _Ed25519PublicKey_derKey$1, Ed25519PublicKey.derEncode(key), "f");
  }
  static from(key) {
    return this.fromDer(key.toDer());
  }
  static fromRaw(rawKey) {
    return new Ed25519PublicKey(rawKey);
  }
  static fromDer(derKey) {
    return new Ed25519PublicKey(this.derDecode(derKey));
  }
  static derEncode(publicKey) {
    return wrapDER(publicKey, ED25519_OID).buffer;
  }
  static derDecode(key) {
    const unwrapped = unwrapDER(key, ED25519_OID);
    if (unwrapped.length !== this.RAW_KEY_LENGTH) {
      throw new Error("An Ed25519 public key must be exactly 32bytes long");
    }
    return unwrapped;
  }
  get rawKey() {
    return __classPrivateFieldGet$6(this, _Ed25519PublicKey_rawKey$1, "f");
  }
  get derKey() {
    return __classPrivateFieldGet$6(this, _Ed25519PublicKey_derKey$1, "f");
  }
  toDer() {
    return this.derKey;
  }
  toRaw() {
    return this.rawKey;
  }
};
_Ed25519PublicKey_rawKey$1 = /* @__PURE__ */ new WeakMap(), _Ed25519PublicKey_derKey$1 = /* @__PURE__ */ new WeakMap();
Ed25519PublicKey$1.RAW_KEY_LENGTH = 32;
class Observable {
  constructor() {
    this.observers = [];
  }
  subscribe(func) {
    this.observers.push(func);
  }
  unsubscribe(func) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }
  notify(data, ...rest) {
    this.observers.forEach((observer) => observer(data, ...rest));
  }
}
class ObservableLog extends Observable {
  constructor() {
    super();
  }
  print(message, ...rest) {
    this.notify({ message, level: "info" }, ...rest);
  }
  warn(message, ...rest) {
    this.notify({ message, level: "warn" }, ...rest);
  }
  error(message, error, ...rest) {
    this.notify({ message, level: "error", error }, ...rest);
  }
}
var __classPrivateFieldSet$5 = globalThis && globalThis.__classPrivateFieldSet || function(receiver, state, value2, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value2) : f ? f.value = value2 : state.set(receiver, value2), value2;
};
var __classPrivateFieldGet$5 = globalThis && globalThis.__classPrivateFieldGet || function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ExponentialBackoff_currentInterval, _ExponentialBackoff_randomizationFactor, _ExponentialBackoff_multiplier, _ExponentialBackoff_maxInterval, _ExponentialBackoff_startTime, _ExponentialBackoff_maxElapsedTime, _ExponentialBackoff_maxIterations, _ExponentialBackoff_date, _ExponentialBackoff_count;
const RANDOMIZATION_FACTOR = 0.5;
const MULTIPLIER = 1.5;
const INITIAL_INTERVAL_MSEC = 500;
const MAX_INTERVAL_MSEC = 6e4;
const MAX_ELAPSED_TIME_MSEC = 9e5;
const MAX_ITERATIONS = 10;
class ExponentialBackoff {
  constructor(options = ExponentialBackoff.default) {
    _ExponentialBackoff_currentInterval.set(this, void 0);
    _ExponentialBackoff_randomizationFactor.set(this, void 0);
    _ExponentialBackoff_multiplier.set(this, void 0);
    _ExponentialBackoff_maxInterval.set(this, void 0);
    _ExponentialBackoff_startTime.set(this, void 0);
    _ExponentialBackoff_maxElapsedTime.set(this, void 0);
    _ExponentialBackoff_maxIterations.set(this, void 0);
    _ExponentialBackoff_date.set(this, void 0);
    _ExponentialBackoff_count.set(this, 0);
    const { initialInterval = INITIAL_INTERVAL_MSEC, randomizationFactor = RANDOMIZATION_FACTOR, multiplier = MULTIPLIER, maxInterval = MAX_INTERVAL_MSEC, maxElapsedTime = MAX_ELAPSED_TIME_MSEC, maxIterations = MAX_ITERATIONS, date = Date } = options;
    __classPrivateFieldSet$5(this, _ExponentialBackoff_currentInterval, initialInterval, "f");
    __classPrivateFieldSet$5(this, _ExponentialBackoff_randomizationFactor, randomizationFactor, "f");
    __classPrivateFieldSet$5(this, _ExponentialBackoff_multiplier, multiplier, "f");
    __classPrivateFieldSet$5(this, _ExponentialBackoff_maxInterval, maxInterval, "f");
    __classPrivateFieldSet$5(this, _ExponentialBackoff_date, date, "f");
    __classPrivateFieldSet$5(this, _ExponentialBackoff_startTime, date.now(), "f");
    __classPrivateFieldSet$5(this, _ExponentialBackoff_maxElapsedTime, maxElapsedTime, "f");
    __classPrivateFieldSet$5(this, _ExponentialBackoff_maxIterations, maxIterations, "f");
  }
  get ellapsedTimeInMsec() {
    return __classPrivateFieldGet$5(this, _ExponentialBackoff_date, "f").now() - __classPrivateFieldGet$5(this, _ExponentialBackoff_startTime, "f");
  }
  get currentInterval() {
    return __classPrivateFieldGet$5(this, _ExponentialBackoff_currentInterval, "f");
  }
  get count() {
    return __classPrivateFieldGet$5(this, _ExponentialBackoff_count, "f");
  }
  get randomValueFromInterval() {
    const delta = __classPrivateFieldGet$5(this, _ExponentialBackoff_randomizationFactor, "f") * __classPrivateFieldGet$5(this, _ExponentialBackoff_currentInterval, "f");
    const min = __classPrivateFieldGet$5(this, _ExponentialBackoff_currentInterval, "f") - delta;
    const max = __classPrivateFieldGet$5(this, _ExponentialBackoff_currentInterval, "f") + delta;
    return Math.random() * (max - min) + min;
  }
  incrementCurrentInterval() {
    var _a2;
    __classPrivateFieldSet$5(this, _ExponentialBackoff_currentInterval, Math.min(__classPrivateFieldGet$5(this, _ExponentialBackoff_currentInterval, "f") * __classPrivateFieldGet$5(this, _ExponentialBackoff_multiplier, "f"), __classPrivateFieldGet$5(this, _ExponentialBackoff_maxInterval, "f")), "f");
    __classPrivateFieldSet$5(this, _ExponentialBackoff_count, (_a2 = __classPrivateFieldGet$5(this, _ExponentialBackoff_count, "f"), _a2++, _a2), "f");
    return __classPrivateFieldGet$5(this, _ExponentialBackoff_currentInterval, "f");
  }
  next() {
    if (this.ellapsedTimeInMsec >= __classPrivateFieldGet$5(this, _ExponentialBackoff_maxElapsedTime, "f") || __classPrivateFieldGet$5(this, _ExponentialBackoff_count, "f") >= __classPrivateFieldGet$5(this, _ExponentialBackoff_maxIterations, "f")) {
      return null;
    } else {
      this.incrementCurrentInterval();
      return this.randomValueFromInterval;
    }
  }
}
_ExponentialBackoff_currentInterval = /* @__PURE__ */ new WeakMap(), _ExponentialBackoff_randomizationFactor = /* @__PURE__ */ new WeakMap(), _ExponentialBackoff_multiplier = /* @__PURE__ */ new WeakMap(), _ExponentialBackoff_maxInterval = /* @__PURE__ */ new WeakMap(), _ExponentialBackoff_startTime = /* @__PURE__ */ new WeakMap(), _ExponentialBackoff_maxElapsedTime = /* @__PURE__ */ new WeakMap(), _ExponentialBackoff_maxIterations = /* @__PURE__ */ new WeakMap(), _ExponentialBackoff_date = /* @__PURE__ */ new WeakMap(), _ExponentialBackoff_count = /* @__PURE__ */ new WeakMap();
ExponentialBackoff.default = {
  initialInterval: INITIAL_INTERVAL_MSEC,
  randomizationFactor: RANDOMIZATION_FACTOR,
  multiplier: MULTIPLIER,
  maxInterval: MAX_INTERVAL_MSEC,
  // 1 minute
  maxElapsedTime: MAX_ELAPSED_TIME_MSEC,
  maxIterations: MAX_ITERATIONS,
  date: Date
};
var __classPrivateFieldSet$4 = globalThis && globalThis.__classPrivateFieldSet || function(receiver, state, value2, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value2) : f ? f.value = value2 : state.set(receiver, value2), value2;
};
var __classPrivateFieldGet$4 = globalThis && globalThis.__classPrivateFieldGet || function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HttpAgent_instances, _HttpAgent_rootKeyPromise, _HttpAgent_shouldFetchRootKey, _HttpAgent_identity, _HttpAgent_fetch, _HttpAgent_fetchOptions, _HttpAgent_callOptions, _HttpAgent_timeDiffMsecs, _HttpAgent_credentials, _HttpAgent_retryTimes, _HttpAgent_backoffStrategy, _HttpAgent_maxIngressExpiryInMinutes, _HttpAgent_waterMark, _HttpAgent_queryPipeline, _HttpAgent_updatePipeline, _HttpAgent_subnetKeys, _HttpAgent_verifyQuerySignatures, _HttpAgent_requestAndRetryQuery, _HttpAgent_requestAndRetry, _HttpAgent_verifyQueryResponse, _HttpAgent_rootKeyGuard;
var RequestStatusResponseStatus;
(function(RequestStatusResponseStatus2) {
  RequestStatusResponseStatus2["Received"] = "received";
  RequestStatusResponseStatus2["Processing"] = "processing";
  RequestStatusResponseStatus2["Replied"] = "replied";
  RequestStatusResponseStatus2["Rejected"] = "rejected";
  RequestStatusResponseStatus2["Unknown"] = "unknown";
  RequestStatusResponseStatus2["Done"] = "done";
})(RequestStatusResponseStatus || (RequestStatusResponseStatus = {}));
const MINUTE_TO_MSECS = 60 * 1e3;
const IC_ROOT_KEY = "308182301d060d2b0601040182dc7c0503010201060c2b0601040182dc7c05030201036100814c0e6ec71fab583b08bd81373c255c3c371b2e84863c98a4f1e08b74235d14fb5d9c0cd546d9685f913a0c0b2cc5341583bf4b4392e467db96d65b9bb4cb717112f8472e0d5a4d14505ffd7484b01291091c5f87b98883463f98091a0baaae";
const MANAGEMENT_CANISTER_ID = "aaaaa-aa";
const IC0_DOMAIN = "ic0.app";
const IC0_SUB_DOMAIN = ".ic0.app";
const ICP0_DOMAIN = "icp0.io";
const ICP0_SUB_DOMAIN = ".icp0.io";
const ICP_API_DOMAIN = "icp-api.io";
const ICP_API_SUB_DOMAIN = ".icp-api.io";
class HttpDefaultFetchError extends AgentError {
  constructor(message) {
    super(message);
    this.message = message;
  }
}
class IdentityInvalidError extends AgentError {
  constructor(message) {
    super(message);
    this.message = message;
  }
}
function getDefaultFetch() {
  let defaultFetch;
  if (typeof window !== "undefined") {
    if (window.fetch) {
      defaultFetch = window.fetch.bind(window);
    } else {
      throw new HttpDefaultFetchError("Fetch implementation was not available. You appear to be in a browser context, but window.fetch was not present.");
    }
  } else if (typeof global !== "undefined") {
    if (global.fetch) {
      defaultFetch = global.fetch.bind(global);
    } else {
      throw new HttpDefaultFetchError("Fetch implementation was not available. You appear to be in a Node.js context, but global.fetch was not available.");
    }
  } else if (typeof self !== "undefined") {
    if (self.fetch) {
      defaultFetch = self.fetch.bind(self);
    }
  }
  if (defaultFetch) {
    return defaultFetch;
  }
  throw new HttpDefaultFetchError("Fetch implementation was not available. Please provide fetch to the HttpAgent constructor, or ensure it is available in the window or global context.");
}
function determineHost(configuredHost) {
  let host;
  if (configuredHost !== void 0) {
    if (!configuredHost.match(/^[a-z]+:/) && typeof window !== "undefined") {
      host = new URL(window.location.protocol + "//" + configuredHost);
    } else {
      host = new URL(configuredHost);
    }
  } else {
    const knownHosts = ["ic0.app", "icp0.io", "127.0.0.1", "localhost"];
    const remoteHosts = [".github.dev", ".gitpod.io"];
    const location2 = typeof window !== "undefined" ? window.location : void 0;
    const hostname = location2 === null || location2 === void 0 ? void 0 : location2.hostname;
    let knownHost;
    if (hostname && typeof hostname === "string") {
      if (remoteHosts.some((host2) => hostname.endsWith(host2))) {
        knownHost = hostname;
      } else {
        knownHost = knownHosts.find((host2) => hostname.endsWith(host2));
      }
    }
    if (location2 && knownHost) {
      host = new URL(`${location2.protocol}//${knownHost}${location2.port ? ":" + location2.port : ""}`);
    } else {
      host = new URL("https://icp-api.io");
    }
  }
  return host.toString();
}
class HttpAgent {
  /**
   * @param options - Options for the HttpAgent
   * @deprecated Use `HttpAgent.create` or `HttpAgent.createSync` instead
   */
  constructor(options = {}) {
    var _a2, _b2;
    _HttpAgent_instances.add(this);
    _HttpAgent_rootKeyPromise.set(this, null);
    _HttpAgent_shouldFetchRootKey.set(this, false);
    _HttpAgent_identity.set(this, void 0);
    _HttpAgent_fetch.set(this, void 0);
    _HttpAgent_fetchOptions.set(this, void 0);
    _HttpAgent_callOptions.set(this, void 0);
    _HttpAgent_timeDiffMsecs.set(this, 0);
    _HttpAgent_credentials.set(this, void 0);
    _HttpAgent_retryTimes.set(this, void 0);
    _HttpAgent_backoffStrategy.set(this, void 0);
    _HttpAgent_maxIngressExpiryInMinutes.set(this, void 0);
    this._isAgent = true;
    this.config = {};
    _HttpAgent_waterMark.set(this, 0);
    this.log = new ObservableLog();
    _HttpAgent_queryPipeline.set(this, []);
    _HttpAgent_updatePipeline.set(this, []);
    _HttpAgent_subnetKeys.set(this, new ExpirableMap({
      expirationTime: 5 * 60 * 1e3
      // 5 minutes
    }));
    _HttpAgent_verifyQuerySignatures.set(this, true);
    _HttpAgent_verifyQueryResponse.set(this, (queryResponse, subnetStatus) => {
      if (__classPrivateFieldGet$4(this, _HttpAgent_verifyQuerySignatures, "f") === false) {
        return queryResponse;
      }
      if (!subnetStatus) {
        throw new CertificateVerificationError("Invalid signature from replica signed query: no matching node key found.");
      }
      const { status, signatures = [], requestId } = queryResponse;
      const domainSeparator2 = new TextEncoder().encode("\vic-response");
      for (const sig of signatures) {
        const { timestamp, identity } = sig;
        const nodeId = Principal$1.fromUint8Array(identity).toText();
        let hash2;
        if (status === "replied") {
          const { reply } = queryResponse;
          hash2 = hashOfMap({
            status,
            reply,
            timestamp: BigInt(timestamp),
            request_id: requestId
          });
        } else if (status === "rejected") {
          const { reject_code, reject_message, error_code } = queryResponse;
          hash2 = hashOfMap({
            status,
            reject_code,
            reject_message,
            error_code,
            timestamp: BigInt(timestamp),
            request_id: requestId
          });
        } else {
          throw new Error(`Unknown status: ${status}`);
        }
        const separatorWithHash = concat$1(domainSeparator2, new Uint8Array(hash2));
        const pubKey = subnetStatus === null || subnetStatus === void 0 ? void 0 : subnetStatus.nodeKeys.get(nodeId);
        if (!pubKey) {
          throw new CertificateVerificationError("Invalid signature from replica signed query: no matching node key found.");
        }
        const rawKey = Ed25519PublicKey$1.fromDer(pubKey).rawKey;
        const valid = ed25519.verify(sig.signature, new Uint8Array(separatorWithHash), new Uint8Array(rawKey));
        if (valid)
          return queryResponse;
        throw new CertificateVerificationError(`Invalid signature from replica ${nodeId} signed query.`);
      }
      return queryResponse;
    });
    this.config = options;
    __classPrivateFieldSet$4(this, _HttpAgent_fetch, options.fetch || getDefaultFetch() || fetch.bind(global), "f");
    __classPrivateFieldSet$4(this, _HttpAgent_fetchOptions, options.fetchOptions, "f");
    __classPrivateFieldSet$4(this, _HttpAgent_callOptions, options.callOptions, "f");
    __classPrivateFieldSet$4(this, _HttpAgent_shouldFetchRootKey, (_a2 = options.shouldFetchRootKey) !== null && _a2 !== void 0 ? _a2 : false, "f");
    if (options.rootKey) {
      this.rootKey = options.rootKey;
    } else if (__classPrivateFieldGet$4(this, _HttpAgent_shouldFetchRootKey, "f")) {
      this.rootKey = null;
    } else {
      this.rootKey = fromHex(IC_ROOT_KEY);
    }
    const host = determineHost(options.host);
    this.host = new URL(host);
    if (options.verifyQuerySignatures !== void 0) {
      __classPrivateFieldSet$4(this, _HttpAgent_verifyQuerySignatures, options.verifyQuerySignatures, "f");
    }
    __classPrivateFieldSet$4(this, _HttpAgent_retryTimes, (_b2 = options.retryTimes) !== null && _b2 !== void 0 ? _b2 : 3, "f");
    const defaultBackoffFactory = () => new ExponentialBackoff({
      maxIterations: __classPrivateFieldGet$4(this, _HttpAgent_retryTimes, "f")
    });
    __classPrivateFieldSet$4(this, _HttpAgent_backoffStrategy, options.backoffStrategy || defaultBackoffFactory, "f");
    if (this.host.hostname.endsWith(IC0_SUB_DOMAIN)) {
      this.host.hostname = IC0_DOMAIN;
    } else if (this.host.hostname.endsWith(ICP0_SUB_DOMAIN)) {
      this.host.hostname = ICP0_DOMAIN;
    } else if (this.host.hostname.endsWith(ICP_API_SUB_DOMAIN)) {
      this.host.hostname = ICP_API_DOMAIN;
    }
    if (options.credentials) {
      const { name, password } = options.credentials;
      __classPrivateFieldSet$4(this, _HttpAgent_credentials, `${name}${password ? ":" + password : ""}`, "f");
    }
    __classPrivateFieldSet$4(this, _HttpAgent_identity, Promise.resolve(options.identity || new AnonymousIdentity()), "f");
    if (options.ingressExpiryInMinutes && options.ingressExpiryInMinutes > 5) {
      throw new AgentError(`The maximum ingress expiry time is 5 minutes. Provided ingress expiry time is ${options.ingressExpiryInMinutes} minutes.`);
    }
    if (options.ingressExpiryInMinutes && options.ingressExpiryInMinutes <= 0) {
      throw new AgentError(`Ingress expiry time must be greater than 0. Provided ingress expiry time is ${options.ingressExpiryInMinutes} minutes.`);
    }
    __classPrivateFieldSet$4(this, _HttpAgent_maxIngressExpiryInMinutes, options.ingressExpiryInMinutes || 5, "f");
    this.addTransform("update", makeNonceTransform(makeNonce));
    if (options.useQueryNonces) {
      this.addTransform("query", makeNonceTransform(makeNonce));
    }
    if (options.logToConsole) {
      this.log.subscribe((log) => {
        if (log.level === "error") {
          console.error(log.message);
        } else if (log.level === "warn") {
          console.warn(log.message);
        } else {
          console.log(log.message);
        }
      });
    }
  }
  get waterMark() {
    return __classPrivateFieldGet$4(this, _HttpAgent_waterMark, "f");
  }
  static createSync(options = {}) {
    return new this(Object.assign({}, options));
  }
  static async create(options = {
    shouldFetchRootKey: false
  }) {
    const agent = HttpAgent.createSync(options);
    const initPromises = [agent.syncTime()];
    if (agent.host.toString() !== "https://icp-api.io" && options.shouldFetchRootKey) {
      initPromises.push(agent.fetchRootKey());
    }
    await Promise.all(initPromises);
    return agent;
  }
  static async from(agent) {
    var _a2;
    try {
      if ("config" in agent) {
        return await HttpAgent.create(agent.config);
      }
      return await HttpAgent.create({
        fetch: agent._fetch,
        fetchOptions: agent._fetchOptions,
        callOptions: agent._callOptions,
        host: agent._host.toString(),
        identity: (_a2 = agent._identity) !== null && _a2 !== void 0 ? _a2 : void 0
      });
    } catch (_b2) {
      throw new AgentError("Failed to create agent from provided agent");
    }
  }
  isLocal() {
    const hostname = this.host.hostname;
    return hostname === "127.0.0.1" || hostname.endsWith("127.0.0.1");
  }
  addTransform(type, fn, priority = fn.priority || 0) {
    if (type === "update") {
      const i = __classPrivateFieldGet$4(this, _HttpAgent_updatePipeline, "f").findIndex((x) => (x.priority || 0) < priority);
      __classPrivateFieldGet$4(this, _HttpAgent_updatePipeline, "f").splice(i >= 0 ? i : __classPrivateFieldGet$4(this, _HttpAgent_updatePipeline, "f").length, 0, Object.assign(fn, { priority }));
    } else if (type === "query") {
      const i = __classPrivateFieldGet$4(this, _HttpAgent_queryPipeline, "f").findIndex((x) => (x.priority || 0) < priority);
      __classPrivateFieldGet$4(this, _HttpAgent_queryPipeline, "f").splice(i >= 0 ? i : __classPrivateFieldGet$4(this, _HttpAgent_queryPipeline, "f").length, 0, Object.assign(fn, { priority }));
    }
  }
  async getPrincipal() {
    if (!__classPrivateFieldGet$4(this, _HttpAgent_identity, "f")) {
      throw new IdentityInvalidError("This identity has expired due this application's security policy. Please refresh your authentication.");
    }
    return (await __classPrivateFieldGet$4(this, _HttpAgent_identity, "f")).getPrincipal();
  }
  async call(canisterId2, options, identity) {
    var _a2, _b2;
    await __classPrivateFieldGet$4(this, _HttpAgent_instances, "m", _HttpAgent_rootKeyGuard).call(this);
    const callSync = (_a2 = options.callSync) !== null && _a2 !== void 0 ? _a2 : true;
    const id = await (identity !== void 0 ? await identity : await __classPrivateFieldGet$4(this, _HttpAgent_identity, "f"));
    if (!id) {
      throw new IdentityInvalidError("This identity has expired due this application's security policy. Please refresh your authentication.");
    }
    const canister = Principal$1.from(canisterId2);
    const ecid = options.effectiveCanisterId ? Principal$1.from(options.effectiveCanisterId) : canister;
    const sender = id.getPrincipal() || Principal$1.anonymous();
    let ingress_expiry = new Expiry(__classPrivateFieldGet$4(this, _HttpAgent_maxIngressExpiryInMinutes, "f") * MINUTE_TO_MSECS);
    if (Math.abs(__classPrivateFieldGet$4(this, _HttpAgent_timeDiffMsecs, "f")) > 1e3 * 30) {
      ingress_expiry = new Expiry(__classPrivateFieldGet$4(this, _HttpAgent_maxIngressExpiryInMinutes, "f") * MINUTE_TO_MSECS + __classPrivateFieldGet$4(this, _HttpAgent_timeDiffMsecs, "f"));
    }
    const submit = {
      request_type: SubmitRequestType.Call,
      canister_id: canister,
      method_name: options.methodName,
      arg: options.arg,
      sender,
      ingress_expiry
    };
    let transformedRequest = await this._transform({
      request: {
        body: null,
        method: "POST",
        headers: Object.assign({ "Content-Type": "application/cbor" }, __classPrivateFieldGet$4(this, _HttpAgent_credentials, "f") ? { Authorization: "Basic " + btoa(__classPrivateFieldGet$4(this, _HttpAgent_credentials, "f")) } : {})
      },
      endpoint: "call",
      body: submit
    });
    const nonce = transformedRequest.body.nonce ? toNonce(transformedRequest.body.nonce) : void 0;
    submit.nonce = nonce;
    function toNonce(buf) {
      return new Uint8Array(buf);
    }
    transformedRequest = await id.transformRequest(transformedRequest);
    const body = encode(transformedRequest.body);
    const backoff2 = __classPrivateFieldGet$4(this, _HttpAgent_backoffStrategy, "f").call(this);
    const requestId = requestIdOf(submit);
    try {
      const requestSync = () => {
        this.log.print(`fetching "/api/v3/canister/${ecid.toText()}/call" with request:`, transformedRequest);
        return __classPrivateFieldGet$4(this, _HttpAgent_fetch, "f").call(this, "" + new URL(`/api/v3/canister/${ecid.toText()}/call`, this.host), Object.assign(Object.assign(Object.assign({}, __classPrivateFieldGet$4(this, _HttpAgent_callOptions, "f")), transformedRequest.request), { body }));
      };
      const requestAsync = () => {
        this.log.print(`fetching "/api/v2/canister/${ecid.toText()}/call" with request:`, transformedRequest);
        return __classPrivateFieldGet$4(this, _HttpAgent_fetch, "f").call(this, "" + new URL(`/api/v2/canister/${ecid.toText()}/call`, this.host), Object.assign(Object.assign(Object.assign({}, __classPrivateFieldGet$4(this, _HttpAgent_callOptions, "f")), transformedRequest.request), { body }));
      };
      const request2 = __classPrivateFieldGet$4(this, _HttpAgent_instances, "m", _HttpAgent_requestAndRetry).call(this, {
        request: callSync ? requestSync : requestAsync,
        backoff: backoff2,
        tries: 0
      });
      const response = await request2;
      const responseBuffer = await response.arrayBuffer();
      const responseBody = response.status === 200 && responseBuffer.byteLength > 0 ? decode(responseBuffer) : null;
      if (responseBody && "certificate" in responseBody) {
        const time = await this.parseTimeFromResponse({
          certificate: responseBody.certificate
        });
        __classPrivateFieldSet$4(this, _HttpAgent_waterMark, time, "f");
      }
      return {
        requestId,
        response: {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          body: responseBody,
          headers: httpHeadersTransform(response.headers)
        },
        requestDetails: submit
      };
    } catch (error) {
      if (error.message.includes("v3 api not supported.")) {
        this.log.warn("v3 api not supported. Fall back to v2");
        return this.call(canisterId2, Object.assign(Object.assign({}, options), {
          // disable v3 api
          callSync: false
        }), identity);
      }
      const message = `Error while making call: ${(_b2 = error.message) !== null && _b2 !== void 0 ? _b2 : String(error)}`;
      const callError = new AgentCallError(message, error, toHex(requestId), toHex(transformedRequest.body.sender_pubkey), toHex(transformedRequest.body.sender_sig), String(transformedRequest.body.content.ingress_expiry["_value"]));
      this.log.error(message, callError);
      throw callError;
    }
  }
  async query(canisterId2, fields, identity) {
    var _a2, _b2, _c, _d;
    await __classPrivateFieldGet$4(this, _HttpAgent_instances, "m", _HttpAgent_rootKeyGuard).call(this);
    const backoff2 = __classPrivateFieldGet$4(this, _HttpAgent_backoffStrategy, "f").call(this);
    const ecid = fields.effectiveCanisterId ? Principal$1.from(fields.effectiveCanisterId) : Principal$1.from(canisterId2);
    this.log.print(`ecid ${ecid.toString()}`);
    this.log.print(`canisterId ${canisterId2.toString()}`);
    let transformedRequest = void 0;
    let queryResult;
    const id = await (identity !== void 0 ? identity : __classPrivateFieldGet$4(this, _HttpAgent_identity, "f"));
    if (!id) {
      throw new IdentityInvalidError("This identity has expired due this application's security policy. Please refresh your authentication.");
    }
    const canister = Principal$1.from(canisterId2);
    const sender = (id === null || id === void 0 ? void 0 : id.getPrincipal()) || Principal$1.anonymous();
    const request2 = {
      request_type: "query",
      canister_id: canister,
      method_name: fields.methodName,
      arg: fields.arg,
      sender,
      ingress_expiry: new Expiry(__classPrivateFieldGet$4(this, _HttpAgent_maxIngressExpiryInMinutes, "f") * MINUTE_TO_MSECS)
    };
    const requestId = requestIdOf(request2);
    transformedRequest = await this._transform({
      request: {
        method: "POST",
        headers: Object.assign({ "Content-Type": "application/cbor" }, __classPrivateFieldGet$4(this, _HttpAgent_credentials, "f") ? { Authorization: "Basic " + btoa(__classPrivateFieldGet$4(this, _HttpAgent_credentials, "f")) } : {})
      },
      endpoint: "read",
      body: request2
    });
    transformedRequest = await (id === null || id === void 0 ? void 0 : id.transformRequest(transformedRequest));
    const body = encode(transformedRequest.body);
    const args = {
      canister: canister.toText(),
      ecid,
      transformedRequest,
      body,
      requestId,
      backoff: backoff2,
      tries: 0
    };
    const makeQuery = async () => {
      return {
        requestDetails: request2,
        query: await __classPrivateFieldGet$4(this, _HttpAgent_instances, "m", _HttpAgent_requestAndRetryQuery).call(this, args)
      };
    };
    const getSubnetStatus = async () => {
      if (!__classPrivateFieldGet$4(this, _HttpAgent_verifyQuerySignatures, "f")) {
        return void 0;
      }
      const subnetStatus = __classPrivateFieldGet$4(this, _HttpAgent_subnetKeys, "f").get(ecid.toString());
      if (subnetStatus) {
        return subnetStatus;
      }
      await this.fetchSubnetKeys(ecid.toString());
      return __classPrivateFieldGet$4(this, _HttpAgent_subnetKeys, "f").get(ecid.toString());
    };
    try {
      const [_queryResult, subnetStatus] = await Promise.all([makeQuery(), getSubnetStatus()]);
      queryResult = _queryResult;
      const { requestDetails, query } = queryResult;
      const queryWithDetails = Object.assign(Object.assign({}, query), { requestDetails });
      this.log.print("Query response:", queryWithDetails);
      if (!__classPrivateFieldGet$4(this, _HttpAgent_verifyQuerySignatures, "f")) {
        return queryWithDetails;
      }
      try {
        return __classPrivateFieldGet$4(this, _HttpAgent_verifyQueryResponse, "f").call(this, queryWithDetails, subnetStatus);
      } catch (_e) {
        this.log.warn("Query response verification failed. Retrying with fresh subnet keys.");
        __classPrivateFieldGet$4(this, _HttpAgent_subnetKeys, "f").delete(canisterId2.toString());
        await this.fetchSubnetKeys(ecid.toString());
        const updatedSubnetStatus = __classPrivateFieldGet$4(this, _HttpAgent_subnetKeys, "f").get(canisterId2.toString());
        if (!updatedSubnetStatus) {
          throw new CertificateVerificationError("Invalid signature from replica signed query: no matching node key found.");
        }
        return __classPrivateFieldGet$4(this, _HttpAgent_verifyQueryResponse, "f").call(this, queryWithDetails, updatedSubnetStatus);
      }
    } catch (error) {
      const message = `Error while making call: ${(_a2 = error.message) !== null && _a2 !== void 0 ? _a2 : String(error)}`;
      const queryError = new AgentQueryError(message, error, String(requestId), toHex((_b2 = transformedRequest === null || transformedRequest === void 0 ? void 0 : transformedRequest.body) === null || _b2 === void 0 ? void 0 : _b2.sender_pubkey), toHex((_c = transformedRequest === null || transformedRequest === void 0 ? void 0 : transformedRequest.body) === null || _c === void 0 ? void 0 : _c.sender_sig), String((_d = transformedRequest === null || transformedRequest === void 0 ? void 0 : transformedRequest.body) === null || _d === void 0 ? void 0 : _d.content.ingress_expiry["_value"]));
      this.log.error(message, queryError);
      throw queryError;
    }
  }
  async createReadStateRequest(fields, identity) {
    await __classPrivateFieldGet$4(this, _HttpAgent_instances, "m", _HttpAgent_rootKeyGuard).call(this);
    const id = await (identity !== void 0 ? await identity : await __classPrivateFieldGet$4(this, _HttpAgent_identity, "f"));
    if (!id) {
      throw new IdentityInvalidError("This identity has expired due this application's security policy. Please refresh your authentication.");
    }
    const sender = (id === null || id === void 0 ? void 0 : id.getPrincipal()) || Principal$1.anonymous();
    const transformedRequest = await this._transform({
      request: {
        method: "POST",
        headers: Object.assign({ "Content-Type": "application/cbor" }, __classPrivateFieldGet$4(this, _HttpAgent_credentials, "f") ? { Authorization: "Basic " + btoa(__classPrivateFieldGet$4(this, _HttpAgent_credentials, "f")) } : {})
      },
      endpoint: "read_state",
      body: {
        request_type: "read_state",
        paths: fields.paths,
        sender,
        ingress_expiry: new Expiry(__classPrivateFieldGet$4(this, _HttpAgent_maxIngressExpiryInMinutes, "f") * MINUTE_TO_MSECS)
      }
    });
    return id === null || id === void 0 ? void 0 : id.transformRequest(transformedRequest);
  }
  async readState(canisterId2, fields, identity, request2) {
    var _a2, _b2, _c, _d;
    function getRequestId(fields2) {
      for (const path of fields2.paths) {
        const [pathName, value2] = path;
        const request_status = new TextEncoder().encode("request_status");
        if (bufEquals(pathName, request_status)) {
          return value2;
        }
      }
    }
    const requestId = getRequestId(fields);
    await __classPrivateFieldGet$4(this, _HttpAgent_instances, "m", _HttpAgent_rootKeyGuard).call(this);
    const canister = typeof canisterId2 === "string" ? Principal$1.fromText(canisterId2) : canisterId2;
    const transformedRequest = request2 !== null && request2 !== void 0 ? request2 : await this.createReadStateRequest(fields, identity);
    const body = encode(transformedRequest.body);
    this.log.print(`fetching "/api/v2/canister/${canister}/read_state" with request:`, transformedRequest);
    const backoff2 = __classPrivateFieldGet$4(this, _HttpAgent_backoffStrategy, "f").call(this);
    try {
      const response = await __classPrivateFieldGet$4(this, _HttpAgent_instances, "m", _HttpAgent_requestAndRetry).call(this, {
        request: () => __classPrivateFieldGet$4(this, _HttpAgent_fetch, "f").call(this, "" + new URL(`/api/v2/canister/${canister.toString()}/read_state`, this.host), Object.assign(Object.assign(Object.assign({}, __classPrivateFieldGet$4(this, _HttpAgent_fetchOptions, "f")), transformedRequest.request), { body })),
        backoff: backoff2,
        tries: 0
      });
      if (!response.ok) {
        throw new Error(`Server returned an error:
  Code: ${response.status} (${response.statusText})
  Body: ${await response.text()}
`);
      }
      const decodedResponse = decode(await response.arrayBuffer());
      this.log.print("Read state response:", decodedResponse);
      const parsedTime = await this.parseTimeFromResponse(decodedResponse);
      if (parsedTime > 0) {
        this.log.print("Read state response time:", parsedTime);
        __classPrivateFieldSet$4(this, _HttpAgent_waterMark, parsedTime, "f");
      }
      return decodedResponse;
    } catch (error) {
      const message = `Caught exception while attempting to read state: ${(_a2 = error.message) !== null && _a2 !== void 0 ? _a2 : String(error)}`;
      const readStateError = new AgentReadStateError(message, error, String(requestId), toHex((_b2 = transformedRequest === null || transformedRequest === void 0 ? void 0 : transformedRequest.body) === null || _b2 === void 0 ? void 0 : _b2.sender_pubkey), toHex((_c = transformedRequest === null || transformedRequest === void 0 ? void 0 : transformedRequest.body) === null || _c === void 0 ? void 0 : _c.sender_sig), String((_d = transformedRequest === null || transformedRequest === void 0 ? void 0 : transformedRequest.body) === null || _d === void 0 ? void 0 : _d.content.ingress_expiry["_value"]));
      this.log.error(message, readStateError);
      throw readStateError;
    }
  }
  async parseTimeFromResponse(response) {
    let tree;
    if (response.certificate) {
      const decoded = decode(response.certificate);
      if (decoded && "tree" in decoded) {
        tree = decoded.tree;
      } else {
        throw new Error("Could not decode time from response");
      }
      const timeLookup = lookup_path(["time"], tree);
      if (timeLookup.status !== LookupStatus.Found) {
        throw new Error("Time was not found in the response or was not in its expected format.");
      }
      if (!(timeLookup.value instanceof ArrayBuffer) && !ArrayBuffer.isView(timeLookup)) {
        throw new Error("Time was not found in the response or was not in its expected format.");
      }
      const date = decodeTime(bufFromBufLike$1(timeLookup.value));
      this.log.print("Time from response:", date);
      this.log.print("Time from response in milliseconds:", Number(date));
      return Number(date);
    } else {
      this.log.warn("No certificate found in response");
    }
    return 0;
  }
  /**
   * Allows agent to sync its time with the network. Can be called during intialization or mid-lifecycle if the device's clock has drifted away from the network time. This is necessary to set the Expiry for a request
   * @param {Principal} canisterId - Pass a canister ID if you need to sync the time with a particular replica. Uses the management canister by default
   */
  async syncTime(canisterId2) {
    await __classPrivateFieldGet$4(this, _HttpAgent_instances, "m", _HttpAgent_rootKeyGuard).call(this);
    const CanisterStatus = await __vitePreload(() => Promise.resolve().then(() => index), true ? void 0 : void 0);
    const callTime = Date.now();
    try {
      if (!canisterId2) {
        this.log.print("Syncing time with the IC. No canisterId provided, so falling back to ryjl3-tyaaa-aaaaa-aaaba-cai");
      }
      const anonymousAgent = HttpAgent.createSync({
        identity: new AnonymousIdentity(),
        host: this.host.toString(),
        fetch: __classPrivateFieldGet$4(this, _HttpAgent_fetch, "f"),
        retryTimes: 0
      });
      const status = await CanisterStatus.request({
        // Fall back with canisterId of the ICP Ledger
        canisterId: canisterId2 !== null && canisterId2 !== void 0 ? canisterId2 : Principal$1.from("ryjl3-tyaaa-aaaaa-aaaba-cai"),
        agent: anonymousAgent,
        paths: ["time"]
      });
      const replicaTime = status.get("time");
      if (replicaTime) {
        __classPrivateFieldSet$4(this, _HttpAgent_timeDiffMsecs, Number(replicaTime) - Number(callTime), "f");
        this.log.notify({
          message: `Syncing time: offset of ${__classPrivateFieldGet$4(this, _HttpAgent_timeDiffMsecs, "f")}`,
          level: "info"
        });
      }
    } catch (error) {
      this.log.error("Caught exception while attempting to sync time", error);
    }
  }
  async status() {
    const headers = __classPrivateFieldGet$4(this, _HttpAgent_credentials, "f") ? {
      Authorization: "Basic " + btoa(__classPrivateFieldGet$4(this, _HttpAgent_credentials, "f"))
    } : {};
    this.log.print(`fetching "/api/v2/status"`);
    const backoff2 = __classPrivateFieldGet$4(this, _HttpAgent_backoffStrategy, "f").call(this);
    const response = await __classPrivateFieldGet$4(this, _HttpAgent_instances, "m", _HttpAgent_requestAndRetry).call(this, {
      backoff: backoff2,
      request: () => __classPrivateFieldGet$4(this, _HttpAgent_fetch, "f").call(this, "" + new URL(`/api/v2/status`, this.host), Object.assign({ headers }, __classPrivateFieldGet$4(this, _HttpAgent_fetchOptions, "f"))),
      tries: 0
    });
    return decode(await response.arrayBuffer());
  }
  async fetchRootKey() {
    let result;
    if (__classPrivateFieldGet$4(this, _HttpAgent_rootKeyPromise, "f")) {
      result = await __classPrivateFieldGet$4(this, _HttpAgent_rootKeyPromise, "f");
    } else {
      __classPrivateFieldSet$4(this, _HttpAgent_rootKeyPromise, new Promise((resolve, reject) => {
        this.status().then((value2) => {
          const rootKey = value2.root_key;
          this.rootKey = rootKey;
          resolve(rootKey);
        }).catch(reject);
      }), "f");
      result = await __classPrivateFieldGet$4(this, _HttpAgent_rootKeyPromise, "f");
    }
    __classPrivateFieldSet$4(this, _HttpAgent_rootKeyPromise, null, "f");
    return result;
  }
  invalidateIdentity() {
    __classPrivateFieldSet$4(this, _HttpAgent_identity, null, "f");
  }
  replaceIdentity(identity) {
    __classPrivateFieldSet$4(this, _HttpAgent_identity, Promise.resolve(identity), "f");
  }
  async fetchSubnetKeys(canisterId2) {
    await __classPrivateFieldGet$4(this, _HttpAgent_instances, "m", _HttpAgent_rootKeyGuard).call(this);
    const effectiveCanisterId = Principal$1.from(canisterId2);
    const response = await request({
      canisterId: effectiveCanisterId,
      paths: ["subnet"],
      agent: this
    });
    const subnetResponse = response.get("subnet");
    if (subnetResponse && typeof subnetResponse === "object" && "nodeKeys" in subnetResponse) {
      __classPrivateFieldGet$4(this, _HttpAgent_subnetKeys, "f").set(effectiveCanisterId.toText(), subnetResponse);
      return subnetResponse;
    }
    return void 0;
  }
  _transform(request2) {
    let p = Promise.resolve(request2);
    if (request2.endpoint === "call") {
      for (const fn of __classPrivateFieldGet$4(this, _HttpAgent_updatePipeline, "f")) {
        p = p.then((r) => fn(r).then((r2) => r2 || r));
      }
    } else {
      for (const fn of __classPrivateFieldGet$4(this, _HttpAgent_queryPipeline, "f")) {
        p = p.then((r) => fn(r).then((r2) => r2 || r));
      }
    }
    return p;
  }
}
_HttpAgent_rootKeyPromise = /* @__PURE__ */ new WeakMap(), _HttpAgent_shouldFetchRootKey = /* @__PURE__ */ new WeakMap(), _HttpAgent_identity = /* @__PURE__ */ new WeakMap(), _HttpAgent_fetch = /* @__PURE__ */ new WeakMap(), _HttpAgent_fetchOptions = /* @__PURE__ */ new WeakMap(), _HttpAgent_callOptions = /* @__PURE__ */ new WeakMap(), _HttpAgent_timeDiffMsecs = /* @__PURE__ */ new WeakMap(), _HttpAgent_credentials = /* @__PURE__ */ new WeakMap(), _HttpAgent_retryTimes = /* @__PURE__ */ new WeakMap(), _HttpAgent_backoffStrategy = /* @__PURE__ */ new WeakMap(), _HttpAgent_maxIngressExpiryInMinutes = /* @__PURE__ */ new WeakMap(), _HttpAgent_waterMark = /* @__PURE__ */ new WeakMap(), _HttpAgent_queryPipeline = /* @__PURE__ */ new WeakMap(), _HttpAgent_updatePipeline = /* @__PURE__ */ new WeakMap(), _HttpAgent_subnetKeys = /* @__PURE__ */ new WeakMap(), _HttpAgent_verifyQuerySignatures = /* @__PURE__ */ new WeakMap(), _HttpAgent_verifyQueryResponse = /* @__PURE__ */ new WeakMap(), _HttpAgent_instances = /* @__PURE__ */ new WeakSet(), _HttpAgent_requestAndRetryQuery = async function _HttpAgent_requestAndRetryQuery2(args) {
  var _a2, _b2;
  const { ecid, transformedRequest, body, requestId, backoff: backoff2, tries } = args;
  const delay = tries === 0 ? 0 : backoff2.next();
  this.log.print(`fetching "/api/v2/canister/${ecid.toString()}/query" with tries:`, {
    tries,
    backoff: backoff2,
    delay
  });
  if (delay === null) {
    throw new AgentError(`Timestamp failed to pass the watermark after retrying the configured ${__classPrivateFieldGet$4(this, _HttpAgent_retryTimes, "f")} times. We cannot guarantee the integrity of the response since it could be a replay attack.`);
  }
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  let response;
  try {
    this.log.print(`fetching "/api/v2/canister/${ecid.toString()}/query" with request:`, transformedRequest);
    const fetchResponse = await __classPrivateFieldGet$4(this, _HttpAgent_fetch, "f").call(this, "" + new URL(`/api/v2/canister/${ecid.toString()}/query`, this.host), Object.assign(Object.assign(Object.assign({}, __classPrivateFieldGet$4(this, _HttpAgent_fetchOptions, "f")), transformedRequest.request), { body }));
    if (fetchResponse.status === 200) {
      const queryResponse = decode(await fetchResponse.arrayBuffer());
      response = Object.assign(Object.assign({}, queryResponse), { httpDetails: {
        ok: fetchResponse.ok,
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: httpHeadersTransform(fetchResponse.headers)
      }, requestId });
    } else {
      throw new AgentHTTPResponseError(`Gateway returned an error:
  Code: ${fetchResponse.status} (${fetchResponse.statusText})
  Body: ${await fetchResponse.text()}
`, {
        ok: fetchResponse.ok,
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: httpHeadersTransform(fetchResponse.headers)
      });
    }
  } catch (error) {
    if (tries < __classPrivateFieldGet$4(this, _HttpAgent_retryTimes, "f")) {
      this.log.warn(`Caught exception while attempting to make query:
  ${error}
  Retrying query.`);
      return await __classPrivateFieldGet$4(this, _HttpAgent_instances, "m", _HttpAgent_requestAndRetryQuery2).call(this, Object.assign(Object.assign({}, args), { tries: tries + 1 }));
    }
    throw error;
  }
  const timestamp = (_b2 = (_a2 = response.signatures) === null || _a2 === void 0 ? void 0 : _a2[0]) === null || _b2 === void 0 ? void 0 : _b2.timestamp;
  if (!__classPrivateFieldGet$4(this, _HttpAgent_verifyQuerySignatures, "f")) {
    return response;
  }
  if (!timestamp) {
    throw new Error("Timestamp not found in query response. This suggests a malformed or malicious response.");
  }
  const timeStampInMs = Number(BigInt(timestamp) / BigInt(1e6));
  this.log.print("watermark and timestamp", {
    waterMark: this.waterMark,
    timestamp: timeStampInMs
  });
  if (Number(this.waterMark) > timeStampInMs) {
    const error = new AgentError("Timestamp is below the watermark. Retrying query.");
    this.log.error("Timestamp is below", error, {
      timestamp,
      waterMark: this.waterMark
    });
    if (tries < __classPrivateFieldGet$4(this, _HttpAgent_retryTimes, "f")) {
      return await __classPrivateFieldGet$4(this, _HttpAgent_instances, "m", _HttpAgent_requestAndRetryQuery2).call(this, Object.assign(Object.assign({}, args), { tries: tries + 1 }));
    }
    {
      throw new AgentError(`Timestamp failed to pass the watermark after retrying the configured ${__classPrivateFieldGet$4(this, _HttpAgent_retryTimes, "f")} times. We cannot guarantee the integrity of the response since it could be a replay attack.`);
    }
  }
  return response;
}, _HttpAgent_requestAndRetry = async function _HttpAgent_requestAndRetry2(args) {
  const { request: request2, backoff: backoff2, tries } = args;
  const delay = tries === 0 ? 0 : backoff2.next();
  if (delay === null) {
    throw new AgentError(`Timestamp failed to pass the watermark after retrying the configured ${__classPrivateFieldGet$4(this, _HttpAgent_retryTimes, "f")} times. We cannot guarantee the integrity of the response since it could be a replay attack.`);
  }
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  let response;
  try {
    response = await request2();
  } catch (error) {
    if (__classPrivateFieldGet$4(this, _HttpAgent_retryTimes, "f") > tries) {
      this.log.warn(`Caught exception while attempting to make request:
  ${error}
  Retrying request.`);
      return await __classPrivateFieldGet$4(this, _HttpAgent_instances, "m", _HttpAgent_requestAndRetry2).call(this, { request: request2, backoff: backoff2, tries: tries + 1 });
    }
    throw error;
  }
  if (response.ok) {
    return response;
  }
  const responseText = await response.clone().text();
  const errorMessage = `Server returned an error:
  Code: ${response.status} (${response.statusText})
  Body: ${responseText}
`;
  if (response.status === 404 && response.url.includes("api/v3")) {
    throw new AgentHTTPResponseError("v3 api not supported. Fall back to v2", {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: httpHeadersTransform(response.headers)
    });
  }
  if (tries < __classPrivateFieldGet$4(this, _HttpAgent_retryTimes, "f")) {
    return await __classPrivateFieldGet$4(this, _HttpAgent_instances, "m", _HttpAgent_requestAndRetry2).call(this, { request: request2, backoff: backoff2, tries: tries + 1 });
  }
  throw new AgentHTTPResponseError(errorMessage, {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    headers: httpHeadersTransform(response.headers)
  });
}, _HttpAgent_rootKeyGuard = async function _HttpAgent_rootKeyGuard2() {
  if (this.rootKey) {
    return;
  } else if (this.rootKey === null && __classPrivateFieldGet$4(this, _HttpAgent_shouldFetchRootKey, "f")) {
    await this.fetchRootKey();
  } else {
    throw new AgentError(`Invalid root key detected. The root key for this agent is ${this.rootKey} and the shouldFetchRootKey value is set to ${__classPrivateFieldGet$4(this, _HttpAgent_shouldFetchRootKey, "f")}. The root key should only be unknown if you are in local development. Otherwise you should avoid fetching and use the default IC Root Key or the known root key of your environment.`);
  }
};
var ProxyMessageKind;
(function(ProxyMessageKind2) {
  ProxyMessageKind2["Error"] = "err";
  ProxyMessageKind2["GetPrincipal"] = "gp";
  ProxyMessageKind2["GetPrincipalResponse"] = "gpr";
  ProxyMessageKind2["Query"] = "q";
  ProxyMessageKind2["QueryResponse"] = "qr";
  ProxyMessageKind2["Call"] = "c";
  ProxyMessageKind2["CallResponse"] = "cr";
  ProxyMessageKind2["ReadState"] = "rs";
  ProxyMessageKind2["ReadStateResponse"] = "rsr";
  ProxyMessageKind2["Status"] = "s";
  ProxyMessageKind2["StatusResponse"] = "sr";
})(ProxyMessageKind || (ProxyMessageKind = {}));
function getDefaultAgent() {
  const agent = typeof window === "undefined" ? typeof global === "undefined" ? typeof self === "undefined" ? void 0 : self.ic.agent : global.ic.agent : window.ic.agent;
  if (!agent) {
    throw new Error("No Agent could be found.");
  }
  return agent;
}
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId2, requestId, status) => {
    if (await condition(canisterId2, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (canisterId2, requestId, status) => {
    if (Date.now() > end) {
      throw new Error(`Request timed out after ${timeInMsec} msec:
  Request ID: ${toHex(requestId)}
  Request status: ${status}
`);
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId2, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId2, requestId, status);
    }
  };
}
async function pollForResponse(agent, canisterId2, requestId, strategy = defaultStrategy(), request2, blsVerify2) {
  var _a2;
  const path = [new TextEncoder().encode("request_status"), requestId];
  const currentRequest = request2 !== null && request2 !== void 0 ? request2 : await ((_a2 = agent.createReadStateRequest) === null || _a2 === void 0 ? void 0 : _a2.call(agent, { paths: [path] }));
  const state = await agent.readState(canisterId2, { paths: [path] }, void 0, currentRequest);
  if (agent.rootKey == null)
    throw new Error("Agent root key not initialized before polling");
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId: canisterId2,
    blsVerify: blsVerify2
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup([...path, new TextEncoder().encode("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing:
      await strategy(canisterId2, requestId, status);
      return pollForResponse(agent, canisterId2, requestId, strategy, currentRequest, blsVerify2);
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup([...path, "reject_message"])));
      throw new Error(`Call was rejected:
  Request ID: ${toHex(requestId)}
  Reject code: ${rejectCode}
  Reject text: ${rejectMessage}
`);
    }
    case RequestStatusResponseStatus.Done:
      throw new Error(`Call was marked as done but we never saw the reply:
  Request ID: ${toHex(requestId)}
`);
  }
  throw new Error("unreachable");
}
const managementCanisterIdl = ({ IDL: IDL2 }) => {
  const bitcoin_network = IDL2.Variant({
    mainnet: IDL2.Null,
    testnet: IDL2.Null
  });
  const bitcoin_address = IDL2.Text;
  const bitcoin_get_balance_args = IDL2.Record({
    network: bitcoin_network,
    address: bitcoin_address,
    min_confirmations: IDL2.Opt(IDL2.Nat32)
  });
  const satoshi = IDL2.Nat64;
  const bitcoin_get_balance_result = satoshi;
  const bitcoin_block_height = IDL2.Nat32;
  const bitcoin_get_block_headers_args = IDL2.Record({
    start_height: bitcoin_block_height,
    end_height: IDL2.Opt(bitcoin_block_height),
    network: bitcoin_network
  });
  const bitcoin_block_header = IDL2.Vec(IDL2.Nat8);
  const bitcoin_get_block_headers_result = IDL2.Record({
    tip_height: bitcoin_block_height,
    block_headers: IDL2.Vec(bitcoin_block_header)
  });
  const bitcoin_get_current_fee_percentiles_args = IDL2.Record({
    network: bitcoin_network
  });
  const millisatoshi_per_byte = IDL2.Nat64;
  const bitcoin_get_current_fee_percentiles_result = IDL2.Vec(millisatoshi_per_byte);
  const bitcoin_get_utxos_args = IDL2.Record({
    network: bitcoin_network,
    filter: IDL2.Opt(IDL2.Variant({
      page: IDL2.Vec(IDL2.Nat8),
      min_confirmations: IDL2.Nat32
    })),
    address: bitcoin_address
  });
  const bitcoin_block_hash = IDL2.Vec(IDL2.Nat8);
  const outpoint = IDL2.Record({
    txid: IDL2.Vec(IDL2.Nat8),
    vout: IDL2.Nat32
  });
  const utxo = IDL2.Record({
    height: IDL2.Nat32,
    value: satoshi,
    outpoint
  });
  const bitcoin_get_utxos_result = IDL2.Record({
    next_page: IDL2.Opt(IDL2.Vec(IDL2.Nat8)),
    tip_height: bitcoin_block_height,
    tip_block_hash: bitcoin_block_hash,
    utxos: IDL2.Vec(utxo)
  });
  const bitcoin_send_transaction_args = IDL2.Record({
    transaction: IDL2.Vec(IDL2.Nat8),
    network: bitcoin_network
  });
  const canister_id = IDL2.Principal;
  const canister_info_args = IDL2.Record({
    canister_id,
    num_requested_changes: IDL2.Opt(IDL2.Nat64)
  });
  const change_origin = IDL2.Variant({
    from_user: IDL2.Record({ user_id: IDL2.Principal }),
    from_canister: IDL2.Record({
      canister_version: IDL2.Opt(IDL2.Nat64),
      canister_id: IDL2.Principal
    })
  });
  const snapshot_id = IDL2.Vec(IDL2.Nat8);
  const change_details = IDL2.Variant({
    creation: IDL2.Record({ controllers: IDL2.Vec(IDL2.Principal) }),
    code_deployment: IDL2.Record({
      mode: IDL2.Variant({
        reinstall: IDL2.Null,
        upgrade: IDL2.Null,
        install: IDL2.Null
      }),
      module_hash: IDL2.Vec(IDL2.Nat8)
    }),
    load_snapshot: IDL2.Record({
      canister_version: IDL2.Nat64,
      taken_at_timestamp: IDL2.Nat64,
      snapshot_id
    }),
    controllers_change: IDL2.Record({
      controllers: IDL2.Vec(IDL2.Principal)
    }),
    code_uninstall: IDL2.Null
  });
  const change = IDL2.Record({
    timestamp_nanos: IDL2.Nat64,
    canister_version: IDL2.Nat64,
    origin: change_origin,
    details: change_details
  });
  const canister_info_result = IDL2.Record({
    controllers: IDL2.Vec(IDL2.Principal),
    module_hash: IDL2.Opt(IDL2.Vec(IDL2.Nat8)),
    recent_changes: IDL2.Vec(change),
    total_num_changes: IDL2.Nat64
  });
  const canister_status_args = IDL2.Record({ canister_id });
  const log_visibility = IDL2.Variant({
    controllers: IDL2.Null,
    public: IDL2.Null,
    allowed_viewers: IDL2.Vec(IDL2.Principal)
  });
  const definite_canister_settings = IDL2.Record({
    freezing_threshold: IDL2.Nat,
    controllers: IDL2.Vec(IDL2.Principal),
    reserved_cycles_limit: IDL2.Nat,
    log_visibility,
    wasm_memory_limit: IDL2.Nat,
    memory_allocation: IDL2.Nat,
    compute_allocation: IDL2.Nat
  });
  const canister_status_result = IDL2.Record({
    status: IDL2.Variant({
      stopped: IDL2.Null,
      stopping: IDL2.Null,
      running: IDL2.Null
    }),
    memory_size: IDL2.Nat,
    cycles: IDL2.Nat,
    settings: definite_canister_settings,
    query_stats: IDL2.Record({
      response_payload_bytes_total: IDL2.Nat,
      num_instructions_total: IDL2.Nat,
      num_calls_total: IDL2.Nat,
      request_payload_bytes_total: IDL2.Nat
    }),
    idle_cycles_burned_per_day: IDL2.Nat,
    module_hash: IDL2.Opt(IDL2.Vec(IDL2.Nat8)),
    reserved_cycles: IDL2.Nat
  });
  const clear_chunk_store_args = IDL2.Record({ canister_id });
  const canister_settings = IDL2.Record({
    freezing_threshold: IDL2.Opt(IDL2.Nat),
    controllers: IDL2.Opt(IDL2.Vec(IDL2.Principal)),
    reserved_cycles_limit: IDL2.Opt(IDL2.Nat),
    log_visibility: IDL2.Opt(log_visibility),
    wasm_memory_limit: IDL2.Opt(IDL2.Nat),
    memory_allocation: IDL2.Opt(IDL2.Nat),
    compute_allocation: IDL2.Opt(IDL2.Nat)
  });
  const create_canister_args = IDL2.Record({
    settings: IDL2.Opt(canister_settings),
    sender_canister_version: IDL2.Opt(IDL2.Nat64)
  });
  const create_canister_result = IDL2.Record({ canister_id });
  const delete_canister_args = IDL2.Record({ canister_id });
  const delete_canister_snapshot_args = IDL2.Record({
    canister_id,
    snapshot_id
  });
  const deposit_cycles_args = IDL2.Record({ canister_id });
  const ecdsa_curve = IDL2.Variant({ secp256k1: IDL2.Null });
  const ecdsa_public_key_args = IDL2.Record({
    key_id: IDL2.Record({ name: IDL2.Text, curve: ecdsa_curve }),
    canister_id: IDL2.Opt(canister_id),
    derivation_path: IDL2.Vec(IDL2.Vec(IDL2.Nat8))
  });
  const ecdsa_public_key_result = IDL2.Record({
    public_key: IDL2.Vec(IDL2.Nat8),
    chain_code: IDL2.Vec(IDL2.Nat8)
  });
  const fetch_canister_logs_args = IDL2.Record({ canister_id });
  const canister_log_record = IDL2.Record({
    idx: IDL2.Nat64,
    timestamp_nanos: IDL2.Nat64,
    content: IDL2.Vec(IDL2.Nat8)
  });
  const fetch_canister_logs_result = IDL2.Record({
    canister_log_records: IDL2.Vec(canister_log_record)
  });
  const http_header = IDL2.Record({ value: IDL2.Text, name: IDL2.Text });
  const http_request_result = IDL2.Record({
    status: IDL2.Nat,
    body: IDL2.Vec(IDL2.Nat8),
    headers: IDL2.Vec(http_header)
  });
  const http_request_args = IDL2.Record({
    url: IDL2.Text,
    method: IDL2.Variant({
      get: IDL2.Null,
      head: IDL2.Null,
      post: IDL2.Null
    }),
    max_response_bytes: IDL2.Opt(IDL2.Nat64),
    body: IDL2.Opt(IDL2.Vec(IDL2.Nat8)),
    transform: IDL2.Opt(IDL2.Record({
      function: IDL2.Func([
        IDL2.Record({
          context: IDL2.Vec(IDL2.Nat8),
          response: http_request_result
        })
      ], [http_request_result], ["query"]),
      context: IDL2.Vec(IDL2.Nat8)
    })),
    headers: IDL2.Vec(http_header)
  });
  const canister_install_mode = IDL2.Variant({
    reinstall: IDL2.Null,
    upgrade: IDL2.Opt(IDL2.Record({
      wasm_memory_persistence: IDL2.Opt(IDL2.Variant({ keep: IDL2.Null, replace: IDL2.Null })),
      skip_pre_upgrade: IDL2.Opt(IDL2.Bool)
    })),
    install: IDL2.Null
  });
  const chunk_hash = IDL2.Record({ hash: IDL2.Vec(IDL2.Nat8) });
  const install_chunked_code_args = IDL2.Record({
    arg: IDL2.Vec(IDL2.Nat8),
    wasm_module_hash: IDL2.Vec(IDL2.Nat8),
    mode: canister_install_mode,
    chunk_hashes_list: IDL2.Vec(chunk_hash),
    target_canister: canister_id,
    store_canister: IDL2.Opt(canister_id),
    sender_canister_version: IDL2.Opt(IDL2.Nat64)
  });
  const wasm_module = IDL2.Vec(IDL2.Nat8);
  const install_code_args = IDL2.Record({
    arg: IDL2.Vec(IDL2.Nat8),
    wasm_module,
    mode: canister_install_mode,
    canister_id,
    sender_canister_version: IDL2.Opt(IDL2.Nat64)
  });
  const list_canister_snapshots_args = IDL2.Record({
    canister_id
  });
  const snapshot = IDL2.Record({
    id: snapshot_id,
    total_size: IDL2.Nat64,
    taken_at_timestamp: IDL2.Nat64
  });
  const list_canister_snapshots_result = IDL2.Vec(snapshot);
  const load_canister_snapshot_args = IDL2.Record({
    canister_id,
    sender_canister_version: IDL2.Opt(IDL2.Nat64),
    snapshot_id
  });
  const node_metrics_history_args = IDL2.Record({
    start_at_timestamp_nanos: IDL2.Nat64,
    subnet_id: IDL2.Principal
  });
  const node_metrics = IDL2.Record({
    num_block_failures_total: IDL2.Nat64,
    node_id: IDL2.Principal,
    num_blocks_proposed_total: IDL2.Nat64
  });
  const node_metrics_history_result = IDL2.Vec(IDL2.Record({
    timestamp_nanos: IDL2.Nat64,
    node_metrics: IDL2.Vec(node_metrics)
  }));
  const provisional_create_canister_with_cycles_args = IDL2.Record({
    settings: IDL2.Opt(canister_settings),
    specified_id: IDL2.Opt(canister_id),
    amount: IDL2.Opt(IDL2.Nat),
    sender_canister_version: IDL2.Opt(IDL2.Nat64)
  });
  const provisional_create_canister_with_cycles_result = IDL2.Record({
    canister_id
  });
  const provisional_top_up_canister_args = IDL2.Record({
    canister_id,
    amount: IDL2.Nat
  });
  const raw_rand_result = IDL2.Vec(IDL2.Nat8);
  const schnorr_algorithm = IDL2.Variant({
    ed25519: IDL2.Null,
    bip340secp256k1: IDL2.Null
  });
  const schnorr_public_key_args = IDL2.Record({
    key_id: IDL2.Record({
      algorithm: schnorr_algorithm,
      name: IDL2.Text
    }),
    canister_id: IDL2.Opt(canister_id),
    derivation_path: IDL2.Vec(IDL2.Vec(IDL2.Nat8))
  });
  const schnorr_public_key_result = IDL2.Record({
    public_key: IDL2.Vec(IDL2.Nat8),
    chain_code: IDL2.Vec(IDL2.Nat8)
  });
  const sign_with_ecdsa_args = IDL2.Record({
    key_id: IDL2.Record({ name: IDL2.Text, curve: ecdsa_curve }),
    derivation_path: IDL2.Vec(IDL2.Vec(IDL2.Nat8)),
    message_hash: IDL2.Vec(IDL2.Nat8)
  });
  const sign_with_ecdsa_result = IDL2.Record({
    signature: IDL2.Vec(IDL2.Nat8)
  });
  const schnorr_aux = IDL2.Variant({
    bip341: IDL2.Record({ merkle_root_hash: IDL2.Vec(IDL2.Nat8) })
  });
  const sign_with_schnorr_args = IDL2.Record({
    aux: IDL2.Opt(schnorr_aux),
    key_id: IDL2.Record({
      algorithm: schnorr_algorithm,
      name: IDL2.Text
    }),
    derivation_path: IDL2.Vec(IDL2.Vec(IDL2.Nat8)),
    message: IDL2.Vec(IDL2.Nat8)
  });
  const sign_with_schnorr_result = IDL2.Record({
    signature: IDL2.Vec(IDL2.Nat8)
  });
  const start_canister_args = IDL2.Record({ canister_id });
  const stop_canister_args = IDL2.Record({ canister_id });
  const stored_chunks_args = IDL2.Record({ canister_id });
  const stored_chunks_result = IDL2.Vec(chunk_hash);
  const subnet_info_args = IDL2.Record({ subnet_id: IDL2.Principal });
  const subnet_info_result = IDL2.Record({ replica_version: IDL2.Text });
  const take_canister_snapshot_args = IDL2.Record({
    replace_snapshot: IDL2.Opt(snapshot_id),
    canister_id
  });
  const take_canister_snapshot_result = snapshot;
  const uninstall_code_args = IDL2.Record({
    canister_id,
    sender_canister_version: IDL2.Opt(IDL2.Nat64)
  });
  const update_settings_args = IDL2.Record({
    canister_id: IDL2.Principal,
    settings: canister_settings,
    sender_canister_version: IDL2.Opt(IDL2.Nat64)
  });
  const upload_chunk_args = IDL2.Record({
    chunk: IDL2.Vec(IDL2.Nat8),
    canister_id: IDL2.Principal
  });
  const upload_chunk_result = chunk_hash;
  return IDL2.Service({
    bitcoin_get_balance: IDL2.Func([bitcoin_get_balance_args], [bitcoin_get_balance_result], []),
    bitcoin_get_block_headers: IDL2.Func([bitcoin_get_block_headers_args], [bitcoin_get_block_headers_result], []),
    bitcoin_get_current_fee_percentiles: IDL2.Func([bitcoin_get_current_fee_percentiles_args], [bitcoin_get_current_fee_percentiles_result], []),
    bitcoin_get_utxos: IDL2.Func([bitcoin_get_utxos_args], [bitcoin_get_utxos_result], []),
    bitcoin_send_transaction: IDL2.Func([bitcoin_send_transaction_args], [], []),
    canister_info: IDL2.Func([canister_info_args], [canister_info_result], []),
    canister_status: IDL2.Func([canister_status_args], [canister_status_result], []),
    clear_chunk_store: IDL2.Func([clear_chunk_store_args], [], []),
    create_canister: IDL2.Func([create_canister_args], [create_canister_result], []),
    delete_canister: IDL2.Func([delete_canister_args], [], []),
    delete_canister_snapshot: IDL2.Func([delete_canister_snapshot_args], [], []),
    deposit_cycles: IDL2.Func([deposit_cycles_args], [], []),
    ecdsa_public_key: IDL2.Func([ecdsa_public_key_args], [ecdsa_public_key_result], []),
    fetch_canister_logs: IDL2.Func([fetch_canister_logs_args], [fetch_canister_logs_result], ["query"]),
    http_request: IDL2.Func([http_request_args], [http_request_result], []),
    install_chunked_code: IDL2.Func([install_chunked_code_args], [], []),
    install_code: IDL2.Func([install_code_args], [], []),
    list_canister_snapshots: IDL2.Func([list_canister_snapshots_args], [list_canister_snapshots_result], []),
    load_canister_snapshot: IDL2.Func([load_canister_snapshot_args], [], []),
    node_metrics_history: IDL2.Func([node_metrics_history_args], [node_metrics_history_result], []),
    provisional_create_canister_with_cycles: IDL2.Func([provisional_create_canister_with_cycles_args], [provisional_create_canister_with_cycles_result], []),
    provisional_top_up_canister: IDL2.Func([provisional_top_up_canister_args], [], []),
    raw_rand: IDL2.Func([], [raw_rand_result], []),
    schnorr_public_key: IDL2.Func([schnorr_public_key_args], [schnorr_public_key_result], []),
    sign_with_ecdsa: IDL2.Func([sign_with_ecdsa_args], [sign_with_ecdsa_result], []),
    sign_with_schnorr: IDL2.Func([sign_with_schnorr_args], [sign_with_schnorr_result], []),
    start_canister: IDL2.Func([start_canister_args], [], []),
    stop_canister: IDL2.Func([stop_canister_args], [], []),
    stored_chunks: IDL2.Func([stored_chunks_args], [stored_chunks_result], []),
    subnet_info: IDL2.Func([subnet_info_args], [subnet_info_result], []),
    take_canister_snapshot: IDL2.Func([take_canister_snapshot_args], [take_canister_snapshot_result], []),
    uninstall_code: IDL2.Func([uninstall_code_args], [], []),
    update_settings: IDL2.Func([update_settings_args], [], []),
    upload_chunk: IDL2.Func([upload_chunk_args], [upload_chunk_result], [])
  });
};
class ActorCallError extends AgentError {
  constructor(canisterId2, methodName, type, props) {
    super([
      `Call failed:`,
      `  Canister: ${canisterId2.toText()}`,
      `  Method: ${methodName} (${type})`,
      ...Object.getOwnPropertyNames(props).map((n) => `  "${n}": ${JSON.stringify(props[n])}`)
    ].join("\n"));
    this.canisterId = canisterId2;
    this.methodName = methodName;
    this.type = type;
    this.props = props;
  }
}
class QueryCallRejectedError extends ActorCallError {
  constructor(canisterId2, methodName, result) {
    var _a2;
    super(canisterId2, methodName, "query", {
      Status: result.status,
      Code: (_a2 = ReplicaRejectCode[result.reject_code]) !== null && _a2 !== void 0 ? _a2 : `Unknown Code "${result.reject_code}"`,
      Message: result.reject_message
    });
    this.result = result;
  }
}
class UpdateCallRejectedError extends ActorCallError {
  constructor(canisterId2, methodName, requestId, response, reject_code, reject_message, error_code) {
    super(canisterId2, methodName, "update", Object.assign({ "Request ID": toHex(requestId) }, response.body ? Object.assign(Object.assign({}, error_code ? {
      "Error code": error_code
    } : {}), { "Reject code": String(reject_code), "Reject message": reject_message }) : {
      "HTTP status code": response.status.toString(),
      "HTTP status text": response.statusText
    }));
    this.requestId = requestId;
    this.response = response;
    this.reject_code = reject_code;
    this.reject_message = reject_message;
    this.error_code = error_code;
  }
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal$1.from(actor[metadataSymbol].config.canisterId);
  }
  static async install(fields, config) {
    const mode = fields.mode === void 0 ? { install: null } : fields.mode;
    const arg = fields.arg ? [...new Uint8Array(fields.arg)] : [];
    const wasmModule = [...new Uint8Array(fields.module)];
    const canisterId2 = typeof config.canisterId === "string" ? Principal$1.fromText(config.canisterId) : config.canisterId;
    await getManagementCanister(config).install_code({
      mode,
      arg,
      wasm_module: wasmModule,
      canister_id: canisterId2,
      sender_canister_version: []
    });
  }
  static async createCanister(config, settings) {
    function settingsToCanisterSettings(settings2) {
      return [
        {
          controllers: settings2.controllers ? [settings2.controllers] : [],
          compute_allocation: settings2.compute_allocation ? [settings2.compute_allocation] : [],
          freezing_threshold: settings2.freezing_threshold ? [settings2.freezing_threshold] : [],
          memory_allocation: settings2.memory_allocation ? [settings2.memory_allocation] : [],
          reserved_cycles_limit: [],
          log_visibility: [],
          wasm_memory_limit: []
        }
      ];
    }
    const { canister_id: canisterId2 } = await getManagementCanister(config || {}).provisional_create_canister_with_cycles({
      amount: [],
      settings: settingsToCanisterSettings(settings || {}),
      specified_id: [],
      sender_canister_version: []
    });
    return canisterId2;
  }
  static async createAndInstallCanister(interfaceFactory, fields, config) {
    const canisterId2 = await this.createCanister(config);
    await this.install(Object.assign({}, fields), Object.assign(Object.assign({}, config), { canisterId: canisterId2 }));
    return this.createActor(interfaceFactory, Object.assign(Object.assign({}, config), { canisterId: canisterId2 }));
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId)
          throw new AgentError(`Canister ID is required, but received ${typeof config.canisterId} instead. If you are using automatically generated declarations, this may be because your application is not setting the canister ID in process.env correctly.`);
        const canisterId2 = typeof config.canisterId === "string" ? Principal$1.fromText(config.canisterId) : config.canisterId;
        super({
          config: Object.assign(Object.assign(Object.assign({}, DEFAULT_ACTOR_CONFIG), config), { canisterId: canisterId2 }),
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options === null || options === void 0 ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options === null || options === void 0 ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw new AgentError(`Canister ID is required, but received ${typeof configuration.canisterId} instead. If you are using automatically generated declarations, this may be because your application is not setting the canister ID in process.env correctly.`);
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode$1(types, buffer$1.Buffer.from(msg));
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingStrategyFactory: defaultStrategy
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify2) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = Object.assign(Object.assign({}, options), (_b2 = (_a2 = actor[metadataSymbol].config).queryTransform) === null || _b2 === void 0 ? void 0 : _b2.call(_a2, methodName, args, Object.assign(Object.assign({}, actor[metadataSymbol].config), options)));
      const agent = options.agent || actor[metadataSymbol].config.agent || getDefaultAgent();
      const cid = Principal$1.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode$1(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = Object.assign(Object.assign({}, result.httpDetails), { requestDetails: result.requestDetails });
      switch (result.status) {
        case "rejected":
          throw new QueryCallRejectedError(cid, methodName, result);
        case "replied":
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = Object.assign(Object.assign({}, options), (_b2 = (_a2 = actor[metadataSymbol].config).callTransform) === null || _b2 === void 0 ? void 0 : _b2.call(_a2, methodName, args, Object.assign(Object.assign({}, actor[metadataSymbol].config), options)));
      const agent = options.agent || actor[metadataSymbol].config.agent || getDefaultAgent();
      const { canisterId: canisterId2, effectiveCanisterId, pollingStrategyFactory } = Object.assign(Object.assign(Object.assign({}, DEFAULT_ACTOR_CONFIG), actor[metadataSymbol].config), options);
      const cid = Principal$1.from(canisterId2);
      const ecid = effectiveCanisterId !== void 0 ? Principal$1.from(effectiveCanisterId) : cid;
      const arg = encode$1(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid
      });
      let reply;
      let certificate;
      if (response.body && response.body.certificate) {
        if (agent.rootKey == null) {
          throw new Error("Agent is missing root key");
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: bufFromBufLike(cert),
          rootKey: agent.rootKey,
          canisterId: Principal$1.from(canisterId2),
          blsVerify: blsVerify2
        });
        const path = [new TextEncoder().encode("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            throw new UpdateCallRejectedError(cid, methodName, requestId, response, rejectCode, rejectMessage, error_code);
          }
        }
      } else if (response.body && "reject_message" in response.body) {
        const { reject_code, reject_message, error_code } = response.body;
        throw new UpdateCallRejectedError(cid, methodName, requestId, response, reject_code, reject_message, error_code);
      }
      if (response.status === 202) {
        const pollStrategy = pollingStrategyFactory();
        const response2 = await pollForResponse(agent, ecid, requestId, pollStrategy, blsVerify2);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = Object.assign(Object.assign({}, response), { requestDetails });
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else if (func.retTypes.length === 0) {
        return shouldIncludeHttpDetails ? {
          httpDetails: response,
          result: void 0
        } : void 0;
      } else {
        throw new Error(`Call was returned undefined, but type [${func.retTypes.join(",")}].`);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
function getManagementCanister(config) {
  function transform(methodName, args) {
    if (config.effectiveCanisterId) {
      return { effectiveCanisterId: Principal$1.from(config.effectiveCanisterId) };
    }
    const first = args[0];
    let effectiveCanisterId = Principal$1.fromHex("");
    if (first && typeof first === "object" && first.target_canister && methodName === "install_chunked_code") {
      effectiveCanisterId = Principal$1.from(first.target_canister);
    }
    if (first && typeof first === "object" && first.canister_id) {
      effectiveCanisterId = Principal$1.from(first.canister_id);
    }
    return { effectiveCanisterId };
  }
  return Actor.createActor(managementCanisterIdl, Object.assign(Object.assign(Object.assign({}, config), { canisterId: Principal$1.fromHex("") }), {
    callTransform: transform,
    queryTransform: transform
  }));
}
var __classPrivateFieldSet$3 = globalThis && globalThis.__classPrivateFieldSet || function(receiver, state, value2, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value2) : f ? f.value = value2 : state.set(receiver, value2), value2;
};
var __classPrivateFieldGet$3 = globalThis && globalThis.__classPrivateFieldGet || function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Ed25519PublicKey_rawKey, _Ed25519PublicKey_derKey, _Ed25519KeyIdentity_publicKey, _Ed25519KeyIdentity_privateKey;
function isObject(value2) {
  return value2 !== null && typeof value2 === "object";
}
class Ed25519PublicKey2 {
  // `fromRaw` and `fromDer` should be used for instantiation, not this constructor.
  constructor(key) {
    _Ed25519PublicKey_rawKey.set(this, void 0);
    _Ed25519PublicKey_derKey.set(this, void 0);
    if (key.byteLength !== Ed25519PublicKey2.RAW_KEY_LENGTH) {
      throw new Error("An Ed25519 public key must be exactly 32bytes long");
    }
    __classPrivateFieldSet$3(this, _Ed25519PublicKey_rawKey, key, "f");
    __classPrivateFieldSet$3(this, _Ed25519PublicKey_derKey, Ed25519PublicKey2.derEncode(key), "f");
  }
  /**
   * Construct Ed25519PublicKey from an existing PublicKey
   * @param {unknown} maybeKey - existing PublicKey, ArrayBuffer, DerEncodedPublicKey, or hex string
   * @returns {Ed25519PublicKey} Instance of Ed25519PublicKey
   */
  static from(maybeKey) {
    if (typeof maybeKey === "string") {
      const key = fromHex(maybeKey);
      return this.fromRaw(key);
    } else if (isObject(maybeKey)) {
      const key = maybeKey;
      if (isObject(key) && Object.hasOwnProperty.call(key, "__derEncodedPublicKey__")) {
        return this.fromDer(key);
      } else if (ArrayBuffer.isView(key)) {
        const view = key;
        return this.fromRaw(bufFromBufLike$1(view.buffer));
      } else if (key instanceof ArrayBuffer) {
        return this.fromRaw(key);
      } else if ("rawKey" in key) {
        return this.fromRaw(key.rawKey);
      } else if ("derKey" in key) {
        return this.fromDer(key.derKey);
      } else if ("toDer" in key) {
        return this.fromDer(key.toDer());
      }
    }
    throw new Error("Cannot construct Ed25519PublicKey from the provided key.");
  }
  static fromRaw(rawKey) {
    return new Ed25519PublicKey2(rawKey);
  }
  static fromDer(derKey) {
    return new Ed25519PublicKey2(this.derDecode(derKey));
  }
  static derEncode(publicKey) {
    const key = wrapDER(publicKey, ED25519_OID).buffer;
    key.__derEncodedPublicKey__ = void 0;
    return key;
  }
  static derDecode(key) {
    const unwrapped = unwrapDER(key, ED25519_OID);
    if (unwrapped.length !== this.RAW_KEY_LENGTH) {
      throw new Error("An Ed25519 public key must be exactly 32bytes long");
    }
    return unwrapped;
  }
  get rawKey() {
    return __classPrivateFieldGet$3(this, _Ed25519PublicKey_rawKey, "f");
  }
  get derKey() {
    return __classPrivateFieldGet$3(this, _Ed25519PublicKey_derKey, "f");
  }
  toDer() {
    return this.derKey;
  }
  toRaw() {
    return this.rawKey;
  }
}
_Ed25519PublicKey_rawKey = /* @__PURE__ */ new WeakMap(), _Ed25519PublicKey_derKey = /* @__PURE__ */ new WeakMap();
Ed25519PublicKey2.RAW_KEY_LENGTH = 32;
class Ed25519KeyIdentity extends SignIdentity {
  // `fromRaw` and `fromDer` should be used for instantiation, not this constructor.
  constructor(publicKey, privateKey) {
    super();
    _Ed25519KeyIdentity_publicKey.set(this, void 0);
    _Ed25519KeyIdentity_privateKey.set(this, void 0);
    __classPrivateFieldSet$3(this, _Ed25519KeyIdentity_publicKey, Ed25519PublicKey2.from(publicKey), "f");
    __classPrivateFieldSet$3(this, _Ed25519KeyIdentity_privateKey, new Uint8Array(privateKey), "f");
  }
  /**
   * Generate a new Ed25519KeyIdentity.
   * @param seed a 32-byte seed for the private key. If not provided, a random seed will be generated.
   * @returns Ed25519KeyIdentity
   */
  static generate(seed) {
    if (seed && seed.length !== 32) {
      throw new Error("Ed25519 Seed needs to be 32 bytes long.");
    }
    if (!seed)
      seed = ed25519.utils.randomPrivateKey();
    if (bufEquals(seed, new Uint8Array(new Array(32).fill(0)))) {
      console.warn("Seed is all zeros. This is not a secure seed. Please provide a seed with sufficient entropy if this is a production environment.");
    }
    const sk = new Uint8Array(32);
    for (let i = 0; i < 32; i++)
      sk[i] = new Uint8Array(seed)[i];
    const pk = ed25519.getPublicKey(sk);
    return Ed25519KeyIdentity.fromKeyPair(pk, sk);
  }
  static fromParsedJson(obj) {
    const [publicKeyDer, privateKeyRaw] = obj;
    return new Ed25519KeyIdentity(Ed25519PublicKey2.fromDer(fromHex(publicKeyDer)), fromHex(privateKeyRaw));
  }
  static fromJSON(json) {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      if (typeof parsed[0] === "string" && typeof parsed[1] === "string") {
        return this.fromParsedJson([parsed[0], parsed[1]]);
      } else {
        throw new Error("Deserialization error: JSON must have at least 2 items.");
      }
    }
    throw new Error(`Deserialization error: Invalid JSON type for string: ${JSON.stringify(json)}`);
  }
  static fromKeyPair(publicKey, privateKey) {
    return new Ed25519KeyIdentity(Ed25519PublicKey2.fromRaw(publicKey), privateKey);
  }
  static fromSecretKey(secretKey) {
    const publicKey = ed25519.getPublicKey(new Uint8Array(secretKey));
    return Ed25519KeyIdentity.fromKeyPair(publicKey, secretKey);
  }
  /**
   * Serialize this key to JSON.
   */
  toJSON() {
    return [toHex(__classPrivateFieldGet$3(this, _Ed25519KeyIdentity_publicKey, "f").toDer()), toHex(__classPrivateFieldGet$3(this, _Ed25519KeyIdentity_privateKey, "f"))];
  }
  /**
   * Return a copy of the key pair.
   */
  getKeyPair() {
    return {
      secretKey: __classPrivateFieldGet$3(this, _Ed25519KeyIdentity_privateKey, "f"),
      publicKey: __classPrivateFieldGet$3(this, _Ed25519KeyIdentity_publicKey, "f")
    };
  }
  /**
   * Return the public key.
   */
  getPublicKey() {
    return __classPrivateFieldGet$3(this, _Ed25519KeyIdentity_publicKey, "f");
  }
  /**
   * Signs a blob of data, with this identity's private key.
   * @param challenge - challenge to sign with this identity's secretKey, producing a signature
   */
  async sign(challenge) {
    const blob = new Uint8Array(challenge);
    const signature = uint8ToBuf$1(ed25519.sign(blob, __classPrivateFieldGet$3(this, _Ed25519KeyIdentity_privateKey, "f").slice(0, 32)));
    Object.defineProperty(signature, "__signature__", {
      enumerable: false,
      value: void 0
    });
    return signature;
  }
  /**
   * Verify
   * @param sig - signature to verify
   * @param msg - message to verify
   * @param pk - public key
   * @returns - true if the signature is valid, false otherwise
   */
  static verify(sig, msg, pk) {
    const [signature, message, publicKey] = [sig, msg, pk].map((x) => {
      if (typeof x === "string") {
        x = fromHex(x);
      }
      if (x instanceof Uint8Array) {
        x = x.buffer;
      }
      return new Uint8Array(x);
    });
    return ed25519.verify(message, signature, publicKey);
  }
}
_Ed25519KeyIdentity_publicKey = /* @__PURE__ */ new WeakMap(), _Ed25519KeyIdentity_privateKey = /* @__PURE__ */ new WeakMap();
class CryptoError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, CryptoError.prototype);
  }
}
function _getEffectiveCrypto(subtleCrypto) {
  if (typeof global !== "undefined" && global["crypto"] && global["crypto"]["subtle"]) {
    return global["crypto"]["subtle"];
  }
  if (subtleCrypto) {
    return subtleCrypto;
  } else if (typeof crypto !== "undefined" && crypto["subtle"]) {
    return crypto.subtle;
  } else {
    throw new CryptoError("Global crypto was not available and none was provided. Please inlcude a SubtleCrypto implementation. See https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto");
  }
}
class ECDSAKeyIdentity extends SignIdentity {
  // `fromKeyPair` and `generate` should be used for instantiation, not this constructor.
  constructor(keyPair, derKey, subtleCrypto) {
    super();
    this._keyPair = keyPair;
    this._derKey = derKey;
    this._subtleCrypto = subtleCrypto;
  }
  /**
   * Generates a randomly generated identity for use in calls to the Internet Computer.
   * @param {CryptoKeyOptions} options optional settings
   * @param {CryptoKeyOptions['extractable']} options.extractable - whether the key should allow itself to be used. Set to false for maximum security.
   * @param {CryptoKeyOptions['keyUsages']} options.keyUsages - a list of key usages that the key can be used for
   * @param {CryptoKeyOptions['subtleCrypto']} options.subtleCrypto interface
   * @constructs ECDSAKeyIdentity
   * @returns a {@link ECDSAKeyIdentity}
   */
  static async generate(options) {
    const { extractable = false, keyUsages = ["sign", "verify"], subtleCrypto } = options !== null && options !== void 0 ? options : {};
    const effectiveCrypto = _getEffectiveCrypto(subtleCrypto);
    const keyPair = await effectiveCrypto.generateKey({
      name: "ECDSA",
      namedCurve: "P-256"
    }, extractable, keyUsages);
    const derKey = await effectiveCrypto.exportKey("spki", keyPair.publicKey);
    return new this(keyPair, derKey, effectiveCrypto);
  }
  /**
   * generates an identity from a public and private key. Please ensure that you are generating these keys securely and protect the user's private key
   * @param keyPair a CryptoKeyPair
   * @param subtleCrypto - a SubtleCrypto interface in case one is not available globally
   * @returns an {@link ECDSAKeyIdentity}
   */
  static async fromKeyPair(keyPair, subtleCrypto) {
    const effectiveCrypto = _getEffectiveCrypto(subtleCrypto);
    const derKey = await effectiveCrypto.exportKey("spki", keyPair.publicKey);
    return new ECDSAKeyIdentity(keyPair, derKey, effectiveCrypto);
  }
  /**
   * Return the internally-used key pair.
   * @returns a CryptoKeyPair
   */
  getKeyPair() {
    return this._keyPair;
  }
  /**
   * Return the public key.
   * @returns an {@link PublicKey & DerCryptoKey}
   */
  getPublicKey() {
    const derKey = this._derKey;
    const key = Object.create(this._keyPair.publicKey);
    key.toDer = function() {
      return derKey;
    };
    return key;
  }
  /**
   * Signs a blob of data, with this identity's private key.
   * @param {ArrayBuffer} challenge - challenge to sign with this identity's secretKey, producing a signature
   * @returns {Promise<Signature>} signature
   */
  async sign(challenge) {
    const params = {
      name: "ECDSA",
      hash: { name: "SHA-256" }
    };
    const signature = await this._subtleCrypto.sign(params, this._keyPair.privateKey, challenge);
    return signature;
  }
}
var __classPrivateFieldSet$2 = globalThis && globalThis.__classPrivateFieldSet || function(receiver, state, value2, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value2) : f ? f.value = value2 : state.set(receiver, value2), value2;
};
var __classPrivateFieldGet$2 = globalThis && globalThis.__classPrivateFieldGet || function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PartialIdentity_inner;
class PartialIdentity {
  constructor(inner) {
    _PartialIdentity_inner.set(this, void 0);
    __classPrivateFieldSet$2(this, _PartialIdentity_inner, inner, "f");
  }
  /**
   * The raw public key of this identity.
   */
  get rawKey() {
    return __classPrivateFieldGet$2(this, _PartialIdentity_inner, "f").rawKey;
  }
  /**
   * The DER-encoded public key of this identity.
   */
  get derKey() {
    return __classPrivateFieldGet$2(this, _PartialIdentity_inner, "f").derKey;
  }
  /**
   * The DER-encoded public key of this identity.
   */
  toDer() {
    return __classPrivateFieldGet$2(this, _PartialIdentity_inner, "f").toDer();
  }
  /**
   * The inner {@link PublicKey} used by this identity.
   */
  getPublicKey() {
    return __classPrivateFieldGet$2(this, _PartialIdentity_inner, "f");
  }
  /**
   * The {@link Principal} of this identity.
   */
  getPrincipal() {
    return Principal$1.from(__classPrivateFieldGet$2(this, _PartialIdentity_inner, "f").rawKey);
  }
  /**
   * Required for the Identity interface, but cannot implemented for just a public key.
   */
  transformRequest() {
    return Promise.reject("Not implemented. You are attempting to use a partial identity to sign calls, but this identity only has access to the public key.To sign calls, use a DelegationIdentity instead.");
  }
}
_PartialIdentity_inner = /* @__PURE__ */ new WeakMap();
var __classPrivateFieldSet$1 = globalThis && globalThis.__classPrivateFieldSet || function(receiver, state, value2, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value2) : f ? f.value = value2 : state.set(receiver, value2), value2;
};
var __classPrivateFieldGet$1 = globalThis && globalThis.__classPrivateFieldGet || function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __rest = globalThis && globalThis.__rest || function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var _PartialDelegationIdentity_delegation;
const domainSeparator = new TextEncoder().encode("ic-request-auth-delegation");
const requestDomainSeparator = new TextEncoder().encode("\nic-request");
function _parseBlob(value2) {
  if (typeof value2 !== "string" || value2.length < 64) {
    throw new Error("Invalid public key.");
  }
  return fromHex(value2);
}
class Delegation {
  constructor(pubkey, expiration, targets) {
    this.pubkey = pubkey;
    this.expiration = expiration;
    this.targets = targets;
  }
  toCBOR() {
    return src.value.map(Object.assign({ pubkey: src.value.bytes(this.pubkey), expiration: src.value.u64(this.expiration.toString(16), 16) }, this.targets && {
      targets: src.value.array(this.targets.map((t) => src.value.bytes(t.toUint8Array())))
    }));
  }
  toJSON() {
    return Object.assign({ expiration: this.expiration.toString(16), pubkey: toHex(this.pubkey) }, this.targets && { targets: this.targets.map((p) => p.toHex()) });
  }
}
async function _createSingleDelegation(from, to, expiration, targets) {
  const delegation = new Delegation(
    to.toDer(),
    BigInt(+expiration) * BigInt(1e6),
    // In nanoseconds.
    targets
  );
  const challenge = new Uint8Array([
    ...domainSeparator,
    ...new Uint8Array(requestIdOf(Object.assign({}, delegation)))
  ]);
  const signature = await from.sign(challenge);
  return {
    delegation,
    signature
  };
}
class DelegationChain {
  constructor(delegations, publicKey) {
    this.delegations = delegations;
    this.publicKey = publicKey;
  }
  /**
   * Create a delegation chain between two (or more) keys. By default, the expiration time
   * will be very short (15 minutes).
   *
   * To build a chain of more than 2 identities, this function needs to be called multiple times,
   * passing the previous delegation chain into the options argument. For example:
   * @example
   * const rootKey = createKey();
   * const middleKey = createKey();
   * const bottomeKey = createKey();
   *
   * const rootToMiddle = await DelegationChain.create(
   *   root, middle.getPublicKey(), Date.parse('2100-01-01'),
   * );
   * const middleToBottom = await DelegationChain.create(
   *   middle, bottom.getPublicKey(), Date.parse('2100-01-01'), { previous: rootToMiddle },
   * );
   *
   * // We can now use a delegation identity that uses the delegation above:
   * const identity = DelegationIdentity.fromDelegation(bottomKey, middleToBottom);
   * @param from The identity that will delegate.
   * @param to The identity that gets delegated. It can now sign messages as if it was the
   *           identity above.
   * @param expiration The length the delegation is valid. By default, 15 minutes from calling
   *                   this function.
   * @param options A set of options for this delegation. expiration and previous
   * @param options.previous - Another DelegationChain that this chain should start with.
   * @param options.targets - targets that scope the delegation (e.g. Canister Principals)
   */
  static async create(from, to, expiration = new Date(Date.now() + 15 * 60 * 1e3), options = {}) {
    var _a2, _b2;
    const delegation = await _createSingleDelegation(from, to, expiration, options.targets);
    return new DelegationChain([...((_a2 = options.previous) === null || _a2 === void 0 ? void 0 : _a2.delegations) || [], delegation], ((_b2 = options.previous) === null || _b2 === void 0 ? void 0 : _b2.publicKey) || from.getPublicKey().toDer());
  }
  /**
   * Creates a DelegationChain object from a JSON string.
   * @param json The JSON string to parse.
   */
  static fromJSON(json) {
    const { publicKey, delegations } = typeof json === "string" ? JSON.parse(json) : json;
    if (!Array.isArray(delegations)) {
      throw new Error("Invalid delegations.");
    }
    const parsedDelegations = delegations.map((signedDelegation) => {
      const { delegation, signature } = signedDelegation;
      const { pubkey, expiration, targets } = delegation;
      if (targets !== void 0 && !Array.isArray(targets)) {
        throw new Error("Invalid targets.");
      }
      return {
        delegation: new Delegation(
          _parseBlob(pubkey),
          BigInt("0x" + expiration),
          // expiration in JSON is an hexa string (See toJSON() below).
          targets && targets.map((t) => {
            if (typeof t !== "string") {
              throw new Error("Invalid target.");
            }
            return Principal$1.fromHex(t);
          })
        ),
        signature: _parseBlob(signature)
      };
    });
    return new this(parsedDelegations, _parseBlob(publicKey));
  }
  /**
   * Creates a DelegationChain object from a list of delegations and a DER-encoded public key.
   * @param delegations The list of delegations.
   * @param publicKey The DER-encoded public key of the key-pair signing the first delegation.
   */
  static fromDelegations(delegations, publicKey) {
    return new this(delegations, publicKey);
  }
  toJSON() {
    return {
      delegations: this.delegations.map((signedDelegation) => {
        const { delegation, signature } = signedDelegation;
        const { targets } = delegation;
        return {
          delegation: Object.assign({ expiration: delegation.expiration.toString(16), pubkey: toHex(delegation.pubkey) }, targets && {
            targets: targets.map((t) => t.toHex())
          }),
          signature: toHex(signature)
        };
      }),
      publicKey: toHex(this.publicKey)
    };
  }
}
class DelegationIdentity extends SignIdentity {
  constructor(_inner, _delegation) {
    super();
    this._inner = _inner;
    this._delegation = _delegation;
  }
  /**
   * Create a delegation without having access to delegateKey.
   * @param key The key used to sign the requests.
   * @param delegation A delegation object created using `createDelegation`.
   */
  static fromDelegation(key, delegation) {
    return new this(key, delegation);
  }
  getDelegation() {
    return this._delegation;
  }
  getPublicKey() {
    return {
      derKey: this._delegation.publicKey,
      toDer: () => this._delegation.publicKey
    };
  }
  sign(blob) {
    return this._inner.sign(blob);
  }
  async transformRequest(request2) {
    const { body } = request2, fields = __rest(request2, ["body"]);
    const requestId = await requestIdOf(body);
    return Object.assign(Object.assign({}, fields), { body: {
      content: body,
      sender_sig: await this.sign(new Uint8Array([...requestDomainSeparator, ...new Uint8Array(requestId)])),
      sender_delegation: this._delegation.delegations,
      sender_pubkey: this._delegation.publicKey
    } });
  }
}
class PartialDelegationIdentity extends PartialIdentity {
  constructor(inner, delegation) {
    super(inner);
    _PartialDelegationIdentity_delegation.set(this, void 0);
    __classPrivateFieldSet$1(this, _PartialDelegationIdentity_delegation, delegation, "f");
  }
  /**
   * The Delegation Chain of this identity.
   */
  get delegation() {
    return __classPrivateFieldGet$1(this, _PartialDelegationIdentity_delegation, "f");
  }
  /**
   * Create a {@link PartialDelegationIdentity} from a {@link PublicKey} and a {@link DelegationChain}.
   * @param key The {@link PublicKey} to delegate to.
   * @param delegation a {@link DelegationChain} targeting the inner key.
   * @constructs PartialDelegationIdentity
   */
  static fromDelegation(key, delegation) {
    return new PartialDelegationIdentity(key, delegation);
  }
}
_PartialDelegationIdentity_delegation = /* @__PURE__ */ new WeakMap();
function isDelegationValid(chain2, checks) {
  for (const { delegation } of chain2.delegations) {
    if (+new Date(Number(delegation.expiration / BigInt(1e6))) <= +Date.now()) {
      return false;
    }
  }
  const scopes = [];
  const maybeScope = checks === null || checks === void 0 ? void 0 : checks.scope;
  if (maybeScope) {
    if (Array.isArray(maybeScope)) {
      scopes.push(...maybeScope.map((s) => typeof s === "string" ? Principal$1.fromText(s) : s));
    } else {
      scopes.push(typeof maybeScope === "string" ? Principal$1.fromText(maybeScope) : maybeScope);
    }
  }
  for (const s of scopes) {
    const scope = s.toText();
    for (const { delegation } of chain2.delegations) {
      if (delegation.targets === void 0) {
        continue;
      }
      let none = true;
      for (const target of delegation.targets) {
        if (target.toText() === scope) {
          none = false;
          break;
        }
      }
      if (none) {
        return false;
      }
    }
  }
  return true;
}
var PubKeyCoseAlgo;
(function(PubKeyCoseAlgo2) {
  PubKeyCoseAlgo2[PubKeyCoseAlgo2["ECDSA_WITH_SHA256"] = -7] = "ECDSA_WITH_SHA256";
})(PubKeyCoseAlgo || (PubKeyCoseAlgo = {}));
const events = ["mousedown", "mousemove", "keydown", "touchstart", "wheel"];
class IdleManager {
  /**
   * @protected
   * @param options {@link IdleManagerOptions}
   */
  constructor(options = {}) {
    var _a2;
    this.callbacks = [];
    this.idleTimeout = 10 * 60 * 1e3;
    this.timeoutID = void 0;
    const { onIdle, idleTimeout = 10 * 60 * 1e3 } = options || {};
    this.callbacks = onIdle ? [onIdle] : [];
    this.idleTimeout = idleTimeout;
    const _resetTimer = this._resetTimer.bind(this);
    window.addEventListener("load", _resetTimer, true);
    events.forEach(function(name) {
      document.addEventListener(name, _resetTimer, true);
    });
    const debounce = (func, wait) => {
      let timeout2;
      return (...args) => {
        const context = this;
        const later = function() {
          timeout2 = void 0;
          func.apply(context, args);
        };
        clearTimeout(timeout2);
        timeout2 = window.setTimeout(later, wait);
      };
    };
    if (options === null || options === void 0 ? void 0 : options.captureScroll) {
      const scroll = debounce(_resetTimer, (_a2 = options === null || options === void 0 ? void 0 : options.scrollDebounce) !== null && _a2 !== void 0 ? _a2 : 100);
      window.addEventListener("scroll", scroll, true);
    }
    _resetTimer();
  }
  /**
   * Creates an {@link IdleManager}
   * @param {IdleManagerOptions} options Optional configuration
   * @see {@link IdleManagerOptions}
   * @param options.onIdle Callback once user has been idle. Use to prompt for fresh login, and use `Actor.agentOf(your_actor).invalidateIdentity()` to protect the user
   * @param options.idleTimeout timeout in ms
   * @param options.captureScroll capture scroll events
   * @param options.scrollDebounce scroll debounce time in ms
   */
  static create(options = {}) {
    return new this(options);
  }
  /**
   * @param {IdleCB} callback function to be called when user goes idle
   */
  registerCallback(callback) {
    this.callbacks.push(callback);
  }
  /**
   * Cleans up the idle manager and its listeners
   */
  exit() {
    clearTimeout(this.timeoutID);
    window.removeEventListener("load", this._resetTimer, true);
    const _resetTimer = this._resetTimer.bind(this);
    events.forEach(function(name) {
      document.removeEventListener(name, _resetTimer, true);
    });
    this.callbacks.forEach((cb) => cb());
  }
  /**
   * Resets the timeouts during cleanup
   */
  _resetTimer() {
    const exit = this.exit.bind(this);
    window.clearTimeout(this.timeoutID);
    this.timeoutID = window.setTimeout(exit, this.idleTimeout);
  }
}
const instanceOfAny = (object, constructors) => constructors.some((c2) => object instanceof c2);
let idbProxyableTypes;
let cursorAdvanceMethods;
function getIdbProxyableTypes() {
  return idbProxyableTypes || (idbProxyableTypes = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function getCursorAdvanceMethods() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const cursorRequestMap = /* @__PURE__ */ new WeakMap();
const transactionDoneMap = /* @__PURE__ */ new WeakMap();
const transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
const transformCache = /* @__PURE__ */ new WeakMap();
const reverseTransformCache = /* @__PURE__ */ new WeakMap();
function promisifyRequest(request2) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request2.removeEventListener("success", success);
      request2.removeEventListener("error", error);
    };
    const success = () => {
      resolve(wrap(request2.result));
      unlisten();
    };
    const error = () => {
      reject(request2.error);
      unlisten();
    };
    request2.addEventListener("success", success);
    request2.addEventListener("error", error);
  });
  promise.then((value2) => {
    if (value2 instanceof IDBCursor) {
      cursorRequestMap.set(value2, request2);
    }
  }).catch(() => {
  });
  reverseTransformCache.set(promise, request2);
  return promise;
}
function cacheDonePromiseForTransaction(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    };
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      if (prop === "done")
        return transactionDoneMap.get(target);
      if (prop === "objectStoreNames") {
        return target.objectStoreNames || transactionStoreNamesMap.get(target);
      }
      if (prop === "store") {
        return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    return wrap(target[prop]);
  },
  set(target, prop, value2) {
    target[prop] = value2;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
      return true;
    }
    return prop in target;
  }
};
function replaceTraps(callback) {
  idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
  if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
    return function(storeNames, ...args) {
      const tx = func.call(unwrap(this), storeNames, ...args);
      transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
      return wrap(tx);
    };
  }
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(cursorRequestMap.get(this));
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
}
function transformCachableValue(value2) {
  if (typeof value2 === "function")
    return wrapFunction(value2);
  if (value2 instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value2);
  if (instanceOfAny(value2, getIdbProxyableTypes()))
    return new Proxy(value2, idbProxyTraps);
  return value2;
}
function wrap(value2) {
  if (value2 instanceof IDBRequest)
    return promisifyRequest(value2);
  if (transformCache.has(value2))
    return transformCache.get(value2);
  const newValue = transformCachableValue(value2);
  if (newValue !== value2) {
    transformCache.set(value2, newValue);
    reverseTransformCache.set(newValue, value2);
  }
  return newValue;
}
const unwrap = (value2) => reverseTransformCache.get(value2);
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
  const request2 = indexedDB.open(name, version);
  const openPromise = wrap(request2);
  if (upgrade) {
    request2.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request2.result), event.oldVersion, event.newVersion, wrap(request2.transaction), event);
    });
  }
  if (blocked) {
    request2.addEventListener("blocked", (event) => blocked(
      // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
      event.oldVersion,
      event.newVersion,
      event
    ));
  }
  openPromise.then((db) => {
    if (terminated)
      db.addEventListener("close", () => terminated());
    if (blocking) {
      db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
}
const readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
const writeMethods = ["put", "add", "delete", "clear"];
const cachedMethods = /* @__PURE__ */ new Map();
function getMethod(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
  ) {
    return;
  }
  const method = async function(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([
      target2[targetFuncName](...args),
      isWrite && tx.done
    ]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
}
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));
const AUTH_DB_NAME = "auth-client-db";
const OBJECT_STORE_NAME = "ic-keyval";
const _openDbStore = async (dbName = AUTH_DB_NAME, storeName = OBJECT_STORE_NAME, version) => {
  if (isBrowser && (localStorage === null || localStorage === void 0 ? void 0 : localStorage.getItem(KEY_STORAGE_DELEGATION))) {
    localStorage.removeItem(KEY_STORAGE_DELEGATION);
    localStorage.removeItem(KEY_STORAGE_KEY);
  }
  return await openDB(dbName, version, {
    upgrade: (database) => {
      if (database.objectStoreNames.contains(storeName)) {
        database.clear(storeName);
      }
      database.createObjectStore(storeName);
    }
  });
};
async function _getValue(db, storeName, key) {
  return await db.get(storeName, key);
}
async function _setValue(db, storeName, key, value2) {
  return await db.put(storeName, value2, key);
}
async function _removeValue(db, storeName, key) {
  return await db.delete(storeName, key);
}
class IdbKeyVal {
  // Do not use - instead prefer create
  constructor(_db, _storeName) {
    this._db = _db;
    this._storeName = _storeName;
  }
  /**
   * @param {DBCreateOptions} options - DBCreateOptions
   * @param {DBCreateOptions['dbName']} options.dbName name for the indexeddb database
   * @default
   * @param {DBCreateOptions['storeName']} options.storeName name for the indexeddb Data Store
   * @default
   * @param {DBCreateOptions['version']} options.version version of the database. Increment to safely upgrade
   * @constructs an {@link IdbKeyVal}
   */
  static async create(options) {
    const { dbName = AUTH_DB_NAME, storeName = OBJECT_STORE_NAME, version = DB_VERSION } = options !== null && options !== void 0 ? options : {};
    const db = await _openDbStore(dbName, storeName, version);
    return new IdbKeyVal(db, storeName);
  }
  /**
   * Basic setter
   * @param {IDBValidKey} key string | number | Date | BufferSource | IDBValidKey[]
   * @param value value to set
   * @returns void
   */
  async set(key, value2) {
    return await _setValue(this._db, this._storeName, key, value2);
  }
  /**
   * Basic getter
   * Pass in a type T for type safety if you know the type the value will have if it is found
   * @param {IDBValidKey} key string | number | Date | BufferSource | IDBValidKey[]
   * @returns `Promise<T | null>`
   * @example
   * await get<string>('exampleKey') -> 'exampleValue'
   */
  async get(key) {
    var _a2;
    return (_a2 = await _getValue(this._db, this._storeName, key)) !== null && _a2 !== void 0 ? _a2 : null;
  }
  /**
   * Remove a key
   * @param key {@link IDBValidKey}
   * @returns void
   */
  async remove(key) {
    return await _removeValue(this._db, this._storeName, key);
  }
}
var __classPrivateFieldSet = globalThis && globalThis.__classPrivateFieldSet || function(receiver, state, value2, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value2) : f ? f.value = value2 : state.set(receiver, value2), value2;
};
var __classPrivateFieldGet = globalThis && globalThis.__classPrivateFieldGet || function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _IdbStorage_options;
const KEY_STORAGE_KEY = "identity";
const KEY_STORAGE_DELEGATION = "delegation";
const KEY_VECTOR = "iv";
const DB_VERSION = 1;
const isBrowser = typeof window !== "undefined";
class LocalStorage {
  constructor(prefix = "ic-", _localStorage) {
    this.prefix = prefix;
    this._localStorage = _localStorage;
  }
  get(key) {
    return Promise.resolve(this._getLocalStorage().getItem(this.prefix + key));
  }
  set(key, value2) {
    this._getLocalStorage().setItem(this.prefix + key, value2);
    return Promise.resolve();
  }
  remove(key) {
    this._getLocalStorage().removeItem(this.prefix + key);
    return Promise.resolve();
  }
  _getLocalStorage() {
    if (this._localStorage) {
      return this._localStorage;
    }
    const ls = typeof window === "undefined" ? typeof global === "undefined" ? typeof self === "undefined" ? void 0 : self.localStorage : global.localStorage : window.localStorage;
    if (!ls) {
      throw new Error("Could not find local storage.");
    }
    return ls;
  }
}
class IdbStorage {
  /**
   * @param options - DBCreateOptions
   * @param options.dbName - name for the indexeddb database
   * @param options.storeName - name for the indexeddb Data Store
   * @param options.version - version of the database. Increment to safely upgrade
   * @constructs an {@link IdbStorage}
   * @example
   * ```typescript
   * const storage = new IdbStorage({ dbName: 'my-db', storeName: 'my-store', version: 2 });
   * ```
   */
  constructor(options) {
    _IdbStorage_options.set(this, void 0);
    __classPrivateFieldSet(this, _IdbStorage_options, options !== null && options !== void 0 ? options : {}, "f");
  }
  get _db() {
    return new Promise((resolve) => {
      if (this.initializedDb) {
        resolve(this.initializedDb);
        return;
      }
      IdbKeyVal.create(__classPrivateFieldGet(this, _IdbStorage_options, "f")).then((db) => {
        this.initializedDb = db;
        resolve(db);
      });
    });
  }
  async get(key) {
    const db = await this._db;
    return await db.get(key);
  }
  async set(key, value2) {
    const db = await this._db;
    await db.set(key, value2);
  }
  async remove(key) {
    const db = await this._db;
    await db.remove(key);
  }
}
_IdbStorage_options = /* @__PURE__ */ new WeakMap();
const IDENTITY_PROVIDER_DEFAULT = "https://identity.ic0.app";
const IDENTITY_PROVIDER_ENDPOINT = "#authorize";
const ECDSA_KEY_LABEL = "ECDSA";
const ED25519_KEY_LABEL = "Ed25519";
const INTERRUPT_CHECK_INTERVAL = 500;
const ERROR_USER_INTERRUPT = "UserInterrupt";
class AuthClient {
  constructor(_identity, _key, _chain, _storage, idleManager, _createOptions, _idpWindow, _eventHandler) {
    this._identity = _identity;
    this._key = _key;
    this._chain = _chain;
    this._storage = _storage;
    this.idleManager = idleManager;
    this._createOptions = _createOptions;
    this._idpWindow = _idpWindow;
    this._eventHandler = _eventHandler;
    this._registerDefaultIdleCallback();
  }
  /**
   * Create an AuthClient to manage authentication and identity
   * @constructs
   * @param {AuthClientCreateOptions} options - Options for creating an {@link AuthClient}
   * @see {@link AuthClientCreateOptions}
   * @param options.identity Optional Identity to use as the base
   * @see {@link SignIdentity}
   * @param options.storage Storage mechanism for delegration credentials
   * @see {@link AuthClientStorage}
   * @param options.keyType Type of key to use for the base key
   * @param {IdleOptions} options.idleOptions Configures an {@link IdleManager}
   * @see {@link IdleOptions}
   * Default behavior is to clear stored identity and reload the page when a user goes idle, unless you set the disableDefaultIdleCallback flag or pass in a custom idle callback.
   * @example
   * const authClient = await AuthClient.create({
   *   idleOptions: {
   *     disableIdle: true
   *   }
   * })
   */
  static async create(options = {}) {
    var _a2, _b2, _c;
    const storage = (_a2 = options.storage) !== null && _a2 !== void 0 ? _a2 : new IdbStorage();
    const keyType = (_b2 = options.keyType) !== null && _b2 !== void 0 ? _b2 : ECDSA_KEY_LABEL;
    let key = null;
    if (options.identity) {
      key = options.identity;
    } else {
      let maybeIdentityStorage = await storage.get(KEY_STORAGE_KEY);
      if (!maybeIdentityStorage && isBrowser) {
        try {
          const fallbackLocalStorage = new LocalStorage();
          const localChain = await fallbackLocalStorage.get(KEY_STORAGE_DELEGATION);
          const localKey = await fallbackLocalStorage.get(KEY_STORAGE_KEY);
          if (localChain && localKey && keyType === ECDSA_KEY_LABEL) {
            console.log("Discovered an identity stored in localstorage. Migrating to IndexedDB");
            await storage.set(KEY_STORAGE_DELEGATION, localChain);
            await storage.set(KEY_STORAGE_KEY, localKey);
            maybeIdentityStorage = localChain;
            await fallbackLocalStorage.remove(KEY_STORAGE_DELEGATION);
            await fallbackLocalStorage.remove(KEY_STORAGE_KEY);
          }
        } catch (error) {
          console.error("error while attempting to recover localstorage: " + error);
        }
      }
      if (maybeIdentityStorage) {
        try {
          if (typeof maybeIdentityStorage === "object") {
            if (keyType === ED25519_KEY_LABEL && typeof maybeIdentityStorage === "string") {
              key = await Ed25519KeyIdentity.fromJSON(maybeIdentityStorage);
            } else {
              key = await ECDSAKeyIdentity.fromKeyPair(maybeIdentityStorage);
            }
          } else if (typeof maybeIdentityStorage === "string") {
            key = Ed25519KeyIdentity.fromJSON(maybeIdentityStorage);
          }
        } catch (_d) {
        }
      }
    }
    let identity = new AnonymousIdentity();
    let chain2 = null;
    if (key) {
      try {
        const chainStorage = await storage.get(KEY_STORAGE_DELEGATION);
        if (typeof chainStorage === "object" && chainStorage !== null) {
          throw new Error("Delegation chain is incorrectly stored. A delegation chain should be stored as a string.");
        }
        if (options.identity) {
          identity = options.identity;
        } else if (chainStorage) {
          chain2 = DelegationChain.fromJSON(chainStorage);
          if (!isDelegationValid(chain2)) {
            await _deleteStorage(storage);
            key = null;
          } else {
            if ("toDer" in key) {
              identity = PartialDelegationIdentity.fromDelegation(key, chain2);
            } else {
              identity = DelegationIdentity.fromDelegation(key, chain2);
            }
          }
        }
      } catch (e) {
        console.error(e);
        await _deleteStorage(storage);
        key = null;
      }
    }
    let idleManager = void 0;
    if ((_c = options.idleOptions) === null || _c === void 0 ? void 0 : _c.disableIdle) {
      idleManager = void 0;
    } else if (chain2 || options.identity) {
      idleManager = IdleManager.create(options.idleOptions);
    }
    if (!key) {
      if (keyType === ED25519_KEY_LABEL) {
        key = await Ed25519KeyIdentity.generate();
        await storage.set(KEY_STORAGE_KEY, JSON.stringify(key.toJSON()));
      } else {
        if (options.storage && keyType === ECDSA_KEY_LABEL) {
          console.warn(`You are using a custom storage provider that may not support CryptoKey storage. If you are using a custom storage provider that does not support CryptoKey storage, you should use '${ED25519_KEY_LABEL}' as the key type, as it can serialize to a string`);
        }
        key = await ECDSAKeyIdentity.generate();
        await storage.set(KEY_STORAGE_KEY, key.getKeyPair());
      }
    }
    return new this(identity, key, chain2, storage, idleManager, options);
  }
  _registerDefaultIdleCallback() {
    var _a2, _b2;
    const idleOptions = (_a2 = this._createOptions) === null || _a2 === void 0 ? void 0 : _a2.idleOptions;
    if (!(idleOptions === null || idleOptions === void 0 ? void 0 : idleOptions.onIdle) && !(idleOptions === null || idleOptions === void 0 ? void 0 : idleOptions.disableDefaultIdleCallback)) {
      (_b2 = this.idleManager) === null || _b2 === void 0 ? void 0 : _b2.registerCallback(() => {
        this.logout();
        location.reload();
      });
    }
  }
  async _handleSuccess(message, onSuccess) {
    var _a2, _b2;
    const delegations = message.delegations.map((signedDelegation) => {
      return {
        delegation: new Delegation(signedDelegation.delegation.pubkey, signedDelegation.delegation.expiration, signedDelegation.delegation.targets),
        signature: signedDelegation.signature.buffer
      };
    });
    const delegationChain = DelegationChain.fromDelegations(delegations, message.userPublicKey.buffer);
    const key = this._key;
    if (!key) {
      return;
    }
    this._chain = delegationChain;
    if ("toDer" in key) {
      this._identity = PartialDelegationIdentity.fromDelegation(key, this._chain);
    } else {
      this._identity = DelegationIdentity.fromDelegation(key, this._chain);
    }
    (_a2 = this._idpWindow) === null || _a2 === void 0 ? void 0 : _a2.close();
    const idleOptions = (_b2 = this._createOptions) === null || _b2 === void 0 ? void 0 : _b2.idleOptions;
    if (!this.idleManager && !(idleOptions === null || idleOptions === void 0 ? void 0 : idleOptions.disableIdle)) {
      this.idleManager = IdleManager.create(idleOptions);
      this._registerDefaultIdleCallback();
    }
    this._removeEventListener();
    delete this._idpWindow;
    if (this._chain) {
      await this._storage.set(KEY_STORAGE_DELEGATION, JSON.stringify(this._chain.toJSON()));
    }
    onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(message);
  }
  getIdentity() {
    return this._identity;
  }
  async isAuthenticated() {
    return !this.getIdentity().getPrincipal().isAnonymous() && this._chain !== null;
  }
  /**
   * AuthClient Login -
   * Opens up a new window to authenticate with Internet Identity
   * @param {AuthClientLoginOptions} options - Options for logging in
   * @param options.identityProvider Identity provider
   * @param options.maxTimeToLive Expiration of the authentication in nanoseconds
   * @param options.allowPinAuthentication If present, indicates whether or not the Identity Provider should allow the user to authenticate and/or register using a temporary key/PIN identity. Authenticating dapps may want to prevent users from using Temporary keys/PIN identities because Temporary keys/PIN identities are less secure than Passkeys (webauthn credentials) and because Temporary keys/PIN identities generally only live in a browser database (which may get cleared by the browser/OS).
   * @param options.derivationOrigin Origin for Identity Provider to use while generating the delegated identity
   * @param options.windowOpenerFeatures Configures the opened authentication window
   * @param options.onSuccess Callback once login has completed
   * @param options.onError Callback in case authentication fails
   * @example
   * const authClient = await AuthClient.create();
   * authClient.login({
   *  identityProvider: 'http://<canisterID>.127.0.0.1:8000',
   *  maxTimeToLive: BigInt (7) * BigInt(24) * BigInt(3_600_000_000_000), // 1 week
   *  windowOpenerFeatures: "toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100",
   *  onSuccess: () => {
   *    console.log('Login Successful!');
   *  },
   *  onError: (error) => {
   *    console.error('Login Failed: ', error);
   *  }
   * });
   */
  async login(options) {
    var _a2, _b2, _c, _d;
    const defaultTimeToLive = (
      /* hours */
      BigInt(8) * /* nanoseconds */
      BigInt(36e11)
    );
    const identityProviderUrl = new URL(((_a2 = options === null || options === void 0 ? void 0 : options.identityProvider) === null || _a2 === void 0 ? void 0 : _a2.toString()) || IDENTITY_PROVIDER_DEFAULT);
    identityProviderUrl.hash = IDENTITY_PROVIDER_ENDPOINT;
    (_b2 = this._idpWindow) === null || _b2 === void 0 ? void 0 : _b2.close();
    this._removeEventListener();
    this._eventHandler = this._getEventHandler(identityProviderUrl, Object.assign({ maxTimeToLive: (_c = options === null || options === void 0 ? void 0 : options.maxTimeToLive) !== null && _c !== void 0 ? _c : defaultTimeToLive }, options));
    window.addEventListener("message", this._eventHandler);
    this._idpWindow = (_d = window.open(identityProviderUrl.toString(), "idpWindow", options === null || options === void 0 ? void 0 : options.windowOpenerFeatures)) !== null && _d !== void 0 ? _d : void 0;
    const checkInterruption = () => {
      if (this._idpWindow) {
        if (this._idpWindow.closed) {
          this._handleFailure(ERROR_USER_INTERRUPT, options === null || options === void 0 ? void 0 : options.onError);
        } else {
          setTimeout(checkInterruption, INTERRUPT_CHECK_INTERVAL);
        }
      }
    };
    checkInterruption();
  }
  _getEventHandler(identityProviderUrl, options) {
    return async (event) => {
      var _a2, _b2, _c;
      if (event.origin !== identityProviderUrl.origin) {
        return;
      }
      const message = event.data;
      switch (message.kind) {
        case "authorize-ready": {
          const request2 = Object.assign({ kind: "authorize-client", sessionPublicKey: new Uint8Array((_a2 = this._key) === null || _a2 === void 0 ? void 0 : _a2.getPublicKey().toDer()), maxTimeToLive: options === null || options === void 0 ? void 0 : options.maxTimeToLive, allowPinAuthentication: options === null || options === void 0 ? void 0 : options.allowPinAuthentication, derivationOrigin: (_b2 = options === null || options === void 0 ? void 0 : options.derivationOrigin) === null || _b2 === void 0 ? void 0 : _b2.toString() }, options === null || options === void 0 ? void 0 : options.customValues);
          (_c = this._idpWindow) === null || _c === void 0 ? void 0 : _c.postMessage(request2, identityProviderUrl.origin);
          break;
        }
        case "authorize-client-success":
          try {
            await this._handleSuccess(message, options === null || options === void 0 ? void 0 : options.onSuccess);
          } catch (err) {
            this._handleFailure(err.message, options === null || options === void 0 ? void 0 : options.onError);
          }
          break;
        case "authorize-client-failure":
          this._handleFailure(message.text, options === null || options === void 0 ? void 0 : options.onError);
          break;
      }
    };
  }
  _handleFailure(errorMessage, onError) {
    var _a2;
    (_a2 = this._idpWindow) === null || _a2 === void 0 ? void 0 : _a2.close();
    onError === null || onError === void 0 ? void 0 : onError(errorMessage);
    this._removeEventListener();
    delete this._idpWindow;
  }
  _removeEventListener() {
    if (this._eventHandler) {
      window.removeEventListener("message", this._eventHandler);
    }
    this._eventHandler = void 0;
  }
  async logout(options = {}) {
    await _deleteStorage(this._storage);
    this._identity = new AnonymousIdentity();
    this._chain = null;
    if (options.returnTo) {
      try {
        window.history.pushState({}, "", options.returnTo);
      } catch (_a2) {
        window.location.href = options.returnTo;
      }
    }
  }
}
async function _deleteStorage(storage) {
  await storage.remove(KEY_STORAGE_KEY);
  await storage.remove(KEY_STORAGE_DELEGATION);
  await storage.remove(KEY_VECTOR);
}
const idlFactory = ({ IDL: IDL2 }) => {
  const InviteToken = IDL2.Text;
  const InvitationResponse = IDL2.Variant({
    "shortUsername": IDL2.Null,
    "alreadyUsedToken": IDL2.Null,
    "expiredToken": IDL2.Null,
    "success": IDL2.Null,
    "invalidToken": IDL2.Null,
    "alreadyRegistered": IDL2.Null
  });
  const Time = IDL2.Int;
  const Category = IDL2.Text;
  const PaymentMethod = IDL2.Text;
  const AddTransactionResponse = IDL2.Variant({
    "paymentMethodEmpty": IDL2.Null,
    "success": IDL2.Null,
    "categoryEmpty": IDL2.Null
  });
  const DeleteBudgetResponse = IDL2.Variant({
    "success": IDL2.Null,
    "invalidCategory": IDL2.Null
  });
  const TransactionId = IDL2.Nat;
  const DeleteTransactionResponse = IDL2.Variant({
    "invalidTxn": IDL2.Null,
    "success": IDL2.Null
  });
  const GenerateInviteLinkResponse = IDL2.Variant({
    "success": IDL2.Null,
    "failed": IDL2.Null
  });
  const Transaction = IDL2.Record({
    "id": TransactionId,
    "paymentMethod": PaymentMethod,
    "owner": IDL2.Principal,
    "date": Time,
    "createdAt": Time,
    "updatedAt": Time,
    "notes": IDL2.Opt(IDL2.Text),
    "category": Category,
    "amount": IDL2.Int
  });
  const Budget = IDL2.Record({
    "updatedAt": Time,
    "category": Category,
    "amount": IDL2.Nat
  });
  const Role = IDL2.Variant({ "Editor": IDL2.Null, "Admin": IDL2.Null });
  const User = IDL2.Record({
    "principal": IDL2.Principal,
    "username": IDL2.Text,
    "joinedAt": Time,
    "role": Role
  });
  const RevokeAccessResponse = IDL2.Variant({
    "unauthorizedActivity": IDL2.Null,
    "invalidUser": IDL2.Null,
    "success": IDL2.Null
  });
  const SetBudgetResponse = IDL2.Variant({
    "success": IDL2.Null,
    "categoryEmpty": IDL2.Null
  });
  const UpdateTransactionResponse = IDL2.Variant({
    "paymentMethodEmpty": IDL2.Null,
    "invalidTxn": IDL2.Null,
    "success": IDL2.Null,
    "categoryEmpty": IDL2.Null
  });
  return IDL2.Service({
    "acceptInvite": IDL2.Func(
      [InviteToken, IDL2.Text],
      [InvitationResponse],
      []
    ),
    "addTransaction": IDL2.Func(
      [Time, IDL2.Int, Category, PaymentMethod, IDL2.Opt(IDL2.Text)],
      [AddTransactionResponse],
      []
    ),
    "assertAdmin": IDL2.Func([], [], []),
    "deleteBudget": IDL2.Func([Category], [DeleteBudgetResponse], []),
    "deleteTransaction": IDL2.Func(
      [TransactionId],
      [DeleteTransactionResponse],
      []
    ),
    "generateInviteLink": IDL2.Func([], [GenerateInviteLinkResponse], []),
    "getAllTransactions": IDL2.Func(
      [],
      [IDL2.Vec(IDL2.Tuple(TransactionId, Transaction))],
      ["query"]
    ),
    "getBudgetSummary": IDL2.Func(
      [],
      [IDL2.Vec(IDL2.Tuple(Category, IDL2.Nat, IDL2.Int, IDL2.Nat))],
      ["query"]
    ),
    "getBudgets": IDL2.Func(
      [],
      [IDL2.Vec(IDL2.Tuple(Category, Budget))],
      ["query"]
    ),
    "getFilteredTransactions": IDL2.Func(
      [
        IDL2.Opt(Time),
        IDL2.Opt(Time),
        IDL2.Opt(IDL2.Int),
        IDL2.Opt(IDL2.Int),
        IDL2.Opt(Category),
        IDL2.Opt(PaymentMethod)
      ],
      [IDL2.Vec(IDL2.Tuple(TransactionId, Transaction))],
      ["query"]
    ),
    "getTransaction": IDL2.Func(
      [TransactionId],
      [IDL2.Opt(Transaction)],
      ["query"]
    ),
    "getUsers": IDL2.Func([], [IDL2.Vec(User)], ["query"]),
    "revokeAccess": IDL2.Func([IDL2.Principal], [RevokeAccessResponse], []),
    "setBudget": IDL2.Func([Category, IDL2.Nat], [SetBudgetResponse], []),
    "updateTransaction": IDL2.Func(
      [
        TransactionId,
        Time,
        IDL2.Int,
        Category,
        PaymentMethod,
        IDL2.Opt(IDL2.Text)
      ],
      [UpdateTransactionResponse],
      []
    )
  });
};
const canisterId = "uxrrr-q7777-77774-qaaaq-cai";
const createActor = (canisterId2, options = {}) => {
  const agent = options.agent || new HttpAgent({ ...options.agentOptions });
  if (options.agent && options.agentOptions) {
    console.warn(
      "Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent."
    );
  }
  {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
  }
  return Actor.createActor(idlFactory, {
    agent,
    canisterId: canisterId2,
    ...options.actorOptions
  });
};
const backend$2 = createActor(canisterId);
function candid_some(value2) {
  return [
    value2
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
class Backend {
  constructor(actor) {
    __privateAdd(this, _actor, void 0);
    __privateSet(this, _actor, actor ?? backend$2);
  }
  async acceptInvite(arg0, arg1) {
    const result = await __privateGet(this, _actor).acceptInvite(arg0, arg1);
    return result;
  }
  async addTransaction(arg0, arg1, arg2, arg3, arg4) {
    const result = await __privateGet(this, _actor).addTransaction(arg0, arg1, arg2, arg3, to_candid_opt_n1(arg4));
    return result;
  }
  async assertAdmin() {
    const result = await __privateGet(this, _actor).assertAdmin();
    return result;
  }
  async deleteBudget(arg0) {
    const result = await __privateGet(this, _actor).deleteBudget(arg0);
    return result;
  }
  async deleteTransaction(arg0) {
    const result = await __privateGet(this, _actor).deleteTransaction(arg0);
    return result;
  }
  async generateInviteLink() {
    const result = await __privateGet(this, _actor).generateInviteLink();
    return result;
  }
  async getAllTransactions() {
    const result = await __privateGet(this, _actor).getAllTransactions();
    return from_candid_vec_n2(result);
  }
  async getBudgetSummary() {
    const result = await __privateGet(this, _actor).getBudgetSummary();
    return result;
  }
  async getBudgets() {
    const result = await __privateGet(this, _actor).getBudgets();
    return result;
  }
  async getFilteredTransactions(arg0, arg1, arg2, arg3, arg4, arg5) {
    const result = await __privateGet(this, _actor).getFilteredTransactions(to_candid_opt_n7(arg0), to_candid_opt_n7(arg1), to_candid_opt_n8(arg2), to_candid_opt_n8(arg3), to_candid_opt_n9(arg4), to_candid_opt_n10(arg5));
    return from_candid_vec_n2(result);
  }
  async getTransaction(arg0) {
    const result = await __privateGet(this, _actor).getTransaction(arg0);
    return from_candid_opt_n11(result);
  }
  async getUsers() {
    const result = await __privateGet(this, _actor).getUsers();
    return result;
  }
  async revokeAccess(arg0) {
    const result = await __privateGet(this, _actor).revokeAccess(arg0);
    return result;
  }
  async setBudget(arg0, arg1) {
    const result = await __privateGet(this, _actor).setBudget(arg0, arg1);
    return result;
  }
  async updateTransaction(arg0, arg1, arg2, arg3, arg4, arg5) {
    const result = await __privateGet(this, _actor).updateTransaction(arg0, arg1, arg2, arg3, arg4, to_candid_opt_n1(arg5));
    return result;
  }
}
_actor = new WeakMap();
const backend$1 = new Backend();
function to_candid_opt_n1(value2) {
  return value2 === null ? candid_none() : candid_some(value2);
}
function from_candid_opt_n6(value2) {
  return value2.length === 0 ? null : value2[0];
}
function to_candid_opt_n10(value2) {
  return value2 === null ? candid_none() : candid_some(value2);
}
function from_candid_tuple_n3(value2) {
  return [
    value2[0],
    from_candid_Transaction_n4(value2[1])
  ];
}
function from_candid_vec_n2(value2) {
  return value2.map((x) => from_candid_tuple_n3(x));
}
function to_candid_opt_n7(value2) {
  return value2 === null ? candid_none() : candid_some(value2);
}
function to_candid_opt_n8(value2) {
  return value2 === null ? candid_none() : candid_some(value2);
}
function from_candid_record_n5(value2) {
  return {
    id: value2.id,
    paymentMethod: value2.paymentMethod,
    owner: value2.owner,
    date: value2.date,
    createdAt: value2.createdAt,
    updatedAt: value2.updatedAt,
    notes: record_opt_to_undefined(from_candid_opt_n6(value2.notes)),
    category: value2.category,
    amount: value2.amount
  };
}
function to_candid_opt_n9(value2) {
  return value2 === null ? candid_none() : candid_some(value2);
}
function from_candid_opt_n11(value2) {
  return value2.length === 0 ? null : from_candid_Transaction_n4(value2[0]);
}
function from_candid_Transaction_n4(value2) {
  return from_candid_record_n5(value2);
}
const IDENTITY_PROVIDER = "https://identity.ic0.app";
let authClient = null;
let backend = backend$1;
let currentUser = null;
async function init() {
  try {
    authClient = await AuthClient.create();
    const isAuthenticated = await authClient.isAuthenticated();
    console.log("AuthClient initialized, isAuthenticated:", isAuthenticated);
    const urlParams = new URLSearchParams(window.location.search);
    const inviteToken = urlParams.get("invite");
    if (inviteToken && !isAuthenticated) {
      showInviteModal(inviteToken);
    } else if (isAuthenticated) {
      await loadCurrentUser();
      showAuthenticatedUI();
    } else {
      showLoginButton();
    }
  } catch (error) {
    console.error("Failed to initialize AuthClient:", error);
    showToast("Initialization failed", "error");
  }
}
function showLoginButton() {
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.style.display = "block";
    loginBtn.addEventListener("click", async () => {
      if (!authClient) {
        console.error("AuthClient is not initialized");
        showToast("Authentication error", "error");
        return;
      }
      console.log("Initiating login with provider:", IDENTITY_PROVIDER);
      try {
        await authClient.login({
          identityProvider: IDENTITY_PROVIDER,
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1e3 * 1e3 * 1e3),
          // 7 days
          onSuccess: () => {
            console.log("Login successful");
            loadCurrentUser().then(showAuthenticatedUI);
          },
          onError: (error) => {
            console.error("Login failed:", error);
            showToast("Login failed", "error");
          }
        });
      } catch (error) {
        console.error("Error during login:", error);
        showToast("Login error", "error");
      }
    });
  } else {
    console.error("Login button not found (#loginBtn)");
  }
}
async function loadCurrentUser() {
  try {
    const users = await backend.getUsers();
    const principal = authClient == null ? void 0 : authClient.getIdentity().getPrincipal().toText();
    currentUser = users.find((user) => user.principal.toText() === principal) || null;
    if (!currentUser) {
      console.warn("Current user not found");
      showToast("User not found", "error");
    }
  } catch (error) {
    console.error("Failed to load user:", error);
    showToast("Failed to load user", "error");
  }
}
function showAuthenticatedUI() {
  const loginBtn = document.getElementById("loginBtn");
  const userInfo = document.getElementById("userInfo");
  const username = document.getElementById("username");
  const userRole = document.getElementById("userRole");
  const userPrincipal = document.getElementById("userPrincipal");
  const logoutBtn = document.getElementById("logoutBtn");
  const app = document.getElementById("app");
  const adminPanel = document.getElementById("adminPanel");
  if (loginBtn)
    loginBtn.style.display = "none";
  if (userInfo)
    userInfo.style.display = "flex";
  if (username && currentUser)
    username.innerText = currentUser.username;
  if (userRole && currentUser) {
    userRole.innerText = "tag" in currentUser.role ? "Editor" : "Admin";
  }
  if (userPrincipal && currentUser)
    userPrincipal.innerText = currentUser.principal.toText();
  if (logoutBtn)
    logoutBtn.style.display = "inline-block";
  if (app)
    app.style.display = "block";
  if (adminPanel && currentUser && "tag" in currentUser.role === false) {
    adminPanel.style.display = "block";
  }
  handleLogout();
  setupThemeToggle();
  loadBudgetSummary();
  loadTransactions();
  loadBudgets();
  loadUsers();
  setupTransactionModal();
  setupBudgetForm();
  setupInviteUser();
  setupTransactionFilters();
}
function handleLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      if (authClient) {
        try {
          await authClient.logout();
          console.log("Logout successful");
          window.location.href = "/";
        } catch (error) {
          console.error("Error during logout:", error);
          showToast("Logout failed", "error");
        }
      }
    });
  }
}
async function loadBudgetSummary() {
  const summaryContent = document.getElementById("budgetSummaryContent");
  const loader = document.getElementById("budgetSummaryLoader");
  if (!summaryContent || !loader)
    return;
  try {
    loader.style.display = "block";
    const summaries = await backend.getBudgetSummary();
    summaryContent.innerHTML = "";
    summaries.forEach(
      ([category, budget, spent, remaining]) => {
        const item = document.createElement("div");
        item.innerText = `${category}: Budget $${Number(budget) / 100}, Spent $${Number(spent) / 100}, Remaining $${Number(remaining) / 100}`;
        summaryContent.appendChild(item);
      }
    );
  } catch (error) {
    console.error("Failed to load budget summary:", error);
    showToast("Failed to load summary", "error");
  } finally {
    loader.style.display = "none";
  }
}
async function loadTransactions(filters = {}) {
  const transactionList = document.getElementById("transactionList");
  const loader = document.getElementById("transactionListLoader");
  if (!transactionList || !loader)
    return;
  try {
    loader.style.display = "block";
    const startTime = filters.startDate ? BigInt(new Date(filters.startDate).getTime() * 1e6) : null;
    const endTime = filters.endDate ? BigInt(new Date(filters.endDate).getTime() * 1e6) : null;
    const minAmount = filters.minAmount ? BigInt(Math.round(filters.minAmount * 100)) : null;
    const maxAmount = filters.maxAmount ? BigInt(Math.round(filters.maxAmount * 100)) : null;
    const category = filters.category || null;
    const paymentMethod = filters.paymentMethod || null;
    const transactions = await backend.getFilteredTransactions(
      startTime,
      endTime,
      minAmount,
      maxAmount,
      category,
      paymentMethod
    );
    transactionList.innerHTML = "";
    transactions.forEach(([id, tx]) => {
      const item = document.createElement("div");
      item.innerText = `ID: ${id}, Amount: $${Number(tx.amount) / 100}, Category: ${tx.category}, Date: ${new Date(Number(tx.date) / 1e6).toLocaleDateString()}`;
      const editBtn = document.createElement("button");
      editBtn.innerText = "Edit";
      editBtn.className = "button secondary small";
      editBtn.onclick = () => openTransactionModal(id, tx);
      item.appendChild(editBtn);
      transactionList.appendChild(item);
    });
  } catch (error) {
    console.error("Failed to load transactions:", error);
    showToast("Failed to load transactions", "error");
  } finally {
    loader.style.display = "none";
  }
}
async function loadBudgets() {
  const budgetList = document.getElementById("budgetList");
  const loader = document.getElementById("budgetListLoader");
  if (!budgetList || !loader)
    return;
  try {
    loader.style.display = "block";
    const budgets = await backend.getBudgets();
    budgetList.innerHTML = "";
    budgets.forEach(([category, budget]) => {
      const item = document.createElement("div");
      item.innerText = `${category}: $${Number(budget.amount) / 100}`;
      if (currentUser && "tag" in currentUser.role === false) {
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.className = "button danger small";
        deleteBtn.onclick = () => confirmDeleteBudget(category);
        item.appendChild(deleteBtn);
      }
      budgetList.appendChild(item);
    });
    updateCategorySuggestions(budgets.map(([cat]) => cat));
  } catch (error) {
    console.error("Failed to load budgets:", error);
    showToast("Failed to load budgets", "error");
  } finally {
    loader.style.display = "none";
  }
}
async function loadUsers() {
  const userList = document.getElementById("userList");
  const loader = document.getElementById("userListLoader");
  if (!userList || !loader)
    return;
  try {
    loader.style.display = "block";
    const users = await backend.getUsers();
    userList.innerHTML = "";
    users.forEach((user) => {
      const li = document.createElement("li");
      li.innerText = `${user.username} (${"tag" in user.role ? "Editor" : "Admin"})`;
      if (currentUser && "tag" in currentUser.role === false && user.principal.toText() !== currentUser.principal.toText()) {
        const revokeBtn = document.createElement("button");
        revokeBtn.innerText = "Revoke Access";
        revokeBtn.className = "button danger small";
        revokeBtn.onclick = () => confirmRevokeAccess(user.principal);
        li.appendChild(revokeBtn);
      }
      userList.appendChild(li);
    });
  } catch (error) {
    console.error("Failed to load users:", error);
    showToast("Failed to load users", "error");
  } finally {
    loader.style.display = "none";
  }
}
function setupTransactionModal() {
  const modal = document.getElementById("transactionModal");
  const form = document.getElementById("transactionForm");
  const closeBtn = document.getElementById(
    "closeTransactionModalBtn"
  );
  const addBtn = document.getElementById(
    "addTransactionBtn"
  );
  if (addBtn) {
    addBtn.onclick = () => openTransactionModal();
  }
  if (closeBtn) {
    closeBtn.onclick = () => closeModal(modal);
  }
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const idInput = document.getElementById(
        "transactionId"
      );
      const dateInput = document.getElementById(
        "transactionDate"
      );
      const amountInput = document.getElementById(
        "transactionAmount"
      );
      const categoryInput = document.getElementById(
        "transactionCategory"
      );
      const paymentMethodInput = document.getElementById(
        "transactionPaymentMethod"
      );
      const notesInput = document.getElementById(
        "transactionNotes"
      );
      const id = idInput.value ? BigInt(idInput.value) : null;
      const date = BigInt(new Date(dateInput.value).getTime() * 1e6);
      const amount = BigInt(Math.round(Number(amountInput.value) * 100));
      const category = categoryInput.value;
      const paymentMethod = paymentMethodInput.value;
      const notes = notesInput.value || null;
      try {
        if (id) {
          const result = await backend.updateTransaction(
            id,
            date,
            amount,
            category,
            paymentMethod,
            notes
          );
          if ("success" in result) {
            showToast("Transaction updated", "success");
            loadTransactions();
          } else {
            showToast("Failed to update transaction", "error");
          }
        } else {
          const result = await backend.addTransaction(
            date,
            amount,
            category,
            paymentMethod,
            notes
          );
          if ("success" in result) {
            showToast("Transaction added", "success");
            loadTransactions();
          } else {
            showToast("Failed to add transaction", "error");
          }
        }
        closeModal(modal);
      } catch (error) {
        console.error("Error saving transaction:", error);
        showToast("Error saving transaction", "error");
      }
    };
  }
}
function openTransactionModal(id, tx) {
  console.log("openTransactionModal triggered");
  const modal = document.getElementById("transactionModal");
  const overlay = document.getElementById("modalOverlay");
  const form = document.getElementById("transactionForm");
  const idInput = document.getElementById("transactionId");
  const dateInput = document.getElementById(
    "transactionDate"
  );
  const amountInput = document.getElementById(
    "transactionAmount"
  );
  const categoryInput = document.getElementById(
    "transactionCategory"
  );
  const paymentMethodInput = document.getElementById(
    "transactionPaymentMethod"
  );
  const notesInput = document.getElementById(
    "transactionNotes"
  );
  form.reset();
  if (modal && overlay) {
    overlay.classList.add("visible");
    modal.classList.add("visible");
    if (id && tx) {
      console.log("Populating modal with transaction data");
      idInput.value = id.toString();
      dateInput.value = new Date(Number(tx.date) / 1e6).toISOString().split("T")[0];
      amountInput.value = (Number(tx.amount) / 100).toString();
      categoryInput.value = tx.category;
      paymentMethodInput.value = tx.paymentMethod;
      notesInput.value = tx.notes || "";
    } else {
      console.log("Creating a new transaction");
      dateInput.value = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    }
  } else {
    console.error("Modal or overlay not found");
  }
}
function setupBudgetForm() {
  const form = document.getElementById("budgetForm");
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const categoryInput = document.getElementById(
        "budgetCategory"
      );
      const amountInput = document.getElementById(
        "budgetAmount"
      );
      const category = categoryInput.value;
      const amount = BigInt(Math.round(Number(amountInput.value) * 100));
      try {
        const result = await backend.setBudget(category, amount);
        if ("success" in result) {
          showToast("Budget set", "success");
          loadBudgets();
          form.reset();
        } else {
          showToast("Failed to set budget", "error");
        }
      } catch (error) {
        console.error("Error setting budget:", error);
        showToast("Error setting budget", "error");
      }
    };
  }
}
function setupInviteUser() {
  const inviteBtn = document.getElementById(
    "inviteUserBtn"
  );
  const linkDisplay = document.getElementById(
    "inviteLinkDisplay"
  );
  const linkElement = document.getElementById("inviteLink");
  const copyBtn = document.getElementById(
    "copyInviteLinkBtn"
  );
  if (inviteBtn) {
    inviteBtn.onclick = async () => {
      try {
        const result = await backend.generateInviteLink();
        if ("success" in result) {
          const inviteLink = `${window.location.origin}?invite=${result.success}`;
          linkElement.innerText = inviteLink;
          linkDisplay.style.display = "block";
          showToast("Invite link generated", "success");
        } else {
          showToast("Failed to generate invite", "error");
        }
      } catch (error) {
        console.error("Error generating invite:", error);
        showToast("Error generating invite", "error");
      }
    };
  }
  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(linkElement.innerText);
      showToast("Link copied", "success");
    };
  }
}
function showInviteModal(token) {
  const modal = document.getElementById("acceptInviteModal");
  const overlay = document.getElementById("modalOverlay");
  const form = document.getElementById("acceptInviteForm");
  const tokenInput = document.getElementById("inviteToken");
  const errorElement = document.getElementById(
    "inviteError"
  );
  const closeBtn = document.getElementById(
    "closeInviteModalBtn"
  );
  tokenInput.value = token;
  errorElement.style.display = "none";
  modal.style.display = "block";
  overlay.style.display = "block";
  if (closeBtn) {
    closeBtn.onclick = () => closeModal(modal);
  }
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById(
        "inviteUsername"
      );
      const username = usernameInput.value;
      try {
        const result = await backend.acceptInvite(token, username);
        if ("success" in result) {
          showToast("Registration successful", "success");
          closeModal(modal);
          if (authClient) {
            await authClient.login({
              identityProvider: IDENTITY_PROVIDER,
              onSuccess: () => loadCurrentUser().then(showAuthenticatedUI)
            });
          }
        } else {
          errorElement.innerText = getInviteErrorMessage(result);
          errorElement.style.display = "block";
        }
      } catch (error) {
        console.error("Error accepting invite:", error);
        showToast("Error accepting invite", "error");
      }
    };
  }
}
function getInviteErrorMessage(result) {
  if ("shortUsername" in result)
    return "Username too short";
  if ("alreadyUsedToken" in result)
    return "Invite already used";
  if ("expiredToken" in result)
    return "Invite expired";
  if ("invalidToken" in result)
    return "Invalid invite";
  if ("alreadyRegistered" in result)
    return "Already registered";
  return "Unknown error";
}
function setupTransactionFilters() {
  const applyBtn = document.getElementById(
    "applyFiltersBtn"
  );
  const clearBtn = document.getElementById(
    "clearFiltersBtn"
  );
  const startDateInput = document.getElementById(
    "filterStartDate"
  );
  const endDateInput = document.getElementById(
    "filterEndDate"
  );
  const minAmountInput = document.getElementById(
    "filterMinAmount"
  );
  const maxAmountInput = document.getElementById(
    "filterMaxAmount"
  );
  const categoryInput = document.getElementById(
    "filterCategory"
  );
  const paymentMethodInput = document.getElementById(
    "filterPaymentMethod"
  );
  if (applyBtn) {
    applyBtn.onclick = () => {
      loadTransactions({
        startDate: startDateInput.value,
        endDate: endDateInput.value,
        minAmount: minAmountInput.value ? Number(minAmountInput.value) : void 0,
        maxAmount: maxAmountInput.value ? Number(maxAmountInput.value) : void 0,
        category: categoryInput.value || void 0,
        paymentMethod: paymentMethodInput.value || void 0
      });
    };
  }
  if (clearBtn) {
    clearBtn.onclick = () => {
      startDateInput.value = "";
      endDateInput.value = "";
      minAmountInput.value = "";
      maxAmountInput.value = "";
      categoryInput.value = "";
      paymentMethodInput.value = "";
      loadTransactions();
    };
  }
}
function updateCategorySuggestions(categories) {
  const datalist = document.getElementById(
    "categorySuggestions"
  );
  const paymentDatalist = document.getElementById(
    "paymentMethodSuggestions"
  );
  datalist.innerHTML = categories.map((cat) => `<option value="${cat}">`).join("");
  paymentDatalist.innerHTML = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Bank Transfer"
  ].map((method) => `<option value="${method}">`).join("");
}
function confirmDeleteBudget(category) {
  showConfirmationModal(`Delete budget for ${category}?`, async () => {
    try {
      const result = await backend.deleteBudget(category);
      if ("success" in result) {
        showToast("Budget deleted", "success");
        loadBudgets();
      } else {
        showToast("Failed to delete budget", "error");
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      showToast("Error deleting budget", "error");
    }
  });
}
function confirmRevokeAccess(principal) {
  showConfirmationModal(`Revoke access for this user?`, async () => {
    try {
      const result = await backend.revokeAccess(principal);
      if ("success" in result) {
        showToast("Access revoked", "success");
        loadUsers();
      } else {
        showToast("Failed to revoke access", "error");
      }
    } catch (error) {
      console.error("Error revoking access:", error);
      showToast("Error revoking access", "error");
    }
  });
}
function showConfirmationModal(message, onConfirm) {
  const modal = document.getElementById("confirmationModal");
  const overlay = document.getElementById("modalOverlay");
  const messageElement = document.getElementById(
    "confirmationMessage"
  );
  const yesBtn = document.getElementById("confirmYesBtn");
  const noBtn = document.getElementById("confirmNoBtn");
  messageElement.innerText = message;
  modal.style.display = "block";
  overlay.style.display = "block";
  yesBtn.onclick = () => {
    onConfirm();
    closeModal(modal);
  };
  noBtn.onclick = () => closeModal(modal);
}
function closeModal(modal) {
  const overlay = document.getElementById("modalOverlay");
  modal.style.display = "none";
  overlay.style.display = "none";
}
function showToast(message, type) {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3e3);
}
function setupThemeToggle() {
  const toggleBtn = document.getElementById(
    "themeToggleBtn"
  );
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      document.body.classList.toggle("light-theme");
      document.body.classList.toggle("dark-theme");
    };
  }
}
init().catch((error) => {
  console.error("Initialization failed:", error);
  showToast("App failed to start", "error");
});
