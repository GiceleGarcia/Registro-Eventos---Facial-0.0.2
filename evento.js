const testarOracle =
    require('./database/testeOracle');

const processarEvento =
    require('./services/processamento/processarEvento');

const buscarEventos =
    require('./services/hikvision/buscarEventos');

const executarEmTodos =
    require('./services/terminal/executarEmTodos');

const logger =
    require('./utils/logger');

const {
    lerUltimoSerial,
    salvarUltimoSerial
} = require(
    './utils/controleEvento'
);

async function iniciar() {

    try {

        // TESTE ORACLE
        await testarOracle();

        logger.evento(
            'ORACLE CONECTADO'
        );

        await executarEmTodos(async (terminal) => {

        // BUSCAR EVENTOS
        const eventos =
            await buscarEventos(terminal);

        if (
            !eventos ||
            !eventos.AcsEvent ||
            !eventos.AcsEvent.InfoList
        ) {

            logger.erro(
                'EVENTOS INVÁLIDOS'
            );

            return;
        }

        // ÚLTIMO SERIAL
        const ultimoSerial =
            lerUltimoSerial(terminal.IP);

        logger.evento(

            `ÚLTIMO SERIAL ${ultimoSerial}`

        );

        // FILTRAR NOVOS
        const novosEventos =
            eventos.AcsEvent.InfoList.filter(

                evento =>

                    evento.serialNo >
                    ultimoSerial
            );

        // ordenador 15.07.26 
        novosEventos.sort(

            (a, b) =>

                a.serialNo - b.serialNo

        );    

        logger.evento(

            `${novosEventos.length} NOVOS EVENTOS`

        );
        //adicionado 15.07.26
        if (

            novosEventos.length === 0

        ) {

            logger.evento(

                'NENHUM EVENTO NOVO'

            );

            return;

        }
        // 15.07.26

        // MOSTRAR EVENTOS
        console.log(

            JSON.stringify(
                novosEventos,
                null,
                2
            )
        );

        const resumo = {

            processados: 0,

            erros: 0

        };

        // PROCESSAR EVENTOS
        for (const evento of novosEventos) {

            try {

                await processarEvento(
                    evento,
                    terminal
                );

                // SALVAR SERIAL
                salvarUltimoSerial(
                    terminal.IP,
                    evento.serialNo
                );

                resumo.processados++;

                logger.evento(

                    `SERIAL SALVO ${evento.serialNo}`

                );

            } catch (error) {

                resumo.erros++;

                logger.erro(

                    `PROCESSAR EVENTO ${error.message}`

                );
            }
        }

        });

    } catch (error) {

        logger.erro(

            `ERRO EVENTOS - ${error.message}`

        );
    }
}

//iniciar();
module.exports = iniciar;
