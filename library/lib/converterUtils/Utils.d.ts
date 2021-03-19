/**@internal */
export declare class Utils {
    /**@internal */
    decodefromBase64(input: string): Uint8Array;
    encodeToBase64(packedBytes: Uint8Array): string;
    aesKey: Uint8Array | undefined;
    IV: Uint8Array | undefined;
    intToByteArray(integerValue: number): Uint8Array;
    /**@internal */
    byteArrayToInt(Bytevalue: Uint8Array): number;
    /**@internal */
    getRandomnum(length: number): number;
}
