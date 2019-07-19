'use strict'

const url = require('url')
const consola = require('consola')
const { Command, flags } = require('@oclif/command')
const { connect } = require('@bloq/cloud-sdk')
const config = require('../config')
const ora = require('ora')

const methods = {
  'block': 'block',
  'blocks': 'blocks',
  'block-hash': 'blockHash',
  'raw-block': 'rawBlock',
  'transaction': 'transaction',
  'tx': 'transaction',
  'rawTransaction': 'rawTransaction',
  'raw-tx': 'rawTransaction'
}

class ConnectCommand extends Command {
  async run () {
    const clientId = config.get('clientId')
    const clientSecret = config.get('clientSecret')
    const env = config.get('env')
    const { flags, args } = this.parse(ConnectCommand)
    const { argument, chain, network } = flags
    const { method } = args

    if (!clientId || !clientSecret) {
      return consola.error('You must provide a valid client-keys pair in order to use connect.')
    }

    const services = {
      connect: config.get(`services.${env}.connect.${chain}`),
      accounts: config.get(`services.${env}.accounts`)
    }

    const api = connect.http({
      coin: chain,
      network,
      auth: {
        clientId,
        clientSecret,
        url: services.accounts.url
      },
      url: url.resolve(services.connect.url, '/api/v1')
    })

    const spinner = ora().start()

    return api[methods[method]](argument)
      .then(function (data) {
        spinner.stop()
        consola.log(JSON.stringify(data, null, 2))
      })
      .catch(function (err) {
        spinner.stop()
        consola.error(err.message)
      })
  }
}

ConnectCommand.description = 'Access Connect services through bcl'

ConnectCommand.args = [
  {
    name: 'method',
    required: true,
    description: 'Specify the method to get from connect API',
    options: [
      'block',
      'blocks',
      'block-hash',
      'raw-block',
      'transaction',
      'tx',
      'raw-transaction',
      'raw-tx'
    ]
  }
]

ConnectCommand.flags = {
  argument: flags.string({
    char: 'a',
    description: 'Specify the argument for the method'
  }),

  chain: flags.string({
    char: 'c',
    default: 'btc',
    description: 'Specify the chain for the method',
    options: ['btc', 'bch']
  }),

  network: flags.string({
    char: 'n',
    default: 'mainnet',
    description: 'Specify the network for the method',
    options: ['mainnet']
  })
}

module.exports = ConnectCommand
