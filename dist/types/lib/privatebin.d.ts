import { PrivatebinPasteRequest, PrivatebinPaste, PrivatebinResponse, PrivatebinOptions, PrivatebinAdata } from './types';
import { Api } from './api';
export declare function encryptText(text: string, key: Uint8Array, options: PrivatebinOptions): Promise<PrivatebinPasteRequest>;
export declare function decryptText(ct: string, key: Uint8Array, adata: PrivatebinAdata): Promise<PrivatebinPaste>;
export declare class PrivatebinClient extends Api {
    constructor(baseURL?: string);
    sendText(text: string, key: Uint8Array, options: PrivatebinOptions): Promise<PrivatebinResponse>;
    getText(id: string, key: Uint8Array): Promise<PrivatebinPaste>;
    private getPaste;
    private postPaste;
}
//# sourceMappingURL=privatebin.d.ts.map