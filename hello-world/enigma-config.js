const WebSocket = require('ws');
const schema = require('enigma.js/schemas/3.2.json');

const config = {
  schema,
  port: 'ws://localhost:9076',
  createSocket(url) {
    return new WebSocket(url);
  },
};

module.exports = config;
