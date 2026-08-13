const getKnex =
    require('../../database/getKnex');

const logger =
    require('../../utils/logger');

async function buscarRelogio(
    numser
) {

    try {

        const db =
            getKnex();

        const rows =
            await db.raw(`

            SELECT

                CODRLG,
                CODPLT

            FROM R058RLG

            WHERE NUMSER = ?

        `, [

            numser
        ]);

        if (!rows.length) {

            logger.erro(

                `RELÓGIO NÃO ENCONTRADO ${numser}`

            );

            return null;
        }

        return rows[0];

    } catch (error) {

        logger.erro(

            `BUSCAR RELÓGIO ${error.message}`

        );

        throw error;
    }
}

module.exports =
    buscarRelogio;