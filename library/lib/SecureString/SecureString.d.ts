export declare class SecureString {
    private getKey;
    private unwrapString;
    private wrapString;
    subString(baseString: string, patternString: string): boolean;
    compare(sourceString: string, toMatch: string): number;
    IsEqual(sourceString: string, toMatch: string): boolean;
    split(baseString: string, patternString: string): string[];
    suffixMatch(baseString: string, patternString: string): boolean;
    concatenate(firstString: string, secondString: string): string;
    prefixMatch(baseString: string, patternString: string): boolean;
}
