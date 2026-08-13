const fs =
    require('fs');

const path =
    require('path');

function dataAtual() {

    const agora = new Date();

    const ano =
        agora.getFullYear();

    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(2, '0');

    const dia =
        String(
            agora.getDate()
        ).padStart(2, '0');

    const hora =
        String(
            agora.getHours()
        ).padStart(2, '0');

    const minuto =
        String(
            agora.getMinutes()
        ).padStart(2, '0');

    const segundo =
        String(
            agora.getSeconds()
        ).padStart(2, '0');

    const milissegundos =
        String(
            agora.getMilliseconds()
        ).padStart(3, '0');

    return `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}.${milissegundos}`;
}

function dataArquivo() {

    const agora = new Date();

    const ano = agora.getFullYear();

    const mes = String(
        agora.getMonth() + 1
    ).padStart(2, '0');

    const dia = String(
        agora.getDate()
    ).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;

}

function escrever(
    arquivo,
    mensagem
) {

    const linha =
        `[${dataAtual()}] ${mensagem}\n`;

    const nomeArquivo =

        arquivo.replace(

            '.log',

            `-${dataArquivo()}.log`

        );

    const caminho =
        path.join(
            __dirname,
            '..',
            'logs',
            nomeArquivo
        );

    if (!fs.existsSync(path.dirname(caminho))) {

        fs.mkdirSync(

            path.dirname(caminho),

            { recursive: true }

        );

    }        

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