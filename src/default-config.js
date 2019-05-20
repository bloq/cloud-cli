'use strict'

const { version } = require('../package.json')

module.exports = {
  port: '3000',
  version,
  passwordEntropy: 95,

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
      insight: {
        btc: {
          url: 'https://btc.insight.bloq.cloud',
          statusEndpoint: '/status'
        },
        bch: {
          url: 'https://bch.insight.bloq.cloud',
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
      insight: {
        btc: {
          url: 'https://btc.insight.bloqclouddev.com',
          statusEndpoint: '/status'
        },
        bch: {
          url: 'https://bch.insight.bloqclouddev.com',
          statusEndpoint: '/status'
        }
      }
    }
  }
}
