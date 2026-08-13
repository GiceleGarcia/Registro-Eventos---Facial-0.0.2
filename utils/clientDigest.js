const DigestFetch = require('digest-fetch').default;
const { USER, PASSWORD } = require('../config/hikvision');

const client =
    new DigestFetch(
        USER,
        PASSWORD
    );

module.exports = client;