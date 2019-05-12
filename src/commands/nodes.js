'use strict'

const consola = require('consola')
const request = require('request')
const { Command, flags } = require('@oclif/command')

const config = require('../config')
const nodes = require('../nodes')
const { isChainValid, CHAIN_OPTIONS } = require('../validator')

/**
 *  Gets a user client token
 *
 * @param {function} cb callback to execute when token retrieved
 * @returns {true} cb the given callback
 */
function getClientToken (cb) {
  const clientId = config.get('clientId')
  const clientSecret = config.get('clientSecret')

  if (!clientId || !clientSecret) {
    return consola.error('You must provide a valid client-keys pair in order to manage nodes.')
  }

  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.accounts.url`)}/auth/token`
  const json = { grantType: 'clientCredentials', clientId, clientSecret }

  request.post(url, { json }, function (err, data) {
    if (err) {
      return cb(new Error(`Error retrieving client token: ${err}`))
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your client keys are invalid or have been revoked')
    }

    if (data.statusCode !== 200) {
      return cb(new Error(`Error generating client token: ${data.body.code}`))
    }

    return cb(null, data.body)
  })
}

class NodesCommand extends Command {
  async run () {
    const { args, flags } = this.parse(NodesCommand)

    getClientToken(function (err, data) {
      if (err) {
        return consola.error(err.message)
      }

      const { accessToken } = data
      const user = config.get('clientId')

      switch (args.operation) {
        case 'create':
          if (!flags.chain) {
            return consola.error('Missing chain type (-c or --chain)')
          }

          if (!isChainValid(flags.chain)) {
            return consola.error(
              `Invalid chain value, expected to be one of: ${CHAIN_OPTIONS.join(', ')}.`
            )
          }

          return nodes.create(user, accessToken, flags)

        case 'remove':
          return nodes.remove(user, accessToken, flags)

        case 'info':
          return nodes.info(user, accessToken, flags)

        default:
          return nodes.list(user, accessToken, flags)
      }
    })
  }
}

NodesCommand.description = 'Manage your BloqCloud nodes'
NodesCommand.flags = {
  chain: flags.string({ char: 'c', description: 'chain type' }),
  large: flags.boolean({ char: 'l', description: 'request large node', default: false, required: false }),
  jwt: flags.boolean({ char: 'j', description: 'user jwt tokens for auth instead of user/pass', default: false, required: false }),
  all: flags.boolean({ char: 'a', description: 'list all nodes', default: false, required: false }),
  nodeId: flags.string({ char: 'i', description: 'node id' })
}

NodesCommand.args = [
  {
    name: 'operation',
    required: true,
    description: 'Specify the type of nodes operation to run',
    default: 'list',
    options: ['create', 'list', 'remove', 'info']
  }
]

module.exports = NodesCommand
