const WebSocket = require('ws');
const schema = require('enigma.js/schemas/3.2.json');

const config = {
  schema,
  url: process.env.URL || 'ws://localhost:9076/app/',
  createSocket(url) {
    return new WebSocket(url);
  },
};

module.exports = config;
