'use strict'

const consola = require('consola')
const inquirer = require('inquirer')
const config = require('../config')
const {
  coppyToClipboard,
  fetcher,
  formatResponse,
  formatErrorResponse
} = require('../utils')

/**
 *  Creates a new pair of client keys
 *
 * @param  {string} user the user email or id
 * @param  {string} accessToken local access token
 * @param  {string} json return json output
 * @returns {undefined}
 */
async function createClientKey({ user, accessToken, json }) {
  const isJson = typeof json !== 'undefined'
  !isJson && consola.info(`Creating new pair of client keys for user ${user}.`)

  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.accounts.url`
  )}/users/me/client-keys`

  const { save } =
    !isJson &&
    (await inquirer.prompt([
      {
        name: 'save',
        message:
          'Do you want bcl to store your tokens locally for future usage?',
        type: 'confirm'
      }
    ]))

  return fetcher(url, 'POST', accessToken).then(res => {
    if (!res.ok) {
      formatErrorResponse(
        isJson,
        `Error creating new pair of client keys: ${res.status}`
      )
      return
    }

    if (isJson) {
      const data = {
        clientId: res.data.clientId,
        clientSecret: res.data.clientSecret
      }
      formatResponse(isJson, data)
      return
    }

    process.stdout.write('\n')
    consola.success(`Generated new client keys:
    * Client ID:\t${res.data.clientId}
    * Client Secret:\t${res.data.clientSecret}
    `)

    consola.warn(
      'You will NOT be able to see your client secret again. Remember to copy it and keep it safe.'
    )

    if (save) {
      config.set('clientId', res.data.clientId)
      config.set('clientSecret', res.data.clientSecret)
    }

    coppyToClipboard(res.data.clientSecret, 'Client secret')
  })
}

module.exports = createClientKey
