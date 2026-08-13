const {
    TERMINAIS
} =
    require('../../config/hikvision');

const {
    ESPERA_RECONEXAO,
    TENTATIVAS_TERMINAL
} =
    require('../../config/sistema');

const esperar =
    require('../../utils/esperar');

const logger =
    require('../../utils/logger');

async function executarEmTodos(callback) {

    for (const terminal of TERMINAIS) {

        let conectado = false;

        for (

            let tentativa = 1;

            tentativa <= TENTATIVAS_TERMINAL;

            tentativa++

        ) {

            try {

                logger.info(

                    `[${terminal.NUMSER}] TENTATIVA ${tentativa}`

                );

                await callback(terminal);

                conectado = true;

                logger.info(

                    `[${terminal.NUMSER}] PROCESSAMENTO FINALIZADO`

                );

                break;

            } catch (error) {

                logger.erro(

                    `[${terminal.NUMSER}] ${error.message}`

                );

                if (

                    tentativa < TENTATIVAS_TERMINAL

                ) {

                    logger.info(

                        `[${terminal.NUMSER}] NOVA TENTATIVA EM ${ESPERA_RECONEXAO / 1000} SEGUNDOS`

                    );

                    await esperar(

                        ESPERA_RECONEXAO

                    );

                }

            }

        }

        if (!conectado) {

            logger.erro(

                `[${terminal.NUMSER}] TERMINAL IGNORADO`

            );

        }

    }

}

module.exports =
    executarEmTodos;