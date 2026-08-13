const getKnex = require('../../database/getKnex');

async function buscarColaboradores() {

    const db = getKnex();

    const rows =
        await db.raw(`

            SELECT

              FUN.NUMEMP,
              FUN.TIPCOL,
              FUN.NUMCAD,
              FUN.NOMFUN,
              DIB.CODBNF,
              DIB.DATINI,
              DIB.DATFIM

            FROM R057DIB DIB

            INNER JOIN R034FUN FUN

            ON FUN.NUMEMP = DIB.NUMEMP
            AND FUN.TIPCOL = DIB.TIPCOL
            AND FUN.NUMCAD = DIB.NUMCAD

            WHERE FUN.SITAFA <> 7

            AND FUN.TIPCOL = 1

            AND DIB.QTDREB = 0

            AND DIB.DATFIM >= TRUNC(SYSDATE)

        `);

    return rows;
}

module.exports = buscarColaboradores;
