'use strict'

const URL = require('url').URL
const ora = require('ora')
const consola = require('consola')
const request = require('request')
const { promisify } = require('util')
const { Command } = require('@oclif/command')
const config = require('../config')

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
    consola.info('Retrieving BloqCloud status')

    const spinner = ora().start()
    Promise.all([
      getStatus(new URL(services.accounts.statusEndpoint, services.accounts.url)),
      getStatus(new URL(services.nodes.statusEndpoint, services.nodes.url)),
      getStatus(new URL(services.insight.btc.statusEndpoint, services.insight.btc.url)),
      getStatus(new URL(services.insight.bch.statusEndpoint, services.insight.bch.url))
    ])
      .then(function (statuses) {
        const [
          isAccountsOk,
          isNodesOk,
          isInsightBTCOk,
          isInsightBCHOk
        ] = statuses

        spinner.stop()
        consola.info(
          `BloqCloud Status:
          * Accounts:     ${isAccountsOk ? '✔' : '❌'}
          * Nodes:       ${isNodesOk ? '✔' : '❌'}
          * Insight BTC: ${isInsightBTCOk ? '✔' : '❌'}
          * Insight BCH: ${isInsightBCHOk ? '✔' : '❌'}
          `
        )
      })
      .catch(function (err) {
        consola.error(err)
      })
  }
}

StatusCommand.description = 'Get BloqCloud services status'

module.exports = StatusCommand
