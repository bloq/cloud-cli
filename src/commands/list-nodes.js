'use strict'

const Conf = require('conf')
const config = new Conf()

const consola = require('consola')
const request = require('request')
const { Command } = require('@oclif/command')
const inquirer = require('inquirer')

const { nodesUrl } = require('../config')

class ListNodesCommand extends Command {
  async run () {
    const user = config.get('user')
    const clientAccessToken = config.get('clientAccessToken')

    if (!user || !clientAccessToken) {
      return consola.error('User is not authenticated, use login command to start a new session.')
    }

    consola.info(`List blockchain nodes`)
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
      consola.info(data.body)
    })
  }
}

ListNodesCommand.description = 'list blockchain nodes'

module.exports = ListNodesCommand
