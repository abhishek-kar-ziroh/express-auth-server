/**@internal */
export declare class BitConverter {
    /**@internal */
    GetBytes(value: number): Uint8Array;
    /**@internal */
    ToInt(input: Uint8Array): number;
    /**@internal */
    static typedArrayToBuffer(array: Uint8Array): ArrayBuffer;
}
