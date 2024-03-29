'use strict'

const { version } = require('../package.json')

module.exports = {
  port: '3000',
  version,
  passwordEntropy: '95',

  env: 'prod',

  services: {
    prod: {
      accounts: {
        url: 'https://accounts.bloq.cloud',
        statusEndpoint: '/'
      },
      nodes: {
        url: 'https://nodes.bloq.cloud',
        statusEndpoint: '/'
      }
    },

    staging: {
      accounts: {
        url: 'https://accounts.bloqclouddev.com',
        statusEndpoint: '/'
      },
      nodes: {
        url: 'https://nodes.bloqclouddev.com',
        statusEndpoint: '/'
      }
    },

    local: {
      accounts: {
        url: 'http://localhost:4000',
        statusEndpoint: '/'
      },
      nodes: {
        url: 'http://localhost:4002',
        statusEndpoint: '/'
      }
    }
  }
}
