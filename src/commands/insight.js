'use strict'

const Conf = require('conf')
const config = new Conf()

const consola = require('consola')
const { Command } = require('@oclif/command')
const { insight } = require('@bloq/cloud-sdk')

class InsightCommand extends Command {
  async run () {
    const clientId = config.get('clientId')
    const clientSecret = config.get('clientSecret')

    const coin = 'btc'
    const network = 'mainnet'

    if (!clientId || !clientSecret) {
      return consola.error('You must provide a valid client-keys pair in order to use insight.')
    }

    const api = insight.http({
      coin: 'btc',
      network: 'mainnet',
      auth: { clientId, clientSecret }
    })

    return api.block('00000000dfd5d65c9d8561b4b8f60a63018fe3933ecb131fb37f905f87da951a')
      .then(function (block) { console.success(block) })
  }
}

InsightCommand.description = 'Manage your BloqCloud nodes'

module.exports = InsightCommand
