const Base64Utils = {
  encode: function (byteArray) {
    var binary = "";
    var bytes = new Uint8Array(byteArray);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
  },

  decode: function (txt) {
    var binary_string = window.atob(txt);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }

    return bytes.buffer;
  },

  encodeArray: function (arr) {
    var binary = "";
    for (var i = 0; i < arr.length; i++) {
      binary += String.fromCharCode(arr[i]);
    }
    return btoa(binary);
  },

  decodeArray: function (str) {
    return Uint8Array.from(
      atob(str)
        .split("")
        .map(function (c) {
          return c.charCodeAt(0);
        })
    );
  },
};
