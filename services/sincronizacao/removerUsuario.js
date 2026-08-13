const client =
    require('../../utils/clientDigest');

async function removerUsuario(
    terminal,
    employeeNo
) {

    const response =
        await client.fetch(

            `http://${terminal.IP}/ISAPI/AccessControl/UserInfoDetail/Delete?format=json`,

            {
                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    UserInfoDetail: {

                        mode: 'byEmployeeNo',

                        EmployeeNoList: [
                            {
                                employeeNo: employeeNo.toString()
                            }
                        ]
                    }
                })
            }
        );

    const texto =
        await response.text();

    let resultado;

    try {

        resultado = JSON.parse(texto);

    } catch {

        throw new Error(
            `RESPOSTA INVALIDA AO REMOVER USUARIO: ${texto}`
        );
    }

    if (
        response.status !== 200 ||
        resultado.statusCode !== 1
    ) {

        throw new Error(
            `FALHA AO REMOVER USUARIO: ${texto}`
        );
    }
}

module.exports =
    removerUsuario;
