const logger =
    require('../../utils/logger');

const atualizarBeneficio =
    require('./atualizarBeneficio');

const buscarRelogio =
    require('./buscarRelogio');

const inserirConsumo =
    require('./inserirConsumo');

async function processarEvento(
    evento,
    terminal
) {

    try {

        logger.evento(

            `PROCESSANDO SERIAL ${evento.serialNo}`

        );

        // VALIDAR MAJOR
        if (evento.major !== 5) {

            logger.evento(
                'EVENTO IGNORADO'
            );

            return;
        }

        // EVENTOS VÁLIDOS
        const eventosValidos = [

            1, //crachá

            75 //facial
        ];

        // VALIDAR MINOR
        if (

            !eventosValidos.includes(
                evento.minor
            )
        ) {

            logger.evento(

                `EVENTO INVÁLIDO ${evento.minor}`

            );

            return;
        }

        // MATRÍCULA
        const matricula =

            evento.employeeNoString ||

            evento.employeeNo ||

            null;

        // CRACHÁ
        const cracha =

            evento.cardNo ||

            null;

        logger.evento(

            `MATRÍCULA: ${matricula}`

        );

        logger.evento(

            `CRACHÁ: ${cracha}`

        );

        logger.evento(

            `DATA: ${evento.time}`

        );

        // VALIDAR MATRÍCULA
        if (

            !matricula ||

            isNaN(Number(matricula))
        ) {

            logger.erro(

                `MATRÍCULA INVÁLIDA SERIAL ${evento.serialNo}`

            );

            return;
        }

        logger.evento(

            `EVENTO VÁLIDO ${matricula}`

        );

        // BUSCAR RELÓGIO
        const relogio =
            await buscarRelogio(
                terminal.NUMSER
            );

        if (!relogio) {

            logger.erro(

                `RELÓGIO NÃO ENCONTRADO ${terminal.NUMSER}`

            );

            return;
        }

        logger.evento(

            `CODRLG ${relogio.CODRLG}`

        );

        // ATUALIZAR BENEFÍCIO
        await atualizarBeneficio(
            matricula
        );

        await inserirConsumo(

          matricula,

          relogio,

          evento.time
        );

    } catch (error) {

        logger.erro(

            `PROCESSAR EVENTO ${error.message}`

        );
    }
}

module.exports =
    processarEvento;
