'use strict'

const consola = require('consola')
const fetch = require('node-fetch').default
const inquirer = require('inquirer')
const { Command } = require('@oclif/command')

const config = require('../config')
const { coppyToClipboard } = require('../utils')

class ClientTokenCommand extends Command {
  async run() {
    const user = config.get('user')
    const accessToken = config.get('accessToken')
    const clientId = config.get('clientId')
    const clientSecret = config.get('clientSecret')

    if (!clientId || !clientSecret) {
      consola.error(
        'You must provide a valid client-keys pair in order to create a client token'
      )
      consola.info(
        'To create a new client-keys pair run: bcl client-keys create'
      )
      return
    }

    consola.info(`Retrieving new client accessToken for ${user}`)

    const { save } = await inquirer.prompt([
      {
        name: 'save',
        message:
          'Do you want bcl to store your tokens locally for future usage?',
        type: 'confirm'
      }
    ])

    const env = config.get('env') || 'prod'
    const url = `${config.get(`services.${env}.accounts.url`)}/auth/token`

    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        grantType: 'clientCredentials',
        clientId,
        clientSecret
      })
    }

    fetch(url, params)
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 401 || data.statusCode === 403) {
          return consola.error('Your client keys are invalid')
        }

        if (!data.accessToken || !data.refreshToken) {
          return consola.error('Error generating client accessToken.')
        }
        consola.success(
          'Generated new tokens: \n\n' +
            `\t* clientAccessToken:  ${data.accessToken} \n` +
            `\t* refreshToken:  ${data.refreshToken}`
        )

        if (save) {
          config.set('clientAccessToken', data.accessToken)
          config.set('refreshToken', data.refreshToken)
        }

        return coppyToClipboard(data.accessToken, 'Client access token')
      })
      .catch(err => {
        return consola.error(
          `Error generating client accessToken: ${
            err.detail || err.title || err.statusText
          }`
        )
      })
  }
}

ClientTokenCommand.description = 'Generate new client token(s)'

module.exports = ClientTokenCommand
