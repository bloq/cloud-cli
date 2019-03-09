'use strict'

module.exports = {
  port: 3000,
  ccUrlBase: 'http://localhost',

  services: {
    accounts: {
      url: 'https://accounts.bloq.cloud',
      statusEndpoint: '/'
    },
    nodes: {
      url: 'http://localhost:4002',
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
