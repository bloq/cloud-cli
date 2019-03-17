'use strict'

const consola = require('consola')
const { Command, flags } = require('@oclif/command')
const userKeys = require('../user-keys')
const config = require('../config')

class UserKeysCommand extends Command {
  async run () {
    const user = config.get('user')
    const accessToken = config.get('accessToken')
    const { args, flags } = this.parse(UserKeysCommand)

    if (!user || !accessToken) {
      return consola.error('User is not authenticated. Use login command to start a new session.')
    }

    switch (args.operation) {
      case 'create':
        return userKeys.create(user, accessToken)
      case 'remove':
        return userKeys.remove(user, accessToken)
      case 'info':
        return userKeys.info(user, accessToken, flags)
      default:
        return userKeys.list(user, accessToken, flags)
    }
  }
}

UserKeysCommand.description = 'Manage your BloqCloud user key(s)'

UserKeysCommand.flags = {
  type: flags.string({ char: 't', description: 'key type', options: ['bit', 'pgp'] }),
  keyId: flags.string({ char: 'i', description: 'key id' })
}

UserKeysCommand.args = [
  {
    name: 'operation',
    required: true,
    description: 'Specify the type of user-keys operation to run',
    default: 'list',
    options: ['create', 'list', 'remove', 'info']
  }
]

module.exports = UserKeysCommand
