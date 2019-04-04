'use strict'

const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')
const clipboardy = require('clipboardy')
const { Command } = require('@oclif/command')

const config = require('../config')

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

    const { save } = await inquirer.prompt([
      { name: 'save', message: 'Do you want bcl to store your tokens locally for future usage?', type: 'confirm' } // eslint-disable-line
    ])

    request.post(`${config.get('services.accounts.url')}/auth/token`, {
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

      if (data.statusCode === 401 || data.statusCode === 403) {
        return consola.error('Your session has expired')
      }

      if (!data.body.accessToken || !data.body.refreshToken) {
        return consola.error('Error generating client accessToken.')
      }

      consola.success(
        'Generated new tokens: \n\n' +
        `\t* clientAccessToken:  ${data.body.accessToken} \n` +
        `\t* refreshToken:  ${data.body.refreshToken}`
      )

      if (save) {
        config.set('clientAccessToken', data.body.accessToken)
        config.set('refreshToken', data.body.refreshToken)
      }

      clipboardy.write(data.body.accessToken)
      consola.info('Client accessToken was copied to clipboard.')
    })
  }
}

ClientTokenCommand.description = 'Generate new client token(s)'

module.exports = ClientTokenCommand
