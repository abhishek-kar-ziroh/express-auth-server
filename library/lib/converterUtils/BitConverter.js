"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**@internal */
var BitConverter = /** @class */ (function () {
    function BitConverter() {
    }
    /**@internal */
    BitConverter.prototype.GetBytes = function (value) {
        var view = new DataView(new ArrayBuffer(4));
        for (var index = 3; index >= 0; --index) {
            view.setUint8(index, value % 256);
            value = value >> 8;
        }
        return new Uint8Array(view.buffer);
    };
    /**@internal */
    BitConverter.prototype.ToInt = function (input) {
        // return (buffer[0] | buffer[1] << 8 | buffer[2] << 16 | buffer[3] << 24) >>> 0;
        var length = input.length;
        var buffer = Buffer.from(input);
        var result = buffer.readUIntBE(0, length);
        return result;
    };
    /**@internal */
    BitConverter.typedArrayToBuffer = function (array) {
        return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset);
    };
    return BitConverter;
}());
exports.BitConverter = BitConverter;
//# sourceMappingURL=BitConverter.js.map