import * as qixSchema from 'enigma.js/schemas/qix/3.2/schema.json';

export let enigmaConfig = {
    session: {
        port: '9076',
        secure: false,
    },
    schema: qixSchema,
};
