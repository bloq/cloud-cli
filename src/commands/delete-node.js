'use strict'

const Conf = require('conf')
const config = new Conf()

const consola = require('consola')
const request = require('request')
const { Command, flags } = require('@oclif/command')

const { nodesUrl } = require('../config')

class DeleteNodeCommand extends Command {
  async run () {
    const { flags } = this.parse(DeleteNodeCommand)
    const id = flags.id

    if (!id) {
      return consola.error('Missing id to delete (-i or --id)')
    }

    const user = config.get('user')
    const clientAccessToken = config.get('clientAccessToken')

    if (!user || !clientAccessToken) {
      return consola.error('User is not authenticated, use login command to start a new session.')
    }

    consola.info('Delete blockchain node')
    consola.warn('This command will delete a blockchain node.')

    const Authorization = `Bearer ${clientAccessToken}`

    const url = `${nodesUrl}/nodes/${id}`
    request.delete(url, {
      headers: { Authorization }
    }, function (err, data) {
      if (err) {
        return consola.error(`Error trying to delete node: ${err}.`)
      }

      consola.info(data.body)
    })
  }
}

DeleteNodeCommand.description = 'delete blockchain node'

DeleteNodeCommand.flags = {
  id: flags.string({ char: 'i', description: 'node id' })
}

module.exports = DeleteNodeCommand
