'use strict'

const consola = require('consola')
const { Command } = require('@oclif/command')
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

    const { args } = this.parse(InsightCommand)

    const coin = 'btc'
    const network = 'mainnet'

    if (!clientId || !clientSecret) {
      return consola.error('You must provide a valid client-keys pair in order to use insight.')
    }

    const spinner = ora().start()
    const api = insight.http({
      coin,
      network,
      auth: { clientId, clientSecret }
    })

    const method = methods[args.method]
    return api[method](args.id)
      .then(function (data) {
        spinner.stop()
        consola.log(JSON.stringify(data, null, 2))
      })
      .catch(err => consola.error(err.message))
  }
}

InsightCommand.description = 'Manage your BloqCloud nodes'

InsightCommand.args = [
  {
    name: 'method',
    required: true,
    description: 'Specify the resource to get from insight API',
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
  },
  {
    name: 'arg'
  }
]

module.exports = InsightCommand
