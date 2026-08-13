const fs =
    require('fs');

const path =
    require('path');

const caminho =
    path.join(
        __dirname,
        '..',
        'data',
        'ultimaCarga.json'
    );

function lerUltimaCarga() {

    if (
        !fs.existsSync(caminho)
    ) {

        return null;
    }

    const conteudo =
        fs.readFileSync(
            caminho,
            'utf8'
        );

    return JSON.parse(
        conteudo
    );
}

function salvarUltimaCarga(
    codbnf,
    datini,
    quantidade
) {

    const json = {

        codbnf,
        datini,
        quantidade,
        processadoEm:
            new Date()
                .toISOString()
    };

    fs.writeFileSync(

        caminho,

        JSON.stringify(
            json,
            null,
            4
        )
    );
}

module.exports = {

    lerUltimaCarga,
    salvarUltimaCarga
};