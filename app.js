const executarCarga =
    require('./carga');

const executarEvento =
    require('./evento');

const logger =
    require('./utils/logger');

const esperar =
    require('./utils/esperar');

const limparLogs =
    require('./utils/limparLogs');

const {INTERVALO} = 
    require('./config/sistema');


async function iniciar() {
    
   await limparLogs();

    logger.info(

        'SERVIÇO INICIADO'

    );

    while (true) {

        try {

            logger.info(

                '======================================'

            );

            logger.info(

                'INICIANDO NOVO CICLO'

            );

            logger.info(

                'EXECUTANDO SINCRONIZAÇÃO'

            );

            await executarCarga();

            logger.info(

                'SINCRONIZAÇÃO FINALIZADA'

            );

            logger.info(

                'BUSCANDO EVENTOS'

            );

            await executarEvento();

            logger.info(

                'EVENTOS FINALIZADOS'

            );

            logger.info(

                `AGUARDANDO ${INTERVALO / 1000} SEGUNDOS`

            );

        } catch (error) {

            logger.erro(

                `ERRO NO CICLO ${error.message}`

            );

        }

        await esperar(

            INTERVALO

        );

    }

}

iniciar();