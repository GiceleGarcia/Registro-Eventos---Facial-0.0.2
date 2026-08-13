function esperar(
    tempo
) {

    return new Promise(

        resolve =>

            setTimeout(
                resolve,
                tempo
            )

    );
}

module.exports =
    esperar;