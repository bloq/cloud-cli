'use strict'

const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')
const config = require('../config')
const { coppyToClipboard } = require('../utils')

/**
 *  Creates a new pair of client keys
 *
 * @param  {string} user the user email or id
 * @param  {string} accessToken local access token
 * @returns {undefined}
 */
async function createClientKey(user, accessToken) {
  consola.info(`Creating new pair of client keys for user ${user}.`)

  const { save } = await inquirer.prompt([
    {
      name: 'save',
      message: 'Do you want bcl to store your tokens locally for future usage?',
      type: 'confirm'
    }
  ])

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.accounts.url`
  )}/users/me/client-keys`

  request.post(url, { headers: { Authorization } }, function (err, data) {
    if (err) {
      return consola.error(`Error creating new pair of client keys: ${err}.`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    const body = JSON.parse(data.body)
    if (data.statusCode !== 200) {
      return consola.error(
        `Error creating new pair of client keys: ${body.code || body.message}.`
      )
    }

    process.stdout.write('\n')
    consola.success(`Generated new client keys:
    * Client ID:\t${body.clientId}
    * Client Secret:\t${body.clientSecret}
    `)

    coppyToClipboard(body.clientSecret, 'Client secret')
    consola.warn(
      'You will NOT be able to see your client secret again. Remember to copy it and keep it safe.'
    )

    if (save) {
      config.set('clientId', body.clientId)
      config.set('clientSecret', body.clientSecret)
    }
  })
}

module.exports = createClientKey
