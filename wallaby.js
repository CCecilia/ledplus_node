
module.exports = function () {
  return {
    files: [
      'controllers/*.js'
    ],

    tests: [
      'test/test-server.js'
    ],

    setup: function () {
      global.expect = require('chai').expect;
    },

    env: {
      type: 'node',
      runner: 'node'
    }
  };
};