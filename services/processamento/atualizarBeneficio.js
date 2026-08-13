const getKnex =
    require('../../database/getKnex');

const logger =
    require('../../utils/logger');

async function atualizarBeneficio(
    matricula
) {

    try {

        const db =
            getKnex();

        const result =
            await db.raw(`

            UPDATE R057DIB DIB

            SET DIB.QTDREB = 1

            WHERE DIB.NUMCAD = ?

            AND DIB.DATINI = (

                SELECT MAX(X.DATINI)

                FROM R057DIB X

                WHERE X.NUMCAD = DIB.NUMCAD
            )

            AND DIB.DATINI + 5 > SYSDATE

        `, [

            matricula

        ]);

        logger.evento(

            `BENEFÍCIO ATUALIZADO ${matricula}`

        );

        return result;

    } catch (error) {

        logger.erro(

            `ATUALIZAR BENEFÍCIO ${error.message}`

        );

        throw error;
    }
}

module.exports =
    atualizarBeneficio;