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

                user: 'user',

                password: 'pass',

                database: 'database',

                connectString:
                    `(DESCRIPTION=
                        (ADDRESS=
                            (PROTOCOL=TCP)
                            (Host=10.99.99.99)
                            (Port=9999)
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
