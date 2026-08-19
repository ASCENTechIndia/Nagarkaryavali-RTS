const crypto = require("crypto");

const ENCRYPTION_KEY = process.env.ORACLE_ENCRYPTION_KEY || "AS23N7E2H4V717DEAS23N7E2H4V717DE";
const IV = Buffer.alloc(16, 0);

const getKey = () => {
    const keyBytes = Buffer.from(ENCRYPTION_KEY, "utf8");
    const key = Buffer.alloc(32, 0);
    keyBytes.copy( key, 0, 0, 32);
    return key;
};

function decryptString(cipherText) {
    try {
        if (!cipherText || typeof cipherText !== "string") {
            throw new Error("Invalid CipherText");
        }

        if (cipherText.length % 2 !== 0) {
            throw new Error("Invalid hexadecimal ciphertext length");
        }

        if (!/^[0-9a-fA-F]+$/.test(cipherText)) {
            throw new Error("CipherText must contain only hexadecimal characters");
        }

        const encryptedBytes = Buffer.from(cipherText, "hex");
        const decipher = crypto.createDecipheriv("aes-256-cbc", getKey(), IV);

        decipher.setAutoPadding(true);

        const decryptedData = Buffer.concat([
                decipher.update(encryptedBytes),
                decipher.final(),
            ]);

        return decryptedData.toString("utf8");
    } catch (error) {
        console.error("❌ Decryption failed:", error);
        throw error;
    }
}

function encryptString(plainText) {
    try {
        if (!plainText || typeof plainText !== "string") {
            throw new Error("Invalid PlainText");
        }

        const cipher = crypto.createCipheriv("aes-256-cbc", getKey(), IV);
        cipher.setAutoPadding(true);

        const plainTextByte = Buffer.from(plainText, "utf8");

        const encryptedData = Buffer.concat([
                cipher.update(plainTextByte),
                cipher.final(),
            ]);

        return encryptedData.toString("hex").toUpperCase();
    } catch (error) {
        console.error("❌ Encryption failed:",error);
        throw error;
    }
}

module.exports = {
    encryptString,
    decryptString,
};