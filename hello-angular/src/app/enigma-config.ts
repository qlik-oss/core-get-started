import qixSchema from 'enigma.js/schemas/qix/3.2/schema.json';

console.log('Schema: ', qixSchema);

export let enigmaConfig = {
    session: {
        port: '9076',
        secure: false,
    },
    schema: qixSchema,
};
