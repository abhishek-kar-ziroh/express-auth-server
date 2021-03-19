import { Key } from "../KeyGen/Key";
export declare class SecureStringClient {
    key: Key;
    constructor(Inputvalue: Key);
    encrypt(inputString: string): string;
    decrypt(cipherText: string): string;
    private wrapString;
    private unwrapString;
}
