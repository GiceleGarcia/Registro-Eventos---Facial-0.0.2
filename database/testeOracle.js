const getKnex = require('./getKnex');

async function testarOracle() {

    const db = getKnex();

    const result =
        await db.raw(
            `SELECT SYSDATE FROM DUAL`
        );

    console.log(result);
}

module.exports = testarOracle;