const client = require('../../utils/clientDigest');
//const { IP } = require('../../config/hikvision');

async function enviarCracha(
    terminal,
    colaborador,
    numFis
) {

    const response =
        await client.fetch(

            `http://${terminal.IP}/ISAPI/AccessControl/CardInfo/Record?format=json`,

            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body: JSON.stringify({

                    CardInfo: {

                        employeeNo:
                            colaborador.employeeNo,

                        cardNo:
                            numFis.toString(),

                        cardType:
                            "normalCard"
                    }
                })
            }
        );

    return await response.json();
}

module.exports = enviarCracha;