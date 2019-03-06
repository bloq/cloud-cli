'use strict'

const Conf = require('conf')
const config = new Conf()

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const { promisify } = require('util')
const { Command } = require('@oclif/command')

const { nodesUrl } = require('../config')

class StatusCommand extends Command {
  async run () {
    consola.info('Retrieving BloqCloud status')
    const spinner = ora().start()
    const get = promisify(request.get)

    Promise.all([
      get(config.get('accountsUrl')),
      get(nodesUrl)
    ])
      .then(function ([accounts, nodes]) {
        spinner.stop()
        consola.info(`BloqCloud Status
        * cloud-acounts:\t${accounts.statusCode === 200 ? '👍' : '❌'}
        * cloud-nodes: \t\t${nodes.statusCode === 200 ? '👍' : '❌'}
        `)
      })
      .catch(function (err) {
        consola.error(err)
      })
  }
}

StatusCommand.description = 'Get BloqCloud services status'

module.exports = StatusCommand
