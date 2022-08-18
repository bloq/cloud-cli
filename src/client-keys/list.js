'use strict'

const consola = require('consola')
const config = require('../config')
const {
  fetcher,
  formatResponse,
  formatErrorResponse,
  formatOutput
} = require('../utils')
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
      formatResponse(isJson, `No client-keys were found for user ${userId}`)
      return
    }

    const data = res.data.map(({ id, createdAt }) => ({
      id,
      createdAt
    }))

    if (!isJson) {
      consola.success(`Retrieved ${res.data.length} client keys:`)
      process.stdout.write('\n')
    }

    formatOutput(isJson, data)
  })
}

module.exports = listClientKeys
