import pako from 'pako';
import axios from 'axios';
import crypto from 'isomorphic-webcrypto';
import { bytesToBase64, base64ToBytes } from 'byte-base64';

class Api {
    constructor(config) {
        this.axios = axios.create(config);
    }
    get(url, config) {
        return this.axios.get(url, config);
    }
    post(url, data, config) {
        return this.axios.post(url, data, config);
    }
    success(response) {
        return response.data;
    }
}

function importKey(key) {
    return crypto.subtle.importKey('raw', key, 'PBKDF2', false, ['deriveBits', 'deriveKey']);
}
function deriveKey(key, salt, iterations, keyLength) {
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, { name: 'AES-GCM', length: keyLength }, false, ['encrypt', 'decrypt']);
}
function stringToUint8Array(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}
function uint8ArrayToString(buf) {
    const decoder = new TextDecoder();
    return decoder.decode(buf);
}
async function encrypt(message, masterkey, spec) {
    const key = await importKey(masterkey);
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const salt = crypto.getRandomValues(new Uint8Array(8));
    const derivedKey = await deriveKey(key, salt, spec.iter, spec.ks);
    const adata = [
        [bytesToBase64(iv), bytesToBase64(salt), spec.iter, spec.ks, spec.ts, spec.algo, spec.mode, spec.compression],
        spec.textformat,
        spec.opendiscussion,
        spec.burnafterreading,
    ];
    const encData = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: stringToUint8Array(JSON.stringify(adata)), tagLength: spec.ts }, derivedKey, message);
    return {
        ct: bytesToBase64(new Uint8Array(encData)),
        adata,
    };
}
async function decrypt(data, masterkey, adata) {
    const bData = base64ToBytes(data);
    const spec = adata[0];
    const iv = base64ToBytes(spec[0]);
    const salt = base64ToBytes(spec[1]);
    const iterations = spec[2];
    const ts = spec[4];
    const key = await importKey(masterkey);
    const derivedKey = await deriveKey(key, salt, iterations, 256);
    const clearData = await crypto.subtle.decrypt({ name: 'AES-GCM', iv, additionalData: stringToUint8Array(JSON.stringify(adata)), tagLength: ts }, derivedKey, bData);
    return new Uint8Array(clearData);
}

async function encryptText(text, key, options) {
    const { burnafterreading, opendiscussion, compression, textformat } = options;
    const spec = {
        algo: 'aes',
        mode: 'gcm',
        ks: 256,
        ts: 128,
        iter: 100000,
        textformat,
        compression,
        burnafterreading,
        opendiscussion,
    };
    let buf = stringToUint8Array(JSON.stringify({ paste: text }));
    if (compression === 'zlib') {
        buf = pako.deflateRaw(buf);
    }
    return encrypt(buf, key, spec);
}
async function decryptText(ct, key, adata) {
    const buf = await decrypt(ct, key, adata);
    if (adata[0][7] === 'zlib') {
        return JSON.parse(pako.inflateRaw(buf, { to: 'string' }));
    }
    return JSON.parse(uint8ArrayToString(buf));
}
class PrivatebinClient extends Api {
    constructor(baseURL = 'https://privatebin.net') {
        const apiConfig = {
            baseURL: baseURL,
            headers: {
                common: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'JSONHttpRequest',
                },
            },
        };
        super(apiConfig);
    }
    async sendText(text, key, options) {
        const payload = await encryptText(text, key, options);
        return this.postPaste(payload, options);
    }
    async getText(id, key) {
        const { status, message, ct, adata } = await this.getPaste(id);
        if (status == 0) {
            return decryptText(ct, key, adata);
        }
        else {
            throw new Error(message);
        }
    }
    getPaste(id) {
        return this.get(`/?pasteid=${id}`).then(this.success);
    }
    postPaste(PrivatebinPasteRequest, options) {
        const { expire } = options;
        const { ct, adata } = PrivatebinPasteRequest;
        return this.post('/', {
            v: 2,
            ct,
            adata,
            meta: { expire },
        }).then(this.success);
    }
}

export { PrivatebinClient, decryptText, encryptText };
//# sourceMappingURL=index.mjs.map
