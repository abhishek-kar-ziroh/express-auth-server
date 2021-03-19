"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KeyGenerate_1 = require("../KeyGen/KeyGenerate");
var SecureStringClient_1 = require("../SecureStringClient/SecureStringClient");
var SecureString_1 = require("../SecureString/SecureString");
var BitConverter_1 = require("../converterUtils/BitConverter");
var TestSecureString = /** @class */ (function () {
    function TestSecureString() {
    }
    TestSecureString.prototype.keyGen = function () {
        var fhekey = new KeyGenerate_1.KeyGenerator().generateKeys();
        return fhekey;
    };
    TestSecureString.prototype.encrypt = function (inputkey, inputPlain) {
        var client = new SecureStringClient_1.SecureStringClient(inputkey);
        var chipher = client.encrypt(inputPlain);
        return chipher;
    };
    TestSecureString.prototype.decrypt = function (inputkey, chipherInput) {
        var client = new SecureStringClient_1.SecureStringClient(inputkey);
        var plainText = client.decrypt(chipherInput);
        return plainText;
    };
    TestSecureString.prototype.compare = function (firststr, secondstr) {
        var fheKey = this.keyGen();
        var c1 = this.encrypt(fheKey, firststr);
        var c2 = this.encrypt(fheKey, secondstr);
        var strProcessor = new SecureString_1.SecureString();
        var result = strProcessor.compare(c1, c2);
        console.log('Comparing the two cipherTxt: ' + result);
    };
    TestSecureString.prototype.isEqual = function (firststr, secondstr) {
        var fheKey = this.keyGen();
        var c1 = this.encrypt(fheKey, firststr);
        var c2 = this.encrypt(fheKey, secondstr);
        var strProcessor = new SecureString_1.SecureString();
        var result = strProcessor.IsEqual(c1, c2);
        console.log('iSEqual : ' + result);
    };
    TestSecureString.prototype.subString = function (firststr, secondstr) {
        var fheKey = this.keyGen();
        var c1 = this.encrypt(fheKey, firststr);
        var c2 = this.encrypt(fheKey, secondstr);
        var strProcessor = new SecureString_1.SecureString();
        var result = strProcessor.subString(c1, c2);
        console.log('subString match : ' + result);
    };
    TestSecureString.prototype.split = function (firststr, secondstr) {
        var fheKey = this.keyGen();
        var c1 = this.encrypt(fheKey, firststr);
        var c2 = this.encrypt(fheKey, secondstr);
        var strProcessor = new SecureString_1.SecureString();
        var splitedArrayCipher = strProcessor.split(c1, c2);
        var firstarray = this.decrypt(fheKey, splitedArrayCipher[0]);
        var secondArray = this.decrypt(fheKey, splitedArrayCipher[1]);
        console.log('first subarray: ' + firstarray + ' second subarray: ' + secondArray);
    };
    TestSecureString.prototype.suffixMatch = function (firststr, secondstr) {
        var fheKey = this.keyGen();
        var c1 = this.encrypt(fheKey, firststr);
        var c2 = this.encrypt(fheKey, secondstr);
        var strProcessor = new SecureString_1.SecureString();
        var result = strProcessor.suffixMatch(c1, c2);
        console.log('suffix match : ' + result);
    };
    TestSecureString.prototype.prefixMatch = function (firststr, secondstr) {
        var fheKey = this.keyGen();
        var c1 = this.encrypt(fheKey, firststr);
        var c2 = this.encrypt(fheKey, secondstr);
        var strProcessor = new SecureString_1.SecureString();
        var result = strProcessor.prefixMatch(c1, c2);
        console.log('prfix match : ' + result);
    };
    TestSecureString.prototype.concatenate = function (firststr, secondstr) {
        var fheKey = this.keyGen();
        var c1 = this.encrypt(fheKey, firststr);
        var c2 = this.encrypt(fheKey, secondstr);
        var strProcessor = new SecureString_1.SecureString();
        var concatChipherTxt = strProcessor.concatenate(c1, c2);
        var concatPlainTxt = this.decrypt(fheKey, concatChipherTxt);
        console.log('Conacat result: ' + concatPlainTxt);
    };
    return TestSecureString;
}());
exports.TestSecureString = TestSecureString;
// let testObj = new TestSecureString();
// testObj.split('Modi split the india','split');
// testObj.subString('mary had a little lamb','little');
// testObj.isEqual('marry','marry');
// let fheKey:Key = testObj.keyGen();
// let inputPlainText = 'Goutam'
// let ciphertxt:string = testObj.encrypt(fheKey,inputPlainText);
// console.log('CipherText :'+ciphertxt);
// let plaintxt:string = testObj.decrypt(fheKey, ciphertxt);
// console.log('PlainText :'+plaintxt);
var numberBytes = new BitConverter_1.BitConverter().GetBytes(12574);
console.log('numberBytes: ' + numberBytes);
var bytesToNum = new BitConverter_1.BitConverter().ToInt(numberBytes);
console.log('Bytes To number:' + bytesToNum);
//# sourceMappingURL=test.js.map