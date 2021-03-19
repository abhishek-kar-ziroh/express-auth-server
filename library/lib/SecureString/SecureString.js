"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BitConverter_1 = require("../converterUtils/BitConverter");
var Utils_1 = require("../converterUtils/Utils");
var SecureString = /** @class */ (function () {
    function SecureString() {
    }
    SecureString.prototype.getKey = function (inputValue) {
        var lenb = inputValue.slice(inputValue.length - 4, inputValue.length);
        var keyLen = new BitConverter_1.BitConverter().ToInt(lenb);
        var resultValue = inputValue.slice(keyLen, inputValue.length);
        return resultValue;
    };
    SecureString.prototype.unwrapString = function (inputValue) {
        var lenb = inputValue.slice(inputValue.length - 4, inputValue.length);
        var keyLen = new BitConverter_1.BitConverter().ToInt(lenb);
        var resultValue = inputValue.slice(keyLen, inputValue.length - 4);
        return resultValue;
    };
    SecureString.prototype.wrapString = function (inputValue, inputKey) {
        var wrapperResult = new Uint8Array(inputKey.length + inputValue.length + 4);
        wrapperResult.set(inputKey, 0);
        wrapperResult.set(inputValue, inputKey.length);
        var lenb = new BitConverter_1.BitConverter().GetBytes(inputKey.length);
        wrapperResult.set(lenb, inputKey.length + inputValue.length);
        return wrapperResult;
    };
    SecureString.prototype.subString = function (baseString, patternString) {
        var utils = new Utils_1.Utils();
        var cipherBase = utils.decodefromBase64(baseString);
        var cipherPattern = utils.decodefromBase64(patternString);
        var baseunwrap = this.unwrapString(cipherBase);
        var patunwrap = this.unwrapString(cipherPattern);
        var base = new TextDecoder().decode(baseunwrap);
        var pattern = new TextDecoder().decode(patunwrap);
        var result = base.includes(pattern);
        return result;
    };
    SecureString.prototype.compare = function (sourceString, toMatch) {
        var utils = new Utils_1.Utils();
        var cipherBase = utils.decodefromBase64(sourceString);
        var cipherPattern = utils.decodefromBase64(toMatch);
        var baseunwrap = this.unwrapString(cipherBase);
        var patunwrap = this.unwrapString(cipherPattern);
        var base = new TextDecoder().decode(baseunwrap);
        var pattern = new TextDecoder().decode(patunwrap);
        var result = base.localeCompare(pattern);
        return result;
    };
    SecureString.prototype.IsEqual = function (sourceString, toMatch) {
        var utils = new Utils_1.Utils();
        var cipherBase = utils.decodefromBase64(sourceString);
        var cipherPattern = utils.decodefromBase64(toMatch);
        var baseunwrap = this.unwrapString(cipherBase);
        var patunwrap = this.unwrapString(cipherPattern);
        var base = new TextDecoder().decode(baseunwrap);
        var pattern = new TextDecoder().decode(patunwrap);
        if (base === pattern)
            return true;
        else
            return false;
    };
    SecureString.prototype.split = function (baseString, patternString) {
        var utils = new Utils_1.Utils();
        var cipherBase = utils.decodefromBase64(baseString);
        var cipherPattern = utils.decodefromBase64(patternString);
        var baseunwrap = this.unwrapString(cipherBase);
        var patunwrap = this.unwrapString(cipherPattern);
        var base = new TextDecoder().decode(baseunwrap);
        var pattern = new TextDecoder().decode(patunwrap);
        var words = base.split(pattern, 2);
        var wordsendcode1 = new TextEncoder().encode(words[0]);
        var wordsencode2 = new TextEncoder().encode(words[1]);
        var key = this.getKey(cipherBase);
        var w1 = this.wrapString(wordsendcode1, key);
        var w2 = this.wrapString(wordsencode2, key);
        var splitresult = new Array();
        var w1base64 = new Utils_1.Utils().encodeToBase64(w1);
        var w2base64 = new Utils_1.Utils().encodeToBase64(w2);
        splitresult.push(w1base64);
        splitresult.push(w2base64);
        return splitresult;
    };
    SecureString.prototype.suffixMatch = function (baseString, patternString) {
        var utils = new Utils_1.Utils();
        var cipherBase = utils.decodefromBase64(baseString);
        var cipherPattern = utils.decodefromBase64(patternString);
        var baseunwrap = this.unwrapString(cipherBase);
        var patunwrap = this.unwrapString(cipherPattern);
        var base = new TextDecoder().decode(baseunwrap);
        var pattern = new TextDecoder().decode(patunwrap);
        var result = base.endsWith(pattern);
        return result;
    };
    SecureString.prototype.concatenate = function (firstString, secondString) {
        var utils = new Utils_1.Utils();
        var cipher1 = utils.decodefromBase64(firstString);
        var cipher2 = utils.decodefromBase64(secondString);
        var baseunwrap = this.unwrapString(cipher1);
        var patunwrap = this.unwrapString(cipher2);
        var base = new TextDecoder().decode(baseunwrap);
        var pattern = new TextDecoder().decode(patunwrap);
        var concat = base + pattern;
        var concatByte = new TextEncoder().encode(concat);
        var key = this.getKey(cipher1);
        var wrapperResult = this.wrapString(concatByte, key);
        var concatresult = utils.encodeToBase64(wrapperResult);
        return concatresult;
    };
    SecureString.prototype.prefixMatch = function (baseString, patternString) {
        var utils = new Utils_1.Utils();
        var cipherBase = utils.decodefromBase64(baseString);
        var cipherPattern = utils.decodefromBase64(patternString);
        var baseunwrap = this.unwrapString(cipherBase);
        var patunwrap = this.unwrapString(cipherPattern);
        var base = new TextDecoder().decode(baseunwrap);
        var pattern = new TextDecoder().decode(patunwrap);
        var result = base.startsWith(pattern);
        return result;
    };
    return SecureString;
}());
exports.SecureString = SecureString;
//# sourceMappingURL=SecureString.js.map