'use strict'

const consola = require('consola')
const { fetcher } = require('../utils')
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
      return null
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
    const body = JSON.stringify({
      grantType: 'clientCredentials',
      clientId,
      clientSecret
    })

    return fetcher(url, 'POST', accessToken, body).then(res => {
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          consola.error('Your client keys are invalid')
          return
        }
        consola.error(`Error generating client accessToken: ${res.status}`)
        return
      }
      const data = res.data

      if (!data.accessToken || !data.refreshToken) {
        consola.error('Error generating client accessToken.')
        return
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

      coppyToClipboard(data.accessToken, 'Client access token')
    })
  }
}

ClientTokenCommand.description = 'Generate new client token(s)'

module.exports = ClientTokenCommand
