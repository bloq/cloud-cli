'use strict'

const { version } = require('../package.json')

module.exports = {
  port: '3000',
  version,
  ccUrlBase: 'http://localhost',

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
      },
      connect: {
        btc: {
          url: 'https://btc.connect.bloq.cloud',
          statusEndpoint: '/status'
        },
        bch: {
          url: 'https://bch.connect.bloq.cloud',
          statusEndpoint: '/status'
        }
      }
    },

    stage: {
      accounts: {
        url: 'https://accounts.bloqclouddev.com',
        statusEndpoint: '/'
      },
      nodes: {
        url: 'https://nodes.bloqclouddev.com',
        statusEndpoint: '/'
      },
      connect: {
        btc: {
          url: 'https://btc.connect.bloqclouddev.com',
          statusEndpoint: '/status'
        },
        bch: {
          url: 'https://bch.connect.bloqclouddev.com',
          statusEndpoint: '/status'
        }
      }
    }
  }
}
