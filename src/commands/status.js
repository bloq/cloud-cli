'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const { promisify } = require('util')
const { Command } = require('@oclif/command')

const { accountsUrl, nodesUrl } = require('../config')

class StatusCommand extends Command {
  async run () {
    consola.info('Getting bloq cloud status')
    const spinner = ora().start()
    const get = promisify(request.get)

    Promise.all([
      get(accountsUrl),
      get(nodesUrl)
    ])
      .then(function ([accounts, nodes]) {
        spinner.stop()
        consola.info(`Bloq Cloud Status
        * cloud-acounts:\t${accounts.statusCode === 200 ? '👍' : '❌'}
        * cloud-nodes: \t\t${nodes.statusCode === 200 ? '👍' : '❌'}
        `)
      })
      .catch(function (err) {
        consola.error(err)
      })
  }
}

StatusCommand.description = 'Get bloq cloud services status'

module.exports = StatusCommand
