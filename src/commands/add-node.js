'use strict'

const Conf = require('conf')
const config = new Conf()

const consola = require('consola')
const request = require('request')
const { Command, flags } = require('@oclif/command')

const { nodesUrl } = require('../config')

class AddNodeCommand extends Command {
  async run () {
    const { flags } = this.parse(AddNodeCommand)
    const chain = flags.chain

    if (!chain) {
      return consola.error('Missing chain type (-c or --chain)')
    }

    const user = config.get('user')
    const clientAccessToken = config.get('clientAccessToken')

    if (!user || !clientAccessToken) {
      return consola.error('User is not authenticated, use login command to start a new session.')
    }

    consola.info('Add blockchain node')
    consola.warn('This command will add new a blockchain node.')

    const Authorization = `Bearer ${clientAccessToken}`

    const url = `${nodesUrl}/nodes/`
    const reqBody = {
      image: chain
    }
    request.post(url, {
      headers: { Authorization },
      json: reqBody
    }, function (err, data) {
      if (err) {
        return consola.error(`Error trying to create node: ${err}.`)
      }
      consola.log(data.body)
    })
  }
}

AddNodeCommand.description = 'add blockchain node'

AddNodeCommand.flags = {
  chain: flags.string({ char: 'c', description: 'chain type (btc, bch, etc.)' })
}

module.exports = AddNodeCommand
