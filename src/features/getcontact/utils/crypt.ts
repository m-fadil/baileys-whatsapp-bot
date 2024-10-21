import { AES, HmacSHA256, mode, enc } from 'crypto-js';

const opt = { mode: mode.ECB };
const { Hex, Utf8, Base64 } = enc;

export const encrypt = (data: any, finalKey: string = ''): string => AES.encrypt(data, Hex.parse(finalKey), opt)?.toString();
export const decrypt = (data: any, finalKey: string = '') =>
    AES.decrypt(data.toString(), Hex.parse(finalKey), opt)?.toString(Utf8);
export const signature = (timestamp: any, decryptMessage: any, key: string = '') => {
    return HmacSHA256(`${timestamp}-${decryptMessage}`, Hex.parse(key))?.toString(Base64);
};
export const hexToUtf8 = (hex: string) => Hex.parse(hex).toString(Utf8);
