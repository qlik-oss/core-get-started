/* eslint no-console:0 */
const WebSocket = require('ws');
const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/3.2.json');

(async () => {
  try {
    console.log('Creating session app on engine.');
    const session = enigma.create({
      schema,
      url: 'ws://localhost:19076/app/testscript',
      createSocket: url => new WebSocket(url),
    });
    const qix = await session.open();
    const app = await qix.openDoc('testscript.qvf');
    const object = await app.getObject('hello-corectl');
    const layout = await object.getLayout();
    console.log(layout);

    const movies = layout.qHyperCube.qDataPages[0].qMatrix;


    console.log(`Listing the ${20} first movies:`);
    movies.forEach((movie) => { console.log(movie[0].qText); });

    await session.close();
    console.log('Session closed.');
  } catch (err) {
    console.log('Whoops! An error occurred.', err);
    process.exit(1);
  }
})();
