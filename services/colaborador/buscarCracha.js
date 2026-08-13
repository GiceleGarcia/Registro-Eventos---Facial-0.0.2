const getKnex = require('../../database/getKnex');

async function buscarCracha(
    colaborador
) {

    const db = getKnex();

    const rows =
        await db.raw(`

            SELECT

                NUMFIS

            FROM R070CON

            WHERE NUMEMP = ?
            AND TIPCOL = ?
            AND NUMCAD = ?
            AND TECCRA = 3

        `, [

            colaborador.numemp,
            colaborador.tipcol,
            colaborador.numcad
        ]);

    if (!rows.length) {

        console.log(
            'CRACHÁ NÃO ENCONTRADO'
        );

        return null;
    }

    return rows[0]
    .NUMFIS
    .toString()
    .padStart(10,'0');
}

module.exports = buscarCracha;