const WebSocket = require('ws');
const schema = require('enigma.js/schemas/qix/3.2/schema');

const config = {
  schema,
  session: {
    port: '9076',
    secure: false,
  },
  createSocket(url) {
    return new WebSocket(url);
  },
};

module.exports = config;
