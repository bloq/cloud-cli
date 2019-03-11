'use strict'

const { version } = require('../package.json')

module.exports = {
  port: 3000,
  version,
  ccUrlBase: 'http://localhost',

  services: {
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
  }
}