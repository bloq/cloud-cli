'use strict'

const URL = require('url').URL
const consola = require('consola')
const fetch = require('node-fetch').default

const { formatErrorResponse, formatResponse } = require('../utils')
const { Command, flags } = require('@oclif/command')
const config = require('../config')
require('console.table')

const env = config.get('env') || 'prod'
const services = config.get('services')

const accountsUrl = new URL(
  services[env].accounts.statusEndpoint,
  services[env].accounts.url
)

const nodesUrl = new URL(
  services[env].nodes.statusEndpoint,
  services[env].nodes.url
)

const servicePromise = (url, name) =>
  fetch(url)
    .then(res => {
      const response = {
        service: name,
        status: res.status === 200 ? 'OK' : 'DOWN',
        url
      }
      return response
    })
    .catch(function (err) {
      const response = {
        service: name,
        status:
          err.code === 'ECONNREFUSED' ||
          err.code === 'ESOCKETTIMEDOUT' ||
          err.code === 'ENOTFOUND'
            ? 'DOWN'
            : 'UNKNOWN',
        url
      }
      return response
    })

const timePromise = (url, name) =>
  new Promise(resolve => {
    setTimeout(resolve, 5000, {
      service: name,
      status: 'TIMEOUT',
      url
    })
  })

class StatusCommand extends Command {
  async run() {
    const { flags } = this.parse(StatusCommand)
    const isJson = typeof flags.json !== 'undefined'

    !isJson && consola.info(`Retrieving Bloq status: ${env}`)

    Promise.all([
      Promise.race([
        timePromise(accountsUrl, 'Accounts'),
        servicePromise(accountsUrl, 'Accounts')
      ]),
      Promise.race([
        timePromise(nodesUrl, 'Nodes'),
        servicePromise(nodesUrl, 'Nodes')
      ])
    ])
      .then(res => {
        if (isJson) {
          formatResponse(isJson, res)
          return
        }
        // eslint-disable-next-line no-console
        console.table(res)
      })
      .catch(function (err) {
        formatErrorResponse(isJson, err)
      })
  }
}

StatusCommand.description = 'Get Bloq services status'
StatusCommand.flags = {
  json: flags.boolean({ char: 'j', description: 'JSON output' })
}

module.exports = StatusCommand
