'use strict'

const consola = require('consola')
const config = require('../config')
const { fetcher, formatResponse, formatErrorResponse } = require('../utils')
require('console.table')

/**
 *  Creates a new pair of client keys
 *
 * @param  {string} user the user email or id
 * @param  {string} accessToken local access token
 * @param  {string} json json output flag
 * @returns {undefined}
 */
async function listClientKeys({ user, accessToken, json }) {
  const isJson = typeof json !== 'undefined'
  !isJson && consola.info(`Getting client keys for user ${user}.`)

  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.accounts.url`
  )}/users/me/client-keys`

  return fetcher(url, 'GET', accessToken).then(res => {
    if (!res.ok) {
      formatErrorResponse(isJson, `Error listing client keys: ${res.status}`)
      return
    }
    if (!res.data.length) {
      const userId = `${config.get('user')}`
      formatErrorResponse(
        isJson,
        `No client-keys were found for user ${userId}`
      )
      return
    }

    if (isJson) {
      formatResponse(isJson, res.data)
      return
    }

    consola.success(`Retrieved ${res.data.length} client keys`)
    process.stdout.write('\n')
    // eslint-disable-next-line no-console
    console.table(res.data)
  })
}

module.exports = listClientKeys
