/* eslint no-console:0 */
const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/3.2.json');
const WebSocket = require('ws');

(async () => {
  try {
    console.log('Connecting to QIX Engine');
    const session = enigma.create({
      schema,
      url: 'ws://localhost:9076/app',
      createSocket: url => new WebSocket(url),
    });

    const global = await session.open();
    console.log('Connection established to the engine');
    const version = await global.engineVersion();
    console.log(`Engine returned that it's running version: ${version.qComponentVersion}`);
    process.exit(0);
  } catch (error) {
    console.log(`Error when connecting to QIX Engine: ${error.message}`);
    process.exit(1);
  }
})();
