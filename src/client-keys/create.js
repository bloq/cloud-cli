'use strict'

const consola = require('consola')
const inquirer = require('inquirer')
const config = require('../config')
const {
  coppyToClipboard,
  fetcher,
  formatOutput,
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

    const data = {
      clientId: res.data.clientId,
      clientSecret: res.data.clientSecret
    }

    if (!isJson) {
      consola.warn(
        'You will NOT be able to see your client secret again. Remember to copy it and keep it safe.'
      )
      coppyToClipboard(res.data.clientSecret, 'Client secret')
      consola.success(`Generated new client keys:`)
    }

    formatOutput(isJson, data)

    if (save) {
      config.set('clientId', res.data.clientId)
      config.set('clientSecret', res.data.clientSecret)
    }
  })
}

module.exports = createClientKey
