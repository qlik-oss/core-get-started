/* eslint no-console:0 */
const WebSocket = require('ws');
const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/3.2.json');

(async () => {
  try {
    // Create and open an engine session using enigma.js.
    const session = enigma.create({
      schema,
      url: 'ws://localhost:9076/app',
      createSocket: url => new WebSocket(url),
    });
    const global = await session.open();

    // Get engine version from the "global" API and log it, then close the session.
    const version = await global.engineVersion();
    console.log(`Engine version is: ${version.qComponentVersion}`);
    await session.close();
  } catch (err) {
    console.log('Woops! An error occurred.', err);
    process.exit(1);
  }
})();
