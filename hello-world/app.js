/* eslint no-console:0 */
const enigmaConfig = require('./enigma-config');
const enigma = require('enigma.js');

console.log('Connecting to QIX Engine');

enigma.getService('qix', enigmaConfig).then((qix) => {
  console.log('Connection established');
  return qix.global.engineVersion();
})
.then((version) => {
  console.log(`Hello, I am QIX Engine! I am running version: ${version.qComponentVersion}`);
  process.exit(0);
})
.catch((err) => {
  console.log(`Error when connecting to QIX Engine: ${err.message}`);
  process.exit(1);
});
