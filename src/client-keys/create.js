'use strict'

const consola = require('consola')
const fetch = require('node-fetch').default
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

  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.accounts.url`
  )}/users/me/client-keys`

  const params = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  }

  fetch(url, params)
    .then(res => {
      if (res.status === 401 || res.status === 403) {
        return consola.error('Your session has expired')
      }

      if (res.status !== 200) {
        return consola.error(
          `Error creating new pair of client keys: ${
            res.status || res.statusText
          }.`
        )
      }

      return res.json()
    })
    .then(data => {
      process.stdout.write('\n')
      consola.success(`Generated new client keys:
    * Client ID:\t${data.clientId}
    * Client Secret:\t${data.clientSecret}
    `)

      consola.warn(
        'You will NOT be able to see your client secret again. Remember to copy it and keep it safe.'
      )

      if (save) {
        config.set('clientId', data.clientId)
        config.set('clientSecret', data.clientSecret)
      }

      return coppyToClipboard(data.clientSecret, 'Client secret')
    })
    .catch(err =>
      consola.error(`Error creating new pair of client keys: ${err}.`)
    )
}

module.exports = createClientKey
