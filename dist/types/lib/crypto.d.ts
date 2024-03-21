import { PrivatebinSpec, PrivatebinPasteRequest, PrivatebinAdata } from './types';
export declare function importKey(key: Uint8Array): Promise<CryptoKey>;
export declare function deriveKey(key: CryptoKey, salt: Uint8Array, iterations: number, keyLength: number): Promise<CryptoKey>;
export declare function stringToUint8Array(str: string): Uint8Array;
export declare function uint8ArrayToString(buf: Uint8Array): string;
export declare function concatUint8Array(arr1: Uint8Array, arr2: Uint8Array): Uint8Array;
export declare function encrypt(message: Uint8Array, masterkey: Uint8Array, spec: PrivatebinSpec): Promise<PrivatebinPasteRequest>;
export declare function decrypt(data: string, masterkey: Uint8Array, adata: PrivatebinAdata): Promise<Uint8Array>;
//# sourceMappingURL=crypto.d.ts.map