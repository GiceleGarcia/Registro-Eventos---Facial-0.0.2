const client =
    require('../../utils/clientDigest');

const logger =
    require('../../utils/logger.js');

const TAMANHO_PAGINA = 30;

async function consultarEventos(
    terminal,
    posicao,
    maxResultados
) {

    const response =
        await client.fetch(

            `http://${terminal.IP}/ISAPI/AccessControl/AcsEvent?format=json`,

            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    AcsEventCond: {

                        searchID: '1',

                        searchResultPosition: posicao,

                        maxResults: maxResultados,

                        major: 5,

                        minor: 0
                    }
                })
            }
        );

    const texto =
        await response.text();

    try {

        return JSON.parse(texto);

    } catch {

        throw new Error(
            `RESPOSTA INVALIDA DA HIKVISION: ${texto}`
        );
    }
}

async function buscarEventos(
    terminal
) {

    logger.evento(
        `[${terminal.NUMSER}] BUSCANDO EVENTOS`
    );

    // Consulta inicial para descobrir a quantidade total.
    const primeiraPagina =
        await consultarEventos(
            terminal,
            0,
            1
        );

    const totalMatches =
        primeiraPagina?.AcsEvent?.totalMatches || 0;

    logger.evento(
        `[${terminal.NUMSER}] TOTAL EVENTOS ${totalMatches}`
    );

    const infoList = [];

    // Busca todas as paginas de resultados.
    for (
        let posicao = 0;
        posicao < totalMatches;
        posicao += TAMANHO_PAGINA
    ) {

        const pagina =
            await consultarEventos(
                terminal,
                posicao,
                TAMANHO_PAGINA
            );

        const eventosPagina =
            pagina?.AcsEvent?.InfoList || [];

        infoList.push(
            ...eventosPagina
        );

        logger.evento(

            `[${terminal.NUMSER}] POSICAO ${posicao}: ` +
            `${eventosPagina.length} EVENTOS`

        );

        // Evita continuar caso o terminal retorne uma pagina vazia.
        if (eventosPagina.length === 0) {
            break;
        }
    }

    return {

        AcsEvent: {

            totalMatches,

            InfoList: infoList
        }
    };
}

module.exports =
    buscarEventos;