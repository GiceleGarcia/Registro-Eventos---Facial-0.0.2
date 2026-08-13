const getKnex =
    require('../../database/getKnex');

async function buscarCampanhaAtual() {

    const db =
        getKnex();

    const rows =
        await db.raw(`

        SELECT

            CODBNF,
            DATINI,
            COUNT(*) QUANTIDADE

        FROM R057DIB

        WHERE DATFIM >= TRUNC(SYSDATE)

        GROUP BY

            CODBNF,
            DATINI

        ORDER BY

            DATINI DESC

        FETCH FIRST 1 ROW ONLY

    `);

    if (!rows.length) {

        return null;

    }

    return rows[0];
}

module.exports =
    buscarCampanhaAtual;

buscarCampanhaAtual()

    .then(resultado => {

        console.log(resultado);

    })

    .catch(console.error);    