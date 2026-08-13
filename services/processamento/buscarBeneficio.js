const getKnex =
    require('../../database/getKnex');

const logger =
    require('../../utils/logger.js');

async function buscarBeneficio(
    matricula
) {

    try {

        const db =
            getKnex();

        const rows =
            await db.raw(`

            SELECT *

            FROM (

                SELECT

                    DIB.NUMEMP,
                    DIB.TIPCOL,
                    DIB.NUMCAD,
                    DIB.CODBNF,
                    DIB.DATINI,
                    DIB.DATFIM

                FROM R057DIB DIB

                WHERE DIB.NUMCAD = ?

                AND DIB.DATFIM >= TRUNC(SYSDATE)

                ORDER BY DIB.DATINI DESC

            )

            WHERE ROWNUM = 1

        `, [

            matricula

        ]);

        if (!rows.length) {

            logger.evento(

                `BENEFÍCIO NÃO ENCONTRADO ${matricula}`

            );

            return null;
        }

        return rows[0];

    } catch (error) {

        logger.erro(

            `BUSCAR BENEFÍCIO ${error.message}`

        );

        throw error;
    }
}

module.exports =
    buscarBeneficio;