'use strict'

const Conf = require('conf')
const config = new Conf()

const consola = require('consola')
const request = require('request')
const { Command } = require('@oclif/command')
const inquirer = require('inquirer')

const { accountsUrl } = require('../config')

class ClientTokenCommand extends Command {
  async run () {
    const user = config.get('user')
    const accessToken = config.get('accessToken')
    const clientId = config.get('clientId')
    const clientSecret = config.get('clientSecret')

    if (!user || !accessToken) {
      return consola.error('User is not authenticated. Use login command to start a new session.')
    }

    consola.info(`Retrieving new client accessToken for ${user}`)
    consola.warn('This command will generate a new client accessToken and refreshToken.')

    const { confirmation, save } = await inquirer.prompt([
      { name: 'confirmation', message: 'Do you want to continue?', type: 'confirm' },
      { name: 'save', message: 'Do you want bcl to store your tokens locally for future usage?', type: 'confirm' } // eslint-disable-line
    ])

    if (!confirmation) {
      return consola.info('Generation of client keys aborted.')
    }

    request.post(`${accountsUrl}/auth/token`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      json: {
        grantType: 'clientCredentials',
        clientId,
        clientSecret
      }
    }, function (err, data) {
      if (err) {
        return consola.error(`Error generating client accessToken: ${err}.`)
      }

      if (!data.body.accessToken || !data.body.refreshToken) {
        return consola.error('Error generating client accessToken.')
      }

      consola.success(
        'Generated new tokens: \n\n' +
        `* clientAccresToken:  ${data.body.accessToken} \n\n` +
        `* refreshToken:  ${data.body.refreshToken}`
      )

      if (save) {
        config.set('clientAccessToken', data.body.accessToken)
        config.set('refreshToken', data.body.refreshToken)
      }

      consola.warn('Be sure to copy and save these keys since it will not be possible to obtain them again.') // eslint-disable-line
    })
  }
}

ClientTokenCommand.description = 'Generate new client token(s)'

module.exports = ClientTokenCommand
