/* eslint-disable consistent-return */
'use strict'

const consola = require('consola')
const { fetcher, formatErrorResponse, formatResponse } = require('../utils')
const inquirer = require('inquirer')
const { Command, flags } = require('@oclif/command')

const config = require('../config')
const { coppyToClipboard } = require('../utils')

class ClientTokenCommand extends Command {
  async run() {
    const user = config.get('user')
    const accessToken = config.get('accessToken')
    const { flags } = this.parse(ClientTokenCommand)
    const isJson = typeof flags.json !== 'undefined'

    const clientId = config.get('clientId')
    const clientSecret = config.get('clientSecret')

    if (!clientId || !clientSecret) {
      formatErrorResponse(
        isJson,
        'You must provide a valid client-keys pair in order to create a client token'
      )
      !isJson &&
        consola.info(
          'To create a new client-keys pair run: bcl client-keys create'
        )
      return
    }

    !isJson && consola.info(`Retrieving new client accessToken for ${user}`)

    const { save } = await inquirer.prompt([
      {
        name: 'save',
        message:
          'Do you want bcl to store your tokens locally for future usage?',
        type: 'confirm',
        when: () => !flags.json
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
          formatErrorResponse(isJson, 'Your client keys are invalid')
          return
        }
        formatErrorResponse(
          isJson,
          `Error generating client accessToken: ${res.status}`
        )
        return
      }
      const data = res.data

      if (!data.accessToken || !data.refreshToken) {
        formatErrorResponse(isJson, 'Error generating client accessToken.')
        return
      }

      if (isJson) {
        const response = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        }
        formatResponse(isJson, response)
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
ClientTokenCommand.flags = {
  json: flags.boolean({ char: 'j', description: 'JSON output' })
}

module.exports = ClientTokenCommand
