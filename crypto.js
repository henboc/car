const crypto = require('crypto');

// Generate a 256-bit (32-character) encryption key
const ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex').slice(0, 32); // 32 bytes => 64 hex characters => slice to 32 characters

// Generate a 128-bit (16-character) IV
const IV = crypto.randomBytes(16).toString('hex').slice(0, 16); // 16 bytes => 32 hex characters => slice to 16 characters

console.log('Encryption Key:', ENCRYPTION_KEY);
console.log('Initialization Vector:', IV);