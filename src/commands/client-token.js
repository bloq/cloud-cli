'use strict'

const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')
const { Command } = require('@oclif/command')

const config = require('../config')
const { coppyToClipboard } = require('../utils')

class ClientTokenCommand extends Command {
  async run () {
    const user = config.get('user')
    const accessToken = config.get('accessToken')
    const clientId = config.get('clientId')
    const clientSecret = config.get('clientSecret')

    if (!clientId || !clientSecret) {
      consola.error('You must provide a valid client-keys pair in order to create a client token')
      consola.info('To create a new client-keys pair run: bcl client-keys create')
      return
    }

    consola.info(`Retrieving new client accessToken for ${user}`)

    const { save } = await inquirer.prompt([
      { name: 'save', message: 'Do you want bcl to store your tokens locally for future usage?', type: 'confirm' } // eslint-disable-line
    ])

    const env = config.get('env') || 'prod'
    const url = `${config.get(`services.${env}.accounts.url`)}/auth/token`

    request.post(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
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
        return consola.error('Your client keys are invalid')
      }

      console.log(data.statusCode, data.body)

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

      coppyToClipboard(data.body.accessToken, 'Client access token')
    })
  }
}

ClientTokenCommand.description = 'Generate new client token(s)'

module.exports = ClientTokenCommand
