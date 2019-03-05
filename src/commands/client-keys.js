'use strict'

const Conf = require('conf')
const config = new Conf()

const clientKeys = require('../client-keys')

const consola = require('consola')
const { Command } = require('@oclif/command')

class ClientKeysCommand extends Command {
  async run () {
    const user = config.get('user')
    const accessToken = config.get('accessToken')

    if (!user || !accessToken) {
      return consola.error('User is not authenticated. Use login command to start a new session.')
    }

    const { args } = this.parse(ClientKeysCommand)
    switch (args.operation) {
      case 'create':
        return clientKeys.create(user, accessToken)
      case 'remove':
        return clientKeys.remove(user, accessToken)
      default:
        return clientKeys.list(user, accessToken)
    }
  }
}

ClientKeysCommand.description = 'Manage your BloqCloud client key(s)'

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
