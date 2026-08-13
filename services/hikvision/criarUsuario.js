const client = require('../../utils/clientDigest');
//const { IP } = require('../../config/hikvision');

async function criarUsuario(
    terminal,
    colaborador
) {

    const body = {

        UserInfo: {

            employeeNo:
                colaborador.employeeNo,

            name:
                colaborador.name,

            userType: "normal",

            Valid: {

                enable: true,

                beginTime:
                    "2024-01-01T00:00:00",

                endTime:
                    "2035-12-31T23:59:59",

                timeType: "local"
            },

            doorRight: "1",

            RightPlan: [
                {
                    doorNo: 1,
                    planTemplateNo: "1"
                }
            ]
        }
    };

    const response =
        await client.fetch(

            `http://${terminal.IP}/ISAPI/AccessControl/UserInfo/Record?format=json`,

            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body: JSON.stringify(body)
            }
        );

    return await response.json();
}

module.exports = criarUsuario;