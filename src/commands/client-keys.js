'use strict'

const Conf = require('conf')
const config = new Conf()

const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')
const clipboardy = require('clipboardy')
const { Command } = require('@oclif/command')

const { accountsUrl } = require('../config')

class ClientKeysCommand extends Command {
  async run () {
    const user = config.get('user')
    const accessToken = config.get('accessToken')

    if (!user || !accessToken) {
      return consola.error('User is not authenticated, use login command to start a new session.')
    }

    consola.info(`Creating new pair of client keys for user ${user}`)

    const { save } = await inquirer.prompt([
      {
        name: 'save',
        message: 'Do you want that blc stores your keys locally for future usage?',
        type: 'confirm'
      }
    ])

    const Authorization = `Bearer ${accessToken}`
    const url = `${accountsUrl}/auth/client-keys`

    request.post(url, { headers: { Authorization } }, function (err, data) {
      if (err) {
        return consola.error(`Error trying to create new pair of client keys: ${err}.`)
      }

      const body = JSON.parse(data.body)

      if (data.statusCode !== 200) {
        return consola.error(`Error trying to create new pair of client keys: ${data.body.code}`)
      }

      consola.success(`Generated new client keys:
      * Client ID:\t${body.clientId}
      * Client Secret:\t${body.clientSecret}
      `)
      consola.warn('You will be not able to see your client secret again, remember to copy it and keep it safe')

      clipboardy.write(body.clientSecret)
      consola.info('Client secret was copied to clipboard')

      if (save) {
        config.set('clientId', body.clientId)
        config.set('clientSecret', body.clientSecret)
      }
    })
  }
}

ClientKeysCommand.description = 'generates a new pair of keys (id + secret).'

module.exports = ClientKeysCommand
