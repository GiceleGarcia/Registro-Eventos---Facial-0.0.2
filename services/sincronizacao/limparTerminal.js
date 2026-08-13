const client =
    require('../../utils/clientDigest');

//const { IP } =
  //  require('../../config/hikvision');

const logger =
    require('../../utils/logger.js');

async function limparTerminal(
     terminal
) {

    logger.info(
        `[${terminal.NUMSER}] INICIANDO LIMPEZA DO TERMINAL...`
    );

    const response =
        await client.fetch(

            `http://${terminal.IP}/ISAPI/AccessControl/UserInfoDetail/Delete?format=json`,

            {

                method: 'PUT',

                headers: {

                    'Content-Type':
                        'application/json'
                },

                body: JSON.stringify({

                    UserInfoDetail: {

                        mode: 'all'
                    }

                })

            }

        );

    const texto =
        await response.text();

    logger.info(

        `[${terminal.NUMSER}] STATUS LIMPEZA: ${response.status}`

    );

    logger.info(

        `[${terminal.NUMSER}] RESPOSTA LIMPEZA: ${texto}`

    );

    let resultado;

    try {

        resultado =
            JSON.parse(texto);

    } catch (error) {

        throw new Error(

            `Resposta inválida da Hikvision: ${texto}`

        );
    }

    if (

        response.status !== 200 ||

        resultado.statusCode !== 1

    ) {

        throw new Error(

            `Falha ao limpar terminal: ${texto}`

        );
    }

    logger.info(

        `[${terminal.NUMSER}] TERMINAL LIMPO COM SUCESSO`

    );

    return true;
}

module.exports =
    limparTerminal;