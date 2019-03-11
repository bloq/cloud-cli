'use strict'

const consola = require('consola')
const { Command, flags } = require('@oclif/command')
const { insight } = require('@bloq/cloud-sdk')
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

class InsightCommand extends Command {
  async run () {
    const clientId = config.get('clientId')
    const clientSecret = config.get('clientSecret')
    const { flags } = this.parse(InsightCommand)
    const { method, argument, coin, network } = flags

    if (!clientId || !clientSecret) {
      return consola.error('You must provide a valid client-keys pair in order to use insight.')
    }

    const api = insight.http({
      coin,
      network,
      auth: { clientId, clientSecret }
    })
    const spinner = ora().start()

    return api[methods[method]](argument)
      .then(function (data) {
        spinner.stop()
        consola.log(JSON.stringify(data, null, 2))
      })
      .catch(err => consola.error(err.message))
  }
}

InsightCommand.description = 'Manage your BloqCloud nodes'

InsightCommand.flags = {
  method: flags.string({
    char: 'm',
    required: true,
    description: 'Specify the method to get from insight API',
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
  }),

  argument: flags.string({
    char: 'a',
    description: 'Specify the argument for the method'
  }),

  chain: flags.string({
    char: 'c',
    default: 'btc',
    description: 'Specify the chain for the method'
  }),

  network: flags.string({
    char: 'n',
    default: 'mainnet',
    description: 'Specify the network for the method'
  })
}

module.exports = InsightCommand
