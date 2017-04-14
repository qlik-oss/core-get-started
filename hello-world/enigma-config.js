const WebSocket = require('ws');
const schema = require('enigma.js/schemas/qix/3.1/schema');

const config = {
  schema,
  session: {
    port: '9076',
    unsecure: true,
  },
  createSocket(url) {
    return new WebSocket(url);
  },
};

module.exports = config;
