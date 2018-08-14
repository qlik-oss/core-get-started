/* eslint no-console:0 */
const WebSocket = require('ws');
const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/3.2.json');

(async () => {
  try {
    console.log('Creating and opening session.');
    const session = enigma.create({
      schema,
      url: 'ws://localhost:19076/app',
      createSocket: url => new WebSocket(url),
    });
    const global = await session.open();

    const version = await global.engineVersion();
    console.log(`Engine version retrieved: ${version.qComponentVersion}`);

    await session.close();
    console.log('Session closed.');
  } catch (err) {
    console.log('Whoops! An error occurred.', err);
    process.exit(1);
  }
})();
