const client = require('../../utils/clientDigest');
//const { IP } = require('../../config/hikvision');

async function buscarUsuario(
    terminal,
    employeeNo
) {

    const body = {

        UserInfoSearchCond: {

            searchID: "1",

            searchResultPosition: 0,

            maxResults: 1,

            EmployeeNoList: [
                {
                    employeeNo:
                        employeeNo.toString()
                }
            ]
        }
    };

    const response =
        await client.fetch(

            `http://${terminal.IP}/ISAPI/AccessControl/UserInfo/Search?format=json`,

            {
                method: 'POST',

                body: JSON.stringify(body),

                headers: {
                    'Content-Type':
                        'application/json'
                }
            }
        );
        
    const text =
        await response.text();

    try {

        return JSON.parse(text);

    } catch {

        console.log(
            '\nRESPOSTA NÃO JSON:\n'
        );

        console.log(text);

        return {};
    }
}

module.exports = buscarUsuario;