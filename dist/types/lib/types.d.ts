export declare type PrivatebinPaste = {
    paste: string;
};
export declare type PrivatebinResponse = {
    status: number;
    id: string;
    url: string;
    deletetoken: string;
};
export declare type PrivatebinOutput = {
    pasteId: string;
    pasteURL: string;
    deleteURL: string;
};
export declare type PrivatebinSpec = {
    algo: string;
    mode: string;
    ks: number;
    ts: number;
    iter: number;
    compression: string;
    burnafterreading: number;
    opendiscussion: number;
    textformat: string;
};
export declare type PrivatebinAdata = [
    [
        string,
        string,
        number,
        number,
        number,
        string,
        string,
        string
    ],
    string,
    number,
    number
];
export declare type PrivatebinMeta = {
    expire: string;
};
export declare type PrivatebinPasteRequest = {
    status?: number;
    message?: string;
    v?: 2;
    ct: string;
    adata: PrivatebinAdata;
    meta?: PrivatebinMeta;
};
export declare type PrivatebinOptions = {
    expire: '5min' | '10min' | '1hour' | '1day' | '1week' | '1month' | '1year' | 'never';
    burnafterreading: 0 | 1;
    opendiscussion: 0 | 1;
    output: 'text' | 'json' | 'yaml';
    compression: 'none' | 'zlib';
    textformat: 'plaintext' | 'markdown';
};
//# sourceMappingURL=types.d.ts.map