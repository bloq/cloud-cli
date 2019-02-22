'use strict'

const Conf = require('conf')
const config = new Conf()

const consola = require('consola')
const request = require('request')
const { Command, flags } = require('@oclif/command')
const inquirer = require('inquirer')

const { nodesUrl } = require('../config')

class ListNodesCommand extends Command {
  async run () {
    const { flags } = this.parse(ListNodesCommand)
    const verbose = flags.verbose

    const user = config.get('user')
    const clientAccessToken = config.get('clientAccessToken')

    if (!user || !clientAccessToken) {
      return consola.error('User is not authenticated, use login command to start a new session.')
    }

    consola.info('List blockchain nodes')
    consola.warn('This command will list blockchain nodes.')

    const Authorization = `Bearer ${clientAccessToken}`

    const url = `${nodesUrl}/nodes`
    request.get(url, {
      headers: { Authorization }
    }, function (err, data) {
      if (err) {
        return consola.error(`Error trying to list blockchain: ${err}.`)
      }

      const body = JSON.parse(data.body)
      body.forEach(function (value) {
        if (verbose) {
          consola.info(value)
        } else {
          if (value.state != 'stopped') {
            consola.info(value.image, value.id, value.startedAt, value.vendor.PublicDnsName)
          }
        }
      })
    })
  }
}

ListNodesCommand.description = 'list blockchain nodes'

ListNodesCommand.flags = {
  verbose: flags.boolean({ char: 'v', description: 'print all nodes (even stopped)' })
}

module.exports = ListNodesCommand
