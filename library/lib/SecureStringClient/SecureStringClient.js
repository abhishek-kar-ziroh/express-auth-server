"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BitConverter_1 = require("../converterUtils/BitConverter");
var Utils_1 = require("../converterUtils/Utils");
var SecureStringClient = /** @class */ (function () {
    function SecureStringClient(Inputvalue) {
        this.key = Inputvalue;
    }
    SecureStringClient.prototype.encrypt = function (inputString) {
        var input = new TextEncoder().encode(inputString);
        var cipher = this.wrapString(input, this.key.key);
        var base64Chiper = new Utils_1.Utils().encodeToBase64(cipher);
        return base64Chiper;
    };
    SecureStringClient.prototype.decrypt = function (cipherText) {
        var cipher = new Utils_1.Utils().decodefromBase64(cipherText);
        var text = this.unwrapString(cipher);
        return new TextDecoder().decode(text);
    };
    SecureStringClient.prototype.wrapString = function (InputValue, keyValue) {
        var warppedString = new Uint8Array(keyValue.length + InputValue.length + 4);
        warppedString.set(keyValue, 0);
        warppedString.set(InputValue, keyValue.length);
        var keyValueLength = new BitConverter_1.BitConverter().GetBytes(keyValue.length);
        warppedString.set(keyValueLength, keyValue.length + InputValue.length);
        return warppedString;
    };
    SecureStringClient.prototype.unwrapString = function (cipher) {
        var keyLenUint = cipher.slice(cipher.length - 4, cipher.length);
        var keyLength = new BitConverter_1.BitConverter().ToInt(keyLenUint);
        var value = cipher.slice(keyLength, cipher.length - 4);
        return value;
    };
    return SecureStringClient;
}());
exports.SecureStringClient = SecureStringClient;
//# sourceMappingURL=SecureStringClient.js.map