const fs =
    require('fs');

const path =
    require('path');

const caminho =
    path.join(
        __dirname,
        '..',
        'data',
        'ultimoEvento.json'
    );

function lerUltimoSerial(ip) {

    const conteudo =
        fs.readFileSync(
            caminho,
            'utf8'
        );

    const json =
        JSON.parse(conteudo);

    if (Array.isArray(json)) {

        const terminal =
            json.find(item => item.ip === ip);

        return terminal ? terminal.ultimoSerial : 0;
    }

    return json.ultimoSerial || 0;
}

function salvarUltimoSerial(
    ip,
    serial
) {

    const conteudo =
        fs.readFileSync(
            caminho,
            'utf8'
        );

    const dados =
        JSON.parse(conteudo);

    if (Array.isArray(dados)) {

        const terminal =
            dados.find(item => item.ip === ip);

        if (!terminal) {
            throw new Error(`TERMINAL NAO ENCONTRADO ${ip}`);
        }

        terminal.ultimoSerial = serial;

        fs.writeFileSync(
            caminho,
            JSON.stringify(dados, null, 4)
        );

        return;
    }

    const json = {

        ultimoSerial:
            serial === undefined ? ip : serial
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

    lerUltimoSerial,
    salvarUltimoSerial
};
