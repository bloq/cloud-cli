/* eslint-disable no-shadow */
'use strict'

const consola = require('consola')
const { Command, flags } = require('@oclif/command')
const clientKeys = require('../client-keys')
const config = require('../config')

class ClientKeysCommand extends Command {
  async run() {
    const user = config.get('user')
    const accessToken = config.get('accessToken')

    if (!user || !accessToken) {
      consola.error(
        'User is not authenticated. Use login command to start a new session.'
      )
      return
    }

    const { args, flags } = this.parse(ClientKeysCommand)
    switch (args.operation) {
      case 'create':
        return clientKeys.create({ user, accessToken, ...flags })
      case 'remove':
        return clientKeys.remove({ user, accessToken, ...flags })
      default:
        return clientKeys.list({ user, accessToken, ...flags })
    }
  }
}

ClientKeysCommand.description = 'Manage your Bloq client key(s)'

ClientKeysCommand.flags = {
  keyId: flags.string({
    char: 'i',
    description: 'client key id, used with `remove` operation.'
  }),
  json: flags.boolean({ char: 'j', description: 'JSON output' }),
  yes: flags.boolean({
    char: 'y',
    description: 'answer "yes" to prompts',
    default: false
  })
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
