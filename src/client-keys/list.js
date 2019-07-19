'use strict'

const consola = require('consola')
const request = require('request')
const config = require('../config')
require('console.table')

/**
 *  Creates a new pair of client keys
 *
 * @param  {string} user the user email or id
 * @param  {string} accessToken local access token
 * @returns {undefined}
 */
async function listClientKeys (user, accessToken) {
  consola.info(`Getting client keys for user ${user}.`)

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.accounts.url`)}/users/me/client-keys`

  request.get(url, { headers: { Authorization } }, function (err, data) {
    if (err) {
      return consola.error(`Error listing client keys: ${err}.`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    const body = JSON.parse(data.body)
    if (data.statusCode !== 200) {
      return consola.error(`Error listing client keys: ${body.code || body.message} | ${data.statusCode}.`)
    }

    if (!body.length) {
      const user = `${config.get('user')}`
      return consola.success(`No client-keys were found for user ${user}`)
    }

    consola.success(`Retrieved ${body.length} client keys:`)
    process.stdout.write('\n')
    console.table(body)
  })
}

module.exports = listClientKeys
