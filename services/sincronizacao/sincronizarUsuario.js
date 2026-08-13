const logger = require('../../utils/logger.js');
const buscarUsuario = require('../hikvision/buscarUsuario');
const criarUsuario = require('../hikvision/criarUsuario');
const buscarFoto = require('../colaborador/buscarFoto');
const enviarFace = require('../hikvision/enviarFace');
const buscarCracha = require('../colaborador/buscarCracha');
const enviarCracha =require('../hikvision/enviarCracha');


async function sincronizarUsuario(
    terminal,
    colaborador
) {

    console.log(
        '\nBUSCANDO USUÁRIO...\n'
    );

    const busca =
        await buscarUsuario(
            terminal,
            colaborador.employeeNo
        );

    const existe =

        busca?.UserInfoSearch?.numOfMatches > 0;

    if (existe) {

        logger.info(
            `USUÁRIO ${colaborador.employeeNo} JÁ EXISTE`
        );

    } else {

        logger.info(
            `CRIANDO USUÁRIO ${colaborador.employeeNo}...\n`
        );

        const criacao =
            await criarUsuario(
                terminal,
                colaborador
            );

        console.log(criacao);
    }

    logger.info(
        `\nENVIANDO FACE ${colaborador.employeeNo}...\n`
    );

    const fotoBuffer =
        await buscarFoto(
            colaborador.numemp,
            colaborador.tipcol,
            colaborador.numcad
           // colaborador.employeeNo
        );

    const face =
        await enviarFace(
            terminal,
            colaborador,
            fotoBuffer
        );

    const faceString =
        face.toString();

    if (

        faceString.includes(
            'deviceUserAlreadyExistFace'
        )

    ) {

        logger.info(
            `FACE ${colaborador.employeeNo} JÁ CADASTRADA`
        );

    } else {

        console.log(face);
    }
    const numeroCracha =
        await buscarCracha(
            colaborador
        );

    if (!numeroCracha) {

        return;
    }

    console.log(
        `CRACHÁ: ${numeroCracha}`
    );

    logger.info(
        `\nENVIANDO CRACHÁ ${numeroCracha}...\n`
    );

    const cracha =
        await enviarCracha(
            terminal,
            colaborador,
            numeroCracha
        );

    console.log(cracha);
}

module.exports = sincronizarUsuario;