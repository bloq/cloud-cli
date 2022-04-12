'use strict'

const consola = require('consola')
const fetch = require('node-fetch').default
const config = require('../config')
require('console.table')

/**
 *  Creates a new pair of client keys
 *
 * @param  {string} user the user email or id
 * @param  {string} accessToken local access token
 * @returns {undefined}
 */
async function listClientKeys(user, accessToken) {
  consola.info(`Getting client keys for user ${user}.`)

  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.accounts.url`
  )}/users/me/client-keys`

  const params = {
    method: 'GET',
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
          `Error listing client keys: ${res.status || res.statusText}.`
        )
      }

      return res.json()
    })
    .then(data => {
      if (!data.length) {
        const userId = `${config.get('user')}`
        return consola.success(`No client-keys were found for user ${userId}`)
      }

      consola.success(`Retrieved ${data.length} client keys:`)
      process.stdout.write('\n')
      // eslint-disable-next-line no-console
      return console.table(data)
    })
    .catch(err => consola.error(`Error listing client keys: ${err}.`))
}

module.exports = listClientKeys
