'use strict'

const URL = require('url').URL
const ora = require('ora')
const consola = require('consola')
const request = require('request')
const { promisify } = require('util')
const { Command } = require('@oclif/command')
const config = require('../config')
require('console.table')

const env = config.get('env') || 'prod'
const services = config.get('services')
const get = promisify(request.get)

function getStatus (url) {
  return get({ url, timeout: 5000 })
    .then(res => res.statusCode === 200)
    .catch(function (err) {
      if (err.code === 'ECONNREFUSED' || err.code === 'ESOCKETTIMEDOUT') {
        return false
      }
      return Promise.reject(err)
    })
}

class StatusCommand extends Command {
  async run () {
    consola.info(`Retrieving BloqCloud status: ${env}`)

    const spinner = ora().start()
    Promise.all([
      getStatus(new URL(services[env].accounts.statusEndpoint, services[env].accounts.url)),
      getStatus(new URL(services[env].nodes.statusEndpoint, services[env].nodes.url)),
      getStatus(new URL(services[env].insight.btc.statusEndpoint, services[env].insight.btc.url)),
      getStatus(new URL(services[env].insight.bch.statusEndpoint, services[env].insight.bch.url))
    ])
      .then(function ([ isAccountsUp, isNodesUp, isInsightBtcUp, isInsightBchUp ]) {
        const status = [
          {
            service: 'Accounts',
            isUp: isAccountsUp ? '✔' : '❌',
            url: services[env].accounts.url
          },

          {
            service: 'Nodes',
            isUp: isNodesUp ? '✔' : '❌',
            url: services[env].nodes.url
          },

          {
            service: 'Insight BTC',
            isUp: isInsightBtcUp ? '✔' : '❌',
            url: services[env].insight.btc.url
          },

          {
            service: 'Insight BCH',
            isUp: isInsightBchUp ? '✔' : '❌',
            url: services[env].insight.btc.url
          },
        ]

        spinner.stop()

        consola.info(`BloqCloud status: ${env}\n`)
        console.table(status)
      })
      .catch(function (err) {
        consola.error(err)
      })
  }
}

StatusCommand.description = 'Get BloqCloud services status'

module.exports = StatusCommand
