const testarOracle =
    require('./database/testeOracle');

const buscarColaboradores =
    require('./services/buscarColaborador');

const sincronizarUsuario =
    require('./services/sincronizacao/sincronizarUsuario');

const buscarEventos =
    require('./services/hikvision/buscarEventos');

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

        logger.info(
            'ORACLE CONECTADO'
        );

        // BUSCAR COLABORADORES
        const colaboradores =
            await buscarColaboradores();

        logger.info(

            `${colaboradores.length} COLABORADORES ENCONTRADOS`

        );

        // COLABORADOR POR COLABORADOR
        for (const item of colaboradores) {

            const colaborador = {

                numemp:
                    item.NUMEMP,

                tipcol:
                    item.TIPCOL,

                numcad:
                    item.NUMCAD,

                employeeNo:
                    item.NUMCAD.toString(),

                name:
                    item.NOMFUN
            };

            try {

                logger.info(

                    `SINCRONIZANDO ${colaborador.name}`

                );

                await sincronizarUsuario(
                    colaborador
                );

                logger.info(

                    `FINALIZADO ${colaborador.employeeNo}`

                );

            } catch (error) {

                logger.erro(

                    `${colaborador.employeeNo} - ${error.message}`

                );
            }
        }

        logger.info(
            'PROCESSAMENTO FINALIZADO'
        );

        // BUSCAR EVENTOS
        const eventos =
            await buscarEventos();

        const ultimoSerial =
            lerUltimoSerial();

        logger.evento(

            `ÚLTIMO SERIAL ${ultimoSerial}`

        );

        const novosEventos =
            eventos.AcsEvent.InfoList.filter(

                evento =>

                    evento.serialNo >
                    ultimoSerial
            );

        console.log(
            novosEventos.length
        );

        console.log(

            JSON.stringify(
                novosEventos,
                null,
                2
            )
        );

        if (novosEventos.length) {

            const maiorSerial =
                Math.max(

                    ...novosEventos.map(
                        x => x.serialNo
                    )
                );

            salvarUltimoSerial(
                maiorSerial
            );

            logger.evento(

                `NOVO ÚLTIMO SERIAL ${maiorSerial}`

            );
        }

    } catch (error) {

        logger.erro(

            `ERRO GERAL - ${error.message}`

        );
    }
}

iniciar();