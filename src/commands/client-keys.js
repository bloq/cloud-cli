'use strict'

const consola = require('consola')
const { Command, flags } = require('@oclif/command')
const clientKeys = require('../client-keys')
const config = require('../config')

class ClientKeysCommand extends Command {
  async run () {
    const user = config.get('user')
    const accessToken = config.get('accessToken')

    if (!user || !accessToken) {
      return consola.error('User is not authenticated. Use login command to start a new session.')
    }

    const { args, flags } = this.parse(ClientKeysCommand)
    switch (args.operation) {
      case 'create':
        return clientKeys.create(user, accessToken)
      case 'remove':
        return clientKeys.remove(user, accessToken, flags)
      default:
        return clientKeys.list(user, accessToken)
    }
  }
}

ClientKeysCommand.description = 'Manage your Bloq client key(s)'

ClientKeysCommand.flags = {
  clientId: flags.string({ char: 'i', description: 'client id' })
}

ClientKeysCommand.args = [
  {
    name: 'operation',
    required: true,
    description: 'Specify the type of client-keys operation to run',
    default: 'list',
    options: ['create', 'list', 'remove']
  }
]

module.exports = ClientKeysCommand
