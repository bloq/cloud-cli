'use strict'

const Conf = require('conf')
const consola = require('consola')
const { Command } = require('@oclif/command')
const { insight } = require('@bloq/cloud-sdk')

const config = new Conf()
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

    const { args, flags } = this.parse(InsightCommand)

    const coin = 'btc'
    const network = 'mainnet'

    if (!clientId || !clientSecret) {
      return consola.error('You must provide a valid client-keys pair in order to use insight.')
    }

    const api = insight.http({
      coin,
      network,
      auth: { clientId, clientSecret }
    })

    const method = methods[args.method]
    return api[method](args.id)
      .then(block => consola.log(JSON.stringify(block, null, 2)))
      .catch(err => consola.error(err.message))
  }
}

InsightCommand.description = 'Manage your BloqCloud nodes'

InsightCommand.args = [
  {
    name: 'method',
    required: true,
    description: 'Specify the resource to get from insight API',
    default: 'block',
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
    name: 'id'
  }
]

module.exports = InsightCommand