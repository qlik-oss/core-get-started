/* eslint no-console:0 */
const WebSocket = require('ws');
const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/3.2.json');
const Halyard = require('halyard.js');
const mixins = require('halyard.js/dist/halyard-enigma-mixin');

(async () => {
  try {
    const moviesPath = '/data/movies.csv';
    const moviesTable = new Halyard.Table(moviesPath, {
      name: 'Movies',
      fields: [
        { src: 'Movie', name: 'Movie' },
        { src: 'Year', name: 'Year' },
        { src: 'Adjusted Costs', name: 'Adjusted Costs' },
        { src: 'Description', name: 'Description' },
        { src: 'Image', name: 'Image' }
      ],
      delimiter: ',',
    });

    console.log(`Creating local data from ${moviesPath}`);
    const halyard = new Halyard();
    halyard.addTable(moviesTable);

    const enigmaConfig = {
      schema,
      mixins,
      url: 'ws://localhost:9076/app/',
      createSocket(url) {
        return new WebSocket(url);
      }
    };

    console.log('Connecting to QIX Engine');
    const session = await enigma.create(enigmaConfig);
    const qix = await session.open();  
    const app = await qix.createSessionAppUsingHalyard(halyard);
    console.log('Session app created');

    const moviesCount = 10;
    const properties = {
      qInfo: { qType: 'hello-data' },
      qHyperCubeDef: {
        qDimensions: [ { qDef: { qFieldDefs: ['Movie'] } }],
        qInitialDataFetch: [{ qHeight: moviesCount, qWidth: 1 }],
      },
    };

    const object = await app.createSessionObject(properties);
    const layout = await object.getLayout();
    const movies = layout.qHyperCube.qDataPages[0].qMatrix;
    console.log('Session object created');
    
    console.log(`Listing the ${moviesCount} first movies:`)
    movies.forEach((movie) => { console.log(movie[0].qText) });

    process.exit(0);
  } catch (err) {
    console.log(`Error when connecting to QIX Engine: ${err.message}`);
    process.exit(1);
  }
})();
