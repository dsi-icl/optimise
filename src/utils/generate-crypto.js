const crypto = require('crypto');

function generateSaltIteration() {
    let salt = crypto.randomBytes(32).toString('base64');
    let iteration = Number.parseInt(crypto.randomBytes(2).toString('hex'), 16);
    return { salt: salt, iteration: iteration };
}

function generateAndHash(secret) {
    let saltitContainer = generateSaltIteration();
    let hashed = crypto.pbkdf2Sync(secret, saltitContainer.salt, saltitContainer.iteration, 64, 'sha512');

    hashed = hashed.toString('base64');
    return { hashed: hashed, salt: saltitContainer.salt, iteration: saltitContainer.iteration };
}

function hash(secret, salt, iteration) {
    let hashed = crypto.pbkdf2Sync(secret, salt, iteration, 64, 'sha512');

    hashed = hashed.toString('base64');
    return hashed;
}

module.exports = { generateSaltIteration: generateSaltIteration, hash: hash, generateAndHash: generateAndHash };