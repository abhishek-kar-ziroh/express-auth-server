import { Key } from "../KeyGen/Key";
export declare class TestSecureString {
    keyGen(): Key;
    encrypt(inputkey: Key, inputPlain: string): string;
    decrypt(inputkey: Key, chipherInput: string): string;
    compare(firststr: string, secondstr: string): void;
    isEqual(firststr: string, secondstr: string): void;
    subString(firststr: string, secondstr: string): void;
    split(firststr: string, secondstr: string): void;
    suffixMatch(firststr: string, secondstr: string): void;
    prefixMatch(firststr: string, secondstr: string): void;
    concatenate(firststr: string, secondstr: string): void;
}
