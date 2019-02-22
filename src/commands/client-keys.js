'use strict'

const Conf = require('conf')
const config = new Conf()

const consola = require('consola')
const request = require('request')
const { Command } = require('@oclif/command')
const inquirer = require('inquirer')

const { accountsUrl } = require('../config')

class ClientKeysCommand extends Command {
  async run () {
    const user = config.get('user')
    const accessToken = config.get('accessToken')

    if (!user || !accessToken) {
      return consola.error('User is not authenticated, use login command to start a new session.')
    }

    consola.info(`Getting client keys for user ${user}`)
    consola.warn('This command will generate a new pair of client keys, if you continue your current keys will be invalidated.') // eslint-disable-line

    const { confirmation, save } = await inquirer.prompt([
      { name: 'confirmation', message: 'Do you want to continue?', type: 'confirm' },
      { name: 'save', message: 'Do you want that blc stores your keys locally for future usage?', type: 'confirm' } // eslint-disable-line
    ])

    if (!confirmation) {
      return consola.info('Generation of client keys aborted.')
    }

    const Authorization = `Bearer ${accessToken}`

    const url = `${accountsUrl}/auth/client-keys`
    request.get(url, {
      headers: { Authorization }
    }, function (err, data) {
      if (err) {
        return consola.error(`Error trying to generate client keys: ${err}.`)
      }

      const body = JSON.parse(data.body)
      if (!body.clientId || !body.clientSecret) {
        return consola.error('Error trying to generate client key.')
      }

      consola.success(`Generated new client keys:
      * clientId:\t${body.clientId}
      * clientSecret:\t${body.clientSecret}
      `)

      if (save) {
        config.set('clientId', body.clientId)
        config.set('clientSecret', body.clientSecret)
      }

      consola.warn('Be sure to copy and save these keys since it will not be possible to obtain them again.') // eslint-disable-line
    })
  }
}

ClientKeysCommand.description = 'generates a new pair of keys (id + secret).'

module.exports = ClientKeysCommand
