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

function getStatus(url) {
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
  async run() {
    consola.info(`Retrieving Bloq status: ${env}`)

    const spinner = ora().start()
    Promise.all([
      getStatus(
        new URL(
          services[env].accounts.statusEndpoint,
          services[env].accounts.url
        )
      ),
      getStatus(
        new URL(services[env].nodes.statusEndpoint, services[env].nodes.url)
      ),
      getStatus(
        new URL(
          services[env].connect.btc.statusEndpoint,
          services[env].connect.btc.url
        )
      ),
      getStatus(
        new URL(
          services[env].connect.bch.statusEndpoint,
          services[env].connect.bch.url
        )
      )
    ])
      .then(function ([
        isAccountsUp,
        isNodesUp,
        isConnectBtcUp,
        isConnectBchUp
      ]) {
        const status = [
          {
            service: 'Accounts',
            status: isAccountsUp ? 'OK' : 'DOWN',
            url: services[env].accounts.url
          },

          {
            service: 'Nodes',
            status: isNodesUp ? 'OK' : 'DOWN',
            url: services[env].nodes.url
          },

          {
            service: 'Connect BTC',
            status: isConnectBtcUp ? 'OK' : 'DOWN',
            url: services[env].connect.btc.url
          },

          {
            service: 'Connect BCH',
            status: isConnectBchUp ? 'OK' : 'DOWN',
            url: services[env].connect.bch.url
          }
        ]

        spinner.stop()

        consola.info(`Bloq status: ${env}\n`)
        console.table(status)
      })
      .catch(function (err) {
        consola.error(err)
      })
  }
}

StatusCommand.description = 'Get Bloq services status'

module.exports = StatusCommand
