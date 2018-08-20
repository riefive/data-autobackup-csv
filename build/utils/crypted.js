'use strict';

const crypto = require('crypto');

class Crypted {
    encode(text, key, callback) {
        const cipher = crypto.createCipher('aes192', key);
        let encrypted = '';

        cipher.on('readable', () => {
            const data = cipher.read();
            if (data) encrypted += data.toString('hex');
        });

        cipher.on('end', () => {
            callback(encrypted);
        });

        cipher.write(text);
        cipher.end();
    }

    encodesync(text, key) {
        const cipher = crypto.createCipher('aes192', key);
        let encrypted = cipher.update(text);
        encrypted += cipher.final('hex');
        return encrypted;
    }

    decode(encrypted, key, callback) {
        const decipher = crypto.createDecipher('aes192', key);
        let decrypted = '';

        decipher.on('readable', () => {
            const data = decipher.read();
            if (data) decrypted += data.toString('utf8');
        });

        decipher.on('end', () => {
            callback(decrypted);
        });

        decipher.write(encrypted, 'hex');
        decipher.end();
    }

    decodesync(encrypted, key) {
        const decipher = crypto.createDecipher('aes192', key);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}

module.exports = Crypted;