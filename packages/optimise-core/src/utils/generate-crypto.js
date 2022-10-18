import crypto from 'crypto';

export const generateSaltIteration = function () {
    const salt = crypto.randomBytes(32).toString('base64');
    const iteration = Number.parseInt(crypto.randomBytes(2).toString('hex'), 16);
    return { salt, iteration };
};

export const generateAndHash = function (secret) {
    const saltitContainer = generateSaltIteration();
    let hashed = crypto.pbkdf2Sync(secret, saltitContainer.salt, saltitContainer.iteration, 64, 'sha512');

    hashed = hashed.toString('base64');
    return { hashed, salt: saltitContainer.salt, iteration: saltitContainer.iteration };
};

export const hash = function (secret, salt, iteration) {
    let hashed = crypto.pbkdf2Sync(secret, salt, iteration, 64, 'sha512');

    hashed = hashed.toString('base64');
    return hashed;
};

export default { generateSaltIteration, hash, generateAndHash };