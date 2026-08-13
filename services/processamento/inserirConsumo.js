const getKnex =
    require('../../database/getKnex');

const logger =
    require('../../utils/logger.js');

const buscarBeneficio =
    require('./buscarBeneficio');

async function inserirConsumo(
    matricula,
    relogio,
    dataEvento
) {

    try {

        const db =
            getKnex();

        // BUSCAR BENEFÍCIO
        const beneficio =

            await buscarBeneficio(

                matricula

            );

        if (!beneficio) {

            logger.erro(

                `SEM BENEFÍCIO ${matricula}`

            );

            return;
        }

        // DATA TEXTO
        const dataTexto =

            dataEvento
                .split('T')[0];

        // DATA
        const data =

            new Date(

                dataTexto + 'T12:00:00'
            );

        // HORA TEXTO
        const horaTexto =

          dataEvento
             .split('T')[1]
             .substring(0, 5);    

        // HORAS
        const horas =
            Number(

                horaTexto.split(':')[0]
            );

        // MINUTOS
        const minutos =
            Number(

                horaTexto.split(':')[1]
            );

        // TOTAL MINUTOS
        const hora =

            (horas * 60) + minutos;

        // BUSCAR PRÓXIMO SEQCON
        const seq =
            await db.raw(`

                SELECT

                    NVL(MAX(SEQCON), 0) + 1 AS SEQCON

                FROM R057CON

                WHERE NUMEMP = ?
                AND TIPCOL = ?
                AND NUMCAD = ?
                AND TRUNC(DATCON) = TRUNC(?)

            `, [

                beneficio.NUMEMP,
                beneficio.TIPCOL,
                beneficio.NUMCAD,
                data

            ]);

        const seqcon =
            seq[0].SEQCON;

        // VALIDAR CONSUMO EXISTENTE
        const existe =
            await db.raw(`

              SELECT 1
              FROM R057CON
              WHERE NUMEMP = ?
              AND TIPCOL = ?
              AND NUMCAD = ?
              AND CODBNF = ?
              AND TRUNC(DATCON) = TO_DATE(?, 'YYYY-MM-DD')
              AND HORINI = ?
              FETCH FIRST 1 ROWS ONLY

            `, [

                beneficio.NUMEMP,
                beneficio.TIPCOL,
                beneficio.NUMCAD,
                beneficio.CODBNF,
                dataTexto,
                hora

            ]);
           // logue controlado na pasta logs 
           // console.log(
           // JSON.stringify(
           //  existe,
           //  null,
           //    2
           //  )
           // );

        if ( 
             existe &&  

             Array.isArray(existe) &&

             existe.length > 0

            ) {

            logger.evento(

                `CONSUMO JÁ EXISTE ${matricula}`

            );

            return;
        }

        // INSERT
        await db('R057CON')
            .insert({

                NUMEMP:
                    beneficio.NUMEMP,

                TIPCOL:
                    beneficio.TIPCOL,

                NUMCAD:
                    beneficio.NUMCAD,

                CODBNF:
                    beneficio.CODBNF,

                DATCON:
                    data,

                HORCON:
                    hora,

                SEQCON:
                    seqcon,

                CODRLG:
                    relogio.CODRLG,

                QTDCON:
                    1,

                GERCON:
                    0,

                DATINI:
                    beneficio.DATINI,

                HORINI:
                    hora,

                CODPLT:
                    relogio.CODPLT
            });

        logger.evento(

            `CONSUMO INSERIDO ${matricula} BENEFICIO ${beneficio.CODBNF}`

        );

    } catch (error) {

        logger.erro(

            `INSERIR CONSUMO ${error.message}`

        );

        throw error;
    }
}

module.exports =
    inserirConsumo;