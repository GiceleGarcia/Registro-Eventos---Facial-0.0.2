const testarOracle =
    require('./database/testeOracle');

const buscarCampanhaAtual =
    require('./services/campanha/buscarCampanhaAtual');

const buscarColaboradores =
    require('./services/colaborador/buscarColaborador');

const sincronizarUsuario =
    require('./services/sincronizacao/sincronizarUsuario');

const executarEmTodos =
    require('./services/terminal/executarEmTodos');

const removerUsuario =
    require('./services/sincronizacao/removerUsuario');

const limparTerminal =
    require('./services/sincronizacao/limparTerminal');

const {
    lerUltimaCarga,
    salvarUltimaCarga
} = require('./utils/controleCarga');

const {
    lerMatriculas,
    lerMatriculasTerminal,
    salvarMatriculas,
    salvarMatriculasTerminal
} = require('./utils/controleMatriculas');

const logger =
    require('./utils/logger.js');

const esperar =
    require('./utils/esperar');

const {
    TENTATIVAS_COLABORADOR,
    ESPERA_ENTRE_COLABORADORES,
    ESPERA_RECONEXAO_COLABORADOR
} = require('./config/sistema');

async function iniciar() {

    try {

        // TESTE ORACLE
        await testarOracle();

        logger.info(
            'ORACLE CONECTADO'
        );

        // CAMPANHA ATUAL
        const campanhaAtual =
            await buscarCampanhaAtual();

        if (!campanhaAtual) {

            logger.info(
                'NENHUMA CAMPANHA ENCONTRADA'
            );

            return;
        }

        // COLABORADORES PENDENTES
        const beneficiosVigentes =
            await buscarColaboradores();

        if (!beneficiosVigentes.length) {

            logger.info(
                'NENHUM COLABORADOR ENCONTRADO'
            );

            return;
        }

        logger.info(

            `${beneficiosVigentes.length} BENEFICIOS VIGENTES ENCONTRADOS`

        );

        const colaboradoresPorMatricula = new Map();

        for (const item of beneficiosVigentes) {

            const matricula = item.NUMCAD.toString();

            let colaborador = colaboradoresPorMatricula.get(matricula);

            if (!colaborador) {

                colaborador = {
                    numemp: item.NUMEMP,
                    tipcol: item.TIPCOL,
                    numcad: item.NUMCAD,
                    employeeNo: matricula,
                    name: item.NOMFUN,
                    beneficios: []
                };

                colaboradoresPorMatricula.set(matricula, colaborador);
            }

            colaborador.beneficios.push({
                codbnf: item.CODBNF,
                datini: item.DATINI.toISOString(),
                datfim: item.DATFIM.toISOString()
            });
        }

        const colaboradores =
            [...colaboradoresPorMatricula.values()];

        const cargaAtual = {

            codbnf:
                campanhaAtual.CODBNF,

            datini:
                campanhaAtual.DATINI
        };

        const datiniAtual =

            cargaAtual.datini.toISOString();

        // CONTROLES
        const ultimaCarga =
            lerUltimaCarga();

        const controleMatriculas =
            lerMatriculas();

        // MATRÍCULAS ORACLE
        const matriculasOracle =

            colaboradores.map(

                item =>

                    item.employeeNo

            );

        // MATRÍCULAS NOVAS
       // const matriculasNovas =

           // matriculasOracle.filter(

           //     matricula =>

            //        !controleMatriculas.matriculas.includes(

             //           matricula

           //         )

          //  );


        // CAMPANHA MUDOU?
        const campanhaMudou = false;

        //ultimaCarga.datini !== datiniAtual;

        // NOVA CAMPANHA
        if (campanhaMudou) {

            logger.info(

                'NOVA CAMPANHA DETECTADA'

            );


            logger.info(

                'LIMPANDO TERMINAL...'

            );

            await executarEmTodos(

                async terminal => {

                    await limparTerminal(

                        terminal

                    );

                }

            );

            limparMatriculas();

            logger.info(

                'CONTROLE DE MATRÍCULAS LIMPO'

            );

            logger.info(

                'AGUARDANDO TERMINAL FINALIZAR LIMPEZA...'

            );

            await esperar(3000);

            logger.info(

                'TERMINAL PRONTO PARA NOVA CARGA'

            );

        }

        // SINCRONIZAÇÃO
        await executarEmTodos(

            async terminal => {

                const matriculasTerminal =

                    lerMatriculasTerminal(

                        terminal.NUMSER

                    );   

                const matriculasNovas =

                    colaboradores.filter(

                        colaborador =>

                            !matriculasTerminal.some(

                                registro =>

                                    registro.matricula ===
                                    colaborador.employeeNo

                            )

                    );

                const matriculasProcessadas = [];

                const matriculasMantidas = [];

                logger.info(

                    `[${terminal.NUMSER}] INICIANDO SINCRONIZAÇÃO`

                );
                // LOGS
                logger.info(

                    `[${terminal.NUMSER}] MATRÍCULAS ORACLE: ${matriculasOracle.length}`

                );

                logger.info(

                    `[${terminal.NUMSER}] MATRÍCULAS SINCRONIZADAS: ${matriculasTerminal.length}`

                );

                logger.info(

                    `[${terminal.NUMSER}] MATRÍCULAS NOVAS: ${matriculasNovas.length}`

                );

                if (matriculasNovas.length > 0) {

                    logger.info(

                        `NOVAS: ${matriculasNovas.map(item => item.employeeNo).join(', ')}`

                    );

                }

                if (

                    false &&

                    matriculasNovas.length === 0

                ) {

                    logger.info(

                        `[${terminal.NUMSER}] CARGA JÁ PROCESSADA`

                    );

                    return;

                }

                for (const registro of matriculasTerminal) {

                    const colaboradorAtual =
                        colaboradoresPorMatricula.get(registro.matricula);

                    if (colaboradorAtual) {

                        matriculasMantidas.push({

                            matricula: colaboradorAtual.employeeNo,

                            beneficios: colaboradorAtual.beneficios
                        });

                        continue;
                    }

                    let removido = false;

                    for (
                        let tentativa = 1;
                        tentativa <= TENTATIVAS_COLABORADOR;
                        tentativa++
                    ) {

                        try {

                            await removerUsuario(
                                terminal,
                                registro.matricula
                            );

                            removido = true;

                            logger.info(
                                `[${terminal.NUMSER}] USUARIO REMOVIDO ${registro.matricula}`
                            );

                            break;

                        } catch (error) {

                            logger.erro(
                                `[${terminal.NUMSER}] REMOVER ${registro.matricula} - ` +
                                `TENTATIVA ${tentativa}: ${error.message}`
                            );

                            if (tentativa < TENTATIVAS_COLABORADOR) {

                                await esperar(
                                    ESPERA_RECONEXAO_COLABORADOR
                                );
                            }
                        }
                    }

                    if (!removido) {

                        matriculasMantidas.push(registro);
                    }
                }

                for (const item of colaboradores) {

                    const colaborador = item;

                    // MESMA CAMPANHA:
                    // ENVIA SOMENTE AS MATRÍCULAS NOVAS
                    if (

                        !matriculasNovas.some(

                            novo =>

                                novo.employeeNo ===
                                colaborador.employeeNo

                        )

                    ) {

                        continue;

                    }

                    let sincronizado = false;

                    for (
                        let tentativa = 1;
                        tentativa <= TENTATIVAS_COLABORADOR;
                        tentativa++
                    ) {

                        try {

                            logger.info(

                                `[${terminal.NUMSER}] SINCRONIZANDO ${colaborador.name} ` +
                                `(TENTATIVA ${tentativa})`

                            );

                            await sincronizarUsuario(

                                terminal,

                                colaborador

                            );

                            sincronizado = true;

                            matriculasProcessadas.push(
                                {

                                    matricula: colaborador.employeeNo,

                                    beneficios: colaborador.beneficios
                                }
                            );

                            logger.info(

                                `[${terminal.NUMSER}] FINALIZADO ${colaborador.employeeNo}`

                            );

                            break;

                        } catch (error) {

                            logger.erro(

                                `[${terminal.NUMSER}] ${colaborador.employeeNo} - ` +
                                `TENTATIVA ${tentativa}: ${error.message}`

                            );

                            if (tentativa < TENTATIVAS_COLABORADOR) {

                                await esperar(
                                    ESPERA_RECONEXAO_COLABORADOR
                                );
                            }
                        }
                    }

                    if (!sincronizado) {

                        logger.erro(

                            `[${terminal.NUMSER}] ${colaborador.employeeNo} ` +
                            'NAO SINCRONIZADO; SERA TENTADO NO PROXIMO CICLO'

                        );
                    }

                    await esperar(
                        ESPERA_ENTRE_COLABORADORES
                    );

                }

                // Salva o controle apenas após concluir o terminal
                const matriculasAtualizadas = [

                    ...new Set([

                        ...matriculasMantidas,

                        ...matriculasProcessadas

                    ])

                ];

                salvarMatriculasTerminal(

                    terminal.NUMSER,

                    cargaAtual.codbnf,

                    datiniAtual,

                    matriculasAtualizadas

                );

                logger.info(

                    `[${terminal.NUMSER}] CONTROLE DE MATRÍCULAS ATUALIZADO`

                );

            }

        );

        logger.info(

            'PROCESSAMENTO FINALIZADO'

        );

        salvarUltimaCarga(

            cargaAtual.codbnf,

            datiniAtual,

            matriculasOracle.length

            //controleMatriculas.matriculas.length

        );

        logger.info(

            'ÚLTIMA CARGA SALVA'

        );

    } catch (error) {

        logger.erro(

            `ERRO GERAL - ${error.message}`

        );

    }

}

//iniciar();
module.exports = iniciar;
