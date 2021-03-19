"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base64_arraybuffer_1 = require("base64-arraybuffer");
var BitConverter_1 = require("./BitConverter");
/**@internal */
var Utils = /** @class */ (function () {
    function Utils() {
    }
    // it is used in
    /**@internal */
    Utils.prototype.decodefromBase64 = function (input) {
        var decodedString = base64_arraybuffer_1.decode(input);
        var decodedBytes = new Uint8Array(decodedString);
        return decodedBytes;
    };
    Utils.prototype.encodeToBase64 = function (packedBytes) {
        var base64 = base64_arraybuffer_1.encode(packedBytes);
        return base64;
    };
    Utils.prototype.intToByteArray = function (integerValue) {
        if (integerValue == undefined || null) {
            throw new Error("Integer value cannot be null");
        }
        var bitconverter = new BitConverter_1.BitConverter();
        return bitconverter.GetBytes(integerValue);
    };
    /**@internal */
    Utils.prototype.byteArrayToInt = function (Bytevalue) {
        if (Bytevalue == undefined || null) {
            throw new Error("Value can not be null ");
        }
        var bitconverter = new BitConverter_1.BitConverter();
        return bitconverter.ToInt(Bytevalue);
    };
    /**@internal */
    Utils.prototype.getRandomnum = function (length) {
        return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map