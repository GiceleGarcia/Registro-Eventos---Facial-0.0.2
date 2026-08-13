const client = require('../../utils/clientDigest');
//const { IP } = require('../../config/hikvision');

async function enviarFace(
    terminal,
    colaborador,
    fotoBuffer
) {

    const boundary =
        '------------------------hikvision';

    const jsonData =
        JSON.stringify({

            faceLibType: "blackFD",

            FDID: "1",

            FPID:
                colaborador.employeeNo
        });

    const body =

        `--${boundary}\r\n` +

        `Content-Disposition: form-data; name="FaceDataRecord"\r\n` +

        `Content-Type: application/json\r\n\r\n` +

        `${jsonData}\r\n` +

        `--${boundary}\r\n` +

        `Content-Disposition: form-data; name="img"; filename="foto.jpg"\r\n` +

        `Content-Type: image/jpeg\r\n\r\n`;

    const end =
        `\r\n--${boundary}--\r\n`;

    const payload =
        Buffer.concat([

            Buffer.from(body, 'utf8'),

            fotoBuffer,

            Buffer.from(end, 'utf8')
        ]);

    const response =
        await client.fetch(

            `http://${terminal.IP}/ISAPI/Intelligent/FDLib/FaceDataRecord?format=json`,

            {
                method: 'POST',
                

                headers: {

                    'Content-Type':
                        `multipart/form-data; boundary=${boundary}`,

                    'Content-Length':
                        payload.length
                },

                body: payload
            }
        );

   // return await response.text();
   const texto =
    await response.text();

console.log(
    'STATUS:',
    response.status
);

console.log(
    'RESPOSTA:',
    texto
);

return texto;
}

module.exports =  enviarFace;