'use strict'

const consola = require('consola')
const config = require('../config')
const { fetcher } = require('../utils')
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

  return fetcher(url, 'GET', accessToken).then(res => {
    if (!res.ok) {
      consola.error(`Error listing client keys: ${res.status}`)
      return
    }
    if (!res.data.length) {
      const userId = `${config.get('user')}`
      consola.success(`No client-keys were found for user ${userId}`)
      return
    }
    consola.success(`Retrieved ${res.data.length} client keys`)
    process.stdout.write('\n')
    // eslint-disable-next-line no-console
    console.table(res.data)
  })
}

module.exports = listClientKeys
