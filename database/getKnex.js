const knex = require('knex');

const cashKnex = new Map();

module.exports = getKnex = () => {

    const savedKnex =
        cashKnex.get('connected');

    if (savedKnex) {

        return savedKnex;

    } else {

        const newConnection = knex({

            client: 'oracledb',

            connection: {

                user: 'vetorh',

                password: 'vetorh',

                database: 'vetorh',

                connectString:
                    `(DESCRIPTION=
                        (ADDRESS=
                            (PROTOCOL=TCP)
                            (Host=10.99.1.19)
                            (Port=1539)
                        )
                        (CONNECT_DATA=
                            (SID=ORCL)
                        )
                    )`,
            },
        });

        cashKnex.set(
            'connected',
            newConnection
        );

        return newConnection;
    }
};