const crypto = require("crypto");

const DEFAULT_AES_KEY = process.env.ORACLE_ENCRYPTION_KEY || "AS23N7E2H4V717DEAS23N7E2H4V717DE";
const DEFAULT_HMAC_KEY = process.env.HMACSHA256_KEY || "PsdY4F54Khyr";
const ZERO_IV = Buffer.alloc(16, 0);

const getAesKey = (key = DEFAULT_AES_KEY) => {
    if (!key) {
        throw new Error("AES encryption key is required");
    }

    const keyBytes = Buffer.from(String(key), "utf8");

    if (keyBytes.length < 32) {
        throw new Error("AES key must contain at least 32 UTF-8 bytes");
    }

    return keyBytes.subarray(0, 32);
};

const getIv = (iv = ZERO_IV) => {
    if (Buffer.isBuffer(iv)) {
        if (iv.length !== 16) {throw new Error("AES IV must be exactly 16 bytes")}
        return iv;
    }

    if (!iv) {
        return ZERO_IV;
    }

    const ivBytes = Buffer.from(String(iv), "utf8");

    if (ivBytes.length !== 16) {
        throw new Error("AES IV must be exactly 16 UTF-8 bytes");
    }

    return ivBytes;
};

const encryptString = ( plainText, {key = DEFAULT_AES_KEY, iv = ZERO_IV, algorithm = "aes-256-cbc", outputEncoding = "hex", uppercase = true} = {}) => {
    if (plainText === null || plainText === undefined) { throw new Error("PlainText is required");
    }

    const cipher = crypto.createCipheriv( algorithm, getAesKey(key), getIv(iv));
    cipher.setAutoPadding(true);
    const encrypted = Buffer.concat([ cipher.update(Buffer.from(String(plainText), "utf8")), cipher.final(),]);
    let result = encrypted.toString(outputEncoding);
    if (uppercase && outputEncoding === "hex") { result = result.toUpperCase();}

    return result;
};

const decryptString = ( cipherText, {key = DEFAULT_AES_KEY, iv = ZERO_IV, algorithm = "aes-256-cbc", inputEncoding = "hex"} = {}) => {
    if (!cipherText || typeof cipherText !== "string") {
        throw new Error("CipherText is required");
    }
    if (inputEncoding === "hex") {
        if (cipherText.length % 2 !== 0) {
            throw new Error("Invalid hexadecimal ciphertext length");
        }

        if (!/^[0-9a-fA-F]+$/.test(cipherText)) {
            throw new Error("CipherText must contain only hexadecimal characters");
        }
    }

    const encryptedBytes = Buffer.from(cipherText, inputEncoding);
    const decipher = crypto.createDecipheriv(algorithm, getAesKey(key), getIv(iv));
    decipher.setAutoPadding(true);
    const decrypted = Buffer.concat([decipher.update(encryptedBytes), decipher.final()]);

    return decrypted.toString("utf8");
};

const generateHmacSha256 = (value, key = DEFAULT_HMAC_KEY, outputEncoding = "hex") => {
    if (value === null || value === undefined) {
        throw new Error("Value is required for HMAC");
    }

    if (!key) {
        throw new Error("HMAC key is required");
    }

    return crypto.createHmac("sha256", String(key)).update(String(value), "utf8").digest(outputEncoding);
};

module.exports = {
    encryptString,
    decryptString,
    generateHmacSha256,
};