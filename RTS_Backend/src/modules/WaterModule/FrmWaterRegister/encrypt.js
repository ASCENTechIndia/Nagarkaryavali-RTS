const crypto = require("crypto");

const ENCRYPTION_KEY = process.env.ORACLE_ENCRYPTION_KEY || "AS23N7E2H4V717DEAS23N7E2H4V717DE";
const IV = Buffer.alloc(16, 0);

const getKey = () => {
    const keyBytes = Buffer.from(ENCRYPTION_KEY, "utf8");
    const key = Buffer.alloc(32, 0);
    keyBytes.copy(key, 0, 0, 32);
    return key;
};

const encryptString = (plainText) => {
    const cipher = crypto.createCipheriv("aes-256-cbc", getKey(), IV);
    cipher.setAutoPadding(true);
    const encrypted = Buffer.concat([
        cipher.update(Buffer.from(plainText, "utf8")),
        cipher.final(),
    ]);
    return encrypted.toString("hex").toUpperCase();
};

const decryptString = (cipherText) => {
    const encryptedBytes = Buffer.from(cipherText, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", getKey(), IV);
    decipher.setAutoPadding(true);
    const decrypted = Buffer.concat([
        decipher.update(encryptedBytes),
        decipher.final(),
    ]);
    return decrypted.toString("utf8");
};

module.exports = {
    encryptString,
    decryptString,
};