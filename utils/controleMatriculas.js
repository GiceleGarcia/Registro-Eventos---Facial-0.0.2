const fs =
    require('fs');

const path =
    require('path');

const caminho =
    path.join(

        __dirname,

        '..',

        'data',

        'matriculasSincronizadas.json'

    );

function lerMatriculas() {

    if (

        !fs.existsSync(caminho)

    ) {

        return {

            codbnf: null,

            datini: null,

            terminais: {}

        };

    }

    const conteudo =

        fs.readFileSync(

            caminho,

            'utf8'

        );

    const controle =

        JSON.parse(

            conteudo

        );

    if (

        !controle.terminais

    ) {

        controle.terminais = {};

    }

    for (const numeroSerie of Object.keys(controle.terminais)) {

        controle.terminais[numeroSerie] =
            controle.terminais[numeroSerie].map(item => {

                if (typeof item === 'string') {

                    return {

                        matricula: item,

                        beneficios: []
                    };
                }

                if (item.employeeNo && !item.matricula) {

                    return {

                        matricula: item.employeeNo,

                        beneficios: item.beneficios || []
                    };
                }

                return item;
            });
    }

    return controle;

}

function lerMatriculasTerminal(
    numeroSerie
) {

    const controle =
        lerMatriculas();

    if (

        !controle.terminais[numeroSerie]

    ) {

        controle.terminais[numeroSerie] = [];

    }

    return controle.terminais[numeroSerie];

}

function salvarMatriculas(

    codbnf,

    datini,

    terminais

) {

    const json = {

        codbnf,

        datini,

        terminais

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

function salvarMatriculasTerminal(

    numeroSerie,

    codbnf,

    datini,

    matriculas

) {

    const controle =
        lerMatriculas();

    controle.codbnf =
        codbnf;

    controle.datini =
        datini;

    controle.terminais[numeroSerie] =
        matriculas;

    salvarMatriculas(

        controle.codbnf,

        controle.datini,

        controle.terminais

    );

}

function limparMatriculas() {

    salvarMatriculas(

        null,

        null,

        {}

    );

}

module.exports = {

    lerMatriculas,

    lerMatriculasTerminal,

    salvarMatriculas,

    salvarMatriculasTerminal,

    limparMatriculas

};
