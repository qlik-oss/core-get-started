/* eslint no-console:0 */
const WebSocket = require('ws');
const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/3.2.json');
const Halyard = require('halyard.js');
const mixins = require('halyard.js/dist/halyard-enigma-mixin');

(async () => {
  try {
    console.log('Creating table data representation.');
    const halyard = new Halyard();
    const dataPath = '/data/schrimp.csv';
    const shrimpTable = new Halyard.Table(dataPath, {
      name: 'Shrimps',
      fields: [
        { src: 'date', name: 'Date' },
        { src: 'kilo', name: 'Kilos' },
        { src: 'boxes', name: 'Boxes' },
        { src: 'auctionprice', name: 'Auctionprice' },
        { src: 'customerprice', name: 'Customerprice' },
      ],
      delimiter: ',',
    });

    halyard.addTable(shrimpTable);

    console.log('Creating and opening session using mixin.');
    const session = enigma.create({
      schema,
      mixins,
      url: 'ws://localhost:19076/app/',
      createSocket: url => new WebSocket(url),
    });
    const qix = await session.open();
    const app = await qix.createSessionAppUsingHalyard(halyard);

    console.log('Creating session object with shrimp data.');
    const dataCount = 10;
    const properties = {
      qInfo: { qType: 'hello-data' },
      qHyperCubeDef: {
        qDimensions: [{ qDef: { qFieldDefs: ['Customerprice'] } }],
        qInitialDataFetch: [{ qHeight: dataCount, qWidth: 1 }],
      },
    };
    const object = await app.createSessionObject(properties);
    const layout = await object.getLayout();
    const movies = layout.qHyperCube.qDataPages[0].qMatrix;

    console.log(`Listing the ${dataCount} first shrimp prices:`);
    movies.forEach((movie) => { console.log(movie[0].qText); });

    await session.close();
    console.log('Session closed.');
  } catch (err) {
    console.log('Woops! An error occurred.', err);
    process.exit(1);
  }
})();
