const fs =
    require('fs');

const path =
    require('path');

function escrever(
    arquivo,
    mensagem
) {

    const data =
        new Date()
            .toISOString();

    const linha =
        `[${data}] ${mensagem}\n`;

    const caminho =
        path.join(
            __dirname,
            '..',
            'logs',
            arquivo
        );

    fs.appendFileSync(
        caminho,
        linha
    );
}

function info(
    mensagem
) {

    console.log(mensagem);

    escrever(
        'sincronizacao.log',
        mensagem
    );
}

function evento(
    mensagem
) {

    console.log(mensagem);

    escrever(
        'eventos.log',
        mensagem
    );
}

function erro(
    mensagem
) {

    console.error(mensagem);

    escrever(
        'erros.log',
        mensagem
    );
}

module.exports = {

    info,
    evento,
    erro
};