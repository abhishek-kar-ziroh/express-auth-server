"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Key_1 = require("./Key");
var BitConverter_1 = require("../converterUtils/BitConverter");
var Utils_1 = require("../converterUtils/Utils");
var KeyGenerator = /** @class */ (function () {
    function KeyGenerator() {
    }
    KeyGenerator.prototype.generateKeys = function () {
        var randomnumber = new Utils_1.Utils().getRandomnum(10);
        var k = new BitConverter_1.BitConverter().GetBytes(randomnumber);
        var key = new Key_1.Key(k);
        return key;
    };
    return KeyGenerator;
}());
exports.KeyGenerator = KeyGenerator;
//# sourceMappingURL=KeyGenerate.js.map