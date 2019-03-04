'use strict'

const Conf = require('conf')
const config = new Conf()

const consola = require('consola')
const request = require('request')
const { Command, flags } = require('@oclif/command')

const nodes = require('../nodes')
const { accountsUrl } = require('../config')

function getClientToken (cb) {
  const clientId = config.get('clientId')
  const clientSecret = config.get('clientSecret')

  if (!clientId || !clientSecret) {
    return consola.error('You must provide a valid client-keys pair in order to manage nodes.')
  }

  const url = `${accountsUrl}/auth/token`
  const json = { grantType: 'clientCredentials', clientId, clientSecret }
  request.post(url, { json }, function (err, data) {
    if (err) {
      return cb(new Error(`Error retrieving client token: ${err}`))
    }

    if (data.statusCode !== 200) {
      return cb(new Error(`Error generating client token: ${data.body.code}`))
    }

    return cb(null, data.body)
  })
}

class NodesCommand extends Command {
  async run () {
    const _this = this
    getClientToken(function (err, data) {
      if (err) {
        return consola.error(err.message)
      }

      const { accessToken } = data
      const user = config.get('clientId')
      const { args, flags } = _this.parse(NodesCommand)

      switch (args.operation) {
        case 'create':
          if (!flags.chain) {
            return consola.error('Missing chain type (-c or --chain)')
          }
          return nodes.create(user, accessToken, flags.chain)
        case 'remove':
          return nodes.remove(user, accessToken)
        case 'get':
          return nodes.get(user, accessToken)
        default:
          return nodes.list(user, accessToken, flags)
      }
    })
  }
}

NodesCommand.description = 'Manage your BloqCloud nodes'
NodesCommand.flags = {
  chain: flags.string({ char: 'c', description: 'chain type', options: ['btc', 'bch'] }),
  all: flags.boolean({ char: 'a', description: 'list all nodes', default: false, required: false })
}

NodesCommand.args = [
  {
    name: 'operation',
    required: true,
    description: 'Specify the type of nodes operation to run',
    default: 'list',
    options: ['create', 'list', 'remove', 'get']
  }
]

module.exports = NodesCommand
