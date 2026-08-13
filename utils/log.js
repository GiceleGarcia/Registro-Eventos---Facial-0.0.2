const fs = require('fs');

function log(texto) {

    const linha =
        `[${new Date().toISOString()}] ${texto}\n`;

    fs.appendFileSync(
        './logs/sincronizacao.log',
        linha
    );
}

module.exports = log;