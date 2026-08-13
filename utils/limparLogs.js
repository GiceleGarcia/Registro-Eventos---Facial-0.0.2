const fs =
    require('fs');

const path =
    require('path');

const {DIAS_LOG} =
    require('../config/sistema');

const logger =
    require('./logger');

async function limparLogs() {

    try {

        const pastaLogs =
            path.join(

                __dirname,

                '..',

                'logs'

            );

        if (

            !fs.existsSync(

                pastaLogs

            )

        ) {

            return;

        }

        const arquivos =

            fs.readdirSync(

                pastaLogs

            );

        const agora =

            new Date();

        for (const arquivo of arquivos) {

            const caminho =

                path.join(

                    pastaLogs,

                    arquivo

                );

            const stat =

                fs.statSync(

                    caminho

                );

            const diferencaDias =

                (

                    agora -

                    stat.mtime

                ) / (

                    1000 * 60 * 60 * 24

                );

            if (

                diferencaDias >

                DIAS_LOG

            ) {

                fs.unlinkSync(

                    caminho

                );

                console.log(//logger.info(

                    `LOG REMOVIDO: ${arquivo}`

                );

            }

        }

    } catch (error) {

        console.error(//logger.erro(

            `LIMPAR LOGS ${error.message}`

        );

    }

}

module.exports =
    limparLogs;