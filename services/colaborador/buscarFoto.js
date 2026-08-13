const getKnex = require('../../database/getKnex');

async function buscarFoto(
    numemp,
    tipcol,
    numcad
) {

    const db = getKnex();

    const result =
        await db.raw(`
            SELECT FOTEMP
            FROM R034FOT
            WHERE NUMEMP = ?
            AND TIPCOL = ?
            AND NUMCAD = ?
        `, [numemp,
            tipcol,
            numcad]);

    if (!result.length) {

        console.log(
            'FOTO NÃO ENCONTRADA'
        );

        return null;
    }

    const fotoBuffer =
        result[0].FOTEMP;

    console.log(
        'FOTO CARREGADA'
    );

    return fotoBuffer;
}

module.exports = buscarFoto;